# Amenthyx Mission Control

Real-time monitoring dashboard for AI agentic team execution. Works with Claude Code, Cursor, Aider, Windsurf, or any AI coding tool.

## What it does

When you activate an Amenthyx AI Team with `--team X --strategy Y`, Mission Control auto-deploys at `http://localhost:4200` and gives you full visibility into:

- **Agent Activity** — which agents are running, what they're doing, their costs
- **Planning & Milestones** — wave progress, quality gates, deliverables
- **Cost Tracking** — real-time token usage, budget burn rate, per-agent breakdown
- **Kanban Board** — issues moving through Backlog → In Progress → Done
- **Git Commits** — grouped by agent area (BE, FE, DEVOPS, etc.)
- **Test Results** — 8 test layers with coverage trends
- **Event Stream** — live feed of every action, filterable by agent/type
- **Secrets Health** — scan results without ever showing secret values

Everything is filterable by agent role via a persistent global filter bar.

## Quick Start

Mission Control auto-deploys during team activation. No manual setup needed.

If you want to run it manually:

```bash
cd shared/mission-control
npm install
npm run dashboard
# Open http://localhost:4200
```

## Architecture

```
Browser (localhost:4200)          Server (localhost:4201)
┌─────────────────────┐          ┌──────────────────────┐
│  React + Vite       │◄──WS───►│  Express + WebSocket  │
│  9 Zustand stores   │          │  SQLite (WAL)         │
│  13 Dashboard panels│◄──API──►│  REST API             │
│  Global Agent Filter│          │  File Watcher         │
│  Dark/Light Theme   │          │  Git Watcher          │
└─────────────────────┘          │  AI Tool Adapters     │
                                 └──────────────────────┘
                                          ▲
                                          │
                           ┌──────────────┼──────────────┐
                           │              │              │
                     Claude Code     CLI Wrapper    .team/ Files
                      (hooks)       (any tool)     (file watcher)
```

## AI Tool Adapters

### Claude Code (auto-configured)
When Claude Code is detected, hooks are configured in `.claude/settings.local.json` to POST events to the dashboard automatically.

### Generic CLI Wrapper
Wrap any AI tool command to capture its output:
```bash
npx mission-control wrap "aider --model gpt-4 ..."
npx mission-control wrap "cursor-cli ..."
```

### File Watcher (always active)
The `.team/` directory is always watched. Any changes to KANBAN.md, COMMIT_LOG.md, MILESTONES.md, etc. are parsed and displayed in real-time.

## CLI Commands

```bash
npx mission-control init    # Scaffold dashboard in current project
npx mission-control start   # Start the dashboard
npx mission-control stop    # Stop the dashboard
npx mission-control status  # Show running status
```

## Dashboard Panels

| Panel | What it shows | Agent filterable |
|-------|--------------|-----------------|
| Agent Filter Bar | Multi-select filter chips for all agent roles | N/A (it IS the filter) |
| Agent Activity | Grid of agent cards with status, task, cost | Click card to filter |
| Planning | Wave timeline W0→W5 with gate checkpoints | Deliverables per agent |
| Cost Monitor | Budget bar, burn rate chart, per-agent cost | Cost per selected agent |
| Test Results | 8 test layers, coverage, trend sparklines | Tests by agent area |
| Kanban Board | 7-column board with issue cards | Cards by assigned agent |
| Git Commits | Grouped by agent or chronological | Commits by agent |
| Event Stream | Live feed with severity/category filters | Events by agent |
| Secrets Health | Health score, inventory, recommendations | N/A |

## Tech Stack

- **Frontend**: React 18, Vite 5, TypeScript, Tailwind CSS 3, Recharts, Lucide React, Zustand
- **Backend**: Express.js, ws, better-sqlite3, chokidar
- **Database**: SQLite (local, zero-config)
- **Platforms**: Windows, macOS, Linux (Node.js 18+)

## License

MIT
