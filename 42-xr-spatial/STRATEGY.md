# XR & Spatial Computing Team — Tailored Strategy v3.1

> Pre-configured for **AR/VR/MR experiences, spatial computing, hand tracking, and spatial anchors with Unity XR, ARKit, ARCore, and OpenXR**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team xrSpatial --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for XR & Spatial Computing Team)*

**Required Tech Stack**:
- **Language**: C# (Unity), C++ (Unreal Engine / native plugins)
- **Framework**: Unity 2023+ with XR Interaction Toolkit / Unreal Engine 5.x
- **Libraries**: ARKit (iOS/visionOS), ARCore (Android), OpenXR (cross-platform runtime), XR Interaction Toolkit, Vuforia (image tracking)
- **Database**: SQLite (local persistence) / cloud backend (Firebase / custom REST)
- **Rendering**: URP (mobile XR), HDRP (high-end VR), forward+ (mixed reality)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Azure — team's choice (backend services)
- **Deployment**: Meta Quest Store, Apple App Store / visionOS Store, Google Play
- **Build Pipeline**: Unity Cloud Build / custom CI with GameCI
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Unity License Server | Build activation | Serial/floating license | N/A |
| Meta Quest Store | VR distribution | Oculus Developer credentials | N/A |
| Apple App Store | AR/visionOS distribution | Apple Developer cert | N/A |
| Google Play | Android AR distribution | Google Play Console | N/A |
| Firebase / Custom Backend | Cloud features, analytics | API key (env) | Per plan |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: Unity Package Manager (UPM) / NuGet (Unreal)

**Monorepo or Polyrepo**: Monorepo (Unity project with shared packages)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- VR frame rate: 72fps+ sustained (Quest 2), 90fps+ (Quest 3, Vision Pro)
- AR frame rate: 60fps+ sustained on target mobile devices
- Motion-to-photon latency: < 20ms (VR), < 50ms (AR)
- Scene load time: < 3s on target devices
- Draw calls: < 200 per frame (mobile VR), < 500 (tethered VR)

**Security**:
- Authentication: Platform-specific (Meta account, Apple ID, Google account)
- Authorization: User role-based content access
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 for network communication, platform keychain for local secrets
- Biometric data: Eye/hand tracking data handled per platform privacy guidelines

**Scalability**:
- Concurrent users per shared space: [FILL IN]
- Asset streaming: Addressable asset system with CDN for large content
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]

**Availability**:
- Backend uptime target: 99.9%
- Offline mode: Core XR experience must function without network
- RTO: 1 hour (backend)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- One-handed interaction mode supported
- Seated/standing/room-scale play modes
- Spatial audio with visual fallbacks for deaf/hard-of-hearing users
- Configurable comfort settings (vignette, snap turn, teleport locomotion)
- WCAG-inspired contrast ratios for in-world UI text

