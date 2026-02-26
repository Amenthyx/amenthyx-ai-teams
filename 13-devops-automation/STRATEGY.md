# DevOps & Automation Team — Tailored Strategy v3.1

> Pre-configured for **CI/CD pipelines, automation, and infrastructure as code**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team devops --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]

**One-Line Vision**: [FILL IN]

**Problem Statement**: [FILL IN]

**Desired Outcome**: [FILL IN]

**Project Type**: [FILL IN — Greenfield / Extending existing codebase / Migration / Rewrite / Prototype / MVP / Production]

**Repository**: [FILL IN — GitHub URL or desired repo name]

---

## 2. Target Audience

**Primary Users**: [FILL IN — e.g., DevOps engineers, SREs, platform teams]

**Secondary Users**: [FILL IN — e.g., developers consuming pipelines, ops managers]

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [FILL IN] |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: YAML / Python 3.12+ / Bash / HCL (Terraform)
- **Framework**: GitHub Actions / GitLab CI / Jenkins / Ansible
- **Database**: N/A (infrastructure — state stored in Terraform Cloud / S3 backend)
- **Cache**: N/A
- **Message Queue**: N/A

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Azure (as dictated by project requirements)
- **Deployment**: Terraform / Pulumi / Ansible + Docker + Kubernetes
- **CDN**: N/A (infrastructure layer)
- **Domain**: [FILL IN or "N/A"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub / GitLab | Source control + CI/CD triggers | OAuth / Deploy Keys / OIDC | Per plan |
| Terraform Cloud | State management + remote execution | API token / OIDC | Per plan |
| Docker Hub / ECR / GCR | Container registry | Service account / IAM | Per plan |
| HashiCorp Vault / AWS Secrets Manager | Secrets management | AppRole / IAM / OIDC | Per plan |

**Existing Codebase**: [FILL IN — Path to existing IaC code, or "greenfield"]

**Package Manager**: pip (Python) / brew (macOS tools) / apt (Linux tools) / terraform init (providers)

**Monorepo or Polyrepo**: Monorepo (IaC modules + pipeline configurations + automation scripts)

**Linting**:
- `yamllint` — YAML syntax and style
- `shellcheck` — Bash script analysis
- `tflint` — Terraform linting and best practices
- `actionlint` — GitHub Actions workflow validation

---

## 5. Non-Functional Requirements

**Performance**:
- Deployment pipeline end-to-end: < 10 minutes
- Rollback execution: < 5 minutes
- Mean time to recovery (MTTR): < 30 minutes
- CI pipeline (build + test + lint): < 15 minutes

**Security**:
- Authentication: IAM least-privilege roles + OIDC federation (no long-lived credentials)
- Authorization: Role-based access to environments (dev/staging/prod), branch protection rules
- Secrets Management: HashiCorp Vault / AWS Secrets Manager / GCP Secret Manager — no secrets in code or CI variables
- Encryption: TLS everywhere, encrypted state files, encrypted secrets at rest
- Compliance: [FILL IN — SOC 2 / GDPR / HIPAA / PCI-DSS / none]

**Scalability**:
- Expected launch pipelines: [FILL IN]
- Expected 6-month pipeline count: [FILL IN]
- Expected 1-year pipeline count: [FILL IN]
- Scaling strategy: Horizontal (self-hosted runners / node pools) + auto-scaling runner groups

**Availability**:
- Uptime target: 99.9% for CI/CD infrastructure
- Recovery time objective (RTO): < 1 hour
- Recovery point objective (RPO): < 5 minutes (state files versioned)
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- N/A (infrastructure tooling — CLI/API driven)

**Observability**:
- Logging: Structured JSON logs — CloudWatch Logs / Datadog Logs / ELK Stack
- Metrics: Prometheus + Grafana (pipeline duration, success rate, resource utilization)
- Tracing: Distributed tracing for multi-stage deployments (Jaeger / Datadog APM)
- Alerting: PagerDuty / Opsgenie — pipeline failures, deployment drift, resource thresholds

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% for Python automation scripts; 100% linting pass for YAML/HCL/Bash

**Required Test Types**:
- [x] Unit tests — pytest for Python automation scripts
- [x] Integration tests — Terratest (Go) for IaC module validation
- [x] Infrastructure compliance tests — InSpec / OPA / Conftest
- [x] Shell script tests — bats-core for Bash scripts
- [x] Pipeline tests — `act` for GitHub Actions local execution
- [x] Security scanning — tfsec / checkov / trivy for IaC and container images
- [x] Idempotency tests — terraform plan shows no drift after apply
- [ ] Load tests — [FILL IN if pipeline concurrency testing needed]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (yamllint, shellcheck, tflint, terraform fmt, actionlint)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated deployment to staging on merge to develop
- [x] Manual approval gate for production deployment
- [x] Terraform plan output as PR comment

**Testing Tools**: pytest, Terratest, InSpec, bats-core, act, tfsec, checkov, trivy, OPA/Conftest

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN]

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M4 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Budget Constraints**:
- Infrastructure: [FILL IN — $/month or "minimize"]
- Third-party APIs: [FILL IN — $/month or "free tier only"]
- CI/CD runners: [FILL IN — self-hosted / GitHub-hosted / hybrid]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, cloud resource provisioning, domain purchases, API subscriptions, CI/CD runner costs
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any production infrastructure cost

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Cloud infrastructure | [FILL IN] | Card / existing credits | No — ask first |
| CI/CD runner costs | [FILL IN] | Card / free tier | No — ask first |
| Monitoring/alerting SaaS | [FILL IN] | Card / free tier | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Python automation scripts coverage >= 80%
- [ ] All YAML/HCL/Bash passes linting (yamllint, tflint, shellcheck, actionlint)
- [ ] Zero CRITICAL/HIGH vulnerabilities in tfsec/checkov scans
- [ ] Terratest passes for all IaC modules
- [ ] InSpec compliance profiles pass
- [ ] bats-core tests pass for all shell scripts
- [ ] Pipeline tested locally with `act`
- [ ] Terraform plan/apply idempotent (no drift)
- [ ] Rollback procedure tested and documented
- [ ] Secrets management verified (no hardcoded credentials)
- [ ] Documentation complete (README, runbooks, architecture diagrams)
- [ ] CI/CD pipeline tested and working
- [ ] Deployment to production succeeds

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Design Inspiration**: [FILL IN]

