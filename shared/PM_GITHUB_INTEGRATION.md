# PM GitHub Integration Protocol v3.1

## Overview

Every team's Project Manager agent uses the `gh` CLI to create and manage GitHub Projects, milestones, issues, and releases. This integrates the team's kanban board, deliverables, and milestones directly into GitHub for real-time visibility and tracking.

**v3.1 Enhancements**: Auto-sync (commit + push on every update), cost estimation tracking, dynamic agent scaling log, payment governance integration, plus all v3.0 features (real-time kanban, evidence-linked issues, atomic commits, CI/CD).

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- Write access to the project's GitHub repository
- GitHub Projects (v2) enabled on the repository
- `act` installed for local GitHub Actions testing (`act --version`)

## GitHub Kanban Board — First-Class Requirement

> **The GitHub Projects V2 board on the repository website IS the primary kanban.**
> `.team/KANBAN.md` is a local mirror, but the GitHub board is the source of truth visible to the user.
> They MUST always be in sync. If they diverge, the PM reconciles immediately.

### Board-KANBAN.md Sync Protocol

Every time `.team/KANBAN.md` is updated, the corresponding GitHub board cards MUST also move. Every time a GitHub issue is updated, `.team/KANBAN.md` MUST reflect the change. The PM is responsible for maintaining this bidirectional sync.

```
KANBAN.md change → PM updates GitHub board card position
GitHub issue change → PM updates KANBAN.md
Drift detected → PM runs full reconciliation (compare all items, fix discrepancies)
```

### PM Must Create EVERY Task as a GitHub Issue

Every task — no matter how small — MUST exist as a GitHub issue with:
- Title following conventional format: `type(scope): description`
- Full body with acceptance criteria, evidence requirements, assigned agent, wave
- Labels: role, priority, wave, status, evidence
- Milestone assignment
- Project board card in the correct column

**No work happens without a corresponding GitHub issue.** If an agent starts work that has no issue, the PM creates one retroactively.

## PM Task Assignment — Full Prioritized Task List Per Agent

> **MANDATORY**: The PM produces a comprehensive, prioritized task list for EVERY team member.
> Each agent receives their personalized task queue BEFORE they start work.

### Agent Task Manifest

At the start of each wave, the PM creates `.team/assignments/{ROLE}_TASKS.md` for every agent:

```markdown
# Task Assignments — {AGENT_ROLE}
## Wave: {N}
## Date: {ISO_8601_timestamp}
## Priority Order: Execute tasks in this exact order (P0 first, then P1, then P2)

| # | Priority | GitHub Issue | Task Description | Dependencies | Est. Effort | Status |
|---|----------|-------------|------------------|-------------|-------------|--------|
| 1 | P0 | #12 | Implement user CRUD API | DB schema (#8) must be done | L | Not Started |
| 2 | P0 | #13 | Add authentication middleware | User API (#12) must be done | M | Not Started |
| 3 | P1 | #18 | Add rate limiting | Auth (#13) must be done | S | Not Started |
| 4 | P2 | #22 | Add API versioning headers | None | S | Not Started |

### Notes for {AGENT_ROLE}:
- [Any specific instructions, constraints, or context for this agent]
- [Cross-references to other agents' work that may affect yours]
- [Priority P0 = must complete this wave, P1 = should complete, P2 = if time permits]
```

### Task Assignment Rules

1. **Every agent gets a task manifest** — no agent starts work without knowing exactly what to do and in what order
2. **Tasks are prioritized P0 > P1 > P2** — agents work top-to-bottom, never skip ahead
3. **Dependencies are explicit** — if task B depends on task A from another agent, this is stated
4. **Each task links to a GitHub issue** — no orphan tasks
5. **PM updates task manifests** when priorities change, new tasks are discovered, or dependencies shift
6. **Agents report back** to PM on each task completion — PM updates both the manifest and the GitHub board
7. **Task manifests are auto-synced** to GitHub alongside other `.team/` artifacts

