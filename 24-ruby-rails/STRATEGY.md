# Ruby on Rails Team — Tailored Strategy v3.1

> Pre-configured for **Ruby on Rails full-stack web applications with Hotwire/Turbo/Stimulus**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team rubyRails --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]

**One-Line Vision**: [FILL IN]

**Problem Statement**: [FILL IN]

**Desired Outcome**: [FILL IN]

**Project Type**: [FILL IN — Greenfield / Extending existing codebase / Migration / Rewrite / Prototype / MVP / Production]

**Repository**: [FILL IN — GitHub URL or desired repo name]

---

## 2. Target Audience

**Primary Users**: [FILL IN — e.g., SaaS customers, internal users, marketplace participants]

**Secondary Users**: [FILL IN — e.g., administrators, API consumers, support teams]

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [FILL IN] |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: Ruby 3.3+
- **Framework**: Rails 7.1+ (Hotwire / Turbo / Stimulus)
- **Database**: PostgreSQL 16
- **Cache**: Redis (Action Cable WebSocket backend + Rails caching + session store)
- **Message Queue**: Sidekiq (Redis-backed) / Solid Queue (database-backed, Rails 7.1+ native)

**Hosting/Infrastructure**:
- **Cloud Provider**: Fly.io / Heroku / AWS / self-hosted
- **Deployment**: Docker / Kamal (Rails-native deployer) / Heroku / Fly.io
- **CDN**: Cloudflare / CloudFront / Fly.io edge
- **Domain**: [FILL IN or "TBD"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| PostgreSQL 16 | Primary data store | Connection string (TLS) | Connection pool limit |
| Redis | Cache + Action Cable + Sidekiq | Connection string (TLS) | Connection pool limit |
| Email (Action Mailer) | Transactional email | SMTP / API (SendGrid, Postmark) | Per provider |
| File storage (Active Storage) | File uploads | S3/GCS/Azure Blob IAM | Per plan |

**Existing Codebase**: [FILL IN — Path to existing Rails app, or "greenfield"]

**Package Manager**: Bundler (Gemfile)

**Monorepo or Polyrepo**: Single Rails application

**Linting**:
- `RuboCop` — Ruby style and code quality enforcement
- `Standard Ruby` — opinionated Ruby style (alternative to RuboCop config)
- `Brakeman` — Rails-specific security static analysis
- `ERB Lint` — ERB template linting

---

## 5. Non-Functional Requirements

**Performance**:
- Response time: P95 < 200ms (server-side rendering)
- N+1 query detection: Zero N+1 queries (enforced by Bullet gem)
- Memory usage: < 300MB RSS per process
- Turbo Frame/Stream latency: < 100ms for partial updates

**Security**:
- Authentication: Devise / OmniAuth / custom (Rails has_secure_password)
- Authorization: Pundit / Action Policy (policy objects)
- CSRF protection: Rails built-in (authenticity token)
- Security scanning: Brakeman clean (zero CRITICAL/HIGH)
- Headers: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options
- Transport: TLS everywhere, Secure cookies, SameSite cookie attribute
- Compliance: [FILL IN — SOC 2 / GDPR / HIPAA / PCI-DSS / none]

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal (multiple Puma workers, Sidekiq processes) + read replicas for PostgreSQL

**Availability**:
- Uptime target: 99.9%
- Recovery time objective (RTO): < 30 minutes
- Recovery point objective (RPO): < 5 minutes (PostgreSQL WAL streaming)
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- WCAG level: AA
- Screen reader support: Required (semantic HTML, ARIA attributes)
- Internationalization: [FILL IN — Rails I18n, languages needed]

**Observability**:
- Logging: Rails logger (structured JSON via Lograge) + request ID tracking
- Metrics: Prometheus (via yabeda gem family) + Grafana
- Tracing: Skylight / Scout APM / Datadog APM (Rails-specific tracing)
- Alerting: Sentry (errors) + PagerDuty / Opsgenie (infrastructure)

---

## 6. Testing Requirements

**Test Coverage Target**: >= 90% line coverage (SimpleCov)

**Required Test Types**:
- [x] Unit tests — RSpec (models, services, form objects, policies)
- [x] Integration tests — RSpec request specs (controllers, API endpoints)
- [x] System tests — Capybara (full-stack browser testing with headless Chrome)
- [x] Factory validation — FactoryBot (all factories valid, no orphaned factories)
- [x] N+1 detection — Bullet gem (zero N+1 queries in test suite)
- [x] Security scanning — Brakeman (zero CRITICAL/HIGH), bundler-audit (gem vulnerabilities)
- [x] Performance tests — rack-test for response time regression
- [x] Database tests — migration reversibility, seed data validation
- [ ] Visual regression tests — [FILL IN if needed]
- [ ] Accessibility tests — [FILL IN — axe-core / Lighthouse]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (RuboCop, Brakeman, ERB Lint)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated test suite on every PR (RSpec + Capybara + Brakeman)
- [x] Manual approval gate for production deployment
- [x] Database migration safety checks (strong_migrations gem)

**Testing Tools**: RSpec, Capybara, FactoryBot, SimpleCov, Bullet, Brakeman, bundler-audit, rack-test, act

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN]

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M4 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Budget Constraints**:
- Infrastructure: [FILL IN — $/month for hosting, database, Redis]
- Third-party APIs: [FILL IN — $/month or "free tier only"]
- Domains/SSL: [FILL IN — $ or "already owned"]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, hosting provisioning, domain purchases, API subscriptions, managed database upgrades
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any production deployment cost

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Hosting (Fly.io / Heroku / cloud) | [FILL IN] | Card / free tier | No — ask first |
| PostgreSQL managed | [FILL IN] | Card / existing credits | No — ask first |
| Redis managed | [FILL IN] | Card / existing credits | No — ask first |
| Domain registration | [FILL IN] | Card | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Test coverage >= 90% (SimpleCov)
- [ ] Zero CRITICAL/HIGH findings in Brakeman scan
- [ ] Zero gem vulnerabilities (bundler-audit clean)
- [ ] Zero N+1 queries (Bullet gem clean)
- [ ] P95 response time < 200ms
- [ ] Memory usage < 300MB RSS per process
- [ ] Database migrations reversible (strong_migrations clean)
- [ ] All RSpec + Capybara tests passing
- [ ] Hotwire/Turbo real-time features verified
- [ ] Action Cable (WebSocket) tested (if applicable)
- [ ] Sidekiq/Solid Queue jobs tested (retry, failure handling)
- [ ] Documentation complete (README, API docs, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Production deployment succeeds

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Design Inspiration**: [FILL IN]

**Technical References**: [FILL IN — e.g., Rails guides, Hotwire docs, The Rails Way, Ruby on Rails Tutorial]

**Internal Documentation**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. [FILL IN]
2. [FILL IN]
3. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]
2. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Ruby performance limits (single-threaded GIL, memory bloat over time) | M | M | Puma multi-worker mode, YJIT enabled, memory-conscious coding, Ractor for CPU-bound tasks, horizontal scaling |
| Gem dependency conflicts (version incompatibilities during upgrades) | M | M | Gemfile.lock version pinning, regular dependency updates (Dependabot), integration test suite, staged gem upgrades |
| Rails upgrade pain (major version breaking changes) | M | M | Rails upgrade guides, deprecation tracking, comprehensive test suite, staged upgrade (deprecation fixes first) |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Hard Constraints** (non-negotiable):
- Rails conventions followed (Convention over Configuration)
- No N+1 queries — Bullet gem enforced in development and test
- All database migrations must be reversible (strong_migrations gem)
- Conventional commits enforced on all repositories
- All changes via Pull Request with CI checks passing

