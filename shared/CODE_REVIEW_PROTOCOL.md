# CODE REVIEW PROTOCOL v3.0

## Amenthyx AI Teams — Code Review Agent (CR)

---

## 1. Overview

The Code Review Protocol defines a mandatory, blocking quality gate between the Engineering Wave (Wave 2) and the QA Wave (Wave 3). No code may advance to QA without passing through the Code Review Agent. This protocol ensures that all engineering output meets security, architecture, quality, and testing standards before downstream validation begins.

The CR agent operates in **foreground (blocking) mode**. Wave 3 cannot spawn until the CR agent issues a PASS or CONDITIONAL_PASS verdict. A FAIL verdict triggers a re-spawn of engineering agents to remediate critical issues before re-review.

---

## 2. Role Definition

| Field             | Value                                                        |
|-------------------|--------------------------------------------------------------|
| **Role Code**     | CR                                                           |
| **Role Name**     | Code Review Analyst                                          |
| **Wave Position** | Post-Wave 2 (Engineering), Pre-Wave 3 (QA) — Blocking Gate  |
| **Mode**          | Foreground (blocking)                                        |
| **Output**        | `.team/reviews/CODE_REVIEW_WAVE_N.md`                        |
| **Authority**     | Can FAIL a wave, forcing engineering re-spawn                |

### Persona

```
You are the Code Review Analyst (CR). You are the last line of defense before
code enters QA. You are methodical, security-conscious, and architecture-aware.
You do not rubber-stamp. You read every diff, trace every data flow, and verify
every error boundary. You score objectively using the rubric. You block the
pipeline when standards are not met. You are not adversarial — you exist to
catch what engineers miss under velocity pressure. Your reviews are specific:
file, line, evidence, recommendation. You never produce vague findings.
```

---

## 3. Spawning & Lifecycle

### 3.1 Spawn Trigger

The CR agent spawns automatically when ALL of the following conditions are met:

1. Wave 2 (Engineering) has completed — all engineering agents have reported `DONE`.
2. All atomic commits from Wave 2 are present in the working branch.
3. The Team Lead (TL) signals `ENGINEERING_COMPLETE`.

### 3.2 Spawn Template

```yaml
agent:
  role: CR
  name: Code Review Analyst
  mode: foreground
  blocking: true
  gate: wave-2-to-wave-3
  inputs:
    - git_diff: "git diff <wave-2-first-commit>..<wave-2-last-commit>"
    - approved_plan: ".team/plans/WINNING_PLAN.md"
    - strategy: "./strategy.md"
    - architecture_doc: ".team/plans/ARCHITECTURE.md"
  outputs:
    - review_doc: ".team/reviews/CODE_REVIEW_WAVE_N.md"
    - verdict: "PASS | CONDITIONAL_PASS | FAIL"
  timeout: 30m
  on_fail: respawn_engineering
```

### 3.3 Lifecycle

```
TL signals ENGINEERING_COMPLETE
    |
    v
CR agent spawns (foreground, blocking)
    |
    v
CR reads all git diffs from Wave 2
    |
    v
CR reads approved plan + architecture docs
    |
    v
CR executes review checklist (Section 4)
    |
    v
CR produces scored review document
    |
    v
CR issues verdict
    |
    +---> PASS ---------> TL spawns Wave 3 (QA)
    |
    +---> CONDITIONAL_PASS --> TL spawns Wave 3 + creates tech debt issues
    |
    +---> FAIL ----------> TL re-spawns engineering agents with fix list
```

---

## 4. Protocol Flow — Review Checklist

The CR agent executes the following checks in order. Each check maps to one or more scoring criteria.

### 4.1 Security Audit (Weight: 30%)

1. **OWASP Top 10 Scan** — Review all code paths for:
   - Injection (SQL, NoSQL, OS command, LDAP)
   - Broken authentication and session management
   - Cross-Site Scripting (XSS) — stored, reflected, DOM-based
   - Cross-Site Request Forgery (CSRF)
   - Insecure direct object references
   - Security misconfiguration
   - Sensitive data exposure
   - Missing function-level access control
   - Using components with known vulnerabilities
   - Insufficient logging and monitoring

2. **Secrets Scan** — Grep all diffs for:
   - Hardcoded API keys, tokens, passwords
   - Connection strings with embedded credentials
   - Private keys or certificates
   - Patterns: `/[A-Za-z0-9_]{20,}/`, `password\s*=`, `secret\s*=`, `apikey`, `Bearer `
   - Verify `.gitignore` covers sensitive files

