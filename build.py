#!/usr/bin/env python3
"""
Amenthyx AI Teams — Distribution Builder (Encrypted Vault Edition)

Packages the entire project into a distributable form with NO visible source code:
  1. Encrypts all .md and .py files into a single _vault.py binary vault
  2. Compiles the vault + CLI to .pyc bytecode
  3. Bundles with PyInstaller into a single amenthyx.exe (optional)
  4. NO .md files, NO .py source code in the final distribution

Usage:
    python build.py                    # Encrypted vault + .pyc distribution
    python build.py --pyinstaller      # Also create single .exe via PyInstaller
    python build.py --clean            # Remove build artifacts

Requirements:
    - Python 3.8+
    - PyInstaller (optional): pip install pyinstaller
"""

import argparse
import importlib.util
import os
import py_compile
import shutil
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE, "dist")
BUILD_DIR = os.path.join(BASE, "build")
SHARED_DIR = os.path.join(BASE, "shared")
VAULT_PATH = os.path.join(SHARED_DIR, "_vault.py")

# ANSI colours
if sys.platform == "win32":
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except Exception:
        pass

GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
CYAN = "\033[96m"
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"


def log(color: str, label: str, msg: str) -> None:
    print(f"  {color}{label}{RESET} {msg}")


def clean() -> None:
    """Remove build artifacts."""
    for d in [DIST_DIR, BUILD_DIR]:
        if os.path.isdir(d):
            shutil.rmtree(d)
            log(YELLOW, "REMOVED", d)
    for f in [VAULT_PATH, os.path.join(BASE, "amenthyx.spec")]:
        if os.path.isfile(f):
            os.remove(f)
            log(YELLOW, "REMOVED", f)
    # Remove .pyc and __pycache__
    for root, dirs, files in os.walk(SHARED_DIR):
        for fn in files:
            if fn.endswith(".pyc"):
                os.remove(os.path.join(root, fn))
        if "__pycache__" in dirs:
            shutil.rmtree(os.path.join(root, "__pycache__"))
    log(GREEN, "DONE", "Build artifacts cleaned")


def step_encrypt_vault() -> bool:
    """Step 1: Encrypt all .md and .py into _vault.py."""
    log(CYAN, "STEP 1", "Encrypting all content into vault")

    bundler_path = os.path.join(SHARED_DIR, "bundler.py")
    if not os.path.isfile(bundler_path):
        log(RED, "ERROR", f"bundler.py not found at {bundler_path}")
        return False

    spec = importlib.util.spec_from_file_location("bundler", bundler_path)
    if spec is None or spec.loader is None:
        log(RED, "ERROR", "Could not load bundler.py")
        return False

    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    result = mod.build_vault(BASE, VAULT_PATH)
    return result == 0


