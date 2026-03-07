# Rust Systems Team — Tailored Strategy v3.3

> Pre-configured for **Rust systems programming and high-performance services with Actix-web/Axum, Tokio, and PostgreSQL**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team rust --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]
**One-Line Vision**: [FILL IN]
**Problem Statement**: [FILL IN]
**Desired Outcome**: [FILL IN]
**Project Type**: [FILL IN: Greenfield / Extending / Migration / Rewrite / Prototype / MVP / Production]
**Repository**: [FILL IN: GitHub URL or desired repo name]

---


## 1.1 Deliverable Product Target

> **MANDATORY** — The team MUST deliver a product that can be visualized, demonstrated, and evaluated.
> The Team Leader clarifies the delivery target during the 20-question discovery interview.

**Delivery Target**: [MVP — visually demonstrable minimum viable product / Production — enterprise-ready application for deployment / Prototype — functional proof of concept]

**What "Done" Looks Like**:
- [ ] Application is running and accessible (localhost, staging URL, or deployed)
- [ ] All P0 features are functional and demonstrable
- [ ] A non-technical person can use the core flow without assistance
- [ ] Screenshots of every major screen/feature exist in `.team/screenshots/final/`
- [ ] Documentation website is built and browsable

**Demo Requirements**:
- **Demo format**: [Live demo / Recorded walkthrough / Screenshots + documentation]
- **Demo audience**: [Technical team / Stakeholders / End users / Investors]
- **Demo environment**: [Local / Staging / Production]

**Visual Deliverables** (mandatory):
- [ ] Running application with real UI (not wireframes)
- [ ] Complete user flow from registration/login to core feature
- [ ] Responsive design (desktop + mobile if web/hybrid)
- [ ] Documentation website (`docs/`) with full project documentation
- [ ] `.team/screenshots/` with complete visual evidence

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

## 4. Technical Constraints *(pre-configured for Rust Systems Team)*

**Required Tech Stack**:
- **Language**: Rust 1.75+ (stable toolchain only)
- **Framework**: Actix-web / Axum (HTTP services) / Tokio (async runtime)
- **Database**: PostgreSQL (via sqlx or diesel) / RocksDB (embedded key-value)
- **Cache**: Custom in-memory (dashmap, moka) / Redis (via fred or redis-rs)
- **Message Queue**: Tokio channels (mpsc, broadcast) / NATS / Kafka (via rdkafka)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / bare metal — team's choice
- **Deployment**: Static binaries / Docker (scratch or distroless base — minimal attack surface)
- **CDN**: N/A (backend services) or CloudFront if serving assets
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL | Primary data store | Connection string (env, sqlx pool) | Pool max 50 |
| crates.io | Package registry | Public | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: cargo (Cargo.toml + Cargo.lock)

**Monorepo or Polyrepo**: Cargo workspace (multiple crates in one repo)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Latency P99 < 5ms (HTTP endpoints)
- Zero allocations in hot path (where applicable — benchmark-verified)
- Memory safety guaranteed (borrow checker — no runtime GC overhead)
- Binary size optimized (LTO, strip, opt-level=3 for release)

**Security**:
- Authentication: JWT / OAuth2 (via jsonwebtoken / oxide-auth crate)
- Authorization: RBAC (custom middleware / extractors)
- Memory safety: Rust borrow checker (compile-time guarantees — no buffer overflows, use-after-free, data races)
- Minimal `unsafe`: zero `unsafe` blocks preferred, documented + justified if required
- Dependency audit: `cargo audit` (RustSec advisory database)
- TLS: rustls (pure-Rust TLS — no OpenSSL dependency)
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Async I/O (Tokio work-stealing scheduler), connection pooling (sqlx/deadpool), horizontal scaling via containers, zero-copy parsing

**Availability**:
- Uptime target: 99.99% (Rust services have minimal crash surface)
- RTO: 1 minute (fast binary restart)
- RPO: 0 (stateless) or domain-specific
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- API documentation: OpenAPI (via utoipa / aide crate) with Swagger UI
- CLI tools: clap-based with --help, shell completions, man pages
- Library crates: rustdoc documentation with examples

**Observability**:
- Logging: tracing crate (structured, span-based) → JSON subscriber → ELK / Loki
- Metrics: Prometheus (via metrics crate + metrics-exporter-prometheus) + Grafana
- Tracing: OpenTelemetry (opentelemetry-rust) → Jaeger / Tempo
- Alerting: Grafana Alerting / PagerDuty (latency, error rate, resource usage)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (business logic), >= 90% (safety-critical / parsing code)

**Required Test Types**:
- [x] Unit tests (cargo test — functions, modules, error handling)
- [x] Integration tests (cargo test — tests/ directory, full binary invocation)
- [x] Benchmark tests (criterion — performance regression detection)
- [x] Property-based tests (proptest — edge cases, invariant validation)
- [x] Fuzz testing (cargo-fuzz / libFuzzer — input parsing, deserialization)
- [x] Clippy lint (cargo clippy -- -D warnings — zero warnings)
- [x] Format check (cargo fmt -- --check)
- [x] Dependency audit (cargo audit — zero known vulnerabilities)
- [ ] Unsafe audit (optional — cargo-geiger for unsafe usage tracking)
- [ ] Miri (optional — undefined behavior detection for unsafe code)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (cargo fmt, cargo clippy via pre-commit framework)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Multi-target builds (Linux x86_64, aarch64, macOS, Windows)
- [ ] Manual approval gate for release tags