**Observability**:
- Logging: Unity Debug.Log with custom logger (structured, filterable by severity)
- Metrics: Frame timing, GPU/CPU utilization, draw calls, tracking state (via custom analytics)
- Tracing: Unity Profiler for per-frame analysis, platform profilers (RenderDoc, Xcode Instruments)
- Alerting: Automated crash reporting (Sentry / Crashlytics), store review monitoring

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 70% line coverage (C# scripts), >= 60% (shader/rendering validation)

**Required Test Types**:
- [x] Unit tests (Unity Test Framework — Edit Mode tests for logic)
- [x] Play Mode tests (XR interaction simulation, spatial anchor CRUD)
- [x] Frame rate compliance tests (90fps VR / 60fps AR sustained, per-device)
- [x] Tracking accuracy tests (positional drift, anchor persistence, SLAM recovery)
- [x] Latency tests (motion-to-photon < 20ms, input-to-visual < 50ms)
- [x] Device compatibility tests (Quest 2/3, Vision Pro, iPhone 15+, Pixel 8+)
- [x] Comfort and safety tests (locomotion sickness assessment, break reminders)
- [x] Thermal endurance tests (30-minute sustained performance)
- [ ] Multi-user synchronization tests (optional — if shared spaces)
- [ ] Store submission validation (optional — automated VRC/App Store checks)

**CI/CD Requirements**:
- [x] GitHub Actions with GameCI (Unity Docker images)
- [x] Pre-commit hooks (Unity .meta file validation, code style via dotnet-format)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated Android/Quest build on PR
- [ ] Automated asset budget validation on PR

**Testing Tools**: Unity Test Framework, XR Test Utilities, Unity Profiler, RenderDoc, Xcode Instruments, custom frame timing logger

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
| Unity Pro license | ~$185/mo | Card | No — ask first |
| Apple Developer Program | $99/yr | Card | No — ask first |
| Meta Developer | Free | N/A | N/A |
| Google Play Developer | $25 one-time | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 70% C# test coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Frame rate compliance: 90fps VR / 60fps AR sustained on all target devices
- [ ] Motion-to-photon latency < 20ms verified
- [ ] All target devices build, install, and run without crash for 30 minutes
- [ ] Tracking accuracy validated (drift < 1cm, anchor persistence 100%)
- [ ] Comfort assessment passed (no locomotion sickness triggers)
- [ ] Documentation complete (README, interaction guide, device compatibility matrix)
- [ ] CI/CD pipeline tested and working
- [ ] Store submission requirements met (VRC, App Store guidelines)

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
| Frame rate drops below threshold causing motion sickness | H | H | Performance-first development, per-frame GPU profiling, LOD systems, draw call budgets |
| Platform SDK breaking changes across Unity/ARKit/ARCore | M | H | Pin SDK versions, abstraction layers, integration tests per platform |
| Device fragmentation (different capabilities per headset/phone) | M | M | Device capability detection, graceful fallback, feature matrix per device |
| Store rejection due to compliance issues (VRC, App Store) | M | H | Pre-submission checklist, automated compliance validation, legal review |
| Biometric data privacy violations (eye/hand tracking) | L | H | Platform privacy APIs only, no raw biometric storage, BIPA/GDPR compliance review |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Target 72fps+ for VR (90fps for Quest 3/Vision Pro), 60fps+ for AR on mobile
- Spatial audio required for immersive experiences (HRTF-based)
- Frame rate gate is NON-NEGOTIABLE: no XR application ships below fps thresholds
- Comfort settings mandatory: vignette, snap turn, teleport locomotion options

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
- [x] Additional Unity XR Engineer (interaction systems, XRI setup)
- [x] Additional AR Platform Engineer (ARKit/ARCore native features)
- [x] Additional Spatial Interaction Engineer (hand/eye tracking, gestures)
- [x] Additional 3D Asset Engineer (optimization, LOD, PBR materials)
- [x] DevOps Specialist (Unity CI/CD, multi-platform builds)
- [x] Performance Specialist (GPU profiling, draw call optimization, frame timing)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Unity Test Framework output)
- [x] Frame rate compliance reports (per-device frame timing histograms)
- [x] Tracking accuracy reports (drift measurements, anchor persistence results)
- [x] Latency measurements (motion-to-photon, input-to-visual)
- [x] Thermal endurance results (30-minute sustained performance logs)
- [x] Device compatibility matrix (build/install/run verified per device)
- [x] Comfort assessment report (locomotion sickness evaluation)
- [x] Asset budget validation (triangle counts, texture memory, draw calls per platform)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (XR system components, rendering pipeline, platform SDK integration)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Performance baselines**: ALL frame timing baselines retained for regression tracking
- **Build artifacts**: ALL release candidate builds archived

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/xrSpatial/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (frame rates, tracking, latency, thermal)
- [x] Source code changes (Unity scripts, shaders, configs)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*XR & Spatial Computing Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for C# + C++ + Unity XR + ARKit + ARCore + OpenXR + Meta Quest + Vision Pro spatial computing*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