### PM Master Task Board

The PM also maintains `.team/MASTER_TASKS.md` — a single view of ALL tasks across ALL agents:

```markdown
# Master Task Board — {PROJECT_NAME}
## Total Tasks: {N} | P0: {N} | P1: {N} | P2: {N}
## Last Updated: {ISO_8601_timestamp}

| # | Priority | GitHub Issue | Task | Assigned To | Wave | Dependencies | Status |
|---|----------|-------------|------|-------------|------|-------------|--------|
| 1 | P0 | #5 | Project charter | PM | 1 | None | Done |
| 2 | P0 | #8 | Database schema | INFRA | 2 | Charter (#5) | In Progress |
| 3 | P0 | #12 | User CRUD API | BE | 2 | Schema (#8) | Blocked |
| 4 | P0 | #15 | Login page | FE | 2 | API contract (#11) | Not Started |
| ... | ... | ... | ... | ... | ... | ... | ... |

### Dependency Graph (Critical Path)
#5 (PM) → #8 (INFRA) → #12 (BE) → #15 (FE) → #25 (QA) → #30 (RM)
```

## Setup Commands

### 1. Create GitHub Project Board (V2 with Enhanced Columns)

```bash
# Create a new project board linked to the repo
gh project create --title "{PROJECT_NAME} — Kanban" --owner "{ORG_OR_USER}" --format "board"

# Note the project number from output for subsequent commands
# Add custom fields for enhanced tracking
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Wave" \
  --data-type "SINGLE_SELECT" \
  --single-select-options "Wave 0,Wave 1,Wave 1.5,Wave 2,Wave 2.5,Wave 3,Wave 3.5,Wave 4,Wave 5"

gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Agent" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Evidence" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Commit" --data-type "TEXT"
```

### 2. Create Milestones

```bash
# Create milestones matching the strategy's phases
gh api repos/{OWNER}/{REPO}/milestones -f title="M1: Planning & Architecture" \
  -f description="Project charter, architecture decisions, API contracts" \
  -f due_on="2025-01-15T00:00:00Z"

gh api repos/{OWNER}/{REPO}/milestones -f title="M2: Core Implementation" \
  -f description="Backend, frontend, mobile implementation" \
  -f due_on="2025-01-22T00:00:00Z"

gh api repos/{OWNER}/{REPO}/milestones -f title="M3: Testing & QA" \
  -f description="Test execution, bug fixes, QA sign-off" \
  -f due_on="2025-01-25T00:00:00Z"

gh api repos/{OWNER}/{REPO}/milestones -f title="M4: Release" \
  -f description="Release coordination, deployment, launch" \
  -f due_on="2025-01-28T00:00:00Z"
```

### 3. Create Labels (Enhanced Set)

