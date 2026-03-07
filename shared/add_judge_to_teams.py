#!/usr/bin/env python3
"""Add Judge Agent role to all TEAM.md files across 60 teams."""

import os
import re
import glob

BASE = r"C:\Users\Software Engineering\Desktop\amenthyx-ai-teams"
TEAM_FILES = sorted(glob.glob(os.path.join(BASE, "[0-9]*", "TEAM.md")))

JUDGE_ROLE_BLOCK = """
### Judge Agent (JUDGE)
- **Role**: Impartial evaluation of competing plans and proposals.
- **Responsibilities**: Scores PM-generated plan alternatives using a 7-criterion weighted rubric (Strategy Alignment, Feasibility, Risk Management, Scalability, Innovation, Completeness, Efficiency). Identifies hidden assumptions and missing considerations. Produces a VERDICT document recommending the best plan with full reasoning. See `shared/JUDGE_PROTOCOL.md`.
- **Persona**: "You are the Judge Agent. You evaluate competing plans and design alternatives with rigorous objectivity. You NEVER produce plans yourself -- you only analyze plans produced by others. You assess each alternative against the project strategy, constraints, risk profile, and success criteria. You use a structured 7-criterion scoring rubric and must explain your reasoning transparently. You identify hidden assumptions, missing considerations, and risks that plan authors may have overlooked. Your output is a VERDICT document that ranks alternatives with weighted scores and selects a winner. You are impartial -- you evaluate based on merit, not authorship."
- **Spawning**: After PM, before engineering waves (foreground, blocking)
"""

JUDGE_SPAWN_BLOCK = """
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

  EVALUATION RUBRIC (7 criteria, weighted):
  Strategy Alignment (25%), Feasibility (20%), Risk Management (15%),
  Scalability (10%), Innovation (10%), Completeness (10%), Efficiency (10%)

  Score each plan 1-10 on each criterion.

  OUTPUT: Write verdict to .team/plans/VERDICT.md
  Include: scoring tables, comparative analysis, hidden assumptions,
  missing considerations, and suggested modifications to winning plan.
  \"\"\"
)
GATE: VERDICT.md must exist with a clear winner before engineering waves proceed.
TL reads VERDICT and may override with documented rationale in DECISION_LOG.md.
```
"""

PLANS_DIR_ENTRY = """+-- plans/
|   +-- PLAN_A.md          (PM alternative plan A)
|   +-- PLAN_B.md          (PM alternative plan B)
|   +-- PLAN_C.md          (PM alternative plan C, optional)
|   +-- VERDICT.md         (Judge evaluation and recommendation)
"""

PM_MULTI_PLAN_NOTE = """
  IMPORTANT -- MULTI-PLAN REQUIREMENT (Judge Protocol):
  The PM MUST produce at least 2 (ideally 3) alternative plans:
  - .team/plans/PLAN_A.md -- first approach
  - .team/plans/PLAN_B.md -- second approach (must differ meaningfully)
  - .team/plans/PLAN_C.md -- third approach (optional, recommended)
  Each plan must vary in at least 2 dimensions: architecture, technology,
  timeline, resource allocation, risk profile, or cost structure.
  See shared/JUDGE_PROTOCOL.md for the required plan document structure.
  After PM completes plans, TL spawns the Judge Agent to evaluate them.
"""

stats = {"updated": 0, "skipped": 0, "errors": 0}

for team_file in TEAM_FILES:
    team_name = os.path.basename(os.path.dirname(team_file))

    try:
        with open(team_file, "r", encoding="utf-8") as f:
            content = f.read()

        # Skip if already has Judge
        if "Judge Agent (JUDGE)" in content:
            print(f"  SKIP (already has Judge): {team_name}")
            stats["skipped"] += 1
            continue

        original = content

        # 1. Add Judge role after PM section
        # Find the PM spawning line and add Judge after it
        # Pattern: "- **Spawning**: Always FIRST, always foreground." followed by content
        pm_spawn_pattern = r'(\- \*\*Spawning\*\*: Always (?:FIRST|first).*?foreground\.?\s*\n)'
        match = re.search(pm_spawn_pattern, content)
        if match:
            insert_pos = match.end()
            content = content[:insert_pos] + JUDGE_ROLE_BLOCK + content[insert_pos:]

        # 2. Add multi-plan note to PM spawn prompt
        # Find PM spawn task block and add the note before closing """
        pm_task_pattern = r'(description="PM.*?prompt=""".*?)(""".*?\))'
        pm_match = re.search(pm_task_pattern, content, re.DOTALL)
        if pm_match:
            # Insert multi-plan note before the closing triple-quotes
            content = content[:pm_match.end(1)] + PM_MULTI_PLAN_NOTE + content[pm_match.start(2):]

        # 3. Add Judge spawn block after PM spawn
        # Find "### Spawn: Marketing" or "### Spawn:" that comes after PM spawn
        marketing_pattern = r'(### Spawn: (?:Marketing|MKT|Engineering|Wave))'
        mk_match = re.search(marketing_pattern, content)
        if mk_match:
            content = content[:mk_match.start()] + JUDGE_SPAWN_BLOCK + "\n" + content[mk_match.start():]

        # 4. Add plans/ directory to .team/ layout
        # Find DECISION_LOG.md in the directory layout
        if "+-- DECISION_LOG.md" in content:
            content = content.replace(
                "+-- DECISION_LOG.md",
                "+-- DECISION_LOG.md\n" + PLANS_DIR_ENTRY
            )

        # 5. Update the decision aggregation text (if exists)
        old_decision = "When decisions are needed:\n1. TL identifies decision point\n2. TL spawns relevant agents with decision prompt\n3. TL collects responses and synthesizes into `DECISION_LOG.md`\n4. Majority wins for non-critical; user escalation for critical; TL tie-breaks for time-sensitive"
        new_decision = """When decisions are needed:
1. TL identifies decision point
2. For major decisions (architecture, stack, scope): PM produces 2-3 alternative plans -> `.team/plans/`
3. TL spawns Judge Agent to evaluate alternatives (see `shared/JUDGE_PROTOCOL.md`)
4. Judge produces scored VERDICT -> `.team/plans/VERDICT.md`
5. TL reviews VERDICT and presents winning plan to team (may override with documented rationale)
6. For minor decisions: TL spawns relevant agents, collects responses, majority wins
7. Critical decisions: escalate to user; TL tie-breaks for time-sensitive"""

        if old_decision in content:
            content = content.replace(old_decision, new_decision)

        # 6. Update session management table -- add judge command
        if "| `team decide <topic>` | Trigger decision aggregation |" in content:
            content = content.replace(
                "| `team decide <topic>` | Trigger decision aggregation |",
                "| `team decide <topic>` | Trigger decision aggregation |\n| `team judge` | Spawn Judge to evaluate current plans in `.team/plans/` |"
            )

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
