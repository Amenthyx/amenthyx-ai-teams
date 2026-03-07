#!/usr/bin/env python3
"""
Amenthyx AI Teams CLI -- manage, validate, and compose teams.

Usage:
    python shared/amenthyx_cli.py list                          # List all teams
    python shared/amenthyx_cli.py info fullStack                # Show team details
    python shared/amenthyx_cli.py init [--dir PATH]             # Interactive project setup wizard
    python shared/amenthyx_cli.py dry-run --team fullStack --strategy strategy.md  # Simulate activation
    python shared/amenthyx_cli.py validate-strategy strategy.md # Validate a strategy file
    python shared/amenthyx_cli.py compose --from fullStack:BE,FE --from fintech:SECCOMP --output custom-team/TEAM.md
    python shared/amenthyx_cli.py test                          # Run team test suite
    python shared/amenthyx_cli.py test 01-full-stack            # Test one team
    python shared/amenthyx_cli.py search "kubernetes"           # Search teams by keyword
    python shared/amenthyx_cli.py templates                     # List strategy templates
    python shared/amenthyx_cli.py health                        # Check project health
    python shared/amenthyx_cli.py version                       # Show version

Python 3.8+, no external dependencies.
"""

import argparse
import glob
import json
import os
import re
import shutil
import sys
from typing import Dict, List, Optional, Tuple

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERSION = "4.0.0"

# ---------------------------------------------------------------------------
# ANSI colours (with Windows support)
# ---------------------------------------------------------------------------

_COLOR_SUPPORTED = True

if sys.platform == "win32":
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32  # type: ignore[attr-defined]
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except Exception:
        _COLOR_SUPPORTED = False

if not sys.stdout.isatty():
    _COLOR_SUPPORTED = False


class C:
    """ANSI colour codes."""
    GREEN  = "\033[92m" if _COLOR_SUPPORTED else ""
    YELLOW = "\033[93m" if _COLOR_SUPPORTED else ""
    RED    = "\033[91m" if _COLOR_SUPPORTED else ""
    BLUE   = "\033[94m" if _COLOR_SUPPORTED else ""
    CYAN   = "\033[96m" if _COLOR_SUPPORTED else ""
    BOLD   = "\033[1m"  if _COLOR_SUPPORTED else ""
    DIM    = "\033[2m"  if _COLOR_SUPPORTED else ""
    RESET  = "\033[0m"  if _COLOR_SUPPORTED else ""


def _col(code: str, text: str) -> str:
    return f"{code}{text}{C.RESET}" if _COLOR_SUPPORTED else text


# ---------------------------------------------------------------------------
# Team discovery helpers
# ---------------------------------------------------------------------------

def _numbered_dirs() -> List[str]:
    """Return sorted list of numbered team directory names (e.g. '01-full-stack')."""
    dirs: List[str] = []
    for entry in sorted(os.listdir(BASE)):
        full = os.path.join(BASE, entry)
        if os.path.isdir(full) and re.match(r"^\d{2}-", entry):
            dirs.append(entry)
    return dirs


