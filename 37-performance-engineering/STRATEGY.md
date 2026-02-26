# Performance Engineering Team — Tailored Strategy v3.1

> Pre-configured for **load testing, performance profiling, bottleneck analysis, and capacity planning with Go, Python, k6, and Grafana**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team perfEng --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Performance Engineering Team)*

**Required Tech Stack**:
- **Language**: Go 1.22+ (load test tooling, custom benchmarks) / Python 3.12+ (analysis, scripting, reporting)
- **Load Testing**: k6 (primary), Grafana k6 Cloud (distributed), Locust (Python-native), Apache JMeter (protocol-heavy), wrk2 (HTTP benchmarking), vegeta (HTTP load)
- **Database**: TimescaleDB (time-series metrics) / InfluxDB (real-time metrics ingestion)
- **Profiling**: Go pprof, py-spy, perf, flamegraph, async-profiler (JVM targets)
- **APM**: Grafana + Prometheus + Tempo (distributed tracing)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP — team's choice (load generators need scalable compute)
- **Deployment**: Docker + Kubernetes (load generator fleet) / Docker Compose (local)
- **Load Generator Fleet**: Distributed k6 executors or Locust workers across regions
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| TimescaleDB / InfluxDB | Metrics storage | Connection string (env) | N/A |
| Grafana Cloud | Dashboards + alerting | API key (env) | Per plan |
| Prometheus | Metrics scraping | Service discovery | N/A |
| Tempo | Distributed tracing | OTLP endpoint (env) | N/A |
| k6 Cloud | Distributed load tests | API token (env) | Per plan |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: Go modules (Go) / poetry (Python)

**Monorepo or Polyrepo**: Monorepo (load tests, analysis scripts, dashboards co-located)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- All benchmarks must produce reproducible results (coefficient of variation < 5%)
- Baseline comparisons required for every performance claim
- Statistical significance (p < 0.05) required for all improvement/degradation claims
- Load test results must include P50, P95, P99, and P99.9 latency percentiles
- Throughput measurements must report sustained RPS over minimum 5-minute windows

**Security**:
- Authentication: API keys for cloud services, mTLS for internal load generators
- Authorization: RBAC for dashboard access, test execution permissions
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 for all metrics transport, encrypted credentials in vault

**Scalability**:
- Load generator fleet: auto-scale based on target RPS
- Metrics storage: retention policies (raw 7d, 1m aggregates 30d, 1h aggregates 1y)
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal scaling of load generators, TimescaleDB continuous aggregates

**Availability**:
- Uptime target: 99.9% (metrics infrastructure)
- RTO: 1 hour
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- Grafana dashboards accessible via WCAG 2.1 AA compliant web UI
- Reports exportable as PDF for stakeholder distribution
- CLI tools with clear help text and structured JSON output

**Observability**:
- Logging: Structured JSON logs (zerolog for Go, structlog for Python)
- Metrics: Prometheus exposition format, Grafana dashboards with pre-built panels
- Tracing: OpenTelemetry (Tempo backend) for distributed load test correlation
- Alerting: Grafana Alerting for SLA breach detection, performance regression alerts

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (Go tooling), >= 75% (Python analysis scripts)

**Required Test Types**:
- [x] Unit tests (Go testing + testify / pytest for Python)
- [x] Integration tests (k6 scripts against staging, Locust load profiles)
- [x] Load tests (k6 — stress, soak, spike, breakpoint scenarios)
- [x] Benchmark tests (Go benchmark framework, custom microbenchmarks)
- [x] Baseline regression tests (automated comparison against stored baselines)
- [x] Statistical validation tests (confidence intervals, hypothesis testing)
- [ ] Chaos engineering (optional — network partition, resource exhaustion during load)
- [ ] Distributed load tests (optional — multi-region k6 Cloud execution)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (golangci-lint, black, ruff, mypy via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated baseline comparison on every PR
- [ ] Nightly soak tests against staging environment

**Testing Tools**: k6, Locust, Go benchmark, pytest, vegeta, wrk2, Grafana k6 Cloud, custom statistical validators

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
| Grafana Cloud | ~$29/mo | Card | No — ask first |
| k6 Cloud | ~$99/mo | Card | No — ask first |
| AWS/GCP (load generators) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% Go test coverage, >= 75% Python test coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] All load test scenarios produce reproducible results (CV < 5%)
- [ ] Baseline comparisons automated and integrated into CI
- [ ] Statistical significance validated for all performance claims
- [ ] Grafana dashboards deployed with all required panels
- [ ] Documentation complete (README, test playbooks, dashboard guide)
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
| Non-reproducible benchmark results due to environment variance | H | H | Isolated test environments, warm-up phases, statistical validation (CV < 5%) |
| Load generator resource exhaustion skewing results | M | H | Separate load generator monitoring, auto-scale fleet, resource budgets |
| Target system auto-scaling masking real bottlenecks | M | M | Test at fixed scale first, then test scaling behavior separately |
| Metrics storage costs growing with high-cardinality data | M | M | Retention policies, continuous aggregates, label cardinality limits |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Reproducible benchmarks: every test must produce consistent results (CV < 5%)
- Baseline comparisons required: no "it's fast" without numbers and prior baseline
- Statistical significance: p < 0.05 for all performance improvement/degradation claims
- All metrics must include timestamp, environment metadata, and test configuration hash

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
- [x] Additional Load Test Engineer (k6 / Locust scenarios)
- [x] Additional Go Performance Engineer (pprof, benchmarks, profiling)
- [x] Additional Python Analyst (statistical analysis, reporting)
- [x] Database Performance Specialist (TimescaleDB / InfluxDB tuning)
- [x] DevOps Specialist (load generator fleet, CI/CD, infrastructure)
- [x] APM Specialist (Grafana, Prometheus, Tempo dashboards and alerts)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Go cover + pytest-cov — HTML + lcov)
- [x] k6 load test results (summary JSON + HTML report + Grafana dashboard link)
- [x] Baseline comparison reports (before/after with statistical significance)
- [x] Flamegraph / profiling outputs (Go pprof SVG, py-spy flamegraphs)
- [x] Grafana dashboard screenshots (all critical panels populated)
- [x] Prometheus metrics validation (all expected metrics present and scraped)
- [x] Reproducibility evidence (3+ runs with CV < 5%)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Capacity planning model (projected headroom based on load test data)
- [x] Architecture diagram (load generator fleet, metrics pipeline, target system)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Benchmark data**: ALL historical results retained for trend analysis

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/perfEng/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (load test results, flamegraphs, baselines)
- [x] Source code changes (k6 scripts, Go benchmarks, Python analysis)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Performance Engineering Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Go + Python + k6 + Grafana + Prometheus + TimescaleDB performance engineering*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
