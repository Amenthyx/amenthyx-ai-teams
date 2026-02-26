# Enhanced Execution Protocol v3.1

> **This protocol is MANDATORY for ALL teams.** Every agent reads this file alongside their TEAM.md.
> It defines production-grade execution standards: cost estimation & approval, evidence collection,
> local testing, atomic commits, comprehensive testing, GitHub Actions validation, auto-sync to GitHub,
> dynamic agent scaling, and payment governance.

---

## 0. COST ESTIMATION & APPROVAL GATE (BLOCKING — BEFORE ALL WORK)

### Mandate
The Team Leader MUST produce `COST_ESTIMATION.md` BEFORE the PM begins any orchestration, spawning of sub-agents, or decision-making. **No work proceeds until the user explicitly approves the cost estimate.** This is a hard gate — not advisory, not skippable.

### When This Runs
Immediately after the Team Leader reads the strategy file and TEAM.md, BEFORE Wave 1 begins:

```
WAVE 0: INITIALIZATION
├── TL reads strategy + TEAM.md + Enhanced Execution Protocol
├── TL produces COST_ESTIMATION.md        ← THIS STEP
├── TL presents cost estimate to user     ← BLOCKING WAIT
├── User approves / requests changes      ← GATE
└── Only then: TL spawns PM → Wave 1 begins
```

### COST_ESTIMATION.md Template

The Team Leader writes this to `.team/COST_ESTIMATION.md`:

```markdown
# Cost Estimation — {PROJECT_NAME}
## Date: {ISO_8601_timestamp}
## Team: {TEAM_NAME}
## Strategy: {strategy_file_path}

---

### 1. Token & AI Cost Estimate

| Wave | Agents | Est. Input Tokens | Est. Output Tokens | Est. Cost (USD) |
|------|--------|-------------------|--------------------|--------------------|
| Wave 0 | TL | ~2K | ~3K | $0.XX |
| Wave 1 | PM | ~10K | ~15K | $X.XX |
| Wave 1.5 | MKT + LEGAL | ~8K | ~12K | $X.XX |
| Wave 2 | BE + FE + MOB + DEVOPS + INFRA | ~25K | ~40K | $X.XX |
| Wave 2.5 | PM (reporting) | ~5K | ~8K | $X.XX |
| Wave 3 | QA | ~8K | ~12K | $X.XX |
| Wave 3.5 | Bug Fix (conditional) | ~0-15K | ~0-20K | $0-X.XX |
| Wave 4 | RM | ~5K | ~8K | $X.XX |
| Wave 5 | PM (final reporting) | ~5K | ~10K | $X.XX |
| **TOTAL** | **{N} agents** | **~{N}K** | **~{N}K** | **$X.XX** |

**Model used for estimation**: {model_id}
**Pricing basis**: {input_price}/MTok input, {output_price}/MTok output

### 2. External Service Costs

| Service | Action | One-Time Cost | Recurring Cost | Payment Method | Requires Card? |
|---------|--------|---------------|----------------|----------------|----------------|
| [e.g., Domain] | [Purchase] | [$X] | [$X/year] | [Card] | [YES] |
| [e.g., API] | [Subscribe] | [$0] | [$X/month] | [Card/Free tier] | [YES/NO] |
| [e.g., Hosting] | [Deploy] | [$0] | [$X/month] | [Card] | [YES] |
| **TOTAL** | | **$X** | **$X/month** | | |

> **PAYMENT RULE**: Any action requiring a card payment MUST be declared here.
> The Team Leader will NOT proceed with any payment-requiring action without explicit user approval.
> If a new cost is discovered mid-execution, the TL MUST pause, update this document, and re-request approval.

### 3. Risk Factors That May Increase Cost

| Risk | Probability | Cost Impact | Mitigation |
|------|------------|-------------|------------|
| Bug Fix Loop (Wave 3.5) | Medium | +30-50% token cost | Thorough engineering in Wave 2 |
| PM spawns extra agents | Low-Medium | +$X per agent | Bounded by scaling policy |
| Complex integrations | [H/M/L] | +[X]% | [mitigation] |

### 4. Cost Summary

| Category | Estimated Cost |
|----------|---------------|
| AI/Token costs | $X.XX |
| External services (one-time) | $X.XX |
| External services (monthly) | $X.XX/month |
| **Total to start** | **$X.XX** |
| **Total (worst case)** | **$X.XX** |

---

### APPROVAL

> **USER ACTION REQUIRED**: Review the above costs and reply with one of:
> - **"approved"** — proceed with execution as estimated
> - **"approved with cap of $X"** — proceed but hard-stop if costs exceed $X
> - **"too expensive, tailor it"** — TL will propose a reduced scope/strategy
> - **"change X"** — TL will revise specific items and re-estimate
```

### TL Behavior After User Response

