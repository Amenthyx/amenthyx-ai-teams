# Security Incident Response Protocol v1.0

## Amenthyx AI Teams — Shared Protocol

**Purpose**: Standardized procedure for handling security incidents discovered during team execution, including vulnerabilities found by DEPGUARD, dependency audits, code reviews, or external reports.

**Scope**: All 59 Amenthyx AI Teams. Applies whenever a security issue is identified at any phase of the sprint lifecycle.

---

## 1. Severity Classification

| Severity | Definition | Examples | Response Time | Resolution Target |
|----------|-----------|----------|---------------|-------------------|
| **Critical** | Active exploitation possible, data breach imminent, system compromise | RCE in production dependency, leaked secrets in repo, SQL injection in auth flow | **1 hour** | **4 hours** |
| **High** | Exploitable vulnerability with no evidence of active exploitation | Critical CVE in direct dependency, broken authentication logic, privilege escalation | **4 hours** | **24 hours** |
| **Medium** | Vulnerability requiring specific conditions to exploit | Medium CVE in transitive dependency, missing rate limiting, weak encryption config | **24 hours** | **Next sprint** |
| **Low** | Theoretical risk, best-practice deviation, informational | Outdated dependency (no known CVE), missing security headers (non-sensitive endpoint) | **Next sprint** | **Backlog** |

### Severity Decision Tree

```
1. Is there evidence of active exploitation or data breach?
   YES -> CRITICAL
   NO  -> Continue

2. Can the vulnerability be exploited remotely without authentication?
   YES -> CRITICAL
   NO  -> Continue

3. Does the vulnerability affect authentication, authorization, or sensitive data?
   YES -> HIGH
   NO  -> Continue

4. Does exploitation require specific conditions (network access, user interaction)?
   YES -> MEDIUM
   NO  -> LOW
```

---

## 2. Immediate Response Actions

### 2.1 Critical Severity

1. **STOP** all deployments immediately — no code ships until resolved
2. **Notify** Team Lead (TL), Project Manager (PM), and Security Lead within 15 minutes
3. **Isolate** affected systems (revoke compromised credentials, disable affected endpoints)
4. **Assign** dedicated incident owner from the active team
5. **Open** incident channel (dedicated thread/channel for real-time coordination)
6. **Begin** containment procedures (Section 4)
7. **Log** all actions with timestamps in the incident report

### 2.2 High Severity

1. **Pause** deployment pipeline — no releases until patch is verified
2. **Notify** TL and PM within 1 hour
3. **Assign** incident owner
4. **Begin** patching or mitigation within 2 hours
5. **Log** actions in incident report

### 2.3 Medium Severity

1. **Flag** in current sprint board as high-priority task
2. **Notify** TL at next standup (or async within 24 hours)
3. **Create** remediation ticket with deadline
4. **No deployment block** unless risk assessment warrants it

### 2.4 Low Severity

1. **Create** backlog ticket with security label
2. **Include** in next sprint planning for prioritization
3. **Document** in dependency audit log

---

## 3. Communication Chain

### Notification Order (Critical/High)

```
Step 1: Discovering Agent/Role -> Team Lead (TL)
Step 2: TL -> Project Manager (PM)
Step 3: PM -> Security Lead / DEPGUARD Agent
Step 4: Security Lead -> Affected stakeholders (ops, dependent teams)
Step 5: PM -> Executive summary to leadership (Critical only)
```

### Notification Content Template

```
SECURITY INCIDENT — [SEVERITY]
Team: [team name]
Discovered by: [agent/role]
Timestamp: [ISO 8601]
Summary: [one-line description]
Affected component: [service/module/dependency]
CVE (if applicable): [CVE-XXXX-XXXXX]
Current status: [Investigating / Containing / Patching / Resolved]
Immediate action needed: [yes/no — describe]
```

---

## 4. Containment Procedures

### 4.1 Stop Deployment

- Block all CI/CD pipelines for affected repositories
- Revert any in-progress deployments if the vulnerability is in shipped code
- Place a deployment freeze marker in the Kanban board

### 4.2 Revert

- If the vulnerability was introduced by a recent commit, revert immediately
- Use atomic revert (single commit revert) to maintain clean git history
- Tag the revert commit with `security-revert-[incident-id]`

### 4.3 Patch

- DEPGUARD agent runs dependency audit to identify fix versions
- CR agent reviews patch for correctness and no regressions
- Fast-track through QA with focused security test suite
- Deploy patch through expedited pipeline (skip non-essential gates)

### 4.4 Secret Rotation

If credentials or secrets are compromised:

1. Rotate ALL affected secrets immediately (not just the leaked ones)
2. Audit access logs for unauthorized usage during exposure window
3. Update secret references in all environments (dev, staging, prod)
4. Verify no secrets remain in git history (use `git filter-branch` or BFG if needed)

---

## 5. Timeline Expectations

| Phase | Critical | High | Medium | Low |
|-------|----------|------|--------|-----|
| Detection to acknowledgment | 15 min | 1 hr | 24 hr | Next sprint |
| Acknowledgment to containment | 30 min | 4 hr | — | — |
| Containment to patch deployed | 4 hr | 24 hr | Next sprint | Backlog |
| Patch to verification | 1 hr | 4 hr | 1 sprint | 2 sprints |
| Verification to post-mortem | 48 hr | 1 week | 2 weeks | — |

