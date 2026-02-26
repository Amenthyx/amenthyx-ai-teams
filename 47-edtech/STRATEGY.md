# EdTech Team — Tailored Strategy v3.1

> Pre-configured for **LMS, adaptive learning, assessment engines, and learning analytics with Next.js, React, PostgreSQL, LTI 1.3, SCORM, and xAPI**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team edtech --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for EdTech Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Next.js 14 (App Router) / React 18 (frontend) + NestJS or Next.js API routes (backend)
- **Database**: PostgreSQL 16 (primary — users, enrollments, assessments) + MongoDB (content storage, course materials)
- **Standards**: LTI 1.3 (tool integration), SCORM 2004 (legacy content), xAPI (learning analytics)
- **Cache**: Redis 7 (session management, content caching)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Vercel (frontend) — team's choice
- **Deployment**: Docker + Kubernetes (backend services) / Vercel (frontend) or unified Docker Compose
- **CDN**: Vercel Edge / CloudFront for static content delivery
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary data store | Connection string (env) | Connection pool max 50 |
| MongoDB | Content storage | Connection string (env) | N/A |
| Redis 7 | Cache + sessions | AUTH token (env) | N/A |
| LTI 1.3 Platform | External tool integration | OAuth2 (OIDC) + JWT | Per platform |
| xAPI LRS (Learning Locker) | Learning analytics | Basic Auth / OAuth (env) | Per plan |
| SCORM Cloud (optional) | Legacy content hosting | API key (env) | Per plan |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm

**Monorepo or Polyrepo**: Monorepo (Turborepo — frontend, backend, content services, LTI provider)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- API response time P95 < 200ms
- Largest Contentful Paint (LCP) < 2.5s
- Video content start time < 2s (streaming)
- Assessment submission response < 500ms
- Concurrent learners: 500 per tenant without degradation

**Security**:
- Authentication: OAuth2 + JWT (access + refresh), SSO via SAML/OIDC for institutions
- Authorization: RBAC (admin, instructor, student, parent/guardian)
- Data sensitivity: Student PII, FERPA-protected education records
- Compliance: COPPA (children under 13), FERPA (student records)
- Encryption: TLS 1.3 in transit, AES-256 at rest for student data
- Student data protection: parental consent workflows (COPPA), data deletion requests

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Multi-tenant architecture, horizontal pod autoscaling, PostgreSQL read replicas, CDN for content
- Multi-tenancy: Tenant isolation at database level (schema-per-tenant or row-level security)

**Availability**:
- Uptime target: 99.9% (platform), 99.99% (assessment submission during exam windows)
- RTO: 30 minutes
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- WCAG 2.2 AA compliance (mandatory — non-negotiable)
- Screen reader compatible (JAWS, NVDA, VoiceOver tested)
- Keyboard navigation support (all interactions)
- Captions/transcripts for all video content
- High contrast mode and font size adjustment
- RTL language support (i18n-ready with next-intl)

**Observability**:
- Logging: Pino (structured JSON) — backend; Sentry — frontend
- Metrics: Prometheus (API latency, content delivery, assessment completion rates, learning analytics)
- Tracing: OpenTelemetry (distributed traces across services)
- Alerting: Grafana Alerting for assessment system health, content delivery failures

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (backend), >= 70% (frontend components)

**Required Test Types**:
- [x] Unit tests (Vitest — backend + frontend, assessment scoring logic)
- [x] Integration tests (Supertest — API routes, LTI 1.3 handshake, xAPI statement submission)
- [x] End-to-end tests (Playwright — enrollment, course navigation, assessment, grading)
- [x] Accessibility tests (axe-core via Playwright — WCAG 2.2 AA mandatory)
- [x] LTI 1.3 conformance tests (tool launch, deep linking, grade passback)
- [x] SCORM packaging tests (SCORM 2004 manifest validation, runtime API)
- [x] xAPI statement validation (statement structure, verb vocabulary, activity types)
- [x] Multi-tenant isolation tests (data leak prevention between tenants)
- [x] Load tests (k6 — concurrent assessment submission, content delivery)
- [ ] Offline content tests (optional — service worker caching validation)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint, Prettier, tsc --strict via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Accessibility checks mandatory in CI (axe-core, no merge with AA violations)
- [ ] Automated SCORM package validation on content upload
- [ ] Staging environment with synthetic student data

