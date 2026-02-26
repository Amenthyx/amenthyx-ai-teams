# .NET Enterprise Team — Tailored Strategy v3.1

> Pre-configured for **C#/.NET 8 enterprise applications with ASP.NET Core, SQL Server, and Azure**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team dotnet --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for .NET Enterprise Team)*

**Required Tech Stack**:
- **Language**: C# 12 / .NET 8+ (LTS)
- **Framework**: ASP.NET Core 8 (Web API / MVC) / Blazor (interactive UI) / MAUI (cross-platform desktop/mobile)
- **Database**: SQL Server 2022 (primary) / PostgreSQL 16 (alternative)
- **Cache**: Redis (distributed) / IMemoryCache (in-process)
- **Message Queue**: Azure Service Bus (cloud) / RabbitMQ (self-hosted)

**Hosting/Infrastructure**:
- **Cloud Provider**: Microsoft Azure (primary) / AWS (alternative)
- **Deployment**: Azure App Service / Docker + Kubernetes (AKS) / Azure Container Apps
- **CDN**: Azure CDN / Azure Front Door
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Azure AD / Entra ID | Identity provider | OAuth2 / OIDC | N/A |
| SQL Server 2022 | Primary data store | Connection string (managed identity preferred) | Connection pool max 100 |
| Azure Service Bus | Async messaging | Connection string / managed identity | Tier-dependent |
| Application Insights | Telemetry + monitoring | Instrumentation key | 5 GB/month free |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: NuGet (dotnet CLI)

**Monorepo or Polyrepo**: Solution with multiple projects (.sln)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- API response time P95 < 200ms
- Throughput: 2,000 requests/second sustained
- Concurrent users: 1,000 without degradation
- Database query P95 < 50ms (indexed queries)

**Security**:
- Authentication: Azure AD / Entra ID / IdentityServer (OAuth2 + OIDC)
- Authorization: RBAC with claims-based policies
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 in transit, AES-256 at rest (Azure Storage Service Encryption / TDE for SQL Server)

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Azure App Service autoscale / AKS HPA, SQL Server read replicas, Redis cluster, Azure Service Bus partitioning

**Availability**:
- Uptime target: 99.95%
- RTO: 30 minutes
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- WCAG 2.1 AA compliance (Blazor / web UI)
- Screen reader compatible
- Keyboard navigation support
- i18n/localization via .resx resource files

**Observability**:
- Logging: Serilog (structured JSON) → Application Insights / Seq
- Metrics: Application Insights + Prometheus (optional Grafana dashboards)
- Tracing: OpenTelemetry → Application Insights / Jaeger
- Alerting: Azure Monitor Alerts / Application Insights Smart Detection

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (business logic), >= 70% (API controllers)

**Required Test Types**:
- [x] Unit tests (xUnit / NUnit — services, domain logic, validators)
- [x] Integration tests (WebApplicationFactory — API endpoints, database interactions)
- [x] End-to-end tests (Playwright — Blazor / web UI flows)
- [x] Architecture tests (ArchUnit.NET — dependency rules, layer violations)
- [x] Performance tests (BenchmarkDotNet — micro-benchmarks, NBomber — load tests)
- [x] Contract tests (OpenAPI schema validation)
- [ ] Security tests (optional — OWASP ZAP, dependency scanning)
- [ ] Chaos engineering (optional — Azure Chaos Studio)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (dotnet format, Roslyn analyzers, StyleCop via .editorconfig)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: xUnit, NUnit, Moq / NSubstitute, Playwright, BenchmarkDotNet, NBomber, ArchUnit.NET, Testcontainers

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
| Azure Subscription | Variable | Card / Enterprise Agreement | No — ask first |
| Visual Studio / Rider License | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on business logic
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows
- [ ] Performance targets met (API P95 < 200ms, 2000 RPS)
- [ ] Documentation complete (README, API docs via Swagger/OpenAPI, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds
- [ ] Database migrations tested and reversible
- [ ] Roslyn analyzers and StyleCop report zero warnings

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
| Azure service limits / throttling | L | M | Monitor quotas, implement retry policies with Polly, request limit increases proactively |
| Breaking changes in .NET major upgrades | L | H | Pin to LTS releases (.NET 8), test upgrades on dedicated branch, follow migration guides |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- .NET 8 LTS minimum (no preview/RC versions in production)
- Nullable reference types enabled (`<Nullable>enable</Nullable>`)
- Conventional commits enforced

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
- [x] Additional Backend Engineer (ASP.NET Core / C#)
- [x] Additional Frontend Engineer (Blazor / MAUI)
- [x] Additional QA Engineer (Playwright, NBomber)
- [x] Database Specialist (SQL Server optimization, EF Core tuning, migration design)
- [x] Azure/DevOps Specialist (AKS, App Service, CI/CD pipelines)
- [x] Security Specialist (Azure AD configuration, penetration testing)
- [x] Performance Specialist (BenchmarkDotNet profiling, memory analysis)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (dotnet test --collect:"XPlat Code Coverage" — Cobertura XML + HTML)
- [x] Playwright E2E test results (HTML report)
- [x] NBomber load test results (summary report + charts)
- [x] BenchmarkDotNet results (micro-benchmark summary)
- [x] OpenAPI/Swagger specification (validated, up-to-date)
- [x] Security scan results (dotnet list package --vulnerable, dependency audit)
- [x] Database migration log (EF Core migrations listed, rollback verified)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Application Insights dashboard (key metrics, zero critical errors)
- [x] Architecture diagram (solution structure, service dependencies, data flow)

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
**Branch**: `team/dotnet/execution`
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

*.NET Enterprise Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for C# 12 + .NET 8 + ASP.NET Core + SQL Server enterprise development*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