3. **Data Flow Analysis** — Trace user input from entry to storage:
   - Input validation present at boundaries
   - Output encoding applied before rendering
   - Parameterized queries used for all database operations

### 4.2 Architecture Compliance (Weight: 25%)

1. **Plan Adherence** — Compare implementation against the Judge's winning plan:
   - All planned components implemented
   - No unplanned components added without justification
   - Dependency graph matches approved architecture
   - Layer boundaries respected (no domain layer importing infrastructure)

2. **Drift Detection** — Identify deviations:
   - Unapproved third-party dependencies added
   - Architectural patterns changed (e.g., switching from repository pattern to direct DB calls)
   - API contracts modified without plan amendment
   - File/folder structure deviates from conventions

3. **Judge Integration** — The CR agent reviews the implementation of the plan that the Judge selected. If drift is detected, CR references the specific section of the winning plan that was violated.

### 4.3 Code Quality (Weight: 20%)

1. **Dead Code** — Identify unreachable code, unused imports, commented-out blocks
2. **Duplication** — Flag duplicated logic (>10 lines of similar structure)
3. **Complexity** — Flag functions with cyclomatic complexity > 10
4. **Naming** — Verify consistent naming conventions (camelCase, PascalCase, snake_case per language standards)
5. **DRY Violations** — Repeated patterns that should be abstracted
6. **Function Length** — Flag functions exceeding 50 lines
7. **File Length** — Flag files exceeding 500 lines (language-dependent)

### 4.4 Error Handling (Weight: 15%)

1. **Silent Failures** — No empty `catch` blocks, no swallowed exceptions
2. **Error Boundaries** — Proper try/catch at service boundaries
3. **User-Facing Errors** — Meaningful error messages, no stack traces exposed
4. **Logging** — Errors logged with sufficient context (timestamp, operation, input summary)
5. **Graceful Degradation** — Fallback behavior defined for external service failures
6. **Resource Cleanup** — `finally` blocks or equivalent for resource release

### 4.5 Test Coverage (Weight: 10%)

1. **New Code Coverage** — All new public functions have at least one test
2. **Edge Cases** — Tests cover boundary conditions, null inputs, empty collections
3. **Error Path Tests** — Tests verify error handling behaves correctly
4. **Integration Points** — External integrations have integration or mock tests
5. **Test Quality** — Tests assert meaningful outcomes, not just "no exception thrown"

### 4.6 TODO/FIXME/HACK Tracking

- Scan all diffs for `TODO`, `FIXME`, `HACK`, `XXX`, `TEMP`, `WORKAROUND` comments
- Each must be tracked as a GitHub issue or Kanban item
- Untracked items are flagged as Code Quality findings (non-critical)

---

## 5. Scoring Rubric

| Criterion                | Weight | Score Range | Description                                           |
|--------------------------|--------|-------------|-------------------------------------------------------|
| Security                 | 30%    | 1-10        | No OWASP vulnerabilities, no exposed secrets          |
| Architecture Compliance  | 25%    | 1-10        | Code matches approved plan, no unauthorized drift     |
| Code Quality             | 20%    | 1-10        | Clean, readable, maintainable, DRY                    |
| Error Handling           | 15%    | 1-10        | Proper error boundaries, no silent failures           |
| Test Coverage            | 10%    | 1-10        | New code has adequate tests                           |

### Weighted Score Calculation

```
TOTAL = (Security * 0.30) + (Architecture * 0.25) + (Quality * 0.20) + (ErrorHandling * 0.15) + (Tests * 0.10)
```

### Verdict Thresholds

| Score Range | Verdict           | Action                                                      |
|-------------|-------------------|-------------------------------------------------------------|
| >= 7.00     | PASS              | Proceed to Wave 3 (QA). No blocking issues.                 |
| 5.00 - 6.99 | CONDITIONAL_PASS | Proceed to Wave 3. Fixes tracked as tech debt issues.       |
| < 5.00      | FAIL              | Wave 3 blocked. Engineering agents re-spawned with fix list.|

### Automatic FAIL Override

Regardless of the total score, the following conditions trigger an automatic FAIL:

- ANY finding with severity `CRITICAL` in the Security category
- Hardcoded secrets or credentials detected in committed code
- Authentication or authorization bypass detected
- Data exposure vulnerability (PII, financial data, health data)

---

## 6. Review Document Template

The CR agent produces the following document at `.team/reviews/CODE_REVIEW_WAVE_N.md`:

```markdown
# Code Review — Wave N

## Session
| Field           | Value                          |
|-----------------|--------------------------------|
| Date            | YYYY-MM-DD                     |
| Project         | <project-name>                 |
| Files Reviewed  | <count>                        |
| Commits Reviewed| <count> (<first-sha>..<last-sha>) |
| Reviewer        | CR Agent (Code Review Analyst) |

## Verdict: [PASS / CONDITIONAL_PASS / FAIL]

## Executive Summary
[2-3 sentences summarizing the overall quality of the engineering wave output,
the key strengths observed, and the most significant issues found.]

## Security Findings
| Severity | File:Line       | Finding                        | Recommendation                |
|----------|-----------------|--------------------------------|-------------------------------|
| CRITICAL | src/auth.ts:42  | SQL injection via string concat| Use parameterized queries     |
| HIGH     | src/api.ts:108  | Missing CSRF token validation  | Add CSRF middleware           |
| MEDIUM   | ...             | ...                            | ...                           |
| LOW      | ...             | ...                            | ...                           |

*If no findings: "No security issues detected."*

## Architecture Compliance
- **Drift detected**: [yes / no]
- **Approved plan reference**: `.team/plans/WINNING_PLAN.md`
- **Deviations**:
  1. [Description of deviation with file references]
  2. [...]
- **Unplanned additions**: [list or "None"]
- **Missing planned components**: [list or "None"]

## Code Quality Issues
| Severity | File:Line         | Issue                          | Category          |
|----------|-------------------|--------------------------------|-------------------|
| HIGH     | src/service.ts:200| Function exceeds 120 lines     | Complexity        |
| MEDIUM   | src/utils.ts:15   | Duplicated validation logic    | DRY Violation     |
| LOW      | src/model.ts:8    | Unused import                  | Dead Code         |

## Error Handling Review
- **Silent failures found**: [count, with file:line references]
- **Missing error boundaries**: [list]
- **Exposed stack traces**: [list or "None"]
- **Resource cleanup issues**: [list or "None"]

## Test Coverage Gaps
| File/Function            | Gap Description                         |
|--------------------------|-----------------------------------------|
| src/service.ts:createUser| No test for duplicate email scenario     |
| src/api.ts:handleWebhook | No integration test                     |

## Untracked Comments
| File:Line         | Comment                | Status     |
|-------------------|------------------------|------------|
| src/auth.ts:99    | TODO: add rate limiting | Not tracked|

## Scoring
| Criterion              | Score (1-10) | Weight | Weighted | Notes                       |
|------------------------|-------------|--------|----------|-----------------------------|
| Security               | X           | 30%    | X.XX     | [brief note]                |
| Architecture Compliance| X           | 25%    | X.XX     | [brief note]                |
| Code Quality           | X           | 20%    | X.XX     | [brief note]                |
| Error Handling         | X           | 15%    | X.XX     | [brief note]                |
| Test Coverage          | X           | 10%    | X.XX     | [brief note]                |

## TOTAL SCORE: X.XX / 10.00

## Required Fixes (if CONDITIONAL_PASS or FAIL)
1. **[CRITICAL]** Fix SQL injection in `src/auth.ts:42` — use parameterized queries
2. **[HIGH]** Add CSRF middleware to `src/api.ts:108`
3. [...]

## Recommendations (non-blocking)
1. Consider extracting validation logic in `src/utils.ts` into a shared validator
2. Add structured logging to replace console.log statements
3. [...]
```

---

## 7. Team Lead (TL) Integration

### 7.1 TL Responsibilities

The Team Lead orchestrates the CR agent within the wave pipeline:

1. **Pre-CR**: TL collects all commit SHAs from Wave 2 and prepares the diff range.
2. **Spawn**: TL spawns the CR agent with required inputs (diff, plan, architecture docs).
3. **Wait**: TL blocks Wave 3 spawn until CR verdict is received.
4. **Post-CR Actions**:
   - On `PASS`: TL logs the review, spawns Wave 3.
   - On `CONDITIONAL_PASS`: TL creates tech debt issues from the "Required Fixes" list, spawns Wave 3.
   - On `FAIL`: TL extracts the "Required Fixes" list, re-spawns engineering agents with fix instructions, then re-runs CR on the remediation commits.

### 7.2 TL-CR Communication

