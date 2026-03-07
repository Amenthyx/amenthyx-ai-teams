# Team Graduation Protocol v1.0

## Amenthyx AI Teams — Shared Protocol

**Purpose**: Formal handoff procedure when an Amenthyx AI Team completes its mission and transfers ownership of deliverables to operations, maintenance, or a successor team.

**Scope**: All 59 Amenthyx AI Teams. Graduation is mandatory before a team is deactivated.

---

## 1. Graduation Criteria Checklist

All items must be satisfied before graduation can proceed. The TL is responsible for verifying each item.

### 1.1 Delivery Gates

- [ ] All sprint goals marked DONE on Kanban board
- [ ] All CI/CD pipelines passing (green builds on main branch)
- [ ] All Critical and High defects resolved
- [ ] Medium/Low defects documented in known-issues backlog with severity labels
- [ ] Final deployment completed successfully to target environment

### 1.2 Quality Gates

- [ ] QA sign-off received (all test suites passing)
- [ ] Test coverage meets or exceeds target defined in strategy
- [ ] DEPGUARD security audit clean (no unresolved Critical/High CVEs)
- [ ] Performance benchmarks met (if applicable)
- [ ] Accessibility standards met (if applicable)

### 1.3 Documentation Gates

- [ ] Architecture documentation complete and current
- [ ] API documentation complete (endpoints, schemas, auth)
- [ ] Deployment guide written and verified by a non-team member
- [ ] Runbook created (see Section 5)
- [ ] `.ai/context_base.md` updated with final project state
- [ ] RETRO agent report finalized
- [ ] Post-mortem completed (see POST_MORTEM_TEMPLATE.md)

### 1.4 Operational Readiness Gates

- [ ] Monitoring and alerting configured
- [ ] Logging in place and verified
- [ ] Backup and recovery procedures documented and tested
- [ ] Escalation contacts defined
- [ ] SLA definitions documented

---

## 2. Knowledge Transfer Sessions

Knowledge transfer (KT) is conducted in structured sessions before the team is deactivated.

### 2.1 Session Schedule

| Session | Duration | Audience | Content |
|---------|----------|----------|---------|
| **Architecture Walkthrough** | 60–90 min | Ops team, successor team | System design, component interactions, data flows, infrastructure |
| **Known Issues Briefing** | 30–45 min | Ops team | Open defects, workarounds, technical debt, risk areas |
| **Operational Procedures** | 45–60 min | Ops team | Deployment, rollback, scaling, monitoring, incident response |
| **Codebase Tour** | 60 min | Successor team (if any) | Repo structure, key modules, patterns, gotchas |

### 2.2 Session Requirements

- All sessions must be documented (notes stored in `.ai/` folder)
- Architecture walkthrough must include diagrams (exported as images or Mermaid)
- Known issues must reference specific tickets or backlog items
- Ops procedures must be demonstrated live, not just described
- Q&A time allocated at the end of each session (minimum 15 minutes)

### 2.3 Session Artifacts

Each session produces:
- Session notes (markdown)
- Updated documentation (if gaps found during KT)
- Action items for any unresolved questions

---

## 3. Handoff Artifacts

The following artifacts must be delivered to the receiving team/ops before graduation.

### 3.1 Artifact Checklist

| Artifact | Owner | Location | Status |
|----------|-------|----------|--------|
| Deployment Guide | TL / DevOps | `docs/deployment.md` | |
| Runbook | TL / Ops | `docs/runbook.md` | |
| Architecture Docs | Architect | `.ai/context_base.md` + `docs/architecture.md` | |
| API Documentation | Backend Lead | `docs/api.md` or OpenAPI spec | |
| Monitoring Setup | DevOps | `docs/monitoring.md` | |
| Escalation Contacts | PM | `docs/escalation.md` | |
| SLA Definitions | PM / TL | `docs/sla.md` | |
| Known Issues Backlog | QA | Issue tracker (labeled) | |
| Evidence Manifest | PM | `.ai/evidence/` | |
| RETRO Report | RETRO Agent | `.ai/retro-report.md` | |
| Post-Mortem | PM / TL | `.ai/post-mortem.md` | |
| PPTX/PDF Final Report | PM | `.ai/reports/` | |

---

## 4. Escalation Contacts Document

Provide a clear escalation matrix for the receiving team.

```markdown
# Escalation Contacts

| Level | Condition | Contact | Response Time |
|-------|-----------|---------|---------------|
| L1 | General questions, minor issues | [Ops on-call] | 4 hours |
| L2 | Service degradation, non-critical bugs | [Senior Ops / Successor TL] | 2 hours |
| L3 | Service outage, data issues | [Original TL — during support window] | 1 hour |
| L4 | Security incident | [Security Lead] | Per SECURITY_INCIDENT_RESPONSE_PROTOCOL.md |
```

---

## 5. Runbook Template

Every graduated project must include a runbook. Use the following structure.

