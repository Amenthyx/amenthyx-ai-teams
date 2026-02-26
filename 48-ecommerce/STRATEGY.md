# E-Commerce Team — Tailored Strategy v3.1

> Pre-configured for **product catalogs, cart, checkout, payments, inventory, and order management with Next.js, NestJS, PostgreSQL, Redis, and Elasticsearch**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team ecommerce --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for E-Commerce Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Next.js 14 (App Router — storefront) + NestJS (backend API + admin)
- **Database**: PostgreSQL 16 (primary — products, orders, users, inventory)
- **Cache**: Redis 7 (session, cart, product cache, rate limiting)
- **Queue**: BullMQ (order processing, email notifications, inventory sync)
- **Search**: Elasticsearch / Algolia (product search, faceted filtering, autocomplete)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Vercel (storefront) — team's choice
- **Deployment**: Docker + Kubernetes (backend) / Vercel (storefront) or unified Docker Compose
- **CDN**: Vercel Edge / CloudFront (static assets, product images)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary data store | Connection string (env) | Connection pool max 50 |
| Redis 7 | Cache + sessions + queue backend | AUTH token (env) | N/A |
| Elasticsearch / Algolia | Product search | API key (env) | Per plan |
| Stripe / PayPal | Payment processing | API key + webhook secret (env) | Per plan |
| Shipping API (EasyPost/Shippo) | Shipping rates + labels | API key (env) | Per plan |
| Email (SendGrid/SES) | Transactional emails | API key (env) | Per plan |
| Image CDN (Cloudinary/imgix) | Product image optimization | API key (env) | Per plan |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm

**Monorepo or Polyrepo**: Monorepo (Turborepo — storefront, backend API, admin dashboard, shared packages)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Storefront page load: sub-200ms TTFB (edge-cached pages)
- Largest Contentful Paint (LCP) < 2.0s
- Product search response < 100ms
- Cart operations < 200ms
- Checkout completion < 500ms
- Concurrent shoppers: 1,000 without degradation

**Security**:
- Authentication: JWT (access + refresh tokens), OAuth2 (Google, Apple, social login)
- Authorization: RBAC (customer, staff, admin, super-admin)
- Data sensitivity: PII + payment data
- Compliance: PCI-DSS (via Stripe Elements — no raw card data touches servers), SOC 2
- Encryption: TLS 1.3 in transit, AES-256 at rest for PII
- Fraud prevention: Stripe Radar integration, velocity checks, address verification

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal pod autoscaling, PostgreSQL read replicas, Redis cluster, Elasticsearch cluster, CDN for static assets
- Flash sale handling: pre-warmed cache, queue-based checkout, inventory reservation with TTL

**Availability**:
- Uptime target: 99.99% (checkout), 99.9% (storefront)
- RTO: 15 minutes
- RPO: 0 (zero data loss for orders and payments)
- Multi-region: [FILL IN: yes / no / future — recommended for 99.99% checkout]

**Accessibility**:
- WCAG 2.1 AA compliance
- Screen reader compatible (aria attributes, product alt texts)
- Keyboard navigation support (all checkout steps)
- i18n-ready with multi-currency support (next-intl, Intl.NumberFormat)

**Observability**:
- Logging: Pino (structured JSON) — backend; Sentry — frontend
- Metrics: Prometheus (order rates, cart abandonment, payment success/failure, search latency, inventory levels)
- Tracing: OpenTelemetry (distributed traces — browse → cart → checkout → payment → fulfillment)
- Alerting: Grafana Alerting / PagerDuty (checkout failure rate, payment errors, inventory stockout)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 85% line coverage (backend — order, payment, inventory), >= 70% (frontend components)

**Required Test Types**:
- [x] Unit tests (Vitest — pricing logic, discount calculations, inventory math, tax computation)
- [x] Integration tests (Supertest — API routes, database interactions, Stripe webhooks)
- [x] End-to-end tests (Playwright — browse → cart → checkout → order confirmation)
- [x] Payment integration tests (Stripe test mode — card payments, refunds, disputes)
- [x] Inventory concurrency tests (race condition prevention in stock reservation)
- [x] Search relevance tests (product search quality, facet accuracy)
- [x] Performance / load tests (k6 — checkout under load, flash sale simulation)
- [x] Accessibility tests (axe-core via Playwright — WCAG 2.1 AA)
- [x] SEO validation tests (structured data, meta tags, canonical URLs)
- [ ] Visual regression tests (optional — Playwright screenshots for storefront pages)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint, Prettier, tsc --strict via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated Lighthouse audit on PR (Core Web Vitals)
- [ ] Staging environment with synthetic product data

