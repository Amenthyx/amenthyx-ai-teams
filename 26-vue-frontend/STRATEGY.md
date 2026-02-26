# Vue.js Frontend Team — Tailored Strategy v3.1

> Pre-configured for **Vue.js/Nuxt frontend applications with TypeScript, Pinia, and modern tooling**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team vueFrontend --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Vue.js Frontend Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Vue 3 (Composition API) / Nuxt 3 / Pinia (state management)
- **Database**: N/A (frontend only — consumes backend APIs)
- **Cache**: Pinia persistence plugin / vue-query (TanStack Query for Vue)
- **Message Queue**: N/A

**Hosting/Infrastructure**:
- **Cloud Provider**: Vercel / Netlify / Docker + Nginx — team's choice
- **Deployment**: Vercel (recommended) / Netlify / Docker + Nginx (self-hosted)
- **CDN**: Vercel Edge / Cloudflare / Netlify CDN — team's choice
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Backend API | Data layer | JWT / OAuth2 tokens | [FILL IN] |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm

**Repo Structure**: Nuxt 3 conventions (`pages/`, `components/`, `composables/`, `stores/`, `layouts/`, `server/`)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Bundle size < 200KB gzipped (initial load)

**Security**:
- Authentication: Token-based (JWT stored in httpOnly cookies) / OAuth2 redirect flows
- Authorization: Route guards (Vue Router `beforeEach`) + API-side enforcement
- Content Security Policy (CSP) headers configured
- XSS prevention: Vue built-in escaping + DOMPurify for user HTML
- CSRF tokens on all mutation requests
- Secure cookies (httpOnly, SameSite=Strict, Secure)
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Static hosting with CDN (auto-scales), Nuxt SSR scaled via serverless/edge functions, vue-query for intelligent caching and request deduplication

**Availability**:
- Uptime target: 99.9%
- RTO: 30 minutes (static hosting rebuild + CDN purge)
- RPO: N/A (frontend is stateless, source in Git)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- WCAG 2.1 AA compliance
- Screen reader compatible (aria attributes, semantic HTML)
- Keyboard navigation support (focus management, skip links)
- i18n-ready with @nuxtjs/i18n or vue-i18n

**Observability**:
- Error tracking: Sentry (Vue integration with source maps)
- Performance monitoring: Vercel Analytics / Web Vitals reporting
- Debugging: Vue Devtools (Pinia inspector, component tree, timeline)
- User analytics: [FILL IN: Plausible / PostHog / Google Analytics]

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 70% line coverage (components), >= 80% (composables/stores)

**Required Test Types**:
- [x] Unit tests (Vitest — composables, stores, utility functions)
- [x] Component tests (Vitest + Vue Test Utils — component rendering and behavior)
- [x] End-to-end tests (Playwright — critical user flows)
- [x] Performance audits (Lighthouse — all Core Web Vitals green)
- [x] Accessibility tests (axe-core via Playwright + Lighthouse a11y audit)
- [x] Visual regression tests (Storybook + Chromatic or Playwright screenshots)
- [ ] API contract tests (optional — mock validation against OpenAPI spec)
- [ ] Cross-browser testing (optional — Playwright multi-browser)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint + eslint-plugin-vue, Prettier, tsc --strict via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment
- [ ] Storybook deployed to Chromatic on every PR

**Testing Tools**: Vitest, Vue Test Utils, Playwright, Lighthouse, axe-core, Storybook, Chromatic

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
| Chromatic | ~$149/mo | Card | No — ask first |
| Netlify Pro | ~$19/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 70% component test coverage, >= 80% composable/store coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows (Playwright)
- [ ] Lighthouse scores all green (Performance >= 90, Accessibility >= 90, Best Practices >= 90, SEO >= 90)
- [ ] Storybook deployed with all shared components documented
- [ ] Bundle size < 200KB gzipped
- [ ] Documentation complete (README, component docs via Storybook, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds
- [ ] All environment variables documented in .env.example

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
| Bundle size bloat from excessive dependencies | M | M | Strict dependency auditing, tree-shaking analysis, bundle analyzer in CI, lazy-loaded routes |
| Nuxt SSR hydration mismatch issues | M | M | Strict SSR-safe code patterns, `<ClientOnly>` wrappers where needed, hydration error detection in CI |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Composition API only (no Options API)
- TypeScript strict mode (`"strict": true` in tsconfig.json)
- WCAG 2.1 AA compliance
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
- [x] Additional Frontend Engineer (Vue 3 / Nuxt 3)
- [x] Additional QA Engineer (Playwright / Vitest / Lighthouse)
- [x] Accessibility Specialist (WCAG audit, screen reader testing)
- [x] Performance Specialist (bundle optimization, Core Web Vitals)
- [x] Design System Specialist (Storybook, design tokens)
- [x] DevOps Specialist (Vercel/Netlify configuration, CI/CD)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Vitest coverage output — HTML + lcov)
- [x] Playwright E2E test results (HTML report)
- [x] Lighthouse performance audit (Performance, Accessibility, Best Practices, SEO scores)
- [x] Bundle size analysis (webpack-bundle-analyzer / vite-bundle-visualizer output)
- [x] Storybook deployment (live URL with all components documented)
- [x] Accessibility audit report (axe-core results, WCAG checklist)
- [x] Security scan results (npm audit, Snyk, or equivalent)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Deployment log (production deployment evidence)
- [x] Core Web Vitals dashboard (LCP, FID, CLS real-user data)

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
**Branch**: `team/vueFrontend/execution`
**Merge to main**: After release sign-off only

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

*Vue.js Frontend Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + Vue 3 + Nuxt 3 + Pinia frontend development*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
