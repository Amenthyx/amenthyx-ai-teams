# Milestones — Amenthyx Mission Control

## Date: 2026-03-02

---

| # | Milestone | Wave | Deliverables | Gate | Status |
|---|-----------|------|--------------|------|--------|
| M0 | Initialization | 0 | Cost estimation, `.team/` structure, `ai-team` branch | Cost approved | DONE |
| M1 | Planning Complete | 1 | Charter, milestones, kanban, timeline, risk register, GitHub board, all task assignments | PM artifacts exist + GitHub synced | IN PROGRESS |
| M2 | Core Infrastructure | 2 | Express server, WebSocket, SQLite, event schema, REST API, file watcher, git watcher | Backend starts, accepts events, pushes via WS | PENDING |
| M3 | React Dashboard Shell | 2 | Vite + React app, layout, sidebar, header, routing, theme toggle, Zustand stores, WS hook | Dashboard loads at localhost:4200 | PENDING |
| M4 | P0 Panels (All 13) | 2 | Agent filter bar, agent activity, planning timeline, cost monitor, test results, kanban board, git commits, event stream, secrets health, adapters, auto-scaffold | All panels render with live data | PENDING |
| M5 | CI/CD & DevOps | 2 | GitHub Actions workflow, `act` local validation, pre-commit hooks, ESLint + Prettier | CI passes locally | PENDING |
| M6 | Scaffold & Integration | 2 | `scaffold.sh`, `mission-control.config.json` template, Claude Code hooks config, CLI wrapper | `npx mission-control init` works | PENDING |
| M7 | QA & Testing | 3 | Static analysis, unit tests (80%+), integration tests, E2E (Playwright), security scan | All tests pass, coverage >= 80% | PENDING |
| M8 | Release v1.0.0 | 4 | Changelog, npm package, GitHub Release, documentation | Published and installable | PENDING |
| M9 | Final Reports | 5 | Final PPTX + PDF, evidence dashboard, milestones closed | All evidence verified | PENDING |
