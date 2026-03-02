# QA Engineer — Task Assignment

## Agent: QA
## Wave: 3 (after all Wave 2 engineering completes)
## Project: Amenthyx Mission Control

---

## Tasks (6 phases — sequential)

### Phase 1: Static Analysis (#36)
- Run ESLint on all TypeScript files (zero errors)
- Run TypeScript strict compilation (zero errors)
- Run gitleaks secret scan (zero findings)
- Save all output to `.team/evidence/tests/static/`

### Phase 2: Unit Tests — Backend (#37)
- Write/run Jest tests for: event schema validation, SQLite queries, REST API routes, file parsers, adapters
- Coverage target: >= 80% line coverage
- Run 3x to detect flaky tests
- Save results to `.team/evidence/tests/unit/be_*.xml`

### Phase 3: Unit Tests — Frontend (#38)
- Write/run Jest + RTL tests for: Zustand stores, WebSocket hook, filter bar, agent cards, kanban cards, event stream
- Coverage target: >= 80% line coverage
- Run 3x to detect flaky tests
- Save results to `.team/evidence/tests/unit/fe_*.xml`

### Phase 4: Integration Tests (#39)
- Supertest tests for all API routes
- Test event ingestion → SQLite storage → WebSocket broadcast
- Test file watcher → event emission
- Error scenarios: malformed events, missing fields, WebSocket disconnection
- Save results to `.team/evidence/tests/integration/`

### Phase 5: E2E Tests (#40)
- Playwright tests for critical P0 flows:
  - Dashboard loads and connects
  - Agent filter bar: select/deselect agents, verify all panels filter
  - Event stream: events appear in real-time
  - Kanban board: cards render in correct columns
  - Cost monitor: budget bar updates
- Cross-browser: Chromium (Chrome is sufficient for local tool)
- Screenshots on failure
- Save to `.team/evidence/tests/e2e/`

### Phase 6: Security + Accessibility (#41, #42)
- `npm audit` — zero CRITICAL/HIGH vulnerabilities
- `gitleaks detect` — zero secrets in codebase
- axe-core scan of dashboard pages
- Lighthouse accessibility audit (target >= 90)
- Save to `.team/evidence/tests/security/` and `.team/evidence/tests/release/`

## QA Sign-off
After all phases pass, produce `.team/QA_SIGNOFF.md`:
- Overall: PASS / FAIL
- Per-phase results
- Coverage summary
- Known issues / waivers

## Evidence Required
- All test results in `.team/evidence/tests/`
- Evidence manifest → `.team/evidence/manifests/QA_manifest.md`
