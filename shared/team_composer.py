#!/usr/bin/env python3
"""
team_composer.py — Build custom hybrid teams by picking agents from existing teams.

Parses TEAM.md files, extracts individual agent definitions, and generates
a valid composite TEAM.md combining selected agents from multiple source teams.

Usage:
    # CLI mode — pick agents from multiple teams
    python shared/team_composer.py \
        --from fullStack:BE,FE \
        --from fintech:SECCOMP \
        --from qaAutomation:QA \
        --name "Custom FinTech Web Team" \
        --keyword customFintech \
        --focus "FinTech web application with compliance" \
        --output custom-team/TEAM.md

    # Interactive mode
    python shared/team_composer.py --interactive

Pure Python 3.8+, no external dependencies.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
import textwrap
from pathlib import Path
from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# ANSI colours (disabled when stdout is not a terminal)
# ---------------------------------------------------------------------------

_COLOR = hasattr(sys.stdout, "isatty") and sys.stdout.isatty()


def _c(code: str, text: str) -> str:
    return f"\033[{code}m{text}\033[0m" if _COLOR else text


def green(t: str) -> str:
    return _c("32", t)


def yellow(t: str) -> str:
    return _c("33", t)


def red(t: str) -> str:
    return _c("31", t)


def cyan(t: str) -> str:
    return _c("36", t)


def bold(t: str) -> str:
    return _c("1", t)


def dim(t: str) -> str:
    return _c("2", t)


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
AUTO_ROLES = {"TL", "PM", "JUDGE"}
QA_ROLES = {"QA", "QAENG", "QALEAD", "SECQA"}
ENGINEERING_INDICATORS = {
    "BE", "FE", "MOB", "DEVOPS", "INFRA", "SRE", "DBA", "API", "PIE", "CE",
    "FDE", "FCEE", "FTA", "SE", "RE", "PE", "DE", "AE", "ML", "DS", "CV",
    "NLP", "IOT", "EMB", "GD", "BC", "WEB3", "AGENT", "ARCH", "ENG",
}


# ---------------------------------------------------------------------------
# Team discovery
# ---------------------------------------------------------------------------

def discover_teams() -> Dict[str, Tuple[str, str, Path]]:
    """Return {keyword: (display_name, focus, path)} for every team in the repo."""
    teams: Dict[str, Tuple[str, str, Path]] = {}
    for entry in sorted(REPO_ROOT.iterdir()):
        team_file = entry / "TEAM.md"
        if not team_file.is_file():
            continue
        keyword = ""
        name = ""
        focus = ""
        with open(team_file, "r", encoding="utf-8") as fh:
            for line in fh:
                if line.startswith("# Activation:"):
                    m = re.search(r"--team\s+([A-Za-z0-9_-]+)", line)
                    if m:
                        keyword = m.group(1)
                elif line.startswith("# Focus:"):
                    focus = line.split(":", 1)[1].strip()
                elif line.startswith("# ") and not keyword and not name:
                    name = line.lstrip("# ").strip()
                if keyword and focus:
                    break
        if keyword:
            teams[keyword] = (name or keyword, focus, team_file)
    return teams


# ---------------------------------------------------------------------------
# Agent extraction
# ---------------------------------------------------------------------------

def parse_agents_from_team(team_path: str) -> List[dict]:
    """Parse a TEAM.md and return a list of agent dicts.

    Each dict: {
        'role_code': str,       # e.g. 'BE', 'FE'
        'role_name': str,       # e.g. 'Backend Engineer'
        'number': str,          # e.g. '2.3'
        'role_line': str,       # full Role field value
        'persona': str,         # persona text (without outer quotes)
        'responsibilities': str,# if present
        'spawning': str,        # spawning info
        'source_team': str,     # file path
        'raw_block': str,       # original markdown block
    }
    """
    path = Path(team_path)
    if not path.is_file():
        print(red(f"ERROR: File not found: {team_path}"))
        sys.exit(1)

    text = path.read_text(encoding="utf-8")

    # Find section 2 (Team Roster)
    roster_match = re.search(
        r"^## 2\.\s+TEAM ROSTER.*$",
        text,
        re.MULTILINE | re.IGNORECASE,
    )
    if not roster_match:
        print(red(f"ERROR: Could not find '## 2. TEAM ROSTER' in {team_path}"))
        return []

    # End of section 2: next top-level ## that isn't part of roster
    roster_start = roster_match.end()
    next_section = re.search(r"^## \d+\.", text[roster_start:], re.MULTILINE)
    roster_text = text[roster_start: roster_start + next_section.start()] if next_section else text[roster_start:]

    # Split into agent blocks on ### headers
    agent_pattern = re.compile(
        r"^###\s+(?:(\d+\.\d+)\s+)?(.+?)\s*\((\w+)\)\s*$",
        re.MULTILINE,
    )
    matches = list(agent_pattern.finditer(roster_text))

    agents: List[dict] = []
    for i, m in enumerate(matches):
        block_start = m.start()
        block_end = matches[i + 1].start() if i + 1 < len(matches) else len(roster_text)
        raw_block = roster_text[block_start:block_end].strip()

        number = m.group(1) or ""
        role_name = m.group(2).strip()
        role_code = m.group(3).strip()

        # Extract fields from the block
        role_line = _extract_field(raw_block, "Role")
        persona = _extract_field(raw_block, "Persona")
        responsibilities = _extract_field(raw_block, "Responsibilities")
        spawning = _extract_field(raw_block, "Spawning")

        # Clean persona: strip surrounding quotes
        if persona.startswith('"') and persona.endswith('"'):
            persona = persona[1:-1]

        agents.append({
            "role_code": role_code,
            "role_name": role_name,
            "number": number,
            "role_line": role_line,
            "persona": persona,
            "responsibilities": responsibilities,
            "spawning": spawning,
            "source_team": str(path),
            "raw_block": raw_block,
        })

    return agents


def _extract_field(block: str, field_name: str) -> str:
    """Extract a **Field**: value from a markdown block, handling multi-line."""
    pattern = re.compile(
        rf"^\s*-\s+\*\*{field_name}\*\*:\s*(.+?)(?=\n\s*-\s+\*\*|\n###|\n---|\Z)",
        re.MULTILINE | re.DOTALL,
    )
    m = pattern.search(block)
    if not m:
        return ""
    return re.sub(r"\s+", " ", m.group(1)).strip()


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

def validate_composition(agents: List[dict]) -> List[str]:
    """Validate selected agents. Returns a list of warnings (empty = all good).

    Raises SystemExit on hard errors.
    """
    warnings: List[str] = []
    codes = {a["role_code"] for a in agents}

    # Hard: at least 1 engineering agent
    eng_agents = codes - AUTO_ROLES - {"MKT", "LEGAL", "RM"} - QA_ROLES
    if not eng_agents:
        print(red("ERROR: At least 1 engineering agent is required."))
        sys.exit(1)

    # Hard: no duplicate role codes
    seen: Dict[str, str] = {}
    for a in agents:
        rc = a["role_code"]
        if rc in seen:
            print(red(
                f"ERROR: Duplicate role code '{rc}' — "
                f"first from {seen[rc]}, second from {a['source_team']}"
            ))
            sys.exit(1)
        seen[rc] = a["source_team"]

    # Warn: no QA agent
    if not codes & QA_ROLES:
        warnings.append("No QA-type agent selected. Consider adding one for test coverage.")

    # Warn: no Release Manager
    if "RM" not in codes:
        warnings.append("No Release Manager (RM) selected. Release wave will be skipped.")

    return warnings


# ---------------------------------------------------------------------------
# TEAM.md generation
# ---------------------------------------------------------------------------

def _build_auto_agents(focus: str) -> List[dict]:
    """Return the mandatory TL, PM, JUDGE agent dicts."""
    return [
        {
            "role_code": "TL",
            "role_name": "Team Leader",
            "number": "2.1",
            "role_line": "Chief orchestrator. Runs as the PRIMARY foreground agent.",
            "persona": (
                f"You are the Team Leader of a custom-composed engineering team. "
                f"Your team focus: {focus}. You coordinate all work, make final "
                f"architectural decisions, enforce quality gates, and ensure the "
                f"project ships on time. You communicate clearly, delegate "
                f"effectively, and maintain a single source of truth in the "
                f"`.team/` directory. You never write production code directly "
                f"-- you orchestrate others."
            ),
            "responsibilities": (
                "Spawns all other agents, aggregates decisions, enforces quality "
                "gates, manages `.team/` state, resolves conflicts."
            ),
            "spawning": "Always foreground. This IS the main orchestration loop.",
            "source_team": "auto",
            "raw_block": "",
        },
        {
            "role_code": "PM",
            "role_name": "Project Manager",
            "number": "2.2",
            "role_line": "Planning, tracking, reporting, GitHub Project management.",
            "persona": (
                "You are the Project Manager. You create all planning artifacts "
                "and manage the project via GitHub Projects using `gh` CLI. You "
                "create milestones, issues with labels, and track progress. You "
                "generate PPTX status presentations using python-pptx and PDF "
                "summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md "
                "for GitHub commands."
            ),
            "responsibilities": (
                "Creates project charter, milestones, kanban. Uses `gh` CLI to "
                "create GitHub Project board, milestones, and issues. Generates "
                "PPTX + PDF reports."
            ),
            "spawning": "Always FIRST, always foreground.",
            "source_team": "auto",
            "raw_block": "",
        },
        {
            "role_code": "JUDGE",
            "role_name": "Judge Agent",
            "number": "",
            "role_line": "Impartial evaluation of competing plans and proposals.",
            "persona": (
                "You are the Judge Agent. You evaluate competing plans and "
                "design alternatives with rigorous objectivity. You NEVER "
                "produce plans yourself -- you only analyze plans produced by "
                "others. You assess each alternative against the project "
                "strategy, constraints, risk profile, and success criteria. You "
                "use a structured 7-criterion scoring rubric and must explain "
                "your reasoning transparently. You identify hidden assumptions, "
                "missing considerations, and risks that plan authors may have "
                "overlooked. Your output is a VERDICT document that ranks "
                "alternatives with weighted scores and selects a winner. You are "
                "impartial -- you evaluate based on merit, not authorship."
            ),
            "responsibilities": (
                "Scores PM-generated plan alternatives using a 7-criterion "
                "weighted rubric. Identifies hidden assumptions and missing "
                "considerations. Produces a VERDICT document. "
                "See `shared/JUDGE_PROTOCOL.md`."
            ),
            "spawning": "After PM, before engineering waves (foreground, blocking)",
            "source_team": "auto",
            "raw_block": "",
        },
    ]


def _classify_wave(agent: dict) -> str:
    """Determine which wave an agent belongs to."""
    code = agent["role_code"]
    spawning = agent.get("spawning", "").lower()
    if code in AUTO_ROLES:
        return "auto"
    if code in {"MKT", "LEGAL"}:
        return "1.5"
    if code in QA_ROLES:
        return "3"
    if code == "RM":
        return "4"
    if "wave 3" in spawning or "after engineering" in spawning:
        return "3"
    if "wave 4" in spawning or "after qa" in spawning:
        return "4"
    if "wave 1.5" in spawning or "background" in spawning:
        return "1.5"
    return "2"


def _render_agent_block(idx: int, agent: dict) -> str:
    """Render a single agent's roster entry."""
    number = f"2.{idx}"
    lines = [f"### {number} {agent['role_name']} ({agent['role_code']})"]
    lines.append(f"- **Role**: {agent['role_line']}")
    if agent.get("responsibilities"):
        lines.append(f"- **Responsibilities**: {agent['responsibilities']}")
    lines.append(f'- **Persona**: "{agent["persona"]}"')
    lines.append(f"- **Spawning**: {agent['spawning']}")
    return "\n".join(lines)


