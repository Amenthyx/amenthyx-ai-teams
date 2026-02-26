# HealthTech Team — Tailored Strategy v3.1

> Pre-configured for **EHR integrations, patient portals, clinical workflows, and health data analytics with Next.js, FastAPI, FHIR R4, and HIPAA compliance**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team healthtech --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for HealthTech Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (frontend + API gateway), Python 3.12+ (clinical logic, analytics, ML)
- **Framework**: Next.js 14 (App Router — patient portal, clinician dashboard) / FastAPI (clinical data services, FHIR endpoints)
- **Database**: PostgreSQL 16 (primary — HIPAA-compliant configuration)
- **Standards**: FHIR R4 (interoperability), HL7v2 (legacy EHR integration), DICOM (medical imaging)
- **Cache**: Redis 7 (session management, frequently accessed clinical data)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (HIPAA-eligible services) / GCP (HIPAA BAA) / Azure (HIPAA BAA)
- **Deployment**: Docker + Kubernetes (all services) in HIPAA-compliant VPC
- **CDN**: CloudFront / Cloud CDN with PHI exclusion rules
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary data store (HIPAA config) | Connection string (env) | Connection pool max 50 |
| Redis 7 | Session + cache | AUTH token (env) | N/A |
| FHIR Server (HAPI/Firely) | Interoperability | SMART on FHIR (OAuth2) | Per server |
| EHR System (Epic/Cerner) | Clinical data integration | OAuth2 + FHIR | Per BAA |
| DICOM Server (Orthanc) | Medical imaging | DICOM / DICOMweb | Storage-based |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm (TypeScript) / poetry (Python)

**Monorepo or Polyrepo**: Monorepo (Turborepo — frontend, API gateway, clinical services)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- API response time P95 < 300ms (clinical data queries)
- Patient portal LCP < 2.5s
- FHIR resource retrieval < 500ms per resource
- Clinical dashboard initial load < 3s

**Security**:
- Authentication: SMART on FHIR (OAuth2) for EHR integration, JWT + MFA for direct access
- Authorization: RBAC with clinical role hierarchy (physician, nurse, admin, patient)
- Data sensitivity: PHI (Protected Health Information) — highest sensitivity
- Compliance: HIPAA (Security Rule, Privacy Rule, Breach Notification), HITECH Act
- Encryption: AES-256 at rest (PHI), TLS 1.3 in transit, field-level encryption for sensitive PHI
- BAA: Required for EVERY cloud service and third-party vendor handling PHI
- Audit: Comprehensive access logging for all PHI access (who, what, when, why)
- Minimum necessary principle: access only the minimum PHI required for each function

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal pod autoscaling, PostgreSQL read replicas, Redis cluster

**Availability**:
- Uptime target: 99.9% (patient portal), 99.99% (clinical data services)
- RTO: 15 minutes
- RPO: 5 minutes (zero for clinical data writes)
- Multi-region: [FILL IN: yes / no / future — recommended for clinical systems]

**Accessibility**:
- WCAG 2.1 AA compliance (mandatory for healthcare)
- Screen reader compatible (aria attributes, JAWS/NVDA tested)
- Keyboard navigation support
- High contrast mode for clinical environments
- i18n-ready with healthcare terminology localization

**Observability**:
- Logging: Structured JSON logs with correlation IDs, PHI redaction in all log output
- Metrics: Prometheus (FHIR query latency, PHI access rates, integration health)
- Tracing: OpenTelemetry (distributed traces across clinical services)
- Alerting: PagerDuty for P1 clinical system alerts, Grafana dashboards
- Audit: HIPAA-compliant audit log (immutable, tamper-proof, PHI access tracking)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 90% line coverage (clinical data handling), >= 80% (API layer), >= 70% (frontend)

**Required Test Types**:
- [x] Unit tests (Vitest / pytest — clinical logic, data transformations, PHI handling)
- [x] Integration tests (FHIR resource CRUD, HL7v2 message parsing, EHR connectivity)
- [x] End-to-end tests (Playwright — patient portal flows, clinician workflows)
- [x] HIPAA compliance tests (PHI encryption verification, access control validation, audit log completeness)
- [x] FHIR conformance tests (FHIR validator, resource structure validation)
- [x] Consent management tests (patient consent enforcement, data sharing rules)
- [x] Security tests (OWASP ZAP, penetration testing, PHI exposure scanning)
- [x] Accessibility tests (axe-core via Playwright, WCAG 2.1 AA validation)
- [x] Load tests (k6 — clinical workflow under load)
- [ ] Interoperability tests (optional — multi-EHR integration testing)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint, Prettier, black, ruff, mypy via lint-staged + husky)
- [x] Branch protection (require 2 PR reviews for PHI-handling code, passing CI)
- [x] PHI scanning in CI (automated detection of PHI in code, logs, configs)
- [ ] HIPAA compliance validation on every PR
- [ ] Staging environment with synthetic patient data (no real PHI)

