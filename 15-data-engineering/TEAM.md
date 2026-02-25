# Data Engineering Team
# Activation: `--team dataEng`
# Focus: Data pipelines, ETL/ELT, Spark, Airflow, data platforms
# Version: v3.0 -- Enhanced Execution Protocol

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Quality Gates](#7-quality-gates)
8. [`.team/` Directory Layout](#8-team-directory-layout)
9. [Reporting System](#9-reporting-system)
10. [Error Handling & Session Management](#10-error-handling--session-management)
11. [Evidence & Proof Protocol](#11-evidence--proof-protocol)
12. [Local Install & Test Protocol](#12-local-install--test-protocol)
13. [Atomic Commit Protocol](#13-atomic-commit-protocol)
14. [Comprehensive Testing Matrix](#14-comprehensive-testing-matrix)
15. [GitHub Actions -- Local Testing](#15-github-actions----local-testing)
16. [PM Kanban -- Real-Time Tracking](#16-pm-kanban----real-time-tracking)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team dataEng --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read shared/ENHANCED_EXECUTION_PROTOCOL.md for shared protocol details
3. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
4. Create `.team/` directory structure (see Section 8)
5. Spawn Team Leader agent (foreground -- this is the orchestrator)
6. Team Leader spawns PM agent (foreground -- must complete before others)
7. PM produces Project Charter + Initial Plan + creates GitHub Project
8. Team Leader reviews PM output, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, features, and success criteria.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between batch and streaming architectures, data quality vs. throughput tradeoffs.
- **Persona**: "You are the Team Leader of a 10-person Data Engineering team. You coordinate all work across data architecture, batch pipelines, streaming, and data quality. You make final decisions on technology selection, partitioning strategies, and data governance. You never write pipeline code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter, milestones, kanban. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports.
- **Persona**: "You are the Project Manager for a data engineering project. You create all planning artifacts, track pipeline deliverables by data domain, manage sprint boards via GitHub Projects using `gh` CLI. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Data Architect (DARCH)
- **Role**: Data platform design, lakehouse architecture, governance model.
- **Persona**: "You are the Data Architect. You design data platform architectures: lakehouse (Delta Lake/Iceberg), data warehouse (Snowflake/BigQuery/Redshift), data mesh domains, schema registries, metadata catalogs, and data governance frameworks. You define medallion architecture (bronze/silver/gold), partitioning strategies, and data contracts between producers and consumers. You write to `.team/data-architecture/`."
- **Spawning**: Wave 2 (foreground -- others depend on architecture)

### 2.4 Pipeline Engineer (PIPE)
- **Role**: Airflow DAGs, orchestration, scheduling, dependency management.
- **Persona**: "You are the Pipeline Engineer. You design and implement Apache Airflow DAGs for ETL/ELT orchestration. You handle task dependencies, retry policies, SLA monitoring, backfill strategies, dynamic DAG generation, connection/variable management, and custom operators. You also work with dbt for SQL transformations, managing models, tests, and documentation. You write to `.team/pipelines/`."
- **Spawning**: Wave 2 (parallel, after Data Architect)

### 2.5 Spark Engineer (SPARK)
- **Role**: Spark jobs, performance tuning, data transformations at scale.
- **Persona**: "You are the Spark Engineer. You design and optimize Apache Spark jobs (PySpark/Scala) for large-scale data processing. You handle partitioning, shuffles, broadcast joins, catalyst optimizer hints, adaptive query execution, memory tuning, and Spark Structured Streaming. You design for Databricks or EMR as specified. You write performant, testable Spark code."
- **Spawning**: Wave 2 (parallel, after Data Architect)

### 2.6 Streaming Engineer (STREAM)
- **Role**: Kafka, real-time pipelines, event-driven architecture.
- **Persona**: "You are the Streaming Engineer. You design real-time data pipelines using Apache Kafka, Kafka Connect, Kafka Streams, or Flink. You handle topic design, partitioning strategies, schema evolution (Avro/Protobuf + Schema Registry), consumer group management, exactly-once semantics, dead letter queues, and backpressure handling. You write to `.team/streaming/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 Data Quality Engineer (DQ)
- **Role**: Data validation, quality rules, anomaly detection, lineage.
- **Persona**: "You are the Data Quality Engineer. You design data quality frameworks using Great Expectations, dbt tests, or Soda. You define expectations for completeness, accuracy, consistency, timeliness, and uniqueness. You build anomaly detection for data drift, implement data lineage tracking, and establish data contracts between teams. You write to `.team/data-quality/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer -- Data Testing (QA)
- **Role**: Pipeline testing, data validation, regression testing.
- **Persona**: "You are the QA Engineer specializing in data pipeline testing. You test pipeline correctness with known datasets, verify idempotency (re-running produces same results), validate schema evolution compatibility, test failure/retry scenarios, verify SLA compliance, and run data reconciliation between source and target. You produce data test reports and QA sign-off."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Pipeline release coordination, migration management, rollback planning.
- **Persona**: "You are the Release Manager for data engineering. You coordinate pipeline releases: schema migration scripts, backward-compatible deployments, blue-green pipeline cutover, rollback procedures for failed migrations, and data backfill plans. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: Data platform documentation, stakeholder communication.
- **Persona**: "You are the Marketing Strategist for the data platform. You create data catalog documentation, self-service analytics guides, stakeholder presentations on data capabilities, and data literacy training materials."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: Data privacy, retention policies, regulatory compliance.
- **Persona**: "You are the Legal/Compliance Attorney for data engineering. You review for GDPR right-to-erasure in data pipelines, CCPA data subject requests, data retention policies, PII handling and masking requirements, cross-border data transfer regulations, and data classification schemas."
- **Spawning**: Wave 1.5 (background, parallel with Marketing)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +----------+
                        |   USER   |
                        +----+-----+
                             |
                    +--------v--------+
                    |  TEAM LEADER    |
                    |  (Orchestrator) |
                    +--------+--------+
                             |
            +----------------+----------------+
            |                |                |
     +------v------+  +-----v-----+  +-------v-----+
     |     PM      |  | Marketing |  |  Attorney   |
     | (Planning)  |  |(Data Docs)|  | (Privacy)   |
     +------+------+  +-----------+  +-------------+
            |
   +--------+--------+--------+--------+
   |        |        |        |        |
+--v---+ +--v--+ +---v---+ +--v----+ +v----+
|DARCH | |PIPE | | SPARK | |STREAM | | DQ  |
+--+---+ +--+--+ +---+---+ +--+----+ ++----+
   +--------+--------+--------+--------+
            |
      +-----v-----+
      |    QA      |
      |  (Data)    |
      +-----+------+
            |
   +--------v--------+
   | Release Manager  |
   | (Migrations)     |
   +------------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Data engineering project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan -> `.team/MILESTONES.md` (data domains as milestones)
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Data platform documentation", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/ (DATA_CATALOG_GUIDE.md, SELF_SERVICE_DOCS.md, TRAINING_MATERIALS.md)")

Task(subagent_type="general-purpose", description="LEGAL: Data privacy compliance", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/ (PRIVACY_REVIEW.md, RETENTION_POLICY.md, PII_HANDLING.md, CROSS_BORDER_TRANSFER.md)")
```

### Spawn: Data Architecture (Foreground, Sequential)
```
Task(subagent_type="general-purpose", description="DARCH: Data platform architecture",
  prompt="[DARCH PERSONA] + PROJECT STRATEGY -> write to .team/data-architecture/ (PLATFORM_ARCHITECTURE.md, MEDALLION_LAYERS.md, GOVERNANCE_MODEL.md, DATA_CONTRACTS.md, ADR_LOG.md)")
GATE: PLATFORM_ARCHITECTURE.md must exist before engineering wave
```

### Spawn: Engineering Wave (Background, Parallel -- 4 agents)
```
PIPE   -> .team/pipelines/     (DAG_CATALOG.md, ORCHESTRATION_DESIGN.md, DBT_MODELS.md, SLA_CONFIG.md)
SPARK  -> .team/pipelines/     (SPARK_JOBS.md, PERFORMANCE_TUNING.md, PARTITIONING_STRATEGY.md)
STREAM -> .team/streaming/     (TOPIC_DESIGN.md, SCHEMA_REGISTRY.md, CONSUMER_GROUPS.md, DLQ_STRATEGY.md)
DQ     -> .team/data-quality/  (QUALITY_RULES.md, EXPECTATIONS_SUITE.md, ANOMALY_DETECTION.md, LINEAGE_MAP.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, PIPELINE_TESTS.md, IDEMPOTENCY_TESTS.md, SCHEMA_COMPAT_TESTS.md, SLA_TESTS.md, RECONCILIATION.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, MIGRATION_SCRIPTS.md, ROLLBACK_PROCEDURE.md, BACKFILL_PLAN.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | Role + priority + wave + data-domain labels |
| Releases | `.team/releases/` | `gh release create` |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: data catalog, self-service docs, training
+-- Attorney: privacy, retention, PII handling, cross-border
+-- These run concurrently with Wave 2

WAVE 2: ARCHITECTURE + ENGINEERING (Sequential then Parallel)
+-- DARCH: Platform architecture, medallion layers, governance (foreground, first)
+-- GATE: Architecture artifacts exist
+-- PIPE, SPARK, STREAM, DQ -- all in parallel (background)
+-- SYNC: TL waits for all 4 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: pipeline tests, idempotency, schema compatibility, SLA, reconciliation
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: checklist, changelog, migrations, rollback, backfill plan
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF
+-- PM: close all GitHub milestones
+-- TL: present summary to user
```

---

## 7. QUALITY GATES

| # | Gate | When | Check | Evidence Required | Action if FAIL |
|---|------|------|-------|-------------------|----------------|
| G1 | Planning Complete | After PM | All PM artifacts + GitHub Project exists | Screenshot of GitHub Project board | Re-spawn PM |
| G2 | Pipeline Validation | After PIPE | DAGs parse without errors, no import failures | `airflow dags list` output, dbt parse log | Re-spawn PIPE |
| G3 | Data Quality | After DQ | Great Expectations suite: all critical expectations pass | GE validation results JSON, expectation suite report | Re-spawn DQ/PIPE |
| G4 | Schema Validation | After STREAM | Schema Registry compatibility check (backward/forward) | Schema compatibility test output | Re-spawn STREAM |
| G5 | Performance (SLA) | After SPARK | Jobs complete within defined SLA windows | Spark UI metrics, job duration logs | Re-spawn SPARK for tuning |
| G6 | Idempotency Test | After QA | Re-running pipelines produces identical output | Diff report of two consecutive runs | Enter Bug Fix Loop |
| G7 | Lineage Documentation | Before release | All tables have documented upstream/downstream lineage | Lineage graph export, coverage report | Re-spawn DQ |
| G8 | Build & Test Gate | Before release | All tests pass, no secrets in code | CI log output, `gitleaks` scan result | Block release |
| G9 | Evidence Gate | Before release | All evidence artifacts exist in `.team/evidence/` | File existence check report | Block release |
| G10 | Secrets Gate | Before release | No API keys, passwords, tokens in codebase | `gitleaks detect` clean output | Block release |

---

## 8. `.team/` DIRECTORY LAYOUT

```
.team/
+-- PROJECT_CHARTER.md
+-- MILESTONES.md
+-- KANBAN.md
+-- TIMELINE.md
+-- RISK_REGISTER.md
+-- DECISION_LOG.md
+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- airflow-dag-parse.log
|   +-- dbt-test-results.json
|   +-- ge-validation-results.json
|   +-- spark-job-metrics.json
|   +-- schema-compat-report.txt
|   +-- pipeline-lineage-graph.md
|   +-- idempotency-diff-report.txt
|   +-- gitleaks-scan.txt
+-- ci/
|   +-- .github/
|   |   +-- workflows/
|   |       +-- data-pipeline-ci.yml
|   |       +-- dbt-test.yml
|   |       +-- spark-lint.yml
|   +-- act-validation-log.txt
+-- data-architecture/
|   +-- PLATFORM_ARCHITECTURE.md
|   +-- MEDALLION_LAYERS.md
|   +-- GOVERNANCE_MODEL.md
|   +-- DATA_CONTRACTS.md
+-- pipelines/
|   +-- DAG_CATALOG.md
|   +-- ORCHESTRATION_DESIGN.md
|   +-- DBT_MODELS.md
|   +-- SPARK_JOBS.md
+-- schemas/
|   +-- SCHEMA_REGISTRY.md
|   +-- EVOLUTION_POLICY.md
+-- data-quality/
|   +-- QUALITY_RULES.md
|   +-- EXPECTATIONS_SUITE.md
|   +-- LINEAGE_MAP.md
+-- streaming/
|   +-- TOPIC_DESIGN.md
|   +-- CONSUMER_GROUPS.md
+-- qa/
+-- releases/
+-- marketing/
+-- legal/
```

---

## 9. REPORTING SYSTEM

### Standard Reports
- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion

### Enhanced Report Content
- Reports include: pipeline status, data quality scores, SLA compliance %, schema evolution log, lineage coverage
- **Evidence slides**: Each PPTX includes dedicated slides with embedded evidence screenshots and test result summaries
- **Test coverage section**: PDF includes dbt test coverage, Great Expectations suite pass rates, Spark job metrics
- **Data quality dashboard**: Charts showing data completeness, accuracy, timeliness metrics over time
- **Pipeline lineage visualization**: DAG dependency graphs and table-level lineage diagrams

---

## 10. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Pipeline parse failure**: Capture DAG import errors, re-spawn PIPE with error context
- **Spark job failure**: Capture executor logs, re-spawn SPARK with OOM/shuffle details
- **Schema incompatibility**: Escalate to Data Architect for contract renegotiation
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent

### Session Commands

| Command | Action |
|---------|--------|
| `--team dataEng --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

## 11. EVIDENCE & PROOF PROTOCOL

Every deliverable requires verifiable evidence. No artifact is considered complete without proof.

### Data Pipeline Evidence Requirements

| Artifact | Required Evidence | Storage Path |
|----------|-------------------|--------------|
| Airflow DAGs | `airflow dags list` clean output, `airflow dags test <dag_id>` success log | `.team/evidence/airflow-dag-parse.log` |
| dbt Models | `dbt run` + `dbt test` output, model lineage graph | `.team/evidence/dbt-test-results.json` |
| Great Expectations | Validation results JSON with expectation pass/fail details | `.team/evidence/ge-validation-results.json` |
| Spark Jobs | `spark-submit --dry-run` verification, Spark UI metrics screenshot | `.team/evidence/spark-job-metrics.json` |
| Schema Registry | Compatibility check output (backward, forward, full) | `.team/evidence/schema-compat-report.txt` |
| Pipeline Lineage | Full table-level lineage graph, coverage percentage | `.team/evidence/pipeline-lineage-graph.md` |
| Idempotency | Diff report showing identical output from two consecutive runs | `.team/evidence/idempotency-diff-report.txt` |
| Data Quality | Great Expectations HTML report, Soda scan results | `.team/evidence/ge-validation-results.json` |

### Evidence Collection Commands

```bash
# Airflow DAG validation
airflow dags list 2>&1 | tee .team/evidence/airflow-dag-parse.log
airflow dags test <dag_id> <execution_date> 2>&1 | tee -a .team/evidence/airflow-dag-parse.log

# dbt test execution
dbt run --profiles-dir . 2>&1 | tee .team/evidence/dbt-run-output.log
dbt test --profiles-dir . 2>&1 | tee .team/evidence/dbt-test-results.json

# Great Expectations validation
great_expectations checkpoint run <checkpoint_name> --json 2>&1 | tee .team/evidence/ge-validation-results.json

# Spark job dry-run verification
spark-submit --master local[*] --class MainClass app.jar --dry-run 2>&1 | tee .team/evidence/spark-job-metrics.json

# Schema compatibility check
curl -s http://schema-registry:8081/compatibility/subjects/<subject>/versions/latest \
  -X POST -H "Content-Type: application/json" -d @schema.json | tee .team/evidence/schema-compat-report.txt

# Pipeline lineage extraction (dbt)
dbt docs generate && dbt docs serve --port 8081 &
# Capture lineage from catalog.json
python -c "import json; data=json.load(open('target/catalog.json')); print(json.dumps(data, indent=2))" \
  > .team/evidence/pipeline-lineage-graph.md

# Secrets scan
gitleaks detect --source . --report-path .team/evidence/gitleaks-scan.txt
```

### Evidence Freshness Policy
- Evidence must be regenerated if source code changes after collection
- Stale evidence (older than the latest commit touching relevant files) triggers re-collection
- PM tracks evidence timestamps in KANBAN.md

---

## 12. LOCAL INSTALL & TEST PROTOCOL

### Prerequisites
```bash
# Python environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Core data engineering tools
pip install apache-airflow==2.8.0 \
  dbt-core dbt-postgres \
  pyspark==3.5.0 \
  great-expectations \
  soda-core-postgres \
  confluent-kafka \
  avro-python3 \
  delta-spark \
  python-pptx reportlab

# Airflow standalone setup (local development)
export AIRFLOW_HOME=$(pwd)/airflow_home
airflow db init
airflow users create --username admin --password admin --firstname Admin --lastname User --role Admin --email admin@local.dev
```

### Docker-Based Local Environment
```bash
# docker-compose.yml for full local stack
docker compose -f docker-compose.data.yml up -d
# Services: PostgreSQL, Kafka + Zookeeper, Schema Registry, Airflow Webserver+Scheduler, Spark Master+Worker
```

### Build Verification
```bash
# 1. Airflow DAG parsing (zero import errors)
airflow dags list 2>&1 | grep -c "ERROR" | xargs test 0 -eq

# 2. dbt compile and test
dbt compile --profiles-dir .
dbt test --profiles-dir .

# 3. Spark job compilation (PySpark)
python -m py_compile spark_jobs/*.py

# 4. Great Expectations suite validation
great_expectations checkpoint run pipeline_checkpoint

# 5. Schema Registry compatibility
python scripts/check_schema_compatibility.py

# 6. Full pipeline integration test
python -m pytest tests/integration/ -v --tb=short
```

### Run Verification
```bash
# Airflow: trigger DAG and verify success
airflow dags trigger <dag_id>
airflow tasks test <dag_id> <task_id> <execution_date>

# Spark: submit job locally
spark-submit --master local[4] --py-files dependencies.zip main_job.py

# Kafka: produce and consume test messages
python scripts/kafka_produce_test.py
python scripts/kafka_consume_test.py

# Data quality: run Great Expectations suite against test dataset
great_expectations checkpoint run test_data_checkpoint
```

---

## 13. ATOMIC COMMIT PROTOCOL

### Conventional Commit Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Data Engineering Commit Types

| Type | When | Example |
|------|------|---------|
| `feat(pipeline)` | New DAG, new dbt model, new Spark job | `feat(pipeline): add daily user_events ETL DAG` |
| `feat(streaming)` | New Kafka topic, consumer, Flink job | `feat(streaming): add real-time click-stream consumer` |
| `feat(quality)` | New GE expectation suite, data contract | `feat(quality): add completeness checks for orders table` |
| `fix(pipeline)` | Fix broken DAG, incorrect transformation | `fix(pipeline): correct join key in customer_orders model` |
| `fix(spark)` | Fix OOM, incorrect partitioning | `fix(spark): reduce shuffle partitions to prevent OOM` |
| `test(pipeline)` | Pipeline test, idempotency test | `test(pipeline): add idempotency test for daily_load DAG` |
| `refactor(dbt)` | Model restructure, DRY improvements | `refactor(dbt): extract common CTEs into macros` |
| `chore(infra)` | Connection config, env setup | `chore(infra): add Airflow connection for staging DB` |
| `docs(lineage)` | Lineage documentation, data dictionary | `docs(lineage): document orders table upstream dependencies` |

### Per-Task Commit Workflow
```bash
# 1. Stage only task-related files
git add dags/daily_user_events.py
git add models/staging/stg_user_events.sql
git add tests/test_daily_user_events.py

# 2. Commit with conventional format
git commit -m "feat(pipeline): add daily user_events ETL DAG

- Airflow DAG with hourly schedule, 3 retries, 5min timeout
- dbt staging model with deduplication logic
- Great Expectations suite for completeness and uniqueness
"

# 3. Record commit hash for PM tracking
TASK_COMMIT=$(git rev-parse --short HEAD)
```

### PM Tracking Integration
After each commit, PM updates GitHub Issue with commit hash:
```bash
gh issue comment <ISSUE_NUMBER> --body "Task completed: ${TASK_COMMIT} - <description>"
```

---

## 14. COMPREHENSIVE TESTING MATRIX

### Test Layers

| Layer | Tool | Scope | Coverage Target |
|-------|------|-------|-----------------|
| Unit Tests | pytest + PySpark test utilities | Individual transformations, UDFs, helper functions | >= 90% |
| dbt Model Tests | dbt test (schema + data tests) | Column-level constraints, referential integrity, uniqueness | 100% of critical models |
| Great Expectations | Great Expectations + Soda | Data quality rules: completeness, accuracy, consistency, timeliness | All bronze/silver/gold tables |
| Pipeline Tests | pytest + Airflow test utilities | DAG structure, task dependencies, retry logic, SLA configuration | All DAGs |
| Idempotency Tests | Custom pytest fixtures | Re-running produces identical output, no duplicates | All write operations |
| Schema Compatibility | Schema Registry API | Backward/forward/full compatibility for Avro/Protobuf schemas | All Kafka topics |
| Integration Tests | Docker Compose + pytest | End-to-end pipeline: source -> bronze -> silver -> gold | Critical data paths |
| Performance Tests | Spark UI + custom metrics | Job duration, shuffle size, memory usage, partition distribution | All Spark jobs |
| Lineage Tests | dbt docs + custom scripts | Every table has documented upstream/downstream dependencies | >= 95% coverage |
| Data Reconciliation | Custom SQL scripts | Source vs. target row counts, aggregate value comparisons | All ETL pipelines |

### Test Execution Order
```bash
# Phase 1: Static analysis and parsing
python -m py_compile dags/*.py
airflow dags list 2>&1 | grep "ERROR" && exit 1
dbt compile --profiles-dir .

# Phase 2: Unit tests
python -m pytest tests/unit/ -v --cov=src --cov-report=html

# Phase 3: dbt tests
dbt test --profiles-dir . --select tag:critical
dbt test --profiles-dir .

# Phase 4: Great Expectations
great_expectations checkpoint run full_validation

# Phase 5: Integration tests (requires Docker stack)
docker compose -f docker-compose.test.yml up -d
python -m pytest tests/integration/ -v --tb=short
docker compose -f docker-compose.test.yml down

# Phase 6: Idempotency tests
python -m pytest tests/idempotency/ -v

# Phase 7: Data reconciliation
python scripts/reconciliation_check.py --source staging --target production
```

### Great Expectations Suite Structure
```python
# expectations/orders_table_suite.json
{
  "expectation_suite_name": "orders_table_suite",
  "expectations": [
    {"expectation_type": "expect_table_row_count_to_be_between", "kwargs": {"min_value": 1000}},
    {"expectation_type": "expect_column_values_to_not_be_null", "kwargs": {"column": "order_id"}},
    {"expectation_type": "expect_column_values_to_be_unique", "kwargs": {"column": "order_id"}},
    {"expectation_type": "expect_column_values_to_be_between", "kwargs": {"column": "amount", "min_value": 0}},
    {"expectation_type": "expect_column_values_to_be_in_set", "kwargs": {"column": "status", "value_set": ["pending", "completed", "cancelled"]}}
  ]
}
```

### dbt Test Examples
```yaml
# models/staging/schema.yml
models:
  - name: stg_orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('stg_customers')
              field: customer_id
      - name: amount
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 1000000
```

---

## 15. GITHUB ACTIONS -- LOCAL TESTING

### CI Pipeline Definition
```yaml
# .github/workflows/data-pipeline-ci.yml
name: Data Pipeline CI
on: [push, pull_request]

jobs:
  lint-and-parse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install apache-airflow dbt-core pyspark flake8 black
      - name: Lint Python
        run: flake8 dags/ spark_jobs/ --max-line-length=120
      - name: Format check
        run: black --check dags/ spark_jobs/
      - name: Validate Airflow DAGs
        run: |
          export AIRFLOW_HOME=$(pwd)/airflow_test
          airflow db init
          airflow dags list 2>&1 | grep "ERROR" && exit 1 || echo "All DAGs valid"

  dbt-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dbt
        run: pip install dbt-core dbt-postgres
      - name: Run dbt
        run: |
          dbt compile --profiles-dir .ci/
          dbt run --profiles-dir .ci/
          dbt test --profiles-dir .ci/

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r requirements-test.txt
      - name: Run unit tests
        run: python -m pytest tests/unit/ -v --cov=src --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}
```

### Local CI Validation with `act`
```bash
# Install act (GitHub Actions local runner)
# https://github.com/nektos/act

# Run full CI pipeline locally
act push --job lint-and-parse
act push --job dbt-test
act push --job unit-tests
act push --job secrets-scan

# Run all jobs
act push

# Save validation log as evidence
act push 2>&1 | tee .team/ci/act-validation-log.txt
```

### Domain-Specific CI Checks
```bash
# Airflow DAG import time check (should be < 2 seconds per DAG)
python scripts/check_dag_import_time.py --max-seconds 2

# dbt model freshness check
dbt source freshness --profiles-dir .ci/

# Great Expectations validation in CI
great_expectations checkpoint run ci_checkpoint --json > .team/evidence/ge-ci-results.json

# Spark job syntax validation
for f in spark_jobs/*.py; do python -m py_compile "$f" || exit 1; done
```

---

## 16. PM KANBAN -- REAL-TIME TRACKING

### GitHub Projects V2 Setup
```bash
# Create project board
gh project create --title "DataEng: <project-name>" --owner @me

# Create custom fields for data engineering
gh project field-create <PROJECT_NUMBER> --owner @me --name "Data Domain" --data-type "SINGLE_SELECT" \
  --single-select-options "orders,customers,products,events,analytics"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Pipeline Layer" --data-type "SINGLE_SELECT" \
  --single-select-options "bronze,silver,gold,streaming"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Evidence Status" --data-type "SINGLE_SELECT" \
  --single-select-options "pending,collected,verified,stale"
```

### Real-Time Issue Updates
After each task completion:
```bash
# Update issue status
gh issue edit <NUMBER> --add-label "status:done"

# Add evidence reference
gh issue comment <NUMBER> --body "Evidence collected:
- DAG parse: .team/evidence/airflow-dag-parse.log
- dbt tests: .team/evidence/dbt-test-results.json
- Commit: $(git rev-parse --short HEAD)"

# Move card on project board
gh project item-edit --id <ITEM_ID> --project-id <PROJECT_ID> --field-id <STATUS_FIELD_ID> --single-select-option-id <DONE_OPTION_ID>
```

### PM 6-Hour Report Cycle
```
CYCLE START:
  1. Read KANBAN.md for current state
  2. Query GitHub Issues: gh issue list --state all --json number,title,state,labels
  3. Collect evidence timestamps from .team/evidence/
  4. Generate PPTX with:
     - Pipeline status by data domain (table)
     - Data quality scores (chart)
     - SLA compliance percentage (gauge)
     - Evidence collection status (checklist)
     - Test coverage metrics (bar chart)
  5. Generate PDF with detailed activity log
  6. Commit reports: git add .team/reports/ && git commit -m "docs(report): 6-hour status update"
CYCLE END
```

### Evidence-Linked Kanban Columns

| Column | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| Backlog | Issue created with data domain label | PM assigns to wave |
| In Progress | Agent spawned and working | Agent writes first artifact |
| In Review | Artifact exists in `.team/` | Evidence collected and verified |
| Evidence Collected | Test output saved to `.team/evidence/` | All tests pass, evidence fresh |
| Done | QA sign-off, evidence verified, commit recorded | PM closes issue |
| Blocked | Dependency missing or test failure | Blocker resolved, re-enter In Progress |

---

*Data Engineering Team v3.0 -- Amenthyx AI Teams*
*10 Roles | 5 Waves | 10 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Based*
*See shared/ENHANCED_EXECUTION_PROTOCOL.md for cross-team protocol details*
