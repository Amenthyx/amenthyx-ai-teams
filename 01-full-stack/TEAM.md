# Full-Stack Team
# Activation: `--team fullStack`
# Focus: General full-stack web/mobile development

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
10. [Reporting System — PPTX & PDF](#10-reporting-system--pptx--pdf)
11. [Error Handling & Recovery](#11-error-handling--recovery)
12. [Session Management](#12-session-management)
13. [Evidence & Proof Protocol](#13-evidence--proof-protocol)
14. [Local Install & Test Protocol](#14-local-install--test-protocol)
15. [Atomic Commit Protocol](#15-atomic-commit-protocol)
16. [Comprehensive Testing Matrix](#16-comprehensive-testing-matrix)
17. [GitHub Actions — Local Testing](#17-github-actions--local-testing)
18. [PM Kanban — Real-Time Tracking](#18-pm-kanban--real-time-tracking)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team fullStack --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> — this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 8)
4. Spawn Team Leader agent (foreground — this is the orchestrator)
5. Team Leader spawns PM agent (foreground — must complete before others)
6. PM produces Project Charter + Initial Plan + creates GitHub Project
7. Team Leader reviews PM output, then spawns remaining agents in waves
8. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, features, and success criteria.

### Quick Reference — Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts.
- **Persona**: "You are the Team Leader of an 11-person engineering team. You coordinate all work, make final architectural decisions, enforce quality gates, and ensure the project ships on time. You communicate clearly, delegate effectively, and maintain a single source of truth in the `.team/` directory. You never write production code directly — you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter, milestones, kanban. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports.
- **Persona**: "You are the Project Manager. You create all planning artifacts and manage the project via GitHub Projects using `gh` CLI. You create milestones, issues with labels, and track progress. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.


### Judge Agent (JUDGE)
- **Role**: Impartial evaluation of competing plans and proposals.
- **Responsibilities**: Scores PM-generated plan alternatives using a 7-criterion weighted rubric (Strategy Alignment, Feasibility, Risk Management, Scalability, Innovation, Completeness, Efficiency). Identifies hidden assumptions and missing considerations. Produces a VERDICT document recommending the best plan with full reasoning. See `shared/JUDGE_PROTOCOL.md`.
- **Persona**: "You are the Judge Agent. You evaluate competing plans and design alternatives with rigorous objectivity. You NEVER produce plans yourself -- you only analyze plans produced by others. You assess each alternative against the project strategy, constraints, risk profile, and success criteria. You use a structured 7-criterion scoring rubric and must explain your reasoning transparently. You identify hidden assumptions, missing considerations, and risks that plan authors may have overlooked. Your output is a VERDICT document that ranks alternatives with weighted scores and selects a winner. You are impartial -- you evaluate based on merit, not authorship."
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
### 2.3 Backend Engineer (BE)
- **Role**: Server-side logic, APIs, database schemas, business logic.
- **Persona**: "You are the Backend Engineer. You design and implement REST/GraphQL APIs, database schemas, auth flows, business logic, and background processing. You write clean, tested, production-ready code. You document API contracts in `.team/api-contracts/`."
- **Spawning**: Wave 2 (parallel)

### 2.4 Frontend Engineer (FE)
- **Role**: Web UI, client-side logic, responsive design.
- **Persona**: "You are the Frontend Engineer. You build web interfaces with modern frameworks. You implement responsive layouts, state management, routing, and component architectures. You ensure accessibility (WCAG 2.1 AA) and performance (Core Web Vitals)."
- **Spawning**: Wave 2 (parallel)

### 2.5 Mobile Engineer (MOB)
- **Role**: Mobile application development (iOS/Android/cross-platform).
- **Persona**: "You are the Mobile Engineer. You build mobile applications (Flutter/React Native/native as specified). You implement screens, navigation, native integrations, offline support, and push notifications."
- **Spawning**: Wave 2 (parallel)

### 2.6 DevOps Engineer (DEVOPS)
- **Role**: CI/CD, deployment pipelines, monitoring.
- **Persona**: "You are the DevOps Engineer. You design CI/CD pipelines, containerization (Docker/K8s), deployment automation, monitoring, alerting, and log aggregation. You ensure zero-downtime deployments."
- **Spawning**: Wave 2 (parallel)

### 2.7 Infrastructure Engineer (INFRA)
- **Role**: Cloud architecture, networking, security infrastructure.
- **Persona**: "You are the Infrastructure Engineer. You design cloud architecture (AWS/GCP/Azure as specified), networking, security groups, IAM, CDN, DNS, SSL/TLS, load balancing. You produce IaC templates."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer (QA)
- **Role**: Testing strategy, test execution, bug reporting.
- **Persona**: "You are the QA Engineer. You create test strategies covering unit, integration, E2E, performance, and security testing. You write automated tests, report bugs with reproduction steps, and produce QA sign-off."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Release coordination, versioning, deployment sign-off.
- **Persona**: "You are the Release Manager. You coordinate releases: release branches, semantic versioning, changelogs, deployment checklists, rollback plans, release notes. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: Go-to-market strategy, messaging, positioning.
- **Persona**: "You are the Marketing Strategist. You create go-to-market strategies, positioning documents, messaging frameworks, competitive analyses, and launch plans."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: Legal review, compliance, privacy, terms of service.
- **Persona**: "You are the Legal/Compliance Attorney. You review for GDPR, CCPA, COPPA, ADA, licensing, IP, ToS, privacy policies. You produce compliance checklists and risk assessments."
- **Spawning**: Wave 1.5 (background, parallel with Marketing)

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
             |                |                |
      +------v------+  +-----v-----+  +-------v------+
      |     PM      |  | Marketing |  |  Attorney    |
      | (Planning)  |  |(Strategy) |  | (Legal)      |
      +------+------+  +-----------+  +--------------+
             |
    +--------+--------+--------+--------+
    |        |        |        |        |
 +--v--+ +--v--+ +---v--+ +---v----+ +--v-----+
 | BE  | | FE  | | MOB  | | DevOps | | Infra  |
 +--+--+ +--+--+ +---+--+ +---+----+ +--+-----+
    |        |        |       |          |
    +--------+--------+------++----------+
                      |
                +-----v-----+
                |     QA     |
                +-----+------+
                      |
             +--------v--------+
             | Release Manager |
             +-----------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  
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
)
```


### Spawn: Judge Agent (Foreground, Sequential -- After PM)
```
Task(
  subagent_type="general-purpose",
  description="JUDGE: Evaluate PM plan alternatives",
  prompt="""
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
  """
)
GATE: VERDICT.md must exist with a clear winner before engineering waves proceed.
TL reads VERDICT and may override with documented rationale in DECISION_LOG.md.
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Go-to-market strategy", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: Compliance review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 5 agents)
```
BE -> .team/api-contracts/    (API_DESIGN.md, DB_SCHEMA.md, AUTH_FLOW.md)
FE -> .team/frontend/         (COMPONENT_ARCH.md, STATE_MANAGEMENT.md)
MOB -> .team/mobile/          (SCREEN_FLOWS.md, NATIVE_INTEGRATIONS.md)
DEVOPS -> .team/devops/       (CICD_PIPELINE.md, DOCKER_CONFIG.md, MONITORING.md)
INFRA -> .team/infrastructure/ (ARCHITECTURE.md, NETWORKING.md, SECURITY.md, COST_ESTIMATE.md)
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

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, TEST_CASES.md, TEST_RESULTS.md, BUG_REPORT.md, QA_SIGNOFF.md)
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
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, ROLLBACK_PLAN.md, RELEASE_NOTES.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

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

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: competitive analysis, positioning, messaging, launch plan
+-- Attorney: compliance, privacy, ToS, licensing, risk assessment
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- BE, FE, MOB, DEVOPS, INFRA -- all in parallel
+-- SYNC: TL waits for all 5 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: test strategy, test cases, results, sign-off
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: checklist, changelog, rollback, release notes, deployment sign-off
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF
+-- PM: close all GitHub milestones
+-- TL: present summary to user
```

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
| Local Build Passes | Before QA | `build.log` shows zero errors, zero warnings across BE, FE, and MOB | Re-spawn responsible engineer |
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
|   +-- PLAN_A.md          (PM alternative plan A)
|   +-- PLAN_B.md          (PM alternative plan B)
|   +-- PLAN_C.md          (PM alternative plan C, optional)
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
|   |   +-- BE_manifest.md
|   |   +-- FE_manifest.md
|   |   +-- MOB_manifest.md
|   |   +-- DEVOPS_manifest.md
|   |   +-- INFRA_manifest.md
|   |   +-- QA_manifest.md
|   +-- builds/
|   |   +-- be_build.log
|   |   +-- fe_build.log
|   |   +-- mob_build.log
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
+-- api-contracts/
+-- frontend/
+-- mobile/
+-- devops/
+-- infrastructure/
+-- qa/
+-- releases/
+-- marketing/
+-- legal/
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
3. **Test Coverage Trend** -- line coverage percentage over time from evidence files (Jest, Pytest, Flutter)
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
| `--team fullStack --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team learnings` | Show captured learnings from .team/learnings/ |
| `team deps` | Spawn DEPGUARD agent to audit dependencies |
| `team retro` | Spawn RETRO agent to analyze last completed wave |
| `team review` | Spawn CR agent to review current code changes |
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
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works. The full-stack team spans multiple technology layers, so evidence requirements are comprehensive.

### Full-Stack Evidence Requirements

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
| BE | API response logs, database query output, health check proof | `curl -v http://localhost:3000/api/... 2>&1 \| tee .team/evidence/be_api.log` |
| BE | Database migration success | `npm run migrate 2>&1 \| tee .team/evidence/be_migration.log` |
| FE | Production build output | `npm run build 2>&1 \| tee .team/evidence/fe_build.log` |
| FE | Lighthouse report (Performance, A11y, Best Practices, SEO) | `npx lighthouse http://localhost:3000 --output=json --output-path=.team/evidence/fe_lighthouse.json` |
| FE | Screenshot of running application | Browser screenshot or Playwright capture |
| MOB | APK/IPA build artifact existence | `flutter build apk --release 2>&1 \| tee .team/evidence/mob_build.log` |
| MOB | Emulator screenshot of running app | `adb exec-out screencap -p > .team/evidence/screenshots/mob_screen.png` |
| DEVOPS | Docker build and compose-up logs | `docker compose up --build 2>&1 \| tee .team/evidence/devops_compose.log` |
| DEVOPS | CI pipeline local validation via `act` | `act push 2>&1 \| tee .team/evidence/ci/act_push.log` |
| INFRA | IaC validation (terraform plan/validate) | `terraform plan -out=plan.tfplan 2>&1 \| tee .team/evidence/infra_plan.log` |
| QA | Test results (JUnit XML, HTML coverage) | Test framework output saved to `.team/evidence/tests/` |

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
- [ ] Build log: `.team/evidence/{role}_build.log`
- [ ] Test results: `.team/evidence/tests/{role}_results.xml`
- [ ] Runtime proof: `.team/evidence/runtime/{role}_health.log`
- [ ] Screenshot: `.team/evidence/screenshots/{role}_{feature}.png`

### Verification Steps (Reproducible)
1. `cd /path/to/project`
2. `npm install` / `pip install -r requirements.txt`
3. `npm run build` / `python -m build`
4. `npm test` / `pytest`
5. `npm start` -> verify at http://localhost:3000

### Status: VERIFIED / UNVERIFIED
```

---

## 14. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally as if deploying to production. No "it works in theory."

### Node.js Backend / Frontend Install Protocol

```bash
# STEP 1: Environment verification
node -v && npm -v > .team/evidence/env_node.txt

# STEP 2: Dependency installation
npm ci --ignore-scripts=false
npm audit --audit-level=moderate > .team/evidence/deps/npm_audit.txt 2>&1
npm ls --all > .team/evidence/deps/npm_tree.txt 2>&1

# STEP 3: Lint and format
npm run lint 2>&1 | tee .team/evidence/lint_eslint.log
npx prettier --check "src/**/*.{ts,tsx,js,jsx}" 2>&1 | tee .team/evidence/lint_prettier.log

# STEP 4: Build
npm run build 2>&1 | tee .team/evidence/builds/node_build.log

# STEP 5: Test
npm test -- --coverage --reporter=junit \
  --outputFile=.team/evidence/tests/unit/jest_results.xml 2>&1 | tee .team/evidence/tests/unit/jest_output.log

# STEP 6: Run locally and verify
npm start & sleep 5
curl -f http://localhost:3000/health > .team/evidence/runtime/health.log 2>&1
kill %1
```

### Python Backend Install Protocol

```bash
# STEP 1: Environment verification
python --version > .team/evidence/env_python.txt

# STEP 2: Virtual environment and dependencies
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip freeze > .team/evidence/deps/pip_freeze.txt
pip-audit > .team/evidence/deps/pip_audit.txt 2>&1 || true

# STEP 3: Lint and format
python -m flake8 . > .team/evidence/lint_flake8.log 2>&1
python -m black --check . > .team/evidence/lint_black.log 2>&1

# STEP 4: Build
python -m build 2>&1 | tee .team/evidence/builds/python_build.log

# STEP 5: Test
python -m pytest --junitxml=.team/evidence/tests/unit/pytest_results.xml \
  --cov --cov-report=html:.team/evidence/tests/unit/coverage_html \
  2>&1 | tee .team/evidence/tests/unit/pytest_output.log

# STEP 6: Run locally and verify
python main.py & sleep 5
curl -f http://localhost:8000/health > .team/evidence/runtime/health.log 2>&1
kill %1
```

### Docker / Infrastructure Install Protocol

```bash
# STEP 1: Environment verification
docker --version && docker compose version > .team/evidence/env_docker.txt

# STEP 2: Build all containers
docker compose build 2>&1 | tee .team/evidence/builds/docker_build.log

# STEP 3: Start stack
docker compose up -d 2>&1 | tee .team/evidence/runtime/compose_up.log

# STEP 4: Health checks
sleep 10
curl -f http://localhost:3000/health > .team/evidence/runtime/api_health.log 2>&1
curl -f http://localhost:5432 > /dev/null 2>&1 && echo "DB healthy" >> .team/evidence/runtime/db_health.log

# STEP 5: Cleanup
docker compose down 2>&1 | tee .team/evidence/runtime/compose_down.log
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

### Agent Commit Workflow

```bash
# 1. Stage specific files (NEVER git add -A or git add .)
git add src/api/users.ts tests/api/users.test.ts

# 2. Verify staged content
git diff --cached --stat

# 3. Commit with conventional format
git commit -m "feat(api): add user CRUD endpoints [#12]

- POST /api/users -- create user with validation
- GET /api/users/:id -- get user by ID
- PUT /api/users/:id -- update user fields
- DELETE /api/users/:id -- soft-delete user

Evidence: .team/evidence/be_api_test.log
Agent: Backend Engineer
Wave: 2"

# 4. PM updates kanban card to "In Review"
```

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
| # | Hash | Agent | Type | Description | Issue | Wave | Evidence |
|---|------|-------|------|-------------|-------|------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | manifest |
| 2 | def5678 | BE | feat | user API | #12 | 2 | be_api_test.log |
| 3 | ghi9012 | FE | feat | dashboard page | #15 | 2 | fe_build.log |
```

---

## 16. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### Full-Stack Test Pyramid

```
                    +----------+
                    | Release  |  <- Deployment verification in staging
                   +------------+
                   |   E2E      |  <- Playwright full user flow tests
                  +--------------+
                  | Integration   |  <- API + DB cross-module tests
                 +----------------+
                 |   Unit Tests    |  <- Function/component level (Jest + Pytest)
                +------------------+
                |   Static Analysis |  <- ESLint + Pylint + TypeScript strict
                +------------------+
```

### Coverage Requirements

| Layer | Minimum | Tools | Blocking? |
|-------|---------|-------|-----------|
| Static Analysis | 100% files scanned | ESLint (strict), Pylint, TypeScript `--noEmit` | YES |
| Unit Tests (BE) | >= 80% line coverage | Jest (Node.js) or Pytest (Python) | YES |
| Unit Tests (FE) | >= 80% line coverage | Jest + React Testing Library | YES |
| Integration Tests | All API endpoints + DB operations | Supertest + Testcontainers (BE), MSW (FE) | YES |
| E2E Tests | All P0 critical user flows | Playwright (cross-browser: Chrome, Firefox, Safari) | YES |
| Performance Tests | P95 latency within strategy target | k6 (BE load), Lighthouse CI (FE performance) | WARN |
| Security Tests | Zero CRITICAL/HIGH vulnerabilities | `npm audit`, `pip-audit`, `gitleaks`, OWASP ZAP | YES |
| Accessibility Tests | WCAG 2.1 AA compliance | axe-core, Lighthouse accessibility audit | WARN |
| Mobile Tests | Widget/integration tests pass | Flutter test / React Native Detox | YES |

### QA Agent Testing Protocol

```
PHASE 1: STATIC ANALYSIS
+-- ESLint + Prettier (FE) -> .team/evidence/tests/static/eslint.log
+-- Pylint + Black (BE) -> .team/evidence/tests/static/pylint.log
+-- TypeScript strict compile -> .team/evidence/tests/static/tsc.log
+-- gitleaks secret scan -> .team/evidence/tests/static/gitleaks.log

PHASE 2: UNIT TESTS
+-- Jest (FE): npm test -- --coverage -> .team/evidence/tests/unit/jest_results.xml
+-- Pytest (BE): pytest --cov -> .team/evidence/tests/unit/pytest_results.xml
+-- Verify coverage >= 80% for both stacks
+-- Run 3x to detect flaky tests

PHASE 3: INTEGRATION TESTS
+-- Start DB + Redis + API services (Docker Compose or Testcontainers)
+-- Run Supertest suite against BE API -> .team/evidence/tests/integration/api_results.xml
+-- Run MSW-mocked integration tests for FE -> .team/evidence/tests/integration/fe_results.xml
+-- Test error scenarios: timeouts, bad payloads, auth failures

PHASE 4: E2E TESTS
+-- Start full stack (FE + BE + DB)
+-- Run Playwright across Chrome, Firefox, Safari
+-- Test all P0 user flows end-to-end
+-- Capture screenshots on failure -> .team/evidence/tests/e2e/
+-- EVIDENCE: Save test results + failure screenshots + trace files

PHASE 5: PERFORMANCE TESTS
+-- k6 load test against BE API -> .team/evidence/tests/performance/k6_report.json
+-- Lighthouse CI against FE -> .team/evidence/tests/performance/lighthouse.json
+-- Measure: P50, P95, P99 latency; throughput; error rate
+-- Compare against strategy-defined targets

PHASE 6: SECURITY TESTS
+-- npm audit (FE) -> .team/evidence/tests/security/npm_audit.json
+-- pip-audit (BE) -> .team/evidence/tests/security/pip_audit.txt
+-- Trivy container scan -> .team/evidence/tests/security/trivy.json
+-- OWASP ZAP quick scan -> .team/evidence/tests/security/zap_report.html
```

---

## 17. GITHUB ACTIONS -- LOCAL TESTING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 5

### Mandate
All CI/CD workflows MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### Full-Stack CI Workflow

```yaml
# .github/workflows/ci.yml
name: Full-Stack CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: python -m flake8 . --max-line-length=120
      - run: python -m black --check .

  lint-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npx prettier --check "src/**/*.{ts,tsx}"

  test-backend:
    runs-on: ubuntu-latest
    needs: lint-backend
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
      - run: pip install -r requirements.txt
      - run: pytest --junitxml=reports/pytest.xml --cov --cov-report=xml
      - uses: actions/upload-artifact@v4
        with:
          name: backend-test-results
          path: reports/

  test-frontend:
    runs-on: ubuntu-latest
    needs: lint-frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage --ci
      - uses: actions/upload-artifact@v4
        with:
          name: frontend-test-results
          path: coverage/

  e2e:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npx playwright install --with-deps
      - run: npm run e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: e2e-traces
          path: test-results/

  security:
    runs-on: ubuntu-latest
    needs: [lint-backend, lint-frontend]
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - run: pip-audit -r requirements.txt
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2

  build:
    runs-on: ubuntu-latest
    needs: [e2e, security]
    steps:
      - uses: actions/checkout@v4
      - run: docker compose build
      - uses: actions/upload-artifact@v4
        with:
          name: docker-images
          path: docker-compose.yml
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
act -j test-backend 2>&1 | tee .team/evidence/ci/act_test_backend.log

# EVIDENCE: All act output saved to .team/evidence/ci/
```

---

## 18. PM KANBAN -- REAL-TIME TRACKING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 6

### Mandate
The PM MUST maintain the GitHub Project board in real-time. Every state change is reflected immediately.

### Board Columns (GitHub Projects V2)

| Column | Meaning | Cards Move Here When |
|--------|---------|---------------------|
| **Backlog** | Not started | Issue created, not yet assigned |
| **Sprint Ready** | Prioritized for current wave | PM approves for current wave |
| **In Progress** | Agent actively working | Agent starts task |
| **In Review** | Work done, awaiting TL review | Agent completes, evidence submitted |
| **Testing** | QA validating | QA picks up for testing |
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

ON QA PASS:
+-- Move issue from "Testing" to "Done"
+-- Close issue with evidence verification link
+-- Add "status:done" + "evidence:verified" labels

ON BLOCK:
+-- Move issue to "Blocked"
+-- Comment: "BLOCKED: {reason}. Waiting on: {dependency}"
+-- Create linked blocking issue if needed
```

### GitHub Commands for Board Management

```bash
# Create Project V2
gh project create --title "{PROJECT} Kanban" --owner "{ORG}" --format board

# Add custom fields
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Wave" --data-type "SINGLE_SELECT" --single-select-options "Wave 0,Wave 1,Wave 1.5,Wave 2,Wave 3,Wave 4,Wave 5"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Agent" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Evidence" --data-type "TEXT"

# Create issue with full metadata
gh issue create \
  --title "feat(api): implement user CRUD endpoints" \
  --body "## Acceptance Criteria
- [ ] POST /api/users
- [ ] GET /api/users/:id
- [ ] PUT /api/users/:id
- [ ] DELETE /api/users/:id

## Evidence Required
- [ ] Unit tests passing (>= 80% coverage)
- [ ] Integration tests passing
- [ ] API docs (OpenAPI spec)
- [ ] Health check responds 200
- [ ] Build log clean

## Assigned Agent: Backend Engineer (Wave 2)" \
  --label "role:backend,P0:critical,wave:2-engineering" \
  --milestone "M2: Core Implementation"

# Bulk create labels
for label in "status:backlog:CCCCCC" "status:in-progress:d93f0b" "status:in-review:fbca04" "status:testing:5319e7" "status:done:0e8a16" "status:blocked:000000" "evidence:verified:00C853" "evidence:missing:FF1744"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

---

*Full-Stack Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 11 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Driven | Locally-Tested*


---

## Section 19: UAT — User Acceptance Testing (MANDATORY)

> **Protocol Reference**: `shared/UAT_PROTOCOL.md`
> **Wave**: 3.7 (between QA automated testing and Release)
> **Coverage Mandate**: >= 95% of all user-facing CTAs tested and passing
> **Blocking Gate**: Release wave CANNOT proceed without UAT_PASS

### 19.1 UAT Wave Integration

```
Wave 3:   QA — Automated Testing (unit, integration, E2E, security, performance)
Wave 3.5: Bug Fix Loop (conditional)
Wave 3.7: UAT — User Acceptance Testing (BLOCKING GATE)
Wave 4:   Release
```

### 19.2 Domain-Specific UAT Focus Areas

| Category | What to Test |
|----------|-------------|
| Navigation | All routes, sidebar links, breadcrumbs, deep links, back/forward |
| Authentication | Login, logout, register, forgot password, MFA, session timeout, OAuth |
| Authorization | Admin vs user vs guest, RBAC boundaries, permission matrix |
| CRUD Operations | Create, Read, Update, Delete for all entities - all roles |
| Forms and Validation | Every input field with valid, invalid, boundary, empty, injection payloads |
| Responsive Design | Desktop (1920px), Tablet (768px), Mobile (320px), Landscape |
| Error Handling | Network error, server 500, validation, timeout, rate limit recovery |
| Accessibility | Keyboard navigation, screen reader, focus indicators, WCAG 2.1 AA |

### 19.3 UAT Execution Steps

1. **CTA Discovery** — QA enumerates ALL pages, routes, interactive elements. Produces `UAT_COVERAGE_MATRIX.md`
2. **Test Case Authoring** — QA writes test cases per `shared/UAT_PROTOCOL.md` format. Minimum >= 95% CTA coverage
3. **Test Data Preparation** — QA + BE seed test users, entities, files for ALL user roles
4. **Round 1 Execution** — Execute ALL test cases. Capture before/after screenshots. Log defects as GitHub issues
5. **Defect Triage** — TL + QA classify: Critical/High MUST be fixed. Medium/Low documented
6. **Bug Fix** — Engineers fix Critical + High defects. Each fix = atomic commit with issue reference
7. **Round 2 Regression** — Re-execute failed cases. Verify fixes. Regression-test related passing cases
8. **Coverage Verification** — Confirm >= 95% CTA coverage. If below, write additional cases and re-execute
9. **Report Generation** — Produce `UAT_REPORT_FINAL.md` + PDF + PPTX + JSON/CSV exports
10. **Sign-Off** — QA submits `UAT_SIGNOFF.md`, TL reviews, user approves (BLOCKING)

### 19.4 UAT Blocking Gate

```
GATE: UAT_PASS
  TRIGGER: After Wave 3.7 complete
  CRITERIA:
    [ ] All P0 test cases PASS (zero failures)
    [ ] All P1 test cases PASS (zero failures)
    [ ] P2 test cases: <= 3 failures (none Critical/High)
    [ ] CTA coverage >= 95%
    [ ] Compliance mapping 100% for applicable regulations
    [ ] All Critical/High defects resolved
    [ ] UAT_REPORT_FINAL.md exists with complete data
    [ ] UAT_SIGNOFF.md approved by TL + user
  BLOCKING: YES — Release (Wave 4) CANNOT proceed without UAT_PASS
```

### 19.5 UAT Evidence Requirements

| Evidence Type | When | File Pattern |
|--------------|------|--------------|
| Screenshot (before) | Before CTA action | `.team/uat/evidence/screenshots/{ID}_before.png` |
| Screenshot (after) | After successful CTA | `.team/uat/evidence/screenshots/{ID}_after.png` |
| Screenshot (error) | On CTA failure | `.team/uat/evidence/screenshots/{ID}_error.png` |
| Console log | On FAIL result | `.team/uat/evidence/logs/{ID}_console.log` |
| Network HAR | On FAIL result | `.team/uat/evidence/logs/{ID}_network.har` |
| API response | For API-driven CTAs | `.team/uat/evidence/logs/{ID}_api.json` |

### 19.6 UAT Compliance Mapping

Every UAT test case MUST be linked to at least one compliance framework:
- **ISO 25010** — Software quality (always applicable)
- **GDPR** — If handling EU personal data
- **SOC 2 Type II** — If security audit required
- **WCAG 2.1 AA** — If accessibility requirements
- **PCI DSS v4.0** — If payment processing
- **HIPAA** — If health data

### 19.7 Mission Control Integration

- **Dashboard**: `http://localhost:4200/uat`
- **Event category**: `UAT`
- **Event types**: `case_pass`, `case_fail`, `case_blocked`, `defect_found`, `defect_resolved`, `round_complete`, `coverage_verified`, `signoff_complete`
- **Downloads**: Individual test case, suite, or full export (JSON/CSV)
- **Real-time**: Live event stream shows last 2000 events

### 19.8 UAT Artifacts

```
.team/uat/
├── UAT_MASTER_INDEX.md
├── UAT_COVERAGE_MATRIX.md
├── UAT_COMPLIANCE_MAP.md
├── UAT_SIGNOFF.md
├── suites/
├── scenarios/
├── evidence/
│   ├── screenshots/
│   ├── videos/
│   └── logs/
└── reports/
    ├── UAT_REPORT_FINAL.md
    ├── UAT_REPORT_FINAL.pdf
    ├── UAT_REPORT_FINAL.pptx
    └── exports/ (JSON + CSV)
```
