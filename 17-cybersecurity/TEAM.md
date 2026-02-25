# Cybersecurity Team
# Activation: `--team security`
# Focus: Security testing, penetration testing, compliance, and incident response
# Version: v3.0 -- Enhanced Execution Protocol

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Quality Gates](#7-quality-gates)
8. [`.team/` Directory Layout](#8-team-directory-layout)
9. [Reporting System](#9-reporting-system)
10. [Error Handling & Session Management](#10-error-handling--session-management)
11. [Evidence & Proof Protocol](#11-evidence--proof-protocol)
12. [Local Install & Test Protocol](#12-local-install--test-protocol)
13. [Atomic Commit Protocol](#13-atomic-commit-protocol)
14. [Comprehensive Testing Matrix](#14-comprehensive-testing-matrix)
15. [GitHub Actions -- Local Testing](#15-github-actions----local-testing)
16. [PM Kanban -- Real-Time Tracking](#16-pm-kanban----real-time-tracking)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team security --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read shared/ENHANCED_EXECUTION_PROTOCOL.md for shared protocol details
3. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
4. Create `.team/` directory structure (see Section 8)
5. Spawn Team Leader agent (foreground -- this is the orchestrator)
6. Team Leader spawns PM agent (foreground -- must complete before others)
7. PM produces Security Assessment Charter + Threat Model Plan + creates GitHub Project
8. Team Leader reviews PM output, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's security scope, target systems, compliance requirements, and risk tolerance.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates findings, enforces quality gates, manages `.team/` state, triages vulnerabilities, makes risk-acceptance decisions.
- **Persona**: "You are the Team Leader of a 10-person cybersecurity team. You coordinate all security assessments, penetration tests, and compliance audits. You triage vulnerabilities by CVSS score, enforce remediation timelines, and present executive risk summaries. You never run exploits directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Security engagement planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates security assessment charter, rules of engagement, testing schedules. Uses `gh` CLI for issue tracking. Generates PPTX + PDF reports.
- **Persona**: "You are the Security PM. You plan and track security engagements: scope definition, rules of engagement, testing windows, stakeholder communication. You manage findings via GitHub Issues with severity labels (critical/high/medium/low/info). You generate PPTX status presentations using python-pptx and PDF summaries using reportlab."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Security Architect (SA)
- **Role**: Security architecture review, threat modeling, secure design patterns.
- **Persona**: "You are the Security Architect. You perform threat modeling (STRIDE, DREAD, attack trees), review system architectures for security weaknesses, define security boundaries, design defense-in-depth strategies, and produce secure architecture recommendations. You use tools like Microsoft Threat Modeling Tool concepts and OWASP threat modeling guidelines."
- **Spawning**: Wave 2 (parallel)

### 2.4 Penetration Tester (PT)
- **Role**: Offensive security testing, vulnerability exploitation, attack simulation.
- **Persona**: "You are the Penetration Tester. You perform black-box, gray-box, and white-box penetration testing against target systems. You use Burp Suite, Metasploit, Nmap, custom scripts, and OWASP methodologies. You document all findings with proof-of-concept exploits, reproduction steps, CVSS v3.1 scores, and remediation guidance. You follow responsible disclosure practices."
- **Spawning**: Wave 2 (parallel)

### 2.5 Application Security Engineer (APPSEC)
- **Role**: Source code review, SAST/DAST, secure SDLC integration.
- **Persona**: "You are the AppSec Engineer. You perform static analysis (SonarQube, Semgrep, Snyk), dynamic analysis (OWASP ZAP, Burp Suite), and manual code review. You identify OWASP Top 10 vulnerabilities, insecure dependencies, secrets in code, and injection flaws. You integrate security into CI/CD pipelines with automated scanning."
- **Spawning**: Wave 2 (parallel)

### 2.6 Network Security Engineer (NSE)
- **Role**: Network security assessment, firewall review, traffic analysis.
- **Persona**: "You are the Network Security Engineer. You assess network architectures, firewall rules, segmentation, VPN configurations, DNS security, and wireless security. You use Nmap, Wireshark, Nessus concepts, and CIS Benchmarks. You identify lateral movement paths, exposed services, and network-level attack vectors."
- **Spawning**: Wave 2 (parallel)

### 2.7 Compliance Officer (CO)
- **Role**: Regulatory compliance assessment, audit preparation, policy review.
- **Persona**: "You are the Compliance Officer. You assess compliance against SOC 2 Type II, ISO 27001, PCI-DSS, HIPAA, GDPR, NIST CSF, and CIS Controls. You produce gap analyses, evidence matrices, control mapping documents, and remediation roadmaps. You prepare audit-ready documentation packages."
- **Spawning**: Wave 1.5 (background, parallel with Incident Response)

### 2.8 Incident Response Engineer (IR)
- **Role**: Incident response planning, playbook creation, forensic readiness.
- **Persona**: "You are the Incident Response Engineer. You create incident response plans, detection rules, escalation procedures, communication templates, and forensic analysis playbooks. You define MTTR/MTTD targets, tabletop exercise scenarios, and post-incident review processes. You reference NIST SP 800-61 and MITRE ATT&CK frameworks."
- **Spawning**: Wave 1.5 (background, parallel with Compliance)

### 2.9 QA -- Security Validation (QA)
- **Role**: Verify remediation effectiveness, regression testing, validation of fixes.
- **Persona**: "You are the Security QA Engineer. You validate that identified vulnerabilities have been properly remediated. You re-test exploits, verify patches, confirm configuration changes, and ensure fixes don't introduce new vulnerabilities. You produce validation reports with pass/fail status for each finding."
- **Spawning**: Wave 3 (sequential gate)

### 2.10 Release Manager (RM)
- **Role**: Security report packaging, remediation tracking, deliverable sign-off.
- **Persona**: "You are the Security Release Manager. You package final security assessment reports, track remediation status, coordinate disclosure timelines, and produce executive summaries. You create GitHub Releases for report deliverables via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.11 Marketing Strategist (MKT)
- **Role**: Security awareness materials, client-facing documentation.
- **Persona**: "You are the Security Marketing Strategist. You create security awareness training materials, client-facing executive summaries, risk communication documents, and security posture improvement narratives."
- **Spawning**: Wave 1.5 (background)

### 2.12 Legal/Compliance Attorney (LEGAL)
- **Role**: Legal review of testing scope, liability, data handling, disclosure.
- **Persona**: "You are the Legal/Compliance Attorney for security engagements. You review rules of engagement for legal compliance, ensure proper authorization documentation, review data handling procedures during testing, advise on vulnerability disclosure obligations, and assess liability exposure."
- **Spawning**: Wave 1.5 (background)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +----------+
                        |   USER   |
                        +----+-----+
                             |
                    +--------v--------+
                    |  TEAM LEADER    |
                    |  (Orchestrator) |
                    +--------+--------+
                             |
            +----------------+----------------+
            |                |                |
     +------v------+  +-----v------+  +------v------+
     |     PM      |  | Compliance |  |  Attorney   |
     | (Planning)  |  | Officer    |  |  (Legal)    |
     +------+------+  +-----+------+  +------+------+
            |                |                |
            |          +-----v------+         |
            |          | Incident   |         |
            |          | Response   |         |
            |          +------------+         |
            |                                 |
   +--------+--------+----------+----------+  |
   |        |        |          |          |  |
+--v--+ +---v---+ +--v---+ +---v----+     |  |
| Sec | | Pen   | | App  | | Net    |     |  |
| Arch| | Test  | | Sec  | | Sec    |     |  |
+--+--+ +---+---+ +--+---+ +---+----+     |  |
   +--------+--------+----------+          |  |
            |                              |  |
       +----v-----------------------------v--v+
       |         QA (Security Validation)     |
       +------------------+-------------------+
                          |
                 +--------v--------+
                 | Release Manager |
                 +---------+-------+
                           |
                    +------v------+
                    |  Marketing  |
                    +-------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Security engagement planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Security Assessment Charter -> `.team/PROJECT_CHARTER.md`
     - Scope definition, target systems, testing boundaries
     - Rules of engagement, authorized testing methods
     - Emergency contacts, escalation procedures
  2. Create Milestone Plan -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board with severity labels (critical/high/medium/low/info)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Compliance + Incident Response + Marketing + Legal (Background, Parallel)
```
Task(subagent_type="general-purpose", description="CO: Compliance assessment", run_in_background=True,
  prompt="[CO PERSONA] + PROJECT STRATEGY + CHARTER -> .team/compliance/ (GAP_ANALYSIS.md, CONTROL_MAPPING.md, EVIDENCE_MATRIX.md, REMEDIATION_ROADMAP.md)")

Task(subagent_type="general-purpose", description="IR: Incident response planning", run_in_background=True,
  prompt="[IR PERSONA] + PROJECT STRATEGY + CHARTER -> .team/incident-response/ (IR_PLAN.md, PLAYBOOKS.md, DETECTION_RULES.md, TABLETOP_SCENARIOS.md)")

Task(subagent_type="general-purpose", description="MKT: Security awareness", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + CHARTER -> .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: Engagement legal review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + CHARTER -> .team/legal/")
```

### Spawn: Security Engineering Wave (Background, Parallel -- 4 agents)
```
SA    -> .team/security-architecture/  (THREAT_MODEL.md, ATTACK_TREES.md, SECURITY_BOUNDARIES.md, DEFENSE_IN_DEPTH.md)
PT    -> .team/pentest-reports/        (RECON_REPORT.md, VULNERABILITY_FINDINGS.md, EXPLOIT_PROOFS.md, EXECUTIVE_SUMMARY.md)
APPSEC -> .team/appsec/               (SAST_RESULTS.md, DAST_RESULTS.md, CODE_REVIEW.md, DEPENDENCY_AUDIT.md)
NSE   -> .team/network-security/      (NETWORK_ASSESSMENT.md, FIREWALL_REVIEW.md, SEGMENTATION_ANALYSIS.md, EXPOSED_SERVICES.md)
```

### Spawn: QA -- Security Validation (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (VALIDATION_PLAN.md, RETEST_RESULTS.md, REGRESSION_TESTS.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS (all critical/high findings remediated or accepted)
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (FINAL_REPORT.md, EXECUTIVE_SUMMARY.md, REMEDIATION_TRACKER.md, RELEASE_NOTES.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} --title "Security Assessment Report"
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Assessment Charter | `.team/PROJECT_CHARTER.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Findings Kanban | `.team/KANBAN.md` | GitHub Project board |
| Vulnerabilities | -- | `gh issue create` with severity labels |
| Labels | -- | severity + CVSS + finding-type labels |
| Final Report | `.team/releases/` | `gh release create` |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Assessment Charter, Rules of Engagement, Milestones, Timeline
+-- PM: GitHub Project board + severity labels + milestone issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Compliance Officer: gap analysis, control mapping, evidence matrix
+-- Incident Response: IR plan, playbooks, detection rules
+-- Marketing: security awareness materials
+-- Attorney: legal review of testing scope and authorization
+-- These run concurrently with Wave 2

WAVE 2: SECURITY ENGINEERING (Background, Parallel -- 4 agents)
+-- SA, PT, APPSEC, NSE -- all in parallel
+-- SYNC: TL waits for all 4 agents, triages findings by CVSS

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF with vulnerability dashboard
+-- PM: Update GitHub issues with findings
+-- PM: Update KANBAN.md with finding status

WAVE 3: SECURITY VALIDATION (Sequential Gate)
+-- GATE: All security assessment artifacts exist
+-- QA: retest critical/high findings, validate remediations
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: REMEDIATION LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Compliance clear + Legal approved
+-- RM: final report, executive summary, remediation tracker
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF with full vulnerability metrics
+-- PM: close all GitHub milestones
+-- TL: present executive risk summary to user
```

---

## 7. QUALITY GATES

| # | Gate | When | Check | Evidence Required | Action if FAIL |
|---|------|------|-------|-------------------|----------------|
| G1 | Planning Complete | After PM | Charter + ROE + GitHub Project exists | GitHub Project screenshot | Re-spawn PM |
| G2 | Threat Model Complete | After SA | THREAT_MODEL.md with STRIDE analysis | STRIDE matrix, attack tree diagram | Re-spawn SA |
| G3 | Pentest Complete | After PT | All findings documented with CVSS scores | OWASP ZAP HTML report, Burp Suite export | Re-spawn PT |
| G4 | SAST/DAST Complete | After APPSEC | All scans executed, findings triaged | Semgrep SARIF output, ZAP scan report | Re-spawn APPSEC |
| G5 | Compliance Checklist | After CO | Gap analysis covers required frameworks | Control mapping spreadsheet, evidence matrix | Re-spawn CO |
| G6 | Remediation Verified | After QA | All critical/high findings resolved or risk-accepted | Retest results with pass/fail per finding | Enter Remediation Loop |
| G7 | Container Scan | Before release | Trivy container scan: zero critical CVEs | Trivy JSON report | Block release |
| G8 | Security Architecture Review | Before Release | Defense-in-depth validated | Architecture diagram with security controls annotated | Resolve gaps |
| G9 | Incident Response Plan | Before Release | IR_PLAN.md covers all threat scenarios | Tabletop exercise results | Re-spawn IR |
| G10 | Secrets Gate | Before Release | No credentials, tokens, API keys in codebase | `gitleaks detect` clean output | Block release |
| G11 | Evidence Gate | Before Release | All evidence artifacts exist in `.team/evidence/` | File existence check | Block release |
| G12 | Deployment Approved | After RM | DEPLOYMENT_SIGNOFF.md approved | Sign-off document | RM lists blocking items |

---

## 8. `.team/` DIRECTORY LAYOUT

```
.team/
+-- PROJECT_CHARTER.md
+-- MILESTONES.md
+-- KANBAN.md
+-- TIMELINE.md
+-- RISK_REGISTER.md
+-- DECISION_LOG.md
+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- owasp-zap-scan.html
|   +-- owasp-zap-scan.json
|   +-- burp-suite-export.xml
|   +-- semgrep-sast-results.sarif
|   +-- nuclei-scan-results.json
|   +-- trivy-container-scan.json
|   +-- nmap-scan-results.xml
|   +-- gitleaks-scan.txt
|   +-- pentest-proof-of-concept/
|   |   +-- vuln-001-sqli-poc.md
|   |   +-- vuln-002-xss-poc.md
+-- ci/
|   +-- .github/
|   |   +-- workflows/
|   |       +-- security-scan-ci.yml
|   |       +-- container-scan.yml
|   |       +-- sast-scan.yml
|   +-- act-validation-log.txt
+-- threat-model/
+-- pentest-reports/
+-- compliance/
+-- incident-response/
+-- security-architecture/
+-- appsec/
+-- network-security/
+-- remediation/
+-- qa/
+-- releases/
+-- marketing/
+-- legal/
```

---

## 9. REPORTING SYSTEM

### Standard Reports
- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py` -- includes vulnerability severity breakdown charts and CVSS distribution
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py` -- includes detailed finding descriptions and remediation status
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion with full risk posture assessment

### Enhanced Report Content
- **Evidence slides**: Each PPTX includes scan result screenshots, CVSS score distributions, and pentest proof-of-concept summaries
- **Vulnerability dashboard**: Severity breakdown chart (critical/high/medium/low/info), remediation progress gauge
- **Compliance status matrix**: Framework coverage percentage per standard (SOC2, ISO 27001, etc.)
- **Pentest evidence appendix**: PDF includes redacted proof-of-concept screenshots and reproduction steps

---

## 10. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **False positive triage**: TL reviews flagged findings, marks confirmed/false-positive in DECISION_LOG.md

### Session Commands

| Command | Action |
|---------|--------|
| `--team security --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + finding severity dashboard |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation (risk acceptance, scope changes) |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

## 11. EVIDENCE & PROOF PROTOCOL

Every finding requires verifiable evidence. No vulnerability is considered confirmed without proof.

### Cybersecurity Evidence Requirements

| Artifact | Required Evidence | Storage Path |
|----------|-------------------|--------------|
| OWASP ZAP Scan | ZAP HTML report + JSON export with all alerts | `.team/evidence/owasp-zap-scan.html`, `.json` |
| Burp Suite Assessment | Burp project export with request/response pairs | `.team/evidence/burp-suite-export.xml` |
| Semgrep SAST | SARIF output with all findings and severity | `.team/evidence/semgrep-sast-results.sarif` |
| Nuclei Scanner | JSON scan results with matched templates | `.team/evidence/nuclei-scan-results.json` |
| Trivy Container Scan | JSON report with CVE details per container | `.team/evidence/trivy-container-scan.json` |
| Nmap Network Scan | XML output with service/version detection | `.team/evidence/nmap-scan-results.xml` |
| Pentest PoC | Per-vulnerability markdown with steps, screenshots, CVSS | `.team/evidence/pentest-proof-of-concept/` |
| Secrets Scan | gitleaks clean output confirming no secrets | `.team/evidence/gitleaks-scan.txt` |

### Evidence Collection Commands

```bash
# OWASP ZAP automated scan
docker run --rm -v $(pwd):/zap/wrk owasp/zap2docker-stable zap-baseline.py \
  -t https://target.example.com -J zap-results.json -r zap-report.html
cp zap-results.json .team/evidence/owasp-zap-scan.json
cp zap-report.html .team/evidence/owasp-zap-scan.html

# Semgrep SAST scan
semgrep scan --config=auto --sarif --output .team/evidence/semgrep-sast-results.sarif .
semgrep scan --config=p/owasp-top-ten --sarif --output .team/evidence/semgrep-owasp.sarif .

# Nuclei vulnerability scanner
nuclei -u https://target.example.com -t cves/ -t vulnerabilities/ -t misconfigurations/ \
  -json -o .team/evidence/nuclei-scan-results.json

# Trivy container scanning
trivy image --format json --output .team/evidence/trivy-container-scan.json <image:tag>
trivy fs --format json --output .team/evidence/trivy-fs-scan.json .

# Nmap network scan
nmap -sV -sC -oX .team/evidence/nmap-scan-results.xml target.example.com

# Burp Suite CLI scan (if available)
burpsuite_pro --project-file=scan.burp --config-file=scan_config.json
# Export results manually to .team/evidence/burp-suite-export.xml

# gitleaks secrets detection
gitleaks detect --source . --report-format json --report-path .team/evidence/gitleaks-scan.txt

# CIS Benchmark check (Docker containers)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  docker/docker-bench-security 2>&1 | tee .team/evidence/docker-bench.txt
```

### Proof-of-Concept Documentation Template
```markdown
# Vulnerability: [ID] - [Title]

## CVSS v3.1 Score: [Score] ([Severity])
Vector: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N

## Description
[What the vulnerability is and why it matters]

## Reproduction Steps
1. [Step 1 with exact commands/requests]
2. [Step 2]
3. [Step 3]

## Evidence
- Request: [HTTP request showing exploit]
- Response: [HTTP response confirming vulnerability]
- Screenshot: [path to screenshot if applicable]

## Impact
[Business impact of exploitation]

## Remediation
[Specific fix recommendation with code examples]
```

### Evidence Freshness Policy
- Scan results must be regenerated if target system changes after initial scan
- Pentest PoCs must be re-verified before final report delivery
- PM tracks scan timestamps and flags stale evidence in KANBAN.md

---

## 12. LOCAL INSTALL & TEST PROTOCOL

### Prerequisites
```bash
# Python environment
python -m venv .venv
source .venv/bin/activate

# Core security tools
pip install semgrep
pip install bandit  # Python SAST
pip install safety  # Dependency vulnerability check

# Docker-based tools
docker pull owasp/zap2docker-stable
docker pull projectdiscovery/nuclei:latest
docker pull aquasec/trivy:latest
docker pull ghcr.io/gitleaks/gitleaks:latest

# System tools (install via package manager)
# nmap, wireshark-cli, nikto, dirb, gobuster, ffuf

# Report generation
pip install python-pptx reportlab
```

### Docker-Based Security Lab
```bash
# docker-compose.security.yml for local testing environment
docker compose -f docker-compose.security.yml up -d
# Services: target webapp, OWASP ZAP proxy, Juice Shop (test target), DVWA
```

### Build Verification
```bash
# 1. Verify all security tools are available
semgrep --version
nuclei --version
trivy --version
gitleaks version
nmap --version

# 2. Run quick SAST scan to verify tool chain
semgrep scan --config=auto --dry-run .

# 3. Verify container scanning works
trivy image --severity HIGH,CRITICAL alpine:latest

# 4. Verify secrets scanning works
gitleaks detect --source . --no-git --verbose
```

### Run Verification
```bash
# Full security scan pipeline
./scripts/run_full_scan.sh --target https://target.example.com

# Individual tool verification
semgrep scan --config=auto .
nuclei -u https://target.example.com -t cves/
trivy fs --severity HIGH,CRITICAL .
gitleaks detect --source .
```

---

## 13. ATOMIC COMMIT PROTOCOL

### Conventional Commit Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Cybersecurity Commit Types

| Type | When | Example |
|------|------|---------|
| `feat(scan)` | New scan configuration, new scanner integration | `feat(scan): add nuclei scan template for custom API checks` |
| `feat(policy)` | New security policy, compliance rule | `feat(policy): add SOC2 control mapping for access management` |
| `feat(detection)` | New detection rule, IR playbook | `feat(detection): add SIEM rule for brute-force login detection` |
| `fix(vuln)` | Vulnerability remediation code | `fix(vuln): patch SQL injection in user search endpoint` |
| `fix(config)` | Security misconfiguration fix | `fix(config): enforce TLS 1.3 minimum in nginx config` |
| `test(pentest)` | Pentest PoC, retest script | `test(pentest): add automated retest for VULN-001 SQLi` |
| `test(compliance)` | Compliance verification test | `test(compliance): add PCI-DSS requirement 6.5 check` |
| `docs(finding)` | Vulnerability report, remediation guide | `docs(finding): document VULN-003 with CVSS and remediation` |
| `chore(scan)` | Scanner config updates, rule updates | `chore(scan): update nuclei templates to v9.7.0` |
| `audit(report)` | Final audit report artifacts | `audit(report): add executive summary for Q4 assessment` |

### Per-Task Commit Workflow
```bash
# 1. Stage only task-related files
git add security-scans/nuclei-custom-templates/api-auth-bypass.yaml
git add .team/evidence/nuclei-scan-results.json

# 2. Commit with conventional format
git commit -m "feat(scan): add nuclei template for API auth bypass detection

- Custom nuclei template targeting JWT validation weaknesses
- Tests for missing signature verification, expired token acceptance
- Matched against OWASP API Security Top 10 A2
"

# 3. Record commit hash for PM tracking
TASK_COMMIT=$(git rev-parse --short HEAD)
```

---

## 14. COMPREHENSIVE TESTING MATRIX

### Test Layers

| Layer | Tool | Scope | Coverage Target |
|-------|------|-------|-----------------|
| SAST (Static Analysis) | Semgrep + Bandit + SonarQube | Source code vulnerabilities, insecure patterns | OWASP Top 10 coverage |
| DAST (Dynamic Analysis) | OWASP ZAP + Burp Suite | Running application vulnerabilities | All endpoints |
| Dependency Scanning | Snyk + Safety + Trivy (fs mode) | Known CVEs in dependencies | All dependencies |
| Container Scanning | Trivy (image mode) | Container image CVEs, misconfigurations | All container images |
| Secrets Detection | gitleaks + truffleHog | Hardcoded secrets, API keys, tokens | Entire repository history |
| Network Scanning | Nmap + Nuclei | Open ports, vulnerable services, misconfigurations | All target hosts |
| Compliance Checks | CIS Benchmarks + custom scripts | Configuration compliance per framework | Target frameworks |
| Infrastructure Scanning | Checkov + tfsec | IaC misconfigurations (Terraform, CloudFormation) | All IaC files |
| Penetration Testing | Manual + Burp Suite + Metasploit | Business logic, chained attacks, auth bypass | Critical attack paths |
| Remediation Verification | Automated retests + manual validation | Confirmed fix for each finding | All critical/high findings |

### Test Execution Order
```bash
# Phase 1: Secrets scan (immediate block if secrets found)
gitleaks detect --source . --report-format json --report-path .team/evidence/gitleaks-scan.txt
[ $? -eq 0 ] || echo "SECRETS FOUND -- BLOCK ALL FURTHER TESTING"

# Phase 2: SAST scanning
semgrep scan --config=auto --sarif --output .team/evidence/semgrep-sast-results.sarif .
bandit -r src/ -f json -o .team/evidence/bandit-results.json

# Phase 3: Dependency scanning
safety check --json --output .team/evidence/safety-check.json
trivy fs --format json --output .team/evidence/trivy-fs-scan.json .

# Phase 4: Container scanning
trivy image --format json --output .team/evidence/trivy-container-scan.json <image:tag>

# Phase 5: DAST scanning (requires running application)
docker run --rm owasp/zap2docker-stable zap-baseline.py \
  -t https://target.example.com -J .team/evidence/owasp-zap-scan.json

# Phase 6: Network scanning
nmap -sV -sC -oX .team/evidence/nmap-scan-results.xml target.example.com
nuclei -u https://target.example.com -json -o .team/evidence/nuclei-scan-results.json

# Phase 7: Infrastructure scanning (if IaC present)
checkov -d infrastructure/ --output-file-path .team/evidence/ --output junitxml

# Phase 8: Penetration testing (manual, documented in PoC files)

# Phase 9: Remediation retesting
python scripts/retest_findings.py --findings .team/pentest-reports/VULNERABILITY_FINDINGS.md
```

### OWASP Top 10 Coverage Matrix
```
| OWASP ID | Category                           | Scanner          | Status  |
|----------|------------------------------------|------------------|---------|
| A01:2021 | Broken Access Control              | ZAP + Manual PT  | [ ]     |
| A02:2021 | Cryptographic Failures             | Semgrep + Manual | [ ]     |
| A03:2021 | Injection                          | Semgrep + ZAP    | [ ]     |
| A04:2021 | Insecure Design                    | Threat Model     | [ ]     |
| A05:2021 | Security Misconfiguration          | Nuclei + CIS     | [ ]     |
| A06:2021 | Vulnerable Components              | Trivy + Snyk     | [ ]     |
| A07:2021 | Auth & Session Management          | ZAP + Manual PT  | [ ]     |
| A08:2021 | Software and Data Integrity        | Semgrep + Manual | [ ]     |
| A09:2021 | Security Logging Monitoring        | Manual Review    | [ ]     |
| A10:2021 | Server-Side Request Forgery        | ZAP + Nuclei     | [ ]     |
```

---

## 15. GITHUB ACTIONS -- LOCAL TESTING

### CI Pipeline Definition
```yaml
# .github/workflows/security-scan-ci.yml
name: Security Scan CI
on: [push, pull_request]

jobs:
  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Run gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}

  sast-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/owasp-top-ten
            p/security-audit
            p/secrets
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: semgrep.sarif

  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy fs scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'HIGH,CRITICAL'
      - name: Upload Trivy SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: trivy-results.sarif

  container-scan:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t app:${{ github.sha }} .
      - name: Run Trivy container scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'app:${{ github.sha }}'
          format: 'json'
          output: 'trivy-container.json'
          severity: 'HIGH,CRITICAL'
          exit-code: '1'
```

### Local CI Validation with `act`
```bash
# Run individual security scan jobs
act push --job secrets-scan
act push --job sast-scan
act push --job dependency-scan

# Run all security jobs
act push

# Save validation log as evidence
act push 2>&1 | tee .team/ci/act-validation-log.txt
```

### Security-Specific CI Checks
```bash
# Quick SAST check before commit
semgrep scan --config=auto --error .

# Dependency vulnerability check
safety check --full-report

# Container security baseline
trivy image --severity CRITICAL --exit-code 1 <image:tag>

# Infrastructure-as-Code scan
checkov -d infrastructure/ --hard-fail-on HIGH,CRITICAL
```

---

## 16. PM KANBAN -- REAL-TIME TRACKING

### GitHub Projects V2 Setup
```bash
# Create project board
gh project create --title "Security: <engagement-name>" --owner @me

# Create custom fields for security engagements
gh project field-create <PROJECT_NUMBER> --owner @me --name "CVSS Score" --data-type "NUMBER"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Severity" --data-type "SINGLE_SELECT" \
  --single-select-options "critical,high,medium,low,informational"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Finding Status" --data-type "SINGLE_SELECT" \
  --single-select-options "new,confirmed,remediated,risk-accepted,false-positive"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Evidence Status" --data-type "SINGLE_SELECT" \
  --single-select-options "pending,collected,verified,stale"
```

### Real-Time Issue Updates
After each finding:
```bash
# Create vulnerability issue
gh issue create --title "[CVSS 9.8] SQL Injection in /api/search" \
  --label "severity:critical,type:injection,status:new" \
  --body "## Finding Details
  - CVSS: 9.8 (Critical)
  - Vector: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
  - Evidence: .team/evidence/pentest-proof-of-concept/vuln-001-sqli-poc.md
  "

# Update after remediation
gh issue edit <NUMBER> --add-label "status:remediated" --remove-label "status:new"
gh issue comment <NUMBER> --body "Remediation verified:
- Retest: PASS
- Evidence: .team/evidence/retest-vuln-001.log
- Commit: $(git rev-parse --short HEAD)"
```

### PM 6-Hour Report Cycle
```
CYCLE START:
  1. Read KANBAN.md for current finding states
  2. Query GitHub Issues: gh issue list --label "severity:critical,severity:high" --json number,title,labels
  3. Aggregate scan results from .team/evidence/
  4. Generate PPTX with:
     - Vulnerability severity breakdown (pie chart)
     - CVSS score distribution (histogram)
     - Remediation progress (stacked bar)
     - OWASP Top 10 coverage matrix (table)
     - Evidence collection status (checklist)
  5. Generate PDF with detailed finding descriptions
  6. Commit reports
CYCLE END
```

### Evidence-Linked Kanban Columns

| Column | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| New | Finding identified by scanner or manual testing | Triage by TL (confirmed or false-positive) |
| Confirmed | Evidence collected, CVSS scored, PoC documented | Remediation plan created |
| Remediation In Progress | Fix being developed | Fix committed and deployed to test |
| Retest | QA retesting remediated finding | Retest evidence collected |
| Remediated | Retest passed, evidence verified | PM closes issue |
| Risk Accepted | TL + stakeholder accept residual risk | Documented in DECISION_LOG.md |
| False Positive | Finding confirmed as false positive | Evidence of false positive documented |

---

*Cybersecurity Team v3.0 -- Amenthyx AI Teams*
*12 Roles | 5 Waves | 12 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Based*
*See shared/ENHANCED_EXECUTION_PROTOCOL.md for cross-team protocol details*
