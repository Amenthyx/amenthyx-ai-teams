# Game Development Team — Tailored Strategy v3.1

> Pre-configured for **game development with Unity, Unreal Engine, or Godot**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team gameDev --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]

**One-Line Vision**: [FILL IN]

**Problem Statement**: [FILL IN]

**Desired Outcome**: [FILL IN]

**Project Type**: [FILL IN — Greenfield / Extending existing codebase / Migration / Rewrite / Prototype / MVP / Production]

**Repository**: [FILL IN — GitHub URL or desired repo name]

---

## 2. Target Audience

**Primary Users**: [FILL IN — e.g., casual gamers, hardcore PC gamers, mobile players]

**Secondary Users**: [FILL IN — e.g., streamers, modding community, game reviewers]

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [FILL IN] |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: C# (Unity) / C++ (Unreal Engine) / GDScript (Godot)
- **Framework**: Unity 2023+ / Unreal Engine 5.x / Godot 4.x
- **Database**: PlayerPrefs / SQLite (local save data) / PlayFab (cloud saves, leaderboards)
- **Cache**: Asset Bundles / Addressables (Unity) / Pak files (Unreal)
- **Message Queue**: N/A (game networking uses dedicated solutions)

**Hosting/Infrastructure**:
- **Cloud Provider**: PlayFab / GameLift / Photon / self-hosted (for multiplayer backend)
- **Deployment**: Steam / Epic Games Store / itch.io / Apple App Store / Google Play Store
- **CDN**: Steam CDN / Epic CDN / CloudFront (for asset delivery)
- **Domain**: [FILL IN or "N/A"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Steam / Epic / Platform SDK | Distribution + achievements + cloud saves | API key / OAuth | Per platform |
| PlayFab / Firebase | Backend services (leaderboards, analytics) | API key | Per plan |
| Analytics (Unity Analytics / GameAnalytics) | Player behavior tracking | API key | Per plan |
| Crash reporting (Sentry / Backtrace) | Production crash tracking | API key | Per plan |

**Existing Codebase**: [FILL IN — Path to existing game project, or "greenfield"]

**Package Manager**: Unity Package Manager (UPM) / NuGet / vcpkg / Unreal Plugin system

**Monorepo or Polyrepo**: Single repo (Assets/ + Scripts/ + Scenes/ + Art/ + Audio/)

**Linting**:
- Roslyn Analyzers (Unity/C#) — code style and quality
- UnrealHeaderTool (Unreal) — C++ macro validation
- GDScript formatter (Godot) — script style enforcement
- `.editorconfig` — cross-editor formatting consistency

---

## 5. Non-Functional Requirements

**Performance**:
- Frame rate: 60 FPS stable (desktop/console) / 30 FPS stable (mobile)
- Load time: < 5 seconds (initial scene load)
- Memory usage: < 2GB RAM (desktop) / < 1GB RAM (mobile)
- Draw calls: < 1000 per frame (batched/instanced)

**Security**:
- Authentication: Platform SSO (Steam, Epic, Apple, Google) / custom auth for multiplayer
- Authorization: Anti-cheat mechanisms, server-authoritative logic (multiplayer)
- Data protection: Save file encryption, secure API calls to backend
- Player data: [FILL IN — GDPR compliance, COPPA if targeting minors]
- Compliance: [FILL IN — ESRB / PEGI rating, platform TRC/TRS requirements]

**Scalability**:
- Expected launch players: [FILL IN — CCU target]
- Expected 6-month players: [FILL IN]
- Expected 1-year players: [FILL IN]
- Scaling strategy: Cloud-managed game servers (if multiplayer), CDN for asset delivery

**Availability**:
- Uptime target: 99.9% for multiplayer backend / offline single-player always available
- Recovery time objective (RTO): < 30 minutes for backend services
- Recovery point objective (RPO): < 5 minutes for player save data
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- Subtitles and closed captions for dialogue
- Colorblind modes (deuteranopia, protanopia, tritanopia)
- Remappable controls
- Screen reader support: [FILL IN — required / nice-to-have / N/A]
- Accessibility standards: [FILL IN — Xbox Accessibility Guidelines / custom]

**Observability**:
- Logging: Unity Profiler / Unreal Insights (development), crash reporting (production)
- Metrics: Player analytics (playtime, retention, progression, monetization)
- Tracing: Frame profiling, GPU/CPU bottleneck identification
- Alerting: Crash rate spikes, server health (multiplayer), review score drops

---

## 6. Testing Requirements

**Test Coverage Target**: >= 70% for game logic scripts; 100% play-test coverage for all P0 features

**Required Test Types**:
- [x] Unit tests — Unity Test Framework / Unreal Automation / GDUnit (Godot)
- [x] Integration tests — scene/level loading, save/load cycle, progression flow
- [x] Play-testing sessions — structured QA play sessions with bug reporting
- [x] Performance profiling — frame rate, memory, load time on all target platforms
- [x] Platform compliance — TRC (PlayStation) / TRS (Xbox) / App Store guidelines
- [x] Regression tests — automated smoke tests for critical game systems
- [x] Compatibility tests — min spec hardware, target platforms
- [x] Security scanning — anti-cheat verification, API security (multiplayer)
- [ ] Localization tests — [FILL IN if multi-language support needed]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (code formatting, lint checks)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated builds for all target platforms in CI
- [x] Automated unit/integration test execution in CI
- [x] Manual approval gate for store submission builds

**Testing Tools**: Unity Test Framework / Unreal Automation, profilers (Unity Profiler / Unreal Insights), crash reporters (Sentry / Backtrace), act

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN]

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M4 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Budget Constraints**:
- Engine licenses: [FILL IN — e.g., Unity Pro / Unreal royalty / Godot free]
- Asset store purchases: [FILL IN — $ for art, audio, plugins]
- Backend hosting: [FILL IN — $/month for multiplayer servers]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, engine license upgrades, asset store purchases, store listing fees, backend hosting costs
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any store listing fee, any marketing spend

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Engine license (if applicable) | [FILL IN] | Card | No — ask first |
| Asset store purchases | [FILL IN] | Card | No — ask first |
| Game backend (PlayFab/GameLift) | [FILL IN] | Card / free tier | No — ask first |
| Store listing fees | [FILL IN] | Card | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Game logic code coverage >= 70%
- [ ] Zero CRITICAL/HIGH bugs (crashes, data loss, progression blockers)
- [ ] Playable build on all target platforms
- [ ] 60 FPS stable on target hardware (30 FPS mobile)
- [ ] Load time < 5 seconds on target hardware
- [ ] No crash in 30-minute uninterrupted play session
- [ ] Performance profiled on min-spec hardware
- [ ] Save/load system verified (including corruption recovery)
- [ ] Platform compliance requirements met (TRC/TRS/App Store)
- [ ] Anti-cheat functional (if multiplayer)
- [ ] Analytics integration verified
- [ ] Documentation complete (README, design docs, build guide)
- [ ] CI/CD pipeline tested and working

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Design Inspiration**: [FILL IN — game design docs, art style references, gameplay videos]

**Technical References**: [FILL IN — engine documentation, GDC talks, technical art references]

**Internal Documentation**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. [FILL IN]
2. [FILL IN]
3. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]
2. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep (feature additions during development) | H | H | Strict P0/P1/P2 prioritization, change request process via TL approval, regular scope reviews |
| Platform certification failure (TRC/TRS/App Store rejection) | M | H | Early compliance testing, platform guidelines checklist, pre-certification review |
| Performance on low-end devices (frame drops, memory pressure) | M | H | Regular profiling on min-spec hardware, LOD system, quality settings tiers, memory budgets per scene |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Hard Constraints** (non-negotiable):
- Target platform defined and enforced (frame budget, memory budget)
- Art pipeline documented (asset naming, import settings, texture budgets)
- Conventional commits enforced on all repositories
- All changes via Pull Request with CI checks passing

