# Project Strategy Brief v3.1

---

## 1. Project Identity

**Project Name**: Amenthyx Mission Control

**One-Line Vision**: A real-time local React dashboard that monitors every aspect of AI agentic team execution — agents, planning, milestones, costs, tests, secrets, and CI/CD — regardless of which AI coding tool drives the session.

**Problem Statement**: When AI teams (Amenthyx v3.1) execute a strategy, the user has zero real-time visibility into what's happening. They can't see which agents are active, what tasks are in progress, how much it's costing, whether tests are passing, or if secrets are properly managed. The only feedback is chat output — linear, hard to parse, impossible to monitor at scale. This costs hours of confusion per project and makes it impossible to manage multiple teams or catch issues early.

**Desired Outcome**: 6 months after shipping, every Amenthyx AI Teams project launches with a local dashboard running at `http://localhost:4200` that provides full real-time observability. Users can see all 11+ agents, their status, task progress, cost burn rate, test coverage, CI results, and secret health — all updating live. The dashboard works with Claude Code, Cursor, Aider, Windsurf, GitHub Copilot Workspace, or any custom agentic loop. It has become the standard "mission control" for AI-driven engineering.

**Project Type**: Greenfield — new standard tool embedded in the Amenthyx AI Teams ecosystem

**Repository**: `Amenthyx/amenthyx-ai-teams` — lives under `shared/mission-control/`

---

## 2. Target Audience

**Primary Users**: Engineers and technical leads who activate Amenthyx AI Teams with `--team X --strategy Y`. They are technically proficient (can run `npm install`, read logs, manage git) but need visual observability into the AI execution process.

**Secondary Users**: Project managers and stakeholders who want to check progress without reading chat logs. Non-technical enough to need a visual interface, but technical enough to open a browser to `localhost:4200`.

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| Marco | Solo founder using AI teams | Can't tell what's happening during execution; no cost visibility; tests might be failing silently | See everything at a glance; catch problems early; control costs | High |
| Sarah | Engineering lead | Managing multiple AI team runs; needs to verify evidence, tests, and quality before merge | Real-time quality dashboard; evidence audit trail; exportable reports | High |
| Dave | Technical PM | Needs milestone progress without reading code; wants cost tracking | Visual progress, cost burn, timeline status | Medium |

**Anti-Users**: This is NOT for end-users of projects built by AI teams. It is strictly an internal developer tool.

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)

| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|---------------------|------------|
| 1 | **Universal Event Ingestion API** | REST + WebSocket server that accepts structured events from ANY AI coding tool via a standardized event schema. Adapters translate tool-specific output into this schema. | POST `/api/events` accepts events; WebSocket at `/ws` pushes to frontend in <100ms; events persist to local SQLite; schema validates all events | L |
| 2 | **Global Agent Filter Bar (CRITICAL UX)** | A persistent top-level filter bar present on EVERY panel/page of the dashboard. Allows filtering ALL data by agent role. Filter chips for each agent category: TL, PM, BE, FE, MOB, DEVOPS, INFRA, QA, RM, MKT, LEGAL, and any dynamically spawned agents. Multi-select supported (e.g., show only BE + FE + DEVOPS). "All" button to reset. Filter state persists across panel navigation via Zustand global store. When a filter is active, ALL panels (events, commits, issues, kanban, costs, tests, evidence) show ONLY data related to the selected agent(s). | Filter bar visible on every page; multi-select agent chips; "All" reset button; filter applies to every panel simultaneously; filter state persists on navigation; dynamically spawned agents auto-appear as new chips; color-coded chips match agent role colors (BE=blue, FE=green, DEVOPS=orange, QA=purple, MKT=pink, etc.) | L |
| 3 | **Agent Activity Panel** | Real-time grid showing all agents (TL, PM, BE, FE, MOB, DEVOPS, INFRA, QA, RM, MKT, LEGAL + any dynamically scaled agents). Each card shows: role, status (idle/active/blocked/done), current task, duration, token usage, last action. Clicking an agent card auto-filters the entire dashboard to that agent. | All team agents visible; status updates in <2s; blocked agents highlighted red; dynamically spawned agents auto-appear; click-to-filter | L |
| 4 | **Planning & Milestones Tracker** | Visual timeline of waves (0-5) and milestones. Shows current wave, completed waves, gate status (pass/fail/pending), and per-wave deliverables parsed from `.team/MILESTONES.md` and `.team/KANBAN.md`. Respects agent filter — when filtered, shows only deliverables and tasks assigned to the selected agent(s). | Waves render as horizontal timeline; current wave highlighted; gates shown as checkpoints; clicking wave shows deliverables; auto-updates from `.team/` files; agent filter narrows visible deliverables | M |
| 5 | **Cost Monitor** | Real-time cost tracking: token usage (input/output/cache), USD cost per agent, per wave, cumulative. Shows burn rate, budget remaining, and alerts when approaching cap. Parses `.team/COST_ESTIMATION.md` for budget and tracks actuals. Respects agent filter — when filtered, shows cost breakdown for selected agent(s) only. | Shows estimated vs actual cost; per-agent breakdown; burn rate chart; alert at 80% budget; red at 100%; works with OTEL metrics or manual event injection; agent filter scopes cost view | L |
| 6 | **Test Results Dashboard** | Aggregated view of all test layers: static analysis, unit (BE/FE), integration, E2E, performance, security, accessibility. Shows pass/fail/skip counts, coverage %, trend over time. Parses JUnit XML, coverage reports, and `.team/evidence/tests/`. Respects agent filter — when filtered by BE, shows only backend tests; when filtered by FE, shows only frontend tests; etc. | All 8 test layers visible; coverage % with trend chart; failing tests listed with file:line; click to expand details; auto-updates when test files change; agent filter scopes test results | L |
| 7 | **`.team/` File Watcher** | Filesystem watcher that monitors the entire `.team/` directory tree and parses changes into dashboard state. Detects new evidence, kanban updates, commit logs, reports, scaling events. | Watches recursively; debounces at 500ms; parses markdown tables and structured files; triggers WebSocket push on change; handles file creation, modification, deletion | M |
| 8 | **Issues & Kanban Board Panel** | Full kanban board view mirroring the GitHub Projects V2 board AND `.team/KANBAN.md`. Columns: Backlog, Sprint Ready, In Progress, In Review, Testing, Done, Blocked. Each card shows issue title, assigned agent, labels, wave, evidence status. Respects agent filter — when filtered, shows only issues assigned to selected agent(s). Also parses `.team/GITHUB_ISSUES.md` for issue details. Clicking an issue shows full details (description, acceptance criteria, linked commits, evidence). | 7-column kanban board renders; cards show agent badge + labels; agent filter works; issue detail modal on click; auto-updates from `.team/KANBAN.md` and `GITHUB_ISSUES.md`; blocked cards highlighted red; cards are color-coded by assigned agent role | L |
| 9 | **Git Commits & Activity Panel** | Tracks commits on the `ai-team` branch in real-time. Shows commit log with agent attribution, conventional commit parsing, issue references, evidence links. Parses `.team/COMMIT_LOG.md` and runs `git log`. Each commit is tagged with the agent who made it. Respects agent filter — when filtered, shows only commits from selected agent(s). Commits are grouped by area (BE, FE, DEVOPS, etc.) with expandable sections. | Shows last 100 commits; color-coded by agent role; conventional commit type badges; issue links clickable; auto-updates on new commits; agent filter scopes commit list; group-by-agent view toggle; diff stats (files changed, +/- lines) shown per commit | M |
| 10 | **Real-Time Event Stream** | Scrollable live feed of ALL events (tool calls, agent spawns, file edits, git commits, test runs, errors). Filterable by agent, event type, severity. Like a structured terminal output. Respects global agent filter. | Events appear in <500ms; filterable by 5+ dimensions; color-coded by type; search within events; pause/resume scroll; export as JSON; global agent filter applies | M |
| 11 | **Secrets Health Panel** | Scans project for secret management: detects `.env` files, checks for leaked secrets in code (via gitleaks patterns), shows which services have configured credentials, warns about missing/expired secrets. Does NOT display secret values. | Shows secret health score (0-100); lists all detected secret references; warns on hardcoded secrets; shows `.env` vs env var vs vault status; never displays actual values | M |
| 12 | **AI Tool Adapters** | Pre-built adapters for: (a) Claude Code (hooks → HTTP), (b) Generic CLI wrapper (captures stdout/stderr from any command), (c) File-based (watches output files from any tool). Each adapter translates to the universal event schema. | Claude Code adapter configures hooks automatically; CLI wrapper works with `npx mission-control wrap "aider ..."` ; file adapter watches configurable paths; all produce valid events | L |
| 13 | **Auto-Download & Auto-Start at Team Activation** | When any team is activated with `--team X --strategy Y`, Mission Control is automatically downloaded (from the amenthyx-ai-teams repo's `shared/mission-control/`), installed (`npm install`), configured for the project, and started — all without ANY user action. The dashboard is fully running at `http://localhost:4200` BEFORE Wave 1 begins. This is a hard requirement embedded in the activation protocol. The user should see "Mission Control running at http://localhost:4200" in their terminal before any agent starts working. | Dashboard auto-scaffolds on every `--team` activation; `npm install` runs automatically; dashboard starts in background; health check confirms it's running; if already running from a previous session, it reconnects; no manual setup ever required | L |

### P1 — Should-Have (Important but not blocking)

| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|---------------------|------------|
| 1 | **CI/CD Pipeline Monitor** | Shows GitHub Actions workflow status, local `act` validation results, and pipeline stage visualization. Parses `.team/evidence/ci/` logs and `.github/workflows/`. Respects agent filter (e.g., filter by DEVOPS to see only infra-related pipeline jobs). | Pipeline stages visualized; act results shown; pass/fail per job; click to see logs; agent filter scopes view | M |
| 2 | **Resource Allocation View** | Shows which agents are assigned to which tasks, workload distribution, and wave capacity. Parses `.team/assignments/` and `.team/MASTER_TASKS.md`. Interactive — click an agent to auto-filter. | Agent-task matrix visible; overloaded agents highlighted; task dependency graph; click-to-filter | M |
| 3 | **Service Integration Status** | Shows connectivity status for all external services declared in the strategy (APIs, databases, cloud services). Performs health checks on configured endpoints. Shows which agent is responsible for each integration. | Green/red status per service; last check time; response latency; configurable check interval; agent attribution | S |
| 4 | **Evidence Audit Trail** | Browse all evidence artifacts organized by agent and wave. Verify evidence completeness against manifests. Show evidence coverage score per agent. Respects agent filter. | Tree view of `.team/evidence/`; manifest checklist with check marks; coverage % per agent; agent filter scopes view | M |

### P2 — Nice-to-Have (If time permits)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Multi-Session Support** | Monitor multiple AI team sessions running simultaneously in different project directories |
| 2 | **Historical Session Replay** | Load and replay past sessions from saved `.team/` directories |
| 3 | **Custom Widget Builder** | Let users add custom metric cards with JSONPath expressions against event data |
| 4 | **Notification System** | Desktop notifications for critical events (budget exceeded, tests failing, agent blocked) |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode) — both frontend and backend
- **Frontend Framework**: React 18+ with Vite as build tool
- **UI Library**: Tailwind CSS 3+ for styling, Recharts for data visualization, Lucide React for icons
- **Backend Framework**: Express.js with `ws` for WebSocket
- **Database**: SQLite (via `better-sqlite3`) — local only, zero config, portable
- **File Watching**: `chokidar` for cross-platform filesystem watching
- **Process Management**: Single `npm run dashboard` command starts both backend and frontend

