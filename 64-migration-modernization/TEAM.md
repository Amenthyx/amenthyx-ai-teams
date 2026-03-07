# Migration & Modernization Team
# Activation: `--team migration`
# Focus: Legacy system migration, strangler fig pattern, dual-write, data migration, monolith decomposition

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
When the user says `--team migration --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 8)
4. Spawn Team Leader agent (foreground -- this is the orchestrator)
5. Team Leader spawns PM agent (foreground -- must complete before others)
6. PM produces Project Charter + Initial Plan + creates GitHub Project
7. TL spawns Judge Agent to evaluate PM plan alternatives
8. Team Leader reviews PM output + VERDICT, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, migration scope, target architecture, and success criteria.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between legacy and target system approaches, coordinates cutover timing.
- **Persona**: "You are the Team Leader of an 11-person Migration & Modernization team. You coordinate the entire migration lifecycle -- from legacy analysis through cutover and decommissioning. You make final architectural decisions on migration strategy (strangler fig, big bang, parallel run), enforce quality gates including zero-data-loss verification, and ensure the migration ships safely. You never write migration code directly -- you orchestrate others. You are acutely aware that migration failures can cause data loss and downtime, so you enforce rigorous verification at every step."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter with migration scope matrix, milestones aligned to migration phases, kanban board. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports with migration progress dashboards.
- **Persona**: "You are the Project Manager for a Migration & Modernization project. You create all planning artifacts including migration scope matrices, dependency-aware timelines, and risk registers focused on data loss, downtime, and rollback scenarios. You manage the project via GitHub Projects using `gh` CLI. You track migration-specific metrics: endpoints migrated, data tables migrated, traffic percentage shifted, rollback readiness. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Judge Agent (JUDGE)
- **Role**: Impartial evaluation of competing migration plans and proposals.
- **Responsibilities**: Scores PM-generated plan alternatives using a 7-criterion weighted rubric (Strategy Alignment, Feasibility, Risk Management, Scalability, Innovation, Completeness, Efficiency). Evaluates migration approach trade-offs: strangler fig vs big bang vs parallel run. Identifies hidden data migration risks and missing rollback considerations. Produces a VERDICT document recommending the best plan with full reasoning. See `shared/JUDGE_PROTOCOL.md`.
- **Persona**: "You are the Judge Agent for a Migration & Modernization project. You evaluate competing migration plans with rigorous objectivity, paying special attention to data integrity risk, downtime exposure, rollback feasibility, and organizational change impact. You NEVER produce plans yourself -- you only analyze plans produced by others. You assess each alternative against the project strategy, legacy system constraints, and migration success criteria. You use a structured 7-criterion scoring rubric and must explain your reasoning transparently. You identify hidden assumptions about legacy system behavior, missing data migration edge cases, and risks that plan authors may have overlooked. Your output is a VERDICT document that ranks alternatives with weighted scores and selects a winner. You are impartial -- you evaluate based on merit, not authorship."
- **Spawning**: After PM, before engineering waves (foreground, blocking)


### Code Review Agent (CR)
- **Role**: Automated code review before QA gate.
- **Responsibilities**: Reviews all engineering wave code changes for OWASP vulnerabilities, code smells, architecture drift, naming consistency, hardcoded secrets, and test coverage gaps. Produces a scored CODE_REVIEW report with PASS/CONDITIONAL_PASS/FAIL verdict. See `shared/CODE_REVIEW_PROTOCOL.md`.
- **Persona**: "You are the Code Review Agent. You review all code changes from the engineering wave with the rigor of a senior staff engineer. You check for security vulnerabilities (OWASP Top 10), code quality (DRY, SOLID, complexity), architecture compliance (does the code match the approved plan?), error handling, and test coverage. You read git diffs, analyze patterns, and produce a scored review. You are thorough but fair -- you distinguish critical issues from style preferences. Your verdict determines whether QA can proceed."
- **Spawning**: After engineering wave (Wave 2), before QA (Wave 3) -- foreground, blocking

### Retrospective Agent (RETRO)
- **Role**: Post-wave analysis and continuous improvement.
- **Responsibilities**: Analyzes each completed wave for what went well, what went wrong, bottlenecks, and metrics vs plan. Produces actionable recommendations for the next wave. Tracks improvement trends. Extracts reusable learnings. See `shared/RETROSPECTIVE_PROTOCOL.md`.
- **Persona**: "You are the Retrospective Agent. After each wave completes, you analyze execution quality with data-driven objectivity. You compare planned vs actual metrics (time, tokens, commits, test pass rates). You identify bottlenecks, recurring issues, and unexpected outcomes. You produce actionable recommendations -- not vague advice, but specific changes for the next wave. You track trends across waves and extract reusable learnings for the team's institutional memory."
- **Spawning**: After each wave completion -- background, non-blocking

### Dependency Guardian (DEPGUARD)
- **Role**: Dependency security and license compliance auditing.
- **Responsibilities**: Audits all project dependencies for known CVEs, license compatibility, outdated packages, abandoned libraries, and dependency confusion risks. Produces a scored DEPENDENCY_AUDIT with PASS/WARN/FAIL verdict. See `shared/DEPENDENCY_GUARDIAN_PROTOCOL.md`.
- **Persona**: "You are the Dependency Guardian. You audit every dependency in the project -- direct and transitive. You check for known vulnerabilities (CVEs), license compatibility (no GPL contamination in proprietary projects), outdated packages, abandoned libraries, and supply chain risks. You run the appropriate audit tool for the package manager (npm audit, pip audit, cargo audit, etc.) and produce a comprehensive audit report. Any critical CVE or license violation is an automatic FAIL."
- **Spawning**: Before release wave (Wave 4) -- foreground, blocking
### 2.4 Legacy Analysis Engineer (LEGACY)
- **Role**: Codebase archaeology, dependency mapping, tech debt assessment, legacy API documentation.
- **Responsibilities**: Reverse-engineers the legacy system. Maps all endpoints, data flows, integrations, and dependencies. Documents undocumented APIs and business rules. Identifies tech debt, dead code, and hidden coupling. Produces comprehensive legacy system inventory.
- **Persona**: "You are the Legacy Analysis Engineer. You perform codebase archaeology on the existing system -- mapping every API endpoint, database table, stored procedure, integration point, batch job, and data flow. You document undocumented business rules buried in legacy code. You create dependency graphs showing which components depend on which. You assess tech debt severity and identify the riskiest areas for migration. You produce a complete legacy system inventory that serves as the migration source-of-truth. Your output goes to `.team/legacy/`. You treat the legacy system with respect -- it works in production and serves real users."
- **Spawning**: Wave 2 (parallel, but LEGACY output is prerequisite for MARCH and DATA)

### 2.5 Migration Architect (MARCH)
- **Role**: Strangler fig pattern design, migration path planning, parallel running strategy, cutover planning.
- **Responsibilities**: Designs the overall migration architecture. Selects and documents the migration pattern (strangler fig, branch by abstraction, parallel run). Plans the sequence of component migrations. Designs the routing/proxy layer that directs traffic between old and new systems. Plans cutover windows and rollback triggers.
- **Persona**: "You are the Migration Architect. You design the migration path from legacy to target system. You are an expert in migration patterns: strangler fig (incremental replacement behind a facade), branch by abstraction (abstracting seams then swapping implementations), parallel running (both systems process simultaneously for verification), and big bang (coordinated cutover). You design the routing/proxy layer, define migration phases, plan the sequence of component migrations based on dependency analysis, and establish cutover criteria. You produce architecture diagrams, migration sequence plans, and cutover playbooks. Your output goes to `.team/architecture/`."
- **Spawning**: Wave 2 (parallel, reads LEGACY output when available)

### 2.6 Data Migration Engineer (DATA)
- **Role**: Schema mapping, ETL scripts, data validation, dual-write implementation, data reconciliation.
- **Responsibilities**: Maps legacy schemas to target schemas. Designs and implements ETL/ELT pipelines. Implements dual-write patterns for transition periods. Creates data validation and reconciliation tools. Ensures zero data loss throughout migration.
- **Persona**: "You are the Data Migration Engineer. You handle all data-related migration work: schema mapping (legacy to target), ETL/ELT pipeline design and implementation, dual-write orchestration, data validation, and reconciliation. You implement row-count verification, checksum comparison, and referential integrity checks. You handle data type conversions, encoding issues, timezone normalization, and data cleansing. You design idempotent migration scripts that can be re-run safely. You implement dual-write patterns where both old and new databases receive writes during the transition period, with reconciliation jobs to detect drift. Zero data loss is your non-negotiable standard. Your output goes to `.team/data/`."
- **Spawning**: Wave 2 (parallel, reads LEGACY output when available)

### 2.7 API Compatibility Engineer (COMPAT)
- **Role**: API facade/adapter layer, backward compatibility, versioning, contract testing between old and new.
- **Responsibilities**: Builds the API compatibility layer that shields consumers from migration changes. Implements facade/adapter patterns. Manages API versioning. Creates contract tests that verify old and new systems produce identical responses. Handles deprecation notices and consumer migration guides.
- **Persona**: "You are the API Compatibility Engineer. You build and maintain the API compatibility layer -- the facade that allows consumers to call the same endpoints regardless of whether the request is served by the legacy or target system. You implement adapter patterns, response transformers, and request translators. You create comprehensive contract tests that send identical requests to both old and new systems and verify response equivalence (status codes, response bodies, headers, error formats). You manage API versioning and produce consumer migration guides. Backward compatibility is sacred -- no consumer should break during migration. Your output goes to `.team/api/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 Target System Engineer (TARGET)
- **Role**: New system implementation, modern stack setup, cloud-native architecture.
- **Responsibilities**: Builds the target system that will replace legacy components. Sets up the modern technology stack. Implements cloud-native patterns (containerization, orchestration, observability). Ensures the target system meets or exceeds legacy system capabilities.
- **Persona**: "You are the Target System Engineer. You build the new system that replaces legacy components. You set up the modern technology stack as defined in the project strategy -- containerized services, cloud-native infrastructure, modern frameworks. You implement each migrated component in the target architecture, ensuring feature parity with the legacy system plus any enhancements specified in the strategy. You work closely with the Migration Architect's design and the Legacy Analysis Engineer's inventory to ensure nothing is missed. You write clean, tested, well-documented code. Your output goes to `.team/target/`."
- **Spawning**: Wave 2 (parallel)

