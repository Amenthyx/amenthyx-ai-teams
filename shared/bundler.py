#!/usr/bin/env python3
"""
Amenthyx Content Bundler — Encrypts all .md and .py files into a single
binary vault that is unreadable without the runtime key.

Build time:  python shared/bundler.py [--output shared/_vault.py]
Runtime:     from _vault import vault_read  (returns decrypted content)

Encryption: PBKDF2-derived key → AES-CTR via XOR stream cipher + zlib compression.
The key components are split across this file and the loader to resist static analysis.

No external dependencies — stdlib only.
"""

import base64
import hashlib
import json
import os
import struct
import sys
import zlib
from typing import Dict, List, Tuple

# ---------------------------------------------------------------------------
# Encryption primitives (stdlib only — no cryptography package needed)
# ---------------------------------------------------------------------------

# Key material is split across multiple locations to resist grep-based extraction
_K1 = b"aMeNtHyX"       # 8 bytes
_K2 = b"v4-t3amS"       # 8 bytes
_K3 = b"2026-pR0"       # 8 bytes
_K4 = b"t0c0L-AI"       # 8 bytes
_SALT = _K1 + _K2 + _K3 + _K4  # 32-byte salt


def _derive_key(passphrase: bytes, salt: bytes, length: int = 64) -> bytes:
    """Derive encryption key using PBKDF2-HMAC-SHA256."""
    return hashlib.pbkdf2_hmac("sha256", passphrase, salt, iterations=100_000, dklen=length)


def _make_passphrase() -> bytes:
    """Build the passphrase from scattered components."""
    # These are intentionally split and obfuscated to resist static analysis
    parts = [
        b"\x41\x6d\x65\x6e\x74\x68\x79\x78",  # "Amenthyx"
        b"\x2d\x41\x49\x2d\x54\x65\x61\x6d",  # "-AI-Team"
        b"\x73\x2d\x56\x61\x75\x6c\x74\x2d",  # "s-Vault-"
        b"\x4b\x33\x79\x2d\x32\x30\x32\x36",  # "K3y-2026"
    ]
    return b"".join(parts)


def _xor_stream(data: bytes, key: bytes) -> bytes:
    """XOR data with a repeating key stream derived from the key via SHA-512 chaining."""
    result = bytearray(len(data))
    key_stream = b""
    block_hash = key
    block_size = 64  # SHA-512 output size

    for i in range(0, len(data), block_size):
        block_hash = hashlib.sha512(block_hash + struct.pack(">I", i)).digest()
        key_stream = block_hash
        chunk_len = min(block_size, len(data) - i)
        for j in range(chunk_len):
            result[i + j] = data[i + j] ^ key_stream[j]

    return bytes(result)


def encrypt_content(plaintext: str) -> str:
    """Compress + encrypt content → base64 string."""
    # Compress first (makes content unrecognizable + smaller)
    compressed = zlib.compress(plaintext.encode("utf-8"), level=9)

    # Add a length prefix for validation on decrypt
    length_prefix = struct.pack(">I", len(compressed))
    payload = length_prefix + compressed

    # Derive encryption key
    passphrase = _make_passphrase()
    key = _derive_key(passphrase, _SALT, length=64)

    # Encrypt with XOR stream cipher
    encrypted = _xor_stream(payload, key)

    # Encode as base64 for safe embedding in Python source
    return base64.b85encode(encrypted).decode("ascii")


def decrypt_content(encoded: str) -> str:
    """Decode base64 → decrypt → decompress → plaintext."""
    encrypted = base64.b85decode(encoded.encode("ascii"))

    # Derive same key
    passphrase = _make_passphrase()
    key = _derive_key(passphrase, _SALT, length=64)

    # Decrypt
    payload = _xor_stream(encrypted, key)

    # Extract length prefix and verify
    expected_len = struct.unpack(">I", payload[:4])[0]
    compressed = payload[4:]
    if len(compressed) != expected_len:
        raise ValueError("Decryption failed — key mismatch or corrupted data")

    # Decompress
    return zlib.decompress(compressed).decode("utf-8")


# ---------------------------------------------------------------------------
# Bundle builder
# ---------------------------------------------------------------------------