```bash
# Role labels
gh label create "role:pm" --color "0e8a16" --description "Project Manager"
gh label create "role:backend" --color "1d76db" --description "Backend Engineer"
gh label create "role:frontend" --color "d93f0b" --description "Frontend Engineer"
gh label create "role:mobile" --color "c5def5" --description "Mobile Engineer"
gh label create "role:devops" --color "5319e7" --description "DevOps Engineer"
gh label create "role:infra" --color "006b75" --description "Infrastructure Engineer"
gh label create "role:qa" --color "fbca04" --description "QA Engineer"
gh label create "role:release" --color "b60205" --description "Release Manager"
gh label create "role:marketing" --color "e99695" --description "Marketing Strategist"
gh label create "role:legal" --color "c2e0c6" --description "Legal/Compliance"

# Priority labels
gh label create "P0:critical" --color "b60205" --description "Must-have, blocking"
gh label create "P1:high" --color "d93f0b" --description "Should-have"
gh label create "P2:medium" --color "fbca04" --description "Nice-to-have"

# Status labels (enhanced for real-time tracking)
gh label create "status:backlog" --color "CCCCCC" --description "Not started"
gh label create "status:sprint-ready" --color "0075ca" --description "Ready for current wave"
gh label create "status:in-progress" --color "d93f0b" --description "Agent actively working"
gh label create "status:in-review" --color "fbca04" --description "Work done, TL reviewing"
gh label create "status:testing" --color "5319e7" --description "QA testing"
gh label create "status:done" --color "0e8a16" --description "Verified complete"
gh label create "status:blocked" --color "000000" --description "Blocked by dependency"

# Evidence labels
gh label create "evidence:verified" --color "00C853" --description "Evidence manifest submitted and verified"
gh label create "evidence:missing" --color "FF1744" --description "Evidence not yet submitted"
gh label create "evidence:partial" --color "FFC107" --description "Some evidence missing"

# Wave labels
gh label create "wave:0-init" --color "e1e4e8" --description "Wave 0: Initialization"
gh label create "wave:1-planning" --color "bfdadc" --description "Wave 1: Planning"
gh label create "wave:1.5-research" --color "d1bcf9" --description "Wave 1.5: Research"
gh label create "wave:2-engineering" --color "d4c5f9" --description "Wave 2: Engineering"
gh label create "wave:3-qa" --color "fef2c0" --description "Wave 3: QA"
gh label create "wave:4-release" --color "f9d0c4" --description "Wave 4: Release"
gh label create "wave:5-reporting" --color "c2e0c6" --description "Wave 5: Reporting"

# Test labels
gh label create "tests:passing" --color "0e8a16" --description "All tests passing"
gh label create "tests:failing" --color "b60205" --description "Tests failing"
gh label create "tests:pending" --color "fbca04" --description "Tests not yet run"

# CI/CD labels
gh label create "ci:validated" --color "0e8a16" --description "GitHub Actions validated locally with act"
gh label create "ci:pending" --color "fbca04" --description "CI not yet validated"
```

### 4. Create Issues for Deliverables (Enhanced with Evidence Requirements)

```bash
# Template for creating issues with evidence requirements
gh issue create \
  --title "feat(api): implement user CRUD endpoints" \
  --body "## Description
Design and implement REST API endpoints for user management.

## Acceptance Criteria
- [ ] POST /api/users — create user with validation
- [ ] GET /api/users/:id — get user by ID
- [ ] PUT /api/users/:id — update user
- [ ] DELETE /api/users/:id — soft-delete user
- [ ] All endpoints documented in OpenAPI format
- [ ] Error responses standardized

## Evidence Required (MANDATORY)
- [ ] Unit tests passing (>= 80% coverage) — \`.team/evidence/tests/unit/\`
- [ ] Integration tests passing — \`.team/evidence/tests/integration/\`
- [ ] Build log clean (zero warnings) — \`.team/evidence/builds/\`
- [ ] Health check endpoint responds — \`.team/evidence/runtime/\`
- [ ] Evidence manifest submitted — \`.team/evidence/manifests/BE_manifest.md\`

## Artifacts
- \`.team/api-contracts/API_DESIGN.md\`
- \`src/api/users/\`

## Assigned Agent
Backend Engineer (Wave 2)

## Atomic Commits Expected
Each sub-task = 1 commit with \`feat(api): ...\` format referencing this issue." \
  --label "role:backend,P0:critical,wave:2-engineering,evidence:missing,tests:pending" \
  --milestone "M2: Core Implementation"
```

### 5. Real-Time Issue Status Updates

