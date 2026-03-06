# Social Media Platform — Base Strategy Brief v3.3

> **This is a base strategy template pre-configured for social media projects.**
> Duplicate this file, fill in project-specific values (marked with `[FILL]`), and pass it to your team:
> `--team socialMedia --strategy path/to/your-strategy.md`
>
> Sections marked `[PRE-FILLED]` contain sensible defaults for social media projects.
> Override them freely — they're starting points, not rules.

---

## 1. Project Identity

**Project Name**: [FILL — e.g., "SocialHub", "BrandPulse", "ContentEngine"]

**One-Line Vision**: [FILL — e.g., "A unified social media command center that automates publishing, tracks analytics, and optimizes campaigns across all major platforms"]

**Problem Statement**: [FILL — e.g., "Social media managers spend 60% of their time on manual cross-platform posting, switching between 6+ analytics dashboards, and manually tracking campaign ROAS. This costs teams 20+ hours/week in operational overhead."]

**Desired Outcome**: [FILL — e.g., "6 months after launch: all social accounts managed from one dashboard, posting automated, analytics unified, ad spend optimized with 20% better ROAS, community response time under 30 minutes."]

**Project Type**: [FILL — Greenfield / Extending existing codebase / Migration / Rewrite / Prototype / MVP / Production]

**Repository**: [FILL — GitHub URL or desired repo name]

---


## 1.1 Deliverable Product Target

> **MANDATORY** — The team MUST deliver a product that can be visualized, demonstrated, and evaluated.
> The Team Leader clarifies the delivery target during the 20-question discovery interview.

**Delivery Target**: [MVP — visually demonstrable minimum viable product / Production — enterprise-ready application for deployment / Prototype — functional proof of concept]

**What "Done" Looks Like**:
- [ ] Application is running and accessible (localhost, staging URL, or deployed)
- [ ] All P0 features are functional and demonstrable
- [ ] A non-technical person can use the core flow without assistance
- [ ] Screenshots of every major screen/feature exist in `.team/screenshots/final/`
- [ ] Documentation website is built and browsable

**Demo Requirements**:
- **Demo format**: [Live demo / Recorded walkthrough / Screenshots + documentation]
- **Demo audience**: [Technical team / Stakeholders / End users / Investors]
- **Demo environment**: [Local / Staging / Production]

**Visual Deliverables** (mandatory):
- [ ] Running application with real UI (not wireframes)
- [ ] Complete user flow from registration/login to core feature
- [ ] Responsive design (desktop + mobile if web/hybrid)
- [ ] Documentation website (`docs/`) with full project documentation
- [ ] `.team/screenshots/` with complete visual evidence

---

## 2. Target Audience

**Primary Users**: [FILL — e.g., "Social media managers at agencies (5-50 person teams), managing 10-50 brand accounts, moderate technical skill"]

**Secondary Users**: [FILL — e.g., "Marketing directors (reporting/KPIs), content creators (publishing), C-suite (ROI dashboards)"]

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL] | Social Media Manager | Manual posting across platforms, fragmented analytics, slow reporting | Unified dashboard, automated scheduling, one-click reports | Med |
| [FILL] | Marketing Director | No single source of truth for KPIs, can't attribute social to revenue | Real-time ROI visibility, attribution modeling, team performance | Low |
| [FILL] | Content Creator | Resizing assets per platform, no brand template system, ad-hoc approvals | Template library, auto-resize, structured approval workflow | Med |
| [FILL] | Community Manager | Slow response times, no sentiment alerts, manual moderation | Real-time alerts, automated routing, sentiment dashboard | Med |

