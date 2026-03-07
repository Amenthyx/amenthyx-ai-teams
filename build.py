#!/usr/bin/env python3
"""
Amenthyx AI Teams — Distribution Builder

Packages the entire project into a distributable form without source code:
  1. Compiles all .py → .pyc (bytecode)
  2. Bundles with PyInstaller into a single amenthyx.exe (optional)
  3. Creates a dist/ folder with only compiled/minified artifacts

Usage:
    python build.py                    # Compile .py → .pyc only (no PyInstaller needed)
    python build.py --pyinstaller      # Also create single .exe via PyInstaller
    python build.py --clean            # Remove build artifacts

Requirements:
    - Python 3.8+
    - PyInstaller (optional): pip install pyinstaller
"""

import argparse
import compileall
import os
import py_compile
import shutil
import struct
import sys
import time

BASE = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE, "dist")
BUILD_DIR = os.path.join(BASE, "build")
SHARED_DIR = os.path.join(BASE, "shared")

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
    # Remove .pyc files in shared/
    for root, dirs, files in os.walk(SHARED_DIR):
        for f in files:
            if f.endswith(".pyc"):
                os.remove(os.path.join(root, f))
        if "__pycache__" in dirs:
            shutil.rmtree(os.path.join(root, "__pycache__"))
    spec = os.path.join(BASE, "amenthyx.spec")
    if os.path.isfile(spec):
        os.remove(spec)
    log(GREEN, "DONE", "Build artifacts cleaned")


