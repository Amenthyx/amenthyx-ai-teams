# Project Strategy Brief v3.0

> Fill out this template and pass it to your team with `--strategy path/to/this-file.md`
> This is your single source of truth. The team reads this as gospel.
> **Be specific. Vague strategies produce vague results.**

---

## 1. Project Identity

**Project Name**: [Your project name — short, memorable]

**One-Line Vision**: [What is this project in one sentence? e.g., "A real-time collaborative code editor for remote teams"]

**Problem Statement**: [What specific, measurable pain does this solve? Who feels it? How much does it cost them?]

**Desired Outcome**: [What does the world look like 6 months after this ships? Be concrete.]

**Project Type**: [Greenfield / Extending existing codebase / Migration / Rewrite / Prototype / MVP / Production]

**Repository**: [GitHub URL if existing, or desired repo name]

---

## 2. Target Audience

**Primary Users**: [Who uses this daily? Be specific — job title, company size, technical skill level]

**Secondary Users**: [Who benefits indirectly? Managers, ops teams, end customers?]

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [Name] | [Job title] | [Top 3 pain points] | [What they want to achieve] | [Low/Med/High] |
| [Name] | [Job title] | [Top 3 pain points] | [What they want to achieve] | [Low/Med/High] |

**Anti-Users**: [Who is this explicitly NOT for?]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |
| 2 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |
| 3 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |
| 2 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | [Feature name] | [What it does] |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: [e.g., TypeScript 5.x / Python 3.12+ / Rust 1.75+ / "team's choice"]
- **Framework**: [e.g., Next.js 14 / Django 5 / Actix-web / "team's choice"]
- **Database**: [e.g., PostgreSQL 16 / MongoDB 7 / "team's choice"]
- **Cache**: [e.g., Redis 7 / "none" / "team's choice"]
- **Message Queue**: [e.g., RabbitMQ / Kafka / "none" / "team's choice"]

