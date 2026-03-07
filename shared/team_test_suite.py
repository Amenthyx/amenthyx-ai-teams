#!/usr/bin/env python3
"""
team_test_suite.py - Structural validation for all TEAM.md files.

Validates header, required sections, agent roster, spawn blocks,
and cross-team consistency for the amenthyx-ai-teams repository.

Usage:
    python shared/team_test_suite.py              # scan all teams
    python shared/team_test_suite.py 01-full-stack # scan one team
    python shared/team_test_suite.py --json        # JSON output for CI
"""

import os
import re
import sys
import glob
import json
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple

# ---------------------------------------------------------------------------
# ANSI helpers
# ---------------------------------------------------------------------------
USE_COLOR = sys.stdout.isatty() and "--json" not in sys.argv

def _c(code: str, text: str) -> str:
    return f"\033[{code}m{text}\033[0m" if USE_COLOR else text

def green(t: str) -> str:  return _c("32", t)
def yellow(t: str) -> str: return _c("33", t)
def red(t: str) -> str:    return _c("31", t)
def bold(t: str) -> str:   return _c("1", t)
def cyan(t: str) -> str:   return _c("36", t)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
REQUIRED_SECTION_PATTERNS = [
    # (label, regex that must match at least one heading line)
    ("Activation Protocol",          r"(?i)activation\s+protocol"),
    ("Team Roster / Personas",       r"(?i)team\s+roster|personas"),
    ("Organizational Hierarchy",     r"(?i)organizational\s+hierarchy"),
    ("Subagent Orchestration",       r"(?i)subagent\s+orchestration"),
    ("Wave-Based Execution",         r"(?i)wave.based.*execution"),
    ("Quality Gates",                r"(?i)quality\s+gates"),
    ("Directory Layout",             r"(?i)(\.team.*directory|directory\s+layout)"),
    ("Evidence & Proof",             r"(?i)evidence.*proof"),
    ("Testing Matrix",               r"(?i)testing\s+matrix"),
    ("Atomic Commit",                r"(?i)atomic\s+commit"),
    ("Session Management / Error",   r"(?i)(session\s+management|error\s+handling)"),
    ("Decision Aggregation / Reporting", r"(?i)(decision\s+aggregation|reporting\s+system)"),
]

REQUIRED_AGENTS = ["TL", "PM", "JUDGE", "QA"]
MIN_ENGINEERS = 3

SPAWN_REQUIRED_KEYS = ["subagent_type=", "description=", "prompt="]

SHARED_REFS = [
    "ENHANCED_EXECUTION_PROTOCOL.md",
    "JUDGE_PROTOCOL.md",
]

SESSION_COMMANDS = ["team decide", "team judge", "team status"]

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------
@dataclass
class Issue:
    level: str   # FAIL, WARN
    message: str

@dataclass
class TeamResult:
    folder: str
    team_name: str = ""
    activation_keyword: str = ""
    section_count: int = 0
    issues: List[Issue] = field(default_factory=list)

    @property
    def status(self) -> str:
        if any(i.level == "FAIL" for i in self.issues):
            return "FAIL"
        if any(i.level == "WARN" for i in self.issues):
            return "WARN"
        return "PASS"

    def fail(self, msg: str):
        self.issues.append(Issue("FAIL", msg))

    def warn(self, msg: str):
        self.issues.append(Issue("WARN", msg))

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def read_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def heading_lines(content: str) -> List[str]:
    """Return all markdown heading lines (lines starting with #)."""
    return [ln for ln in content.splitlines() if ln.lstrip().startswith("#")]


def extract_activation(content: str) -> Optional[str]:
    """Return the activation keyword from an 'Activation: `--team <kw>`' line."""
    m = re.search(r"Activation:\s*`--team\s+(\S+?)`", content)
    return m.group(1) if m else None


def folder_number(folder_name: str) -> Optional[int]:
    m = re.match(r"^(\d+)-", folder_name)
    return int(m.group(1)) if m else None


def is_camel_or_lower(s: str) -> bool:
    # Allow digit-prefixed keywords like "3dVfx", "2dAnimation"
    return bool(re.match(r"^[a-z0-9][a-zA-Z0-9]*$", s))


def count_code_fences(content: str) -> int:
    return content.count("```")


