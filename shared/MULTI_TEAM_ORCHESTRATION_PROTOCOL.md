# Multi-Team Orchestration Protocol v1.0

> Defines how multiple Amenthyx AI Teams coordinate on a single project simultaneously.

---

## Table of Contents

1. [Overview](#overview)
2. [Orchestration Modes](#orchestration-modes)
3. [Multi-Team Activation Syntax](#multi-team-activation-syntax)
4. [Shared Workspace Structure](#shared-workspace-structure)
5. [Team Registry](#team-registry)
6. [Contract System](#contract-system)
7. [Coordination Rules](#coordination-rules)
8. [Conflict Resolution](#conflict-resolution)
9. [Cross-Team Handoff Integration](#cross-team-handoff-integration)
10. [Judge Protocol Integration](#judge-protocol-integration)
11. [Mission Control Dashboard](#mission-control-dashboard)
12. [Multi-Team Reporting](#multi-team-reporting)
13. [Cost Aggregation](#cost-aggregation)
14. [Git Strategy](#git-strategy)
15. [Failure & Recovery](#failure--recovery)

---

## 1. Overview

When a project requires expertise from more than one Amenthyx AI Team, the Multi-Team Orchestration Protocol governs how those teams are activated, how they share artifacts, how they avoid conflicts, and how a Super TL coordinates the overall effort.

**Key Principle**: Each team retains full autonomy over its domain. Coordination happens through explicit contracts and a shared orchestration workspace -- never by teams reaching into each other's internals.

---

## 2. Orchestration Modes

### 2.1 Sequential

Team A completes its work, produces deliverables, then hands off to Team B.

```
apiDesign ──complete──> nodejs ──complete──> devOps
```

- Uses the **Cross-Team Handoff Protocol** at each transition.
- Downstream teams receive a locked contract from the upstream team.
- Best for: design-then-implement flows, phased rollouts.

### 2.2 Parallel

Two or more teams work at the same time on different layers or modules.

```
nodejs  ─────────────>
                        (shared contract)
react   ─────────────>
```

- Teams agree on a contract before starting (API schema, data types, interfaces).
- No team blocks the other; both reference the same contract as their source of truth.
- Best for: frontend + backend, microservice decomposition, multi-platform builds.

### 2.3 Hybrid

Some teams run sequentially, others in parallel. This is the most common real-world mode.

```
apiDesign ──complete──> [ nodejs  ─────>
                          react   ─────> ] (parallel)
```

- The sequential phase produces the contracts that the parallel phase consumes.
- Best for: design-first projects where implementation spans multiple domains.

---

## 3. Multi-Team Activation Syntax

```bash
# Sequential: teams execute one after another
--team apiDesign --strategy ./strategy.md --then nodejs --then react

# Parallel: teams execute simultaneously
--team nodejs --strategy ./strategy.md --parallel react

# Hybrid: sequential phase followed by parallel phase
--team apiDesign --strategy ./strategy.md --then "nodejs --parallel react"

# Hybrid with multiple sequential + parallel stages
--team apiDesign --strategy ./strategy.md \
  --then "nodejs --parallel react" \
  --then devOps

# Explicit orchestration file (advanced)
--orchestrate ./orchestration.yaml --strategy ./strategy.md
```

All teams share the same `--strategy` file. Each team reads the sections relevant to its domain.

---

## 4. Shared Workspace Structure

```
project/
├── .team/                          # Shared team workspace
│   ├── orchestration/              # Multi-team coordination (Super TL owned)
│   │   ├── TEAM_REGISTRY.md        # Which teams are active, their status
│   │   ├── SEQUENCE.md             # Execution order and dependencies
│   │   ├── CONTRACTS/              # Cross-team contracts
│   │   │   ├── CONTRACT_apiDesign_nodejs.md
│   │   │   ├── CONTRACT_apiDesign_react.md
│   │   │   └── CONTRACT_nodejs_react.md
│   │   ├── DECISIONS/              # Cross-team architectural decisions
│   │   │   └── DECISION_001_auth_strategy.md
│   │   └── REPORTS/                # Aggregated multi-team reports
│   │       └── COMBINED_REPORT.md
│   ├── team-apiDesign/             # Team A namespace
│   │   ├── kanban.md
│   │   ├── evidence/
│   │   └── artifacts/
│   ├── team-nodejs/                # Team B namespace
│   │   ├── kanban.md
│   │   ├── evidence/
│   │   └── artifacts/
│   └── team-react/                 # Team C namespace
│       ├── kanban.md
│       ├── evidence/
│       └── artifacts/
├── src/                            # Shared source code
├── tests/                          # Shared test directory
└── strategy.md                     # Shared strategy file
```

**Rules**:
- Each team may only write to its own `.team/team-{name}/` namespace.
- Only the Super TL (or the orchestration system) writes to `.team/orchestration/`.
- Contracts in `CONTRACTS/` are immutable once both teams have acknowledged them. Changes require the Contract Amendment process (Section 6.3).

---

## 5. Team Registry

The `TEAM_REGISTRY.md` file is the single source of truth for which teams are active.

### Format

```markdown
# Multi-Team Registry

## Project
- **Name**: Project Alpha
- **Strategy**: ./strategy.md
- **Orchestration Mode**: hybrid
- **Super TL**: User (or designated TL)

## Active Teams
| # | Team        | Status     | Started    | TL   | Dependencies              |
|---|-------------|------------|------------|------|---------------------------|
| 1 | apiDesign   | completed  | 2024-01-01 | TL-A | none                      |
| 2 | nodejs      | active     | 2024-01-02 | TL-B | apiDesign (contract)      |
| 3 | react       | active     | 2024-01-02 | TL-C | apiDesign (contract)      |
| 4 | devOps      | waiting    | --         | TL-D | nodejs, react (complete)  |

## Execution Order
apiDesign -> [nodejs, react] (parallel) -> devOps

## Shared Contracts
- CONTRACT_apiDesign_nodejs.md -- API specification, endpoint schemas
- CONTRACT_apiDesign_react.md -- Component API, data types, response shapes
- CONTRACT_nodejs_react.md    -- WebSocket events, shared enums
```

### Status Values
| Status      | Meaning                                       |
|-------------|-----------------------------------------------|
| `waiting`   | Team is queued, dependencies not yet met       |
| `active`    | Team is currently executing                    |
| `blocked`   | Team is waiting on a contract amendment or fix |
| `completed` | Team has finished and produced deliverables    |
| `failed`    | Team encountered an unrecoverable error        |

---

## 6. Contract System

### 6.1 Contract Purpose

Contracts define the boundary between two teams. They specify what one team produces and another team consumes, so both can work independently.

### 6.2 Contract Format

```markdown
# CONTRACT: {upstream-team} -> {downstream-team}

## Version: 1.0
## Status: LOCKED
## Created: 2024-01-01
## Acknowledged By: TL-A (apiDesign), TL-B (nodejs)

## Interface Definition
- Endpoint schemas, data types, event formats, file boundaries, etc.

## Assumptions
- What each team can assume about the other's deliverables.

## Boundary Rules
- Which files/directories each team owns.
- Which shared resources exist and who has write access.

## Verification
- How each team verifies compliance (test commands, schema validation).
```

### 6.3 Contract Amendment Process

1. Requesting team opens an amendment proposal in `.team/orchestration/CONTRACTS/`.
2. All affected teams review the proposal.
3. Super TL approves or rejects.
4. If approved, contract version is incremented and both teams acknowledge.
5. If rejected, requesting team must find an alternative within the current contract.

---

## 7. Coordination Rules

1. **Namespace Isolation**: Each team writes only to `.team/team-{name}/` and its designated source directories as defined in the contract.
2. **No Shared Agents**: Each team has its own TL, PM, and agents. Agents never cross team boundaries.
3. **Super TL Authority**: The user (or a designated TL) acts as Super TL, coordinating across teams, resolving disputes, and approving contract amendments.
4. **Contract-First Communication**: Teams do not communicate directly. All cross-team information flows through contracts and the orchestration workspace.
5. **Independent Kanban**: Each team maintains its own kanban board in `.team/team-{name}/kanban.md`.
6. **Atomic Commits Per Team**: Each team follows the v3.0 atomic commit protocol, prefixing commits with its team name (see Section 14).

---

## 8. Conflict Resolution

### 8.1 File Conflicts

Teams must not modify the same files. The contract defines file ownership boundaries.

| Conflict Type        | Resolution                                                  |
|----------------------|-------------------------------------------------------------|
| Same file modified   | Contract violation -- Super TL assigns ownership to one team |
| Shared config file   | One team owns it; others submit changes via contract request |
| Migration conflicts  | Sequential ordering enforced by SEQUENCE.md                  |

### 8.2 API / Interface Conflicts

When a team discovers the contract is insufficient or incorrect:

1. Team TL raises a **Contract Amendment** (Section 6.3).
2. Both teams pause work on the affected interface.
3. Super TL mediates; Judge Protocol may be invoked for architectural decisions.
4. Amended contract is published; both teams resume.

### 8.3 Priority Conflicts

When teams disagree on priority or sequencing, the Super TL decides. The Super TL's decision is final and recorded in `.team/orchestration/DECISIONS/`.

---

## 9. Cross-Team Handoff Integration

The Multi-Team Orchestration Protocol relies on the existing **Cross-Team Handoff Protocol** for sequential transitions.

### Handoff Checklist (Sequential Mode)

1. Upstream team marks status as `completed` in TEAM_REGISTRY.md.
2. Upstream team produces a **Handoff Package** in `.team/team-{name}/artifacts/`:
   - Deliverable summary
   - Evidence of completion (test results, screenshots, logs)
   - Contract compliance verification
3. Super TL reviews the handoff package.
4. Downstream team's status is updated from `waiting` to `active`.
5. Downstream team acknowledges receipt and begins execution.

### Parallel Kickoff

For parallel teams, there is no handoff -- both teams start simultaneously after the shared contract is locked. Each team references the contract independently.

---

## 10. Judge Protocol Integration

The **Judge Protocol** extends to cross-team decisions when invoked by the Super TL.

### When to Invoke the Judge

- Architectural decisions that affect multiple teams (e.g., authentication strategy).
- Contract disputes that the Super TL cannot resolve alone.
- Technology choices with cross-team implications (e.g., REST vs. GraphQL).

### Cross-Team Judge Evaluation

```markdown
## Cross-Team Decision Request

**Decision ID**: DECISION_001
**Requesting Team**: nodejs
**Affected Teams**: nodejs, react
**Question**: Should WebSocket events use JSON or Protobuf encoding?

## Judge Evaluation
- Impact on Team nodejs: [analysis]
- Impact on Team react: [analysis]
- Recommendation: [decision with reasoning]
- Contract Updates Required: [list of contract amendments]
```

The Judge's recommendation is advisory. The Super TL makes the final call.

---

## 11. Mission Control Dashboard

Mission Control extends to show all active teams in a unified view.

### Dashboard Layout

```
+----------------------------------------------------------+
| MISSION CONTROL -- Multi-Team View                       |
|----------------------------------------------------------|
| Project: Alpha    Mode: Hybrid    Teams: 4               |
|                                                          |
| [Team Selector: ALL | apiDesign | nodejs | react | devOps]|
|                                                          |
| Pipeline:                                                |
| apiDesign [====DONE====] -> nodejs [===75%===...] --|    |
|                              react  [==60%==.....] --|   |
|                                                   devOps [waiting] |
|                                                          |
| Active Contracts: 3    Amendments Pending: 0             |
| Total Cost: $X.XX (apiDesign: $A | nodejs: $B | react: $C) |
|                                                          |
| Recent Cross-Team Events:                                |
| - [14:02] apiDesign completed, handoff to nodejs + react |
| - [14:05] CONTRACT_apiDesign_nodejs.md locked            |
| - [14:05] CONTRACT_apiDesign_react.md locked             |
| - [15:30] nodejs raised amendment request #1             |
+----------------------------------------------------------+
```

### Team Selector

- **ALL**: Shows aggregated pipeline, combined kanban, total costs.
- **Individual Team**: Shows that team's kanban, evidence, cost breakdown, and contract compliance status.

---

## 12. Multi-Team Reporting

### Per-Team Reports

Each team generates its own PPTX/PDF using the standard generators (`PPTX_GENERATOR.py`, `PDF_GENERATOR.py`). Reports are stored in `.team/team-{name}/artifacts/`.

### Combined Report

The Super TL aggregates per-team reports into a combined report:

```markdown
# Combined Multi-Team Report

## Executive Summary
- Project: Alpha
- Teams Involved: 4
- Duration: 3 days
- Total Cost: $X.XX

## Per-Team Summary
### apiDesign
- Status: completed
- Deliverables: API specification (OpenAPI 3.0), 24 endpoints
- Cost: $A.AA

### nodejs
- Status: completed
- Deliverables: Express.js API, 24 endpoints implemented, 96% test coverage
- Cost: $B.BB

### react
- Status: completed
- Deliverables: React SPA, 12 pages, Storybook components
- Cost: $C.CC

### devOps
- Status: completed
- Deliverables: Docker Compose, CI/CD pipeline, Terraform IaC
- Cost: $D.DD

## Cross-Team Metrics
- Contracts Created: 3
- Contract Amendments: 1
- Cross-Team Decisions: 2
- Handoff Delays: 0
```

---

## 13. Cost Aggregation

Cost estimation follows the per-team model from the v3.0 protocol, with an orchestration-level aggregate.

| Level         | Scope                                      |
|---------------|--------------------------------------------|
| Agent-level   | Individual agent cost within a team        |
| Team-level    | Sum of all agents in the team              |
| Orchestration | Sum of all teams + coordination overhead   |

**Coordination overhead** accounts for contract creation, amendment reviews, handoff verification, and Super TL time. Estimate 5-10% of total team costs.

---

## 14. Git Strategy

All teams work on a single branch (`ai-team`) with commit prefixes to identify ownership.

### Commit Prefix Format

```
[team-{name}] <type>: <description>

# Examples
[team-apiDesign] feat: define user authentication endpoints
[team-nodejs] feat: implement /api/users CRUD
[team-react] feat: add LoginForm component
[team-devOps] ci: add GitHub Actions workflow
```

### Branch Rules

| Rule                           | Detail                                              |
|--------------------------------|-----------------------------------------------------|
| Single branch                  | All teams commit to `ai-team`                       |
| Commit prefix required         | Every commit prefixed with `[team-{name}]`          |
| No force-push                  | Teams must pull before pushing                      |
| Parallel merge order           | Teams in parallel merge in alphabetical order if conflicts arise |
| Contract compliance on commit  | Commits touching contract-boundary files require contract check |

---

## 15. Failure & Recovery

### Team Failure

If a team enters `failed` status:

1. Super TL halts dependent teams (status set to `blocked`).
2. Super TL diagnoses the failure using the team's evidence logs.
3. Options:
   - **Retry**: Reset the team and re-execute from last checkpoint.
   - **Replace**: Activate an alternative team for the same domain.
   - **Abort**: Cancel the orchestration and produce a partial report.

### Contract Violation Recovery

1. Identify which team violated the contract (evidence logs).
2. Revert the violating commits (identified by team prefix).
3. Team re-executes the affected tasks within contract boundaries.
4. If the contract itself was flawed, initiate an amendment.

### Deadlock Detection

A deadlock occurs when Team A is blocked on Team B and Team B is blocked on Team A. The orchestration system detects circular dependencies in TEAM_REGISTRY.md and alerts the Super TL, who must break the cycle by amending one or both contracts.

---

## Appendix: Quick-Start Checklist

1. Write `strategy.md` covering all teams' domains.
2. Choose orchestration mode (sequential / parallel / hybrid).
3. Activate teams with the appropriate CLI syntax.
4. Verify `.team/orchestration/TEAM_REGISTRY.md` is created.
5. Lock contracts before parallel teams begin.
6. Monitor progress via Mission Control (ALL view).
7. Review handoff packages at each sequential transition.
8. Aggregate final reports when all teams reach `completed`.