```bash
# ── AGENT STARTS WORK ──
gh issue edit {NUMBER} \
  --add-label "status:in-progress" \
  --remove-label "status:backlog,status:sprint-ready"
gh issue comment {NUMBER} --body "## Agent Started — $(date -u +%Y-%m-%dT%H:%M:%SZ)
**Agent**: Backend Engineer
**Wave**: 2
**Action**: Starting implementation"

# ── AGENT COMPLETES WORK ──
gh issue edit {NUMBER} \
  --add-label "status:in-review,evidence:verified" \
  --remove-label "status:in-progress,evidence:missing"
gh issue comment {NUMBER} --body "## Agent Completed — $(date -u +%Y-%m-%dT%H:%M:%SZ)
**Agent**: Backend Engineer
**Status**: Implementation complete

### Evidence Submitted
- Build log: \`.team/evidence/builds/be_build.log\` — 0 warnings, 0 errors
- Unit tests: 42/42 passing, 86% line coverage
- Integration tests: 12/12 passing
- Health check: \`curl localhost:3000/health\` → 200 OK
- Evidence manifest: \`.team/evidence/manifests/BE_manifest.md\`

### Commits
- \`abc1234\` feat(api): add user model and migrations [#${NUMBER}]
- \`def5678\` feat(api): add user CRUD endpoints [#${NUMBER}]
- \`ghi9012\` test(api): add user endpoint unit tests [#${NUMBER}]
- \`jkl3456\` test(api): add user integration tests [#${NUMBER}]

### Artifacts Produced
- \`.team/api-contracts/API_DESIGN.md\`
- \`src/api/users/model.py\`
- \`src/api/users/routes.py\`
- \`tests/api/test_users.py\`"

# ── TL REVIEWS AND APPROVES ──
gh issue edit {NUMBER} \
  --add-label "status:testing" \
  --remove-label "status:in-review"
gh issue comment {NUMBER} --body "## TL Review — $(date -u +%Y-%m-%dT%H:%M:%SZ)
**Reviewer**: Team Leader
**Verdict**: APPROVED — forwarding to QA
**Notes**: Code quality good. Evidence verified."

# ── QA PASSES ──
gh issue edit {NUMBER} \
  --add-label "status:done,tests:passing" \
  --remove-label "status:testing,tests:pending"
gh issue close {NUMBER} --comment "## QA Verified — $(date -u +%Y-%m-%dT%H:%M:%SZ)
**Agent**: QA Engineer
**Verdict**: ALL TESTS PASSING
- Unit: 42/42 ✓
- Integration: 12/12 ✓
- E2E: 3/3 ✓
- Evidence: Verified ✓"

# ── BLOCKED ──
gh issue edit {NUMBER} \
  --add-label "status:blocked" \
  --remove-label "status:in-progress"
gh issue comment {NUMBER} --body "## BLOCKED — $(date -u +%Y-%m-%dT%H:%M:%SZ)
**Agent**: Backend Engineer
**Reason**: Waiting for database schema from Infra Engineer
**Blocked by**: #${BLOCKING_ISSUE}
**Estimated unblock**: When #${BLOCKING_ISSUE} completes"
```

### 6. Progress Comments with Evidence Links

```bash
# PM adds rich progress updates
gh issue comment {NUMBER} --body "## Progress Update — $(date -u +%Y-%m-%dT%H:%M:%SZ)
**Wave**: 2 | **Agent**: Backend Engineer | **Progress**: 60%

### Completed
- [x] Database schema defined
- [x] User model implemented
- [x] POST /api/users endpoint

### In Progress
- [ ] GET /api/users/:id endpoint
- [ ] PUT /api/users/:id endpoint

### Evidence So Far
- Build: compiles clean (\`.team/evidence/builds/be_build_partial.log\`)
- Tests: 28/42 passing (67% — remaining tests need incomplete endpoints)

### Commits This Session
| Hash | Type | Description |
|------|------|-------------|
| abc1234 | feat | user model and migrations |
| def5678 | feat | POST user endpoint |
| ghi9012 | test | user model unit tests |
"
```

### 7. Create GitHub Releases (Enhanced)