def _parse_team_header(team_dir: str) -> Dict[str, str]:
    """Parse the first 5 lines of TEAM.md for name, activation keyword, and focus."""
    team_md = os.path.join(BASE, team_dir, "TEAM.md")
    info: Dict[str, str] = {
        "dir": team_dir,
        "number": team_dir.split("-", 1)[0],
        "name": "",
        "keyword": "",
        "focus": "",
        "has_team_md": False,
    }
    if not os.path.isfile(team_md):
        return info
    info["has_team_md"] = True
    try:
        with open(team_md, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                line = line.strip()
                if line.startswith("# ") and not info["name"] and "Activation" not in line and "Focus" not in line:
                    info["name"] = line.lstrip("# ").strip()
                m_act = re.match(r"^#\s*Activation:\s*`--team\s+(\S+)`", line)
                if m_act:
                    info["keyword"] = m_act.group(1)
                m_foc = re.match(r"^#\s*Focus:\s*(.+)", line)
                if m_foc:
                    info["focus"] = m_foc.group(1).strip()
                if info["name"] and info["keyword"] and info["focus"]:
                    break
    except OSError:
        pass
    return info


def _get_all_teams() -> List[Dict[str, str]]:
    """Return metadata dicts for every numbered team directory."""
    return [_parse_team_header(d) for d in _numbered_dirs()]


def _find_team(keyword_or_dir: str, teams: Optional[List[Dict[str, str]]] = None) -> Optional[Dict[str, str]]:
    """Resolve a team by activation keyword or directory name."""
    if teams is None:
        teams = _get_all_teams()
    kl = keyword_or_dir.lower()
    for t in teams:
        if t["keyword"].lower() == kl or t["dir"].lower() == kl:
            return t
    return None


def _count_agents(team_dir: str) -> int:
    """Count agent headings (### N.N ... or ### ... Agent) in TEAM.md."""
    team_md = os.path.join(BASE, team_dir, "TEAM.md")
    if not os.path.isfile(team_md):
        return 0
    count = 0
    in_roster = False
    try:
        with open(team_md, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                ls = line.strip()
                if re.match(r"^## 2\b", ls):
                    in_roster = True
                    continue
                if in_roster and re.match(r"^## [3-9]", ls):
                    break
                if in_roster and re.match(r"^### ", ls):
                    count += 1
    except OSError:
        pass
    return count


def _extract_agents(team_dir: str) -> List[Dict[str, str]]:
    """Extract agent role code, name, and short description from TEAM.md section 2."""
    team_md = os.path.join(BASE, team_dir, "TEAM.md")
    agents: List[Dict[str, str]] = []
    if not os.path.isfile(team_md):
        return agents
    in_roster = False
    current: Optional[Dict[str, str]] = None
    try:
        with open(team_md, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                ls = line.strip()
                if re.match(r"^## 2\b", ls):
                    in_roster = True
                    continue
                if in_roster and re.match(r"^## [3-9]", ls):
                    break
                if in_roster and re.match(r"^### ", ls):
                    heading = ls.lstrip("# ").strip()
                    # Extract role code in parens, e.g. "2.3 Backend Engineer (BE)"
                    m = re.search(r"\(([A-Z][A-Z0-9_/]+)\)", heading)
                    code = m.group(1) if m else ""
                    name = re.sub(r"^\d+\.\d+\s*", "", heading)
                    name = re.sub(r"\s*\([A-Z][A-Z0-9_/]+\)\s*$", "", name).strip()
                    current = {"code": code, "name": name, "role": "", "desc": ""}
                    agents.append(current)
                elif in_roster and current is not None:
                    if ls.startswith("- **Role**:"):
                        current["role"] = ls.replace("- **Role**:", "").strip()
                    elif ls.startswith("- **Persona**:"):
                        current["desc"] = ls.replace("- **Persona**:", "").strip()[:120]
    except OSError:
        pass
    return agents


def _extract_waves(team_dir: str) -> List[str]:
    """Extract wave plan summary lines from section 6."""
    team_md = os.path.join(BASE, team_dir, "TEAM.md")
    waves: List[str] = []
    if not os.path.isfile(team_md):
        return waves
    in_section = False
    try:
        with open(team_md, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                ls = line.strip()
                if re.match(r"^## 6\b", ls):
                    in_section = True
                    continue
                if in_section and re.match(r"^## [7-9]", ls):
                    break
                if in_section and re.match(r"^###\s+Wave", ls, re.IGNORECASE):
                    waves.append(ls.lstrip("# ").strip())
    except OSError:
        pass
    return waves


def _extract_evidence_types(team_dir: str) -> List[str]:
    """Extract evidence types from section 13."""
    team_md = os.path.join(BASE, team_dir, "TEAM.md")
    types: List[str] = []
    if not os.path.isfile(team_md):
        return types
    in_section = False
    try:
        with open(team_md, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                ls = line.strip()
                if re.match(r"^## 13\b", ls):
                    in_section = True
                    continue
                if in_section and re.match(r"^## 1[4-9]", ls):
                    break
                if in_section and ls.startswith("| ") and "---" not in ls:
                    cells = [c.strip() for c in ls.split("|") if c.strip()]
                    if cells and cells[0].lower() not in ("type", "evidence type", "category"):
                        types.append(cells[0])
    except OSError:
        pass
    return types


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_list(args: argparse.Namespace) -> int:
    """List all teams in a formatted table."""
    teams = _get_all_teams()
    if not teams:
        print(f"{C.RED}No teams found in {BASE}{C.RESET}")
        return 1

    # Column widths
    w_num = 4
    w_key = max(len(t["keyword"]) for t in teams if t["keyword"]) + 1 if any(t["keyword"] for t in teams) else 12
    w_key = max(w_key, 10)
    w_name = max(len(t["name"]) for t in teams if t["name"]) + 1 if any(t["name"] for t in teams) else 20
    w_name = max(w_name, 12)
    w_agents = 6

    header = (
        f"  {'#':<{w_num}}  "
        f"{'KEYWORD':<{w_key}}  "
        f"{'TEAM NAME':<{w_name}}  "
        f"{'AGENTS':>{w_agents}}  "
        f"FOCUS"
    )

    print()
    print(_col(C.BOLD, "  Amenthyx AI Teams"))
    print(_col(C.DIM, f"  {len(teams)} teams | v{VERSION}"))
    print()
    print(_col(C.BOLD + C.CYAN, header))
    print(_col(C.DIM, "  " + "-" * (len(header) + 10)))

    active_count = 0
    for t in teams:
        if not t["has_team_md"]:
            status = _col(C.DIM, "(empty)")
            line = f"  {t['number']:<{w_num}}  {status}"
            print(line)
            continue
        active_count += 1
        n_agents = _count_agents(t["dir"])
        focus = t["focus"][:60] + "..." if len(t["focus"]) > 60 else t["focus"]
        line = (
            f"  {_col(C.DIM, t['number']):<{w_num + len(C.DIM) + len(C.RESET)}}  "
            f"{_col(C.GREEN, t['keyword']):<{w_key + len(C.GREEN) + len(C.RESET)}}  "
            f"{t['name']:<{w_name}}  "
            f"{_col(C.YELLOW, str(n_agents)):>{w_agents + len(C.YELLOW) + len(C.RESET)}}  "
            f"{_col(C.DIM, focus)}"
        )
        print(line)

    print()
    print(_col(C.DIM, f"  {active_count} active teams, {len(teams) - active_count} empty directories"))
    print()
    return 0


def cmd_info(args: argparse.Namespace) -> int:
    """Show detailed info for a team."""
    keyword = args.keyword
    teams = _get_all_teams()
    team = _find_team(keyword, teams)

    if team is None:
        print(f"{C.RED}Team not found: {keyword}{C.RESET}")
        print(f"Use '{sys.argv[0]} list' to see available teams.")
        return 1

    if not team["has_team_md"]:
        print(f"{C.YELLOW}Team directory '{team['dir']}' exists but has no TEAM.md{C.RESET}")
        return 1

    agents = _extract_agents(team["dir"])
    waves = _extract_waves(team["dir"])
    evidence = _extract_evidence_types(team["dir"])

    print()
    print(_col(C.BOLD, f"  {team['name']}"))
    print(_col(C.DIM, f"  {'-' * len(team['name'])}"))
    print()
    print(f"  {'Directory:':<16} {team['dir']}")
    print(f"  {'Activation:':<16} {_col(C.GREEN, '--team ' + team['keyword'])}")
    print(f"  {'Focus:':<16} {team['focus']}")
    print(f"  {'Agents:':<16} {len(agents)}")
    print()

    # Agents table
    print(_col(C.BOLD + C.CYAN, "  Agent Roster"))
    print(_col(C.DIM, "  " + "-" * 60))
    for a in agents:
        code_str = f"({a['code']})" if a["code"] else ""
        role_str = f" -- {a['role']}" if a["role"] else ""
        print(f"    {_col(C.GREEN, code_str):<{8 + len(C.GREEN) + len(C.RESET)}} {a['name']}{_col(C.DIM, role_str)}")
    print()

    # Waves
    if waves:
        print(_col(C.BOLD + C.CYAN, "  Wave Execution Plan"))
        print(_col(C.DIM, "  " + "-" * 40))
        for w in waves:
            print(f"    {w}")
        print()

    # Evidence types
    if evidence:
        print(_col(C.BOLD + C.CYAN, "  Evidence Types"))
        print(_col(C.DIM, "  " + "-" * 40))
        for e in evidence:
            print(f"    - {e}")
        print()

    return 0


def cmd_validate_strategy(args: argparse.Namespace) -> int:
    """Validate a strategy file by delegating to strategy_validator.py."""
    strategy_path = args.path
    if not os.path.isfile(strategy_path):
        print(f"{C.RED}File not found: {strategy_path}{C.RESET}")
        return 1

    validator_path = os.path.join(BASE, "shared", "strategy_validator.py")
    if not os.path.isfile(validator_path):
        print(f"{C.RED}strategy_validator.py not found at {validator_path}{C.RESET}")
        return 1

    # Import and run the validator
    import importlib.util
    spec = importlib.util.spec_from_file_location("strategy_validator", validator_path)
    if spec is None or spec.loader is None:
        print(f"{C.RED}Could not load strategy_validator.py{C.RESET}")
        return 1
    mod = importlib.util.module_from_spec(spec)
    old_argv = sys.argv
    sys.argv = ["strategy_validator.py", strategy_path]
    try:
        spec.loader.exec_module(mod)  # type: ignore[union-attr]
    except SystemExit as e:
        return int(e.code) if e.code is not None else 0
    finally:
        sys.argv = old_argv
    return 0


def cmd_compose(args: argparse.Namespace) -> int:
    """Compose a custom team by picking agents from different teams."""
    if not args.from_specs:
        print(f"{C.RED}At least one --from spec is required.{C.RESET}")
        print("Example: --from fullStack:BE,FE --from fintech:SECCOMP")
        return 1

    output_path = args.output or "custom-team/TEAM.md"
    teams = _get_all_teams()

    # Parse --from specs
    picked_agents: List[Dict[str, str]] = []
    errors: List[str] = []

    for spec in args.from_specs:
        parts = spec.split(":", 1)
        if len(parts) != 2:
            errors.append(f"Invalid --from spec '{spec}'. Expected format: teamKeyword:ROLE1,ROLE2")
            continue
        team_key, roles_str = parts
        team = _find_team(team_key, teams)
        if team is None:
            errors.append(f"Team not found: {team_key}")
            continue
        if not team["has_team_md"]:
            errors.append(f"Team '{team_key}' has no TEAM.md")
            continue

        available = _extract_agents(team["dir"])
        available_codes = {a["code"].upper(): a for a in available if a["code"]}
        requested = [r.strip().upper() for r in roles_str.split(",")]

        for role in requested:
            if role in ("TL", "PM", "JUDGE"):
                continue  # Auto-included, skip silently
            if role not in available_codes:
                errors.append(f"Role '{role}' not found in team '{team_key}'. "
                              f"Available: {', '.join(sorted(available_codes.keys()))}")
                continue
            agent = available_codes[role].copy()
            agent["source_team"] = team["keyword"]
            picked_agents.append(agent)

    if errors:
        for e in errors:
            print(f"  {C.RED}ERROR:{C.RESET} {e}")
        return 1

    # Check for duplicate role codes
    codes_seen: Dict[str, str] = {}
    for a in picked_agents:
        code = a["code"].upper()
        if code in codes_seen:
            print(f"  {C.RED}ERROR:{C.RESET} Role '{code}' picked from both "
                  f"'{codes_seen[code]}' and '{a['source_team']}'. Remove the duplicate.")
            return 1
        codes_seen[code] = a.get("source_team", "?")

    # Auto-include TL, PM, JUDGE from the first referenced team
    first_team = _find_team(args.from_specs[0].split(":")[0], teams)
    core_agents: List[Dict[str, str]] = []
    if first_team and first_team["has_team_md"]:
        all_agents = _extract_agents(first_team["dir"])
        for a in all_agents:
            if a["code"] in ("TL", "PM", "JUDGE"):
                a["source_team"] = first_team["keyword"]
                core_agents.append(a)

    all_composed = core_agents + picked_agents
    total = len(all_composed)

    print()
    print(_col(C.BOLD, "  Composing Custom Team"))
    print(_col(C.DIM, "  " + "-" * 40))
    print(f"  Agents: {total} ({len(core_agents)} core + {len(picked_agents)} selected)")
    print()
    for a in all_composed:
        src = _col(C.DIM, f" [{a.get('source_team', '?')}]")
        code_str = f"({a['code']})" if a["code"] else ""
        print(f"    {_col(C.GREEN, code_str):<{8 + len(C.GREEN) + len(C.RESET)}} {a['name']}{src}")
    print()

    # Generate TEAM.md content
    lines: List[str] = []
    lines.append("# Custom Composed Team")
    lines.append("# Activation: `--team custom`")
    sources = sorted(set(a.get("source_team", "") for a in all_composed if a.get("source_team")))
    lines.append(f"# Focus: Custom composition from {', '.join(sources)}")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## TABLE OF CONTENTS")
    sections = [
        "Activation Protocol", "Team Roster & Personas", "Organizational Hierarchy",
        "Subagent Orchestration Engine", "PM Artifacts & GitHub Integration",
        "Wave-Based Parallel Execution", "Quality Gates", "`.team/` Directory Layout",
        "Decision Aggregation Protocol", "Reporting System -- PPTX & PDF",
        "Error Handling & Recovery", "Session Management", "Evidence & Proof Protocol",
        "Local Install & Test Protocol", "Atomic Commit Protocol",
        "Comprehensive Testing Matrix", "GitHub Actions -- Local Testing",
        "PM Kanban -- Real-Time Tracking",
    ]
    for i, s in enumerate(sections, 1):
        lines.append(f"{i}. [{s}](#{i}-{s.lower().replace(' ', '-')})")
    lines.append("")
    lines.append("---")
    lines.append("")

    # Section 1
    lines.append("## 1. ACTIVATION PROTOCOL")
    lines.append("")
    lines.append("### Trigger")
    lines.append("```")
    lines.append("--team custom --strategy ./strategy.md")
    lines.append("```")
    lines.append("")

    # Section 2 - Team Roster
    lines.append("## 2. TEAM ROSTER & PERSONAS")
    lines.append("")
    for idx, a in enumerate(all_composed, 1):
        code_str = f" ({a['code']})" if a["code"] else ""
        lines.append(f"### 2.{idx} {a['name']}{code_str}")
        if a["role"]:
            lines.append(f"- **Role**: {a['role']}")
        if a.get("desc"):
            lines.append(f"- **Persona**: {a['desc']}")
        lines.append(f"- **Source**: `--team {a.get('source_team', '?')}`")
        lines.append("")

    # Sections 3-18 (skeleton)
    for i, s in enumerate(sections[2:], 3):
        lines.append(f"## {i}. {s.upper()}")
        lines.append("")
        lines.append(f"> Customize this section for your composed team.")
        lines.append("")

    content = "\n".join(lines)

    # Write output
    out_dir = os.path.dirname(output_path)
    if out_dir and not os.path.isdir(out_dir):
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    abs_path = os.path.abspath(output_path)
    print(f"  {_col(C.GREEN, 'CREATED')} {abs_path}")
    print(f"  {total} agents across {len(sections)} sections")
    print()
    return 0


def cmd_test(args: argparse.Namespace) -> int:
    """Run the team test suite."""
    test_path = os.path.join(BASE, "shared", "team_test_suite.py")
    if not os.path.isfile(test_path):
        print(f"{C.RED}team_test_suite.py not found at {test_path}{C.RESET}")
        return 1

    import importlib.util
    spec = importlib.util.spec_from_file_location("team_test_suite", test_path)
    if spec is None or spec.loader is None:
        print(f"{C.RED}Could not load team_test_suite.py{C.RESET}")
        return 1
    mod = importlib.util.module_from_spec(spec)
    old_argv = sys.argv
    argv_new = ["team_test_suite.py"]
    if args.team_dir:
        argv_new.append(args.team_dir)
    sys.argv = argv_new
    try:
        spec.loader.exec_module(mod)  # type: ignore[union-attr]
    except SystemExit as e:
        return int(e.code) if e.code is not None else 0
    finally:
        sys.argv = old_argv
    return 0


def cmd_search(args: argparse.Namespace) -> int:
    """Search all TEAM.md files for a keyword."""
    query = args.query.lower()
    teams = _get_all_teams()
    results: List[Tuple[Dict[str, str], List[str]]] = []

    for t in teams:
        if not t["has_team_md"]:
            continue
        team_md = os.path.join(BASE, t["dir"], "TEAM.md")
        matches: List[str] = []
        try:
            with open(team_md, "r", encoding="utf-8", errors="replace") as f:
                for lineno, line in enumerate(f, 1):
                    if query in line.lower():
                        snippet = line.strip()
                        if len(snippet) > 120:
                            snippet = snippet[:117] + "..."
                        matches.append(f"  L{lineno}: {snippet}")
        except OSError:
            continue
        if matches:
            results.append((t, matches))

    if not results:
        print(f"\n  {C.YELLOW}No results for '{args.query}'{C.RESET}\n")
        return 0

    total_matches = sum(len(m) for _, m in results)
    print()
    print(_col(C.BOLD, f"  Search: \"{args.query}\""))
    print(_col(C.DIM, f"  {total_matches} matches across {len(results)} teams"))
    print()

    for t, matches in results:
        print(f"  {_col(C.GREEN, t['keyword'])} {_col(C.DIM, '(' + t['dir'] + ')')}")
        show = matches[:5]
        for m in show:
            # Highlight the query in the match
            highlighted = re.sub(
                re.escape(args.query),
                _col(C.YELLOW + C.BOLD, args.query),
                m,
                flags=re.IGNORECASE,
            )
            print(f"    {highlighted}")
        if len(matches) > 5:
            print(_col(C.DIM, f"    ... and {len(matches) - 5} more matches"))
        print()

    return 0


def cmd_templates(args: argparse.Namespace) -> int:
    """List available strategy templates."""
    templates_dir = os.path.join(BASE, "shared", "templates")
    root_template = os.path.join(BASE, "STRATEGY_TEMPLATE.md")

    print()
    print(_col(C.BOLD, "  Strategy Templates"))
    print(_col(C.DIM, "  " + "-" * 40))
    print()

    found = 0

    # Check root-level template
    if os.path.isfile(root_template):
        found += 1
        desc = _read_template_desc(root_template)
        print(f"  {_col(C.GREEN, 'STRATEGY_TEMPLATE.md')} {_col(C.DIM, '(root)')}")
        print(f"    {desc}")
        print()

    # Check templates directory
    if os.path.isdir(templates_dir):
        for fname in sorted(os.listdir(templates_dir)):
            if fname.endswith(".md"):
                found += 1
                fpath = os.path.join(templates_dir, fname)
                desc = _read_template_desc(fpath)
                print(f"  {_col(C.GREEN, fname)} {_col(C.DIM, '(shared/templates/)')}")
                print(f"    {desc}")
                print()

    if found == 0:
        print(f"  {C.YELLOW}No templates found.{C.RESET}")
        print()
        return 0

    print(_col(C.DIM, f"  {found} template(s) available"))
    print(_col(C.DIM, "  Usage: copy a template, customize it, then pass with --strategy"))
    print()
    return 0


def _read_template_desc(path: str) -> str:
    """Read the first non-empty, non-heading line as description."""
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                ls = line.strip()
                if not ls or ls.startswith("#"):
                    continue
                # Strip markdown quote prefix
                if ls.startswith(">"):
                    ls = ls.lstrip("> ").strip()
                if ls:
                    return ls[:100] + ("..." if len(ls) > 100 else "")
    except OSError:
        pass
    return "(no description)"


def cmd_health(args: argparse.Namespace) -> int:
    """Check project health: TEAM.md presence, numbering gaps, protocols, uniqueness."""
    teams = _get_all_teams()
    issues: List[str] = []
    warnings: List[str] = []

    print()
    print(_col(C.BOLD, "  Amenthyx AI Teams -- Health Check"))
    print(_col(C.DIM, "  " + "-" * 40))
    print()

    # 1. Check all numbered folders have TEAM.md
    missing_md: List[str] = []
    for t in teams:
        if not t["has_team_md"]:
            missing_md.append(t["dir"])
    if missing_md:
        for d in missing_md:
            warnings.append(f"Missing TEAM.md: {d}")

    # 2. Check for numbering gaps
    numbers = [int(t["number"]) for t in teams]
    if numbers:
        expected = set(range(1, max(numbers) + 1))
        actual = set(numbers)
        gaps = sorted(expected - actual)
        if gaps:
            issues.append(f"Numbering gaps at: {', '.join(f'{g:02d}' for g in gaps)}")
        dupes = [n for n in actual if numbers.count(n) > 1]
        if dupes:
            issues.append(f"Duplicate numbers: {', '.join(f'{d:02d}' for d in set(dupes))}")

    # 3. Check shared protocols exist
    expected_protocols = [
        "ACTIVATION_PROTOCOL.md",
        "ENHANCED_EXECUTION_PROTOCOL.md",
        "JUDGE_PROTOCOL.md",
        "PM_GITHUB_INTEGRATION.md",
        "PPTX_GENERATOR.py",
        "PDF_GENERATOR.py",
        "strategy_validator.py",
        "team_test_suite.py",
    ]
    shared_dir = os.path.join(BASE, "shared")
    for proto in expected_protocols:
        if not os.path.isfile(os.path.join(shared_dir, proto)):
            issues.append(f"Missing shared protocol: shared/{proto}")

    # 4. Check README.md team count
    readme = os.path.join(BASE, "README.md")
    active_teams = [t for t in teams if t["has_team_md"]]
    if os.path.isfile(readme):
        try:
            with open(readme, "r", encoding="utf-8", errors="replace") as f:
                readme_text = f.read()
            # Look for a team count mention
            count_matches = re.findall(r"(\d+)\s+(?:Specialized\s+)?(?:Virtual\s+)?(?:Engineering\s+)?Teams?", readme_text, re.IGNORECASE)
            if count_matches:
                readme_count = int(count_matches[0])
                actual_count = len(active_teams)
                if readme_count != actual_count:
                    warnings.append(
                        f"README.md mentions {readme_count} teams but {actual_count} active teams found"
                    )
        except OSError:
            pass
    else:
        warnings.append("No README.md found in project root")

    # 5. Check all activation keywords are unique
    keywords: Dict[str, List[str]] = {}
    for t in teams:
        if t["keyword"]:
            keywords.setdefault(t["keyword"], []).append(t["dir"])
    for kw, dirs in keywords.items():
        if len(dirs) > 1:
            issues.append(f"Duplicate keyword '{kw}' in: {', '.join(dirs)}")

    # Report
    check_items = [
        ("Team directories", f"{len(teams)} found ({len(active_teams)} with TEAM.md)"),
        ("Numbering", "Sequential" if not gaps else f"Gaps at {', '.join(f'{g:02d}' for g in gaps)}"),
        ("Shared protocols", f"{sum(1 for p in expected_protocols if os.path.isfile(os.path.join(shared_dir, p)))}/{len(expected_protocols)} present"),
        ("Unique keywords", f"{len(keywords)} unique" if all(len(v) == 1 for v in keywords.values()) else "DUPLICATES FOUND"),
    ]

    for label, value in check_items:
        status = _col(C.GREEN, "OK") if "gap" not in value.lower() and "duplicate" not in value.lower() and "missing" not in value.lower() else _col(C.YELLOW, "!!")
        print(f"  {status} {label:<24} {value}")

    if issues:
        print()
        print(_col(C.RED + C.BOLD, "  Issues:"))
        for issue in issues:
            print(f"    {_col(C.RED, 'X')} {issue}")

    if warnings:
        print()
        print(_col(C.YELLOW + C.BOLD, "  Warnings:"))
        for w in warnings:
            print(f"    {_col(C.YELLOW, '!')} {w}")

    if not issues and not warnings:
        print()
        print(f"  {_col(C.GREEN + C.BOLD, 'All checks passed.')}")

    print()
    grade = "HEALTHY" if not issues else "NEEDS ATTENTION"
    color = C.GREEN if not issues else C.YELLOW
    print(f"  Status: {_col(color + C.BOLD, grade)}")
    print()

    return 1 if issues else 0


def cmd_version(args: argparse.Namespace) -> int:
    """Print version and stats."""
    teams = _get_all_teams()
    active = [t for t in teams if t["has_team_md"]]
    shared_dir = os.path.join(BASE, "shared")
    protocols = [f for f in os.listdir(shared_dir) if f.endswith(".md")] if os.path.isdir(shared_dir) else []
    scripts = [f for f in os.listdir(shared_dir) if f.endswith(".py")] if os.path.isdir(shared_dir) else []
    templates_dir = os.path.join(shared_dir, "templates")
    templates = [f for f in os.listdir(templates_dir) if f.endswith(".md")] if os.path.isdir(templates_dir) else []

    print()
    print(_col(C.BOLD, "  Amenthyx AI Teams CLI"))
    print()
    print(f"  {'Version:':<20} {_col(C.GREEN, VERSION)}")
    print(f"  {'Teams (total):':<20} {len(teams)}")
    print(f"  {'Teams (active):':<20} {len(active)}")
    print(f"  {'Shared protocols:':<20} {len(protocols)}")
    print(f"  {'Shared scripts:':<20} {len(scripts)}")
    print(f"  {'Templates:':<20} {len(templates)}")
    print(f"  {'Project root:':<20} {BASE}")
    print()
    return 0


def _list_templates() -> List[Dict[str, str]]:
    """Return list of available strategy templates with name, path, and description."""
    templates: List[Dict[str, str]] = []
    templates_dir = os.path.join(BASE, "shared", "templates")
    root_template = os.path.join(BASE, "STRATEGY_TEMPLATE.md")

    if os.path.isfile(root_template):
        templates.append({
            "name": "STRATEGY_TEMPLATE.md",
            "path": root_template,
            "desc": _read_template_desc(root_template),
            "location": "root",
        })

    if os.path.isdir(templates_dir):
        for fname in sorted(os.listdir(templates_dir)):
            if fname.endswith(".md") and fname.upper() != "README.md".upper():
                fpath = os.path.join(templates_dir, fname)
                templates.append({
                    "name": fname,
                    "path": fpath,
                    "desc": _read_template_desc(fpath),
                    "location": "shared/templates/",
                })

    return templates


def _extract_protocols(team_dir: str) -> List[str]:
    """Extract protocol references from TEAM.md (lines mentioning shared/ .md files)."""
    team_md = os.path.join(BASE, team_dir, "TEAM.md")
    protocols: List[str] = []
    shared_dir = os.path.join(BASE, "shared")
    if not os.path.isfile(team_md):
        return protocols

    # Collect all shared protocol names for matching
    shared_protocols: List[str] = []
    if os.path.isdir(shared_dir):
        shared_protocols = [f for f in os.listdir(shared_dir) if f.endswith(".md")]

    try:
        with open(team_md, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()
        for proto in shared_protocols:
            if proto in content or proto.replace(".md", "").replace("_", " ").lower() in content.lower():
                protocols.append(proto)
    except OSError:
        pass
    return protocols


def cmd_merge_strategy(args: argparse.Namespace) -> int:
    """AI-merge a user strategy into Amenthyx format."""
    merger_path = os.path.join(BASE, "shared", "strategy_merger.py")
    if not os.path.isfile(merger_path):
        print(f"{C.RED}strategy_merger.py not found at {merger_path}{C.RESET}")
        return 1

    import importlib.util
    spec = importlib.util.spec_from_file_location("strategy_merger", merger_path)
    if spec is None or spec.loader is None:
        print(f"{C.RED}Could not load strategy_merger.py{C.RESET}")
        return 1
    mod = importlib.util.module_from_spec(spec)
    old_argv = sys.argv
    argv_new = ["strategy_merger.py", args.path]
    if args.team:
        argv_new.extend(["--team", args.team])
    if args.output:
        argv_new.extend(["--output", args.output])
    if args.model:
        argv_new.extend(["--model", args.model])
    if args.prompt:
        argv_new.append("--prompt")
    sys.argv = argv_new
    try:
        spec.loader.exec_module(mod)
    except SystemExit as e:
        return int(e.code) if e.code is not None else 0
    finally:
        sys.argv = old_argv
    return 0


def cmd_init(args: argparse.Namespace) -> int:
    """Interactive project setup wizard."""
    target_dir = os.path.abspath(args.dir) if args.dir else os.getcwd()

    print()
    print(_col(C.BOLD, "  Amenthyx AI Teams -- Project Init Wizard"))
    print(_col(C.DIM, "  " + "-" * 45))
    print()

    # 1. Ask for project name
    project_name = input(f"  {_col(C.CYAN, 'Project name')}: ").strip()
    if not project_name:
        print(f"  {C.RED}Project name cannot be empty.{C.RESET}")
        return 1
    print()

    # 2. Show team categories and let user pick
    teams = _get_all_teams()
    active_teams = [t for t in teams if t["has_team_md"]]
    if not active_teams:
        print(f"  {C.RED}No active teams found in {BASE}{C.RESET}")
        return 1

    print(_col(C.BOLD + C.CYAN, "  Available Teams:"))
    print()
    for idx, t in enumerate(active_teams, 1):
        n_agents = _count_agents(t["dir"])
        focus_short = t["focus"][:50] + "..." if len(t["focus"]) > 50 else t["focus"]
        print(f"    {_col(C.YELLOW, f'{idx:>3}')}  {_col(C.GREEN, t['keyword']):<20} {t['name']:<30} {_col(C.DIM, focus_short)}")
    print()

    team_input = input(f"  {_col(C.CYAN, 'Select team')} (number or activation name): ").strip()
    if not team_input:
        print(f"  {C.RED}No team selected.{C.RESET}")
        return 1

    selected_team: Optional[Dict[str, str]] = None
    # Try as number first
    try:
        idx_val = int(team_input)
        if 1 <= idx_val <= len(active_teams):
            selected_team = active_teams[idx_val - 1]
    except ValueError:
        pass

    # Try as keyword/dir name
    if selected_team is None:
        selected_team = _find_team(team_input, active_teams)

    if selected_team is None:
        print(f"  {C.RED}Team not found: {team_input}{C.RESET}")
        return 1

    print(f"  Selected: {_col(C.GREEN, selected_team['keyword'])} ({selected_team['name']})")
    print()

    # 3. Ask which strategy template to use
    available_templates = _list_templates()
    if not available_templates:
        print(f"  {C.YELLOW}No strategy templates found. Skipping template copy.{C.RESET}")
        selected_template = None
    else:
        print(_col(C.BOLD + C.CYAN, "  Strategy Templates:"))
        print()
        for idx, tmpl in enumerate(available_templates, 1):
            print(f"    {_col(C.YELLOW, f'{idx:>3}')}  {_col(C.GREEN, tmpl['name']):<35} {_col(C.DIM, tmpl['desc'])}")
        print(f"    {_col(C.YELLOW, '  0')}  {_col(C.DIM, '(skip -- no template)')}")
        print()

        tmpl_input = input(f"  {_col(C.CYAN, 'Select template')} (number, 0 to skip): ").strip()
        selected_template = None
        try:
            tmpl_idx = int(tmpl_input)
            if tmpl_idx == 0:
                selected_template = None
            elif 1 <= tmpl_idx <= len(available_templates):
                selected_template = available_templates[tmpl_idx - 1]
            else:
                print(f"  {C.YELLOW}Invalid selection, skipping template.{C.RESET}")
        except ValueError:
            print(f"  {C.YELLOW}Invalid input, skipping template.{C.RESET}")
    print()

    # 4. Create directory structure
    team_dir_path = os.path.join(target_dir, ".team")
    subdirs = ["evidence", "reports", "learnings", "screenshots", "plans"]

    for subdir in subdirs:
        full_path = os.path.join(team_dir_path, subdir)
        os.makedirs(full_path, exist_ok=True)

    # 5. Copy selected template as strategy.md
    strategy_dest = os.path.join(target_dir, "strategy.md")
    if selected_template is not None:
        shutil.copy2(selected_template["path"], strategy_dest)

    # 6. Create mission-control.config.json
    config = {
        "project": project_name,
        "team": selected_team["keyword"],
        "teamDir": selected_team["dir"],
        "teamName": selected_team["name"],
        "strategy": "strategy.md" if selected_template else None,
        "createdAt": __import__("datetime").datetime.now().isoformat(),
        "directories": {
            "evidence": ".team/evidence/",
            "reports": ".team/reports/",
            "learnings": ".team/learnings/",
            "screenshots": ".team/screenshots/",
            "plans": ".team/plans/",
        },
    }
    config_path = os.path.join(target_dir, "mission-control.config.json")
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, default=str)

    # 7. Print summary
    print(_col(C.BOLD + C.GREEN, "  Project initialized successfully!"))
    print()
    print(_col(C.BOLD, "  Summary:"))
    print(f"    {'Project:':<20} {project_name}")
    print(f"    {'Team:':<20} {selected_team['keyword']} ({selected_team['name']})")
    print(f"    {'Target directory:':<20} {target_dir}")
    print()
    print(_col(C.BOLD, "  Created:"))
    for subdir in subdirs:
        print(f"    {_col(C.GREEN, 'DIR')}  .team/{subdir}/")
    if selected_template:
        print(f"    {_col(C.GREEN, 'FILE')} strategy.md  (from {selected_template['name']})")
    print(f"    {_col(C.GREEN, 'FILE')} mission-control.config.json")
    print()
    print(_col(C.DIM, f"  Next: review strategy.md, then run:"))
    print(_col(C.DIM, f"    amenthyx dry-run --team {selected_team['keyword']} --strategy strategy.md"))
    print()
    return 0


def cmd_dry_run(args: argparse.Namespace) -> int:
    """Simulate team activation without spawning anything."""
    team_keyword = args.team
    strategy_path = args.strategy
    issues: List[str] = []

    print()
    print(_col(C.BOLD, "  Amenthyx AI Teams -- Dry Run"))
    print(_col(C.DIM, "  " + "-" * 40))
    print()

    # 1. Validate team exists
    teams = _get_all_teams()
    team = _find_team(team_keyword, teams)
    if team is None:
        print(f"  {_col(C.RED, 'FAIL')} Team not found: {team_keyword}")
        print(f"  Use 'amenthyx list' to see available teams.")
        return 1

    if not team["has_team_md"]:
        print(f"  {_col(C.RED, 'FAIL')} Team '{team_keyword}' has no TEAM.md")
        return 1

    print(f"  {_col(C.GREEN, 'OK')}   Team: {_col(C.BOLD, team['name'])} ({team['keyword']})")

    # 2. Validate strategy file
    if not os.path.isfile(strategy_path):
        print(f"  {_col(C.RED, 'FAIL')} Strategy file not found: {strategy_path}")
        issues.append("Strategy file does not exist")
    else:
        print(f"  {_col(C.GREEN, 'OK')}   Strategy: {os.path.abspath(strategy_path)}")
        # Try running strategy_validator if available
        validator_path = os.path.join(BASE, "shared", "strategy_validator.py")
        if os.path.isfile(validator_path):
            try:
                import importlib.util
                spec = importlib.util.spec_from_file_location("strategy_validator", validator_path)
                if spec and spec.loader:
                    mod = importlib.util.module_from_spec(spec)
                    old_argv = sys.argv
                    # Redirect stdout to capture validator output
                    from io import StringIO
                    old_stdout = sys.stdout
                    sys.stdout = StringIO()
                    sys.argv = ["strategy_validator.py", strategy_path]
                    try:
                        spec.loader.exec_module(mod)
                        val_output = sys.stdout.getvalue()
                        print(f"  {_col(C.GREEN, 'OK')}   Strategy validation passed", file=old_stdout)
                    except SystemExit as e:
                        val_output = sys.stdout.getvalue()
                        if e.code and int(e.code) != 0:
                            print(f"  {_col(C.YELLOW, 'WARN')} Strategy validation found issues", file=old_stdout)
                            issues.append("Strategy validation reported warnings")
                        else:
                            print(f"  {_col(C.GREEN, 'OK')}   Strategy validation passed", file=old_stdout)
                    finally:
                        sys.stdout = old_stdout
                        sys.argv = old_argv
            except Exception as exc:
                print(f"  {_col(C.YELLOW, 'WARN')} Could not run strategy validator: {exc}")

    # 3. Extract agents
    agents = _extract_agents(team["dir"])
    waves = _extract_waves(team["dir"])
    evidence = _extract_evidence_types(team["dir"])
    protocols = _extract_protocols(team["dir"])

    print()
    print(_col(C.BOLD + C.CYAN, "  Agent Roster (would be spawned):"))
    print(_col(C.DIM, "  " + "-" * 55))
    for idx, a in enumerate(agents, 1):
        code_str = f"({a['code']})" if a["code"] else ""
        role_str = f" -- {a['role']}" if a["role"] else ""
        print(f"    {_col(C.YELLOW, f'{idx:>2}')}. {_col(C.GREEN, f'{code_str:<8}')} {a['name']}{_col(C.DIM, role_str)}")
    print()
    print(f"  Total agents: {_col(C.BOLD, str(len(agents)))}")
    print()

    # 4. Wave execution plan
    if waves:
        print(_col(C.BOLD + C.CYAN, "  Wave Execution Plan:"))
        print(_col(C.DIM, "  " + "-" * 55))
        for idx, w in enumerate(waves, 1):
            print(f"    {_col(C.YELLOW, f'Wave {idx}')}  {w}")
        print()
    else:
        print(f"  {_col(C.YELLOW, 'WARN')} No wave plan found in TEAM.md section 6")
        print()

    # 5. Approximate spawn order
    print(_col(C.BOLD + C.CYAN, "  Estimated Spawn Order:"))
    print(_col(C.DIM, "  " + "-" * 55))
    # Core roles first, then specialists
    core_codes = {"TL", "PM", "JUDGE"}
    core_agents = [a for a in agents if a["code"] in core_codes]
    specialist_agents = [a for a in agents if a["code"] not in core_codes]

    spawn_order = 1
    if core_agents:
        print(f"    {_col(C.DIM, 'Phase 1: Core roles (parallel)')}")
        for a in core_agents:
            code_str = f"({a['code']})" if a["code"] else ""
            print(f"      {_col(C.YELLOW, f'{spawn_order:>2}')}. {a['name']} {_col(C.GREEN, code_str)}")
            spawn_order += 1
    if specialist_agents:
        print(f"    {_col(C.DIM, 'Phase 2: Specialist agents (wave-driven)')}")
        for a in specialist_agents:
            code_str = f"({a['code']})" if a["code"] else ""
            print(f"      {_col(C.YELLOW, f'{spawn_order:>2}')}. {a['name']} {_col(C.GREEN, code_str)}")
            spawn_order += 1
    print()

    # 6. Protocols that would be loaded
    print(_col(C.BOLD + C.CYAN, "  Protocols (would be loaded):"))
    print(_col(C.DIM, "  " + "-" * 55))
    # Always-loaded protocols
    always_loaded = [
        "ACTIVATION_PROTOCOL.md",
        "ENHANCED_EXECUTION_PROTOCOL.md",
        "JUDGE_PROTOCOL.md",
        "PM_GITHUB_INTEGRATION.md",
    ]
    all_protocols = sorted(set(always_loaded + protocols))
    shared_dir = os.path.join(BASE, "shared")
    for proto in all_protocols:
        exists = os.path.isfile(os.path.join(shared_dir, proto))
        status = _col(C.GREEN, "OK") if exists else _col(C.RED, "MISSING")
        print(f"    {status}  {proto}")
        if not exists:
            issues.append(f"Protocol not found: shared/{proto}")
    print()

    # 7. Directories that would be created
    print(_col(C.BOLD + C.CYAN, "  Directories (would be created):"))
    print(_col(C.DIM, "  " + "-" * 55))
    team_dirs = [
        ".team/",
        ".team/evidence/",
        ".team/reports/",
        ".team/learnings/",
        ".team/screenshots/",
        ".team/plans/",
    ]
    for d in team_dirs:
        print(f"    {_col(C.GREEN, 'DIR')}  {d}")
    print()

    # 8. Evidence types
    if evidence:
        print(_col(C.BOLD + C.CYAN, "  Evidence Types (would be collected):"))
        print(_col(C.DIM, "  " + "-" * 55))
        for e in evidence:
            print(f"    - {e}")
        print()

    # 9. Final verdict
    print(_col(C.DIM, "  " + "=" * 55))
    if issues:
        print()
        print(_col(C.YELLOW + C.BOLD, "  Issues Found:"))
        for issue in issues:
            print(f"    {_col(C.YELLOW, '!')} {issue}")
        print()
        print(f"  Verdict: {_col(C.YELLOW + C.BOLD, 'ISSUES DETECTED')} -- activation may have problems")
        print()
        return 1
    else:
        print()
        print(f"  Verdict: {_col(C.GREEN + C.BOLD, 'READY')} -- team activation would succeed")
        print(f"  {_col(C.DIM, f'Run: --team {team_keyword} --strategy {strategy_path}')}")
        print()
        return 0


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(
        prog="amenthyx",
        description="Amenthyx AI Teams CLI -- manage, validate, and compose teams.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  %(prog)s list                              List all teams\n"
            "  %(prog)s info fullStack                    Show team details\n"
            "  %(prog)s init                              Interactive project setup wizard\n"
            "  %(prog)s init --dir ./my-project           Init in a specific directory\n"
            "  %(prog)s dry-run --team fullStack --strategy strategy.md\n"
            "                                             Simulate team activation\n"
            "  %(prog)s validate-strategy strategy.md     Validate a strategy\n"
            "  %(prog)s compose --from fullStack:BE,FE --output custom/TEAM.md\n"
            "  %(prog)s test                              Run test suite\n"
            "  %(prog)s search kubernetes                 Search teams\n"
            "  %(prog)s templates                         List templates\n"
            "  %(prog)s health                            Check project health\n"
            "  %(prog)s version                           Show version\n"
        ),
    )
    sub = parser.add_subparsers(dest="command", metavar="COMMAND")

    # list
    sub.add_parser("list", help="List all teams in a formatted table")

    # info
    p_info = sub.add_parser("info", help="Show detailed info for a team")
    p_info.add_argument("keyword", help="Team activation keyword or directory name")

    # init
    p_init = sub.add_parser("init", help="Interactive project setup wizard")
    p_init.add_argument(
        "--dir", default=None,
        help="Target directory for project setup (default: current directory)",
    )

    # dry-run
    p_dry = sub.add_parser("dry-run", help="Simulate team activation (no spawning)")
    p_dry.add_argument("--team", required=True, help="Team activation keyword or directory name")
    p_dry.add_argument("--strategy", required=True, help="Path to strategy.md file")

    # merge-strategy
    p_merge = sub.add_parser("merge-strategy", help="AI-merge a user strategy into Amenthyx format")
    p_merge.add_argument("path", help="Path to user's strategy file (any format)")
    p_merge.add_argument("--team", "-t", default=None, help="Team keyword for team-specific context")
    p_merge.add_argument("--output", "-o", default=None, help="Output path (default: <input>-amenthyx.md)")
    p_merge.add_argument("--model", "-m", default="claude-sonnet-4-6", help="Claude model (default: claude-sonnet-4-6)")
    p_merge.add_argument("--prompt", "-p", action="store_true",
                         help="Generate prompt file for Claude Code / Claude.ai (no API key needed)")

    # validate-strategy
    p_val = sub.add_parser("validate-strategy", help="Validate a strategy.md file")
    p_val.add_argument("path", help="Path to the strategy file")

    # compose
    p_compose = sub.add_parser("compose", help="Compose a custom team from multiple teams")
    p_compose.add_argument(
        "--from", dest="from_specs", action="append", metavar="TEAM:ROLE1,ROLE2",
        help="Pick agents from a team (repeatable). E.g. --from fullStack:BE,FE",
    )
    p_compose.add_argument(
        "--output", "-o", default=None,
        help="Output path for composed TEAM.md (default: custom-team/TEAM.md)",
    )

    # test
    p_test = sub.add_parser("test", help="Run the team test suite")
    p_test.add_argument("team_dir", nargs="?", default=None, help="Optional: test a single team (e.g. 01-full-stack)")

    # search
    p_search = sub.add_parser("search", help="Search TEAM.md files for a keyword")
    p_search.add_argument("query", help="Search query")

    # templates
    sub.add_parser("templates", help="List available strategy templates")

    # health
    sub.add_parser("health", help="Check project health")

    # version
    sub.add_parser("version", help="Show version and stats")

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
        return 0

    dispatch = {
        "list": cmd_list,
        "info": cmd_info,
        "init": cmd_init,
        "dry-run": cmd_dry_run,
        "merge-strategy": cmd_merge_strategy,
        "validate-strategy": cmd_validate_strategy,
        "compose": cmd_compose,
        "test": cmd_test,
        "search": cmd_search,
        "templates": cmd_templates,
        "health": cmd_health,
        "version": cmd_version,
    }

    handler = dispatch.get(args.command)
    if handler is None:
        parser.print_help()
        return 1

    try:
        return handler(args)
    except KeyboardInterrupt:
        print(f"\n{C.DIM}Interrupted.{C.RESET}")
        return 130
    except Exception as exc:
        print(f"\n{C.RED}Error: {exc}{C.RESET}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
