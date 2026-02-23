# PM GitHub Integration Protocol

## Overview

Every team's Project Manager agent uses the `gh` CLI to create and manage GitHub Projects, milestones, issues, and releases. This integrates the team's kanban board, deliverables, and milestones directly into GitHub for visibility and tracking.

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- Write access to the project's GitHub repository
- GitHub Projects (v2) enabled on the repository

## Setup Commands

### 1. Create GitHub Project Board

```bash
# Create a new project board linked to the repo
gh project create --title "{PROJECT_NAME} — Kanban" --owner "{ORG_OR_USER}" --format "board"

# Note the project number from output for subsequent commands
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

### 3. Create Labels

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

# Status labels
gh label create "status:blocked" --color "000000" --description "Blocked by dependency"
gh label create "status:in-review" --color "0075ca" --description "In review"

# Wave labels
gh label create "wave:1-planning" --color "bfdadc" --description "Wave 1: Planning"
gh label create "wave:2-engineering" --color "d4c5f9" --description "Wave 2: Engineering"
gh label create "wave:3-qa" --color "fef2c0" --description "Wave 3: QA"
gh label create "wave:4-release" --color "f9d0c4" --description "Wave 4: Release"
```

### 4. Create Issues for Deliverables

```bash
# PM issues the PM creates issues for each deliverable
# Example: Backend API Design
gh issue create \
  --title "Design REST API contracts" \
  --body "## Description
Design all REST API endpoints with request/response schemas.

## Acceptance Criteria
- [ ] All endpoints documented in OpenAPI format
- [ ] Request/response schemas defined
- [ ] Auth requirements specified per endpoint
- [ ] Error response format standardized

## Artifacts
- \`.team/api-contracts/API_DESIGN.md\`

## Assigned Role
Backend Engineer" \
  --label "role:backend,P0:critical,wave:2-engineering" \
  --milestone "M2: Core Implementation"
```

### 5. Update Issue Status

```bash
# When an agent starts work
gh issue edit {NUMBER} --add-label "status:in-progress" --remove-label "status:blocked"

# When an agent completes work
gh issue close {NUMBER} --comment "Completed. Artifact: .team/api-contracts/API_DESIGN.md"

# When blocked
gh issue edit {NUMBER} --add-label "status:blocked" \
  --body-append "**BLOCKED**: Waiting for {dependency}"
```

### 6. Progress Comments

```bash
# PM adds progress updates to issues
gh issue comment {NUMBER} --body "## Progress Update — $(date +%Y-%m-%d\ %H:%M)
- Implementation 60% complete
- API endpoints 8/12 defined
- Blocked on auth decision (see Decision #3)
"
```

### 7. Create GitHub Releases

```bash
# After Release Manager signs off
gh release create v{VERSION} \
  --title "v{VERSION} — {RELEASE_NAME}" \
  --notes "## Release Notes

### Features
- Feature 1
- Feature 2

### Bug Fixes
- Fix 1

### Known Issues
- Issue 1

### Contributors
Virtual Engineering Team (Claude Code)

---
Full changelog: .team/releases/CHANGELOG.md
QA Sign-off: .team/qa/QA_SIGNOFF.md
" \
  --target main
```

## PM Workflow Integration

### At Wave 1 (Planning)

1. PM reads the strategy file
2. PM creates GitHub Project board
3. PM creates milestones from strategy timeline
4. PM creates labels (if not already present)
5. PM creates issues for all known deliverables
6. PM assigns milestone + labels to each issue
7. PM writes `.team/KANBAN.md` mirroring GitHub issues

### At Each Wave Transition

1. PM updates issue statuses based on agent outputs
2. PM closes completed issues with artifact references
3. PM adds progress comments to in-progress issues
4. PM creates new issues for discovered work items
5. PM updates `.team/KANBAN.md` to match GitHub state

### At Wave 4 (Release)

1. PM verifies all milestone issues are closed
2. PM creates a GitHub Release with changelog
3. PM closes all milestones
4. PM generates final PPTX + PDF reports

## Error Handling

```bash
# If gh CLI is not available or not authenticated
if ! command -v gh &> /dev/null || ! gh auth status &> /dev/null; then
    echo "WARNING: gh CLI not available. Falling back to .team/KANBAN.md only."
    echo "GitHub integration disabled for this session."
    # PM continues with file-based kanban only
fi
```

## Notes

- All GitHub operations are idempotent — re-running won't duplicate issues
- PM checks for existing milestones/labels before creating
- Issue numbers are tracked in `.team/GITHUB_ISSUES.md` for cross-reference
- If the repo is private, ensure the gh token has `repo` scope
