# Infrastructure Engineer — Task Assignment

## Agent: INFRA
## Wave: 2
## Project: Amenthyx Mission Control
## Working Directory: shared/mission-control/

---

## Tasks

### T1: Scaffold Script (#32)
- `shared/mission-control/scaffold/scaffold.sh`
- Copies mission-control to target project as `.mission-control/`
- Adds to .gitignore
- Runs npm install
- Generates config
- Detects AI tool (Claude Code / other)
- Configures adapter
- Starts dashboard in background
- Waits for health check
- Cross-platform (bash — works on Windows Git Bash, macOS, Linux)

### T2: Config Generator (#33)
- `mission-control.config.json` template
- Generator function that populates: sessionId, projectName, teamName, agents roster, budget, ports, source tool, file watcher paths
- Reads from strategy file + TEAM.md + COST_ESTIMATION.md

### T3: Port Management + Process Lifecycle (#34)
- PID file at `.mission-control/.dashboard.pid`
- Start: check if port available, auto-increment if busy
- Stop: read PID, graceful kill
- Health check: poll /api/health with timeout
- Restart: stop + start
- `npx mission-control stop` command

### T4: Package.json Scripts (#35)
- `npm run dashboard` — starts both backend + frontend concurrently
- `npm run dev` — development mode with hot reload
- `npm run build` — production build
- `npm run start` — production start (built assets)
- `npm run test` — run all tests
- `npm run lint` — run linting
- Use `concurrently` package for running server + client together

## Evidence Required
- Scaffold test run log → `.team/evidence/builds/infra_scaffold.log`
- Config generation sample → `.team/evidence/runtime/infra_config_sample.json`
- Evidence manifest → `.team/evidence/manifests/INFRA_manifest.md`
