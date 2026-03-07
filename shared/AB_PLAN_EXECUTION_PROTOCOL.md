# A/B Plan Execution Protocol

## Amenthyx AI Teams v3.0 — Runner-Up Spike Validation

**Version**: 1.0
**Applies to**: All 60 specialized AI engineering teams
**Depends on**: Judge Protocol, DECISION_LOG.md, Evidence & Proof Protocol

---

## 1. Overview

Sometimes the Judge Agent's verdict has a close margin. The runner-up plan may contain strengths — better feasibility, lower risk, a cleaner architecture — that the winning plan lacks. Discarding it entirely based on a narrow theoretical score gap introduces unnecessary risk.

This protocol allows the Team Lead (TL) to run a **time-boxed spike** (proof of concept) of the runner-up plan to validate key assumptions before fully committing engineering resources to the winner. The spike produces empirical evidence that either confirms the Judge's original verdict or provides grounds for re-evaluation.

The goal is not to re-litigate every decision. It is to catch the cases where a small investment of time prevents a costly mid-project pivot.

---

## 2. When to Use

A spike is warranted when **any** of the following conditions are met:

- **Close margin**: Judge verdict gap is less than 1.0 points between winner and runner-up.
- **Runner-up domain strength**: Runner-up scored higher on Feasibility or Risk Management.
- **Untested assumption**: The winning plan depends on an assumption that the spike can validate cheaply (e.g., "this API supports streaming" or "this library handles concurrency").
- **Explicit request**: The TL or user explicitly requests a spike to increase confidence.

A spike is **not** warranted when:

- The margin exceeds 2.0 points and no single category favors the runner-up.
- The winning plan's assumptions are already validated by prior evidence.
- Engineering Wave 2 has already begun (the window has closed).

---

## 3. Protocol Flow

```
1. Judge produces VERDICT.md (winner: Plan A, runner-up: Plan B)
2. TL evaluates: is the margin close? Any untested assumptions?
3. If spike warranted:
   a. TL creates spike branch: ai-team-spike-{plan}
   b. TL writes SPIKE_BRIEF.md defining scope and criteria
   c. TL spawns 1-2 engineers on the spike branch
   d. Engineers build minimum viable proof of the assumption
   e. Engineers produce SPIKE_RESULTS.md with evidence
   f. TL evaluates spike results against success/failure criteria
   g. TL makes final decision:
      - Spike succeeds        --> adopt runner-up plan (or hybrid)
      - Spike fails            --> proceed with original winner
      - Spike reveals new info --> Judge re-evaluates with spike evidence
4. Spike branch is archived (never deleted), decision logged in DECISION_LOG.md
```

---

## 4. SPIKE_BRIEF.md Template

The TL must produce this document before any spike work begins. It lives at `.team/evidence/spikes/SPIKE_BRIEF.md`.

```markdown
# Spike Brief: {Plan Name} Validation

## Hypothesis
[What we are testing — must be falsifiable.
Example: "The WebSocket approach can sustain 500 concurrent connections
on a single node without exceeding 512MB memory."]

## Scope
- Branch: ai-team-spike-{plan}
- Time box: X hours (default: 2 hours)
- Token budget: $X (Y% of total, default: 10%)
- Engineers assigned: [roles, e.g., Backend Engineer, DevOps Engineer]

## Success Criteria
[Concrete, measurable.
Example: "Memory stays below 512MB at 500 connections for 60 seconds."]

## Failure Criteria
[Concrete, measurable.
Example: "Memory exceeds 512MB, or connections drop above 5% error rate."]

## Minimum Deliverable
[What must be produced for the spike to be evaluable.
Example: "A load test script, a log capture, and a 3-sentence summary."]

## Decision Matrix
| Outcome | Action |
|---------|--------|
| Spike succeeds fully | Adopt runner-up plan |
| Spike partially succeeds | Hybrid: merge specific aspects into winner |
| Spike fails | Proceed with winner, archive spike |
| Spike reveals new info | Re-invoke Judge with spike evidence |
```

---

## 5. SPIKE_RESULTS.md Template

Engineers produce this upon spike completion. It lives at `.team/evidence/spikes/SPIKE_RESULTS.md`.

```markdown
# Spike Results: {Plan Name}

## Hypothesis Tested
[Restate from SPIKE_BRIEF.md]

## Outcome
[SUCCEEDED | PARTIALLY SUCCEEDED | FAILED | INCONCLUSIVE]

## Evidence
[Logs, benchmarks, screenshots, code references — concrete proof.]

## Time Spent
[Actual hours vs. budgeted hours]

## Recommendation
[Engineer's recommendation based on findings.]
```

---

## 6. Integration with Judge Protocol

When a spike triggers re-evaluation:

1. The TL packages SPIKE_RESULTS.md as additional evidence.
2. The Judge receives the original VERDICT.md plus SPIKE_RESULTS.md.
3. The Judge re-scores both plans, now incorporating empirical data from the spike.
4. The Judge produces an **amended VERDICT.md** with a `## Spike Addendum` section explaining how spike evidence affected scores.
5. The amended verdict is final — no further spikes are permitted on the same decision.

This makes the Judge's revised verdict **data-driven** rather than purely theoretical. The spike transforms speculation into measurement.

---

## 7. Integration with DECISION_LOG.md

Every spike decision is recorded in the project's DECISION_LOG.md with the following entry format:

```markdown
### Decision: Spike — {Plan Name}
- **Date**: YYYY-MM-DD
- **Trigger**: [margin < 1.0 | runner-up strength | untested assumption | explicit request]
- **Hypothesis**: [one-line summary]
- **Outcome**: [SUCCEEDED | FAILED | INCONCLUSIVE]
- **Final Decision**: [Adopted runner-up | Adopted hybrid | Proceeded with winner | Re-invoked Judge]
- **Evidence**: .team/evidence/spikes/SPIKE_RESULTS.md
```

---

## 8. Spike Coordinator — TL Sub-Role

When a spike is active, the TL assumes the **Spike Coordinator** persona with the following responsibilities:

**Identity**: The Spike Coordinator is the TL operating in validation mode. This is not a separate agent — it is a focused sub-role the TL adopts for the duration of the spike.

**Responsibilities**:

- **Scope enforcement**: Ensure the spike stays within its time box and token budget. Terminate work that exceeds boundaries.
- **Criteria clarity**: Ensure engineers understand exactly what "success" and "failure" look like before writing any code.
- **Evidence collection**: Ensure all spike outputs are concrete and stored in `.team/evidence/spikes/`.
- **Isolation**: Ensure spike work happens only on the spike branch. No spike code leaks into the main engineering branch.
- **Decision authority**: The Spike Coordinator makes the final call on spike outcome. Engineers recommend; the Coordinator decides.
- **Bias awareness**: The Coordinator must evaluate spike results against the pre-defined criteria, not against a preference for either plan. If the spike fails, the winner stands — regardless of personal opinion.

**Handoff**: Once the spike decision is logged, the TL exits the Spike Coordinator role and resumes standard TL operations, proceeding with whichever plan was selected.

---

## 9. Guardrails

These constraints prevent the spike mechanism from becoming a source of delay or indecision:

| Rule | Rationale |
|------|-----------|
| Maximum **1 spike** per project | Prevents analysis paralysis and infinite re-evaluation loops. |
| Spike must complete **before Wave 2** (Engineering) begins | The spike is a planning-phase activity. Once engineering starts, the plan is locked. |
| Time box default: **2 hours** | Spikes are fast probes, not mini-projects. |
| Token budget default: **10% of total** | Limits the cost of validation to a small fraction of the project. |
| Spike branch is **archived, never deleted** | Preserves institutional knowledge. Future projects may reference spike findings. |
| Spike results are **evidence** | Stored in `.team/evidence/spikes/` alongside all other project evidence. |
| No spike may contradict a **user-mandated** plan choice | If the user explicitly chose a plan, the spike mechanism does not apply. |

---

## 10. Example Scenario

**Context**: The Judge scores Plan A (REST API) at 8.2 and Plan B (GraphQL API) at 7.6. Margin: 0.6 points. Plan B scored higher on Feasibility (9.0 vs 7.5) because the team has more GraphQL experience. Plan A won overall on Scalability and Maintainability.

**TL evaluation**: The margin is below 1.0. Plan A assumes the REST endpoint can handle nested resource queries efficiently — this is untested.

**Spike decision**: TL creates `ai-team-spike-plan-a-rest-nesting`, writes SPIKE_BRIEF.md testing whether the REST approach handles 3-level nested queries within acceptable latency (< 200ms p95).

**Spike result**: REST nesting hits 450ms p95 at 3 levels. Spike fails the success criteria.

**Final decision**: TL adopts a hybrid — GraphQL for the query layer (Plan B's strength), REST for mutations and simple endpoints (Plan A's strength). Decision logged. Spike branch archived.

---

## 11. File Storage

```
.team/
  evidence/
    spikes/
      SPIKE_BRIEF.md
      SPIKE_RESULTS.md
      {any supporting artifacts — logs, benchmarks, code samples}
  DECISION_LOG.md  (spike entry appended here)
```

---

*This protocol is part of the Amenthyx AI Teams v3.0 execution framework. It operates between the Judge Protocol (plan selection) and Wave 2 (engineering execution), providing empirical validation when theoretical scoring alone is insufficient.*
