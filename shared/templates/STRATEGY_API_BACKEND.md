# Project Strategy Brief v3.3

> Pre-built strategy template for a REST/GraphQL API backend with strict compliance requirements.
> Copy this file, customize to your needs, and pass it with `--strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: PayGate

**One-Line Vision**: A PCI-DSS compliant payment processing API that enables merchants to accept payments, manage subscriptions, and receive real-time webhook notifications.

**Problem Statement**: Mid-size e-commerce merchants (100-10,000 transactions/day) pay 15-25% more in processing fees because they cannot negotiate directly with acquirers. They are locked into aggregator pricing and lack the technical infrastructure to build their own payment orchestration. Integration complexity costs engineering teams 4-8 weeks per payment provider.

**Desired Outcome**: Within 6 months, PayGate processes $2M/month in transaction volume across 50 merchants, with a 99.99% transaction success rate and PCI-DSS Level 1 certification in progress.

**Project Type**: Greenfield / Production

**Repository**: github.com/yourorg/paygate

---

## 1.1 Deliverable Product Target

**Delivery Target**: Production — enterprise-ready application for deployment

**What "Done" Looks Like**:
- [x] Application is running and accessible behind API gateway
- [x] All P0 features are functional and demonstrable
- [x] A developer can integrate using the API docs without contacting support
- [x] Screenshots of every major dashboard/admin screen exist in `.team/screenshots/final/`

**Demo Requirements**:
- **Demo format**: Live demo (API calls via Postman/curl + admin dashboard)
- **Demo audience**: Technical team / Stakeholders
- **Demo environment**: Staging (isolated from production card networks)

**Visual Deliverables** (mandatory):
- [x] Running API with real request/response flows
- [x] Complete merchant onboarding flow from API key generation to first payment
- [x] Admin dashboard for transaction monitoring
- [x] Documentation website (`docs/`) with full API reference

---

## 2. Target Audience

**Primary Users**: Backend engineers at e-commerce companies integrating payment processing into their checkout flows. Comfortable with REST APIs, SDKs, and webhook consumption.

**Secondary Users**: Finance teams reviewing transaction reports and reconciliation data; compliance officers auditing payment logs.

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| Jordan | Backend Engineer | 4-week integration cycles; inconsistent API docs across providers; webhook delivery unreliable | Integrate payments in < 1 week; reliable webhooks; clear error messages | High |
| Priya | Finance Manager | Manual reconciliation across providers; delayed settlement reports; no unified view | Single dashboard for all transactions; automated daily reconciliation; exportable reports | Med |

**Anti-Users**: Individual sellers on marketplaces (use Stripe/PayPal directly); enterprises needing custom acquiring relationships; crypto payment processors.

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Merchant onboarding | Self-service API key generation, merchant profile, KYC document upload, approval workflow | Merchant can register, upload docs, receive API keys within 24h of approval; API keys are scoped (test/live) | L |
| 2 | Payment processing | Authorize, capture, void, refund for card payments; idempotency keys; 3DS support | All four operations work end-to-end; idempotency prevents duplicate charges; 3DS challenge flow completes | XL |
| 3 | Webhook delivery | Reliable webhook delivery with exponential backoff, signature verification, delivery logs | Webhooks delivered within 5s of event; retries up to 5 times with backoff; merchant can verify HMAC signature | L |
| 4 | Reconciliation | Daily automated reconciliation between processed transactions and settlement records | Reconciliation runs at 02:00 UTC daily; discrepancies flagged and surfaced in admin dashboard; CSV export available | L |
| 5 | API authentication | API key + HMAC signature authentication; rate limiting; IP allowlisting | All endpoints require valid auth; rate limits enforced (100 req/s per merchant); invalid requests return 401/429 with clear messages | M |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Transaction search | Full-text search across transactions by ID, amount, status, date range, merchant | Results return in < 500ms; filters composable; pagination with cursor-based approach | M |
| 2 | Merchant dashboard | Web dashboard for merchants to view transactions, settlement reports, and API logs | Dashboard loads in < 2s; shows real-time transaction status; exportable to CSV | L |
| 3 | Multi-currency | Accept payments in USD, EUR, GBP, CAD with automatic FX rate lookup | FX rates updated every 15 minutes; settlement always in merchant's base currency | M |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | Subscription billing | Recurring payment schedules with retry logic and dunning management |
| 2 | Fraud scoring | Real-time fraud risk scoring using velocity checks and device fingerprinting |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: Go 1.22+
- **Framework**: Standard library (net/http) + chi router
- **Database**: PostgreSQL 16 (primary) + TimescaleDB extension (time-series metrics)
- **Cache**: Redis 7 (session cache, rate limiting, idempotency keys)
- **Message Queue**: NATS JetStream (webhook delivery, async processing)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (us-east-1, PCI-compliant VPC)
- **Deployment**: Docker containers on EKS (Kubernetes 1.29)
- **CDN**: CloudFront (for API docs site only)
- **Domain**: api.paygate.dev (staging), api.paygate.io (production)

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Stripe (as acquirer) | Card processing backend | API key (restricted) | 100 req/s |
| AWS KMS | Encryption key management | IAM role | 10,000 req/s |
| AWS SES | Transactional email (merchant notifications) | IAM role | 200 emails/day (sandbox) |
| HashiCorp Vault | Secret management | AppRole auth | N/A |

**Existing Codebase**: Greenfield

**Package Manager**: go mod

**Monorepo or Polyrepo**: Single repo with `/cmd`, `/internal`, `/pkg` layout

---

## 5. Non-Functional Requirements

**Performance**:
- API response time: P95 < 150ms (excluding upstream acquirer latency)
- Payment authorization: P95 < 2s (end-to-end including acquirer)
- Throughput: 500 req/s sustained, 2,000 req/s burst
- Concurrent connections: 5,000 simultaneous

**Security**:
- Authentication: HMAC-SHA256 signed requests + API key header
- Authorization: Merchant-scoped access; admin RBAC (viewer/operator/admin)
- Data sensitivity: PCI-DSS Level 1 (cardholder data, PANs)
- Compliance: PCI-DSS v4.0, SOC 2 Type II (preparation), GDPR
- Encryption: TLS 1.3 in transit; AES-256-GCM at rest; PAN tokenization (never store raw PANs)

**Scalability**:
- Expected launch merchants: 10
- Expected 6-month merchants: 50
- Expected 1-year merchants: 200
- Scaling strategy: Horizontal auto-scaling on EKS (HPA based on CPU + request rate)

**Availability**:
- Uptime target: 99.99%
- Recovery time objective (RTO): < 15 minutes
- Recovery point objective (RPO): < 1 minute (PostgreSQL streaming replication)
- Multi-region: Future (active-passive DR in us-west-2 planned for v2)

**Accessibility**:
- WCAG level: AA (admin dashboard only)
- Screen reader support: Nice-to-have (admin dashboard)
- Internationalization: English only

**Observability**:
- Logging: Structured JSON via zerolog, shipped to CloudWatch Logs
- Metrics: Prometheus + Grafana (custom dashboards for TPS, latency, error rates)
- Tracing: OpenTelemetry with Jaeger backend
- Alerting: PagerDuty for P1/P0 alerts; Slack for P2/P3

---

## 6. Testing Requirements

**Test Coverage Target**: >= 90% line coverage (higher bar for financial software)

**Required Test Types**:
- [x] Unit tests (mandatory)
- [x] Integration tests (mandatory)
- [x] E2E tests (mandatory for P0 features)
- [x] Performance/load tests (mandatory — k6 load testing)
- [x] Security scanning (SAST + dependency audit + DAST)
- [ ] Accessibility tests
- [ ] Visual regression tests
- [x] Contract tests (API consumers/providers — OpenAPI validation)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (go vet, golangci-lint, gofmt)
- [x] Branch protection (require 2 PR reviews, passing CI)
- [x] Automated deployment to staging on merge to develop
- [x] Manual approval gate for production deployment

**Testing Tools**: Go testing package, testify for assertions, k6 for load testing, gosec for SAST, trivy for container scanning

### 6.1 UAT Testing Requirements

| Requirement | Value |
|-------------|-------|
| **UAT Coverage Target** | >= 95% |
| **P0 Feature Pass Rate** | 100% |
| **P1 Feature Pass Rate** | >= 95% |
| **Compliance Frameworks** | ISO 25010, PCI-DSS v4.0, SOC 2, GDPR |
| **Screenshot Capture** | Before + After for every test case |
| **UAT Report Format** | MD + PDF + PPTX + JSON + CSV exports |
| **Negative Test Coverage** | >= 95% (critical for payment processing) |
| **Role Coverage** | 100% (merchant, admin-viewer, admin-operator, admin-admin) |
| **Browser Matrix (P0 flows)** | Chrome + Firefox (admin dashboard only) |
| **Device Matrix (P0 flows)** | Desktop only (API + admin dashboard) |

**UAT Sign-Off Chain**: QA Agent -> Team Leader -> User

**Applicable Regulations**:
- [x] ISO 25010 — Software quality
- [x] GDPR — EU personal data handling
- [x] SOC 2 Type II — Security audit evidence
- [ ] WCAG 2.1 AA
- [x] PCI DSS v4.0 — Payment card processing
- [ ] HIPAA
- [ ] FDA 21 CFR Part 11

**Additional UAT Context**: Every payment flow must be tested with both successful and declined cards (Stripe test card numbers). Webhook delivery must be tested with unreachable endpoints to verify retry behavior. Reconciliation must be tested with intentionally mismatched records to verify discrepancy detection.

---

## 7. Timeline & Milestones

**Hard Deadline**: 8 weeks from kickoff

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | Foundation | Week 1-2 | API scaffold, DB schema, auth, merchant onboarding, CI pipeline, Docker setup | Merchant can register and receive API keys; health endpoint responds |
| M2 | Payment Core | Week 3-4 | Payment processing (auth/capture/void/refund), idempotency, 3DS | Test card payments succeed end-to-end; idempotency verified |
| M3 | Webhooks + Recon | Week 5-6 | Webhook delivery system, reconciliation engine, transaction search | Webhooks delivered reliably; daily recon runs; search returns results |
| M4 | Security + QA | Week 7-8 | Security hardening, load testing, PCI evidence collection, admin dashboard, docs, UAT | All P0 tests pass; k6 confirms 500 req/s; PCI self-assessment checklist started |

**Budget Constraints**:
- Infrastructure: $200/month (EKS + RDS + ElastiCache)
- Third-party APIs: $0/month (Stripe test mode is free)
- Domains/SSL: $30/year (paygate.dev via Cloudflare)

---

## 7.1 Cost Approval & Payment Governance

**Token Budget Tolerance**: < $50 total

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All AWS resource provisioning, domain purchases, any Stripe live-mode activation
- **Forbidden without user present**: Any production deployment cost, any payment processing in live mode

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| AWS EKS + RDS + ElastiCache | ~$200/month | AWS account | No — ask first |
| Domain (paygate.dev) | $15/year | Card | No — ask first |
| Stripe test mode | $0 | Free | Yes |
| HashiCorp Vault (dev mode) | $0 | Free (self-hosted) | Yes |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [x] All P0 features implemented and tested
- [x] Unit test coverage >= 90%
- [x] Zero CRITICAL/HIGH security vulnerabilities
- [x] E2E tests pass for all P0 payment flows
- [x] Performance targets met (500 req/s sustained)
- [x] Documentation complete (OpenAPI spec, integration guide, setup guide)
- [x] CI/CD pipeline tested and working
- [x] Deployment to staging succeeds with health checks passing
- [x] PCI-DSS SAQ-D self-assessment started

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Payment authorization success rate | > 99.5% | Prometheus metrics (successful auths / total auths) |
| API P95 latency | < 150ms | Grafana dashboard (excluding acquirer time) |
| Webhook first-attempt delivery rate | > 95% | NATS JetStream delivery metrics |
| Mean time to integrate (developer) | < 1 week | Measure from API key issuance to first live transaction |

**Definition of Done**: All P0 payment flows pass UAT with both successful and declined test cards, staging deployment is live with health checks passing, OpenAPI documentation is published, load test confirms 500 req/s, and PCI self-assessment questionnaire is in progress.

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| Stripe | Excellent API design, comprehensive docs, idempotency patterns | Over-complexity for MVP; building a full platform too early |
| Adyen | Unified commerce approach, strong reconciliation | Enterprise-only focus; overly complex webhook schemas |
| Square | Simple developer onboarding, clear error messages | Hardware dependency; marketplace complexity |

**Design Inspiration**: Stripe API reference layout, Adyen's webhook event catalog, Square's getting-started guides

**Technical References**: PCI-DSS v4.0 SAQ-D requirements, Stripe API design principles (blog), Go standard project layout

**Internal Documentation**: None (greenfield)

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. Card vault / tokenization service (use Stripe's tokenization)
2. Merchant-facing mobile app
3. Direct acquiring relationships (using Stripe as acquirer/processor)

**Deferred to future versions**:
1. Multi-region active-active deployment
2. Subscription/recurring billing engine
3. Real-time fraud scoring
4. PCI-DSS Level 1 QSA audit (v1 targets SAQ-D self-assessment only)

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| PCI-DSS scope larger than estimated | M | H | Minimize cardholder data environment; use Stripe tokenization to avoid storing PANs; consult QSA early |
| Webhook delivery at scale causes backpressure | M | M | NATS JetStream handles backpressure natively; implement circuit breaker per merchant endpoint |
| Stripe test mode does not fully simulate production behavior | L | M | Document known test-mode limitations; plan production smoke tests with micro-transactions |
| AWS costs exceed budget during load testing | M | M | Use spot instances for load test infrastructure; set billing alerts at $150 and $200 |

**Hard Constraints** (non-negotiable):
- Must use Go (team expertise and performance requirements)
- Must deploy to AWS us-east-1 (data residency and latency to Stripe)
- Must never store raw PANs (use Stripe tokenization)
- Must achieve PCI-DSS SAQ-D compliance before processing live payments

**Soft Constraints** (preferred but negotiable):
- Prefer NATS JetStream but open to SQS if operational burden is too high
- Prefer EKS but open to ECS Fargate if K8s overhead is excessive for MVP

---

## 11.1 Dynamic Agent Scaling

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 15

**Scaling triggers**:
- A single feature has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking bugs requiring parallel fix agents
- Security review identifies issues requiring dedicated remediation agent

**Agent types the PM may add**:
- [x] Additional Backend Engineers (for API-heavy projects)
- [ ] Additional Frontend Engineers
- [x] Additional QA Engineers (for large test suites)
- [x] Specialist agents (security hardening, PCI compliance, performance tuning)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 15%)
- Extra agents inherit the same execution protocol
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Screenshots of running application (admin dashboard, API responses)
- [x] Test result reports (JUnit XML, coverage HTML)
- [x] Build logs showing zero errors
- [x] CI/CD pipeline passing locally (act) and remotely
- [x] Security scan reports (zero CRITICAL/HIGH)
- [x] Performance benchmark results (k6 load test reports)
- [x] Deployment verification (health check passing)
- [x] API documentation (OpenAPI 3.1 spec)
- [x] Database migration scripts tested
- [x] Dependency audit clean

**Reporting Frequency**: Every 6 hours (default)

**Final Deliverable**: Both PPTX and PDF

---

## 12.0.1 Screenshots & Visual Evidence

**Screenshot Requirements**:
- [x] Before/after screenshots for every P0 feature implementation
- [x] Test result screenshots (unit, integration, e2e, load)
- [x] Deployment evidence screenshots
- [x] Admin dashboard screenshots
- [x] Mission Control dashboard screenshots at wave completions
- [x] API response screenshots (Postman/curl)

**Screenshot Naming**: `{date}_{agent}_{description}.png`

**Final Product Screenshots**: `.team/screenshots/final/` MUST contain API response examples and admin dashboard walkthrough.

## 12.0.2 Documentation Website

**Documentation Scope**:
- [x] Project overview and architecture
- [x] Getting started / installation guide
- [x] API reference (auto-generated from OpenAPI spec)
- [x] Integration guide with code examples (Go, Python, Node.js, cURL)
- [x] Configuration reference
- [x] Deployment guide
- [x] Decision log

**Documentation Tech**: React + Vite + MDX

## 12.0.3 Mission Control PDF Report

**PDF Report Must Include**:
- [x] Executive summary with key metrics
- [x] Discovery interview (all 20+ Q&A)
- [x] Complete decision log with rationale
- [x] Task execution timeline (planned vs actual)
- [x] Git commit history with agent attribution
- [x] Quality report (test coverage, bugs, security scans)
- [x] Agent performance metrics
- [x] Screenshots embedded
- [x] Cost analysis (budget vs actual)
- [x] Deliverables checklist with evidence

**Report Generation**: Automatic at end of every wave + on-demand

---

## 12.1 Data Preservation & Uncertainty Policy

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted. This is especially critical for payment processing — transaction records are immutable audit trails.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}` (default)
- **Archive method for table rows**: Add `status: archived` column; never DELETE rows with financial data
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker (default)
- **Git history protection**: Never rebase/squash published commits

**Uncertainty Escalation**:

- **Escalation threshold**: < 95% confidence -> escalate (higher threshold for financial systems)
- **Escalation response time expectation**: I'll respond within minutes
- **What counts as "unsure"**: Any action that might delete data, cost money, affect external services, touch cardholder data, modify payment flows, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options (financial decisions need full context)

---

## 13. GitHub Auto-Sync Policy

**Auto-sync frequency**: Every commit (default)

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `ai-team`
- Merge to main: ONLY after Team Leader receives explicit user approval

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

PCI-DSS compliance is the top non-functional priority. Minimize the cardholder data environment (CDE) by using Stripe's tokenization — PayGate should never see or store raw card numbers. All API endpoints must log request metadata (not sensitive fields) for audit purposes. Use database transactions for all payment state changes to prevent inconsistencies. Every payment mutation must be idempotent.

---

*Strategy Brief v3.3 — Amenthyx AI Teams*
