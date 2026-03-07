# Strategy Evolution Protocol

## Purpose

This protocol governs how changes to `strategy.md` are tracked, evaluated, and propagated during active project execution. Scope changes, tech stack pivots, and priority shifts mid-project must follow this process to prevent chaos and maintain team alignment.

---

## 1. Core Principles

1. **No silent changes** -- every strategy modification goes through a formal change request.
2. **Impact before action** -- changes are analyzed for blast radius before approval.
3. **Originals are never deleted** -- prior strategy versions are archived, not overwritten.
4. **Agents are notified** -- active agents receive propagation notices for relevant changes.
5. **Re-estimation is triggered** when changes affect more than 20% of features.

---

## 2. Strategy Change Request Format

All change requests are stored in `.team/strategy_changes/CHANGE_REQUEST_{N}.md` where `{N}` is a sequential integer starting at 1.

```markdown
# Strategy Change Request #{N}

## Requested By: [user/TL/PM]
## Date: [ISO]
## Urgency: [critical/high/medium/low]

## Change Description
[What's changing and why]

## Affected Sections
[Which strategy sections change]

## Impact Analysis
- Features affected: [list]
- Agents affected: [list]
- Waves affected: [list]
- Cost impact: [+$X / -$X / neutral]

## Recommendation
[TL/Judge recommendation]

## User Decision
[approved/rejected/modified]
```

### Field Definitions

| Field | Description |
|-------|-------------|
| Requested By | Who initiated the change: `user` (external), `TL` (tech lead agent), or `PM` (project manager agent) |
| Date | ISO 8601 format (e.g., `2026-03-07`) |
| Urgency | `critical` = blocks current wave, `high` = affects current wave, `medium` = affects future waves, `low` = cosmetic/nice-to-have |
| Features affected | List of feature names from the strategy that are impacted |
| Agents affected | Which agent roles need to adjust their work |
| Waves affected | Which of the 5 waves (Planning, Research, Engineering, QA, Release) need re-planning |
| Cost impact | Estimated cost delta. Use `neutral` if no impact |

---

## 3. Change Approval Flow

```
Requester (user/TL/PM)
    |
    v
TL reviews change request
    |-- Adds technical feasibility assessment
    |-- Fills in affected agents and waves
    |
    v
Judge evaluates impact
    |-- Validates impact analysis
    |-- Adds recommendation (approve/reject/defer)
    |-- Flags if >20% feature impact (triggers re-estimation)
    |
    v
User makes final decision
    |-- approved: change is applied
    |-- rejected: change request closed, no action
    |-- modified: TL revises, Judge re-evaluates
```

### Urgency Fast-Track

- **Critical** changes bypass Judge evaluation. TL presents directly to User for immediate decision. Judge reviews post-facto.
- **High** changes get Judge evaluation within the current wave step.
- **Medium/Low** changes are batched and evaluated at wave boundaries.

---

## 4. Strategy Diff Tracking

Every approved change produces artifacts:

### 4.1 Versioned Strategy Files

When a change is approved:

1. Copy current `strategy.md` to `.team/strategy_changes/strategy_v{N}.md` (where N is the previous version number).
2. Apply the change to `strategy.md` (the live file).
3. The live `strategy.md` always has a version header:

```markdown
<!-- Strategy Version: v{N} | Last Modified: {ISO_DATE} | Change Request: #{CR_N} -->
```

### 4.2 Diff Files

Each approved change also generates a diff file:

```
.team/strategy_changes/DIFF_{N}.md
```

Contents:

```markdown
# Strategy Diff: v{N-1} -> v{N}

## Change Request: #{CR_N}
## Date Applied: [ISO]

## Sections Added
- [list]

## Sections Modified
- [list with brief description of change]

## Sections Removed
- [none -- sections are never removed, only deprecated]
```

---

## 5. Propagation Protocol

Once a strategy change is approved and applied, TL is responsible for notifying all affected agents.

### 5.1 Notification Format

TL creates `.team/strategy_changes/PROPAGATION_{N}.md`:

```markdown
# Strategy Change Propagation #{N}

## Change Request: #{CR_N}
## Strategy Version: v{N}

## Agents to Notify
| Agent | Action Required |
|-------|----------------|
| [role] | [what they need to do differently] |

## Wave Re-planning Required: [yes/no]
## Immediate Action Items
1. [specific action]
2. [specific action]
```

### 5.2 Propagation Rules

- **Active agents in the current wave** receive immediate notification via TL.
- **Agents in future waves** pick up changes when their wave begins (the updated strategy.md is their source of truth).
- **Agents in completed waves** are not notified (their work is done). If their output needs revision, a new task is created in the current wave.

---

## 6. Re-Estimation Trigger

If an approved change affects more than 20% of the features listed in the strategy:

1. PM re-generates project plans based on the updated strategy.
2. Judge re-evaluates the new plans for feasibility and risk.
3. TL provides updated time and cost estimates to the User.
4. User confirms continuation or requests further adjustment.

### Calculating Feature Impact Percentage

```
impact_percentage = (number_of_affected_features / total_features_in_strategy) * 100
```

If `impact_percentage > 20`, re-estimation is mandatory.

---

## 7. PM Re-Planning Protocol

When a change affects P0 (highest priority) features:

1. PM halts current planning activities.
2. PM re-generates affected plans in `.team/plans/` using the updated strategy.
3. Judge evaluates the new plans against the change request and overall project goals.
4. TL reviews Judge output and presents to User if any concerns arise.
5. Active agents in the current wave receive updated task assignments.

### P0 Change Escalation

P0 changes are always treated as `high` urgency minimum. If the change invalidates work already completed in the current wave, TL must:

1. Document the invalidated work in the change request.
2. Estimate rework cost.
3. Present options to User: rework now vs. defer to next wave vs. accept technical debt.

---

## 8. Directory Structure

```
.team/
  strategy_changes/
    CHANGE_REQUEST_1.md      # First change request
    CHANGE_REQUEST_2.md      # Second change request
    DIFF_1.md                # Diff for v1 -> v2
    DIFF_2.md                # Diff for v2 -> v3
    PROPAGATION_1.md         # Propagation notice for CR #1
    PROPAGATION_2.md         # Propagation notice for CR #2
    strategy_v1.md           # Original strategy (archived)
    strategy_v2.md           # After first change (archived)
```

---

## 9. Strategy Change Anti-Patterns

| Anti-Pattern | Why It's Bad | Correct Approach |
|-------------|-------------|-----------------|
| Editing strategy.md directly | No audit trail, agents not notified | Always use a Change Request |
| Deleting strategy sections | Breaks agent context, loses history | Mark sections as deprecated |
| Changing tech stack without CR | Agents use wrong tools, wasted work | CR with full impact analysis |
| Batching unrelated changes | Hard to roll back individual changes | One CR per logical change |
| Skipping Judge evaluation | Risk of cascading failures | Only skip for critical urgency |

---

## 10. Rollback of Strategy Changes

If an approved change causes problems after application:

1. Create a new Change Request that references the original: "Rollback of CR #{N}".
2. Restore the previous strategy version from `.team/strategy_changes/strategy_v{N-1}.md`.
3. Follow the normal approval flow (fast-tracked if urgency is critical).
4. Do NOT delete the failed change request or diff -- they are part of the audit trail.

---

## 11. Integration with Version Migration Protocol

When the Amenthyx AI Teams framework itself is upgraded (see `VERSION_MIGRATION_PROTOCOL.md`), the `.team/strategy_changes/` directory is preserved during migration. New framework versions may add fields to the Change Request template; existing change requests remain valid without the new fields.