**Anti-Users**: [FILL — e.g., "Individual influencers (< 3 accounts), enterprise-only features users, non-social digital marketing"]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Multi-Platform Publishing | Schedule and publish to Meta (FB+IG), X/Twitter, LinkedIn, TikTok, YouTube, Pinterest from one interface | Post appears on all selected platforms within 60s of scheduled time; media correctly formatted per platform | XL |
| 2 | Unified Analytics Dashboard | Aggregate metrics (reach, engagement, followers, impressions) from all connected platforms into a single dashboard | Dashboard updates within 15 min of platform data; metrics match native platform analytics within 5% accuracy | XL |
| 3 | Content Calendar | Visual editorial calendar with drag-and-drop scheduling, platform tagging, status tracking | Calendar shows all scheduled/published/draft posts; filter by platform, status, campaign | L |
| 4 | Platform API Integration Layer | OAuth-based authentication and data sync for all 6+ target platforms | Token refresh works automatically; rate limits handled gracefully; health monitoring per platform | XL |
| 5 | User Authentication & RBAC | Secure login with role-based access (admin, manager, creator, viewer) per brand/workspace | SSO support; invite flow; per-brand permissions; audit log | L |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Paid Media Management | Create, monitor, and optimize ad campaigns across Meta Ads, Google Ads, TikTok Ads from one interface | Campaign creation via API; budget pacing; ROAS tracking; A/B test management | XL |
| 2 | Social Listening & Sentiment | Monitor brand mentions, keywords, hashtags across platforms with real-time sentiment analysis | Keyword alerts within 5 min; sentiment accuracy >= 85% F1; crisis detection alerts | XL |
| 3 | AI Content Generation | Generate post copy, image suggestions, hashtags, and optimal posting times using AI | AI suggestions per platform; A/B variant generation; performance prediction scoring | L |
| 4 | Community Management Inbox | Unified inbox for comments, DMs, mentions across platforms with assignment, tagging, and auto-routing | All message types aggregated; < 5s load time; assignment workflow; response templates | L |
| 5 | Automated Reporting | Scheduled PDF/PPTX reports with KPIs, trends, competitor comparisons sent via email/Slack | Reports generated on schedule; customizable KPI selection; white-label branding | M |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | Influencer Discovery & Tracking | Find, vet, and track influencer partnerships with engagement and audience analytics |
| 2 | Competitor Analysis | Automated competitor benchmarking — posting frequency, engagement rates, content types, growth |
| 3 | Content Recycling Engine | AI-powered evergreen content recycling — resurface top-performing posts with fresh variations |
| 4 | Landing Page Builder | Quick social-optimized landing pages for campaigns with UTM tracking and conversion funnels |
| 5 | Approval Workflows | Multi-stage content approval chains with Slack/email notifications and revision tracking |

---

## 4. Technical Constraints

**Required Tech Stack** [PRE-FILLED — override as needed]:
- **Language**: TypeScript 5.x (backend + frontend) / Python 3.12+ (analytics, ML/NLP)
- **Framework**: Next.js 14 (frontend) / NestJS or Fastify (API) / FastAPI (Python analytics service)
- **Database**: PostgreSQL 16 (primary) + TimescaleDB (time-series metrics)
- **Cache**: Redis 7 (API response cache, rate limit tracking, job queues)
- **Message Queue**: BullMQ (Redis-based, for scheduled posts and async jobs)

**Hosting/Infrastructure** [PRE-FILLED]:
- **Cloud Provider**: [FILL — AWS / GCP / Azure / self-hosted / "team's choice"]
- **Deployment**: Docker + [FILL — K8s / ECS / Cloud Run / serverless / "team's choice"]
- **CDN**: [FILL — CloudFront / Cloudflare / "team's choice"]
- **Domain**: [FILL — your-domain.com or "TBD"]

**Integrations** [PRE-FILLED]:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Meta Graph API v19.0 | FB + IG publishing, analytics, ads | OAuth 2.0 | 200 calls/user/hour |
| X/Twitter API v2 | Tweets, analytics, DMs | OAuth 2.0 (PKCE) | App-level: 300 reads/15min |
| LinkedIn Marketing API | Posts, analytics, ad campaigns | OAuth 2.0 | 100 calls/day/member |
| TikTok Business API | Video posting, analytics, ads | OAuth 2.0 | 600 calls/min |
| YouTube Data API v3 | Video upload, analytics, comments | OAuth 2.0 | 10,000 units/day (free) |
| Pinterest API v5 | Pin creation, analytics, ads | OAuth 2.0 | 1,000 calls/min |
| Google Analytics 4 | Website traffic from social | OAuth 2.0 / Service Account | 50,000 req/day |
| OpenAI API | AI content generation, analysis | API Key | Based on tier |
| [FILL — CRM] | Lead tracking from social | [FILL] | [FILL] |
| [FILL — Email] | Notifications, report delivery | [FILL] | [FILL] |

**Existing Codebase**: [FILL — Path or "greenfield"]

**Package Manager**: pnpm (Node.js) / poetry (Python) [PRE-FILLED — override as needed]

