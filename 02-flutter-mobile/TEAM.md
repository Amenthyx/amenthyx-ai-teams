# Flutter Mobile Team
# Activation: `--team flutter`
# Focus: Flutter/Dart cross-platform mobile applications

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Quality Gates](#7-quality-gates)
8. [`.team/` Directory Layout](#8-team-directory-layout)
9. [Reporting System](#9-reporting-system)
10. [Error Handling & Session Management](#10-error-handling--session-management)
11. [Evidence & Proof Protocol](#11-evidence--proof-protocol)
12. [Local Install & Test Protocol](#12-local-install--test-protocol)
13. [Atomic Commit Protocol](#13-atomic-commit-protocol)
14. [Comprehensive Testing Matrix](#14-comprehensive-testing-matrix)
15. [GitHub Actions — Local Testing](#15-github-actions--local-testing)
16. [PM Kanban — Real-Time Tracking](#16-pm-kanban--real-time-tracking)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team flutter --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> — this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 8)
4. Spawn Team Leader agent (foreground — this is the orchestrator)
5. Team Leader spawns PM agent (foreground — must complete before others)
6. PM produces Project Charter + Initial Plan + creates GitHub Project
7. Team Leader reviews PM output, then spawns remaining agents in waves
8. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, features, target platforms, and success criteria.

### Quick Reference — Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between platform-specific implementations.
- **Persona**: "You are the Team Leader of a 9-person Flutter mobile engineering team. You coordinate all work, make final architectural decisions (widget trees, state management approach, navigation strategy), enforce quality gates, and ensure the app ships on both iOS and Android. You never write production code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter, milestones, kanban. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports.
- **Persona**: "You are the Project Manager for a Flutter mobile team. You create all planning artifacts and manage the project via GitHub Projects using `gh` CLI. You track platform-specific milestones (iOS submission, Android release, Play Store listing). You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Widget Architect (WA)
- **Role**: Widget tree design, component library, theming, responsive layouts.
- **Persona**: "You are the Widget Architect. You design the widget tree hierarchy, create reusable custom widgets, implement theming (Material 3 / Cupertino adaptive), responsive layouts for phone/tablet, and maintain the component library. You ensure widgets are composable, testable, and follow Flutter best practices. You document the widget catalog in `.team/widgets/`."
- **Spawning**: Wave 2 (parallel)

### 2.4 State Management Engineer (SME)
- **Role**: BLoC/Riverpod architecture, data flow, dependency injection.
- **Persona**: "You are the State Management Engineer. You design the state management architecture using flutter_bloc or riverpod (as specified in strategy). You implement BLoCs/providers, events, states, repositories, and dependency injection (GetIt + Injectable or Riverpod). You ensure unidirectional data flow, proper state separation, and reactive UI updates. You document patterns in `.team/state-management/`."
- **Spawning**: Wave 2 (parallel)

### 2.5 Platform Integration Engineer (PIE)
- **Role**: Native platform channels, plugins, Firebase, device APIs.
- **Persona**: "You are the Platform Integration Engineer. You implement platform channels (MethodChannel/EventChannel), native plugin integrations, Firebase services (Auth, Firestore, Cloud Messaging, Crashlytics), camera, geolocation, biometrics, deep linking, and push notifications. You handle platform-specific code for iOS (Swift) and Android (Kotlin). You document integrations in `.team/platform-channels/`."
- **Spawning**: Wave 2 (parallel)

### 2.6 UI/UX Designer (UI)
- **Role**: Screen flows, navigation, animations, accessibility.
- **Persona**: "You are the UI/UX Designer. You create screen flow diagrams, navigation architecture (GoRouter/auto_route), custom animations and transitions, accessibility compliance, and adaptive layouts (Material + Cupertino). You produce design specs, interaction patterns, and animation curves. You write to `.team/ui-designs/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 Backend API Engineer (API)
- **Role**: Backend services, API contracts, cloud functions for the mobile app.
- **Persona**: "You are the Backend API Engineer. You design and implement the backend APIs that the Flutter app consumes -- REST endpoints, GraphQL schemas, Firebase Cloud Functions, or serverless functions. You define API contracts, authentication flows, and data serialization (JSON/Protobuf). You document contracts in `.team/api-contracts/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer -- Mobile Testing (QA)
- **Role**: Widget tests, integration tests, golden tests, platform-specific testing.
- **Persona**: "You are the QA Engineer specializing in mobile testing. You create test strategies covering widget tests (flutter_test), integration tests (integration_test package), golden tests for visual regression, platform-specific edge cases (iOS/Android), performance profiling (DevTools), and accessibility audits. You report bugs with device/OS/version context. You produce QA sign-off in `.team/qa/`."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: App store submissions, versioning, release coordination.
- **Persona**: "You are the Release Manager. You coordinate releases: build configurations (flavors/schemes), semantic versioning, changelogs, App Store Connect and Google Play Console submission checklists, code signing, ProGuard/R8 rules, app bundle generation, rollback plans, and release notes. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: App store optimization, go-to-market, positioning.
- **Persona**: "You are the Marketing Strategist. You create app store optimization (ASO) strategies, store listing copy, screenshot plans, go-to-market strategies, competitive analyses, and launch plans for both App Store and Google Play."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: App store compliance, privacy policy, data handling, GDPR/CCPA.
- **Persona**: "You are the Legal/Compliance Attorney. You review for GDPR, CCPA, COPPA, App Store Review Guidelines, Google Play Developer Policy, app permissions justification, privacy policies, data collection disclosures, and third-party SDK compliance. You produce compliance checklists and risk assessments."
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
     |     PM      |  | Marketing |  |   Attorney   |
     | (Planning)  |  |   (ASO)   |  | (App Policy) |
     +------+------+  +-----------+  +--------------+
            |
   +--------+--------+--------+--------+
   |        |        |        |        |
+--v--+ +---v---+ +--v---+ +-v--+ +---v---+
|  WA | |  SME  | | PIE  | | UI | |  API  |
+--+--+ +---+---+ +--+---+ +-+--+ +---+---+
   |        |        |       |         |
   +--------+--------+-------+---------+
                     |
               +-----v-----+
               |     QA     |
               | (Mobile)   |
               +-----+------+
                     |
            +--------v--------+
            | Release Manager |
            | (App Stores)    |
            +-----------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Flutter project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan (include platform-specific milestones: iOS beta, Android beta, store submissions) -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register (include platform risks: App Store rejection, signing issues, Play Store policy) -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: App store optimization & go-to-market", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write ASO strategy, store listing copy, screenshot plan, launch plan to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: App store compliance & privacy review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write app store compliance, privacy policy, permissions audit, data handling review to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 5 agents)
```
WA  -> .team/widgets/            (WIDGET_CATALOG.md, THEME_SYSTEM.md, RESPONSIVE_LAYOUT.md)
SME -> .team/state-management/   (BLOC_ARCHITECTURE.md, DI_CONFIG.md, DATA_FLOW.md)
PIE -> .team/platform-channels/  (FIREBASE_INTEGRATION.md, NATIVE_CHANNELS.md, PLUGIN_REGISTRY.md)
UI  -> .team/ui-designs/         (SCREEN_FLOWS.md, NAVIGATION_ARCH.md, ANIMATION_SPECS.md)
API -> .team/api-contracts/      (API_DESIGN.md, AUTH_FLOW.md, DATA_MODELS.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, WIDGET_TESTS.md, INTEGRATION_TESTS.md, GOLDEN_TESTS.md, PERFORMANCE_PROFILE.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, SIGNING_CONFIG.md, STORE_SUBMISSION.md, ROLLBACK_PLAN.md, RELEASE_NOTES.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: STORE_SUBMISSION.md must be approved
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
| Labels | -- | Role + priority + wave + platform labels |
| Releases | `.team/releases/` | `gh release create` |

**Flutter-specific labels**: `platform:ios`, `platform:android`, `platform:web`, `type:widget`, `type:bloc`, `type:plugin`.

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: ASO strategy, store listing, launch plan
+-- Attorney: app store compliance, privacy policy, permissions audit
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- WA, SME, PIE, UI, API -- all in parallel
+-- SYNC: TL waits for all 5 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: widget tests, integration tests, golden tests, performance profile, sign-off
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: checklist, changelog, signing, store submission, rollback, release notes
+-- RM: GitHub Release via gh release create
+-- GATE: STORE_SUBMISSION.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF
+-- PM: close all GitHub milestones
+-- TL: present summary to user
```

---

## 7. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| Widget Test Pass | After QA | `flutter test` passes, all widget tests green | Re-spawn WA + SME |
| Integration Test Pass | After QA | `flutter test integration_test/` passes on both platforms | Re-spawn PIE |
| Platform Compatibility | After QA | App builds and runs on iOS + Android without crashes | Re-spawn PIE + WA |
| Performance Profile | After QA | 60fps on target devices, no jank frames in DevTools profile | Re-spawn SME + WA |
| App Size Check | After QA | APK < 50MB (or strategy-defined limit), IPA within App Store limits | Re-spawn WA + PIE |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Store Submission | After RM | `STORE_SUBMISSION.md` approved, signing valid | RM lists blocking items |
| Evidence Complete | Before QA | Every agent has evidence manifest with emulator screenshots, build logs, test output | Re-spawn agent to collect evidence |
| Local Build Passes | Before QA | `flutter build apk --release` and `flutter build ios --release` both succeed with zero errors | Re-spawn PIE + WA |
| Test Coverage Gate | Before Release | Widget test coverage >= 80%, integration tests pass, golden tests match | Enter Bug Fix Loop |
| CI Validation Gate | Before push | `act push` succeeds locally, `actionlint` clean for Flutter CI workflow | Fix workflow, re-test |
| No Secrets Gate | Every commit | `gitleaks detect` finds zero secrets (no API keys, signing keys in repo) | HARD STOP, rotate secrets |
| Dependency Audit Gate | Before Release | `flutter pub deps` shows no conflicting versions, no deprecated packages with known CVEs | Fix or document exceptions |

---

## 8. `.team/` DIRECTORY LAYOUT

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
+-- COMMIT_LOG.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- manifests/
|   |   +-- PM_manifest.md
|   |   +-- WA_manifest.md
|   |   +-- SME_manifest.md
|   |   +-- PIE_manifest.md
|   |   +-- UI_manifest.md
|   |   +-- API_manifest.md
|   |   +-- QA_manifest.md
|   +-- builds/
|   |   +-- flutter_build_apk.log
|   |   +-- flutter_build_ios.log
|   |   +-- build_time.txt
|   +-- tests/
|   |   +-- static/
|   |   |   +-- flutter_analyze.log
|   |   +-- unit/
|   |   |   +-- flutter_test.json
|   |   |   +-- coverage/
|   |   +-- integration/
|   |   |   +-- integration_test_results.log
|   |   +-- golden/
|   |   |   +-- golden_test_results.log
|   |   |   +-- failures/
|   |   +-- performance/
|   |   |   +-- devtools_profile.json
|   |   +-- security/
|   +-- screenshots/
|   |   +-- android_emulator_home.png
|   |   +-- android_emulator_detail.png
|   |   +-- ios_simulator_home.png
|   |   +-- ios_simulator_detail.png
|   +-- runtime/
|   |   +-- flutter_run.log
|   +-- deps/
|   |   +-- flutter_pub_deps.txt
|   +-- diffs/
|   +-- ci/
|   |   +-- act_push.log
|   |   +-- actionlint.log
|   +-- validation/
+-- ci/
|   +-- .github/
|       +-- workflows/
|           +-- flutter_ci.yml
|           +-- release.yml
+-- widgets/
|   +-- WIDGET_CATALOG.md
|   +-- THEME_SYSTEM.md
|   +-- RESPONSIVE_LAYOUT.md
+-- state-management/
|   +-- BLOC_ARCHITECTURE.md
|   +-- DI_CONFIG.md
|   +-- DATA_FLOW.md
+-- platform-channels/
|   +-- FIREBASE_INTEGRATION.md
|   +-- NATIVE_CHANNELS.md
|   +-- PLUGIN_REGISTRY.md
+-- ui-designs/
|   +-- SCREEN_FLOWS.md
|   +-- NAVIGATION_ARCH.md
|   +-- ANIMATION_SPECS.md
+-- api-contracts/
|   +-- API_DESIGN.md
|   +-- AUTH_FLOW.md
|   +-- DATA_MODELS.md
+-- qa/
|   +-- TEST_STRATEGY.md
|   +-- WIDGET_TESTS.md
|   +-- INTEGRATION_TESTS.md
|   +-- GOLDEN_TESTS.md
|   +-- PERFORMANCE_PROFILE.md
|   +-- QA_SIGNOFF.md
+-- releases/
|   +-- RELEASE_CHECKLIST.md
|   +-- CHANGELOG.md
|   +-- SIGNING_CONFIG.md
|   +-- STORE_SUBMISSION.md
|   +-- ROLLBACK_PLAN.md
|   +-- RELEASE_NOTES.md
+-- marketing/
+-- legal/
```

---

## 9. REPORTING SYSTEM

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Reports include Flutter-specific metrics: widget test coverage, platform build status, app size trends, performance benchmarks
- Final summary generated at project completion

### Enhanced Report Contents

Every PPTX and PDF report MUST include:

1. **Evidence Dashboard** -- count of evidence artifacts per agent, emulator screenshots attached, verification status
2. **Commit Activity** -- commits per wave, per agent, with linked issue references and platform tags
3. **Test Coverage Trend** -- widget test coverage percentage over time, golden test pass/fail ratio
4. **Build Metrics** -- APK size trend, IPA size trend, build time trend, `flutter analyze` warning count
5. **CI/CD Status** -- GitHub Actions workflow pass/fail, local `act` validation results
6. **Kanban Velocity** -- cards moved per reporting period, platform-specific burn-down

---

## 10. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Platform build failure**: Re-spawn PIE with build error logs and platform-specific context
- **Plugin compatibility**: If a plugin fails on one platform, PIE creates platform-specific fallback

### Session Commands

| Command | Action |
|---------|--------|
| `--team flutter --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

## 11. EVIDENCE & PROOF PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 1

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works. Flutter evidence is uniquely visual -- emulator screenshots are first-class evidence.

### Flutter-Specific Evidence Requirements

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
| WA | Widget renders correctly on phone + tablet | Emulator screenshot: `adb exec-out screencap -p > .team/evidence/screenshots/wa_{widget}.png` |
| WA | Theme switching (light/dark) | Screenshot of both themes on same screen |
| SME | BLoC state transitions logged | `flutter test --reporter=json` output showing state transitions |
| SME | Dependency injection graph | `flutter pub deps` output saved to evidence |
| PIE | Firebase integration working | Firebase console screenshot + Firestore read/write log |
| PIE | Native channel communication | Platform channel round-trip test output |
| PIE | Push notification received | Emulator screenshot showing notification |
| UI | All screens rendering | Full screen flow screenshots on Android emulator + iOS simulator |
| UI | Navigation working | Screen-to-screen navigation test output |
| UI | Animations smooth | DevTools performance overlay screenshot showing 60fps |
| API | API endpoints responding | `curl` output for each endpoint |
| QA | All test suites passing | `flutter test` JSON output + coverage report |
| QA | Golden test baselines | Golden test images in `.team/evidence/tests/golden/` |

### Emulator Screenshot Capture Commands

```bash
# Android Emulator (ADB)
adb exec-out screencap -p > .team/evidence/screenshots/{name}.png

# iOS Simulator (xcrun)
xcrun simctl io booted screenshot .team/evidence/screenshots/{name}_ios.png

# Flutter integration test screenshots (programmatic)
# In integration test file:
# await binding.takeScreenshot('evidence_screenshot_name');

# Flutter Driver screenshot
# await driver.screenshot();
```

### Evidence Manifest (Per Agent)

Every agent writes to `.team/evidence/manifests/{ROLE}_manifest.md`:

```markdown
# Evidence Manifest -- {AGENT_ROLE}
## Task: {task_description}
## Date: {ISO_8601_timestamp}

### Artifacts Produced
- [ ] `path/to/widget.dart` -- description
- [ ] `path/to/bloc.dart` -- description

### Evidence Collected
- [ ] Build log: `.team/evidence/builds/flutter_build_apk.log`
- [ ] Test results: `.team/evidence/tests/unit/flutter_test.json`
- [ ] Android screenshot: `.team/evidence/screenshots/{role}_android.png`
- [ ] iOS screenshot: `.team/evidence/screenshots/{role}_ios.png`
- [ ] `flutter analyze` output: `.team/evidence/tests/static/flutter_analyze.log`

### Verification Steps (Reproducible)
1. `cd /path/to/project`
2. `flutter pub get`
3. `flutter analyze`
4. `flutter test`
5. `flutter run -d emulator-5554` -> verify screens render

### Status: VERIFIED / UNVERIFIED
```

---

## 12. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally. Flutter apps must build for both Android and iOS (where tooling permits), run on an emulator, and pass all tests.

### Flutter Local Install Protocol

```bash
# STEP 1: Environment verification
flutter --version > .team/evidence/env_flutter.txt 2>&1
flutter doctor -v >> .team/evidence/env_flutter.txt 2>&1
dart --version >> .team/evidence/env_flutter.txt 2>&1

# STEP 2: Dependency installation
flutter pub get 2>&1 | tee .team/evidence/deps/flutter_pub_get.log
flutter pub deps > .team/evidence/deps/flutter_pub_deps.txt 2>&1
flutter pub outdated > .team/evidence/deps/flutter_pub_outdated.txt 2>&1

# STEP 3: Static analysis
flutter analyze > .team/evidence/tests/static/flutter_analyze.log 2>&1
dart format --set-exit-if-changed lib/ test/ > .team/evidence/tests/static/dart_format.log 2>&1

# STEP 4: Run tests with coverage
flutter test --coverage --machine > .team/evidence/tests/unit/flutter_test.json 2>&1
flutter test --coverage 2>&1 | tee .team/evidence/tests/unit/flutter_test_verbose.log
# Generate HTML coverage report (if lcov installed)
genhtml coverage/lcov.info -o .team/evidence/tests/unit/coverage_html 2>/dev/null || true

# STEP 5: Build for Android
flutter build apk --release 2>&1 | tee .team/evidence/builds/flutter_build_apk.log
ls -la build/app/outputs/flutter-apk/app-release.apk >> .team/evidence/builds/flutter_build_apk.log

# STEP 6: Build for iOS (macOS only)
flutter build ios --release --no-codesign 2>&1 | tee .team/evidence/builds/flutter_build_ios.log || echo "iOS build requires macOS" > .team/evidence/builds/flutter_build_ios.log

# STEP 7: Run on emulator and capture screenshot
flutter run -d emulator-5554 --release &
sleep 30
adb exec-out screencap -p > .team/evidence/screenshots/app_running_android.png
kill %1

# STEP 8: Integration tests (if available)
flutter test integration_test/ 2>&1 | tee .team/evidence/tests/integration/integration_test_results.log || true
```

### Golden Test Protocol

```bash
# Generate golden files (first run or update)
flutter test --update-goldens test/golden/

# Run golden tests to verify visual regression
flutter test test/golden/ 2>&1 | tee .team/evidence/tests/golden/golden_test_results.log

# If golden tests fail, save failure diffs
cp -r test/golden/failures/ .team/evidence/tests/golden/failures/ 2>/dev/null || true
```

### Performance Profiling Protocol

```bash
# Run in profile mode and capture timeline
flutter run --profile -d emulator-5554 &
sleep 15

# Capture performance overlay screenshot
adb exec-out screencap -p > .team/evidence/tests/performance/perf_overlay.png

# Export timeline (via DevTools or flutter drive)
flutter drive --profile --target=test_driver/perf_test.dart 2>&1 | tee .team/evidence/tests/performance/devtools_profile.log || true

kill %1
```

---

## 13. ATOMIC COMMIT PROTOCOL

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

### Flutter-Specific Commit Types

| Type | When | Example |
|------|------|---------|
| `feat` | New widget, screen, BLoC, feature | `feat(auth): add login screen with BLoC [#8]` |
| `fix` | Bug fix, platform issue | `fix(ios): resolve keyboard overlap on login [#22]` |
| `test` | Widget test, integration test, golden test | `test(widgets): add golden tests for ProfileCard [#14]` |
| `refactor` | Widget decomposition, state optimization | `refactor(discovery): extract SwipeCard to separate widget` |
| `chore` | pubspec.yaml, build config, signing | `chore(deps): upgrade flutter_bloc to 8.1.4` |
| `ci` | CI/CD workflow changes | `ci(actions): add Flutter CI with test + build [#3]` |
| `perf` | Performance optimization | `perf(grid): implement lazy loading for discovery grid [#30]` |
| `evidence` | Adding proof/evidence artifacts | `evidence(qa): add emulator screenshots for all screens` |

### Rules

1. **One logical change per commit** -- never bundle a widget + its BLoC + tests in one commit
2. **Reference issue number** -- `feat(chat): add message bubble widget [#12]`
3. **Include evidence reference** -- point to proof in `.team/evidence/`
4. **Never commit secrets** -- Firebase config, signing keys must be gitignored
5. **Never commit generated code** -- `*.g.dart`, `*.freezed.dart` should be in `.gitignore` (run build_runner as build step)
6. **Run `flutter analyze` before every commit** -- zero warnings policy

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
| # | Hash | Agent | Type | Description | Issue | Wave | Platform | Evidence |
|---|------|-------|------|-------------|-------|------|----------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | -- | manifest |
| 2 | def5678 | WA | feat | profile card widget | #8 | 2 | both | wa_screenshot.png |
| 3 | ghi9012 | SME | feat | auth BLoC | #10 | 2 | both | sme_test.json |
| 4 | jkl3456 | PIE | feat | Firebase Auth integration | #12 | 2 | android | pie_firebase.log |
```

---

## 14. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### Flutter Test Pyramid

```
                       +----------+
                       | Release  |  <- Store submission smoke test
                      +------------+
                      | Integration |  <- flutter test integration_test/
                     +--------------+
                     | Golden Tests  |  <- Visual regression testing
                    +----------------+
                    |  Widget Tests   |  <- flutter_test (unit + widget)
                   +------------------+
                   |  Static Analysis  |  <- flutter analyze + dart format
                   +------------------+
```

### Coverage Requirements

| Layer | Minimum | Tools | Blocking? |
|-------|---------|-------|-----------|
| Static Analysis | 100% files scanned | `flutter analyze` (zero warnings), `dart format --set-exit-if-changed` | YES |
| Widget Tests | >= 80% line coverage | `flutter_test`, `bloc_test`, `mocktail` | YES |
| Golden Tests | All key screens and widgets | `flutter test --update-goldens` for baselines | YES |
| Integration Tests | All P0 user flows | `integration_test` package, `patrol` | YES |
| Performance Tests | 60fps sustained, no jank | Flutter DevTools timeline, `flutter drive --profile` | WARN |
| Platform Tests | Builds and runs on Android + iOS | `flutter build apk`, `flutter build ios` | YES |
| Accessibility Tests | Semantics tree correct, TalkBack/VoiceOver navigable | `Semantics` widget audit, accessibility guidelines | WARN |
| Security Tests | No hardcoded keys, no PII in logs | `gitleaks`, manual code review of debug prints | YES |

### QA Agent Testing Protocol

```
PHASE 1: STATIC ANALYSIS
+-- flutter analyze -> .team/evidence/tests/static/flutter_analyze.log
+-- dart format --set-exit-if-changed lib/ test/ -> .team/evidence/tests/static/dart_format.log
+-- Check for TODO/FIXME in production code
+-- Verify no print() statements in lib/ (use logger instead)

PHASE 2: WIDGET TESTS
+-- flutter test --coverage -> .team/evidence/tests/unit/flutter_test.json
+-- Verify coverage >= 80%
+-- Test individual widgets with pumpWidget()
+-- Test BLoCs with blocTest() -> verify state transitions
+-- Test repositories with mocked datasources (mocktail)
+-- Run 3x to detect flaky tests

PHASE 3: GOLDEN TESTS
+-- flutter test test/golden/ -> .team/evidence/tests/golden/golden_test_results.log
+-- Verify all key widgets match golden baselines
+-- Test both light and dark themes
+-- Test phone and tablet layouts
+-- Save any failure diffs -> .team/evidence/tests/golden/failures/

PHASE 4: INTEGRATION TESTS
+-- Start emulator (Android) / simulator (iOS)
+-- flutter test integration_test/ -> .team/evidence/tests/integration/
+-- Test all P0 user flows end-to-end:
    +-- Login / registration flow
    +-- Main navigation between tabs
    +-- Core feature flow (as per strategy)
    +-- Logout flow
+-- Capture screenshots at each step
+-- EVIDENCE: Save test results + step screenshots

PHASE 5: PERFORMANCE TESTING
+-- flutter run --profile on emulator
+-- Capture DevTools timeline -> .team/evidence/tests/performance/
+-- Verify: no jank frames, 60fps sustained, no memory leaks
+-- Check widget rebuild count (unnecessary rebuilds)
+-- Measure app startup time (cold + warm)

PHASE 6: PLATFORM-SPECIFIC TESTING
+-- Build and install APK on Android emulator
+-- Build and install on iOS simulator (macOS only)
+-- Test platform-specific features (permissions, deep links, push)
+-- Test edge cases: low memory, airplane mode, screen rotation
+-- EVIDENCE: Screenshots from both platforms

PHASE 7: APP SIZE AUDIT
+-- flutter build apk --analyze-size -> .team/evidence/builds/apk_size_analysis.txt
+-- Verify APK < 50MB (or strategy limit)
+-- Identify largest assets and recommend optimization
```

---

## 15. GITHUB ACTIONS -- LOCAL TESTING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 5

### Mandate
All CI/CD workflows MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### Flutter CI Workflow

```yaml
# .github/workflows/flutter_ci.yml
name: Flutter CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter analyze --no-fatal-infos
      - run: dart format --set-exit-if-changed lib/ test/

  test:
    runs-on: ubuntu-latest
    needs: analyze
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter test --coverage --machine > test_results.json
      - name: Check coverage threshold
        run: |
          COVERAGE=$(flutter test --coverage 2>&1 | grep -oP '\d+\.\d+%' | tail -1 || echo "0%")
          echo "Coverage: $COVERAGE"
      - uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            test_results.json
            coverage/

  golden-tests:
    runs-on: ubuntu-latest
    needs: analyze
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter test test/golden/
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: golden-failures
          path: test/golden/failures/

  build-android:
    runs-on: ubuntu-latest
    needs: [test, golden-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: build/app/outputs/flutter-apk/app-release.apk

  build-ios:
    runs-on: macos-latest
    needs: [test, golden-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter build ios --release --no-codesign

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
```

### Local Validation with `act`

```bash
# Validate workflow syntax
yamllint .github/workflows/flutter_ci.yml
actionlint .github/workflows/flutter_ci.yml

# Dry run
act -n 2>&1 | tee .team/evidence/ci/act_dryrun.log

# Run analyze + test jobs locally
act -j analyze 2>&1 | tee .team/evidence/ci/act_analyze.log
act -j test 2>&1 | tee .team/evidence/ci/act_test.log

# Full push event
act push 2>&1 | tee .team/evidence/ci/act_push.log

# Note: build-ios job requires macOS runner -- skip in local testing
# act -j build-android 2>&1 | tee .team/evidence/ci/act_build_android.log
```

---

## 16. PM KANBAN -- REAL-TIME TRACKING

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
| **Testing** | QA validating on emulators | QA picks up for mobile testing |
| **Done** | Verified on both platforms | QA passes on Android + iOS + evidence verified |
| **Blocked** | Cannot proceed | Platform issue, plugin incompatibility, or dependency blocking |

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
+-- Comment with: evidence manifest link, commit hash, emulator screenshot
+-- Add "status:in-review" label, add platform labels (platform:android, platform:ios)

ON QA PASS:
+-- Move issue from "Testing" to "Done"
+-- Close issue with: "Verified on Android + iOS. Evidence: [link]"
+-- Add "status:done" + "evidence:verified" labels

ON BLOCK:
+-- Move issue to "Blocked"
+-- Comment: "BLOCKED: {reason}. Platform: {android/ios/both}. Waiting on: {dependency}"
+-- Create linked blocking issue if needed
```

### Flutter-Specific Label Set

```bash
# Create Flutter-specific labels
for label in "platform:android:34d058" "platform:ios:147EFB" "platform:web:FF6D00" "type:widget:A855F7" "type:bloc:00BCD4" "type:plugin:FF7043" "type:golden:FFD54F" "status:backlog:CCCCCC" "status:in-progress:d93f0b" "status:in-review:fbca04" "status:testing:5319e7" "status:done:0e8a16" "status:blocked:000000" "evidence:verified:00C853" "evidence:missing:FF1744"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

---

*Flutter Mobile Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 14 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Driven | Locally-Tested*