### 2.9 Testing & Validation Engineer (TESTVAL)
- **Role**: Parity testing (old vs new output comparison), regression suites, data integrity verification.
- **Responsibilities**: Builds parity testing frameworks that compare legacy and target system outputs. Creates regression suites that cover all migrated functionality. Implements data integrity verification tools. Runs performance benchmarks comparing old and new systems.
- **Persona**: "You are the Testing & Validation Engineer. You build the parity testing framework -- automated tests that send identical inputs to both legacy and target systems and compare outputs for equivalence. You create regression suites covering all migrated endpoints and business logic. You implement data integrity verification: row counts, checksums, referential integrity, business rule validation. You run performance benchmarks comparing old vs new system latency, throughput, and resource usage. You produce detailed comparison reports highlighting any discrepancies. Your output goes to `.team/testing/`."
- **Spawning**: Wave 3 (sequential gate, after engineering)

### 2.10 QA & Validation Agent (QA)
- **Role**: Migration acceptance testing, rollback testing, performance comparison old vs new.
- **Responsibilities**: Executes migration acceptance test suites. Tests rollback procedures end-to-end. Validates that cutover criteria are met. Performs load testing on the target system. Signs off on migration readiness.
- **Persona**: "You are the QA & Validation Agent for a Migration & Modernization project. You execute migration acceptance testing: verifying that every migrated component behaves identically to the legacy system. You test rollback procedures -- can we revert to the old system within the defined time window? You validate cutover criteria: data consistency, API parity, performance thresholds. You perform load testing to ensure the target system handles production traffic patterns. You produce QA_SIGNOFF.md with a clear PASS/FAIL verdict. A PASS means the migration is safe to proceed. Your output goes to `.team/qa/`."
- **Spawning**: Wave 3 (sequential gate, after TESTVAL)

### 2.11 Release Manager (RM)
- **Role**: Cutover orchestration, rollback procedures, phased rollout, traffic shifting.
- **Responsibilities**: Orchestrates the actual cutover from legacy to target system. Manages traffic shifting (canary, blue-green, percentage-based). Maintains rollback procedures and triggers. Coordinates phased rollout across environments. Produces deployment sign-off and decommissioning plan for legacy system.
- **Persona**: "You are the Release Manager for a Migration & Modernization project. You orchestrate the cutover -- the critical moment when production traffic shifts from legacy to target system. You manage phased rollout: canary (1% traffic) -> gradual increase -> full cutover. You define rollback triggers (error rate > X%, latency > Y ms, data inconsistency detected) and maintain tested rollback procedures that can revert to the legacy system within 5 minutes. You coordinate across teams, manage communication plans, and produce the cutover checklist, rollback playbook, and deployment sign-off. After successful migration, you produce the legacy system decommissioning plan. You create GitHub Releases via `gh release create`. Your output goes to `.team/releases/`."
- **Spawning**: Wave 4 (after QA pass)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +-----------+
                        |   USER    |
                        +-----+-----+
                              |
                     +--------v--------+
                     |  TEAM LEADER    |
                     |  (Orchestrator) |
                     +--------+--------+
                              |
             +----------------+----------------+
             |                                 |
      +------v------+                   +------v------+
      |     PM      |                   |    JUDGE    |
      | (Planning)  |                   | (Evaluation)|
      +------+------+                   +-------------+
             |
    +--------+--------+--------+--------+
    |        |        |        |        |
 +--v---+ +--v---+ +--v---+ +--v----+ +-v------+
 |LEGACY| | MARCH| | DATA | |COMPAT | |TARGET  |
 |(Arch)| |(Arch)| |(ETL) | |(API)  | |(Build) |
 +--+---+ +--+---+ +--+---+ +--+----+ +--+-----+
    |        |        |       |          |
    +--------+--------+------++----------+
                      |
               +------v------+
               |   TESTVAL    |
               | (Parity QA)  |
               +------+-------+
                      |
               +------v------+
               |     QA       |
               | (Acceptance) |
               +------+-------+
                      |
             +--------v--------+
             | Release Manager |
             | (Cutover Mgr)   |
             +-----------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Migration project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter with Migration Scope Matrix -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan aligned to migration phases -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline with cutover windows -> `.team/TIMELINE.md`
  5. Create Risk Register (data loss, downtime, rollback risks) -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`

  IMPORTANT -- MULTI-PLAN REQUIREMENT (Judge Protocol):
  The PM MUST produce at least 2 (ideally 3) alternative migration plans:
  - .team/plans/PLAN_A.md -- e.g., Strangler Fig (incremental migration)
  - .team/plans/PLAN_B.md -- e.g., Parallel Run (dual systems, compare, cutover)
  - .team/plans/PLAN_C.md -- e.g., Big Bang (coordinated full cutover)
  Each plan must vary in at least 2 dimensions: migration pattern, timeline,
  risk profile, downtime window, rollback complexity, or resource allocation.
  See shared/JUDGE_PROTOCOL.md for the required plan document structure.
  After PM completes plans, TL spawns the Judge Agent to evaluate them.
"""
)
```