**Hosting/Infrastructure**:
- **Runs locally only** — no cloud, no external hosting
- **Port**: Backend: `4201`, Frontend: `4200` (Vite dev server proxies API to backend)
- **No Docker required** — must work with just `node` installed

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Claude Code Hooks | Real-time event ingestion from Claude Code sessions | HTTP POST to localhost (no auth needed — local only) | None (local) |
| OpenTelemetry (optional) | Metrics/logs from Claude Code OTEL export | OTLP gRPC/HTTP to local collector | None (local) |
| GitHub CLI (`gh`) | Read GitHub Project board status, PR/issue data | User's existing `gh` auth | GitHub API limits |
| Git CLI | Commit history, branch status, diff analysis | Local git — no auth | None |
| `gitleaks` | Secret scanning for secrets health panel | CLI binary — no auth | None |
| Any AI tool CLI | Generic adapter wraps any command | None — captures stdout/stderr | None |

**Existing Codebase**: Greenfield — new directory at `shared/mission-control/` inside `amenthyx-ai-teams`

**Package Manager**: npm (standard across Amenthyx projects)

**Monorepo or Polyrepo**: Single package with backend and frontend in subdirectories:
```
shared/mission-control/
├── package.json          # Root — scripts for both
├── tsconfig.json
├── src/
│   ├── server/           # Express + WebSocket backend
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── services/
│   │   ├── adapters/     # AI tool adapters
│   │   ├── watchers/     # File + git watchers
│   │   └── db/           # SQLite schema + queries
│   └── client/           # React frontend
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── panels/   # Each dashboard panel
│       │   ├── charts/   # Recharts wrappers
│       │   ├── layout/   # Shell, sidebar, header
│       │   └── common/   # Shared UI components
│       ├── hooks/        # Custom React hooks (useWebSocket, useEvents, etc.)
│       ├── stores/       # Zustand stores for state management
│       ├── types/        # TypeScript interfaces
│       └── utils/
├── adapters/             # Standalone adapter configs
│   ├── claude-code.json  # Claude Code hooks config (auto-injected)
│   ├── generic-cli.sh    # CLI wrapper script
│   └── file-watcher.json # File-based adapter config
├── scaffold/             # Auto-scaffold templates
│   ├── scaffold.sh       # Main scaffold script
│   └── templates/        # Config templates
└── tests/
    ├── server/
    └── client/
```

---

## 5. Non-Functional Requirements

**Performance**:
- Event ingestion to frontend render: < 200ms (P95)
- Dashboard initial load: < 2s
- Support 1000+ events per session without performance degradation
- SQLite queries: < 50ms (P95)
- File watcher debounce: 500ms (no excessive re-renders)

**Security**:
- **CRITICAL**: Dashboard NEVER displays secret values. Only shows secret health metadata (exists/missing/expired/hardcoded).
- Secrets panel uses pattern matching (regex for API keys, tokens, passwords) — never reads or stores actual values.
- SQLite database stored in `.team/mission-control.db` — gitignored.
- No external network calls except user-configured service health checks.
- All data stays local. No telemetry, no analytics, no phone-home.

**Scalability**:
- Single session: handles up to 50 concurrent agents (dynamic scaling scenario)
- Event storage: SQLite with auto-vacuum, 30-day retention for historical data
- Frontend: virtualized lists for event stream (react-window)

**Availability**:
- Local tool — availability = machine uptime
- Graceful degradation: if backend is unreachable, frontend shows last known state with "disconnected" banner
- Auto-reconnect WebSocket with exponential backoff

**Accessibility**:
- WCAG 2.1 AA minimum
- Keyboard navigable
- Screen reader friendly status announcements for critical events
- High contrast mode toggle (dark/light theme)

**Observability**:
- Backend logs to `stdout` in structured JSON format
- Log levels: DEBUG, INFO, WARN, ERROR
- Health endpoint at `/api/health` returns server status + connected clients

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% line coverage (backend and frontend)

**Required Test Types**:
- [x] Unit tests (mandatory) — Jest for both backend and frontend
- [x] Integration tests (mandatory) — Supertest for API routes, Testing Library for React components
- [x] E2E tests (mandatory for P0 features) — Playwright for full dashboard flows
- [x] Performance/load tests — k6 for event ingestion throughput
- [x] Security scanning (SAST + dependency audit) — npm audit + gitleaks
- [ ] Visual regression tests (P2)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (lint, format, type-check)
- [x] Branch protection (require PR reviews, passing CI)

