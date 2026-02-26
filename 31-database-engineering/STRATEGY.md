# Database Engineering Team — Tailored Strategy v3.1

> Pre-configured for **database design, optimization, migrations, and data modeling across PostgreSQL, MongoDB, Redis, and Elasticsearch**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team databaseEng --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Database Engineering Team)*

**Required Tech Stack**:
- **Language**: SQL / Python 3.12+ / Go (tooling and automation)
- **Framework**: PostgreSQL 16 / MongoDB 7 / Redis 7 / Elasticsearch 8
- **Database**: Multiple — this IS the domain (PostgreSQL as primary relational, MongoDB for document workloads, Redis for caching/sessions, Elasticsearch for search/analytics)
- **Cache**: PgBouncer / pgpool (PostgreSQL connection pooling)
- **Message Queue**: pg_notify (PostgreSQL) / MongoDB Change Streams (event-driven patterns)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS RDS / GCP Cloud SQL / Azure Database — or self-managed on Docker (dev)
- **Deployment**: Managed database services (production) / Docker Compose (development/testing)
- **CDN**: N/A (database layer)
- **Domain**: N/A (internal infrastructure)

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary relational database | Connection string (.env) | Connection pool: PgBouncer max 100 |
| MongoDB 7 | Document database | Connection URI (.env) | Connection pool max 50 |
| Redis 7 | Caching + sessions | AUTH token (.env) | N/A |
| Elasticsearch 8 | Search + analytics | API key / basic auth (.env) | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pip / go mod

**Repo Structure**: `migrations/` (versioned, reversible), `schemas/`, `scripts/`, `tools/`, `benchmarks/`, `docs/` (ERD, data dictionary)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Query response P95: < 50ms (indexed queries)
- Connection pool utilization: < 80% under normal load
- Replication lag: < 1 second (primary to replica)
- Backup RTO: < 15 minutes (full restore from backup)

**Security**:
- Row-level security (PostgreSQL RLS) for multi-tenant data isolation
- Column-level encryption for PII/sensitive fields
- Audit logging: All DDL changes and sensitive data access logged
- Connection encryption: SSL/TLS required for all database connections
- Least-privilege roles: Separate roles for app (read/write), migration (DDL), admin (superuser)
- Compliance: [FILL IN]

**Scalability**:
- Expected launch data size: [FILL IN]
- Expected 6-month data size: [FILL IN]
- Expected 1-year data size: [FILL IN]
- Scaling strategy: Read replicas for PostgreSQL (horizontal read scaling), connection pooling (PgBouncer), table partitioning for large tables, Redis cluster mode, MongoDB sharding, Elasticsearch index lifecycle management

**Availability**:
- Database uptime target: 99.99%
- RTO: 15 minutes (failover to replica / restore from backup)
- RPO: 1 minute (continuous WAL archival / point-in-time recovery)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- N/A (database layer — no user-facing interface)
- Documentation: clear ERD diagrams, data dictionary, query examples

**Observability**:
- Query monitoring: pg_stat_statements (top queries, slow query log)
- Performance analysis: pgBadger (log analysis and reporting)
- Metrics: Prometheus via postgres_exporter / mongodb_exporter / redis_exporter
- Dashboards: Grafana (connection pool, query latency, replication lag, disk usage)
- Alerting: Alert on replication lag > 5s, connection pool > 90%, disk usage > 80%, slow queries > 1s

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (tooling code), 100% (migration rollback verification)

**Required Test Types**:
- [x] Migration tests (pgTAP — forward + rollback for every migration)
- [x] Query performance tests (EXPLAIN ANALYZE benchmarks, pgbench load testing)
- [x] Integration tests (pytest — data access layer, ORM queries)
- [x] Schema validation tests (verify constraints, indexes, foreign keys)
- [x] Backup/restore tests (periodic restore verification)
- [x] Connection pool stress tests (pgbench — concurrent connection scenarios)
- [ ] Data migration tests (optional — large dataset migration dry runs)
- [ ] Chaos engineering (optional — failover, network partition tests)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (sqlfluff, pgFormatter, ruff via pre-commit framework)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Migration rollback test required on every PR that adds a migration
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production migration execution

**Testing Tools**: pgTAP, pgbench, pytest, sqlfluff, pgFormatter, EXPLAIN ANALYZE, pg_stat_statements

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
- Managed database services: [FILL IN: $/month or "free tier only"]
- Backup storage: [FILL IN: $/month or "included"]

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
| AWS RDS / GCP Cloud SQL | Variable | Card | No — ask first |
| MongoDB Atlas | Usage-based | Card | No — ask first |
| Redis Cloud | Usage-based | Card | No — ask first |
| Elastic Cloud | Usage-based | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 schema designs implemented and tested
- [ ] >= 80% test coverage on tooling code
- [ ] 100% migration rollback verification (every migration reversible)
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Query P95 < 50ms verified via pgbench/load testing
- [ ] All indexes documented with justification (index strategy document)
- [ ] Connection pooling configured and stress-tested
- [ ] Backup/restore procedure tested and documented
- [ ] Row-level security policies implemented (if multi-tenant)
- [ ] ERD and data dictionary complete and up-to-date
- [ ] CI/CD pipeline tested and working
- [ ] All connection strings and credentials documented in .env.example

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
| Data migration failures (data loss or corruption during schema changes) | M | H | All migrations reversible, dry-run on staging with production-like data, backup before every migration, migration rollback tests in CI |
| Query performance regression (new queries or schema changes degrade performance) | M | H | EXPLAIN ANALYZE in CI for critical queries, pg_stat_statements baseline, automated slow query detection, query review required in PRs |
| Data loss (accidental deletion, corruption, or infrastructure failure) | L | H | Continuous WAL archival (RPO < 1 min), automated backup verification, point-in-time recovery tested monthly |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- All migrations MUST be reversible (rollback script required for every migration)
- No breaking schema changes without a documented migration plan and staging dry-run
- Index strategy documented for every table (justify each index, identify missing indexes)
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
- [x] Additional Database Engineer (schema design, migration authoring)
- [x] PostgreSQL Specialist (advanced features: RLS, partitioning, extensions)
- [x] MongoDB Specialist (aggregation pipelines, sharding, schema design)
- [x] Query Optimization Specialist (EXPLAIN ANALYZE, index tuning, query rewriting)
- [x] DevOps Specialist (managed DB provisioning, backup automation, monitoring)
- [x] Security Specialist (encryption, audit logging, access control)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Migration rollback test results (pgTAP output — all migrations forward + backward)
- [x] Query performance benchmark (pgbench results, EXPLAIN ANALYZE for critical queries)
- [x] ERD diagram (entity-relationship diagram — up-to-date)
- [x] Data dictionary (all tables, columns, types, constraints documented)
- [x] Index strategy document (every index justified, covering index analysis)
- [x] Connection pool stress test results (pgbench concurrent connections)
- [x] Backup/restore test log (successful restore with timing)
- [x] Security audit (RLS policies, role permissions, encryption verification)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Grafana dashboard screenshots (query latency, connection pool, replication lag)

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

*Database Engineering Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for PostgreSQL 16 + MongoDB 7 + Redis 7 + Elasticsearch 8 database engineering*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