**Monorepo or Polyrepo**: Monorepo with pnpm workspaces [PRE-FILLED — suggested structure]:
```
/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # NestJS/Fastify backend
│   └── analytics/    # FastAPI analytics service
├── packages/
│   ├── shared/       # Shared types, utils
│   ├── platform-sdk/ # Platform API clients (Meta, X, LinkedIn, etc.)
│   └── ui/           # Shared UI components
├── workers/
│   ├── scheduler/    # Post scheduling worker
│   ├── etl/          # Analytics data pipeline worker
│   └── sentiment/    # NLP sentiment analysis worker
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 5. Non-Functional Requirements

**Performance** [PRE-FILLED]:
- API response time: P95 < 300ms (CRUD), P95 < 2s (analytics aggregation)
- Dashboard load time: LCP < 3s (with cached data), < 5s (cold)
- Publishing latency: Post delivered to platform within 60s of scheduled time
- Concurrent users: [FILL — e.g., 200 simultaneous]
- ETL throughput: Process 100K social data points/hour

**Security** [PRE-FILLED]:
- Authentication: OAuth 2.0 + JWT (short-lived access + refresh tokens)
- Authorization: RBAC with workspace-level isolation (admin, manager, creator, viewer)
- Data sensitivity: PII (user profiles), API credentials (OAuth tokens), financial data (ad spend)
- Compliance: GDPR (EU users), CCPA (CA users), platform-specific TOS
- Encryption: TLS 1.3 in transit, AES-256 at rest, OAuth tokens encrypted in DB

**Scalability** [FILL]:
- Expected launch users: [FILL]
- Expected 6-month users: [FILL]
- Expected 1-year users: [FILL]
- Scaling strategy: Horizontal auto-scaling for API + workers; read replicas for analytics DB

**Availability** [PRE-FILLED]:
- Uptime target: 99.9% (scheduling service: 99.95% — missed posts = lost engagement)
- Recovery time objective (RTO): < 30 minutes
- Recovery point objective (RPO): < 5 minutes (scheduled posts in queue are critical)
- Multi-region: [FILL — yes / no / future]

**Accessibility** [PRE-FILLED]:
- WCAG level: AA
- Screen reader support: Required (dashboard)
- Internationalization: [FILL — English only / multi-language / RTL support needed]

**Observability** [PRE-FILLED]:
- Logging: Structured JSON (per-platform API call logging with latency, status, rate limit remaining)
- Metrics: Prometheus + Grafana (publishing success rate, API health, queue depth, ETL lag)
- Tracing: [FILL — Jaeger / Tempo / "team's choice"]
- Alerting: [FILL — PagerDuty / Slack / "team's choice"] — critical: scheduling failures, token expiry, rate limit exhaustion

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% line coverage (platform SDK: >= 90%)

**Required Test Types** [PRE-FILLED]:
- [x] Unit tests (mandatory — all business logic, formatters, parsers)
- [x] Integration tests (mandatory — all platform API clients with sandbox/mock)
- [x] E2E tests (mandatory — publish flow, analytics ingestion, campaign lifecycle)
- [x] Performance/load tests (scheduling throughput, API gateway under load)
- [x] Security scanning (SAST + dependency audit + secrets detection)
- [ ] Accessibility tests (axe-core on dashboard)
- [ ] Visual regression tests (dashboard charts, calendar views)
- [x] Contract tests (platform API response schema validation)

**CI/CD Requirements** [PRE-FILLED]:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (lint, format, type-check, secrets scan)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated deployment to staging on merge to develop
- [x] Manual approval gate for production deployment

**Testing Tools** [PRE-FILLED]:
- Jest + Supertest (Node.js unit + integration)
- Pytest (Python unit + integration)
- Playwright (E2E)
- k6 (load testing)
- Gitleaks (secrets detection)
- Trivy (container scanning)

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL — Date or "flexible"]

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | Platform Integration | [FILL] | OAuth + read/write for all target platforms, API health dashboard | All 6 platform APIs authenticated, read+write tests pass, rate limits handled |
| M2 | Content & Scheduling | [FILL] | Content calendar, multi-platform publishing, scheduling engine | Posts scheduled and published on time across all platforms, calendar UI functional |
| M3 | Analytics & Dashboards | [FILL] | Unified analytics dashboard, ETL pipeline, metric aggregation | Dashboard shows metrics from all platforms, data freshness < 15 min, accuracy > 95% |
| M4 | Paid Media & Optimization | [FILL] | Ad campaign management, ROAS dashboard, A/B testing framework | Campaigns created via API, budget tracking accurate, ROAS calculated correctly |
| M5 | Community & Intelligence | [FILL] | Social listening, sentiment analysis, community inbox, crisis detection | Sentiment accuracy >= 85%, inbox aggregates all platforms, alerts fire within 5 min |
| M6 | Production Launch | [FILL] | Full deployment, monitoring, runbooks, final QA | All gates pass, 99.9% uptime in staging for 48h, runbooks complete |

**Budget Constraints**:
- Infrastructure: [FILL — $/month or "minimize"]
- Third-party APIs: [FILL — most platforms have free tiers for read; write/ads may require business verification]
- AI APIs: [FILL — OpenAI/Anthropic usage estimate]
- Domains/SSL: [FILL]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.

**Token Budget Tolerance**: [FILL — e.g., "< $10 per run" / "< $50 total" / "no hard limit, but inform me"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 (always ask before any payment)
- **Requires explicit approval**: All card payments, API tier upgrades, domain purchases, cloud resource provisioning
- **Forbidden without user present**: Any recurring subscription, production deployment costs, ad spend (even test spend)

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Cloud hosting (dev/staging) | [FILL] | [FILL] | No — ask first |
| Meta Business verification | Free | N/A | Yes |
| X/Twitter API (Basic tier) | $100/month | Card | No — ask first |
| OpenAI API | [FILL — usage-based] | Card / credits | No — ask first |
| Domain registration | [FILL] | Card | No — ask first |
| Monitoring (Grafana Cloud free) | $0 | N/A | Yes |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] All target platform APIs integrated with OAuth + read + write
- [ ] Unit test coverage >= 80%
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass: publish flow, analytics ingestion, calendar management
- [ ] Publishing latency < 60s for scheduled posts
- [ ] Analytics dashboard data accuracy > 95% vs. native platform data
- [ ] API rate limits handled gracefully (no data loss on throttle)
- [ ] OAuth token refresh works automatically for all platforms
- [ ] Documentation complete (README, API docs, setup guide, runbooks)
- [ ] CI/CD pipeline tested and working
- [ ] Monitoring and alerting active

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Publishing Success Rate | >= 99.5% | Scheduled posts successfully delivered / total scheduled |
| Analytics Data Freshness | < 15 min | Time between platform data update and dashboard display |
| Dashboard Accuracy | > 95% | Our metrics vs. native platform analytics (sampled weekly) |
| API Uptime | >= 99.9% | Monitoring stack uptime checks |
| Scheduling Precision | < 60s drift | Actual publish time vs. scheduled time |
| Mean Time to Detect (MTTD) | < 5 min | Alert firing time after incident begins |
| [FILL — Business KPIs] | [FILL] | [FILL] |

**Definition of Done**: [FILL — e.g., "All P0 features deployed to production, monitoring active for 48h with no P1 incidents, all platform APIs functioning, analytics dashboard live with real data, team onboarded and using the platform daily."]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| Hootsuite | Unified dashboard, calendar, team collaboration | Bloated UI, slow performance, expensive tier gates |
| Buffer | Clean UX, simple scheduling, analytics clarity | Limited analytics depth, weak paid media support |
| Sprout Social | Excellent analytics, social listening, reporting | Enterprise pricing, complex onboarding |
| Later | Visual content calendar, Instagram-first design | Platform limitations, weak non-IG support |
| Metricool | Good multi-platform analytics, competitor tracking | Basic UI, limited automation |
| HubSpot Social | CRM integration, attribution modeling | Requires full HubSpot ecosystem, expensive |

**Design Inspiration**: [FILL — Links to designs, Figma, mockups, or "team's choice based on competitors above"]

**Technical References**:
- Meta Graph API: https://developers.facebook.com/docs/graph-api/
- X/Twitter API v2: https://developer.x.com/en/docs/x-api
- LinkedIn Marketing API: https://learn.microsoft.com/en-us/linkedin/marketing/
- TikTok Business API: https://business-api.tiktok.com/portal/docs
- YouTube Data API v3: https://developers.google.com/youtube/v3
- Pinterest API v5: https://developers.pinterest.com/docs/api/v5/

**Internal Documentation**: [FILL — Internal PRDs, design docs, past audits]

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. Native mobile apps (web-responsive only for v1.0)
2. Direct social platform cloning (we aggregate, not replace)
3. Built-in image/video editor (integrate with Canva/Figma APIs instead)
4. Email marketing (CRM integration only, not a full ESP)
5. [FILL — add project-specific exclusions]

**Deferred to future versions**:
1. Influencer marketplace / payments
2. White-label SaaS (multi-tenant per customer brand)
3. AI-generated video content (text-to-video)
4. Advanced attribution (MMM — media mix modeling)
5. [FILL — add deferred features]

---

## 11. Risk & Constraints

**Known Risks** [PRE-FILLED]:

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Platform API rate limits block functionality | H | H | Implement per-platform rate limiter, queue overflow to retry, cache responses aggressively |
| Platform API breaking changes / deprecation | M | H | Abstract platform SDKs behind interface, monitor API changelogs, maintain version pinning |
| OAuth token expiry causes data gaps | M | H | Automated token refresh with monitoring alerts on failure; manual re-auth fallback |
| Sentiment NLP model accuracy below threshold | M | M | Fallback to rule-based sentiment; A/B test multiple models; human-in-the-loop for edge cases |
| Platform TOS violation from automated posting | L | H | Legal team reviews TOS; implement posting rate limits per platform; human approval for first 100 posts |
| Ad platform policy changes reject campaigns | M | M | Monitor platform policy updates; human review before campaign launch; compliance checklist |
| Data privacy violation (GDPR/CCPA) | L | H | Legal review; data retention policies; user consent flows; DPA with sub-processors |
| [FILL] | [FILL] | [FILL] | [FILL] |

**Hard Constraints** (non-negotiable):
- Must use OAuth 2.0 for all platform authentications (no stored passwords)
- Must never store raw social media user PII beyond what the platform allows
- Must respect platform rate limits (never brute-force or circumvent)
- API credentials encrypted at rest, never in source code or logs
- [FILL — add project-specific hard constraints]

**Soft Constraints** (preferred but negotiable):
- Prefer TypeScript for consistency (Python OK for analytics/ML)
- Prefer PostgreSQL (TimescaleDB for time-series) but open to alternatives
- Prefer monorepo but polyrepo OK if team complexity requires it
- [FILL]

---

## 11.1 Dynamic Agent Scaling

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 15

**Scaling triggers**:
- A platform integration has both read + write + analytics + ads (XL complexity, can split into read/write agents)
- Analytics pipeline covers 6+ platforms and needs parallel ETL per platform
- QA finds >= 5 blocking bugs requiring parallel fix agents
- Content pipeline has both image + video + AI generation tracks

**Agent types the PM may add**:
- [x] Additional Platform Integration Engineers (per-platform specialists)
- [x] Additional Analytics Engineers (per-pipeline or per-platform ETL)
- [x] Additional QA Engineers (for large test suites across platforms)
- [x] Specialist agents (e.g., NLP model tuning, video processing optimization, ad bid algorithm)
- [x] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?** [PRE-FILLED]:
- [x] Screenshots of running application (dashboard, calendar, publishing flow)
- [x] Test result reports (Jest coverage, Pytest coverage, Playwright results)
- [x] Build logs showing zero errors
- [x] CI/CD pipeline passing locally (act) and remotely
- [x] Security scan reports (zero CRITICAL/HIGH)
- [x] Performance benchmark results (scheduling latency, API response times)
- [x] Deployment verification (health check passing for all services)
- [x] API documentation (OpenAPI/Swagger for internal API)
- [x] Database migration scripts tested
- [x] Dependency audit clean
- [x] Platform API integration evidence (OAuth success, read/write test per platform)
- [x] Analytics pipeline accuracy evidence (our data vs. native platform data comparison)
- [x] Sentiment analysis accuracy benchmark (F1 score on labeled test set)

**Reporting Frequency**: Every 6 hours (default)

**Final Deliverable**: Both PPTX + PDF

---

## 12.1 Data Preservation & Uncertainty Policy

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, table rows, document sections, log entries, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}` (default)
- **Archive method for table rows**: Add `status: archived` column (default)
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker (default)
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

