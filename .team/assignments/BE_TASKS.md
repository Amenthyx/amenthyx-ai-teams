# Backend Engineer — Task Assignment

## Agent: BE (Backend Engineer)
## Wave: 2
## Project: Amenthyx Mission Control
## Working Directory: shared/mission-control/src/server/

---

## Tasks (ordered by dependency)

### T1: Universal Event Schema (#5)
- Define TypeScript interfaces in `src/server/types/events.ts`
- `MissionControlEvent`, `EventCategory` enum, `AgentInfo`, `EventMeta`
- Schema validation function (Zod or manual)
- Export for both server and client consumption

### T2: SQLite Database (#7)
- Setup `better-sqlite3` in `src/server/db/`
- Schema: `events` table (id, timestamp, session_id, category, type, severity, agent_role, payload JSON, meta JSON)
- Schema: `agents` table (role, name, color, category, status, current_task, wave, tokens_used, cost_usd)
- Schema: `budget` table (total, spent, currency, alert_threshold)
- Migration file + auto-create on startup
- Query helpers: insertEvent, getEvents (with filters), getAgents, updateAgent, getBudget

### T3: Express Server + WebSocket (#6)
- `src/server/index.ts` — Express app on port 4201
- WebSocket server on same port (upgrade path)
- CORS for localhost:4200
- JSON body parser
- Graceful shutdown handler
- Health endpoint: GET `/api/health`

### T4: REST API Routes (#8)
- POST `/api/events` — ingest universal events (validate schema, store in SQLite, broadcast via WS)
- POST `/api/events/claude-code` — Claude Code adapter endpoint (translate hooks to universal schema)
- POST `/api/events/cli` — CLI wrapper adapter endpoint
- GET `/api/events` — query events (filter by agent, category, type, severity; pagination)
- GET/POST `/api/agents` — get/update agent roster
- GET/POST `/api/budget` — get/update budget state
- GET/POST `/api/waves` — get/update wave status
- GET `/api/health` — server health + connected WS clients count

### T5: File Watcher Service (#9)
- `src/server/watchers/file-watcher.ts`
- Use chokidar to watch `.team/` directory recursively
- Debounce at 500ms
- On change: parse file → emit events via WebSocket
- Specific parsers for: KANBAN.md, COMMIT_LOG.md, MILESTONES.md, COST_ESTIMATION.md, evidence manifests

### T6: .team/ File Parsers (#11)
- `src/server/services/parsers/`
- `kanban-parser.ts` — parse markdown table in KANBAN.md → structured kanban cards
- `commit-log-parser.ts` — parse COMMIT_LOG.md → structured commits
- `milestones-parser.ts` — parse MILESTONES.md → structured milestones
- `cost-parser.ts` — parse COST_ESTIMATION.md → budget object
- `evidence-parser.ts` — scan `.team/evidence/` → evidence inventory
- `github-issues-parser.ts` — parse GITHUB_ISSUES.md → issue list

### T7: Git Watcher Service (#10)
- `src/server/watchers/git-watcher.ts`
- Poll `git log --oneline -50` every 10s on `ai-team` branch
- Parse conventional commits: type, scope, description, issue ref, agent (from commit body)
- Emit new commits as events via WebSocket
- Track branch status (ahead/behind)

### T8: Claude Code Adapter (#12)
- `src/server/adapters/claude-code-adapter.ts`
- Translate Claude Code hook events (PreToolUse, PostToolUse, SubagentStart, SubagentStop) to universal schema
- Map tool names to event categories
- Extract agent info from subagent events
- Generate `.claude/settings.local.json` hooks config template

### T9: Generic CLI Wrapper Adapter (#13)
- `src/server/adapters/cli-wrapper.ts`
- Executable script: spawn child process, capture stdout/stderr
- Line-by-line regex classification into event categories
- POST events to localhost:4201/api/events/cli
- Pass-through I/O to user (transparent wrapper)

### T10: File Watcher Adapter (#14)
- `src/server/adapters/file-adapter.ts`
- Configurable watch paths via mission-control.config.json
- File type parsers: markdown-table, junit-xml, json, text-lines
- Emit events on file change

## Evidence Required
- All build logs → `.team/evidence/builds/be_build.log`
- All test results → `.team/evidence/tests/unit/be_test_results.xml`
- API response samples → `.team/evidence/runtime/be_api_health.log`
- Evidence manifest → `.team/evidence/manifests/BE_manifest.md`

## Atomic Commits
One commit per task (T1-T10). Format:
```
feat(server): <description> [#issue_number]

Evidence: .team/evidence/{file}
Agent: Backend Engineer
Wave: 2
```
