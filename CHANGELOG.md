# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
- Team Composer (`team_composer.py`) — build custom hybrid teams
- 5 Strategy Templates (SaaS MVP, Mobile App, API Backend, Data Pipeline, Landing Page)
- 5 New Teams: MLOps (#61), Developer Relations (#62), Compliance (#63), Migration (#64), Prompt Engineering (#65)
- Offline Mode Protocol
- Agent Performance Benchmarks Protocol
- Version Migration Protocol
- Strategy Evolution Protocol

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
