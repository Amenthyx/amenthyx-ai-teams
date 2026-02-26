# Open Source Team — Tailored Strategy v3.1

> Pre-configured for **open-source project management, community building, contributor experience, governance, licensing, and release automation**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team openSource --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Open Source Team)*

**Required Tech Stack**:
- **Language**: Team's choice (based on project — TypeScript, Python, Rust, Go, etc.)
- **Build**: GitHub Actions (CI/CD), semantic-release or release-please (changelog + versioning)
- **Standards**: REUSE 3.0 (license compliance), SPDX (license identifiers), CFF (Citation File Format)
- **Documentation**: Docusaurus / MkDocs Material / VitePress — team's choice based on ecosystem
- **Community Tools**: GitHub Discussions, CLA/DCO bot, All Contributors bot, OpenSSF Scorecard

**Hosting/Infrastructure**:
- **Cloud Provider**: GitHub Pages / Vercel / Netlify (documentation site) — team's choice
- **Package Registry**: npm / PyPI / crates.io / Docker Hub — based on language
- **CDN**: GitHub Pages / Vercel Edge — for docs site
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD + Issues + Discussions + Projects | gh CLI + GITHUB_TOKEN | API rate limits |
| FOSSA / Snyk | License scanning + vulnerability detection | API key (env) | Per plan |
| Algolia DocSearch | Documentation search | Free for OSS | N/A |
| CLA Assistant / DCO Bot | Contributor agreement management | GitHub App | N/A |
| OpenSSF Scorecard | Security practices assessment | GitHub Action | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: Based on language (pnpm / pip / cargo / go modules)

**Monorepo or Polyrepo**: [FILL IN — based on project]

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- CI pipeline completes in < 10 minutes for PRs
- Documentation site LCP < 2.0s
- Package install time reasonable for ecosystem (< 30s for npm, < 60s for pip)
- Release automation completes in < 5 minutes

**Security**:
- Authentication: GitHub-based (OAuth for CLA, SSH/GPG for commits)
- Authorization: CODEOWNERS for protected paths, branch protection for main
- Data sensitivity: No secrets in repository — .env.example only
- Compliance: OSI-approved license, REUSE 3.0, OpenSSF Best Practices badge target
- Encryption: HTTPS for all endpoints, signed commits recommended

**Scalability**:
- Expected launch contributors: [FILL IN]
- Expected 6-month contributors: [FILL IN]
- Expected 1-year contributors: [FILL IN]
- Scaling strategy: Community governance model scales with contributor count (BDFL -> meritocratic -> committee)

**Availability**:
- Uptime target: 99.9% (documentation site)
- RTO: 1 hour (docs), N/A (package — immutable once published)
- RPO: N/A (Git is the source of truth)
- Multi-region: CDN-based (automatic via GitHub Pages / Vercel)

**Accessibility**:
- Documentation site WCAG 2.1 AA compliant
- README screen-reader friendly
- Code examples have proper alt text where images are used

**Observability**:
- Logging: GitHub Actions logs for CI/CD, npm/PyPI download stats
- Metrics: GitHub Insights (contributor count, issue response time, PR review time, star count)
- Tracing: N/A
- Alerting: Dependabot alerts, CodeQL alerts, OpenSSF Scorecard threshold alerts

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (determined by project language)

**Required Test Types**:
- [x] Unit tests (language-appropriate — Vitest/Jest, pytest, cargo test, go test)
- [x] Integration tests (API/library integration, database if applicable)
- [x] License scan (FOSSA / Snyk — all dependencies must have compatible licenses)
- [x] Security scan (CodeQL, Dependabot, npm audit / pip-audit / cargo audit)
- [x] Documentation build test (docs site builds without errors, all links valid)
- [x] Contributor walkthrough test (clone, install, test, submit PR — following only CONTRIBUTING.md)
- [x] Community health check (GitHub Community Standards — all recommended files present)
- [x] Release workflow test (dry-run of semantic-release / release-please)
- [ ] Cross-platform CI matrix (Linux, macOS, Windows — optional based on project)
- [ ] Visual regression for documentation (optional)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (language-appropriate linter + formatter via lint-staged + husky)
- [x] Branch protection (require PR reviews, passing CI, CODEOWNERS approval)
- [x] Conventional commits enforced (commitlint)
- [x] Automated changelog generation (semantic-release / release-please / changesets)
- [ ] Automated publishing to package registry on release
- [ ] Automated documentation deployment on merge to main