def _render_org_chart(agents: List[dict]) -> str:
    """Build a simple ASCII org chart."""
    wave15 = [a for a in agents if _classify_wave(a) == "1.5"]
    wave2 = [a for a in agents if _classify_wave(a) == "2"]
    wave3 = [a for a in agents if _classify_wave(a) == "3"]
    wave4 = [a for a in agents if _classify_wave(a) == "4"]

    lines = [
        "```",
        "                        +-----------+",
        "                        |   USER    |",
        "                        +-----+-----+",
        "                              |",
        "                     +--------v--------+",
        "                     |  TEAM LEADER    |",
        "                     |  (Orchestrator) |",
        "                     +--------+--------+",
        "                              |",
    ]

    # PM + wave 1.5 row
    pm_row_items = ["PM"]
    for a in wave15:
        pm_row_items.append(a["role_code"])
    row_labels = "    ".join(f"[{r}]" for r in pm_row_items)
    lines.append(f"             {row_labels}")
    lines.append("                              |")

    # Engineering wave
    if wave2:
        eng_labels = "  ".join(f"[{a['role_code']}]" for a in wave2)
        lines.append(f"         {eng_labels}")
        lines.append("                              |")

    # QA wave
    if wave3:
        qa_labels = "  ".join(f"[{a['role_code']}]" for a in wave3)
        lines.append(f"                       {qa_labels}")
        lines.append("                              |")

    # Release wave
    if wave4:
        rm_labels = "  ".join(f"[{a['role_code']}]" for a in wave4)
        lines.append(f"                       {rm_labels}")

    lines.append("```")
    return "\n".join(lines)


