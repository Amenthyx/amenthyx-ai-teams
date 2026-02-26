# Python Data Team — Tailored Strategy v3.1

> Pre-configured for **Python data pipelines, FastAPI/Django backends, and analytical workloads with PostgreSQL and DuckDB**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team pythonData --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Python Data Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+
- **Framework**: FastAPI (async API) / Django 5 (full-featured web) — team's choice per project
- **Database**: PostgreSQL 16 (transactional) / DuckDB (analytical, embedded OLAP)
- **Cache**: Redis 7
- **Message Queue**: Celery + Redis (or RabbitMQ) for async task processing

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / self-hosted — team's choice
- **Deployment**: Docker + Kubernetes / serverless (AWS Lambda, GCP Cloud Run)
- **CDN**: CloudFront / Cloud CDN (if serving static assets)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary transactional store | Connection string (env) | Connection pool max 50 |
| Redis 7 | Caching + Celery broker | AUTH token (env) | N/A |
| DuckDB | Analytical queries | Embedded (file-based) | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: poetry / uv

**Monorepo or Polyrepo**: Single repo (src layout: `src/<package_name>/`)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- API response time P95 < 200ms
- Data pipeline throughput: [FILL IN: records/sec or "TBD"]
- Data freshness: [FILL IN: real-time / minutes / hourly / daily]
- Query response time P95 < 500ms (analytical queries)

**Security**:
- Authentication: OAuth2 / JWT (FastAPI Security / Django Auth)
- Authorization: RBAC (role-based access to data and endpoints)
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 in transit, AES-256 at rest, data governance policies for PII
- Data access control: Row-level security (PostgreSQL RLS) where applicable

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal scaling (K8s HPA), Celery worker autoscaling, read replicas for PostgreSQL, DuckDB for analytical offloading

**Availability**:
- Uptime target: 99.9%
- RTO: 1 hour
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- API documentation: OpenAPI / Swagger UI auto-generated
- CLI tools: clear --help output, sensible defaults
- Data outputs: well-documented schemas, data dictionaries

**Observability**:
- Logging: structlog (structured JSON) → centralized log aggregation
- Metrics: Prometheus (via prometheus-client) + Grafana dashboards
- Tracing: OpenTelemetry (distributed traces across services and pipelines)
- Alerting: Grafana Alerting / PagerDuty for pipeline failures and SLA breaches

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (business logic + API), >= 90% (data pipeline critical paths)

**Required Test Types**:
- [x] Unit tests (pytest — functions, services, data transformations)
- [x] Integration tests (pytest + httpx — API endpoints, database interactions)
- [x] Data validation tests (Great Expectations / Pandera — schema, quality checks)
- [x] Pipeline tests (pytest — end-to-end pipeline runs with sample data)
- [x] Load tests (locust — API throughput, concurrent request handling)
- [x] Type checking (mypy --strict — full type safety)
- [ ] Property-based tests (optional — Hypothesis for edge cases)
- [ ] Data contract tests (optional — schema evolution validation)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ruff check, ruff format, mypy --strict via pre-commit framework)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: pytest, pytest-cov, pytest-asyncio, httpx (async test client), locust, mypy, ruff, Great Expectations / Pandera, testcontainers-python

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
| Data source APIs | Variable | Card / API credits | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on business logic, >= 90% on pipeline critical paths
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 API flows and data pipelines
- [ ] Performance targets met (API P95 < 200ms, pipeline throughput as specified)
- [ ] Documentation complete (README, API docs via OpenAPI, data dictionary, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds
- [ ] mypy --strict passes with zero errors
- [ ] ruff check passes with zero violations
- [ ] Database migrations are reversible and tested

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
| Dependency conflicts (Python packaging) | M | M | Use poetry/uv lock files, pin versions, test upgrades in isolation |
| Data pipeline failures (source schema changes, data quality) | M | H | Data validation gates (Great Expectations), retry mechanisms, alerting on pipeline failures, dead-letter queues |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Type hints mandatory on all functions (mypy --strict enforced)
- ruff check + ruff format clean before every commit
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
- [x] Additional Backend Engineer (Python, FastAPI/Django)
- [x] Additional Data Engineer (pipelines, ETL, DuckDB, SQL)
- [x] Additional QA Engineer (pytest, data validation, load testing)
- [x] Database Specialist (PostgreSQL optimization, schema design, migrations)
- [x] DevOps Specialist (Docker, K8s, CI/CD, monitoring)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (pytest-cov — HTML + XML)
- [x] mypy type check results (zero errors)
- [x] ruff lint results (zero violations)
- [x] Locust load test results (summary + charts)
- [x] Data validation report (Great Expectations / Pandera — all suites passing)
- [x] OpenAPI specification (validated, up-to-date)
- [x] Security scan results (pip-audit / safety, dependency vulnerability check)
- [x] Database migration log (Alembic / Django migrations listed, rollback verified)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (services, data flow, pipeline DAG)

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
**Branch**: `team/pythonData/execution`
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

*Python Data Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python 3.12 + FastAPI/Django + PostgreSQL + DuckDB data pipelines and backends*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
