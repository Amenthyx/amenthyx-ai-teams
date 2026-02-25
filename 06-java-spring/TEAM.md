# Java Spring Team
# Activation: `--team javaSpring`
# Focus: Java, Spring Boot, enterprise backend systems

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Evidence & Proof Protocol](#7-evidence--proof-protocol)
8. [Local Install & Test Protocol](#8-local-install--test-protocol)
9. [Atomic Commit Protocol](#9-atomic-commit-protocol)
10. [Comprehensive Testing Matrix](#10-comprehensive-testing-matrix)
11. [GitHub Actions -- Local Testing](#11-github-actions--local-testing)
12. [PM Kanban -- Real-Time Tracking](#12-pm-kanban--real-time-tracking)
13. [Quality Gates](#13-quality-gates)
14. [`.team/` Directory Layout](#14-team-directory-layout)
15. [Reporting System](#15-reporting-system)
16. [Error Handling & Session Management](#16-error-handling--session-management)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team javaSpring --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> — this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 14)
4. Spawn Team Leader agent (foreground — this is the orchestrator)
5. Team Leader spawns PM agent (foreground — must complete before others)
6. PM produces Project Charter + Initial Plan + creates GitHub Project
7. Team Leader reviews PM output, then spawns remaining agents in waves
8. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, Java version, Spring Boot version, microservices topology, and enterprise integration requirements.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between service boundaries, messaging patterns, and data ownership.
- **Persona**: "You are the Team Leader of a 10-person Java Spring enterprise engineering team. You coordinate all work, make final architectural decisions (microservices decomposition, event-driven vs request-response, database-per-service vs shared DB, saga vs 2PC), enforce quality gates, and ensure the system ships production-ready. You never write production code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter, milestones, kanban. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports.
- **Persona**: "You are the Project Manager for a Java Spring enterprise team. You create all planning artifacts and manage the project via GitHub Projects using `gh` CLI. You track enterprise milestones (architecture review, API freeze, integration testing, staging deployment, production release, post-launch monitoring). You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Solution Architect (SA)
- **Role**: System architecture, microservices design, Spring Cloud configuration.
- **Persona**: "You are the Solution Architect. You design the overall system architecture: microservices decomposition, Spring Cloud configuration (Config Server, Service Discovery, API Gateway, Circuit Breaker), domain-driven design (bounded contexts, aggregates, domain events), and inter-service communication patterns. You produce architecture decision records (ADRs) and system context diagrams. You write to `.team/architecture/`."
- **Spawning**: Wave 2 (parallel)

### 2.4 Spring Boot Engineer (SBE)
- **Role**: Core Spring Boot services, REST APIs, business logic, configuration.
- **Persona**: "You are the Spring Boot Engineer. You implement Spring Boot 3 applications: REST controllers, service layers, repository patterns, configuration properties, profiles (dev/staging/prod), actuator endpoints, health indicators, and auto-configuration. You follow Spring conventions (constructor injection, @Configuration classes, @Transactional boundaries) and write clean, production-ready Java 21 code. You write to `.team/services/`."
- **Spawning**: Wave 2 (parallel)

### 2.5 Database Engineer (DB)
- **Role**: JPA/Hibernate, database design, migrations, query optimization.
- **Persona**: "You are the Database Engineer. You design relational schemas, implement JPA entities and Spring Data repositories, Flyway/Liquibase migrations, query optimization (N+1 detection, fetch join strategies, query hints), connection pooling (HikariCP tuning), multi-datasource configuration, and read replica routing. You handle database-per-service patterns and cross-service data consistency. You write to `.team/database/`."
- **Spawning**: Wave 2 (parallel)

### 2.6 Messaging Engineer (MSG)
- **Role**: Kafka, RabbitMQ, event-driven architecture, async processing.
- **Persona**: "You are the Messaging Engineer. You design and implement event-driven communication: Kafka topics/partitions/consumer groups, Spring Cloud Stream bindings, dead letter queues, message serialization (Avro/JSON Schema), exactly-once semantics, saga orchestration, and event sourcing patterns. You handle RabbitMQ exchanges/queues or Redis Streams as specified. You write to `.team/messaging/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 Security Engineer (SEC)
- **Role**: Spring Security, OAuth2, JWT, API security, vulnerability scanning.
- **Persona**: "You are the Security Engineer. You implement Spring Security configurations: OAuth2 Resource Server, JWT validation, method-level security (@PreAuthorize, @Secured), CORS policies, CSRF protection, rate limiting (Bucket4j/Resilience4j), API key management, secret rotation (Vault integration), and security headers. You design the authentication/authorization architecture and conduct threat modeling. You write to `.team/security/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer -- Enterprise Testing (QA)
- **Role**: JUnit 5, Testcontainers, contract tests, performance tests.
- **Persona**: "You are the QA Engineer specializing in enterprise Java testing. You create test strategies covering unit tests (JUnit 5 + Mockito), integration tests (Spring Boot Test + Testcontainers), contract tests (Spring Cloud Contract/Pact), performance tests (JMH microbenchmarks, Gatling/k6 load tests), and security scanning (SpotBugs, OWASP dependency-check, SonarQube). You enforce code coverage thresholds (80%+ line coverage via JaCoCo). You produce QA sign-off in `.team/qa/`."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Release coordination, Maven/Gradle publishing, deployment pipelines.
- **Persona**: "You are the Release Manager. You coordinate releases: release branches (GitFlow or trunk-based), semantic versioning, changelogs, Maven Central/Nexus publishing, Docker image builds and registry pushes, Kubernetes deployment manifests, Helm charts, blue-green or rolling deployments, database migration execution sequencing, rollback plans, and release notes. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: Enterprise API positioning, developer documentation, adoption strategy.
- **Persona**: "You are the Marketing Strategist. You create enterprise API positioning documents, developer portal content (Swagger UI/Redoc), SDK generation plans, onboarding guides, competitive analyses against alternative platforms, and internal adoption strategies for the Java/Spring ecosystem."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: Enterprise compliance, open-source licensing, data governance.
- **Persona**: "You are the Legal/Compliance Attorney. You review for GDPR, CCPA, HIPAA (if applicable), SOC 2 compliance, open-source license compatibility of Maven/Gradle dependencies (GPL contamination, Apache/MIT compatibility), data retention and audit logging policies, PCI-DSS (if payment processing), and enterprise security standards. You produce compliance checklists and risk assessments."
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
     | (Planning)  |  | (API Docs)|  | (Compliance)  |
     +------+------+  +-----------+  +---------------+
            |
   +--------+--------+--------+--------+
   |        |        |        |        |
+--v--+ +---v---+ +--v---+ +-v----+ +-v----+
|  SA | |  SBE  | |  DB  | | MSG  | | SEC  |
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
  description="PM: Java Spring enterprise project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan (include enterprise milestones: architecture review, API freeze, integration test, staging, production, post-launch monitoring) -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register (include enterprise risks: service coupling, data consistency, message ordering, dependency version conflicts, JVM tuning) -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Enterprise API positioning & developer docs", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write API positioning, developer portal plan, onboarding guide to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: Enterprise compliance & licensing review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write compliance checklist, dependency license audit, data governance, security standards to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 5 agents)
```
SA  -> .team/architecture/   (SYSTEM_ARCHITECTURE.md, ADR_LOG.md, DOMAIN_MODEL.md, SPRING_CLOUD_CONFIG.md)
SBE -> .team/services/       (SERVICE_DESIGN.md, API_ENDPOINTS.md, CONFIGURATION.md)
DB  -> .team/database/       (SCHEMA_DESIGN.md, MIGRATION_PLAN.md, JPA_STRATEGY.md, QUERY_OPTIMIZATION.md)
MSG -> .team/messaging/      (EVENT_ARCHITECTURE.md, TOPIC_DESIGN.md, SAGA_PATTERNS.md, DLQ_STRATEGY.md)
SEC -> .team/security/       (SECURITY_ARCHITECTURE.md, OAUTH2_CONFIG.md, THREAT_MODEL.md, API_SECURITY.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, UNIT_TESTS.md, INTEGRATION_TESTS.md, CONTRACT_TESTS.md, PERFORMANCE_TESTS.md, SECURITY_SCAN.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, DEPLOYMENT_MANIFEST.md, HELM_CHART.md, MIGRATION_RUNBOOK.md, ROLLBACK_PLAN.md, RELEASE_NOTES.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_MANIFEST.md must be approved
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

**Java Spring-specific labels**: `service:api`, `service:worker`, `service:gateway`, `type:jpa`, `type:kafka`, `type:security`, `type:config`, `spring:boot`, `spring:cloud`.

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
+-- EVIDENCE: PM writes manifest to .team/evidence/manifests/PM_manifest.md

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: enterprise API positioning, developer portal plan
+-- Attorney: compliance audit, dependency licensing, data governance
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- SA, SBE, DB, MSG, SEC -- all in parallel
+-- Each agent writes evidence manifest on completion
+-- SYNC: TL waits for all 5 agents
+-- EVIDENCE: Each agent captures build logs, test results, Surefire/Failsafe reports

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- GATE: All evidence manifests present
+-- QA: unit tests, integration tests, contract tests, performance tests, security scan, sign-off
+-- QA: Collect JaCoCo coverage, Surefire reports, SpotBugs output, Testcontainers logs
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: checklist, changelog, deployment manifest, Helm chart, migration runbook, rollback, release notes
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_MANIFEST.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF
+-- PM: close all GitHub milestones
+-- TL: present summary to user
```

---

## 7. EVIDENCE & PROOF PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 1

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works. Java Spring enterprise systems demand rigorous evidence -- build logs, test reports, code coverage, security scans, and Actuator health checks are critical proof artifacts.

### Java Spring-Specific Evidence Requirements

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
| SA | Architecture diagrams, ADRs, domain model | PlantUML/Mermaid output + ADR markdown in `.team/architecture/` |
| SBE | Clean Maven/Gradle build (zero warnings) | `./mvnw clean verify 2>&1 \| tee .team/evidence/builds/mvn_verify.log` |
| SBE | Surefire unit test reports (XML) | `./mvnw test` -> `target/surefire-reports/*.xml` copied to `.team/evidence/tests/unit/` |
| SBE | Actuator health endpoint | `curl localhost:8080/actuator/health > .team/evidence/runtime/actuator_health.json` |
| DB | Flyway/Liquibase migration success | `./mvnw flyway:info 2>&1 \| tee .team/evidence/builds/flyway_info.log` |
| DB | JPA entity validation | `./mvnw test -pl persistence-module 2>&1 \| tee .team/evidence/tests/unit/jpa_tests.log` |
| MSG | Kafka/RabbitMQ connectivity test | Integration test output in `.team/evidence/tests/integration/messaging.log` |
| MSG | Message serialization roundtrip | Avro/JSON Schema validation test results |
| SEC | SpotBugs security scan | `./mvnw spotbugs:check 2>&1 \| tee .team/evidence/tests/security/spotbugs.log` |
| SEC | OWASP dependency-check | `./mvnw dependency-check:check` -> `.team/evidence/tests/security/owasp_report.html` |
| QA | JaCoCo coverage report | `./mvnw jacoco:report` -> `.team/evidence/tests/unit/jacoco/` |
| QA | Testcontainers integration results | `./mvnw verify -P integration 2>&1 \| tee .team/evidence/tests/integration/testcontainers.log` |
| QA | Gatling/JMH performance results | Load test output -> `.team/evidence/tests/performance/` |

### Evidence Manifest (Per Agent)

Every agent writes to `.team/evidence/manifests/{ROLE}_manifest.md`:

```markdown
# Evidence Manifest -- {AGENT_ROLE}
## Task: {task_description}
## Date: {ISO_8601_timestamp}

### Artifacts Produced
- [ ] `src/main/java/com/example/service/UserService.java` -- User service implementation
- [ ] `src/main/java/com/example/controller/UserController.java` -- REST controller

### Evidence Collected
- [ ] Build log: `.team/evidence/builds/mvn_verify.log` (BUILD SUCCESS, 0 warnings)
- [ ] Surefire report: `.team/evidence/tests/unit/surefire-reports/` (124/124 tests passing)
- [ ] JaCoCo coverage: `.team/evidence/tests/unit/jacoco/index.html` (86% line coverage)
- [ ] SpotBugs: `.team/evidence/tests/security/spotbugs.log` (0 findings)
- [ ] Actuator health: `.team/evidence/runtime/actuator_health.json` (status: UP)

### Verification Steps (Reproducible)
1. `cd /path/to/project`
2. `./mvnw clean verify`
3. `./mvnw spring-boot:run`
4. `curl localhost:8080/actuator/health`
5. `./mvnw jacoco:report && open target/site/jacoco/index.html`

### Status: VERIFIED / UNVERIFIED
```

---

## 8. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally. Java Spring projects must compile cleanly, pass all tests including Testcontainers integration tests, and produce acceptable coverage reports.

### Java Spring Local Install Protocol

```bash
# STEP 1: Environment verification
java --version > .team/evidence/env_java.txt 2>&1
./mvnw --version >> .team/evidence/env_java.txt 2>&1 || ./gradlew --version >> .team/evidence/env_java.txt 2>&1
docker --version >> .team/evidence/env_java.txt 2>&1

# STEP 2: Dependency resolution
./mvnw dependency:resolve \
  2>&1 | tee .team/evidence/deps/mvn_resolve.log
./mvnw dependency:tree \
  > .team/evidence/deps/dependency_tree.txt 2>&1

# STEP 3: Clean build
./mvnw clean compile -DskipTests \
  2>&1 | tee .team/evidence/builds/mvn_compile.log

# STEP 4: Unit tests with Surefire
./mvnw test \
  2>&1 | tee .team/evidence/builds/mvn_test.log
cp -r target/surefire-reports/ .team/evidence/tests/unit/surefire-reports/

# STEP 5: Integration tests with Failsafe + Testcontainers
./mvnw verify -P integration-tests \
  2>&1 | tee .team/evidence/tests/integration/testcontainers.log
cp -r target/failsafe-reports/ .team/evidence/tests/integration/failsafe-reports/ 2>/dev/null || true

# STEP 6: JaCoCo coverage report
./mvnw jacoco:report \
  2>&1 | tee .team/evidence/tests/unit/jacoco_report.log
cp -r target/site/jacoco/ .team/evidence/tests/unit/jacoco/

# STEP 7: SpotBugs static analysis
./mvnw spotbugs:check \
  2>&1 | tee .team/evidence/tests/security/spotbugs.log

# STEP 8: Checkstyle
./mvnw checkstyle:check \
  2>&1 | tee .team/evidence/tests/static/checkstyle.log

# STEP 9: OWASP dependency check
./mvnw dependency-check:check \
  2>&1 | tee .team/evidence/tests/security/owasp_check.log
cp target/dependency-check-report.html .team/evidence/tests/security/owasp_report.html 2>/dev/null || true

# STEP 10: Start application and health check
./mvnw spring-boot:run &
APP_PID=$!
sleep 15  # wait for Spring Boot to start
curl -s localhost:8080/actuator/health > .team/evidence/runtime/actuator_health.json 2>&1
curl -s localhost:8080/actuator/info > .team/evidence/runtime/actuator_info.json 2>&1
kill $APP_PID 2>/dev/null
```

### Gradle Alternative Protocol

```bash
# If project uses Gradle instead of Maven:
./gradlew clean build \
  2>&1 | tee .team/evidence/builds/gradle_build.log

./gradlew test \
  2>&1 | tee .team/evidence/builds/gradle_test.log
cp -r build/reports/tests/ .team/evidence/tests/unit/gradle-reports/

./gradlew jacocoTestReport \
  2>&1 | tee .team/evidence/tests/unit/jacoco_report.log
cp -r build/reports/jacoco/ .team/evidence/tests/unit/jacoco/

./gradlew integrationTest \
  2>&1 | tee .team/evidence/tests/integration/testcontainers.log

./gradlew spotbugsMain \
  2>&1 | tee .team/evidence/tests/security/spotbugs.log

./gradlew dependencies > .team/evidence/deps/dependency_tree.txt 2>&1

java -jar build/libs/*.jar &
APP_PID=$!
sleep 15
curl -s localhost:8080/actuator/health > .team/evidence/runtime/actuator_health.json 2>&1
kill $APP_PID 2>/dev/null
```

### Testcontainers Setup

```bash
# Ensure Docker is running (required for Testcontainers)
docker info > /dev/null 2>&1 || echo "ERROR: Docker not running -- Testcontainers will fail"

# Common Testcontainers (auto-pulled during tests):
# - PostgreSQL: testcontainers/postgres:16
# - Kafka: confluentinc/cp-kafka
# - Redis: redis:7
# - Elasticsearch: elasticsearch:8

# Run integration tests with Testcontainers
./mvnw verify -P integration-tests \
  -Dspring.profiles.active=test \
  2>&1 | tee .team/evidence/tests/integration/testcontainers.log
```

---

## 9. ATOMIC COMMIT PROTOCOL

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

### Java Spring-Specific Commit Types

| Type | When | Example |
|------|------|---------|
| `feat` | New service, controller, entity, endpoint | `feat(user-service): add CRUD REST endpoints [#8]` |
| `fix` | Bug fix, N+1 query fix, transaction fix | `fix(order-service): resolve N+1 query in findAll [#22]` |
| `test` | JUnit, Testcontainers, contract, Gatling | `test(user-service): add Testcontainers integration tests [#14]` |
| `refactor` | Code cleanup, pattern improvement | `refactor(auth): replace SecurityFilterChain with declarative config` |
| `chore` | Maven/Gradle config, dependencies | `chore(deps): bump spring-boot to 3.3.0` |
| `ci` | CI workflow changes | `ci(actions): add Java 17/21 matrix build [#3]` |
| `perf` | JPA query optimization, caching | `perf(product-service): add Redis caching for catalog queries [#30]` |
| `security` | Security configuration, vulnerability fix | `security(auth): configure OAuth2 Resource Server with JWT [#18]` |
| `db` | Migration, schema change | `db(migration): add V3__create_orders_table.sql [#15]` |
| `evidence` | Adding proof/evidence artifacts | `evidence(qa): add JaCoCo coverage + SpotBugs reports` |

### Rules

1. **One logical change per commit** -- never bundle an entity + controller + migration
2. **Reference issue number** -- `feat(payment): add Stripe webhook handler [#12]`
3. **Include evidence reference** -- point to proof in `.team/evidence/`
4. **Never commit secrets** -- application-secret.yml, API keys, database passwords must never enter the repository
5. **Never commit build artifacts** -- `target/`, `build/`, `*.jar`, `*.class` must be gitignored
6. **Run `./mvnw verify` before every commit** -- green build policy

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
| # | Hash | Agent | Type | Description | Issue | Wave | Service | Evidence |
|---|------|-------|------|-------------|-------|------|---------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | -- | manifest |
| 2 | def5678 | SBE | feat | user REST endpoints | #8 | 2 | user-service | surefire-reports |
| 3 | ghi9012 | DB | db | user schema migration | #10 | 2 | persistence | flyway_info.log |
| 4 | jkl3456 | MSG | feat | order event consumers | #12 | 2 | messaging | testcontainers.log |
```

---

## 10. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### Java Spring Test Pyramid

```
                       +----------+
                       | Release  |  <- Docker image smoke test, Helm deploy verify
                      +------------+
                      | Performance|  <- Gatling/k6 load tests, JMH microbenchmarks
                     +--------------+
                     | Security Scan |  <- SpotBugs, OWASP dependency-check, SonarQube
                    +----------------+
                    | Contract Tests  |  <- Spring Cloud Contract / Pact
                   +------------------+
                   | Integration Tests |  <- Spring Boot Test + Testcontainers
                  +--------------------+
                  |    Unit Tests       |  <- JUnit 5 + Mockito
                 +----------------------+
                 | Static Analysis       |  <- Checkstyle, SpotBugs, Compiler warnings
                 +-----------------------+
```

### Coverage Requirements

| Layer | Minimum | Tools | Blocking? |
|-------|---------|-------|-----------|
| Static Analysis | Checkstyle clean, SpotBugs zero high/critical findings | Checkstyle, SpotBugs, javac -Xlint:all | YES |
| Unit Tests | >= 80% line coverage | JUnit 5, Mockito, JaCoCo | YES |
| Integration Tests | All service interactions verified with real containers | Spring Boot Test, Testcontainers (Postgres, Kafka, Redis) | YES |
| Contract Tests | All producer/consumer contracts pass | Spring Cloud Contract, Pact | YES |
| Security Scan | Zero critical/high CVEs, SpotBugs security clean | OWASP dependency-check, SpotBugs find-sec-bugs | YES |
| Performance Tests | p99 latency and throughput meet SLA | Gatling, k6, JMH for micro-benchmarks | WARN |
| Actuator Health | All health indicators report UP | Spring Boot Actuator /actuator/health | YES |
| Docker Build | Image builds, starts, and passes health check | `docker build` + `docker run` + health probe | YES |

### QA Agent Testing Protocol

```
PHASE 1: STATIC ANALYSIS
+-- Checkstyle check -> .team/evidence/tests/static/checkstyle.log
+-- SpotBugs (including find-sec-bugs) -> .team/evidence/tests/security/spotbugs.log
+-- Compile with -Xlint:all, zero warnings
+-- EVIDENCE: Save all output

PHASE 2: UNIT TESTS
+-- ./mvnw test -> .team/evidence/tests/unit/surefire-reports/
+-- JaCoCo coverage >= 80% -> .team/evidence/tests/unit/jacoco/
+-- Run 3x to detect flaky tests
+-- EVIDENCE: Save Surefire XML + JaCoCo HTML report

PHASE 3: INTEGRATION TESTS
+-- ./mvnw verify -P integration-tests with Testcontainers
+-- Verify Postgres, Kafka, Redis containers start and pass
+-- Failsafe reports -> .team/evidence/tests/integration/failsafe-reports/
+-- EVIDENCE: Save Failsafe XML + container logs

PHASE 4: CONTRACT TESTS
+-- Spring Cloud Contract verification -> .team/evidence/tests/contract/
+-- Producer stubs generated, consumer tests pass
+-- EVIDENCE: Save contract test results

PHASE 5: SECURITY SCAN
+-- OWASP dependency-check -> .team/evidence/tests/security/owasp_report.html
+-- SpotBugs find-sec-bugs -> .team/evidence/tests/security/spotbugs.log
+-- Verify: zero critical/high CVEs, zero security bugs
+-- EVIDENCE: Save all scan reports

PHASE 6: PERFORMANCE TESTS
+-- JMH microbenchmarks for hot paths -> .team/evidence/tests/performance/jmh_results.json
+-- Gatling load test against running app -> .team/evidence/tests/performance/gatling/
+-- Verify: p99 latency, throughput, error rate within SLA
+-- EVIDENCE: Save Gatling HTML report + JMH JSON

PHASE 7: RELEASE VALIDATION
+-- Docker build succeeds: `docker build -t app:test .`
+-- Container starts and health check passes
+-- Actuator endpoints respond correctly
+-- EVIDENCE: Save Docker build log + health check response
```

---

## 11. GITHUB ACTIONS -- LOCAL TESTING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 5

### Mandate
All CI/CD workflows MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### Java Spring CI Workflow

```yaml
# .github/workflows/java.yml
name: Java Spring CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-java17:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17
          cache: maven
      - name: Build and test
        run: ./mvnw clean verify -B
      - name: JaCoCo coverage
        run: ./mvnw jacoco:report
      - uses: actions/upload-artifact@v4
        with:
          name: test-results-java17
          path: |
            target/surefire-reports/
            target/site/jacoco/

  build-java21:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
          cache: maven
      - name: Build and test
        run: ./mvnw clean verify -B
      - uses: actions/upload-artifact@v4
        with:
          name: test-results-java21
          path: target/surefire-reports/

  integration-tests:
    runs-on: ubuntu-latest
    needs: [build-java17, build-java21]
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
          cache: maven
      - name: Integration tests with Testcontainers
        run: ./mvnw verify -P integration-tests -Dspring.profiles.active=ci
      - uses: actions/upload-artifact@v4
        with:
          name: integration-results
          path: target/failsafe-reports/

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
          cache: maven
      - name: SpotBugs
        run: ./mvnw spotbugs:check -B
      - name: OWASP dependency-check
        run: ./mvnw dependency-check:check -B || true
      - name: Checkstyle
        run: ./mvnw checkstyle:check -B
      - uses: actions/upload-artifact@v4
        with:
          name: security-reports
          path: |
            target/spotbugsXml.xml
            target/dependency-check-report.html

  docker-build:
    runs-on: ubuntu-latest
    needs: [integration-tests, security-scan]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
          cache: maven
      - name: Package
        run: ./mvnw package -DskipTests -B
      - name: Build Docker image
        run: docker build -t app:ci-test .
      - name: Smoke test
        run: |
          docker run -d --name ci-test -p 8080:8080 app:ci-test
          sleep 15
          curl -f localhost:8080/actuator/health || exit 1
          docker stop ci-test

  secrets-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
```

### Local Validation with `act`

```bash
# Validate workflow syntax
yamllint .github/workflows/java.yml
actionlint .github/workflows/java.yml

# Dry run
act -n 2>&1 | tee .team/evidence/ci/act_dryrun.log

# Run specific jobs
act -j build-java21 2>&1 | tee .team/evidence/ci/act_build_java21.log
act -j security-scan 2>&1 | tee .team/evidence/ci/act_security.log

# Full push event
act push 2>&1 | tee .team/evidence/ci/act_push.log
```

---

## 12. PM KANBAN -- REAL-TIME TRACKING

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
| **Testing** | QA running tests + scans | QA picks up for enterprise testing |
| **Done** | Verified (tests pass, scans clean) | QA passes + all checks green |
| **Blocked** | Cannot proceed | Dependency conflict, container failure, or service coupling issue |

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
+-- Comment with: evidence manifest, commit hash, Surefire summary, JaCoCo coverage
+-- Add "status:in-review" label, add service label

ON QA PASS:
+-- Move issue from "Testing" to "Done"
+-- Close issue with: "Verified. All tests pass, security scans clean, coverage above threshold. Evidence: [link]"
+-- Add "status:done" + "evidence:verified" labels

ON BLOCK:
+-- Move issue to "Blocked"
+-- Comment: "BLOCKED: {reason}. Service: {service}. Dependency: {dep}."
+-- Create linked blocking issue if needed
```

### Java Spring-Specific Label Set

```bash
for label in "service:api:0075CA" "service:worker:FF6D00" "service:gateway:795548" "type:jpa:4CAF50" "type:kafka:E91E63" "type:security:9C27B0" "type:config:00BCD4" "spring:boot:6DB33F" "spring:cloud:6DB33F" "status:backlog:CCCCCC" "status:in-progress:d93f0b" "status:in-review:fbca04" "status:testing:5319e7" "status:done:0e8a16" "status:blocked:000000" "evidence:verified:00C853" "evidence:missing:FF1744"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

---

## 13. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| Build Gate | After Engineering | `./mvnw clean verify` or `./gradlew build` succeeds with zero warnings | Re-spawn SBE |
| Unit Test Gate | After QA | JUnit 5 tests pass, JaCoCo coverage >= 80% line coverage | Re-spawn SBE + SA |
| Integration Test Gate | After QA | Spring Boot Test + Testcontainers pass, all service interactions verified | Re-spawn SBE + DB + MSG |
| Contract Test Gate | After QA | Spring Cloud Contract / Pact contracts pass for all services | Re-spawn SBE + SA |
| Security Scan Gate | After QA | SpotBugs clean, OWASP dependency-check no critical/high CVEs, SonarQube quality gate pass | Re-spawn SEC |
| Performance Gate | After QA | JMH benchmarks meet thresholds, Gatling load tests pass SLA (p99 latency, throughput) | Re-spawn SBE + DB |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_MANIFEST.md` approved, migrations tested on staging | RM lists blocking items |
| Evidence Complete | Before QA | Every agent has evidence manifest with build logs, test results, security scans | Re-spawn agent to collect evidence |
| Local Build Passes | Before QA | `./mvnw clean verify` green on Java 17 + 21, zero compiler warnings | Re-spawn SBE |
| Actuator Health Gate | Before Release | All Actuator health indicators report UP (db, kafka, redis, diskSpace) | Re-spawn SBE + DB + MSG |
| CI Validation Gate | Before push | `act push` succeeds locally, `actionlint` clean for Java CI workflow | Fix workflow, re-test |
| No Secrets Gate | Every commit | `gitleaks detect` finds zero secrets (no API keys, no database passwords) | HARD STOP, rotate secrets |
| Docker Image Gate | Before Release | Docker image builds, starts, passes health check within 30s | Re-spawn SBE + RM |

---

## 14. `.team/` DIRECTORY LAYOUT

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
|   |   +-- SBE_manifest.md
|   |   +-- DB_manifest.md
|   |   +-- MSG_manifest.md
|   |   +-- SEC_manifest.md
|   |   +-- QA_manifest.md
|   +-- builds/
|   |   +-- mvn_compile.log
|   |   +-- mvn_verify.log
|   |   +-- mvn_test.log
|   |   +-- gradle_build.log
|   +-- tests/
|   |   +-- static/
|   |   |   +-- checkstyle.log
|   |   +-- unit/
|   |   |   +-- surefire-reports/
|   |   |   +-- jacoco/
|   |   |   +-- jacoco_report.log
|   |   +-- integration/
|   |   |   +-- testcontainers.log
|   |   |   +-- failsafe-reports/
|   |   +-- contract/
|   |   |   +-- contract_results.log
|   |   +-- performance/
|   |   |   +-- jmh_results.json
|   |   |   +-- gatling/
|   |   +-- security/
|   |   |   +-- spotbugs.log
|   |   |   +-- owasp_report.html
|   |   |   +-- owasp_check.log
|   +-- runtime/
|   |   +-- actuator_health.json
|   |   +-- actuator_info.json
|   +-- deps/
|   |   +-- mvn_resolve.log
|   |   +-- dependency_tree.txt
|   +-- diffs/
|   +-- ci/
|   |   +-- act_push.log
|   |   +-- act_dryrun.log
|   |   +-- actionlint.log
|   +-- docker/
|       +-- docker_build.log
|       +-- docker_health.json
+-- ci/
|   +-- .github/
|       +-- workflows/
|           +-- java.yml
|           +-- release.yml
+-- architecture/
|   +-- SYSTEM_ARCHITECTURE.md
|   +-- ADR_LOG.md
|   +-- DOMAIN_MODEL.md
|   +-- SPRING_CLOUD_CONFIG.md
+-- services/
|   +-- SERVICE_DESIGN.md
|   +-- API_ENDPOINTS.md
|   +-- CONFIGURATION.md
+-- database/
|   +-- SCHEMA_DESIGN.md
|   +-- MIGRATION_PLAN.md
|   +-- JPA_STRATEGY.md
|   +-- QUERY_OPTIMIZATION.md
+-- messaging/
|   +-- EVENT_ARCHITECTURE.md
|   +-- TOPIC_DESIGN.md
|   +-- SAGA_PATTERNS.md
|   +-- DLQ_STRATEGY.md
+-- security/
|   +-- SECURITY_ARCHITECTURE.md
|   +-- OAUTH2_CONFIG.md
|   +-- THREAT_MODEL.md
|   +-- API_SECURITY.md
+-- api-contracts/
|   +-- OPENAPI_SPEC.md
|   +-- VERSIONING_STRATEGY.md
|   +-- CONTRACT_TESTS.md
+-- qa/
|   +-- TEST_STRATEGY.md
|   +-- UNIT_TESTS.md
|   +-- INTEGRATION_TESTS.md
|   +-- CONTRACT_TESTS.md
|   +-- PERFORMANCE_TESTS.md
|   +-- SECURITY_SCAN.md
|   +-- QA_SIGNOFF.md
+-- releases/
|   +-- RELEASE_CHECKLIST.md
|   +-- CHANGELOG.md
|   +-- DEPLOYMENT_MANIFEST.md
|   +-- HELM_CHART.md
|   +-- MIGRATION_RUNBOOK.md
|   +-- ROLLBACK_PLAN.md
|   +-- RELEASE_NOTES.md
+-- marketing/
+-- legal/
```

---

## 15. REPORTING SYSTEM

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Reports include Java Spring-specific metrics: build time, test coverage (JaCoCo), API endpoint count, Kafka topic/partition status, JMH benchmark results, dependency vulnerability count, SonarQube quality gate status
- Final summary generated at project completion

### Enhanced Report Contents

Every PPTX and PDF report MUST include:

1. **Evidence Dashboard** -- count of evidence artifacts per agent, test pass rates, coverage percentages
2. **Commit Activity** -- commits per wave, per agent, with linked issue references
3. **Test Coverage Trend** -- JaCoCo line/branch coverage over time, per service module
4. **Security Scan Summary** -- SpotBugs findings count, OWASP CVE count (critical/high/medium), trend
5. **Performance Metrics** -- Gatling p99 latency, throughput, error rate vs SLA
6. **CI/CD Status** -- GitHub Actions workflow pass/fail, local `act` validation results across Java versions
7. **Kanban Velocity** -- cards moved per reporting period, blocked items by service

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Build failure**: Re-spawn SBE with Maven/Gradle error output, dependency tree, and compilation errors
- **Testcontainers failure**: Re-spawn QA with Docker daemon status, container logs, and port conflict details
- **Kafka connectivity failure**: Re-spawn MSG with broker logs, topic configuration, and consumer group state
- **JPA/Hibernate error**: Re-spawn DB with entity mapping details, SQL generated, and schema diff
- **Spring context failure**: Re-spawn SBE with application startup logs, bean resolution errors, and profile config

### Session Commands

| Command | Action |
|---------|--------|
| `--team javaSpring --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

*Java Spring Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 15 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Driven | Locally-Tested*
