# Scala & Spark Team — Tailored Strategy v3.1

> Pre-configured for **Scala, Apache Spark, big data, and stream processing**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team scalaSpark --strategy path/to/this-file.md`

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

**Primary Users**: [FILL IN — e.g., data engineers, data scientists, analytics teams]

**Secondary Users**: [FILL IN — e.g., ML engineers, business intelligence, platform operators]

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
- **Language**: Scala 3.x / Java 21 (interop)
- **Framework**: Apache Spark 3.5 / Kafka Streams / Apache Flink / Akka
- **Database**: Delta Lake / Apache Iceberg / Hive Metastore / PostgreSQL (metadata)
- **Cache**: Spark caching (persist/cache) / Alluxio (distributed caching layer)
- **Message Queue**: Apache Kafka / Apache Pulsar

**Hosting/Infrastructure**:
- **Cloud Provider**: Databricks / AWS (EMR) / GCP (Dataproc) / self-hosted Spark cluster
- **Deployment**: Databricks Jobs / EMR Steps / Docker + Kubernetes (spark-on-k8s-operator)
- **CDN**: N/A (data processing infrastructure)
- **Domain**: [FILL IN or "N/A"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Apache Kafka | Event streaming ingestion | SASL / Kerberos | Per cluster config |
| Delta Lake / Iceberg | Table format (ACID transactions on data lake) | IAM / service account | N/A |
| Hive Metastore | Schema registry and table metadata | Kerberos / IAM | N/A |
| Apache Atlas | Data lineage and governance | Kerberos / API | N/A |
| Databricks / EMR | Managed Spark execution | IAM / API token | Per plan |

**Existing Codebase**: [FILL IN — Path to existing Spark jobs, or "greenfield"]

**Package Manager**: sbt (primary) / Maven (legacy interop)

**Monorepo or Polyrepo**: sbt multi-module project (core/ + jobs/ + streaming/ + common/ + tests/)

**Linting**:
- `scalafmt` — Scala code formatting
- `scalafix` — Scala refactoring and linting rules
- `WartRemover` — Scala code quality (prevent unsafe patterns)
- `scalastyle` — additional style enforcement

---

## 5. Non-Functional Requirements

**Performance**:
- Batch job completion: < SLA [FILL IN — e.g., < 2 hours for daily job]
- Streaming throughput: > 1M events/second
- Data skew: < 10% variance across partitions
- Shuffle spill: < 5% of total shuffle data

**Security**:
- Authentication: Kerberos / IAM roles (no shared credentials)
- Authorization: Apache Ranger (table/column-level access control) / IAM policies
- Encryption: Column-level encryption for sensitive data, TLS in transit, encryption at rest (HDFS/S3)
- Audit: All data access logged (Apache Ranger audit / CloudTrail)
- Compliance: [FILL IN — GDPR / CCPA / HIPAA / SOC 2 / none]

**Scalability**:
- Expected launch data volume: [FILL IN — TB per day]
- Expected 6-month data volume: [FILL IN]
- Expected 1-year data volume: [FILL IN]
- Scaling strategy: Horizontal (auto-scaling Spark clusters, Kafka partition scaling)

**Availability**:
- Uptime target: 99.5% for streaming jobs / batch SLA adherence >= 99%
- Recovery time objective (RTO): < 30 minutes (job restart from checkpoint)
- Recovery point objective (RPO): < 5 minutes (Kafka offset commit, Spark checkpointing)
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- N/A (data processing infrastructure — consumed via SQL/API/dashboards)

**Observability**:
- Logging: Spark driver/executor logs (structured), application-level logging (Logback/SLF4J)
- Metrics: Spark UI + Prometheus (via Spark metrics sink) + Grafana dashboards
- Tracing: Data lineage (Apache Atlas), Spark job DAG visualization, Ganglia metrics
- Alerting: Job failure alerts, SLA breach alerts, data quality alerts (Slack / PagerDuty)

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% for Scala source code; 100% data quality assertion coverage for critical datasets

**Required Test Types**:
- [x] Unit tests — ScalaTest / MUnit for business logic and transformations
- [x] Spark tests — SharedSparkSession for DataFrame/Dataset operations
- [x] Integration tests — end-to-end pipeline tests with test data
- [x] Data quality assertions — Great Expectations / custom validators
- [x] Performance benchmarks — job timing, partition analysis, shuffle metrics
- [x] Schema evolution tests — backward/forward compatibility for Delta/Iceberg tables
- [x] Idempotency tests — re-run produces identical results
- [x] Security scanning — dependency audit (sbt-dependency-check), credential scanning
- [ ] Chaos testing — [FILL IN if resilience testing needed]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (scalafmt, scalafix, WartRemover)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated test suite on every PR (ScalaTest + Spark tests)
- [x] Manual approval gate for production job deployment
- [x] Artifact publishing to repository (sbt publish)

**Testing Tools**: ScalaTest, MUnit, Spark testing utilities, Great Expectations, sbt-scoverage, act

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
- Spark cluster compute: [FILL IN — $/month for Databricks/EMR]
- Kafka cluster: [FILL IN — $/month for managed Kafka]
- Storage (S3/HDFS/Delta Lake): [FILL IN — $/month]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, Spark cluster provisioning, Kafka cluster scaling, Databricks workspace costs
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any production cluster scaling

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Spark cluster (Databricks/EMR) | [FILL IN] | Card / existing credits | No — ask first |
| Kafka managed service | [FILL IN] | Card / existing credits | No — ask first |
| Data storage (S3/GCS) | [FILL IN] | Card / existing credits | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Scala code coverage >= 80% (sbt-scoverage)
- [ ] Zero CRITICAL/HIGH issues in WartRemover / scalafix
- [ ] ScalaTest + Spark tests passing
- [ ] Data quality assertions passing for all critical datasets
- [ ] Job completes within SLA target
- [ ] Streaming throughput > 1M events/second (if applicable)
- [ ] Data skew < 10% verified
- [ ] Schema evolution tests passing (backward compatibility)
- [ ] Idempotent re-runs verified
- [ ] Data lineage documented (Apache Atlas or equivalent)
- [ ] Monitoring dashboards live (Spark UI, Grafana)
- [ ] Documentation complete (README, job docs, schema docs, runbooks)
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

**Technical References**: [FILL IN — e.g., Spark: The Definitive Guide, Delta Lake docs, Kafka docs, Scala 3 docs]

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
| Spark job OOM (Out of Memory — driver or executor memory exceeded) | M | H | Memory profiling, partition tuning, broadcast join optimization, spill-to-disk configuration, adaptive query execution |
| Data skew (uneven partition distribution causing stragglers) | M | H | Salting techniques, custom partitioners, AQE skew join optimization, data analysis before processing |
| Spark version upgrades (breaking API changes, dependency conflicts) | M | M | Pin Spark version, integration test suite, staged rollout, compatibility matrix documentation |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Hard Constraints** (non-negotiable):
- Scala 3 syntax (no Scala 2 legacy patterns)
- Functional style — immutable data, pure functions where possible
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
- A single Spark job or pipeline has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking data quality issues requiring parallel fix agents
- The strategy explicitly requests parallel streams (e.g., batch + streaming)

**Agent types the PM may add**:
- [ ] Additional Data Engineers (Scala) (for pipeline development)
- [ ] Spark Optimization Specialist (for performance tuning, memory analysis)
- [ ] Kafka Specialist (for streaming pipeline, consumer group management)
- [ ] Schema/Data Modeling Specialist (for Delta/Iceberg table design)
- [ ] QA Engineer (for data quality validation)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] ScalaTest results with coverage report (sbt-scoverage)
- [x] Spark job execution logs (duration, stages, tasks, shuffle metrics)
- [x] Data quality assertion reports
- [x] Partition analysis (skew metrics, task duration distribution)
- [x] Schema compatibility test results
- [x] Idempotency verification logs
- [x] Data lineage documentation / diagram
- [x] Spark UI screenshots (DAG, stages, storage)
- [x] CI/CD pipeline passing (act + remote)
- [x] Monitoring dashboard screenshots (Grafana, Spark metrics)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, data tables, job artifacts, log entries, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might delete data, corrupt tables, cost cluster compute money, affect production jobs, break downstream consumers, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.

**Auto-sync frequency**: Every agent completion

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `team/scalaSpark/execution`
- Merge to main: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (Spark jobs, streaming apps, schemas)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: existing Spark cluster configuration, data sources, SLAs with downstream consumers, Kafka topic structure, data governance policies, team Scala proficiency, etc.]

---

*Scala & Spark Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Scala, Apache Spark, big data, and stream processing*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
