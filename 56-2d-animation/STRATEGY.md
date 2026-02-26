# 2D Animation Team — Tailored Strategy v3.1

> Pre-configured for **web animations, interactive animations, SVG animation, Lottie workflows, and UI micro-interactions with TypeScript, Lottie, Rive, GSAP, and framer-motion**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team 2dAnimation --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for 2D Animation Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode) / JavaScript
- **Frameworks**: Lottie (lottie-web) / Rive (@rive-app/canvas) / GSAP / SVG.js
- **Libraries**: lottie-web, @rive-app/canvas, framer-motion, anime.js, Web Animations API
- **Tools**: Figma (design source), After Effects (Bodymovin export), Rive Editor
- **Build**: Vite / Next.js / esbuild — team's choice

**Hosting/Infrastructure**:
- **Cloud Provider**: Vercel / Netlify / CDN — team's choice
- **Deployment**: CDN for animation assets (dotlottie, .riv, SVG sprites), Vercel for demo site
- **CDN**: CloudFront / Vercel Edge / Cloudflare for animation asset delivery
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| lottie-web | Lottie JSON rendering (SVG/Canvas/HTML) | npm package | N/A |
| @rive-app/canvas | Rive runtime for interactive animations | npm package | N/A |
| GSAP | Timeline-based web animation | npm package (license-dependent for plugins) | N/A |
| LottieFiles | Lottie asset hosting and validation | API key (optional) | Per plan |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm

**Monorepo or Polyrepo**: Monorepo (animation library, demo site, asset pipeline)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Animation frame rate: 60fps on target devices (Chrome, Safari, Firefox, Edge)
- Lottie file size: < 100KB per animation (optimized, gzipped)
- Rive .riv file size: < 200KB per interactive animation
- Bundle size impact: animation libraries tree-shaken, lazy-loaded per component
- First animation frame visible within LCP budget (< 2.5s)

**Security**:
- Authentication: N/A (animation library is client-side)
- Authorization: N/A
- Data sensitivity: N/A
- Compliance: N/A
- Encryption: HTTPS for CDN-hosted assets

**Scalability**:
- Expected platform targets: [FILL IN — web, iOS, Android, React Native, Flutter]
- Asset pipeline: Figma/AE source -> export -> optimize -> CDN delivery
- Component library: tree-shakeable, per-animation code-splitting

**Availability**:
- Uptime target: 99.9% (CDN-served assets)
- RTO: N/A (static assets)
- RPO: N/A (assets in Git)
- Multi-region: CDN-based (automatic)

**Accessibility** *(CRITICAL for animations)*:
- `prefers-reduced-motion`: All non-essential animations disabled or replaced with fade
- No seizure-inducing content: max 3 flashes per second (WCAG 2.3.1)
- Focus indicators visible during and after animation
- Screen reader announcements for animation-driven state changes
- `aria-live` regions for dynamically updated animated content

**Observability**:
- Logging: Browser console for animation errors, Sentry for runtime failures
- Metrics: Animation file sizes (tracked per build), frame rate profiling, bundle size impact
- Tracing: N/A
- Alerting: CI blocks if animation file size exceeds budget, Lighthouse performance regression

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (animation component library), >= 70% (integration/demo code)

**Required Test Types**:
- [x] Frame rate profiling (Chrome DevTools Performance — 60fps verification on target devices)
- [x] Cross-browser rendering (Chrome, Safari, Firefox, Edge — SVG differences, CSS quirks)
- [x] Lottie validation (JSON schema compliance, unsupported feature detection, file size audit)
- [x] Rive validation (state machine completeness, all transitions reachable, blend states)
- [x] Accessibility testing (prefers-reduced-motion honored, no flashes > 3/sec, focus indicators)
- [x] Visual regression (Chromatic/Percy screenshot comparison, animation keyframe snapshots)
- [x] Unit tests (Vitest — component rendering, animation prop verification)
- [x] Bundle size tracking (size-limit — animation library chunk sizes)
- [x] Device testing (low-end mobile performance, battery impact assessment)
- [ ] Storybook stories for all animation states (optional but recommended)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint, Prettier, tsc --strict, Lottie JSON validation via lint-staged + husky)
- [x] Bundle size check in CI (size-limit — blocks if animation bundle exceeds budget)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated Lighthouse performance check on demo site
- [ ] Automated visual regression via Chromatic/Percy