def _render_spawn_blocks(agents: List[dict]) -> str:
    """Generate Section 4 spawn blocks for each agent."""
    parts: List[str] = []

    # PM spawn
    parts.append(textwrap.dedent("""\
        ### Spawn: Project Manager (Foreground, Sequential)
        ```
        Task(
          subagent_type="general-purpose",
          description="PM: Project planning",
          prompt=\"\"\"
          [PM PERSONA]

          PROJECT STRATEGY:
          {strategy_file_content}

          YOUR TASKS:
          1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
          2. Create Milestone Plan -> `.team/MILESTONES.md`
          3. Create Kanban -> `.team/KANBAN.md`
          4. Create Timeline -> `.team/TIMELINE.md`
          5. Create Risk Register -> `.team/RISK_REGISTER.md`
          6. Set up GitHub Project board, milestones, labels, and issues
          7. pip install python-pptx reportlab
          8. Generate initial PPTX -> `.team/reports/status_001.pptx`
          9. Generate initial PDF -> `.team/reports/activity_001.pdf`

          IMPORTANT -- MULTI-PLAN REQUIREMENT (Judge Protocol):
          Produce at least 2 (ideally 3) alternative plans in `.team/plans/`.
          See shared/JUDGE_PROTOCOL.md for required structure.
        \"\"\"
        )
        ```"""))

    # Judge spawn
    parts.append(textwrap.dedent("""\

        ### Spawn: Judge Agent (Foreground, Sequential -- After PM)
        ```
        Task(
          subagent_type="general-purpose",
          description="JUDGE: Evaluate PM plan alternatives",
          prompt=\"\"\"
          [JUDGE PERSONA from shared/JUDGE_PROTOCOL.md]

          PROJECT STRATEGY:
          {strategy_file_content}

          PLANS TO EVALUATE:
          Read all .team/plans/PLAN_*.md files produced by PM.

          OUTPUT: Write verdict to .team/plans/VERDICT.md
          \"\"\"
        )
        GATE: VERDICT.md must exist with a clear winner before engineering waves proceed.
        ```"""))

    # Group remaining agents by wave
    wave15 = [a for a in agents if _classify_wave(a) == "1.5"]
    wave2 = [a for a in agents if _classify_wave(a) == "2"]
    wave3 = [a for a in agents if _classify_wave(a) == "3"]
    wave4 = [a for a in agents if _classify_wave(a) == "4"]

    if wave15:
        parts.append("")
        names = " + ".join(f"{a['role_name']}" for a in wave15)
        parts.append(f"### Spawn: {names} (Background, Parallel)")
        parts.append("```")
        for a in wave15:
            parts.append(
                f'Task(subagent_type="general-purpose", '
                f'description="{a["role_code"]}: {a["role_name"]}", '
                f'run_in_background=True,\n'
                f'  prompt="[{a["role_code"]} PERSONA] + PROJECT STRATEGY '
                f'+ PROJECT CHARTER -> write to .team/{a["role_code"].lower()}/")'
            )
        parts.append("```")

    if wave2:
        codes = ", ".join(a["role_code"] for a in wave2)
        parts.append(f"\n### Spawn: Engineering Wave (Background, Parallel -- {len(wave2)} agents)")
        parts.append("```")
        for a in wave2:
            folder = a["role_code"].lower()
            parts.append(f"{a['role_code']} -> .team/{folder}/")
        parts.append("```")

    if wave3:
        parts.append("\n### Spawn: QA (Foreground, Sequential -- After Engineering)")
        parts.append("```")
        for a in wave3:
            parts.append(f"{a['role_code']} -> .team/qa/")
        parts.append("GATE: QA_SIGNOFF.md must contain status: PASS")
        parts.append("```")

    if wave4:
        parts.append("\n### Spawn: Release (Foreground, Sequential -- After QA Pass)")
        parts.append("```")
        for a in wave4:
            parts.append(f"{a['role_code']} -> .team/releases/")
        parts.append("GATE: DEPLOYMENT_SIGNOFF.md must be approved")
        parts.append("```")

    return "\n".join(parts)


