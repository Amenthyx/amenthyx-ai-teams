# Infrastructure & Cloud Team — Tailored Strategy v3.1

> Pre-configured for **cloud infrastructure (AWS/GCP/Azure), networking, and Infrastructure as Code**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team infraCloud --strategy path/to/this-file.md`

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

**Primary Users**: [FILL IN — e.g., platform engineers, SREs, DevOps teams]

**Secondary Users**: [FILL IN — e.g., application developers, security teams, finance/FinOps]

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
- **Language**: HCL (Terraform) / Python 3.12+ / TypeScript (AWS CDK / Pulumi)
- **Framework**: Terraform 1.7+ / Pulumi / AWS CDK
- **Database**: RDS PostgreSQL / DynamoDB / Cloud SQL (as needed by infrastructure)
- **Cache**: ElastiCache (Redis/Memcached) / Memorystore
- **Message Queue**: SQS / Pub/Sub / EventBridge

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Azure (as dictated by project requirements)
- **Deployment**: Terraform apply / Pulumi up / CloudFormation
- **CDN**: CloudFront / Cloud CDN / Azure CDN
- **Domain**: [FILL IN or "TBD"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| AWS / GCP / Azure APIs | Infrastructure provisioning | IAM / OIDC federation | Per service |
| Terraform Cloud / Spacelift | State management + remote execution | API token / OIDC | Per plan |
| Container Registry (ECR/GCR/ACR) | Image storage | IAM / service account | Per plan |
| DNS (Route53 / Cloud DNS) | Domain management | IAM | Per service |

**Existing Codebase**: [FILL IN — Path to existing IaC code, or "greenfield"]

**Package Manager**: terraform init (providers + modules) / pip (Python scripts) / npm (CDK/Pulumi)

**Monorepo or Polyrepo**: Monorepo per environment (dev/staging/prod modules with shared modules)

**Linting**:
- `tflint` — Terraform linting and best practices
- `tfsec` — Terraform security analysis
- `checkov` — IaC security and compliance scanning
- `trivy` — Container and IaC vulnerability scanning

---

## 5. Non-Functional Requirements

**Performance**:
- Infrastructure provisioning: < 15 minutes for full environment
- Auto-scaling response time: < 2 minutes from trigger to new capacity
- Network latency (intra-region): < 5ms
- DNS propagation: < 60 seconds (within managed zones)

**Security**:
- Authentication: IAM least-privilege policies + OIDC federation (no long-lived keys)
- Authorization: VPC isolation (public/private subnets), Security Groups, NACLs, service control policies
- WAF: AWS WAF / Cloud Armor rules for public-facing resources
- Detection: GuardDuty / Security Hub / Cloud Security Command Center
- Encryption: At rest (KMS/CMEK) + in transit (TLS 1.2+) for all services
- Compliance: [FILL IN — SOC 2 / GDPR / HIPAA / PCI-DSS / FedRAMP / none]

**Scalability**:
- Expected launch resources: [FILL IN]
- Expected 6-month scale: [FILL IN]
- Expected 1-year scale: [FILL IN]
- Scaling strategy: Auto-scaling groups / managed scaling (Fargate, Cloud Run) / horizontal pod autoscaler

**Availability**:
- Uptime target: 99.9% (99.99% for critical services)
- Recovery time objective (RTO): < 1 hour
- Recovery point objective (RPO): < 5 minutes
- Multi-region: [FILL IN — active-active / active-passive / single region / future]

**Accessibility**:
- N/A (infrastructure layer — no user-facing UI)

**Observability**:
- Logging: CloudWatch Logs / Cloud Logging / structured JSON, VPC Flow Logs
- Metrics: Prometheus + Grafana / CloudWatch Metrics / Cloud Monitoring
- Tracing: CloudTrail / Audit Log / VPC Flow Logs for network tracing
- Alerting: PagerDuty / Opsgenie — resource thresholds, cost anomalies, security events

---

## 6. Testing Requirements

**Test Coverage Target**: 100% of IaC modules covered by Terratest; 100% linting pass for all HCL/YAML

**Required Test Types**:
- [x] Unit tests — Terratest for individual modules
- [x] Integration tests — Terratest for multi-module stacks (full environment)
- [x] Compliance tests — checkov / OPA / Conftest for policy-as-code
- [x] Security scanning — tfsec, checkov, trivy (IaC + container images)
- [x] Drift detection — terraform plan in CI to detect state drift
- [x] Cost estimation — Infracost for infrastructure cost forecasting
- [x] LocalStack tests — AWS service emulation for local development
- [ ] Chaos engineering — [FILL IN if resilience testing needed]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (terraform fmt, tflint, tfsec, checkov)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Terraform plan output as PR comment (Atlantis-style)
- [x] Manual approval gate for production terraform apply
- [x] Cost estimation diff on every PR (Infracost)

**Testing Tools**: Terratest, LocalStack, checkov, OPA/Conftest, tfsec, trivy, Infracost, act

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
- Domains/SSL: [FILL IN — $ or "already owned"]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, cloud resource provisioning, reserved instances, domain purchases, API subscriptions
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any production infrastructure cost, any reserved/committed-use purchase

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Cloud compute (EC2/GCE/VMs) | [FILL IN] | Card / existing credits | No — ask first |
| Managed databases (RDS/Cloud SQL) | [FILL IN] | Card / existing credits | No — ask first |
| Load balancers / networking | [FILL IN] | Card / existing credits | No — ask first |
| Monitoring SaaS | [FILL IN] | Card / free tier | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown + Infracost estimates

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] All IaC modules pass Terratest
- [ ] Zero CRITICAL/HIGH vulnerabilities in tfsec/checkov scans
- [ ] All resources properly tagged (environment, owner, cost-center, project)
- [ ] Cost alerts configured for all environments
- [ ] VPC isolation verified (security groups, NACLs)
- [ ] IAM policies follow least-privilege principle
- [ ] Encryption at rest and in transit for all data stores
- [ ] Auto-scaling tested and verified
- [ ] Disaster recovery / failover procedure tested
- [ ] Terraform state secured (encrypted, versioned, locked)
- [ ] Documentation complete (README, architecture diagrams, runbooks)
- [ ] CI/CD pipeline tested and working
- [ ] Production provisioning succeeds

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

**Technical References**: [FILL IN — e.g., AWS Well-Architected Framework, Terraform module registry]

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
| Cloud cost overrun (unexpected resource usage or scaling) | M | H | Infracost estimation in CI, billing alerts at 50%/80%/100% thresholds, reserved instances evaluation, regular cost reviews |
| Region outage affecting availability | L | H | Multi-AZ deployments, cross-region backups, documented failover procedures, health checks |
| Terraform state drift (manual changes outside IaC) | M | M | Drift detection in CI (scheduled plan), enforce IaC-only policy, CloudTrail/audit log monitoring |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Hard Constraints** (non-negotiable):
- Infrastructure as Code only — zero manual changes (no ClickOps)
- All resources must be tagged (environment, owner, cost-center, project)
- Cost alerts configured before any production resources
- Conventional commits enforced on all repositories
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
- A single infrastructure component has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking infrastructure issues requiring parallel fix agents
- The strategy explicitly requests multi-cloud or multi-region parallel streams

**Agent types the PM may add**:
- [ ] Additional Infrastructure Engineers (for multi-environment provisioning)
- [ ] Additional DevOps Engineers (for CI/CD pipeline work)
- [ ] Networking Specialist (for VPC design, peering, transit gateways)
- [ ] Security Specialist (for IAM policies, WAF rules, compliance)
- [ ] Database Specialist (for RDS/Cloud SQL configuration, replication)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Terraform plan output showing expected infrastructure changes
- [x] Terraform apply output confirming successful provisioning
- [x] Terratest results for all IaC modules
- [x] checkov / tfsec security scan reports (zero CRITICAL/HIGH)
- [x] Infracost output showing estimated monthly cost
- [x] Resource tagging compliance report
- [x] Network architecture diagram (VPC, subnets, security groups)
- [x] IAM policy review (least-privilege verification)
- [x] Auto-scaling test results (load simulation)
- [x] Disaster recovery / failover test results

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, state files, infrastructure configs, log entries, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might destroy infrastructure, corrupt state, cost money, affect production environments, open security holes, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.

**Auto-sync frequency**: Every agent completion

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `ai-team` (MANDATORY — all teams use this branch)
- Merge to main: ONLY after Team Leader receives explicit user approval (hard gate)

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (IaC modules, network configs, policies)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: existing cloud accounts, organizational policies, networking requirements, compliance mandates, cost allocation tags, migration context, etc.]

---

*Infrastructure & Cloud Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for cloud infrastructure (AWS/GCP/Azure), networking, and IaC*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