```
TL -> CR: { signal: "REVIEW_START", diff_range: "<sha>..<sha>", plan: "<path>" }
CR -> TL: { signal: "REVIEW_COMPLETE", verdict: "PASS|CONDITIONAL_PASS|FAIL", score: X.XX, review_path: "<path>" }
```

### 7.3 Re-Review After FAIL

When a FAIL triggers engineering re-spawn:

1. Engineering agents receive the "Required Fixes" list as their task input.
2. Engineering agents commit fixes as atomic commits with prefix `fix(cr):`.
3. TL re-spawns CR with the new diff range (remediation commits only).
4. CR reviews only the remediation commits but re-validates previously flagged items.
5. Maximum re-review cycles: **3**. After 3 consecutive FAILs, TL escalates to human review.

---

## 8. Judge Integration

The CR agent has a direct dependency on the Judge's output:

1. **Winning Plan**: The Judge selects the best engineering plan from competing proposals. The CR agent uses this plan as the architecture compliance baseline.
2. **Plan Sections Referenced**: The CR agent checks implementation against:
   - Component breakdown and responsibilities
   - Data models and schemas
   - API contracts and interfaces
   - Dependency list (approved libraries)
   - File and folder structure conventions
3. **Drift Reporting**: When drift is detected, the CR agent cites the specific section of the winning plan that was deviated from, enabling the TL to make an informed decision on whether the drift is justified.

---

## 9. Severity Definitions

| Severity | Definition                                                                 | Blocking |
|----------|---------------------------------------------------------------------------|----------|
| CRITICAL | Security vulnerability exploitable in production; data loss or breach risk | Yes      |
| HIGH     | Significant defect that will cause failures or violates architecture       | Yes (if security) |
| MEDIUM   | Code quality issue that increases maintenance burden                       | No       |
| LOW      | Style, naming, or minor improvement suggestion                             | No       |

---

## 10. Edge Cases & Rules

1. **Empty Diff**: If Wave 2 produced no code changes (e.g., documentation-only wave), CR issues an automatic PASS with score 10.00 and a note: "No code changes to review."
2. **Generated Code**: Auto-generated files (e.g., protobuf, OpenAPI clients) are excluded from Code Quality scoring but included in Security scanning.
3. **Vendor/Third-Party Code**: Files in `vendor/`, `node_modules/`, or equivalent are excluded from review scope.
4. **Test Files**: Test files are reviewed for quality but do not count toward the "Test Coverage" criterion — that criterion measures coverage of production code.
5. **Configuration Files**: `.env.example`, CI configs, and infrastructure-as-code files are included in Security scanning (secrets check) but excluded from Code Quality scoring.
6. **Partial Reviews**: CR must review ALL files in the diff. Partial reviews are not permitted. If the diff is too large (>5000 lines), CR splits into sections but still covers 100%.

---

## 11. Activation

### From Strategy File

```markdown
## Code Review Gate
- Enable CR agent between Wave 2 and Wave 3
- Blocking mode: true
- Auto-fail on critical security findings: true
- Max re-review cycles: 3
```

### From CLI

```bash
--team <team-name> --strategy ./strategy.md
# CR agent activates automatically after Wave 2 completes
```

### Manual Trigger (debugging/testing)

```bash
# Run CR agent standalone against a diff range
--agent CR --diff <sha1>..<sha2> --plan .team/plans/WINNING_PLAN.md
```

---

## 12. Appendix: OWASP Top 10 Quick Reference for CR Agent

| # | Vulnerability              | What to Look For                                          |
|---|---------------------------|-----------------------------------------------------------|
| 1 | Injection                 | String concatenation in queries, unsanitized user input   |
| 2 | Broken Authentication     | Weak password policies, session tokens in URLs            |
| 3 | Sensitive Data Exposure   | Unencrypted PII, secrets in logs, HTTP instead of HTTPS   |
| 4 | XML External Entities     | XML parsing without disabling external entities           |
| 5 | Broken Access Control     | Missing authorization checks, IDOR, privilege escalation  |
| 6 | Security Misconfiguration | Debug mode enabled, default credentials, verbose errors   |
| 7 | XSS                       | Unescaped output in HTML/JS, innerHTML usage              |
| 8 | Insecure Deserialization  | Deserializing untrusted data without validation           |
| 9 | Known Vulnerabilities     | Outdated dependencies with CVEs                           |
|10 | Insufficient Logging      | No audit trail for auth events, no alerting on failures   |

---

*Protocol Version: 3.0 | Compatible with Amenthyx AI Teams v3.0 | 59+ Specialized Teams*