def collect_files(base_dir: str) -> Dict[str, str]:
    """Collect all .md and .py files to bundle."""
    files: Dict[str, str] = {}

    # Team TEAM.md files
    for entry in sorted(os.listdir(base_dir)):
        team_dir = os.path.join(base_dir, entry)
        team_md = os.path.join(team_dir, "TEAM.md")
        if os.path.isdir(team_dir) and entry[:2].isdigit() and os.path.isfile(team_md):
            key = f"{entry}/TEAM.md"
            with open(team_md, "r", encoding="utf-8", errors="replace") as f:
                files[key] = f.read()

    # Shared .md protocols
    shared_dir = os.path.join(base_dir, "shared")
    if os.path.isdir(shared_dir):
        for fname in sorted(os.listdir(shared_dir)):
            fpath = os.path.join(shared_dir, fname)
            if fname.endswith(".md") and os.path.isfile(fpath):
                key = f"shared/{fname}"
                with open(fpath, "r", encoding="utf-8", errors="replace") as f:
                    files[key] = f.read()

    # Shared .py scripts (except bundler itself and _vault)
    if os.path.isdir(shared_dir):
        skip = {"bundler.py", "_vault.py", "__init__.py"}
        for fname in sorted(os.listdir(shared_dir)):
            fpath = os.path.join(shared_dir, fname)
            if fname.endswith(".py") and fname not in skip and os.path.isfile(fpath):
                key = f"shared/{fname}"
                with open(fpath, "r", encoding="utf-8", errors="replace") as f:
                    files[key] = f.read()

    # Templates
    templates_dir = os.path.join(shared_dir, "templates")
    if os.path.isdir(templates_dir):
        for fname in sorted(os.listdir(templates_dir)):
            fpath = os.path.join(templates_dir, fname)
            if fname.endswith(".md") and os.path.isfile(fpath):
                key = f"shared/templates/{fname}"
                with open(fpath, "r", encoding="utf-8", errors="replace") as f:
                    files[key] = f.read()

    # Root-level files
    for fname in ["README.md", "STRATEGY_TEMPLATE.md", "STRATEGY_DASHBOARD.md",
                   "CHANGELOG.md", "CONTRIBUTING.md", "LICENSE"]:
        fpath = os.path.join(base_dir, fname)
        if os.path.isfile(fpath):
            with open(fpath, "r", encoding="utf-8", errors="replace") as f:
                files[fname] = f.read()

    # .ai context
    ai_ctx = os.path.join(base_dir, ".ai", "context_base.md")
    if os.path.isfile(ai_ctx):
        with open(ai_ctx, "r", encoding="utf-8", errors="replace") as f:
            files[".ai/context_base.md"] = f.read()

    return files


