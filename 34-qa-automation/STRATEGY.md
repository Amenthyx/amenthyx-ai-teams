# QA Automation Team — Tailored Strategy v3.1

> Pre-configured for **test automation, quality assurance, and comprehensive test framework engineering across all testing layers**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team qaAutomation --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for QA Automation Team)*

**Required Tech Stack**:
- **Language**: TypeScript / Python 3.12+ / Java (framework choice dependent)
- **Framework**: Playwright (primary E2E) / Cypress (alternative E2E) / Selenium (legacy/Java shops) / Appium (mobile) / k6 (performance)
- **Database**: PostgreSQL (test results database) / Allure server (report storage)
- **Cache**: N/A
- **Message Queue**: N/A

**Hosting/Infrastructure**:
- **Cloud Provider**: Docker (test infrastructure) / cloud CI runners (GitHub Actions)
- **Deployment**: Docker containers for test execution environments
- **CDN**: N/A
- **Domain**: N/A (testing infrastructure)

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD + PR status checks | gh CLI | N/A |
| Allure Server | Test report hosting | API key / basic auth | N/A |
| Application Under Test | Target system | Test credentials (.env) | [FILL IN] |
| Slack / Teams | Test result notifications | Webhook / Bot token | Rate limited |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm (TypeScript) / pip (Python) / Maven (Java)

**Repo Structure**: `tests/unit/`, `tests/integration/`, `tests/e2e/`, `tests/performance/`, `tests/security/`, `tests/a11y/`, `tests/visual/`, `page-objects/`, `fixtures/`, `reports/`, `config/`

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Full E2E suite execution: < 15 minutes (parallelized)
- Test reliability: > 99% (no flaky tests — tracked and quarantined)
- Parallel execution: configurable workers (default 4 for E2E, unlimited for unit)
- Report generation: < 1 minute after suite completion

**Security**:
- Test data management: NO production data in test environments
- Credential isolation: Test credentials in .env, never committed, rotated regularly
- Secure test environments: Isolated from production, network-segmented
- PII in test data: Synthetic/anonymized only
- Compliance: [FILL IN]

**Scalability**:
- Expected test suite size (launch): [FILL IN]
- Expected test suite size (6-month): [FILL IN]
- Expected test suite size (1-year): [FILL IN]
- Scaling strategy: Parallel execution (Playwright workers), sharded CI runs (split by test file), Docker-based test infrastructure scales with CI runners

**Availability**:
- CI pipeline availability: 99.9% (match CI provider SLA)
- Test environment: Available during business hours minimum, 24/7 for critical path
- Report server: Available 24/7 (Allure)

**Accessibility**:
- Accessibility testing: axe-core integrated into E2E tests (automatic WCAG AA checks)
- Reports: HTML-based (Allure), accessible via browser, shareable URL

**Observability**:
- Test analytics: Allure reports (pass/fail trends, duration trends, flaky test detection)
- Dashboards: Test execution history, coverage trends, flaky test tracking
- CI integration: GitHub PR checks (pass/fail status, report links)
- Alerting: Slack/Teams notification on test suite failure

---

## 6. Testing Requirements *(pre-configured — this IS the testing team)*

**Test Coverage Target**: Application coverage driven by this team's work — targets defined per layer

**Required Test Layers** (this team implements ALL):
- [x] Unit tests (Vitest / Jest / pytest — isolated function/class testing)
- [x] Integration tests (database, API, service interaction testing)
- [x] End-to-end tests (Playwright — full user flow testing, critical paths)
- [x] Performance / load tests (k6 — load, soak, stress, spike testing)
- [x] Security tests (OWASP ZAP baseline, dependency scanning, auth testing)
- [x] Accessibility tests (axe-core — WCAG AA automated checks)
- [x] API contract tests (OpenAPI schema validation, request/response verification)
- [x] Visual regression tests (Playwright screenshot comparison / Chromatic)
- [ ] Mobile tests (optional — Appium / Detox for mobile applications)
- [ ] Chaos engineering tests (optional — fault injection, resilience verification)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint, ruff, lint-staged)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Test suite gates on all PRs (no merge without green tests)
- [x] Allure report published on every CI run
- [ ] Scheduled nightly full regression run
- [ ] Performance test gate on release branches

**Testing Tools**: Playwright, Cypress, k6, axe-core, OWASP ZAP, Allure, Vitest/Jest/pytest, Supertest, MSW, Faker.js/Faker (test data generation)

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
- CI runner minutes: [FILL IN: $/month or "free tier only"]
- Testing tools: [FILL IN: free/OSS or licensed]

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
| GitHub Actions (extra minutes) | Usage-based | Card | No — ask first |
| BrowserStack / LambdaTest | ~$29+/mo | Card | No — ask first |
| Allure TestOps | ~$30/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 test suites implemented and passing
- [ ] Test reliability > 99% (zero known flaky tests in active suite)
- [ ] E2E suite completes in < 15 minutes (parallelized)
- [ ] Page Object Model implemented for all page interactions
- [ ] data-testid selectors used (no CSS/XPath selectors for E2E)
- [ ] Allure reports configured and accessible
- [ ] Performance baseline established (k6 results for critical endpoints)
- [ ] Accessibility tests integrated into E2E suite (axe-core)
- [ ] Security baseline scan completed (OWASP ZAP)
- [ ] CI/CD pipeline gates configured (no merge without green tests)
- [ ] Documentation complete (test strategy, framework guide, contributing guide)
- [ ] Flaky test detection and quarantine process documented

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
| Flaky tests eroding team trust in automation | M | H | Strict flaky detection (3-retry policy), quarantine flaky tests immediately, root cause analysis within 24h, flaky rate tracked as KPI |
| Test maintenance overhead (tests break with every UI change) | M | M | Page Object Model enforced, data-testid selectors (resilient to CSS changes), component-level tests reduce E2E dependency, test code review |
| Environment parity (tests pass locally, fail in CI or vice versa) | M | M | Docker-based test environments, same browser versions in CI and local, environment config documented, seed data reproducible |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Page Object Model for all E2E page interactions
- data-testid selectors only (no CSS selectors, no XPath for E2E)
- Retry policy for flaky detection (3 retries — if passes on retry, marked flaky and quarantined)
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
- [x] Additional QA Engineer (Playwright / Cypress / general test automation)
- [x] Performance Testing Specialist (k6, load modeling, performance analysis)
- [x] Mobile Testing Specialist (Appium, Detox, device testing)
- [x] Security Testing Specialist (OWASP ZAP, penetration testing, vulnerability scanning)
- [x] Accessibility Testing Specialist (WCAG audit, screen reader testing, axe-core)
- [x] Test Infrastructure Specialist (CI/CD optimization, Docker test environments, parallel execution)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Allure test report (all suites — pass/fail/skip breakdown, trends)
- [x] Test coverage report (line coverage per layer — unit, integration, E2E)
- [x] E2E execution time log (< 15 minutes verified, parallelization evidence)
- [x] Flaky test report (zero flaky tests in active suite, quarantine log)
- [x] k6 performance test results (load, soak, stress — summary + HTML)
- [x] Accessibility audit results (axe-core — WCAG AA violations report)
- [x] Security scan results (OWASP ZAP baseline report)
- [x] Visual regression report (screenshot diffs — no unintended changes)
- [x] CI/CD pipeline screenshot (all gates green, report links working)
- [x] Test architecture diagram (test layers, framework stack, data flow)

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
**Branch**: `team/qaAutomation/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts
- [x] Test source code changes
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*QA Automation Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Playwright + Cypress + k6 + axe-core comprehensive test automation*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
