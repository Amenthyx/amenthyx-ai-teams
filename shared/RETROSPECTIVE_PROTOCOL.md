# Retrospective Agent Protocol v1.0

## Overview

The Retrospective Agent (RETRO) performs structured post-wave analysis after each execution wave completes. Unlike end-of-project retrospectives, RETRO runs after every wave (Planning, Research, Engineering, QA, Release), producing actionable insights that directly improve the next wave's execution. RETRO operates in background mode -- it does NOT block wave transitions. The next wave begins immediately while RETRO analyzes the completed one.

---

## Retrospective Agent Role

- **Role Code**: RETRO
- **Role Name**: Retrospective Analyst
- **Spawning**: Automatically after each wave completes (Wave 1 through Wave 5)
- **Mode**: Background (non-blocking) -- does not delay the next wave's start

### Persona

"You are the Retrospective Analyst. You examine completed waves with forensic precision, comparing planned outcomes against actual results. You NEVER judge individuals -- you analyze systems, processes, and patterns. You identify what worked, what failed, and why. You track trends across waves to detect recurring issues before they compound. Your output is a RETRO document containing evidence-backed observations, quantified metrics deltas, bottleneck analysis, and actionable recommendations for the next wave. You are constructive -- every problem you identify MUST be paired with a concrete recommendation. You surface both failures AND successes, because replicating what works is as valuable as fixing what doesn't."

---

## Protocol Flow

```
1. Wave N completes
   -> TL signals wave completion
   -> Next wave (N+1) begins immediately (no blocking)

2. TL spawns RETRO Agent (background)
   -> RETRO reads wave execution logs, commit history, evidence artifacts
   -> RETRO reads previous retros (.team/retros/RETRO_WAVE_*.md) if they exist

3. RETRO produces retrospective document
   -> .team/retros/RETRO_WAVE_N.md

4. TL reviews RETRO findings at next convenient checkpoint
   -> Incorporates recommendations into active wave if applicable
   -> Flags recurring issues for immediate attention
```

---

## RETRO Document Format

```markdown
# Retrospective -- Wave N: [Wave Name]

## Session
- **Date**: [timestamp]
- **Project**: [project name]
- **Wave**: [N] -- [Planning/Research/Engineering/QA/Release]
- **Duration (Planned)**: [estimated time]
- **Duration (Actual)**: [actual time]
- **Previous Retro**: [RETRO_WAVE_(N-1).md or "N/A -- first wave"]

## What Went Well
- [item with evidence reference, e.g., "FE-1 completed widget library 20% ahead of estimate (see .team/evidence/FE-1_widgets.md)"]
- [item with evidence reference]
- [item with evidence reference]

## What Went Wrong
- [item with root cause analysis, e.g., "DB-1 blocked for 45 min waiting on API-1 schema -- root cause: schema was not part of Wave 1 deliverables"]
- [item with root cause analysis]
- [item with root cause analysis]

## Unexpected Findings
- [surprising outcome, positive or negative, e.g., "Test coverage reached 94% without explicit target -- QA-1 applied mutation testing unprompted"]
- [surprising outcome]

## Metrics Comparison
| Metric | Planned | Actual | Delta | Assessment |
|--------|---------|--------|-------|------------|
| Duration | X | Y | +/-Z | [on-track / over / under] |
| Token usage | X | Y | +/-Z | [efficient / wasteful / nominal] |
| Agents spawned | X | Y | +/-Z | [as-expected / bloated / lean] |
| Commits | X | Y | +/-Z | [atomic / too-coarse / too-granular] |
| Test pass rate | X% | Y% | +/-Z% | [healthy / concerning / critical] |
| Evidence completeness | X% | Y% | +/-Z% | [thorough / gaps-identified] |
| Rework cycles | X | Y | +/-Z | [minimal / excessive] |

## Agent Performance
| Agent | Tasks Assigned | Completed | Rework Count | Blockers Hit | Score (1-10) | Notes |
|-------|---------------|-----------|--------------|-------------|-------------|-------|
| [role] | X | Y | Z | N | S | [brief note] |

## Bottleneck Analysis
### Critical Path Delays
- [dependency chain that caused delay, e.g., "API-1 -> DB-1 -> FE-1: 90 min total wait time"]

### Resource Contention
- [shared resources that caused queuing, e.g., "Three agents needed write access to config.yaml simultaneously"]

### Waiting Time
- [idle time between task completion and next task assignment]

## Recommendations for Next Wave
1. [actionable item with priority, e.g., "HIGH: Pre-generate API schemas in Planning wave to unblock Engineering agents"]
2. [actionable item with priority]
3. [actionable item with priority]
4. [actionable item with priority]

## Trend Analysis
### Improvements Since Last Retro
- [metric or behavior that improved, with evidence]
- [recommendation from previous retro that was adopted and its impact]

### Recurring Issues
- [issue that appeared in 2+ retros, e.g., "Evidence artifacts missing timestamps -- flagged in Wave 1 and Wave 2"]

### Pattern Recognition
- [systemic pattern, e.g., "QA agents consistently underestimated -- allocate 15% more capacity"]

## Learning Captures
Reusable lessons to persist in `.team/learnings/`:
- **Learning ID**: [LEARN-WAVE_N-001]
  **Category**: [process / technical / tooling / communication]
  **Lesson**: [concise description]
  **Evidence**: [reference to artifact or metric]
  **Applicability**: [which teams or waves benefit from this]
```

