# Go Cloud-Native Team
# Activation: `--team goCloud`
# Focus: Go microservices, cloud-native applications, Kubernetes
# Version: 3.0 — Enhanced Execution Protocol

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Quality Gates](#7-quality-gates)
8. [Evidence & Proof Protocol](#8-evidence--proof-protocol)
9. [Local Install & Test Protocol](#9-local-install--test-protocol)
10. [Atomic Commit Protocol](#10-atomic-commit-protocol)
11. [Comprehensive Testing Matrix](#11-comprehensive-testing-matrix)
12. [GitHub Actions — Local Testing](#12-github-actions--local-testing)
13. [PM Kanban — Real-Time Tracking](#13-pm-kanban--real-time-tracking)
14. [`.team/` Directory Layout](#14-team-directory-layout)
15. [Reporting System](#15-reporting-system)
16. [Error Handling & Session Management](#16-error-handling--session-management)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team goCloud --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> — this becomes PROJECT STRATEGY
3. Read shared/ENHANCED_EXECUTION_PROTOCOL.md for shared protocols
4. Create `.team/` directory structure (see Section 14)
5. Spawn Team Leader agent (foreground — this is the orchestrator)
6. Team Leader spawns PM agent (foreground — must complete before others)
7. PM produces Project Charter + Initial Plan + creates GitHub Project
8. Team Leader reviews PM output, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, service boundaries, infrastructure requirements, and success criteria.

### Quick Reference — Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between service boundaries, infrastructure costs, and operational complexity. Ensures every deliverable has evidence artifacts.
- **Persona**: "You are the Team Leader of a 10-person Go cloud-native team. You coordinate all work, make final architectural decisions on service decomposition, API contracts, and infrastructure topology. You enforce quality gates including race detection, container security scans, and Kubernetes manifest validation. You require evidence (test output, build logs, pprof profiles) for every deliverable. You never write production code directly — you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management, real-time Kanban.
- **Persona**: "You are the Project Manager. You create all planning artifacts and manage the project via GitHub Projects V2 using `gh` CLI. You create milestones, issues with labels, and track progress in real time. You generate PPTX status presentations (with evidence: service counts, p99 latencies, SLO compliance) using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Cloud Architect (CLARC)
- **Role**: Service topology, cloud infrastructure design, cost modeling, disaster recovery.
- **Persona**: "You are the Cloud Architect. You design the overall service topology, define communication patterns (sync REST/gRPC vs async events), design the cloud infrastructure using Terraform, and model costs. You establish disaster recovery and multi-region strategies. You produce architecture documents in `.team/service-architecture/`."
- **Spawning**: Wave 2 (parallel)

### 2.4 Go Service Engineer (GSE)
- **Role**: Core Go microservice implementation, domain logic, testing.
- **Persona**: "You are the Go Service Engineer. You implement production-ready Go microservices following idiomatic Go patterns. You use the standard library extensively, Chi/Gin/Echo for HTTP, proper error handling with error wrapping, context propagation, graceful shutdown, and structured logging with slog. You write table-driven tests using testify. You produce service implementation specs in `.team/service-architecture/`."
- **Spawning**: Wave 2 (parallel)

### 2.5 API Gateway Engineer (APIGW)
- **Role**: API gateway, gRPC services, Protocol Buffers, service mesh.
- **Persona**: "You are the API Gateway Engineer. You design and implement API gateways, gRPC service definitions using Protocol Buffers, REST-to-gRPC transcoding, service mesh configuration, rate limiting, circuit breakers, and request routing. You produce API gateway designs in `.team/api-gateway/`."
- **Spawning**: Wave 2 (parallel)

### 2.6 Kubernetes Engineer (K8S)
- **Role**: Container orchestration, Helm charts, deployment strategies, autoscaling.
- **Persona**: "You are the Kubernetes Engineer. You design and implement Kubernetes manifests, Helm charts, deployment strategies (rolling, blue-green, canary), HPA/VPA autoscaling, resource limits, health probes (liveness, readiness, startup), network policies, and pod security standards. You produce K8s configurations in `.team/k8s-manifests/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 Observability Engineer (OBS)
- **Role**: Monitoring, logging, tracing, alerting, SLO/SLI definitions.
- **Persona**: "You are the Observability Engineer. You implement the observability stack: Prometheus metrics with custom collectors, Grafana dashboards, distributed tracing with OpenTelemetry, structured logging pipelines, alerting rules with escalation policies, SLO/SLI definitions, and runbooks. You produce observability configs in `.team/observability/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer — Cloud Testing (QA)
- **Role**: Testing strategy, integration testing, chaos engineering, load testing.
- **Persona**: "You are the QA Engineer specializing in cloud-native testing. You create test strategies covering `go test` unit tests, integration tests with testcontainers, contract tests for gRPC/REST, load tests with k6, chaos engineering scenarios, and container security scans with Trivy. You enforce minimum 80% coverage and produce QA sign-off documents with evidence artifacts in `.team/qa/`."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Release coordination, container image tagging, Helm chart versioning, deployment sign-off.
- **Persona**: "You are the Release Manager. You coordinate releases: release branches, semantic versioning, changelogs, container image tagging and signing, Helm chart versioning, deployment checklists for staging and production clusters, rollback plans with Helm rollback, and release notes. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: Service documentation, API portal, developer onboarding.
- **Persona**: "You are the Marketing Strategist. You create service documentation strategies, API portal concepts, developer onboarding guides, architecture decision records for public consumption, and internal adoption plans."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: Cloud compliance, data residency, security certifications.
- **Persona**: "You are the Legal/Compliance Attorney. You review for SOC 2 compliance requirements, GDPR data residency, HIPAA considerations, cloud provider agreements, container image licensing, open-source dependency licenses, and data processing agreements. You produce compliance checklists in `.team/legal/`."
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
            +-----------------+------------------+
            |                 |                  |
     +------v------+  +------v------+  +--------v--------+
     |     PM      |  | Marketing   |  |   Attorney      |
     | (Planning)  |  | (DevRel)    |  |   (Compliance)  |
     +------+------+  +-------------+  +-----------------+
            |
   +--------+--------+----------+-----------+
   |        |        |          |           |
+--v---+ +--v--+ +---v--+ +----v---+ +-----v---+
| CLARC| | GSE | | APIGW| |  K8S   | |  OBS    |
+--+---+ +--+--+ +---+--+ +----+---+ +-----+---+
   |        |        |          |           |
   +--------+--------+----------+-----------+
                     |
              +------v------+
              |     QA      |
              +------+------+
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
  description="PM: Project planning for Go cloud-native services",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan -> `.team/MILESTONES.md` (service design, core services, API gateway, K8s, observability, testing, deployment)
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
Task(subagent_type="general-purpose", description="MKT: Service documentation strategy", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: Cloud compliance review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 5 agents)
```
CLARC -> .team/service-architecture/ (SERVICE_TOPOLOGY.md, COMMUNICATION_PATTERNS.md, COST_MODEL.md, DR_PLAN.md)
GSE   -> .team/service-architecture/ (SERVICE_IMPL.md, ERROR_HANDLING.md, GRACEFUL_SHUTDOWN.md, LOGGING.md)
APIGW -> .team/api-gateway/          (GATEWAY_DESIGN.md, PROTO_DEFINITIONS.md, RATE_LIMITS.md, CIRCUIT_BREAKERS.md)
K8S   -> .team/k8s-manifests/        (DEPLOYMENTS.md, HELM_CHARTS.md, HPA_CONFIG.md, NETWORK_POLICIES.md)
OBS   -> .team/observability/        (METRICS_DESIGN.md, DASHBOARDS.md, TRACING.md, ALERTING_RULES.md, SLOS.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, TEST_CASES.md, LOAD_TEST_RESULTS.md, CHAOS_SCENARIOS.md, TRIVY_SCAN.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, ROLLBACK_PLAN.md, HELM_RELEASE.md, RELEASE_NOTES.md, DEPLOYMENT_SIGNOFF.md)
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

### Domain-Specific Milestones
1. **Service Architecture** -- topology designed, communication patterns defined, cost modeled
2. **Core Services** -- Go microservices implemented, tested, containerized
3. **API Gateway & gRPC** -- gateway configured, proto definitions finalized, transcoding operational
4. **Kubernetes Deployment** -- manifests validated, Helm charts tested, autoscaling configured
5. **Observability Stack** -- Prometheus metrics, Grafana dashboards, OpenTelemetry tracing live
6. **Load & Chaos Testing** -- k6 passing, chaos scenarios survived, Trivy clean
7. **Production Release** -- images signed, Helm deployed to production, runbooks published

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure
+-- Verify Go 1.22+, Docker, kubectl, helm, terraform available
+-- Run: go version && docker --version && kubectl version --client (capture as evidence)

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: service documentation, API portal, developer onboarding
+-- Attorney: SOC 2, GDPR data residency, cloud provider compliance
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- CLARC, GSE, APIGW, K8S, OBS -- all in parallel
+-- Each agent captures build/test evidence to .team/evidence/
+-- SYNC: TL waits for all 5 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF (include evidence artifacts)
+-- PM: Update GitHub issues (move cards in real time)
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: go test (unit + integration), k6 load tests, chaos scenarios
+-- QA: Trivy container scan, K8s manifest validation, gRPC contract tests
+-- QA: Capture all test output to .team/evidence/
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: checklist, changelog, rollback, Helm release, release notes
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF (with evidence summary)
+-- PM: close all GitHub milestones
+-- TL: present summary to user
```

---

## 7. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| **Evidence Gate** | Every task | Evidence artifact exists in `.team/evidence/` | Block task completion |
| **Install Gate** | After setup | `go build ./...` succeeds, `go mod tidy` clean | Fix go.mod / go.sum |
| Build Gate | After Engineering | `go build -race ./...` zero errors, `go vet ./...` clean | Re-spawn GSE |
| Unit Test Gate | After Engineering | `go test -race -cover ./...` passes, coverage >= 80% | Re-spawn GSE |
| Integration Test Gate | After QA | testcontainers-based integration tests pass | Enter Bug Fix Loop |
| Container Scan | After QA | Trivy scan: zero critical/high CVEs in all images | Re-spawn K8S to update base images |
| K8s Manifest Validation | After K8S | `kubectl --dry-run=server`, Helm lint, kubeconform pass | Re-spawn K8S |
| Load Test Gate | After QA | k6: p99 < 500ms, zero errors at 2x expected traffic | Re-spawn GSE/APIGW for optimization |
| **Lint Gate** | After Engineering | `golangci-lint run` zero issues | Re-spawn GSE |
| Observability Check | After OBS | All SLIs have dashboards, alerts configured, runbooks exist | Re-spawn OBS |
| **Secrets Gate** | Before commit | No API keys, tokens, credentials in staged files | Block commit, alert TL |
| **CI Gate** | Before release | `act` local CI run passes all workflow jobs | Fix workflow, re-run |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_SIGNOFF.md` approved | RM lists blocking items |

---

## 8. EVIDENCE & PROOF PROTOCOL

Every engineering deliverable MUST include verifiable evidence. No exceptions.

### Evidence Requirements by Role

| Role | Evidence Required | Format |
|------|-------------------|--------|
| CLARC | Architecture diagram, cost model output | `.md` / `.txt` |
| GSE | `go test -race -cover` output, `go vet` output, health check response | `.txt` logs |
| APIGW | Proto compilation output, gRPC health check, gateway test results | `.txt` / `.json` |
| K8S | `helm lint` output, `kubeconform` results, dry-run output | `.txt` logs |
| OBS | Prometheus scrape verification, alerting rule validation | `.txt` / `.yaml` |
| QA | Full test suite output, k6 summary, Trivy scan, coverage HTML | `.txt` / `.json` / `.html` |
| RM | Docker build log, `helm install --dry-run` output, image digest | `.txt` logs |

### Evidence Collection Commands
```bash
# Go test with race detection and coverage
go test -race -cover -coverprofile=coverage.out -v ./... 2>&1 | tee .team/evidence/go-test-output.txt

# Go vet
go vet ./... 2>&1 | tee .team/evidence/go-vet-output.txt

# golangci-lint
golangci-lint run ./... 2>&1 | tee .team/evidence/golangci-lint-output.txt

# Coverage report (HTML)
go tool cover -html=coverage.out -o .team/evidence/coverage.html

# Go build verification
go build -race ./... 2>&1 | tee .team/evidence/go-build-output.txt

# Docker build
docker build -t service:test . 2>&1 | tee .team/evidence/docker-build.txt

# Trivy container scan
trivy image service:test 2>&1 | tee .team/evidence/trivy-scan.txt

# Helm lint
helm lint ./helm/charts/* 2>&1 | tee .team/evidence/helm-lint.txt

# K8s dry-run
kubectl apply --dry-run=client -f k8s/ 2>&1 | tee .team/evidence/k8s-dryrun.txt

# k6 load test
k6 run --summary-export=.team/evidence/k6-summary.json load-tests/main.js 2>&1 | tee .team/evidence/k6-output.txt

# pprof profile capture
go tool pprof -text http://localhost:6060/debug/pprof/profile?seconds=10 > .team/evidence/pprof-cpu.txt 2>&1
```

### Evidence Naming Convention
```
.team/evidence/{wave}-{role}-{artifact}.{ext}
Example: w2-gse-go-test.txt, w3-qa-k6-summary.json, w2-k8s-helm-lint.txt
```

---

## 9. LOCAL INSTALL & TEST PROTOCOL

### Step 1: Environment Verification
```bash
# Verify Go toolchain
go version              # Must be >= 1.22
go env GOPATH           # Verify GOPATH is set

# Verify cloud-native tools
docker --version
kubectl version --client
helm version --short
terraform --version
golangci-lint --version

# Save environment evidence
{
  echo "Go: $(go version)"
  echo "Docker: $(docker --version)"
  echo "kubectl: $(kubectl version --client --short 2>/dev/null || kubectl version --client)"
  echo "Helm: $(helm version --short)"
  echo "Terraform: $(terraform --version | head -1)"
  echo "golangci-lint: $(golangci-lint --version 2>/dev/null || echo 'not installed')"
} > .team/evidence/env-versions.txt
```

### Step 2: Module Setup
```bash
# Initialize or verify Go module
go mod tidy 2>&1 | tee .team/evidence/go-mod-tidy.txt

# Download dependencies
go mod download 2>&1 | tee .team/evidence/go-mod-download.txt

# Verify no dependency issues
go mod verify 2>&1 | tee -a .team/evidence/go-mod-tidy.txt
```

### Step 3: Build Verification
```bash
# Build all packages with race detector
go build -race ./... 2>&1 | tee .team/evidence/go-build.txt

# Verify binary output
go build -o bin/service ./cmd/service/ 2>&1 | tee -a .team/evidence/go-build.txt
ls -lh bin/service >> .team/evidence/go-build.txt
echo "BUILD: PASS" >> .team/evidence/go-build.txt
```

### Step 4: Run Application
```bash
# Start service in background
./bin/service &
SVC_PID=$!
sleep 3

# Health check
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/healthz)
echo "Health check: $HTTP_STATUS" > .team/evidence/app-health.txt

# Readiness check
READY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/readyz)
echo "Readiness: $READY_STATUS" >> .team/evidence/app-health.txt

# Cleanup
kill $SVC_PID
```

### Step 5: Container Build & Verify
```bash
# Build Docker image
docker build -t service:test . 2>&1 | tee .team/evidence/docker-build.txt

# Run container
docker run -d --name test-svc -p 8081:8080 service:test
sleep 3

# Container health check
curl -s http://localhost:8081/healthz | tee .team/evidence/container-health.txt

# Trivy scan
trivy image --severity HIGH,CRITICAL service:test 2>&1 | tee .team/evidence/trivy-scan.txt

# Cleanup
docker stop test-svc && docker rm test-svc
```

### Step 6: pprof Profiling
```bash
# Start service with pprof enabled
PPROF_ENABLED=true ./bin/service &
SVC_PID=$!
sleep 3

# CPU profile
go tool pprof -text http://localhost:6060/debug/pprof/profile?seconds=10 > .team/evidence/pprof-cpu.txt 2>&1

# Memory profile
go tool pprof -text http://localhost:6060/debug/pprof/heap > .team/evidence/pprof-heap.txt 2>&1

# Goroutine count
curl -s http://localhost:6060/debug/pprof/goroutine?debug=1 | head -5 > .team/evidence/goroutine-count.txt

kill $SVC_PID
```

---

## 10. ATOMIC COMMIT PROTOCOL

### Commit Convention
All commits follow Conventional Commits with scope tracking:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
PM-TASK: <github-issue-number>
```

### Types
| Type | Usage |
|------|-------|
| `feat` | New service, endpoint, gRPC method, K8s resource |
| `fix` | Bug fix, race condition fix, memory leak fix |
| `test` | Test-only changes (new tests, test fixtures) |
| `refactor` | Code cleanup, interface simplification |
| `chore` | Config, go.mod updates, Helm values |
| `docs` | Documentation, proto comments, runbooks |
| `perf` | Performance improvement with pprof evidence |
| `infra` | Kubernetes manifests, Terraform, Docker changes |

### Scopes
```
svc, api, grpc, k8s, helm, obs, docker, terraform, ci, docs
```

### Commit Flow
```bash
# 1. Stage specific files (NEVER git add . or git add -A)
git add internal/users/handler.go
git add internal/users/handler_test.go

# 2. Run pre-commit checks
go vet ./...
golangci-lint run ./...
go test -race ./...

# 3. Commit with PM task reference
git commit -m "feat(svc): add user service with CRUD operations

- Implement UserHandler with Create, Get, List, Update, Delete
- Table-driven tests with testify (92% coverage)
- Structured logging with slog
- Graceful shutdown with context cancellation

PM-TASK: #23"

# 4. PM updates GitHub issue
gh issue comment 23 --body "Commit $(git rev-parse --short HEAD): User service implemented. Evidence: .team/evidence/w2-gse-go-test.txt"
```

### Pre-Commit Checks
```bash
# Automated pre-commit (TL enforces)
go fmt ./...                     # Formatting
go vet ./...                     # Static analysis
golangci-lint run ./...          # Comprehensive linting
go test -race ./...              # Tests with race detector
# Verify no secrets in staged files
git diff --cached --name-only | xargs grep -l 'API_KEY\|SECRET\|PASSWORD\|TOKEN' && echo "BLOCKED: Secrets detected" && exit 1
```

---

## 11. COMPREHENSIVE TESTING MATRIX

### Unit Tests (go test)
```bash
# Run all tests with race detector and coverage
go test -race -cover -coverprofile=coverage.out -v ./...

# Coverage threshold: 80% minimum
go tool cover -func=coverage.out | grep total | awk '{print $3}'
```

| Layer | What to Test | Tools |
|-------|-------------|-------|
| Handlers | HTTP routing, status codes, request parsing | `net/http/httptest`, testify |
| Services | Business logic, error wrapping, edge cases | testify, table-driven |
| Repositories | Database queries (with testcontainers) | testcontainers-go, pgx |
| gRPC | Proto serialization, interceptors, streaming | `google.golang.org/grpc/test` |
| Middleware | Auth, logging, rate limiting, recovery | `net/http/httptest` |
| Config | Environment parsing, validation, defaults | testify |

### Integration Tests (testcontainers-go)
```bash
# Run integration tests (requires Docker)
go test -race -tags=integration -v ./tests/integration/...

# Example: Database integration test with testcontainers
func TestUserRepository_Create(t *testing.T) {
    ctx := context.Background()
    pgContainer, _ := postgres.RunContainer(ctx,
        testcontainers.WithImage("postgres:16"),
    )
    defer pgContainer.Terminate(ctx)
    // ... test against real PostgreSQL
}
```

### Load Tests (k6)
```bash
# Run k6 load test
k6 run --vus 100 --duration 60s load-tests/api.js 2>&1 | tee .team/evidence/k6-output.txt

# Thresholds
thresholds: {
  http_req_duration: ['p(99)<500'],
  http_req_failed: ['rate<0.01'],
  http_reqs: ['rate>200'],
}
```

### gRPC Contract Tests
```bash
# Proto compilation check
buf lint proto/ 2>&1 | tee .team/evidence/buf-lint.txt
buf breaking --against '.git#branch=main' 2>&1 | tee .team/evidence/buf-breaking.txt

# gRPC health check
grpcurl -plaintext localhost:50051 grpc.health.v1.Health/Check 2>&1 | tee .team/evidence/grpc-health.txt
```

### Container Security (Trivy)
```bash
# Scan all images
for img in service-a service-b gateway; do
  trivy image --severity HIGH,CRITICAL ${img}:test 2>&1 | tee .team/evidence/trivy-${img}.txt
done
```

### Kubernetes Validation
```bash
# Helm lint all charts
helm lint ./helm/charts/* 2>&1 | tee .team/evidence/helm-lint.txt

# kubeconform validation
kubeconform -summary -strict k8s/ 2>&1 | tee .team/evidence/kubeconform.txt

# Dry-run apply
kubectl apply --dry-run=client -f k8s/ 2>&1 | tee .team/evidence/k8s-dryrun.txt
```

---

## 12. GITHUB ACTIONS -- LOCAL TESTING

### Install `act` for Local CI
```bash
# Install act (GitHub Actions local runner)
# macOS
brew install act

# Windows (scoop)
scoop install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### Go Cloud-Native CI Workflow (`.github/workflows/ci.yml`)
```yaml
name: Go Cloud-Native CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: go mod download
      - run: go vet ./...
      - run: golangci-lint run ./...
      - run: go test -race -cover -coverprofile=coverage.out ./...
      - run: go tool cover -func=coverage.out | grep total

  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t service:ci .
      - run: trivy image --exit-code 1 --severity CRITICAL service:ci

  helm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/setup-helm@v3
      - run: helm lint ./helm/charts/*
      - run: |
          curl -sL https://github.com/yannh/kubeconform/releases/latest/download/kubeconform-linux-amd64.tar.gz | tar xz
          ./kubeconform -summary -strict k8s/
```

### Run Locally with `act`
```bash
# Run full CI
act push 2>&1 | tee .team/evidence/act-ci-output.txt

# Run specific job
act push -j test 2>&1 | tee .team/evidence/act-test-output.txt
act push -j helm 2>&1 | tee .team/evidence/act-helm-output.txt

# Verify result
grep -q "Job succeeded" .team/evidence/act-ci-output.txt && echo "CI: PASS" || echo "CI: FAIL"
```

---

## 13. PM KANBAN -- REAL-TIME TRACKING

### GitHub Projects V2 Setup
```bash
# Create project board
gh project create --title "Go Cloud-Native - $(date +%Y-%m-%d)" --owner @me

# Add custom fields
gh project field-create <PROJECT_ID> --name "Wave" --data-type "SINGLE_SELECT" \
  --single-select-options "Wave 1,Wave 1.5,Wave 2,Wave 2.5,Wave 3,Wave 4,Wave 5"

gh project field-create <PROJECT_ID> --name "Evidence" --data-type "TEXT"
gh project field-create <PROJECT_ID> --name "Test Coverage" --data-type "NUMBER"
gh project field-create <PROJECT_ID> --name "p99 Latency (ms)" --data-type "NUMBER"
gh project field-create <PROJECT_ID> --name "CVE Count" --data-type "NUMBER"
```

### Real-Time Updates
PM updates issue status as work progresses:
```bash
# Move task to In Progress
gh issue edit <NUMBER> --add-label "status:in-progress" --remove-label "status:todo"

# Move task to Done with evidence
gh issue comment <NUMBER> --body "DONE. Coverage: $(go tool cover -func=coverage.out | grep total | awk '{print $3}'). Evidence: .team/evidence/w2-gse-go-test.txt"
gh issue edit <NUMBER> --add-label "status:done" --remove-label "status:in-progress"

# Track p99 latency
gh project item-edit --project-id <PROJECT_ID> --id <ITEM_ID> --field-id <LATENCY_FIELD_ID> --number 145
```

### Kanban Columns
| Column | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| Backlog | Issue created with labels | Assigned to wave |
| Todo | Assigned to agent in current wave | Agent starts work |
| In Progress | Agent actively working | Deliverable + evidence complete |
| In Review | Evidence submitted, vet/lint clean | TL reviews and approves evidence |
| Done | TL approved, race-free, evidence verified | Issue closed |

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
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- env-versions.txt
|   +-- go-test-output.txt
|   +-- go-vet-output.txt
|   +-- golangci-lint-output.txt
|   +-- coverage.html
|   +-- docker-build.txt
|   +-- trivy-scan.txt
|   +-- helm-lint.txt
|   +-- k8s-dryrun.txt
|   +-- k6-summary.json
|   +-- pprof-cpu.txt
|   +-- pprof-heap.txt
|   +-- act-ci-output.txt
+-- ci/
|   +-- .github/workflows/ci.yml
|   +-- act-results/
|   +-- CI_VALIDATION.md
+-- service-architecture/
|   +-- SERVICE_TOPOLOGY.md
|   +-- COMMUNICATION_PATTERNS.md
|   +-- COST_MODEL.md
|   +-- DR_PLAN.md
|   +-- SERVICE_IMPL.md
|   +-- ERROR_HANDLING.md
|   +-- GRACEFUL_SHUTDOWN.md
|   +-- LOGGING.md
+-- api-gateway/
|   +-- GATEWAY_DESIGN.md
|   +-- PROTO_DEFINITIONS.md
|   +-- RATE_LIMITS.md
|   +-- CIRCUIT_BREAKERS.md
+-- k8s-manifests/
|   +-- DEPLOYMENTS.md
|   +-- HELM_CHARTS.md
|   +-- HPA_CONFIG.md
|   +-- NETWORK_POLICIES.md
+-- observability/
|   +-- METRICS_DESIGN.md
|   +-- DASHBOARDS.md
|   +-- TRACING.md
|   +-- ALERTING_RULES.md
|   +-- SLOS.md
+-- terraform/
|   +-- INFRA_MODULES.md
|   +-- STATE_MANAGEMENT.md
|   +-- ENVIRONMENTS.md
+-- qa/
|   +-- TEST_STRATEGY.md
|   +-- TEST_CASES.md
|   +-- LOAD_TEST_RESULTS.md
|   +-- CHAOS_SCENARIOS.md
|   +-- TRIVY_SCAN.md
|   +-- QA_SIGNOFF.md
+-- releases/
+-- marketing/
+-- legal/
```

---

## 15. REPORTING SYSTEM

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
  - Includes evidence: service count, pod replica status, p99 latencies, coverage percentages
  - Slide for each completed task with commit hash and evidence reference
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
  - Test coverage trends, Trivy scan summaries, k6 load test graphs
  - Per-agent task completion with evidence links
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion
- Reports include service count, pod replica status, p99 latencies, error budgets, SLO compliance, infrastructure costs, and container image sizes

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Recovery
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Container build failure**: Capture Docker build error output, inject into K8S/GSE re-spawn prompt
- **K8s deployment failure**: Capture kubectl/helm error, escalate to K8S and CLARC, run `helm rollback` if needed
- **Race condition detected**: Capture `go test -race` output, inject into GSE re-spawn prompt with race trace
- **golangci-lint failure**: Capture lint output, provide specific fix suggestions in re-spawn prompt

### Session Commands

| Command | Action |
|---------|--------|
| `--team goCloud --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

*Go Cloud-Native Team v3.0 -- Amenthyx AI Teams*
*10 Roles | 5 Waves | 15 Gates | Evidence-Driven | Strategy-Driven | GitHub-Integrated*
*Enhanced: Evidence Protocol | Local Install | Atomic Commits | Testing Matrix | Local CI | Real-Time Kanban*