**Testing Tools**: Jest, React Testing Library, Playwright, Supertest, k6

---

## 7. Timeline & Milestones

**Hard Deadline**: Flexible — quality over speed

**Milestones**:

| # | Milestone | Deliverables | Success Criteria |
|---|-----------|--------------|-----------------|
| M1 | Core Infrastructure | Event API, WebSocket server, SQLite storage, file watcher, universal event schema | POST events → stored → pushed via WS to test client |
| M2 | React Dashboard Shell | Layout, sidebar, header, routing, theme toggle, WebSocket hook, Zustand stores | Dashboard loads at localhost:4200, connects to backend |
| M3 | P0 Panels (Part 1) | Agent Activity, Planning & Milestones, Cost Monitor, Real-Time Event Stream | All 4 panels render with live data from event API |
| M4 | P0 Panels (Part 2) | Test Results, Git Activity, Secrets Health, AI Tool Adapters | All remaining P0 panels operational; Claude Code adapter working |
| M5 | Auto-Scaffold + Integration | Scaffold script, activation protocol integration, `npx mission-control init`, docs | Running `--team X --strategy Y` auto-generates dashboard in project |
| M6 | QA + Polish | Full test suite, Playwright E2E, performance tuning, accessibility audit | All tests pass; 80%+ coverage; WCAG AA compliant |

**Budget Constraints**:
- Infrastructure: $0 — runs locally only
- Third-party APIs: $0 — no external APIs
- Everything is open source / free tier

---

## 7.1 Cost Approval & Payment Governance

**Token Budget Tolerance**: < $30 total for full build (all waves)

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — no external payments expected
- **Requires explicit approval**: Any payment whatsoever (this project should cost $0 in external services)
- **Forbidden without user present**: Any recurring subscription, any cloud deployment, any paid API

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| None | $0 | N/A | N/A |

All dependencies are open-source npm packages. No paid services required.

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [x] All P0 features implemented and tested
- [x] Unit test coverage >= 80%
- [x] Zero CRITICAL/HIGH security vulnerabilities
- [x] E2E tests pass for all P0 user flows
- [x] Performance targets met (event ingestion < 200ms P95)
- [x] Documentation complete (README, setup guide, adapter guide)
- [x] `npx mission-control init` scaffolds dashboard in any project
- [x] Auto-scaffold integration in ACTIVATION_PROTOCOL.md works
- [x] Claude Code adapter confirmed working with real session
- [x] Generic CLI adapter confirmed working with at least 1 non-Claude-Code tool
- [x] Secrets panel confirmed to NEVER leak secret values

**KPIs**:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Event ingestion latency (P95) | < 200ms | k6 load test results |
| Dashboard load time | < 2s | Lighthouse CI |
| Test coverage (BE + FE) | >= 80% | Jest --coverage |
| Secret leak rate | 0% | Manual audit + automated test |
| Adapter compatibility | 3+ tools | Integration tests with mock events |

**Definition of Done**: Dashboard auto-scaffolds on team activation, renders all P0 panels with live data from at least 2 AI coding tools (Claude Code + 1 other), all tests pass, zero security issues.

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:

| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| Grafana | Panel-based layout, real-time data, dark theme | Complexity of setup, external DB dependency |
| GitHub Actions UI | Pipeline visualization, log streaming | Requires cloud — must work locally |
| Vercel Dashboard | Clean design, status indicators, deployment timeline | SaaS dependency |
| n8n Canvas | Node-based workflow visualization | Over-engineering for monitoring use case |
| PM2 Monit | Process monitoring, CPU/memory, log tailing | CLI-only — needs web UI |

**Design Inspiration**: Dark theme by default (engineer preference). Minimal chrome. Data-dense panels. Status colors: green (healthy), yellow (warning), red (error), blue (active), gray (idle).

**Technical References**:
- Claude Code Hooks documentation (HTTP hooks for event ingestion)
- Claude Code OpenTelemetry export (metrics and logs)
- Chokidar file watcher API
- Recharts composable chart library
- Zustand state management (minimal boilerplate)

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. Cloud-hosted or SaaS version of the dashboard — this is LOCAL ONLY
2. User authentication or multi-user access control — single local user
3. Direct AI model API calls from the dashboard — it only MONITORS, never drives execution
4. Modification of AI agent behavior from the dashboard — read-only observation
5. Mobile responsive version — desktop browser only

**Deferred to future versions**:
1. Multi-session support (monitoring multiple team runs simultaneously)
2. Historical session replay
3. Custom widget builder
4. Desktop notifications
5. Plugin system for community-built adapters

---

## 11. Risk & Constraints

**Known Risks**:

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| AI tool API changes break adapters | M | M | Adapter pattern isolates changes; version-pinned schemas |
| SQLite performance under high event volume | L | M | WAL mode, auto-vacuum, event batching, 30-day retention |
| Secret scanning false positives | M | L | Configurable exclusion patterns; manual override |
| File watcher OS compatibility issues | L | H | Chokidar handles cross-platform; test on Windows/Mac/Linux |
| WebSocket disconnects during long sessions | M | M | Auto-reconnect with exponential backoff; last-known-state cache |

**Hard Constraints** (non-negotiable):
- Must run locally with `npm run dashboard` — no Docker, no cloud
- Must work on Windows, macOS, and Linux
- Must NEVER display, log, or store actual secret values
- Must work with Node.js 18+ (LTS)
- Must be embeddable in any project via scaffold script