| User Response | TL Action |
|---------------|-----------|
| "approved" | Proceed to Wave 1. PM begins. |
| "approved with cap of $X" | Proceed. Set hard cost ceiling. TL monitors and halts if approaching cap. |
| "too expensive, tailor it" | TL proposes scope reductions (fewer agents, skip waves, reduce features). Produces revised `COST_ESTIMATION_v2.md`. Waits for re-approval. |
| "change X" | TL revises the specific item. Updates estimate. Waits for re-approval. |

### Mid-Execution Cost Changes

If at ANY point during execution a new cost is discovered (unexpected API fee, agent scaling, service upgrade needed):

1. TL **pauses execution** immediately
2. TL updates `COST_ESTIMATION.md` with the new line item
3. TL presents the delta to the user: "New cost discovered: {description} = ${amount}. Updated total: ${new_total}. Approve?"
4. Execution resumes ONLY after user approves the updated estimate

---

## 0.1 PAYMENT GOVERNANCE PROTOCOL

### Mandate
The Team Leader is the **sole authority** on payment-related decisions. No agent may initiate, commit to, or execute any action that involves spending money (card payments, subscriptions, purchases, tier upgrades) without:

1. The cost being declared in `COST_ESTIMATION.md`
2. Explicit user approval for that specific cost

### Rules

1. **Declare before act**: Every payment must appear in `COST_ESTIMATION.md` BEFORE the action is taken
2. **Exact amounts**: No vague estimates for payments — "approximately $10-15" is not acceptable; "$12.99" is
3. **No implicit subscriptions**: If a service has a free trial that converts to paid, this MUST be flagged
4. **Card-required actions**: Any action requiring a credit/debit card number, payment method, or billing info is HARD BLOCKED until user approves
5. **Recurring vs one-time**: Always distinguish between one-time and recurring costs
6. **Currency**: All costs in USD unless user specifies otherwise

### Agent Payment Behavior

| Agent | Can Spend Money? | Rule |
|-------|-----------------|------|
| Team Leader | NO (but declares costs) | Produces estimates, requests approval, monitors budget |
| PM | NO | Plans work, never initiates payments |
| Engineering agents | NO | If they need a paid service, they report to TL who escalates to user |
| DevOps / Infra | NO directly | Must declare infra costs to TL. TL adds to COST_ESTIMATION.md |
| Release Manager | NO directly | If deployment has costs, TL must pre-approve with user |
| ALL agents | NEVER | No agent may autonomously spend money. Period. |

### Payment Escalation Flow

```
Agent discovers payment needed
  → Agent reports to TL: "Service X requires $Y payment"
  → TL updates COST_ESTIMATION.md
  → TL pauses execution
  → TL asks user: "New cost: {service} = ${amount}. Approve?"
  → User approves → TL authorizes agent to proceed
  → User declines → TL finds alternative (free tier, different service, skip feature)
```

---

## 0.2 DYNAMIC AGENT SCALING PROTOCOL

### Mandate
The PM may spawn additional agents beyond the default team roster when the workload demands it. This ensures large or complex projects get adequate parallelism without being constrained by the fixed team size.

### When the PM May Scale

| Trigger | Action | Approval |
|---------|--------|----------|
| Feature estimated as XL and splittable | PM proposes splitting across 2+ engineers | TL approves |
| Wave falling behind timeline | PM proposes extra agent for bottleneck area | TL approves |
| QA finds >= 5 blocking bugs | PM spawns parallel fix agents | TL approves |
| Strategy explicitly requests parallel streams | PM spawns as defined in strategy | Pre-approved |

### Scaling Process

```
1. PM identifies scaling need
2. PM proposes to TL: "Need {N} additional {ROLE} agents. Reason: {reason}"
3. TL evaluates:
   a. Does the strategy allow scaling? (check Section 11.1)
   b. Will this increase cost beyond the approved estimate?
4. IF cost increases:
   a. TL updates COST_ESTIMATION.md with revised token estimate
   b. TL asks user for re-approval
   c. Only proceeds after user approves
5. IF cost stays within approved estimate:
   a. TL approves the scaling
   b. PM spawns extra agents
6. PM logs scaling decision in .team/SCALING_LOG.md
```

### Scaling Log Template

```markdown
# Scaling Log — {PROJECT_NAME}

| # | Timestamp | Requested By | Extra Agents | Reason | Cost Delta | Approved By |
|---|-----------|-------------|-------------|--------|------------|-------------|
| 1 | {ISO} | PM | +1 BE | API endpoints exceeds single-agent capacity | +$X.XX | TL / User |
```

### Constraints

- Extra agents MUST follow all execution protocols (evidence, atomic commits, testing)
- Extra agents MUST appear in the commit log with their specific role suffix (e.g., `BE-2`, `FE-2`)
- PM MUST NOT spawn more concurrent agents than the strategy's `Max concurrent agents` setting
- If no scaling policy is set in the strategy, default: TL may approve up to +3 agents without user re-approval, beyond that requires user approval