**Testing Tools**: Vitest, Playwright, Supertest, k6, axe-core, MSW (API mocking), IMS LTI reference tools, xAPI validator

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
| Learning Locker (xAPI LRS) | Free / ~$99/mo | Card | No — ask first |
| SCORM Cloud (optional) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% backend test coverage, >= 70% frontend test coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] WCAG 2.2 AA accessibility validated (axe-core + manual audit)
- [ ] LTI 1.3 conformance verified (launch, deep linking, grade passback)
- [ ] xAPI learning analytics pipeline functional
- [ ] Multi-tenant isolation verified (no cross-tenant data leakage)
- [ ] COPPA/FERPA compliance validated (consent workflows, data handling)
- [ ] Offline content support functional (if applicable)
- [ ] Documentation complete (README, API docs, LTI integration guide, instructor manual)
- [ ] CI/CD pipeline tested and working
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
| WCAG 2.2 AA compliance gaps blocking deployment | M | H | Accessibility-first development, axe-core in CI, manual audit each wave |
| LTI 1.3 integration issues with specific LMS platforms | M | M | IMS reference implementation testing, vendor-specific integration tests, abstraction layer |
| COPPA/FERPA violation due to student data handling error | L | H | Consent management workflows, data classification, automated PII scanning, legal review |
| Multi-tenant data leakage | L | H | Row-level security, tenant isolation tests in CI, penetration testing |
| SCORM legacy content compatibility issues | M | M | SCORM 2004 conformance testing, fallback rendering, content migration tools |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Accessibility WCAG 2.2 AA mandatory: no feature ships without AA compliance
- Multi-tenant architecture: complete data isolation between institutional tenants
- Offline content support: core learning content must be accessible without network
- COPPA/FERPA compliance: parental consent for minors, student data protection enforced

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
- [x] Additional Frontend Engineer (React/Next.js — course UI, assessment UI)
- [x] Additional Backend Engineer (NestJS — LTI provider, content service, analytics)
- [x] Additional Learning Standards Engineer (LTI 1.3, SCORM, xAPI integration)
- [x] Additional QA Engineer (Playwright, accessibility testing)
- [x] Additional Accessibility Specialist (WCAG 2.2 AA audit, remediation)
- [x] Database Specialist (PostgreSQL multi-tenant, MongoDB content optimization)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Vitest coverage — HTML + lcov)
- [x] Playwright E2E test results (HTML report)
- [x] Accessibility audit report (axe-core results, WCAG 2.2 AA compliance proof)
- [x] LTI 1.3 conformance test results (launch, deep linking, grade passback)
- [x] xAPI statement validation results (structure, vocabulary compliance)
- [x] Multi-tenant isolation test results (cross-tenant data leak prevention)
- [x] k6 load test results (concurrent assessment submission, content delivery)
- [x] COPPA/FERPA compliance checklist
- [x] CI/CD pipeline screenshot (all checks green, accessibility checks passing)
- [x] Architecture diagram (multi-tenant, service topology, LTI flow, xAPI pipeline)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Student records**: retained per FERPA requirements, deletion only via formal data deletion request
- **Learning analytics**: ALL xAPI statements retained in LRS

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/edtech/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (accessibility audits, LTI conformance, xAPI validation)
- [x] Source code changes (frontend, backend, content services, LTI provider)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*EdTech Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + Next.js + React + PostgreSQL + MongoDB + LTI 1.3 + SCORM + xAPI education technology*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
