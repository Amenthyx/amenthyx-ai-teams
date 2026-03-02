# Frontend Engineer — Task Assignment

## Agent: FE (Frontend Engineer)
## Wave: 2
## Project: Amenthyx Mission Control
## Working Directory: shared/mission-control/src/client/

---

## Tasks (ordered by dependency)

### T1: Vite + React + TypeScript Project Setup (#15)
- Initialize Vite with React + TypeScript template
- Install: tailwindcss, @tailwindcss/forms, recharts, lucide-react, zustand, react-router-dom, react-window
- Configure Tailwind (dark mode: 'class')
- Configure Vite proxy: /api → localhost:4201, /ws → ws://localhost:4201
- tsconfig.json strict mode

### T2: Dashboard Layout Shell (#16)
- `src/client/components/layout/DashboardShell.tsx` — main layout wrapper
- `Sidebar.tsx` — navigation: Overview, Kanban, Git, Tests, CI/CD, Secrets, Events, Integrations
- `Header.tsx` — "AMENTHYX MISSION CONTROL" title, dark/light toggle, connection status badge
- `ThemeProvider.tsx` — dark/light theme with localStorage persistence
- React Router setup: `/` (overview), `/kanban`, `/git`, `/tests`, `/cicd`, `/secrets`, `/events`

### T3: Zustand Global Stores (#17)
- `src/client/stores/agentStore.ts` — agents state, filter state, agent categories
- `src/client/stores/eventStore.ts` — events array, filtered events, add/clear
- `src/client/stores/budgetStore.ts` — budget state, cost per agent, burn rate
- `src/client/stores/waveStore.ts` — wave status, current wave, gates
- `src/client/stores/kanbanStore.ts` — kanban cards by column
- `src/client/stores/commitStore.ts` — commits, grouped by agent
- `src/client/stores/filterStore.ts` — GLOBAL agent filter state (multi-select, URL-synced, categories)
- `src/client/stores/testStore.ts` — test results by layer

### T4: WebSocket Hook (#18)
- `src/client/hooks/useWebSocket.ts`
- Connect to ws://localhost:4201/ws
- Auto-reconnect with exponential backoff (1s, 2s, 4s, 8s, max 30s)
- Dispatch events to appropriate Zustand stores based on event.category
- Connection status: connected/connecting/disconnected
- Reconnect counter

### T5: Global Agent Filter Bar (#19) — CRITICAL UX
- `src/client/components/panels/AgentFilterBar.tsx`
- Persistent at top of every page (rendered in DashboardShell above content area)
- Multi-select agent chips: TL, PM, BE, FE, MOB, DEVOPS, INFRA, QA, RM, MKT, LEGAL
- "All" reset button
- Category quick-select buttons: "Engineering", "Management", "Support", "Quality"
- Each chip: role color, badge count (active items), selected/unselected state
- URL-synced via query string (?agents=BE,FE)
- Dynamic agent chips for PM-spawned extras
- Filter state in filterStore (Zustand) — consumed by ALL panels

### T6: Agent Activity Panel (#20)
- `src/client/components/panels/AgentActivityPanel.tsx`
- Grid of agent cards (responsive: 3-4 columns)
- Each card: role badge (colored), name, status indicator (active/idle/blocked/done), current task text, duration timer, token count, cost, last action timestamp
- Click card → sets that agent in global filter
- Dynamically spawned agents auto-appear

### T7: Planning & Milestones Tracker (#21)
- `src/client/components/panels/PlanningPanel.tsx`
- Horizontal wave timeline: W0 → W1 → W2 → W3 → W4 → W5
- Each wave: colored status (done=green, active=blue, pending=gray)
- Gate checkpoints between waves (pass=green check, fail=red X, pending=gray circle)
- Click wave → expand deliverables list
- Respects global agent filter (shows only filtered agent's deliverables)

### T8: Cost Monitor Panel (#22)
- `src/client/components/panels/CostMonitorPanel.tsx`
- Budget bar: estimated vs actual (progress bar with color thresholds)
- Burn rate sparkline (Recharts AreaChart)
- Per-agent cost breakdown (bar chart, filterable)
- Alert indicators: 80% yellow, 100% red
- Respects global agent filter

### T9: Test Results Dashboard (#23)
- `src/client/components/panels/TestResultsPanel.tsx`
- 8 test layer rows: Static, Unit BE, Unit FE, Integration, E2E, Performance, Security, Accessibility
- Each row: pass/fail/skip counts, coverage %, status badge, trend sparkline
- Expand row → see failing tests with file:line
- Respects agent filter (BE filter → show BE tests, FE filter → FE tests)

### T10: Issues & Kanban Board (#24)
- `src/client/components/panels/KanbanPanel.tsx`
- 7-column board: Backlog, Sprint Ready, In Progress, In Review, Testing, Done, Blocked
- Each card: agent role badge (colored), issue title, labels, wave badge, evidence status icon
- Cards color-coded by assigned agent role
- Click card → modal with full issue details + linked commits + evidence
- Respects global agent filter (show only selected agents' issues)
- Blocked cards highlighted with red border

### T11: Git Commits & Activity Panel (#25)
- `src/client/components/panels/GitCommitsPanel.tsx`
- Default view: grouped by agent area (expandable sections)
  - "Backend (BE) — 12 commits" [expandable]
  - "Frontend (FE) — 8 commits" [expandable]
- Toggle: "Grouped by Agent" / "Chronological"
- Each commit: hash (truncated), conventional commit badge (feat/fix/test/etc), description, issue ref link, +/- diff stats, relative time
- Color-coded by agent role
- Respects global agent filter

### T12: Real-Time Event Stream (#26)
- `src/client/components/panels/EventStreamPanel.tsx`
- Virtualized scrollable list (react-window for performance)
- Each event: timestamp, agent badge, event type icon, description, severity color
- Filter bar: by event type, severity, search text (in addition to global agent filter)
- Pause/resume auto-scroll toggle
- Export as JSON button

### T13: Secrets Health Panel (#27)
- `src/client/components/panels/SecretsPanel.tsx`
- Health score gauge (0-100, colored: green >80, yellow >50, red <=50)
- Secret inventory table: key name, file location, type (env var/hardcoded/vault), risk level
- NEVER show values — only metadata
- Warnings section: hardcoded secrets, non-gitignored .env files, missing recommended vars
- Recommendations list

## Evidence Required
- Build output → `.team/evidence/builds/fe_build.log`
- Test results → `.team/evidence/tests/unit/fe_test_results.xml`
- Screenshots of each panel → `.team/evidence/screenshots/fe_*.png`
- Lighthouse report → `.team/evidence/runtime/fe_lighthouse.json`
- Evidence manifest → `.team/evidence/manifests/FE_manifest.md`

## Atomic Commits
One commit per task (T1-T13). Format:
```
feat(ui): <description> [#issue_number]

Evidence: .team/evidence/{file}
Agent: Frontend Engineer
Wave: 2
```