---

## 0.3 GITHUB AUTO-SYNC PROTOCOL

### Mandate
The GitHub repository MUST be the living source of truth at all times. Every meaningful update triggers an automatic `git add + commit + push` cycle. The team never works in a state where GitHub is stale.

### What Triggers Auto-Sync

| Event | What Gets Committed | Commit Message Format |
|-------|--------------------|-----------------------|
| PM completes planning artifacts | `.team/` planning files | `docs(team): PM planning artifacts [Wave 1]` |
| Agent completes work | Source code + evidence | `feat/fix/test(scope): description [#issue]` |
| Evidence submitted | `.team/evidence/` files | `evidence(agent): {role} evidence manifest` |
| Cost estimation produced | `.team/COST_ESTIMATION.md` | `docs(cost): initial cost estimation` |
| Cost estimation revised | `.team/COST_ESTIMATION.md` | `docs(cost): revised estimate v{N} — {reason}` |
| Wave transition | `.team/KANBAN.md`, status files | `docs(team): wave {N} → wave {N+1} transition` |
| Scaling decision | `.team/SCALING_LOG.md` | `docs(team): scaling — +{N} {role} agents` |
| QA results | `.team/qa/` files | `test(qa): QA results — {PASS/FAIL}` |
| Release artifacts | `.team/releases/` | `release(v{X}): release artifacts` |
| PPTX/PDF reports | `.team/reports/` | `docs(report): status report #{N}` |

### Auto-Sync Execution

Every agent (via TL orchestration) follows this after completing meaningful work:

```bash
# 1. Stage specific files (NEVER git add -A)
git add .team/COST_ESTIMATION.md
git add src/api/users.py tests/test_users.py
git add .team/evidence/manifests/BE_manifest.md

# 2. Commit with conventional format
git commit -m "feat(api): add user CRUD endpoints [#12]

Evidence: .team/evidence/manifests/BE_manifest.md
Agent: Backend Engineer
Wave: 2"

# 3. Push to remote (auto-sync)
git push origin HEAD
```

### Push Frequency

The TL ensures `git push` happens:
- After EVERY agent completes their work
- After EVERY wave transition
- After EVERY PM reporting cycle
- After cost estimation approval
- After any scaling decision

### Conflict Resolution

If `git push` fails due to remote changes:
1. `git pull --rebase origin HEAD`
2. Resolve conflicts (TL decides if manual intervention needed)
3. `git push origin HEAD`
4. If repeated failures, TL pauses and alerts user

---

## 1. EVIDENCE & PROOF PROTOCOL

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works.

### Evidence Types

| Evidence Type | How to Capture | Where to Save |
|---------------|----------------|---------------|
| Terminal output | Redirect: `command 2>&1 \| tee .team/evidence/{agent}_{task}.log` | `.team/evidence/` |
| Build artifacts | Copy binary/package to evidence dir | `.team/evidence/builds/` |
| Test results | JUnit XML, coverage HTML, pytest output | `.team/evidence/tests/` |
| Screenshots | OS screenshot commands (see below) | `.team/evidence/screenshots/` |
| Dependency tree | `npm ls`, `pip freeze`, `cargo tree`, etc. | `.team/evidence/deps/` |
| Running app proof | `curl` output, browser screenshot, health check | `.team/evidence/runtime/` |
| Before/after diffs | `git diff > .team/evidence/diffs/{feature}.diff` | `.team/evidence/diffs/` |
| Config validation | Linter output, schema validation | `.team/evidence/validation/` |

### Screenshot Commands by Platform

```bash
# macOS
screencapture -x .team/evidence/screenshots/{name}.png

# Linux (requires scrot or gnome-screenshot)
scrot .team/evidence/screenshots/{name}.png
# or
gnome-screenshot -f .team/evidence/screenshots/{name}.png

# Windows (PowerShell)
Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::PrimaryScreen | ForEach-Object { $bmp = New-Object System.Drawing.Bitmap($_.Bounds.Width, $_.Bounds.Height); $g = [System.Drawing.Graphics]::FromImage($bmp); $g.CopyFromScreen($_.Bounds.Location, [System.Drawing.Point]::Empty, $_.Bounds.Size); $bmp.Save('.team/evidence/screenshots/{name}.png') }

# Cross-platform (if Python available)
python -c "import subprocess; subprocess.run(['python', '-m', 'PIL.ImageGrab'], check=False)"
```

### Evidence Manifest

Every agent writes an evidence manifest when completing work:

