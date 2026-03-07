# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [4.5.0] - 2026-03-07

### Changed
- Removed strategy template selection menu from `amenthyx init`
- User always provides their own strategy file — no more picking from preset templates
- Claude auto-adjusts the user's strategy to the Amenthyx standard format on activation
- Standard `STRATEGY_TEMPLATE.md` is copied into `.team/` as a reference for Claude

## [4.4.0] - 2026-03-07

### Added
- `amenthyx init` now creates a new project folder on the Desktop (named after the project)
- Git repository auto-initialized in the project folder (`git init` + `.gitignore`)
- `.team/` scaffold created inside the new project folder

## [4.3.6] - 2026-03-07

### Fixed
- Claude Code now launches in **interactive agent mode** (removed `-p` print mode flag)
- Claude receives team name, strategy context, and working directory in the initial prompt
- Claude reads the activation file with its Read tool instead of receiving it via stdin/pipe
- Fixed `cwd` so Claude operates in the project directory, not system32

## [4.3.5] - 2026-03-07

### Fixed
- Fixed "filename or extension is too long" error on Windows when launching Claude Code
- Claude now receives a short prompt referencing the activation file path instead of the full prompt text
- Removed platform-specific piping/launcher workarounds — single cross-platform approach

## [4.3.4] - 2026-03-07

### Changed
- `amenthyx init` and `amenthyx activate` now auto-launch Claude Code CLI with `--dangerously-skip-permissions`
- Claude takes over the terminal and starts executing the team protocol immediately
- No manual copy-paste of prompts needed — fully automated from init to execution
- Falls back to manual instructions if `claude` CLI is not found in PATH

## [4.3.3] - 2026-03-07

### Changed
- `amenthyx init`: selecting `0` (no template) now prompts for path to your own strategy.md instead of skipping
- Strategy file is always required — cannot be skipped during init
- `amenthyx init` now auto-activates the team immediately after setup (no manual `activate` step needed)

### Fixed
- `init` wizard config always sets `"strategy": "strategy.md"` (was `null` when skipped)
- "Next steps" now shows `activate` instead of `dry-run`

## [4.3.2] - 2026-03-07

### Fixed
- Windows console: output now stays in the same terminal window instead of opening a new one
- Double-click from Explorer now pauses with "Press Enter to exit" so output is readable
- Uses `GetConsoleProcessList` Win32 API to detect launch context (terminal vs Explorer)

## [4.1.0] - 2026-03-07

### Added
- GitHub Actions CI/CD pipeline for automated validation
- CHANGELOG.md, CONTRIBUTING.md, LICENSE, CODE_OF_CONDUCT.md
- `.ai/context_base.md` project context for AI agents
- `amenthyx init` interactive project setup wizard
- Team Recommendation Engine — auto-suggest teams from strategy analysis
- Strategy Diff Tool — compare two strategy files side-by-side
- `--dry-run` mode for team activation simulation
- Team Compatibility Matrix for multi-team orchestration planning
- Docker Compose support for Mission Control
- GitHub Pages documentation site (docs/)
- Notification delivery engine (Slack, Discord, email via webhooks)
- Dashboard branding/theming from config
- Data retention and session purge policies
- Batch ZIP export for session data
- Security Incident Response Protocol
- Post-Mortem Template protocol
- Team Graduation Protocol

## [4.0.0] - 2026-03-07

### Added
- Judge Agent (JUDGE) — evaluates PM plan alternatives with 7-criterion rubric
- Code Review Agent (CR) — automated code review gate (OWASP, architecture, quality)
- Retrospective Agent (RETRO) — post-wave analysis, metrics, learning extraction
- Dependency Guardian (DEPGUARD) — CVE audit, license compliance, abandoned packages
- Agent Memory & Learning Protocol — persistent learnings across sessions
- Cross-Team Handoff Protocol — formal contracts for multi-team projects
- Multi-Team Orchestration Protocol — sequential/parallel/hybrid team coordination
- Rollback Protocol — DB migration reversal, feature flags, blue/green
- A/B Plan Execution Protocol — time-boxed spike of runner-up plan
- Risk Escalation Matrix — P0-P3 severity triggers
- Strategy Validator script (`strategy_validator.py`)
- Team Test Suite script (`team_test_suite.py`)
- CLI Tool (`amenthyx_cli.py`) — list, info, search, compose, validate
- Team Composer (`team_composer.py`) — build custom hybrid teams
- 5 Strategy Templates (SaaS MVP, Mobile App, API Backend, Data Pipeline, Landing Page)
- 5 New Teams: MLOps (#61), Developer Relations (#62), Compliance (#63), Migration (#64), Prompt Engineering (#65)
- Offline Mode Protocol
- Agent Performance Benchmarks Protocol
- Version Migration Protocol
- Strategy Evolution Protocol
- Mission Control: Agent Console, Budget Burn-Down, Quality Score, Agent Comm Graph, Webhooks, Session Compare

## [3.0.0] - 2026-02-15

### Added
- Evidence & Proof Protocol — every agent must produce verifiable evidence
- Local Install & Test requirement — agents must install and run locally
- Atomic Commits with conventional format and issue references
- Comprehensive Testing Matrix — static, unit, integration, E2E, perf, security
- GitHub Actions local testing with `act`
- Real-Time PM Kanban via GitHub Projects
- UAT Protocol for user acceptance testing
- PPTX and PDF report generators
- PM GitHub Integration protocol
- Enhanced Execution Protocol (16-section team structure)
- Teams 34-59 (QA Automation through Media Pipeline)

## [2.0.0] - 2025-12-01

### Added
- Wave-based parallel execution model (5 waves)
- PM agent with GitHub Project board integration
- Strategy Template (v2.0) with P0/P1/P2 prioritization
- Teams 13-33 (DevOps through Low-Code Automation)
- STRATEGY_TEMPLATE.md with non-functional requirements

## [1.0.0] - 2025-09-01

### Added
- Initial release with 12 core development teams (01-12)
- Team Leader orchestration pattern
- Basic wave execution (Planning, Engineering, QA, Release)
- Strategy-driven activation (`--team <name> --strategy <path>`)
- Activation Protocol
