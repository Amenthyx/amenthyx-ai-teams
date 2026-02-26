# Elixir & Phoenix Team — Tailored Strategy v3.1

> Pre-configured for **Elixir/OTP, Phoenix LiveView, and real-time systems**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team elixirPhoenix --strategy path/to/this-file.md`

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

**Primary Users**: [FILL IN — e.g., developers, real-time application users, platform operators]

**Secondary Users**: [FILL IN — e.g., DevOps teams, business analysts, API consumers]

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
- **Language**: Elixir 1.16+ (Erlang/OTP 26+)
- **Framework**: Phoenix 1.7+ / Phoenix LiveView / Ecto
- **Database**: PostgreSQL 16
- **Cache**: ETS (in-process, BEAM-native) / Mnesia (distributed, BEAM-native) / Cachex (Elixir caching library)
- **Message Queue**: Oban (persistent job queue backed by PostgreSQL) / Broadway (data ingestion/processing pipelines)

**Hosting/Infrastructure**:
- **Cloud Provider**: Fly.io / AWS / GCP / self-hosted
- **Deployment**: Docker + Fly.io / Docker + Kubernetes / Mix release
- **CDN**: Fly.io edge / CloudFront / Cloudflare
- **Domain**: [FILL IN or "TBD"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| PostgreSQL 16 | Primary data store + Oban job queue | Connection string (TLS) | Connection pool limit |
| Phoenix PubSub | Real-time event broadcasting | Internal (BEAM) | N/A |
| External APIs | [FILL IN per integration] | API key / OAuth | [FILL IN per service] |
| Email (Swoosh) | Transactional email | SMTP / API key | Per provider |

**Existing Codebase**: [FILL IN — Path to existing Phoenix project, or "greenfield"]

**Package Manager**: mix (Hex package manager)

**Monorepo or Polyrepo**: Umbrella project (apps/) or single Phoenix application

**Linting**:
- `mix credo` — Elixir code analysis (consistency, readability, refactoring opportunities)
- `mix format --check-formatted` — Elixir code formatting enforcement
- `dialyzer` — Static type analysis (success typing)
- `mix deps.audit` — Dependency vulnerability checking

---

## 5. Non-Functional Requirements

**Performance**:
- Response time: P99 < 50ms (HTTP + LiveView)
- Concurrent connections: 100K+ simultaneous WebSocket connections per node
- Memory per node: < 200MB baseline (excluding cached data)
- Hot code reload: Zero-downtime deployments via BEAM hot code loading

**Security**:
- Authentication: Plug.CSRFProtection (CSRF), Phoenix.Token (signed tokens), phx_gen_auth
- Authorization: Policy-based authorization (Bodyguard / custom plugs)
- Password hashing: Argon2 (via argon2_elixir / bcrypt_elixir)
- Transport: TLS everywhere, secure WebSocket (wss://)
- Headers: Secure HTTP headers (Plug.SSL, content-security-policy, x-frame-options)
- Compliance: [FILL IN — SOC 2 / GDPR / HIPAA / none]

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal (BEAM clustering, libcluster) + vertical (BEAM efficiency)

**Availability**:
- Uptime target: 99.99% (leveraging OTP supervision trees and let-it-crash)
- Recovery time objective (RTO): < 5 minutes (OTP auto-restart)
- Recovery point objective (RPO): < 1 minute (PostgreSQL streaming replication)
- Multi-region: [FILL IN — Fly.io multi-region / single region / future]

**Accessibility**:
- WCAG level: AA (LiveView renders HTML — standard web accessibility)
- Screen reader support: Required (proper ARIA attributes on LiveView components)
- Internationalization: [FILL IN — Gettext for i18n, languages needed]

**Observability**:
- Logging: Logger (structured JSON) with metadata
- Metrics: Telemetry + Prometheus (via PromEx / TelemetryMetricsPrometheus)
- Tracing: Phoenix LiveDashboard (built-in, real-time) / OpenTelemetry
- Alerting: PagerDuty / Opsgenie / Slack (via webhook)

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% line coverage (mix test --cover)

**Required Test Types**:
- [x] Unit tests — ExUnit for contexts, schemas, and business logic
- [x] Integration tests — ExUnit with Ecto sandbox for database interactions
- [x] LiveView tests — Phoenix.LiveViewTest for interactive UI testing
- [x] Browser tests — Wallaby (headless Chrome) for full E2E flows
- [x] Performance benchmarks — Benchee for critical hot paths
- [x] Property-based tests — StreamData for generative testing
- [x] Security scanning — mix deps.audit, Sobelow (Phoenix security checker)
- [x] Dialyzer — type specification validation (zero warnings)
- [ ] Load tests — [FILL IN if concurrency stress testing needed]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (mix format --check-formatted, mix credo --strict, dialyzer)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated test suite on every PR (ExUnit + Wallaby + Dialyzer)
- [x] Manual approval gate for production deployment
- [x] Database migration validation in CI

**Testing Tools**: ExUnit, Wallaby, Benchee, StreamData, Sobelow, Dialyzer, mix test --cover, act

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
- Infrastructure: [FILL IN — $/month for Fly.io / cloud hosting]
- Third-party APIs: [FILL IN — $/month or "free tier only"]
- Domains/SSL: [FILL IN — $ or "already owned"]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, hosting provisioning, domain purchases, API subscriptions
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any production deployment cost

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Hosting (Fly.io / cloud) | [FILL IN] | Card / free tier | No — ask first |
| PostgreSQL managed (if not self-hosted) | [FILL IN] | Card / existing credits | No — ask first |
| Domain registration | [FILL IN] | Card | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Test coverage >= 80% (mix test --cover)
- [ ] Zero CRITICAL/HIGH security vulnerabilities (Sobelow clean)
- [ ] Dialyzer clean (zero warnings)
- [ ] mix credo --strict passes
- [ ] P99 response time < 50ms
- [ ] OTP supervision trees properly configured
- [ ] LiveView real-time features verified
- [ ] Database migrations reversible and tested
- [ ] BEAM clustering verified (if multi-node)
- [ ] E2E tests pass for all P0 user flows (Wallaby)
- [ ] Performance benchmarked (Benchee results documented)
- [ ] Documentation complete (README, API docs, architecture docs)
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

**Technical References**: [FILL IN — e.g., Phoenix docs, Elixir in Action, Designing Elixir Systems with OTP]

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
| Elixir talent scarcity (difficulty finding/onboarding Elixir developers) | M | M | Comprehensive documentation, code conventions, pair programming patterns, Elixir learning resources |
| BEAM ecosystem library gaps (missing libraries compared to larger ecosystems) | M | M | NIFs for performance-critical code, Ports for external tool integration, evaluate alternatives early |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Hard Constraints** (non-negotiable):
- OTP supervision trees for all stateful processes
- Let-it-crash philosophy — no defensive programming around expected failures
- Dialyzer clean (zero warnings) before merge
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
- A single Phoenix context or LiveView has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking issues requiring parallel fix agents
- The strategy explicitly requests parallel feature streams

**Agent types the PM may add**:
- [ ] Additional Elixir Engineers (for context and business logic)
- [ ] QA Engineers (for comprehensive test suites)
- [ ] OTP Design Specialist (for supervision tree architecture, GenServer patterns)
- [ ] Performance Specialist (for BEAM tuning, clustering, load testing)
- [ ] LiveView Specialist (for complex real-time UI interactions)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] ExUnit test results with coverage report (mix test --cover)
- [x] Dialyzer output (zero warnings)
- [x] Credo analysis report (mix credo --strict)
- [x] Sobelow security scan results
- [x] Wallaby E2E test results
- [x] Benchee performance benchmark results
- [x] LiveDashboard screenshots (process monitoring, metrics)
- [x] Database migration verification logs
- [x] CI/CD pipeline passing (act + remote)
- [x] Deployment health check verification

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
- **What counts as "unsure"**: Any action that might delete data, corrupt database state, cost money, affect production processes, break OTP supervision trees, be irreversible, or fall outside the stated strategy scope
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
- [x] Source code changes (contexts, LiveViews, schemas, migrations)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: existing Phoenix project structure, umbrella vs single app decision, real-time requirements, clustering needs, deployment platform preferences, Elixir version constraints, etc.]

---

*Elixir & Phoenix Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Elixir/OTP, Phoenix LiveView, and real-time systems*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
