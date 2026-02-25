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
  """
)
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

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, TEST_CASES.md, TEST_RESULTS.md, BUG_REPORT.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
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
2. TL spawns relevant agents with decision prompt
3. TL collects responses and synthesizes into `DECISION_LOG.md`
4. Majority wins for non-critical; user escalation for critical; TL tie-breaks for time-sensitive

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
