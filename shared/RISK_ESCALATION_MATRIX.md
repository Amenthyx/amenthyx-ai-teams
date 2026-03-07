# Risk Escalation Matrix

> Amenthyx AI Teams v3.0 — Formalized Risk Detection & Escalation Protocol

## Purpose

All 60 Amenthyx AI engineering teams operate under the principle of "ask when unsure." This matrix replaces that ambiguous guidance with **concrete, measurable triggers** that determine when an agent must stop, flag, or escalate. Every agent and Team Leader (TL) must internalize these rules before executing any task.

---

## 1. Risk Severity Levels

### P0 — Critical

- **Response**: Immediate full stop. All agents on the affected task halt.
- **Escalation**: TL escalates to User within **1 minute** of detection.
- **Resolution window**: User-defined. No work resumes until User approves.
- **Examples**: Data loss risk, security breach, production impact, budget overshoot >50%, credential exposure.

### P1 — High

- **Response**: Detecting agent stops its current task and reports to TL.
- **Escalation**: TL evaluates within **5 minutes**. TL decides: fix in-team or escalate to User.
- **Resolution window**: Must be resolved before the current wave boundary.
- **Examples**: Repeated build failures, architecture drift, dependency CVE (medium), test coverage regression.

### P2 — Medium

- **Response**: Agent flags the issue in the evidence manifest and continues work.
- **Escalation**: TL reviews all P2 items at the next wave boundary.
- **Resolution window**: Must be addressed before the Release wave (Wave 5).
- **Examples**: Performance regression <20%, code duplication, minor version conflicts, flaky test detected.

### P3 — Low

- **Response**: Agent logs in the team learnings document and continues.
- **Escalation**: None required. TL reviews P3 items during retrospectives.
- **Resolution window**: Best-effort, no hard deadline.
- **Examples**: Code style inconsistencies, minor TODOs, documentation gaps, non-blocking warnings.

---

## 2. Automatic Escalation Triggers

These triggers are non-negotiable. When a condition is met, the prescribed action fires automatically — no agent discretion.

| # | Trigger | Severity | Action |
|---|---------|----------|--------|
| T01 | Build fails 3+ times consecutively | P1 | Agent stops, reports to TL with full error logs |
| T02 | Test coverage drops below strategy-defined threshold | P1 | Block merge, notify TL with coverage diff |
| T03 | Security scan finds CRITICAL or HIGH CVE | P0 | Immediate stop, TL escalates to User |
| T04 | Token usage exceeds task estimate by >30% | P1 | TL pauses agent, re-estimates remaining work |
| T05 | Token usage exceeds task estimate by >100% | P0 | TL stops all agents on task, escalates to User |
| T06 | Agent running >30 min with no commit or output | P1 | TL investigates stuck agent, may reassign |
| T07 | Git conflict on shared file (cross-team) | P2 | TL coordinates resolution with other TL |
| T08 | External API returns 5xx on 3+ consecutive calls | P1 | Agent switches to mock/stub, reports to TL |
| T09 | Deployment to any environment fails | P1 | Agent rolls back immediately, reports to TL |
| T10 | Data migration could affect >1000 rows | P0 | TL confirms with User before executing |
| T11 | Unknown or non-permissive dependency license detected | P1 | DEPGUARD re-scan triggered, TL reviews result |
| T12 | Agent wants to delete files or data | P0 | Blocked by protocol — must escalate to TL, then User |
| T13 | Hardcoded credential detected in code | P0 | Immediate stop, CR agent flags, TL escalates to User |
| T14 | Cost of external service call exceeds $10 | P0 | TL escalates to User for approval before proceeding |
| T15 | Architecture decision contradicts strategy document | P1 | Agent stops, TL consults Judge Agent |
| T16 | Agent encounters ambiguity not covered by strategy | P1 | Agent stops, TL asks User for clarification |
| T17 | Production database write attempted outside migration | P0 | Blocked, TL escalates immediately |
| T18 | CI pipeline has been red for >2 hours | P1 | TL triages, assigns dedicated fix agent |
| T19 | Dependency update introduces breaking API change | P1 | Agent reverts, reports to TL with impact analysis |
| T20 | Memory/CPU usage exceeds 2x baseline in test | P2 | Agent flags in evidence manifest, continues |

---

## 3. Escalation Chain

```
  Agent (detects risk)
    |
    v
  Team Leader (TL)
    |
    |--- Can resolve? ---> Fix in-team, log in Risk Register
    |
    |--- Unsure / P0? ---> Escalate to User
    |
    |--- Architecture or
    |    plan dispute? ---> Consult Judge Agent
    |                         |
    |                         v
    |                       Judge renders verdict
    |                         |
    |                         |--- Resolved ---> TL implements
    |                         |--- Unresolved ---> TL escalates to User
    |
    v
  User (final authority)
    |
    v
  Decision logged in Risk Register
```

### Chain Rules