**Testing Tools**: Vitest, Playwright, Chromatic/Percy, Chrome DevTools Performance, size-limit, lottie-web (schema validation), Storybook

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
- Infrastructure: [FILL IN: $/month or "free tier"]
- Third-party APIs: [FILL IN: GSAP license if Club plugins needed]
- CDN: [FILL IN: $/month or "Vercel free tier"]

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
| GSAP Club GreenSock | $99-199/yr | Card | No — ask first |
| Rive (if premium) | ~$15-25/mo | Card | No — ask first |
| Chromatic (visual regression) | Free for OSS / ~$149/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 animations implemented and integrated
- [ ] >= 80% test coverage on animation component library
- [ ] 60fps on target devices (Chrome, Safari, Firefox, Edge) — profiling evidence
- [ ] All Lottie exports pass schema validation and file size budget (< 100KB)
- [ ] All Rive animations have complete state machines with all transitions tested
- [ ] `prefers-reduced-motion` respected — non-essential animations disabled
- [ ] No seizure-inducing content (max 3 flashes/second — WCAG 2.3.1)
- [ ] Cross-browser rendering verified (no visual differences in Chrome/Safari/Firefox/Edge)
- [ ] Bundle size within budget (animation library chunk tracked in CI)
- [ ] Animation component library documented (props, examples, accessibility notes)
- [ ] npm package published (if library) or CDN assets deployed (if assets)

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
| Lottie unsupported features in web renderer | H | M | Pre-export audit via Bodymovin supported features matrix, fallback static images |
| Performance regression on low-end devices | M | H | Device-specific animation LOD, IntersectionObserver for viewport gating, GPU layer budget |
| GSAP Club plugin licensing for commercial use | M | M | Verify license before using Club plugins, document in COST_ESTIMATION.md, use alternatives if budget issue |
| Cross-browser SVG rendering differences | M | M | Test on all browsers, use Canvas renderer as fallback for complex SVGs, normalize transforms |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- 60fps performance target on modern browsers and mid-range mobile devices
- `prefers-reduced-motion` media query honored — non-essential animations disabled
- Max 3 flashes per second (WCAG 2.3.1 — seizure prevention)
- Bundle size budgets enforced in CI (size-limit)
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
- QA finds >= 5 animation quality or performance issues

**Agent types the PM may add**:
- [x] Additional Lottie/Web Animation Engineer
- [x] Additional Character Animation Engineer (Spine 2D)
- [x] Additional UI Animation Engineer (micro-interactions, page transitions)
- [x] Additional Interactive Animation Engineer (Rive, scroll-driven)
- [x] Additional QA Engineer (performance profiling, cross-browser, accessibility)
- [x] SVG Optimization Specialist

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Frame rate profiling results (Chrome DevTools Performance — 60fps proof per animation)
- [x] Cross-browser rendering screenshots (Chrome, Safari, Firefox, Edge)
- [x] Lottie schema validation reports (pass/fail + unsupported features)
- [x] Rive state machine coverage report (all states and transitions tested)
- [x] Accessibility audit (prefers-reduced-motion, flash rate, focus indicators)
- [x] Bundle size report (size-limit output — animation chunks within budget)
- [x] Visual regression screenshots (Chromatic/Percy — before/after)
- [x] Test coverage report (Vitest — HTML + lcov)
- [x] Device testing results (low-end mobile frame rate, battery impact)
- [x] CI/CD pipeline screenshot (all checks green)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Animation assets**: versioned (v001, v002, ..., vFINAL) — NEVER overwrite
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Published npm packages**: NEVER unpublish — deprecate instead

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/2dAnimation/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (performance profiles, a11y reports)
- [x] Source code (animation components, Lottie JSON, Rive files)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*2D Animation Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + Lottie + Rive + GSAP + SVG.js web animation development*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