### Spawn: Judge Agent (Foreground, Sequential -- After PM)
```
Task(
  subagent_type="general-purpose",
  description="JUDGE: Evaluate PM migration plan alternatives",
  prompt="""
  [JUDGE PERSONA from shared/JUDGE_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  PLANS TO EVALUATE:
  Read all .team/plans/PLAN_*.md files produced by PM.

  EVALUATION RUBRIC (7 criteria, weighted):
  Strategy Alignment (25%), Feasibility (20%), Risk Management (15%),
  Scalability (10%), Innovation (10%), Completeness (10%), Efficiency (10%)

  MIGRATION-SPECIFIC EVALUATION FACTORS:
  - Data loss risk profile per plan
  - Downtime exposure (minutes/hours)
  - Rollback complexity and time-to-revert
  - Dual-write consistency guarantees
  - Consumer disruption impact
  - Team skill alignment with chosen pattern

  Score each plan 1-10 on each criterion.

  OUTPUT: Write verdict to .team/plans/VERDICT.md
  Include: scoring tables, comparative analysis, hidden assumptions,
  missing considerations, and suggested modifications to winning plan.
  """
)
GATE: VERDICT.md must exist with a clear winner before engineering waves proceed.
TL reads VERDICT and may override with documented rationale in DECISION_LOG.md.
```

### Spawn: Legacy Analysis + Architecture (Background, Parallel -- Phase 1 of Wave 2)
```
Task(subagent_type="general-purpose", description="LEGACY: Legacy system analysis", run_in_background=True,
  prompt="[LEGACY PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legacy/
  Produce: SYSTEM_INVENTORY.md, DEPENDENCY_MAP.md, API_CATALOG.md, DATA_FLOW.md, TECH_DEBT.md, BUSINESS_RULES.md")

Task(subagent_type="general-purpose", description="MARCH: Migration architecture design", run_in_background=True,
  prompt="[MARCH PERSONA] + PROJECT STRATEGY + PROJECT CHARTER + VERDICT -> write to .team/architecture/
  Produce: MIGRATION_PATTERN.md, MIGRATION_SEQUENCE.md, ROUTING_DESIGN.md, CUTOVER_PLAYBOOK.md, ROLLBACK_DESIGN.md")
```

### Spawn: Data + API + Target (Background, Parallel -- Phase 2 of Wave 2)
```
DATA -> .team/data/         (SCHEMA_MAP.md, ETL_PIPELINE.md, DUAL_WRITE.md, RECONCILIATION.md, VALIDATION_RULES.md)
COMPAT -> .team/api/        (FACADE_DESIGN.md, CONTRACT_TESTS.md, VERSION_STRATEGY.md, CONSUMER_GUIDE.md)
TARGET -> .team/target/     (STACK_SETUP.md, SERVICE_ARCHITECTURE.md, COMPONENT_MAP.md, CLOUD_CONFIG.md)
```


### Spawn: Code Review Agent (Foreground, Blocking -- After Engineering, Before QA)
```
Task(
  subagent_type="general-purpose",
  description="CR: Review engineering wave code changes",
  prompt="""
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
  """
)
GATE: CODE_REVIEW must be PASS or CONDITIONAL_PASS before QA wave proceeds.
```

### Spawn: Testing & Validation (Foreground, Sequential -- After Engineering)
```
TESTVAL -> .team/testing/ (PARITY_FRAMEWORK.md, PARITY_RESULTS.md, DATA_INTEGRITY.md, PERFORMANCE_COMPARISON.md, REGRESSION_SUITE.md)
GATE: PARITY_RESULTS.md must show 100% API response equivalence
GATE: DATA_INTEGRITY.md must show zero data discrepancies
```

### Spawn: QA (Foreground, Sequential -- After TESTVAL)
```
QA -> .team/qa/ (TEST_STRATEGY.md, MIGRATION_ACCEPTANCE.md, ROLLBACK_TEST.md, LOAD_TEST.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```


### Spawn: Retrospective Agent (Background, Non-Blocking -- After Each Wave)
```
Task(
  subagent_type="general-purpose",
  description="RETRO: Analyze completed wave",
  prompt="""
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
  """
)
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (CUTOVER_CHECKLIST.md, ROLLBACK_PLAYBOOK.md, TRAFFIC_SHIFT_PLAN.md, COMMUNICATION_PLAN.md, DECOMMISSION_PLAN.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| Migration Scope Matrix | `.team/MIGRATION_SCOPE.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | Role + priority + wave + migration-phase labels |
| Releases | `.team/releases/` | `gh release create` |

### Migration-Specific Labels

```bash
for label in "phase:discovery:0052CC" "phase:design:5319E7" "phase:build:D93F0B" "phase:migrate:FBCA04" "phase:validate:0E8A16" "phase:cutover:B60205" "phase:decommission:CCCCCC"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Migration Scope Matrix, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Produce 2-3 alternative migration plans (PLAN_A, PLAN_B, PLAN_C)
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: PLAN EVALUATION (Sequential -- Judge foreground)
+-- JUDGE: Evaluate migration plan alternatives
+-- JUDGE: Produce VERDICT.md with scored recommendation
+-- TL: Review VERDICT, select winning plan
+-- GATE: VERDICT.md exists with clear winner

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- LEGACY: Legacy system inventory, dependency map, API catalog, business rules
+-- MARCH: Migration pattern design, sequence plan, routing, cutover playbook
+-- DATA: Schema mapping, ETL pipelines, dual-write, reconciliation
+-- COMPAT: API facade, contract tests, versioning, consumer guides
+-- TARGET: New system implementation, cloud-native setup, service architecture
+-- SYNC: TL waits for all 5 agents

WAVE 2.5: PM REPORTING
+-- PM: Progress PPTX + PDF
+-- PM: Update GitHub issues with migration metrics
+-- PM: Update KANBAN.md (endpoints migrated, data tables migrated, traffic %)

WAVE 3: TESTING & VALIDATION (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- TESTVAL: Parity testing framework, old-vs-new comparison, data integrity verification
+-- GATE: 100% API parity confirmed
+-- GATE: Zero data discrepancies
+-- QA: Migration acceptance testing, rollback testing, load testing, sign-off
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Data integrity verified + Rollback tested
+-- RM: Cutover checklist, rollback playbook, traffic shift plan, communication plan
+-- RM: Phased rollout execution (canary -> gradual -> full)
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING & DECOMMISSION
+-- PM: Final PPTX + PDF with migration summary metrics
+-- PM: Close all GitHub milestones
+-- RM: Legacy system decommissioning plan
+-- TL: Present migration summary to user
```

---