```markdown
# Evidence Manifest — {AGENT_ROLE}
## Task: {task_description}
## Date: {ISO_8601_timestamp}

### Artifacts Produced
- [ ] `path/to/artifact.md` — description
- [ ] `path/to/code.py` — description

### Evidence Collected
- [ ] Build log: `.team/evidence/{agent}_build.log`
- [ ] Test results: `.team/evidence/tests/{agent}_results.xml`
- [ ] Runtime proof: `.team/evidence/runtime/{agent}_health.log`
- [ ] Screenshot: `.team/evidence/screenshots/{agent}_{feature}.png`

### Verification Steps (Reproducible)
1. `cd /path/to/project`
2. `npm install` (or equivalent)
3. `npm run build`
4. `npm test`
5. `npm start` → verify at http://localhost:3000

### Status: VERIFIED / UNVERIFIED
```

Save to: `.team/evidence/manifests/{AGENT_ROLE}_manifest.md`

---

## 2. LOCAL INSTALL & TEST PROTOCOL

### Mandate
Every engineering agent MUST install, build, and test their work **locally** as if deploying to production. No "it works in theory" — it must work in practice.

### Required Steps (Every Engineering Agent)

```
STEP 1: ENVIRONMENT SETUP
├── Check runtime version (node -v, python --version, etc.)
├── Check required system dependencies
├── Document exact versions in `.team/evidence/env_{agent}.txt`
└── EVIDENCE: Save `{runtime} --version` output

STEP 2: DEPENDENCY INSTALLATION
├── Install all dependencies (npm install, pip install -r, cargo build, etc.)
├── Verify no vulnerabilities: npm audit / pip-audit / cargo audit
├── Save dependency tree: npm ls --all > .team/evidence/deps/{agent}_tree.txt
└── EVIDENCE: Save install log + audit report

STEP 3: BUILD
├── Run production build (npm run build, cargo build --release, etc.)
├── Verify build succeeds with zero warnings (treat warnings as errors)
├── Measure build time
└── EVIDENCE: Save build log + build time

STEP 4: LINT & FORMAT
├── Run linter (eslint, pylint, clippy, etc.)
├── Run formatter check (prettier --check, black --check, rustfmt --check)
├── Zero lint errors, zero format violations
└── EVIDENCE: Save lint output

STEP 5: RUN LOCALLY
├── Start the application locally
├── Verify health endpoint responds (curl http://localhost:{PORT}/health)
├── Verify core functionality works end-to-end
├── Keep running for 30 seconds to check for crashes
└── EVIDENCE: Save health check output + runtime log

STEP 6: SMOKE TEST
├── Hit primary endpoints / UI flows manually
├── Verify database connections, external API calls
├── Test error handling (send bad input, verify graceful errors)
└── EVIDENCE: Save curl outputs / test results

STEP 7: CLEANUP
├── Stop local server
├── Document any environment-specific setup needed
└── Update README or SETUP.md with local dev instructions
```

### Language-Specific Install Protocols

**Node.js / TypeScript**:
```bash
node -v && npm -v > .team/evidence/env_node.txt
npm ci --ignore-scripts=false
npm audit --audit-level=moderate
npm run lint
npm run build
npm test -- --coverage --reporter=junit --outputFile=.team/evidence/tests/jest_results.xml
npm start & sleep 5 && curl -f http://localhost:3000/health > .team/evidence/runtime/health.log && kill %1
```

**Python**:
```bash
python --version > .team/evidence/env_python.txt
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip freeze > .team/evidence/deps/pip_freeze.txt
pip-audit > .team/evidence/deps/audit.txt 2>&1 || true
python -m pytest --junitxml=.team/evidence/tests/pytest_results.xml --cov --cov-report=html:.team/evidence/tests/coverage_html
python -m flake8 . > .team/evidence/lint_flake8.txt 2>&1
python main.py & sleep 5 && curl -f http://localhost:8000/health > .team/evidence/runtime/health.log && kill %1
```

**Rust**:
```bash
rustc --version && cargo --version > .team/evidence/env_rust.txt
cargo build --release 2>&1 | tee .team/evidence/build_cargo.log
cargo clippy -- -D warnings 2>&1 | tee .team/evidence/lint_clippy.log
cargo test 2>&1 | tee .team/evidence/tests/cargo_test.log
cargo audit 2>&1 | tee .team/evidence/deps/cargo_audit.log
```

**Go**:
```bash
go version > .team/evidence/env_go.txt
go mod download
go mod verify
go vet ./... 2>&1 | tee .team/evidence/lint_govet.log
go test -v -race -coverprofile=coverage.out ./... 2>&1 | tee .team/evidence/tests/go_test.log
go build -o ./bin/app ./cmd/... 2>&1 | tee .team/evidence/build_go.log
```

**Flutter/Dart**:
```bash
flutter --version > .team/evidence/env_flutter.txt
flutter pub get
flutter analyze > .team/evidence/lint_flutter.log 2>&1
flutter test --coverage --machine > .team/evidence/tests/flutter_test.json 2>&1
flutter build apk --release 2>&1 | tee .team/evidence/build_flutter.log
```

