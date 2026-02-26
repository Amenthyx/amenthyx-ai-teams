# Platform Engineering Team — Tailored Strategy v3.1

> Pre-configured for **internal developer platforms, golden paths, self-service infrastructure, and developer experience**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team platformEng --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Platform Engineering Team)*

**Required Tech Stack**:
- **Language**: Go / TypeScript / Python
- **Framework**: Backstage (developer portal) / Crossplane (infrastructure composition) / ArgoCD (GitOps) / Helm (K8s packaging)
- **Database**: PostgreSQL (Backstage catalog, platform metadata)
- **Cache**: Redis (API response caching, session state)
- **Message Queue**: NATS / RabbitMQ (platform event bus)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Azure — team's choice
- **Deployment**: Kubernetes (Helm charts) / Docker
- **CDN**: N/A (internal platform tooling)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD + Backstage SCM integration | gh CLI / OAuth App | N/A |
| Backstage | Developer portal + service catalog | OIDC / SSO | N/A |
| Crossplane | Infrastructure composition | K8s RBAC + cloud IAM | N/A |
| ArgoCD | GitOps continuous delivery | OIDC / SSO | N/A |
| Kubernetes | Container orchestration | RBAC + service accounts | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: go mod / npm (Backstage) / pip

**Repo Structure**: Monorepo (`backstage/`, `crossplane-compositions/`, `helm-charts/`, `argocd/`, `golden-paths/`, `docs/`, `scripts/`)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Service provisioning time: < 5 minutes (from request to running service)
- Developer onboarding: < 1 hour (from zero to first deploy)
- Platform API response P95: < 500ms
- Backstage catalog search: < 2 seconds

**Security**:
- Authentication: OIDC / SSO (corporate identity provider)
- Authorization: RBAC (Kubernetes RBAC + Backstage permission framework + platform API roles)
- Namespace isolation: Each team gets isolated K8s namespace with network policies
- Policy-as-code: OPA / Kyverno (enforce guardrails, not gates)
- Secrets management: External Secrets Operator + Vault
- Compliance: [FILL IN]

**Scalability**:
- Expected launch developer teams: [FILL IN]
- Expected 6-month developer teams: [FILL IN]
- Expected 1-year developer teams: [FILL IN]
- Scaling strategy: Backstage scales horizontally, Crossplane compositions are declarative (cluster-level), ArgoCD sharding for multi-cluster, NATS clustering

**Availability**:
- Platform uptime target: 99.9% (developer-facing services)
- RTO: 30 minutes
- RPO: 5 minutes
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- Backstage portal: WCAG 2.1 AA (Material UI base)
- Documentation: clear, searchable, version-matched
- CLI tools: well-documented help output, consistent flags

**Observability**:
- Backstage metrics: plugin adoption, catalog completeness, TechDocs coverage
- Kubernetes dashboards: cluster health, namespace resource usage
- Developer satisfaction: quarterly surveys, NPS tracking
- Platform adoption: services onboarded, golden path usage rates
- Alerting: PagerDuty / Opsgenie for platform-level incidents

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (Go services), >= 70% (Backstage plugins), 100% (Crossplane compositions)

**Required Test Types**:
- [x] Unit tests (go test — Go services, Jest — Backstage plugins)
- [x] Integration tests (real cluster — Crossplane compositions, Helm charts)
- [x] End-to-end tests (Playwright — Backstage portal flows)
- [x] Infrastructure tests (Terratest / Crossplane composition validation)
- [x] Golden path tests (template instantiation and deployment verification)
- [x] Policy tests (OPA/Kyverno policy unit tests)
- [ ] Load testing (optional — platform API under developer load)
- [ ] Chaos engineering (optional — platform resilience)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (golangci-lint, ESLint, ruff via pre-commit framework)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Helm chart linting and template validation on every PR
- [ ] Automated deployment to staging on merge to develop
- [ ] Manual approval gate for production platform changes

**Testing Tools**: go test, Jest, Playwright, Terratest, Helm lint, Crossplane render, OPA test, kube-score

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
| AWS / GCP / Azure (K8s clusters) | Variable | Card | No — ask first |
| Backstage hosting | ~$0 (self-hosted) | N/A | N/A |
| ArgoCD hosting | ~$0 (self-hosted) | N/A | N/A |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on Go services, >= 70% on Backstage plugins
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Service provisioning < 5 minutes demonstrated
- [ ] Developer onboarding < 1 hour demonstrated (end-to-end walkthrough)
- [ ] Golden paths tested (at least 2 teams successfully onboarded)
- [ ] Backstage catalog populated with all existing services
- [ ] Documentation complete (developer guides, golden path docs, platform API docs)
- [ ] CI/CD pipeline tested and working
- [ ] Platform deployed to production cluster
- [ ] OPA/Kyverno policies deployed and validated

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
| Low adoption by developer teams | M | H | Developer interviews before building, golden paths (not golden cages), opt-in first, track adoption metrics, iterate based on feedback |
| Platform sprawl (too many tools, no coherent experience) | M | M | Clear platform vision document, consolidated developer portal (Backstage), sunset legacy tools with migration support |
| Kubernetes complexity overwhelming platform team | M | M | Start with managed K8s, use Crossplane to abstract infrastructure, invest in team K8s training, hire specialist if needed |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Self-service first (developers should never need to file a ticket for standard operations)
- Golden paths, not golden cages (recommend, don't mandate — unless security-critical)
- Backwards-compatible platform APIs (breaking changes require migration period)
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
- [x] Additional Platform Engineer (Go / Backstage / Crossplane)
- [x] Additional DevOps Engineer (Helm, ArgoCD, Terraform)
- [x] Kubernetes Specialist (cluster management, networking, security)
- [x] UX Specialist (developer portal experience, golden path usability)
- [x] Security Specialist (OPA/Kyverno policies, namespace isolation)
- [x] QA Engineer (integration tests, golden path validation)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (Go coverage + Jest coverage — HTML + lcov)
- [x] Golden path instantiation demo (video or screenshots of end-to-end flow)
- [x] Service provisioning timing (< 5 min demonstrated with timestamps)
- [x] Backstage catalog screenshot (populated with services)
- [x] OPA/Kyverno policy test results (all policies validated)
- [x] Helm chart lint results (all charts passing)
- [x] Developer onboarding walkthrough (documented, timed)
- [x] Platform adoption metrics dashboard (Grafana screenshot)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (platform topology, developer workflow, data flow)

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
- [x] Source code changes
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Platform Engineering Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Backstage + Crossplane + ArgoCD + Kubernetes internal developer platform engineering*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