- **Escalation threshold**: < 90% confidence -> escalate
- **Escalation response time expectation**: [FILL — "within minutes" / "within hours" / "whenever I'm available"]
- **What counts as "unsure"**: Any action that might delete data, cost money, affect external services (posting to real social accounts, spending ad budget), be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Short question with 2-3 options and a recommendation

---


## 12.2 Screenshots & Visual Evidence

> **MANDATORY** — The `.team/screenshots/` directory is required for every project.

**Screenshot Directory Structure**:
```
.team/screenshots/
├── setup/                    # Environment setup, initial state
├── features/                 # Feature implementation evidence
│   └── {feature-name}/       # before.png + after.png per feature
├── testing/                  # Test results, coverage reports
├── deployment/               # Deployment evidence
├── mission-control/          # Dashboard captures at wave completions
├── errors/                   # Bug evidence
└── final/                    # Final product walkthrough
    ├── desktop/
    ├── tablet/
    └── mobile/
```

**Screenshot Requirements**:
- [ ] Before/after screenshots for every P0 feature
- [ ] Test result screenshots (unit, integration, e2e)
- [ ] Deployment evidence screenshots
- [ ] Final product screenshots (all viewports)
- [ ] Mission Control dashboard at wave completions
- [ ] Error and empty state screenshots

