# Offline Mode Protocol — Amenthyx AI Teams v3.0

## Purpose

This protocol defines how Amenthyx AI Teams operate without GitHub access in air-gapped, firewalled, or connectivity-limited environments. All 59 teams support offline mode with zero loss of local functionality.

---

## When to Use Offline Mode

- **No internet access** — remote locations, travel, infrastructure outages
- **Corporate firewalls** — enterprise networks that block GitHub API and CLI
- **Classified environments** — government, defense, or regulated facilities with air-gapped networks
- **Local-only development** — rapid prototyping where cloud sync is unnecessary overhead
- **Unreliable connectivity** — intermittent connections that cause `gh` CLI timeouts and failures

---

## Activation

```
--team <name> --strategy <path> --offline
```

The `--offline` flag instructs Mission Control and the PM Agent to skip all network-dependent operations. No `gh` commands are issued. No `git push` is attempted.

---

## What Changes in Offline Mode

### PM Agent — Kanban Management

| Normal Mode | Offline Mode |
|-------------|--------------|
| Creates GitHub Projects board via `gh` | Creates `.team/KANBAN.md` (local markdown) |
| Syncs task status to GitHub Issues | Updates markdown tables in KANBAN.md |
| Links PRs to project columns | Records commit hashes in Done table |
| Uses GitHub Labels for priority | Uses text-based priority in table column |

### Git Operations

| Normal Mode | Offline Mode |
|-------------|--------------|
| `git commit` + `git push` | `git commit` only (local) |
| Opens Pull Requests via `gh pr create` | Skipped — commits stay on local branch |
| CI runs on push | Skipped — use `act` for local CI testing |
| Tags pushed to remote | Tags created locally, pushed later |

All commits are still atomic and follow the standard commit protocol. The only difference is that nothing leaves the local repository.

### Evidence Protocol

Evidence files (screenshots, logs, test results) are generated and stored locally in `.team/evidence/` as normal. No upload to cloud storage or GitHub Releases occurs. Evidence references in KANBAN.md use local file paths.

### Mission Control

Mission Control operates entirely locally and is fully functional in offline mode. No changes required.

### Dependency Management

Dependencies must be pre-cached before entering an offline environment:

```bash
# Node.js — populate local cache
npm ci --prefer-offline --cache .npm-cache

# Python — download wheels ahead of time
pip download -r requirements.txt -d ./wheels
pip install --no-index --find-links=./wheels -r requirements.txt

# Flutter/Dart
flutter pub get  # run while online, packages cached in .pub-cache
```

If dependencies are not pre-cached, agents will report a blocking issue in KANBAN.md and halt the affected task.

### Reporting

PPTX and PDF generators (`PPTX_GENERATOR.py`, `PDF_GENERATOR.py`) work fully offline. Output is saved to `.team/reports/`. No cloud upload is attempted.

---

## Offline Kanban Format

When `--offline` is active, the PM Agent creates and maintains `.team/KANBAN.md`:

```markdown
# Project Kanban (Offline Mode)

## Backlog
| # | Task | Agent | Priority | Created |
|---|------|-------|----------|---------|

## In Progress
| # | Task | Agent | Started | Evidence |
|---|------|-------|---------|----------|

## Done
| # | Task | Agent | Completed | Evidence | Commit |
|---|------|-------|-----------|----------|--------|
```

### Rules

- The PM Agent is the sole writer of KANBAN.md to prevent merge conflicts.
- Task numbers (`#`) are sequential integers starting at 1.
- Priority values: `P0` (critical), `P1` (high), `P2` (medium), `P3` (low).
- Evidence column contains relative paths to `.team/evidence/` files.
- Commit column contains the short SHA from `git log --oneline -1`.
- Agents report task transitions to the PM Agent, who updates the table.

---

## Offline Log

The PM Agent maintains `.team/OFFLINE_LOG.md` to track all operations that would have required network access. This file is the sync manifest used when connectivity returns.

```markdown
# Offline Log

## Pending Push
| # | Branch | Commits | Description |
|---|--------|---------|-------------|

## Pending GitHub Issues
| # | Title | Labels | Body File |
|---|-------|--------|-----------|

## Pending GitHub Project Updates
| # | Task | Column Move | Timestamp |
|---|------|-------------|-----------|
```

Every time an agent would have run a `gh` command or `git push`, the PM Agent appends a row to the appropriate table instead.

---

## Sync-When-Online Protocol

When connectivity returns, the PM Agent executes the following sequence:

1. **Verify connectivity**: `gh auth status` must succeed.
2. **Push all local commits**: `git push origin <branch>` for each branch listed in OFFLINE_LOG.md.
3. **Create GitHub Issues**: for each row in the Pending GitHub Issues table.
4. **Create or update GitHub Projects board**: replay column moves from the Pending GitHub Project Updates table.
5. **Upload evidence**: push evidence artifacts referenced in KANBAN.md to the appropriate location.
6. **Archive offline artifacts**: move `KANBAN.md` and `OFFLINE_LOG.md` to `.team/archive/offline-{date}/`.
7. **Resume normal mode**: all subsequent operations use standard GitHub-connected protocol.

If sync fails partway through, the PM Agent marks completed rows in OFFLINE_LOG.md with a `[SYNCED]` prefix and retries remaining rows on the next attempt.

---

## Constraints and Limitations

- **No cross-machine collaboration** in offline mode — the team operates on a single local machine.
- **No CI/CD pipelines** unless `act` (local GitHub Actions runner) is pre-installed.
- **No PR reviews** — code review agents operate on local diffs via `git diff` instead of GitHub PR APIs.
- **Package registries unavailable** — all dependencies must be pre-cached.
- **No GitHub-based notifications** — the PM Agent logs all notifications to `.team/OFFLINE_LOG.md` instead.

---

## Checklist Before Going Offline

- [ ] Run `npm ci` / `pip install` / `flutter pub get` to cache all dependencies
- [ ] Ensure `act` is installed if local CI testing is needed
- [ ] Verify `.team/` directory exists and is writable
- [ ] Confirm the strategy file is available locally
- [ ] Pull latest from all relevant branches

---

## Summary

Offline mode preserves the full Amenthyx AI Teams workflow — planning, execution, evidence, testing, atomic commits, and kanban tracking — without any network dependency. The only deferred operations are GitHub sync and remote push, which are replayed automatically when connectivity returns.