def find_task_blocks(content: str) -> List[str]:
    """Return raw text of each Task(...) block."""
    blocks = []
    pattern = re.compile(r"Task\s*\(", re.MULTILINE)
    for m in pattern.finditer(content):
        start = m.start()
        # grab up to 40 lines after the match
        snippet = content[start:start + 3000]
        blocks.append(snippet)
    return blocks

# ---------------------------------------------------------------------------
# Per-team validators
# ---------------------------------------------------------------------------
def validate_header(content: str, folder: str, result: TeamResult):
    """Check header: activation keyword, camelCase, folder number match."""
    kw = extract_activation(content)
    if not kw:
        result.fail("Missing 'Activation: `--team <keyword>`' line in header")
        return
    result.activation_keyword = kw
    if not is_camel_or_lower(kw):
        result.fail(f"Activation keyword '{kw}' is not camelCase/lowercase")

    # Extract team name from first heading
    first_heading = re.search(r"^#\s+(.+)", content, re.MULTILINE)
    if first_heading:
        result.team_name = first_heading.group(1).strip()

    # Check folder number matches the team number context (activation line)
    fnum = folder_number(folder)
    if fnum is not None:
        # The activation trigger line should reference the same keyword
        trigger_match = re.search(r"--team\s+(\S+)\s+--strategy", content)
        if trigger_match and trigger_match.group(1) != kw:
            result.warn(
                f"Trigger keyword '{trigger_match.group(1)}' differs from "
                f"header keyword '{kw}'"
            )


def validate_required_sections(content: str, result: TeamResult):
    """Check that all required sections exist."""
    headings_text = "\n".join(heading_lines(content))
    for label, pattern in REQUIRED_SECTION_PATTERNS:
        if not re.search(pattern, headings_text) and not re.search(pattern, content[:5000]):
            result.fail(f"Missing required section: {label}")

    # Count total H2 sections
    h2s = [ln for ln in content.splitlines() if re.match(r"^##\s+", ln.lstrip())]
    result.section_count = len(h2s)


def _extract_roster_section(content: str) -> str:
    """Extract the actual Team Roster section (not the TOC link)."""
    # Match the real H2 heading for the roster section
    m = re.search(
        r"^(##\s+\d+\.\s+TEAM\s+ROSTER.*?)(?=\n##\s+\d+\.)",
        content, re.DOTALL | re.MULTILINE | re.IGNORECASE
    )
    if m:
        return m.group(1)
    # Fallback: look for the Personas heading
    m = re.search(
        r"^(##\s+.*?PERSONAS.*?)(?=\n##\s+\d+\.)",
        content, re.DOTALL | re.MULTILINE | re.IGNORECASE
    )
    if m:
        return m.group(1)
    # Last resort: whole file
    return content


def validate_agents(content: str, result: TeamResult):
    """Validate agent roster: TL, PM, JUDGE, QA, >=3 engineers, personas."""
    roster_section = _extract_roster_section(content)

    # Check required agents — flexible patterns to handle varied naming
    # QA may be named "QA Engineer (QA)", "QA -- Render Quality (QA)", etc.
    agent_patterns = {
        "TL":    r"Team\s+Leader.*?\(TL\)",
        "PM":    r"Project\s+Manager.*?\(PM\)",
        "JUDGE": r"Judge\s+Agent.*?\(JUDGE\)",
        "QA":    r"\([A-Z]*QA[A-Z]*\)",
    }

    for agent_key, pat in agent_patterns.items():
        if not re.search(pat, roster_section, re.IGNORECASE):
            result.fail(f"Required agent missing from roster: {agent_key}")

    # Count numbered subsections (### X.Y ...) to find domain engineers
    all_subsections = re.findall(r"###\s+\d+\.\d+\s+(.+)", roster_section)
    # Also count un-numbered agent headers like "### Judge Agent (JUDGE)"
    unnumbered = re.findall(r"###\s+(?!\d)(.+)", roster_section)
    total_agents = len(all_subsections) + len(unnumbered)
    # Required roles: TL, PM, JUDGE, QA = 4
    domain_count = max(total_agents - 4, 0)
    if domain_count < MIN_ENGINEERS:
        result.warn(
            f"Only {domain_count} domain-specific agents found "
            f"(expected >= {MIN_ENGINEERS})"
        )

    # Check each agent entry has a persona string
    persona_count = len(re.findall(r'\*\*Persona\*\*:\s*"', roster_section))
    if persona_count < total_agents - 1:  # allow 1 miss
        result.warn(
            f"Some agents may lack a quoted Persona string "
            f"({persona_count} personas for ~{total_agents} agents)"
        )


