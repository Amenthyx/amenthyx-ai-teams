# Project Strategy Brief v3.3

> Fill out this template and pass it to your team with `--strategy path/to/this-file.md`
> This is your single source of truth. The team reads this as gospel.
> **Be specific. Vague strategies produce vague results.**
>
> **v3.3**: Mandatory discovery interview, deliverable product focus, screenshots, documentation website, comprehensive Mission Control PDF.
> You must approve the cost estimate before the PM starts orchestrating sub-agents.

---

## 1. Project Identity

**Project Name**: [Your project name — short, memorable]

**One-Line Vision**: [What is this project in one sentence? e.g., "A real-time collaborative code editor for remote teams"]

**Problem Statement**: [What specific, measurable pain does this solve? Who feels it? How much does it cost them?]

**Desired Outcome**: [What does the world look like 6 months after this ships? Be concrete.]

**Project Type**: [Greenfield / Extending existing codebase / Migration / Rewrite / Prototype / MVP / Production]

**Repository**: [GitHub URL if existing, or desired repo name]

---

## 1.1 Deliverable Product Target

> **MANDATORY** — The team MUST deliver a product that can be visualized, demonstrated, and evaluated.

**Delivery Target**: [MVP — visually demonstrable minimum viable product / Production — enterprise-ready application for deployment / Prototype — functional proof of concept]

**What "Done" Looks Like**:
- [ ] Application is running and accessible (localhost, staging URL, or deployed)
- [ ] All P0 features are functional and demonstrable
- [ ] A non-technical person can use the core flow without assistance
- [ ] Screenshots of every major screen/feature exist in `.team/screenshots/final/`

**Demo Requirements**:
- **Demo format**: [Live demo / Recorded walkthrough / Screenshots + documentation]
- **Demo audience**: [Technical team / Stakeholders / End users / Investors]
- **Demo environment**: [Local / Staging / Production]

**Visual Deliverables** (mandatory):
- [ ] Running application with real UI (not wireframes)
- [ ] Complete user flow from registration/login to core feature
- [ ] Responsive design (desktop + mobile if web)
- [ ] Documentation website (`docs/`) with full project documentation

---

## 2. Target Audience

**Primary Users**: [Who uses this daily? Be specific — job title, company size, technical skill level]

**Secondary Users**: [Who benefits indirectly? Managers, ops teams, end customers?]

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [Name] | [Job title] | [Top 3 pain points] | [What they want to achieve] | [Low/Med/High] |
| [Name] | [Job title] | [Top 3 pain points] | [What they want to achieve] | [Low/Med/High] |

**Anti-Users**: [Who is this explicitly NOT for?]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |
| 2 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |
| 3 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |
| 2 | [Feature name] | [What it does] | [Specific, testable criteria] | [S/M/L/XL] |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | [Feature name] | [What it does] |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: [e.g., TypeScript 5.x / Python 3.12+ / Rust 1.75+ / "team's choice"]
- **Framework**: [e.g., Next.js 14 / Django 5 / Actix-web / "team's choice"]
- **Database**: [e.g., PostgreSQL 16 / MongoDB 7 / "team's choice"]
- **Cache**: [e.g., Redis 7 / "none" / "team's choice"]
- **Message Queue**: [e.g., RabbitMQ / Kafka / "none" / "team's choice"]