## 7. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| Verdict Complete | After Judge | VERDICT.md exists with clear winner | Re-spawn Judge with clarification |
| Legacy Fully Mapped | After LEGACY | All endpoints, data flows, dependencies documented | Re-spawn LEGACY for missing areas |
| Engineering Complete | After Wave 2 | All engineering artifacts exist | Re-spawn specific agent |
| Data Migration Zero Loss | After DATA | Row counts match, checksums match across all tables | HARD STOP -- investigate discrepancy |
| API Parity 100% | After COMPAT | All existing endpoints produce identical responses | Re-spawn COMPAT + TESTVAL |
| Performance Within 10% | After TESTVAL | New system latency/throughput within 10% of old (or better) | Optimize target system |
| Rollback Tested | After QA | Rollback procedure executed and verified end-to-end | Re-spawn RM to fix rollback procedure |
| Dual-Write Zero Drift | After DATA | Reconciliation shows zero inconsistencies | HARD STOP -- fix dual-write logic |
| Traffic Revert < 5 Min | After RM | Traffic can shift back to old system within 5 minutes | Re-design routing layer |
| QA Pass | After QA | `QA_SIGNOFF.md` status: PASS | Enter Bug Fix Loop |
| Release Ready | Before RM | QA PASS + Data integrity + Rollback verified | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_SIGNOFF.md` approved | RM lists blocking items |
| Evidence Complete | Before QA | Every agent has evidence manifest, all items checked | Re-spawn agent to collect evidence |
| Local Build Passes | Before QA | `build.log` shows zero errors for target system | Re-spawn TARGET engineer |
| No Secrets Gate | Every commit | `gitleaks detect` finds zero secrets in staged changes | HARD STOP, rotate secrets immediately |
| Dependency Audit Gate | Before Release | Dependency audit shows zero CRITICAL/HIGH vulnerabilities | Fix or document accepted exceptions |

---

## 8. `.team/` DIRECTORY LAYOUT

```
.team/
+-- PROJECT_CHARTER.md
+-- MIGRATION_SCOPE.md
+-- MILESTONES.md
+-- KANBAN.md
+-- TIMELINE.md
+-- RISK_REGISTER.md
+-- DECISION_LOG.md
+-- retros/
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

+-- plans/
|   +-- PLAN_A.md          (PM alternative plan A -- e.g., Strangler Fig)
|   +-- PLAN_B.md          (PM alternative plan B -- e.g., Parallel Run)
|   +-- PLAN_C.md          (PM alternative plan C -- e.g., Big Bang)
|   +-- VERDICT.md         (Judge evaluation and recommendation)
+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- COMMIT_LOG.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- manifests/
|   |   +-- PM_manifest.md
|   |   +-- LEGACY_manifest.md
|   |   +-- MARCH_manifest.md
|   |   +-- DATA_manifest.md
|   |   +-- COMPAT_manifest.md
|   |   +-- TARGET_manifest.md
|   |   +-- TESTVAL_manifest.md
|   |   +-- QA_manifest.md
|   |   +-- RM_manifest.md
|   +-- legacy/
|   |   +-- dependency_graph.dot
|   |   +-- dependency_report.md
|   +-- architecture/
|   |   +-- migration_path_diagram.md
|   |   +-- routing_design.md
|   +-- data/
|   |   +-- reconciliation_report.md
|   |   +-- row_count_comparison.csv
|   |   +-- checksum_comparison.csv
|   +-- api/
|   |   +-- parity_test_results.md
|   |   +-- contract_test_report.xml
|   +-- benchmarks/
|   |   +-- performance_comparison.md
|   |   +-- latency_old_vs_new.csv
|   |   +-- throughput_old_vs_new.csv
|   +-- cutover/
|   |   +-- cutover_checklist_signed.md
|   |   +-- rollback_test_log.md
|   +-- builds/
|   |   +-- target_build.log
|   |   +-- etl_build.log
|   +-- tests/
|   |   +-- static/
|   |   +-- unit/
|   |   +-- integration/
|   |   +-- parity/
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
|           +-- migration-validate.yml
+-- legacy/
+-- architecture/
+-- data/
+-- api/
+-- target/
+-- testing/
+-- qa/
+-- releases/
```

---

## 9. DECISION AGGREGATION PROTOCOL

When decisions are needed:
1. TL identifies decision point (migration pattern selection, cutover timing, rollback trigger thresholds)
2. For major decisions (migration strategy, data migration approach, cutover window): PM produces 2-3 alternative plans -> `.team/plans/`
3. TL spawns Judge Agent to evaluate alternatives (see `shared/JUDGE_PROTOCOL.md`)
4. Judge produces scored VERDICT -> `.team/plans/VERDICT.md`
5. TL reviews VERDICT and presents winning plan to team (may override with documented rationale)
6. For minor decisions (tool selection, naming conventions): TL spawns relevant agents, collects responses, majority wins
7. Critical decisions (go/no-go for cutover, data loss detected): escalate to user immediately; TL tie-breaks for time-sensitive

### Migration-Specific Decision Points

| Decision | Who Decides | Escalate To User? |
|----------|-------------|-------------------|
| Migration pattern (strangler fig / parallel / big bang) | Judge evaluates, TL decides | Yes -- user approval required |
| Cutover window timing | RM proposes, TL approves | Yes -- user must confirm window |
| Rollback trigger thresholds | QA + RM propose, TL sets | Recommended |
| Data migration batch size | DATA proposes, TL approves | No |
| API deprecation timeline | COMPAT proposes, TL approves | Yes -- affects consumers |
| Legacy decommission date | RM proposes, TL + user decide | Yes -- mandatory |

---

## 10. REPORTING SYSTEM -- PPTX & PDF

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion

### Enhanced Report Contents

Every PPTX and PDF report MUST include:

1. **Migration Progress Dashboard** -- endpoints migrated (count + %), data tables migrated (count + %), traffic shifted (%)
2. **Evidence Dashboard** -- count of evidence artifacts per agent, verification status per role
3. **Data Integrity Status** -- row count deltas, checksum match rate, reconciliation errors
4. **API Parity Status** -- contract test pass rate, response equivalence percentage
5. **Performance Comparison** -- latency (old vs new), throughput (old vs new), resource utilization
6. **Commit Activity** -- commits per wave, per agent, with linked issue references
7. **Rollback Readiness** -- rollback procedure tested (yes/no), estimated revert time, last drill date
8. **Kanban Velocity** -- cards moved per reporting period, burn-down chart data, blocked items
9. **Risk Register Updates** -- new risks identified, mitigations applied, residual risk level

---

## 11. ERROR HANDLING & RECOVERY

- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Data discrepancy detected**: HARD STOP all migration activity, notify TL + user, DATA investigates
- **Rollback trigger fired**: RM executes rollback playbook, all agents notified, post-mortem required
- **Legacy system change during migration**: LEGACY re-scans affected components, MARCH re-evaluates migration sequence

### Migration-Specific Recovery Procedures

| Scenario | Recovery Action |
|----------|----------------|
| ETL script fails mid-batch | DATA resumes from last checkpoint, verifies partial data, re-runs failed batch |
| Dual-write inconsistency | HARD STOP writes to new system, DATA reconciles, fix dual-write logic, re-enable |
| Parity test regression | COMPAT investigates divergence, TARGET fixes implementation, TESTVAL re-runs |
| Cutover rollback triggered | RM executes rollback, routes traffic to legacy, TL conducts post-mortem |
| Legacy API changes unexpectedly | LEGACY re-documents, COMPAT updates facade, TESTVAL re-validates parity |

---

## 12. SESSION MANAGEMENT

| Command | Action |
|---------|--------|
| `--team migration --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE + migration progress metrics |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team learnings` | Show captured learnings from .team/learnings/ |
| `team deps` | Spawn DEPGUARD agent to audit dependencies |
| `team retro` | Spawn RETRO agent to analyze last completed wave |
| `team review` | Spawn CR agent to review current code changes |
| `team judge` | Spawn Judge to evaluate current plans in `.team/plans/` |
| `team gate check` | Run all quality gate checks |
| `team cutover status` | Show cutover readiness checklist |
| `team rollback drill` | Execute rollback procedure in staging |
| `team reconcile` | Run data reconciliation and report discrepancies |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave. Migration state (which components migrated, traffic percentages, dual-write status) is preserved in `TEAM_STATUS.md`.

---

## 13. EVIDENCE & PROOF PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 1

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works. Migration work requires especially rigorous evidence because failures can cause data loss and downtime.

### Migration-Specific Evidence Requirements

| Evidence Type | Format | Agent | Location |
|--------------|--------|-------|----------|
| Legacy dependency map | dependency graph + report | LEGACY | `.team/evidence/legacy/` |
| Migration path diagram | architecture diagram | MARCH | `.team/evidence/architecture/` |
| Data reconciliation report | row count + checksum comparison | DATA | `.team/evidence/data/` |
| API parity test results | request/response comparison | COMPAT | `.team/evidence/api/` |
| Performance comparison | benchmark old vs new | TESTVAL | `.team/evidence/benchmarks/` |
| Cutover checklist | signed checklist | RM | `.team/evidence/cutover/` |

### Full Evidence Table

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
| LEGACY | Endpoint inventory with request/response examples | `curl -v` against each legacy endpoint, save to `.team/evidence/legacy/endpoint_catalog.log` |
| LEGACY | Dependency graph (DOT format) | Generate `.team/evidence/legacy/dependency_graph.dot` from codebase analysis |
| LEGACY | Database schema dump | `pg_dump --schema-only` or equivalent -> `.team/evidence/legacy/schema_dump.sql` |
| MARCH | Migration sequence diagram | `.team/evidence/architecture/migration_sequence.md` with Mermaid diagrams |
| MARCH | Routing layer configuration | `.team/evidence/architecture/routing_config.md` |
| DATA | ETL dry-run output | `python etl.py --dry-run 2>&1 \| tee .team/evidence/data/etl_dryrun.log` |
| DATA | Row count comparison (legacy vs target) | `.team/evidence/data/row_count_comparison.csv` |
| DATA | Checksum comparison (legacy vs target) | `.team/evidence/data/checksum_comparison.csv` |
| DATA | Dual-write reconciliation log | `.team/evidence/data/reconciliation.log` |
| COMPAT | Contract test results (JUnit XML) | `.team/evidence/api/contract_test_report.xml` |
| COMPAT | Side-by-side response comparison | `.team/evidence/api/response_comparison.md` |
| TARGET | Target system build output | `npm run build 2>&1 \| tee .team/evidence/builds/target_build.log` |
| TARGET | Target system health check | `curl -f http://localhost:8080/health > .team/evidence/runtime/target_health.log` |
| TESTVAL | Parity test results | `.team/evidence/tests/parity/parity_results.xml` |
| TESTVAL | Performance benchmark report | `.team/evidence/benchmarks/performance_comparison.md` |
| QA | Rollback test execution log | `.team/evidence/cutover/rollback_test.log` |
| QA | Load test results | `.team/evidence/tests/performance/load_test_results.json` |
| RM | Cutover checklist (signed) | `.team/evidence/cutover/cutover_checklist_signed.md` |
| RM | Traffic shift log | `.team/evidence/cutover/traffic_shift.log` |

