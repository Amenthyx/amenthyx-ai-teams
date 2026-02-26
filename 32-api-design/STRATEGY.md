# API Design Team — Tailored Strategy v3.1

> Pre-configured for **REST, GraphQL, and gRPC API design and implementation with contract-first development**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team apiDesign --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for API Design Team)*

**Required Tech Stack**:
- **Language**: TypeScript / Go / Python (team's choice per service)
- **Framework**: OpenAPI 3.1 (REST spec) / GraphQL (Apollo Server / Pothos) / gRPC (protobuf) / Hono / Fastify (HTTP framework)
- **Database**: PostgreSQL 16
- **Cache**: Redis (response caching, rate limit counters)
- **Message Queue**: Depends on pattern (event-driven: Kafka/NATS, task queue: BullMQ/Celery)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Vercel — team's choice
- **Deployment**: Docker + Kubernetes / serverless (AWS Lambda, Cloudflare Workers)
- **CDN**: Cloudflare / CloudFront (API edge caching where applicable)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Primary data store | Connection string (.env) | Connection pool max 50 |
| Redis | Response caching + rate limiting | AUTH token (.env) | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm / go mod / pip

**Repo Structure**: API-first (`specs/` (OpenAPI/proto), `src/`, `tests/`, `docs/`, `scripts/`, `postman/`)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- API response P95: < 100ms
- Rate limiting enforced on all public endpoints
- Pagination required on all list endpoints (cursor-based preferred)
- Response payload: < 1MB per response (enforce via middleware)

**Security**:
- Authentication: OAuth2 (authorization code + client credentials) / API keys (for service-to-service)
- Authorization: Scope-based (OAuth2 scopes) + resource-level permissions
- Rate limiting: Per-client, per-endpoint (configurable via Redis)
- Input validation: Zod (TypeScript) / joi / protobuf schema (gRPC) — validate all inputs
- CORS: Explicitly configured allowed origins (no wildcard in production)
- TLS: 1.3 required for all endpoints
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]

**Scalability**:
- Expected launch API consumers: [FILL IN]
- Expected 6-month API consumers: [FILL IN]
- Expected 1-year API consumers: [FILL IN]
- Scaling strategy: Horizontal pod autoscaling, Redis for distributed rate limiting, database connection pooling, CDN caching for GET endpoints, GraphQL query complexity limits

**Availability**:
- API uptime target: 99.9%
- RTO: 1 hour
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- N/A (API — no user interface)
- Developer experience: clear error messages (RFC 7807 Problem Details), comprehensive docs, SDKs if needed

**Observability**:
- API analytics: Request count, latency distribution, error rates (per endpoint, per client)
- Logging: Structured JSON (request ID, user ID, duration, status code)
- Tracing: OpenTelemetry (distributed tracing across services)
- Alerting: Alert on error rate > 1%, P95 latency > 500ms, rate limit exhaustion spikes
- Dashboards: Grafana (RED method: Rate, Errors, Duration per endpoint)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (API handlers + business logic)

**Required Test Types**:
- [x] Unit tests (Vitest / go test / pytest — business logic, validators, transformers)
- [x] Contract tests (Dredd / Prism — validate implementation matches OpenAPI spec)
- [x] Integration tests (Supertest / httptest — full request-response cycle with database)
- [x] Performance / load tests (k6 — API load, soak, stress testing)
- [x] API schema validation (Spectral — OpenAPI lint, buf — protobuf lint, graphql-eslint)
- [x] Security tests (OWASP ZAP baseline, rate limit verification)
- [ ] SDK tests (optional — if client SDKs are generated)
- [ ] Chaos engineering (optional — circuit breaker, timeout testing)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (Spectral/buf lint, ESLint, Prettier via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Contract test required on every PR (spec must match implementation)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: Vitest / go test / pytest, Dredd / Prism, Supertest, k6, Spectral, buf, graphql-eslint, Postman / Newman

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
| AWS / GCP / Vercel | Variable | Card | No — ask first |
| Postman (team plan) | ~$12/user/mo | Card | No — ask first |
| API gateway (Kong/Tyk) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 API endpoints implemented and tested
- [ ] >= 80% test coverage (handlers + business logic)
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Contract tests pass (implementation matches spec 100%)
- [ ] Performance targets met (API P95 < 100ms, rate limiting working)
- [ ] API versioning strategy implemented and documented
- [ ] Pagination on all list endpoints
- [ ] OpenAPI / GraphQL schema / protobuf spec finalized and published
- [ ] API documentation generated and deployed (Swagger UI / GraphiQL / gRPC reflection)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds
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
| Breaking API changes affecting existing consumers | M | H | Strict versioning policy (URL or header-based), deprecation notices with migration period, contract tests catch regressions, changelog per version |
| API versioning complexity (maintaining multiple versions) | M | M | Limit to 2 concurrent versions max, sunset policy (6 months), adapter pattern for version differences, automated compatibility tests |
| Documentation drift (docs out of sync with implementation) | M | M | Auto-generate docs from spec (OpenAPI → Swagger UI), contract tests enforce spec accuracy, docs deploy in CI pipeline |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- API-first design (specification written and reviewed BEFORE implementation)
- Versioning strategy defined and enforced from day one
- Backwards compatibility required (breaking changes only in new major versions)
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
- [x] Additional API Engineer (REST / GraphQL / gRPC implementation)
- [x] Additional QA Engineer (contract testing, load testing, security testing)
- [x] GraphQL Specialist (schema design, resolvers, federation)
- [x] gRPC Specialist (protobuf design, streaming, interceptors)
- [x] Performance Specialist (caching strategy, query optimization, load testing)
- [x] Security Specialist (OAuth2 configuration, rate limiting, penetration testing)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Vitest/go test/pytest coverage — HTML + lcov)
- [x] Contract test results (Dredd/Prism — spec-to-implementation validation)
- [x] k6 load test results (summary JSON + HTML report)
- [x] OpenAPI / GraphQL schema / protobuf spec (validated, versioned)
- [x] API documentation deployment (Swagger UI / GraphiQL / gRPC reflection live)
- [x] Security scan results (OWASP ZAP baseline, dependency audit)
- [x] Rate limiting verification (test results showing limits enforced)
- [x] Postman/Newman collection (importable, with examples for all endpoints)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (API topology, auth flow, data flow, versioning strategy)

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
**Branch**: `team/apiDesign/execution`
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

*API Design Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for OpenAPI 3.1 + GraphQL + gRPC contract-first API design and implementation*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