def compile_bytecode() -> None:
    """Compile all .py files to .pyc and create distribution without source."""
    print(f"\n{BOLD}  Amenthyx AI Teams — Distribution Builder{RESET}")
    print(f"{DIM}  {'=' * 45}{RESET}\n")

    os.makedirs(DIST_DIR, exist_ok=True)
    dist_shared = os.path.join(DIST_DIR, "shared")
    os.makedirs(dist_shared, exist_ok=True)

    # --- 1. Compile Python scripts ---
    log(CYAN, "STEP 1", "Compiling Python scripts → .pyc")

    py_files = []
    for f in os.listdir(SHARED_DIR):
        if f.endswith(".py"):
            py_files.append(f)

    compiled = 0
    for f in sorted(py_files):
        src = os.path.join(SHARED_DIR, f)
        # Compile to .pyc in dist
        pyc_name = f.replace(".py", ".pyc")
        pyc_dest = os.path.join(dist_shared, pyc_name)
        try:
            py_compile.compile(src, cfile=pyc_dest, doraise=True)
            compiled += 1
            log(GREEN, "  OK", f"{f} → {pyc_name}")
        except py_compile.PyCompileError as e:
            log(RED, "  FAIL", f"{f}: {e}")

    log(GREEN, "COMPILED", f"{compiled}/{len(py_files)} Python scripts")

    # --- 2. Copy Markdown files (team definitions, protocols) ---
    log(CYAN, "\nSTEP 2", "Bundling team definitions and protocols")

    # Copy all TEAM.md files
    team_count = 0
    for entry in sorted(os.listdir(BASE)):
        team_dir = os.path.join(BASE, entry)
        team_md = os.path.join(team_dir, "TEAM.md")
        if os.path.isdir(team_dir) and entry[:2].isdigit() and os.path.isfile(team_md):
            dest_dir = os.path.join(DIST_DIR, entry)
            os.makedirs(dest_dir, exist_ok=True)
            shutil.copy2(team_md, os.path.join(dest_dir, "TEAM.md"))
            team_count += 1

    log(GREEN, "COPIED", f"{team_count} TEAM.md files")

    # Copy protocol markdown files
    proto_count = 0
    for f in sorted(os.listdir(SHARED_DIR)):
        if f.endswith(".md"):
            shutil.copy2(os.path.join(SHARED_DIR, f), os.path.join(dist_shared, f))
            proto_count += 1

    log(GREEN, "COPIED", f"{proto_count} protocol files")

    # Copy templates
    templates_src = os.path.join(SHARED_DIR, "templates")
    templates_dst = os.path.join(dist_shared, "templates")
    if os.path.isdir(templates_src):
        shutil.copytree(templates_src, templates_dst, dirs_exist_ok=True)
        tpl_count = len([f for f in os.listdir(templates_src) if f.endswith(".md")])
        log(GREEN, "COPIED", f"{tpl_count} strategy templates")

    # --- 3. Copy root-level files ---
    log(CYAN, "\nSTEP 3", "Copying root files")

    root_files = ["README.md", "STRATEGY_TEMPLATE.md", "STRATEGY_DASHBOARD.md",
                   "CHANGELOG.md", "CONTRIBUTING.md", "LICENSE", "CODE_OF_CONDUCT.md"]
    for f in root_files:
        src = os.path.join(BASE, f)
        if os.path.isfile(src):
            shutil.copy2(src, os.path.join(DIST_DIR, f))
            log(GREEN, "  OK", f)

    # Copy .ai directory
    ai_src = os.path.join(BASE, ".ai")
    ai_dst = os.path.join(DIST_DIR, ".ai")
    if os.path.isdir(ai_src):
        shutil.copytree(ai_src, ai_dst, dirs_exist_ok=True)
        log(GREEN, "  OK", ".ai/context_base.md")

    # --- 4. Copy Mission Control (built files only) ---
    log(CYAN, "\nSTEP 4", "Bundling Mission Control")

    mc_src = os.path.join(SHARED_DIR, "mission-control")
    mc_dst = os.path.join(dist_shared, "mission-control")

    # Copy package.json and config files
    mc_root_files = ["package.json", "package-lock.json", "tsconfig.json",
                     "tsconfig.server.json", "Dockerfile", "docker-compose.yml",
                     ".dockerignore"]
    os.makedirs(mc_dst, exist_ok=True)
    for f in mc_root_files:
        src = os.path.join(mc_src, f)
        if os.path.isfile(src):
            shutil.copy2(src, os.path.join(mc_dst, f))

    # Copy built client dist (if exists)
    client_dist = os.path.join(mc_src, "src", "client", "dist")
    if os.path.isdir(client_dist):
        shutil.copytree(client_dist, os.path.join(mc_dst, "client-dist"), dirs_exist_ok=True)
        log(GREEN, "COPIED", "Mission Control client build")
    else:
        log(YELLOW, "SKIP", "Client not built — run 'npm run build:client' first")

    # Copy server dist (if exists)
    server_dist = os.path.join(mc_src, "dist", "server")
    if os.path.isdir(server_dist):
        shutil.copytree(server_dist, os.path.join(mc_dst, "dist", "server"), dirs_exist_ok=True)
        log(GREEN, "COPIED", "Mission Control server build")
    else:
        log(YELLOW, "SKIP", "Server not built — run 'npm run build:server' first")

    # Copy scaffold if present
    scaffold_dir = os.path.join(mc_src, "scaffold")
    if os.path.isdir(scaffold_dir):
        shutil.copytree(scaffold_dir, os.path.join(mc_dst, "scaffold"), dirs_exist_ok=True)

    # --- 5. Create launcher script ---
    log(CYAN, "\nSTEP 5", "Creating launcher scripts")

    # Windows batch launcher
    bat_content = '@echo off\npython "%~dp0shared\\amenthyx_cli.pyc" %*\n'
    bat_path = os.path.join(DIST_DIR, "amenthyx.bat")
    with open(bat_path, "w") as f:
        f.write(bat_content)
    log(GREEN, "CREATED", "amenthyx.bat (Windows launcher)")

    # Unix shell launcher
    sh_content = '#!/bin/sh\npython3 "$(dirname "$0")/shared/amenthyx_cli.pyc" "$@"\n'
    sh_path = os.path.join(DIST_DIR, "amenthyx.sh")
    with open(sh_path, "w") as f:
        f.write(sh_content)
    log(GREEN, "CREATED", "amenthyx.sh (Unix launcher)")

    # --- Summary ---
    total_size = 0
    for root, dirs, files in os.walk(DIST_DIR):
        for f in files:
            total_size += os.path.getsize(os.path.join(root, f))

    print(f"\n{BOLD}  Distribution Summary{RESET}")
    print(f"{DIM}  {'=' * 45}{RESET}")
    print(f"  Output:       {DIST_DIR}")
    print(f"  Python:       {compiled} .pyc files (no .py source)")
    print(f"  Teams:        {team_count} TEAM.md files")
    print(f"  Protocols:    {proto_count} protocol files")
    print(f"  Total size:   {total_size / 1024 / 1024:.1f} MB")
    print(f"\n  {GREEN}{BOLD}Distribution ready!{RESET}")
    print(f"  {DIM}No Python source code included.{RESET}\n")