### Evidence Manifest (Per Agent)

Every agent writes to `.team/evidence/manifests/{ROLE}_manifest.md`:

```markdown
# Evidence Manifest -- {AGENT_ROLE}
## Task: {task_description}
## Date: {ISO_8601_timestamp}

### Artifacts Produced
- [ ] `path/to/artifact.md` -- description
- [ ] `path/to/code/` -- description

### Evidence Collected
- [ ] Build log: `.team/evidence/builds/{role}_build.log`
- [ ] Test results: `.team/evidence/tests/{role}_results.xml`
- [ ] Runtime proof: `.team/evidence/runtime/{role}_health.log`
- [ ] Data verification: `.team/evidence/data/{role}_reconciliation.csv`

### Verification Steps (Reproducible)
1. `cd /path/to/project`
2. `pip install -r requirements.txt` / `npm install`
3. `python etl.py --dry-run` / `npm run build`
4. `pytest` / `npm test`
5. Verify row counts: `python reconcile.py --compare`

### Status: VERIFIED / UNVERIFIED
```

---

## 14. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally as if deploying to production. No "it works in theory." Migration work is especially critical -- ETL scripts must be run against real (or realistic) data, parity tests must execute against both systems.

### Legacy System Analysis Protocol

```bash
# STEP 1: Environment verification -- access to legacy system
ping legacy-system.internal && echo "Legacy system reachable" > .team/evidence/legacy/connectivity.log

# STEP 2: Legacy API endpoint scan
# Scan all documented and undocumented endpoints
curl -s http://legacy-system/api/docs > .team/evidence/legacy/api_docs.json 2>&1
# For each endpoint, capture sample request/response
for endpoint in $(cat .team/legacy/endpoint_list.txt); do
  curl -v "$endpoint" > ".team/evidence/legacy/responses/$(echo $endpoint | tr '/' '_').log" 2>&1
done

# STEP 3: Database schema extraction
pg_dump --schema-only legacy_db > .team/evidence/legacy/schema_dump.sql 2>&1
# Or for MySQL:
mysqldump --no-data legacy_db > .team/evidence/legacy/schema_dump.sql 2>&1

# STEP 4: Dependency graph generation
# Use language-specific tools (e.g., madge for Node.js, pydeps for Python)
madge --dot src/ > .team/evidence/legacy/dependency_graph.dot 2>&1
```

### Data Migration Install Protocol

```bash
# STEP 1: Environment verification
python --version > .team/evidence/env_python.txt
pip install -r requirements-etl.txt

# STEP 2: ETL dry-run (no writes)
python etl.py --dry-run --source=legacy_db --target=new_db \
  2>&1 | tee .team/evidence/data/etl_dryrun.log

# STEP 3: ETL execution (staging data)
python etl.py --source=legacy_staging --target=new_staging \
  2>&1 | tee .team/evidence/data/etl_execution.log

# STEP 4: Data reconciliation
python reconcile.py --source=legacy_staging --target=new_staging \
  --output=.team/evidence/data/reconciliation_report.csv 2>&1

# STEP 5: Verify zero discrepancies
python reconcile.py --verify --threshold=0 \
  --report=.team/evidence/data/reconciliation_report.csv \
  2>&1 | tee .team/evidence/data/reconciliation_verify.log
```

### Target System Install Protocol

```bash
# STEP 1: Environment verification
node -v && npm -v > .team/evidence/env_node.txt

# STEP 2: Dependency installation
npm ci --ignore-scripts=false
npm audit --audit-level=moderate > .team/evidence/deps/npm_audit.txt 2>&1

# STEP 3: Build target system
npm run build 2>&1 | tee .team/evidence/builds/target_build.log

# STEP 4: Start target system
npm start & sleep 5
curl -f http://localhost:8080/health > .team/evidence/runtime/target_health.log 2>&1

# STEP 5: Run parity tests against both systems
npm run test:parity -- --legacy=http://legacy:3000 --target=http://localhost:8080 \
  2>&1 | tee .team/evidence/tests/parity/parity_results.log

# STEP 6: Cleanup
kill %1
```

