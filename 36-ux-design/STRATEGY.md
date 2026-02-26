# UX Design Team — Tailored Strategy v3.1

> Pre-configured for **UX/UI design, design systems, prototyping, and design-to-code workflows with Figma, Storybook, and design tokens**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team uxDesign --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for UX Design Team)*

**Required Tech Stack**:
- **Language**: TypeScript (Storybook / design tokens / Figma plugins) / CSS / SCSS
- **Framework**: Figma (design) / Storybook 8 (component documentation) / Style Dictionary (design tokens) / Tailwind CSS (utility-first styling)
- **Database**: N/A
- **Cache**: N/A
- **Message Queue**: N/A

**Hosting/Infrastructure**:
- **Cloud Provider**: Chromatic (Storybook hosting + visual testing) / Vercel / Netlify
- **Deployment**: Storybook deployed to Chromatic or Vercel (auto-deploy on merge)
- **CDN**: Included with hosting platform
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Figma | Design source of truth | Figma API token (.env) | Rate limited |
| Chromatic | Visual regression + Storybook hosting | Project token (.env) | Plan-based |
| npm registry | Design token package publishing | npm token (.env) | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm

**Repo Structure**: `src/components/`, `src/tokens/` (Style Dictionary), `src/styles/`, `.storybook/`, `figma/` (plugin source), `docs/` (design guidelines)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Component render time: < 16ms (60fps target)
- Storybook build: < 3 minutes
- Design token sync (Style Dictionary build): < 1 minute
- Component bundle size: tracked per component (no bloated components)

**Security**:
- N/A (design artifacts — no user data handling)
- Figma API tokens secured in CI secrets
- npm publish tokens scoped and rotated

**Scalability**:
- Expected components (launch): [FILL IN]
- Expected components (6-month): [FILL IN]
- Expected components (1-year): [FILL IN]
- Scaling strategy: Atomic design methodology (atoms → molecules → organisms → templates → pages), design tokens as single source of truth, component composition over duplication

**Availability**:
- Storybook uptime: 99.9% (Chromatic/Vercel hosting)
- Design token package: Published to npm (always available)
- Figma files: Figma cloud (99.9% SLA)

**Accessibility**:
- WCAG 2.1 AA minimum for all components
- Contrast ratio: >= 4.5:1 (normal text), >= 3:1 (large text)
- Focus indicators on all interactive elements
- Responsive design: mobile-first approach
- Touch targets: minimum 44x44px
- Screen reader tested (every interactive component)

**Observability**:
- Chromatic snapshots: Visual regression tracking per PR
- Storybook analytics: Component usage, documentation completeness
- Design adoption metrics: How many teams/projects consume the design system
- Figma analytics: Component usage in Figma (detached instances tracked)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 70% (component logic), 100% (visual regression for all components)

**Required Test Types**:
- [x] Visual regression tests (Chromatic — every component, every state)
- [x] Storybook interaction tests (component behavior verification)
- [x] Accessibility tests (axe-core — every component, every state)
- [x] Contrast ratio checks (automated via design token validation)
- [x] Responsive tests (Storybook viewport addon — mobile, tablet, desktop)
- [x] Design token validation (Style Dictionary build — no missing/invalid tokens)
- [ ] Cross-browser rendering (optional — Chromatic multi-browser)
- [ ] Performance profiling (optional — React Profiler for complex components)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (Stylelint, ESLint, Prettier via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Chromatic visual review required on every PR
- [ ] Automated Storybook deployment on merge to main
- [ ] Design token package auto-publish on version tag

**Testing Tools**: Chromatic, Storybook interaction tests, axe-core (storybook-addon-a11y), Stylelint, Style Dictionary, contrast-ratio checker

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
- Figma: [FILL IN: team plan or "already have"]
- Chromatic: [FILL IN: free tier / paid plan]

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
| Figma Professional | ~$15/editor/mo | Card | No — ask first |
| Chromatic | Free tier / ~$149/mo | Card | No — ask first |
| Vercel (Storybook hosting) | Free tier / ~$20/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 components designed and implemented
- [ ] >= 70% component test coverage
- [ ] Visual regression passing for all components (Chromatic — zero unreviewed changes)
- [ ] Accessibility audit passing (axe-core — zero violations on all components)
- [ ] Figma file organized and published (component library, auto-layout, variants)
- [ ] Storybook deployed with all components documented (props, usage examples, states)
- [ ] Design tokens published (Style Dictionary — npm package or build output)
- [ ] Contrast ratios verified (WCAG AA — all color combinations)
- [ ] Responsive behavior verified (mobile, tablet, desktop viewports)
- [ ] Documentation complete (design principles, component usage guide, contribution guide)
- [ ] CI/CD pipeline tested and working
- [ ] Design-dev handoff process documented

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
| Design-dev handoff gaps (implementation doesn't match design) | M | H | Storybook as living documentation, Chromatic visual regression, design tokens as shared language, regular design review sessions |
| Token drift (design tokens in code diverge from Figma) | M | M | Style Dictionary as single source of truth, Figma token plugin syncs to repo, CI validates token consistency, automated sync pipeline |
| Component duplication (teams build their own instead of using design system) | M | M | Storybook discoverability, team onboarding, adoption metrics tracking, evangelism and support |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Design tokens as single source of truth (all colors, spacing, typography, shadows from tokens)
- WCAG 2.1 AA minimum for all components
- Responsive design (mobile-first approach)
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
- [x] Additional UX Designer (Figma design, user research, prototyping)
- [x] Additional Frontend Engineer (Storybook components, CSS, design token integration)
- [x] Accessibility Specialist (WCAG audit, screen reader testing, a11y remediation)
- [x] Motion Design Specialist (animation patterns, transition design, micro-interactions)
- [x] Design Token Specialist (Style Dictionary configuration, multi-platform token output)
- [x] QA Specialist (visual regression, cross-browser testing, responsive testing)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Figma file link (published component library — organized, auto-layout, variants)
- [x] Storybook deployment (live URL — all components with docs, props, states)
- [x] Visual regression report (Chromatic — all snapshots passing, no unreviewed changes)
- [x] Accessibility audit report (axe-core — zero violations across all components)
- [x] Design tokens published (Style Dictionary build output — JSON/CSS/SCSS)
- [x] Contrast ratio verification (all color pairs tested against WCAG AA)
- [x] Responsive demo (screenshots/video — mobile, tablet, desktop viewports)
- [x] Component adoption metrics (teams/projects consuming design system)
- [x] CI/CD pipeline screenshot (all checks green — lint, build, Chromatic, a11y)
- [x] Design system architecture diagram (token hierarchy, component taxonomy, handoff flow)

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
- [x] Source code changes (components, tokens, styles)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*UX Design Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Figma + Storybook 8 + Style Dictionary + Tailwind CSS design system engineering*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
