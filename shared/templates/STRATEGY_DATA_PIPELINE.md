# Project Strategy Brief v3.3

> Pre-built strategy template for a real-time data engineering pipeline.
> Copy this file, customize to your needs, and pass it with `--strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: DataStream

**One-Line Vision**: A real-time analytics pipeline that ingests event data from multiple sources, transforms and aggregates it, and powers dashboards with sub-second query latency.

**Problem Statement**: The product and growth teams rely on batch ETL jobs that run overnight, meaning they see yesterday's data at best. When a feature launch goes wrong or a marketing campaign underperforms, it takes 12-24 hours to notice. This delayed feedback loop has cost the company an estimated $50K in wasted ad spend and two missed product pivots in the last quarter alone.

**Desired Outcome**: Within 6 months, all product metrics are available within 60 seconds of the underlying event. The growth team makes data-driven decisions same-day, reducing wasted spend by 40% and cutting incident detection time from 12 hours to under 5 minutes.

**Project Type**: Greenfield / Production

**Repository**: github.com/yourorg/datastream

---

## 1.1 Deliverable Product Target

**Delivery Target**: Production — enterprise-ready pipeline for deployment

**What "Done" Looks Like**:
- [x] Pipeline is running and processing events end-to-end
- [x] All P0 features are functional and demonstrable
- [x] A data analyst can query dashboards without engineering help
- [x] Screenshots of every dashboard and monitoring screen exist in `.team/screenshots/final/`

**Demo Requirements**:
- **Demo format**: Live demo (event generator pushing data through pipeline to live dashboards)
- **Demo audience**: Technical team / Stakeholders
- **Demo environment**: Staging (isolated Kafka cluster + ClickHouse instance)

**Visual Deliverables** (mandatory):
- [x] Running pipeline with real data flowing through all stages
- [x] Complete flow from event emission to dashboard visualization
- [x] Monitoring dashboard showing pipeline health
- [x] Documentation website (`docs/`) with full project documentation

---

## 2. Target Audience

**Primary Users**: Data analysts and product managers who need real-time metrics to make decisions. Comfortable with SQL and dashboard tools, but not with infrastructure or pipeline code.

**Secondary Users**: Data engineers maintaining and extending the pipeline; SRE team monitoring pipeline health and costs.

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| Maya | Product Analyst | Stale data (24h lag); manual CSV exports; no real-time funnel visibility | Sub-minute data freshness; self-service dashboards; automated daily reports | Med |
| Raj | Data Engineer | Fragile batch jobs; no schema enforcement; hard to add new sources | Reliable pipeline with schema registry; easy source onboarding; clear monitoring | High |

**Anti-Users**: Business intelligence teams needing complex OLAP cubes; ML engineers needing feature stores; external customers needing data access.

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Event ingestion | HTTP API + Kafka producers for ingesting events from web, mobile, and backend services | API accepts events with < 50ms latency; events land in Kafka within 100ms; schema validation rejects malformed events | L |
| 2 | Stream transformation | Spark Structured Streaming jobs for cleaning, enriching, and transforming raw events | Transformations run with < 30s end-to-end latency; handles late-arriving data with 1-hour watermark; dead-letter queue for failures | XL |
| 3 | Aggregation layer | Pre-computed aggregations (counts, sums, percentiles) materialized into ClickHouse | Aggregations refresh every 60 seconds; queries on aggregated tables return in < 200ms; support for daily, hourly, and minute-level granularity | L |
| 4 | Dashboards | Grafana dashboards for key product metrics (DAU, funnel conversion, revenue, feature adoption) | 5 pre-built dashboards; all panels load in < 2s; analysts can duplicate and customize without engineering help | M |
| 5 | Alerting | Threshold-based and anomaly-detection alerts on key metrics with Slack and email notification | Alerts fire within 2 minutes of threshold breach; configurable via Grafana alert rules; Slack messages include metric chart snapshot | M |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Schema registry | Centralized schema registry (Confluent-compatible) enforcing event schemas with versioning | All producers validate against registry; schema evolution (backward-compatible) supported; breaking changes rejected at ingestion | M |
| 2 | Data quality monitoring | Automated checks for data freshness, completeness, and consistency | Checks run every 5 minutes; failures trigger PagerDuty alert; dashboard shows data quality score | M |
| 3 | Backfill tooling | Ability to replay historical data through the pipeline for reprocessing | Backfill job can be triggered via Airflow DAG; processes at 10x real-time speed; does not affect live pipeline throughput | L |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | Self-service data catalog | Searchable catalog of all event types, schemas, and dashboard locations |
| 2 | Cost attribution | Per-team breakdown of pipeline compute and storage costs |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: Python 3.12+ (pipeline code, Airflow DAGs), SQL (transformations, dashboards)
- **Framework**: Apache Spark 3.5 (Structured Streaming), Apache Airflow 2.8 (orchestration)
- **Database**: ClickHouse 24.x (OLAP analytics store)
- **Cache**: Redis 7 (rate limiting on ingestion API, deduplication)
- **Message Queue**: Apache Kafka 3.7 (event streaming backbone)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (us-east-1)
- **Deployment**: Docker Compose for local dev; EKS for staging/production
- **CDN**: None (internal tooling)
- **Domain**: datastream.internal.yourorg.com (internal DNS)

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Confluent Cloud (Kafka) | Managed Kafka cluster | API key | 100 MB/s (Standard tier) |
| AWS S3 | Raw event archive (data lake) | IAM role | Unlimited |
| Grafana Cloud | Dashboard hosting | API key | Free tier (10K metrics) |
| PagerDuty | Alerting escalation | API key | 120 events/min |

**Existing Codebase**: Greenfield (replacing legacy batch ETL — data sources remain the same)

**Package Manager**: poetry (Python), Docker for service packaging

**Monorepo or Polyrepo**: Single repo with `/ingestion`, `/streaming`, `/aggregation`, `/dashboards`, `/airflow` directories

---

## 5. Non-Functional Requirements

**Performance**:
- Event ingestion latency: P95 < 50ms (API to Kafka)
- End-to-end latency: P95 < 60s (event emission to dashboard query)
- Query latency: P95 < 200ms (ClickHouse aggregated tables)
- Throughput: 50,000 events/second sustained

**Security**:
- Authentication: API key for event ingestion; SSO for Grafana dashboards
- Authorization: Grafana folder-level permissions per team
- Data sensitivity: PII (user IDs, IP addresses) — pseudonymize in transformation layer
- Compliance: GDPR (right to deletion via pseudonymization + TTL)
- Encryption: TLS 1.3 in transit; S3 server-side encryption at rest

**Scalability**:
- Expected launch throughput: 10,000 events/second
- Expected 6-month throughput: 50,000 events/second
- Expected 1-year throughput: 200,000 events/second
- Scaling strategy: Kafka partition scaling + Spark executor auto-scaling on EKS

**Availability**:
- Uptime target: 99.9%
- Recovery time objective (RTO): < 30 minutes
- Recovery point objective (RPO): < 5 minutes (Kafka retention: 7 days)
- Multi-region: No (single region with S3 cross-region replication for archive)

**Accessibility**:
- WCAG level: N/A (internal tooling, Grafana handles its own accessibility)
- Screen reader support: N/A
- Internationalization: English only

**Observability**:
- Logging: Structured JSON via Python structlog, shipped to CloudWatch
- Metrics: Prometheus (Kafka, Spark, ClickHouse exporters) + Grafana
- Tracing: OpenTelemetry for pipeline stage tracing
- Alerting: Grafana Alerting -> PagerDuty (P0/P1) + Slack (P2/P3)

---

## 6. Testing Requirements

**Test Coverage Target**: >= 85% line coverage (pipeline logic)

**Required Test Types**:
- [x] Unit tests (mandatory — transformation logic, schema validation)
- [x] Integration tests (mandatory — Kafka producer/consumer, ClickHouse writes)
- [x] E2E tests (mandatory — event ingestion to dashboard query)
- [x] Performance/load tests (mandatory — throughput verification at 50K events/s)
- [x] Security scanning (SAST + dependency audit)
- [ ] Accessibility tests
- [ ] Visual regression tests
- [ ] Contract tests

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ruff, mypy, black)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated deployment to staging on merge to develop
- [x] Manual approval gate for production deployment

**Testing Tools**: pytest for unit/integration, locust for load testing, testcontainers for Kafka/ClickHouse integration tests

### 6.1 UAT Testing Requirements

| Requirement | Value |
|-------------|-------|
| **UAT Coverage Target** | >= 95% |
| **P0 Feature Pass Rate** | 100% |
| **P1 Feature Pass Rate** | >= 95% |
| **Compliance Frameworks** | ISO 25010, GDPR |
| **Screenshot Capture** | Before + After for every test case |
| **UAT Report Format** | MD + PDF + PPTX + JSON + CSV exports |
| **Negative Test Coverage** | >= 90% |
| **Role Coverage** | 100% (analyst, data engineer, admin) |
| **Browser Matrix (P0 flows)** | Chrome + Firefox (Grafana dashboards) |
| **Device Matrix (P0 flows)** | Desktop only |

**UAT Sign-Off Chain**: QA Agent -> Team Leader -> User

**Applicable Regulations**:
- [x] ISO 25010 — Software quality
- [x] GDPR — EU personal data handling (pseudonymization of PII)
- [ ] SOC 2 Type II
- [ ] WCAG 2.1 AA
- [ ] PCI DSS v4.0
- [ ] HIPAA
- [ ] FDA 21 CFR Part 11

**Additional UAT Context**: Test with realistic event volumes (burst to 50K/s) to verify pipeline does not drop events. Test late-arriving data (events with timestamps 30 minutes in the past) to verify watermark handling. Test Kafka broker failure (kill one broker) to verify pipeline recovers automatically.

---

## 7. Timeline & Milestones

**Hard Deadline**: 6 weeks from kickoff

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | Foundation | Week 1-2 | Kafka topics, ingestion API, raw event schema, S3 archival, CI pipeline, Docker Compose local dev | Events flow from API to Kafka to S3; local dev environment works |
| M2 | Streaming Core | Week 2-3 | Spark Structured Streaming jobs, transformation logic, ClickHouse schema, dead-letter queue | Transformed events land in ClickHouse within 60s; DLQ captures malformed events |
| M3 | Dashboards + Alerts | Week 4-5 | Grafana dashboards, aggregation materialized views, alerting rules, Airflow DAGs | 5 dashboards live; alerts fire on threshold breach; Airflow orchestrates daily jobs |
| M4 | QA + Hardening | Week 5-6 | Load testing, data quality monitoring, backfill tooling, docs site, UAT | 50K events/s sustained in load test; data quality checks pass; docs published |

**Budget Constraints**:
- Infrastructure: $300/month (Confluent Cloud Basic + ClickHouse Cloud dev + AWS EKS)
- Third-party APIs: $0/month (Grafana Cloud free tier, PagerDuty free tier)
- Domains/SSL: $0 (internal DNS)

---

## 7.1 Cost Approval & Payment Governance

**Token Budget Tolerance**: < $30 total

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All cloud resource provisioning, Confluent tier upgrades, ClickHouse Cloud provisioning
- **Forbidden without user present**: Any production deployment, any recurring cost > $100/month

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Confluent Cloud Basic | ~$100/month | Card | No — ask first |
| ClickHouse Cloud Dev | ~$100/month | Card | No — ask first |
| AWS EKS + S3 | ~$100/month | AWS account | No — ask first |
| Grafana Cloud Free | $0 | Free tier | Yes |
| PagerDuty Free | $0 | Free tier | Yes |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [x] All P0 features implemented and tested
- [x] Unit test coverage >= 85%
- [x] Zero CRITICAL/HIGH security vulnerabilities
- [x] E2E tests pass (event to dashboard in < 60s)
- [x] Performance targets met (50K events/s sustained)
- [x] Documentation complete (README, architecture diagram, runbook, setup guide)
- [x] CI/CD pipeline tested and working
- [x] Pipeline deployed to staging and processing test events

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| End-to-end latency | P95 < 60s | OpenTelemetry traces across pipeline stages |
| Event drop rate | < 0.01% | Compare ingestion count vs ClickHouse row count |
| Dashboard query latency | P95 < 200ms | ClickHouse query log analysis |
| Pipeline uptime | > 99.9% | Prometheus up/down metrics |

**Definition of Done**: Events flow from ingestion API through Kafka, Spark transformations, and ClickHouse aggregation to Grafana dashboards within 60 seconds. Load test confirms 50K events/s. Five dashboards are live and queryable. Alerting fires correctly on test thresholds. Documentation site is published.

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| Segment | Clean event schema design, source/destination abstraction | Over-abstraction for internal use; unnecessary connector ecosystem |
| Datadog | Real-time metrics visualization, alerting UX | Vendor lock-in; cost explosion at scale |
| Databricks | Structured Streaming patterns, Delta Lake reliability | Over-engineering with lakehouse for MVP; unnecessary ML features |

**Design Inspiration**: Datadog's dashboard layout, Segment's event schema documentation, Confluent's Kafka monitoring UI

**Technical References**: Spark Structured Streaming programming guide, ClickHouse MergeTree engine docs, Kafka Streams vs Structured Streaming comparison

**Internal Documentation**: Existing batch ETL documentation (for understanding current data sources and schemas)

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. ML feature store or model serving infrastructure
2. Customer-facing analytics (embedded dashboards)
3. CDC (Change Data Capture) from operational databases — sources push events via API

**Deferred to future versions**:
1. Self-service data catalog with lineage tracking
2. Multi-region Kafka replication
3. Real-time ML feature computation
4. Cost attribution per team/data source

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Kafka consumer lag during traffic spikes | M | H | Auto-scale Spark executors; pre-provision for 2x expected peak; set lag alerts |
| ClickHouse query performance degrades with data growth | M | M | Use materialized views for common queries; implement TTL (90-day retention on raw, 1-year on aggregated); partition by date |
| Schema evolution breaks downstream consumers | M | H | Schema registry with backward-compatibility enforcement; consumer version pinning |
| Confluent Cloud costs exceed budget at scale | L | M | Monitor hourly; set billing alerts; evaluate self-hosted Kafka if costs exceed $200/month |

**Hard Constraints** (non-negotiable):
- Must use Kafka (team has existing Confluent relationship)
- Must deploy to AWS us-east-1 (co-located with application services)
- Must pseudonymize PII before data lands in ClickHouse (GDPR)

**Soft Constraints** (preferred but negotiable):
- Prefer Spark Structured Streaming but open to Flink if latency requirements tighten
- Prefer ClickHouse but open to Apache Druid if query patterns change

---

## 11.1 Dynamic Agent Scaling

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 12

**Scaling triggers**:
- A single feature has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking bugs requiring parallel fix agents

**Agent types the PM may add**:
- [x] Additional Backend Engineers (for pipeline code)
- [ ] Additional Frontend Engineers
- [x] Additional QA Engineers (for load testing)
- [x] Specialist agents (Kafka tuning, ClickHouse optimization, Spark performance)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Screenshots of running dashboards
- [x] Test result reports (JUnit XML, coverage HTML)
- [x] Build logs showing zero errors
- [x] CI/CD pipeline passing locally (act) and remotely
- [x] Security scan reports (zero CRITICAL/HIGH)
- [x] Performance benchmark results (locust load test reports)
- [x] Deployment verification (health check passing, pipeline consuming events)
- [x] API documentation (OpenAPI spec for ingestion API)
- [x] Database migration scripts tested (ClickHouse schema)
- [x] Dependency audit clean

**Reporting Frequency**: Every 6 hours (default)

**Final Deliverable**: Both PPTX and PDF

---

## 12.0.1 Screenshots & Visual Evidence

**Screenshot Requirements**:
- [x] Before/after screenshots for every P0 feature
- [x] Test result screenshots (unit, integration, e2e, load)
- [x] Deployment evidence screenshots
- [x] Grafana dashboard screenshots (all 5 dashboards)
- [x] Mission Control dashboard screenshots at wave completions
- [x] Pipeline monitoring screenshots (Kafka lag, Spark jobs, ClickHouse queries)

**Screenshot Naming**: `{date}_{agent}_{description}.png`

**Final Product Screenshots**: `.team/screenshots/final/` MUST contain all dashboards and pipeline monitoring views.

## 12.0.2 Documentation Website

**Documentation Scope**:
- [x] Project overview and architecture (pipeline diagram)
- [x] Getting started / installation guide (local Docker Compose setup)
- [x] API reference (ingestion API)
- [x] Event schema catalog
- [x] Configuration reference (Kafka, Spark, ClickHouse tuning)
- [x] Deployment guide (EKS deployment)
- [x] Runbook (common operational procedures)
- [x] Decision log

**Documentation Tech**: React + Vite + MDX

## 12.0.3 Mission Control PDF Report

**PDF Report Must Include**:
- [x] Executive summary with key metrics
- [x] Discovery interview (all 20+ Q&A)
- [x] Complete decision log with rationale
- [x] Task execution timeline (planned vs actual)
- [x] Git commit history with agent attribution
- [x] Quality report (test coverage, bugs, security scans)
- [x] Agent performance metrics
- [x] Screenshots embedded
- [x] Cost analysis (budget vs actual)
- [x] Deliverables checklist with evidence

**Report Generation**: Automatic at end of every wave + on-demand

---

## 12.1 Data Preservation & Uncertainty Policy

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted. Pipeline data follows TTL-based retention, but raw events are always archived to S3.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}` (default)
- **Archive method for table rows**: TTL-based expiration in ClickHouse; raw events permanently archived in S3
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker (default)
- **Git history protection**: Never rebase/squash published commits

**Uncertainty Escalation**:

- **Escalation threshold**: < 90% confidence -> escalate
- **Escalation response time expectation**: I'll respond within hours
- **What counts as "unsure"**: Any action that might delete data, cost money, affect production pipelines, change schemas, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

**Auto-sync frequency**: Every commit (default)

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `ai-team`
- Merge to main: ONLY after Team Leader receives explicit user approval

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

This pipeline replaces a legacy batch ETL system built on cron + Python scripts + Redshift. The existing data sources (web tracking, backend events, mobile events) will push to the new ingestion API. Priority is reliability and latency — the growth team has committed to making same-day decisions if they can get real-time data. Start with the 5 highest-value dashboards (DAU, funnel conversion, revenue, feature adoption, error rates) and expand from there.

---

*Strategy Brief v3.3 — Amenthyx AI Teams*
