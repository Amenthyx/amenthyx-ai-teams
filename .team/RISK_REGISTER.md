# Risk Register — Amenthyx Mission Control

## Date: 2026-03-02

---

| # | Risk | Probability | Impact | Mitigation | Owner | Status |
|---|------|------------|--------|------------|-------|--------|
| R1 | 13 P0 panels overwhelm single FE agent | Medium | High | PM can scale with extra FE agent; MOB reassigned to FE support | PM/TL | Open |
| R2 | WebSocket disconnects during long sessions | Medium | Medium | Auto-reconnect with exponential backoff in useWebSocket hook | BE | Open |
| R3 | SQLite write contention under high event volume | Low | Medium | WAL mode enabled; event batching (100ms); write queue | BE | Open |
| R4 | chokidar file watcher OS compatibility (Windows paths) | Low | High | chokidar handles cross-platform; test on Windows specifically | BE | Open |
| R5 | Claude Code hooks API changes | Medium | Medium | Adapter pattern isolates changes; version check on startup | BE | Open |
| R6 | Secret scanning false positives | Medium | Low | Configurable exclusion patterns in mission-control.config.json | FE | Open |
| R7 | Port 4200/4201 conflict with other tools | Low | Low | Auto-increment to next available port; notify user | INFRA | Open |
| R8 | Playwright E2E flakiness across 13 panels | Medium | Medium | Retry logic; test critical paths only in CI; full suite locally | QA | Open |
| R9 | Node.js version incompatibility (18 vs 20 vs 22) | Low | Medium | Engine field in package.json >= 18; test on 18 LTS | DEVOPS | Open |
| R10 | Cost overrun from bug fix loop | Medium | Low | Budget cap at $30; stop-and-ask at 90% | TL | Open |
