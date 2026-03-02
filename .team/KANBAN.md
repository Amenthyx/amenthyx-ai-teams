# Kanban Board — Amenthyx Mission Control

## Date: 2026-03-02
## Last Updated: 2026-03-02T12:00:00Z

---

### Board State

| # | Issue | Agent | Status | Wave | Labels |
|---|-------|-------|--------|------|--------|
| 1 | Project setup: `.team/` structure, ai-team branch, cost estimation | TL | Done | 0 | setup, wave:0 |
| 2 | Project Charter, Milestones, Kanban, Timeline, Risk Register | PM | In Progress | 1 | planning, wave:1 |
| 3 | GitHub Project board + issues + labels + milestones | PM | Sprint Ready | 1 | planning, wave:1 |
| 4 | Task assignments for all agents | PM | Sprint Ready | 1 | planning, wave:1 |
| 5 | Universal event schema (TypeScript interfaces) | BE | Backlog | 2 | backend, wave:2 |
| 6 | Express server + WebSocket setup | BE | Backlog | 2 | backend, wave:2 |
| 7 | SQLite database: schema, migrations, queries | BE | Backlog | 2 | backend, wave:2 |
| 8 | REST API routes: /api/events, /api/agents, /api/budget, /api/waves, /api/health | BE | Backlog | 2 | backend, wave:2 |
| 9 | File watcher service (chokidar — .team/ directory) | BE | Backlog | 2 | backend, wave:2 |
| 10 | Git watcher service (commit log, branch status) | BE | Backlog | 2 | backend, wave:2 |
| 11 | .team/ file parsers (markdown tables, KANBAN.md, COMMIT_LOG.md, etc.) | BE | Backlog | 2 | backend, wave:2 |
| 12 | Claude Code adapter (hooks config → event ingestion) | BE | Backlog | 2 | backend, adapter, wave:2 |
| 13 | Generic CLI wrapper adapter | BE | Backlog | 2 | backend, adapter, wave:2 |
| 14 | File watcher adapter (configurable paths + parsers) | BE | Backlog | 2 | backend, adapter, wave:2 |
| 15 | Vite + React + TypeScript project setup | FE | Backlog | 2 | frontend, wave:2 |
| 16 | Dashboard layout shell: sidebar, header, routing, theme toggle | FE | Backlog | 2 | frontend, wave:2 |
| 17 | Zustand global stores (agents, events, filters, budget, waves) | FE | Backlog | 2 | frontend, wave:2 |
| 18 | WebSocket hook (useWebSocket — auto-reconnect, event dispatch) | FE | Backlog | 2 | frontend, wave:2 |
| 19 | Global Agent Filter Bar component | FE | Backlog | 2 | frontend, P0, wave:2 |
| 20 | Agent Activity Panel | FE | Backlog | 2 | frontend, P0, wave:2 |
| 21 | Planning & Milestones Tracker panel | FE | Backlog | 2 | frontend, P0, wave:2 |
| 22 | Cost Monitor panel | FE | Backlog | 2 | frontend, P0, wave:2 |
| 23 | Test Results Dashboard panel | FE | Backlog | 2 | frontend, P0, wave:2 |
| 24 | Issues & Kanban Board panel | FE | Backlog | 2 | frontend, P0, wave:2 |
| 25 | Git Commits & Activity panel | FE | Backlog | 2 | frontend, P0, wave:2 |
| 26 | Real-Time Event Stream panel | FE | Backlog | 2 | frontend, P0, wave:2 |
| 27 | Secrets Health Panel | FE | Backlog | 2 | frontend, P0, wave:2 |
| 28 | GitHub Actions CI/CD workflow (.github/workflows/ci.yml) | DEVOPS | Backlog | 2 | devops, wave:2 |
| 29 | ESLint + Prettier + TypeScript strict configuration | DEVOPS | Backlog | 2 | devops, wave:2 |
| 30 | Pre-commit hooks (husky + lint-staged) | DEVOPS | Backlog | 2 | devops, wave:2 |
| 31 | Local `act` validation + evidence | DEVOPS | Backlog | 2 | devops, wave:2 |
| 32 | Scaffold script (scaffold.sh) | INFRA | Backlog | 2 | infra, wave:2 |
| 33 | mission-control.config.json template + generator | INFRA | Backlog | 2 | infra, wave:2 |
| 34 | Port management + process lifecycle (PID file, auto-start, health check) | INFRA | Backlog | 2 | infra, wave:2 |
| 35 | package.json scripts: `npm run dashboard`, `npm run dev`, `npm run build` | INFRA | Backlog | 2 | infra, wave:2 |
| 36 | Static analysis (ESLint + TypeScript strict) | QA | Backlog | 3 | qa, wave:3 |
| 37 | Unit tests: backend (Jest, 80%+ coverage) | QA | Backlog | 3 | qa, wave:3 |
| 38 | Unit tests: frontend (Jest + RTL, 80%+ coverage) | QA | Backlog | 3 | qa, wave:3 |
| 39 | Integration tests: API routes (Supertest) | QA | Backlog | 3 | qa, wave:3 |
| 40 | E2E tests: critical P0 flows (Playwright) | QA | Backlog | 3 | qa, wave:3 |
| 41 | Security scan: npm audit + gitleaks | QA | Backlog | 3 | qa, wave:3 |
| 42 | Accessibility audit: axe-core + Lighthouse | QA | Backlog | 3 | qa, wave:3 |
| 43 | Release checklist + changelog | RM | Backlog | 4 | release, wave:4 |
| 44 | npm package configuration + GitHub Release | RM | Backlog | 4 | release, wave:4 |
| 45 | README + setup guide + adapter guide | RM | Backlog | 4 | release, wave:4 |
| 46 | Developer tool positioning + README messaging | MKT | Backlog | 1.5 | marketing, wave:1.5 |
| 47 | MIT license + open-source compliance review | LEGAL | Backlog | 1.5 | legal, wave:1.5 |
| 48 | Final PPTX + PDF reports | PM | Backlog | 5 | reporting, wave:5 |

---

*Append-only — entries are never removed, only status changes*