**Technical References**: [FILL IN — e.g., Terraform best practices docs, GitHub Actions docs]

**Internal Documentation**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. [FILL IN]
2. [FILL IN]
3. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]
2. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Terraform state file corruption or lock contention | L | H | Use remote state with locking (S3 + DynamoDB / Terraform Cloud), enable state versioning, backup state before destructive operations |
| Secret sprawl across environments and pipelines | M | H | Centralize in Vault/AWS SM, enforce OIDC federation, rotate credentials automatically, audit access logs |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Hard Constraints** (non-negotiable):
- Infrastructure as Code only — zero manual infrastructure changes (ClickOps forbidden)
- All pipelines must be idempotent — safe to re-run without side effects
- Conventional commits enforced on all repositories
- No long-lived credentials — OIDC or short-lived tokens only
- All changes via Pull Request with CI checks passing

**Soft Constraints** (preferred but negotiable):
- [FILL IN]
- [FILL IN]

---

## 11.1 Dynamic Agent Scaling

> The PM may spawn additional agents beyond the default roster if the workload requires it.

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 15

**Scaling triggers** (PM spawns extra agents when):
- A single IaC module or pipeline has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking infrastructure issues requiring parallel fix agents
- The strategy explicitly requests parallel streams (e.g., multi-cloud)

**Agent types the PM may add**:
- [ ] Additional DevOps Engineers (for pipeline-heavy projects)
- [ ] Additional Infrastructure Engineers (for multi-environment provisioning)
- [ ] Kubernetes Specialist (for complex cluster configurations)
- [ ] Security Specialist (for IAM policies, secrets architecture, compliance)
- [ ] Monitoring Specialist (for observability stack setup)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Terraform plan output showing expected changes
- [x] Terraform apply output confirming successful provisioning
- [x] Terratest results (Go test output)
- [x] InSpec compliance scan reports
- [x] tfsec / checkov security scan reports (zero CRITICAL/HIGH)
- [x] Pipeline execution logs (GitHub Actions / GitLab CI)
- [x] `act` local pipeline test results
- [x] bats-core shell script test results
- [x] Rollback verification logs
- [x] Secrets audit report (no hardcoded credentials)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, state files, pipeline configs, log entries, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might delete infrastructure, corrupt state files, cost money, affect production environments, expose secrets, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.

**Auto-sync frequency**: Every agent completion

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `team/devops/execution`
- Merge to main: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (IaC modules, pipeline configs, automation scripts)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: organizational context, existing infrastructure state, migration considerations, team culture, communication preferences, timezone constraints, etc.]

---

*DevOps & Automation Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for CI/CD pipelines, automation, and infrastructure as code*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
