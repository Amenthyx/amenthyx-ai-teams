# Swift iOS Team — Tailored Strategy v3.1

> Pre-configured for **Swift/SwiftUI iOS and Apple ecosystem development with SwiftData, Combine, and App Store deployment**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team swiftIOS --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]
**One-Line Vision**: [FILL IN]
**Problem Statement**: [FILL IN]
**Desired Outcome**: [FILL IN]
**Project Type**: [FILL IN: Greenfield / Extending / Migration / Rewrite / Prototype / MVP / Production]
**Repository**: [FILL IN: GitHub URL or desired repo name]

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

## 4. Technical Constraints *(pre-configured for Swift iOS Team)*

**Required Tech Stack**:
- **Language**: Swift 5.9+
- **Framework**: SwiftUI (primary) / UIKit (legacy or complex custom UI) / Combine (reactive streams)
- **Database**: SwiftData (primary, iOS 17+) / Core Data (legacy) / CloudKit (iCloud sync)
- **Cache**: NSCache (in-memory) / URLCache (HTTP responses) / FileManager (disk)
- **Message Queue**: N/A (push notifications via APNs, background tasks via BGTaskScheduler)

**Hosting/Infrastructure**:
- **Cloud Provider**: Apple (iCloud, CloudKit, APNs) / Firebase / custom backend
- **Deployment**: App Store (production) / TestFlight (beta) / Xcode Cloud (CI/CD)
- **CDN**: Apple CDN (App Store delivery) / CloudFront (custom assets)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Apple Developer Portal | Code signing, provisioning | Apple ID + certificates | N/A |
| App Store Connect | Distribution, analytics | API key / Apple ID | N/A |
| CloudKit | iCloud data sync | Apple Sign-In + entitlements | Per-container quotas |
| APNs | Push notifications | Token-based (.p8 key) | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: Swift Package Manager (Package.swift / Xcode SPM integration)

**Monorepo or Polyrepo**: Single Xcode project / workspace

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Cold start time < 1.5 seconds on iPhone 12 or newer
- Consistent 60 FPS during scrolling and animations (120 FPS on ProMotion devices)
- Memory usage < 100 MB baseline (release mode)
- Smooth animations: zero hitches > 8ms in Instruments Time Profiler

**Security**:
- Authentication: Apple Sign-In / OAuth2 (ASWebAuthenticationSession)
- Authorization: App-level (Keychain for tokens, entitlements for capabilities)
- Keychain: all sensitive data stored in Keychain (not UserDefaults)
- App Transport Security: enforced (no HTTP exceptions unless justified)
- Biometric: Face ID / Touch ID via LocalAuthentication framework
- Certificate pinning: for custom API endpoints (TrustKit or URLSession delegate)
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Backend-dependent (CloudKit auto-scales, custom backend via K8s/serverless), efficient local storage (SwiftData lazy fetching), background fetch for data freshness

**Availability**:
- Uptime target: 99.9% (backend services)
- RTO: 1 hour (backend) / instant (offline-capable features)
- RPO: Per sync interval (CloudKit) or domain-specific
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- VoiceOver: all screens tested with VoiceOver enabled
- Dynamic Type: all text scales with user font size preferences
- Minimum touch target: 44x44 points (Apple HIG)
- Color contrast: WCAG AA ratios
- Reduce Motion: respect UIAccessibility.isReduceMotionEnabled
- Switch Control: all interactive elements navigable

**Observability**:
- Logging: os_log / Logger (unified logging system) → Console.app
- Metrics: MetricKit (performance + diagnostic payloads from Apple)
- Tracing: Xcode Instruments (Time Profiler, Allocations, Leaks, Core Animation)
- Alerting: Firebase Crashlytics (crash velocity alerts) / Xcode Organizer (crash reports)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (business logic, ViewModels), >= 60% (Views)