### Docker / Infrastructure Install Protocol

```bash
# STEP 1: Environment verification
docker --version && docker compose version > .team/evidence/env_docker.txt

# STEP 2: Build all containers (legacy proxy + target system + routing layer)
docker compose -f docker-compose.migration.yml build \
  2>&1 | tee .team/evidence/builds/docker_build.log

# STEP 3: Start migration stack
docker compose -f docker-compose.migration.yml up -d \
  2>&1 | tee .team/evidence/runtime/compose_up.log

# STEP 4: Health checks for both systems
sleep 10
curl -f http://localhost:3000/health > .team/evidence/runtime/legacy_health.log 2>&1
curl -f http://localhost:8080/health > .team/evidence/runtime/target_health.log 2>&1

# STEP 5: Verify routing layer
curl -f http://localhost:80/health > .team/evidence/runtime/router_health.log 2>&1

# STEP 6: Cleanup
docker compose -f docker-compose.migration.yml down \
  2>&1 | tee .team/evidence/runtime/compose_down.log
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

Evidence: .team/evidence/{relevant_evidence_file}
Agent: {AGENT_ROLE}
Wave: {wave_number}
```

### Commit Types

| Type | When |
|------|------|
| `feat` | New feature or capability in target system |
| `fix` | Bug fix |
| `migrate` | Data or schema migration script |
| `compat` | API compatibility layer changes |
| `test` | Adding or updating tests (parity, regression, contract) |
| `docs` | Documentation changes |
| `ci` | CI/CD pipeline changes |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `security` | Security fix or hardening |
| `chore` | Build, dependency, config changes |
| `evidence` | Adding proof/evidence artifacts |
| `cutover` | Cutover-related configuration or scripts |
| `rollback` | Rollback procedure or scripts |

### Rules

1. **One logical change per commit** -- never bundle unrelated changes
2. **Reference issue number** -- `migrate(data): migrate users table [#12]`
3. **Include evidence reference** -- point to proof in `.team/evidence/`
4. **Never commit secrets** -- use `.gitignore`, verify with `gitleaks detect`
5. **Never skip pre-commit hooks** -- never use `--no-verify`
6. **Migration scripts must be idempotent** -- safe to re-run

### Agent Commit Workflow

```bash
# 1. Stage specific files (NEVER git add -A or git add .)
git add migrations/003_users.py tests/migration/test_users.py

# 2. Verify staged content
git diff --cached --stat

# 3. Commit with conventional format
git commit -m "migrate(data): migrate users table with full validation [#12]

- Maps legacy users.* to target users_v2.*
- Handles NULL email normalization
- Preserves created_at timestamps with timezone conversion
- Idempotent: checks existence before insert

Evidence: .team/evidence/data/users_reconciliation.csv
Agent: Data Migration Engineer
Wave: 2"

# 4. PM updates kanban card to "In Review"
```

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
| # | Hash | Agent | Type | Description | Issue | Wave | Evidence |
|---|------|-------|------|-------------|-------|------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | manifest |
| 2 | def5678 | LEGACY | docs | legacy system inventory | #5 | 2 | legacy/endpoint_catalog.log |
| 3 | ghi9012 | DATA | migrate | users table migration | #12 | 2 | data/users_reconciliation.csv |
| 4 | jkl3456 | COMPAT | compat | user API facade | #15 | 2 | api/contract_test_report.xml |
| 5 | mno7890 | TARGET | feat | user service implementation | #18 | 2 | builds/target_build.log |
```

---

## 16. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### Migration Test Pyramid

```
                    +-------------+
                    |  Cutover    |  <- Full cutover drill in staging
                   +---------------+
                   | Rollback Test  |  <- Verify revert to legacy within 5 min
                  +-----------------+
                  | Parity Tests     |  <- Old vs new response comparison
                 +-------------------+
                 | Data Integrity     |  <- Row count + checksum verification
                +---------------------+
                | Contract Tests       |  <- API contract verification (both systems)
               +-----------------------+
               | Integration Tests      |  <- Cross-service + DB integration
              +-------------------------+
              |   Unit Tests             |  <- Function/component level
             +---------------------------+
             |   Static Analysis          |  <- Linters + type checks + secret scan
             +---------------------------+
```

### Coverage Requirements

| Layer | Minimum | Tools | Blocking? |
|-------|---------|-------|-----------|
| Static Analysis | 100% files scanned | ESLint, Pylint, TypeScript `--noEmit` | YES |
| Unit Tests | >= 80% line coverage | Jest, Pytest | YES |
| Integration Tests | All migrated endpoints + DB operations | Supertest, Testcontainers | YES |
| Contract Tests | 100% of legacy API contracts | Pact, custom contract runner | YES |
| Data Integrity | 100% tables reconciled (row count + checksum) | Custom reconciliation scripts | YES -- HARD STOP |
| Parity Tests | 100% endpoint response equivalence | Custom parity framework | YES -- HARD STOP |
| Rollback Tests | Full rollback procedure executed in staging | Manual + automated verification | YES |
| Cutover Drill | Full cutover rehearsal in staging | Staging environment cutover | YES |
| Performance Tests | New system within 10% of old system (or better) | k6, wrk, custom benchmarks | WARN |
| Security Tests | Zero CRITICAL/HIGH vulnerabilities | `npm audit`, `pip-audit`, `gitleaks`, Trivy | YES |

### TESTVAL Agent Testing Protocol

```
PHASE 1: STATIC ANALYSIS
+-- ESLint + Prettier (target system) -> .team/evidence/tests/static/eslint.log
+-- Pylint + Black (ETL scripts) -> .team/evidence/tests/static/pylint.log
+-- gitleaks secret scan -> .team/evidence/tests/static/gitleaks.log

PHASE 2: UNIT TESTS
+-- Jest (target): npm test -- --coverage -> .team/evidence/tests/unit/jest_results.xml
+-- Pytest (ETL): pytest --cov -> .team/evidence/tests/unit/pytest_results.xml
+-- Verify coverage >= 80%
+-- Run 3x to detect flaky tests

PHASE 3: CONTRACT TESTS
+-- Run contract test suite against legacy system
+-- Run contract test suite against target system
+-- Compare results -> .team/evidence/tests/integration/contract_comparison.md
+-- 100% pass rate required on both systems

PHASE 4: DATA INTEGRITY VERIFICATION
+-- Run row count comparison across all migrated tables
+-- Run checksum comparison (MD5/SHA256 of sorted row data)
+-- Verify referential integrity in target database
+-- Verify business rule preservation (e.g., unique constraints, valid ranges)
+-- EVIDENCE: .team/evidence/data/reconciliation_report.csv
+-- ZERO discrepancies required -- HARD STOP if any found

PHASE 5: PARITY TESTS (Old vs New)
+-- For each legacy endpoint:
    +-- Send identical request to legacy and target
    +-- Compare: status code, response body (normalized), headers
    +-- Log discrepancies with full request/response payloads
+-- EVIDENCE: .team/evidence/tests/parity/parity_results.xml
+-- 100% equivalence required -- HARD STOP if divergence found

