# Kotlin Android Team — Tailored Strategy v3.3

> Pre-configured for **Kotlin/Jetpack Compose Android native development with Material 3, Room, and Play Store deployment**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team kotlinAndroid --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]
**One-Line Vision**: [FILL IN]
**Problem Statement**: [FILL IN]
**Desired Outcome**: [FILL IN]
**Project Type**: [FILL IN: Greenfield / Extending / Migration / Rewrite / Prototype / MVP / Production]
**Repository**: [FILL IN: GitHub URL or desired repo name]

---


## 1.1 Deliverable Product Target

> **MANDATORY** — The team MUST deliver a product that can be visualized, demonstrated, and evaluated.
> The Team Leader clarifies the delivery target during the 20-question discovery interview.

**Delivery Target**: [MVP — visually demonstrable minimum viable product / Production — enterprise-ready application for deployment / Prototype — functional proof of concept]

**What "Done" Looks Like**:
- [ ] Application is running and accessible (localhost, staging URL, or deployed)
- [ ] All P0 features are functional and demonstrable
- [ ] A non-technical person can use the core flow without assistance
- [ ] Screenshots of every major screen/feature exist in `.team/screenshots/final/`
- [ ] Documentation website is built and browsable

**Demo Requirements**:
- **Demo format**: [Live demo / Recorded walkthrough / Screenshots + documentation]
- **Demo audience**: [Technical team / Stakeholders / End users / Investors]
- **Demo environment**: [Local / Staging / Production]

**Visual Deliverables** (mandatory):
- [ ] Running application with real UI (not wireframes)
- [ ] Complete user flow from registration/login to core feature
- [ ] Responsive design (desktop + mobile if web/hybrid)
- [ ] Documentation website (`docs/`) with full project documentation
- [ ] `.team/screenshots/` with complete visual evidence

---

## 2. Target Audience

**Primary Users**: [FILL IN]
**Secondary Users**: [FILL IN]

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [Job title] | [Top 3] | [Goals] | [Low/Med/High] |
| [FILL IN] | [Job title] | [Top 3] | [Goals] | [Low/Med/High] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|--------------------|----|
| 1 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |
| 2 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |
| 3 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |

### P1 — Should-Have
| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|--------------------|----|
| 1 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |

### P2 — Nice-to-Have
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [What it does] |

---

## 4. Technical Constraints *(pre-configured for Kotlin Android Team)*

**Required Tech Stack**:
- **Language**: Kotlin 1.9+ (no Java — Kotlin-first)
- **Framework**: Jetpack Compose (UI) / Android SDK 34+ (target) / Material 3 (design system)
- **Database**: Room (local relational) / DataStore (key-value preferences) / Firebase Firestore (cloud)
- **Cache**: OkHttp disk cache (network responses) / DataStore (lightweight persistence)
- **Message Queue**: WorkManager (background tasks, deferred work, periodic sync)

**Hosting/Infrastructure**:
- **Cloud Provider**: Firebase (primary backend) / custom backend — team's choice
- **Deployment**: Google Play Store (production) / Firebase App Distribution (beta) / Internal testing track
- **CDN**: Firebase Hosting (web assets) / CloudFront (custom assets)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Google Play Console | Distribution, analytics | Service account / Google ID | N/A |
| Firebase Auth | Authentication | API key + OAuth tokens | 10K verifications/day (free) |
| Firebase Firestore | Cloud database | Security rules + SDK | 50K reads/day (free tier) |
| Firebase Cloud Messaging | Push notifications | Server key | N/A |
| Firebase Crashlytics | Crash reporting | Automatic via SDK | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: Gradle (Kotlin DSL — build.gradle.kts)

**Monorepo or Polyrepo**: Single Android project (multi-module Gradle for feature separation)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Cold start time < 2 seconds on mid-range device (Pixel 6a class)
- Consistent 60 FPS during scrolling and animations (jank-free Compose rendering)
- Memory usage < 150 MB baseline (release mode)
- APK size < 50 MB (optimized with R8/ProGuard, resource shrinking)

**Security**:
- Authentication: Firebase Auth / OAuth2 (Google Sign-In, credential manager)
- Authorization: Firebase Security Rules / custom RBAC
- Sensitive data: EncryptedSharedPreferences (AndroidX Security) for tokens and secrets
- Biometric: Fingerprint / Face unlock via BiometricPrompt API
- Certificate pinning: OkHttp CertificatePinner for custom API endpoints
- ProGuard/R8: code obfuscation and shrinking enabled for release builds
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Firebase auto-scaling (Firestore, Functions), efficient Compose recomposition (stable keys, remember), Paging 3 for large lists, Coil for image loading with disk cache