**Soft Constraints** (preferred but negotiable):
- Prefer single `package.json` over monorepo workspaces
- Prefer SQLite over file-based storage
- Prefer Zustand over Redux for state management
- Prefer Tailwind over CSS modules

---

## 11.1 Dynamic Agent Scaling

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 15

**Scaling triggers**:
- Frontend has more than 8 complex panel components → spawn additional FE
- Backend event ingestion and adapters are complex enough to warrant split → spawn additional BE
- Testing scope exceeds single QA capacity → spawn additional QA

**Agent types the PM may add**:
- [x] Additional Frontend Engineers (UI-heavy project)
- [x] Additional Backend Engineers (adapter complexity)
- [x] Additional QA Engineers (cross-platform testing)
- [ ] Specialist agents (if needed — PM must name the specialty)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision
- Extra agents inherit the same execution protocol
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Screenshots of running dashboard with all panels populated
- [x] Test result reports (Jest coverage, Playwright results)
- [x] Build logs showing zero errors and zero warnings
- [x] CI/CD pipeline passing locally (act)
- [x] Security scan reports (zero CRITICAL/HIGH)
- [x] Performance benchmark results (event ingestion load test)
- [x] Demonstration of Claude Code adapter working with real hooks
- [x] Demonstration of generic CLI adapter working with a non-Claude tool
- [x] Demonstration of secrets panel NOT leaking values
- [x] Scaffold script successfully setting up dashboard in a fresh project

**Reporting Frequency**: Every 6 hours (default)

**Final Deliverable**: Both PPTX and PDF

---

## 12.1 Data Preservation & Uncertainty Policy

**Data Preservation (No-Delete Rule)**:
- **Archive method for files**: Move to `.team/archive/{date}_{filename}` (default)
- **Archive method for table rows**: Add `status: archived` column (default)
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker (default)
- **Git history protection**: Never rebase/squash published commits (default, non-negotiable)

**Uncertainty Escalation**:
- **Escalation threshold**: < 90% confidence → escalate
- **Escalation response time expectation**: I'll respond within minutes
- **What counts as "unsure"**: Any action that might delete data, cost money, affect external services, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Short question with 2-3 options

---

## 13. GitHub Auto-Sync Policy

**Auto-sync frequency**: Every agent completion (default)

**Auto-push enabled?**: Yes (default)

**Branch strategy**:
- Working branch: `ai-team` (MANDATORY)
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

### Universal Event Schema (CRITICAL — This is the contract between all adapters and the dashboard)

Every event from any AI tool MUST be normalized to this schema before ingestion:

```typescript
interface MissionControlEvent {
  // Identity
  id: string;                          // UUID v4
  timestamp: string;                   // ISO 8601
  sessionId: string;                   // Groups events from one team run

  // Source
  source: {
    tool: string;                      // "claude-code" | "cursor" | "aider" | "copilot" | "custom"
    adapter: string;                   // "hooks" | "cli-wrapper" | "file-watcher" | "otel" | "manual"
    version?: string;                  // Tool version if known
  };

  // Event Classification
  category: EventCategory;            // See enum below
  type: string;                       // Specific event type within category
  severity: "info" | "warn" | "error" | "critical";

  // Agent Context (if applicable)
  agent?: {
    role: string;                      // "TL" | "PM" | "BE" | "FE" | "MOB" | "DEVOPS" | "INFRA" | "QA" | "RM" | "MKT" | "LEGAL" | custom
    name: string;                      // Display name
    wave?: number;                     // Which wave this agent belongs to
  };

  // Payload (event-specific data)
  payload: Record<string, unknown>;

  // Optional metadata
  meta?: {
    duration_ms?: number;
    tokens_input?: number;
    tokens_output?: number;
    cost_usd?: number;
    file_path?: string;
    commit_hash?: string;
    issue_number?: number;
    error?: string;
  };
}

enum EventCategory {
  AGENT = "agent",                     // Agent lifecycle (spawn, complete, error)
  TOOL = "tool",                       // Tool usage (bash, edit, read, write, etc.)
  PLANNING = "planning",              // Planning artifacts (charter, milestones, kanban)
  CODE = "code",                       // Code changes (file edit, create, delete)
  TEST = "test",                       // Test execution and results
  BUILD = "build",                     // Build events (compile, bundle, errors)
  GIT = "git",                         // Git operations (commit, push, branch)
  COST = "cost",                       // Cost events (token usage, budget updates)
  CI = "ci",                           // CI/CD events (pipeline run, job status)
  SECRET = "secret",                   // Secret health events (scan results)
  SYSTEM = "system",                   // System events (session start/end, errors)
  EVIDENCE = "evidence",              // Evidence collection events
  GATE = "gate",                       // Quality gate events (pass/fail)
  CUSTOM = "custom"                    // User-defined events
}
```

### Adapter Specifications

**Claude Code Adapter** (auto-configured via hooks):
The adapter generates a `.claude/settings.local.json` file that configures HTTP hooks pointing to the Mission Control backend at `http://localhost:4201/api/events/claude-code`. Events mapped:
- `PreToolUse` → category: TOOL
- `PostToolUse` → category: TOOL (with duration, success/failure)
- `SubagentStart` → category: AGENT (type: "spawn")
- `SubagentStop` → category: AGENT (type: "complete")
- `UserPromptSubmit` → category: SYSTEM (type: "prompt")
- `Stop` / `SessionEnd` → category: SYSTEM (type: "session_end")
- Token/cost metrics from OTEL → category: COST

