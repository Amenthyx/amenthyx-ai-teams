# .NET Enterprise Team
# Activation: `--team dotnet`
# Focus: C#, VB.NET, .NET enterprise systems and microservices

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
9. [Reporting System](#9-reporting-system)
10. [Error Handling & Session Management](#10-error-handling--session-management)
11. [Evidence & Proof Protocol](#11-evidence--proof-protocol)
12. [Local Install & Test Protocol](#12-local-install--test-protocol)
13. [Atomic Commit Protocol](#13-atomic-commit-protocol)
14. [Comprehensive Testing Matrix](#14-comprehensive-testing-matrix)
15. [GitHub Actions — Local Testing](#15-github-actions--local-testing)
16. [PM Kanban — Real-Time Tracking](#16-pm-kanban--real-time-tracking)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team dotnet --strategy <path>`, activate this protocol.

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
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, architecture patterns, target .NET version, and enterprise requirements.

### Quick Reference — Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between service boundaries and architecture decisions.
- **Persona**: "You are the Team Leader of a 10-person .NET enterprise engineering team. You coordinate all work, make final architectural decisions (microservices vs monolith, CQRS adoption, service mesh topology), enforce quality gates, and ensure the system ships production-ready. You never write production code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter, milestones, kanban. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports.
- **Persona**: "You are the Project Manager for a .NET enterprise team. You create all planning artifacts and manage the project via GitHub Projects using `gh` CLI. You track enterprise milestones (architecture review, security audit, load testing, staging deployment, production release). You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Solution Architect (SA)
- **Role**: System architecture, microservices design, domain modeling, patterns.
- **Persona**: "You are the Solution Architect. You design the overall system architecture: microservices decomposition, domain-driven design (bounded contexts, aggregates), CQRS/Event Sourcing patterns, API gateway topology, service mesh, and inter-service communication (gRPC/message bus). You produce architecture decision records (ADRs) and C4 model diagrams. You write to `.team/architecture/`."
- **Spawning**: Wave 2 (parallel)

### 2.4 Backend Engineer -- .NET (BE)
- **Role**: ASP.NET Core services, business logic, middleware, background services.
- **Persona**: "You are the Backend Engineer specializing in .NET. You implement ASP.NET Core Web APIs, minimal APIs, business logic layers, middleware pipelines, background services (IHostedService), health checks, and configuration management. You follow clean architecture (Domain/Application/Infrastructure/Presentation layers) and write production-ready C# code targeting .NET 8+. You write to `.team/backend/`."
- **Spawning**: Wave 2 (parallel)

### 2.5 Database Engineer (DB)
- **Role**: SQL Server, Entity Framework Core, migrations, data modeling.
- **Persona**: "You are the Database Engineer. You design relational schemas (SQL Server/PostgreSQL), implement Entity Framework Core DbContexts, migrations, stored procedures, indexes, and query optimization. You handle data seeding, multi-tenancy patterns, read replicas, and connection resilience. You produce schema diagrams and migration plans. You write to `.team/database/`."
- **Spawning**: Wave 2 (parallel)

### 2.6 API Engineer (API)
- **Role**: API contracts, versioning, documentation, client SDKs.
- **Persona**: "You are the API Engineer. You design RESTful API contracts with OpenAPI/Swagger, implement API versioning strategies, content negotiation, HATEOAS, rate limiting, response caching, and auto-generated client SDKs (NSwag/Kiota). You enforce API standards and produce Swagger documentation. You write to `.team/api-contracts/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 Identity/Auth Engineer (AUTH)
- **Role**: Authentication, authorization, identity management, security.
- **Persona**: "You are the Identity/Auth Engineer. You implement authentication (JWT, OAuth 2.0, OpenID Connect), authorization (policy-based, role-based, resource-based), ASP.NET Core Identity, external identity providers (Azure AD, Okta), multi-factor authentication, API key management, and secure token handling. You design the security model and write to `.team/identity/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer -- Enterprise Testing (QA)
- **Role**: xUnit tests, integration tests, load tests, contract tests.
- **Persona**: "You are the QA Engineer specializing in enterprise .NET testing. You create test strategies covering unit tests (xUnit + Moq/NSubstitute), integration tests (WebApplicationFactory, Testcontainers), contract tests (Pact), load tests (NBomber/k6), and security scanning (OWASP ZAP). You enforce code coverage thresholds (80%+). You produce QA sign-off in `.team/qa/`."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Release coordination, NuGet packaging, deployment pipelines.
- **Persona**: "You are the Release Manager. You coordinate releases: release branches, semantic versioning, changelogs, NuGet package publishing, deployment pipelines (Azure DevOps/GitHub Actions), blue-green deployments, database migration execution, rollback plans, and release notes. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: Enterprise positioning, documentation, developer relations.
- **Persona**: "You are the Marketing Strategist. You create enterprise positioning documents, API documentation portals, developer onboarding guides, competitive analyses against alternative platforms, and internal adoption strategies."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: Enterprise compliance, licensing, data governance, SOC2.
- **Persona**: "You are the Legal/Compliance Attorney. You review for GDPR, CCPA, HIPAA (if applicable), SOC 2 compliance, software licensing (NuGet dependencies), data retention policies, audit logging requirements, PCI-DSS (if payment processing), and enterprise security standards. You produce compliance checklists and risk assessments."
- **Spawning**: Wave 1.5 (background, parallel with Marketing)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +----------+
                        |   USER   |
                        +----+-----+
                             |
                    +--------v--------+
                    |  TEAM LEADER    |
                    |  (Orchestrator) |
                    +--------+--------+
                             |
            +----------------+----------------+
            |                |                |
     +------v------+  +-----v-----+  +-------v-------+
     |     PM      |  | Marketing |  |   Attorney    |
     | (Planning)  |  |(Enterprise|  | (Compliance)  |
     +------+------+  +-----------+  +---------------+
            |
   +--------+--------+--------+--------+
   |        |        |        |        |
+--v--+ +---v---+ +--v---+ +-v----+ +-v----+
|  SA | |  BE   | |  DB  | | API  | | AUTH |
+--+--+ +---+---+ +--+---+ +--+---+ +--+---+
   |        |        |        |        |
   +--------+--------+--------+--------+
                     |
               +-----v-----+
               |     QA     |
               |(Enterprise)|
               +-----+------+
                     |
            +--------v--------+
            | Release Manager |
            |  (Deployment)   |
            +-----------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: .NET enterprise project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan (include enterprise milestones: architecture review, security audit, staging, production) -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register (include enterprise risks: data migration, backwards compatibility, performance under load) -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Enterprise positioning & documentation", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write enterprise positioning, API docs plan, developer onboarding to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: Enterprise compliance review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write compliance checklist, licensing audit, data governance, security standards to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 5 agents)
```
SA   -> .team/architecture/   (SYSTEM_ARCHITECTURE.md, ADR_LOG.md, DOMAIN_MODEL.md, C4_DIAGRAMS.md)
BE   -> .team/backend/        (SERVICE_DESIGN.md, MIDDLEWARE_CONFIG.md, BACKGROUND_SERVICES.md)
DB   -> .team/database/       (SCHEMA_DESIGN.md, MIGRATION_PLAN.md, QUERY_OPTIMIZATION.md)
API  -> .team/api-contracts/  (API_DESIGN.md, VERSIONING_STRATEGY.md, SWAGGER_SPEC.md)
AUTH -> .team/identity/       (AUTH_ARCHITECTURE.md, IDENTITY_CONFIG.md, SECURITY_MODEL.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, UNIT_TESTS.md, INTEGRATION_TESTS.md, LOAD_TESTS.md, SECURITY_SCAN.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, DEPLOYMENT_PIPELINE.md, MIGRATION_RUNBOOK.md, ROLLBACK_PLAN.md, RELEASE_NOTES.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_PIPELINE.md must be approved
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
| Labels | -- | Role + priority + wave + service labels |
| Releases | `.team/releases/` | `gh release create` |

**.NET-specific labels**: `service:api`, `service:worker`, `service:gateway`, `type:migration`, `type:auth`, `type:infrastructure`.

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
+-- Marketing: enterprise positioning, API documentation plan
+-- Attorney: compliance audit, licensing, data governance
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- SA, BE, DB, API, AUTH -- all in parallel
+-- SYNC: TL waits for all 5 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: unit tests, integration tests, load tests, security scan, sign-off
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: checklist, changelog, deployment pipeline, migration runbook, rollback, release notes
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_PIPELINE.md approved

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
| Build Gate | After Engineering | `dotnet build` succeeds with zero warnings (TreatWarningsAsErrors) | Re-spawn BE |
| Unit Test Gate | After QA | `dotnet test` passes, xUnit coverage >= 80% | Re-spawn BE + SA |
| Integration Test Gate | After QA | WebApplicationFactory + Testcontainers tests pass | Re-spawn BE + DB |
| Security Scan Gate | After QA | OWASP dependency check clean, no critical/high vulnerabilities | Re-spawn AUTH |
| Performance Benchmark | After QA | Response times < thresholds, throughput meets SLA, no memory leaks | Re-spawn BE + DB |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_PIPELINE.md` approved, migrations tested | RM lists blocking items |
| Evidence Complete | Before QA | Every agent has evidence manifest with build logs, curl output, test results | Re-spawn agent to collect evidence |
| Local Build Passes | Before QA | `dotnet build --configuration Release` succeeds with zero warnings on all projects in solution | Re-spawn BE |
| Test Coverage Gate | Before Release | xUnit >= 80% line coverage via Coverlet, all integration tests pass via WebApplicationFactory | Enter Bug Fix Loop |
| CI Validation Gate | Before push | `act push` succeeds locally, `actionlint` clean for .NET CI workflow | Fix workflow, re-test |
| No Secrets Gate | Every commit | `gitleaks detect` finds zero secrets (no connection strings, no API keys in appsettings) | HARD STOP, rotate secrets |
| EF Migration Gate | Before Release | `dotnet ef migrations script` generates valid SQL, migration runs cleanly on test DB | Re-spawn DB |

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
|   |   +-- SA_manifest.md
|   |   +-- BE_manifest.md
|   |   +-- DB_manifest.md
|   |   +-- API_manifest.md
|   |   +-- AUTH_manifest.md
|   |   +-- QA_manifest.md
|   +-- builds/
|   |   +-- dotnet_build.log
|   |   +-- dotnet_publish.log
|   |   +-- build_time.txt
|   +-- tests/
|   |   +-- static/
|   |   |   +-- dotnet_analyzers.log
|   |   +-- unit/
|   |   |   +-- test_results.trx
|   |   |   +-- coverage/
|   |   +-- integration/
|   |   |   +-- integration_results.trx
|   |   +-- load/
|   |   |   +-- nbomber_report.html
|   |   +-- security/
|   |   |   +-- owasp_check.html
|   +-- screenshots/
|   +-- runtime/
|   |   +-- health_check.log
|   |   +-- swagger_ui.png
|   +-- deps/
|   |   +-- dotnet_list_packages.txt
|   |   +-- nuget_audit.txt
|   +-- diffs/
|   +-- ci/
|   |   +-- act_push.log
|   |   +-- actionlint.log
|   +-- validation/
|       +-- ef_migration_script.sql
+-- ci/
|   +-- .github/
|       +-- workflows/
|           +-- dotnet_ci.yml
|           +-- deploy.yml
+-- architecture/
|   +-- SYSTEM_ARCHITECTURE.md
|   +-- ADR_LOG.md
|   +-- DOMAIN_MODEL.md
|   +-- C4_DIAGRAMS.md
+-- backend/
|   +-- SERVICE_DESIGN.md
|   +-- MIDDLEWARE_CONFIG.md
|   +-- BACKGROUND_SERVICES.md
+-- database/
|   +-- SCHEMA_DESIGN.md
|   +-- MIGRATION_PLAN.md
|   +-- QUERY_OPTIMIZATION.md
+-- api-contracts/
|   +-- API_DESIGN.md
|   +-- VERSIONING_STRATEGY.md
|   +-- SWAGGER_SPEC.md
+-- identity/
|   +-- AUTH_ARCHITECTURE.md
|   +-- IDENTITY_CONFIG.md
|   +-- SECURITY_MODEL.md
+-- qa/
|   +-- TEST_STRATEGY.md
|   +-- UNIT_TESTS.md
|   +-- INTEGRATION_TESTS.md
|   +-- LOAD_TESTS.md
|   +-- SECURITY_SCAN.md
|   +-- QA_SIGNOFF.md
+-- releases/
|   +-- RELEASE_CHECKLIST.md
|   +-- CHANGELOG.md
|   +-- DEPLOYMENT_PIPELINE.md
|   +-- MIGRATION_RUNBOOK.md
|   +-- ROLLBACK_PLAN.md
|   +-- RELEASE_NOTES.md
+-- marketing/
+-- legal/
```

---

## 9. REPORTING SYSTEM

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Reports include .NET-specific metrics: build time, test coverage percentage, API endpoint count, migration status, security scan results, NuGet dependency health
- Final summary generated at project completion

### Enhanced Report Contents

Every PPTX and PDF report MUST include:

1. **Evidence Dashboard** -- count of evidence artifacts per agent, verification status per role
2. **Commit Activity** -- commits per wave, per agent, with linked issue references
3. **Test Coverage Trend** -- xUnit coverage percentage over time from Coverlet reports
4. **Build Metrics** -- `dotnet build` time, warning count trend, NuGet restore time
5. **CI/CD Status** -- GitHub Actions workflow pass/fail, local `act` validation results
6. **EF Migration Status** -- pending migrations, migration script validation, schema diff
7. **Kanban Velocity** -- cards moved per reporting period, burn-down chart data

---

## 10. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Build failure**: Re-spawn BE with MSBuild error output and project file context
- **Migration conflict**: Re-spawn DB with conflicting migration details and resolution strategy
- **NuGet restore failure**: Re-spawn BE with package source configuration and version conflict details

### Session Commands

| Command | Action |
|---------|--------|
| `--team dotnet --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

## 11. EVIDENCE & PROOF PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 1

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works. .NET enterprise systems require thorough evidence across multiple service boundaries.

### .NET-Specific Evidence Requirements

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
| SA | Architecture diagrams, ADR approval | C4 diagram files + ADR markdown in `.team/architecture/` |
| BE | API health check, Swagger UI screenshot | `curl http://localhost:5000/health 2>&1 \| tee .team/evidence/runtime/health_check.log` |
| BE | Clean build with zero warnings | `dotnet build --configuration Release 2>&1 \| tee .team/evidence/builds/dotnet_build.log` |
| DB | EF migration script generated | `dotnet ef migrations script -o .team/evidence/validation/ef_migration_script.sql` |
| DB | Migration applied to test database | `dotnet ef database update 2>&1 \| tee .team/evidence/db_migration.log` |
| API | Swagger/OpenAPI spec valid | `dotnet swagger tofile --output .team/evidence/validation/swagger.json` |
| API | All endpoints respond correctly | `curl` output for each endpoint saved to `.team/evidence/runtime/` |
| AUTH | JWT token generation/validation | `curl -X POST .../auth/token 2>&1 \| tee .team/evidence/runtime/auth_token.log` |
| AUTH | Protected endpoint returns 401 without token | `curl -v .../api/protected 2>&1 \| tee .team/evidence/runtime/auth_401.log` |
| QA | xUnit test results (TRX format) | `dotnet test --logger "trx" 2>&1` saved to `.team/evidence/tests/` |
| QA | Coverage report (Coverlet) | `dotnet test --collect:"XPlat Code Coverage"` output |

### Evidence Manifest (Per Agent)

Every agent writes to `.team/evidence/manifests/{ROLE}_manifest.md`:

```markdown
# Evidence Manifest -- {AGENT_ROLE}
## Task: {task_description}
## Date: {ISO_8601_timestamp}

### Artifacts Produced
- [ ] `src/MyService/Controllers/UsersController.cs` -- User CRUD API
- [ ] `src/MyService.Domain/Entities/User.cs` -- User domain entity

### Evidence Collected
- [ ] Build log: `.team/evidence/builds/dotnet_build.log` (0 warnings, 0 errors)
- [ ] Test results: `.team/evidence/tests/unit/test_results.trx` (42/42 passing)
- [ ] Coverage: `.team/evidence/tests/unit/coverage/` (86% line coverage)
- [ ] Health check: `.team/evidence/runtime/health_check.log` (200 OK)
- [ ] Swagger: `.team/evidence/validation/swagger.json` (valid OpenAPI 3.0)

### Verification Steps (Reproducible)
1. `cd /path/to/solution`
2. `dotnet restore`
3. `dotnet build --configuration Release`
4. `dotnet test --configuration Release`
5. `dotnet run --project src/MyService` -> verify at http://localhost:5000/swagger

### Status: VERIFIED / UNVERIFIED
```

---

## 12. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally. .NET solutions must restore, build with zero warnings, pass all tests, and run the service with a healthy actuator endpoint.

### .NET Local Install Protocol

```bash
# STEP 1: Environment verification
dotnet --version > .team/evidence/env_dotnet.txt 2>&1
dotnet --list-sdks >> .team/evidence/env_dotnet.txt 2>&1
dotnet --list-runtimes >> .team/evidence/env_dotnet.txt 2>&1

# STEP 2: Dependency restoration
dotnet restore 2>&1 | tee .team/evidence/deps/dotnet_restore.log
dotnet list package > .team/evidence/deps/dotnet_list_packages.txt 2>&1
dotnet list package --vulnerable > .team/evidence/deps/nuget_audit.txt 2>&1

# STEP 3: Build with strict warnings
dotnet build --configuration Release --no-restore \
  /p:TreatWarningsAsErrors=true \
  2>&1 | tee .team/evidence/builds/dotnet_build.log

# STEP 4: Run all tests with coverage
dotnet test --configuration Release --no-build \
  --logger "trx;LogFileName=test_results.trx" \
  --collect:"XPlat Code Coverage" \
  --results-directory .team/evidence/tests/unit/ \
  2>&1 | tee .team/evidence/tests/unit/dotnet_test.log

# STEP 5: Verify EF Core migrations
dotnet ef migrations list --project src/Infrastructure \
  2>&1 | tee .team/evidence/validation/ef_migrations_list.txt
dotnet ef migrations script --project src/Infrastructure \
  --output .team/evidence/validation/ef_migration_script.sql \
  2>&1 | tee .team/evidence/validation/ef_script_gen.log

# STEP 6: Run service locally and verify
dotnet run --project src/MyService --configuration Release &
sleep 10
curl -f http://localhost:5000/health > .team/evidence/runtime/health_check.log 2>&1
curl -f http://localhost:5000/swagger/v1/swagger.json > .team/evidence/validation/swagger.json 2>&1
kill %1

# STEP 7: Publish for deployment verification
dotnet publish --configuration Release --output ./publish \
  2>&1 | tee .team/evidence/builds/dotnet_publish.log
```

### Integration Test Protocol with Testcontainers

```bash
# Start integration tests (Testcontainers manages Docker containers)
dotnet test tests/IntegrationTests/ \
  --configuration Release \
  --logger "trx;LogFileName=integration_results.trx" \
  --results-directory .team/evidence/tests/integration/ \
  2>&1 | tee .team/evidence/tests/integration/integration_test.log

# WebApplicationFactory tests (in-process testing)
dotnet test tests/FunctionalTests/ \
  --configuration Release \
  --logger "trx;LogFileName=functional_results.trx" \
  --results-directory .team/evidence/tests/integration/ \
  2>&1 | tee .team/evidence/tests/integration/functional_test.log
```

---

## 13. ATOMIC COMMIT PROTOCOL

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

### .NET-Specific Commit Types

| Type | When | Example |
|------|------|---------|
| `feat` | New endpoint, service, entity | `feat(users): add UserService with CRUD operations [#8]` |
| `fix` | Bug fix, query fix, auth issue | `fix(auth): resolve token expiration not being validated [#22]` |
| `test` | xUnit test, integration test | `test(users): add WebApplicationFactory integration tests [#14]` |
| `refactor` | Clean architecture restructuring | `refactor(domain): extract value objects from User entity` |
| `chore` | NuGet update, csproj config | `chore(deps): upgrade EF Core to 8.0.4` |
| `ci` | GitHub Actions workflow changes | `ci(actions): add .NET CI with test + build + publish [#3]` |
| `perf` | Query optimization, caching | `perf(queries): add covering index for user search [#30]` |
| `security` | Auth hardening, vulnerability fix | `security(auth): rotate JWT signing keys [#18]` |
| `evidence` | Adding proof/evidence artifacts | `evidence(qa): add xUnit TRX results and coverage report` |

### Rules

1. **One logical change per commit** -- never bundle a migration + service + controller
2. **Reference issue number** -- `feat(orders): add order processing pipeline [#15]`
3. **Include evidence reference** -- point to proof in `.team/evidence/`
4. **Never commit secrets** -- connection strings, API keys in `appsettings.json` must use User Secrets or env vars
5. **Never commit `bin/`, `obj/`, `.vs/`** -- ensure `.gitignore` covers all .NET build artifacts
6. **Run `dotnet build` before every commit** -- zero warnings policy with TreatWarningsAsErrors

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
| # | Hash | Agent | Type | Description | Issue | Wave | Service | Evidence |
|---|------|-------|------|-------------|-------|------|---------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | -- | manifest |
| 2 | def5678 | BE | feat | user CRUD API | #8 | 2 | UserService | be_build.log |
| 3 | ghi9012 | DB | feat | EF Core migrations | #10 | 2 | Infrastructure | ef_migration.sql |
| 4 | jkl3456 | AUTH | feat | JWT auth middleware | #12 | 2 | Identity | auth_token.log |
```

---

## 14. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### .NET Test Pyramid

```
                       +----------+
                       | Release  |  <- Deployment health check on staging
                      +------------+
                      |  Contract  |  <- Pact/Spring Cloud Contract tests
                     +--------------+
                     |  Load Tests  |  <- NBomber / k6 performance tests
                    +----------------+
                    | Integration    |  <- WebApplicationFactory + Testcontainers
                   +------------------+
                   |   Unit Tests     |  <- xUnit + Moq/NSubstitute
                  +--------------------+
                  |  Static Analysis   |  <- Roslyn analyzers, StyleCop, dotnet format
                  +--------------------+
```

### Coverage Requirements

| Layer | Minimum | Tools | Blocking? |
|-------|---------|-------|-----------|
| Static Analysis | 100% files scanned | Roslyn analyzers, StyleCop.Analyzers, `dotnet format --verify-no-changes` | YES |
| Unit Tests | >= 80% line coverage | xUnit, Moq, NSubstitute, FluentAssertions, Coverlet | YES |
| Integration Tests | All API endpoints + DB operations | WebApplicationFactory, Testcontainers, Respawn (DB reset) | YES |
| Contract Tests | All inter-service API contracts | Pact.NET, WireMock.NET | YES (microservices) |
| Load Tests | P99 < SLA, throughput meets target | NBomber, k6, BenchmarkDotNet (micro) | WARN |
| Security Tests | Zero CRITICAL/HIGH vulnerabilities | OWASP dependency-check, `dotnet list package --vulnerable`, Snyk | YES |
| EF Migration Tests | All migrations apply cleanly | `dotnet ef database update` on test DB, Respawn reset | YES |
| Release Tests | Health check passes, Swagger loads | Custom smoke tests against staging | YES |

### QA Agent Testing Protocol

```
PHASE 1: STATIC ANALYSIS
+-- dotnet format --verify-no-changes -> .team/evidence/tests/static/dotnet_format.log
+-- dotnet build /p:TreatWarningsAsErrors=true -> .team/evidence/tests/static/build_strict.log
+-- Roslyn analyzer warnings: zero tolerance
+-- gitleaks secret scan -> .team/evidence/tests/static/gitleaks.log

PHASE 2: UNIT TESTS
+-- dotnet test (xUnit) with Coverlet -> .team/evidence/tests/unit/
+-- Verify line coverage >= 80%
+-- Test domain logic, application services, value objects
+-- Test middleware, filters, validators
+-- Run 3x to detect flaky tests

PHASE 3: INTEGRATION TESTS
+-- WebApplicationFactory tests (in-process HTTP) -> .team/evidence/tests/integration/
+-- Testcontainers for SQL Server/PostgreSQL -> real DB integration
+-- Respawn for DB cleanup between tests
+-- Test all controller endpoints with auth
+-- Test EF Core queries against real database
+-- Test error scenarios: 404, 400, 401, 403, 500

PHASE 4: CONTRACT TESTS
+-- Pact provider verification -> .team/evidence/tests/contract/
+-- Verify all consumer contracts are satisfied
+-- WireMock.NET for external service stubs
+-- EVIDENCE: Save Pact verification report

PHASE 5: LOAD TESTS
+-- NBomber scenario: concurrent users, sustained load -> .team/evidence/tests/load/
+-- Measure: P50, P95, P99 latency; throughput; error rate
+-- Memory profiling: check for leaks under load
+-- Connection pool exhaustion test
+-- Compare against SLA targets from strategy

PHASE 6: SECURITY TESTS
+-- dotnet list package --vulnerable -> .team/evidence/tests/security/nuget_vulns.txt
+-- OWASP dependency-check -> .team/evidence/tests/security/owasp_report.html
+-- Verify auth on all protected endpoints
+-- Test CORS, CSRF, rate limiting configuration
+-- EVIDENCE: Save all scan reports

PHASE 7: MIGRATION VERIFICATION
+-- dotnet ef migrations script -> .team/evidence/validation/ef_migration_script.sql
+-- Apply migrations to clean test database
+-- Verify rollback migration works
+-- Data seeding verification
+-- EVIDENCE: Save migration logs
```

---

## 15. GITHUB ACTIONS -- LOCAL TESTING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 5

### Mandate
All CI/CD workflows MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### .NET CI Workflow

```yaml
# .github/workflows/dotnet_ci.yml
name: .NET CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet restore
      - run: dotnet build --configuration Release --no-restore /p:TreatWarningsAsErrors=true
      - run: dotnet format --verify-no-changes

  test:
    runs-on: ubuntu-latest
    needs: build
    services:
      sqlserver:
        image: mcr.microsoft.com/mssql/server:2022-latest
        env:
          ACCEPT_EULA: Y
          SA_PASSWORD: YourStrong!Passw0rd
        ports: ['1433:1433']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet restore
      - run: dotnet test --configuration Release --no-restore --logger "trx" --collect:"XPlat Code Coverage" --results-directory TestResults
      - name: Check coverage
        run: |
          # Parse Coverlet output for coverage percentage
          find TestResults -name "coverage.cobertura.xml" -exec grep -oP 'line-rate="\K[^"]+' {} \; | head -1
      - uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: TestResults/

  security:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet restore
      - run: dotnet list package --vulnerable --include-transitive
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2

  ef-migration:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet tool install --global dotnet-ef
      - run: dotnet ef migrations script --project src/Infrastructure --idempotent --output migrations.sql
      - uses: actions/upload-artifact@v4
        with:
          name: migration-script
          path: migrations.sql

  publish:
    runs-on: ubuntu-latest
    needs: [test, security, ef-migration]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet publish --configuration Release --output ./publish
      - uses: actions/upload-artifact@v4
        with:
          name: publish-artifact
          path: ./publish/
```

### Local Validation with `act`

```bash
# Validate workflow syntax
yamllint .github/workflows/dotnet_ci.yml
actionlint .github/workflows/dotnet_ci.yml

# Dry run
act -n 2>&1 | tee .team/evidence/ci/act_dryrun.log

# Run build job locally
act -j build 2>&1 | tee .team/evidence/ci/act_build.log

# Run test job (needs SQL Server service)
act -j test 2>&1 | tee .team/evidence/ci/act_test.log

# Full push event
act push 2>&1 | tee .team/evidence/ci/act_push.log
```

---

## 16. PM KANBAN -- REAL-TIME TRACKING

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
| **Testing** | QA validating | QA runs xUnit + integration tests |
| **Done** | Verified complete with evidence | QA passes + evidence verified |
| **Blocked** | Cannot proceed | NuGet conflict, migration issue, or dependency blocking |

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
+-- Comment with: evidence manifest link, commit hash, build log summary
+-- Add "status:in-review" label, add service label (service:api, etc.)

ON QA PASS:
+-- Move issue from "Testing" to "Done"
+-- Close issue with: "Verified. xUnit: X/X passing, coverage: Y%. Evidence: [link]"
+-- Add "status:done" + "evidence:verified" labels

ON BLOCK:
+-- Move issue to "Blocked"
+-- Comment: "BLOCKED: {reason}. Service: {service_name}. Waiting on: {dependency}"
+-- Create linked blocking issue if needed
```

### .NET-Specific Label Set

```bash
# Create .NET-specific labels
for label in "service:api:0075CA" "service:worker:FF6D00" "service:gateway:7B1FA2" "type:migration:795548" "type:auth:F44336" "type:infrastructure:009688" "status:backlog:CCCCCC" "status:in-progress:d93f0b" "status:in-review:fbca04" "status:testing:5319e7" "status:done:0e8a16" "status:blocked:000000" "evidence:verified:00C853" "evidence:missing:FF1744"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

---

*.NET Enterprise Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 14 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Driven | Locally-Tested*
