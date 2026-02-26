# PHP/Laravel Team — Tailored Strategy v3.1

> Pre-configured for **PHP/Laravel web applications with Livewire, Inertia.js, and MySQL/PostgreSQL**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team phpLaravel --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for PHP/Laravel Team)*

**Required Tech Stack**:
- **Language**: PHP 8.3+
- **Framework**: Laravel 11 / Livewire 3 / Inertia.js
- **Database**: MySQL 8 / PostgreSQL 16
- **Cache**: Redis / Laravel Cache (file, database, or Redis driver)
- **Message Queue**: Laravel Queue (Redis driver / Amazon SQS)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / DigitalOcean / Hetzner — team's choice
- **Deployment**: Laravel Forge / Docker / Laravel Vapor (serverless on AWS Lambda)
- **CDN**: CloudFront / Cloudflare — team's choice
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| MySQL 8 / PostgreSQL 16 | Primary data store | Connection string (.env) | Connection pool max 50 |
| Redis | Caching + queue backend | AUTH token (.env) | N/A |
| Laravel Forge / Vapor | Deployment automation | API key (.env) | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: Composer

**Repo Structure**: Standard Laravel structure (`app/`, `routes/`, `resources/`, `database/`, `tests/`)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- API response time P95 < 200ms
- Memory usage < 256MB per worker process
- N+1 query detection enabled (Laravel Debugbar in dev, strict mode in production)
- Database query time P95 < 50ms

**Security**:
- Authentication: Laravel Sanctum (SPA/API tokens) / Laravel Passport (OAuth2)
- Authorization: Role-Based Access Control via Spatie Laravel Permission
- CSRF protection: Laravel built-in CSRF middleware
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 in transit, AES-256 at rest (Laravel encrypt helper)

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal scaling (multiple PHP-FPM workers behind load balancer), Redis cluster for cache/sessions, read replicas for database, queue workers scaled independently

**Availability**:
- Uptime target: 99.9%
- RTO: 1 hour
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- WCAG 2.1 AA compliance
- Screen reader compatible (aria attributes)
- Keyboard navigation support
- i18n-ready with Laravel localization

**Observability**:
- Logging: Monolog (structured JSON) — Laravel logging channels
- Metrics: Prometheus via laravel-prometheus package + Grafana dashboards
- Tracing: Laravel Telescope (local/staging), Sentry (production)
- Alerting: Sentry alerting / PagerDuty integration
- Debugging: Laravel Debugbar (dev only), Laravel Telescope

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage

**Required Test Types**:
- [x] Unit tests (Pest — models, services, actions)
- [x] Feature/integration tests (Pest — HTTP tests, database interactions)
- [x] End-to-end tests (Laravel Dusk — critical user flows)
- [x] Performance / load tests (k6 — API load, soak, stress)
- [x] Static analysis (PHPStan level max via Larastan)
- [x] Code style checks (PHP-CS-Fixer / Laravel Pint)
- [ ] Visual regression tests (optional — Dusk screenshots)
- [ ] Chaos engineering (optional — future phase)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (PHP-CS-Fixer, PHPStan via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: Pest, PHPUnit, Laravel Dusk, Larastan (PHPStan), PHP-CS-Fixer, Pint, k6

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
| Laravel Forge | ~$12/mo | Card | No — ask first |
| Laravel Vapor | ~$40/mo | Card | No — ask first |
| AWS / DigitalOcean | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage (Pest coverage report)
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows (Laravel Dusk)
- [ ] Performance targets met (API P95 < 200ms, N+1 queries eliminated)
- [ ] PHPStan passes at max level with zero errors
- [ ] Documentation complete (README, API docs, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds
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
| PHP performance limits under high concurrency | M | M | Opcache tuning, queue offloading for heavy tasks, horizontal scaling, consider Octane for long-running processes |
| Laravel ecosystem lock-in (Forge, Vapor, packages) | L | M | Abstract service layer, use interfaces for third-party integrations, document alternatives |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Laravel conventions enforced (naming, directory structure, Eloquent patterns)
- PHPStan at max level — zero errors before merge
- Pest for all tests (not raw PHPUnit)
- Conventional commits enforced via commitlint

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
- [x] Additional PHP Engineer (Laravel backend)
- [x] Additional Frontend Engineer (Livewire / Inertia.js / Vue / React)
- [x] Additional QA Engineer (Pest / Dusk / k6)
- [x] Database Specialist (MySQL/PostgreSQL optimization, migration design)
- [x] DevOps Specialist (Forge, Vapor, Docker, CI/CD)
- [x] Performance Specialist (Opcache, query optimization, caching strategy)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Pest --coverage output — HTML + Clover XML)
- [x] Laravel Dusk E2E test results (screenshots + console output)
- [x] k6 load test results (summary JSON + HTML)
- [x] PHPStan analysis report (max level, zero errors)
- [x] PHP-CS-Fixer / Pint lint report (zero violations)
- [x] Security scan results (composer audit, Snyk, or equivalent)
- [x] Database migration log (all migrations listed, reversibility verified)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Deployment log (production deployment evidence)
- [x] Architecture diagram (system components, data flow)

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
**Branch**: `team/phpLaravel/execution`
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

*PHP/Laravel Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for PHP 8.3 + Laravel 11 + Livewire 3 + MySQL/PostgreSQL web development*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
