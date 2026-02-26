# React Frontend Team — Tailored Strategy v3.1

> Pre-configured for **React 18 / Next.js 14 frontend development with TypeScript, Playwright, and Core Web Vitals**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team react --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for React Frontend Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: React 18 / Next.js 14 (App Router with Server Components)
- **Database**: N/A (frontend — backend team handles database)
- **Cache**: React Query (TanStack Query) / SWR for server state caching
- **Message Queue**: N/A (frontend — uses WebSocket / SSE for real-time if needed)

**Hosting/Infrastructure**:
- **Cloud Provider**: Vercel (primary) / Netlify / Docker + Nginx (alternative)
- **Deployment**: Vercel (automatic via Git) / Docker + Nginx for self-hosted
- **CDN**: Vercel Edge Network / CloudFront / Cloudflare
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Backend API | Data source | JWT / cookies | [FILL IN or "team-defined"] |
| Vercel | Hosting + Edge Functions | Git integration | Hobby: 100 deploys/day |
| Storybook | Component documentation | Public / auth | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm

**Monorepo or Polyrepo**: Single repo or monorepo frontend workspace (Turborepo if shared libs)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Largest Contentful Paint (LCP) < 2.5 seconds
- First Input Delay (FID) / Interaction to Next Paint (INP) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- JavaScript bundle size < 200 KB gzipped (initial load)

**Security**:
- Authentication: Secure cookies (httpOnly, SameSite=Strict) / JWT in memory (never localStorage)
- Authorization: Route-level guards, component-level conditional rendering
- CSRF protection: SameSite cookies + CSRF tokens
- CSP headers: strict Content-Security-Policy
- XSS prevention: React default escaping + DOMPurify for user HTML
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Edge deployment (Vercel Edge), ISR/SSG for cacheable pages, React Query stale-while-revalidate, code splitting per route

**Availability**:
- Uptime target: 99.9% (Vercel SLA)
- RTO: 5 minutes (Vercel auto-recovery)
- RPO: 0 (static assets on CDN)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- WCAG 2.1 AA compliance (mandatory)
- Screen reader tested (NVDA, VoiceOver)
- Keyboard navigation for all interactive elements
- Focus management for SPAs (route changes)
- Color contrast ratios meeting AA standards
- i18n-ready with next-intl / react-i18next

**Observability**:
- Logging: Sentry (error tracking + performance monitoring)
- Metrics: Web Vitals (CWV) via web-vitals library + Vercel Analytics
- Tracing: Sentry Performance (transaction traces)
- Alerting: Sentry alerts (error rate spikes, performance regression)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (hooks, utils, logic), >= 70% (components)

**Required Test Types**:
- [x] Unit tests (Vitest — hooks, utilities, business logic)
- [x] Component tests (React Testing Library — rendering, interaction, accessibility)
- [x] End-to-end tests (Playwright — critical user flows, cross-browser)
- [x] Visual regression tests (Playwright screenshots / Chromatic for Storybook)
- [x] Accessibility tests (axe-core via @axe-core/react + Playwright axe integration)
- [x] Performance tests (Lighthouse CI — Core Web Vitals, bundle analysis)
- [x] Storybook stories (all reusable components documented with stories)
- [ ] API mocking (MSW — mock backend responses in tests and Storybook)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint, Prettier, tsc --strict via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Lighthouse CI check on every PR
- [ ] Automated deployment to staging (Vercel preview deployments)
- [ ] Manual approval gate for production deployment

**Testing Tools**: Vitest, React Testing Library, Playwright, axe-core, Lighthouse CI, Storybook, MSW (Mock Service Worker), Chromatic (optional)

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
- Infrastructure: [FILL IN: $/month or "minimize — Vercel free tier"]
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
| Chromatic (Storybook) | Free tier / $149/mo | Card | No — ask first |
| Sentry | Free tier / $26/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on logic, >= 70% on components
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows (Playwright)
- [ ] Core Web Vitals passing (LCP < 2.5s, INP < 100ms, CLS < 0.1)
- [ ] Lighthouse scores all green (Performance >= 90, Accessibility >= 90, Best Practices >= 90, SEO >= 90)
- [ ] Documentation complete (README, component docs via Storybook, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds
- [ ] WCAG AA accessibility audit passed
- [ ] Storybook deployed with all reusable components documented
- [ ] Bundle size < 200 KB gzipped (initial load)

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
| Bundle size bloat (excessive dependencies) | M | M | Bundle analyzer in CI, tree-shaking, dynamic imports, dependency audit before adding new packages |
| Third-party library breaking changes (React, Next.js) | M | H | Pin versions in package.json, test upgrades on dedicated branch, follow changelogs, maintain adapter patterns |
| Accessibility regressions | M | M | axe-core in CI, screen reader testing in QA wave, accessibility checklist per component |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- TypeScript strict mode (`"strict": true`) across all code
- Core Web Vitals must be passing before production deployment
- WCAG 2.1 AA compliance
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
- [x] Additional Frontend Engineer (React / Next.js / TypeScript)
- [x] Additional QA Engineer (Playwright, visual regression, accessibility)
- [x] Accessibility Specialist (WCAG audit, screen reader testing)
- [x] Performance Specialist (bundle optimization, Core Web Vitals, Lighthouse)
- [x] UI/UX Specialist (component design, Storybook, animations)
- [x] Design System Specialist (shared components, tokens, Storybook)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Vitest coverage — HTML + lcov)
- [x] Playwright E2E test results (HTML report, cross-browser)
- [x] Lighthouse CI results (Performance, Accessibility, Best Practices, SEO scores)
- [x] Core Web Vitals report (LCP, INP, CLS — lab and field data)
- [x] Bundle analysis report (webpack-bundle-analyzer / @next/bundle-analyzer output)
- [x] Accessibility audit report (axe-core scan results, manual screen reader test notes)
- [x] Storybook deployment URL (all components documented)
- [x] Security scan results (npm audit, CSP headers verification)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Component architecture diagram (component tree, data flow, state management)

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
**Branch**: `team/react/execution`
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

*React Frontend Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + React 18 + Next.js 14 frontend development*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