**Generic CLI Adapter** (wraps any command):
```bash
# Usage: wraps any AI tool command and captures output
npx mission-control wrap "aider --model gpt-4 ..."
npx mission-control wrap "cursor-cli ..."
npx mission-control wrap "any-command ..."
```
The wrapper:
1. Starts the child process
2. Captures stdout/stderr line by line
3. Applies configurable regex patterns to classify lines into event categories
4. POSTs structured events to `http://localhost:4201/api/events/cli`
5. Passes through all I/O to the user transparently

**File Watcher Adapter** (watches output directories):
Configurable via `mission-control.config.json`:
```json
{
  "fileAdapter": {
    "watchPaths": [
      { "path": ".team/", "recursive": true },
      { "path": ".github/workflows/", "recursive": true },
      { "path": "coverage/", "recursive": true }
    ],
    "parsers": {
      "*.md": "markdown-table",
      "*.xml": "junit-xml",
      "*.json": "json",
      "*.log": "text-lines"
    }
  }
}
```

### Auto-Scaffold Integration (CRITICAL — This makes it standard for every project)

**HARD REQUIREMENT**: The dashboard MUST be fully running at `http://localhost:4200` BEFORE any agent starts working. The user never manually installs or starts the dashboard — it is a zero-touch automatic process embedded in the activation protocol.

When any team is activated with `--team X --strategy Y`, the activation protocol MUST execute this step IMMEDIATELY after Wave 0 cost approval, BEFORE Wave 1 begins:

```
WAVE 0.5: MISSION CONTROL AUTO-DEPLOY (Automatic — Zero User Action — BLOCKING)
│
├── STEP 1: SOURCE RESOLUTION
│   ├── Check if mission-control exists at $HOME/.amenthyx-ai-teams/shared/mission-control/
│   ├── If not: the repo was already cloned in Wave 0 Step 1 (activation protocol)
│   └── Verify: package.json exists in shared/mission-control/
│
├── STEP 2: COPY TO PROJECT
│   ├── Copy entire shared/mission-control/ to project directory as .mission-control/
│   ├── Add .mission-control/ to project's .gitignore (dashboard is local-only, never committed)
│   └── Add .mission-control/node_modules/ to .gitignore
│
├── STEP 3: INSTALL DEPENDENCIES
│   ├── cd .mission-control
│   ├── npm install --production=false (need dev deps for Vite)
│   ├── Capture install log to .team/evidence/dashboard_install.log
│   └── If install fails: WARN user but continue (dashboard is enhancement, not blocker)
│
├── STEP 4: GENERATE PROJECT CONFIG
│   ├── Create .mission-control/mission-control.config.json:
│   │   {
│   │     "sessionId": "<generated UUID v4>",
│   │     "projectName": "<from strategy Section 1>",
│   │     "teamName": "<from --team argument>",
│   │     "strategyPath": "<from --strategy argument>",
│   │     "projectDir": "<current working directory>",
│   │     "teamDir": "<projectDir>/.team/",
│   │     "agents": [
│   │       { "role": "TL", "name": "Team Leader", "color": "#F59E0B", "category": "management" },
│   │       { "role": "PM", "name": "Project Manager", "color": "#64748B", "category": "management" },
│   │       { "role": "BE", "name": "Backend Engineer", "color": "#3B82F6", "category": "engineering" },
│   │       { "role": "FE", "name": "Frontend Engineer", "color": "#22C55E", "category": "engineering" },
│   │       { "role": "MOB", "name": "Mobile Engineer", "color": "#06B6D4", "category": "engineering" },
│   │       { "role": "DEVOPS", "name": "DevOps Engineer", "color": "#F97316", "category": "engineering" },
│   │       { "role": "INFRA", "name": "Infrastructure Engineer", "color": "#F59E0B", "category": "engineering" },
│   │       { "role": "QA", "name": "QA Engineer", "color": "#A855F7", "category": "quality" },
│   │       { "role": "RM", "name": "Release Manager", "color": "#14B8A6", "category": "management" },
│   │       { "role": "MKT", "name": "Marketing Strategist", "color": "#EC4899", "category": "support" },
│   │       { "role": "LEGAL", "name": "Legal/Compliance", "color": "#6B7280", "category": "support" }
│   │     ],
│   │     "budget": {
│   │       "total": "<from COST_ESTIMATION.md>",
│   │       "currency": "USD",
│   │       "alertThreshold": 0.8,
│   │       "hardCap": "<from strategy Section 7.1>"
│   │     },
│   │     "ports": { "backend": 4201, "frontend": 4200 },
│   │     "source": {
│   │       "tool": "<detected: claude-code | cursor | aider | unknown>",
│   │       "adapter": "<auto-selected based on tool>"
│   │     },
│   │     "fileWatcher": {
│   │       "watchPaths": [".team/", ".github/workflows/", "coverage/"],
│   │       "debounceMs": 500
│   │     }
│   │   }
│   └── Config is gitignored (contains session-specific data)
│
├── STEP 5: CONFIGURE AI TOOL ADAPTER
│   ├── IF Claude Code detected (check for .claude/ directory or CLAUDE.md):
│   │   ├── Create/merge .claude/settings.local.json with hooks config:
│   │   │   {
│   │   │     "hooks": {
│   │   │       "PreToolUse": [{ "type": "command", "command": "curl -s -X POST http://localhost:4201/api/events/claude-code -H 'Content-Type: application/json' -d '{\"event\":\"PreToolUse\",\"data\":$CLAUDE_HOOK_EVENT}'" }],
│   │   │       "PostToolUse": [{ "type": "command", "command": "curl -s -X POST http://localhost:4201/api/events/claude-code -H 'Content-Type: application/json' -d '{\"event\":\"PostToolUse\",\"data\":$CLAUDE_HOOK_EVENT}'" }],
│   │   │       "SubagentStart": [{ "type": "command", "command": "curl -s -X POST http://localhost:4201/api/events/claude-code -H 'Content-Type: application/json' -d '{\"event\":\"SubagentStart\",\"data\":$CLAUDE_HOOK_EVENT}'" }],
│   │   │       "SubagentStop": [{ "type": "command", "command": "curl -s -X POST http://localhost:4201/api/events/claude-code -H 'Content-Type: application/json' -d '{\"event\":\"SubagentStop\",\"data\":$CLAUDE_HOOK_EVENT}'" }]
│   │   │     }
│   │   │   }
│   │   └── Also set OTEL env vars if available
│   ├── IF other tool: log instructions for CLI wrapper usage
│   └── IF unknown: enable file-watcher-only mode (still works via .team/ monitoring)
│
├── STEP 6: START DASHBOARD (BACKGROUND)
│   ├── cd .mission-control
│   ├── npm run dashboard &    (starts both Express backend + Vite frontend)
│   ├── Save PID to .mission-control/.dashboard.pid (for clean shutdown)
│   └── Detach from terminal (dashboard survives if main session is interrupted)
│
├── STEP 7: HEALTH CHECK (BLOCKING — max 30s timeout)
│   ├── Poll GET http://localhost:4201/api/health every 2s
│   ├── Wait for response: { "status": "ok", "version": "...", "sessionId": "..." }
│   ├── If healthy: print "✓ Mission Control running at http://localhost:4200"
│   ├── If timeout after 30s: print "⚠ Mission Control failed to start — check .mission-control/logs/"
│   └── Continue to Wave 1 regardless (dashboard failure is non-blocking for team execution)
│
└── STEP 8: INITIAL STATE INJECTION
    ├── POST team roster to /api/agents (populates agent activity panel)
    ├── POST budget info to /api/budget (populates cost monitor)
    ├── POST wave definitions to /api/waves (populates planning timeline)
    └── Dashboard is now fully operational and awaiting live events
```