def _render_wave_plan(agents: List[dict]) -> str:
    """Generate the wave-based execution plan."""
    wave15 = [a for a in agents if _classify_wave(a) == "1.5"]
    wave2 = [a for a in agents if _classify_wave(a) == "2"]
    wave3 = [a for a in agents if _classify_wave(a) == "3"]
    wave4 = [a for a in agents if _classify_wave(a) == "4"]

    lines = ["```"]
    lines.append("WAVE 0: INITIALIZATION")
    lines.append("+-- Team Leader spawns (foreground)")
    lines.append("+-- Read strategy file")
    lines.append("+-- Create .team/ directory structure")
    lines.append("")
    lines.append("WAVE 1: PLANNING (Sequential -- PM foreground)")
    lines.append("+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register")
    lines.append("+-- PM: GitHub Project board + milestones + issues")
    lines.append("+-- PM: Initial PPTX + PDF")
    lines.append("+-- GATE: All PM artifacts exist")
    lines.append("")
    lines.append("WAVE 1.1: EVALUATION (Sequential -- JUDGE foreground)")
    lines.append("+-- JUDGE: Evaluate PM plan alternatives")
    lines.append("+-- GATE: VERDICT.md exists with clear winner")

    if wave15:
        lines.append("")
        lines.append(f"WAVE 1.5: RESEARCH (Background, Parallel -- {len(wave15)} agents)")
        for a in wave15:
            lines.append(f"+-- {a['role_code']}: {a['role_name']}")
        lines.append("+-- These run concurrently with Wave 2")

    if wave2:
        lines.append("")
        lines.append(f"WAVE 2: ENGINEERING (Background, Parallel -- {len(wave2)} agents)")
        for a in wave2:
            lines.append(f"+-- {a['role_code']}: {a['role_name']}")
        lines.append("+-- SYNC: TL waits for all agents")

    lines.append("")
    lines.append("WAVE 2.5: PM REPORTING")
    lines.append("+-- PM: Update PPTX + PDF")
    lines.append("+-- PM: Update GitHub issues + KANBAN.md")

    if wave3:
        lines.append("")
        lines.append("WAVE 3: QA (Sequential Gate)")
        lines.append("+-- GATE: All engineering artifacts exist")
        for a in wave3:
            lines.append(f"+-- {a['role_code']}: {a['role_name']}")
        lines.append("+-- GATE: QA_SIGNOFF.md = PASS")
        lines.append("")
        lines.append("WAVE 3.5: BUG FIX LOOP (Conditional)")
        lines.append("+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS")

    if wave4:
        lines.append("")
        gate_parts = ["QA PASS"]
        if any(a["role_code"] == "LEGAL" for a in agents):
            gate_parts.append("Legal compliance")
        if any(a["role_code"] == "MKT" for a in agents):
            gate_parts.append("Marketing ready")
        lines.append(f"WAVE 4: RELEASE (Sequential Gate)")
        lines.append(f"+-- GATE: {' + '.join(gate_parts)}")
        for a in wave4:
            lines.append(f"+-- {a['role_code']}: {a['role_name']}")
        lines.append("+-- GATE: DEPLOYMENT_SIGNOFF.md approved")

    lines.append("")
    lines.append("WAVE 5: FINAL REPORTING")
    lines.append("+-- PM: final PPTX + PDF")
    lines.append("+-- PM: close all GitHub milestones")
    lines.append("+-- TL: present summary to user")
    lines.append("```")
    return "\n".join(lines)


