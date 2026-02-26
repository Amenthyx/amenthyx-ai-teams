# Node.js Backend Team — Tailored Strategy v3.1

> Pre-configured for **Node.js/TypeScript backend services with NestJS, PostgreSQL, Redis, and Kubernetes**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team nodejs --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Node.js Backend Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: NestJS 10+ (primary) / Express / Fastify (alternative)
- **Database**: PostgreSQL 16 (primary) / MongoDB 7 (document store, if needed)
- **Cache**: Redis 7 (session, caching, pub/sub)
- **Message Queue**: BullMQ (Redis-backed job queues) / RabbitMQ (AMQP messaging)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (Lambda, ECS) / GCP (Cloud Run) / self-hosted — team's choice
- **Deployment**: Docker + Kubernetes (Helm charts) / AWS Lambda (serverless) / Docker Compose (staging)
- **CDN**: CloudFront / Cloudflare (for API gateway / static assets)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary data store | Connection string (env) | Pool max 50 (pg-pool) |
| Redis 7 | Cache + queue broker | AUTH token (env) | N/A |
| BullMQ | Job queue processing | Redis connection | Worker concurrency configurable |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm

**Monorepo or Polyrepo**: Single repo or monorepo with pnpm workspaces

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- API response time P95 < 100ms
- Throughput: 5,000 requests/second sustained
- Concurrent connections: 2,000 without degradation
- Event loop lag < 10ms (no blocking operations on main thread)

**Security**:
- Authentication: JWT (access + refresh tokens) with rotation
- Authorization: RBAC (role-based) via NestJS Guards + decorators
- Helmet.js: HTTP security headers (X-Content-Type-Options, X-Frame-Options, CSP, HSTS)
- Rate limiting: express-rate-limit / @nestjs/throttler
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 in transit, AES-256 at rest

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal scaling (K8s HPA / Lambda concurrency), PostgreSQL read replicas, Redis cluster, BullMQ worker scaling, connection pooling

**Availability**:
- Uptime target: 99.9%
- RTO: 30 minutes
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- API documentation: OpenAPI 3.0 (via @nestjs/swagger) with Swagger UI
- Health endpoints: NestJS Terminus (/health, /readiness, /liveness)
- Error responses: consistent JSON error format with correlation IDs

**Observability**:
- Logging: Pino (structured JSON, async) → ELK / Loki / CloudWatch
- Metrics: Prometheus (via prom-client / @willsoto/nestjs-prometheus) + Grafana
- Tracing: OpenTelemetry (@opentelemetry/sdk-node) → Jaeger / Tempo
- Alerting: Grafana Alerting / PagerDuty (error rate, latency, queue depth)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (services + controllers), >= 90% (critical business logic)

**Required Test Types**:
- [x] Unit tests (Vitest / Jest — services, guards, pipes, interceptors)
- [x] Integration tests (Supertest — API endpoints, database interactions, NestJS TestingModule)
- [x] E2E API tests (Playwright API testing / Supertest — full request lifecycle)
- [x] Load tests (k6 — throughput, latency, soak, stress scenarios)
- [x] Contract tests (OpenAPI schema validation — request/response contracts)
- [x] Database tests (Testcontainers — PostgreSQL integration, migration testing)
- [ ] Security tests (optional — OWASP ZAP API scan, dependency audit)
- [ ] Chaos engineering (optional — fault injection, circuit breaker validation)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint, Prettier, tsc --strict via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: Vitest / Jest, Supertest, k6, Testcontainers, NestJS Testing utilities, MSW, Pactum (API testing)

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
| AWS / GCP | Variable | Card | No — ask first |
| Redis Cloud (managed) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on services + controllers, >= 90% on critical logic
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E API tests pass for all P0 endpoints
- [ ] Performance targets met (P95 < 100ms, 5000 RPS, event loop lag < 10ms)
- [ ] Documentation complete (README, API docs via OpenAPI/Swagger, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds
- [ ] Database migrations are reversible and tested
- [ ] OpenAPI spec is in sync with implementation
- [ ] Health checks pass (/health, /readiness, /liveness)
- [ ] Zero npm audit critical/high vulnerabilities

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
| Event loop blocking (CPU-intensive operations) | M | H | Offload to worker threads (worker_threads) or separate microservice, monitor event loop lag in production |
| Memory leaks (closures, event listeners, streams) | M | H | Heap snapshots in CI, --max-old-space-size limits, LeakCanary-like monitoring, load test with soak scenarios |
| npm supply chain attacks (malicious packages) | L | H | Lock file pinning (pnpm-lock.yaml), npm audit in CI, Socket.dev or Snyk for dependency monitoring |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- TypeScript strict mode (`"strict": true`) across all code
- NestJS conventions followed (modules, providers, guards, pipes, interceptors)
- OpenAPI specification for all REST endpoints (auto-generated via @nestjs/swagger)
- Conventional commits enforced

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
- [x] Additional Backend Engineer (Node.js / NestJS / TypeScript)
- [x] Additional QA Engineer (Vitest, k6, Supertest)
- [x] Database Specialist (PostgreSQL optimization, query tuning, migration design)
- [x] Caching/Queue Specialist (Redis patterns, BullMQ job design, pub/sub)
- [x] DevOps Specialist (Docker, K8s, CI/CD, monitoring)
- [x] Security Specialist (OWASP, dependency audit, penetration testing)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Vitest/Jest coverage — HTML + lcov)
- [x] k6 load test results (summary JSON + HTML report)
- [x] OpenAPI specification (validated, auto-generated, up-to-date)
- [x] npm audit results (zero critical/high vulnerabilities)
- [x] Event loop lag metrics (production monitoring screenshot)
- [x] Database migration log (all migrations listed, rollback tested)
- [x] Health check verification (/health, /readiness, /liveness all passing)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Deployment log (production deployment evidence)
- [x] Architecture diagram (services, queues, data stores, deployment topology)

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
**Branch**: `ai-team` (MANDATORY — all teams use this branch)
**Merge to main**: ONLY after Team Leader receives explicit user approval (hard gate)

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

*Node.js Backend Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + NestJS + PostgreSQL + Redis backend services*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