**Testing Tools**: Vitest, Playwright, Supertest, k6, axe-core, MSW (API mocking), Stripe test mode, Lighthouse CI

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
| Vercel Pro | ~$20/mo | Card | No — ask first |
| AWS/GCP | Variable | Card | No — ask first |
| Stripe | Transaction-based (2.9% + $0.30) | Card | No — ask first |
| Algolia / Elasticsearch Cloud | Variable | Card | No — ask first |
| SendGrid / SES | Variable | Card | No — ask first |
| Cloudinary / imgix | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 85% backend test coverage, >= 70% frontend test coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Sub-200ms page loads (edge-cached storefront pages)
- [ ] 99.99% checkout uptime verified under load
- [ ] Idempotent payment processing verified (no duplicate charges)
- [ ] Inventory concurrency verified (no overselling under load)
- [ ] Product search relevance tested and tuned
- [ ] Core Web Vitals passing (LCP < 2.0s, FID < 100ms, CLS < 0.1)
- [ ] Accessibility WCAG 2.1 AA validated
- [ ] Documentation complete (README, API docs, admin guide, integration docs)
- [ ] CI/CD pipeline tested and working
- [ ] Database migrations are reversible and tested
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
| Payment gateway outage during peak traffic | M | H | Multi-gateway failover (Stripe + PayPal), retry queues, graceful degradation |
| Inventory overselling during flash sales | M | H | Pessimistic locking on inventory, reservation with TTL, queue-based checkout |
| Search index out of sync with product database | M | M | Event-driven reindexing via BullMQ, periodic full reindex, index health monitoring |
| Cart abandonment due to slow checkout | M | H | Edge caching, optimistic UI updates, Stripe Elements pre-load, performance budgets |
| Third-party API rate limiting (Stripe, shipping, email) | M | M | Retry with backoff, queue-based processing, rate limit monitoring |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Sub-200ms page loads: storefront pages must be edge-cached with fast TTFB
- 99.99% checkout uptime: checkout path is the highest priority for availability
- Idempotent payment processing: no duplicate charges under any circumstances
- PCI-DSS compliance via Stripe Elements: raw card data never touches application servers

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
- [x] Additional Frontend Engineer (Next.js storefront, product pages, checkout UI)
- [x] Additional Backend Engineer (NestJS — order service, inventory, fulfillment)
- [x] Additional Payment Engineer (Stripe/PayPal integration, refunds, disputes)
- [x] Additional Search Engineer (Elasticsearch/Algolia — indexing, relevance tuning)
- [x] DevOps Specialist (Docker, K8s, CDN, CI/CD, performance optimization)
- [x] Database Specialist (PostgreSQL optimization, inventory locking, migration design)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Vitest coverage — HTML + lcov)
- [x] Playwright E2E test results (checkout flow HTML report)
- [x] k6 load test results (checkout under load, flash sale simulation — JSON + HTML)
- [x] Lighthouse performance audit (LCP, FID, CLS, TTFB scores)
- [x] Payment integration test results (Stripe test mode — charges, refunds, webhooks)
- [x] Inventory concurrency test results (no overselling proof under concurrent load)
- [x] Search relevance report (query-result quality scores)
- [x] Accessibility audit (axe-core results, WCAG 2.1 AA compliance)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (service topology, checkout flow, payment flow, inventory flow, search pipeline)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Order records**: ALL order and payment records retained (legal/tax requirement)
- **Inventory events**: ALL stock change events retained for audit trail

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/ecommerce/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (load tests, payment tests, accessibility audits)
- [x] Source code changes (storefront, backend, admin, shared packages)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*E-Commerce Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + Next.js + NestJS + PostgreSQL + Redis + Elasticsearch + Stripe e-commerce*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