def _evidence_rows(agents: List[dict]) -> str:
    """Build evidence table rows for engineering/QA agents."""
    rows = []
    for a in agents:
        if a["role_code"] in AUTO_ROLES or a["role_code"] in {"MKT", "LEGAL"}:
            continue
        code = a["role_code"]
        rows.append(
            f"| {code} | Build log, test results, runtime proof | "
            f"`.team/evidence/{code.lower()}_build.log` |"
        )
    return "\n".join(rows)


def generate_team_md(name: str, keyword: str, focus: str, agents: List[dict]) -> str:
    """Generate a complete TEAM.md from the given parameters and agent list."""

    # Prepend auto agents (TL, PM, JUDGE), filter out any user-selected dupes
    user_codes = {a["role_code"] for a in agents}
    auto_agents = [a for a in _build_auto_agents(focus) if a["role_code"] not in user_codes]
    all_agents = auto_agents + agents

    # Re-number
    roster_blocks: List[str] = []
    for i, a in enumerate(all_agents):
        idx = i + 1
        roster_blocks.append(_render_agent_block(idx, a))

    # Build the role list for evidence manifests
    evidence_manifest_entries = []
    for a in all_agents:
        if a["role_code"] not in {"MKT", "LEGAL"}:
            evidence_manifest_entries.append(
                f"|   +-- {a['role_code']}_manifest.md"
            )

    total = len(all_agents)
    non_auto = [a for a in all_agents if a["role_code"] not in AUTO_ROLES]

    # Assemble sections
    md = f"""\
# {name}
# Activation: `--team {keyword}`
# Focus: {focus}

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Quality Gates](#7-quality-gates)
8. [`.team/` Directory Layout](#8-team-directory-layout)
9. [Decision Aggregation Protocol](#9-decision-aggregation-protocol)
10. [Reporting System -- PPTX & PDF](#10-reporting-system--pptx--pdf)
11. [Error Handling & Recovery](#11-error-handling--recovery)
12. [Session Management](#12-session-management)
13. [Evidence & Proof Protocol](#13-evidence--proof-protocol)
14. [Local Install & Test Protocol](#14-local-install--test-protocol)
15. [Atomic Commit Protocol](#15-atomic-commit-protocol)
16. [Comprehensive Testing Matrix](#16-comprehensive-testing-matrix)
17. [GitHub Actions -- Local Testing](#17-github-actions--local-testing)
18. [PM Kanban -- Real-Time Tracking](#18-pm-kanban--real-time-tracking)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team {keyword} --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 8)
4. Spawn Team Leader agent (foreground -- this is the orchestrator)
5. Team Leader spawns PM agent (foreground -- must complete before others)
6. PM produces Project Charter + Initial Plan + creates GitHub Project
7. Team Leader reviews PM output, then spawns remaining agents in waves
8. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, features, and success criteria.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

### Composition Source
This team was composed from agents across multiple source teams using `shared/team_composer.py`.

---

## 2. TEAM ROSTER & PERSONAS

{chr(10).join(roster_blocks)}

---

## 3. ORGANIZATIONAL HIERARCHY

{_render_org_chart(all_agents)}

---

## 4. SUBAGENT ORCHESTRATION ENGINE

{_render_spawn_blocks(non_auto)}

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | Role + priority + wave labels |
| Releases | `.team/releases/` | `gh release create` |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

{_render_wave_plan(all_agents)}

---

## 7. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| Engineering Complete | After Wave 2 | All engineering artifacts exist | Re-spawn specific agent |
| QA Pass | After QA | `QA_SIGNOFF.md` status: PASS | Enter Bug Fix Loop |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_SIGNOFF.md` approved | RM lists blocking items |
| Evidence Complete | Before QA | Every agent has evidence manifest, all items checked | Re-spawn agent to collect evidence |
| Local Build Passes | Before QA | `build.log` shows zero errors, zero warnings | Re-spawn responsible engineer |
| Test Coverage Gate | Before Release | Unit >= 80%, integration tests pass, E2E critical paths pass | Enter Bug Fix Loop |
| CI Validation Gate | Before push | `act push` succeeds locally, `actionlint` clean | Fix workflow, re-test |
| No Secrets Gate | Every commit | `gitleaks detect` finds zero secrets in staged changes | HARD STOP, rotate secrets immediately |
| Dependency Audit Gate | Before Release | `npm audit`, `pip-audit` show zero CRITICAL/HIGH vulnerabilities | Fix or document accepted exceptions |

---

## 8. `.team/` DIRECTORY LAYOUT

```
.team/
+-- PROJECT_CHARTER.md
+-- MILESTONES.md
+-- KANBAN.md
+-- TIMELINE.md
+-- RISK_REGISTER.md
+-- DECISION_LOG.md
+-- plans/
|   +-- PLAN_A.md
|   +-- PLAN_B.md
|   +-- PLAN_C.md
|   +-- VERDICT.md
+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- COMMIT_LOG.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- manifests/
{chr(10).join(evidence_manifest_entries)}
|   +-- builds/
|   +-- tests/
|   |   +-- static/
|   |   +-- unit/
|   |   +-- integration/
|   |   +-- e2e/
|   |   +-- performance/
|   |   +-- security/
|   +-- screenshots/
|   +-- runtime/
|   +-- deps/
|   +-- diffs/
|   +-- ci/
|   |   +-- act_push.log
|   |   +-- actionlint.log
|   +-- validation/
+-- ci/
|   +-- .github/
|       +-- workflows/
|           +-- ci.yml
|           +-- deploy.yml
+-- qa/
+-- releases/
```

---

## 9. DECISION AGGREGATION PROTOCOL

When decisions are needed:
1. TL identifies decision point
2. For major decisions (architecture, stack, scope): PM produces 2-3 alternative plans -> `.team/plans/`
3. TL spawns Judge Agent to evaluate alternatives (see `shared/JUDGE_PROTOCOL.md`)
4. Judge produces scored VERDICT -> `.team/plans/VERDICT.md`
5. TL reviews VERDICT and presents winning plan to team (may override with documented rationale)
6. For minor decisions: TL spawns relevant agents, collects responses, majority wins
7. Critical decisions: escalate to user; TL tie-breaks for time-sensitive

---

## 10. REPORTING SYSTEM -- PPTX & PDF

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion

### Enhanced Report Contents

Every PPTX and PDF report MUST include:

1. **Evidence Dashboard** -- count of evidence artifacts per agent, verification status per role
2. **Commit Activity** -- commits per wave, per agent, with linked issue references
3. **Test Coverage Trend** -- line coverage percentage over time from evidence files
4. **CI/CD Status** -- GitHub Actions workflow pass/fail, local `act` validation results
5. **Kanban Velocity** -- cards moved per reporting period, burn-down chart data, blocked items
6. **Blocking Issues** -- time spent blocked, dependency resolution tracking, escalations

---

## 11. ERROR HANDLING & RECOVERY

- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent

---

## 12. SESSION MANAGEMENT

| Command | Action |
|---------|--------|
| `--team {keyword} --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team judge` | Spawn Judge to evaluate current plans in `.team/plans/` |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

## 13. EVIDENCE & PROOF PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 1

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works.

### Evidence Requirements

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
{_evidence_rows(all_agents)}

### Evidence Manifest (Per Agent)

Every agent writes to `.team/evidence/manifests/{{ROLE}}_manifest.md`:

```markdown
# Evidence Manifest -- {{AGENT_ROLE}}
## Task: {{task_description}}
## Date: {{ISO_8601_timestamp}}

### Artifacts Produced
- [ ] `path/to/artifact.md` -- description

### Evidence Collected
- [ ] Build log: `.team/evidence/{{role}}_build.log`
- [ ] Test results: `.team/evidence/tests/{{role}}_results.xml`
- [ ] Runtime proof: `.team/evidence/runtime/{{role}}_health.log`

### Status: VERIFIED / UNVERIFIED
```

---

## 14. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally as if deploying to production. No "it works in theory."

### General Install Protocol

```bash
# STEP 1: Environment verification
# (agent verifies language/runtime versions)

# STEP 2: Dependency installation
# (agent installs project dependencies and runs audit)

# STEP 3: Lint and format
# (agent runs linters and formatters, saves output to .team/evidence/)

# STEP 4: Build
# (agent runs build command, tees output to .team/evidence/builds/)

# STEP 5: Test
# (agent runs test suite with coverage, saves results to .team/evidence/tests/)

# STEP 6: Run locally and verify
# (agent starts service, hits health endpoint, captures proof)
```

---

## 15. ATOMIC COMMIT PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 3

### Mandate
Every single meaningful change MUST be a separate git commit. The PM tracks each commit and links it to the GitHub kanban board.

### Commit Format (Conventional Commits)

```
<type>(<scope>): <description> [#issue_number]

<body>

Evidence: .team/evidence/{{relevant_evidence_file}}
Agent: {{AGENT_ROLE}}
Wave: {{wave_number}}
```

### Commit Types

| Type | When |
|------|------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `test` | Adding or updating tests |
| `docs` | Documentation changes |
| `ci` | CI/CD pipeline changes |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `security` | Security fix or hardening |
| `chore` | Build, dependency, config changes |
| `evidence` | Adding proof/evidence artifacts |

### Rules

1. **One logical change per commit** -- never bundle unrelated changes
2. **Reference issue number** -- `feat(api): add user endpoint [#12]`
3. **Include evidence reference** -- point to proof in `.team/evidence/`
4. **Never commit secrets** -- use `.gitignore`, verify with `gitleaks detect`
5. **Run pre-commit hooks** -- never skip with `--no-verify`

---

## 16. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### Test Pyramid

```
                    +----------+
                    | Release  |  <- Deployment verification in staging
                   +------------+
                   |   E2E      |  <- Full user flow tests
                  +--------------+
                  | Integration   |  <- Cross-module tests
                 +----------------+
                 |   Unit Tests    |  <- Function/component level
                +------------------+
                |   Static Analysis |  <- Linters + type checkers
                +------------------+
```

### Coverage Requirements

| Layer | Minimum | Blocking? |
|-------|---------|-----------|
| Static Analysis | 100% files scanned | YES |
| Unit Tests | >= 80% line coverage | YES |
| Integration Tests | All API endpoints + data operations | YES |
| E2E Tests | All P0 critical user flows | YES |
| Performance Tests | P95 latency within strategy target | WARN |
| Security Tests | Zero CRITICAL/HIGH vulnerabilities | YES |

---

## 17. GITHUB ACTIONS -- LOCAL TESTING

### Pre-Push Validation

```bash
# Install act (GitHub Actions local runner)
# Run the push workflow locally
act push 2>&1 | tee .team/evidence/ci/act_push.log

# Lint workflow files
actionlint .github/workflows/*.yml 2>&1 | tee .team/evidence/ci/actionlint.log
```

### CI Validation Gate
- `act push` must succeed before any `git push`
- `actionlint` must report zero errors
- Failed CI = HARD STOP, fix before proceeding

---

## 18. PM KANBAN -- REAL-TIME TRACKING

### Card States

| State | Meaning |
|-------|---------|
| `BACKLOG` | Not yet started |
| `IN_PROGRESS` | Agent actively working |
| `IN_REVIEW` | Awaiting TL review or QA |
| `BLOCKED` | Dependency or issue blocking |
| `DONE` | Completed with evidence |

### PM Updates KANBAN.md After Every

- Agent spawn (card -> IN_PROGRESS)
- Agent completion (card -> IN_REVIEW)
- TL approval (card -> DONE)
- Blocker identified (card -> BLOCKED with reason)
- Bug fix loop iteration

### Velocity Tracking

PM calculates and reports:
- Cards completed per wave
- Average time per card
- Blocked time per card
- Burn-down progress vs. timeline
"""

    return md


