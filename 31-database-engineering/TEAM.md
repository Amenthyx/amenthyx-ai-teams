# Database Engineering Team
# Activation: `--team databaseEng`
# Focus: PostgreSQL, MongoDB, Redis, schema design, migrations, query optimization, replication

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Evidence & Proof Protocol](#7-evidence--proof-protocol)
8. [Local Install & Test Protocol](#8-local-install--test-protocol)
9. [Atomic Commit Protocol](#9-atomic-commit-protocol)
10. [Comprehensive Testing Matrix](#10-comprehensive-testing-matrix)
11. [GitHub Actions -- Local Testing with act](#11-github-actions--local-testing-with-act)
12. [PM Kanban -- Real-Time Tracking](#12-pm-kanban--real-time-tracking)
13. [Quality Gates](#13-quality-gates)
14. [`.team/` Directory Layout](#14-team-directory-layout)
15. [Reporting System -- PPTX & PDF](#15-reporting-system--pptx--pdf)
16. [Error Handling & Session Management](#16-error-handling--session-management)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team databaseEng --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 14)
4. Spawn Team Leader agent (foreground -- this is the orchestrator)
5. Team Leader spawns PM agent (foreground -- must complete before others)
6. PM produces Project Charter + Database Architecture Plan + creates GitHub Project
7. Team Leader reviews PM output, then spawns remaining agents in waves
8. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, data model requirements, performance targets, and success criteria.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts, ensures data integrity and performance targets are met across all database workstreams.
- **Persona**: "You are the Team Leader of an 11-person database engineering team. You coordinate all database architecture, migration, optimization, and replication work, make final decisions on schema design and data modeling, enforce quality gates, and ensure the database layer ships with production-grade reliability and performance. You understand that data outlives code -- every schema decision must be designed for the long term. You communicate clearly, delegate effectively, and maintain a single source of truth in the `.team/` directory. You never write production queries directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter, database milestones, kanban. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports with query performance metrics and migration status.
- **Persona**: "You are the Project Manager. You create all planning artifacts and manage the project via GitHub Projects using `gh` CLI. You create milestones, issues with labels, and track progress. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. You track migration completion rates, query performance improvements, and replication health. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Database Architect (DBA)
- **Role**: Data modeling, schema design, normalization strategy, polyglot persistence decisions.
- **Persona**: "You are the Database Architect. You design the overall data architecture including entity-relationship models, normalization decisions (3NF vs denormalization trade-offs), polyglot persistence strategy (when to use PostgreSQL vs MongoDB vs Redis), data partitioning and sharding schemes, and data lifecycle management. You produce ERD diagrams, data dictionaries, and architecture decision records for every schema choice. You define naming conventions, indexing strategies, and constraint policies."
- **Spawning**: Wave 2 (parallel)

### 2.4 PostgreSQL Engineer (PG)
- **Role**: PostgreSQL schema implementation, stored procedures, extensions, partitioning, performance tuning.
- **Persona**: "You are the PostgreSQL Engineer. You implement PostgreSQL schemas with proper constraints, indexes, triggers, stored procedures, and views. You configure PostgreSQL extensions (pgvector, PostGIS, pg_trgm, uuid-ossp), table partitioning (range, list, hash), row-level security policies, and connection pooling (PgBouncer). You write optimized SQL queries, analyze execution plans with EXPLAIN ANALYZE, and tune postgresql.conf for workload-specific performance."
- **Spawning**: Wave 2 (parallel)

### 2.5 NoSQL Engineer (NOSQL)
- **Role**: MongoDB schema design, aggregation pipelines, Atlas configuration, document modeling.
- **Persona**: "You are the NoSQL Engineer. You design MongoDB document schemas optimized for read/write patterns, implement aggregation pipelines, configure indexes (single-field, compound, text, geospatial, TTL), set up change streams for real-time data flows, and manage Atlas cluster configuration. You make embedding vs referencing decisions based on access patterns, implement schema validation rules, and design time-series collections for metrics data."
- **Spawning**: Wave 2 (parallel)

### 2.6 Redis/Cache Engineer (CACHE)
- **Role**: Redis architecture, caching strategies, pub/sub, session management, rate limiting.
- **Persona**: "You are the Redis/Cache Engineer. You design caching strategies (cache-aside, write-through, write-behind), implement Redis data structures (strings, hashes, sorted sets, streams, HyperLogLog), configure Redis Cluster for high availability, set up pub/sub messaging, implement rate limiting with sliding windows, design session stores, and configure Redis persistence (RDB + AOF). You optimize memory usage with proper key expiration, eviction policies, and memory-efficient data structures."
- **Spawning**: Wave 2 (parallel)

### 2.7 Migration Engineer (MIG)
- **Role**: Database migration tooling, zero-downtime migrations, data transformation, version control.
- **Persona**: "You are the Migration Engineer. You design and implement database migration strategies using tools like Flyway, Alembic, Prisma Migrate, or golang-migrate. You ensure zero-downtime migrations with expand/contract patterns, backward-compatible schema changes, and blue-green database deployments. You implement rollback procedures for every migration, data transformation scripts for large-scale data changes, and migration testing in staging environments."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer (QA)
- **Role**: Database testing strategy, query performance validation, migration rollback testing.
- **Persona**: "You are the QA Engineer. You create test strategies covering pgTAP for PostgreSQL unit testing, migration rollback testing, query performance benchmarking with EXPLAIN ANALYZE, load testing with pgbench/YCSB, failover testing, data integrity validation, and connection pool stress testing. You verify that every migration is reversible, every query meets performance targets, and every failover completes within SLA."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Release coordination, migration deployment ordering, rollback procedures.
- **Persona**: "You are the Release Manager. You coordinate releases: migration ordering and dependency resolution, semantic versioning for schema changes, changelogs, deployment checklists with pre/post migration validation, rollback procedures and data recovery plans, release notes. You create GitHub Releases via `gh release create`. You ensure migrations run in the correct order across environments (dev -> staging -> production)."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: Database documentation strategy, developer guides, API documentation for data access.
- **Persona**: "You are the Marketing Strategist. You create database documentation strategies: developer data access guides, schema documentation portals, query cookbook with optimized examples, migration runbooks for operations teams, data model onboarding materials, and best practices guides. You ensure database knowledge is accessible and discoverable for all engineering teams."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: Data privacy compliance, retention policies, PII handling, audit logging requirements.
- **Persona**: "You are the Legal/Compliance Attorney. You review for GDPR data subject rights (right to erasure, right to portability), CCPA data handling requirements, PII column identification and encryption, data retention policies, audit logging for sensitive data access, cross-border data transfer restrictions, and backup data compliance. You produce data classification matrices, retention schedules, and compliance checklists for SOC 2, HIPAA, and PCI-DSS as applicable."
- **Spawning**: Wave 1.5 (background, parallel with Marketing)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +-----------+
                        |   USER    |
                        +-----+-----+
                              |
                     +--------v--------+
                     |  TEAM LEADER    |
                     |  (Orchestrator) |
                     +--------+--------+
                              |
             +----------------+----------------+
             |                |                |
      +------v------+  +-----v-----+  +-------v------+
      |     PM      |  | Marketing |  |  Attorney    |
      | (Planning)  |  |  (Docs)   |  | (Legal)      |
      +------+------+  +-----------+  +--------------+
             |
    +--------+--------+--------+--------+
    |        |        |        |        |
 +--v---+ +--v--+ +---v---+ +--v----+ +-v----+
 | DBA  | | PG  | | NOSQL | | CACHE | | MIG  |
 +--+---+ +--+--+ +---+---+ +--+----+ +--+---+
    |        |        |       |          |
    +--------+--------+------++----------+
                      |
                +-----v-----+
                |     QA     |
                +-----+------+
                      |
             +--------v--------+
             | Release Manager |
             +-----------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Database engineering project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Database Architecture Milestone Plan -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register (focus: data loss, migration failures, performance degradation) -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Database documentation strategy", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: Data privacy & retention compliance", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 5 agents)
```
DBA   -> .team/data-architecture/  (ERD_DIAGRAM.md, DATA_DICTIONARY.md, NORMALIZATION_DECISIONS.md, PARTITIONING_STRATEGY.md)
PG    -> .team/postgresql/         (SCHEMA_DDL.md, INDEXES.md, STORED_PROCEDURES.md, EXTENSIONS.md, PG_CONFIG_TUNING.md)
NOSQL -> .team/mongodb/            (DOCUMENT_SCHEMAS.md, AGGREGATION_PIPELINES.md, INDEX_STRATEGY.md, ATLAS_CONFIG.md)
CACHE -> .team/redis/              (CACHING_STRATEGY.md, DATA_STRUCTURES.md, CLUSTER_CONFIG.md, PERSISTENCE_CONFIG.md)
MIG   -> .team/migrations/         (MIGRATION_STRATEGY.md, MIGRATION_SCRIPTS.md, ROLLBACK_PROCEDURES.md, ZERO_DOWNTIME_PLAN.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, PGTAP_RESULTS.md, MIGRATION_TESTS.md, PERFORMANCE_BENCHMARKS.md, FAILOVER_TESTS.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, ROLLBACK_PLAN.md, RELEASE_NOTES.md, MIGRATION_ORDER.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| Database Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | Role + priority + wave + database type labels |
| Releases | `.team/releases/` | `gh release create` |
| Performance Baselines | `.team/evidence/performance/baseline_metrics.md` | Linked to milestone |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Database Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: database documentation strategy, developer guides, query cookbooks
+-- Attorney: data privacy, PII handling, retention policies, audit logging, GDPR/CCPA
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- DBA, PG, NOSQL, CACHE, MIG -- all in parallel
+-- SYNC: TL waits for all 5 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF with query performance metrics
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: pgTAP tests, migration rollback, performance benchmarks, failover tests, sign-off
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: migration ordering, changelog, rollback plan, deployment sign-off
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF with database performance summary
+-- PM: close all GitHub milestones
+-- TL: present summary to user with migration status and performance baselines
```

---

## 7. EVIDENCE & PROOF PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 1

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works. Database engineering evidence must demonstrate measurable performance and data integrity.

### Database Engineering Evidence Requirements

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
| DBA | Entity-relationship diagram (Mermaid/PlantUML) | `.team/evidence/architecture/erd_diagram.md` |
| DBA | Data dictionary with column types and constraints | `.team/evidence/architecture/data_dictionary.md` |
| DBA | Normalization analysis document | `.team/evidence/architecture/normalization_analysis.md` |
| PG | Schema DDL execution log | `psql -f schema.sql 2>&1 \| tee .team/evidence/pg/schema_apply.log` |
| PG | EXPLAIN ANALYZE output for critical queries | `psql -c "EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT ..." > .team/evidence/pg/explain_query_{name}.json` |
| PG | Index usage report | `psql -c "SELECT ... FROM pg_stat_user_indexes" > .team/evidence/pg/index_usage.log` |
| PG | PostgreSQL configuration diff | `diff postgresql.conf.default postgresql.conf > .team/evidence/pg/config_diff.log` |
| PG | pgbench benchmark results | `pgbench -c 10 -j 2 -T 60 dbname 2>&1 \| tee .team/evidence/pg/pgbench_results.log` |
| NOSQL | MongoDB schema validation rules | `.team/evidence/mongo/schema_validation.json` |
| NOSQL | Aggregation pipeline explain output | `db.collection.explain("executionStats").aggregate([...]) > .team/evidence/mongo/agg_explain.json` |
| NOSQL | MongoDB index stats | `db.collection.aggregate([{$indexStats:{}}]) > .team/evidence/mongo/index_stats.json` |
| CACHE | Redis memory analysis | `redis-cli --bigkeys 2>&1 \| tee .team/evidence/redis/bigkeys.log` |
| CACHE | Redis INFO output | `redis-cli INFO > .team/evidence/redis/info.log` |
| CACHE | Cache hit rate verification | `.team/evidence/redis/hit_rate.log` -- keyspace_hits / (hits + misses) |
| MIG | Migration up + down execution logs | `.team/evidence/migrations/migrate_up.log` + `.team/evidence/migrations/migrate_down.log` |
| MIG | Migration rollback proof | `.team/evidence/migrations/rollback_test.log` -- apply, rollback, re-apply |
| MIG | Schema diff before/after migration | `pg_dump --schema-only > .team/evidence/migrations/schema_before.sql` then diff |
| QA | pgTAP test results | `.team/evidence/tests/unit/pgtap_results.log` |
| QA | Failover test results | `.team/evidence/tests/integration/failover_test.log` |
| QA | Connection pool stress test | `.team/evidence/tests/performance/pool_stress.log` |

### Evidence Manifest (Per Agent)

Every agent writes to `.team/evidence/manifests/{ROLE}_manifest.md`:

```markdown
# Evidence Manifest -- {AGENT_ROLE}
## Task: {task_description}
## Date: {ISO_8601_timestamp}

### Artifacts Produced
- [ ] `path/to/artifact.md` -- description
- [ ] `path/to/migration/` -- description

### Evidence Collected
- [ ] Schema apply log: `.team/evidence/pg/schema_apply.log`
- [ ] EXPLAIN output: `.team/evidence/pg/explain_query_{name}.json`
- [ ] Benchmark results: `.team/evidence/pg/pgbench_results.log`
- [ ] Migration logs: `.team/evidence/migrations/migrate_up.log`

### Verification Steps (Reproducible)
1. `cd /path/to/project`
2. `docker compose up -d postgres mongo redis`
3. `psql -h localhost -U postgres -f schema.sql`
4. `flyway migrate` or `alembic upgrade head`
5. `psql -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'"`
6. `pgbench -c 10 -j 2 -T 30 dbname`

### Status: VERIFIED / UNVERIFIED
```

---

## 8. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally as if deploying to production. No "it works in theory."

### Docker Compose Database Stack

```bash
# STEP 1: Environment verification
docker --version && docker compose version > .team/evidence/env_docker.txt
psql --version >> .team/evidence/env_psql.txt 2>&1 || echo "psql client not found"
mongosh --version >> .team/evidence/env_mongosh.txt 2>&1 || echo "mongosh not found"
redis-cli --version >> .team/evidence/env_redis.txt 2>&1 || echo "redis-cli not found"

# STEP 2: Create docker-compose.databases.yml
cat > docker-compose.databases.yml << 'DBEOF'
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dbadmin
      POSTGRES_PASSWORD: dbpassword
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init-scripts/pg:/docker-entrypoint-initdb.d
    command: >
      postgres
        -c shared_preload_libraries=pg_stat_statements
        -c pg_stat_statements.track=all
        -c log_min_duration_statement=100
        -c log_statement=ddl

  postgres-replica:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dbadmin
      POSTGRES_PASSWORD: dbpassword
    ports:
      - "5433:5432"
    depends_on:
      - postgres

  mongodb:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongoadmin
      MONGO_INITDB_ROOT_PASSWORD: mongopassword
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db
      - ./init-scripts/mongo:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redisdata:/data

  redis-sentinel:
    image: redis:7-alpine
    ports:
      - "26379:26379"
    depends_on:
      - redis

volumes:
  pgdata:
  mongodata:
  redisdata:
DBEOF

# STEP 3: Start database stack
docker compose -f docker-compose.databases.yml up -d 2>&1 | tee .team/evidence/runtime/compose_up.log

# STEP 4: Wait for databases to be ready
sleep 10
```

### PostgreSQL Setup & Validation Protocol

```bash
# STEP 1: Verify PostgreSQL connectivity
psql -h localhost -U dbadmin -d appdb -c "SELECT version();" > .team/evidence/pg/version.log 2>&1

# STEP 2: Apply schema
psql -h localhost -U dbadmin -d appdb -f migrations/schema.sql \
  2>&1 | tee .team/evidence/pg/schema_apply.log

# STEP 3: Install extensions
psql -h localhost -U dbadmin -d appdb -c "
  CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
  CREATE EXTENSION IF NOT EXISTS uuid_ossp;
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
" 2>&1 | tee .team/evidence/pg/extensions.log

# STEP 4: Verify schema
psql -h localhost -U dbadmin -d appdb -c "
  SELECT table_name, column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position;
" > .team/evidence/pg/schema_verify.log 2>&1

# STEP 5: Run EXPLAIN ANALYZE on critical queries
psql -h localhost -U dbadmin -d appdb -c "
  EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
  SELECT * FROM users WHERE email = 'test@example.com';
" > .team/evidence/pg/explain_user_lookup.json 2>&1

# STEP 6: Check index usage
psql -h localhost -U dbadmin -d appdb -c "
  SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
  FROM pg_stat_user_indexes
  ORDER BY idx_scan DESC;
" > .team/evidence/pg/index_usage.log 2>&1

# STEP 7: Run pgbench
pgbench -h localhost -U dbadmin -i -s 10 appdb 2>&1 | tee .team/evidence/pg/pgbench_init.log
pgbench -h localhost -U dbadmin -c 10 -j 2 -T 60 -r appdb \
  2>&1 | tee .team/evidence/pg/pgbench_results.log
```

### MongoDB Setup & Validation Protocol

```bash
# STEP 1: Verify MongoDB connectivity
mongosh --host localhost --username mongoadmin --password mongopassword \
  --eval "db.adminCommand({ping: 1})" > .team/evidence/mongo/ping.log 2>&1

# STEP 2: Apply schema validation rules
mongosh --host localhost --username mongoadmin --password mongopassword appdb \
  --file migrations/mongo_schema_validation.js \
  2>&1 | tee .team/evidence/mongo/schema_validation_apply.log

# STEP 3: Create indexes
mongosh --host localhost --username mongoadmin --password mongopassword appdb \
  --file migrations/mongo_indexes.js \
  2>&1 | tee .team/evidence/mongo/index_creation.log

# STEP 4: Verify indexes
mongosh --host localhost --username mongoadmin --password mongopassword appdb \
  --eval "db.getCollectionNames().forEach(c => { print(c + ':'); printjson(db[c].getIndexes()); })" \
  > .team/evidence/mongo/index_verify.log 2>&1

# STEP 5: Test aggregation pipeline
mongosh --host localhost --username mongoadmin --password mongopassword appdb \
  --eval "db.orders.explain('executionStats').aggregate([
    {\$match: {status: 'completed'}},
    {\$group: {_id: '\$customerId', total: {\$sum: '\$amount'}}},
    {\$sort: {total: -1}},
    {\$limit: 10}
  ])" > .team/evidence/mongo/agg_explain.json 2>&1
```

### Redis Setup & Validation Protocol

```bash
# STEP 1: Verify Redis connectivity
redis-cli -h localhost ping > .team/evidence/redis/ping.log 2>&1

# STEP 2: Verify configuration
redis-cli -h localhost CONFIG GET maxmemory >> .team/evidence/redis/config.log 2>&1
redis-cli -h localhost CONFIG GET maxmemory-policy >> .team/evidence/redis/config.log 2>&1
redis-cli -h localhost CONFIG GET appendonly >> .team/evidence/redis/config.log 2>&1

# STEP 3: Test data structures
redis-cli -h localhost SET test:string "hello" EX 300 > .team/evidence/redis/data_test.log 2>&1
redis-cli -h localhost HSET test:hash field1 "value1" field2 "value2" >> .team/evidence/redis/data_test.log 2>&1
redis-cli -h localhost ZADD test:sorted 1 "a" 2 "b" 3 "c" >> .team/evidence/redis/data_test.log 2>&1
redis-cli -h localhost XADD test:stream '*' key1 value1 >> .team/evidence/redis/data_test.log 2>&1

# STEP 4: Memory analysis
redis-cli -h localhost INFO memory > .team/evidence/redis/memory_info.log 2>&1
redis-cli -h localhost --bigkeys 2>&1 | tee .team/evidence/redis/bigkeys.log

# STEP 5: Full INFO dump
redis-cli -h localhost INFO > .team/evidence/redis/info.log 2>&1
```

### Migration Tool Protocol (Flyway / Alembic / Prisma)

```bash
# === FLYWAY (Java/SQL) ===
# STEP 1: Verify Flyway
flyway --version > .team/evidence/env_flyway.txt 2>&1

# STEP 2: Run migrations
flyway -url=jdbc:postgresql://localhost:5432/appdb \
  -user=dbadmin -password=dbpassword \
  migrate 2>&1 | tee .team/evidence/migrations/flyway_migrate.log

# STEP 3: Verify migration status
flyway -url=jdbc:postgresql://localhost:5432/appdb \
  -user=dbadmin -password=dbpassword \
  info 2>&1 | tee .team/evidence/migrations/flyway_info.log

# STEP 4: Test rollback (undo)
flyway -url=jdbc:postgresql://localhost:5432/appdb \
  -user=dbadmin -password=dbpassword \
  undo 2>&1 | tee .team/evidence/migrations/flyway_undo.log

# === ALEMBIC (Python) ===
# STEP 1: Run migrations
alembic upgrade head 2>&1 | tee .team/evidence/migrations/alembic_upgrade.log

# STEP 2: Verify current revision
alembic current 2>&1 | tee .team/evidence/migrations/alembic_current.log

# STEP 3: Test rollback
alembic downgrade -1 2>&1 | tee .team/evidence/migrations/alembic_downgrade.log
alembic upgrade head 2>&1 | tee .team/evidence/migrations/alembic_reupgrade.log

# === PRISMA (Node.js) ===
# STEP 1: Generate client
npx prisma generate 2>&1 | tee .team/evidence/migrations/prisma_generate.log

# STEP 2: Run migrations
npx prisma migrate deploy 2>&1 | tee .team/evidence/migrations/prisma_migrate.log

# STEP 3: Verify schema
npx prisma db pull 2>&1 | tee .team/evidence/migrations/prisma_pull.log

# STEP 4: Schema diff
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma \
  --to-url "postgresql://dbadmin:dbpassword@localhost:5432/appdb" \
  2>&1 | tee .team/evidence/migrations/prisma_diff.log
```

### Stack Cleanup Protocol

```bash
# STEP 1: Stop all containers
docker compose -f docker-compose.databases.yml down 2>&1 | tee .team/evidence/runtime/compose_down.log

# STEP 2: Remove volumes (only for clean reset)
docker compose -f docker-compose.databases.yml down -v 2>&1 | tee .team/evidence/runtime/compose_destroy.log
```

---

## 9. ATOMIC COMMIT PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 3

### Mandate
Every single meaningful change MUST be a separate git commit. The PM tracks each commit and links it to the GitHub kanban board.

### Commit Format (Conventional Commits)

```
<type>(<scope>): <description> [#issue_number]

<body>

Evidence: .team/evidence/{relevant_evidence_file}
Agent: {AGENT_ROLE}
Wave: {wave_number}
```

### Commit Types

| Type | When |
|------|------|
| `feat` | New table, index, migration, caching strategy, or aggregation pipeline |
| `fix` | Bug fix in schema, migration, query, or configuration |
| `test` | Adding or updating pgTAP tests, migration tests, benchmarks |
| `docs` | Documentation changes (ERD, data dictionary, query cookbook) |
| `ci` | CI/CD pipeline changes (migration validation, schema diff, benchmarks) |
| `refactor` | Schema restructuring, query optimization, index reorganization |
| `perf` | Query optimization, index tuning, cache strategy improvement |
| `security` | Security fix (RLS policies, encryption, audit logging) |
| `chore` | Build, dependency, config changes (pg extensions, Redis config) |
| `evidence` | Adding proof/evidence artifacts |

### Rules

1. **One logical change per commit** -- never bundle unrelated changes
2. **Reference issue number** -- `feat(pg): add users table with B-tree indexes [#12]`
3. **Include evidence reference** -- point to proof in `.team/evidence/`
4. **Never commit secrets** -- use `.gitignore`, verify with `gitleaks detect`
5. **Run pre-commit hooks** -- never skip with `--no-verify`

### Agent Commit Workflow

```bash
# 1. Stage specific files (NEVER git add -A or git add .)
git add migrations/V003__create_users_table.sql migrations/V003__rollback.sql

# 2. Verify staged content
git diff --cached --stat

# 3. Commit with conventional format
git commit -m "feat(pg): add users table with email uniqueness and B-tree indexes [#12]

- CREATE TABLE users (id UUID PK, email UNIQUE, name, created_at, updated_at)
- B-tree index on email for login lookups
- GIN index on name using pg_trgm for search
- Row-level security policy for multi-tenant isolation
- Rollback script drops table and indexes

Evidence: .team/evidence/pg/schema_apply.log, .team/evidence/pg/explain_user_lookup.json
Agent: PostgreSQL Engineer
Wave: 2"

# 4. PM updates kanban card to "In Review"
```

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
| # | Hash | Agent | Type | Description | Issue | Wave | Evidence |
|---|------|-------|------|-------------|-------|------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | manifest |
| 2 | def5678 | DBA | feat | ERD + data dictionary | #10 | 2 | erd_diagram.md |
| 3 | ghi9012 | PG | feat | users table + indexes | #12 | 2 | schema_apply.log |
| 4 | jkl3456 | NOSQL | feat | MongoDB document schemas | #15 | 2 | schema_validation.json |
| 5 | mno7890 | CACHE | feat | Redis caching strategy | #18 | 2 | hit_rate.log |
| 6 | pqr1234 | MIG | feat | Flyway migrations V001-V010 | #20 | 2 | flyway_migrate.log |
```

---

## 10. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### Database Engineering Test Pyramid

```
                    +----------+
                    | Release  |  <- Production migration dry-run
                   +------------+
                   | Failover   |  <- Replica promotion, Redis sentinel
                  +--------------+
                  | Load Tests    |  <- pgbench, YCSB, redis-benchmark
                 +----------------+
                 | Migration Tests |  <- Up/down/re-up for every migration
                +------------------+
                | Integration Tests |  <- Cross-database queries, cache coherence
               +--------------------+
               | Unit Tests (pgTAP)  |  <- Table/function/trigger level
              +----------------------+
              | Schema Validation     |  <- DDL syntax, constraint check, type safety
              +----------------------+
```

### Coverage Requirements

| Layer | Minimum | Tools | Blocking? |
|-------|---------|-------|-----------|
| Schema Validation | 100% DDL files validated | `psql -f`, `mongosh --eval`, sqlfluff | YES |
| Unit Tests (pgTAP) | All tables, functions, triggers, constraints | pgTAP, pg_prove | YES |
| Migration Tests | All migrations up + down + re-up | Flyway/Alembic/Prisma + rollback verification | YES |
| Integration Tests | All cross-database flows, cache coherence | Custom test harness, Testcontainers | YES |
| Query Performance | All P0 queries within latency target | EXPLAIN ANALYZE, pg_stat_statements | YES |
| Load Tests | Throughput within capacity target | pgbench (PostgreSQL), YCSB (MongoDB), redis-benchmark | YES |
| Failover Tests | Recovery within SLA | Replica promotion, Redis Sentinel failover | YES |
| Security Tests | Zero unauthorized access paths | RLS verification, authentication audit | YES |
| Data Integrity | All constraints enforced, no orphans | FK validation, consistency checks | YES |
| Backup/Restore | Full backup + restore within RTO | pg_dump/pg_restore, mongodump/mongorestore | WARN |

### QA Agent Testing Protocol

```
PHASE 1: SCHEMA VALIDATION
+-- sqlfluff lint on all DDL files -> .team/evidence/tests/static/sqlfluff.log
+-- psql syntax check on all DDL files -> .team/evidence/tests/static/ddl_syntax.log
+-- MongoDB schema validation rule check -> .team/evidence/tests/static/mongo_schema.log
+-- Constraint completeness audit (PK, FK, NOT NULL, CHECK) -> .team/evidence/tests/static/constraint_audit.log
+-- Naming convention validation -> .team/evidence/tests/static/naming_check.log
+-- gitleaks secret scan -> .team/evidence/tests/static/gitleaks.log

PHASE 2: UNIT TESTS (pgTAP)
+-- Install pgTAP: CREATE EXTENSION pgtap;
+-- pg_prove tests/pg/*.sql -> .team/evidence/tests/unit/pgtap_results.log
+-- Test: table existence, column types, constraints, indexes
+-- Test: stored procedures input/output
+-- Test: trigger behavior
+-- Test: row-level security policies
+-- Run 3x to detect flaky tests

PHASE 3: MIGRATION TESTS
+-- For each migration file:
    +-- Apply UP migration -> .team/evidence/tests/integration/migration_{version}_up.log
    +-- Verify schema state matches expected
    +-- Apply DOWN migration -> .team/evidence/tests/integration/migration_{version}_down.log
    +-- Verify schema reverted to previous state
    +-- Re-apply UP migration -> .team/evidence/tests/integration/migration_{version}_reup.log
    +-- Verify idempotency where applicable
+-- Full migration chain: V001 -> latest -> V001 -> latest
+-- EVIDENCE: .team/evidence/tests/integration/migration_full_chain.log

PHASE 4: QUERY PERFORMANCE TESTS
+-- EXPLAIN ANALYZE for all P0 queries -> .team/evidence/tests/performance/explain_*.json
+-- Verify sequential scans are intentional (not missing indexes)
+-- Verify index-only scans where expected
+-- Check buffer usage (shared hits vs reads)
+-- pg_stat_statements top 10 by total_time -> .team/evidence/tests/performance/slow_queries.log
+-- Compare against strategy-defined latency targets

PHASE 5: LOAD TESTS
+-- pgbench: TPS at 10, 50, 100 concurrent connections
    -> .team/evidence/tests/performance/pgbench_10c.log
    -> .team/evidence/tests/performance/pgbench_50c.log
    -> .team/evidence/tests/performance/pgbench_100c.log
+-- YCSB (MongoDB): workloads A-F -> .team/evidence/tests/performance/ycsb_results.log
+-- redis-benchmark: GET/SET/INCR/LPUSH/SADD
    -> .team/evidence/tests/performance/redis_benchmark.log
+-- Connection pool saturation test -> .team/evidence/tests/performance/pool_stress.log

PHASE 6: FAILOVER TESTS
+-- PostgreSQL: promote replica, verify data consistency
    -> .team/evidence/tests/integration/pg_failover.log
+-- MongoDB: rs.stepDown(), verify election + write resumption
    -> .team/evidence/tests/integration/mongo_failover.log
+-- Redis: sentinel failover, verify client reconnection
    -> .team/evidence/tests/integration/redis_failover.log
+-- Measure failover time vs SLA target
+-- EVIDENCE: failover duration timestamps in each log

PHASE 7: SECURITY TESTS
+-- RLS policy verification: test with different roles
    -> .team/evidence/tests/security/rls_verification.log
+-- Authentication audit: password policies, SSL enforcement
    -> .team/evidence/tests/security/auth_audit.log
+-- PII column encryption verification
    -> .team/evidence/tests/security/pii_encryption.log
+-- Audit log completeness check
    -> .team/evidence/tests/security/audit_log_check.log
+-- gitleaks full repo scan -> .team/evidence/tests/security/gitleaks_full.log

PHASE 8: RELEASE VERIFICATION
+-- Production migration dry-run (staging environment)
    -> .team/evidence/tests/release/staging_migration.log
+-- Backup + restore cycle -> .team/evidence/tests/release/backup_restore.log
+-- Connection pool drain + restart -> .team/evidence/tests/release/pool_drain.log
+-- Application health check after migration -> .team/evidence/tests/release/app_health.log
```

---

## 11. GITHUB ACTIONS -- LOCAL TESTING WITH ACT

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 5

### Mandate
All CI/CD workflows MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### Database Engineering CI Workflow

```yaml
# .github/workflows/database.yml
name: Database CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'migrations/**'
      - 'schemas/**'
      - 'tests/**'
  pull_request:
    branches: [main]

jobs:
  validate-sql:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install sqlfluff
        run: pip install sqlfluff
      - name: Lint SQL files
        run: sqlfluff lint migrations/ schemas/ --dialect postgres
      - name: Fix suggestions
        run: sqlfluff fix migrations/ schemas/ --dialect postgres --force

  migration-test:
    runs-on: ubuntu-latest
    needs: validate-sql
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: dbadmin
          POSTGRES_PASSWORD: dbpassword
          POSTGRES_DB: testdb
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Install Flyway
        run: |
          wget -qO- https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/10.7.1/flyway-commandline-10.7.1-linux-x64.tar.gz | tar xz
          sudo ln -s $(pwd)/flyway-*/flyway /usr/local/bin/
      - name: Run migrations UP
        run: |
          flyway -url=jdbc:postgresql://localhost:5432/testdb \
            -user=dbadmin -password=dbpassword \
            -locations=filesystem:migrations/ \
            migrate
      - name: Verify migration info
        run: |
          flyway -url=jdbc:postgresql://localhost:5432/testdb \
            -user=dbadmin -password=dbpassword \
            info

  schema-diff:
    runs-on: ubuntu-latest
    needs: migration-test
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: dbadmin
          POSTGRES_PASSWORD: dbpassword
          POSTGRES_DB: testdb
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Apply migrations and dump schema
        run: |
          PGPASSWORD=dbpassword psql -h localhost -U dbadmin -d testdb -f migrations/full_schema.sql
          PGPASSWORD=dbpassword pg_dump -h localhost -U dbadmin -d testdb --schema-only > schema_current.sql
      - name: Compare with expected schema
        run: diff schemas/expected_schema.sql schema_current.sql || true
      - uses: actions/upload-artifact@v4
        with:
          name: schema-diff
          path: schema_current.sql

  pgtap-tests:
    runs-on: ubuntu-latest
    needs: migration-test
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: dbadmin
          POSTGRES_PASSWORD: dbpassword
          POSTGRES_DB: testdb
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Install pgTAP
        run: |
          sudo apt-get update && sudo apt-get install -y postgresql-client libtap-parser-sourcehandler-pgtap-perl
          PGPASSWORD=dbpassword psql -h localhost -U dbadmin -d testdb -c "CREATE EXTENSION IF NOT EXISTS pgtap;"
      - name: Apply migrations
        run: |
          PGPASSWORD=dbpassword psql -h localhost -U dbadmin -d testdb -f migrations/full_schema.sql
      - name: Run pgTAP tests
        run: |
          pg_prove -h localhost -U dbadmin -d testdb tests/pg/*.sql 2>&1 | tee pgtap_results.log
      - uses: actions/upload-artifact@v4
        with:
          name: pgtap-results
          path: pgtap_results.log

  performance-benchmark:
    runs-on: ubuntu-latest
    needs: migration-test
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: dbadmin
          POSTGRES_PASSWORD: dbpassword
          POSTGRES_DB: benchdb
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Initialize pgbench
        run: |
          PGPASSWORD=dbpassword pgbench -h localhost -U dbadmin -i -s 10 benchdb
      - name: Run benchmark
        run: |
          PGPASSWORD=dbpassword pgbench -h localhost -U dbadmin -c 10 -j 2 -T 30 -r benchdb \
            2>&1 | tee pgbench_results.log
      - uses: actions/upload-artifact@v4
        with:
          name: benchmark-results
          path: pgbench_results.log

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
      - name: Check for hardcoded credentials in SQL
        run: |
          grep -rn "PASSWORD\s*=" migrations/ schemas/ --include="*.sql" | grep -v "dbpassword" | grep -v "test" || true
```

### Local Validation with `act`

```bash
# Install act
# Windows: scoop install act / choco install act-cli
# macOS: brew install act
# Linux: curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Validate workflow syntax
yamllint .github/workflows/*.yml
actionlint .github/workflows/*.yml

# Dry run
act -n 2>&1 | tee .team/evidence/ci/act_dryrun.log

# Full local execution
act push 2>&1 | tee .team/evidence/ci/act_push.log

# Run specific job
act -j migration-test 2>&1 | tee .team/evidence/ci/act_migration.log
act -j pgtap-tests 2>&1 | tee .team/evidence/ci/act_pgtap.log
act -j performance-benchmark 2>&1 | tee .team/evidence/ci/act_benchmark.log

# EVIDENCE: All act output saved to .team/evidence/ci/
```

---

## 12. PM KANBAN -- REAL-TIME TRACKING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 6

### Mandate
The PM MUST maintain the GitHub Project board in real-time. Every state change is reflected immediately.

### Board Columns (GitHub Projects V2)

| Column | Meaning | Cards Move Here When |
|--------|---------|---------------------|
| **Backlog** | Not started | Issue created, not yet assigned |
| **Sprint Ready** | Prioritized for current wave | PM approves for current wave |
| **In Progress** | Agent actively working | Agent starts task |
| **In Review** | Work done, awaiting TL review | Agent completes, evidence submitted |
| **Testing** | QA validating | QA picks up for testing |
| **Done** | Verified complete with evidence | QA passes + evidence verified |
| **Blocked** | Cannot proceed | Dependency or issue blocking |

### PM Real-Time Update Protocol

```
ON WAVE START:
+-- Move all wave issues from "Backlog" to "Sprint Ready"
+-- Comment: "Wave {N} started -- {timestamp}"
+-- Update .team/KANBAN.md

ON AGENT START:
+-- Move issue from "Sprint Ready" to "In Progress"
+-- Comment: "Agent {ROLE} started work -- {timestamp}"
+-- Add "status:in-progress" label

ON AGENT COMPLETE:
+-- Move issue from "In Progress" to "In Review"
+-- Comment with evidence manifest link and commit hash
+-- Add "status:in-review" label, remove "status:in-progress"

ON QA PASS:
+-- Move issue from "Testing" to "Done"
+-- Close issue with evidence verification link
+-- Add "status:done" + "evidence:verified" labels

ON BLOCK:
+-- Move issue to "Blocked"
+-- Comment: "BLOCKED: {reason}. Waiting on: {dependency}"
+-- Create linked blocking issue if needed
```

### GitHub Commands for Board Management

```bash
# Create Project V2
gh project create --title "{PROJECT} Database Kanban" --owner "{ORG}" --format board

# Add custom fields
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Wave" --data-type "SINGLE_SELECT" --single-select-options "Wave 0,Wave 1,Wave 1.5,Wave 2,Wave 3,Wave 4,Wave 5"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Agent" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Evidence" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Database" --data-type "SINGLE_SELECT" --single-select-options "PostgreSQL,MongoDB,Redis,Cross-DB,Migration"

# Create issue with full metadata
gh issue create \
  --title "feat(pg): create users table with indexes and RLS policies" \
  --body "## Acceptance Criteria
- [ ] CREATE TABLE users with UUID PK, email UNIQUE, timestamps
- [ ] B-tree index on email for login lookups
- [ ] GIN index on name using pg_trgm for search
- [ ] Row-level security policy for multi-tenant isolation
- [ ] Rollback migration script

## Evidence Required
- [ ] Schema apply log clean
- [ ] EXPLAIN ANALYZE for email lookup (index scan, < 1ms)
- [ ] pgTAP tests passing for table + constraints
- [ ] Migration up + down verified
- [ ] pgbench baseline established

## Assigned Agent: PostgreSQL Engineer (Wave 2)" \
  --label "role:postgresql,P0:critical,wave:2-engineering,db:postgresql" \
  --milestone "M2: Core Schema"

# Bulk create labels
for label in "role:dba:0052CC" "role:postgresql:336791" "role:mongodb:47A248" "role:redis:DC382D" "role:migration:fbca04" "db:postgresql:336791" "db:mongodb:47A248" "db:redis:DC382D" "db:cross-db:9E9E9E" "status:backlog:CCCCCC" "status:in-progress:d93f0b" "status:in-review:fbca04" "status:done:0e8a16" "status:blocked:000000" "evidence:verified:00C853" "evidence:missing:FF1744"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

---

## 13. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| Engineering Complete | After Wave 2 | All database artifacts (architecture, PG, MongoDB, Redis, migrations) exist | Re-spawn specific agent |
| Schema Validation Gate | Before QA | All DDL files execute without errors, constraints enforced | Re-spawn PG/NOSQL |
| Migration Reversibility Gate | Before QA | Every migration has a tested rollback script | Re-spawn MIG |
| Query Performance Gate | Before QA | All P0 queries use index scans, latency within targets | Re-spawn PG for optimization |
| pgTAP Test Gate | Before QA | All pgTAP tests pass | Re-spawn PG |
| QA Pass | After QA | `QA_SIGNOFF.md` status: PASS | Enter Bug Fix Loop |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_SIGNOFF.md` approved | RM lists blocking items |
| Evidence Complete | Before QA | Every agent has evidence manifest, all items checked | Re-spawn agent to collect evidence |
| Load Test Gate | Before Release | pgbench TPS within capacity target, no connection pool exhaustion | Scale or optimize |
| Failover Gate | Before Release | PostgreSQL/MongoDB/Redis failover completes within SLA | Fix replication config |
| CI Validation Gate | Before push | `act push` succeeds locally, `actionlint` clean | Fix workflow, re-test |
| No Secrets Gate | Every commit | `gitleaks detect` finds zero secrets in staged changes | HARD STOP, rotate secrets immediately |
| Data Compliance Gate | Before Release | PII columns identified, encryption verified, retention policies implemented | Fix compliance gaps |

---

## 14. `.team/` DIRECTORY LAYOUT

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
+-- COMMIT_LOG.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- manifests/
|   |   +-- PM_manifest.md
|   |   +-- DBA_manifest.md
|   |   +-- PG_manifest.md
|   |   +-- NOSQL_manifest.md
|   |   +-- CACHE_manifest.md
|   |   +-- MIG_manifest.md
|   |   +-- QA_manifest.md
|   +-- architecture/
|   |   +-- erd_diagram.md
|   |   +-- data_dictionary.md
|   |   +-- normalization_analysis.md
|   +-- pg/
|   |   +-- schema_apply.log
|   |   +-- explain_query_*.json
|   |   +-- index_usage.log
|   |   +-- config_diff.log
|   |   +-- pgbench_results.log
|   |   +-- extensions.log
|   |   +-- version.log
|   +-- mongo/
|   |   +-- schema_validation.json
|   |   +-- agg_explain.json
|   |   +-- index_stats.json
|   |   +-- ping.log
|   +-- redis/
|   |   +-- bigkeys.log
|   |   +-- info.log
|   |   +-- config.log
|   |   +-- memory_info.log
|   |   +-- hit_rate.log
|   +-- migrations/
|   |   +-- flyway_migrate.log
|   |   +-- flyway_info.log
|   |   +-- flyway_undo.log
|   |   +-- alembic_upgrade.log
|   |   +-- schema_before.sql
|   |   +-- schema_after.sql
|   +-- tests/
|   |   +-- static/
|   |   +-- unit/
|   |   +-- integration/
|   |   +-- performance/
|   |   +-- security/
|   |   +-- release/
|   +-- runtime/
|   |   +-- compose_up.log
|   |   +-- compose_down.log
|   +-- ci/
|   |   +-- act_push.log
|   |   +-- act_dryrun.log
|   |   +-- actionlint.log
+-- ci/
|   +-- .github/
|       +-- workflows/
|           +-- database.yml
+-- data-architecture/
+-- postgresql/
+-- mongodb/
+-- redis/
+-- migrations/
+-- qa/
+-- releases/
+-- marketing/
+-- legal/
```

---

## 15. REPORTING SYSTEM -- PPTX & PDF

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion

### Enhanced Report Contents

Every PPTX and PDF report MUST include:

1. **Query Performance Dashboard** -- P50/P95/P99 latency for critical queries, sequential scan count, index hit ratio
2. **Evidence Dashboard** -- count of evidence artifacts per agent, verification status per role
3. **Migration Status** -- migrations applied/pending/failed, rollback test results, schema version
4. **Commit Activity** -- commits per wave, per agent, with linked issue references
5. **EXPLAIN ANALYZE Summary** -- top slow queries, missing indexes, buffer cache hit ratio
6. **Load Test Trends** -- pgbench TPS over time, connection pool utilization, error rate
7. **Replication Health** -- replication lag, failover test results, connection pool stats
8. **Cache Performance** -- Redis hit rate, memory usage, eviction count, key expiration stats
9. **CI/CD Status** -- GitHub Actions workflow pass/fail, local `act` validation results
10. **Kanban Velocity** -- cards moved per reporting period, burn-down chart data, blocked items
11. **Blocking Issues** -- time spent blocked, dependency resolution tracking, escalations

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling & Recovery

- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Migration failure**: MIG agent captures error, checks for lock conflicts, retries with advisory lock
- **PostgreSQL connection failure**: PG agent verifies Docker container health, restarts if needed, retries
- **MongoDB authentication failure**: NOSQL agent verifies credentials, checks SCRAM-SHA-256, retries
- **Redis OOM**: CACHE agent reviews maxmemory-policy, adjusts eviction strategy, retries

### Session Management

| Command | Action |
|---------|--------|
| `--team databaseEng --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE + migration status |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `team queries` | Show top slow queries + EXPLAIN summaries |
| `team migrations` | Show migration status + pending changes |
| `team replication` | Show replication lag + failover status |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave. Database schema state is re-validated by running migration status check and integrity validation on resume.

---

*Database Engineering Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 15 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Driven | Locally-Tested*
