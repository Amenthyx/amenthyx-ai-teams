# Go Cloud-Native Team — Tailored Strategy v3.1

> Pre-configured for **Go microservices and cloud-native development with Kubernetes, NATS/Kafka, and PostgreSQL**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team goCloud --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]
**One-Line Vision**: [FILL IN]
**Problem Statement**: [FILL IN]
**Desired Outcome**: [FILL IN]
**Project Type**: [FILL IN: Greenfield / Extending / Migration / Rewrite / Prototype / MVP / Production]
**Repository**: [FILL IN: GitHub URL or desired repo name]

---

## 2. Target Audience

**Primary Users**: [FILL IN]
**Secondary Users**: [FILL IN]

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [Job title] | [Top 3] | [Goals] | [Low/Med/High] |
| [FILL IN] | [Job title] | [Top 3] | [Goals] | [Low/Med/High] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|--------------------|----|
| 1 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |
| 2 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |
| 3 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |

### P1 — Should-Have
| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|--------------------|----|
| 1 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |

### P2 — Nice-to-Have
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [What it does] |

---

## 4. Technical Constraints *(pre-configured for Go Cloud-Native Team)*

**Required Tech Stack**:
- **Language**: Go 1.22+
- **Framework**: Gin / Echo / Chi (HTTP routers) + stdlib net/http (standard library preferred where possible)
- **Database**: PostgreSQL 16 (primary) / CockroachDB (distributed SQL alternative)
- **Cache**: Redis 7
- **Message Queue**: NATS (lightweight, cloud-native) / Apache Kafka (event streaming at scale)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (EKS) / GCP (GKE) / Azure (AKS) — team's choice
- **Deployment**: Docker + Kubernetes (Helm charts) — cloud-native first
- **CDN**: CloudFront / Cloud CDN (if serving static assets)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary data store | Connection string (env) | Pool max 50 (pgxpool) |
| Redis 7 | Distributed cache | AUTH token (env) | N/A |
| NATS / Kafka | Service messaging | Token / mTLS | Partition/subject-dependent |
| Kubernetes API | Service discovery, scaling | ServiceAccount / RBAC | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: go mod (go.mod + go.sum)

**Monorepo or Polyrepo**: Monorepo (Go workspaces) or polyrepo per service

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Latency P99 < 10ms (service-to-service)
- Throughput: 10,000 requests/second per service instance
- Concurrent connections: 5,000 per instance without degradation
- Memory footprint: < 50 MB RSS per service (idle)

**Security**:
- Authentication: OAuth2 / JWT (middleware-based)
- Authorization: RBAC (custom middleware)
- Service-to-service: mTLS (mutual TLS) via service mesh (Istio/Linkerd) or direct
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 in transit, AES-256 at rest

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Kubernetes HPA (CPU/memory-based + custom metrics), NATS/Kafka consumer scaling, PostgreSQL read replicas, Redis cluster, 12-factor app principles

**Availability**:
- Uptime target: 99.99%
- RTO: 1 minute (Go services restart in milliseconds)
- RPO: 0 (stateless services) or domain-specific
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- API documentation: OpenAPI 3.0 (via swaggo/swag or oapi-codegen) with Swagger UI
- Health endpoints: /healthz (liveness), /readyz (readiness), /metrics (Prometheus)
- CLI tools: cobra-based with --help, shell completions

**Observability**:
- Logging: zerolog / zap (structured JSON, zero-allocation) → ELK / Loki
- Metrics: Prometheus (via promhttp) + Grafana dashboards
- Tracing: OpenTelemetry (otel-go) → Jaeger / Tempo
- Alerting: Grafana Alerting / PagerDuty (SLA-based, per-service)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (business logic), >= 70% (handlers/middleware)