**Java/Spring**:
```bash
java -version 2>&1 > .team/evidence/env_java.txt
./mvnw clean package -DskipTests=false 2>&1 | tee .team/evidence/build_maven.log
./mvnw test 2>&1 | tee .team/evidence/tests/maven_test.log
./mvnw verify 2>&1 | tee .team/evidence/tests/maven_verify.log
java -jar target/*.jar & sleep 10 && curl -f http://localhost:8080/actuator/health > .team/evidence/runtime/health.log && kill %1
```

**C#/.NET**:
```bash
dotnet --version > .team/evidence/env_dotnet.txt
dotnet restore
dotnet build --no-restore --configuration Release 2>&1 | tee .team/evidence/build_dotnet.log
dotnet test --no-build --configuration Release --logger "trx;LogFileName=test_results.trx" 2>&1 | tee .team/evidence/tests/dotnet_test.log
dotnet run --configuration Release & sleep 10 && curl -f http://localhost:5000/health > .team/evidence/runtime/health.log && kill %1
```

**C++**:
```bash
cmake --version && g++ --version > .team/evidence/env_cpp.txt
mkdir -p build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release 2>&1 | tee ../.team/evidence/build_cmake.log
make -j$(nproc) 2>&1 | tee ../.team/evidence/build_make.log
ctest --output-on-failure 2>&1 | tee ../.team/evidence/tests/ctest.log
```

---

## 3. ATOMIC COMMIT PROTOCOL

### Mandate
Every single meaningful change MUST be a separate git commit. The PM tracks each commit and links it to the GitHub kanban board.

### Commit Format (Conventional Commits)

```
<type>(<scope>): <description> [#issue_number]

<body>

Evidence: .team/evidence/{relevant_evidence_file}
Agent: {AGENT_ROLE}
Wave: {wave_number}
```

### Types
| Type | When |
|------|------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `test` | Adding or updating tests |
| `docs` | Documentation changes |
| `ci` | CI/CD pipeline changes |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `security` | Security fix or hardening |
| `chore` | Build, dependency, config changes |
| `evidence` | Adding proof/evidence artifacts |

### Rules

1. **One logical change per commit** — never bundle unrelated changes
2. **Reference issue number** — `feat(api): add user endpoint [#12]`
3. **Include evidence reference** — point to proof in `.team/evidence/`
4. **Never commit secrets** — use `.gitignore`, check with `git-secrets` or `gitleaks`
5. **Sign commits when possible** — `git commit -S`
6. **Run pre-commit hooks** — never skip with `--no-verify`

### Agent Commit Workflow

```bash
# 1. Stage specific files (never git add -A)
git add src/api/users.py tests/test_users.py

# 2. Run pre-commit checks
git diff --cached --stat  # verify what's staged

# 3. Commit with conventional format
git commit -m "feat(api): add user CRUD endpoints [#12]

- POST /api/users — create user
- GET /api/users/:id — get user by ID
- PUT /api/users/:id — update user
- DELETE /api/users/:id — soft-delete user

Evidence: .team/evidence/be_api_test.log
Agent: Backend Engineer
Wave: 2"

# 4. PM updates kanban
# PM moves issue #12 from "In Progress" to "In Review"
```

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
# Commit Log

| # | Hash | Agent | Type | Description | Issue | Wave | Evidence |
|---|------|-------|------|-------------|-------|------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | manifest |
| 2 | def5678 | BE | feat | user API | #12 | 2 | be_api_test.log |
| 3 | ghi9012 | FE | feat | login page | #15 | 2 | fe_build.log |
```

---

## 4. COMPREHENSIVE TESTING MATRIX

### Mandate
Every project MUST have a complete testing pyramid. No release proceeds without all test layers passing.

### Test Layers

```
                    ┌──────────┐
                    │ Release  │  ← Deployment verification in staging
                   ┌┴──────────┴┐
                   │   E2E      │  ← Full user flow tests (Playwright/Cypress)
                  ┌┴────────────┴┐
                  │ Integration   │  ← Cross-module, API, DB tests
                 ┌┴──────────────┴┐
                 │   Unit Tests    │  ← Individual functions/methods
                ┌┴────────────────┴┐
                │   Static Analysis │  ← Lint, type-check, security scan
                └──────────────────┘