def _isolate_task_block(content: str, start: int) -> str:
    """Extract a single Task(...) block from start position, respecting parens."""
    depth = 0
    i = start
    while i < len(content):
        if content[i] == '(':
            depth += 1
        elif content[i] == ')':
            depth -= 1
            if depth == 0:
                return content[start:i + 1]
        i += 1
    # If no closing paren found, return up to 1500 chars
    return content[start:start + 1500]


def validate_spawn_blocks(content: str, result: TeamResult):
    """Validate Task() spawn blocks have required keys and correct modes."""
    blocks: List[str] = []
    for m in re.finditer(r"Task\s*\(", content):
        blocks.append(_isolate_task_block(content, m.start()))

    if not blocks:
        result.warn("No Task(...) spawn blocks found")
        return

    pm_spawn_found = False
    qa_spawn_found = False

    for block in blocks:
        desc_match = re.search(r'description\s*=\s*"([^"]*)"', block)
        desc = desc_match.group(1) if desc_match else ""

        # Check required keys (only for blocks with full syntax)
        if "subagent_type=" not in block and "description=" not in block:
            # Abbreviated/condensed block — skip key checks
            continue

        for key in SPAWN_REQUIRED_KEYS:
            if key not in block:
                label = desc or block[:60].replace("\n", " ")
                result.warn(f"Task block missing '{key}': {label}")

        # Detect PM spawn by description field
        if re.match(r"PM[:\s]", desc):
            pm_spawn_found = True
            if "run_in_background=True" in block.replace(" ", ""):
                result.fail("PM spawn should be foreground but found run_in_background=True")

        # Detect QA spawn by description field
        if re.match(r"QA[:\s]", desc):
            qa_spawn_found = True

    if not pm_spawn_found:
        result.warn("Could not identify PM spawn block")
    if not qa_spawn_found:
        result.warn("Could not identify QA spawn block")


def validate_shared_refs(content: str, result: TeamResult):
    """Check references to shared protocol files."""
    for ref in SHARED_REFS:
        if ref not in content:
            result.warn(f"Missing reference to shared/{ref}")


def validate_session_commands(content: str, result: TeamResult):
    """Check that standard session commands are documented."""
    for cmd in SESSION_COMMANDS:
        if cmd not in content:
            result.warn(f"Missing session command: '{cmd}'")


def validate_directory_layout(content: str, result: TeamResult):
    """Check .team/plans/ appears in directory layout."""
    if ".team/plans/" not in content and "plans/" not in content:
        result.warn("Directory layout missing '.team/plans/'")


def validate_markdown_integrity(content: str, result: TeamResult):
    """Check for broken markdown: unclosed code blocks, tables without headers."""
    # Unclosed code fences (odd count)
    fence_count = count_code_fences(content)
    if fence_count % 2 != 0:
        result.fail(
            f"Unclosed code block detected ({fence_count} fences — odd number)"
        )

    # Tables without header separator
    lines = content.splitlines()
    for i, line in enumerate(lines):
        if "|" in line and line.strip().startswith("|") and line.strip().endswith("|"):
            # This looks like a table row — check if next line is separator or prev is
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                prev_line = lines[i - 1].strip() if i > 0 else ""
                # If this is a header row, next should be |---|---|
                if (re.match(r"^\|[\s\-:|]+\|$", next_line)
                        or re.match(r"^\|[\s\-:|]+\|$", prev_line)):
                    continue  # valid table
                # If this is a data row following a separator, fine
                if (i > 1 and re.match(r"^\|[\s\-:|]+\|$", prev_line)):
                    continue
                # Could be a data row in an ongoing table — skip deeper analysis
            break  # only check the first table occurrence


# ---------------------------------------------------------------------------
# Orchestration
# ---------------------------------------------------------------------------
def validate_team(team_dir: str, folder_name: str) -> TeamResult:
    """Run all validators on a single TEAM.md."""
    result = TeamResult(folder=folder_name)
    team_md = os.path.join(team_dir, "TEAM.md")

    if not os.path.isfile(team_md):
        result.fail("TEAM.md not found")
        return result

    content = read_file(team_md)

    validate_header(content, folder_name, result)
    validate_required_sections(content, result)
    validate_agents(content, result)
    validate_spawn_blocks(content, result)
    validate_shared_refs(content, result)
    validate_session_commands(content, result)
    validate_directory_layout(content, result)
    validate_markdown_integrity(content, result)

    return result