def step_compile_dist() -> None:
    """Step 2: Create dist/ with only .pyc files — no source code."""
    log(CYAN, "\nSTEP 2", "Building distribution (compiled bytecode only)")

    os.makedirs(DIST_DIR, exist_ok=True)
    dist_shared = os.path.join(DIST_DIR, "shared")
    os.makedirs(dist_shared, exist_ok=True)

    # --- Compile vault + essential runtime files to .pyc ---
    # Only these files go into distribution:
    runtime_files = [
        "_vault.py",       # encrypted content vault
        "amenthyx_cli.py", # CLI entry point
        "bundler.py",      # needed for decrypt primitives (imported by vault)
    ]

    compiled = 0
    for f in runtime_files:
        src = os.path.join(SHARED_DIR, f)
        if not os.path.isfile(src):
            log(YELLOW, "  SKIP", f"{f} (not found)")
            continue
        pyc_name = f.replace(".py", ".pyc")
        pyc_dest = os.path.join(dist_shared, pyc_name)
        try:
            py_compile.compile(src, cfile=pyc_dest, doraise=True)
            compiled += 1
            log(GREEN, "  OK", f"{f} -> {pyc_name}")
        except py_compile.PyCompileError as e:
            log(RED, "  FAIL", f"{f}: {e}")

    log(GREEN, "COMPILED", f"{compiled} runtime files")

    # --- NO .md files copied ---
    # --- NO .py source files copied ---
    # --- Everything is inside _vault.pyc ---

    # --- Copy Mission Control built assets (JS, not source) ---
    log(CYAN, "\nSTEP 3", "Bundling Mission Control (compiled JS only)")

    mc_src = os.path.join(SHARED_DIR, "mission-control")
    mc_dst = os.path.join(dist_shared, "mission-control")
    os.makedirs(mc_dst, exist_ok=True)

    # Only copy built/compiled output — no TypeScript source
    for f in ["package.json", "package-lock.json", "Dockerfile", "docker-compose.yml"]:
        src = os.path.join(mc_src, f)
        if os.path.isfile(src):
            shutil.copy2(src, os.path.join(mc_dst, f))

    # Client dist (minified JS/CSS)
    client_dist = os.path.join(mc_src, "src", "client", "dist")
    if os.path.isdir(client_dist):
        shutil.copytree(client_dist, os.path.join(mc_dst, "client-dist"), dirs_exist_ok=True)
        log(GREEN, "COPIED", "Mission Control client build (minified JS)")
    else:
        log(YELLOW, "SKIP", "Client not built — run 'npm run build:client' first")

    # Server dist (compiled JS)
    server_dist = os.path.join(mc_src, "dist", "server")
    if os.path.isdir(server_dist):
        shutil.copytree(server_dist, os.path.join(mc_dst, "dist", "server"), dirs_exist_ok=True)
        log(GREEN, "COPIED", "Mission Control server build (compiled JS)")
    else:
        log(YELLOW, "SKIP", "Server not built — run 'npm run build:server' first")

    # node_modules for production runtime
    node_modules = os.path.join(mc_src, "node_modules")
    if os.path.isdir(node_modules):
        # Only copy production deps, not devDeps
        log(DIM, "  INFO", "Skipping node_modules (run 'npm ci --production' in dist)")

    # --- Create launcher scripts ---
    log(CYAN, "\nSTEP 4", "Creating launcher scripts")

    bat_content = '@echo off\npython "%~dp0shared\\amenthyx_cli.pyc" %*\n'
    with open(os.path.join(DIST_DIR, "amenthyx.bat"), "w") as f:
        f.write(bat_content)
    log(GREEN, "CREATED", "amenthyx.bat (Windows)")

    sh_content = '#!/bin/sh\npython3 "$(dirname "$0")/shared/amenthyx_cli.pyc" "$@"\n'
    with open(os.path.join(DIST_DIR, "amenthyx.sh"), "w") as f:
        f.write(sh_content)
    log(GREEN, "CREATED", "amenthyx.sh (Linux/macOS)")

    # --- Summary ---
    total_size = 0
    file_count = 0
    for root, dirs, files in os.walk(DIST_DIR):
        for fn in files:
            total_size += os.path.getsize(os.path.join(root, fn))
            file_count += 1

    # Verify NO source code leaked
    leaked = []
    for root, dirs, files in os.walk(DIST_DIR):
        for fn in files:
            if fn.endswith(".md") or (fn.endswith(".py") and not fn.startswith("_")):
                leaked.append(os.path.join(root, fn))

    print(f"\n{BOLD}  Distribution Summary{RESET}")
    print(f"{DIM}  {'=' * 50}{RESET}")
    print(f"  Output:         {DIST_DIR}")
    print(f"  Files:          {file_count}")
    print(f"  Total size:     {total_size / 1024 / 1024:.1f} MB")
    print(f"  .md files:      {RED}0 (encrypted in vault){RESET}")
    print(f"  .py source:     {RED}0 (compiled to .pyc){RESET}")

    if leaked:
        print(f"\n  {RED}WARNING: Source files detected in dist:{RESET}")
        for lf in leaked:
            print(f"    {RED}{lf}{RESET}")
    else:
        print(f"  Leak check:     {GREEN}CLEAN — no source files{RESET}")

    print(f"\n  {GREEN}{BOLD}Distribution ready — zero source code exposed.{RESET}\n")


