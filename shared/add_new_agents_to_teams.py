#!/usr/bin/env python3
"""Add Code Review (CR), Retrospective (RETRO), and Dependency Guardian (DEPGUARD) agents to all TEAM.md files."""

import os
import re
import glob

BASE = r"C:\Users\Software Engineering\Desktop\amenthyx-ai-teams"
TEAM_FILES = sorted(glob.glob(os.path.join(BASE, "[0-9]*", "TEAM.md")))

# ── New Agent Role Blocks ──────────────────────────────────────────────────

CR_ROLE_BLOCK = """
### Code Review Agent (CR)
- **Role**: Automated code review before QA gate.
- **Responsibilities**: Reviews all engineering wave code changes for OWASP vulnerabilities, code smells, architecture drift, naming consistency, hardcoded secrets, and test coverage gaps. Produces a scored CODE_REVIEW report with PASS/CONDITIONAL_PASS/FAIL verdict. See `shared/CODE_REVIEW_PROTOCOL.md`.
- **Persona**: "You are the Code Review Agent. You review all code changes from the engineering wave with the rigor of a senior staff engineer. You check for security vulnerabilities (OWASP Top 10), code quality (DRY, SOLID, complexity), architecture compliance (does the code match the approved plan?), error handling, and test coverage. You read git diffs, analyze patterns, and produce a scored review. You are thorough but fair -- you distinguish critical issues from style preferences. Your verdict determines whether QA can proceed."
- **Spawning**: After engineering wave (Wave 2), before QA (Wave 3) -- foreground, blocking
"""

RETRO_ROLE_BLOCK = """
### Retrospective Agent (RETRO)
- **Role**: Post-wave analysis and continuous improvement.
- **Responsibilities**: Analyzes each completed wave for what went well, what went wrong, bottlenecks, and metrics vs plan. Produces actionable recommendations for the next wave. Tracks improvement trends. Extracts reusable learnings. See `shared/RETROSPECTIVE_PROTOCOL.md`.
- **Persona**: "You are the Retrospective Agent. After each wave completes, you analyze execution quality with data-driven objectivity. You compare planned vs actual metrics (time, tokens, commits, test pass rates). You identify bottlenecks, recurring issues, and unexpected outcomes. You produce actionable recommendations -- not vague advice, but specific changes for the next wave. You track trends across waves and extract reusable learnings for the team's institutional memory."
- **Spawning**: After each wave completion -- background, non-blocking
"""

DEPGUARD_ROLE_BLOCK = """
### Dependency Guardian (DEPGUARD)
- **Role**: Dependency security and license compliance auditing.
- **Responsibilities**: Audits all project dependencies for known CVEs, license compatibility, outdated packages, abandoned libraries, and dependency confusion risks. Produces a scored DEPENDENCY_AUDIT with PASS/WARN/FAIL verdict. See `shared/DEPENDENCY_GUARDIAN_PROTOCOL.md`.
- **Persona**: "You are the Dependency Guardian. You audit every dependency in the project -- direct and transitive. You check for known vulnerabilities (CVEs), license compatibility (no GPL contamination in proprietary projects), outdated packages, abandoned libraries, and supply chain risks. You run the appropriate audit tool for the package manager (npm audit, pip audit, cargo audit, etc.) and produce a comprehensive audit report. Any critical CVE or license violation is an automatic FAIL."
- **Spawning**: Before release wave (Wave 4) -- foreground, blocking
"""

# ── New directory entries ──────────────────────────────────────────────────

NEW_DIRS = """+-- retros/
|   +-- RETRO_WAVE_1.md       (Wave 1 retrospective)
|   +-- RETRO_WAVE_2.md       (Wave 2 retrospective)
+-- reviews/
|   +-- CODE_REVIEW_WAVE_2.md (Code review report)
+-- learnings/
|   +-- INDEX.md              (Searchable learning index)
+-- rollback/
|   +-- ROLLBACK_PLAN.md      (Current rollback plan)
+-- contracts/
|   +-- CONTRACT_*.md         (Cross-team handoff contracts)
"""

# ── New wave entries ──────────────────────────────────────────────────────

CR_SPAWN_BLOCK = """
### Spawn: Code Review Agent (Foreground, Blocking -- After Engineering, Before QA)
```
Task(
  subagent_type="general-purpose",
  description="CR: Review engineering wave code changes",
  prompt=\"\"\"
  [CR PERSONA from shared/CODE_REVIEW_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASK:
  1. Read all git commits from the engineering wave (git log --oneline)
  2. Review the full diff (git diff main..HEAD or relevant range)
  3. Check for: OWASP vulnerabilities, code smells, architecture drift,
     naming inconsistencies, hardcoded secrets, missing error handling,
     test coverage gaps
  4. Score using the 5-criterion rubric from shared/CODE_REVIEW_PROTOCOL.md
  5. Write report to .team/reviews/CODE_REVIEW_WAVE_N.md

  VERDICT RULES:
  - Score >= 7.0 -> PASS (proceed to QA)
  - Score 5.0-6.9 -> CONDITIONAL_PASS (proceed, track fixes as tech debt)
  - Score < 5.0 -> FAIL (engineering agents re-spawned for fixes)
  - ANY critical security finding -> automatic FAIL
  \"\"\"
)
GATE: CODE_REVIEW must be PASS or CONDITIONAL_PASS before QA wave proceeds.
```
"""