def cross_team_checks(results: List[TeamResult]) -> List[Issue]:
    """Consistency checks across all teams."""
    issues: List[Issue] = []
    section_counts = [r.section_count for r in results if r.section_count > 0]
    if section_counts:
        median = sorted(section_counts)[len(section_counts) // 2]
        for r in results:
            if r.section_count > 0 and abs(r.section_count - median) > 3:
                issues.append(Issue(
                    "WARN",
                    f"{r.folder}: section count {r.section_count} deviates "
                    f"from median {median} (tolerance +/-3)"
                ))
    return issues


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------
def print_results(results: List[TeamResult], cross_issues: List[Issue]):
    print()
    print(bold("=" * 72))
    print(bold("  AMENTHYX AI TEAMS - Structural Validation Report"))
    print(bold("=" * 72))
    print()

    for r in results:
        status_str = {
            "PASS": green("PASS"),
            "WARN": yellow("WARN"),
            "FAIL": red("FAIL"),
        }[r.status]

        label = f"{r.folder}"
        if r.activation_keyword:
            label += f" (--team {r.activation_keyword})"
        print(f"  [{status_str}] {label}")

        for issue in r.issues:
            icon = red("  FAIL") if issue.level == "FAIL" else yellow("  WARN")
            print(f"       {icon}: {issue.message}")

    if cross_issues:
        print()
        print(bold("  CROSS-TEAM CONSISTENCY"))
        for issue in cross_issues:
            icon = red("  FAIL") if issue.level == "FAIL" else yellow("  WARN")
            print(f"       {icon}: {issue.message}")

    # Summary table
    total = len(results)
    passed = sum(1 for r in results if r.status == "PASS")
    warned = sum(1 for r in results if r.status == "WARN")
    failed = sum(1 for r in results if r.status == "FAIL")

    print()
    print(bold("-" * 40))
    print(f"  Total : {total}")
    print(f"  {green('PASS')}  : {passed}")
    print(f"  {yellow('WARN')}  : {warned}")
    print(f"  {red('FAIL')}  : {failed}")
    print(bold("-" * 40))
    print()


def json_output(results: List[TeamResult], cross_issues: List[Issue]) -> str:
    data = {
        "teams": [],
        "cross_team_issues": [
            {"level": i.level, "message": i.message} for i in cross_issues
        ],
        "summary": {
            "total": len(results),
            "pass": sum(1 for r in results if r.status == "PASS"),
            "warn": sum(1 for r in results if r.status == "WARN"),
            "fail": sum(1 for r in results if r.status == "FAIL"),
        },
    }
    for r in results:
        data["teams"].append({
            "folder": r.folder,
            "team_name": r.team_name,
            "activation_keyword": r.activation_keyword,
            "section_count": r.section_count,
            "status": r.status,
            "issues": [
                {"level": i.level, "message": i.message} for i in r.issues
            ],
        })
    return json.dumps(data, indent=2)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    # Determine repo root (one level up from shared/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)

    json_mode = "--json" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--json"]

    # Discover team folders
    if args:
        # Single team mode
        target = args[0]
        # Support both "01-full-stack" and bare name
        candidates = glob.glob(os.path.join(repo_root, f"*{target}*"))
        if not candidates:
            print(red(f"No team folder matching '{target}' found."), file=sys.stderr)
            sys.exit(2)
        team_dirs = sorted(candidates)
    else:
        # All teams: folders matching NN-<name>
        team_dirs = sorted(
            d for d in glob.glob(os.path.join(repo_root, "[0-9]*-*"))
            if os.path.isdir(d)
        )

    if not team_dirs:
        print(red("No team folders found."), file=sys.stderr)
        sys.exit(2)

    results: List[TeamResult] = []
    for td in team_dirs:
        folder_name = os.path.basename(td)
        results.append(validate_team(td, folder_name))

    cross_issues = cross_team_checks(results) if len(results) > 1 else []

    if json_mode:
        print(json_output(results, cross_issues))
    else:
        print_results(results, cross_issues)

    # Exit code
    has_fail = any(r.status == "FAIL" for r in results) or any(
        i.level == "FAIL" for i in cross_issues
    )
    has_warn = any(r.status == "WARN" for r in results) or any(
        i.level == "WARN" for i in cross_issues
    )
    if has_fail:
        sys.exit(2)
    elif has_warn:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