**Lifecycle Management**:
- **On `pause team`**: Dashboard keeps running (user may want to review state)
- **On `resume team`**: Dashboard reconnects to existing session (if still running) or restarts
- **On session end**: Dashboard remains running for post-session review; user can stop with `npx mission-control stop`
- **On port conflict**: If 4200/4201 already in use, auto-increment to 4202/4203 and notify user
- **Cross-session**: If a previous dashboard is still running from an earlier session, it is stopped first and restarted with the new session config

The scaffold script (`shared/mission-control/scaffold/scaffold.sh`) handles all of the above.
Add `.mission-control/` to the project's `.gitignore` (the dashboard is a local tool, not committed to the project repo).

### Secrets Management Architecture

The secrets panel follows a **scan-only, never-store** architecture:

1. **Scanner**: Runs `gitleaks detect --no-git --source .` on project directory
2. **Pattern Matcher**: Checks for common secret patterns in code (AWS keys, API tokens, etc.)
3. **Env Audit**: Lists `.env` files and their keys (NOT values) — shows which vars are set
4. **Health Score**: Calculates 0-100 score based on:
   - 100: No hardcoded secrets, all secrets in env vars or vault
   - -20: Each hardcoded secret found in source code
   - -10: Each secret in a non-gitignored file
   - -5: Each missing recommended env var
5. **Display**: Shows key names, file locations, risk level — NEVER values
6. **Recommendations**: Suggests moving hardcoded secrets to `.env` or env vars

### Dashboard Layout (High-Level)