```markdown
# Runbook: [Service/Project Name]

## Service Overview
- **Description**: [What the service does]
- **Tech Stack**: [Languages, frameworks, databases, infrastructure]
- **Repository**: [URL]
- **Environments**: [dev, staging, prod — with URLs]
- **Dependencies**: [External services, APIs, databases]

## Health Checks
- **Endpoint**: [health check URL]
- **Expected Response**: [200 OK, specific body]
- **Monitoring Dashboard**: [URL]
- **Alert Channels**: [where alerts are sent]

## Common Operations
### Deploying a New Version
1. [Step-by-step deployment instructions]
2. [Verification steps after deployment]

### Rolling Back
1. [Step-by-step rollback instructions]
2. [How to verify rollback was successful]

### Scaling
- **Horizontal**: [how to add/remove instances]
- **Vertical**: [resource adjustment procedure]

## Common Issues and Recovery

### Issue: [Issue Title]
- **Symptoms**: [What you will observe]
- **Cause**: [Why this happens]
- **Resolution**:
  1. [Step 1]
  2. [Step 2]
- **Prevention**: [How to prevent recurrence]

### Issue: [Issue Title]
- **Symptoms**: [What you will observe]
- **Cause**: [Why this happens]
- **Resolution**:
  1. [Step 1]
  2. [Step 2]
- **Prevention**: [How to prevent recurrence]

## Database Operations
- **Backup Schedule**: [frequency and retention]
- **Manual Backup**: [command or procedure]
- **Restore Procedure**: [step-by-step]
- **Migration Procedure**: [how to run migrations]

## Log Access
- **Application Logs**: [location or command]
- **Error Logs**: [location or command]
- **Access Logs**: [location or command]
- **Log Retention**: [policy]
```

---

## 6. Access Transfer

All access rights must be formally transferred from the graduating team to the receiving team.

### 6.1 Access Transfer Checklist

| Access Type | Details | Transferred To | Date | Verified |
|-------------|---------|---------------|------|----------|
| **Repository access** | [repo URLs, permissions] | [receiving team] | | [ ] |
| **CI/CD pipelines** | [pipeline names, admin access] | [receiving team] | | [ ] |
| **Monitoring dashboards** | [dashboard URLs, edit access] | [receiving team] | | [ ] |
| **Secrets/credentials** | [vault paths, env vars] | [receiving team] | | [ ] |
| **Cloud infrastructure** | [AWS/GCP/Azure accounts, IAM] | [receiving team] | | [ ] |
| **Third-party services** | [API accounts, admin panels] | [receiving team] | | [ ] |
| **Documentation platforms** | [wiki, Confluence, Notion] | [receiving team] | | [ ] |

### 6.2 Access Transfer Rules

- No shared credentials — each team member gets individual access
- Graduating team access is revoked after the 30-day support window closes
- Secrets are rotated if any team member's access is revoked unexpectedly
- Transfer is verified by the receiving team (they must confirm they can access everything)

---

## 7. 30-Day Support Window

After graduation, the originating team remains available for a 30-day support window.

### 7.1 Support Window Rules

| Aspect | Details |
|--------|---------|
| **Duration** | 30 calendar days from graduation sign-off date |
| **Availability** | Best-effort, async response within 24 hours |
| **Scope** | Clarification questions, undocumented edge cases, critical production issues |
| **Out of scope** | New feature development, non-critical enhancements |
| **Escalation** | If the graduating team cannot resolve, escalate per Section 4 |
| **Extension** | Support window may be extended by 15 days with PM approval if critical gaps exist |

### 7.2 Support Window Tracking

- All questions and answers logged in a shared document
- Recurring questions indicate documentation gaps — update docs immediately
- At window close, PM reviews the log and updates documentation with any new information

---

## 8. Graduation Sign-Off

Graduation requires formal sign-off from all listed roles. No sign-off, no graduation.

### Sign-Off Sheet

```markdown
# Graduation Sign-Off: [Project Name]

| Role | Name/Agent | Checklist Verified | KT Complete | Artifacts Delivered | Access Transferred | Sign-Off | Date |
|------|-----------|-------------------|-------------|--------------------|--------------------|----------|------|
| Team Lead (TL) | | [ ] | [ ] | [ ] | [ ] | APPROVED / BLOCKED | |
| Project Manager (PM) | | [ ] | [ ] | [ ] | [ ] | APPROVED / BLOCKED | |
| QA Lead | | [ ] | [ ] | [ ] | [ ] | APPROVED / BLOCKED | |
| Ops Lead (Receiving) | | [ ] | [ ] | [ ] | [ ] | APPROVED / BLOCKED | |
```

### Blocking Conditions

Graduation is **BLOCKED** if any of the following are true:

- Any Critical or High defect remains unresolved
- Any documentation gate is incomplete
- Any access transfer is unverified
- QA has not signed off
- Ops lead has not confirmed operational readiness
- Post-mortem has not been completed

### Unblocking Process

1. Identify the blocking condition
2. Assign owner and deadline for resolution
3. TL and PM agree on remediation plan
4. Once resolved, re-run the sign-off process for the affected section only

---

## 9. Integration with Agent Memory

Graduation includes transferring key learnings to Agent Memory so future teams benefit.

### 9.1 What Gets Transferred

- Patterns that worked well (from post-mortem Section 9)
- Anti-patterns to avoid (from post-mortem Section 6)
- Domain-specific technical decisions and rationale
- Tooling configurations that required non-obvious setup
- Performance tuning findings
- Security findings and mitigations applied

### 9.2 Transfer Format

```markdown
## Learning: [Title]
- **Team**: [originating team]
- **Project**: [project name]
- **Category**: [Process / Technical / Communication / Tooling]
- **Summary**: [2-3 sentences]
- **Evidence**: [link to artifact]
- **Recommendation**: [what future teams should do]
```

### 9.3 Transfer Process

1. RETRO agent compiles learnings from post-mortem
2. TL reviews and approves for transfer
3. Learnings are added to the shared Agent Memory store
4. Future teams can query these learnings during their planning phase

---

## 10. Protocol Maintenance

- This protocol is reviewed after every 5 graduations or quarterly, whichever comes first
- Feedback from receiving teams is incorporated into updates
- Updates require sign-off from at least one TL and one Ops Lead
- Version history maintained at the top of this document

---

*Last updated: 2026-03-07 | Protocol version: 1.0*
