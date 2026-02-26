# Cybersecurity Team — Tailored Strategy v3.1

> Pre-configured for **penetration testing, security auditing, and compliance**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team security --strategy path/to/this-file.md`

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

**Primary Users**: [FILL IN — e.g., security engineers, SOC analysts, compliance officers]

**Secondary Users**: [FILL IN — e.g., DevOps teams, executive leadership, auditors]

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
- **Language**: Python 3.12+ / Go / Bash
- **Framework**: Custom security tooling / OWASP ZAP / Burp Suite / Metasploit (authorized engagements only)
- **Database**: PostgreSQL (findings database) / Elasticsearch (log aggregation and analysis)
- **Cache**: N/A
- **Message Queue**: N/A

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Azure (as dictated by target environment)
- **Deployment**: Docker containers (isolated testing) / Kali Linux VMs / dedicated lab environment
- **CDN**: N/A
- **Domain**: [FILL IN or "N/A"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| OWASP ZAP | Automated web app scanning | API key / local | N/A |
| Nmap / Masscan | Network discovery and enumeration | Local tooling | N/A |
| Splunk / ELK | SIEM and log analysis | API token / local | Per plan |
| Vulnerability DBs (NVD, CVE) | Vulnerability intelligence | API key | Rate-limited |

**Existing Codebase**: [FILL IN — Path to existing security tools/reports, or "greenfield"]

**Package Manager**: pip (Python) / apt (Kali tools) / go install (Go tools)

**Monorepo or Polyrepo**: Single repo (tools/ + reports/ + policies/ + playbooks/ + evidence/)

**Linting**:
- `ruff` — Python linting and formatting
- `shellcheck` — Bash script analysis
- `gosec` — Go security analysis
- `bandit` — Python security linting

---

## 5. Non-Functional Requirements

**Performance**:
- Scan completion time: < 2 hours for standard assessment scope
- Report generation: < 30 minutes after scan completion
- False negative rate target: 0% for CRITICAL/HIGH vulnerabilities
- Finding deduplication: Automated with < 5% duplicate rate

**Security**:
- Authentication: Air-gapped test environments, separate credentials per engagement
- Authorization: Credential rotation after every engagement, audit trail for all actions
- Data handling: All findings encrypted at rest, secure transmission of reports
- Compliance: [FILL IN — PCI-DSS / SOC 2 / ISO 27001 / NIST CSF / OWASP ASVS]
- Encryption: TLS everywhere, encrypted storage for all findings and evidence

**Scalability**:
- Expected launch scope: [FILL IN — number of targets, applications, networks]
- Expected 6-month scope: [FILL IN]
- Expected 1-year scope: [FILL IN]
- Scaling strategy: Parallel scanning agents, distributed architecture for large-scope assessments

**Availability**:
- Uptime target: 99.9% for SIEM/monitoring infrastructure
- Recovery time objective (RTO): < 1 hour for security monitoring tools
- Recovery point objective (RPO): < 5 minutes for log/event data
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- N/A (security tooling — CLI/API/report driven)

**Observability**:
- Logging: SIEM (Splunk / ELK Stack) — all scan activity, findings, remediation tracking
- Metrics: Vulnerability dashboards (open/closed/aging), compliance posture scores
- Tracing: Incident timeline reconstruction, attack path visualization
- Alerting: Critical finding alerts (immediate), compliance drift alerts, unauthorized access attempts

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% for custom Python/Go security tools; 100% OWASP test case coverage for web applications

**Required Test Types**:
- [x] Unit tests — pytest for custom security tooling
- [x] OWASP test cases — OWASP Testing Guide v4.x coverage
- [x] CIS Benchmarks — infrastructure hardening compliance
- [x] Compliance checklists — framework-specific (PCI-DSS / SOC 2 / ISO 27001)
- [x] Vulnerability scanning — SAST + DAST + SCA (dependency audit)
- [x] Network security tests — firewall rules, segmentation, encryption verification
- [x] Social engineering readiness — phishing simulation results (if in scope)
- [x] Security scanning — credential scanning, secret detection (truffleHog, gitleaks)
- [ ] Red team exercises — [FILL IN if adversarial simulation in scope]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ruff, shellcheck, gosec, bandit, secret detection)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated SAST on every PR
- [x] Dependency vulnerability scanning (Dependabot / Snyk)
- [x] Finding classification validation (CVSS scoring)

**Testing Tools**: pytest, OWASP ZAP, Nmap, Burp Suite, CIS-CAT, truffleHog, gitleaks, Snyk, act

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
- Infrastructure: [FILL IN — $/month for lab environments, VMs]
- Security tools: [FILL IN — $/month for commercial tool licenses]
- Compliance certifications: [FILL IN — one-time costs]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, security tool licenses, cloud lab provisioning, certification fees
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any production environment access cost

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Security tool licenses (Burp Pro, etc.) | [FILL IN] | Card | No — ask first |
| Cloud lab environments | [FILL IN] | Card / existing credits | No — ask first |
| Vulnerability intelligence feeds | [FILL IN] | Card / free tier | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Custom tooling code coverage >= 80%
- [ ] All findings classified with CVSS scores
- [ ] Zero CRITICAL/HIGH vulnerabilities unresolved in custom tooling
- [ ] OWASP test cases executed for all in-scope web applications
- [ ] CIS benchmarks evaluated for all in-scope infrastructure
- [ ] Compliance checklist completed for target framework
- [ ] Remediation recommendations documented for all findings
- [ ] Executive summary report generated
- [ ] Technical findings report generated with reproduction steps
- [ ] All evidence artifacts collected and secured
- [ ] Documentation complete (README, runbooks, methodology docs)
- [ ] CI/CD pipeline tested and working
- [ ] Final report delivered to stakeholders

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

**Technical References**: [FILL IN — e.g., OWASP Testing Guide, NIST CSF, CIS Benchmarks, PTES]

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
| Scope creep in testing (testing expands beyond authorized targets) | M | M | Documented scope agreement, IP/domain whitelists, regular scope review with stakeholders |
| False positives overwhelming triage (noise drowns real findings) | M | M | Tuned scanning profiles, manual verification of HIGH+ findings, deduplication logic, severity-based prioritization |
| Zero-day discovery during testing (undisclosed vulnerability found) | L | H | Responsible disclosure process, immediate escalation to TL + user, documented handling procedure |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Hard Constraints** (non-negotiable):
- Authorized testing only — documented scope and written authorization required
- All findings classified using CVSS scoring framework
- No testing outside defined scope boundaries
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
- A single assessment domain has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking issues requiring parallel investigation
- The strategy explicitly requests parallel assessment streams (web + network + cloud)

**Agent types the PM may add**:
- [ ] Additional Security Engineers (for large-scope assessments)
- [ ] Web Application Security Specialist (for deep web app testing)
- [ ] Network Security Specialist (for infrastructure and network testing)
- [ ] Cloud Security Specialist (for AWS/GCP/Azure-specific assessment)
- [ ] Mobile Security Specialist (for mobile app testing)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Vulnerability scan reports (OWASP ZAP, Nmap, custom tools)
- [x] CVSS-scored findings with reproduction steps
- [x] CIS benchmark compliance scores
- [x] Compliance checklist status (framework-specific)
- [x] Network architecture security analysis
- [x] SIEM dashboard screenshots (log coverage, alert configuration)
- [x] Secret detection scan results (truffleHog / gitleaks)
- [x] Executive summary report
- [x] Technical findings report with remediation recommendations
- [x] CI/CD pipeline passing (act + remote)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, findings, scan results, log entries, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might test outside authorized scope, disrupt production systems, expose sensitive findings, cost money, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.

**Auto-sync frequency**: Every agent completion

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `team/security/execution`
- Merge to main: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (security tools, scripts, policies)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: target environment details, previous assessment results, regulatory requirements, stakeholder contacts, engagement rules, communication channels, etc.]

---

*Cybersecurity Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for penetration testing, security auditing, and compliance*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