**Availability**:
- Uptime target: 99.9% (backend services)
- RTO: 1 hour (backend)
- RPO: 5 minutes (Firestore real-time replication)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- TalkBack: all screens tested with TalkBack enabled
- Content descriptions: all interactive elements and images have contentDescription
- Minimum touch target: 48x48dp (Material 3 guidelines)
- Dynamic text scaling: Compose sp units, tested at 200% font scale
- High contrast: theme supports dark/light mode + high contrast
- Switch Access: all interactive elements navigable

**Observability**:
- Logging: Timber (debug) / Firebase Crashlytics (release — non-fatal + fatal)
- Metrics: Firebase Analytics (user events, screen views, funnels)
- Tracing: Firebase Performance Monitoring (network, screen rendering, custom traces)
- Alerting: Firebase Crashlytics velocity alerts (new crash clusters)
- Memory: LeakCanary (debug builds — automatic leak detection)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (business logic, ViewModels), >= 60% (Compose UI)

**Required Test Types**:
- [x] Unit tests (JUnit 5 — ViewModels, repositories, use cases, data transformations)
- [x] Compose UI tests (Compose UI testing — component rendering, interaction, semantics)
- [x] Instrumented tests (Espresso — legacy views if used, system interactions)
- [x] Local tests (Robolectric — Android framework dependencies without emulator)
- [x] E2E tests (Maestro — full user flow automation, cross-screen navigation)
- [x] Lint checks (ktlint, detekt, Android Lint — zero critical issues)
- [ ] Screenshot tests (optional — Compose Preview Screenshot Testing)
- [ ] Monkey testing (optional — adb monkey for stress testing)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ktlint, detekt via pre-commit framework or Gradle task)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to Firebase App Distribution on merge to develop
- [ ] Manual approval gate for Play Store release

**Testing Tools**: JUnit 5, Compose UI testing, Espresso, Robolectric, Maestro, mockk / Mockito-Kotlin, Turbine (Flow testing), LeakCanary, JaCoCo (coverage)

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN: date or "flexible"]

**Milestones**:
| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |
| M2 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |
| M3 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |

**Budget Constraints**:
- Infrastructure: [FILL IN: $/month or "minimize — Firebase free tier"]
- Third-party APIs: [FILL IN: $/month or "free tier only"]
- Domains/SSL: [FILL IN: $ or "already owned"]
- Google Play Console: $25 one-time registration (required)

---

## 7.1 Cost Approval & Payment Governance *(pre-configured)*