**Testing Tools**: cargo test, criterion, proptest, cargo-fuzz, cargo-tarpaulin (coverage), cargo-audit, cargo-clippy, cargo-deny

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
- Domains/SSL: [FILL IN: $ or "N/A"]

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
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on business logic, >= 90% on safety-critical paths
- [ ] Zero CRITICAL/HIGH security vulnerabilities (cargo audit clean)
- [ ] E2E tests pass for all P0 flows
- [ ] Performance targets met (P99 < 5ms, benchmarks stable)
- [ ] Documentation complete (README, API docs via rustdoc, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Binary builds and deploys successfully
- [ ] cargo clippy -- -D warnings passes with zero warnings
- [ ] Zero `unsafe` blocks (or all documented + justified + audited)
- [ ] cargo deny check passes (license + advisory compliance)
- [ ] Property-based tests pass (proptest for critical invariants)

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
| Compilation times (long incremental builds) | M | L | sccache, cargo workspace splitting, feature flags, incremental compilation, CI caching |
| Crate ecosystem maturity (missing or immature libraries) | L | M | Evaluate crate quality (downloads, maintenance, issues) before adoption, maintain abstraction layers for swappability |
| Steep learning curve for contributors | M | M | Comprehensive onboarding docs, code review focus on idiomatic Rust, pair programming, well-documented patterns |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Stable Rust only (no nightly features in production code)
- cargo clippy clean with `-D warnings`
- Zero `unsafe` blocks preferred (documented + justified if required)
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
- [x] Additional Systems Engineer (Rust, async, Tokio, networking)
- [x] Additional QA Engineer (cargo test, property-based testing, fuzzing)
- [x] Performance Specialist (criterion benchmarks, flamegraphs, allocation profiling)
- [x] Unsafe Audit Specialist (cargo-geiger, Miri, safety review)
- [x] DevOps Specialist (Docker, CI/CD, cross-compilation, release engineering)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (cargo-tarpaulin — HTML + lcov)
- [x] Criterion benchmark results (performance regression comparison, flamegraphs)
- [x] cargo clippy results (zero warnings)
- [x] cargo audit results (zero known vulnerabilities)
- [x] cargo deny results (license + advisory compliance)
- [x] Proptest results (property-based invariants verified)
- [x] Fuzz testing results (crash-free for N iterations)
- [x] Binary size report (optimized, stripped, compared to baseline)
- [x] CI/CD pipeline screenshot (all checks green, multi-target if applicable)
- [x] Architecture diagram (crate dependency graph, data flow, async task topology)

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


## 12.2 Screenshots & Visual Evidence

> **MANDATORY** — The `.team/screenshots/` directory is required for every project.

**Screenshot Directory Structure**:
```
.team/screenshots/
├── setup/                    # Environment setup, initial state
├── features/                 # Feature implementation evidence
│   └── {feature-name}/       # before.png + after.png per feature
├── testing/                  # Test results, coverage reports
├── deployment/               # Deployment evidence
├── mission-control/          # Dashboard captures at wave completions
├── errors/                   # Bug evidence
└── final/                    # Final product walkthrough
    ├── desktop/
    ├── tablet/
    └── mobile/
```

**Screenshot Requirements**:
- [ ] Before/after screenshots for every P0 feature
- [ ] Test result screenshots (unit, integration, e2e)
- [ ] Deployment evidence screenshots
- [ ] Final product screenshots (all viewports)
- [ ] Mission Control dashboard at wave completions
- [ ] Error and empty state screenshots

**Naming Convention**: `{date}_{agent}_{description}.png`

## 12.3 Documentation Website

> **MANDATORY** — Every project includes a `docs/` React documentation site generated by a Documentation Agent.

**Documentation Scope**:
- [ ] Project overview and architecture diagram
- [ ] Getting started / installation guide
- [ ] API reference (auto-generated where possible)
- [ ] User guide with embedded screenshots from `.team/screenshots/`
- [ ] Configuration reference
- [ ] Deployment guide
- [ ] Decision log (key architectural decisions)
- [ ] Changelog

**Tech Stack**: React + Vite + MDX | Dark mode + mobile-responsive
**Agent**: Documentation Engineer (DOCS) — spawned in Wave 2, finalizes in Wave 4
**Deliverable**: Buildable with `npm run build`, servable with `npm run dev`

## 12.4 Mission Control PDF Report

> **MANDATORY** — Comprehensive PDF report downloadable from Mission Control dashboard.

**PDF Report Includes**:
- [ ] Executive summary with key metrics
- [ ] Full discovery interview (20+ Q&A)
- [ ] Complete decision log with rationale
- [ ] Task execution timeline (planned vs actual)
- [ ] Git commit history with agent attribution
- [ ] Quality report (coverage, bugs, security scans)
- [ ] Agent performance metrics
- [ ] Embedded screenshots (not links)
- [ ] Cost analysis (budget vs actual)
- [ ] Deliverables checklist with evidence

**Generation**: Automatic at end of every wave + on-demand via `team report pdf`
**Storage**: `.team/reports/PROJECT_REPORT_{date}.pdf` (follows No-Delete Rule)

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `ai-team` (MANDATORY — all teams use this branch)
**Merge to main**: ONLY after Team Leader receives explicit user approval (hard gate)

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

*Rust Systems Team Strategy v3.3 — Amenthyx AI Teams*
*Pre-configured for Rust + Actix-web/Axum + Tokio + PostgreSQL high-performance systems*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven | Deliverable Products | 20-Question Discovery | Screenshots | Docs Website | PDF Reports*