**Hosting/Infrastructure**:
- **Cloud Provider**: [AWS / GCP / Azure / self-hosted / "team's choice"]
- **Deployment**: [Docker + K8s / serverless / VMs / PaaS / "team's choice"]
- **CDN**: [CloudFront / Cloudflare / "team's choice"]
- **Domain**: [your-domain.com or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| [Service name] | [Why needed] | [API key / OAuth / etc.] | [If known] |

**Existing Codebase**: [Path to existing code, or "greenfield". If existing: what's the current state?]

**Package Manager**: [npm / pnpm / yarn / pip / poetry / cargo / go mod / etc.]

**Monorepo or Polyrepo**: [Single repo / multiple repos / monorepo with workspaces]

---

## 5. Non-Functional Requirements

**Performance**:
- API response time: [e.g., P95 < 200ms]
- Page load time: [e.g., LCP < 2.5s]
- Throughput: [e.g., 1000 req/s]
- Concurrent users: [e.g., 500 simultaneous]

**Security**:
- Authentication: [e.g., JWT + refresh tokens / OAuth 2.0 / SSO]
- Authorization: [e.g., RBAC / ABAC / row-level security]
- Data sensitivity: [e.g., PII, financial data, health data, public only]
- Compliance: [e.g., SOC 2 / GDPR / HIPAA / PCI-DSS / none]
- Encryption: [At rest + in transit / TLS 1.3 / AES-256]

**Scalability**:
- Expected launch users: [number]
- Expected 6-month users: [number]
- Expected 1-year users: [number]
- Scaling strategy: [horizontal / vertical / auto-scaling]

**Availability**:
- Uptime target: [e.g., 99.9% / 99.99%]
- Recovery time objective (RTO): [e.g., < 1 hour]
- Recovery point objective (RPO): [e.g., < 5 minutes]
- Multi-region: [yes / no / future]

**Accessibility**:
- WCAG level: [A / AA / AAA]
- Screen reader support: [required / nice-to-have]
- Internationalization: [languages needed, RTL support]

**Observability**:
- Logging: [structured JSON / ELK / CloudWatch / "team's choice"]
- Metrics: [Prometheus / Datadog / CloudWatch / "team's choice"]
- Tracing: [Jaeger / Tempo / X-Ray / "team's choice"]
- Alerting: [PagerDuty / Opsgenie / Slack / "team's choice"]

---

## 6. Testing Requirements

**Test Coverage Target**: [e.g., >= 80% line coverage]

**Required Test Types**:
- [ ] Unit tests (mandatory)
- [ ] Integration tests (mandatory)
- [ ] E2E tests (mandatory for P0 features)
- [ ] Performance/load tests
- [ ] Security scanning (SAST + dependency audit)
- [ ] Accessibility tests (axe-core / Lighthouse)
- [ ] Visual regression tests
- [ ] Contract tests (API consumers/providers)

**CI/CD Requirements**:
- [ ] GitHub Actions (tested locally with `act` before push)
- [ ] Pre-commit hooks (lint, format, type-check)
- [ ] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: [e.g., Jest / Pytest / Playwright / k6 / "team's choice"]

---

## 7. Timeline & Milestones

**Hard Deadline**: [Date or "flexible"]

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [Name] | [Date] | [What's delivered] | [How to verify] |
| M2 | [Name] | [Date] | [What's delivered] | [How to verify] |
| M3 | [Name] | [Date] | [What's delivered] | [How to verify] |
| M4 | [Name] | [Date] | [What's delivered] | [How to verify] |

**Budget Constraints**:
- Infrastructure: [$X/month or "minimize"]
- Third-party APIs: [$X/month or "free tier only"]
- Domains/SSL: [$X or "already owned"]

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Unit test coverage >= [X]%
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows
- [ ] Performance targets met (see Section 5)
- [ ] Documentation complete (README, API docs, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [Metric 1] | [Target value] | [Measurement method] |
| [Metric 2] | [Target value] | [Measurement method] |

**Definition of Done**: [When is this project "done"? Be unambiguous.]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [Product 1] | [Good aspects] | [Bad aspects] |
| [Product 2] | [Good aspects] | [Bad aspects] |

**Design Inspiration**: [Links to designs, screenshots, Figma files, mockups]

**Technical References**: [Architecture docs, RFCs, papers, blog posts]

**Internal Documentation**: [Links to internal docs, PRDs, design docs]

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. [Thing you do NOT want — be specific]
2. [Thing you do NOT want — be specific]
3. [Thing you do NOT want — be specific]

**Deferred to future versions**:
1. [Thing for v2.0]
2. [Thing for v2.0]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | [H/M/L] | [H/M/L] | [Plan] |
| [Risk 2] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- [e.g., "Must use PostgreSQL — company standard"]
- [e.g., "Must deploy to AWS us-east-1 — data residency"]
- [e.g., "Must support IE11 — enterprise customers"]

**Soft Constraints** (preferred but negotiable):
- [e.g., "Prefer TypeScript but open to alternatives"]
- [e.g., "Prefer serverless but containers OK if needed"]

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [ ] Screenshots of running application
- [ ] Test result reports (JUnit XML, coverage HTML)
- [ ] Build logs showing zero errors
- [ ] CI/CD pipeline passing locally (act) and remotely
- [ ] Security scan reports (zero CRITICAL/HIGH)
- [ ] Performance benchmark results
- [ ] Deployment verification (health check passing)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Database migration scripts tested
- [ ] Dependency audit clean

**Reporting Frequency**: [Every 6 hours (default) / daily / per-wave / custom]

**Final Deliverable**: [PPTX presentation / PDF report / both / custom]

---

## 13. Additional Context

[Anything else the team should know — organizational context, political constraints, historical decisions, previous failed attempts, team culture, communication preferences, timezone constraints, etc.]

---

*Strategy Brief v3.0 — Amenthyx AI Teams*
*The more specific you are here, the better the team performs.*