# ---------------------------------------------------------------------------
# Interactive mode
# ---------------------------------------------------------------------------

def interactive_compose() -> None:
    """Walk the user through selecting agents interactively."""
    print(bold("\n=== Amenthyx AI Teams -- Team Composer (Interactive) ===\n"))

    teams = discover_teams()
    if not teams:
        print(red("ERROR: No teams found in repository."))
        sys.exit(1)

    # List teams
    sorted_keys = sorted(teams.keys())
    print(cyan("Available teams:\n"))
    for i, kw in enumerate(sorted_keys, 1):
        name, focus, _ = teams[kw]
        print(f"  {dim(str(i).rjust(3))}. {bold(kw.ljust(28))} {name}")
        print(f"       {dim(focus[:80])}")
    print()

    selected_agents: List[dict] = []
    selected_codes: set = set()

    while True:
        raw = input(cyan("\nPick a team number (or 'done' to finish): ")).strip()
        if raw.lower() == "done":
            break
        try:
            idx = int(raw) - 1
            if idx < 0 or idx >= len(sorted_keys):
                print(red("Invalid number."))
                continue
        except ValueError:
            # Try matching keyword
            if raw in teams:
                kw = raw
            else:
                print(red("Enter a number or a team keyword."))
                continue
            idx = sorted_keys.index(kw)

        kw = sorted_keys[idx]
        name, focus, path = teams[kw]
        print(f"\n  {bold(name)} ({kw})")

        agents = parse_agents_from_team(str(path))
        # Filter out TL, PM, JUDGE (auto-included)
        selectable = [a for a in agents if a["role_code"] not in AUTO_ROLES]

        if not selectable:
            print(yellow("  No selectable agents in this team (only TL/PM/JUDGE)."))
            continue

        print(cyan("  Available agents:"))
        for a in selectable:
            marker = green(" [already selected]") if a["role_code"] in selected_codes else ""
            print(f"    {bold(a['role_code'].ljust(10))} {a['role_name']}{marker}")

        codes_input = input(
            cyan("  Enter role codes (comma-separated, e.g. BE,FE): ")
        ).strip().upper()

        if not codes_input:
            continue

        requested = [c.strip() for c in codes_input.split(",") if c.strip()]
        avail_map = {a["role_code"]: a for a in selectable}

        for code in requested:
            if code in selected_codes:
                print(yellow(f"    {code} already selected, skipping."))
                continue
            if code not in avail_map:
                print(red(f"    {code} not found in {kw}. Available: {', '.join(avail_map.keys())}"))
                continue
            selected_agents.append(avail_map[code])
            selected_codes.add(code)
            print(green(f"    + Added {code} ({avail_map[code]['role_name']}) from {kw}"))

    if not selected_agents:
        print(red("No agents selected. Exiting."))
        sys.exit(1)

    # Get metadata
    print()
    team_name = input(cyan("Team name: ")).strip()
    if not team_name:
        team_name = "Custom Composed Team"
    team_keyword = input(cyan("Activation keyword (no spaces): ")).strip()
    if not team_keyword:
        team_keyword = "customTeam"
    team_focus = input(cyan("Team focus (one line): ")).strip()
    if not team_focus:
        team_focus = "Custom composed team"
    output_path = input(cyan("Output path [custom-team/TEAM.md]: ")).strip()
    if not output_path:
        output_path = "custom-team/TEAM.md"

    # Validate
    warnings = validate_composition(selected_agents)
    for w in warnings:
        print(yellow(f"  WARNING: {w}"))

    # Generate
    md = generate_team_md(team_name, team_keyword, team_focus, selected_agents)

    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(md, encoding="utf-8")

    _print_summary(team_name, team_keyword, selected_agents, str(out))


