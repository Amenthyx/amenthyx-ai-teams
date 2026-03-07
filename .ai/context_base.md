# Amenthyx AI Teams — Project Context

## What is this?
A collection of 65 specialized virtual engineering teams designed for Claude Code's subagent orchestration. Each team is a self-contained execution protocol with specialized agent roles, wave-based execution, evidence-driven development, and automated reporting.

## Architecture
- **65 numbered team directories** (`01-full-stack/` through `65-prompt-engineering/`), each containing a `TEAM.md` protocol file
- **`shared/`** — cross-cutting protocols, CLI tools, strategy templates, and Mission Control dashboard
- **Activation**: `--team <name> --strategy path/to/strategy.md`
- **Version**: v4.0 with Judge, Code Review, Retrospective, and Dependency Guardian agents

## Key Files
| File | Purpose |
|------|---------|
| `README.md` | Project overview, team index, quick start |
| `STRATEGY_TEMPLATE.md` | Template users copy to define their project |
| `shared/ACTIVATION_PROTOCOL.md` | Master protocol loaded on every team activation |
| `shared/ENHANCED_EXECUTION_PROTOCOL.md` | Evidence, testing, atomic commits protocol |
| `shared/amenthyx_cli.py` | CLI tool: list, search, compose, validate teams |
| `shared/strategy_validator.py` | Grades strategy files A-F |
| `shared/team_test_suite.py` | Validates all TEAM.md files |
| `shared/team_composer.py` | Build custom hybrid teams from existing agents |
| `shared/mission-control/` | React + Express real-time monitoring dashboard |

## Team Structure (every team)
Each TEAM.md defines ~11 agents with standard roles (TL, PM, JUDGE, CR, RETRO, DEPGUARD, QA, RM) plus 3-7 domain specialists. Execution follows waves: Planning → Judge → Engineering → Code Review → Retrospective → QA → Dependency Audit → Release.

## Tech Stack
- **Teams/Protocols**: Pure Markdown (no runtime dependencies)
- **CLI Tools**: Python 3.8+ (stdlib only, no pip dependencies)
- **Mission Control**: TypeScript, React 18, Tailwind CSS, Express, better-sqlite3, WebSocket, Recharts
- **CI**: GitHub Actions

## Development Commands
```bash
python shared/amenthyx_cli.py health          # Full project health check
python shared/team_test_suite.py              # Validate all TEAM.md files
python shared/strategy_validator.py FILE      # Grade a strategy file
cd shared/mission-control && npm run build    # Build dashboard
cd shared/mission-control && npm run dashboard # Dev mode
```

## Conventions
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- TEAM.md files: 16-section v3.0+ structure, 600-1500 lines
- Agents: uppercase abbreviations (TL, PM, QA, CR, RETRO, DEPGUARD)
- Waves: numbered 0-5 with decimal sub-waves (1.5, 2.5, 2.7, 3.8)
