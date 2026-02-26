# Real-Time Systems Team — Tailored Strategy v3.1

> Pre-configured for **real-time messaging, event-driven architectures, pub/sub systems, and live collaboration with TypeScript, Go, Rust, WebSocket, Kafka, and Redis**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team realtimeSystems --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Real-Time Systems Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode) / Go 1.22+ / Rust 1.75+
- **Framework**: Socket.IO / ws (Node.js) / Actix-web (Rust) / Fiber (Go)
- **Database**: PostgreSQL 16 (event store, projections) + Redis 7 (pub/sub, caching, streams)
- **Message Queue**: NATS / RabbitMQ / Apache Kafka
- **Protocols**: WebSocket, MQTT, Server-Sent Events (SSE), gRPC streaming

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP — team's choice
- **Deployment**: Docker + Kubernetes (horizontal pod autoscaling for WebSocket servers)
- **CDN**: Not primary — focus on direct socket connections with geographic load balancing
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Event store + read model persistence | Connection string (env) | Connection pool max 100 |
| Redis 7 | Pub/sub backbone + session store + caching | AUTH token (env) | N/A |
| Kafka / NATS / RabbitMQ | Event streaming + message routing | SASL / TLS (env) | Throughput-based |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm (TypeScript) / go modules (Go) / cargo (Rust)

**Monorepo or Polyrepo**: Monorepo (Turborepo for TS packages, workspace for Go/Rust)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Message delivery latency P99 < 50ms (end-to-end)
- Message delivery latency P95 < 20ms
- WebSocket connection handshake < 100ms
- Throughput: 100,000 messages/second sustained per cluster
- Concurrent WebSocket connections: 50,000 per node without degradation

**Security**:
- Authentication: JWT (access + refresh tokens) for WebSocket handshake / mTLS for service-to-service
- Authorization: Channel-based access control (per-topic, per-room permissions)
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 for all socket connections, AES-256 at rest for event stores

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Horizontal pod autoscaling (K8s HPA), Redis Cluster for pub/sub fan-out, Kafka partition-based parallelism, sticky sessions with consistent hashing for WebSocket affinity

**Availability**:
- Uptime target: 99.99%
- RTO: 15 minutes
- RPO: 0 (zero message loss for exactly-once delivery paths)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- N/A (backend real-time infrastructure) — defer to frontend team for UI accessibility
- API documentation must be screen-reader friendly (OpenAPI + Markdown)

**Observability**:
- Logging: Structured JSON (Pino for Node.js, zerolog for Go, tracing for Rust)
- Metrics: Prometheus + Grafana dashboards — message latency histograms (P50/P95/P99), consumer lag, connection count, throughput per topic
- Tracing: OpenTelemetry (distributed traces across WebSocket gateway -> broker -> consumer)
- Alerting: Grafana Alerting / PagerDuty — triggers on P99 > 50ms, consumer lag > 1000, connection drops > 5%

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 85% line coverage (core messaging logic), >= 75% (connection management)

**Required Test Types**:
- [x] Unit tests (Vitest for TS / go test / cargo test)
- [x] Integration tests (message delivery end-to-end through broker, database interactions)
- [x] End-to-end tests (WebSocket client -> server -> broker -> consumer -> response)
- [x] Performance / load tests (k6 WebSocket + Gatling — 10K+ concurrent connections, sustained throughput)
- [x] Latency tests (P50/P95/P99 measurement under load, tail latency analysis)
- [x] Delivery guarantee tests (exactly-once verification, at-least-once with idempotent consumer)
- [x] Failover tests (broker failure, consumer crash, WebSocket server restart — zero message loss)
- [x] Ordering tests (per-partition ordering, causal ordering across partitions)
- [ ] Chaos engineering (optional — network partition simulation, split-brain scenarios)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint/golangci-lint/clippy, formatting, type checks via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: Vitest, k6 (WebSocket protocol), Gatling, Testcontainers (Kafka/Redis/PostgreSQL), go test, cargo test, Artillery

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
| AWS (EC2, EKS, ElastiCache) | Variable | Card | No — ask first |
| Confluent Cloud (Kafka) | ~$50-200/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 85% test coverage on core messaging logic
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] End-to-end latency P99 < 50ms under load
- [ ] 10K+ concurrent WebSocket connections sustained without degradation
- [ ] Exactly-once delivery verified for critical message paths
- [ ] Failover tested — zero message loss during broker/consumer restart
- [ ] Documentation complete (README, API docs, architecture diagrams, runbook)
- [ ] CI/CD pipeline tested and working
- [ ] Consumer lag < 100 under sustained load
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
| Message broker cluster failure | L | H | Multi-broker replication (min.insync.replicas=2), automatic failover, dead-letter queues |
| WebSocket connection storm after outage (thundering herd) | M | H | Exponential backoff with jitter on reconnect, connection rate limiting, gradual rollout |
| Consumer lag spiraling under burst traffic | M | M | Auto-scaling consumer groups, back-pressure signaling, overflow to dead-letter with replay |
| Split-brain in distributed state | L | H | Quorum-based consensus, partition-aware routing, conflict resolution strategy (last-writer-wins / CRDTs) |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Message delivery latency P99 < 50ms under normal load
- Exactly-once delivery semantics where required (financial events, state mutations)
- Horizontal scaling — no single points of failure, no vertical scaling dependencies
- Graceful degradation — system must degrade to at-least-once if exactly-once path fails
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
- [x] Additional WebSocket/Socket.IO Engineer
- [x] Additional Message Broker Engineer (Kafka / RabbitMQ / NATS)
- [x] Additional Stream Processing Engineer
- [x] Additional Event Sourcing/CQRS Engineer
- [x] Additional QA Engineer (latency validation, delivery guarantee testing)
- [x] DevOps Specialist (Kubernetes, broker cluster management)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Vitest/go test/cargo test coverage output — HTML + lcov)
- [x] Latency benchmark results (P50/P95/P99 histograms under load — k6/Gatling output)
- [x] Delivery guarantee test results (exactly-once verification logs, idempotent consumer proof)
- [x] Failover test results (broker failure, consumer crash — zero message loss evidence)
- [x] Connection stress test results (10K+ concurrent WebSocket connections — connection count + memory usage)
- [x] Consumer lag monitoring (Grafana dashboard screenshot showing lag < 100 under sustained load)
- [x] Security scan results (npm audit / govulncheck / cargo audit, dependency audit)
- [x] Architecture diagram (event flow topology, partition strategy, failover paths)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Deployment log (production deployment evidence)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Event store**: Append-only — NEVER delete events (use compensating events)

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

*Real-Time Systems Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript/Go/Rust + WebSocket + Kafka/NATS/RabbitMQ + Redis real-time systems development*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