**Token Budget Tolerance**: [FILL IN: e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 (always ask — recommended)
- **Requires explicit approval**: All card payments, subscriptions, purchases
- **Forbidden without user present**: Any recurring subscription, any payment > $50

**External Service Payments**:
| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Google Play Console | $25 one-time | Card | No — ask first |
| Firebase Blaze Plan | Variable (pay-as-you-go) | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on business logic, >= 60% on Compose UI
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows (Maestro)
- [ ] Performance targets met (< 2s cold start, 60 FPS, < 150 MB RAM, < 50 MB APK)
- [ ] Documentation complete (README, architecture guide, setup instructions)
- [ ] CI/CD pipeline tested and working
- [ ] Play Store listing prepared (screenshots, description, categories, content rating)
- [ ] ProGuard/R8 rules verified (no crashes from obfuscation)
- [ ] APK size optimized (R8 shrinking, resource optimization, split APKs / AAB)
- [ ] TalkBack audit passed for all P0 screens
- [ ] ktlint + detekt + Android Lint report zero critical issues
- [ ] LeakCanary reports zero leaks in all P0 flows
- [ ] Firebase App Distribution beta tested

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [Target] | [Method] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [Good aspects] | [Bad aspects] |

**Design Inspiration**: [FILL IN]

**Technical References**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building**:
1. [FILL IN]
2. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Android fragmentation (device/OS diversity) | M | M | Test on multiple devices (Firebase Test Lab), set minSdk 26, use AndroidX compat libraries, responsive layouts |
| Play Store policy changes (data safety, permissions) | M | H | Monitor Play Console policy updates, maintain data safety form, privacy policy, prepare for compliance audits |
| Jetpack Compose breaking changes (rapid evolution) | L | M | Pin Compose BOM version, test upgrades on dedicated branch, follow Compose release notes |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Kotlin-first (no Java source files — all new code in Kotlin)
- Compose-first (UIKit/XML layouts only for unavoidable legacy integration)
- Material 3 design system followed
- Conventional commits enforced
- minSdk 26 (Android 8.0+)

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 blocking bugs

**Agent types the PM may add**:
- [x] Additional Mobile Engineer (Android, Kotlin, Compose)
- [x] Additional QA Engineer (Compose testing, Maestro, device testing)
- [x] Accessibility Specialist (TalkBack, content descriptions, switch access)
- [x] Performance Specialist (profiling, Compose recomposition, APK size, startup time)
- [x] UI/UX Specialist (Material 3, Compose animations, custom components)
- [x] Backend/Firebase Specialist (Firestore rules, Cloud Functions, Auth)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (JaCoCo — HTML + XML)
- [x] Maestro E2E test results (flow recordings, screenshots)
- [x] Compose UI test results (test runner output)
- [x] Android Lint report (zero critical/high issues)
- [x] ktlint + detekt results (zero violations)
- [x] LeakCanary report (zero memory leaks in P0 flows)
- [x] APK size analysis (APK Analyzer — size breakdown, comparison to budget)
- [x] Play Store listing screenshots (all required device sizes + form factors)
- [x] TalkBack audit report (all P0 screens verified)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Firebase Crashlytics dashboard (zero crashes in beta)
- [x] Architecture diagram (modules, navigation graph, data layer, DI graph)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---


## 12.2 Screenshots & Visual Evidence

> **MANDATORY** — The `.team/screenshots/` directory is required for every project.

**Screenshot Directory Structure**:
```
.team/screenshots/
├── setup/                    # Environment setup, initial state
├── features/                 # Feature implementation evidence
│   └── {feature-name}/       # before.png + after.png per feature
├── testing/                  # Test results, coverage reports
├── deployment/               # Deployment evidence
├── mission-control/          # Dashboard captures at wave completions
├── errors/                   # Bug evidence
└── final/                    # Final product walkthrough
    ├── desktop/
    ├── tablet/
    └── mobile/
```

**Screenshot Requirements**:
- [ ] Before/after screenshots for every P0 feature
- [ ] Test result screenshots (unit, integration, e2e)
- [ ] Deployment evidence screenshots
- [ ] Final product screenshots (all viewports)
- [ ] Mission Control dashboard at wave completions
- [ ] Error and empty state screenshots

**Naming Convention**: `{date}_{agent}_{description}.png`

## 12.3 Documentation Website

> **MANDATORY** — Every project includes a `docs/` React documentation site generated by a Documentation Agent.

**Documentation Scope**:
- [ ] Project overview and architecture diagram
- [ ] Getting started / installation guide
- [ ] API reference (auto-generated where possible)
- [ ] User guide with embedded screenshots from `.team/screenshots/`
- [ ] Configuration reference
- [ ] Deployment guide
- [ ] Decision log (key architectural decisions)
- [ ] Changelog

**Tech Stack**: React + Vite + MDX | Dark mode + mobile-responsive
**Agent**: Documentation Engineer (DOCS) — spawned in Wave 2, finalizes in Wave 4
**Deliverable**: Buildable with `npm run build`, servable with `npm run dev`

## 12.4 Mission Control PDF Report

> **MANDATORY** — Comprehensive PDF report downloadable from Mission Control dashboard.

**PDF Report Includes**:
- [ ] Executive summary with key metrics
- [ ] Full discovery interview (20+ Q&A)
- [ ] Complete decision log with rationale
- [ ] Task execution timeline (planned vs actual)
- [ ] Git commit history with agent attribution
- [ ] Quality report (coverage, bugs, security scans)
- [ ] Agent performance metrics
- [ ] Embedded screenshots (not links)
- [ ] Cost analysis (budget vs actual)
- [ ] Deliverables checklist with evidence

**Generation**: Automatic at end of every wave + on-demand via `team report pdf`
**Storage**: `.team/reports/PROJECT_REPORT_{date}.pdf` (follows No-Delete Rule)

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `ai-team` (MANDATORY — all teams use this branch)
**Merge to main**: ONLY after Team Leader receives explicit user approval (hard gate)

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Kotlin Android Team Strategy v3.3 — Amenthyx AI Teams*
*Pre-configured for Kotlin 1.9 + Jetpack Compose + Material 3 + Room Android native development*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven | Deliverable Products | 20-Question Discovery | Screenshots | Docs Website | PDF Reports*