**Hosting/Infrastructure**:
- **Cloud Provider**: [AWS / GCP / Azure / self-hosted / "team's choice"]
- **Deployment**: [Docker + K8s / serverless / VMs / PaaS / "team's choice"]
- **CDN**: [CloudFront / Cloudflare / "team's choice"]
- **Domain**: [your-domain.com or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| [Service name] | [Why needed] | [API key / OAuth / etc.] | [If known] |

**Existing Codebase**: [Path to existing code, or "greenfield". If existing: what's the current state?]

**Package Manager**: [npm / pnpm / yarn / pip / poetry / cargo / go mod / etc.]

**Monorepo or Polyrepo**: [Single repo / multiple repos / monorepo with workspaces]

---

## 5. Non-Functional Requirements

**Performance**:
- API response time: [e.g., P95 < 200ms]
- Page load time: [e.g., LCP < 2.5s]
- Throughput: [e.g., 1000 req/s]
- Concurrent users: [e.g., 500 simultaneous]

**Security**:
- Authentication: [e.g., JWT + refresh tokens / OAuth 2.0 / SSO]
- Authorization: [e.g., RBAC / ABAC / row-level security]
- Data sensitivity: [e.g., PII, financial data, health data, public only]
- Compliance: [e.g., SOC 2 / GDPR / HIPAA / PCI-DSS / none]
- Encryption: [At rest + in transit / TLS 1.3 / AES-256]

**Scalability**:
- Expected launch users: [number]
- Expected 6-month users: [number]
- Expected 1-year users: [number]
- Scaling strategy: [horizontal / vertical / auto-scaling]

**Availability**:
- Uptime target: [e.g., 99.9% / 99.99%]
- Recovery time objective (RTO): [e.g., < 1 hour]
- Recovery point objective (RPO): [e.g., < 5 minutes]
- Multi-region: [yes / no / future]

**Accessibility**:
- WCAG level: [A / AA / AAA]
- Screen reader support: [required / nice-to-have]
- Internationalization: [languages needed, RTL support]

**Observability**:
- Logging: [structured JSON / ELK / CloudWatch / "team's choice"]
- Metrics: [Prometheus / Datadog / CloudWatch / "team's choice"]
- Tracing: [Jaeger / Tempo / X-Ray / "team's choice"]
- Alerting: [PagerDuty / Opsgenie / Slack / "team's choice"]

---

## 6. Testing Requirements

**Test Coverage Target**: [e.g., >= 80% line coverage]

**Required Test Types**:
- [ ] Unit tests (mandatory)
- [ ] Integration tests (mandatory)
- [ ] E2E tests (mandatory for P0 features)
- [ ] Performance/load tests
- [ ] Security scanning (SAST + dependency audit)
- [ ] Accessibility tests (axe-core / Lighthouse)
- [ ] Visual regression tests
- [ ] Contract tests (API consumers/providers)

**CI/CD Requirements**:
- [ ] GitHub Actions (tested locally with `act` before push)
- [ ] Pre-commit hooks (lint, format, type-check)
- [ ] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: [e.g., Jest / Pytest / Playwright / k6 / "team's choice"]

### 6.1 UAT Testing Requirements

> UAT is MANDATORY for all projects. Coverage target: >= 95%.

| Requirement | Value |
|-------------|-------|
| **UAT Coverage Target** | [>= 95% — mandatory, non-negotiable] |
| **P0 Feature Pass Rate** | [100% — all critical features must pass] |
| **P1 Feature Pass Rate** | [>= 95%] |
| **Compliance Frameworks** | [ISO 25010 (mandatory) + applicable: GDPR / SOC2 / WCAG / PCI / HIPAA] |
| **Screenshot Capture** | [Before + After for every test case — mandatory] |
| **UAT Report Format** | [MD + PDF + PPTX + JSON + CSV exports] |
| **Negative Test Coverage** | [>= 90% — every positive case needs a negative counterpart] |
| **Role Coverage** | [100% — all user roles must be tested] |
| **Browser Matrix (P0 flows)** | [Chrome + Firefox + Safari — mandatory] |
| **Device Matrix (P0 flows)** | [Desktop + Tablet + Mobile — mandatory] |

**UAT Sign-Off Chain**: QA Agent → Team Leader → User (all three MUST approve)

**Applicable Regulations** (check all that apply):
- [ ] ISO 25010 — Software quality (always applicable)
- [ ] GDPR — EU personal data handling
- [ ] SOC 2 Type II — Security audit evidence
- [ ] WCAG 2.1 AA — Accessibility compliance
- [ ] PCI DSS v4.0 — Payment card processing
- [ ] HIPAA — Health data protection
- [ ] FDA 21 CFR Part 11 — Electronic records (pharma/medical)

**Additional UAT Context**: [Any specific UAT requirements, special user flows to test, regulatory constraints]

---

## 7. Timeline & Milestones

**Hard Deadline**: [Date or "flexible"]

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [Name] | [Date] | [What's delivered] | [How to verify] |
| M2 | [Name] | [Date] | [What's delivered] | [How to verify] |
| M3 | [Name] | [Date] | [What's delivered] | [How to verify] |
| M4 | [Name] | [Date] | [What's delivered] | [How to verify] |

**Budget Constraints**:
- Infrastructure: [$X/month or "minimize"]
- Third-party APIs: [$X/month or "free tier only"]
- Domains/SSL: [$X or "already owned"]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [e.g., "< $5 per run" / "< $20 total" / "no hard limit, but inform me" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: [$X — any payment below this can proceed without asking, e.g., "$0" means always ask]
- **Requires explicit approval**: [All card payments / Payments above $X / Domain purchases / API subscriptions]
- **Forbidden without user present**: [e.g., "Any payment over $50", "Any recurring subscription", "Any production deployment cost"]

**External Service Payments** (the TL must declare these in COST_ESTIMATION.md before proceeding):

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| [e.g., Domain registration] | [$X] | [Card / existing credits] | [Yes / No — ask first] |
| [e.g., API tier upgrade] | [$X/month] | [Card] | [Yes / No — ask first] |
| [e.g., Cloud hosting] | [$X/month] | [Card / free tier] | [Yes / No — ask first] |

**Cost Estimation Detail Level**: [Summary only / Detailed per-wave breakdown / Full per-agent breakdown]

**What happens if actual costs exceed estimate?**: [Stop and ask / Continue with warning / Hard stop at X% over]

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Unit test coverage >= [X]%
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows
- [ ] Performance targets met (see Section 5)
- [ ] Documentation complete (README, API docs, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [Metric 1] | [Target value] | [Measurement method] |
| [Metric 2] | [Target value] | [Measurement method] |

**Definition of Done**: [When is this project "done"? Be unambiguous.]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [Product 1] | [Good aspects] | [Bad aspects] |
| [Product 2] | [Good aspects] | [Bad aspects] |

**Design Inspiration**: [Links to designs, screenshots, Figma files, mockups]

**Technical References**: [Architecture docs, RFCs, papers, blog posts]

**Internal Documentation**: [Links to internal docs, PRDs, design docs]

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. [Thing you do NOT want — be specific]
2. [Thing you do NOT want — be specific]
3. [Thing you do NOT want — be specific]

**Deferred to future versions**:
1. [Thing for v2.0]
2. [Thing for v2.0]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | [H/M/L] | [H/M/L] | [Plan] |
| [Risk 2] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- [e.g., "Must use PostgreSQL — company standard"]
- [e.g., "Must deploy to AWS us-east-1 — data residency"]
- [e.g., "Must support IE11 — enterprise customers"]

**Soft Constraints** (preferred but negotiable):
- [e.g., "Prefer TypeScript but open to alternatives"]
- [e.g., "Prefer serverless but containers OK if needed"]

---

## 11.1 Dynamic Agent Scaling

> The PM may spawn additional agents beyond the default roster if the workload requires it.
> Fill this section to set boundaries on agent scaling.

**Allow PM to spawn extra agents?**: [Yes / No / "Yes, with TL approval"]

**Max concurrent agents**: [e.g., 15 / "no limit" / "default roster only"]

**Scaling triggers** (PM spawns extra agents when):
- A single feature has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= [N] blocking bugs requiring parallel fix agents
- The strategy explicitly requests parallel streams

**Agent types the PM may add**:
- [ ] Additional Backend Engineers (for API-heavy projects)
- [ ] Additional Frontend Engineers (for UI-heavy projects)
- [ ] Additional QA Engineers (for large test suites)
- [ ] Specialist agents (e.g., DB migration, perf tuning — PM must name the specialty)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > [X]%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [ ] Screenshots of running application
- [ ] Test result reports (JUnit XML, coverage HTML)
- [ ] Build logs showing zero errors
- [ ] CI/CD pipeline passing locally (act) and remotely
- [ ] Security scan reports (zero CRITICAL/HIGH)
- [ ] Performance benchmark results
- [ ] Deployment verification (health check passing)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Database migration scripts tested
- [ ] Dependency audit clean

**Reporting Frequency**: [Every 6 hours (default) / daily / per-wave / custom]

**Final Deliverable**: [PPTX presentation / PDF report / both / custom]

---

## 12.0.1 Screenshots & Visual Evidence

> **MANDATORY** — The `.team/screenshots/` directory is required for every project.

**Screenshot Requirements**:
- [ ] Before/after screenshots for every P0 feature implementation
- [ ] Test result screenshots (unit, integration, e2e)
- [ ] Deployment evidence screenshots
- [ ] Final product screenshots (desktop, tablet, mobile viewports)
- [ ] Mission Control dashboard screenshots at wave completions
- [ ] Error state and empty state screenshots

**Screenshot Naming**: `{date}_{agent}_{description}.png`

**Final Product Screenshots**: `.team/screenshots/final/` MUST contain a complete visual walkthrough of the delivered product.

## 12.0.2 Documentation Website

> **MANDATORY** — Every project includes a `docs/` React documentation site.

**Documentation Scope**:
- [ ] Project overview and architecture
- [ ] Getting started / installation guide
- [ ] API reference (auto-generated where possible)
- [ ] User guide with embedded screenshots
- [ ] Configuration reference
- [ ] Deployment guide
- [ ] Decision log (key architectural decisions)

**Documentation Tech**: React + Vite + MDX (generated by Documentation Agent in Wave 2-4)

## 12.0.3 Mission Control PDF Report

> **MANDATORY** — A comprehensive PDF report is downloadable from Mission Control.

**PDF Report Must Include**:
- [ ] Executive summary with key metrics
- [ ] Discovery interview (all 20+ Q&A)
- [ ] Complete decision log with rationale
- [ ] Task execution timeline (planned vs actual)
- [ ] Git commit history with agent attribution
- [ ] Quality report (test coverage, bugs, security scans)
- [ ] Agent performance metrics
- [ ] Screenshots embedded (not just links)
- [ ] Cost analysis (budget vs actual)
- [ ] Deliverables checklist with evidence

**Report Generation**: Automatic at end of every wave + on-demand via `team report pdf`

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, table rows, document sections, log entries, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: [Move to `.team/archive/{date}_{filename}` (default) / Custom path]
- **Archive method for table rows**: [Add `status: archived` column (default) / Custom]
- **Archive method for documents**: [Add `[ARCHIVED {date}]` marker (default) / Move to bottom section]
- **Git history protection**: [Never rebase/squash published commits (default, non-negotiable)]

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: [Default: < 90% confidence → escalate / Custom threshold]
- **Escalation response time expectation**: [I'll respond within minutes / hours / "whenever I'm available"]
- **What counts as "unsure"**: Any action that might delete data, cost money, affect external services, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: [Short question / Detailed context + options / "TL decides what format"]

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.
> This ensures the GitHub repository is always the living source of truth.

**Auto-sync frequency**: [Every wave / Every agent completion / Every commit (default) / Manual only]

**Auto-push enabled?**: [Yes (default) / No — commit only, I push manually]

**Branch strategy for auto-sync**:
- Working branch: `ai-team` **(MANDATORY — all teams use this branch, non-negotiable)**
- Merge to main: **ONLY after Team Leader receives explicit user approval** (this is a hard gate — no automation, no skip, no timeout)
- No agent, PM, or automated process may merge `ai-team` → `main` without user saying "approved"

**What gets auto-synced**:
- [ ] `.team/` planning artifacts (charter, kanban, milestones)
- [ ] `.team/evidence/` proof artifacts
- [ ] Source code changes (engineering agents)
- [ ] `.team/COMMIT_LOG.md` updates
- [ ] `.team/reports/` PPTX + PDF
- [ ] `COST_ESTIMATION.md` and revisions

---

## 14. Execution Permissions

> **MANDATORY** — Define what the AI team is allowed to do autonomously.

**Claude Code Permission Mode**:
- [ ] `--dangerously-skip-permissions` — Full auto-mode. Agents can read, write, execute, install, and deploy without asking. **USE WITH CAUTION.** Recommended only for isolated environments (containers, VMs, disposable machines).
- [ ] Standard mode (default) — Claude asks for permission before destructive or sensitive actions. Recommended for local development on your main machine.
- [ ] Restricted mode — Agents cannot install packages, run arbitrary commands, or access network. Manual approval for every action.

**Why this matters**: With `--dangerously-skip-permissions`, agents will autonomously install dependencies, run build commands, execute tests, start servers, and modify system files. This is fast but gives the AI full control of your machine.

**Recommended setup by environment**:

| Environment | Permission Mode | Reasoning |
|-------------|----------------|-----------|
| Docker container | `--dangerously-skip-permissions` | Isolated, disposable — safe for full autonomy |
| VM / Cloud instance | `--dangerously-skip-permissions` | Isolated — can be destroyed if issues arise |
| Local dev machine | Standard mode | Your main machine — keep human-in-the-loop |
| Production server | Restricted mode | Never give AI full autonomy on production |

**Additional permission rules**:
- **Can agents install npm/pip/cargo packages?**: [Yes / Yes with approval / No]
- **Can agents start local servers (ports)?**: [Yes / Yes with approval / No]
- **Can agents access the internet?**: [Yes / Yes for specific domains / No]
- **Can agents run docker commands?**: [Yes / Yes with approval / No]
- **Can agents modify .env or config files?**: [Yes / Yes with approval / No]

---

## 15. Runtime Environment

> **MANDATORY** — Define where the AI team executes.

**Execution Environment**:
- [ ] Local machine — Team runs directly on your workstation
- [ ] Docker container — Team runs inside an isolated container (recommended for `--dangerously-skip-permissions`)
- [ ] Remote VM / Cloud — Team runs on a cloud instance (SSH or remote Claude Code)
- [ ] GitHub Codespaces — Team runs in a Codespace environment
- [ ] Other: [specify]

**If Docker**:
- **Base image**: [e.g., `node:20-slim` / `python:3.12-slim` / `ubuntu:24.04` / custom]
- **Pre-installed tools**: [e.g., git, gh, act, node, python, docker-cli]
- **Volume mounts**: [e.g., `./:/workspace` for code, `~/.ssh:/root/.ssh` for git auth]
- **Network**: [host / bridge / none]
- **Resource limits**: [CPU, memory — e.g., `--cpus=4 --memory=8g`]

**If Local**:
- **OS**: [Windows / macOS / Linux]
- **Pre-installed tools**: [List what's already available — node, python, git, gh, docker, etc.]
- **Working directory**: [Path where the team should operate]

**Container template** (if Docker chosen):
```dockerfile
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y git curl nodejs npm python3 python3-pip
# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code
# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
WORKDIR /workspace
```

**Environment variables** (team needs these):
| Variable | Value | Purpose |
|----------|-------|---------|
| `ANTHROPIC_API_KEY` | [set at runtime] | Claude API access |
| `GITHUB_TOKEN` | [set at runtime] | GitHub API access (gh cli) |
| `MC_PORT` | 4201 | Mission Control dashboard port |
| [custom] | [value] | [purpose] |

---

## 16. Additional Context

[Anything else the team should know — organizational context, political constraints, historical decisions, previous failed attempts, team culture, communication preferences, timezone constraints, etc.]

---

*Strategy Brief v3.4 — Amenthyx AI Teams*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven | Deliverable Products | 20-Question Discovery | Screenshots Mandatory | Documentation Website | Mission Control PDF | Permission-Aware | Environment-Declared*
*The more specific you are here, the better the team performs.*