**Naming Convention**: `{date}_{agent}_{description}.png`

## 12.3 Documentation Website

> **MANDATORY** — Every project includes a `docs/` React documentation site generated by a Documentation Agent.

**Documentation Scope**:
- [ ] Project overview and architecture diagram
- [ ] Getting started / installation guide
- [ ] API reference (auto-generated where possible)
- [ ] User guide with embedded screenshots from `.team/screenshots/`
- [ ] Configuration reference
- [ ] Deployment guide
- [ ] Decision log (key architectural decisions)
- [ ] Changelog

**Tech Stack**: React + Vite + MDX | Dark mode + mobile-responsive
**Agent**: Documentation Engineer (DOCS) — spawned in Wave 2, finalizes in Wave 4
**Deliverable**: Buildable with `npm run build`, servable with `npm run dev`

## 12.4 Mission Control PDF Report

> **MANDATORY** — Comprehensive PDF report downloadable from Mission Control dashboard.

**PDF Report Includes**:
- [ ] Executive summary with key metrics
- [ ] Full discovery interview (20+ Q&A)
- [ ] Complete decision log with rationale
- [ ] Task execution timeline (planned vs actual)
- [ ] Git commit history with agent attribution
- [ ] Quality report (coverage, bugs, security scans)
- [ ] Agent performance metrics
- [ ] Embedded screenshots (not links)
- [ ] Cost analysis (budget vs actual)
- [ ] Deliverables checklist with evidence

