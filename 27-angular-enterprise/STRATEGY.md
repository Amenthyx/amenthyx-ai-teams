# Angular Enterprise Team — Tailored Strategy v3.1

> Pre-configured for **Angular enterprise applications with signals, standalone components, NgRx, and Angular Material**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team angularEnterprise --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Angular Enterprise Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Angular 17+ (signals, standalone components) / NgRx (signals store) / Angular Material
- **Database**: N/A (frontend only — consumes backend APIs)
- **Cache**: NgRx store (client-side state) / HTTP interceptor cache (ETag/Cache-Control)
- **Message Queue**: N/A

**Hosting/Infrastructure**:
- **Cloud Provider**: Vercel / Azure Static Web Apps / Docker + Nginx — team's choice
- **Deployment**: Vercel / Azure Static Web Apps / Docker + Nginx (self-hosted)
- **CDN**: Vercel Edge / Azure CDN / Cloudflare — team's choice
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Backend API | Data layer | JWT / OAuth2 / OIDC tokens | [FILL IN] |
| Azure AD / Auth0 | Enterprise SSO | OIDC / MSAL | [FILL IN] |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: npm / pnpm

**Repo Structure**: Angular CLI conventions (`src/app/`, feature modules as standalone components, `src/environments/`, `src/assets/`)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Initial bundle < 300KB (lazy-loaded routes for everything beyond shell)

**Security**:
- Authentication: OIDC / MSAL (enterprise SSO) or JWT (API tokens)
- Authorization: Route guards + NgRx-driven role state + API-side enforcement
- Angular built-in XSS protection (template sanitization, DomSanitizer)
- CSRF protection via Angular HttpClient (XSRF-TOKEN cookie handling)
- Content Security Policy (CSP) headers configured
- HttpOnly cookies for session tokens
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Static hosting with CDN (auto-scales), lazy-loaded feature modules, NgRx for predictable state management at scale, virtual scrolling for large datasets

**Availability**:
- Uptime target: 99.9%
- RTO: 30 minutes (static hosting rebuild + CDN purge)
- RPO: N/A (frontend is stateless, source in Git)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- WCAG 2.1 AA compliance
- Angular CDK a11y module (FocusTrap, LiveAnnouncer, FocusMonitor)
- Screen reader compatible (aria attributes, semantic HTML)
- Keyboard navigation support (focus management, skip links)
- i18n-ready with Angular i18n or Transloco

**Observability**:
- Error tracking: Sentry (Angular integration with source maps)
- Performance monitoring: Application Insights / Web Vitals reporting
- Debugging: Angular DevTools (component tree, profiler, dependency injection inspector)
- User analytics: [FILL IN: Application Insights / PostHog / Google Analytics]

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 70% line coverage (components), >= 80% (services/stores)

**Required Test Types**:
- [x] Unit tests (Jest — services, pipes, directives, NgRx reducers/selectors)
- [x] Component tests (Angular Testing Library — component rendering and behavior)
- [x] End-to-end tests (Playwright — critical user flows)
- [x] Performance audits (Lighthouse — all Core Web Vitals green)
- [x] Accessibility tests (axe-core via Playwright + Lighthouse a11y audit)
- [ ] Visual regression tests (optional — Playwright screenshots)
- [ ] API contract tests (optional — mock validation against OpenAPI spec)
- [ ] Cross-browser testing (optional — Playwright multi-browser)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint + angular-eslint, Prettier, tsc --strict via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production deployment

**Testing Tools**: Jest (or Karma), Angular Testing Library, Playwright, Lighthouse, axe-core

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
| Azure Static Web Apps | ~$10/mo | Card | No — ask first |
| Application Insights | Usage-based | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 70% component test coverage, >= 80% service/store coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] E2E tests pass for all P0 user flows (Playwright)
- [ ] Lighthouse scores all green (Performance >= 90, Accessibility >= 90, Best Practices >= 90, SEO >= 90)
- [ ] Initial bundle < 300KB (lazy-loading verified)
- [ ] All components use standalone pattern (no NgModules)
- [ ] Documentation complete (README, component docs, setup guide)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds
- [ ] All environment variables documented in environment files

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
| Angular major version migration breaking changes | M | M | Pin Angular version, follow official upgrade guide, use `ng update` schematics, maintain compatibility tests |
| NgRx boilerplate complexity slowing development | M | L | Use NgRx Signal Store (simplified API), createFeature/createActionGroup helpers, strict code generation templates |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Standalone components only (no NgModule-based components)
- Signals for reactive state (no manual subscription management where avoidable)
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
- [x] Additional Frontend Engineer (Angular 17+ standalone/signals)
- [x] Additional QA Engineer (Playwright / Jest / Lighthouse)
- [x] Accessibility Specialist (WCAG audit, screen reader testing, Angular CDK a11y)
- [x] NgRx Specialist (store architecture, effects optimization, selectors)
- [x] Performance Specialist (bundle optimization, lazy loading, Core Web Vitals)
- [x] DevOps Specialist (Azure, Vercel, CI/CD configuration)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Jest/Karma coverage output — HTML + lcov)
- [x] Playwright E2E test results (HTML report)
- [x] Lighthouse performance audit (Performance, Accessibility, Best Practices, SEO scores)
- [x] Bundle size analysis (Angular CLI budget report + webpack-bundle-analyzer)
- [x] Accessibility audit report (axe-core results, WCAG checklist)
- [x] Security scan results (npm audit, Snyk, or equivalent)
- [x] NgRx store architecture diagram (state shape, effects flow)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Deployment log (production deployment evidence)
- [x] Architecture diagram (component tree, routing structure, data flow)

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
**Branch**: `team/angularEnterprise/execution`
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

*Angular Enterprise Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for TypeScript + Angular 17+ + NgRx + Angular Material enterprise frontend development*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
