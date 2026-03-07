# Project Strategy Brief v3.3

> Pre-built strategy template for a SaaS web application MVP.
> Copy this file, customize to your needs, and pass it with `--strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: TaskFlow

**One-Line Vision**: A collaborative project management SaaS that helps small teams organize tasks, track progress, and stay aligned in real time.

**Problem Statement**: Small teams (5-20 people) waste 4-6 hours per week context-switching between scattered tools — spreadsheets, chat threads, email — to track who is doing what. This fragmentation causes missed deadlines, duplicated work, and unclear ownership, costing teams roughly $2,000/month in lost productivity.

**Desired Outcome**: Within 6 months of launch, TaskFlow has 500 active teams using it daily to manage their work. Teams report a 30% reduction in missed deadlines and can onboard a new member in under 10 minutes.

**Project Type**: Greenfield / MVP

**Repository**: github.com/yourorg/taskflow

---

## 1.1 Deliverable Product Target

**Delivery Target**: MVP — visually demonstrable minimum viable product

**What "Done" Looks Like**:
- [x] Application is running and accessible (localhost, staging URL, or deployed)
- [x] All P0 features are functional and demonstrable
- [x] A non-technical person can use the core flow without assistance
- [x] Screenshots of every major screen/feature exist in `.team/screenshots/final/`

**Demo Requirements**:
- **Demo format**: Live demo
- **Demo audience**: Stakeholders / End users
- **Demo environment**: Staging (Vercel preview deployment)

**Visual Deliverables** (mandatory):
- [x] Running application with real UI (not wireframes)
- [x] Complete user flow from registration/login to core feature
- [x] Responsive design (desktop + mobile)
- [x] Documentation website (`docs/`) with full project documentation

---

## 2. Target Audience

**Primary Users**: Project leads and team members at startups and small businesses (5-20 people), moderate technical skill, comfortable with web apps like Trello or Notion.

**Secondary Users**: Company founders who review weekly progress summaries; external contractors who need read-only project visibility.

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| Sarah | Startup PM | Tasks scattered across Slack, sheets, email; no single view of team workload | One place to assign, track, and review all team work | Med |
| Dev | Software Engineer | Unclear priorities; duplicate assignments; no visibility into blockers | Know exactly what to work on today and unblock fast | High |

**Anti-Users**: Enterprise teams needing Gantt charts, resource leveling, or SAFe/Agile ceremony tooling. Not for freelancers managing solo work.

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Auth system | Email/password signup, login, logout, password reset | User can register, log in, reset password; sessions persist across tabs; invalid credentials show clear error | M |
| 2 | Dashboard | Personal dashboard showing assigned tasks, recent activity, and team overview | Dashboard loads in < 2s; shows tasks grouped by status; updates when tasks change | L |
| 3 | Task CRUD | Create, read, update, delete tasks with title, description, assignee, status, due date, and priority | All CRUD operations work; validation on required fields; optimistic UI updates | L |
| 4 | Team invites | Invite members by email; accept/decline flow; role assignment (admin/member) | Invitation email sent within 30s; accepting adds user to team; admin can revoke | M |
| 5 | Real-time updates | Tasks and board state sync across all connected clients without refresh | Two users see the same task update within 1s; no stale data on reconnect | L |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Task comments | Threaded comments on tasks with @mentions | Comments persist, mentions trigger notification, markdown supported | M |
| 2 | Board view | Kanban-style drag-and-drop board for visual task management | Drag updates status; column order persists; works on tablet screens | M |
| 3 | Search and filters | Full-text search across tasks; filter by assignee, status, priority, date | Results appear within 500ms; filters composable; URL reflects filter state | S |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | File attachments | Attach files to tasks (up to 10MB per file, stored in S3-compatible storage) |
| 2 | Activity log | Chronological feed of all actions taken on a project for audit purposes |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: TypeScript 5.x
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL 16 (Supabase or Neon free tier)
- **Cache**: Redis 7 (Upstash free tier)
- **Message Queue**: None (use Supabase Realtime for pub/sub)

**Hosting/Infrastructure**:
- **Cloud Provider**: Vercel (frontend + API routes) + Supabase (DB + auth + realtime)
- **Deployment**: Vercel serverless
- **CDN**: Vercel Edge Network (included)
- **Domain**: taskflow-mvp.vercel.app (upgrade to custom domain post-MVP)

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Supabase | Database, auth, realtime | API key + JWT | 500K requests/month (free tier) |
| Resend | Transactional email (invites, resets) | API key | 100 emails/day (free tier) |

**Existing Codebase**: Greenfield

**Package Manager**: pnpm

**Monorepo or Polyrepo**: Single repo

---

## 5. Non-Functional Requirements

**Performance**:
- API response time: P95 < 300ms
- Page load time: LCP < 2.5s
- Throughput: 100 req/s (MVP scale)
- Concurrent users: 50 simultaneous

**Security**:
- Authentication: Supabase Auth (JWT + refresh tokens)
- Authorization: RBAC (admin / member roles)
- Data sensitivity: PII (names, emails)
- Compliance: GDPR basics (data export, deletion on request)
- Encryption: TLS 1.3 in transit; AES-256 at rest (Supabase default)

**Scalability**:
- Expected launch users: 100
- Expected 6-month users: 2,000
- Expected 1-year users: 10,000
- Scaling strategy: Serverless auto-scaling (Vercel + Supabase)

**Availability**:
- Uptime target: 99.5%
- Recovery time objective (RTO): < 4 hours
- Recovery point objective (RPO): < 1 hour
- Multi-region: No (future consideration)

**Accessibility**:
- WCAG level: AA
- Screen reader support: Required
- Internationalization: English only at launch

**Observability**:
- Logging: Vercel Logs + structured JSON
- Metrics: Vercel Analytics (built-in)
- Tracing: None for MVP
- Alerting: Email alerts on error spikes (Vercel integration)

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% line coverage

**Required Test Types**:
- [x] Unit tests (mandatory)
- [x] Integration tests (mandatory)
- [x] E2E tests (mandatory for P0 features)
- [ ] Performance/load tests
- [x] Security scanning (SAST + dependency audit)
- [x] Accessibility tests (axe-core / Lighthouse)
- [ ] Visual regression tests
- [ ] Contract tests (API consumers/providers)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (lint, format, type-check)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: Vitest for unit/integration, Playwright for E2E, axe-core for accessibility

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
| **Role Coverage** | 100% (admin + member roles) |
| **Browser Matrix (P0 flows)** | Chrome + Firefox + Safari |
| **Device Matrix (P0 flows)** | Desktop + Tablet + Mobile |

**UAT Sign-Off Chain**: QA Agent -> Team Leader -> User

**Applicable Regulations**:
- [x] ISO 25010 — Software quality
- [x] GDPR — EU personal data handling
- [ ] SOC 2 Type II
- [x] WCAG 2.1 AA — Accessibility compliance
- [ ] PCI DSS v4.0
- [ ] HIPAA
- [ ] FDA 21 CFR Part 11

**Additional UAT Context**: Focus UAT on the task creation -> assignment -> completion flow and the team invite flow, as these are the primary value-delivering paths.

---

## 7. Timeline & Milestones

**Hard Deadline**: 4 weeks from kickoff

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | Foundation | Week 1 | Auth, DB schema, project scaffolding, CI pipeline | User can register, log in, see empty dashboard |
| M2 | Core CRUD | Week 2 | Task CRUD, dashboard, team management | Tasks can be created, assigned, and displayed |
| M3 | Real-time + Polish | Week 3 | Real-time sync, board view, search, responsive UI | Two users see live updates; board drag-and-drop works |
| M4 | QA + Launch | Week 4 | Full test suite, docs site, staging deployment, UAT | All P0 E2E tests pass; staging URL accessible |

**Budget Constraints**:
- Infrastructure: $0/month (free tiers: Vercel Hobby, Supabase Free, Upstash Free)
- Third-party APIs: $0/month (Resend free tier)
- Domains/SSL: $0 (using vercel.app subdomain for MVP)

---

## 7.1 Cost Approval & Payment Governance

**Token Budget Tolerance**: < $10 total

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, domain purchases, API subscriptions
- **Forbidden without user present**: Any payment over $5, any recurring subscription

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Vercel Hobby | $0 | Free tier | Yes |
| Supabase Free | $0 | Free tier | Yes |
| Upstash Free | $0 | Free tier | Yes |
| Resend Free | $0 | Free tier | Yes |

**Cost Estimation Detail Level**: Summary only

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [x] All P0 features implemented and tested
- [x] Unit test coverage >= 80%
- [x] Zero CRITICAL/HIGH security vulnerabilities
- [x] E2E tests pass for all P0 user flows
- [x] Performance targets met (see Section 5)
- [x] Documentation complete (README, API docs, setup guide)
- [x] CI/CD pipeline tested and working
- [x] Deployment to staging succeeds

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Task creation to completion time | < 3 clicks | E2E test measurement |
| Dashboard load time | < 2s | Lighthouse performance audit |
| Team onboarding time | < 5 minutes | UAT timed walkthrough |

**Definition of Done**: All P0 features pass UAT, staging deployment is live and accessible, documentation site is published, and the QA report shows zero critical bugs.

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| Linear | Clean UI, keyboard shortcuts, fast performance | Over-engineering for MVP; complex workflow automations |
| Trello | Simple mental model (cards on boards), easy onboarding | Feature bloat; slow performance with many cards |
| Asana | Task detail richness, multiple views | Overwhelming UI for small teams; heavy onboarding |

**Design Inspiration**: Linear's minimal dark UI, Notion's clean typography, Vercel dashboard layout patterns

**Technical References**: Next.js App Router docs, Supabase Realtime docs, Vercel deployment guides

**Internal Documentation**: None (greenfield)

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. Native mobile apps (iOS/Android) — web responsive only
2. Gantt charts, time tracking, or resource management
3. Third-party integrations (Slack, GitHub, Jira) — deferred to v2

**Deferred to future versions**:
1. Custom workflows and automation rules
2. Reporting and analytics dashboards
3. SSO / SAML authentication
4. API for third-party integrations

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Supabase free tier rate limits hit during testing | M | M | Implement request batching; upgrade to Pro if needed ($25/mo) |
| Real-time sync introduces race conditions | M | H | Use Supabase Realtime with conflict resolution; optimistic UI with rollback |
| Scope creep from P1/P2 features | H | M | Strict P0-first execution; PM gates any scope changes |

**Hard Constraints** (non-negotiable):
- Must use free tiers only for MVP infrastructure
- Must deploy to Vercel (team already has account)
- Must use TypeScript (team standard)

**Soft Constraints** (preferred but negotiable):
- Prefer Tailwind CSS for styling but open to alternatives
- Prefer Supabase but open to Neon + separate auth if needed

---

## 11.1 Dynamic Agent Scaling

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 10

**Scaling triggers**:
- A single feature has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking bugs requiring parallel fix agents

**Agent types the PM may add**:
- [x] Additional Frontend Engineers (for UI-heavy projects)
- [x] Additional QA Engineers (for large test suites)
- [ ] Additional Backend Engineers
- [ ] Specialist agents

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Screenshots of running application
- [x] Test result reports (JUnit XML, coverage HTML)
- [x] Build logs showing zero errors
- [x] CI/CD pipeline passing locally (act) and remotely
- [x] Security scan reports (zero CRITICAL/HIGH)
- [ ] Performance benchmark results
- [x] Deployment verification (health check passing)
- [ ] API documentation (OpenAPI/Swagger)
- [x] Database migration scripts tested
- [x] Dependency audit clean

**Reporting Frequency**: Every 6 hours (default)

**Final Deliverable**: Both PPTX and PDF

---

## 12.0.1 Screenshots & Visual Evidence

**Screenshot Requirements**:
- [x] Before/after screenshots for every P0 feature implementation
- [x] Test result screenshots (unit, integration, e2e)
- [x] Deployment evidence screenshots
- [x] Final product screenshots (desktop, tablet, mobile viewports)
- [x] Mission Control dashboard screenshots at wave completions
- [x] Error state and empty state screenshots

**Screenshot Naming**: `{date}_{agent}_{description}.png`

**Final Product Screenshots**: `.team/screenshots/final/` MUST contain a complete visual walkthrough of the delivered product.

## 12.0.2 Documentation Website

**Documentation Scope**:
- [x] Project overview and architecture
- [x] Getting started / installation guide
- [ ] API reference (auto-generated where possible)
- [x] User guide with embedded screenshots
- [x] Configuration reference
- [x] Deployment guide
- [x] Decision log (key architectural decisions)

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
- [x] Screenshots embedded (not just links)
- [x] Cost analysis (budget vs actual)
- [x] Deliverables checklist with evidence

**Report Generation**: Automatic at end of every wave + on-demand

---

## 12.1 Data Preservation & Uncertainty Policy

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}` (default)
- **Archive method for table rows**: Add `status: archived` column (default)
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker (default)
- **Git history protection**: Never rebase/squash published commits

**Uncertainty Escalation**:

- **Escalation threshold**: < 90% confidence -> escalate
- **Escalation response time expectation**: I'll respond within minutes
- **What counts as "unsure"**: Any action that might delete data, cost money, affect external services, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Short question with 2-3 options

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

This is a side project with a 4-week sprint. Keep everything as simple as possible — no over-engineering. Favor convention over configuration. Use Shadcn/ui for component library to move fast. The goal is a polished, functional MVP that can be demo'd to potential early adopters.

---

*Strategy Brief v3.3 — Amenthyx AI Teams*
