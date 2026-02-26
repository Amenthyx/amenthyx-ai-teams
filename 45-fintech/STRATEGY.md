# FinTech Team — Tailored Strategy v3.1

> Pre-configured for **payments, banking integrations, trading, and risk analysis with Spring Boot, NestJS, PostgreSQL, and Kafka**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team fintech --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for FinTech Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (frontend + Node.js services), Java 21 (core financial engine), Python 3.12+ (risk models, analytics)
- **Framework**: Spring Boot 3.x (Java services) / NestJS (TypeScript services) / FastAPI (Python analytics)
- **Database**: PostgreSQL 16 (primary — ACID transactions) + TimescaleDB (time-series financial data)
- **Cache**: Redis 7 (session, rate limiting, idempotency keys)
- **Queue**: Kafka (event streaming, transaction events, audit trail)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP — team's choice (PCI-DSS compliant environment)
- **Deployment**: Docker + Kubernetes (all services) with strict network policies
- **CDN**: CloudFront / Cloud CDN for static assets
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary data store | Connection string (env) | Connection pool max 50 |
| TimescaleDB | Time-series financial data | Connection string (env) | Connection pool max 30 |
| Redis 7 | Cache + idempotency | AUTH token (env) | N/A |
| Kafka | Event streaming + audit | SASL/SCRAM (env) | Partition-based |
| Payment Gateway (Stripe/Adyen) | Payment processing | API key (env) | Per plan |
| Banking API (Plaid/Tink) | Account connectivity | OAuth2 + API key | Per plan |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm (TypeScript) / Gradle (Java) / poetry (Python)

**Monorepo or Polyrepo**: Monorepo (Turborepo for TypeScript, multi-module Gradle for Java)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- API response time P95 < 200ms (non-payment), P95 < 500ms (payment processing)
- Transaction throughput: 500 TPS sustained
- Concurrent users: 1,000 without degradation
- Time-series query performance: < 1s for 1-year lookback

**Security**:
- Authentication: OAuth2 + JWT (access + refresh), MFA mandatory for financial operations
- Authorization: RBAC with fine-grained permissions (transaction limits, account access)
- Data sensitivity: PII + financial data (highest sensitivity)
- Compliance: PCI-DSS Level 1, SOC 2 Type II
- Encryption: AES-256 at rest, TLS 1.3 in transit, tokenization for card data (via payment gateway)
- Key management: AWS KMS / GCP Cloud KMS, no plaintext secrets ever
- WAF: Web Application Firewall for all public endpoints

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal pod autoscaling (K8s HPA), PostgreSQL read replicas, Kafka partition scaling, Redis cluster

**Availability**:
- Uptime target: 99.99% (payment processing), 99.9% (other services)
- RTO: 15 minutes
- RPO: 0 (zero data loss for financial transactions)
- Multi-region: [FILL IN: yes / no / future — recommended for 99.99%]

**Accessibility**:
- WCAG 2.1 AA compliance for customer-facing UI
- Screen reader compatible (aria attributes)
- Keyboard navigation support
- i18n-ready with multi-currency support

**Observability**:
- Logging: Structured JSON logs with correlation IDs, PII masking in all log output
- Metrics: Prometheus (transaction rates, payment success/failure, latency, Kafka lag)
- Tracing: OpenTelemetry (distributed traces across all services, payment flow tracing)
- Alerting: PagerDuty integration for P1 alerts, Grafana for dashboards
- Audit: Immutable audit log for every financial transaction (Kafka topic + cold storage)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 90% line coverage (financial engine), >= 80% (API layer), >= 70% (frontend)

**Required Test Types**:
- [x] Unit tests (JUnit 5 / Vitest / pytest — business logic, calculations)
- [x] Integration tests (Testcontainers — database, Kafka, Redis interactions)
- [x] End-to-end tests (Playwright — critical financial flows: onboarding, payment, transfer)
- [x] Double-entry bookkeeping tests (ledger balance verification, trial balance)
- [x] Idempotency tests (duplicate payment requests produce same result)
- [x] Concurrency tests (race condition detection in concurrent transactions)
- [x] Compliance tests (PCI-DSS automated checks, SOC 2 control validation)
- [x] Security tests (OWASP ZAP scan, dependency audit, penetration test framework)
- [x] Load tests (k6 — payment flow under load, Kafka consumer lag)
- [ ] Chaos engineering (optional but recommended — payment service failure recovery)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint, Prettier, checkstyle for Java, black for Python)
- [x] Branch protection (require 2 PR reviews for financial logic, passing CI)
- [x] Security scanning in CI (Snyk, OWASP dependency check, secret scanning)
- [ ] Automated compliance validation on PR
- [ ] Staging environment with synthetic financial data