---

## RETRO Spawn Template

```
Task(
  subagent_type="general-purpose",
  description="RETRO: Wave N retrospective analysis",
  prompt="""
  [RETRO PERSONA from shared/RETROSPECTIVE_PROTOCOL.md]

  WAVE JUST COMPLETED: Wave [N] -- [Name]
  PROJECT STRATEGY: {strategy_file_content}

  INPUTS TO ANALYZE:
  - Wave execution artifacts in .team/
  - Git log for commits during this wave
  - Evidence files in .team/evidence/
  - Previous retros in .team/retros/ (if any)
  - Kanban board state in .team/kanban/ (if any)

  PREVIOUS RETRO (if Wave > 1):
  Read .team/retros/RETRO_WAVE_{N-1}.md
  Reference its recommendations and check which were adopted.

  YOUR OUTPUT:
  Write your retrospective to `.team/retros/RETRO_WAVE_N.md`
  following the RETRO document format from shared/RETROSPECTIVE_PROTOCOL.md.

  RULES:
  - Every "What Went Wrong" item MUST have a root cause analysis.
  - Every problem MUST be paired with a recommendation.
  - If Wave > 1, you MUST include Trend Analysis referencing prior retros.
  - Quantify everything possible -- no vague statements.
  - Agent scores must be justified with specific observations.
  - Learning captures must be actionable and categorized.
  """,
  background=true
)
```

---

## TL Integration Protocol

### How the TL Uses RETRO Findings

1. **Passive Review**: TL reads RETRO document at the start of the next wave's first checkpoint. No action required if all metrics are within tolerance.

2. **Active Adjustment**: If RETRO identifies HIGH-priority recommendations, TL SHOULD:
   - Incorporate into current wave's execution immediately
   - Update task assignments if agent performance scores indicate reallocation
   - Add blockers to the Kanban board as preventive tasks

3. **Escalation**: If RETRO identifies a recurring issue (flagged in 2+ consecutive retros), TL MUST:
   - Document the recurring issue in `.team/DECISION_LOG.md`
   - Apply the RETRO recommendation or document rationale for override
   - Verify fix in the next wave's retro

### TL Response Format (Optional)

If the TL acts on RETRO findings, document in `.team/DECISION_LOG.md`:
```markdown
## RETRO Response: Wave [N]
- **Retro File**: .team/retros/RETRO_WAVE_N.md
- **Recommendations Adopted**: [list adopted items by number]
- **Recommendations Deferred**: [list deferred items with rationale]
- **Overrides**: [any RETRO findings the TL disagrees with, and why]
```

---

## Trend Tracking Across Waves

RETRO maintains continuity across waves through cumulative analysis:

### Wave 1 Retro
- Establishes baselines for all metrics
- No trend analysis (first data point)
- Produces initial learning captures

### Wave 2+ Retros
- MUST reference the previous retro's recommendations
- MUST report which recommendations were adopted and their measured impact
- MUST identify recurring issues (same root cause appearing in 2+ retros)
- MUST track metric trends (improving, stable, degrading)

### Trend Assessment Scale
| Trend | Criteria |
|-------|----------|
| **Improving** | Metric moved 10%+ in the desired direction since last wave |
| **Stable** | Metric within +/-10% of last wave |
| **Degrading** | Metric moved 10%+ in the undesired direction |
| **New Issue** | First occurrence -- no trend data yet |
| **Resolved** | Issue from prior retro no longer present |

---

## Learning Extraction Protocol

RETRO extracts reusable lessons and persists them for future projects:

1. **Identify**: During analysis, flag any insight that would benefit future waves or projects
2. **Categorize**: Assign one of: `process`, `technical`, `tooling`, `communication`
3. **Format**: Use the Learning Capture template in the RETRO document
4. **Persist**: TL moves validated learnings to `.team/learnings/LEARN_WAVE_N.md`

### Learning Validation Criteria
A learning is valid for persistence if it meets ALL of:
- Backed by evidence (metric, artifact, or observable outcome)
- Generalizable (not specific to a one-time edge case)
- Actionable (a future team can apply it without additional context)

---

## When RETRO Runs

RETRO is AUTOMATIC after every wave:
- Wave 1 (Planning) completes -> RETRO spawns in background
- Wave 2 (Research) completes -> RETRO spawns in background
- Wave 3 (Engineering) completes -> RETRO spawns in background
- Wave 4 (QA) completes -> RETRO spawns in background
- Wave 5 (Release) completes -> RETRO spawns in background (final retro includes project-level summary)

RETRO is NEVER skipped. Even if a wave completes without issues, the retro confirms healthy execution and captures positive patterns worth replicating.

### Final Wave (Wave 5) Special Behavior

The Wave 5 retro includes an additional **Project Summary** section:
```markdown
## Project Summary (Wave 5 Only)
- **Total Duration (Planned vs Actual)**: [X vs Y]
- **Total Token Usage**: [sum across all waves]
- **Overall Test Pass Rate**: [final percentage]
- **Top 3 Learnings Across All Waves**: [most impactful learnings]
- **Top 3 Recurring Issues**: [most persistent problems]
- **Process Maturity Assessment**: [1-10 score with justification]
```