1. **Agents never escalate directly to User.** All escalations flow through the TL.
2. **TL never ignores a P0.** Every P0 reaches the User, no exceptions.
3. **Judge Agent** is consulted only for plan/architecture disputes, not operational issues.
4. **Cross-team escalations** (e.g., T07) involve both TLs coordinating before escalating to User.

---

## 4. Response Time Expectations

| Severity | Agent Response | TL Response | User Response (Expected) |
|----------|---------------|-------------|--------------------------|
| P0 | Immediate stop | Escalate within 1 min | As soon as available |
| P1 | Stop current task | Evaluate within 5 min | Within current session |
| P2 | Flag and continue | Review at wave boundary | Next planning session |
| P3 | Log and continue | Review at retrospective | No response needed |

---

## 5. Escalation Document Format

Every P0 and P1 escalation must produce a structured document. P2 items are logged in the evidence manifest. P3 items are logged in team learnings.

```markdown
# Risk Escalation #{ID}

## Severity: P0/P1/P2/P3
## Trigger: [T## — which automatic trigger fired, or "Manual" if agent judgment]
## Agent: [Role name and team]
## Timestamp: [ISO 8601]

## Description
[What happened — factual, concise]

## Impact Assessment
[What is at risk if we proceed without action]

## Evidence
[Build logs, error output, scan results — concrete proof]

## Recommended Action
[What the detecting agent believes should happen]

## TL Decision
[Filled by TL: approve recommendation, override, or escalate]

## User Decision
[Filled by User if escalated: approve, deny, or redirect]

## Resolution
[What was actually done, with commit hash or artifact reference]

## Post-Mortem
[Optional: what should change to prevent recurrence]
```

---

## 6. De-escalation Criteria

An active escalation can be de-escalated (severity reduced or closed) when:

| From | To | Criteria |
|------|----|----------|
| P0 | P1 | User has acknowledged and provided direction; no immediate danger remains |
| P0 | Closed | Root cause fixed, verified by test, User confirms resolution |
| P1 | P2 | TL has identified fix, fix is in progress, no blocking impact |
| P1 | Closed | Fix merged, tests pass, TL confirms resolution |
| P2 | P3 | Impact confirmed as cosmetic or non-functional |
| P2 | Closed | Fix merged or risk accepted by TL with justification |
| P3 | Closed | Addressed in code or explicitly accepted as known limitation |

### De-escalation Rules

1. **Only the role that escalated can de-escalate.** If TL escalated to User, only User can de-escalate.
2. **P0 de-escalation requires evidence.** A passing test, a reverted commit, or a confirmed safe state.
3. **De-escalation is logged** in the same escalation document under Resolution.

---

## 7. Risk Register Integration

All escalations (P0 through P2) feed into the persistent risk register at `.team/RISK_REGISTER.md`.

### Register Entry Format

```markdown
| ID | Date | Severity | Trigger | Team | Summary | Status | Resolution Date |
```

### Register Rules

- The TL updates the register after every escalation resolution.
- Open P0/P1 items are reviewed at every wave boundary.
- The register is included in the final delivery report to the User.
- Historical patterns in the register inform future strategy refinements.

---

## 8. Integration with Existing Protocols

### Replacing "Ask When Unsure"

The v3.0 team files instruct agents to "ask when unsure." This matrix operationalizes that rule:

- **"Unsure" now means**: the agent cannot map the situation to any trigger in this matrix AND the agent's confidence in the correct action is below 80%.
- **When unsure**: the agent treats it as **T16 (P1)** — stop and ask TL for clarification.
- **When sure**: the agent proceeds but logs the decision in the evidence manifest.

### Evidence & Proof Protocol

Every P0/P1 escalation must include evidence (trigger T-number, logs, metrics). This aligns with the v3.0 Evidence & Proof Protocol — escalations without evidence are rejected by the TL and sent back to the agent.

### Atomic Commits

If an escalation requires a fix, the fix must follow atomic commit rules. No escalation resolution should bundle unrelated changes.

### Wave Boundaries

- **P0**: Halts the current wave until resolved.
- **P1**: Must be resolved before the current wave completes.
- **P2**: Must be resolved before Wave 5 (Release).
- **P3**: Best-effort across all waves.

### CI/CD Integration

Triggers T01, T02, T03, T11, T13, and T18 can be automated via GitHub Actions. Teams using `act` for local CI testing should wire these triggers into their pre-push hooks.

---

## 9. Quick Reference Card

```
P0 (Critical)  -->  STOP ALL  -->  TL -> User  -->  Wait for approval
P1 (High)      -->  STOP TASK -->  TL decides  -->  Fix or escalate
P2 (Medium)    -->  FLAG      -->  Continue    -->  TL reviews at wave boundary
P3 (Low)       -->  LOG       -->  Continue    -->  Retrospective review
```

**Remember**: When in doubt, escalate. A false P1 costs minutes. A missed P0 costs the project.