**Testing Tools**: JUnit 5, Vitest, pytest, Playwright, Testcontainers, k6, OWASP ZAP, Snyk, custom ledger validators

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
| AWS/GCP (PCI-compliant) | Variable (high) | Card | No — ask first |
| Stripe / Adyen | Transaction-based | Card | No — ask first |
| Plaid / Tink | Per-connection | Card | No — ask first |
| PagerDuty | ~$21/user/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 90% financial engine coverage, >= 80% API coverage, >= 70% frontend coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] PCI-DSS compliance validated
- [ ] Double-entry bookkeeping verified (trial balance always balances)
- [ ] Idempotent transaction processing verified
- [ ] Payment flow E2E tests pass under load (500 TPS)
- [ ] Audit trail complete and immutable
- [ ] Documentation complete (README, API docs, compliance documentation, runbook)
- [ ] CI/CD pipeline tested and working with security scanning
- [ ] Disaster recovery tested (failover, data restore)
- [ ] All environment variables documented in .env.example

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
| Payment gateway outage causing transaction failures | M | H | Multi-gateway failover, retry with idempotency keys, queue-based resilience |
| Regulatory changes requiring rapid compliance updates | M | H | Modular compliance layer, legal monitoring, feature flags for regulation-specific logic |
| Data breach exposing financial/PII data | L | H | PCI-DSS compliance, encryption everywhere, WAF, penetration testing, incident response plan |
| Double-spend or race condition in concurrent transactions | M | H | Optimistic locking, idempotency keys, serializable transaction isolation, extensive concurrency testing |
| Audit trail gap causing compliance failure | L | H | Kafka-based immutable audit log, log completeness monitoring, automated compliance checks |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Audit trail mandatory: every financial transaction must be logged immutably
- Double-entry bookkeeping: ledger must always balance, trial balance verified on every deployment
- Idempotent transactions: every payment/transfer endpoint must be idempotent
- Regulatory compliance: PCI-DSS Level 1, SOC 2 — no exceptions
- Zero plaintext secrets: all credentials via KMS/vault, never in code or logs

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
- [x] Additional Backend Engineer (Spring Boot / NestJS financial services)
- [x] Additional Frontend Engineer (React / Next.js financial UI)
- [x] Additional Payment Engineer (gateway integration, tokenization)
- [x] Additional Risk/Compliance Engineer (PCI-DSS, SOC 2, fraud detection)
- [x] Database Specialist (PostgreSQL optimization, TimescaleDB, migration design)
- [x] Security Specialist (penetration testing, WAF configuration, encryption)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (JUnit + Vitest + pytest coverage — HTML + lcov)
- [x] Playwright E2E test results (financial flow HTML report)
- [x] k6 load test results (payment flow under load — summary JSON + HTML)
- [x] Double-entry ledger verification (trial balance proof)
- [x] Idempotency test results (duplicate request handling proof)
- [x] Security scan results (OWASP ZAP, Snyk, dependency audit)
- [x] PCI-DSS compliance checklist (self-assessment or SAQ)
- [x] Audit trail sample (Kafka messages demonstrating immutable logging)
- [x] CI/CD pipeline screenshot (all checks green, security scans passing)
- [x] Architecture diagram (service topology, payment flow, data flow, security zones)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove (regulatory requirement)
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Financial records**: ALL transaction records retained per regulatory requirements (7+ years)
- **Audit logs**: NEVER delete or modify audit log entries

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/fintech/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (ledger proofs, compliance, security scans)
- [x] Source code changes (services, migrations, tests)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*FinTech Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + Java + Python + Spring Boot + NestJS + PostgreSQL + Kafka financial technology*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
