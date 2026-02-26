# Java Spring Team — Tailored Strategy v3.1

> Pre-configured for **Java 21 + Spring Boot 3.x enterprise backends with PostgreSQL, Kafka, and Kubernetes**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team javaSpring --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Java Spring Team)*

**Required Tech Stack**:
- **Language**: Java 21+ (LTS)
- **Framework**: Spring Boot 3.x / Spring Cloud (microservices) / Spring WebFlux (reactive, if needed)
- **Database**: PostgreSQL 16 (primary) / MySQL 8 (alternative)
- **Cache**: Redis 7 (distributed) / Caffeine (in-process L1 cache)
- **Message Queue**: Apache Kafka (event streaming) / RabbitMQ (task queues)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (ECS/EKS) / GCP (GKE) / Azure (AKS) — team's choice
- **Deployment**: Docker + Kubernetes (Helm charts) / AWS ECS / Spring Boot fat JAR
- **CDN**: CloudFront / Cloud CDN (if serving static assets)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary data store | Connection string (env) / JDBC | Connection pool max 100 (HikariCP) |
| Redis 7 | Distributed caching | AUTH token (env) | N/A |
| Apache Kafka | Event streaming | SASL/SCRAM or mTLS | Partition-dependent |
| Spring Cloud Config | Centralized configuration | Service discovery | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: Maven / Gradle (Kotlin DSL preferred for Gradle)

**Monorepo or Polyrepo**: Multi-module Maven/Gradle project

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- API response time P95 < 150ms
- Throughput: 2,000 requests/second sustained
- Concurrent users: 1,000 without degradation
- JVM warmup time < 30 seconds (consider GraalVM native-image for cold-start-sensitive services)

**Security**:
- Authentication: Spring Security + OAuth2 / OpenID Connect (Keycloak / Auth0 / custom)
- Authorization: RBAC with method-level security (`@PreAuthorize`)
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 in transit, AES-256 at rest, Jasypt for config encryption

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Kubernetes HPA, Kafka consumer group scaling, read replicas for PostgreSQL, Redis cluster, circuit breakers (Resilience4j)

**Availability**:
- Uptime target: 99.95%
- RTO: 30 minutes
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- API documentation: OpenAPI 3.0 (springdoc-openapi) with Swagger UI
- Health endpoints: Spring Actuator (/health, /info, /metrics)
- CLI tools: clear --help output (if applicable)

**Observability**:
- Logging: Logback + SLF4J (structured JSON via logstash-logback-encoder) → ELK / Loki
- Metrics: Micrometer → Prometheus + Grafana dashboards
- Tracing: OpenTelemetry / Micrometer Tracing → Zipkin / Jaeger
- Alerting: Grafana Alerting / PagerDuty (SLA-based alerts)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (business logic + services), >= 70% (controllers)

**Required Test Types**:
- [x] Unit tests (JUnit 5, Mockito — services, domain logic, validators)
- [x] Integration tests (Spring Boot Test, TestContainers — repositories, API endpoints)
- [x] Architecture tests (ArchUnit — dependency rules, layer violations, naming conventions)
- [x] Contract tests (Spring Cloud Contract / Pact — API consumer-provider contracts)
- [x] Load tests (Gatling — throughput, latency under load, soak tests)
- [x] API contract validation (springdoc-openapi-starter — OpenAPI spec always in sync)
- [ ] Mutation tests (optional — PIT mutation testing for critical domain logic)
- [ ] Chaos engineering (optional — Chaos Monkey for Spring Boot)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (Checkstyle, SpotBugs, PMD, google-java-format via pre-commit or Maven enforcer)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: JUnit 5, Mockito, AssertJ, TestContainers, ArchUnit, Gatling, Spring Cloud Contract, WireMock, JaCoCo (coverage)

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
| AWS / GCP / Azure | Variable | Card | No — ask first |
| Kafka (managed — Confluent / MSK) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on business logic (JaCoCo report)
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows
- [ ] Performance targets met (API P95 < 150ms, 2000 RPS)
- [ ] Documentation complete (README, API docs via OpenAPI/Swagger, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds
- [ ] Database migrations are reversible and tested (Flyway / Liquibase)
- [ ] ArchUnit tests pass (no architecture violations)
- [ ] Checkstyle + SpotBugs + PMD report zero critical issues

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
| JVM memory tuning (heap sizing, GC pauses) | M | M | Profile with JFR/JVisualVM, set explicit heap limits, choose appropriate GC (G1/ZGC), load test early |
| Spring Boot version upgrades (breaking changes) | L | M | Pin to Spring Boot 3.x LTS line, test upgrades on dedicated branch, follow migration guides |
| Kafka consumer lag during traffic spikes | M | M | Auto-scaling consumer groups, monitoring consumer lag, backpressure handling |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Java 21 LTS minimum (no preview features in production)
- Spring Boot 3.x (latest stable)
- Conventional commits enforced
- API-first development (OpenAPI spec before implementation)

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
- [x] Additional Backend Engineer (Java, Spring Boot)
- [x] Additional QA Engineer (JUnit, Gatling, TestContainers)
- [x] Database Specialist (PostgreSQL optimization, query tuning, Flyway migrations)
- [x] Performance Specialist (JVM profiling, GC tuning, Gatling analysis)
- [x] DevOps Specialist (Docker, K8s Helm charts, CI/CD)
- [x] Kafka/Messaging Specialist (topic design, consumer scaling, exactly-once semantics)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (JaCoCo — HTML + XML)
- [x] ArchUnit test results (zero architecture violations)
- [x] Gatling load test results (HTML report + summary)
- [x] OpenAPI specification (validated, up-to-date, springdoc-generated)
- [x] Security scan results (OWASP dependency-check, SpotBugs security rules)
- [x] Database migration log (Flyway / Liquibase — all migrations listed, rollback tested)
- [x] Checkstyle + SpotBugs + PMD report (zero critical/high issues)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Spring Actuator health check (all indicators UP in production)
- [x] Architecture diagram (services, Kafka topics, data flow, deployment topology)

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

*Java Spring Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Java 21 + Spring Boot 3.x + PostgreSQL + Kafka enterprise backends*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