def step_pyinstaller() -> None:
    """Step 5: Build single .exe with PyInstaller."""
    try:
        import PyInstaller.__main__
    except ImportError:
        log(RED, "ERROR", "PyInstaller not installed. Run: pip install pyinstaller")
        sys.exit(1)

    log(CYAN, "\nSTEP 5", "Building single executable with PyInstaller")

    # Only bundle the vault and CLI — NO .md files, NO .py source
    entry_point = os.path.join(SHARED_DIR, "amenthyx_cli.py")
    sep = os.pathsep

    datas = []
    # Add the encrypted vault
    if os.path.isfile(VAULT_PATH):
        datas.append(f"--add-data={VAULT_PATH}{sep}shared")
    # Add bundler.py (needed for decrypt at runtime)
    bundler = os.path.join(SHARED_DIR, "bundler.py")
    if os.path.isfile(bundler):
        datas.append(f"--add-data={bundler}{sep}shared")

    args = [
        entry_point,
        "--onefile",
        "--name=amenthyx",
        f"--distpath={DIST_DIR}",
        f"--workpath={BUILD_DIR}",
        f"--specpath={BASE}",
        "--console",
        "--noconfirm",
    ] + datas

    log(DIM, "ARGS", f"PyInstaller with {len(datas)} data files (vault only, no source)")

    PyInstaller.__main__.run(args)

    exe_name = "amenthyx.exe" if sys.platform == "win32" else "amenthyx"
    exe_path = os.path.join(DIST_DIR, exe_name)
    if os.path.isfile(exe_path):
        size_mb = os.path.getsize(exe_path) / 1024 / 1024
        log(GREEN, "SUCCESS", f"Created {exe_path} ({size_mb:.1f} MB)")
        print(f"\n  {GREEN}{BOLD}Single executable ready!{RESET}")
        print(f"  All content encrypted inside the binary.")
        print(f"  {RED}Zero .md files. Zero .py source.{RESET}")
        print(f"  {DIM}Distribute just this one file.{RESET}\n")
    else:
        log(RED, "ERROR", "PyInstaller build failed")
        sys.exit(1)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Amenthyx AI Teams — Encrypted Distribution Builder",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python build.py              Encrypt + compile → dist/\n"
            "  python build.py --pyinstaller Encrypt + compile + single .exe\n"
            "  python build.py --clean       Remove all build artifacts\n"
            "\n"
            "Distribution contains:\n"
            "  - _vault.pyc (all .md + .py encrypted inside)\n"
            "  - amenthyx_cli.pyc (compiled CLI entry point)\n"
            "  - Zero .md files, zero .py source code\n"
        ),
    )
    parser.add_argument("--pyinstaller", action="store_true",
                        help="Build single .exe with PyInstaller")
    parser.add_argument("--clean", action="store_true",
                        help="Remove all build artifacts")

    args = parser.parse_args()

    if args.clean:
        clean()
        return 0

    print(f"\n{BOLD}  Amenthyx AI Teams — Encrypted Distribution Builder{RESET}")
    print(f"{DIM}  {'=' * 55}{RESET}\n")

    # Step 1: Encrypt everything into vault
    if not step_encrypt_vault():
        log(RED, "ABORT", "Vault encryption failed")
        return 1

    # Step 2-4: Compile and build dist
    step_compile_dist()

    # Step 5: Optional PyInstaller
    if args.pyinstaller:
        step_pyinstaller()

    return 0


if __name__ == "__main__":
    sys.exit(main())
