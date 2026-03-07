# Compliance & Governance Team
# Activation: `--team compliance`
# Focus: SOC2 evidence collection, GDPR data mapping, audit trail automation, regulatory compliance
# Version: 3.0 — Enhanced Execution Protocol

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Evidence & Proof Protocol](#7-evidence--proof-protocol)
8. [Local Install & Test Protocol](#8-local-install--test-protocol)
9. [Atomic Commit Protocol](#9-atomic-commit-protocol)
10. [Comprehensive Testing Matrix](#10-comprehensive-testing-matrix)
11. [GitHub Actions — Local Testing with act](#11-github-actions--local-testing-with-act)
12. [PM Kanban — Real-Time Tracking](#12-pm-kanban--real-time-tracking)
13. [Quality Gates](#13-quality-gates)
14. [`.team/` Directory Layout](#14-team-directory-layout)
15. [Reporting System](#15-reporting-system)
16. [Error Handling & Session Management](#16-error-handling--session-management)
17. [Regulatory Framework Reference](#17-regulatory-framework-reference)
18. [Glossary & Acronyms](#18-glossary--acronyms)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team compliance --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> — this becomes PROJECT STRATEGY
3. Read shared/ENHANCED_EXECUTION_PROTOCOL.md for shared protocols
4. Create `.team/` directory structure (see Section 14)
5. Spawn Team Leader agent (foreground — this is the orchestrator)
6. Team Leader spawns PM agent (foreground — must complete before others)
7. PM produces Project Charter + Initial Plan + creates GitHub Project
8. Team Leader reviews PM output, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, target frameworks, compliance scope, and success criteria.

### Quick Reference — Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between compliance domains. Ensures every deliverable has evidence artifacts including control evidence screenshots, audit log samples, policy test results, security scan outputs, and data flow diagrams. Bridges the gap between technical implementation and regulatory requirements.
- **Persona**: "You are the Team Leader of an 11-person Compliance & Governance team. You coordinate all work across SOC2 compliance, GDPR/privacy, audit trails, policy automation, security compliance, documentation, and quality assurance. You make final decisions on control mapping, evidence sufficiency, policy enforcement scope, and audit readiness. You enforce quality gates including control effectiveness testing, policy validation, audit log integrity checks, and gap analysis resolution. You require evidence (command output, control screenshots, policy test results, audit log excerpts, scan reports) for every deliverable. You never write code or policies directly — you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management, real-time Kanban.
- **Persona**: "You are the Project Manager for a Compliance & Governance project. You create all planning artifacts, track deliverables across SOC2, privacy, audit, policy, security, and documentation workstreams. You manage sprint boards via GitHub Projects V2 using `gh` CLI. You generate PPTX status presentations (with evidence: control matrices, audit findings, policy test results, gap analysis summaries) using python-pptx and PDF summaries using reportlab. You track KPIs: controls mapped, evidence collected, gaps identified, gaps remediated, policy pass rate, audit readiness score. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Judge Agent (JUDGE)
- **Role**: Impartial evaluation of competing plans and proposals.
- **Responsibilities**: Scores PM-generated plan alternatives using a 7-criterion weighted rubric (Strategy Alignment, Feasibility, Risk Management, Scalability, Innovation, Completeness, Efficiency). Identifies hidden assumptions and missing considerations. Produces a VERDICT document recommending the best plan with full reasoning. See `shared/JUDGE_PROTOCOL.md`.
- **Persona**: "You are the Judge Agent. You evaluate competing plans and design alternatives with rigorous objectivity. You NEVER produce plans yourself -- you only analyze plans produced by others. You assess each alternative against the project strategy, constraints, risk profile, and success criteria. You use a structured 7-criterion scoring rubric and must explain your reasoning transparently. You identify hidden assumptions, missing considerations, and risks that plan authors may have overlooked. Your output is a VERDICT document that ranks alternatives with weighted scores and selects a winner. You are impartial -- you evaluate based on merit, not authorship."
- **Spawning**: After PM, before engineering waves (foreground, blocking)


### Code Review Agent (CR)
- **Role**: Automated code review before QA gate.
- **Responsibilities**: Reviews all engineering wave code changes for OWASP vulnerabilities, code smells, architecture drift, naming consistency, hardcoded secrets, and test coverage gaps. Produces a scored CODE_REVIEW report with PASS/CONDITIONAL_PASS/FAIL verdict. See `shared/CODE_REVIEW_PROTOCOL.md`.
- **Persona**: "You are the Code Review Agent. You review all code changes from the engineering wave with the rigor of a senior staff engineer. You check for security vulnerabilities (OWASP Top 10), code quality (DRY, SOLID, complexity), architecture compliance (does the code match the approved plan?), error handling, and test coverage. You read git diffs, analyze patterns, and produce a scored review. You are thorough but fair -- you distinguish critical issues from style preferences. Your verdict determines whether QA can proceed."
- **Spawning**: After engineering wave (Wave 2), before QA (Wave 3) -- foreground, blocking

### Retrospective Agent (RETRO)
- **Role**: Post-wave analysis and continuous improvement.
- **Responsibilities**: Analyzes each completed wave for what went well, what went wrong, bottlenecks, and metrics vs plan. Produces actionable recommendations for the next wave. Tracks improvement trends. Extracts reusable learnings. See `shared/RETROSPECTIVE_PROTOCOL.md`.
- **Persona**: "You are the Retrospective Agent. After each wave completes, you analyze execution quality with data-driven objectivity. You compare planned vs actual metrics (time, tokens, commits, test pass rates). You identify bottlenecks, recurring issues, and unexpected outcomes. You produce actionable recommendations -- not vague advice, but specific changes for the next wave. You track trends across waves and extract reusable learnings for the team's institutional memory."
- **Spawning**: After each wave completion -- background, non-blocking

### Dependency Guardian (DEPGUARD)
- **Role**: Dependency security and license compliance auditing.
- **Responsibilities**: Audits all project dependencies for known CVEs, license compatibility, outdated packages, abandoned libraries, and dependency confusion risks. Produces a scored DEPENDENCY_AUDIT with PASS/WARN/FAIL verdict. See `shared/DEPENDENCY_GUARDIAN_PROTOCOL.md`.
- **Persona**: "You are the Dependency Guardian. You audit every dependency in the project -- direct and transitive. You check for known vulnerabilities (CVEs), license compatibility (no GPL contamination in proprietary projects), outdated packages, abandoned libraries, and supply chain risks. You run the appropriate audit tool for the package manager (npm audit, pip audit, cargo audit, etc.) and produce a comprehensive audit report. Any critical CVE or license violation is an automatic FAIL."
- **Spawning**: Before release wave (Wave 4) -- foreground, blocking
### 2.4 SOC2 Compliance Engineer (SOC2)
- **Role**: SOC2 Type II controls, evidence collection, control mapping, audit preparation.
- **Persona**: "You are the SOC2 Compliance Engineer for a Compliance & Governance team. You implement SOC2 Type II controls across all five Trust Service Criteria: Security (CC), Availability (A), Processing Integrity (PI), Confidentiality (C), and Privacy (P). You build control matrices mapping controls to criteria, design evidence collection automation (screenshots, configuration exports, access review exports, change management logs), prepare audit readiness packages, create control narratives, and implement continuous monitoring for control effectiveness. You understand AICPA Trust Service Criteria, COSO framework, and common SOC2 auditor expectations. You design control testing procedures and remediation tracking. You write to `.team/soc2/`."
- **Spawning**: Wave 2 (parallel)

### 2.5 GDPR/Privacy Engineer (PRIVACY)
- **Role**: Data mapping, consent management, DSAR automation, privacy impact assessments, cookie compliance.
- **Persona**: "You are the GDPR/Privacy Engineer for a Compliance & Governance team. You build Records of Processing Activities (ROPA), data flow diagrams showing PII touchpoints across all systems, consent management platforms (CMP) integration, Data Subject Access Request (DSAR) automation pipelines, Privacy Impact Assessments (PIA/DPIA), cookie consent implementations (TCF 2.2 compliance), data retention policy enforcement, cross-border transfer mechanisms (SCCs, adequacy decisions), and privacy-by-design frameworks. You understand GDPR Articles 5-49, CCPA/CPRA, LGPD, PIPA, and emerging privacy regulations. You design data minimization strategies, purpose limitation controls, and lawful basis documentation. You write to `.team/privacy/`."
- **Spawning**: Wave 2 (parallel)

### 2.6 Audit Trail Engineer (AUDIT)
- **Role**: Immutable audit logs, event sourcing for compliance, tamper-proof evidence chains.
- **Persona**: "You are the Audit Trail Engineer for a Compliance & Governance team. You design and implement immutable audit logging systems: append-only log stores (AWS CloudTrail, Azure Monitor, GCP Audit Logs, custom solutions), cryptographic hash chains for tamper detection (SHA-256 chain linking), event sourcing architectures for compliance-critical operations, log integrity verification tools, centralized log aggregation (ELK Stack, Splunk, Datadog), log retention policies with automated archival, and forensic audit capabilities. You implement WORM (Write Once Read Many) storage for regulatory retention requirements, real-time log anomaly detection, and chain-of-custody documentation for evidence handling. You write to `.team/audit/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 Policy Automation Engineer (POLICY)
- **Role**: OPA/Rego policies, policy-as-code, automated policy enforcement, compliance gates in CI/CD.
- **Persona**: "You are the Policy Automation Engineer for a Compliance & Governance team. You implement policy-as-code using Open Policy Agent (OPA) with Rego language, Sentinel (HashiCorp), or Kyverno (Kubernetes). You design automated policy enforcement gates in CI/CD pipelines (pre-commit, pre-merge, pre-deploy), infrastructure compliance scanning (Terraform compliance, CloudFormation Guard, Checkov), runtime policy enforcement (admission controllers, service mesh policies), and policy versioning with audit trails. You build policy testing frameworks, policy exception workflows with approval chains, and policy drift detection. You understand the CIS Benchmarks, NIST CSF, and ISO 27001 control frameworks as policy sources. You write to `.team/policies/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 Security Compliance Engineer (SECCOMP)
- **Role**: CIS benchmarks, vulnerability management, penetration test coordination, security control validation.
- **Persona**: "You are the Security Compliance Engineer for a Compliance & Governance team. You implement CIS Benchmark compliance scanning (CIS-CAT, Lynis, OpenSCAP), vulnerability management programs (Trivy, Snyk, Qualys, Nessus), penetration test coordination and remediation tracking, security control validation for SOC2/ISO 27001/NIST CSF, access control reviews (RBAC audits, privilege escalation detection, orphaned account cleanup), encryption validation (at-rest, in-transit, key management), network segmentation verification, and incident response procedure testing. You design security metrics dashboards, vulnerability SLA tracking, and security posture scoring. You write to `.team/security/`."
- **Spawning**: Wave 2 (parallel)

### 2.9 Documentation & Reporting Engineer (DOCS)
- **Role**: Compliance documentation, control narratives, evidence packages, board reports.
- **Persona**: "You are the Documentation & Reporting Engineer for a Compliance & Governance team. You produce audit-ready documentation: control narratives (describing what each control does, how it operates, and how it is monitored), evidence packages organized by control and framework, System Description documents (SOC2 Section III), risk assessment reports, compliance status dashboards, board-level compliance summaries, regulatory filing documents, and training materials. You design document templates with version control, approval workflows, and retention metadata. You generate compliance reports in multiple formats (PDF, PPTX, HTML, CSV) with automated data aggregation from other agents' outputs. You write to `.team/docs/`."
- **Spawning**: Wave 1.5 (background, parallel)

### 2.10 QA & Validation Agent (QA)
- **Role**: Compliance test suites, control effectiveness testing, gap analysis, mock audit execution.
- **Persona**: "You are the QA & Validation Agent for a Compliance & Governance team. You validate all compliance deliverables: control effectiveness testing (design effectiveness + operating effectiveness), gap analysis against target frameworks (SOC2, GDPR, ISO 27001, NIST CSF, HIPAA, PCI DSS), mock audit execution (simulating auditor walkthroughs, evidence requests, control testing), policy enforcement validation (testing OPA/Rego policies against known-good and known-bad inputs), audit log integrity verification (hash chain validation, completeness checks), DSAR response accuracy testing, and penetration test finding remediation verification. You capture all validation output as evidence. You produce test reports and QA sign-off."
- **Spawning**: Wave 3 (sequential gate)

### 2.11 Release Manager (RM)
- **Role**: Compliance-gated releases, audit evidence packaging, regulatory submission preparation.
- **Persona**: "You are the Release Manager for a Compliance & Governance team. You manage compliance-gated release processes: pre-release compliance checklists (all controls verified, all gaps remediated, all policies passing), audit evidence packaging (organizing evidence by control, framework, and time period), regulatory submission preparation (SOC2 report assembly, GDPR compliance documentation, security certification packages), change management documentation (RFC, CAB approval, rollback procedures), and post-release compliance verification. You coordinate with auditors, produce release compliance attestations, and maintain the compliance calendar. You write to `.team/releases/`."
- **Spawning**: Wave 4 (sequential, after QA pass)

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
     |     PM      |  |   JUDGE    |  |    DOCS     |
     | (Planning)  |  | (Evaluate) |  | (Reporting) |
     +------+------+  +------------+  +-------------+
            |
   +--------+--------+--------+--------+
   |        |        |        |        |
+--v--+ +---v---+ +--v---+ +-v------+ +v------+
| SOC2| |PRIVACY| |AUDIT | |POLICY  | |SECCOMP|
|     | | (GDPR)| |TRAIL | |AUTOMAT.| |  SEC. |
+--+--+ +---+---+ +--+---+ +-+------+ ++------+
   +--------+--------+--------+---------+
            |
      +-----v-----+     +------+------+
      |    QA      |     |   RELEASE   |
      | (Testing)  |     |   MANAGER   |
      +------------+     +-------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Compliance & governance project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan -> `.team/MILESTONES.md` (compliance frameworks as milestones)
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`

  IMPORTANT -- MULTI-PLAN REQUIREMENT (Judge Protocol):
  The PM MUST produce at least 2 (ideally 3) alternative plans:
  - .team/plans/PLAN_A.md -- first approach
  - .team/plans/PLAN_B.md -- second approach (must differ meaningfully)
  - .team/plans/PLAN_C.md -- third approach (optional, recommended)
  Each plan must vary in at least 2 dimensions: framework prioritization,
  evidence collection strategy, automation depth, timeline, risk profile,
  or audit readiness approach.
  See shared/JUDGE_PROTOCOL.md for the required plan document structure.
  After PM completes plans, TL spawns the Judge Agent to evaluate them.
"""
)
```

### Spawn: Documentation Engineer (Background, Parallel — Wave 1.5)
```
Task(subagent_type="general-purpose", description="DOCS: Compliance documentation framework", run_in_background=True,
  prompt="[DOCS PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/docs/ (DOCUMENT_TEMPLATES.md, CONTROL_NARRATIVE_TEMPLATE.md, EVIDENCE_PACKAGE_TEMPLATE.md, BOARD_REPORT_TEMPLATE.md, COMPLIANCE_CALENDAR.md, TRAINING_MATERIALS.md)")
```

### Spawn: Judge Agent (Foreground, Sequential — After PM)
```
Task(
  subagent_type="general-purpose",
  description="JUDGE: Evaluate PM plan alternatives",
  prompt="""
  [JUDGE PERSONA from shared/JUDGE_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  PLANS TO EVALUATE:
  Read all .team/plans/PLAN_*.md files produced by PM.

  EVALUATION RUBRIC (7 criteria, weighted):
  Strategy Alignment (25%), Feasibility (20%), Risk Management (15%),
  Scalability (10%), Innovation (10%), Completeness (10%), Efficiency (10%)

  Score each plan 1-10 on each criterion.

  OUTPUT: Write verdict to .team/plans/VERDICT.md
  Include: scoring tables, comparative analysis, hidden assumptions,
  missing considerations, and suggested modifications to winning plan.
  """
)
GATE: VERDICT.md must exist with a clear winner before engineering waves proceed.
TL reads VERDICT and may override with documented rationale in DECISION_LOG.md.
```

### Spawn: Engineering Wave (Background, Parallel — 5 agents)
```
SOC2    -> .team/soc2/       (CONTROL_MATRIX.md, EVIDENCE_COLLECTION.md, TSC_MAPPING.md, AUDIT_READINESS.md, CONTINUOUS_MONITORING.md, REMEDIATION_TRACKER.md)
PRIVACY -> .team/privacy/    (ROPA.md, DATA_FLOW_MAP.md, CONSENT_MANAGEMENT.md, DSAR_AUTOMATION.md, DPIA_TEMPLATE.md, COOKIE_COMPLIANCE.md, CROSS_BORDER_TRANSFERS.md)
AUDIT   -> .team/audit/      (AUDIT_LOG_ARCHITECTURE.md, HASH_CHAIN_DESIGN.md, EVENT_SOURCING.md, LOG_AGGREGATION.md, RETENTION_POLICY.md, INTEGRITY_VERIFICATION.md)
POLICY  -> .team/policies/   (OPA_POLICIES.md, POLICY_TESTING.md, CI_CD_GATES.md, INFRA_COMPLIANCE.md, POLICY_EXCEPTIONS.md, DRIFT_DETECTION.md)
SECCOMP -> .team/security/   (CIS_BENCHMARK.md, VULNERABILITY_MANAGEMENT.md, PENTEST_COORDINATION.md, ACCESS_CONTROL_REVIEW.md, ENCRYPTION_VALIDATION.md, SECURITY_METRICS.md)
```


### Spawn: Code Review Agent (Foreground, Blocking -- After Engineering, Before QA)
```
Task(
  subagent_type="general-purpose",
  description="CR: Review engineering wave code changes",
  prompt="""
  [CR PERSONA from shared/CODE_REVIEW_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASK:
  1. Read all git commits from the engineering wave (git log --oneline)
  2. Review the full diff (git diff main..HEAD or relevant range)
  3. Check for: OWASP vulnerabilities, code smells, architecture drift,
     naming inconsistencies, hardcoded secrets, missing error handling,
     test coverage gaps
  4. Score using the 5-criterion rubric from shared/CODE_REVIEW_PROTOCOL.md
  5. Write report to .team/reviews/CODE_REVIEW_WAVE_N.md

  VERDICT RULES:
  - Score >= 7.0 -> PASS (proceed to QA)
  - Score 5.0-6.9 -> CONDITIONAL_PASS (proceed, track fixes as tech debt)
  - Score < 5.0 -> FAIL (engineering agents re-spawned for fixes)
  - ANY critical security finding -> automatic FAIL
  """
)
GATE: CODE_REVIEW must be PASS or CONDITIONAL_PASS before QA wave proceeds.
```

### Spawn: QA (Foreground, Sequential — After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, CONTROL_EFFECTIVENESS_TESTS.md, GAP_ANALYSIS.md, MOCK_AUDIT_REPORT.md, POLICY_VALIDATION_TESTS.md, LOG_INTEGRITY_TESTS.md, DSAR_ACCURACY_TESTS.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```


### Spawn: Retrospective Agent (Background, Non-Blocking -- After Each Wave)
```
Task(
  subagent_type="general-purpose",
  description="RETRO: Analyze completed wave",
  prompt="""
  [RETRO PERSONA from shared/RETROSPECTIVE_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  WAVE JUST COMPLETED: Wave {N}

  YOUR TASK:
  1. Analyze all events, commits, and evidence from the completed wave
  2. Compare planned vs actual: duration, token usage, agent count, test pass rate
  3. Identify bottlenecks, recurring issues, and unexpected outcomes
  4. Produce actionable recommendations for the next wave
  5. Extract reusable learnings for .team/learnings/
  6. Write retrospective to .team/retros/RETRO_WAVE_{N}.md
  """
)
```

### Spawn: Release Manager (Foreground, Sequential — After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, EVIDENCE_PACKAGE.md, AUDIT_SUBMISSION.md, COMPLIANCE_ATTESTATION.md, REGULATORY_FILING.md, RELEASE_SIGNOFF.md)
GATE: RELEASE_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | — |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | — | `gh issue create` per deliverable |
| Labels | — | Role + priority + wave + framework labels |
| Releases | `.team/releases/` | `gh release create` |

### Domain-Specific Milestones
1. **Documentation Framework** — templates, narratives, compliance calendar, training materials finalized
2. **SOC2 Controls** — control matrix complete, TSC mapping validated, evidence collection automated
3. **Privacy & GDPR** — ROPA complete, data flow maps validated, DSAR automation operational, consent management live
4. **Audit Trail Infrastructure** — immutable logging deployed, hash chain verified, log aggregation operational
5. **Policy Automation** — OPA policies written and tested, CI/CD gates enforced, drift detection active
6. **Security Compliance** — CIS benchmarks scanned, vulnerability management active, access reviews complete
7. **Testing & Validation** — all controls tested for effectiveness, gap analysis complete, mock audit passed
8. **Audit Readiness** — evidence packages assembled, regulatory submissions prepared, attestation signed
9. **Production Release** — compliance-gated release complete, post-release verification done, compliance calendar active

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure
+-- Verify Python, Node.js, Docker, OPA, compliance tooling available
+-- Run: python --version && node --version && docker --version && opa version (capture as evidence)

WAVE 1: PLANNING (Sequential — PM foreground)
+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- PM: Produce 2-3 alternative plans (.team/plans/PLAN_A.md, PLAN_B.md, PLAN_C.md)
+-- GATE: All PM artifacts exist + plans produced

WAVE 1.25: JUDGE (Sequential — Foreground, Blocking)
+-- JUDGE: Read all PLAN_*.md, evaluate with 7-criterion rubric
+-- JUDGE: Produce .team/plans/VERDICT.md with winner + reasoning
+-- TL: Read VERDICT, accept or override with DECISION_LOG.md entry
+-- GATE: VERDICT.md exists with clear winner

WAVE 1.5: DOCUMENTATION FRAMEWORK (Background, Parallel)
+-- DOCS: Templates, control narrative structure, evidence package format
+-- DOCS: Compliance calendar, board report format, training materials
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel — 5 agents)
+-- SOC2: control matrix, TSC mapping, evidence collection, continuous monitoring
+-- PRIVACY: ROPA, data flow maps, consent management, DSAR automation, DPIA, cookies
+-- AUDIT: immutable logging, hash chains, event sourcing, log aggregation, retention
+-- POLICY: OPA/Rego policies, CI/CD gates, infrastructure scanning, drift detection
+-- SECCOMP: CIS benchmarks, vulnerability management, pen test coordination, access reviews
+-- Each agent captures validation evidence to .team/evidence/
+-- SYNC: TL waits for all 5 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF (include evidence artifacts, control test results, gap analysis)
+-- PM: Update GitHub issues (move cards in real time)
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: Control effectiveness testing (design + operating effectiveness)
+-- QA: Gap analysis against all target frameworks
+-- QA: Mock audit execution (simulated auditor walkthrough)
+-- QA: Policy validation (OPA test suites), audit log integrity checks
+-- QA: DSAR accuracy testing, penetration test remediation verification
+-- QA: Capture all validation output to .team/evidence/
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: REMEDIATION LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers for gap remediation -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + all controls evidenced + zero critical gaps
+-- RM: release checklist, evidence package assembly, audit submission prep
+-- RM: compliance attestation, regulatory filing documents
+-- RM: GitHub Release via gh release create
+-- GATE: RELEASE_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF (with evidence summary, compliance posture score, audit readiness)
+-- PM: close all GitHub milestones
+-- DOCS: final board report, compliance status dashboard
+-- TL: present summary to user
```

---

## 7. EVIDENCE & PROOF PROTOCOL

Every engineering deliverable MUST include verifiable evidence. No exceptions.

### Evidence Requirements by Role

| Role | Evidence Required | Format |
|------|-------------------|--------|
| SOC2 | Control matrix + screenshots, TSC mapping validation, evidence collection logs | `.md` / `.png` / `.csv` |
| PRIVACY | ROPA document + data flow diagrams, consent records, DSAR response logs | `.md` / `.png` / `.json` |
| AUDIT | Audit log samples + integrity proof, hash chain verification output | `.txt` / `.json` / `.log` |
| POLICY | OPA test output, policy enforcement logs, CI/CD gate results | `.txt` / `.json` / `.rego` |
| SECCOMP | CIS benchmark report, vulnerability scan output, pen test findings | `.txt` / `.html` / `.json` |
| DOCS | Document completeness checklist, narrative review signoff | `.md` / `.pdf` |
| QA | Control test results, gap matrix, mock audit findings | `.txt` / `.json` / `.csv` |
| RM | Evidence package inventory, submission confirmation, attestation doc | `.md` / `.pdf` |

### Domain-Specific Evidence Table

| Evidence Type | Format | Agent | Location |
|--------------|--------|-------|----------|
| SOC2 control evidence | control matrix + screenshots | SOC2 | .team/evidence/soc2/ |
| Data flow maps | ROPA document + diagrams | PRIVACY | .team/evidence/privacy/ |
| Audit log samples | log excerpts + integrity proof | AUDIT | .team/evidence/audit/ |
| Policy test results | OPA test output | POLICY | .team/evidence/policies/ |
| Security scan results | CIS benchmark report | SECCOMP | .team/evidence/security/ |
| Compliance gap analysis | gap matrix | QA | .team/evidence/gaps/ |

### Evidence Collection Commands
```bash
# SOC2 Control Evidence — Access Control Review
aws iam list-users --output json > .team/evidence/soc2/iam-users.json 2>&1
aws iam list-policies --scope Local --output json > .team/evidence/soc2/iam-policies.json 2>&1
aws iam generate-credential-report > /dev/null 2>&1 && \
  aws iam get-credential-report --output text --query Content | base64 -d \
  > .team/evidence/soc2/credential-report.csv 2>&1

# SOC2 Control Evidence — Encryption Validation
aws kms list-keys --output json > .team/evidence/soc2/kms-keys.json 2>&1
aws rds describe-db-instances --query "DBInstances[*].{ID:DBInstanceIdentifier,Encrypted:StorageEncrypted}" \
  --output json > .team/evidence/soc2/rds-encryption.json 2>&1

# GDPR/Privacy — Data Flow Mapping
python -c "
import json
# Validate ROPA completeness
with open('.team/privacy/ropa_data.json') as f:
    ropa = json.load(f)
    required = ['purpose', 'legal_basis', 'data_categories', 'recipients', 'retention_period', 'safeguards']
    for activity in ropa.get('processing_activities', []):
        missing = [f for f in required if f not in activity]
        status = 'PASS' if not missing else f'FAIL - missing: {missing}'
        print(f'{activity.get(\"name\", \"unknown\")}: {status}')
" > .team/evidence/privacy/ropa-validation.txt 2>&1

# Audit Trail — Hash Chain Integrity Verification
python -c "
import hashlib, json
# Verify hash chain integrity
with open('.team/audit/audit_log.jsonl') as f:
    prev_hash = '0' * 64
    for i, line in enumerate(f):
        entry = json.loads(line)
        expected = hashlib.sha256((prev_hash + entry['data']).encode()).hexdigest()
        status = 'PASS' if entry['hash'] == expected else 'FAIL'
        print(f'Entry {i}: {status}')
        prev_hash = entry['hash']
" > .team/evidence/audit/hash-chain-verification.txt 2>&1

# Policy Automation — OPA Policy Tests
opa test policies/ -v 2>&1 | tee .team/evidence/policies/opa-test-results.txt
opa eval -d policies/ -i test/input.json "data.compliance.allow" \
  2>&1 | tee .team/evidence/policies/opa-eval-output.txt

# Security Compliance — CIS Benchmark Scan
docker run --rm -v /:/host:ro aquasec/trivy:latest fs --severity HIGH,CRITICAL /host \
  2>&1 | tee .team/evidence/security/trivy-host-scan.txt
lynis audit system --quick 2>&1 | tee .team/evidence/security/lynis-audit.txt

# Security Compliance — Vulnerability Scan
trivy image --severity HIGH,CRITICAL app:latest \
  2>&1 | tee .team/evidence/security/trivy-image-scan.txt
npm audit --audit-level=high 2>&1 | tee .team/evidence/security/npm-audit.txt
pip-audit 2>&1 | tee .team/evidence/security/pip-audit.txt

# Secrets Detection
gitleaks detect --source . 2>&1 | tee .team/evidence/security/gitleaks-results.txt

# Docker build (compliance platform)
docker build -t compliance-platform:latest . \
  2>&1 | tee .team/evidence/docker-build.txt
docker images compliance-platform:latest --format "Size: {{.Size}}" \
  >> .team/evidence/docker-build.txt
```

### Evidence Naming Convention
```
.team/evidence/{domain}/{wave}-{role}-{artifact}.{ext}
Example: soc2/w2-soc2-access-control-review.json, privacy/w2-privacy-ropa-validation.txt, audit/w2-audit-hash-chain.txt
```

### Compliance Evidence Protocol
For compliance deliverables, capture evidence at these checkpoints:
1. **After control mapping** — control matrix exported, TSC criteria linked, evidence gaps identified
2. **After data flow mapping** — ROPA validated, all PII touchpoints documented, legal basis recorded
3. **After audit log deployment** — log integrity verified via hash chain, sample entries exported
4. **After policy deployment** — OPA tests pass, CI/CD gates enforced, exception workflows tested
5. **After security scan** — CIS benchmark results exported, vulnerabilities cataloged with SLAs
6. **After gap analysis** — gap matrix complete, remediation plan documented, owner assigned
7. **After mock audit** — auditor walkthrough simulated, evidence requests fulfilled, findings documented

---

## 8. LOCAL INSTALL & TEST PROTOCOL

### Step 1: Environment Verification
```bash
# Verify all compliance tooling
python --version             # Python (>= 3.10)
pip --version                # pip
node --version               # Node.js (>= 18.x)
npm --version                # npm
docker --version             # Docker Engine
docker compose version       # Docker Compose
opa version                  # Open Policy Agent
act --version                # GitHub Actions local runner

# Save environment evidence
{
  echo "Python: $(python --version 2>&1)"
  echo "pip: $(pip --version)"
  echo "Node.js: $(node --version)"
  echo "npm: $(npm --version)"
  echo "Docker: $(docker --version)"
  echo "Compose: $(docker compose version)"
  echo "OPA: $(opa version 2>&1 | head -1)"
  echo "act: $(act --version)"
} > .team/evidence/env-versions.txt
```

### Step 2: Install Dependencies
```bash
# Python dependencies (compliance automation, reporting, evidence processing)
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows
pip install -r requirements.txt

# Node.js dependencies (policy tooling, API integrations)
npm install

# OPA policies
opa build policies/ -o bundle.tar.gz

# Verify installs
pip list 2>&1 | tee .team/evidence/pip-deps.txt
npm ls --depth=0 2>&1 | tee .team/evidence/npm-deps.txt
```

### Step 3: Configuration Setup
```bash
# Copy environment template
cp .env.example .env

# Required configuration (NEVER commit to git):
# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (for cloud compliance scanning)
# DATABASE_URL (for compliance data store)
# SENTRY_DSN (for error tracking)
# SMTP_HOST, SMTP_USER, SMTP_PASS (for compliance notifications)
# SLACK_WEBHOOK_URL (for alerting)
# JIRA_API_TOKEN (if using Jira for compliance tracking)

# Verify .env is gitignored
grep -q ".env" .gitignore && echo "OK: .env is gitignored" || echo "FAIL: Add .env to .gitignore"
```

### Step 4: Database & Services Setup
```bash
# Start local services with Docker Compose
docker compose up -d postgres redis elasticsearch kibana

# Run database migrations
python manage.py migrate    # or npm run db:migrate
python manage.py seed       # seed test compliance data

# Verify services
docker compose ps 2>&1 | tee .team/evidence/docker-services.txt
```

### Step 5: Build & Lint
```bash
# Python
python -m mypy src/ 2>&1 | tee .team/evidence/mypy-output.txt
python -m ruff check src/ 2>&1 | tee .team/evidence/ruff-output.txt

# Node.js (if applicable)
npm run build 2>&1 | tee .team/evidence/build-output.txt
npm run lint 2>&1 | tee .team/evidence/lint-output.txt

# OPA policy lint
opa check policies/ 2>&1 | tee .team/evidence/opa-check-output.txt
```

### Step 6: Run Locally & Smoke Test
```bash
# Start the compliance platform
python manage.py runserver &   # or npm run dev &
APP_PID=$!

# Wait for startup
sleep 5

# Health check
curl -s http://localhost:8000/health | jq . > .team/evidence/app-health.txt

# Compliance API smoke tests
curl -s http://localhost:8000/api/v1/controls | jq . > .team/evidence/smoke-controls.txt
curl -s http://localhost:8000/api/v1/evidence | jq . > .team/evidence/smoke-evidence.txt
curl -s http://localhost:8000/api/v1/gaps | jq . > .team/evidence/smoke-gaps.txt
curl -s http://localhost:8000/api/v1/policies/status | jq . > .team/evidence/smoke-policies.txt

# Cleanup
kill $APP_PID
```

---

## 9. ATOMIC COMMIT PROTOCOL

### Commit Convention
All commits follow Conventional Commits with scope tracking:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
PM-TASK: <github-issue-number>
```

### Types
| Type | Usage |
|------|-------|
| `feat` | New control, policy, evidence collector, compliance check |
| `fix` | Control gap fix, policy correction, audit log fix |
| `test` | Control effectiveness test, policy test, mock audit |
| `refactor` | Evidence pipeline optimization, policy refactoring |
| `chore` | Config, dependency version bumps |
| `docs` | Control narrative, compliance report, runbook |
| `security` | Vulnerability remediation, access control change, encryption fix |
| `compliance` | Framework mapping change, regulatory update, control modification |
| `audit` | Audit trail change, log format change, retention update |
| `policy` | OPA/Rego policy addition or modification |

### Scopes
```
soc2, gdpr, ccpa, hipaa, pci-dss, iso27001, nist, cis, controls, evidence,
audit-log, policy, opa, access, encryption, vulnerability, dsar, consent,
ropa, dpia, retention, monitoring, reporting, dashboard
```

### Commit Flow
```bash
# 1. Stage specific files (NEVER git add . or git add -A)
git add policies/soc2/access-control.rego
git add policies/soc2/access-control_test.rego

# 2. Run pre-commit checks
python -m ruff check src/
python -m mypy src/
opa test policies/ -v
# Verify no secrets in staged files
git diff --cached --name-only | xargs grep -l \
  'API_KEY\|SECRET\|PASSWORD\|TOKEN\|ACCESS_TOKEN\|BEARER\|aws_access_key\|sk-\|pk_' \
  && echo "BLOCKED: Secrets detected" && exit 1

# 3. Commit with PM task reference
git commit -m "feat(soc2): add access control policy for CC6.1 logical access

- Implements OPA policy for RBAC validation against SOC2 CC6.1
- Tests cover 14 scenarios: valid roles, privilege escalation, orphaned accounts
- Policy enforces least-privilege principle
- Evidence: .team/evidence/policies/w2-policy-access-control-test.txt

PM-TASK: #12"

# 4. PM updates GitHub issue
gh issue comment 12 --body "Commit $(git rev-parse --short HEAD): SOC2 CC6.1 access control policy implemented. OPA tests: 14/14 PASS. Evidence: .team/evidence/policies/w2-policy-access-control-test.txt"
```

### Pre-Commit Checks
```bash
# Automated pre-commit (TL enforces)
python -m ruff check src/                 # Python lint
python -m mypy src/                       # Python types
opa test policies/ -v                     # OPA policy tests
opa check policies/                       # OPA syntax check
npm run lint                              # JS/TS lint (if applicable)
# Verify no secrets in staged files
git diff --cached --name-only | xargs grep -l \
  'API_KEY\|SECRET\|PASSWORD\|TOKEN\|ACCESS_TOKEN\|BEARER\|aws_access_key\|sk-\|pk_' \
  && echo "BLOCKED: Secrets detected" && exit 1
# Verify no PII in test data
git diff --cached --name-only | xargs grep -l \
  '[0-9]\{3\}-[0-9]\{2\}-[0-9]\{4\}\|[A-Za-z0-9._%+-]*@[A-Za-z0-9.-]*\.[A-Z]\{2,\}' \
  && echo "WARNING: Possible PII detected in staged files — verify before committing"
```

---

## 10. COMPREHENSIVE TESTING MATRIX

### Compliance Test Pyramid
```
              +---------------------+
              |   Mock Audit Tests  |  <- Full auditor walkthrough simulation
              | (End-to-End Audit)  |
              +---------------------+
             /                       \
        +---------------------------+
        |  Integration Tests        |  <- Cross-control, cross-framework
        | (Control Chains, Flows)   |
        +---------------------------+
       /                             \
  +-----------------------------------+
  |       Unit Tests                   |  <- Individual controls, policies
  | (OPA Tests, Control Checks)       |
  +-----------------------------------+
 /                                     \
+---------------------------------------+
|         Static Analysis               |  <- Lint, type-check, security scan
| (Ruff, MyPy, OPA Check, Gitleaks)    |
+---------------------------------------+
```

### Coverage Requirements

| Layer | Minimum Coverage | Tools | Blocking? |
|-------|-----------------|-------|-----------|
| Static Analysis | 0 errors, 0 warnings | Ruff, MyPy, OPA Check | YES |
| Unit Tests | >= 90% control coverage | Pytest, OPA Test | YES |
| Integration Tests | All control chains tested | Pytest, custom harness | YES |
| Mock Audit Tests | All P0 controls walkthrough | Custom audit simulator | YES |
| Security Scan | 0 CRITICAL, 0 HIGH | Trivy, npm audit, pip-audit, Gitleaks | YES |
| Policy Tests | 100% policy rule coverage | OPA Test | YES |
| Gap Analysis | Zero critical/high gaps | Custom gap analyzer | YES |

### QA Agent Testing Protocol

#### Phase 1: STATIC ANALYSIS
```bash
python -m ruff check src/ 2>&1 | tee .team/evidence/ruff-results.txt
python -m mypy src/ 2>&1 | tee .team/evidence/mypy-results.txt
opa check policies/ 2>&1 | tee .team/evidence/opa-check-results.txt
npm run lint 2>&1 | tee .team/evidence/lint-results.txt
```

#### Phase 2: UNIT TESTS — CONTROL EFFECTIVENESS
```bash
# Test individual controls
pytest tests/controls/ --cov=src/controls --cov-report=html --cov-report=term \
  2>&1 | tee .team/evidence/control-unit-tests.txt

# Test OPA policies
opa test policies/ -v --coverage \
  2>&1 | tee .team/evidence/opa-test-results.txt

# Test evidence collectors
pytest tests/evidence/ -v \
  2>&1 | tee .team/evidence/evidence-collector-tests.txt
```

#### Phase 3: INTEGRATION TESTS — CONTROL CHAINS
```bash
# Test cross-control dependencies (e.g., access control -> audit log -> alert)
pytest tests/integration/ -v \
  2>&1 | tee .team/evidence/integration-test-results.txt

# Test evidence pipeline end-to-end
pytest tests/integration/evidence_pipeline/ -v \
  2>&1 | tee .team/evidence/evidence-pipeline-tests.txt

# Test DSAR workflow end-to-end
pytest tests/integration/dsar/ -v \
  2>&1 | tee .team/evidence/dsar-integration-tests.txt
```

#### Phase 4: MOCK AUDIT TESTS
```bash
# Simulate SOC2 auditor walkthrough
python tests/mock_audit/soc2_walkthrough.py \
  2>&1 | tee .team/evidence/mock-audit-soc2.txt

# Simulate GDPR supervisory authority inquiry
python tests/mock_audit/gdpr_inquiry.py \
  2>&1 | tee .team/evidence/mock-audit-gdpr.txt

# Simulate evidence request fulfillment
python tests/mock_audit/evidence_request.py \
  2>&1 | tee .team/evidence/mock-audit-evidence-request.txt
```

#### Phase 5: SECURITY TESTS
```bash
npm audit --audit-level=high 2>&1 | tee .team/evidence/npm-audit.txt
pip-audit 2>&1 | tee .team/evidence/pip-audit.txt
gitleaks detect --source . 2>&1 | tee .team/evidence/gitleaks-results.txt
trivy fs --severity HIGH,CRITICAL . 2>&1 | tee .team/evidence/trivy-fs-scan.txt

# Verify no secrets or PII in codebase
grep -r "sk-\|pk_\|Bearer \|access_token=\|password=" src/ --include="*.py" --include="*.ts" \
  2>&1 | tee .team/evidence/secrets-scan.txt
echo "Expected: 0 matches (all secrets from env vars)" >> .team/evidence/secrets-scan.txt
```

#### Phase 6: GAP ANALYSIS
```bash
# Run gap analysis against target frameworks
python src/gap_analysis/run_gap_analysis.py --frameworks soc2,gdpr,iso27001 \
  2>&1 | tee .team/evidence/gap-analysis-results.txt

# Verify zero critical/high gaps
python -c "
import json
with open('.team/evidence/gaps/gap-matrix.json') as f:
    gaps = json.load(f)
    critical = [g for g in gaps if g['severity'] in ('CRITICAL', 'HIGH')]
    print(f'Critical/High gaps: {len(critical)}')
    for g in critical:
        print(f'  - {g[\"framework\"]}/{g[\"control\"]}: {g[\"description\"]}')
    print(f'Result: {\"FAIL\" if critical else \"PASS\"}')" \
  > .team/evidence/gaps/gap-severity-check.txt 2>&1
```

---

## 11. GITHUB ACTIONS — LOCAL TESTING WITH `act`

### Install `act` for Local CI
```bash
# macOS
brew install act
# Windows
scoop install act
# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Verify
act --version
```

### Compliance CI Workflow (`.github/workflows/compliance-ci.yml`)
```yaml
name: Compliance & Governance CI

on: [push, pull_request]

jobs:
  lint-python:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: python -m ruff check src/
      - run: python -m mypy src/

  lint-policies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install OPA
        run: |
          curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64_static
          chmod +x opa && sudo mv opa /usr/local/bin/
      - run: opa check policies/
      - run: opa test policies/ -v --coverage

  test-controls:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: pytest tests/controls/ --cov=src/controls --cov-report=xml --junitxml=control-results.xml
      - uses: actions/upload-artifact@v4
        with:
          name: control-coverage
          path: coverage/

  test-integration:
    runs-on: ubuntu-latest
    needs: [lint-python, lint-policies, test-controls]
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: compliance_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
      elasticsearch:
        image: elasticsearch:8.12.0
        env:
          discovery.type: single-node
          xpack.security.enabled: false
        ports:
          - 9200:9200
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: python manage.py migrate
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/compliance_test
      - run: pytest tests/integration/ -v
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/compliance_test
          ELASTICSEARCH_URL: http://localhost:9200

  test-mock-audit:
    runs-on: ubuntu-latest
    needs: [test-integration]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: python tests/mock_audit/soc2_walkthrough.py
      - run: python tests/mock_audit/gdpr_inquiry.py

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install pip-audit && pip-audit -r requirements.txt
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  build:
    runs-on: ubuntu-latest
    needs: [test-mock-audit, security]
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - run: docker build -t compliance-platform:ci .
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'compliance-platform:ci'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'
```

### Run Locally with `act`
```bash
# Run full CI
act push 2>&1 | tee .team/evidence/act-ci-output.txt

# Run specific job
act push -j lint-python 2>&1 | tee .team/evidence/act-lint-python.txt
act push -j lint-policies 2>&1 | tee .team/evidence/act-lint-policies.txt
act push -j test-controls 2>&1 | tee .team/evidence/act-test-controls.txt
act push -j test-integration 2>&1 | tee .team/evidence/act-test-integration.txt
act push -j test-mock-audit 2>&1 | tee .team/evidence/act-test-mock-audit.txt
act push -j security 2>&1 | tee .team/evidence/act-security.txt
act push -j build 2>&1 | tee .team/evidence/act-build.txt

# Verify all passed
grep -c "Job succeeded" .team/evidence/act-ci-output.txt > .team/evidence/act-summary.txt
echo "Expected: 7 jobs" >> .team/evidence/act-summary.txt
```

---

## 12. PM KANBAN — REAL-TIME TRACKING

### GitHub Projects V2 Setup
```bash
# Create project board
gh project create --title "Compliance & Governance - $(date +%Y-%m-%d)" --owner @me

# Add custom fields
gh project field-create <PROJECT_ID> --name "Wave" --data-type "SINGLE_SELECT" \
  --single-select-options "Wave 1,Wave 1.25,Wave 1.5,Wave 2,Wave 2.5,Wave 3,Wave 3.5,Wave 4,Wave 5"

gh project field-create <PROJECT_ID> --name "Framework" --data-type "SINGLE_SELECT" \
  --single-select-options "SOC2,GDPR,CCPA,HIPAA,PCI-DSS,ISO-27001,NIST-CSF,CIS,Cross-Framework"

gh project field-create <PROJECT_ID> --name "Evidence" --data-type "TEXT"
gh project field-create <PROJECT_ID> --name "Control Status" --data-type "SINGLE_SELECT" \
  --single-select-options "Not Started,Mapped,Evidenced,Tested,Verified,Gap Identified"
gh project field-create <PROJECT_ID> --name "Gap Severity" --data-type "SINGLE_SELECT" \
  --single-select-options "None,Low,Medium,High,Critical"
gh project field-create <PROJECT_ID> --name "Audit Ready" --data-type "SINGLE_SELECT" \
  --single-select-options "No,Partial,Yes"
```

### Real-Time Updates
PM updates issue status as work progresses:
```bash
# Move task to In Progress
gh issue edit <NUMBER> --add-label "status:in-progress" --remove-label "status:todo"

# Move task to Done with evidence
gh issue comment <NUMBER> --body "DONE. Control CC6.1 mapped and evidenced. OPA policy: 14/14 tests PASS. Gap analysis: zero findings. Evidence: .team/evidence/soc2/w2-soc2-cc6.1-evidence.json"
gh issue edit <NUMBER> --add-label "status:done" --remove-label "status:in-progress"
```

### Label Taxonomy
```bash
# Create all labels
gh label create "framework:soc2" --color "1E90FF" --description "SOC2 Type II controls"
gh label create "framework:gdpr" --color "008000" --description "GDPR / EU Privacy"
gh label create "framework:ccpa" --color "228B22" --description "CCPA / CPRA"
gh label create "framework:hipaa" --color "FF4500" --description "HIPAA"
gh label create "framework:pci-dss" --color "FFD700" --description "PCI DSS v4.0"
gh label create "framework:iso27001" --color "4B0082" --description "ISO 27001"
gh label create "framework:nist" --color "8B0000" --description "NIST CSF"
gh label create "framework:cis" --color "696969" --description "CIS Benchmarks"
gh label create "domain:controls" --color "7B68EE" --description "Control mapping & evidence"
gh label create "domain:privacy" --color "32CD32" --description "Privacy & data protection"
gh label create "domain:audit" --color "FF6347" --description "Audit trails & logging"
gh label create "domain:policy" --color "FF69B4" --description "Policy automation"
gh label create "domain:security" --color "DC143C" --description "Security compliance"
gh label create "domain:docs" --color "20B2AA" --description "Documentation & reporting"
gh label create "severity:critical" --color "B60205" --description "Critical gap or finding"
gh label create "severity:high" --color "D93F0B" --description "High severity"
gh label create "severity:medium" --color "FBCA04" --description "Medium severity"
gh label create "severity:low" --color "0E8A16" --description "Low severity"
```

### Kanban Columns
| Column | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| Backlog | Issue created with framework + domain labels | Assigned to wave |
| Todo | Assigned to agent in current wave | Agent starts work |
| In Progress | Agent actively working | Deliverable + evidence complete |
| In Review | Evidence submitted, tests pass | TL reviews and approves |
| Done | TL approved, all tests pass, evidence verified | Issue closed |

---

## 13. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| **Evidence Gate** | Every task | Evidence artifact exists in `.team/evidence/` | Block task completion |
| **SOC2 Control Gate** | After SOC2 | All applicable SOC2 controls mapped and evidenced | Re-spawn SOC2 |
| **Data Flow Gate** | After PRIVACY | Data flow diagram covers all PII touchpoints | Re-spawn PRIVACY |
| **Audit Log Integrity Gate** | After AUDIT | Audit logs are tamper-proof (hash chain verified) | Re-spawn AUDIT |
| **Policy Test Gate** | After POLICY | All policies pass automated testing (OPA test 100%) | Re-spawn POLICY |
| **Security Scan Gate** | After SECCOMP | Zero critical/high security findings | Re-spawn SECCOMP |
| **Documentation Gate** | After DOCS | Compliance documentation complete for target frameworks | Re-spawn DOCS |
| **Secrets Gate** | Before commit | No API keys, tokens, credentials in staged files | Block commit, alert TL |
| **CI Gate** | Before release | `act` local CI run passes all jobs | Fix workflow, re-run |
| **Gap Analysis Gate** | After QA | Zero critical/high gaps remaining in gap matrix | Re-spawn engineers |
| **Mock Audit Gate** | After QA | Mock audit passes with zero major findings | Re-spawn responsible agents |
| **Release Ready** | Before release | QA PASS + all controls evidenced + zero critical gaps | Resolve blockers |
| **Release Approved** | After RM | `RELEASE_SIGNOFF.md` approved by TL | TL lists blocking items |

---

## 14. `.team/` DIRECTORY LAYOUT

```
.team/
+-- PROJECT_CHARTER.md
+-- MILESTONES.md
+-- KANBAN.md
+-- TIMELINE.md
+-- RISK_REGISTER.md
+-- DECISION_LOG.md
+-- retros/
|   +-- RETRO_WAVE_1.md       (Wave 1 retrospective)
|   +-- RETRO_WAVE_2.md       (Wave 2 retrospective)
+-- reviews/
|   +-- CODE_REVIEW_WAVE_2.md (Code review report)
+-- learnings/
|   +-- INDEX.md              (Searchable learning index)
+-- rollback/
|   +-- ROLLBACK_PLAN.md      (Current rollback plan)
+-- contracts/
|   +-- CONTRACT_*.md         (Cross-team handoff contracts)

+-- plans/
|   +-- PLAN_A.md          (PM alternative plan A)
|   +-- PLAN_B.md          (PM alternative plan B)
|   +-- PLAN_C.md          (PM alternative plan C, optional)
|   +-- VERDICT.md         (Judge evaluation and recommendation)
+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- env-versions.txt
|   +-- docker-build.txt
|   +-- docker-services.txt
|   +-- act-ci-output.txt
|   +-- soc2/
|   |   +-- iam-users.json
|   |   +-- iam-policies.json
|   |   +-- credential-report.csv
|   |   +-- kms-keys.json
|   |   +-- rds-encryption.json
|   |   +-- w2-soc2-control-matrix.csv
|   |   +-- w2-soc2-evidence-screenshots/
|   +-- privacy/
|   |   +-- ropa-validation.txt
|   |   +-- data-flow-completeness.txt
|   |   +-- consent-records-sample.json
|   |   +-- dsar-response-test.json
|   +-- audit/
|   |   +-- hash-chain-verification.txt
|   |   +-- log-integrity-proof.txt
|   |   +-- sample-audit-entries.jsonl
|   +-- policies/
|   |   +-- opa-test-results.txt
|   |   +-- opa-eval-output.txt
|   |   +-- ci-cd-gate-test.txt
|   +-- security/
|   |   +-- trivy-host-scan.txt
|   |   +-- trivy-image-scan.txt
|   |   +-- lynis-audit.txt
|   |   +-- npm-audit.txt
|   |   +-- pip-audit.txt
|   |   +-- gitleaks-results.txt
|   |   +-- cis-benchmark-results.txt
|   +-- gaps/
|   |   +-- gap-matrix.json
|   |   +-- gap-severity-check.txt
|   |   +-- remediation-tracker.csv
|   +-- lint-results.txt
|   +-- mypy-results.txt
|   +-- control-unit-tests.txt
|   +-- integration-test-results.txt
|   +-- mock-audit-soc2.txt
|   +-- mock-audit-gdpr.txt
+-- soc2/
|   +-- CONTROL_MATRIX.md
|   +-- EVIDENCE_COLLECTION.md
|   +-- TSC_MAPPING.md
|   +-- AUDIT_READINESS.md
|   +-- CONTINUOUS_MONITORING.md
|   +-- REMEDIATION_TRACKER.md
+-- privacy/
|   +-- ROPA.md
|   +-- DATA_FLOW_MAP.md
|   +-- CONSENT_MANAGEMENT.md
|   +-- DSAR_AUTOMATION.md
|   +-- DPIA_TEMPLATE.md
|   +-- COOKIE_COMPLIANCE.md
|   +-- CROSS_BORDER_TRANSFERS.md
+-- audit/
|   +-- AUDIT_LOG_ARCHITECTURE.md
|   +-- HASH_CHAIN_DESIGN.md
|   +-- EVENT_SOURCING.md
|   +-- LOG_AGGREGATION.md
|   +-- RETENTION_POLICY.md
|   +-- INTEGRITY_VERIFICATION.md
+-- policies/
|   +-- OPA_POLICIES.md
|   +-- POLICY_TESTING.md
|   +-- CI_CD_GATES.md
|   +-- INFRA_COMPLIANCE.md
|   +-- POLICY_EXCEPTIONS.md
|   +-- DRIFT_DETECTION.md
+-- security/
|   +-- CIS_BENCHMARK.md
|   +-- VULNERABILITY_MANAGEMENT.md
|   +-- PENTEST_COORDINATION.md
|   +-- ACCESS_CONTROL_REVIEW.md
|   +-- ENCRYPTION_VALIDATION.md
|   +-- SECURITY_METRICS.md
+-- docs/
|   +-- DOCUMENT_TEMPLATES.md
|   +-- CONTROL_NARRATIVE_TEMPLATE.md
|   +-- EVIDENCE_PACKAGE_TEMPLATE.md
|   +-- BOARD_REPORT_TEMPLATE.md
|   +-- COMPLIANCE_CALENDAR.md
|   +-- TRAINING_MATERIALS.md
+-- qa/
|   +-- TEST_STRATEGY.md
|   +-- CONTROL_EFFECTIVENESS_TESTS.md
|   +-- GAP_ANALYSIS.md
|   +-- MOCK_AUDIT_REPORT.md
|   +-- POLICY_VALIDATION_TESTS.md
|   +-- LOG_INTEGRITY_TESTS.md
|   +-- DSAR_ACCURACY_TESTS.md
|   +-- QA_SIGNOFF.md
+-- releases/
|   +-- RELEASE_CHECKLIST.md
|   +-- CHANGELOG.md
|   +-- EVIDENCE_PACKAGE.md
|   +-- AUDIT_SUBMISSION.md
|   +-- COMPLIANCE_ATTESTATION.md
|   +-- REGULATORY_FILING.md
|   +-- RELEASE_SIGNOFF.md
```

---

## 15. REPORTING SYSTEM

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
  - Includes evidence: control mapping status, gap analysis summary, policy test results
  - Slide for each compliance framework with control coverage and evidence status
  - Audit readiness score, gap remediation progress, policy pass rate
  - Security posture dashboard, vulnerability SLA compliance
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
  - Compliance posture matrix (green/yellow/red per framework per control domain)
  - Per-agent task completion with evidence links
  - KPI dashboard: controls mapped, evidence collected, gaps remediated, audit readiness
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion
- Reports include: framework coverage matrix, control evidence status, gap analysis heatmap, policy enforcement metrics, security scan results, audit trail integrity status, DSAR response metrics

### Compliance KPI Dashboard (in reports)
| KPI | Target | Measurement |
|-----|--------|-------------|
| Controls Mapped | 100% of applicable controls | Control matrix coverage |
| Evidence Collected | 100% of mapped controls | Evidence artifact count vs. control count |
| Gaps Identified | All identified, categorized | Gap matrix completeness |
| Gaps Remediated | 100% critical/high, >= 90% medium | Remediation tracker |
| Policy Pass Rate | 100% | OPA test results |
| Audit Log Integrity | 100% hash chain valid | Hash chain verification output |
| Security Scan Clean | 0 critical/high | Trivy + npm audit + pip-audit |
| DSAR Response Time | < 30 days (GDPR requirement) | DSAR pipeline metrics |
| Mock Audit Score | >= 95% controls pass | Mock audit walkthrough results |
| Compliance Posture Score | >= 90/100 | Weighted aggregate across all frameworks |

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Recovery
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Control mapping conflict**: Capture conflicting interpretations, escalate to TL for framework-specific resolution
- **Evidence collection failure**: Capture error (API timeout, permission denied, service unavailable), retry with fallback evidence method, document as gap if unresolvable
- **Policy test failure**: Capture OPA error output, re-spawn POLICY with error context and failing test cases
- **Audit log integrity break**: CRITICAL — halt all work, capture break point evidence, re-spawn AUDIT with forensic investigation context
- **Gap remediation loop**: If same gap fails remediation 3 times, escalate to TL with full context, consider accepting risk with documented rationale
- **Framework interpretation dispute**: Capture both interpretations with regulatory citations, TL makes final call with documented rationale in DECISION_LOG.md
- **Mock audit failure**: Capture auditor simulation findings, categorize by severity, re-spawn responsible agents with specific finding context
- **Regulatory update mid-project**: Capture regulatory change details, re-spawn affected agents with updated requirements, update gap analysis

### Session Commands

| Command | Action |
|---------|--------|
| `--team compliance --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE + compliance posture matrix |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team learnings` | Show captured learnings from .team/learnings/ |
| `team deps` | Spawn DEPGUARD agent to audit dependencies |
| `team retro` | Spawn RETRO agent to analyze last completed wave |
| `team review` | Spawn CR agent to review current code changes |
| `team judge` | Spawn Judge to evaluate current plans in `.team/plans/` |
| `team gate check` | Run all quality gate checks |
| `team posture` | Show current compliance posture score across all frameworks |
| `team gaps` | Show gap analysis summary with severity breakdown |
| `team evidence` | Show evidence collection status per control |
| `team audit-ready` | Show audit readiness checklist with status |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

## 17. REGULATORY FRAMEWORK REFERENCE

### Supported Frameworks

| Framework | Version | Scope | Primary Agent |
|-----------|---------|-------|---------------|
| SOC2 Type II | 2017 TSC (2022 update) | Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy | SOC2 |
| GDPR | Regulation (EU) 2016/679 | EU/EEA personal data processing | PRIVACY |
| CCPA/CPRA | California Civil Code 1798 | California consumer personal information | PRIVACY |
| ISO 27001 | ISO/IEC 27001:2022 | Information security management systems | SECCOMP |
| NIST CSF | NIST CSF 2.0 (2024) | Cybersecurity risk management (Govern, Identify, Protect, Detect, Respond, Recover) | SECCOMP |
| CIS Benchmarks | v8.0 | System hardening baselines | SECCOMP |
| PCI DSS | v4.0.1 | Payment card data security | SECCOMP + SOC2 |
| HIPAA | 45 CFR Parts 160, 164 | Protected health information | PRIVACY + SOC2 |
| LGPD | Lei 13.709/2018 | Brazilian personal data protection | PRIVACY |

### Cross-Framework Control Mapping

Controls are mapped across frameworks to maximize evidence reuse:

```
SOC2 CC6.1 (Logical Access) <-> ISO 27001 A.9.2 <-> NIST PR.AC-1 <-> CIS Control 6
SOC2 CC7.2 (System Monitoring) <-> ISO 27001 A.12.4 <-> NIST DE.CM-1 <-> CIS Control 8
SOC2 CC8.1 (Change Management) <-> ISO 27001 A.12.1.2 <-> NIST PR.IP-3 <-> CIS Control 4
GDPR Art. 30 (ROPA) <-> SOC2 P1.1 <-> ISO 27001 A.8.2 <-> NIST ID.AM-5
GDPR Art. 32 (Security of Processing) <-> SOC2 CC6 <-> ISO 27001 A.10 <-> NIST PR.DS
```

### Audit Cycle Reference

| Framework | Audit Type | Frequency | Lead Time |
|-----------|-----------|-----------|-----------|
| SOC2 Type II | External audit (CPA firm) | Annual (12-month observation) | 3-6 months prep |
| GDPR | Supervisory authority audit | On-demand | Continuous readiness |
| ISO 27001 | Certification audit (Stage 1 + Stage 2) | Initial + annual surveillance | 6-12 months prep |
| PCI DSS | QSA assessment or SAQ | Annual | 3-6 months prep |
| HIPAA | OCR audit or self-assessment | On-demand + breach triggers | Continuous readiness |

### Regulatory Update Monitoring

The team monitors regulatory changes via:
- IAPP (International Association of Privacy Professionals) bulletins
- AICPA Trust Service Criteria updates
- NIST publications and drafts
- CIS Benchmark release notes
- PCI SSC document library
- National DPA (Data Protection Authority) guidance

When a regulatory update is detected mid-project:
1. DOCS captures the change details and affected controls
2. TL assesses impact scope and updates DECISION_LOG.md
3. Affected agents are re-spawned with updated requirements
4. QA re-runs gap analysis against updated framework

---

## 18. GLOSSARY & ACRONYMS

| Acronym | Full Term | Context |
|---------|-----------|---------|
| AICPA | American Institute of Certified Public Accountants | SOC2 standard body |
| CAB | Change Advisory Board | Change management approval body |
| CCPA | California Consumer Privacy Act | US state privacy law |
| CIS | Center for Internet Security | Security benchmarking organization |
| CMP | Consent Management Platform | Cookie/tracking consent tool |
| COSO | Committee of Sponsoring Organizations | Internal control framework |
| CPRA | California Privacy Rights Act | CCPA amendment |
| DPA | Data Protection Authority | National GDPR enforcement body |
| DPIA | Data Protection Impact Assessment | GDPR Art. 35 risk assessment |
| DSAR | Data Subject Access Request | GDPR Art. 15 data access right |
| GDPR | General Data Protection Regulation | EU privacy regulation |
| HIPAA | Health Insurance Portability and Accountability Act | US health data law |
| IAM | Identity and Access Management | User/role access systems |
| LGPD | Lei Geral de Protecao de Dados | Brazilian privacy law |
| NIST CSF | National Institute of Standards and Technology Cybersecurity Framework | US cybersecurity framework |
| OCR | Office for Civil Rights | HIPAA enforcement body |
| OPA | Open Policy Agent | Policy-as-code engine |
| PCI DSS | Payment Card Industry Data Security Standard | Card payment security |
| PIA | Privacy Impact Assessment | Generic term for privacy risk analysis |
| PII | Personally Identifiable Information | Data identifying an individual |
| QSA | Qualified Security Assessor | PCI DSS auditor |
| RBAC | Role-Based Access Control | Access permission model |
| RFC | Request for Change | Change management document |
| ROPA | Records of Processing Activities | GDPR Art. 30 documentation |
| SAQ | Self-Assessment Questionnaire | PCI DSS self-assessment |
| SCC | Standard Contractual Clauses | GDPR cross-border transfer mechanism |
| SOC2 | System and Organization Controls 2 | AICPA audit standard |
| TCF | Transparency and Consent Framework | IAB cookie consent standard |
| TSC | Trust Service Criteria | SOC2 control criteria |
| WORM | Write Once Read Many | Immutable storage model |

---

*Compliance & Governance Team v3.0 — Amenthyx AI Teams*
*11 Roles | 5 Waves | 14 Gates | Evidence-Driven | Strategy-Driven | GitHub-Integrated*
*Enhanced: Evidence Protocol | Local Install | Atomic Commits | Testing Matrix | Local CI | Real-Time Kanban*
*Domains: SOC2 | GDPR/Privacy | Audit Trails | Policy Automation | Security Compliance | Documentation | Governance*