RETRO_SPAWN_BLOCK = """
### Spawn: Retrospective Agent (Background, Non-Blocking -- After Each Wave)
```
Task(
  subagent_type="general-purpose",
  description="RETRO: Analyze completed wave",
  prompt=\"\"\"
  [RETRO PERSONA from shared/RETROSPECTIVE_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  WAVE JUST COMPLETED: Wave {N}

  YOUR TASK:
  1. Analyze all events, commits, and evidence from the completed wave
  2. Compare planned vs actual: duration, token usage, agent count, test pass rate
  3. Identify bottlenecks, recurring issues, and unexpected outcomes
  4. Produce actionable recommendations for the next wave
  5. Extract reusable learnings for .team/learnings/
  6. Write retrospective to .team/retros/RETRO_WAVE_{N}.md
  \"\"\"
)
```
"""

# ── New session commands ──────────────────────────────────────────────────

NEW_COMMANDS = [
    ('| `team review` | Spawn CR agent to review current code changes |', 'team decide'),
    ('| `team retro` | Spawn RETRO agent to analyze last completed wave |', 'team decide'),
    ('| `team deps` | Spawn DEPGUARD agent to audit dependencies |', 'team decide'),
    ('| `team learnings` | Show captured learnings from .team/learnings/ |', 'team decide'),
]

stats = {"updated": 0, "skipped": 0, "errors": 0}

for team_file in TEAM_FILES:
    team_name = os.path.basename(os.path.dirname(team_file))

    try:
        with open(team_file, "r", encoding="utf-8") as f:
            content = f.read()

        # Skip if already has CR agent
        if "Code Review Agent (CR)" in content:
            print(f"  SKIP (already has CR): {team_name}")
            stats["skipped"] += 1
            continue

        original = content

        # 1. Add CR, RETRO, DEPGUARD roles after Judge Agent section
        judge_pattern = r'(- \*\*Spawning\*\*: After PM, before engineering waves \(foreground, blocking\)\s*\n)'
        match = re.search(judge_pattern, content)
        if match:
            insert_pos = match.end()
            content = content[:insert_pos] + CR_ROLE_BLOCK + RETRO_ROLE_BLOCK + DEPGUARD_ROLE_BLOCK + content[insert_pos:]

        # 2. Add CR spawn block before QA spawn (find "### Spawn:" that mentions QA)
        qa_spawn_pattern = r'(### Spawn: (?:QA|Quality|Testing|Test))'
        qa_match = re.search(qa_spawn_pattern, content)
        if qa_match:
            content = content[:qa_match.start()] + CR_SPAWN_BLOCK + "\n" + content[qa_match.start():]

        # 3. Add RETRO spawn block after QA spawn section (find Release Manager spawn or Wave 4)
        rm_pattern = r'(### Spawn: (?:Release|RM|Deployment))'
        rm_match = re.search(rm_pattern, content)
        if rm_match:
            content = content[:rm_match.start()] + RETRO_SPAWN_BLOCK + "\n" + content[rm_match.start():]

        # 4. Add new directories to .team/ layout
        if "+-- DECISION_LOG.md" in content and "+-- retros/" not in content:
            content = content.replace(
                "+-- DECISION_LOG.md",
                "+-- DECISION_LOG.md\n" + NEW_DIRS
            )

        # 5. Add new session commands
        for cmd_line, after_cmd in NEW_COMMANDS:
            if cmd_line.split('|')[1].strip() not in content:
                if after_cmd in content:
                    # Find the line containing after_cmd and add after it
                    lines = content.split('\n')
                    new_lines = []
                    for line in lines:
                        new_lines.append(line)
                        if after_cmd in line and '|' in line and cmd_line.split('|')[1].strip() not in content:
                            new_lines.append(cmd_line)
                    content = '\n'.join(new_lines)

        # 6. Update wave execution to include CR gate
        old_wave = "Wave 3: QA"
        new_wave = "Wave 2.5: Code Review (CR agent, blocking gate)\nWave 2.7: Retrospective (RETRO agent, background)\nWave 3: QA"
        if old_wave in content and "Wave 2.5: Code Review" not in content:
            content = content.replace(old_wave, new_wave)

        # 7. Add DEPGUARD to pre-release checks
        old_release = "Wave 4: Release"
        new_release = "Wave 3.8: Dependency Audit (DEPGUARD agent, blocking gate)\nWave 4: Release"
        if old_release in content and "Wave 3.8: Dependency Audit" not in content:
            content = content.replace(old_release, new_release, 1)

        # Write back if changed
        if content != original:
            with open(team_file, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"  UPDATED: {team_name}")
            stats["updated"] += 1
        else:
            print(f"  NO CHANGE: {team_name}")
            stats["skipped"] += 1

    except Exception as e:
        print(f"  ERROR: {team_name}: {e}")
        stats["errors"] += 1

print(f"\nDone: {stats['updated']} updated, {stats['skipped']} skipped, {stats['errors']} errors")
