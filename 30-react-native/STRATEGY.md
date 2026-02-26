# React Native Team — Tailored Strategy v3.1

> Pre-configured for **React Native / Expo cross-platform mobile applications with TypeScript and modern tooling**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team reactNative --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for React Native Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: React Native 0.73+ / Expo SDK 50+ / React Navigation 6+
- **Database**: AsyncStorage (simple KV) / expo-sqlite (local relational) / Supabase (backend)
- **Cache**: React Query (TanStack Query) / MMKV (fast local storage)
- **Message Queue**: N/A (mobile client)

**Hosting/Infrastructure**:
- **Cloud Provider**: EAS (Expo Application Services) for builds + submissions
- **Deployment**: EAS Build + EAS Submit (App Store + Google Play Store)
- **CDN**: N/A (mobile binary distribution via stores)
- **Domain**: N/A (mobile app) / [FILL IN for deep linking domain]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| EAS (Expo) | Build + Submit + OTA Updates | Expo account | Build queue limits |
| App Store Connect | iOS distribution | App Store Connect API key | N/A |
| Google Play Console | Android distribution | Service account | N/A |
| Backend API | Data layer | JWT / OAuth2 tokens | [FILL IN] |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: npm / yarn

**Repo Structure**: Expo managed workflow (`app/`, `components/`, `hooks/`, `services/`, `stores/`, `assets/`, `constants/`)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Cold start time: < 2 seconds (both platforms)
- UI frame rate: 60fps (smooth scrolling, animations)
- Memory usage: < 150MB RAM
- Bundle size: < 50MB (binary download size)

**Security**:
- Authentication: JWT stored in Keychain (iOS) / Keystore (Android) via expo-secure-store
- Certificate pinning: Enabled for API communication
- Biometric authentication: FaceID / TouchID / Fingerprint (expo-local-authentication)
- Encryption: TLS 1.3 for all network requests
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- No sensitive data in AsyncStorage (use SecureStore)

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: React Query for intelligent caching/dedup, MMKV for fast local persistence, offline-first patterns with background sync, pagination for all list endpoints

**Availability**:
- App crash rate: < 0.1% (monitored via Sentry/Bugsnag)
- OTA update delivery: < 5 minutes after publish
- Backend dependency: Graceful offline mode for core features
- Multi-region: [FILL IN: backend-dependent]

**Accessibility**:
- WCAG 2.1 AA equivalent for mobile (React Native accessibilityLabel, accessibilityRole, accessibilityHint)
- Screen reader compatible (VoiceOver + TalkBack tested)
- Dynamic type support (iOS) / Font scaling (Android)
- Minimum touch target: 44x44pt (iOS) / 48x48dp (Android)

**Observability**:
- Error tracking: Sentry (React Native SDK with source maps) or Bugsnag
- Analytics: Firebase Analytics / PostHog / Amplitude
- Performance monitoring: React Native Performance (startup, render times)
- Debugging: Flipper (dev), React DevTools, React Native Debugger
- OTA update tracking: EAS Update analytics

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 70% line coverage (components), >= 80% (hooks/services/stores)

**Required Test Types**:
- [x] Unit tests (Jest — hooks, services, stores, utility functions)
- [x] Component tests (React Native Testing Library — component rendering and behavior)
- [x] End-to-end tests (Detox or Maestro — critical user flows on real devices/simulators)
- [x] Platform parity tests (verify feature works on both iOS and Android)
- [x] Accessibility tests (manual VoiceOver + TalkBack testing per release)
- [ ] Performance profiling (optional — React Native Performance monitor)
- [ ] Visual regression tests (optional — screenshot comparison)
- [ ] Deep link testing (optional — URL scheme and universal link validation)

**CI/CD Requirements**:
- [x] GitHub Actions + EAS Build (tested locally with `act` where possible)
- [x] Pre-commit hooks (ESLint + RN plugin, Prettier, tsc --strict via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated EAS Build on merge to develop (internal distribution)
- [ ] Manual approval gate for App Store / Play Store submission
- [ ] TestFlight / Internal Testing track for beta releases

**Testing Tools**: Jest, React Native Testing Library, Detox / Maestro, Flipper, EAS Build

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
- Apple Developer Account: $99/year (required for App Store)
- Google Play Developer: $25 one-time (required for Play Store)
- EAS Build: [FILL IN: free tier / production plan]

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
| EAS Production | ~$99/mo | Card | No — ask first |
| Sentry / Bugsnag | Usage-based | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 70% component test coverage, >= 80% hook/service coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows (Detox/Maestro)
- [ ] Performance targets met (< 2s cold start, 60fps, < 150MB RAM)
- [ ] Platform parity verified (iOS + Android both working)
- [ ] App Store listing created and screenshots uploaded
- [ ] Play Store listing created and screenshots uploaded
- [ ] TestFlight / Internal Testing track published for beta testers
- [ ] Documentation complete (README, setup guide, release process)
- [ ] CI/CD pipeline tested and working (EAS Build + Submit)
- [ ] All environment variables documented

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
| Native module compatibility issues (library doesn't support Expo or RN version) | M | H | Prefer Expo-compatible libraries, test on both platforms early, have native module escape hatch plan (dev client or bare workflow) |
| Expo managed workflow limitations | M | M | Use Expo dev-client for custom native modules, evaluate bare workflow migration if needed, track Expo SDK roadmap |
| Platform-specific bugs (works on iOS, broken on Android or vice versa) | M | M | Test on both platforms in every PR, platform-specific E2E tests, device lab or BrowserStack for diverse device testing |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Expo managed workflow preferred (escape to dev-client only when necessary)
- TypeScript strict mode (`"strict": true` in tsconfig.json)
- Platform parity (every feature must work on both iOS and Android)
- Conventional commits enforced via commitlint

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
- [x] Additional Mobile Engineer (React Native / Expo)
- [x] Additional QA Engineer (Detox / Maestro / Jest)
- [x] Native Module Specialist (iOS Swift / Android Kotlin bridging)
- [x] Performance Specialist (startup optimization, animation tuning, memory profiling)
- [x] UX/UI Specialist (mobile interaction patterns, platform conventions)
- [x] DevOps Specialist (EAS configuration, CI/CD, store submissions)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Jest coverage output — HTML + lcov)
- [x] E2E test results (Detox/Maestro report — screenshots + video)
- [x] Performance profiling report (cold start time, FPS, memory usage)
- [x] Platform parity checklist (feature-by-feature iOS vs Android verification)
- [x] App Store / Play Store listing screenshots (both platforms)
- [x] Security scan results (npm audit, Snyk, or equivalent)
- [x] Bundle size report (EAS build output — binary size for both platforms)
- [x] CI/CD pipeline screenshot (all checks green, EAS build success)
- [x] Beta tester feedback summary (TestFlight / Internal Testing)
- [x] Architecture diagram (navigation structure, state management, API layer)

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

*React Native Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + React Native 0.73+ + Expo SDK 50+ cross-platform mobile development*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
