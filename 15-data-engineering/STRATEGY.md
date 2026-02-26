# Data Engineering Team — Tailored Strategy v3.1

> Pre-configured for **ETL pipelines, data warehousing, Spark, and Airflow**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team dataEng --strategy path/to/this-file.md`

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

**Primary Users**: [FILL IN — e.g., data analysts, data scientists, BI teams]

**Secondary Users**: [FILL IN — e.g., ML engineers, product managers, executive dashboards]

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
- **Language**: Python 3.12+ / SQL / Scala 3
- **Framework**: Apache Spark 3.5 / Apache Airflow 2.8 / dbt
- **Database**: BigQuery / Snowflake / PostgreSQL / Delta Lake
- **Cache**: Redis (for orchestration metadata and task deduplication)
- **Message Queue**: Apache Kafka / Google Pub/Sub

**Hosting/Infrastructure**:
- **Cloud Provider**: GCP (BigQuery, Dataproc, Cloud Composer) / AWS (EMR, MWAA, Glue) / Databricks
- **Deployment**: Docker + Kubernetes / Cloud Composer / Databricks Workflows
- **CDN**: N/A (data infrastructure)
- **Domain**: [FILL IN or "N/A"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Data sources (APIs, DBs, files) | Ingestion | Service accounts / API keys | [FILL IN per source] |
| Apache Kafka / Pub/Sub | Event streaming | IAM / SASL | Per cluster config |
| BigQuery / Snowflake | Data warehouse | Service account / OAuth | Per plan |
| dbt Cloud / CLI | Transformation layer | API token / CLI | Per plan |

**Existing Codebase**: [FILL IN — Path to existing DAGs/pipelines, or "greenfield"]

**Package Manager**: poetry (Python) / sbt (Scala) / pip (fallback)

**Monorepo or Polyrepo**: Monorepo (dags/ + transforms/ + models/ + tests/ + schemas/)

**Linting**:
- `ruff` — Python linting and formatting
- `sqlfluff` — SQL linting and formatting
- `mypy` — Python static type checking
- `scalafmt` — Scala formatting (if Scala used)

---

## 5. Non-Functional Requirements

**Performance**:
- Pipeline SLA: < 1 hour for daily batch jobs
- Data freshness: < 15 minutes for streaming/near-real-time pipelines
- Pipeline success rate: >= 99.5%
- Query performance (warehouse): P95 < 10 seconds for standard dashboards

**Security**:
- Authentication: IAM + service accounts (no shared credentials)
- Authorization: Column-level encryption, row-level security, dataset-level access control
- Data masking: PII fields masked in non-production environments
- Audit logging: All data access and transformations logged
- Compliance: [FILL IN — GDPR / CCPA / HIPAA / SOC 2 / none]

**Scalability**:
- Expected launch data volume: [FILL IN — GB/TB per day]
- Expected 6-month data volume: [FILL IN]
- Expected 1-year data volume: [FILL IN]
- Scaling strategy: Horizontal (Spark cluster auto-scaling, Kafka partition scaling)

**Availability**:
- Uptime target: 99.5% for pipeline orchestration
- Recovery time objective (RTO): < 1 hour (pipeline re-run from checkpoint)
- Recovery point objective (RPO): < 15 minutes (idempotent pipelines, checkpointed state)
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- N/A (data infrastructure — consumed via SQL/API/dashboards)

**Observability**:
- Logging: Airflow task logs (structured JSON) + Spark driver/executor logs
- Metrics: Airflow UI + custom Prometheus metrics (pipeline duration, record counts, error rates)
- Tracing: Data lineage tracking (Apache Atlas / dbt docs / custom lineage)
- Alerting: SLA breach alerts, data quality failures, pipeline failure notifications (Slack / PagerDuty)

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% for Python DAGs and transformation logic; 100% dbt model test coverage

**Required Test Types**:
- [x] Unit tests — pytest for Python transformation logic and DAG structure
- [x] Integration tests — Spark unit tests with test DataFrames
- [x] Data quality tests — Great Expectations suites for all critical datasets
- [x] dbt tests — schema tests, data tests, freshness tests for all models
- [x] Pipeline tests — DAG validation (no cycles, correct dependencies)
- [x] Idempotency tests — re-run produces same results
- [x] Schema evolution tests — backward/forward compatibility verification
- [x] Security scanning — dependency audit, credential scanning
- [ ] Performance / load tests — [FILL IN if needed for throughput testing]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ruff, sqlfluff, mypy, DAG validation)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated deployment to staging on merge to develop
- [x] Manual approval gate for production DAG deployment
- [x] Data contract validation in CI

**Testing Tools**: pytest, Great Expectations, dbt test, Spark testing utilities, sqlfluff, act

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
- Infrastructure: [FILL IN — $/month for compute, storage, streaming]
- Third-party APIs: [FILL IN — $/month for data sources]
- Data warehouse: [FILL IN — $/month for BigQuery/Snowflake credits]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, cloud compute provisioning, warehouse credits, API subscriptions, Kafka cluster scaling
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any production data infrastructure cost

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Cloud compute (Dataproc/EMR) | [FILL IN] | Card / existing credits | No — ask first |
| Data warehouse (BigQuery/Snowflake) | [FILL IN] | Card / existing credits | No — ask first |
| Streaming (Kafka/Pub/Sub) | [FILL IN] | Card / existing credits | No — ask first |
| Data source APIs | [FILL IN] | Card / free tier | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Python code coverage >= 80%
- [ ] dbt model tests passing (schema + data + freshness)
- [ ] Great Expectations suites passing for all critical datasets
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Pipeline SLA met (< 1 hour for batch, < 15 min for streaming)
- [ ] Pipeline success rate >= 99.5%
- [ ] Data quality dashboards live
- [ ] Schema versioning and data contracts documented
- [ ] Idempotent pipelines verified (safe re-run)
- [ ] Data lineage documented
- [ ] Documentation complete (README, DAG docs, schema docs, runbooks)
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

**Technical References**: [FILL IN — e.g., Data Mesh principles, dbt best practices, Spark tuning guides]

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
| Data quality degradation (upstream schema changes, missing data) | M | H | Great Expectations suites, data contracts with upstream, schema evolution tests, alerting on anomalies |
| Pipeline cascade failures (one DAG failure blocks downstream) | M | H | Idempotent pipelines with checkpoints, retry policies, circuit breakers, SLA-based alerting |
| Schema evolution breaking downstream consumers | M | H | Data contracts, backward-compatible schema changes only, versioned APIs, migration testing |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Hard Constraints** (non-negotiable):
- All pipelines must be idempotent — safe to re-run from any checkpoint
- Schema versioning required — no breaking changes without migration plan
- Data contracts enforced between producers and consumers
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
- A single pipeline or transformation has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking data quality issues requiring parallel fix agents
- The strategy explicitly requests parallel data source integrations

**Agent types the PM may add**:
- [ ] Additional Data Engineers (for pipeline-heavy projects)
- [ ] Additional QA Engineers (for data quality validation)
- [ ] Spark Tuning Specialist (for performance optimization)
- [ ] Schema Migration Specialist (for complex evolution scenarios)
- [ ] Streaming Specialist (for Kafka/real-time pipeline work)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Airflow DAG validation output (no import errors, correct dependencies)
- [x] pytest results for transformation logic
- [x] Great Expectations data quality reports
- [x] dbt test results and documentation
- [x] Spark job execution logs (duration, records processed, errors)
- [x] Pipeline SLA compliance report
- [x] Data lineage diagram
- [x] Schema compatibility test results
- [x] CI/CD pipeline passing (act + remote)
- [x] Security scan reports (dependency audit, credential scanning)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, data tables, DAGs, log entries, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might delete data, corrupt pipelines, cost money, affect production data, break downstream consumers, be irreversible, or fall outside the stated strategy scope
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
- [x] Source code changes (DAGs, transformations, models, schemas)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: existing data infrastructure, data sources, SLAs with downstream consumers, data governance policies, team processes, timezone constraints, etc.]

---

*Data Engineering Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for ETL pipelines, data warehousing, Spark, and Airflow*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