def build_pyinstaller() -> None:
    """Build a single .exe using PyInstaller."""
    try:
        import PyInstaller.__main__
    except ImportError:
        log(RED, "ERROR", "PyInstaller not installed. Run: pip install pyinstaller")
        sys.exit(1)

    log(CYAN, "STEP 6", "Building single executable with PyInstaller")

    # Collect all data files to embed
    datas = []

    # Add all TEAM.md files
    for entry in sorted(os.listdir(BASE)):
        team_md = os.path.join(BASE, entry, "TEAM.md")
        if entry[:2].isdigit() and os.path.isfile(team_md):
            datas.append(f"--add-data={team_md}{os.pathsep}{entry}")

    # Add shared markdown files
    for f in sorted(os.listdir(SHARED_DIR)):
        fp = os.path.join(SHARED_DIR, f)
        if f.endswith(".md") and os.path.isfile(fp):
            datas.append(f"--add-data={fp}{os.pathsep}shared")

    # Add shared Python scripts (as data, the main script imports them)
    for f in sorted(os.listdir(SHARED_DIR)):
        fp = os.path.join(SHARED_DIR, f)
        if f.endswith(".py") and os.path.isfile(fp) and f != "amenthyx_cli.py":
            datas.append(f"--add-data={fp}{os.pathsep}shared")

    # Add templates
    templates_dir = os.path.join(SHARED_DIR, "templates")
    if os.path.isdir(templates_dir):
        for f in os.listdir(templates_dir):
            if f.endswith(".md"):
                fp = os.path.join(templates_dir, f)
                datas.append(f"--add-data={fp}{os.pathsep}shared/templates")

    # Add root files
    for f in ["README.md", "STRATEGY_TEMPLATE.md", "LICENSE"]:
        fp = os.path.join(BASE, f)
        if os.path.isfile(fp):
            datas.append(f"--add-data={fp}{os.pathsep}.")

    entry_point = os.path.join(SHARED_DIR, "amenthyx_cli.py")

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

    log(DIM, "ARGS", f"PyInstaller with {len(datas)} data files")

    PyInstaller.__main__.run(args)

    exe_path = os.path.join(DIST_DIR, "amenthyx.exe" if sys.platform == "win32" else "amenthyx")
    if os.path.isfile(exe_path):
        size_mb = os.path.getsize(exe_path) / 1024 / 1024
        log(GREEN, "SUCCESS", f"Created {exe_path} ({size_mb:.1f} MB)")
        print(f"\n  {GREEN}{BOLD}Single executable ready!{RESET}")
        print(f"  All team definitions, protocols, and tools embedded inside.")
        print(f"  {DIM}Distribute just this one file — no Python or source needed.{RESET}\n")
    else:
        log(RED, "ERROR", "PyInstaller build failed — exe not found")
        sys.exit(1)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Amenthyx AI Teams — Distribution Builder",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python build.py              Compile .py → .pyc, create dist/\n"
            "  python build.py --pyinstaller Also build single .exe\n"
            "  python build.py --clean       Remove build artifacts\n"
        ),
    )
    parser.add_argument("--pyinstaller", action="store_true",
                        help="Build single .exe with PyInstaller (requires: pip install pyinstaller)")
    parser.add_argument("--clean", action="store_true",
                        help="Remove all build artifacts")

    args = parser.parse_args()

    if args.clean:
        clean()
        return 0

    compile_bytecode()

    if args.pyinstaller:
        build_pyinstaller()

    return 0


if __name__ == "__main__":
    sys.exit(main())