```

### Test Coverage Requirements

| Layer | Minimum Coverage | Tool Examples | Blocking? |
|-------|-----------------|---------------|-----------|
| Static Analysis | 100% files scanned | ESLint, Pylint, Clippy, SonarQube | YES |
| Unit Tests | >= 80% line coverage | Jest, Pytest, cargo test, JUnit | YES |
| Integration Tests | All API endpoints, all DB operations | Supertest, TestContainers, httptest | YES |
| E2E Tests | All critical user flows (P0 features) | Playwright, Cypress, Detox, Maestro | YES |
| Performance Tests | P95 latency within target | k6, Locust, Artillery, wrk | WARN |
| Security Tests | Zero CRITICAL/HIGH vulns | npm audit, pip-audit, Trivy, Snyk, OWASP ZAP | YES |
| Accessibility Tests | WCAG 2.1 AA compliance | axe-core, Lighthouse, pa11y | WARN |
| Release Tests | Deployment succeeds, health check passes | Custom smoke tests | YES |

### QA Agent Testing Protocol

```
PHASE 1: STATIC ANALYSIS
├── Run all linters with strict mode
├── Run type checker (TypeScript strict, mypy strict, etc.)
├── Run security scanner (gitleaks, semgrep, bandit)
├── EVIDENCE: Save all output to .team/evidence/tests/static/

PHASE 2: UNIT TESTS
├── Run full test suite with coverage
├── Verify coverage >= 80%
├── Check for flaky tests (run 3x, all must pass)
├── EVIDENCE: Save JUnit XML + coverage report

PHASE 3: INTEGRATION TESTS
├── Start all services (DB, cache, queue, etc.)
├── Run integration test suite
├── Verify all cross-service calls work
├── Test error scenarios (service down, timeout, bad data)
├── EVIDENCE: Save test results + service logs

PHASE 4: E2E TESTS
├── Start full application stack
├── Run E2E test suite (Playwright/Cypress)
├── Test all P0 user flows end-to-end
├── Capture screenshots on failure
├── EVIDENCE: Save test results + failure screenshots + video recordings

PHASE 5: PERFORMANCE TESTS
├── Run load test against local instance
├── Measure: P50, P95, P99 latency; throughput; error rate
├── Compare against targets from strategy
├── EVIDENCE: Save k6/Locust report

PHASE 6: SECURITY TESTS
├── Run dependency audit (npm audit, pip-audit, cargo audit)
├── Run SAST scan (semgrep, CodeQL)
├── Run container scan (Trivy) if Docker used
├── Run OWASP ZAP quick scan if web app
├── EVIDENCE: Save all scan reports

PHASE 7: RELEASE TESTS
├── Build release artifact (Docker image, binary, package)
├── Deploy to local staging environment
├── Run smoke test suite against staging
├── Verify health endpoints, core flows, monitoring
├── EVIDENCE: Save deployment log + smoke test results
```

### Test Result Summary Template

```markdown
# Test Results Summary — {PROJECT_NAME}
## Date: {ISO_8601_timestamp}
## Agent: QA Engineer

| Layer | Tests | Passed | Failed | Skipped | Coverage | Status |
|-------|-------|--------|--------|---------|----------|--------|
| Static Analysis | — | — | — | — | 100% files | PASS/FAIL |
| Unit Tests | 142 | 140 | 2 | 0 | 84% lines | PASS/FAIL |
| Integration | 38 | 38 | 0 | 0 | — | PASS/FAIL |
| E2E | 12 | 12 | 0 | 0 | — | PASS/FAIL |
| Performance | 5 | 5 | 0 | 0 | — | PASS/WARN |
| Security | 3 scanners | — | 0 CRITICAL | — | — | PASS/FAIL |
| Release | 8 | 8 | 0 | 0 | — | PASS/FAIL |

### Overall Verdict: PASS / FAIL
### Blocking Issues: [list if any]
### Evidence Directory: .team/evidence/tests/
```

---

## 5. GITHUB ACTIONS — LOCAL TESTING WITH `act`

### Mandate
All CI/CD workflows (GitHub Actions) MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### Setup

```bash
# Install act (GitHub Actions local runner)
# macOS
brew install act

# Linux
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Windows (scoop)
scoop install act

# Windows (chocolatey)
choco install act-cli