```bash
# After Release Manager signs off
gh release create v{VERSION} \
  --title "v{VERSION} — {RELEASE_NAME}" \
  --notes "## Release Notes

### Features
- Feature 1 (#issue)
- Feature 2 (#issue)

### Bug Fixes
- Fix 1 (#issue)

### Test Results
- Unit Tests: {X}/{Y} passing ({Z}% coverage)
- Integration Tests: {X}/{Y} passing
- E2E Tests: {X}/{Y} passing
- Security Scan: 0 CRITICAL, 0 HIGH
- Performance: P95 < {X}ms

### CI/CD
- GitHub Actions: All workflows passing
- Local validation: Passed with \`act push\`

### Evidence
- Full evidence directory: \`.team/evidence/\`
- QA sign-off: \`.team/qa/QA_SIGNOFF.md\`
- Deployment sign-off: \`.team/releases/DEPLOYMENT_SIGNOFF.md\`

### Known Issues
- Issue 1

### Contributors
Virtual Engineering Team (Claude Code — Amenthyx AI Teams v3.0)

---
Full changelog: .team/releases/CHANGELOG.md
" \
  --target main
```

## Auto-Sync Protocol (MANDATORY)

Every meaningful update MUST be committed and pushed to GitHub immediately. The PM coordinates this with the TL.

### Auto-Sync Triggers & Actions

```bash
# After PM completes planning
git add .team/PROJECT_CHARTER.md .team/MILESTONES.md .team/KANBAN.md .team/TIMELINE.md .team/RISK_REGISTER.md
git commit -m "docs(team): PM planning artifacts [Wave 1]

Agent: Project Manager
Wave: 1"
git push origin HEAD

# After any agent completes work
git add <agent's source files> <agent's evidence files>
git commit -m "<type>(<scope>): <description> [#issue]

Evidence: .team/evidence/manifests/{ROLE}_manifest.md
Agent: {ROLE}
Wave: {N}"
git push origin HEAD

# After wave transition
git add .team/KANBAN.md .team/COMMIT_LOG.md .team/TEAM_STATUS.md
git commit -m "docs(team): wave {N} → wave {N+1} transition

Agent: Team Leader
Wave: {N}"
git push origin HEAD

# After cost estimation or revision
git add .team/COST_ESTIMATION.md
git commit -m "docs(cost): cost estimation v{N}

Agent: Team Leader
Wave: 0"
git push origin HEAD

# After scaling decision
git add .team/SCALING_LOG.md
git commit -m "docs(team): scaling — +{N} {role} agents

Agent: Team Leader
Wave: {N}"
git push origin HEAD

# After PM reports
git add .team/reports/
git commit -m "docs(report): status report #{N}

Agent: Project Manager
Wave: {N}"
git push origin HEAD
```

### Push Failure Recovery

```bash
# If push fails (remote has new commits)
git pull --rebase origin HEAD
# If rebase conflicts:
#   1. TL resolves conflicts
#   2. git rebase --continue
#   3. git push origin HEAD
# If repeated failures: TL pauses and alerts user
```

---

## PM Workflow Integration (Enhanced)

### At Wave 0 (Initialization)
1. PM verifies `gh auth status`
2. PM verifies `act --version`
3. PM creates `.team/` directory structure including `evidence/` subdirs
4. **TL has already produced and committed COST_ESTIMATION.md (user approved)**

### At Wave 1 (Planning)
1. PM reads the strategy file
2. PM creates GitHub Project board with custom fields (Wave, Agent, Evidence, Commit)
3. PM creates milestones from strategy timeline
4. PM creates ALL labels (role, priority, status, evidence, wave, test, ci, cost)
5. PM creates a GitHub issue for EVERY task (P0, P1, P2) with full body, labels, milestone
6. PM assigns milestone + labels to each issue
7. PM adds ALL issues to the GitHub Project board in the correct column (Backlog/Sprint Ready)
8. PM writes `.team/KANBAN.md` mirroring the GitHub board exactly
9. PM creates `.team/MASTER_TASKS.md` — full prioritized task list across all agents
10. PM creates `.team/assignments/{ROLE}_TASKS.md` for EVERY agent — personalized prioritized queue
11. PM creates `.team/COMMIT_LOG.md` template
12. **PM commits + pushes all planning artifacts to GitHub (auto-sync)**
13. **PM verifies GitHub board matches KANBAN.md — zero drift**