**Required Test Types**:
- [x] Unit tests (XCTest — ViewModels, services, domain logic, data transformations)
- [x] UI tests (XCUITest — critical user flows, navigation, form submissions)
- [x] Snapshot tests (swift-snapshot-testing — pixel-perfect UI verification)
- [x] Performance tests (XCTest measure blocks + Instruments — frame rate, memory)
- [x] Accessibility audit (Xcode Accessibility Inspector — all screens verified)
- [x] Concurrency tests (Swift Concurrency — async/await, actor isolation verified)
- [ ] Network tests (optional — URLProtocol mocking, OHHTTPStubs)
- [ ] Widget/Extension tests (optional — if app includes widgets or extensions)

**CI/CD Requirements**:
- [x] GitHub Actions (Xcode Cloud or self-hosted macOS runners)
- [x] Pre-commit hooks (SwiftLint, swift-format via pre-commit framework)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated TestFlight deployment on merge to develop
- [ ] Manual approval gate for App Store release

**Testing Tools**: XCTest, XCUITest, swift-snapshot-testing, SwiftLint, swift-format, Xcode Instruments, Xcode Accessibility Inspector

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
- Infrastructure: [FILL IN: $/month or "minimize"]
- Third-party APIs: [FILL IN: $/month or "free tier only"]
- Domains/SSL: [FILL IN: $ or "already owned"]
- Apple Developer Program: $99/year (required)

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
| Apple Developer Program | $99/year | Card | No — ask first |
| Xcode Cloud | 25 hrs/mo free, then $14.99/mo | Card | No — ask first |
| Firebase (Blaze plan) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on business logic, >= 60% on Views
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] XCUITest E2E tests pass for all P0 user flows
- [ ] Performance targets met (< 1.5s cold start, 60 FPS, < 100 MB RAM)
- [ ] Documentation complete (README, architecture guide, setup instructions)
- [ ] CI/CD pipeline tested and working (Xcode Cloud or GitHub Actions)
- [ ] TestFlight beta tested with real users
- [ ] App Store listing prepared (screenshots, description, keywords, categories)
- [ ] App icons and launch screen configured for all device sizes
- [ ] VoiceOver audit passed for all P0 screens
- [ ] SwiftLint reports zero violations
- [ ] Apple Review Guidelines compliance checklist verified

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
| Apple App Store review rejection | M | H | Pre-review checklist (Apple Review Guidelines), TestFlight beta testing, follow HIG strictly, prepare appeal documentation |
| iOS version fragmentation (users on older iOS) | L | M | Set minimum deployment target (iOS 17+), test on multiple iOS versions, graceful degradation for missing APIs |
| App Store policy changes | L | H | Monitor Apple developer news, maintain flexibility in monetization / data handling, have contingency plans |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- iOS 17+ minimum deployment target
- SwiftUI-first (UIKit only for unavoidable cases, wrapped in UIViewRepresentable)
- Swift Concurrency (async/await, actors) — no legacy completion handler patterns
- Conventional commits enforced

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
- [x] Additional Mobile Engineer (iOS, Swift, SwiftUI)
- [x] Additional QA Engineer (XCTest, XCUITest, device testing)
- [x] Accessibility Specialist (VoiceOver, Dynamic Type, HIG compliance)
- [x] Performance Specialist (Instruments profiling, memory optimization, launch time)
- [x] UI/UX Specialist (SwiftUI animations, custom components, HIG alignment)
- [x] Backend/Cloud Specialist (CloudKit, APNs, server-side integration)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Xcode code coverage — exported results)
- [x] XCUITest E2E results (test navigator output, screenshots on failure)
- [x] Snapshot test results (swift-snapshot-testing — baseline vs actual)
- [x] Instruments profiling (Time Profiler, Allocations — screenshots of key flows)
- [x] VoiceOver audit report (all P0 screens verified with VoiceOver)
- [x] App Store listing screenshots (all required device sizes)
- [x] Security audit (Keychain usage verification, ATS compliance, no hardcoded secrets)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] TestFlight feedback summary (beta tester feedback + crash reports)
- [x] Architecture diagram (MVVM/TCA modules, navigation flow, data layer)

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

*Swift iOS Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Swift 5.9 + SwiftUI + SwiftData + App Store iOS development*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