**Testing Tools**: Vitest, pytest, Playwright, k6, axe-core, OWASP ZAP, FHIR Validator, Synthea (synthetic patient data), custom PHI scanner

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
| AWS/GCP/Azure (HIPAA) | Variable (high) | Card | No — ask first |
| FHIR Server hosting | Variable | Card | No — ask first |
| EHR Integration fees | Variable | Card | No — ask first |
| PagerDuty | ~$21/user/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 90% clinical data coverage, >= 80% API coverage, >= 70% frontend coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] HIPAA compliance validated (Security Rule, Privacy Rule checklist)
- [ ] BAA signed with every vendor handling PHI
- [ ] FHIR conformance tests pass (resource validation, SMART on FHIR)
- [ ] PHI encryption verified at rest and in transit
- [ ] Audit logging complete (all PHI access tracked)
- [ ] Consent management functional and tested
- [ ] WCAG 2.1 AA accessibility validated
- [ ] Documentation complete (README, API docs, HIPAA compliance docs, clinician guide)
- [ ] CI/CD pipeline tested and working with security scanning
- [ ] Breach notification procedures documented and tested
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
| HIPAA breach due to PHI exposure in logs/errors | M | H | PHI redaction in all logs, automated PHI scanning in CI, field-level encryption |
| EHR integration failure (Epic/Cerner API changes) | M | H | FHIR abstraction layer, integration tests, versioned API contracts, fallback to HL7v2 |
| BAA negotiation delays with cloud vendors | M | M | Use pre-approved HIPAA-eligible services, start BAA process early |
| Patient consent management complexity | M | M | Modular consent engine, policy-as-code, extensive testing with edge cases |
| Regulatory changes (new HIPAA rules, state laws) | L | H | Legal monitoring, modular compliance layer, feature flags for regulation-specific logic |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- HIPAA compliance: all PHI encrypted (AES-256 at rest, TLS 1.3 in transit), audit logging mandatory
- BAA required for every vendor: no cloud service or third-party tool handles PHI without signed BAA
- Consent management: patient consent must be enforced before any PHI sharing
- Minimum necessary principle: every data access must request only minimum required PHI
- Breach notification procedures: documented, tested, and ready to execute within 60 days

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
- [x] Additional Backend Engineer (FastAPI clinical services, FHIR endpoints)
- [x] Additional Frontend Engineer (Next.js patient portal, clinician dashboard)
- [x] Additional FHIR/HL7 Specialist (interoperability, EHR integration)
- [x] Additional HIPAA Compliance Engineer (security controls, audit logging)
- [x] Database Specialist (PostgreSQL HIPAA config, PHI encryption, query optimization)
- [x] Security Specialist (penetration testing, PHI scanning, access control)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Vitest + pytest coverage — HTML + lcov)
- [x] Playwright E2E test results (clinical workflow HTML report)
- [x] HIPAA compliance checklist (Security Rule controls verified)
- [x] FHIR conformance test results (FHIR Validator output)
- [x] PHI encryption verification (at-rest and in-transit proof)
- [x] Audit log sample (demonstrating comprehensive PHI access tracking)
- [x] Security scan results (OWASP ZAP, dependency audit, PHI exposure scan)
- [x] Accessibility audit (axe-core results, WCAG 2.1 AA compliance)
- [x] CI/CD pipeline screenshot (all checks green, security scans passing)
- [x] Architecture diagram (service topology, PHI data flow, security zones, EHR integration)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove (HIPAA retention requirements)
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Clinical records**: ALL patient data retained per HIPAA retention requirements (6+ years)
- **Audit logs**: NEVER delete or modify audit log entries (HIPAA requirement)

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
- [x] `.team/evidence/` proof artifacts (HIPAA compliance, FHIR conformance, security scans)
- [x] Source code changes (services, FHIR resources, migrations)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*HealthTech Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + Python + Next.js + FastAPI + PostgreSQL + FHIR R4 + HIPAA-compliant health technology*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