### At Each Agent Start (Real-Time)
1. PM moves issue to "In Progress" on GitHub board
2. PM updates labels (status:in-progress)
3. PM adds start comment with timestamp
4. PM updates `.team/KANBAN.md`

### At Each Agent Complete (Real-Time)
1. PM moves issue to "In Review" on GitHub board
2. PM updates labels (status:in-review, evidence:verified/missing)
3. PM adds completion comment with evidence links and commit hashes
4. PM logs commits to `.team/COMMIT_LOG.md`
5. PM updates `.team/KANBAN.md`
6. **TL commits + pushes agent outputs to GitHub (auto-sync)**

### At Each Wave Transition
1. PM updates all issue statuses based on agent outputs
2. PM closes completed issues with evidence references
3. PM adds progress comments to in-progress issues
4. PM creates new issues for discovered work items
5. PM generates PPTX + PDF reports with evidence dashboard
6. PM reconciles `.team/KANBAN.md` with GitHub board state
7. **TL commits + pushes wave transition state to GitHub (auto-sync)**

### On Dynamic Agent Scaling
1. PM proposes scaling to TL with justification
2. TL evaluates cost impact
3. If cost increases beyond approved estimate: TL updates `COST_ESTIMATION.md`, asks user
4. PM logs decision in `.team/SCALING_LOG.md`
5. PM creates GitHub issues for new agent tasks
6. **TL commits + pushes scaling artifacts to GitHub (auto-sync)**

### On Payment Discovery
1. Agent reports payment need to TL
2. TL updates `COST_ESTIMATION.md` with exact amount
3. TL pauses execution and asks user for approval
4. **TL commits updated COST_ESTIMATION.md to GitHub (auto-sync)**
5. User approves → TL authorizes agent → execution resumes
6. User declines → TL finds alternative, updates estimate

### At Wave 3 (QA)
1. PM adds test result labels (tests:passing/failing)
2. PM updates evidence labels after QA verifies
3. PM links QA sign-off to relevant issues
4. **TL commits + pushes QA results to GitHub (auto-sync)**

### At Wave 4 (Release)
1. PM verifies all milestone issues are closed
2. PM verifies all issues have evidence:verified label
3. PM creates GitHub Release with test results and evidence summary
4. PM closes all milestones
5. PM generates final PPTX + PDF reports
6. **TL commits + pushes release artifacts to GitHub (auto-sync)**

### At Wave 5 (Final Reporting)
1. PM generates comprehensive PPTX with all evidence dashboards
2. PM generates PDF with complete commit log and test coverage
3. PM archives `.team/COMMIT_LOG.md` final state
4. PM verifies kanban board is fully reconciled
5. **TL performs final commit + push — GitHub fully reflects project state**

## PM Commit Log Management

The PM maintains `.team/COMMIT_LOG.md` tracking every atomic commit:

```markdown
# Commit Log — {PROJECT_NAME}

| # | Timestamp | Hash | Agent | Type | Scope | Description | Issue | Wave | Evidence |
|---|-----------|------|-------|------|-------|-------------|-------|------|----------|
| 1 | 2025-01-10T10:00Z | abc1234 | PM | docs | charter | project charter | #1 | 1 | manifest |
| 2 | 2025-01-10T14:00Z | def5678 | BE | feat | api | user model | #12 | 2 | be_build.log |
| 3 | 2025-01-10T14:30Z | ghi9012 | BE | test | api | user tests | #12 | 2 | be_test.xml |
```

## Error Handling

```bash
# If gh CLI is not available or not authenticated
if ! command -v gh &> /dev/null || ! gh auth status &> /dev/null; then
    echo "WARNING: gh CLI not available. Falling back to .team/KANBAN.md only."
    echo "GitHub integration disabled for this session."
    # PM continues with file-based kanban only
fi

# If act is not available
if ! command -v act &> /dev/null; then
    echo "WARNING: act not available. CI local testing disabled."
    echo "Install: brew install act / scoop install act / choco install act-cli"
    # DevOps agent skips local CI validation (adds ci:pending label)
fi
```

