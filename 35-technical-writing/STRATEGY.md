# Technical Writing Team — Tailored Strategy v3.1

> Pre-configured for **documentation engineering, API docs, developer guides, and documentation-as-code with MkDocs/Docusaurus**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team techWriting --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Technical Writing Team)*

**Required Tech Stack**:
- **Language**: Markdown / MDX / reStructuredText
- **Framework**: MkDocs (Material theme) / Docusaurus / Sphinx / Mintlify (team's choice based on ecosystem)
- **Database**: N/A
- **Cache**: N/A
- **Message Queue**: N/A

**Hosting/Infrastructure**:
- **Cloud Provider**: GitHub Pages / Vercel / Netlify / ReadTheDocs — team's choice
- **Deployment**: Static site generation + CDN hosting
- **CDN**: Included with hosting platform (Vercel/Netlify/Cloudflare)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD + PR preview | gh CLI | N/A |
| OpenAPI spec | Auto-generated API reference | File import | N/A |
| Search (Algolia/built-in) | Documentation search | API key (.env) | Rate limited |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pip (MkDocs/Sphinx) / npm (Docusaurus/Mintlify)

**Repo Structure**: `docs/` (content), `docs/api/` (auto-generated API docs), `docs/guides/`, `docs/tutorials/`, `docs/reference/`, `static/` (images, diagrams), `.vale/` (style config)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Docs site Largest Contentful Paint (LCP): < 2 seconds
- Search response time: < 500ms
- Build time: < 2 minutes (full site rebuild)
- Image optimization: all images compressed, WebP format preferred

**Security**:
- No secrets in documentation (API keys, passwords, connection strings)
- Redacted examples for all code samples involving credentials
- Authentication for private/internal docs: [FILL IN: none / SSO / basic auth]
- Compliance: [FILL IN]

**Scalability**:
- Expected docs pages (launch): [FILL IN]
- Expected docs pages (6-month): [FILL IN]
- Expected docs pages (1-year): [FILL IN]
- Scaling strategy: Static site generation scales inherently, search index scales with Algolia/Typesense, CDN handles traffic

**Availability**:
- Docs site uptime target: 99.9% (CDN-backed)
- RTO: 15 minutes (rebuild + redeploy)
- RPO: N/A (source in Git)
- Multi-region: CDN handles automatically

**Accessibility**:
- WCAG 2.1 AA compliance (docs site itself)
- Screen reader compatible navigation
- Keyboard navigation support
- High contrast mode support
- Alt text on all images and diagrams

**Observability**:
- Docs analytics: Page views, time on page, search queries, 404 tracking
- Feedback: Per-page "Was this helpful?" widget
- Broken link monitoring: Automated broken link checker (CI + scheduled)
- Search analytics: Top queries, zero-result queries (content gap identification)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: 100% (all links valid, all pages build, vale lint clean)

**Required Test Types**:
- [x] Vale prose lint (style guide adherence — grammar, tone, terminology)
- [x] markdownlint (Markdown formatting consistency)
- [x] alex (inclusive language checker — no insensitive/inconsiderate language)
- [x] Broken link checker (internal + external links validated)
- [x] Spell check (cspell — technical dictionary + custom words)
- [x] Build test (docs site builds without errors/warnings)
- [x] Screenshot freshness check (flagged if screenshots older than release)
- [ ] Search functionality test (optional — verify search returns expected results)
- [ ] Accessibility audit (optional — axe-core on built docs site)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (vale, markdownlint, alex, cspell via pre-commit/lint-staged)
- [x] Branch protection (require PR reviews, passing CI)
- [x] PR preview deployments (Vercel/Netlify preview per PR)
- [ ] Automated deployment to production on merge to main
- [ ] Scheduled broken link check (weekly)

**Testing Tools**: vale, markdownlint, alex, cspell, broken-link-checker (blc), mkdocs build / docusaurus build

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
- Infrastructure: [FILL IN: $/month or "minimize" — most hosting is free]
- Search service: [FILL IN: Algolia free tier / self-hosted]
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
| Algolia (search) | Free tier / ~$29+/mo | Card | No — ask first |
| Vercel / Netlify | Free tier / ~$20/mo | Card | No — ask first |
| Custom domain | ~$12/year | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 documentation sections written and reviewed
- [ ] Vale lint passing with zero errors (style guide adherence)
- [ ] markdownlint passing with zero errors
- [ ] alex passing with zero warnings (inclusive language)
- [ ] Broken link checker passing (zero broken links — internal and external)
- [ ] Search functionality working (returns relevant results for key queries)
- [ ] Docs site deployed and accessible at production URL
- [ ] Version selector working (if multi-version docs)
- [ ] API reference auto-generated and up-to-date with source
- [ ] All screenshots current (matching latest release)
- [ ] CI/CD pipeline tested and working (build + lint + deploy)
- [ ] Feedback mechanism in place (per-page rating or comment)

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
| Documentation drift from code (docs describe old behavior) | M | H | API docs auto-generated from source/spec, CI checks for spec-doc sync, docs reviewed as part of feature PRs, screenshot freshness checks |
| Stale screenshots (UI changes but screenshots not updated) | M | M | Screenshot freshness policy (re-capture with each release), automated screenshot generation where possible, CI flag for outdated screenshots |
| Inconsistent terminology across documentation | M | M | Vale custom vocabulary file, glossary page, terminology review in PR process, search for conflicting terms during review |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Style guide adherence (vale config enforced in CI)
- Version-matched documentation (docs version tied to software version)
- API docs auto-generated from source (OpenAPI spec / docstrings / typedoc)
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
- [x] Additional Technical Writer (content authoring, reviews)
- [x] API Documentation Specialist (OpenAPI, GraphQL schema docs, SDK docs)
- [x] Video Tutorial Specialist (screen recordings, narrated walkthroughs)
- [x] Information Architect (navigation structure, content taxonomy)
- [x] Frontend Specialist (docs site customization, search configuration)
- [x] QA Specialist (link checking, accuracy verification, style audit)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Docs site screenshots (deployed site — homepage, navigation, search, version selector)
- [x] Vale lint report (zero errors — style guide adherence verified)
- [x] Broken link checker report (zero broken links)
- [x] Search functionality demo (screenshot or recording — key queries returning results)
- [x] Version selector demo (if applicable — switching between doc versions)
- [x] API reference screenshot (auto-generated, matching current spec)
- [x] Accessibility audit (Lighthouse a11y score, WCAG checklist)
- [x] Page analytics dashboard (page views, search queries, feedback ratings)
- [x] CI/CD pipeline screenshot (all checks green — vale, lint, build, deploy)
- [x] Content architecture diagram (information hierarchy, navigation structure)

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
**Branch**: `team/techWriting/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts
- [x] Documentation source files
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Technical Writing Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for MkDocs / Docusaurus / Sphinx documentation-as-code engineering*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
