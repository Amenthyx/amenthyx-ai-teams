# Accessibility Team — Tailored Strategy v3.1

> Pre-configured for **accessible web/mobile applications with WCAG 2.2 AA/AAA compliance, screen reader optimization, keyboard navigation, and assistive technology testing**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team accessibility --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Accessibility Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode) / HTML5 / CSS3
- **Framework**: React 18 / Next.js 14 (App Router) / Vue 3 — team's choice based on project
- **Testing Libraries**: axe-core, pa11y, Lighthouse, @axe-core/playwright
- **Screen Readers**: NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android) — testing required
- **Standards**: WCAG 2.2 AA minimum (AAA where feasible), WAI-ARIA 1.2, Section 508, EN 301 549

**Hosting/Infrastructure**:
- **Cloud Provider**: Vercel / AWS / GCP — team's choice
- **Deployment**: Vercel (frontend) or Docker + Kubernetes — team's choice
- **CDN**: Vercel Edge / CloudFront — team's choice
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| axe-core | Automated a11y scanning (DOM-level) | NPM package | N/A |
| pa11y | Page-level a11y compliance | NPM/CLI | N/A |
| Lighthouse | Performance + accessibility audits | Chrome DevTools / CLI | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm

**Monorepo or Polyrepo**: Monorepo (Turborepo)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.0s — critical for assistive technology users

**Security**:
- Authentication: [FILL IN — must be keyboard-accessible, screen reader announced]
- Authorization: [FILL IN — role-based access with accessible error messages]
- Data sensitivity: [FILL IN]
- Compliance: WCAG 2.2 AA (minimum), Section 508, ADA Title III, EN 301 549
- Encryption: TLS 1.3 in transit, AES-256 at rest

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Standard web scaling — CDN, edge caching, server-side rendering

**Availability**:
- Uptime target: 99.9%
- RTO: 1 hour
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility** *(PRIMARY FOCUS)*:
- WCAG 2.2 AA compliance mandatory — AAA where feasible
- Screen reader compatibility: NVDA + VoiceOver minimum (JAWS + TalkBack recommended)
- Keyboard navigation: 100% of interactive elements operable via keyboard alone
- Color contrast: 4.5:1 for normal text (AA), 7:1 where feasible (AAA)
- Focus indicators: Visible focus ring on all interactive elements (3:1 contrast minimum)
- Reduced motion: Respect `prefers-reduced-motion` media query
- Text resizing: Up to 200% without loss of content or functionality
- i18n-ready with proper lang attributes, bidi support

**Observability**:
- Logging: Browser console + Sentry (frontend errors, especially a11y-related JS errors)
- Metrics: Lighthouse CI scores tracked per deployment, axe-core violation counts
- Tracing: N/A (frontend-focused)
- Alerting: CI pipeline blocks on new axe-core violations, Lighthouse a11y score drop > 5 points

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (components), >= 90% (accessible component library)

**Required Test Types**:
- [x] Unit tests (Vitest — component rendering, ARIA attribute verification)
- [x] Automated accessibility scans (axe-core via @axe-core/playwright — zero violations policy)
- [x] Manual screen reader testing (NVDA + VoiceOver — full page read-through, form completion)
- [x] Keyboard-only testing (complete all user flows without mouse — Tab, Enter, Space, Escape, Arrow)
- [x] Color contrast audit (every text element, every UI component per WCAG 1.4.3/1.4.6)
- [x] WCAG criterion-by-criterion audit (map each applicable SC to PASS/FAIL/NA with evidence)
- [x] End-to-end tests (Playwright — critical user flows with a11y assertions)
- [x] Lighthouse accessibility audit (score >= 95)
- [x] VPAT/ACR generation (Voluntary Product Accessibility Template)
- [ ] User testing with assistive technology users (optional but highly recommended)
- [ ] Visual regression tests (optional — Playwright screenshots for focus state verification)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint + eslint-plugin-jsx-a11y, Prettier, tsc --strict via lint-staged + husky)
- [x] axe-core in CI — blocks on any new violations
- [x] Lighthouse CI — blocks if a11y score drops below 95
- [x] Branch protection (require PR reviews, passing CI, passing a11y checks)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: Vitest, Playwright, @axe-core/playwright, pa11y, Lighthouse CI, eslint-plugin-jsx-a11y, NVDA, VoiceOver, WAVE (WebAIM)

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
| Vercel Pro | ~$20/mo | Card | No — ask first |
| Algolia DocSearch (for accessible docs) | Free for OSS | N/A | N/A |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] Zero WCAG 2.2 AA violations (axe-core automated scan + manual audit)
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Screen reader testing complete (NVDA + VoiceOver) — all flows pass
- [ ] Keyboard-only testing complete — 100% interactive elements operable
- [ ] Color contrast audit passes (4.5:1 normal text, 3:1 large text, 3:1 UI components)
- [ ] Lighthouse accessibility score >= 95
- [ ] VPAT/ACR document generated and reviewed
- [ ] `prefers-reduced-motion` respected — no non-essential animation when enabled
- [ ] Text resizable to 200% without content loss
- [ ] Documentation complete (README, a11y statement, component usage guide)
- [ ] CI/CD pipeline blocks on new a11y violations

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
| Third-party components not accessible | H | H | Audit all dependencies for a11y, wrap with ARIA where needed, maintain accessible alternatives |
| Screen reader behavior inconsistencies across NVDA/JAWS/VoiceOver | H | M | Test on all three, document known differences, use most broadly compatible ARIA patterns |
| Design team pushes back on a11y requirements (visual impact) | M | H | Accessibility is non-negotiable — educate on inclusive design benefits, provide accessible alternatives that are also visually appealing |
| WCAG 2.2 new criteria not yet widely understood | M | M | Training sessions, reference APG (ARIA Authoring Practices Guide), criterion-by-criterion checklists |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- WCAG 2.2 AA compliance — zero violations at launch
- Screen reader testing with at least NVDA + VoiceOver — no ship without passing
- Keyboard navigation — 100% interactive element coverage
- `eslint-plugin-jsx-a11y` enabled with error severity in CI
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
- QA finds >= 5 blocking a11y violations

**Agent types the PM may add**:
- [x] Additional ARIA/Semantic HTML Engineer
- [x] Additional Screen Reader Specialist (cross-platform testing)
- [x] Additional Keyboard Navigation Engineer
- [x] Additional Color/Visual Accessibility Engineer
- [x] Additional QA Engineer (WCAG audit, assistive tech validation)
- [x] Frontend Specialist (React / Next.js accessible components)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] axe-core scan results (zero violations — HTML report)
- [x] pa11y scan results (page-level compliance report)
- [x] Lighthouse accessibility audit (score >= 95 — HTML report)
- [x] Screen reader test results (NVDA + VoiceOver — pass/fail per user flow with notes)
- [x] Keyboard navigation test results (every interactive element documented as operable)
- [x] Color contrast audit (every text/UI element verified — tool output + manual checks)
- [x] WCAG 2.2 conformance matrix (each success criterion mapped to PASS/FAIL/NA)
- [x] VPAT/ACR document (Voluntary Product Accessibility Template)
- [x] CI/CD pipeline screenshot (all checks green including a11y gates)
- [x] Test coverage report (Vitest coverage output — HTML + lcov)

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
- [x] `.team/evidence/` proof artifacts (a11y reports, VPAT)
- [x] Source code changes
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Accessibility Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for WCAG 2.2 AA/AAA compliance with React/Next.js/Vue, axe-core, pa11y, NVDA, and VoiceOver*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
