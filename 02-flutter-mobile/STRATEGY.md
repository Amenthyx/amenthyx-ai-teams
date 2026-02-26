# Flutter Mobile Team — Tailored Strategy v3.1

> Pre-configured for **Flutter/Dart cross-platform mobile development with Material 3, Firebase, and BLoC**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team flutter --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Flutter Mobile Team)*

**Required Tech Stack**:
- **Language**: Dart 3.x
- **Framework**: Flutter 3.x (Material 3 design system)
- **Database**: Firebase Firestore (cloud) / Supabase (alternative) / SQLite via drift or sqflite (local)
- **Cache**: Hive / SharedPreferences (key-value) / flutter_cache_manager (files)
- **Message Queue**: N/A (event-driven via Firebase Cloud Messaging + Streams)

**Hosting/Infrastructure**:
- **Cloud Provider**: Firebase (primary) / Supabase (alternative)
- **Deployment**: Google Play Store + Apple App Store / Firebase App Distribution (beta)
- **CDN**: Firebase Hosting (web build) / CloudFront (if needed)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Firebase Auth | Authentication | API key + OAuth tokens | 10K verifications/day (free) |
| Firebase Firestore | Cloud database | Service account / SDK | 50K reads/day (free tier) |
| Firebase Cloud Messaging | Push notifications | Server key | N/A |
| Firebase Crashlytics | Crash reporting | Automatic via SDK | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: flutter pub (pubspec.yaml)

**Monorepo or Polyrepo**: Single repo

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Cold start time < 2 seconds on mid-range device
- Consistent 60 FPS during scrolling and animations
- Memory usage < 200 MB baseline (release mode)
- Minimal battery drain (background services optimized, no unnecessary wake locks)

**Security**:
- Authentication: Firebase Auth / OAuth2 (Google, Apple Sign-In)
- Authorization: Firebase Security Rules / custom RBAC
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 in transit, AES-256 at rest (device encryption), certificate pinning for API calls
- Biometric authentication: Face ID / Touch ID / Fingerprint via local_auth

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Firebase auto-scaling (Firestore, Functions), CDN for static assets, lazy loading for heavy screens

**Availability**:
- Uptime target: 99.9% (backend services)
- RTO: 1 hour
- RPO: 5 minutes (Firestore real-time replication)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- Semantics labels on all interactive widgets
- Screen reader support (TalkBack / VoiceOver tested)
- Minimum touch target 48x48dp
- Dynamic text scaling support
- High contrast mode compatible

**Observability**:
- Logging: Firebase Crashlytics (crashes + non-fatal errors) + Sentry (optional detailed logging)
- Metrics: Firebase Analytics (user events, screen views, funnels)
- Tracing: Firebase Performance Monitoring (network requests, screen rendering)
- Alerting: Firebase Crashlytics alerts (velocity alerts on new crash clusters)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (business logic / BLoC), >= 60% (widgets)

**Required Test Types**:
- [x] Unit tests (flutter_test — BLoC, repositories, services, entities)
- [x] Widget tests (flutter_test — component rendering, interaction)
- [x] Integration tests (integration_test package — full screen flows on device/emulator)
- [x] Golden tests (optional — pixel-perfect widget snapshots)
- [x] E2E tests (Patrol — cross-platform automated UI flows)
- [x] Performance profiling (Flutter DevTools — frame rendering, memory)
- [ ] Visual regression tests (optional — golden file comparison)
- [ ] Accessibility audit (Accessibility Scanner on Android, Xcode Accessibility Inspector on iOS)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (dart analyze, dart format --set-exit-if-changed via lefthook or husky)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to Firebase App Distribution on merge to develop
- [ ] Manual approval gate for Play Store / App Store release

**Testing Tools**: flutter_test, integration_test, patrol, mockito / mocktail, bloc_test, Firebase Test Lab

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
- Apple Developer Program: $99/year (required for App Store)
- Google Play Console: $25 one-time (required for Play Store)

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
| Google Play Console | $25 one-time | Card | No — ask first |
| Firebase Blaze Plan | Variable (pay-as-you-go) | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on business logic, >= 60% on widgets
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows on both iOS and Android
- [ ] Performance targets met (< 2s cold start, 60 FPS, < 200 MB RAM)
- [ ] Documentation complete (README, setup guide, architecture diagram)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to both stores succeeds (or TestFlight / internal track)
- [ ] App Store / Play Store listing prepared (screenshots, descriptions, icons)
- [ ] App icons and splash screens configured for all resolutions
- [ ] dart analyze reports zero issues

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
| App Store rejection (guideline violations) | M | H | Pre-review checklist, follow HIG/Material guidelines, test on real devices |
| Platform API deprecation (Android/iOS SDK changes) | L | M | Pin SDK versions, monitor deprecation notices, plan upgrade windows |
| Flutter framework breaking changes on upgrade | L | M | Pin Flutter version, test upgrades on separate branch first |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Dart analysis must be clean (zero issues) before every commit
- Material 3 design guidelines followed for all UI components
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
- [x] Additional Mobile Engineer (Flutter/Dart)
- [x] Additional QA Engineer (integration tests, Patrol, device testing)
- [x] UI/UX Specialist (Material 3, animations, responsive layouts)
- [x] Backend/Firebase Specialist (Firestore rules, Cloud Functions, Auth)
- [x] Platform Specialist (native Android/iOS integration, platform channels)
- [x] Performance Specialist (DevTools profiling, memory optimization)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (flutter test --coverage, lcov output)
- [x] Integration test results (device/emulator test run logs)
- [x] Dart analyze output (zero issues confirmation)
- [x] Performance profiling (Flutter DevTools screenshots — frame times, memory)
- [x] App Store / Play Store readiness checklist (screenshots, metadata)
- [x] Security scan results (dependency audit, certificate pinning verification)
- [x] Firebase Crashlytics dashboard (zero crashes in beta testing)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Device compatibility matrix (tested devices + OS versions listed)
- [x] Architecture diagram (feature modules, data flow, BLoC relationships)

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

*Flutter Mobile Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Dart + Flutter + Firebase cross-platform mobile development*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
