# React Frontend Team
# Activation: `--team react`
# Focus: React, Next.js, TypeScript web applications

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Evidence & Proof Protocol](#7-evidence--proof-protocol)
8. [Local Install & Test Protocol](#8-local-install--test-protocol)
9. [Atomic Commit Protocol](#9-atomic-commit-protocol)
10. [Comprehensive Testing Matrix](#10-comprehensive-testing-matrix)
11. [GitHub Actions -- Local Testing](#11-github-actions--local-testing)
12. [PM Kanban -- Real-Time Tracking](#12-pm-kanban--real-time-tracking)
13. [Quality Gates](#13-quality-gates)
14. [`.team/` Directory Layout](#14-team-directory-layout)
15. [Reporting System](#15-reporting-system)
16. [Error Handling & Session Management](#16-error-handling--session-management)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team react --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> — this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 14)
4. Spawn Team Leader agent (foreground — this is the orchestrator)
5. Team Leader spawns PM agent (foreground — must complete before others)
6. PM produces Project Charter + Initial Plan + creates GitHub Project
7. Team Leader reviews PM output, then spawns remaining agents in waves
8. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, features, design system, and success criteria.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between component boundaries and state management approaches.
- **Persona**: "You are the Team Leader of a 10-person React frontend team. You coordinate all work, make final architectural decisions on component hierarchy and state management, enforce quality gates including Lighthouse scores and accessibility compliance, and ensure the application ships on time. You never write production code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Persona**: "You are the Project Manager. You create all planning artifacts and manage the project via GitHub Projects using `gh` CLI. You create milestones, issues with labels, and track progress. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.


### Judge Agent (JUDGE)
- **Role**: Impartial evaluation of competing plans and proposals.
- **Responsibilities**: Scores PM-generated plan alternatives using a 7-criterion weighted rubric (Strategy Alignment, Feasibility, Risk Management, Scalability, Innovation, Completeness, Efficiency). Identifies hidden assumptions and missing considerations. Produces a VERDICT document recommending the best plan with full reasoning. See `shared/JUDGE_PROTOCOL.md`.
- **Persona**: "You are the Judge Agent. You evaluate competing plans and design alternatives with rigorous objectivity. You NEVER produce plans yourself -- you only analyze plans produced by others. You assess each alternative against the project strategy, constraints, risk profile, and success criteria. You use a structured 7-criterion scoring rubric and must explain your reasoning transparently. You identify hidden assumptions, missing considerations, and risks that plan authors may have overlooked. Your output is a VERDICT document that ranks alternatives with weighted scores and selects a winner. You are impartial -- you evaluate based on merit, not authorship."
- **Spawning**: After PM, before engineering waves (foreground, blocking)

### Code Review Agent (CR)
- **Role**: Automated code review before QA gate.
- **Responsibilities**: Reviews all engineering wave code changes for OWASP vulnerabilities, code smells, architecture drift, naming consistency, hardcoded secrets, and test coverage gaps. Produces a scored CODE_REVIEW report with PASS/CONDITIONAL_PASS/FAIL verdict. See `shared/CODE_REVIEW_PROTOCOL.md`.
- **Persona**: "You are the Code Review Agent. You review all code changes from the engineering wave with the rigor of a senior staff engineer. You check for security vulnerabilities (OWASP Top 10), code quality (DRY, SOLID, complexity), architecture compliance (does the code match the approved plan?), error handling, and test coverage. You read git diffs, analyze patterns, and produce a scored review. You are thorough but fair -- you distinguish critical issues from style preferences. Your verdict determines whether QA can proceed."
- **Spawning**: After engineering wave (Wave 2), before QA (Wave 3) -- foreground, blocking

### Retrospective Agent (RETRO)
- **Role**: Post-wave analysis and continuous improvement.
- **Responsibilities**: Analyzes each completed wave for what went well, what went wrong, bottlenecks, and metrics vs plan. Produces actionable recommendations for the next wave. Tracks improvement trends. Extracts reusable learnings. See `shared/RETROSPECTIVE_PROTOCOL.md`.
- **Persona**: "You are the Retrospective Agent. After each wave completes, you analyze execution quality with data-driven objectivity. You compare planned vs actual metrics (time, tokens, commits, test pass rates). You identify bottlenecks, recurring issues, and unexpected outcomes. You produce actionable recommendations -- not vague advice, but specific changes for the next wave. You track trends across waves and extract reusable learnings for the team's institutional memory."
- **Spawning**: After each wave completion -- background, non-blocking

### Dependency Guardian (DEPGUARD)
- **Role**: Dependency security and license compliance auditing.
- **Responsibilities**: Audits all project dependencies for known CVEs, license compatibility, outdated packages, abandoned libraries, and dependency confusion risks. Produces a scored DEPENDENCY_AUDIT with PASS/WARN/FAIL verdict. See `shared/DEPENDENCY_GUARDIAN_PROTOCOL.md`.
- **Persona**: "You are the Dependency Guardian. You audit every dependency in the project -- direct and transitive. You check for known vulnerabilities (CVEs), license compatibility (no GPL contamination in proprietary projects), outdated packages, abandoned libraries, and supply chain risks. You run the appropriate audit tool for the package manager (npm audit, pip audit, cargo audit, etc.) and produce a comprehensive audit report. Any critical CVE or license violation is an automatic FAIL."
- **Spawning**: Before release wave (Wave 4) -- foreground, blocking
### 2.3 UI Architect (UIA)
- **Role**: Design system, component hierarchy, layout architecture, responsive strategy.
- **Persona**: "You are the UI Architect. You design the component tree, page layouts, design tokens, and responsive breakpoints. You define the design system using Tailwind CSS, establish component naming conventions, and create Storybook stories for all primitives. You produce architecture decision records in `.team/component-architecture/`."
- **Spawning**: Wave 2 (parallel)

### 2.4 React Component Engineer (RCE)
- **Role**: Core component implementation, React 19 features, server/client component boundaries.
- **Persona**: "You are the React Component Engineer. You build production-ready React 19 components using TypeScript. You leverage Server Components, use() hook, Actions, and Suspense boundaries. You implement compound component patterns, render props, and headless UI patterns. You write Vitest unit tests for every component."
- **Spawning**: Wave 2 (parallel)

### 2.5 State Management Engineer (SME)
- **Role**: Global/local state architecture, caching, optimistic updates.
- **Persona**: "You are the State Management Engineer. You design and implement state architecture using Zustand for global state and React Query (TanStack Query) for server state. You handle cache invalidation, optimistic updates, pagination, and offline support. You document state flows in `.team/state-management/`."
- **Spawning**: Wave 2 (parallel)

### 2.6 API Integration Engineer (AIE)
- **Role**: API client layer, data fetching, error handling, type safety.
- **Persona**: "You are the API Integration Engineer. You build the API client layer with full TypeScript type safety. You implement React Query hooks, handle loading/error states, configure retry policies, and manage authentication tokens. You produce API integration contracts in `.team/api-integration/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 Accessibility Engineer (A11Y)
- **Role**: WCAG compliance, screen reader support, keyboard navigation.
- **Persona**: "You are the Accessibility Engineer. You ensure WCAG 2.1 AA compliance across all components. You implement ARIA attributes, keyboard navigation, focus management, screen reader announcements, reduced motion support, and color contrast validation. You run axe-core audits and document findings in `.team/accessibility/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer -- Frontend Testing (QA)
- **Role**: Testing strategy, test execution, visual regression, E2E.
- **Persona**: "You are the QA Engineer specializing in frontend testing. You create test strategies covering Vitest unit tests, Playwright E2E tests, visual regression tests, and Storybook interaction tests. You enforce minimum 80% code coverage and produce QA sign-off documents in `.team/qa/`."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Release coordination, versioning, deployment sign-off.
- **Persona**: "You are the Release Manager. You coordinate releases: release branches, semantic versioning, changelogs, deployment checklists for Vercel/Netlify/CloudFront, rollback plans, and release notes. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: Go-to-market strategy, messaging, positioning.
- **Persona**: "You are the Marketing Strategist. You create go-to-market strategies, positioning documents, messaging frameworks, competitive analyses, and launch plans for the web application."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: Legal review, compliance, privacy, terms of service.
- **Persona**: "You are the Legal/Compliance Attorney. You review for GDPR, CCPA, COPPA, ADA compliance, cookie consent requirements, licensing, ToS, and privacy policies. You produce compliance checklists in `.team/legal/`."
- **Spawning**: Wave 1.5 (background, parallel with Marketing)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +-----------+
                        |   USER    |
                        +-----+-----+
                              |
                     +--------v--------+
                     |  TEAM LEADER    |
                     |  (Orchestrator) |
                     +--------+--------+
                              |
            +-----------------+------------------+
            |                 |                  |
     +------v------+  +------v------+  +--------v--------+
     |     PM      |  | Marketing   |  |   Attorney      |
     | (Planning)  |  | (Strategy)  |  |   (Legal)       |
     +------+------+  +-------------+  +-----------------+
            |
   +--------+--------+----------+-----------+
   |        |        |          |           |
+--v--+ +---v---+ +--v---+ +---v----+ +----v-----+
| UIA | |  RCE  | | SME  | |  AIE   | |  A11Y    |
+--+--+ +---+---+ +--+---+ +---+----+ +----+-----+
   |        |        |          |           |
   +--------+--------+----------+-----------+
                     |
              +------v------+
              |     QA      |
              +------+------+
                     |
            +--------v--------+
            | Release Manager |
            +-----------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Project planning for React frontend",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan -> `.team/MILESTONES.md` (component library, pages, integration, testing, launch)
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  
  IMPORTANT -- MULTI-PLAN REQUIREMENT (Judge Protocol):
  The PM MUST produce exactly 3 alternative plans (ALL 3 ARE MANDATORY):
  - .team/plans/PLAN_A.md -- first approach
  - .team/plans/PLAN_B.md -- second approach (must differ meaningfully)
  - .team/plans/PLAN_C.md -- third approach (MANDATORY)
  Each plan must vary in at least 2 dimensions: architecture, technology,
  timeline, resource allocation, risk profile, or cost structure.
  See shared/JUDGE_PROTOCOL.md for the required plan document structure.
  
  DETAILED TO-DO LIST REQUIREMENT (MANDATORY IN EVERY PLAN):
  Each plan MUST include an exhaustive to-do list covering:
  - Every single task for every team member/component
  - Dependencies between tasks (what blocks what)
  - Execution order (what runs first, second, third...)
  - Complexity rating per task (Low/Medium/High/Critical)
  - Priority level (P0-P3)
  - Estimated effort (hours/days)
  - A dependency graph showing the critical path
  - Parallel execution opportunities
  See the "Detailed To-Do List" section in shared/JUDGE_PROTOCOL.md.
  After PM completes plans, TL spawns the Judge Agent to evaluate them.
"""
)
```


### Spawn: Judge Agent (Foreground, Sequential -- After PM)
```
Task(
  subagent_type="general-purpose",
  description="JUDGE: Evaluate PM plan alternatives",
  prompt="""
  [JUDGE PERSONA from shared/JUDGE_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  PLANS TO EVALUATE:
  Read all .team/plans/PLAN_*.md files produced by PM.

  EVALUATION RUBRIC (7 criteria, weighted):
  Strategy Alignment (25%), Feasibility (20%), Risk Management (15%),
  Scalability (10%), Innovation (10%), Completeness (10%), Efficiency (10%)

  Score each plan 1-10 on each criterion.

  OUTPUT: Write verdict to .team/plans/VERDICT.md
  Include: scoring tables, comparative analysis, hidden assumptions,
  MANDATORY: full justification for WHY the winning plan was chosen
  and WHY each losing plan was NOT selected.
  missing considerations, and suggested modifications to winning plan.
  """
)
GATE: VERDICT.md must exist with a clear winner AND user must approve the plan before engineering waves proceed.
TL presents ALL 3 plans + VERDICT to the user and WAITS for user approval.
USER APPROVAL IS A BLOCKING GATE — no engineering work begins without it.
User may choose Plan A, B, or C, request a hybrid, or ask for re-planning.
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Go-to-market strategy", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: Compliance review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 5 agents)
```
UIA  -> .team/component-architecture/  (COMPONENT_TREE.md, DESIGN_TOKENS.md, RESPONSIVE_STRATEGY.md)
RCE  -> .team/design-system/           (PRIMITIVES.md, PATTERNS.md, STORYBOOK_STORIES.md)
SME  -> .team/state-management/        (STATE_ARCHITECTURE.md, STORE_DESIGN.md, CACHE_STRATEGY.md)
AIE  -> .team/api-integration/         (API_CLIENT.md, HOOKS.md, ERROR_HANDLING.md, TYPE_CONTRACTS.md)
A11Y -> .team/accessibility/           (AUDIT_RESULTS.md, ARIA_GUIDE.md, KEYBOARD_NAV.md, WCAG_CHECKLIST.md)
```


### Spawn: Code Review Agent (Foreground, Blocking -- After Engineering, Before QA)
```
Task(
  subagent_type="general-purpose",
  description="CR: Review engineering wave code changes",
  prompt="""
  [CR PERSONA from shared/CODE_REVIEW_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASK:
  1. Read all git commits from the engineering wave (git log --oneline)
  2. Review the full diff (git diff main..HEAD or relevant range)
  3. Check for: OWASP vulnerabilities, code smells, architecture drift,
     naming inconsistencies, hardcoded secrets, missing error handling,
     test coverage gaps
  4. Score using the 5-criterion rubric from shared/CODE_REVIEW_PROTOCOL.md
  5. Write report to .team/reviews/CODE_REVIEW_WAVE_N.md

  VERDICT RULES:
  - Score >= 7.0 -> PASS (proceed to QA)
  - Score 5.0-6.9 -> CONDITIONAL_PASS (proceed, track fixes as tech debt)
  - Score < 5.0 -> FAIL (engineering agents re-spawned for fixes)
  - ANY critical security finding -> automatic FAIL
  """
)
GATE: CODE_REVIEW must be PASS or CONDITIONAL_PASS before QA wave proceeds.
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, TEST_CASES.md, COVERAGE_REPORT.md, E2E_RESULTS.md, LIGHTHOUSE_REPORT.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```


### Spawn: Retrospective Agent (Background, Non-Blocking -- After Each Wave)
```
Task(
  subagent_type="general-purpose",
  description="RETRO: Analyze completed wave",
  prompt="""
  [RETRO PERSONA from shared/RETROSPECTIVE_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  WAVE JUST COMPLETED: Wave {N}

  YOUR TASK:
  1. Analyze all events, commits, and evidence from the completed wave
  2. Compare planned vs actual: duration, token usage, agent count, test pass rate
  3. Identify bottlenecks, recurring issues, and unexpected outcomes
  4. Produce actionable recommendations for the next wave
  5. Extract reusable learnings for .team/learnings/
  6. Write retrospective to .team/retros/RETRO_WAVE_{N}.md
  """
)
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, ROLLBACK_PLAN.md, RELEASE_NOTES.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | Role + priority + wave labels |
| Releases | `.team/releases/` | `gh release create` |

### Domain-Specific Milestones
1. **Design System Foundation** -- design tokens, Tailwind config, primitives
2. **Component Library** -- all UI components built and tested in Storybook
3. **Page Assembly** -- pages composed from components, routing configured
4. **State & API Integration** -- Zustand stores, React Query hooks, data flowing
5. **Accessibility & Performance** -- WCAG 2.1 AA, Lighthouse >90
6. **E2E & Release** -- Playwright passing, bundle optimized, deployed

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure
+-- npx create-next-app / verify existing Next.js project

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist
+-- EVIDENCE: PM writes manifest to .team/evidence/manifests/PM_manifest.md

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: competitive analysis, positioning, messaging, launch plan
+-- Attorney: compliance, privacy, cookie consent, ToS, licensing
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- UIA, RCE, SME, AIE, A11Y -- all in parallel
+-- Each agent writes evidence manifest on completion
+-- SYNC: TL waits for all 5 agents
+-- EVIDENCE: Each agent captures TypeScript compile, ESLint, Jest/Vitest output

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- GATE: All evidence manifests present
+-- QA: Vitest unit tests, Playwright E2E, Storybook interaction tests
+-- QA: Coverage report, visual regression, Lighthouse audit, sign-off
+-- QA: Collect ESLint results, TypeScript output, coverage HTML, Playwright reports
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: checklist, changelog, rollback, release notes, deployment sign-off
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF
+-- PM: close all GitHub milestones
+-- TL: present summary to user
```

---

## 7. EVIDENCE & PROOF PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 1

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works. React frontend projects demand rigorous evidence -- TypeScript compilation, test coverage, Lighthouse scores, accessibility audits, and bundle analysis are critical proof artifacts.

### React-Specific Evidence Requirements

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
| UIA | Design tokens exported, Storybook stories render | `npx storybook build 2>&1 \| tee .team/evidence/builds/storybook_build.log` |
| RCE | TypeScript compiles with zero errors | `npx tsc --noEmit 2>&1 \| tee .team/evidence/builds/tsc_output.log` |
| RCE | All Vitest unit tests pass | `npx vitest run --reporter=junit > .team/evidence/tests/unit/vitest_results.xml` |
| RCE | Next.js build succeeds | `npm run build 2>&1 \| tee .team/evidence/builds/next_build.log` |
| SME | State management unit tests pass | Vitest results for store tests in `.team/evidence/tests/unit/` |
| AIE | API integration tests pass, type contracts valid | `npx tsc --noEmit` + Vitest mock API tests |
| A11Y | axe-core audit zero critical/serious | `npx axe-core-cli http://localhost:3000 > .team/evidence/tests/accessibility/axe_audit.json` |
| A11Y | Lighthouse accessibility score >= 90 | Lighthouse JSON output in `.team/evidence/tests/performance/` |
| QA | Playwright E2E tests pass | `npx playwright test --reporter=json > .team/evidence/tests/e2e/playwright_results.json` |
| QA | Jest/Vitest coverage >= 80% | Coverage HTML report in `.team/evidence/tests/unit/coverage/` |
| QA | ESLint zero errors | `npx eslint . 2>&1 \| tee .team/evidence/tests/static/eslint.log` |
| QA | Lighthouse all categories >= 90 | `npx lhci collect` -> `.team/evidence/tests/performance/lighthouse.json` |
| QA | Bundle size within budget | `npx next build` + `npx @next/bundle-analyzer` output |

### Evidence Manifest (Per Agent)

Every agent writes to `.team/evidence/manifests/{ROLE}_manifest.md`:

```markdown
# Evidence Manifest -- {AGENT_ROLE}
## Task: {task_description}
## Date: {ISO_8601_timestamp}

### Artifacts Produced
- [ ] `src/components/Button/Button.tsx` -- Button component
- [ ] `src/components/Button/Button.test.tsx` -- Button unit tests
- [ ] `src/components/Button/Button.stories.tsx` -- Storybook story

### Evidence Collected
- [ ] TypeScript compile: `.team/evidence/builds/tsc_output.log` (0 errors)
- [ ] Build success: `.team/evidence/builds/next_build.log` (compiled successfully)
- [ ] Vitest results: `.team/evidence/tests/unit/vitest_results.xml` (86/86 passing)
- [ ] Coverage: `.team/evidence/tests/unit/coverage/index.html` (88% line coverage)
- [ ] ESLint: `.team/evidence/tests/static/eslint.log` (0 errors, 0 warnings)

### Verification Steps (Reproducible)
1. `cd /path/to/project`
2. `npm install`
3. `npm run build`
4. `npm test -- --coverage`
5. `npx eslint .`

### Status: VERIFIED / UNVERIFIED
```

---

## 8. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally. React projects must compile TypeScript cleanly, pass all linters, build successfully, and meet performance budgets.

### React Local Install Protocol

```bash
# STEP 1: Environment verification
node --version > .team/evidence/env_react.txt 2>&1
npm --version >> .team/evidence/env_react.txt 2>&1
npx --version >> .team/evidence/env_react.txt 2>&1

# STEP 2: Dependency installation
npm install \
  2>&1 | tee .team/evidence/deps/npm_install.log

# STEP 3: Dependency audit
npm audit --json > .team/evidence/deps/npm_audit.json 2>&1 || true
npm ls --json > .team/evidence/deps/npm_ls.json 2>&1 || true

# STEP 4: TypeScript compilation
npx tsc --noEmit \
  2>&1 | tee .team/evidence/builds/tsc_output.log

# STEP 5: ESLint
npx eslint . --format json --output-file .team/evidence/tests/static/eslint.json \
  2>&1 | tee .team/evidence/tests/static/eslint.log

# STEP 6: Unit tests with coverage
npx vitest run \
  --coverage \
  --reporter=verbose \
  --reporter=junit --outputFile=.team/evidence/tests/unit/vitest_results.xml \
  2>&1 | tee .team/evidence/tests/unit/vitest_output.log
cp -r coverage/ .team/evidence/tests/unit/coverage/ 2>/dev/null || true

# STEP 7: Production build
npm run build \
  2>&1 | tee .team/evidence/builds/next_build.log

# STEP 8: Bundle analysis
npx next build 2>&1 | grep -E "(Route|Size|First)" > .team/evidence/builds/bundle_analysis.txt || true
```

### Playwright E2E Protocol

```bash
# Install Playwright browsers
npx playwright install --with-deps chromium firefox webkit

# Run E2E tests
npx playwright test \
  --reporter=json \
  --reporter=html \
  2>&1 | tee .team/evidence/tests/e2e/playwright_output.log
cp -r test-results/ .team/evidence/tests/e2e/test-results/ 2>/dev/null || true
cp -r playwright-report/ .team/evidence/tests/e2e/playwright-report/ 2>/dev/null || true

# Run with sharding for parallel execution
npx playwright test --shard=1/4 2>&1 | tee .team/evidence/tests/e2e/shard_1.log
npx playwright test --shard=2/4 2>&1 | tee .team/evidence/tests/e2e/shard_2.log
npx playwright test --shard=3/4 2>&1 | tee .team/evidence/tests/e2e/shard_3.log
npx playwright test --shard=4/4 2>&1 | tee .team/evidence/tests/e2e/shard_4.log
```

### Lighthouse Audit Protocol

```bash
# Start dev/preview server
npm run build && npx next start &
SERVER_PID=$!
sleep 5

# Run Lighthouse CI
npx lhci collect \
  --url=http://localhost:3000 \
  --numberOfRuns=3 \
  2>&1 | tee .team/evidence/tests/performance/lighthouse_collect.log

npx lhci assert \
  --preset=lighthouse:recommended \
  2>&1 | tee .team/evidence/tests/performance/lighthouse_assert.log

# Save Lighthouse JSON
npx lighthouse http://localhost:3000 \
  --output=json \
  --output-path=.team/evidence/tests/performance/lighthouse.json \
  --chrome-flags="--headless" \
  2>&1 | tee .team/evidence/tests/performance/lighthouse_run.log

kill $SERVER_PID 2>/dev/null
```

### Accessibility Audit Protocol

```bash
# Run axe-core on dev server
npm run dev &
DEV_PID=$!
sleep 5

npx axe http://localhost:3000 \
  --exit \
  2>&1 | tee .team/evidence/tests/accessibility/axe_audit.log

# Storybook accessibility check
npx storybook build
npx test-storybook --url http://localhost:6006 \
  2>&1 | tee .team/evidence/tests/accessibility/storybook_a11y.log

kill $DEV_PID 2>/dev/null
```

---

## 9. ATOMIC COMMIT PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 3

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

### React-Specific Commit Types

| Type | When | Example |
|------|------|---------|
| `feat` | New component, page, hook, store | `feat(ui): add DataTable component with sorting [#8]` |
| `fix` | Bug fix, hydration fix, state bug | `fix(auth): resolve hydration mismatch on login page [#22]` |
| `test` | Vitest, Playwright, Storybook test | `test(ui): add Playwright E2E for checkout flow [#14]` |
| `refactor` | Component restructure, hook extraction | `refactor(dashboard): extract useMetrics hook from DashboardPage` |
| `chore` | Dependencies, config, tooling | `chore(deps): bump next to 15.1.0` |
| `ci` | CI workflow changes | `ci(actions): add Playwright sharding with 4 workers [#3]` |
| `perf` | Bundle optimization, lazy loading | `perf(routes): lazy-load admin module with React.lazy [#30]` |
| `a11y` | Accessibility improvement | `a11y(nav): add ARIA landmarks and skip-to-content link [#20]` |
| `style` | Design tokens, CSS, Tailwind | `style(tokens): update color palette for dark mode` |
| `evidence` | Adding proof/evidence artifacts | `evidence(qa): add Lighthouse + Playwright reports` |

### Rules

1. **One logical change per commit** -- never bundle a component + hook + story + test
2. **Reference issue number** -- `feat(checkout): add payment form component [#12]`
3. **Include evidence reference** -- point to proof in `.team/evidence/`
4. **Never commit secrets** -- API keys, `.env.local`, auth tokens must never enter the repository
5. **Never commit build artifacts** -- `.next/`, `out/`, `node_modules/` must be gitignored
6. **Run `eslint` + `tsc --noEmit` before every commit** -- zero errors policy

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
| # | Hash | Agent | Type | Description | Issue | Wave | Component | Evidence |
|---|------|-------|------|-------------|-------|------|-----------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | -- | manifest |
| 2 | def5678 | UIA | style | design tokens + Tailwind config | #4 | 2 | tokens | storybook_build.log |
| 3 | ghi9012 | RCE | feat | Button + Input primitives | #8 | 2 | ui | vitest_results.xml |
| 4 | jkl3456 | SME | feat | auth Zustand store | #10 | 2 | state | vitest_output.log |
```

---

## 10. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### React Frontend Test Pyramid

```
                       +----------+
                       | Release  |  <- Production build smoke test, deployment verify
                      +------------+
                      | Performance|  <- Lighthouse CI (all 4 categories >= 90)
                     +--------------+
                     | Accessibility |  <- axe-core audit, WCAG 2.1 AA compliance
                    +----------------+
                    |  E2E Tests      |  <- Playwright cross-browser tests
                   +------------------+
                   | Visual Regression |  <- Storybook + Chromatic / Percy
                  +--------------------+
                  |    Unit Tests       |  <- Vitest + React Testing Library
                 +----------------------+
                 | Static Analysis       |  <- ESLint, TypeScript strict, Prettier
                 +-----------------------+
```

### Coverage Requirements

| Layer | Minimum | Tools | Blocking? |
|-------|---------|-------|-----------|
| Static Analysis | Zero ESLint errors, zero TypeScript errors | ESLint, `tsc --noEmit`, Prettier --check | YES |
| Unit Tests | >= 80% line coverage | Vitest, React Testing Library, @testing-library/user-event | YES |
| Visual Regression | All Storybook stories render without errors | Storybook build, Chromatic / Percy | WARN |
| E2E Tests | All critical user flows pass across Chrome, Firefox, WebKit | Playwright (3 browsers) | YES |
| Accessibility | Zero critical/serious WCAG 2.1 AA violations | axe-core, Lighthouse accessibility >= 90 | YES |
| Performance | Lighthouse all categories >= 90, bundle < 200KB gzip | Lighthouse CI, next/bundle-analyzer | YES |
| Security | No secrets, dependencies audited | gitleaks, npm audit | YES |
| Bundle Size | Main bundle < 200KB gzipped, no single chunk > 100KB | webpack-bundle-analyzer / @next/bundle-analyzer | WARN |

### QA Agent Testing Protocol

```
PHASE 1: STATIC ANALYSIS
+-- npx tsc --noEmit -> .team/evidence/builds/tsc_output.log
+-- npx eslint . -> .team/evidence/tests/static/eslint.log
+-- npx prettier --check "src/**/*.{ts,tsx}" -> .team/evidence/tests/static/prettier.log
+-- EVIDENCE: Save all output

PHASE 2: UNIT TESTS
+-- npx vitest run --coverage -> .team/evidence/tests/unit/
+-- Verify coverage >= 80% via c8/istanbul
+-- Run 3x to detect flaky tests
+-- EVIDENCE: Save JUnit XML + coverage HTML report

PHASE 3: STORYBOOK VISUAL REGRESSION
+-- npx storybook build -> .team/evidence/builds/storybook_build.log
+-- npx test-storybook -> .team/evidence/tests/visual/storybook_test.log
+-- Verify all stories render without errors
+-- EVIDENCE: Save build output + visual screenshots

PHASE 4: E2E TESTS (PLAYWRIGHT)
+-- npx playwright test --project=chromium -> .team/evidence/tests/e2e/
+-- npx playwright test --project=firefox
+-- npx playwright test --project=webkit
+-- Verify all critical user flows pass
+-- EVIDENCE: Save Playwright JSON report + HTML report + screenshots

PHASE 5: ACCESSIBILITY AUDIT
+-- axe-core scan on all pages -> .team/evidence/tests/accessibility/axe_audit.json
+-- Verify: zero critical/serious violations
+-- Keyboard navigation manual checklist -> .team/evidence/tests/accessibility/keyboard_nav.md
+-- EVIDENCE: Save axe JSON + Lighthouse accessibility score

PHASE 6: PERFORMANCE AUDIT
+-- Lighthouse CI collect (3 runs) -> .team/evidence/tests/performance/
+-- Verify: Performance >= 90, Accessibility >= 90, Best Practices >= 90, SEO >= 90
+-- Bundle size analysis -> .team/evidence/builds/bundle_analysis.txt
+-- Verify: main bundle < 200KB gzipped
+-- EVIDENCE: Save Lighthouse JSON + bundle report

PHASE 7: SECURITY CHECK
+-- npm audit -> .team/evidence/tests/security/npm_audit.json
+-- gitleaks detect -> .team/evidence/tests/security/gitleaks.log
+-- Verify: no high/critical vulnerabilities, no secrets
+-- EVIDENCE: Save audit output
```

---

## 11. GITHUB ACTIONS -- LOCAL TESTING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 5

### Mandate
All CI/CD workflows MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### React CI Workflow

```yaml
# .github/workflows/react.yml
name: React CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - name: TypeScript check
        run: npx tsc --noEmit
      - name: ESLint
        run: npx eslint . --format json --output-file eslint-report.json
      - name: Prettier check
        run: npx prettier --check "src/**/*.{ts,tsx}"
      - uses: actions/upload-artifact@v4
        with:
          name: lint-results-node${{ matrix.node-version }}
          path: eslint-report.json

  unit-tests:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck]
    strategy:
      matrix:
        node-version: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - name: Vitest with coverage
        run: npx vitest run --coverage --reporter=junit --outputFile=test-results.xml
      - uses: actions/upload-artifact@v4
        with:
          name: test-results-node${{ matrix.node-version }}
          path: |
            test-results.xml
            coverage/

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [unit-tests]
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Build
        run: npm run build
      - name: Playwright E2E (shard ${{ matrix.shard }}/4)
        run: npx playwright test --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-shard${{ matrix.shard }}
          path: playwright-report/

  lighthouse:
    runs-on: ubuntu-latest
    needs: [unit-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Build
        run: npm run build
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --collect.startServerCommand="npx next start" --collect.url="http://localhost:3000"
      - uses: actions/upload-artifact@v4
        with:
          name: lighthouse-results
          path: .lighthouseci/

  storybook:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Build Storybook
        run: npx storybook build
      - uses: actions/upload-artifact@v4
        with:
          name: storybook-build
          path: storybook-static/

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: npm audit
        run: npm audit --json > npm-audit.json || true
      - uses: actions/upload-artifact@v4
        with:
          name: security-reports
          path: npm-audit.json
```

### Local Validation with `act`

```bash
# Validate workflow syntax
yamllint .github/workflows/react.yml
actionlint .github/workflows/react.yml

# Dry run
act -n 2>&1 | tee .team/evidence/ci/act_dryrun.log

# Run specific jobs
act -j lint-and-typecheck 2>&1 | tee .team/evidence/ci/act_lint.log
act -j unit-tests 2>&1 | tee .team/evidence/ci/act_tests.log

# Full push event
act push 2>&1 | tee .team/evidence/ci/act_push.log
```

---

## 12. PM KANBAN -- REAL-TIME TRACKING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 6

### Mandate
The PM MUST maintain the GitHub Project board in real-time. Every state change is reflected immediately.

### Board Columns (GitHub Projects V2)

| Column | Meaning | Cards Move Here When |
|--------|---------|---------------------|
| **Backlog** | Not started | Issue created, not yet assigned |
| **Sprint Ready** | Prioritized for current wave | PM approves for current wave |
| **In Progress** | Agent actively working | Agent starts task |
| **In Review** | Work done, awaiting TL review | Agent completes, evidence submitted |
| **Testing** | QA running tests + audits | QA picks up for frontend testing |
| **Done** | Verified (tests pass, audits clean) | QA passes + all checks green |
| **Blocked** | Cannot proceed | API dependency, design blocker, or accessibility violation |

### PM Real-Time Update Protocol

```
ON WAVE START:
+-- Move all wave issues from "Backlog" to "Sprint Ready"
+-- Comment: "Wave {N} started -- {timestamp}"
+-- Update .team/KANBAN.md

ON AGENT START:
+-- Move issue from "Sprint Ready" to "In Progress"
+-- Comment: "Agent {ROLE} started work -- {timestamp}"
+-- Add "status:in-progress" label

ON AGENT COMPLETE:
+-- Move issue from "In Progress" to "In Review"
+-- Comment with: evidence manifest, commit hash, Vitest summary, coverage percent
+-- Add "status:in-review" label, add component label

ON QA PASS:
+-- Move issue from "Testing" to "Done"
+-- Close issue with: "Verified. All tests pass, Lighthouse >90, a11y clean. Evidence: [link]"
+-- Add "status:done" + "evidence:verified" labels

ON BLOCK:
+-- Move issue to "Blocked"
+-- Comment: "BLOCKED: {reason}. Component: {component}. Dependency: {dep}."
+-- Create linked blocking issue if needed
```

### React-Specific Label Set

```bash
for label in "component:ui:0075CA" "component:page:FF6D00" "component:state:795548" "component:api:4CAF50" "type:a11y:E91E63" "type:perf:9C27B0" "type:e2e:00BCD4" "type:visual:FF9800" "layer:server:8BC34A" "layer:client:03A9F4" "status:backlog:CCCCCC" "status:in-progress:d93f0b" "status:in-review:fbca04" "status:testing:5319e7" "status:done:0e8a16" "status:blocked:000000" "evidence:verified:00C853" "evidence:missing:FF1744"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

---

## 13. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| Build Gate | After Engineering | `tsc --noEmit` + `next build` pass with zero errors | Re-spawn RCE/UIA |
| Component Test Gate | After Engineering | Vitest passes, coverage >= 80% | Re-spawn RCE |
| E2E Test Gate | After QA | Playwright tests all pass across Chrome, Firefox, WebKit | Enter Bug Fix Loop |
| Accessibility Audit | After A11Y | axe-core scan: zero critical/serious WCAG 2.1 AA violations | Re-spawn A11Y + RCE |
| Lighthouse Performance | After QA | All categories (Performance, Accessibility, Best Practices, SEO) > 90 | Re-spawn RCE/UIA for optimization |
| Bundle Size Check | After Build | Main bundle < 200KB gzipped, no single chunk > 100KB | Re-spawn SME/RCE for code-splitting |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_SIGNOFF.md` approved | RM lists blocking items |
| Evidence Complete | Before QA | Every agent has evidence manifest with build logs, test results, coverage | Re-spawn agent to collect evidence |
| TypeScript Clean Gate | Before QA | `tsc --noEmit` produces zero errors across entire project | Re-spawn RCE + AIE |
| ESLint Clean Gate | Before QA | `eslint .` produces zero errors, zero warnings | Re-spawn responsible engineer |
| Storybook Build Gate | Before Release | `storybook build` succeeds, all stories render without errors | Re-spawn UIA + RCE |
| CI Validation Gate | Before push | `act push` succeeds locally, `actionlint` clean for React CI workflow | Fix workflow, re-test |
| No Secrets Gate | Every commit | `gitleaks detect` finds zero secrets (no API keys, no .env values) | HARD STOP, rotate secrets |

---

## 14. `.team/` DIRECTORY LAYOUT

```
.team/
+-- PROJECT_CHARTER.md
+-- MILESTONES.md
+-- KANBAN.md
+-- TIMELINE.md
+-- RISK_REGISTER.md
+-- DECISION_LOG.md
+-- retros/
|   +-- RETRO_WAVE_1.md       (Wave 1 retrospective)
|   +-- RETRO_WAVE_2.md       (Wave 2 retrospective)
+-- reviews/
|   +-- CODE_REVIEW_WAVE_2.md (Code review report)
+-- learnings/
|   +-- INDEX.md              (Searchable learning index)
+-- rollback/
|   +-- ROLLBACK_PLAN.md      (Current rollback plan)
+-- contracts/
|   +-- CONTRACT_*.md         (Cross-team handoff contracts)

+-- plans/
|   +-- PLAN_A.md          (PM alternative plan A)
|   +-- PLAN_B.md          (PM alternative plan B)
|   +-- PLAN_C.md          (PM alternative plan C, optional)
|   +-- VERDICT.md         (Judge evaluation and recommendation)

+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- COMMIT_LOG.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- manifests/
|   |   +-- PM_manifest.md
|   |   +-- UIA_manifest.md
|   |   +-- RCE_manifest.md
|   |   +-- SME_manifest.md
|   |   +-- AIE_manifest.md
|   |   +-- A11Y_manifest.md
|   |   +-- QA_manifest.md
|   +-- builds/
|   |   +-- tsc_output.log
|   |   +-- next_build.log
|   |   +-- storybook_build.log
|   |   +-- bundle_analysis.txt
|   +-- tests/
|   |   +-- static/
|   |   |   +-- eslint.log
|   |   |   +-- eslint.json
|   |   |   +-- prettier.log
|   |   +-- unit/
|   |   |   +-- vitest_results.xml
|   |   |   +-- vitest_output.log
|   |   |   +-- coverage/
|   |   +-- e2e/
|   |   |   +-- playwright_results.json
|   |   |   +-- playwright_output.log
|   |   |   +-- playwright-report/
|   |   |   +-- test-results/
|   |   +-- visual/
|   |   |   +-- storybook_test.log
|   |   +-- accessibility/
|   |   |   +-- axe_audit.json
|   |   |   +-- axe_audit.log
|   |   |   +-- storybook_a11y.log
|   |   |   +-- keyboard_nav.md
|   |   +-- performance/
|   |   |   +-- lighthouse.json
|   |   |   +-- lighthouse_collect.log
|   |   |   +-- lighthouse_assert.log
|   |   +-- security/
|   |   |   +-- gitleaks.log
|   |   |   +-- npm_audit.json
|   +-- deps/
|   |   +-- npm_install.log
|   |   +-- npm_audit.json
|   |   +-- npm_ls.json
|   +-- diffs/
|   +-- ci/
|   |   +-- act_push.log
|   |   +-- act_dryrun.log
|   |   +-- actionlint.log
+-- ci/
|   +-- .github/
|       +-- workflows/
|           +-- react.yml
+-- component-architecture/
|   +-- COMPONENT_TREE.md
|   +-- DESIGN_TOKENS.md
|   +-- RESPONSIVE_STRATEGY.md
+-- design-system/
|   +-- PRIMITIVES.md
|   +-- PATTERNS.md
|   +-- STORYBOOK_STORIES.md
+-- state-management/
|   +-- STATE_ARCHITECTURE.md
|   +-- STORE_DESIGN.md
|   +-- CACHE_STRATEGY.md
+-- api-integration/
|   +-- API_CLIENT.md
|   +-- HOOKS.md
|   +-- ERROR_HANDLING.md
|   +-- TYPE_CONTRACTS.md
+-- accessibility/
|   +-- AUDIT_RESULTS.md
|   +-- ARIA_GUIDE.md
|   +-- KEYBOARD_NAV.md
|   +-- WCAG_CHECKLIST.md
+-- qa/
|   +-- TEST_STRATEGY.md
|   +-- TEST_CASES.md
|   +-- COVERAGE_REPORT.md
|   +-- E2E_RESULTS.md
|   +-- LIGHTHOUSE_REPORT.md
|   +-- QA_SIGNOFF.md
+-- releases/
|   +-- RELEASE_CHECKLIST.md
|   +-- CHANGELOG.md
|   +-- ROLLBACK_PLAN.md
|   +-- RELEASE_NOTES.md
|   +-- DEPLOYMENT_SIGNOFF.md
+-- marketing/
+-- legal/
```

---

## 15. REPORTING SYSTEM

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Reports include React-specific metrics: Lighthouse scores, bundle size, component count, test coverage, E2E pass rate, accessibility violation count, Storybook story count
- Final summary generated at project completion

### Enhanced Report Contents

Every PPTX and PDF report MUST include:

1. **Evidence Dashboard** -- count of evidence artifacts per agent, test pass rates, coverage percentages
2. **Commit Activity** -- commits per wave, per agent, with linked issue references
3. **Lighthouse Score Trend** -- Performance, Accessibility, Best Practices, SEO over time
4. **Bundle Size Trend** -- main bundle, per-route chunks, total gzipped size over time
5. **Test Coverage Trend** -- Vitest line/branch coverage, E2E test pass rate
6. **Accessibility Scorecard** -- axe-core violation count by severity, WCAG compliance status
7. **CI/CD Status** -- GitHub Actions workflow pass/fail, local `act` validation results across Node versions
8. **Kanban Velocity** -- cards moved per reporting period, blocked items by component

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Recovery
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Build failure**: Capture `tsc` and `next build` error output, inject into re-spawn prompt
- **Hydration mismatch**: Re-spawn RCE with server/client component boundary details and error stack
- **Playwright timeout**: Re-spawn QA with test name, selector details, and page screenshot
- **Lighthouse regression**: Re-spawn RCE/UIA with Lighthouse JSON diff and specific recommendations

### Session Commands

| Command | Action |
|---------|--------|
| `--team react --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team learnings` | Show captured learnings from .team/learnings/ |
| `team deps` | Spawn DEPGUARD agent to audit dependencies |
| `team retro` | Spawn RETRO agent to analyze last completed wave |
| `team review` | Spawn CR agent to review current code changes |
| `team judge` | Spawn Judge to evaluate current plans in `.team/plans/` |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

*React Frontend Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 15 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Driven | Locally-Tested*


---

## Section 19: UAT — User Acceptance Testing (MANDATORY)

> **Protocol Reference**: `shared/UAT_PROTOCOL.md`
> **Wave**: 3.7 (between QA automated testing and Release)
> **Coverage Mandate**: >= 95% of all user-facing CTAs tested and passing
> **Blocking Gate**: Release wave CANNOT proceed without UAT_PASS

### 19.1 UAT Wave Integration

```
Wave 3:   QA — Automated Testing (unit, integration, E2E, security, performance)
Wave 3.5: Bug Fix Loop (conditional)
Wave 3.7: UAT — User Acceptance Testing (BLOCKING GATE)
Wave 4:   Release
```

### 19.2 Domain-Specific UAT Focus Areas

| Category | What to Test |
|----------|-------------|
| Cross-Browser | Chrome, Firefox, Safari, Edge - pixel-perfect rendering |
| Responsive | 320px, 768px, 1024px, 1440px, 1920px breakpoints |
| PWA Offline | Service worker, cached pages, offline form submission |
| Dark Mode | Toggle, system preference sync, all components themed |
| Form Wizards | Multi-step, back/forward, validation per step, save draft |
| Drag and Drop | Reorder lists, file drop zones, touch device support |
| Keyboard Shortcuts | Hotkeys, focus management, modal escape, tab order |
| i18n/l10n | Language switch, RTL layout, date/currency format |

### 19.3 UAT Execution Steps

1. **CTA Discovery** — QA enumerates ALL pages, routes, interactive elements. Produces `UAT_COVERAGE_MATRIX.md`
2. **Test Case Authoring** — QA writes test cases per `shared/UAT_PROTOCOL.md` format. Minimum >= 95% CTA coverage
3. **Test Data Preparation** — QA + BE seed test users, entities, files for ALL user roles
4. **Round 1 Execution** — Execute ALL test cases. Capture before/after screenshots. Log defects as GitHub issues
5. **Defect Triage** — TL + QA classify: Critical/High MUST be fixed. Medium/Low documented
6. **Bug Fix** — Engineers fix Critical + High defects. Each fix = atomic commit with issue reference
7. **Round 2 Regression** — Re-execute failed cases. Verify fixes. Regression-test related passing cases
8. **Coverage Verification** — Confirm >= 95% CTA coverage. If below, write additional cases and re-execute
9. **Report Generation** — Produce `UAT_REPORT_FINAL.md` + PDF + PPTX + JSON/CSV exports
10. **Sign-Off** — QA submits `UAT_SIGNOFF.md`, TL reviews, user approves (BLOCKING)

### 19.4 UAT Blocking Gate

```
GATE: UAT_PASS
  TRIGGER: After Wave 3.7 complete
  CRITERIA:
    [ ] All P0 test cases PASS (zero failures)
    [ ] All P1 test cases PASS (zero failures)
    [ ] P2 test cases: <= 3 failures (none Critical/High)
    [ ] CTA coverage >= 95%
    [ ] Compliance mapping 100% for applicable regulations
    [ ] All Critical/High defects resolved
    [ ] UAT_REPORT_FINAL.md exists with complete data
    [ ] UAT_SIGNOFF.md approved by TL + user
  BLOCKING: YES — Release (Wave 4) CANNOT proceed without UAT_PASS
```

### 19.5 UAT Evidence Requirements

| Evidence Type | When | File Pattern |
|--------------|------|--------------|
| Screenshot (before) | Before CTA action | `.team/uat/evidence/screenshots/{ID}_before.png` |
| Screenshot (after) | After successful CTA | `.team/uat/evidence/screenshots/{ID}_after.png` |
| Screenshot (error) | On CTA failure | `.team/uat/evidence/screenshots/{ID}_error.png` |
| Console log | On FAIL result | `.team/uat/evidence/logs/{ID}_console.log` |
| Network HAR | On FAIL result | `.team/uat/evidence/logs/{ID}_network.har` |
| API response | For API-driven CTAs | `.team/uat/evidence/logs/{ID}_api.json` |

### 19.6 UAT Compliance Mapping

Every UAT test case MUST be linked to at least one compliance framework:
- **ISO 25010** — Software quality (always applicable)
- **GDPR** — If handling EU personal data
- **SOC 2 Type II** — If security audit required
- **WCAG 2.1 AA** — If accessibility requirements
- **PCI DSS v4.0** — If payment processing
- **HIPAA** — If health data

### 19.7 Mission Control Integration

- **Dashboard**: `http://localhost:4200/uat`
- **Event category**: `UAT`
- **Event types**: `case_pass`, `case_fail`, `case_blocked`, `defect_found`, `defect_resolved`, `round_complete`, `coverage_verified`, `signoff_complete`
- **Downloads**: Individual test case, suite, or full export (JSON/CSV)
- **Real-time**: Live event stream shows last 2000 events

### 19.8 UAT Artifacts

```
.team/uat/
├── UAT_MASTER_INDEX.md
├── UAT_COVERAGE_MATRIX.md
├── UAT_COMPLIANCE_MAP.md
├── UAT_SIGNOFF.md
├── suites/
├── scenarios/
├── evidence/
│   ├── screenshots/
│   ├── videos/
│   └── logs/
└── reports/
    ├── UAT_REPORT_FINAL.md
    ├── UAT_REPORT_FINAL.pdf
    ├── UAT_REPORT_FINAL.pptx
    └── exports/ (JSON + CSV)
```