def build_vault(base_dir: str, output_path: str) -> int:
    """Build encrypted vault file."""
    print(f"\n  \033[1mAmenthyx Content Bundler\033[0m")
    print(f"  \033[2m{'=' * 40}\033[0m\n")

    # Collect all files
    files = collect_files(base_dir)
    print(f"  Collected {len(files)} files")

    # Build manifest (key → encrypted content)
    vault_entries: Dict[str, str] = {}
    total_raw = 0
    total_enc = 0

    for key in sorted(files.keys()):
        content = files[key]
        total_raw += len(content)
        encrypted = encrypt_content(content)
        total_enc += len(encrypted)
        vault_entries[key] = encrypted

        # Verify roundtrip
        decrypted = decrypt_content(encrypted)
        assert decrypted == content, f"Roundtrip failed for {key}"

    print(f"  Raw size:       {total_raw / 1024:.0f} KB")
    print(f"  Encrypted size: {total_enc / 1024:.0f} KB")
    print(f"  Compression:    {(1 - total_enc / total_raw) * 100:.0f}% reduction")

    # Verify a sample roundtrip
    sample_key = list(vault_entries.keys())[0]
    assert decrypt_content(vault_entries[sample_key]) == files[sample_key]
    print(f"  Roundtrip:      verified")

    # Generate the vault Python module
    lines: List[str] = []
    lines.append('"""')
    lines.append("Amenthyx AI Teams — Encrypted Content Vault")
    lines.append("Auto-generated by bundler.py. Do NOT edit manually.")
    lines.append('"""')
    lines.append("")
    lines.append("import base64, hashlib, struct, zlib")
    lines.append("from typing import Dict, List, Optional")
    lines.append("")
    lines.append("")
    lines.append("# Encryption primitives (must match bundler.py)")
    lines.append('_K1 = b"aMeNtHyX"')
    lines.append('_K2 = b"v4-t3amS"')
    lines.append('_K3 = b"2026-pR0"')
    lines.append('_K4 = b"t0c0L-AI"')
    lines.append("_SALT = _K1 + _K2 + _K3 + _K4")
    lines.append("")
    lines.append("")
    lines.append("def _derive_key(p: bytes, s: bytes, n: int = 64) -> bytes:")
    lines.append('    return hashlib.pbkdf2_hmac("sha256", p, s, iterations=100_000, dklen=n)')
    lines.append("")
    lines.append("")
    lines.append("def _pp() -> bytes:")
    lines.append("    return (b'\\x41\\x6d\\x65\\x6e\\x74\\x68\\x79\\x78'")
    lines.append("            b'\\x2d\\x41\\x49\\x2d\\x54\\x65\\x61\\x6d'")
    lines.append("            b'\\x73\\x2d\\x56\\x61\\x75\\x6c\\x74\\x2d'")
    lines.append("            b'\\x4b\\x33\\x79\\x2d\\x32\\x30\\x32\\x36')")
    lines.append("")
    lines.append("")
    lines.append("def _xor(data: bytes, key: bytes) -> bytes:")
    lines.append("    r = bytearray(len(data))")
    lines.append("    bh = key")
    lines.append("    for i in range(0, len(data), 64):")
    lines.append('        bh = hashlib.sha512(bh + struct.pack(">I", i)).digest()')
    lines.append("        cl = min(64, len(data) - i)")
    lines.append("        for j in range(cl):")
    lines.append("            r[i + j] = data[i + j] ^ bh[j]")
    lines.append("    return bytes(r)")
    lines.append("")
    lines.append("")
    lines.append("def _dec(encoded: str) -> str:")
    lines.append('    e = base64.b85decode(encoded.encode("ascii"))')
    lines.append("    k = _derive_key(_pp(), _SALT, 64)")
    lines.append("    p = _xor(e, k)")
    lines.append('    el = struct.unpack(">I", p[:4])[0]')
    lines.append("    c = p[4:]")
    lines.append("    if len(c) != el:")
    lines.append('        raise ValueError("vault integrity check failed")')
    lines.append('    return zlib.decompress(c).decode("utf-8")')
    lines.append("")
    lines.append("")
    lines.append("# --- Encrypted vault data ---")
    lines.append("")
    lines.append("_VAULT: Dict[str, str] = {")

    # Write each entry, splitting long strings across lines
    for key in sorted(vault_entries.keys()):
        enc = vault_entries[key]
        lines.append(f'    "{key}":')
        # Split into 120-char chunks for readability
        chunks = [enc[i:i+120] for i in range(0, len(enc), 120)]
        if len(chunks) == 1:
            lines.append(f'        "{chunks[0]}",')
        else:
            lines.append(f'        "{chunks[0]}"')
            for chunk in chunks[1:-1]:
                lines.append(f'        "{chunk}"')
            lines.append(f'        "{chunks[-1]}",')

    lines.append("}")
    lines.append("")
    lines.append("")
    lines.append("# --- Public API ---")
    lines.append("")
    lines.append("def vault_list() -> List[str]:")
    lines.append('    """List all keys in the vault."""')
    lines.append("    return sorted(_VAULT.keys())")
    lines.append("")
    lines.append("")
    lines.append("def vault_read(key: str) -> Optional[str]:")
    lines.append('    """Read and decrypt a file from the vault. Returns None if not found."""')
    lines.append("    enc = _VAULT.get(key)")
    lines.append("    if enc is None:")
    lines.append("        return None")
    lines.append("    return _dec(enc)")
    lines.append("")
    lines.append("")
    lines.append("def vault_exists(key: str) -> bool:")
    lines.append('    """Check if a key exists in the vault."""')
    lines.append("    return key in _VAULT")
    lines.append("")
    lines.append("")
    lines.append("def vault_keys_matching(pattern: str) -> List[str]:")
    lines.append('    """Return keys matching a simple pattern (supports * wildcard)."""')
    lines.append("    import fnmatch")
    lines.append("    return [k for k in _VAULT if fnmatch.fnmatch(k, pattern)]")
    lines.append("")

    content = "\n".join(lines) + "\n"

    # Write the vault module
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    vault_size = len(content)
    print(f"\n  \033[92mVault created:\033[0m {output_path}")
    print(f"  Vault size:     {vault_size / 1024:.0f} KB")
    print(f"  Files bundled:  {len(vault_entries)}")
    print(f"\n  \033[92m\033[1mAll content encrypted and embedded.\033[0m")
    print(f"  \033[2mNo .md or .py source files needed at runtime.\033[0m\n")

    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    import argparse
    parser = argparse.ArgumentParser(description="Amenthyx Content Bundler — encrypt all project files into a vault")
    parser.add_argument("--output", "-o", default=None,
                        help="Output path for vault file (default: shared/_vault.py)")
    parser.add_argument("--base", "-b", default=None,
                        help="Project base directory (default: auto-detect)")
    parser.add_argument("--verify", action="store_true",
                        help="Verify an existing vault by decrypting all entries")
    args = parser.parse_args()

    base_dir = args.base or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output = args.output or os.path.join(base_dir, "shared", "_vault.py")

    if args.verify:
        sys.path.insert(0, os.path.dirname(output))
        try:
            from _vault import vault_list, vault_read
            keys = vault_list()
            print(f"\n  Verifying {len(keys)} vault entries...")
            ok = 0
            for key in keys:
                content = vault_read(key)
                if content is not None:
                    ok += 1
                else:
                    print(f"  \033[91mFAIL\033[0m {key}")
            print(f"  \033[92m{ok}/{len(keys)} entries verified\033[0m\n")
            return 0 if ok == len(keys) else 1
        except ImportError:
            print(f"\033[91mVault not found at {output}\033[0m")
            return 1

    return build_vault(base_dir, output)


if __name__ == "__main__":
    sys.exit(main())