def _print_summary(name: str, keyword: str, agents: List[dict], output: str) -> None:
    """Print a human-readable summary of the composed team."""
    auto_count = len(AUTO_ROLES)
    total = auto_count + len(agents)

    print(bold(f"\n{'=' * 60}"))
    print(bold(f"  TEAM COMPOSED SUCCESSFULLY"))
    print(bold(f"{'=' * 60}"))
    print(f"  Name:       {green(name)}")
    print(f"  Keyword:    {cyan(keyword)}")
    print(f"  Agents:     {total} total ({auto_count} auto + {len(agents)} selected)")
    print(f"  Output:     {output}")
    print()
    print(f"  {dim('Auto-included:')}  TL, PM, JUDGE")
    print(f"  {dim('Selected:     ')}  {', '.join(a['role_code'] for a in agents)}")
    sources = sorted(set(a["source_team"] for a in agents if a["source_team"] != "auto"))
    if sources:
        print(f"  {dim('Source teams: ')}")
        for s in sources:
            print(f"    - {s}")
    print(bold(f"{'=' * 60}\n"))


# ---------------------------------------------------------------------------
# CLI mode
# ---------------------------------------------------------------------------

def cli_compose(args: argparse.Namespace) -> None:
    """Handle --from / --name / --keyword / --focus / --output CLI arguments."""
    teams = discover_teams()
    selected_agents: List[dict] = []

    for spec in args.from_spec:
        if ":" not in spec:
            print(red(f"ERROR: Invalid --from format '{spec}'. Expected TEAM:ROLE1,ROLE2"))
            sys.exit(1)

        team_kw, codes_str = spec.split(":", 1)
        codes = [c.strip().upper() for c in codes_str.split(",") if c.strip()]

        if team_kw not in teams:
            print(red(f"ERROR: Team '{team_kw}' not found."))
            print(f"  Available: {', '.join(sorted(teams.keys()))}")
            sys.exit(1)

        _, _, path = teams[team_kw]
        agents = parse_agents_from_team(str(path))
        avail = {a["role_code"]: a for a in agents}

        for code in codes:
            if code in AUTO_ROLES:
                print(yellow(f"  Skipping {code} (auto-included)."))
                continue
            if code not in avail:
                print(red(
                    f"ERROR: Role '{code}' not found in team '{team_kw}'. "
                    f"Available: {', '.join(k for k in avail if k not in AUTO_ROLES)}"
                ))
                sys.exit(1)
            selected_agents.append(avail[code])
            print(green(f"  + {code} ({avail[code]['role_name']}) from {team_kw}"))

    if not selected_agents:
        print(red("ERROR: No agents selected."))
        sys.exit(1)

    # Validate
    warnings = validate_composition(selected_agents)
    for w in warnings:
        print(yellow(f"  WARNING: {w}"))

    # Generate
    md = generate_team_md(args.name, args.keyword, args.focus, selected_agents)

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(md, encoding="utf-8")

    _print_summary(args.name, args.keyword, selected_agents, str(out))


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Compose custom hybrid teams from existing Amenthyx AI team agents.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Examples:
              python shared/team_composer.py \\
                --from fullStack:BE,FE \\
                --from fintech:CE \\
                --from qaAutomation:QA \\
                --name "Custom FinTech Web Team" \\
                --keyword customFintech \\
                --focus "FinTech web application with compliance" \\
                --output custom-team/TEAM.md

              python shared/team_composer.py --interactive
        """),
    )
    parser.add_argument(
        "--interactive", action="store_true",
        help="Launch interactive agent selection mode",
    )
    parser.add_argument(
        "--from", dest="from_spec", action="append", default=[],
        metavar="TEAM:ROLE1,ROLE2",
        help="Select agents from a team (repeatable)",
    )
    parser.add_argument("--name", default="Custom Team", help="Display name for the composed team")
    parser.add_argument("--keyword", default="customTeam", help="Activation keyword (no spaces)")
    parser.add_argument("--focus", default="Custom composed team", help="One-line team focus description")
    parser.add_argument("--output", default="custom-team/TEAM.md", help="Output file path")

    args = parser.parse_args()

    if args.interactive:
        interactive_compose()
    elif args.from_spec:
        cli_compose(args)
    else:
        parser.print_help()
        print(yellow("\nProvide --from specs or use --interactive mode."))
        sys.exit(1)


if __name__ == "__main__":
    main()