**Required Test Types**:
- [x] Unit tests (go test — functions, services, domain logic)
- [x] Integration tests (go test + testcontainers-go — database, cache, message queue)
- [x] Table-driven tests (Go convention — comprehensive input/output matrices)
- [x] Benchmark tests (go test -bench — performance regression detection)
- [x] Load tests (k6 — HTTP throughput, latency, soak, stress)
- [x] Lint check (golangci-lint — comprehensive static analysis)
- [x] Race detection (go test -race — zero data races)
- [ ] Fuzz tests (optional — go test -fuzz for parsers and serialization)
- [ ] Contract tests (optional — Pact for service-to-service contracts)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (golangci-lint, gofumpt via pre-commit framework)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop (Helm + ArgoCD)
- [ ] Manual approval gate for production deployment

**Testing Tools**: go test, testify, gomock / mockgen, testcontainers-go, k6, golangci-lint, go tool cover

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN: date or "flexible"]

**Milestones**:
| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |
| M2 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |
| M3 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |

**Budget Constraints**:
- Infrastructure: [FILL IN: $/month or "minimize"]
- Third-party APIs: [FILL IN: $/month or "free tier only"]
- Domains/SSL: [FILL IN: $ or "already owned"]

---

## 7.1 Cost Approval & Payment Governance *(pre-configured)*

**Token Budget Tolerance**: [FILL IN: e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 (always ask — recommended)
- **Requires explicit approval**: All card payments, subscriptions, purchases
- **Forbidden without user present**: Any recurring subscription, any payment > $50

**External Service Payments**:
| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| AWS / GCP / Azure (K8s) | Variable | Card | No — ask first |
| NATS (managed — Synadia) | Variable | Card | No — ask first |
| Kafka (managed — Confluent) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on business logic (go tool cover)
- [ ] Zero CRITICAL/HIGH security vulnerabilities (govulncheck clean)
- [ ] E2E tests pass for all P0 flows
- [ ] Performance targets met (P99 < 10ms, 10K RPS, < 50 MB RSS)
- [ ] Documentation complete (README, API docs via OpenAPI, setup guide, Helm chart docs)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to Kubernetes succeeds (Helm install/upgrade)
- [ ] golangci-lint clean (zero issues)
- [ ] go test -race clean (zero data races)
- [ ] Health checks pass (/healthz, /readyz, /metrics)
- [ ] Helm chart values documented and templated
- [ ] 12-factor app principles verified

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [Target] | [Method] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [Good aspects] | [Bad aspects] |

**Design Inspiration**: [FILL IN]

**Technical References**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building**:
1. [FILL IN]
2. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Go generics limitations (less expressive than other languages) | L | M | Use interfaces + type assertions where generics fall short, keep generics usage simple and well-tested |
| Service mesh complexity (Istio/Linkerd operational overhead) | M | M | Start with direct mTLS, evaluate service mesh incrementally, ensure team has K8s expertise |
| Kubernetes configuration drift | M | M | GitOps (ArgoCD/Flux), Helm chart versioning, infrastructure-as-code, drift detection alerts |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Go conventions followed (Effective Go, Go Code Review Comments)
- golangci-lint clean (comprehensive linter set)
- Conventional commits enforced
- 12-factor app principles

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 blocking bugs

**Agent types the PM may add**:
- [x] Additional Backend Engineer (Go, microservices)
- [x] Additional DevOps Engineer (Kubernetes, Helm, ArgoCD, CI/CD)
- [x] Additional QA Engineer (go test, k6, testcontainers)
- [x] Kubernetes Specialist (networking, RBAC, resource tuning, service mesh)
- [x] Performance Specialist (pprof profiling, benchmark analysis, memory optimization)
- [x] Database Specialist (PostgreSQL, CockroachDB, migration design)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (go tool cover — HTML + func output)
- [x] Benchmark results (go test -bench — comparison with baseline)
- [x] golangci-lint results (zero issues)
- [x] go test -race results (zero data races)
- [x] govulncheck results (zero known vulnerabilities)
- [x] k6 load test results (summary + HTML report)
- [x] OpenAPI specification (validated, up-to-date)
- [x] Helm chart validation (helm lint + helm template dry-run)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (service topology, K8s deployment, messaging flows, data stores)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/goCloud/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Go Cloud-Native Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Go 1.22 + Kubernetes + NATS/Kafka + PostgreSQL cloud-native microservices*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
