# SRE Team — Tailored Strategy v3.1

> Pre-configured for **Site Reliability Engineering, incident response, observability, and infrastructure reliability**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team sre --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for SRE Team)*

**Required Tech Stack**:
- **Language**: Go / Python 3.12+ / Bash (scripting)
- **Framework**: Prometheus / Grafana / Terraform / Ansible
- **Database**: PostgreSQL (SLO/SLI tracking) / InfluxDB / VictoriaMetrics (metrics TSDB)
- **Cache**: Redis (alerting state, dedup)
- **Message Queue**: Kafka (event bus for alerts, audit events)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Azure — team's choice
- **Deployment**: Docker + Kubernetes (all tooling containerized)
- **CDN**: N/A (internal tooling)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Prometheus + Thanos | Metrics collection + long-term storage | mTLS | N/A |
| Grafana | Dashboards + alerting | OIDC / API key | N/A |
| Loki | Log aggregation | mTLS | N/A |
| Tempo | Distributed tracing | mTLS | N/A |
| PagerDuty / Opsgenie | Incident management | API key (.env) | Rate limited |
| Terraform | Infrastructure as Code | Cloud IAM | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: go mod / pip / brew

**Repo Structure**: Monorepo (`terraform/`, `ansible/`, `dashboards/`, `alerts/`, `runbooks/`, `scripts/`, `tools/`)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Alert latency: < 30 seconds (from metric breach to notification)
- MTTR (Mean Time to Recovery): < 30 minutes
- Deploy frequency: > daily (continuous delivery)
- Change failure rate: < 15%

**Security**:
- Authentication: mTLS for service-to-service, OIDC/SSO for human access
- Authorization: RBAC (Kubernetes RBAC + Grafana org roles)
- Audit logging: All infrastructure changes logged with user identity
- Secrets management: HashiCorp Vault (no secrets in code, configs, or CI vars)
- Least-privilege: All service accounts scoped to minimum required permissions
- Compliance: [FILL IN]

**Scalability**:
- Expected launch services monitored: [FILL IN]
- Expected 6-month services: [FILL IN]
- Expected 1-year services: [FILL IN]
- Scaling strategy: Thanos for multi-cluster Prometheus federation, Loki for horizontally-scalable logs, VictoriaMetrics for high-cardinality metrics

**Availability**:
- Monitoring stack uptime target: 99.99% (monitoring must be more reliable than what it monitors)
- RTO: 15 minutes (monitoring stack self-recovery)
- RPO: 1 minute (metrics data)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- Grafana dashboards: clear color contrast, colorblind-friendly palettes
- Runbooks: plain language, step-by-step, accessible to on-call engineers of all levels

**Observability**:
- Metrics: Prometheus + Thanos (long-term) / VictoriaMetrics
- Logs: Loki (structured, labeled)
- Traces: Tempo (distributed tracing with trace-to-log correlation)
- Dashboards: Grafana (RED method: Rate, Errors, Duration for every service)
- Alerting: Grafana Alerting → PagerDuty / Opsgenie (tiered: P1-P4)
- SLO tracking: Sloth or Pyrra for SLO-as-code

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (Go tools), >= 70% (Python scripts), 100% (Terraform modules)

**Required Test Types**:
- [x] Unit tests (go test — Go tools, pytest — Python scripts)
- [x] Infrastructure tests (Terratest — Terraform modules)
- [x] Integration tests (alert rule validation, dashboard JSON lint)
- [x] Chaos engineering (Litmus / Chaos Mesh — failure injection)
- [x] Runbook validation (manual dry-run for every runbook)
- [x] Alert rule testing (promtool test rules)
- [ ] Load testing on monitoring stack (optional — Prometheus stress test)
- [ ] Game days (optional — scheduled incident simulation)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (golangci-lint, ruff, yamllint, shellcheck via pre-commit framework)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Terraform plan required on every PR (no blind applies)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production infrastructure changes

**Testing Tools**: go test, pytest, Terratest, Litmus/Chaos Mesh, promtool, yamllint, shellcheck

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
| PagerDuty | ~$21/user/mo | Card | No — ask first |
| Grafana Cloud | Usage-based | Card | No — ask first |
| AWS/GCP (monitoring infra) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 SLOs defined and instrumented
- [ ] >= 80% test coverage on Go/Python tools
- [ ] Zero CRITICAL/HIGH security vulnerabilities in monitoring stack
- [ ] All alerts have corresponding runbooks
- [ ] Alert latency < 30 seconds verified via chaos test
- [ ] MTTR < 30 minutes demonstrated in game day
- [ ] Grafana dashboards deployed for all critical services (RED method)
- [ ] Terraform modules tested (Terratest passing)
- [ ] CI/CD pipeline tested and working
- [ ] On-call rotation configured and documented
- [ ] Blameless postmortem template created

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
| Alert fatigue (too many noisy alerts) | M | H | SLO-based alerting only (no threshold-on-everything), multi-window/multi-burn-rate alerts, regular alert hygiene reviews |
| Toil accumulation (manual repetitive operations) | M | M | Toil budget tracking (max 50% of SRE time), automation backlog prioritized, eliminate vs. automate decisions |
| Cascading failures in monitored systems | L | H | Circuit breakers, graceful degradation patterns, chaos engineering validation, separate monitoring infrastructure |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- SLO-driven alerting (no raw threshold alerts without SLO justification)
- Runbook required for every alert rule (no alert without documentation)
- Blameless postmortems for every P1/P2 incident
- Error budgets tracked and respected (feature freeze when budget exhausted)
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
- [x] Additional SRE Engineer (monitoring, alerting, incident response)
- [x] Additional DevOps Engineer (Terraform, Ansible, CI/CD)
- [x] Chaos Engineering Specialist (Litmus, game day design)
- [x] Capacity Planning Specialist (resource forecasting, cost optimization)
- [x] Security Specialist (mTLS, Vault, audit logging)
- [x] Database Reliability Specialist (PostgreSQL HA, backup/restore)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] SLO dashboard screenshots (all SLOs instrumented and tracking)
- [x] Alert rule test results (promtool test output)
- [x] Chaos engineering test results (Litmus experiment reports)
- [x] Runbook inventory (every alert mapped to a runbook)
- [x] Terratest results (all infrastructure modules passing)
- [x] Grafana dashboard exports (JSON + screenshots)
- [x] Incident response drill report (game day outcomes)
- [x] Toil tracking report (automated vs. manual operations ratio)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (monitoring stack topology, data flow)

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
**Branch**: `team/sre/execution`
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

*SRE Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Prometheus + Grafana + Terraform + Kubernetes site reliability engineering*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