**Testing Tools**: Language-dependent (Vitest/Jest, pytest, cargo test, go test), FOSSA, CodeQL, Dependabot, pa11y (docs), linkchecker

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
- Infrastructure: [FILL IN: $/month or "minimize — free tier for OSS"]
- Third-party APIs: [FILL IN: $/month or "free tier only"]
- Domains/SSL: [FILL IN: $ or "GitHub Pages free"]

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
| Custom domain | ~$12/year | Card | No — ask first |
| FOSSA (if not free tier) | ~$0-99/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities (CodeQL + dependency audit clean)
- [ ] OSI-approved license selected and applied (LICENSE file, SPDX headers)
- [ ] CONTRIBUTING.md complete and validated (contributor walkthrough passes)
- [ ] CODE_OF_CONDUCT.md present with enforcement procedures
- [ ] README complete (badges, install, usage, contributing link, license)
- [ ] Documentation site deployed and all links valid
- [ ] CI/CD pipeline working (lint, test, build, release dry-run)
- [ ] FOSSA/Snyk license scan clean — all dependencies compatible
- [ ] GitHub Community Standards check — all items green
- [ ] OpenSSF Scorecard score >= 7/10
- [ ] First release published via automated pipeline (SemVer compliant)
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
| License incompatibility in transitive dependencies | M | H | FOSSA/Snyk continuous scanning, pre-merge license check in CI, dependency review |
| Low contributor engagement after launch | M | M | Good-first-issue labeling, Hacktoberfest, clear CONTRIBUTING.md, fast PR review (< 48h) |
| Maintainer burnout | M | H | Multiple maintainers, clear governance, documented escalation, community-shared responsibilities |
| Supply chain attack via compromised dependency | L | H | Dependabot, CodeQL, npm provenance / Sigstore, pin dependency versions, lockfile verification |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- OSI-approved license — no proprietary or non-standard licenses
- CONTRIBUTING.md mandatory — no contributions accepted without it
- CODE_OF_CONDUCT.md mandatory — Contributor Covenant recommended
- CLA or DCO required for all contributions
- Semantic versioning (SemVer) — no breaking changes without major version bump
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
- QA finds >= 5 blocking issues

**Agent types the PM may add**:
- [x] Additional CI/CD & Release Engineer
- [x] Additional Documentation & Onboarding Engineer
- [x] Additional Community/Governance Engineer
- [x] Additional Security & License Compliance Engineer
- [x] Additional QA Engineer (community standards, contributor experience)
- [x] Language-Specific Developer (for core project code)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (language-appropriate coverage output — HTML + lcov)
- [x] FOSSA/Snyk license scan (clean report — all dependencies compatible)
- [x] CodeQL security scan results (zero critical/high findings)
- [x] OpenSSF Scorecard report (score >= 7/10)
- [x] GitHub Community Standards check (all items green — screenshot)
- [x] Contributor walkthrough test (documented step-by-step following CONTRIBUTING.md)
- [x] Documentation site build + link check (zero broken links)
- [x] Release pipeline dry-run (changelog generated, version bumped, package built)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] REUSE compliance check (all files have SPDX headers)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Published packages**: NEVER unpublish — deprecate instead

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/openSource/execution`
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

*Open Source Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for open-source project management with GitHub Actions, semantic-release, REUSE 3.0, and community governance*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