**Soft Constraints** (preferred but negotiable):
- [FILL IN]
- [FILL IN]

---

## 11.1 Dynamic Agent Scaling

> The PM may spawn additional agents beyond the default roster if the workload requires it.

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 15

**Scaling triggers** (PM spawns extra agents when):
- A single Rails feature has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking bugs requiring parallel fix agents
- The strategy explicitly requests parallel feature development streams

**Agent types the PM may add**:
- [ ] Additional Rails Engineers (for feature development)
- [ ] QA Engineers (for comprehensive test coverage)
- [ ] Performance Specialist (for N+1 hunting, query optimization, caching strategy)
- [ ] Database Specialist (for complex migrations, query tuning, replication)
- [ ] Frontend Specialist (for Hotwire/Turbo/Stimulus, ViewComponent)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] RSpec test results with SimpleCov coverage report (>= 90%)
- [x] Capybara system test results
- [x] Brakeman security scan report (zero CRITICAL/HIGH)
- [x] bundler-audit report (zero vulnerable gems)
- [x] Bullet N+1 detection report (clean)
- [x] Response time benchmarks (P50, P95, P99)
- [x] Database migration verification logs (reversible)
- [x] Strong_migrations compliance report
- [x] CI/CD pipeline passing (act + remote)
- [x] Production deployment health check passing

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, database rows, migrations, log entries, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might delete data, run irreversible migrations, cost money, affect production database, break API contracts, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.

**Auto-sync frequency**: Every agent completion

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `ai-team` (MANDATORY — all teams use this branch)
- Merge to main: ONLY after Team Leader receives explicit user approval (hard gate)

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (models, controllers, views, migrations, jobs)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: existing Rails app state, Ruby version constraints, gem preferences, deployment platform, API-only mode vs full-stack, authentication provider, background job requirements, etc.]

---

*Ruby on Rails Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Ruby on Rails full-stack web applications with Hotwire/Turbo/Stimulus*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