---

## 6. Post-Incident Review

Every Critical and High incident MUST have a post-incident review within the timelines above.

### Review Agenda

1. **Timeline reconstruction** — what happened, when, and in what order
2. **Root cause analysis** — use 5 Whys method (see POST_MORTEM_TEMPLATE.md)
3. **Detection gap analysis** — why wasn't this caught earlier?
4. **Response evaluation** — did we follow this protocol? Where did we deviate?
5. **Prevention measures** — what changes prevent recurrence?
6. **Tool/process updates** — does DEPGUARD need new rules? Do CI gates need updates?

### Review Outputs

- Updated incident report (finalized)
- Action items with owners and deadlines
- Updates to this protocol if gaps were found
- Updates to DEPGUARD rules or CI pipeline configuration
- Entry in Agent Memory for future team reference

---

## 7. Integration with DEPGUARD and CR Agents

### DEPGUARD Agent Responsibilities

- Continuous dependency scanning during sprint execution
- Automatic severity classification based on CVE database (NVD, GitHub Advisory)
- Trigger incident protocol when Critical or High CVE is detected
- Provide fix version recommendations and compatibility analysis
- Maintain dependency audit log

### CR (Code Review) Agent Responsibilities

- Flag security anti-patterns during code review (hardcoded secrets, injection vectors)
- Validate that security patches do not introduce regressions
- Expedited review for security-related PRs (priority queue)
- Cross-reference with known vulnerability patterns

### Automated Triggers

```
DEPGUARD detects CVE with CVSS >= 9.0  ->  Auto-trigger CRITICAL protocol
DEPGUARD detects CVE with CVSS >= 7.0  ->  Auto-trigger HIGH protocol
DEPGUARD detects CVE with CVSS >= 4.0  ->  Flag for TL review (MEDIUM candidate)
CR agent detects hardcoded secret       ->  Auto-trigger HIGH protocol
CR agent detects injection vulnerability ->  Auto-trigger HIGH protocol
```

---

## 8. Incident Report Template

```markdown
# Security Incident Report

## Metadata
- **Incident ID**: SEC-[YYYY]-[NNN]
- **Severity**: [Critical / High / Medium / Low]
- **Status**: [Open / Investigating / Containing / Patching / Resolved / Closed]
- **Team**: [team name]
- **Discovered by**: [agent/role name]
- **Discovery timestamp**: [ISO 8601]
- **Resolution timestamp**: [ISO 8601 or "pending"]

## Summary
[One paragraph describing the incident]

## Affected Components
- Repository: [repo name]
- Module/Service: [affected module]
- Dependency (if applicable): [package@version]
- CVE (if applicable): [CVE-XXXX-XXXXX]
- CVSS Score: [X.X]

## Timeline
| Timestamp | Event | Actor |
|-----------|-------|-------|
| [time] | Vulnerability discovered | [agent/role] |
| [time] | TL notified | [name] |
| [time] | Containment initiated | [name] |
| [time] | Patch developed | [name] |
| [time] | Patch deployed | [name] |
| [time] | Verification complete | [name] |

## Root Cause
[Description of the root cause]

## Containment Actions Taken
1. [Action 1]
2. [Action 2]

## Resolution
[Description of the fix applied]

## Prevention Measures
1. [Measure 1 — owner — deadline]
2. [Measure 2 — owner — deadline]

## Lessons Learned
[Key takeaways for future reference]
```

---

## 9. Example Scenarios

### Scenario A: Critical CVE in Production Dependency

> DEPGUARD detects CVE-2026-12345 (CVSS 9.8) in `lodash@4.17.20` during a fullStack team sprint. Remote code execution is possible.

1. DEPGUARD auto-triggers CRITICAL protocol
2. TL notified within 15 minutes, deployment pipeline frozen
3. DEPGUARD identifies fix: upgrade to `lodash@4.17.25`
4. Developer applies upgrade, CR agent fast-tracks review
5. QA runs focused regression + security tests
6. Patch deployed within 3 hours
7. Post-incident review scheduled within 48 hours

### Scenario B: Hardcoded API Key Found in Code Review

> CR agent flags a hardcoded third-party API key in a PR during a backendApi team sprint.

1. CR agent triggers HIGH protocol
2. PR is blocked, TL notified within 1 hour
3. API key rotated immediately via provider dashboard
4. Developer moves key to environment variable / secrets manager
5. Git history checked — key was only in the PR branch (not merged), no history cleanup needed
6. Updated PR passes CR review and proceeds

### Scenario C: Medium CVE in Transitive Dependency

> DEPGUARD finds CVE-2026-67890 (CVSS 5.5) in a transitive dependency of `axios`. Requires local network access to exploit.

1. DEPGUARD flags as MEDIUM candidate, TL reviews and confirms
2. Remediation ticket created in current sprint
3. Developer updates parent dependency to pull patched transitive version
4. Standard CR and QA process — no deployment block
5. Resolved within current sprint

---

## 10. Protocol Maintenance

- This protocol is reviewed quarterly or after every Critical incident
- Updates require sign-off from at least one TL and the Security Lead
- All teams are notified of protocol changes via shared channel
- Version history maintained at the top of this document

---

*Last updated: 2026-03-07 | Protocol version: 1.0*
