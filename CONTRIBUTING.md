# Contributing to Amenthyx AI Teams

Thank you for your interest in contributing! This guide covers how to add new teams, protocols, and improvements.

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-enhancement`
3. Make your changes
4. Validate: `python shared/team_test_suite.py` and `python shared/amenthyx_cli.py health`
5. Commit with conventional format: `feat(team): add XYZ team`
6. Open a Pull Request

## Adding a New Team

### 1. Create the directory

```bash
mkdir NN-your-team-name
```

Use the next available number (currently 66+).

### 2. Create TEAM.md

Every TEAM.md must follow the v3.0+ structure with 16 sections:

1. Header (team name, activation command, description)
2. Agent Roster (minimum: TL, PM, JUDGE, QA + domain specialists)
3. Directory Structure (`.team/` layout)
4. Session Start Commands
5. Wave Execution Plan (Waves 0-5 with all gates)
6. Evidence & Proof Protocol (domain-specific evidence table)
7. Testing Matrix
8. Atomic Commit Convention
9. PM Reporting (PPTX + PDF)
10. GitHub Integration
11. Quality Gates
12. Escalation Rules
13. Spawn Blocks (for each agent)
14. Agent Memory entries
15. Cross-references to shared protocols
16. Activation example

### 3. Required agents

Every team MUST include these standard agents:

| Agent | Role | Purpose |
|-------|------|---------|
| TL | Team Leader | Orchestrator, spawns all other agents |
| PM | Project Manager | Plans, kanban, reporting, produces 2-3 alternative plans |
| JUDGE | Judge | Evaluates PM plans with 7-criterion rubric |
| CR | Code Review | Reviews code between engineering and QA waves |
| RETRO | Retrospective | Post-wave analysis and learning extraction |
| DEPGUARD | Dependency Guardian | Pre-release dependency audit |
| QA | Quality Assurance | Full test pyramid execution |
| RM | Release Manager | Deployment, changelog, rollback plan |

Plus 3-7 domain-specific engineering agents.

### 4. Validate

```bash
python shared/team_test_suite.py
python shared/amenthyx_cli.py health
```

Both must pass with zero errors.

## Adding a Protocol

1. Create `shared/YOUR_PROTOCOL.md`
2. Follow the existing format: purpose, when to trigger, procedure, output format, examples
3. Reference it from relevant TEAM.md files
4. Update `shared/ACTIVATION_PROTOCOL.md` if it should be loaded automatically
5. Update `README.md` repository structure section

## Adding a Strategy Template

1. Create `shared/templates/STRATEGY_<TYPE>.md`
2. Follow the v3.0 strategy template structure (22 sections)
3. Include realistic example data (fake project name, concrete tech choices)
4. Update `shared/templates/README.md` with the new template
5. Update the CLI tool if adding new template categories

## Modifying Mission Control

Mission Control is a React + Express + SQLite dashboard.

```bash
cd shared/mission-control
npm install
npm run dashboard    # dev mode (server + client)
npm run build        # production build
```

### Adding a new page
1. Create `src/client/pages/YourPage.tsx`
2. Add lazy import + route in `src/client/App.tsx`
3. Add nav item in `src/client/components/layout/Sidebar.tsx`

### Adding a new API route
1. Create `src/server/routes/your-route.ts`
2. Mount in `src/server/index.ts`

### Adding a new panel
1. Create `src/client/components/panels/YourPanel.tsx`
2. Import and use in the relevant page

## Code Standards

- TypeScript for Mission Control (strict mode)
- Python 3.8+ for CLI tools (no external dependencies beyond stdlib)
- Markdown for protocols and team definitions
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`

## Testing

```bash
# Validate all teams
python shared/team_test_suite.py

# Validate a strategy file
python shared/strategy_validator.py path/to/strategy.md

# Build Mission Control
cd shared/mission-control && npm run build

# Run CLI health check
python shared/amenthyx_cli.py health
```

## Pull Request Checklist

- [ ] All 65+ TEAM.md files pass validation (`team_test_suite.py`)
- [ ] CLI health check passes (`amenthyx_cli.py health`)
- [ ] Mission Control builds without errors (`npm run build`)
- [ ] New features are documented in README.md
- [ ] CHANGELOG.md is updated
- [ ] Commit messages follow conventional format
