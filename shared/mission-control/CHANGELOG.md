# Changelog

## [1.0.0] - 2026-03-02

### Added

#### Core Infrastructure
- Universal event ingestion API (REST + WebSocket) accepting structured events from any AI coding tool
- SQLite database (WAL mode) for local event persistence with auto-migration
- Express.js server on port 4201 with WebSocket upgrade path
- Chokidar file watcher monitoring `.team/` directory tree in real-time
- Git watcher polling `ai-team` branch for new conventional commits
- Markdown parsers for KANBAN.md, COMMIT_LOG.md, MILESTONES.md, COST_ESTIMATION.md

#### React Dashboard (13 P0 Panels)
- **Global Agent Filter Bar** — persistent multi-select filter across all panels (TL, PM, BE, FE, MOB, DEVOPS, INFRA, QA, RM, MKT, LEGAL) with category quick-select and URL sync
- **Agent Activity Panel** — real-time grid of all agents with status, tasks, tokens, costs; click-to-filter
- **Planning & Milestones Tracker** — horizontal wave timeline (W0-W5) with gate checkpoints
- **Cost Monitor** — budget progress bar, burn rate sparkline, per-agent cost breakdown
- **Test Results Dashboard** — 8 test layers with pass/fail counts, coverage, trend sparklines
- **Issues & Kanban Board** — 7-column board (Backlog → Done + Blocked) with agent-attributed cards
- **Git Commits Panel** — grouped by agent area or chronological, with conventional commit badges
- **Real-Time Event Stream** — virtualized live feed with severity/category/agent filters
- **Secrets Health Panel** — health score gauge, secret inventory (never displays values), recommendations
- Dark/light theme toggle with localStorage persistence
- Responsive layout with collapsible sidebar

#### AI Tool Adapters
- **Claude Code adapter** — translates hook events (PostToolUse, SubagentStart/Stop) to universal schema
- **Generic CLI wrapper** — wraps any AI tool command, captures stdout/stderr, classifies events
- **File watcher adapter** — configurable paths with file type parsers

#### Auto-Scaffold System
- `scaffold.sh` — zero-touch deployment script for any project
- Config generator — parses TEAM.md and COST_ESTIMATION.md for project-specific config
- Port management with auto-increment on conflict
- Process lifecycle management (PID file, health check, start/stop/status)
- CLI commands: `mission-control init|start|stop|status|health`

#### State Management
- 9 Zustand stores: filter, agent, event, budget, wave, kanban, commit, test, theme
- WebSocket hook with auto-reconnect (exponential backoff 1s → 30s max)
- Global filter state persisted in URL query string

### Technical
- TypeScript 5.x strict mode (server + client)
- React 18 + Vite 5 + Tailwind CSS 3
- Express.js + ws + better-sqlite3 + chokidar
- Cross-platform: Windows, macOS, Linux
- Node.js 18+ required