**Generation**: Automatic at end of every wave + on-demand via `team report pdf`
**Storage**: `.team/reports/PROJECT_REPORT_{date}.pdf` (follows No-Delete Rule)

---

## 13. GitHub Auto-Sync Policy

**Auto-sync frequency**: Every agent completion (default)

**Auto-push enabled?**: Yes (default)

**Branch strategy for auto-sync**:
- Working branch: `ai-team` **(MANDATORY — all teams use this branch, non-negotiable)**
- Merge to main: **ONLY after Team Leader receives explicit user approval**
- No agent, PM, or automated process may merge `ai-team` -> `main` without user saying "approved"

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (engineering agents)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL — Anything else the team should know. Examples for social media projects:]

### Platform-Specific Notes
- **Meta**: Business verification may be required for certain API permissions (pages_manage_posts, ads_management). Plan 2-5 business days for approval.
- **X/Twitter**: Basic tier ($100/month) required for write access. Free tier is read-only (limited).
- **LinkedIn**: Marketing Developer Platform access requires company page admin approval.
- **TikTok**: Content Posting API requires app review. Video must be uploaded, not URL-linked.
- **YouTube**: Upload quota is 6 videos/day by default. Request increase if needed.
- **Pinterest**: Pin creation requires business account. Rich Pins require domain verification.

### Test Accounts
[FILL — List sandbox/test accounts per platform, or note that they need to be created]

### Brand Guidelines
[FILL — Link to brand guidelines, tone of voice doc, visual identity, or note that Content Strategist will create them]

### Existing Tools Being Replaced
[FILL — e.g., "Currently using Buffer (scheduling) + Google Analytics (web) + native platform analytics. All data must be migrated/preserved."]

### Team Communication
[FILL — Slack channel, stand-up schedule, timezone, decision-making authority]

---

*Strategy Brief v3.3 — Social Media Platform — Amenthyx AI Teams*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven | Deliverable Products | 20-Question Discovery | Screenshots | Docs Website | PDF Reports*
*Pre-filled for: Multi-Platform Publishing | Analytics | Paid Media | Content | Community | SEO/Growth | DevOps*