## Cost Tracking Labels

```bash
# Cost/payment labels
gh label create "cost:estimated" --color "0075ca" --description "Cost estimation complete"
gh label create "cost:approved" --color "0e8a16" --description "User approved cost estimate"
gh label create "cost:over-budget" --color "b60205" --description "Exceeding approved budget"
gh label create "payment:required" --color "FF1744" --description "Action requires payment — needs user approval"
gh label create "payment:approved" --color "0e8a16" --description "Payment approved by user"
gh label create "scaling:active" --color "d1bcf9" --description "Additional agents spawned"
```

## Data Preservation in GitHub Operations

> **NO-DELETE RULE applies to all GitHub operations.** Nothing is ever deleted.

| GitHub Object | FORBIDDEN Action | ALLOWED Alternative |
|---------------|-----------------|---------------------|
| Issues | `gh issue delete` | Close with status comment. Never delete. |
| Labels | `gh label delete` | Rename with `[DEPRECATED]` prefix if no longer needed |
| Milestones | Delete milestone | Close milestone. Never delete. |
| Branches | `git push --delete`, `git branch -D` | Tag the branch head, then leave or let auto-cleanup handle it |
| Releases | Delete release | Mark as pre-release or add `[SUPERSEDED]` to title |
| Comments | Delete comment | Edit comment to add `[RETRACTED — {reason}]` at top. Keep original text. |
| Project board cards | Remove from board | Move to "Archived" column. Never remove. |
| Repository | Delete repository | NEVER. Under no circumstances. |

### KANBAN.md: Append-Only

`.team/KANBAN.md` is append-only. Completed items move to a "Done" section. They are NEVER removed from the file.

### COMMIT_LOG.md: Append-Only

`.team/COMMIT_LOG.md` is append-only. Rows are NEVER deleted. If a commit is reverted, add a new row with type `revert` — do NOT delete the original row.

### Evidence: Permanent

All files in `.team/evidence/` are permanent. They are NEVER deleted, overwritten, or truncated.

---

## Uncertainty Escalation in PM/TL Workflow

If the PM or any agent is unsure about a GitHub operation (e.g., "Should I close this milestone?", "Is this the right label?", "Should I create this issue?"), the agent MUST:

1. STOP the operation
2. Report to TL: "I want to do X on GitHub, but I'm unsure about Y"
3. TL evaluates — if TL is also unsure, TL asks the user
4. Only proceed after receiving clear authorization
5. Log the decision in `.team/DECISION_LOG.md`

---

## Notes

- All GitHub operations are idempotent — re-running won't duplicate issues
- PM checks for existing milestones/labels before creating
- Issue numbers are tracked in `.team/GITHUB_ISSUES.md` for cross-reference
- If the repo is private, ensure the gh token has `repo` scope
- Every issue MUST have evidence requirements in the body
- Every closed issue MUST have evidence:verified label
- COMMIT_LOG.md is the single source of truth for atomic commit tracking — **append-only, never delete rows**
- **Auto-sync**: Every update = commit + push. GitHub is always the living source of truth
- **Cost gate**: COST_ESTIMATION.md must exist and be approved before Wave 1 starts
- **Payment governance**: No agent may initiate a paid action without TL + user approval
- **Scaling log**: `.team/SCALING_LOG.md` tracks all dynamic agent additions
- **No-Delete**: GitHub issues, milestones, labels, releases, and comments are NEVER deleted. Use close/archive patterns.
- **Ask when unsure**: Any uncertain GitHub operation must be escalated to TL → user before execution

---

*PM GitHub Integration Protocol v3.1 — Amenthyx AI Teams*
*No-Delete | Ask-When-Unsure | Auto-Synced | Cost-First | Dynamically-Scaled | Real-Time Kanban | Evidence-Linked | Atomic Commits | CI-Validated*
