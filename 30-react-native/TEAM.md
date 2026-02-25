# React Native Team
# Activation: `--team reactNative`
# Focus: React Native, Expo, cross-platform mobile, EAS Build, native modules

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
15. [Reporting System -- PPTX & PDF](#15-reporting-system--pptx--pdf)
16. [Error Handling & Session Management](#16-error-handling--session-management)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team reactNative --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 14)
4. Spawn Team Leader agent (foreground -- this is the orchestrator)
5. Team Leader spawns PM agent (foreground -- must complete before others)
6. PM produces Project Charter + Mobile Roadmap + creates GitHub Project
7. Team Leader reviews PM output, then spawns remaining agents in waves
8. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, platform targets (iOS/Android), feature requirements, and success criteria.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts, ensures cross-platform consistency between iOS and Android.
- **Persona**: "You are the Team Leader of an 11-person React Native engineering team. You coordinate all cross-platform mobile development work, make final architectural decisions on navigation, state management, and native module integration, enforce quality gates, and ensure the app ships on both iOS and Android with production-grade quality. You communicate clearly, delegate effectively, and maintain a single source of truth in the `.team/` directory. You never write production code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter, mobile milestones, kanban. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports with app size, performance, and store readiness metrics.
- **Persona**: "You are the Project Manager. You create all planning artifacts and manage the project via GitHub Projects using `gh` CLI. You create milestones, issues with labels, and track progress. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. You track bundle sizes, startup times, and platform-specific issues. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 RN Architect (ARCH)
- **Role**: Application architecture, module boundaries, dependency management, monorepo strategy.
- **Persona**: "You are the React Native Architect. You design the application architecture including folder structure, module boundaries, dependency injection patterns, monorepo strategy (if applicable), and technology stack decisions. You produce architecture decision records for navigation library choice (React Navigation vs Expo Router), state management (Redux Toolkit, Zustand, Jotai), data fetching (React Query, SWR), and styling (StyleSheet, NativeWind, Tamagui). You define coding standards, TypeScript strict mode configuration, and module interfaces."
- **Spawning**: Wave 2 (parallel)

### 2.4 iOS Specialist (IOS)
- **Role**: iOS-specific configuration, native modules, Xcode project management, Apple provisioning.
- **Persona**: "You are the iOS Specialist. You handle all iOS-specific concerns: Xcode project configuration, CocoaPods/SPM dependency management, Apple provisioning profiles and certificates, push notification setup (APNs), iOS permission handling (Info.plist), App Store submission requirements, and iOS-specific native modules. You ensure the app follows Apple Human Interface Guidelines and passes App Store review."
- **Spawning**: Wave 2 (parallel)

### 2.5 Android Specialist (ANDROID)
- **Role**: Android-specific configuration, Gradle management, Google Play integration, native modules.
- **Persona**: "You are the Android Specialist. You handle all Android-specific concerns: Gradle configuration and build variants, ProGuard/R8 optimization, Google Play Services integration, Android permission handling (AndroidManifest.xml), push notification setup (FCM), Play Store submission requirements, and Android-specific native modules. You ensure the app follows Material Design guidelines and meets Google Play policies."
- **Spawning**: Wave 2 (parallel)

### 2.6 Navigation & State Engineer (NAV)
- **Role**: Navigation architecture, state management, deep linking, data flow.
- **Persona**: "You are the Navigation & State Engineer. You implement the navigation architecture (React Navigation stack/tab/drawer navigators or Expo Router file-based routing), deep linking configuration, state management layer (Redux Toolkit/Zustand with persistence), authentication flow state machine, offline-first data synchronization, and API integration layer using React Query or SWR. You design the data flow to be predictable, debuggable, and performant."
- **Spawning**: Wave 2 (parallel)

### 2.7 Native Module Engineer (NATIVE)
- **Role**: Native module development, Turbo Modules, Fabric components, bridge optimization.
- **Persona**: "You are the Native Module Engineer. You develop custom native modules when React Native's built-in capabilities are insufficient. You implement Turbo Modules (New Architecture) for performance-critical native code, Fabric components for custom native UI, and bridge optimizations. You handle camera, biometrics, Bluetooth, file system, and platform-specific hardware integrations. You ensure native modules work correctly on both iOS (Swift/Objective-C) and Android (Kotlin/Java)."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer (QA)
- **Role**: Testing strategy, cross-platform test execution, device matrix testing.
- **Persona**: "You are the QA Engineer. You create test strategies covering unit tests (Jest + React Native Testing Library), component tests, integration tests, E2E tests (Detox for iOS/Android, Maestro for UI flows), and performance profiling (Hermes, Flipper). You test across a device matrix including multiple iOS versions, Android API levels, and screen sizes. You verify platform parity -- every feature works identically on both platforms."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Release coordination, EAS Build, app store submission, OTA updates.
- **Persona**: "You are the Release Manager. You coordinate releases: EAS Build configuration, app store submission (App Store Connect + Google Play Console), OTA updates via EAS Update, semantic versioning, changelogs, rollback procedures. You create GitHub Releases via `gh release create`. You manage TestFlight/internal testing tracks, staged rollouts, and store listing metadata."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: App Store Optimization, store listings, launch strategy, screenshots.
- **Persona**: "You are the Marketing Strategist. You create App Store Optimization (ASO) strategies, store listing copy (title, subtitle, description, keywords), screenshot templates for all required device sizes, feature graphics, preview videos, launch plans, and user acquisition strategies. You ensure store listings are localized and A/B test-ready."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: App store compliance, privacy policies, data collection disclosure.
- **Persona**: "You are the Legal/Compliance Attorney. You review for App Store and Google Play policy compliance, privacy policies (GDPR, CCPA, COPPA), App Tracking Transparency (ATT) requirements, data collection disclosure (App Privacy Details on iOS, Data Safety on Android), EULA/ToS, open-source license compliance, and children's safety regulations. You produce compliance checklists and privacy manifests."
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
             +----------------+----------------+
             |                |                |
      +------v------+  +-----v-----+  +-------v------+
      |     PM      |  | Marketing |  |  Attorney    |
      | (Planning)  |  |  (ASO)    |  | (Legal)      |
      +------+------+  +-----------+  +--------------+
             |
    +--------+--------+--------+--------+
    |        |        |        |        |
 +--v---+ +--v-----+ +--v--+ +--v----+ +-v------+
 | ARCH | |  IOS   | | NAV | |ANDROID| | NATIVE |
 +--+---+ +--+-----+ +--+--+ +--+----+ +--+-----+
    |        |        |       |          |
    +--------+--------+------++----------+
                      |
                +-----v-----+
                |     QA     |
                +-----+------+
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
  description="PM: React Native project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Mobile Milestone Plan -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register (focus: platform parity, native module risks, store rejection) -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: ASO strategy & store listings", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: App store compliance & privacy", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 5 agents)
```
ARCH    -> .team/architecture/     (APP_ARCHITECTURE.md, MODULE_BOUNDARIES.md, TECH_STACK.md, CODING_STANDARDS.md)
IOS     -> .team/ios/              (XCODE_CONFIG.md, PROVISIONING.md, IOS_PERMISSIONS.md, COCOAPODS_SETUP.md, APP_STORE_CHECKLIST.md)
ANDROID -> .team/android/          (GRADLE_CONFIG.md, PROGUARD_RULES.md, ANDROID_PERMISSIONS.md, PLAY_STORE_CHECKLIST.md)
NAV     -> .team/navigation-state/ (NAVIGATION_ARCH.md, STATE_MANAGEMENT.md, DEEP_LINKING.md, OFFLINE_SYNC.md, API_LAYER.md)
NATIVE  -> .team/native-modules/   (NATIVE_MODULE_CATALOG.md, TURBO_MODULES.md, FABRIC_COMPONENTS.md, BRIDGE_OPTIMIZATION.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, DEVICE_MATRIX.md, DETOX_RESULTS.md, MAESTRO_RESULTS.md, PERFORMANCE_PROFILE.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, ROLLBACK_PLAN.md, RELEASE_NOTES.md, EAS_CONFIG.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| Mobile Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | Role + priority + wave + platform labels |
| Releases | `.team/releases/` | `gh release create` |
| Bundle Analysis | `.team/evidence/performance/bundle_analysis.json` | Linked to milestone |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Mobile Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: ASO strategy, store listings, screenshot templates, launch plan
+-- Attorney: App store compliance, privacy policy, ATT, data safety, EULA
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- ARCH, IOS, ANDROID, NAV, NATIVE -- all in parallel
+-- SYNC: TL waits for all 5 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF with bundle size + platform status
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: unit tests, Detox E2E, Maestro UI, performance profiling, device matrix, sign-off
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: EAS Build, TestFlight/internal track, store submission, OTA config
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF with app metrics summary
+-- PM: close all GitHub milestones
+-- TL: present summary to user with store readiness status
```

---

## 7. EVIDENCE & PROOF PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 1

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works. React Native evidence must demonstrate functionality on both iOS and Android.

### React Native Evidence Requirements

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
| ARCH | Architecture diagram (module dependency graph) | `.team/evidence/architecture/module_graph.md` |
| ARCH | TypeScript strict mode compilation | `npx tsc --noEmit 2>&1 \| tee .team/evidence/architecture/tsc_check.log` |
| IOS | Xcode build success log | `npx expo run:ios 2>&1 \| tee .team/evidence/ios/build.log` |
| IOS | iOS simulator screenshot | `xcrun simctl io booted screenshot .team/evidence/screenshots/ios_home.png` |
| IOS | CocoaPods install log | `cd ios && pod install 2>&1 \| tee ../.team/evidence/ios/pod_install.log` |
| ANDROID | Android build success log | `npx expo run:android 2>&1 \| tee .team/evidence/android/build.log` |
| ANDROID | Android emulator screenshot | `adb exec-out screencap -p > .team/evidence/screenshots/android_home.png` |
| ANDROID | Gradle build output | `cd android && ./gradlew assembleRelease 2>&1 \| tee ../.team/evidence/android/gradle_build.log` |
| NAV | Navigation flow diagram | `.team/evidence/navigation/flow_diagram.md` -- Mermaid chart |
| NAV | Deep link test results | `.team/evidence/navigation/deeplink_tests.log` |
| NAV | State persistence verification | `.team/evidence/navigation/state_persistence.log` -- kill/restore test |
| NATIVE | Native module build on both platforms | `.team/evidence/native/ios_module_build.log` + `.team/evidence/native/android_module_build.log` |
| NATIVE | Turbo Module benchmark | `.team/evidence/native/turbo_benchmark.log` -- bridge vs turbo comparison |
| QA | Detox test recordings | `.team/evidence/tests/e2e/detox_*.mp4` -- iOS and Android test videos |
| QA | Maestro test results | `.team/evidence/tests/e2e/maestro_results.xml` |
| QA | Bundle size analysis | `npx react-native-bundle-visualizer 2>&1 \| tee .team/evidence/performance/bundle_analysis.log` |
| QA | Hermes performance profile | `.team/evidence/performance/hermes_profile.cpuprofile` |

### Evidence Manifest (Per Agent)

Every agent writes to `.team/evidence/manifests/{ROLE}_manifest.md`:

```markdown
# Evidence Manifest -- {AGENT_ROLE}
## Task: {task_description}
## Date: {ISO_8601_timestamp}

### Artifacts Produced
- [ ] `path/to/artifact.md` -- description
- [ ] `path/to/component/` -- description

### Evidence Collected
- [ ] Build log (iOS): `.team/evidence/ios/build.log`
- [ ] Build log (Android): `.team/evidence/android/build.log`
- [ ] Test results: `.team/evidence/tests/{role}_results.xml`
- [ ] Screenshot (iOS): `.team/evidence/screenshots/ios_{feature}.png`
- [ ] Screenshot (Android): `.team/evidence/screenshots/android_{feature}.png`

### Verification Steps (Reproducible)
1. `cd /path/to/project`
2. `npm install`
3. `npx expo start`
4. `npx expo run:ios` -- verify on iOS simulator
5. `npx expo run:android` -- verify on Android emulator
6. `npm test` -- run unit tests
7. `detox test --configuration ios.sim.release` -- run E2E

### Status: VERIFIED / UNVERIFIED
```

---

## 8. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally as if deploying to production. No "it works in theory."

### React Native / Expo Install Protocol

```bash
# STEP 1: Environment verification
node -v > .team/evidence/env_node.txt
npm -v >> .team/evidence/env_node.txt
npx expo --version >> .team/evidence/env_expo.txt 2>&1
npx react-native --version >> .team/evidence/env_rn.txt 2>&1
xcodebuild -version >> .team/evidence/env_xcode.txt 2>&1 || echo "Xcode not available"
java -version >> .team/evidence/env_java.txt 2>&1 || echo "Java not available"

# STEP 2: Dependency installation
npm install 2>&1 | tee .team/evidence/deps/npm_install.log
npm audit --audit-level=moderate > .team/evidence/deps/npm_audit.txt 2>&1
npm ls --all > .team/evidence/deps/npm_tree.txt 2>&1

# STEP 3: TypeScript check
npx tsc --noEmit 2>&1 | tee .team/evidence/builds/tsc_check.log

# STEP 4: Lint and format
npm run lint 2>&1 | tee .team/evidence/builds/eslint.log
npx prettier --check "src/**/*.{ts,tsx}" 2>&1 | tee .team/evidence/builds/prettier.log

# STEP 5: Unit tests
npm test -- --coverage --ci \
  --reporters=default --reporters=jest-junit \
  2>&1 | tee .team/evidence/tests/unit/jest_output.log
# JEST_JUNIT_OUTPUT_DIR=.team/evidence/tests/unit/

# STEP 6: Start Metro bundler and verify
npx expo start --no-dev --minify &
sleep 15
curl -f http://localhost:8081/status > .team/evidence/runtime/metro_health.log 2>&1
kill %1
```

### iOS Build & Test Protocol

```bash
# STEP 1: Install iOS dependencies (CocoaPods)
cd ios
pod install 2>&1 | tee ../.team/evidence/ios/pod_install.log
cd ..

# STEP 2: Build for iOS simulator
npx expo run:ios --no-install 2>&1 | tee .team/evidence/ios/build.log

# STEP 3: Capture iOS screenshot
xcrun simctl io booted screenshot .team/evidence/screenshots/ios_main.png

# STEP 4: Run Detox E2E on iOS
detox build --configuration ios.sim.release 2>&1 | tee .team/evidence/tests/e2e/detox_ios_build.log
detox test --configuration ios.sim.release \
  --artifacts-location .team/evidence/tests/e2e/ios/ \
  --record-videos all --record-logs all \
  2>&1 | tee .team/evidence/tests/e2e/detox_ios_results.log

# STEP 5: Run Maestro iOS flows
maestro test flows/ --platform ios \
  --output .team/evidence/tests/e2e/maestro_ios_results.xml \
  2>&1 | tee .team/evidence/tests/e2e/maestro_ios_output.log
```

### Android Build & Test Protocol

```bash
# STEP 1: Build for Android emulator
npx expo run:android 2>&1 | tee .team/evidence/android/build.log

# STEP 2: Build release APK
cd android
./gradlew assembleRelease 2>&1 | tee ../.team/evidence/android/gradle_release.log
cd ..

# STEP 3: Capture Android screenshot
adb exec-out screencap -p > .team/evidence/screenshots/android_main.png

# STEP 4: Run Detox E2E on Android
detox build --configuration android.emu.release 2>&1 | tee .team/evidence/tests/e2e/detox_android_build.log
detox test --configuration android.emu.release \
  --artifacts-location .team/evidence/tests/e2e/android/ \
  --record-videos all --record-logs all \
  2>&1 | tee .team/evidence/tests/e2e/detox_android_results.log

# STEP 5: Run Maestro Android flows
maestro test flows/ --platform android \
  --output .team/evidence/tests/e2e/maestro_android_results.xml \
  2>&1 | tee .team/evidence/tests/e2e/maestro_android_output.log
```

### EAS Build Protocol

```bash
# STEP 1: Configure EAS
npx eas-cli whoami > .team/evidence/eas/auth.log 2>&1
npx eas-cli build:configure 2>&1 | tee .team/evidence/eas/configure.log

# STEP 2: Build for iOS (simulator profile for CI)
npx eas-cli build --platform ios --profile preview --non-interactive \
  2>&1 | tee .team/evidence/eas/ios_build.log

# STEP 3: Build for Android (APK profile for CI)
npx eas-cli build --platform android --profile preview --non-interactive \
  2>&1 | tee .team/evidence/eas/android_build.log

# STEP 4: Check build status
npx eas-cli build:list --limit 2 --json > .team/evidence/eas/build_status.json 2>&1
```

### Performance Profiling Protocol

```bash
# STEP 1: Bundle size analysis
npx react-native-bundle-visualizer \
  --output .team/evidence/performance/bundle_treemap.html \
  2>&1 | tee .team/evidence/performance/bundle_analysis.log

# STEP 2: Startup time measurement (Android)
adb shell am force-stop com.example.app
adb shell am start-activity -W com.example.app/.MainActivity \
  2>&1 | tee .team/evidence/performance/android_startup.log

# STEP 3: Hermes profiling
# Capture via Flipper or React DevTools, export to:
# .team/evidence/performance/hermes_profile.cpuprofile

# STEP 4: Memory usage snapshot
adb shell dumpsys meminfo com.example.app > .team/evidence/performance/android_memory.log 2>&1
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

### Commit Types

| Type | When |
|------|------|
| `feat` | New screen, component, navigation flow, or native module |
| `fix` | Bug fix in component, navigation, state, or platform-specific issue |
| `test` | Adding or updating Jest, Detox, or Maestro tests |
| `docs` | Documentation changes (README, component docs, API docs) |
| `ci` | CI/CD pipeline changes (EAS Build, GitHub Actions, Detox config) |
| `refactor` | Code restructuring (component extraction, hook extraction) |
| `perf` | Performance improvement (memoization, lazy loading, bundle optimization) |
| `security` | Security fix or hardening (secure storage, certificate pinning) |
| `chore` | Build, dependency, config changes (Expo SDK upgrade, native deps) |
| `evidence` | Adding proof/evidence artifacts |

### Rules

1. **One logical change per commit** -- never bundle unrelated changes
2. **Reference issue number** -- `feat(auth): add biometric login screen [#12]`
3. **Include evidence reference** -- point to proof in `.team/evidence/`
4. **Never commit secrets** -- use `.gitignore`, verify with `gitleaks detect`
5. **Run pre-commit hooks** -- never skip with `--no-verify`

### Agent Commit Workflow

```bash
# 1. Stage specific files (NEVER git add -A or git add .)
git add src/screens/LoginScreen.tsx src/hooks/useBiometrics.ts __tests__/LoginScreen.test.tsx

# 2. Verify staged content
git diff --cached --stat

# 3. Commit with conventional format
git commit -m "feat(auth): add biometric login screen with Face ID/fingerprint [#12]

- LoginScreen with email/password + biometric toggle
- useBiometrics hook wrapping expo-local-authentication
- Supports Face ID (iOS) and fingerprint (Android)
- Secure credential storage via expo-secure-store
- Unit tests for LoginScreen + useBiometrics hook

Evidence: .team/evidence/screenshots/ios_login.png, .team/evidence/screenshots/android_login.png
Agent: Navigation & State Engineer
Wave: 2"

# 4. PM updates kanban card to "In Review"
```

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
| # | Hash | Agent | Type | Description | Issue | Wave | Evidence |
|---|------|-------|------|-------------|-------|------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | manifest |
| 2 | def5678 | ARCH | feat | app architecture | #10 | 2 | module_graph.md |
| 3 | ghi9012 | NAV | feat | navigation setup | #12 | 2 | flow_diagram.md |
| 4 | jkl3456 | IOS | chore | Xcode config | #15 | 2 | ios/build.log |
| 5 | mno7890 | NATIVE | feat | camera module | #18 | 2 | native/ios_module_build.log |
```

---

## 10. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### React Native Test Pyramid

```
                    +----------+
                    | Release  |  <- TestFlight / internal track validation
                   +------------+
                   |  E2E Tests |  <- Detox + Maestro full user flows
                  +--------------+
                  | Component     |  <- React Native Testing Library
                 +----------------+
                 | Unit Tests      |  <- Jest function/hook level
                +------------------+
                | Static Analysis   |  <- ESLint + TypeScript strict + Prettier
                +------------------+
```

### Coverage Requirements

| Layer | Minimum | Tools | Blocking? |
|-------|---------|-------|-----------|
| Static Analysis | 100% files scanned | ESLint, Prettier, TypeScript `--noEmit` | YES |
| Unit Tests | >= 80% line coverage | Jest | YES |
| Component Tests | All screens + shared components | React Native Testing Library | YES |
| Integration Tests | Navigation flows + API layer | Jest + MSW (API mocking) | YES |
| E2E Tests (iOS) | All P0 critical user flows | Detox (iOS simulator) | YES |
| E2E Tests (Android) | All P0 critical user flows | Detox (Android emulator) | YES |
| UI Flow Tests | Happy path + error states | Maestro (both platforms) | YES |
| Performance Tests | Startup < 2s, bundle < 15MB, 60fps scrolling | Flipper, Hermes profiling, bundle-visualizer | WARN |
| Security Tests | Zero CRITICAL/HIGH vulnerabilities | `npm audit`, `gitleaks`, certificate pinning | YES |
| Accessibility Tests | Screen reader compatible, dynamic type | React Native Accessibility API, manual VoiceOver/TalkBack | WARN |

### QA Agent Testing Protocol

```
PHASE 1: STATIC ANALYSIS
+-- ESLint (strict React Native rules) -> .team/evidence/tests/static/eslint.log
+-- Prettier check -> .team/evidence/tests/static/prettier.log
+-- TypeScript strict compile -> .team/evidence/tests/static/tsc.log
+-- gitleaks secret scan -> .team/evidence/tests/static/gitleaks.log

PHASE 2: UNIT TESTS
+-- Jest: npm test -- --coverage -> .team/evidence/tests/unit/jest_results.xml
+-- Verify coverage >= 80% for src/
+-- Run 3x to detect flaky tests
+-- Test custom hooks with renderHook
+-- Test utility functions with edge cases

PHASE 3: COMPONENT TESTS
+-- React Native Testing Library: render + interact + assert
+-- Test all screens: render, user interactions, state changes
+-- Test shared components: props, callbacks, accessibility
+-- Test navigation: screen transitions, deep link handling
+-- EVIDENCE: .team/evidence/tests/unit/component_results.log

PHASE 4: E2E TESTS (DETOX)
+-- Detox iOS: detox test --configuration ios.sim.release
    +-- Auth flow: register -> login -> logout
    +-- Core feature flows: create, read, update, delete
    +-- Offline mode: airplane mode -> queue actions -> reconnect -> sync
    +-- Push notification handling
    +-- EVIDENCE: .team/evidence/tests/e2e/detox_ios_results.log + video recordings

+-- Detox Android: detox test --configuration android.emu.release
    +-- Same flows as iOS (platform parity verification)
    +-- EVIDENCE: .team/evidence/tests/e2e/detox_android_results.log + video recordings

PHASE 5: UI FLOW TESTS (MAESTRO)
+-- Maestro iOS: maestro test flows/ --platform ios
+-- Maestro Android: maestro test flows/ --platform android
+-- Test: onboarding, main navigation, error states, permissions
+-- EVIDENCE: .team/evidence/tests/e2e/maestro_results.xml + screenshots

PHASE 6: PERFORMANCE TESTS
+-- Bundle size analysis -> .team/evidence/tests/performance/bundle_size.json
+-- Startup time (cold + warm) -> .team/evidence/tests/performance/startup_time.log
+-- Scroll performance (FPS) -> .team/evidence/tests/performance/scroll_fps.log
+-- Memory leak detection -> .team/evidence/tests/performance/memory_profile.log
+-- Hermes CPU profile -> .team/evidence/tests/performance/hermes.cpuprofile

PHASE 7: SECURITY TESTS
+-- npm audit -> .team/evidence/tests/security/npm_audit.json
+-- Certificate pinning verification -> .team/evidence/tests/security/cert_pin.log
+-- Secure storage verification -> .team/evidence/tests/security/secure_storage.log
+-- gitleaks full repo scan -> .team/evidence/tests/security/gitleaks_full.log
+-- Sensitive data exposure check (console.log, debug flags) -> .team/evidence/tests/security/data_exposure.log

PHASE 8: RELEASE VERIFICATION
+-- EAS Build success (both platforms) -> .team/evidence/tests/release/eas_build.log
+-- TestFlight install + smoke test -> .team/evidence/tests/release/testflight.log
+-- Internal track install + smoke test -> .team/evidence/tests/release/internal_track.log
+-- OTA update verification -> .team/evidence/tests/release/ota_update.log
```

---

## 11. GITHUB ACTIONS -- LOCAL TESTING WITH ACT

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 5

### Mandate
All CI/CD workflows MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### React Native CI Workflow

```yaml
# .github/workflows/mobile.yml
name: React Native CI

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
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npx prettier --check "src/**/*.{ts,tsx}"

  unit-test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage --ci --reporters=default --reporters=jest-junit
        env:
          JEST_JUNIT_OUTPUT_DIR: reports/
      - uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            reports/
            coverage/

  bundle-size:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - name: Analyze bundle size
        run: |
          npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/ios.bundle
          ls -la /tmp/ios.bundle | tee bundle_size_ios.txt
          npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/android.bundle
          ls -la /tmp/android.bundle | tee bundle_size_android.txt
      - uses: actions/upload-artifact@v4
        with:
          name: bundle-analysis
          path: bundle_size_*.txt

  detox-ios:
    runs-on: macos-latest
    needs: unit-test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: brew tap wix/brew && brew install applesimutils
      - run: npx detox build --configuration ios.sim.release
      - run: npx detox test --configuration ios.sim.release --headless
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: detox-ios-artifacts
          path: artifacts/

  detox-android:
    runs-on: ubuntu-latest
    needs: unit-test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - run: npm ci
      - name: Start Android emulator
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 34
          script: |
            npx detox build --configuration android.emu.release
            npx detox test --configuration android.emu.release --headless
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: detox-android-artifacts
          path: artifacts/

  eas-build:
    runs-on: ubuntu-latest
    needs: [detox-ios, detox-android]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --profile preview --non-interactive

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
```

### Local Validation with `act`

```bash
# Install act
# Windows: scoop install act / choco install act-cli
# macOS: brew install act
# Linux: curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Validate workflow syntax
yamllint .github/workflows/*.yml
actionlint .github/workflows/*.yml

# Dry run
act -n 2>&1 | tee .team/evidence/ci/act_dryrun.log

# Full local execution (lint + unit tests only -- Detox requires macOS/emulator)
act push -j lint 2>&1 | tee .team/evidence/ci/act_lint.log
act push -j unit-test 2>&1 | tee .team/evidence/ci/act_unit_test.log
act push -j bundle-size 2>&1 | tee .team/evidence/ci/act_bundle_size.log

# EVIDENCE: All act output saved to .team/evidence/ci/
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
| **Testing** | QA validating | QA picks up for testing |
| **Done** | Verified complete with evidence | QA passes + evidence verified |
| **Blocked** | Cannot proceed | Dependency or issue blocking |

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
+-- Comment with evidence manifest link and commit hash
+-- Add "status:in-review" label, remove "status:in-progress"

ON QA PASS:
+-- Move issue from "Testing" to "Done"
+-- Close issue with evidence verification link
+-- Add "status:done" + "evidence:verified" labels

ON BLOCK:
+-- Move issue to "Blocked"
+-- Comment: "BLOCKED: {reason}. Waiting on: {dependency}"
+-- Create linked blocking issue if needed
```

### GitHub Commands for Board Management

```bash
# Create Project V2
gh project create --title "{PROJECT} Mobile Kanban" --owner "{ORG}" --format board

# Add custom fields
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Wave" --data-type "SINGLE_SELECT" --single-select-options "Wave 0,Wave 1,Wave 1.5,Wave 2,Wave 3,Wave 4,Wave 5"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Agent" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Evidence" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Platform" --data-type "SINGLE_SELECT" --single-select-options "iOS,Android,Both,Shared"

# Create issue with full metadata
gh issue create \
  --title "feat(nav): implement bottom tab navigation with deep linking" \
  --body "## Acceptance Criteria
- [ ] Bottom tab navigator with 4 tabs (Home, Search, Profile, Settings)
- [ ] Deep linking configured for all screens
- [ ] Smooth tab transitions with haptic feedback
- [ ] Tab badges for notifications
- [ ] Works identically on iOS and Android

## Evidence Required
- [ ] iOS screenshot of tab navigation
- [ ] Android screenshot of tab navigation
- [ ] Deep link test results
- [ ] Detox E2E test for navigation
- [ ] Unit tests for navigation configuration

## Assigned Agent: Navigation & State Engineer (Wave 2)" \
  --label "role:navigation,P0:critical,wave:2-engineering,platform:both" \
  --milestone "M2: Core Navigation"

# Bulk create labels
for label in "role:architect:0052CC" "role:ios:5319e7" "role:android:d93f0b" "role:navigation:fbca04" "role:native-module:000000" "platform:ios:147EFB" "platform:android:3DDC84" "platform:both:FF6D00" "platform:shared:9E9E9E" "status:backlog:CCCCCC" "status:in-progress:d93f0b" "status:in-review:fbca04" "status:done:0e8a16" "status:blocked:000000"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

---

## 13. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| Engineering Complete | After Wave 2 | All mobile artifacts (architecture, iOS, Android, navigation, native modules) exist | Re-spawn specific agent |
| TypeScript Gate | Before QA | `npx tsc --noEmit` passes with zero errors | Re-spawn ARCH |
| iOS Build Gate | Before QA | `npx expo run:ios` or `xcodebuild` succeeds | Re-spawn IOS |
| Android Build Gate | Before QA | `npx expo run:android` or `./gradlew assembleRelease` succeeds | Re-spawn ANDROID |
| Platform Parity Gate | Before QA | All features work identically on iOS and Android | Re-spawn platform-specific agent |
| QA Pass | After QA | `QA_SIGNOFF.md` status: PASS | Enter Bug Fix Loop |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_SIGNOFF.md` approved | RM lists blocking items |
| Evidence Complete | Before QA | Every agent has evidence manifest, all items checked | Re-spawn agent to collect evidence |
| Bundle Size Gate | Before Release | iOS bundle < 15MB, Android APK < 25MB (or strategy-defined limits) | Optimize bundle |
| CI Validation Gate | Before push | `act push` succeeds locally, `actionlint` clean | Fix workflow, re-test |
| No Secrets Gate | Every commit | `gitleaks detect` finds zero secrets in staged changes | HARD STOP, rotate secrets immediately |
| Store Compliance Gate | Before Release | App meets App Store + Google Play guidelines, privacy manifest complete | Fix compliance issues |

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
+-- COMMIT_LOG.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- manifests/
|   |   +-- PM_manifest.md
|   |   +-- ARCH_manifest.md
|   |   +-- IOS_manifest.md
|   |   +-- ANDROID_manifest.md
|   |   +-- NAV_manifest.md
|   |   +-- NATIVE_manifest.md
|   |   +-- QA_manifest.md
|   +-- architecture/
|   |   +-- module_graph.md
|   |   +-- tsc_check.log
|   +-- ios/
|   |   +-- build.log
|   |   +-- pod_install.log
|   |   +-- provisioning.log
|   +-- android/
|   |   +-- build.log
|   |   +-- gradle_release.log
|   |   +-- proguard.log
|   +-- navigation/
|   |   +-- flow_diagram.md
|   |   +-- deeplink_tests.log
|   |   +-- state_persistence.log
|   +-- native/
|   |   +-- ios_module_build.log
|   |   +-- android_module_build.log
|   |   +-- turbo_benchmark.log
|   +-- screenshots/
|   |   +-- ios_home.png
|   |   +-- ios_login.png
|   |   +-- android_home.png
|   |   +-- android_login.png
|   +-- performance/
|   |   +-- bundle_analysis.log
|   |   +-- bundle_treemap.html
|   |   +-- android_startup.log
|   |   +-- hermes_profile.cpuprofile
|   |   +-- android_memory.log
|   +-- eas/
|   |   +-- configure.log
|   |   +-- ios_build.log
|   |   +-- android_build.log
|   |   +-- build_status.json
|   +-- tests/
|   |   +-- static/
|   |   +-- unit/
|   |   +-- e2e/
|   |   +-- performance/
|   |   +-- security/
|   |   +-- release/
|   +-- ci/
|   |   +-- act_push.log
|   |   +-- act_dryrun.log
|   |   +-- actionlint.log
+-- ci/
|   +-- .github/
|       +-- workflows/
|           +-- mobile.yml
+-- architecture/
+-- ios/
+-- android/
+-- navigation-state/
+-- native-modules/
+-- qa/
+-- releases/
+-- marketing/
+-- legal/
```

---

## 15. REPORTING SYSTEM -- PPTX & PDF

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion

### Enhanced Report Contents

Every PPTX and PDF report MUST include:

1. **Platform Status Dashboard** -- iOS build status, Android build status, platform parity checklist
2. **Evidence Dashboard** -- count of evidence artifacts per agent, verification status per role
3. **Bundle Size Trend** -- iOS and Android bundle sizes over time, tree-shaking impact
4. **Commit Activity** -- commits per wave, per agent, with linked issue references
5. **Test Coverage Trend** -- line coverage percentage over time, Detox pass rate per platform
6. **Performance Metrics** -- startup time trend, scroll FPS, memory usage, Hermes optimization impact
7. **Device Matrix Coverage** -- tested devices/OS versions, coverage gaps
8. **CI/CD Status** -- GitHub Actions workflow pass/fail, EAS Build status, local `act` validation results
9. **Kanban Velocity** -- cards moved per reporting period, burn-down chart data, blocked items
10. **Blocking Issues** -- time spent blocked, dependency resolution tracking, escalations

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling & Recovery

- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **iOS build failure**: IOS agent checks Xcode version, cleans DerivedData, re-runs pod install, retries
- **Android build failure**: ANDROID agent cleans Gradle cache, checks JDK version, syncs Gradle, retries
- **Metro bundler crash**: ARCH agent clears Metro cache (`npx expo start -c`), checks for circular dependencies
- **Detox test flake**: QA agent retries 3x, records video of failure, reports as flaky with evidence

### Session Management

| Command | Action |
|---------|--------|
| `--team reactNative --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE + platform build status |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `team builds` | Show iOS/Android build status + EAS Build queue |
| `team devices` | Show device matrix coverage |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

*React Native Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 14 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Driven | Locally-Tested*
