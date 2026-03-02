# Project Charter — Amenthyx Mission Control

## Date: 2026-03-02
## Team: Full-Stack (11 roles)
## Branch: ai-team

---

## Vision
A real-time local React dashboard that monitors every aspect of AI agentic team execution — agents, planning, milestones, costs, tests, secrets, and CI/CD — regardless of which AI coding tool drives the session.

## Scope
Build the Mission Control dashboard as a reusable tool living at `shared/mission-control/` in the amenthyx-ai-teams repository. It auto-deploys at every `--team X --strategy Y` activation and provides full observability through a browser UI at `http://localhost:4200`.

## Deliverables
1. Express.js + WebSocket backend (port 4201)
2. React + Vite frontend (port 4200)
3. Universal event ingestion API with standardized schema
4. 13 P0 dashboard panels (see strategy Section 3)
5. AI tool adapters (Claude Code hooks, generic CLI wrapper, file watcher)
6. SQLite local storage for event persistence
7. Auto-scaffold script for zero-touch deployment
8. Full test suite (80%+ coverage)
9. GitHub Actions CI workflow (locally validated with `act`)
10. Documentation (README, setup guide, adapter guide)

## Tech Stack
- TypeScript 5.x (strict) — frontend and backend
- React 18+ / Vite / Tailwind CSS 3+ / Recharts / Lucide React
- Express.js / ws (WebSocket) / better-sqlite3 / chokidar
- Zustand for state management
- Jest / React Testing Library / Playwright / Supertest
- SQLite (local, zero-config)

## Constraints
- Local only — no cloud, no Docker required
- Node.js 18+ LTS
- Cross-platform: Windows, macOS, Linux
- NEVER display secret values
- $0 external costs

## Team Allocation
| Agent | Primary Responsibility |
|-------|----------------------|
| TL | Orchestration, cost monitoring, quality gates |
| PM | Planning, GitHub board, reporting |
| BE | Express server, WebSocket, API, adapters, SQLite, file/git watchers |
| FE | React dashboard, all 13 panels, Zustand stores, WebSocket hooks, UI |
| MOB | Reassigned to FE support (no mobile in scope) |
| DEVOPS | CI/CD, GitHub Actions, linting, pre-commit hooks |
| INFRA | Scaffold script, port management, process lifecycle |
| QA | Full test pyramid, evidence verification |
| RM | Release v1.0.0, npm packaging, changelog |
| MKT | Developer tool positioning, README messaging |
| LEGAL | MIT license, open-source compliance |

## Success Criteria
- All 13 P0 panels render with live data
- Works with Claude Code (hooks) + at least 1 other AI tool (CLI wrapper)
- Auto-scaffolds on `--team X --strategy Y` activation
- 80%+ test coverage (BE + FE)
- Zero CRITICAL/HIGH security vulnerabilities
- WCAG 2.1 AA accessible
- Secrets panel NEVER leaks values