**Soft Constraints** (preferred but negotiable):
- [FILL IN]
- [FILL IN]

---

## 11.1 Dynamic Agent Scaling

> The PM may spawn additional agents beyond the default roster if the workload requires it.

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 15

**Scaling triggers** (PM spawns extra agents when):
- A single game system has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking bugs requiring parallel fix agents
- The strategy explicitly requests parallel streams (e.g., multiplayer + single-player)

**Agent types the PM may add**:
- [ ] Additional Game Engineers (for gameplay systems)
- [ ] QA Engineers / Playtesters (for structured testing sessions)
- [ ] Rendering Specialist (for shader, VFX, lighting optimization)
- [ ] Networking Specialist (for multiplayer, netcode)
- [ ] Audio Specialist (for sound design integration)
- [ ] UI/UX Specialist (for game menus, HUD, accessibility)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Playable build artifacts for all target platforms
- [x] Performance profiling results (FPS, memory, load time)
- [x] Unit/integration test results
- [x] Play-test session reports (bugs found, feedback)
- [x] Platform compliance checklist status
- [x] Screenshot/video of key gameplay moments
- [x] Crash report dashboard (zero crashes in 30-min session)
- [x] Save/load verification logs
- [x] Analytics integration verification
- [x] CI/CD build pipeline passing (act + remote)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, builds, assets, test results, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might delete game assets, corrupt save data, cost money, affect player experience, break platform compliance, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.

**Auto-sync frequency**: Every agent completion

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `ai-team` (MANDATORY — all teams use this branch)
- Merge to main: ONLY after Team Leader receives explicit user approval (hard gate)

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (scripts, shaders, configs)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: game genre, art style, target audience age, monetization model, multiplayer architecture, content pipeline, localization needs, marketing timeline, etc.]

---

*Game Development Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for game development with Unity, Unreal Engine, or Godot*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