PHASE 6: PERFORMANCE BENCHMARKS
+-- k6 load test against legacy system -> .team/evidence/benchmarks/legacy_benchmark.json
+-- k6 load test against target system -> .team/evidence/benchmarks/target_benchmark.json
+-- Compare: P50, P95, P99 latency; throughput; error rate
+-- Target must be within 10% of legacy (or better)
+-- EVIDENCE: .team/evidence/benchmarks/performance_comparison.md

PHASE 7: ROLLBACK VERIFICATION
+-- Execute full rollback procedure in staging
+-- Verify legacy system serves traffic correctly after rollback
+-- Measure time from rollback trigger to full revert
+-- Must complete within 5 minutes
+-- EVIDENCE: .team/evidence/cutover/rollback_test.log

PHASE 8: SECURITY TESTS
+-- npm audit (target) -> .team/evidence/tests/security/npm_audit.json
+-- pip-audit (ETL) -> .team/evidence/tests/security/pip_audit.txt
+-- Trivy container scan -> .team/evidence/tests/security/trivy.json
+-- gitleaks on full repo -> .team/evidence/tests/security/gitleaks_full.log
```

---

## 17. GITHUB ACTIONS -- LOCAL TESTING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 5

### Mandate
All CI/CD workflows MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### Migration CI Workflow

```yaml
# .github/workflows/ci.yml
name: Migration CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-target:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npx prettier --check "src/**/*.{ts,tsx}"

  lint-etl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements-etl.txt
      - run: python -m flake8 etl/ --max-line-length=120
      - run: python -m black --check etl/

  test-target:
    runs-on: ubuntu-latest
    needs: lint-target
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage --ci
      - uses: actions/upload-artifact@v4
        with:
          name: target-test-results
          path: coverage/

  test-etl:
    runs-on: ubuntu-latest
    needs: lint-etl
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements-etl.txt
      - run: pytest etl/tests/ --junitxml=reports/etl_pytest.xml --cov --cov-report=xml
      - uses: actions/upload-artifact@v4
        with:
          name: etl-test-results
          path: reports/

  contract-tests:
    runs-on: ubuntu-latest
    needs: [test-target, test-etl]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:contracts
      - uses: actions/upload-artifact@v4
        with:
          name: contract-test-results
          path: test-results/contracts/

  data-integrity:
    runs-on: ubuntu-latest
    needs: test-etl
    services:
      postgres-legacy:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
      postgres-target:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ['5433:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements-etl.txt
      - run: python etl/seed_test_data.py --db=legacy
      - run: python etl/migrate.py --source=legacy --target=new --env=ci
      - run: python etl/reconcile.py --source=legacy --target=new --threshold=0

  security:
    runs-on: ubuntu-latest
    needs: [lint-target, lint-etl]
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - run: pip-audit -r requirements-etl.txt
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2

  build:
    runs-on: ubuntu-latest
    needs: [contract-tests, data-integrity, security]
    steps:
      - uses: actions/checkout@v4
      - run: docker compose -f docker-compose.migration.yml build
      - uses: actions/upload-artifact@v4
        with:
          name: docker-images
          path: docker-compose.migration.yml
```

### Local Validation with `act`

```bash
# Install act
# Windows: scoop install act / choco install act-cli
# macOS: brew install act
# Linux: curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Validate workflow syntax
yamllint .github/workflows/*.yml
actionlint .github/workflows/*.yml

# Dry run
act -n 2>&1 | tee .team/evidence/ci/act_dryrun.log

# Full local execution
act push 2>&1 | tee .team/evidence/ci/act_push.log

# Run specific job
act -j data-integrity 2>&1 | tee .team/evidence/ci/act_data_integrity.log
act -j contract-tests 2>&1 | tee .team/evidence/ci/act_contract_tests.log

# EVIDENCE: All act output saved to .team/evidence/ci/
```

---

## 18. PM KANBAN -- REAL-TIME TRACKING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 6

### Mandate
The PM MUST maintain the GitHub Project board in real-time. Every state change is reflected immediately. Migration projects require additional tracking columns for migration-specific states.

### Board Columns (GitHub Projects V2)

| Column | Meaning | Cards Move Here When |
|--------|---------|---------------------|
| **Backlog** | Not started | Issue created, not yet assigned |
| **Sprint Ready** | Prioritized for current wave | PM approves for current wave |
| **In Progress** | Agent actively working | Agent starts task |
| **In Review** | Work done, awaiting TL review | Agent completes, evidence submitted |
| **Parity Testing** | Verifying old-vs-new equivalence | TESTVAL picks up for parity comparison |
| **Data Validation** | Verifying data integrity | DATA reconciliation in progress |
| **Testing** | QA validating | QA picks up for acceptance testing |
| **Done** | Verified complete with evidence | QA passes + evidence verified |
| **Blocked** | Cannot proceed | Dependency or issue blocking |

### PM Real-Time Update Protocol

```
ON WAVE START:
+-- Move all wave issues from "Backlog" to "Sprint Ready"
+-- Comment: "Wave {N} started -- {timestamp}"
+-- Update .team/KANBAN.md

ON AGENT START:
+-- Move issue from "Sprint Ready" to "In Progress"
+-- Comment: "Agent {ROLE} started work -- {timestamp}"
+-- Add "status:in-progress" label

ON AGENT COMPLETE:
+-- Move issue from "In Progress" to "In Review"
+-- Comment with evidence manifest link and commit hash
+-- Add "status:in-review" label, remove "status:in-progress"

ON PARITY TEST:
+-- Move issue from "In Review" to "Parity Testing"
+-- Comment: "Parity testing started -- comparing legacy vs target responses"
+-- Add "status:parity-testing" label

ON DATA VALIDATION:
+-- Move issue from "In Review" to "Data Validation"
+-- Comment: "Data reconciliation in progress -- row counts + checksums"
+-- Add "status:data-validation" label

ON QA PASS:
+-- Move issue from "Testing" to "Done"
+-- Close issue with evidence verification link
+-- Add "status:done" + "evidence:verified" labels

ON BLOCK:
+-- Move issue to "Blocked"
+-- Comment: "BLOCKED: {reason}. Waiting on: {dependency}"
+-- Create linked blocking issue if needed
```

### Migration Progress Metrics (PM tracks in KANBAN.md)

```markdown
## Migration Progress

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Endpoints migrated | 12/45 | 45/45 | 27% |
| Data tables migrated | 8/20 | 20/20 | 40% |
| Traffic on new system | 5% | 100% | Canary |
| Parity tests passing | 12/12 | 45/45 | 100% of migrated |
| Data reconciliation errors | 0 | 0 | Clean |
| Rollback time (last drill) | 3m 12s | < 5m | Pass |
| Dual-write consistency | 100% | 100% | Clean |
```

### GitHub Commands for Board Management

```bash
# Create Project V2
gh project create --title "{PROJECT} Migration Kanban" --owner "{ORG}" --format board

# Add custom fields
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Wave" --data-type "SINGLE_SELECT" --single-select-options "Wave 0,Wave 1,Wave 1.5,Wave 2,Wave 2.5,Wave 3,Wave 3.5,Wave 4,Wave 5"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Agent" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Evidence" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Migration Phase" --data-type "SINGLE_SELECT" --single-select-options "Discovery,Design,Build,Migrate,Validate,Cutover,Decommission"

# Create issue with full metadata
gh issue create \
  --title "migrate(data): migrate users table with validation" \
  --body "## Acceptance Criteria
- [ ] Schema mapping documented (legacy -> target)
- [ ] ETL script implemented and idempotent
- [ ] Row count matches between legacy and target
- [ ] Checksum matches between legacy and target
- [ ] Referential integrity preserved
- [ ] Dual-write enabled for users table

## Evidence Required
- [ ] ETL dry-run log
- [ ] Row count comparison CSV
- [ ] Checksum comparison CSV
- [ ] Reconciliation report (zero discrepancies)

## Assigned Agent: Data Migration Engineer (Wave 2)" \
  --label "role:data,P0:critical,wave:2-engineering,phase:migrate" \
  --milestone "M3: Data Migration"

# Bulk create labels (standard + migration-specific)
for label in "status:backlog:CCCCCC" "status:in-progress:d93f0b" "status:in-review:fbca04" "status:parity-testing:0052CC" "status:data-validation:5319E7" "status:testing:5319e7" "status:done:0e8a16" "status:blocked:000000" "evidence:verified:00C853" "evidence:missing:FF1744" "role:legacy:BFD4F2" "role:architect:C5DEF5" "role:data:FDE2C8" "role:compat:D4C5F9" "role:target:BFDADC" "role:testval:F9D0C4" "role:qa:E6E6E6" "role:rm:FBCA04"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

---

*Migration & Modernization Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 17 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Driven | Locally-Tested*


---

## Section 19: UAT -- User Acceptance Testing (MANDATORY)

> **Protocol Reference**: `shared/UAT_PROTOCOL.md`
> **Wave**: 3.7 (between QA automated testing and Release)
> **Coverage Mandate**: >= 95% of all user-facing CTAs tested and passing
> **Blocking Gate**: Release wave CANNOT proceed without UAT_PASS

### 19.1 UAT Wave Integration

```
Wave 3:   QA -- Automated Testing (parity, data integrity, rollback, load)
Wave 3.5: Bug Fix Loop (conditional)
Wave 3.7: UAT -- User Acceptance Testing (BLOCKING GATE)
Wave 4:   Release (Cutover)
```

### 19.2 Domain-Specific UAT Focus Areas

| Category | What to Test |
|----------|-------------|
| API Parity | All migrated endpoints return identical responses to legacy (headers, body, status) |
| Data Integrity | All migrated data is accessible, accurate, and complete in the target system |
| Feature Parity | Every feature available in legacy is functional in target (no regressions) |
| Performance | Target system response times are acceptable under production-like load |
| Rollback Safety | Rollback procedure works end-to-end, data is preserved after revert |
| Dual-Write | Both systems receive writes correctly, reconciliation shows zero drift |
| Consumer Experience | API consumers (internal and external) experience zero disruption during migration |
| Error Handling | Target system handles legacy error scenarios identically (error codes, messages) |

### 19.3 UAT Execution Steps

1. **CTA Discovery** -- QA enumerates ALL migrated endpoints, data flows, and user-facing features. Produces `UAT_COVERAGE_MATRIX.md`
2. **Test Case Authoring** -- QA writes test cases per `shared/UAT_PROTOCOL.md` format. Minimum >= 95% CTA coverage
3. **Test Data Preparation** -- QA + DATA seed test data that mirrors production patterns (anonymized)
4. **Round 1 Execution** -- Execute ALL test cases against target system. Compare results to legacy baseline. Capture evidence
5. **Defect Triage** -- TL + QA classify: Critical/High MUST be fixed before cutover. Medium/Low documented with mitigation
6. **Bug Fix** -- Engineers fix Critical + High defects. Each fix = atomic commit with issue reference
7. **Round 2 Regression** -- Re-execute failed cases. Verify fixes. Regression-test related passing cases
8. **Coverage Verification** -- Confirm >= 95% CTA coverage. If below, write additional cases and re-execute
9. **Report Generation** -- Produce `UAT_REPORT_FINAL.md` + PDF + PPTX + JSON/CSV exports
10. **Sign-Off** -- QA submits `UAT_SIGNOFF.md`, TL reviews, user approves (BLOCKING -- cutover cannot proceed)

### 19.4 UAT Blocking Gate

```
GATE: UAT_PASS
  TRIGGER: After Wave 3.7 complete
  CRITERIA:
    [ ] All P0 test cases PASS (zero failures)
    [ ] All P1 test cases PASS (zero failures)
    [ ] P2 test cases: <= 3 failures (none Critical/High)
    [ ] CTA coverage >= 95%
    [ ] Data integrity verified (row counts + checksums match)
    [ ] API parity verified (100% response equivalence)
    [ ] Rollback tested and verified within 5 minutes
    [ ] All Critical/High defects resolved
    [ ] UAT_REPORT_FINAL.md exists with complete data
    [ ] UAT_SIGNOFF.md approved by TL + user
  BLOCKING: YES -- Cutover (Wave 4) CANNOT proceed without UAT_PASS
```

### 19.5 UAT Evidence Requirements

| Evidence Type | When | File Pattern |
|--------------|------|--------------|
| API response comparison | For each migrated endpoint | `.team/uat/evidence/api/{endpoint}_comparison.json` |
| Data snapshot (before) | Before migration test | `.team/uat/evidence/data/{table}_before.csv` |
| Data snapshot (after) | After migration test | `.team/uat/evidence/data/{table}_after.csv` |
| Screenshot (before) | Before CTA action | `.team/uat/evidence/screenshots/{ID}_before.png` |
| Screenshot (after) | After successful CTA | `.team/uat/evidence/screenshots/{ID}_after.png` |
| Screenshot (error) | On CTA failure | `.team/uat/evidence/screenshots/{ID}_error.png` |
| Console log | On FAIL result | `.team/uat/evidence/logs/{ID}_console.log` |
| Network HAR | On FAIL result | `.team/uat/evidence/logs/{ID}_network.har` |
| Rollback log | After rollback test | `.team/uat/evidence/logs/rollback_execution.log` |

### 19.6 UAT Compliance Mapping

Every UAT test case MUST be linked to at least one compliance framework:
- **ISO 25010** -- Software quality (always applicable)
- **GDPR** -- If handling EU personal data (data migration must preserve consent records)
- **SOC 2 Type II** -- If security audit required (migration must maintain audit trail)
- **HIPAA** -- If health data (migration must preserve PHI protections)
- **PCI DSS v4.0** -- If payment processing (migration must maintain PCI scope boundaries)

### 19.7 Mission Control Integration

- **Dashboard**: `http://localhost:4200/uat`
- **Event category**: `UAT`
- **Event types**: `case_pass`, `case_fail`, `case_blocked`, `defect_found`, `defect_resolved`, `round_complete`, `coverage_verified`, `signoff_complete`, `parity_verified`, `rollback_verified`
- **Downloads**: Individual test case, suite, or full export (JSON/CSV)
- **Real-time**: Live event stream shows last 2000 events

### 19.8 UAT Artifacts

```
.team/uat/
+-- UAT_MASTER_INDEX.md
+-- UAT_COVERAGE_MATRIX.md
+-- UAT_COMPLIANCE_MAP.md
+-- UAT_SIGNOFF.md
+-- suites/
+-- scenarios/
+-- evidence/
|   +-- api/
|   +-- data/
|   +-- screenshots/
|   +-- videos/
|   +-- logs/
+-- reports/
    +-- UAT_REPORT_FINAL.md
    +-- UAT_REPORT_FINAL.pdf
    +-- UAT_REPORT_FINAL.pptx
    +-- exports/ (JSON + CSV)
```