```
+==============================================================================+
|  AMENTHYX MISSION CONTROL                          [Dark/Light] [Connected]   |
|------------------------------------------------------------------------------|
|  GLOBAL AGENT FILTER:                                                        |
|  [All] [TL] [PM] [BE●] [FE●] [MOB] [DEVOPS●] [INFRA] [QA] [RM] [MKT] [LEG]|
|  (multi-select — active filters highlighted, all panels update instantly)    |
+========+=====================================================================+
|        |                                                                      |
| SIDE   |  OVERVIEW TAB (default view)                                        |
| NAV    |  +-- Agent Activity Grid --------+-- Cost Monitor ---------------+  |
|        |  |  [TL ✓] [PM ●] [BE ●] [FE ●] |  Budget: $20 / $30           |  |
| Agents |  |  [MOB ●][DEV ●][INF ○] [QA ○] |  Burn: $2.1/hr  [Sparkline] |  |
| Plan   |  |  [RM ○] [MKT ●] [LEG ●]       |  Per-agent: BE $4, FE $3...  |  |
| Kanban |  |  Click any card → filter all   |  Alert: ■ 67% budget used    |  |
| Costs  |  +--------------------------------+-----------------------------+  |
| Tests  |                                                                      |
| Git    |  +-- Planning Timeline -----------------------------------------+   |
| CI/CD  |  |  W0[✓done] → W1[●active] → W2[○pending] → W3 → W4 → W5    |   |
| Secret |  |  Gate: Cost ✓  PM ✓  Engineering ●  QA ○  Release ○         |   |
| Events |  |  Deliverables (filtered by agent): BE tasks 3/5 done         |   |
| Integ  |  +-------------------------------------------------------------+   |
|        |                                                                      |
|        |  KANBAN TAB                                                         |
|        |  +-- Issues & Kanban Board (filtered by selected agents) -------+   |
|        |  | Backlog | Ready  | In Prog | Review | Testing | Done |Blocked|   |
|        |  |---------|--------|---------|--------|---------|------|-------|   |
|        |  |         | #12 BE | #8  FE  | #3 BE  |         | #1 PM|       |   |
|        |  |         | #14 BE | #9  FE  | #5 DEV |         | #2 PM|       |   |
|        |  |         |        | #11 MOB |        |         |      |       |   |
|        |  |  Each card: [Agent Badge] Title [Labels] [Evidence ✓/✗]      |   |
|        |  |  Click card → modal with full issue details + linked commits |   |
|        |  +-------------------------------------------------------------+   |
|        |                                                                      |
|        |  GIT TAB                                                            |
|        |  +-- Commits (grouped by agent area, filtered) -----------------+   |
|        |  |  ▼ Backend (BE) — 12 commits                                 |   |
|        |  |    abc1234  feat(api): add user CRUD [#12]  +85 -3  2min ago |   |
|        |  |    def5678  test(api): user endpoint tests  +120 -0 5min ago |   |
|        |  |  ▼ Frontend (FE) — 8 commits                                 |   |
|        |  |    ghi9012  feat(ui): dashboard layout [#8] +200 -10 3min ago|   |
|        |  |  ▼ DevOps (DEVOPS) — 3 commits                               |   |
|        |  |    jkl3456  ci: add GitHub Actions [#15]    +45 -0  10min ago|   |
|        |  |  Toggle: [Grouped by Agent] / [Chronological]                |   |
|        |  +-------------------------------------------------------------+   |
|        |                                                                      |
|        |  +-- Test Dashboard --------+-- Live Event Stream --------------+   |
|        |  | Static: 100% ✓           | 10:30:01 [BE] bash: npm test     |   |
|        |  | Unit BE: 85% ✓           | 10:30:03 [FE] edit: App.tsx      |   |
|        |  | Unit FE: 82% ✓           | 10:30:05 [BE] commit: feat(api)  |   |
|        |  | Integration: 90% ✓       | 10:30:08 [QA] test: e2e suite    |   |
|        |  | E2E: pending...          | 10:30:10 [PM] kanban: card moved |   |
|        |  | (filtered by agent)      | (filtered by global agent bar)   |   |
|        |  +---------------------------+----------------------------------+   |
+========+=====================================================================+

LEGEND:  ● = active/working    ✓ = done    ○ = idle/pending    ■ = warning
COLORS:  TL=gold  PM=slate  BE=blue  FE=green  MOB=cyan  DEVOPS=orange
         INFRA=amber  QA=purple  RM=teal  MKT=pink  LEGAL=gray
```

### Agent Filter Behavior (CRITICAL UX SPEC)

The global agent filter bar is the single most important UX element. Rules:

1. **Persistent**: Always visible at the top of every page/tab. Never hidden, never scrolled away.
2. **Multi-select**: User can select any combination of agents (e.g., BE + FE + QA to see all engineering).
3. **"All" resets**: Clicking "All" clears all filters and shows everything.
4. **Click agent card = filter**: Clicking an agent's card in the Activity Panel auto-sets that agent in the filter bar.
5. **Instant propagation**: Changing the filter updates ALL visible panels within 100ms — no page reload.
6. **URL-synced**: Filter state is reflected in the URL query string (e.g., `?agents=BE,FE`) so it survives page refresh and is shareable.
7. **Badge counts**: Each agent chip in the filter bar shows a small badge with the number of active items (events, issues, commits) for that agent.
8. **Color-coded**: Each agent chip uses the agent's role color (consistent across all panels).
9. **Dynamic agents**: When the PM dynamically spawns a new agent (e.g., "BE-2" or "Perf Specialist"), a new chip auto-appears in the filter bar.
10. **Category groups**: Filter bar supports quick-select groups: "Engineering" (BE+FE+MOB+DEVOPS+INFRA), "Management" (TL+PM+RM), "Support" (MKT+LEGAL+QA).

### Issues, Kanban, and Commits — Per-Agent Correlation

Every issue, kanban card, and commit carries an `agent` field. This enables:

1. **Issue → Agent**: Each GitHub issue is assigned to an agent via labels (e.g., `agent:BE`, `agent:FE`). The dashboard reads these from `.team/GITHUB_ISSUES.md` and the GitHub API.
2. **Kanban Card → Agent**: Each card on the board shows the assigned agent's badge. Moving cards between columns is tracked with agent attribution.
3. **Commit → Agent**: Every commit message includes `Agent: {ROLE}` in the body (per atomic commit protocol). The dashboard parses this to attribute commits.
4. **Cross-linking**: Clicking an issue shows all commits referencing that issue number. Clicking a commit shows the issue it references. Clicking an agent shows all their issues + commits.
5. **Agent Area View**: A dedicated "Agent Area" sub-view groups all work by agent — their issues, their commits, their test results, their evidence — in one scrollable column. This is the "what has this agent done?" view.

---

*Strategy Brief v3.1 — Amenthyx AI Teams*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
