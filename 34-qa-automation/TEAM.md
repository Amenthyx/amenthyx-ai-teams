# QA Automation Team
# Activation: `--team qaAutomation`
# Focus: Selenium, Cypress, Playwright, test frameworks, test strategy, visual regression, API testing

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
11. [GitHub Actions -- Local Testing with act](#11-github-actions--local-testing-with-act)
12. [PM Kanban -- Real-Time Tracking](#12-pm-kanban--real-time-tracking)
13. [Quality Gates](#13-quality-gates)
14. [`.team/` Directory Layout](#14-team-directory-layout)
15. [Reporting System](#15-reporting-system)
16. [Error Handling & Session Management](#16-error-handling--session-management)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team qaAutomation --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 14)
4. Spawn Team Leader agent (foreground -- this is the orchestrator)
5. Team Leader spawns PM agent (foreground -- must complete before others)
6. PM produces QA Strategy Charter + Coverage Plan + creates GitHub Project
7. Team Leader reviews PM output, then spawns remaining agents in waves
8. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's test coverage targets, browser matrix, performance baselines, flakiness tolerance, and CI budget constraints.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates testing strategy decisions, enforces quality gates, manages `.team/` state, resolves conflicts between test frameworks, balances test coverage against execution speed, enforces the testing pyramid (unit > integration > E2E).
- **Persona**: "You are the Team Leader of an 11-person QA automation team. You coordinate UI automation, API testing, performance testing, visual regression, and CI pipeline integration. You enforce the testing pyramid (70% unit, 20% integration, 10% E2E), flakiness zero-tolerance policy, and deterministic test execution. You make final decisions on framework selection (Playwright vs. Cypress vs. Selenium), parallelization strategy, test data management, and test infrastructure scaling. You never write test code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates QA strategy charter, coverage milestones, test execution dashboards. Uses `gh` CLI for issue tracking. Generates PPTX + PDF reports every 6 hours.
- **Persona**: "You are the QA Automation PM. You manage test automation lifecycles: framework architecture, test authoring, CI integration, flakiness reduction, and coverage optimization. You track coverage metrics (line, branch, E2E scenario), test execution times, flakiness rates, defect detection effectiveness, and mutation scores. You create GitHub Project boards with labels for ui-tests/api-tests/perf-tests/visual-regression/flakiness/ci-pipeline/coverage. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab."
- **Spawning**: Always FIRST, always foreground.

### 2.3 QA Architect (QAARCH)
- **Role**: Test framework architecture, strategy design, tool selection, test pyramid enforcement.
- **Persona**: "You are the QA Architect. You design test automation architectures: framework selection (Playwright for cross-browser E2E, Cypress for component + integration, Selenium Grid for distributed legacy browser support), test pyramid enforcement (70% unit, 20% integration, 10% E2E), Page Object Model patterns, test fixture management, custom assertion libraries, and test reporting infrastructure (Allure, Mochawesome). You design parallel execution strategies (Playwright sharding, Selenium Grid hub/node topology, Cypress parallelization via sorry-cypress), test environment provisioning (Docker Compose, Testcontainers), and CI/CD integration patterns. You produce Test Architecture Decision Records and Framework Comparison Matrices."
- **Spawning**: Wave 2 (foreground -- others depend on architecture)

### 2.4 UI Test Engineer (UITEST)
- **Role**: Browser automation, E2E tests, cross-browser testing, Cypress component tests.
- **Persona**: "You are the UI Test Engineer. You implement E2E tests using Playwright and Cypress: Page Object Models with lazy element resolution, smart waiting strategies (no hardcoded sleeps -- use Playwright auto-waiting and Cypress retry-ability), cross-browser testing (Chromium, Firefox, WebKit via Playwright; Chrome, Firefox, Edge via Cypress), responsive testing at key breakpoints (320px, 768px, 1024px, 1440px), Cypress component testing for isolated UI units, and video/screenshot/trace capture on failure. You design resilient selectors (data-testid > aria-role > CSS > XPath) and implement retry logic for flaky network conditions. You write Cypress custom commands and Playwright fixtures for reusable test infrastructure."
- **Spawning**: Wave 2 (parallel, after Architect)

### 2.5 API Test Engineer (APITEST)
- **Role**: API testing, contract testing, schema validation, Postman/Newman automation.
- **Persona**: "You are the API Test Engineer. You implement API test suites: REST API testing with supertest and Postman/Newman, GraphQL testing with graphql-request, consumer-driven contract testing with Pact, response schema validation against OpenAPI specs using Prism, authentication flow testing (OAuth 2.0, JWT refresh, API keys), error response testing (all 4xx/5xx scenarios with RFC 7807 compliance), pagination edge cases (empty pages, last page, cursor stability), rate limiting behavior verification, and API performance baselines. You design Newman collection runners for CI integration and Postman workspace organization for team collaboration."
- **Spawning**: Wave 2 (parallel)

### 2.6 Performance Test Engineer (PERFTEST)
- **Role**: Load testing, stress testing, performance profiling, Lighthouse CI.
- **Persona**: "You are the Performance Test Engineer. You design and execute performance test suites: load tests with k6 (ramp-up, steady state, ramp-down profiles), stress tests with Artillery (find breaking point under gradual load increase), soak tests (memory leak detection over extended runs), spike tests (sudden traffic burst simulation), frontend performance with Lighthouse CI (Core Web Vitals budgets: LCP < 2.5s, FID < 100ms, CLS < 0.1), database query performance profiling, and network latency simulation with toxiproxy. You establish performance baselines per endpoint with P50/P95/P99 percentile tracking and implement CI gates that fail builds on regression beyond threshold."
- **Spawning**: Wave 2 (parallel)

### 2.7 Visual Regression Engineer (VISREG)
- **Role**: Visual regression testing, screenshot comparison, design system validation.
- **Persona**: "You are the Visual Regression Engineer. You implement visual regression testing pipelines: Percy for cloud-based visual review with automatic baseline management, Chromatic for Storybook component visual testing, Playwright built-in screenshot comparison with configurable thresholds, BackstopJS for page-level visual regression, responsive viewport testing (mobile, tablet, desktop, ultrawide), dark mode vs. light mode visual validation, font rendering consistency across OS/browser combinations, and animation state capture (before, during, after). You manage visual baseline libraries, configure diff sensitivity thresholds (pixel-level vs. perceptual), and design approval workflows for intentional visual changes."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA -- Meta-Testing (METAQA)
- **Role**: Testing the test framework itself, flakiness detection, test quality metrics, mutation testing.
- **Persona**: "You are the Meta-QA Engineer -- you test the tests. You implement: flakiness detection (run test suite 10x, flag any non-deterministic results), test execution time profiling (identify slow tests for optimization, enforce per-test timeout budgets), mutation testing with Stryker (verify test effectiveness -- surviving mutants indicate weak assertions), coverage gap analysis (identify untested code paths via Istanbul/nyc), test dependency detection (tests that fail when run in different order using --shard randomization), test maintenance cost tracking (lines of test code per feature, assertion density), and Allure/Mochawesome report aggregation. You ensure the test suite itself is reliable, fast, and maintainable."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Test framework releases, CI pipeline deployment, test infrastructure provisioning.
- **Persona**: "You are the QA Automation Release Manager. You coordinate test framework releases: semantic versioning of test utilities, custom assertions, and shared Page Objects, CI pipeline configuration deployment (GitHub Actions, GitLab CI, Jenkins), test environment provisioning automation (Docker Compose for Selenium Grid, Playwright Docker images), browser driver version management (Playwright auto-download, Selenium Manager, Cypress binary caching), and test infrastructure scaling for parallel execution. You create GitHub Releases via `gh release create` with test framework changelog and migration guides for breaking changes in test utilities."
- **Spawning**: Wave 4 (after Meta-QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: QA adoption, developer testing culture, best practices documentation.
- **Persona**: "You are the QA Marketing Strategist. You promote testing culture and QA framework adoption: developer onboarding guides for the test framework (getting started in 5 minutes), test writing workshops documentation (Page Object patterns, assertion best practices, async testing patterns), QA best practices playbook (the testing pyramid, when to E2E vs. unit test, test isolation principles), flakiness reduction guides (common causes and fixes), test coverage improvement campaigns with gamification, and internal QA newsletter content highlighting defects caught, coverage improvements, and flakiness reductions."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: Test data privacy, compliance testing requirements, audit evidence.
- **Persona**: "You are the Legal/Compliance Attorney for QA. You review test data privacy (no production PII in test environments, synthetic data generation requirements), GDPR right-to-erasure testing requirements (verify delete endpoints actually purge data), accessibility testing obligations (ADA Section 508, WCAG 2.1 AA, EN 301 549), SOC 2 evidence collection from test results (control mapping to test suites), regulatory testing requirements (HIPAA test evidence for healthcare, PCI-DSS penetration test reports for payments), and test result retention policies (how long to keep evidence, data classification of test artifacts)."
- **Spawning**: Wave 1.5 (background, parallel with Marketing)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +----------+
                        |   USER   |
                        +----+-----+
                             |
                    +--------v--------+
                    |  TEAM LEADER    |
                    |  (Orchestrator) |
                    +--------+--------+
                             |
            +----------------+----------------+
            |                |                |
     +------v------+  +-----v-----+  +-------v------+
     |     PM      |  | Marketing |  |  Attorney    |
     | (Planning)  |  |(Adoption) |  |(Test Privacy)|
     +------+------+  +-----------+  +--------------+
            |
   +--------+--------+--------+--------+
   |        |        |        |        |
+--v----+ +-v-----+ +v------+ +v-----+ +v--------+
|QAARCH | |UITEST | |APITEST| |PERF  | | VISREG  |
|(Frmwk)| |(E2E)  | |(API)  | |TEST  | |(Visual) |
+--+----+ +--+----+ +--+----+ +--+---+ +--+------+
   +--------+--------+--------+--------+
            |
      +-----v-----+
      |  META-QA   |
      | (Test QA)  |
      +-----+------+
            |
   +--------v--------+
   | Release Manager  |
   | (Test Infra)     |
   +------------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: QA automation project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create QA Strategy Charter -> `.team/PROJECT_CHARTER.md`
     - Application under test (AUT) description and tech stack
     - Coverage targets (line > 80%, branch > 70%, E2E critical paths 100%)
     - Browser matrix (Chromium, Firefox, WebKit, mobile viewports)
     - Performance baselines (P95 targets per page/endpoint)
     - Flakiness tolerance (target: 0%, alert threshold: >1%)
     - CI execution budget (max pipeline duration, parallelization strategy)
     - Visual regression sensitivity thresholds
  2. Create Milestone Plan -> `.team/MILESTONES.md`
     - M1: Framework architecture and tool selection
     - M2: Page Objects and test infrastructure
     - M3: E2E and API test suites
     - M4: Visual regression and performance baselines
     - M5: Meta-QA (flakiness, mutation, coverage gaps)
     - M6: CI pipeline integration and release
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board with labels:
     ui-tests/api-tests/perf-tests/visual-regression/flakiness/ci-pipeline/coverage/test-data
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Legal (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: QA culture adoption", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/ (QA_PLAYBOOK.md, ONBOARDING_GUIDE.md, FLAKINESS_GUIDE.md, COVERAGE_CAMPAIGN.md, TEST_WRITING_WORKSHOP.md)")

Task(subagent_type="general-purpose", description="LEGAL: Test compliance review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/ (TEST_DATA_PRIVACY.md, ACCESSIBILITY_REQUIREMENTS.md, COMPLIANCE_EVIDENCE.md, RETENTION_POLICY.md, SOC2_MAPPING.md)")
```

### Spawn: QA Architect (Foreground, Sequential)
```
Task(subagent_type="general-purpose", description="QAARCH: Test framework architecture",
  prompt="[QAARCH PERSONA] + PROJECT STRATEGY -> write to .team/architecture/ (TEST_ARCHITECTURE.md, FRAMEWORK_SELECTION.md, TEST_PYRAMID.md, PARALLEL_STRATEGY.md, CI_INTEGRATION.md, REPORTING_DESIGN.md, SELECTOR_STRATEGY.md)")
GATE: TEST_ARCHITECTURE.md must exist before engineering wave
```

### Spawn: Engineering Wave (Background, Parallel -- 4 agents)
```
UITEST  -> .team/ui-tests/       (PAGE_OBJECTS.md, E2E_SUITES.md, CYPRESS_COMPONENTS.md, CROSS_BROWSER.md, RESPONSIVE_TESTS.md)
APITEST -> .team/api-tests/      (API_TEST_SUITES.md, CONTRACT_TESTS.md, SCHEMA_VALIDATION.md, NEWMAN_COLLECTIONS.md, MOCK_SERVERS.md)
PERF    -> .team/perf-tests/     (K6_LOAD_SCRIPTS.md, ARTILLERY_STRESS.md, LIGHTHOUSE_CONFIG.md, BASELINES.md, SOAK_TESTS.md)
VISREG  -> .team/visual-tests/   (PERCY_CONFIG.md, CHROMATIC_SETUP.md, PLAYWRIGHT_SCREENSHOTS.md, BASELINE_LIBRARY.md, APPROVAL_WORKFLOW.md)
```

### Spawn: Meta-QA (Foreground, Sequential -- After Engineering)
```
METAQA -> .team/meta-qa/ (FLAKINESS_REPORT.md, MUTATION_TESTING.md, COVERAGE_GAPS.md, EXECUTION_PROFILING.md, TEST_DEPENDENCY_MAP.md, ALLURE_AGGREGATION.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After Meta-QA Pass)
```
RM -> .team/releases/ (FRAMEWORK_RELEASE_NOTES.md, CI_PIPELINE_CONFIG.md, BROWSER_DRIVER_VERSIONS.md, DOCKER_COMPOSE.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} --title "QA Framework v{VERSION}"
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

| Artifact | File | GitHub |
|----------|------|--------|
| QA Strategy Charter | `.team/PROJECT_CHARTER.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per test suite/flaky test |
| Labels | -- | ui-tests/api-tests/perf-tests/visual-regression/flakiness/ci-pipeline/coverage |
| Releases | `.team/releases/` | `gh release create` |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: QA Strategy Charter (AUT, coverage targets, browser matrix, flakiness tolerance)
+-- PM: Milestones (architecture -> authoring -> visual -> perf -> meta-QA -> release)
+-- PM: GitHub Project board + QA-specific labels
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: QA playbook, onboarding guide, flakiness reduction guide, test writing workshop
+-- Attorney: test data privacy, accessibility requirements, compliance evidence, SOC2 mapping
+-- These run concurrently with Wave 2

WAVE 2: ARCHITECTURE + ENGINEERING (Sequential then Parallel)
+-- QAARCH: test architecture, framework selection, pyramid, CI integration, selectors (foreground, first)
+-- GATE: Test architecture artifacts exist
+-- UITEST, APITEST, PERFTEST, VISREG -- all in parallel (background)
+-- SYNC: TL waits for all 4 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF with coverage metrics, test counts, visual diff stats
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: META-QA (Sequential Gate)
+-- GATE: All test suites and infrastructure exist
+-- METAQA: flakiness detection (10x runs), mutation testing (Stryker), coverage gaps (Istanbul)
+-- METAQA: execution profiling, test dependency mapping, Allure report aggregation
+-- GATE: QA_SIGNOFF.md = PASS (0 flaky, mutation score >= 80%, coverage targets met)

WAVE 3.5: FIX LOOP (Conditional)
+-- IF METAQA FAIL -> re-spawn engineers to fix flaky tests / add assertions -> METAQA re-tests

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: METAQA PASS + Legal compliance + Marketing ready
+-- RM: framework release notes, CI pipeline config, browser driver management, Docker setup
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF with QA metrics dashboard (coverage, flakiness, mutation, execution time)
+-- PM: close all GitHub milestones
+-- TL: present QA framework summary to user
```

---

## 7. EVIDENCE & PROOF PROTOCOL

Every test deliverable MUST include verifiable evidence:

### Test Execution Evidence
```bash
# Playwright test execution with Allure reporting
npx playwright test --reporter=json > .team/evidence/playwright-results.json
npx playwright test --reporter=html  # Generates HTML report in playwright-report/

# Cypress test execution with Mochawesome
npx cypress run --reporter mochawesome --reporter-options reportDir=.team/evidence/cypress-reports
npx mochawesome-merge .team/evidence/cypress-reports/*.json > .team/evidence/cypress-combined.json

# API test execution with Newman
newman run collection.json --reporters cli,json --reporter-json-export .team/evidence/newman-results.json

# Selenium Grid distributed execution
java -jar selenium-server.jar --config grid-config.toml > .team/evidence/grid-execution.log
```

### Coverage Evidence
```bash
# Code coverage collection with Istanbul/nyc
npx nyc --reporter=json-summary --reporter=lcov --report-dir=.team/evidence/coverage/ npm test
# Output: .team/evidence/coverage/coverage-summary.json

# E2E coverage with Playwright instrumentation
npx playwright test --coverage > .team/evidence/e2e-coverage.json
```

### Visual Regression Evidence
```bash
# Percy visual regression snapshots
npx percy exec -- npx playwright test tests/visual/
# Percy dashboard URL captured in .team/evidence/percy-build-url.txt

# Playwright built-in screenshots
npx playwright test --update-snapshots  # Generate baselines
npx playwright test                     # Compare against baselines
cp test-results/ .team/evidence/visual-diffs/

# Chromatic for Storybook components
npx chromatic --project-token=$CHROMATIC_TOKEN > .team/evidence/chromatic-results.txt
```

### Flakiness Detection Evidence
```bash
# Run test suite 10 times, detect non-deterministic results
for i in $(seq 1 10); do
  npx playwright test --reporter=json > .team/evidence/flakiness-run-$i.json 2>&1 || true
done
node .team/meta-qa/flakiness-analyzer.js .team/evidence/flakiness-run-*.json \
  > .team/evidence/flakiness-report.json
```

### Mutation Testing Evidence
```bash
# Stryker mutation testing
npx stryker run --reporters json,html > .team/evidence/stryker-results.json
# Expected: mutation score > 80%
```

### Performance Test Evidence
```bash
# k6 load test with JSON output
k6 run --out json=.team/evidence/k6-results.json perf-tests/load-test.js
# Artillery stress test
npx artillery run --output .team/evidence/artillery-results.json perf-tests/stress-test.yml
# Lighthouse CI
npx lhci autorun --config=lighthouserc.json
cp .lighthouseci/ .team/evidence/lighthouse/
```

### Evidence File Naming Convention
```
.team/evidence/{date}-{type}-{suite}-{result}.{ext}
Example: 2026-02-25-playwright-login-suite-pass.json
Example: 2026-02-25-percy-homepage-3diffs.txt
Example: 2026-02-25-k6-api-endpoints-p95-42ms.json
Example: 2026-02-25-stryker-unit-tests-score87.json
Example: 2026-02-25-flakiness-10runs-0flaky.json
```

---

## 8. LOCAL INSTALL & TEST PROTOCOL

### Required Tools Installation
```bash
# Playwright (cross-browser E2E)
npm install -D @playwright/test playwright
npx playwright install --with-deps  # Install browsers + OS dependencies

# Cypress (component + E2E)
npm install -D cypress
npx cypress install  # Download Cypress binary

# Selenium Grid (distributed testing)
npm install -D selenium-webdriver
# Docker-based Selenium Grid:
docker pull selenium/hub:latest
docker pull selenium/node-chrome:latest
docker pull selenium/node-firefox:latest
docker pull selenium/node-edge:latest

# API Testing
npm install -D jest supertest @types/jest ts-jest
npm install -D @pact-foundation/pact @pact-foundation/pact-node
npm install -g newman  # Postman/Newman CLI runner

# Performance Testing
# k6: https://k6.io/docs/getting-started/installation/
npm install -D artillery
npm install -D @lhci/cli  # Lighthouse CI

# Visual Regression
npm install -D @percy/cli @percy/playwright
npm install -D chromatic  # For Storybook projects
# Playwright built-in snapshots require no extra install

# Mutation Testing + Coverage
npm install -D @stryker-mutator/core @stryker-mutator/jest-runner
npm install -D nyc istanbul-lib-coverage

# Test Data
npm install -D @faker-js/faker fishery

# Accessibility
npm install -D @axe-core/playwright axe-html-reporter

# Reporting
npm install -D allure-commandline allure-playwright
npm install -D mochawesome mochawesome-merge mochawesome-report-generator

# Verify installations
npx playwright --version
npx cypress --version
npx jest --version
k6 version
newman --version
npx artillery --version
```

### Docker Selenium Grid Setup
```bash
# docker-compose.selenium.yml
docker compose -f docker-compose.selenium.yml up -d
# Hub available at http://localhost:4444
# VNC available at http://localhost:7900 (for debugging)
```

### Local Validation Workflow
```bash
# 1. Install all dependencies
npm install

# 2. Run unit tests with coverage
npx jest --coverage --coverageReporters=json-summary,lcov

# 3. Run Playwright E2E tests
npx playwright test

# 4. Run Cypress component tests
npx cypress run --component

# 5. Run API tests with Newman
newman run postman/collection.json -e postman/environment.json

# 6. Run visual regression baselines
npx playwright test tests/visual/ --update-snapshots

# 7. Run accessibility audit
npx playwright test tests/accessibility/

# 8. Run k6 smoke test
k6 run --vus 10 --duration 30s perf-tests/smoke.js

# 9. Check flakiness (run 3x locally)
for i in 1 2 3; do npx playwright test --reporter=json > run-$i.json 2>&1; done

# 10. Run Lighthouse CI locally
npx lhci autorun --config=lighthouserc.json
```

---

## 9. ATOMIC COMMIT PROTOCOL

### Commit Convention for QA Automation
```
{type}({scope}): {description}

Types: test, feat, fix, refactor, perf, docs, chore
Scopes: ui, api, perf, visual, data, framework, ci, flakiness, a11y
```

### Commit Sequence Per Test Suite
```bash
# 1. Page Objects / Test Infrastructure first
git add tests/pages/LoginPage.ts tests/pages/DashboardPage.ts tests/fixtures/auth.fixture.ts
git commit -m "test(ui): add page objects and fixtures for login and dashboard

- LoginPage: email, password, submit, error selectors (data-testid)
- DashboardPage: nav, content, user menu selectors
- auth.fixture: pre-authenticated browser state via storageState
- All using Playwright best practices (auto-waiting, web-first assertions)
"

# 2. E2E test cases
git add tests/e2e/login.spec.ts
git commit -m "test(ui): add Playwright E2E login test suite

- Happy path: valid credentials -> dashboard redirect
- Invalid password: error toast displayed within 3s
- Empty fields: HTML5 validation messages shown
- Session persistence: refresh retains authenticated state
- Cross-browser: verified on Chromium, Firefox, WebKit
"

# 3. Cypress component tests
git add tests/component/Button.cy.tsx tests/component/Form.cy.tsx
git commit -m "test(ui): add Cypress component tests for Button and Form

- Button: default, disabled, loading, icon variants
- Form: validation, submission, error display
- Isolated rendering with mount() -- no backend dependency
"

# 4. API test suites
git add tests/api/users.test.ts tests/contracts/users.pact.js
git commit -m "test(api): add API tests and Pact contracts for /users

- CRUD operations: GET list, GET by ID, POST, PUT, DELETE
- Schema validation against OpenAPI spec
- Pact consumer contracts for frontend-backend agreement
- Error scenarios: 400, 401, 403, 404, 409, 422, 500
"

# 5. Visual regression baselines
git add tests/visual/ .percy.yml
git commit -m "test(visual): add Percy visual regression for key pages

- Homepage: desktop (1440px), tablet (768px), mobile (375px)
- Dashboard: light mode and dark mode variants
- Percy config: 0.1% diff threshold, CSS stabilization
"

# 6. Performance test scripts
git add perf-tests/load-test.js perf-tests/stress-test.yml lighthouserc.json
git commit -m "test(perf): add k6 load test and Lighthouse CI config

- k6: ramp to 100 VUs over 2min, sustain 5min, ramp down 1min
- Artillery: stress test finding breaking point at 500 VUs
- Lighthouse CI: budgets for LCP < 2.5s, FID < 100ms, CLS < 0.1
"

# 7. CI pipeline
git add .github/workflows/qa.yml
git commit -m "feat(ci): add QA automation pipeline with test matrix

- Matrix: chromium, firefox, webkit (Playwright)
- Shard: 4 parallel shards for E2E tests
- Artifact upload: test-results, coverage, visual diffs on failure
- Newman API tests and k6 smoke test included
"

# 8. Evidence
git add .team/evidence/
git commit -m "docs(evidence): test execution results and coverage reports"
```

### Rules
- **Page Objects separate from test cases** -- infrastructure vs. assertions
- **One test suite per commit** -- login tests, not "add all tests"
- **Cypress component tests separate from E2E tests** -- different test runners
- **Visual baselines separate** from functional tests
- **CI config separate** from test code
- **Never commit large binary artifacts** (screenshots, videos) -- reference CI artifacts instead

---

## 10. COMPREHENSIVE TESTING MATRIX

| Test Type | Tool | Target | Pass Criteria | Evidence File |
|-----------|------|--------|---------------|---------------|
| Cypress Component | Cypress | UI components | 100% pass, isolated rendering | cypress-component-results.json |
| Playwright E2E | Playwright | Critical user flows | 100% pass, <5min total | playwright-results.json |
| Cross-Browser | Playwright | Chromium, Firefox, WebKit | 100% pass all browsers | cross-browser-matrix.json |
| Selenium Grid | Selenium | Distributed legacy browsers | 100% pass, grid stable | selenium-grid-results.json |
| Visual Regression (Percy) | Percy | Key pages, viewports | 0 unreviewed diffs | percy-build-results.txt |
| Visual Regression (Chromatic) | Chromatic | Storybook components | 0 unreviewed changes | chromatic-results.txt |
| Visual Regression (Playwright) | Playwright snapshots | Critical UI states | 0 pixel diff beyond threshold | playwright-visual-diffs/ |
| API Tests | Jest + Supertest | All API endpoints | 100% pass, schemas valid | api-test-results.json |
| Contract Tests | Pact | Consumer-provider pairs | All contracts verified | pact-results.json |
| Newman Collection | Newman | Postman collections | 100% pass, all assertions | newman-results.json |
| Load Tests | k6 | Critical endpoints | P95 < baseline, 0% errors | k6-results.json |
| Stress Tests | Artillery | System breaking point | Graceful degradation documented | artillery-results.json |
| Lighthouse CI | Lighthouse | Key pages | Perf > 90, A11y > 90, CWV pass | lighthouse-results.json |
| Accessibility | axe-core | All pages | 0 critical/serious violations | axe-results.json |
| Mutation Testing | Stryker | Unit test suites | Mutation score > 80% | stryker-results.json |
| Flakiness Detection | 10x execution | Full test suite | 0 flaky (100% deterministic) | flakiness-report.json |
| Code Coverage | nyc/Istanbul | Source code | Line > 80%, Branch > 70% | coverage-summary.json |
| Test Speed | Execution timer | Full suite | Total < CI budget | execution-profiling.json |
| Test Dependencies | Order randomizer | Full suite | Same results in any order | dependency-check.json |

### Automated Meta-Test Pipeline
```bash
#!/bin/bash
# run-meta-tests.sh -- Tests that test the tests
set -e

echo "=== Phase 1: Framework Validation ==="
npx playwright test --reporter=json > .team/evidence/playwright.json
npx cypress run --reporter json > .team/evidence/cypress.json
npx jest --json --outputFile=.team/evidence/jest.json tests/api/
newman run collection.json -r json --reporter-json-export .team/evidence/newman.json

echo "=== Phase 2: Coverage Analysis ==="
npx nyc --reporter=json-summary npm test
cp coverage/coverage-summary.json .team/evidence/

echo "=== Phase 3: Visual Regression ==="
npx percy exec -- npx playwright test tests/visual/ 2>&1 | tee .team/evidence/percy.log
npx chromatic --exit-zero-on-changes 2>&1 | tee .team/evidence/chromatic.log

echo "=== Phase 4: Flakiness Detection ==="
for i in $(seq 1 10); do
  npx playwright test --reporter=json > .team/evidence/flake-$i.json 2>&1 || true
done
node .team/meta-qa/analyze-flakiness.js

echo "=== Phase 5: Mutation Testing ==="
npx stryker run --reporters json
cp reports/mutation/mutation.json .team/evidence/

echo "=== Phase 6: Performance Baselines ==="
k6 run --out json=.team/evidence/k6.json perf-tests/load-test.js
npx lhci autorun --config=lighthouserc.json
cp .lighthouseci/*.json .team/evidence/

echo "=== ALL META-QA CHECKS PASSED ==="
```

---

## 11. GITHUB ACTIONS -- LOCAL TESTING WITH act

### QA CI Workflow
```yaml
# .github/workflows/qa.yml
name: QA Automation CI
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx jest --coverage --json --outputFile=results.json
      - uses: actions/upload-artifact@v4
        with: { name: coverage, path: coverage/ }

  e2e-playwright:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npx playwright test --project=${{ matrix.browser }} --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: test-results-${{ matrix.browser }}-${{ matrix.shard }}, path: test-results/ }

  cypress-component:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx cypress run --component
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: cypress-screenshots, path: cypress/screenshots/ }

  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx jest tests/api/ --json --outputFile=api-results.json
      - run: newman run postman/collection.json -r json --reporter-json-export newman-results.json

  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install chromium
      - run: npx percy exec -- npx playwright test tests/visual/
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci && npm run build && npm run start &
      - run: npx lhci autorun --config=lighthouserc.json
      - uses: actions/upload-artifact@v4
        with: { name: lighthouse-results, path: .lighthouseci/ }

  k6-smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grafana/setup-k6-action@v1
      - run: k6 run --vus 10 --duration 30s perf-tests/smoke.js
```

### Local Testing with act
```bash
# Install act
# Windows: choco install act-cli
# macOS: brew install act
# Linux: curl https://raw.githubusercontent.com/nektos/act/master/install.sh | bash

# Run full CI locally
act push --workflows .github/workflows/qa.yml

# Run specific job
act push --workflows .github/workflows/qa.yml -j unit-tests
act push --workflows .github/workflows/qa.yml -j e2e-playwright
act push --workflows .github/workflows/qa.yml -j cypress-component
act push --workflows .github/workflows/qa.yml -j api-tests

# Run with specific browser matrix value
act push --workflows .github/workflows/qa.yml -j e2e-playwright --matrix browser:chromium --matrix shard:1

# Run with secrets for Percy
act push --workflows .github/workflows/qa.yml -j visual-regression --secret-file .env.act

# Dry run
act push --workflows .github/workflows/qa.yml --list
```

---

## 12. PM KANBAN -- REAL-TIME TRACKING

### Board Columns
```
| BACKLOG | DESIGNING | AUTHORING | STABILIZING | VISUAL-QA | META-QA | CI-READY | RELEASED |
```

### Card Format
```markdown
## [E2E] Login Test Suite
- **Assignee**: UI Test Engineer
- **Priority**: P0
- **Labels**: ui-tests, e2e, critical-path, chromium, firefox, webkit
- **Tests**: 12 specs across 4 page objects
- **Status**: STABILIZING
- **Flakiness**: 0% (10/10 runs deterministic)
- **Coverage**: 94% of login flows
- **Execution Time**: 23s (target: <30s)
- **Visual**: Percy approved (3 viewports, 0 diffs)
- **Blocking**: None
- **Blocked by**: None
```

### Real-Time Updates
PM updates KANBAN.md after every agent completion:
```bash
# After UITEST completes login suite
sed -i 's/| AUTHORING |.*Login/| STABILIZING | Login/' .team/KANBAN.md
# After VISREG confirms visual baselines
sed -i 's/| STABILIZING |.*Login/| VISUAL-QA | Login/' .team/KANBAN.md
# After METAQA confirms 0 flaky
sed -i 's/| VISUAL-QA |.*Login/| CI-READY | Login/' .team/KANBAN.md
```

### GitHub Project Sync
```bash
gh project create --title "QA Framework v1" --owner @me
gh project item-edit --id $ITEM_ID --field-id $STATUS_FIELD --project-id $PROJECT_ID --single-select-option-id $DONE_OPTION
```

---

## 13. QUALITY GATES

### Domain-Specific Gates

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Architecture Review | After QAARCH | Test pyramid defined, framework selected, CI strategy documented, selector strategy specified | Re-spawn QAARCH |
| E2E Reliability | After UITEST | 100% pass rate, resilient selectors (data-testid), no hardcoded waits, Playwright auto-waiting used | Re-spawn UITEST |
| Cross-Browser Parity | After UITEST | All tests pass on Chromium + Firefox + WebKit, no browser-specific skips | Re-spawn UITEST |
| API Test Coverage | After APITEST | All endpoints tested, all status codes covered, Pact contracts verified, Newman collections pass | Re-spawn APITEST |
| Visual Baselines Set | After VISREG | Percy/Chromatic baselines approved, responsive viewports covered, diff thresholds configured | Re-spawn VISREG |
| Performance Baselines | After PERFTEST | k6 baselines established, Lighthouse CWV passing, Artillery stress test documented | Re-spawn PERFTEST |
| Flakiness Zero | After METAQA | 0 flaky tests in 10 consecutive runs across all frameworks | Enter Fix Loop -- UITEST/APITEST fix flaky tests |
| Mutation Score | After METAQA | Stryker mutation score >= 80% for critical modules | Re-spawn test authors to improve assertions |
| CI Pipeline Speed | After METAQA | Total pipeline duration within budget (sharding effective) | Optimize parallelization |
| Allure Report Clean | After METAQA | Allure report aggregated, all suites green, no broken/unknown status | Re-spawn responsible agent |

### Universal Gates

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Evidence Exists | Every task | `.team/evidence/` has proof files for claimed results | Block task completion |
| Commit Atomic | Every commit | One test suite per commit, infrastructure separate from assertions | Reject commit |
| PM Artifacts | After PM | All planning docs + GitHub Project exist | Re-spawn PM |
| Legal Clear | Before release | Test data privacy reviewed, accessibility requirements covered | Block release |

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
+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- architecture/
|   +-- TEST_ARCHITECTURE.md
|   +-- FRAMEWORK_SELECTION.md
|   +-- TEST_PYRAMID.md
|   +-- PARALLEL_STRATEGY.md
|   +-- CI_INTEGRATION.md
|   +-- REPORTING_DESIGN.md
|   +-- SELECTOR_STRATEGY.md
+-- ui-tests/
|   +-- PAGE_OBJECTS.md
|   +-- E2E_SUITES.md
|   +-- CYPRESS_COMPONENTS.md
|   +-- CROSS_BROWSER.md
|   +-- RESPONSIVE_TESTS.md
+-- api-tests/
|   +-- API_TEST_SUITES.md
|   +-- CONTRACT_TESTS.md
|   +-- SCHEMA_VALIDATION.md
|   +-- NEWMAN_COLLECTIONS.md
|   +-- MOCK_SERVERS.md
+-- perf-tests/
|   +-- K6_LOAD_SCRIPTS.md
|   +-- ARTILLERY_STRESS.md
|   +-- LIGHTHOUSE_CONFIG.md
|   +-- BASELINES.md
|   +-- SOAK_TESTS.md
+-- visual-tests/
|   +-- PERCY_CONFIG.md
|   +-- CHROMATIC_SETUP.md
|   +-- PLAYWRIGHT_SCREENSHOTS.md
|   +-- BASELINE_LIBRARY.md
|   +-- APPROVAL_WORKFLOW.md
+-- meta-qa/
|   +-- FLAKINESS_REPORT.md
|   +-- MUTATION_TESTING.md
|   +-- COVERAGE_GAPS.md
|   +-- EXECUTION_PROFILING.md
|   +-- TEST_DEPENDENCY_MAP.md
|   +-- ALLURE_AGGREGATION.md
|   +-- QA_SIGNOFF.md
+-- evidence/
|   +-- playwright-results.json
|   +-- cypress-component-results.json
|   +-- newman-results.json
|   +-- coverage-summary.json
|   +-- percy-build-results.txt
|   +-- chromatic-results.txt
|   +-- k6-results.json
|   +-- artillery-results.json
|   +-- lighthouse-results.json
|   +-- axe-results.json
|   +-- stryker-results.json
|   +-- flakiness-report.json
|   +-- cross-browser-matrix.json
+-- releases/
+-- marketing/
+-- legal/
```

---

## 15. REPORTING SYSTEM

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py` -- includes test pass rates (Playwright, Cypress, Newman), coverage trends (line/branch over time), flakiness metrics (runs vs. flaky count), visual regression diff counts, execution time charts (per suite and total), Lighthouse CWV scores, and defect detection rates
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py` -- includes detailed Allure/Mochawesome aggregated results, mutation testing scores per module, coverage gap analysis with untested file listing, performance regression alerts (P95 delta), cross-browser compatibility matrix, and Percy/Chromatic visual review status
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion with full QA metrics dashboard
- **QA Metrics Dashboard**: total tests (unit/component/integration/E2E), pass rate (%), code coverage (line/branch), flakiness rate (target: 0%), mutation score (target: >80%), avg execution time per suite, visual regression diff count, Lighthouse scores (Perf/A11y/BP/SEO), defects detected per sprint

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Test framework installation failure**: Capture npm/playwright/cypress install errors, re-spawn with troubleshooting context (proxy settings, disk space, OS dependencies)
- **Flaky test detected**: Quarantine test (move to `.quarantine/`), create GitHub issue with label `flakiness`, re-spawn UITEST/APITEST to stabilize with root cause analysis
- **Browser driver mismatch**: Capture version conflict, re-spawn RM to update Playwright browsers or Selenium Grid images
- **Visual regression false positive**: Capture diff screenshots, adjust threshold in Percy/Chromatic config, re-baseline if CSS animation or font rendering variance
- **CI timeout**: Capture execution profiling data, re-spawn QAARCH for shard count increase or test splitting optimization
- **Percy/Chromatic quota exceeded**: Switch to Playwright built-in snapshots as fallback, document in RISK_REGISTER.md
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent with state file reference

### Session Commands

| Command | Action |
|---------|--------|
| `--team qaAutomation --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + test metrics dashboard (pass rates, coverage, flakiness) |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation (framework, coverage target, flakiness threshold) |
| `team gate check` | Run all quality gate checks |
| `team flakiness check` | Run 10x flakiness detection across all test suites |
| `team coverage report` | Generate coverage gap analysis with Istanbul/nyc |
| `team visual review` | Show Percy/Chromatic pending review status |
| `team perf baseline` | Show current k6/Lighthouse performance baselines |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave. Flakiness detection is re-run on resume. Visual regression baselines are re-validated against current screenshots.

---

*QA Automation Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 10 Gates | Testing-the-Tests | Evidence-Driven | GitHub-Integrated*
*Playwright + Cypress + Selenium Grid + k6 + Artillery + Percy + Chromatic + Pact + Stryker + Allure*
*Flakiness Zero-Tolerance | Visual Regression | Cross-Browser Matrix | Mutation Testing*