# Verify
act --version
```

### Workflow Validation Protocol

```
STEP 1: SYNTAX VALIDATION
├── yamllint .github/workflows/*.yml
├── actionlint .github/workflows/*.yml  (install: go install github.com/rhysd/actionlint/cmd/actionlint@latest)
└── EVIDENCE: Save lint output

STEP 2: DRY RUN
├── act --list  (list all workflows and jobs)
├── act -n  (dry run — parse without executing)
└── EVIDENCE: Save dry run output

STEP 3: LOCAL EXECUTION
├── act push  (run push-triggered workflows)
├── act pull_request  (run PR-triggered workflows)
├── act -j {job_name}  (run specific job)
├── Use --secret-file .secrets for local secrets
└── EVIDENCE: Save full execution log

STEP 4: FIX & ITERATE
├── If any step fails, fix and re-run locally
├── Never push a workflow that fails locally
└── Document any act-specific workarounds in .team/devops/ACT_NOTES.md
```

### Common `act` Commands

```bash
# List all workflows
act --list

# Run all push events
act push

# Run specific workflow
act -W .github/workflows/ci.yml

# Run specific job
act -j build

# Run with specific event payload
act pull_request -e .github/events/pr.json

# Run with secrets
act push --secret-file .env.act

# Run with specific platform image (faster, smaller)
act push -P ubuntu-latest=catthehacker/ubuntu:act-latest

# Verbose output for debugging
act push -v
```

### GitHub Actions Workflow Template (CI)

```yaml
# .github/workflows/ci.yml — tested locally with act before push
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup environment
        run: |
          # Language-specific setup
      - name: Lint
        run: |
          # Lint commands
      - name: Upload lint report
        uses: actions/upload-artifact@v4
        with:
          name: lint-report
          path: reports/lint/

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - name: Setup environment
        run: |
          # Language-specific setup
      - name: Unit Tests
        run: |
          # Test commands with coverage
      - name: Upload test results
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: reports/tests/

  security:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - name: Security Scan
        run: |
          # Security scan commands
      - name: Upload security report
        uses: actions/upload-artifact@v4
        with:
          name: security-report
          path: reports/security/

  build:
    runs-on: ubuntu-latest
    needs: [test, security]
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: |
          # Build commands
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-artifact
          path: dist/
```

### DevOps Agent Workflow

```
1. Write .github/workflows/*.yml
2. Run: yamllint + actionlint → fix errors
3. Run: act --list → verify jobs detected
4. Run: act -n → dry run passes
5. Run: act push → full local execution passes
6. EVIDENCE: Save all act output to .team/evidence/ci/
7. Commit: ci(actions): add CI pipeline [#issue] with evidence reference
8. Push only after local validation passes
```

---

## 6. PM KANBAN — REAL-TIME GITHUB BOARD MANAGEMENT

### Mandate
The PM MUST maintain the GitHub Project board in real-time. Every state change is reflected immediately.

### Board Columns (GitHub Projects V2)

| Column | Meaning | Cards Move Here When |
|--------|---------|---------------------|
| **Backlog** | Not started | Issue created, not yet assigned |
| **Sprint Ready** | Prioritized, ready to start | PM approves for current sprint/wave |
| **In Progress** | Agent actively working | Agent starts task |
| **In Review** | Work done, awaiting review | Agent completes, TL reviews |
| **Testing** | QA validating | QA picks up for testing |
| **Done** | Verified complete with evidence | QA passes + evidence verified |
| **Blocked** | Cannot proceed | Dependency or issue blocking |

### PM Real-Time Update Protocol

```
ON WAVE START:
├── Move all wave issues from "Backlog" to "Sprint Ready"
├── Comment: "Wave {N} started — {timestamp}"
└── Update .team/KANBAN.md

ON AGENT START:
├── Move issue from "Sprint Ready" to "In Progress"
├── Comment: "Agent {ROLE} started work — {timestamp}"
├── Add "status:in-progress" label
└── Update .team/KANBAN.md

ON AGENT COMPLETE:
├── Move issue from "In Progress" to "In Review"
├── Comment: "Agent {ROLE} completed. Evidence: .team/evidence/manifests/{role}_manifest.md"
├── Add "status:in-review" label, remove "status:in-progress"
├── Link commit hash in comment
└── Update .team/KANBAN.md

ON TL REVIEW PASS:
├── Move issue from "In Review" to "Testing"
├── Comment: "TL approved. Forwarding to QA."
└── Update .team/KANBAN.md

ON QA PASS:
├── Move issue from "Testing" to "Done"
├── Close issue with: "Verified. Evidence: [link to test results]"
├── Add "status:done" label
└── Update .team/KANBAN.md

ON BLOCK:
├── Move issue to "Blocked"
├── Comment: "BLOCKED: {reason}. Waiting on: {dependency}"
├── Add "status:blocked" label
└── Create linked blocking issue if needed
```

### Enhanced GitHub Commands for PM

```bash
# Create Project V2 with custom columns
gh project create --title "{PROJECT} Kanban" --owner "{ORG}" --format board

# Add custom fields to project
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Wave" --data-type "SINGLE_SELECT" --single-select-options "Wave 0,Wave 1,Wave 1.5,Wave 2,Wave 3,Wave 4,Wave 5"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Agent" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Evidence" --data-type "TEXT"

# Create issue with full metadata
gh issue create \
  --title "feat(api): implement user CRUD endpoints" \
  --body "## Task
Implement REST API endpoints for user management.

## Acceptance Criteria
- [ ] POST /api/users — create user
- [ ] GET /api/users/:id — get user
- [ ] PUT /api/users/:id — update user
- [ ] DELETE /api/users/:id — soft-delete

## Evidence Required
- [ ] Unit tests passing (>= 80% coverage)
- [ ] Integration tests passing
- [ ] API documentation (OpenAPI spec)
- [ ] Health check endpoint responds
- [ ] Build log clean (zero warnings)

## Assigned Agent
Backend Engineer (Wave 2)" \
  --label "role:backend,P0:critical,wave:2-engineering" \
  --milestone "M2: Core Implementation"

# Move card on project board (using GraphQL)
gh api graphql -f query='
mutation {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: "{PROJECT_ID}"
      itemId: "{ITEM_ID}"
      fieldId: "{STATUS_FIELD_ID}"
      value: { singleSelectOptionId: "{IN_PROGRESS_OPTION_ID}" }
    }
  ) { projectV2Item { id } }
}'

# Add progress comment with evidence
gh issue comment {NUMBER} --body "## Progress Update — $(date -u +%Y-%m-%dT%H:%M:%SZ)
**Agent**: Backend Engineer
**Status**: Complete
**Evidence**:
- Build log: \`.team/evidence/be_build.log\` (0 warnings, 0 errors)
- Test results: 42/42 passing, 86% coverage
- Health check: \`curl localhost:3000/health\` → 200 OK
- Commit: abc1234

**Artifacts**:
- \`.team/api-contracts/API_DESIGN.md\`
- \`src/api/users/\` (new files)
- \`.team/evidence/manifests/BE_manifest.md\`
"

# Bulk create labels (enhanced set)
for label in "status:backlog:CCCCCC" "status:sprint-ready:0075ca" "status:in-progress:d93f0b" "status:in-review:fbca04" "status:testing:5319e7" "status:done:0e8a16" "status:blocked:000000" "evidence:verified:00C853" "evidence:missing:FF1744"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

### PM Report Enhancements

The PM's PPTX and PDF reports now include:

1. **Evidence Dashboard** — count of evidence artifacts per agent, verification status
2. **Commit Activity** — commits per wave, per agent, with issue references
3. **Kanban Velocity** — cards moved per reporting period, burn-down chart data
4. **Test Coverage Trend** — coverage % over time from evidence files
5. **CI/CD Status** — GitHub Actions workflow status, local `act` validation results
6. **Blocking Issues** — time spent blocked, resolution tracking

---

## 7. `.team/evidence/` DIRECTORY STRUCTURE

```
.team/evidence/
├── manifests/           # Evidence manifests per agent
│   ├── PM_manifest.md
│   ├── BE_manifest.md
│   ├── FE_manifest.md
│   └── ...
├── builds/              # Build artifacts and logs
│   ├── build_main.log
│   └── build_time.txt
├── tests/               # Test results
│   ├── static/          # Lint, type-check, security scan
│   ├── unit/            # Unit test results + coverage
│   ├── integration/     # Integration test results
│   ├── e2e/             # E2E test results + screenshots
│   ├── performance/     # Load test reports
│   ├── security/        # Vulnerability scan reports
│   └── release/         # Smoke test results
├── screenshots/         # Visual proof
├── runtime/             # Running app evidence (health checks, curl output)
├── deps/                # Dependency trees, audit reports
├── diffs/               # Before/after diffs
├── ci/                  # GitHub Actions local test results (act output)
│   ├── act_push.log
│   ├── act_pr.log
│   └── actionlint.log
└── validation/          # Config/schema validation outputs
```

---

## 8. QUALITY GATE ENHANCEMENTS

All teams now have these ADDITIONAL universal gates on top of their domain-specific gates:

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| **Cost Approved** | **Before Wave 1** | **`COST_ESTIMATION.md` exists AND user replied "approved"** | **HARD STOP — no work proceeds** |
| **Payment Declared** | **Before any paid action** | **Cost appears in `COST_ESTIMATION.md` with user approval** | **HARD STOP — escalate to user** |
| **GitHub Synced** | **Every agent completion** | **`git push` succeeded, remote is up to date** | **TL resolves push failure** |
| Evidence Complete | Before QA | Every agent has evidence manifest, all items checked | Re-spawn agent to collect evidence |
| Local Build Passes | Before QA | `build.log` shows zero errors, zero warnings | Re-spawn engineer |
| Tests Pass Locally | Before QA | All test layers pass with required coverage | Enter Bug Fix Loop |
| CI Passes Locally | Before push | `act push` succeeds, `actionlint` clean | Fix workflow, re-test |
| No Secrets Committed | Every commit | `gitleaks detect` finds zero secrets | HARD STOP, rotate secrets |
| Dependency Audit Clean | Before release | Zero CRITICAL/HIGH vulnerabilities | Fix or document exceptions |
| Kanban Current | Every wave | All GitHub issues reflect actual state | PM reconciles board |
| Commit Trail Complete | Before release | Every feature has atomic commits with issue refs | PM creates missing commits |
| **Scaling Within Budget** | **On agent scaling** | **Revised cost estimate approved if delta > threshold** | **TL requests user re-approval** |

---

*Enhanced Execution Protocol v3.1 — Amenthyx AI Teams*
*Cost-First | Auto-Synced | Dynamically-Scaled | Evidence-Driven | Locally-Tested | Atomically-Committed | CI-Validated*
