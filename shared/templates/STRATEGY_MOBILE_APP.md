# Project Strategy Brief v3.3

> Pre-built strategy template for a cross-platform mobile application.
> Copy this file, customize to your needs, and pass it with `--strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: FitTrack

**One-Line Vision**: A cross-platform fitness tracking app that lets users log workouts, visualize progress over time, and stay motivated through a social feed.

**Problem Statement**: Casual gym-goers (3-5 sessions/week) abandon fitness goals within 6 weeks because they lack visible progress signals and accountability. Existing apps like Strong or Hevy are too complex for non-power-users, and generic notes apps lose data context. This costs users $40-60/month in unused gym memberships.

**Desired Outcome**: Within 6 months, FitTrack has 5,000 active users logging at least 3 workouts per week. Users who track for 8+ weeks show a 40% higher retention rate than the industry average.

**Project Type**: Greenfield / MVP

**Repository**: github.com/yourorg/fittrack

---

## 1.1 Deliverable Product Target

**Delivery Target**: MVP — visually demonstrable minimum viable product

**What "Done" Looks Like**:
- [x] Application is running and accessible on Android and iOS simulators
- [x] All P0 features are functional and demonstrable
- [x] A non-technical person can use the core flow without assistance
- [x] Screenshots of every major screen/feature exist in `.team/screenshots/final/`

**Demo Requirements**:
- **Demo format**: Recorded walkthrough on both Android and iOS simulators
- **Demo audience**: Stakeholders / End users
- **Demo environment**: Local simulators + TestFlight / internal testing track

**Visual Deliverables** (mandatory):
- [x] Running application with real UI (not wireframes)
- [x] Complete user flow from registration/login to core feature
- [x] Responsive design across phone sizes (small, standard, large)
- [x] Documentation website (`docs/`) with full project documentation

---

## 2. Target Audience

**Primary Users**: Casual gym-goers aged 22-40 who work out 3-5 times per week, comfortable with mobile apps, want simple logging without spreadsheet complexity.

**Secondary Users**: Personal trainers who want to see client workout logs; friends who follow each other for accountability.

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| Alex | Office worker, 3x/week gym | Forgets previous weights; no sense of progress; loses motivation after 4 weeks | See clear progress charts; get reminded to work out; share wins with friends | Med |
| Coach Mia | Personal trainer | Cannot see client workout history between sessions; relies on client memory | View client logs remotely; suggest adjustments based on data | Med |

**Anti-Users**: Competitive athletes needing periodization programming, powerlifters needing 1RM calculators, or yoga/flexibility-only practitioners.

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Workout logging | Log exercises with sets, reps, and weight; select from exercise library; add custom exercises | User can create a workout, add 3+ exercises, save, and view history; data persists across app restarts | L |
| 2 | Progress charts | Line/bar charts showing volume, max weight, and frequency over time per exercise and muscle group | Charts render within 1s; data accurate against logged workouts; supports 7d/30d/90d/all-time ranges | L |
| 3 | Social feed | Follow friends, see their completed workouts, give high-fives (likes) | User can follow by username, see feed of followed users' workouts, tap to high-five | M |
| 4 | Push notifications | Workout reminders, high-five notifications, streak alerts | Notifications arrive within 30s of trigger; user can customize reminder schedule; works on both platforms | M |
| 5 | Auth and profile | Email/password and Google sign-in; profile with photo, bio, fitness goals | Registration, login, profile edit all functional; profile photo uploads to Firebase Storage | M |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | Workout templates | Save and reuse workout routines; community-shared templates | User can save current workout as template, load it next session, browse popular templates | M |
| 2 | Streak tracking | Visual streak counter with calendar heatmap showing workout consistency | Streak increments correctly; heatmap colors reflect intensity; streak-break notification sent | S |
| 3 | Rest timer | Configurable rest timer between sets with vibration and sound alert | Timer counts down, alerts user, auto-advances to next set entry | S |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | Body measurements | Track weight, body fat, photos over time with comparison view |
| 2 | Apple Health / Google Fit sync | Import/export workout data to platform health services |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: Dart 3.x
- **Framework**: Flutter 3.x (latest stable)
- **Database**: Firebase Firestore (NoSQL)
- **Cache**: Hive (local on-device cache)
- **Message Queue**: None (Firebase Cloud Messaging for push)

**Hosting/Infrastructure**:
- **Cloud Provider**: Firebase (Google Cloud)
- **Deployment**: Firebase Hosting (web preview) + App Store / Play Store
- **CDN**: Firebase Storage CDN (for images)
- **Domain**: TBD (not needed for mobile MVP)

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Firebase Auth | Authentication (email + Google) | Firebase SDK | Spark plan: 10K auth/month |
| Firebase Firestore | Primary database | Firebase SDK | Spark plan: 50K reads, 20K writes/day |
| Firebase Cloud Messaging | Push notifications | Firebase SDK | Unlimited |
| Firebase Storage | Profile photos, media | Firebase SDK | Spark plan: 5GB storage, 1GB/day download |

**Existing Codebase**: Greenfield

**Package Manager**: pub (Flutter/Dart default)

**Monorepo or Polyrepo**: Single repo

---

## 5. Non-Functional Requirements

**Performance**:
- Screen transition time: < 300ms
- Chart rendering: < 1s for 90 days of data
- App cold start: < 3s on mid-range device
- Offline capability: Full workout logging works offline, syncs on reconnect

**Security**:
- Authentication: Firebase Auth (JWT-based)
- Authorization: Firestore security rules (user can only read/write own data; social feed uses collection group queries with follower checks)
- Data sensitivity: PII (names, emails, photos, health-adjacent data)
- Compliance: GDPR basics (data export, account deletion)
- Encryption: TLS 1.3 in transit; Firebase default encryption at rest

**Scalability**:
- Expected launch users: 200
- Expected 6-month users: 5,000
- Expected 1-year users: 20,000
- Scaling strategy: Firebase auto-scaling (serverless)

**Availability**:
- Uptime target: 99.5% (Firebase SLA)
- Recovery time objective (RTO): < 2 hours
- Recovery point objective (RPO): < 30 minutes (Firestore continuous backup)
- Multi-region: No

**Accessibility**:
- WCAG level: AA (semantic labels on all interactive elements)
- Screen reader support: Required (TalkBack + VoiceOver)
- Internationalization: English only at launch

**Observability**:
- Logging: Firebase Crashlytics
- Metrics: Firebase Analytics
- Tracing: Firebase Performance Monitoring
- Alerting: Crashlytics email alerts on crash spikes

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% line coverage

**Required Test Types**:
- [x] Unit tests (mandatory)
- [x] Integration tests (mandatory)
- [x] E2E tests (mandatory for P0 features — using integration_test package)
- [ ] Performance/load tests
- [x] Security scanning (SAST + dependency audit)
- [x] Accessibility tests (Flutter semantics checker)
- [ ] Visual regression tests
- [ ] Contract tests

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (dart analyze, dart format)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated build on merge to develop (APK + IPA artifacts)
- [ ] Manual approval gate for store submission

**Testing Tools**: flutter_test for unit/widget tests, integration_test for E2E, mockito for mocking, patrol for advanced E2E

### 6.1 UAT Testing Requirements

| Requirement | Value |
|-------------|-------|
| **UAT Coverage Target** | >= 95% |
| **P0 Feature Pass Rate** | 100% |
| **P1 Feature Pass Rate** | >= 95% |
| **Compliance Frameworks** | ISO 25010, GDPR |
| **Screenshot Capture** | Before + After for every test case |
| **UAT Report Format** | MD + PDF + PPTX + JSON + CSV exports |
| **Negative Test Coverage** | >= 90% |
| **Role Coverage** | 100% (regular user + trainer role) |
| **Browser Matrix (P0 flows)** | N/A (native mobile) |
| **Device Matrix (P0 flows)** | Android (Pixel 7, Samsung S23) + iOS (iPhone 14, iPhone SE) |

**UAT Sign-Off Chain**: QA Agent -> Team Leader -> User

**Applicable Regulations**:
- [x] ISO 25010 — Software quality
- [x] GDPR — EU personal data handling
- [ ] SOC 2 Type II
- [ ] WCAG 2.1 AA
- [ ] PCI DSS v4.0
- [ ] HIPAA
- [ ] FDA 21 CFR Part 11

**Additional UAT Context**: Test the full workout logging flow under offline conditions (airplane mode), then verify sync when connectivity returns. Also test push notification delivery on both platforms.

---

## 7. Timeline & Milestones

**Hard Deadline**: 6 weeks from kickoff

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | Foundation | Week 1-2 | Auth, profile, Firestore schema, navigation shell, CI | User can register, log in, see profile; CI builds APK |
| M2 | Core Workout | Week 2-3 | Workout logging, exercise library, workout history | User can log a complete workout and view past sessions |
| M3 | Social + Charts | Week 4-5 | Progress charts, social feed, push notifications | Charts render correctly; feed shows followed users' workouts |
| M4 | QA + Polish | Week 5-6 | Full test suite, UI polish, docs site, UAT | All P0 E2E tests pass on both platforms; docs published |

**Budget Constraints**:
- Infrastructure: $0/month (Firebase Spark free plan)
- Third-party APIs: $0/month (all Firebase free tier)
- Domains/SSL: $0 (not needed for mobile MVP)

---

## 7.1 Cost Approval & Payment Governance

**Token Budget Tolerance**: < $15 total

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All payments, app store developer accounts, API upgrades
- **Forbidden without user present**: Any recurring subscription, any store submission fees

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Firebase Spark | $0 | Free tier | Yes |
| Google Play Console | $25 one-time | Card | No — ask first |
| Apple Developer Program | $99/year | Card | No — ask first |

**Cost Estimation Detail Level**: Summary only

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [x] All P0 features implemented and tested
- [x] Unit test coverage >= 80%
- [x] Zero CRITICAL/HIGH security vulnerabilities
- [x] E2E tests pass for all P0 user flows on both platforms
- [x] Performance targets met (see Section 5)
- [x] Documentation complete (README, setup guide, architecture docs)
- [x] CI/CD pipeline tested and working
- [x] APK and IPA build successfully

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Workout log completion rate | > 90% (started vs saved) | Firebase Analytics funnel |
| App cold start time | < 3s | Firebase Performance Monitoring |
| Crash-free rate | > 99.5% | Firebase Crashlytics |

**Definition of Done**: All P0 features pass UAT on both Android and iOS simulators, APK and IPA build without errors, documentation site is published, and crash-free rate exceeds 99.5% during testing.

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| Strong | Clean workout logging UX, rest timer integration | Complex exercise database management; paid wall on basic features |
| Strava | Social feed with high-fives, streak motivation | GPS-heavy focus; overcomplicated activity types |
| Hevy | Progress charts, workout templates | Cluttered UI; too many options on workout screen |

**Design Inspiration**: Strong's minimal workout logging flow, Strava's social feed cards, Apple Fitness+ progress rings

**Technical References**: Flutter BLoC documentation, Firebase Firestore data modeling best practices, Flutter integration_test docs

**Internal Documentation**: None (greenfield)

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. Wearable device integrations (Apple Watch, Wear OS)
2. AI-generated workout plans or exercise recommendations
3. In-app purchases or subscription paywalls

**Deferred to future versions**:
1. Apple Health / Google Fit data sync
2. Video exercise demonstrations
3. Multi-language support
4. Trainer dashboard (web portal)

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Firebase Spark plan limits hit during testing | M | M | Monitor usage dashboard; batch writes; upgrade to Blaze pay-as-you-go if needed |
| Offline sync conflicts when logging workouts | M | H | Use Firestore offline persistence with last-write-wins; display sync status indicator |
| Push notification delivery inconsistency across OEMs | H | M | Use Firebase Cloud Messaging best practices; test on multiple Android OEMs |

**Hard Constraints** (non-negotiable):
- Must use Flutter (team expertise)
- Must use Firebase (existing Google Cloud account)
- Must support Android 8+ and iOS 15+

**Soft Constraints** (preferred but negotiable):
- Prefer BLoC for state management but open to Riverpod
- Prefer Material 3 design but open to custom design system

---

## 11.1 Dynamic Agent Scaling

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 10

**Scaling triggers**:
- A single feature has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking bugs requiring parallel fix agents

**Agent types the PM may add**:
- [x] Additional Frontend Engineers (Flutter widget specialists)
- [x] Additional QA Engineers (platform-specific testing)
- [ ] Additional Backend Engineers
- [x] Specialist agents (e.g., animation, Firebase security rules)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Screenshots of running application (both platforms)
- [x] Test result reports (JUnit XML, coverage HTML)
- [x] Build logs showing zero errors
- [x] CI/CD pipeline passing locally (act) and remotely
- [x] Security scan reports (zero CRITICAL/HIGH)
- [ ] Performance benchmark results
- [ ] Deployment verification
- [ ] API documentation
- [x] Database migration scripts tested (Firestore indexes)
- [x] Dependency audit clean

**Reporting Frequency**: Every 6 hours (default)

**Final Deliverable**: Both PPTX and PDF

---

## 12.0.1 Screenshots & Visual Evidence

**Screenshot Requirements**:
- [x] Before/after screenshots for every P0 feature implementation
- [x] Test result screenshots (unit, widget, integration)
- [x] Build evidence screenshots (APK + IPA artifacts)
- [x] Final product screenshots on Android and iOS simulators
- [x] Mission Control dashboard screenshots at wave completions
- [x] Error state and empty state screenshots

**Screenshot Naming**: `{date}_{agent}_{description}.png`

**Final Product Screenshots**: `.team/screenshots/final/` MUST contain a complete visual walkthrough on both platforms.

## 12.0.2 Documentation Website

**Documentation Scope**:
- [x] Project overview and architecture
- [x] Getting started / installation guide
- [ ] API reference
- [x] User guide with embedded screenshots
- [x] Configuration reference (Firebase setup)
- [x] Deployment guide (store submission checklist)
- [x] Decision log

**Documentation Tech**: React + Vite + MDX

## 12.0.3 Mission Control PDF Report

**PDF Report Must Include**:
- [x] Executive summary with key metrics
- [x] Discovery interview (all 20+ Q&A)
- [x] Complete decision log with rationale
- [x] Task execution timeline (planned vs actual)
- [x] Git commit history with agent attribution
- [x] Quality report (test coverage, bugs, security scans)
- [x] Agent performance metrics
- [x] Screenshots embedded
- [x] Cost analysis (budget vs actual)
- [x] Deliverables checklist with evidence

**Report Generation**: Automatic at end of every wave + on-demand

---

## 12.1 Data Preservation & Uncertainty Policy

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}` (default)
- **Archive method for table rows**: Add `status: archived` column (default)
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker (default)
- **Git history protection**: Never rebase/squash published commits

**Uncertainty Escalation**:

- **Escalation threshold**: < 90% confidence -> escalate
- **Escalation response time expectation**: I'll respond within minutes
- **What counts as "unsure"**: Any action that might delete data, cost money, affect external services, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Short question with 2-3 options

---

## 13. GitHub Auto-Sync Policy

**Auto-sync frequency**: Every commit (default)

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `ai-team`
- Merge to main: ONLY after Team Leader receives explicit user approval

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

This app targets the gap between "too simple" (Apple Notes) and "too complex" (Strong/Hevy) for casual gym-goers. The social feed is the key differentiator — accountability through visibility. Keep the workout logging flow to 3 taps or fewer per set. Use Flutter's Material 3 with a green/dark theme to match the fitness vibe.

---

*Strategy Brief v3.3 — Amenthyx AI Teams*
