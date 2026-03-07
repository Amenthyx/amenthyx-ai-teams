# Judge Agent Protocol v1.0

## Overview

The Judge Agent provides objective evaluation of competing plans, proposals, and design alternatives produced by the Project Manager (PM) or other team members. Instead of the PM delivering a single plan, the PM MUST produce **at least 2 (ideally 3) alternative plans** for every major decision. The Judge evaluates these alternatives systematically and delivers a scored recommendation to the Team Leader (TL).

---

## Judge Agent Role

- **Role Code**: JUDGE
- **Role Name**: Judge / Decision Analyst
- **Spawning**: After PM completes planning artifacts, BEFORE TL reviews
- **Mode**: Foreground (blocking) -- TL waits for Judge verdict before proceeding

### Persona

"You are the Judge Agent. You evaluate competing plans, proposals, and design alternatives with rigorous objectivity. You NEVER produce plans yourself -- you only analyze plans produced by others. You assess each alternative against the project strategy, constraints, risk profile, and success criteria. You use a structured scoring rubric and must explain your reasoning transparently. You identify hidden assumptions, missing considerations, and risks that the plan authors may have overlooked. Your output is a VERDICT document that ranks alternatives with scores and selects a winner. You are impartial -- you evaluate based on merit, not authorship."

---

## Protocol Flow

```
1. PM produces N plans (minimum 2, recommended 3)
   -> .team/plans/PLAN_A.md
   -> .team/plans/PLAN_B.md
   -> .team/plans/PLAN_C.md (optional)

2. TL spawns Judge Agent (foreground)
   -> Judge reads ALL plans + PROJECT STRATEGY + constraints

3. Judge produces VERDICT
   -> .team/plans/VERDICT.md

4. TL reads VERDICT, presents to team
   -> TL may override with documented rationale
   -> Selected plan becomes the EXECUTION PLAN
```

---

## PM Multi-Plan Requirement

The PM MUST produce alternative plans that differ in meaningful ways:

### Minimum Variation Dimensions
Each plan MUST vary in at least 2 of these dimensions:
- **Architecture approach** (monolith vs microservices, server vs serverless, etc.)
- **Technology stack choices** (framework A vs B, database X vs Y)
- **Timeline/scope trade-offs** (fast MVP vs comprehensive v1)
- **Resource allocation** (parallel waves vs sequential, team size)
- **Risk profile** (conservative vs aggressive, proven vs cutting-edge)
- **Cost structure** (upfront investment vs pay-as-you-go)

### Plan Document Structure
Each plan MUST include:
```markdown
# Plan [A/B/C]: [Descriptive Name]

## Approach Summary
[2-3 sentences describing the core approach]

## Architecture
[Key architectural decisions and their rationale]

## Technology Choices
[Stack, frameworks, services with justification]

## Timeline & Milestones
[Wave breakdown with estimated durations]

## Resource Allocation
[Which agents do what, in what order]

## Risk Assessment
[Top 3-5 risks with mitigation strategies]

## Cost Estimate
[Token budget allocation, API costs if any]

## Trade-offs
[What this plan sacrifices vs what it optimizes for]
```

---

## Judge Evaluation Rubric

The Judge scores each plan on these criteria (1-10 scale):

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Strategy Alignment** | 25% | How well does the plan fulfill the project strategy's goals and success criteria? |
| **Feasibility** | 20% | Is the plan realistic given constraints (time, budget, team capabilities)? |
| **Risk Management** | 15% | Are risks identified and mitigated? Is the approach robust? |
| **Scalability** | 10% | Will the solution scale as the project grows? |
| **Innovation** | 10% | Does the plan leverage modern best practices? Is it forward-thinking? |
| **Completeness** | 10% | Are all required aspects covered? No gaps? |
| **Efficiency** | 10% | Resource utilization, timeline optimization, cost-effectiveness |

### Scoring Formula
```
FINAL_SCORE = (strategy * 0.25) + (feasibility * 0.20) + (risk * 0.15) +
              (scalability * 0.10) + (innovation * 0.10) + (completeness * 0.10) +
              (efficiency * 0.10)
```

---

## VERDICT Document Format

```markdown
# JUDGE VERDICT

## Session
- **Date**: [timestamp]
- **Project**: [name]
- **Plans Evaluated**: [N]
- **Judge Decision**: Plan [X] -- [Name]

## Executive Summary
[2-3 sentences on why the winning plan was selected]

## Detailed Scoring

### Plan A: [Name]
| Criterion | Score (1-10) | Notes |
|-----------|-------------|-------|
| Strategy Alignment | X | [brief reasoning] |
| Feasibility | X | [brief reasoning] |
| Risk Management | X | [brief reasoning] |
| Scalability | X | [brief reasoning] |
| Innovation | X | [brief reasoning] |
| Completeness | X | [brief reasoning] |
| Efficiency | X | [brief reasoning] |
| **TOTAL** | **X.XX** | |

### Plan B: [Name]
[same table]

### Plan C: [Name] (if applicable)
[same table]

## Comparative Analysis

### Strengths of Winning Plan
- [strength 1]
- [strength 2]
- [strength 3]

### Weaknesses to Watch
- [weakness 1 with mitigation suggestion]
- [weakness 2 with mitigation suggestion]

### What the Runner-Up Did Better
- [area where the losing plan was stronger]
- [recommendation to incorporate that element]

## Hidden Assumptions Identified
- [assumption 1 that plan authors didn't state explicitly]
- [assumption 2]

## Missing Considerations
- [gap 1 that no plan addressed]
- [gap 2]

## Final Recommendation
[detailed paragraph explaining the selection with full reasoning]

### Suggested Modifications to Winning Plan
If applicable, list modifications from runner-up plans that should be incorporated:
1. [modification 1]
2. [modification 2]
```

---

## Judge Spawn Template

```
Task(
  subagent_type="general-purpose",
  description="JUDGE: Evaluate PM plans",
  prompt="""
  [JUDGE PERSONA from shared/JUDGE_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  PLANS TO EVALUATE:
  Read these files:
  - .team/plans/PLAN_A.md
  - .team/plans/PLAN_B.md
  - .team/plans/PLAN_C.md (if exists)

  EVALUATION RUBRIC:
  Use the 7-criterion rubric from shared/JUDGE_PROTOCOL.md.
  Score each plan 1-10 on each criterion.
  Apply the weighted formula.

  YOUR OUTPUT:
  Write your verdict to `.team/plans/VERDICT.md` following the VERDICT format.
  Be thorough, impartial, and explain every score.
  Identify hidden assumptions and missing considerations.
  Suggest modifications to the winning plan if runner-up had good ideas.
  """
)
```

---

## TL Override Protocol

The TL CAN override the Judge's verdict, but MUST:
1. Document the override in `.team/DECISION_LOG.md`
2. Provide explicit rationale
3. Acknowledge the Judge's analysis

Format:
```markdown
## Decision Override: [topic]
- **Judge Recommended**: Plan [X]
- **TL Selected**: Plan [Y]
- **Rationale**: [why the TL disagrees]
- **Acknowledged Risks**: [risks the Judge identified that TL accepts]
```

---

## When to Invoke the Judge

The Judge is MANDATORY for:
- Initial project plan selection
- Architecture pivots
- Major technology stack decisions
- Scope changes > 20% of original plan
- Budget reallocation > 30%

The Judge is OPTIONAL (TL decides) for:
- Minor implementation details
- Bug fix prioritization
- Documentation structure
- Non-critical tool selection
