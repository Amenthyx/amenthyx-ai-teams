# Amenthyx AI Teams — Project Context

## What is this?
A collection of 65 specialized virtual engineering teams designed for Claude Code's subagent orchestration. Each team is a self-contained execution protocol with specialized agent roles, wave-based execution, evidence-driven development, and automated reporting.

## Architecture
- **65 numbered team directories** (`01-full-stack/` through `65-prompt-engineering/`), each containing a `TEAM.md` protocol file
- **`shared/`** — cross-cutting protocols, strategy templates, and Mission Control dashboard
- **Activation**: `--team <name> --strategy path/to/strategy.md`
- **Version**: v4.0 with Judge, Code Review, Retrospective, and Dependency Guardian agents

## Key Files
| File | Purpose |
|------|---------|
| `README.md` | Project overview, team index, quick start |
| `STRATEGY_TEMPLATE.md` | Standard strategy template — Claude auto-adjusts user strategies to this format |
| `shared/ACTIVATION_PROTOCOL.md` | Master protocol loaded on every team activation |
| `shared/ENHANCED_EXECUTION_PROTOCOL.md` | Evidence, testing, atomic commits protocol |
| `shared/mission-control/` | React + Express real-time monitoring dashboard |

## Team Structure (every team)
Each TEAM.md defines ~11 agents with standard roles (TL, PM, JUDGE, CR, RETRO, DEPGUARD, QA, RM) plus 3-7 domain specialists. Execution follows waves: Planning → Judge → Engineering → Code Review → Retrospective → QA → Dependency Audit → Release.

## Tech Stack
- **Teams/Protocols**: Pure Markdown (no runtime dependencies)
- **Mission Control**: TypeScript, React 18, Tailwind CSS, Express, better-sqlite3, WebSocket, Recharts

## Conventions
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- TEAM.md files: 16-section v3.0+ structure, 600-1500 lines
- Agents: uppercase abbreviations (TL, PM, QA, CR, RETRO, DEPGUARD)
- Waves: numbered 0-5 with decimal sub-waves (1.5, 2.5, 2.7, 3.8)
