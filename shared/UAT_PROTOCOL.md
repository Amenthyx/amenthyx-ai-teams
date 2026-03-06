# UAT Protocol v1.0 — User Acceptance Testing & Compliance Framework

> **Amenthyx AI Teams — Shared Protocol**
> Applies to ALL 60 teams. Referenced by ENHANCED_EXECUTION_PROTOCOL.md Section 12.
> **Coverage mandate: >= 95% of all user-facing functionality.**

---

## Table of Contents

1. [Purpose & Regulatory Foundation](#1-purpose--regulatory-foundation)
2. [UAT Scope Definition](#2-uat-scope-definition)
3. [Test Case Structure](#3-test-case-structure)
4. [Test Suite Organization](#4-test-suite-organization)
5. [CTA & Interaction Matrix](#5-cta--interaction-matrix)
6. [Combinatorial Testing Requirements](#6-combinatorial-testing-requirements)
7. [Compliance Matrix](#7-compliance-matrix)
8. [UAT Execution Protocol](#8-uat-execution-protocol)
9. [Evidence & Screenshot Requirements](#9-evidence--screenshot-requirements)
10. [Coverage Calculation & Enforcement](#10-coverage-calculation--enforcement)
11. [UAT Report Structure](#11-uat-report-structure)
12. [Mission Control Integration](#12-mission-control-integration)
13. [Sign-Off & Approval Process](#13-sign-off--approval-process)
14. [Downloadable Artifacts](#14-downloadable-artifacts)
15. [Team-Specific UAT Requirements](#15-team-specific-uat-requirements)

---

## 1. Purpose & Regulatory Foundation

### 1.1 Purpose

This protocol establishes mandatory User Acceptance Testing (UAT) standards for every project executed by any Amenthyx AI Team. UAT validates that delivered software meets business requirements, user expectations, and regulatory compliance before production release.

### 1.2 Regulatory Compliance Alignment

UAT execution MUST satisfy the following regulatory and industry frameworks:

| Framework | Requirement | UAT Mapping |
|-----------|-------------|-------------|
| **ISO 25010** | Software quality characteristics | Functional suitability, usability, reliability, security testing |
| **ISO/IEC 29119** | Software testing standard | Test case design, execution, reporting, traceability |
| **GDPR (EU)** | Data protection | User consent flows, data deletion, export, privacy notice CTAs |
| **SOC 2 Type II** | Security controls evidence | Access control testing, audit trail verification, session management |
| **WCAG 2.1 AA** | Accessibility | All interactive elements keyboard-navigable, screen-reader tested |
| **PCI DSS v4.0** | Payment security | Payment flow isolation, tokenization, no PAN in logs |
| **HIPAA** | Health data protection | PHI access controls, audit logging, encryption verification |
| **FDA 21 CFR Part 11** | Electronic records | Audit trail, electronic signatures, data integrity |
| **OWASP Top 10** | Application security | Input validation, authentication, authorization on every CTA |

> **Rule**: The QA agent MUST identify which regulations apply (from strategy file) and map every UAT test case to at least one compliance requirement. Unmapped test cases are flagged as "compliance-unlinked" in the report.

### 1.3 Definitions

| Term | Definition |
|------|------------|
| **CTA** | Call To Action — any UI element a user can interact with (button, link, form field, toggle, dropdown, menu item, gesture target) |
| **UAT Test Case** | A single, atomic verification of one user action or behavior |
| **UAT Test Suite** | A grouped collection of test cases covering one feature or workflow |
| **UAT Scenario** | An end-to-end user journey spanning multiple test cases |
| **Coverage** | Percentage of CTAs and user interactions covered by at least one passing test case |
| **Evidence** | Screenshot, video, log, or artifact proving test execution and result |

---

## 2. UAT Scope Definition

### 2.1 What MUST Be Tested

Every UAT execution MUST cover ALL of the following categories:

| Category | Description | Examples |
|----------|-------------|----------|
| **Navigation** | Every route, page, tab, menu item, breadcrumb, back/forward | Sidebar links, tab switches, URL routing, deep links |
| **Forms** | Every input field, validation rule, submission, reset | Text, email, password, phone, date, file upload, dropdown |
| **Buttons** | Every CTA button in every state | Submit, cancel, delete, edit, save, copy, share, download |
| **Authentication** | Every auth flow and edge case | Login, logout, register, forgot password, MFA, session timeout |
| **Authorization** | Every role and permission boundary | Admin vs user, read vs write, owner vs viewer |
| **CRUD Operations** | Create, Read, Update, Delete for every entity | Users, posts, orders, products, settings, comments |
| **Search & Filter** | Every search field, filter combination, sort option | Text search, date range, category filter, multi-select filter |
| **Pagination** | Every paginated list with boundary conditions | First page, last page, page size change, empty results |
| **Notifications** | Every notification type and delivery channel | Email, push, in-app, SMS — success/error/warning/info |
| **File Operations** | Upload, download, preview, delete for every file type | Images, PDFs, CSVs, ZIP, video — size limits, type validation |
| **State Transitions** | Every status change and workflow step | Draft→Published, Pending→Approved→Rejected, Open→Closed |
| **Error Handling** | Every error state and recovery path | Network error, server 500, validation error, timeout, rate limit |
| **Responsive** | Every breakpoint and orientation | Mobile (320px), Tablet (768px), Desktop (1024px+), Landscape |
| **Accessibility** | Keyboard navigation, screen reader, color contrast | Tab order, ARIA labels, focus indicators, alt text |
| **Integrations** | Every third-party integration touchpoint | Payment gateway, social login, email service, analytics |
| **Edge Cases** | Boundary values, empty states, max capacity | Empty list, max character input, concurrent access, slow network |
| **Localization** | Every supported language and locale | Date formats, currency, RTL layout, character encoding |

### 2.2 What Is Out of Scope

- Infrastructure-level testing (covered by INFRA agent)
- Load/stress testing (covered by Performance layer)
- Penetration testing (covered by Security layer)
- Code-level unit testing (covered by Unit layer)

> UAT focuses exclusively on **user-visible behavior** from the perspective of the end user.

---

## 3. Test Case Structure

### 3.1 Mandatory Fields

Every UAT test case MUST include ALL of the following fields:

```markdown
## UAT-{SUITE_ID}-{SEQ:04d}: {Title}

| Field | Value |
|-------|-------|
| **ID** | UAT-{SUITE_ID}-{SEQ:04d} |
| **Title** | {Concise action description} |
| **Feature** | {Feature name from strategy P0/P1/P2} |
| **Priority** | P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low) |
| **CTA Element** | {Button/Link/Form/Dropdown/Toggle — exact UI element} |
| **CTA Selector** | {CSS selector or test-id: data-testid="submit-btn"} |
| **User Role** | {Role performing the action: admin/user/guest/editor} |
| **Device** | {Desktop/Tablet/Mobile/All} |
| **Browser** | {Chrome/Firefox/Safari/Edge/All} |
| **Compliance** | {ISO/GDPR/SOC2/WCAG/PCI/HIPAA — comma-separated} |

### Preconditions
1. {State that must exist before test execution}
2. {User is logged in as [role]}
3. {Required test data exists}

### Steps
| Step | Action | Element | Input Data |
|------|--------|---------|------------|
| 1 | {Navigate/Click/Type/Select/Scroll/Hover/Drag} | {Element identifier} | {Data value if applicable} |
| 2 | ... | ... | ... |

### Expected Result
- {Specific, verifiable outcome}
- {UI state change}
- {Data change}
- {Notification/feedback}

### Actual Result
- {What actually happened — filled during execution}

### Evidence
| Type | Path |
|------|------|
| Screenshot (Before) | `.team/evidence/uat/screenshots/{ID}_before.png` |
| Screenshot (After) | `.team/evidence/uat/screenshots/{ID}_after.png` |
| Video | `.team/evidence/uat/videos/{ID}.mp4` |
| Console Log | `.team/evidence/uat/logs/{ID}_console.log` |
| Network Log | `.team/evidence/uat/logs/{ID}_network.har` |
| API Response | `.team/evidence/uat/logs/{ID}_api.json` |

### Status
- [ ] PASS
- [ ] FAIL — Defect: #{issue_number}
- [ ] BLOCKED — Reason: {blocking reason}
- [ ] SKIPPED — Justification: {must be approved by TL}

### Execution Metadata
| Field | Value |
|-------|-------|
| Executed By | {Agent role or human tester} |
| Executed At | {ISO 8601 timestamp} |
| Duration | {Execution time in seconds} |
| Environment | {local/staging/preview} |
| Build | {Build hash or version} |
| Retry Count | {0 = first attempt} |
```

### 3.2 Test Case ID Convention

```
UAT-{SUITE}-{SEQ:04d}

SUITE codes:
  NAV   = Navigation
  AUTH  = Authentication
  AUTHZ = Authorization
  FORM  = Forms & Input
  CRUD  = CRUD Operations
  SRCH  = Search & Filter
  PAGE  = Pagination
  NOTIF = Notifications
  FILE  = File Operations
  STATE = State Transitions
  ERR   = Error Handling
  RESP  = Responsive Design
  A11Y  = Accessibility
  INTG  = Integrations
  EDGE  = Edge Cases
  L10N  = Localization
  PAY   = Payment Flows
  PRIV  = Privacy & Data Protection
  PERF  = User-Perceived Performance
  SEC   = Security (User-Facing)
  WF    = Workflow & Business Logic
  DASH  = Dashboard & Reporting
  CONF  = Configuration & Settings
  ONBRD = Onboarding & First-Use
  COLLAB = Collaboration & Sharing
  API   = API Consumer Testing

Example: UAT-AUTH-0001, UAT-CRUD-0042, UAT-PAY-0003
```

---

## 4. Test Suite Organization

### 4.1 Suite Structure

Test suites are organized hierarchically:

```
.team/uat/
├── UAT_MASTER_INDEX.md            # Master index of all suites and cases
├── UAT_COVERAGE_MATRIX.md         # CTA ↔ Test Case traceability matrix
├── UAT_COMPLIANCE_MAP.md          # Regulation ↔ Test Case mapping
├── UAT_EXECUTION_LOG.md           # Chronological execution log
├── UAT_DEFECT_LOG.md              # Defects found during UAT
├── UAT_SIGNOFF.md                 # Final sign-off document
├── suites/
│   ├── NAV_navigation.md          # Navigation test suite
│   ├── AUTH_authentication.md     # Authentication test suite
│   ├── AUTHZ_authorization.md     # Authorization test suite
│   ├── FORM_forms.md              # Forms & input test suite
│   ├── CRUD_operations.md         # CRUD operations test suite
│   ├── SRCH_search_filter.md      # Search & filter test suite
│   ├── PAGE_pagination.md         # Pagination test suite
│   ├── NOTIF_notifications.md     # Notification test suite
│   ├── FILE_operations.md         # File operations test suite
│   ├── STATE_transitions.md       # State transition test suite
│   ├── ERR_handling.md            # Error handling test suite
│   ├── RESP_responsive.md         # Responsive design test suite
│   ├── A11Y_accessibility.md      # Accessibility test suite
│   ├── INTG_integrations.md       # Integration test suite
│   ├── EDGE_cases.md              # Edge cases test suite
│   ├── L10N_localization.md       # Localization test suite
│   ├── PAY_payment.md             # Payment flows test suite
│   ├── PRIV_privacy.md            # Privacy & data protection test suite
│   ├── SEC_security_ux.md         # Security UX test suite
│   ├── WF_workflows.md            # Business workflow test suite
│   ├── DASH_dashboard.md          # Dashboard & reporting test suite
│   ├── CONF_settings.md           # Configuration & settings test suite
│   ├── ONBRD_onboarding.md        # Onboarding test suite
│   ├── COLLAB_collaboration.md    # Collaboration test suite
│   └── API_consumer.md            # API consumer test suite
├── scenarios/
│   ├── SCENARIO_001_user_journey.md     # End-to-end user journeys
│   ├── SCENARIO_002_admin_workflow.md   # Admin workflow scenarios
│   └── ...
├── evidence/
│   ├── screenshots/               # All test screenshots
│   │   ├── UAT-AUTH-0001_before.png
│   │   ├── UAT-AUTH-0001_after.png
│   │   └── ...
│   ├── videos/                    # Screen recordings
│   ├── logs/                      # Console + network logs
│   └── api/                       # API response captures
└── reports/
    ├── UAT_REPORT_FINAL.md        # Final comprehensive report
    ├── UAT_REPORT_FINAL.pdf       # PDF version (generated)
    ├── UAT_REPORT_FINAL.pptx      # PPTX version (generated)
    ├── UAT_SUMMARY_EXECUTIVE.md   # Executive summary
    └── exports/
        ├── uat_results_all.json   # Machine-readable full export
        ├── uat_results_all.csv    # Spreadsheet-compatible export
        ├── uat_suite_{CODE}.json  # Per-suite JSON export
        └── uat_suite_{CODE}.csv   # Per-suite CSV export
```

### 4.2 Master Index Template

```markdown
# UAT Master Index — {PROJECT_NAME}

| # | Suite ID | Suite Name | Total Cases | Passed | Failed | Blocked | Skipped | Coverage % | Status |
|---|----------|-----------|-------------|--------|--------|---------|---------|------------|--------|
| 1 | NAV | Navigation | {n} | {n} | {n} | {n} | {n} | {%} | {PASS/FAIL/IN_PROGRESS} |
| 2 | AUTH | Authentication | {n} | {n} | {n} | {n} | {n} | {%} | ... |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| **TOTAL** | — | — | **{N}** | **{N}** | **{N}** | **{N}** | **{N}** | **{%}** | **{STATUS}** |

## Overall Metrics
- **Total Test Cases**: {N}
- **Total Passed**: {N} ({%}%)
- **Total Failed**: {N} ({%}%)
- **Total Blocked**: {N} ({%}%)
- **Total Skipped**: {N} ({%}%) — each must have TL-approved justification
- **UAT Coverage**: {%}% (MUST be >= 95%)
- **Compliance Coverage**: {%}% of applicable regulations mapped
- **CTA Coverage**: {%}% of all CTAs tested ({tested}/{total})
- **Defects Found**: {N} (Critical: {n}, High: {n}, Medium: {n}, Low: {n})
- **Execution Duration**: {HH:MM:SS}
- **Environment**: {local/staging/preview}
- **Build**: {hash or version}
```

---

## 5. CTA & Interaction Matrix

### 5.1 CTA Discovery Protocol

Before writing test cases, the QA agent MUST perform CTA discovery:

```
STEP 1: Page Inventory
  - List every page/route in the application
  - Include hidden/conditional pages (admin, error, maintenance)

STEP 2: CTA Enumeration (per page)
  - Scan every interactive element:
    □ Buttons (submit, cancel, delete, edit, save, export, copy, share)
    □ Links (navigation, external, anchor, download)
    □ Form fields (text, email, password, number, date, file, textarea)
    □ Dropdowns (select, multi-select, autocomplete, combobox)
    □ Toggles (switches, checkboxes, radio buttons)
    □ Tabs (tab switches, tab close)
    □ Modals (open trigger, close X, close backdrop, confirm, cancel)
    □ Menus (hamburger, context menu, dropdown menu, overflow menu)
    □ Cards (clickable cards, expand/collapse, swipe actions)
    □ Tables (sort headers, row select, row expand, cell edit, bulk actions)
    □ Sliders (range, single value, step)
    □ Drag targets (drag-and-drop zones, reorder lists)
    □ Gestures (swipe, pinch, long-press — mobile)
    □ Keyboard shortcuts (hotkeys, Ctrl+S, Esc, Enter)
    □ Scroll triggers (infinite scroll, lazy load, scroll-to-top)
    □ Hover effects (tooltips, dropdown on hover, preview)
    □ Focus/blur events (field validation on blur, focus styles)

STEP 3: CTA State Matrix
  For each CTA, document all possible states:
  - Default / Active / Disabled / Loading / Error / Success / Hidden
  - Authenticated / Unauthenticated
  - With data / Without data (empty state)
  - First use / Returning user
  - Online / Offline (if PWA)

STEP 4: CTA Traceability
  Map each CTA to:
  - Feature (from strategy P0/P1/P2)
  - User role(s) that can access it
  - Test case(s) covering it
  - Compliance requirement(s) it touches
```

### 5.2 CTA Coverage Matrix Template

```markdown
# CTA Coverage Matrix — {PROJECT_NAME}

| # | Page | CTA Element | Type | States | Roles | Test Case IDs | Compliance | Covered |
|---|------|-------------|------|--------|-------|---------------|------------|---------|
| 1 | /login | "Sign In" button | Button | default, disabled, loading | guest | UAT-AUTH-0001, UAT-AUTH-0002 | SOC2, ISO | YES |
| 2 | /login | Email field | Input | empty, valid, invalid, focus, blur | guest | UAT-AUTH-0001, UAT-FORM-0005 | GDPR | YES |
| 3 | /dashboard | "Export CSV" button | Button | default, loading, disabled(no data) | admin, user | UAT-FILE-0012 | — | YES |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

## Coverage Summary
- **Total CTAs Discovered**: {N}
- **CTAs with Test Cases**: {N} ({%}%)
- **CTAs without Test Cases**: {N} ({%}%) — MUST be < 5%
- **CTAs with Multiple State Tests**: {N} ({%}%)
- **CTAs with Compliance Mapping**: {N} ({%}%)
```

---

## 6. Combinatorial Testing Requirements

### 6.1 Mandatory Combinations

For every feature, the QA agent MUST test these combinations:

| Combination Type | Description | Minimum Coverage |
|------------------|-------------|------------------|
| **Role x Feature** | Every user role on every feature they can access | 100% |
| **Role x CTA** | Every role's interaction with every CTA in their scope | 100% |
| **Browser x Critical Path** | Every P0 flow on Chrome + Firefox + Safari | 100% |
| **Device x Critical Path** | Every P0 flow on Desktop + Tablet + Mobile | 100% |
| **State x CTA** | Every CTA in every applicable state (default/disabled/loading/error) | >= 90% |
| **Validation x Input** | Every form field with valid + invalid + boundary + empty input | 100% |
| **Language x Critical Path** | Every supported locale on P0 flows (if L10N in scope) | 100% |
| **Permission x Action** | Every permission boundary tested (allowed + denied) | 100% |
| **Online x Offline** | Critical flows tested in both states (if PWA) | 100% |
| **First Use x Return** | Onboarding vs returning user experience | >= 80% |

### 6.2 Pairwise Testing for Non-Critical Combinations

For P2/P3 features where full combinatorial testing is impractical:

```
Use pairwise (all-pairs) testing:
- Tool: PICT (Microsoft), AllPairs, or manual pairwise tables
- Minimum: Every value of every parameter appears with every value of every other parameter at least once
- Document pairwise design in UAT_COVERAGE_MATRIX.md
```

### 6.3 Negative Testing Requirements

For every positive test case, create at minimum ONE negative case:

| Positive Test | Required Negative Tests |
|---------------|------------------------|
| Valid form submission | Empty fields, invalid format, SQL injection, XSS payload, max length+1 |
| Successful login | Wrong password, non-existent email, locked account, expired session |
| File upload success | Wrong format, too large, empty file, corrupted file, zero-byte file |
| API success (200) | 400 (bad request), 401 (unauth), 403 (forbidden), 404 (not found), 500 (server error) |
| Create entity | Duplicate name, missing required fields, invalid relationships |
| Delete entity | Delete with dependencies, delete as non-owner, double-delete |
| State transition | Invalid transition (e.g., Closed → Draft), concurrent transitions |

---

## 7. Compliance Matrix

### 7.1 Compliance Test Mapping Template

```markdown
# UAT Compliance Map — {PROJECT_NAME}

## Applicable Regulations
- [x] ISO 25010 (all projects)
- [x] ISO/IEC 29119 (all projects)
- [ ] GDPR (projects handling EU personal data)
- [ ] SOC 2 Type II (projects requiring security audit)
- [ ] WCAG 2.1 AA (projects with accessibility requirements)
- [ ] PCI DSS v4.0 (projects with payment processing)
- [ ] HIPAA (projects with health data)
- [ ] FDA 21 CFR Part 11 (medical device / pharma)

## Regulation → Test Case Mapping

### ISO 25010 — Software Quality
| Characteristic | Sub-characteristic | Test Cases | Status |
|----------------|-------------------|------------|--------|
| Functional Suitability | Completeness | UAT-CRUD-*, UAT-WF-* | {PASS/FAIL} |
| Functional Suitability | Correctness | UAT-FORM-*, UAT-STATE-* | {PASS/FAIL} |
| Functional Suitability | Appropriateness | UAT-ONBRD-*, UAT-NAV-* | {PASS/FAIL} |
| Usability | Learnability | UAT-ONBRD-*, UAT-NAV-* | {PASS/FAIL} |
| Usability | Operability | UAT-A11Y-*, UAT-RESP-* | {PASS/FAIL} |
| Usability | Error Protection | UAT-ERR-*, UAT-FORM-* (validation) | {PASS/FAIL} |
| Reliability | Maturity | UAT-EDGE-*, UAT-ERR-* | {PASS/FAIL} |
| Reliability | Availability | UAT-ERR-* (offline/timeout) | {PASS/FAIL} |
| Reliability | Fault Tolerance | UAT-ERR-* (recovery) | {PASS/FAIL} |
| Security | Confidentiality | UAT-AUTHZ-*, UAT-PRIV-* | {PASS/FAIL} |
| Security | Integrity | UAT-SEC-*, UAT-FORM-* (injection) | {PASS/FAIL} |
| Security | Authentication | UAT-AUTH-* | {PASS/FAIL} |

### GDPR (if applicable)
| Article | Requirement | Test Cases | Status |
|---------|-------------|------------|--------|
| Art. 6 | Lawful basis / consent | UAT-PRIV-0001 (consent banner) | {PASS/FAIL} |
| Art. 7 | Consent withdrawal | UAT-PRIV-0002 (withdraw consent) | {PASS/FAIL} |
| Art. 15 | Right of access | UAT-PRIV-0003 (data export) | {PASS/FAIL} |
| Art. 17 | Right to erasure | UAT-PRIV-0004 (delete account/data) | {PASS/FAIL} |
| Art. 20 | Data portability | UAT-PRIV-0005 (export in machine format) | {PASS/FAIL} |
| Art. 25 | Data protection by design | UAT-PRIV-0006 (minimal data collection) | {PASS/FAIL} |
| Art. 33 | Breach notification | UAT-PRIV-0007 (security incident flow) | {PASS/FAIL} |

### SOC 2 Type II (if applicable)
| Control | Requirement | Test Cases | Status |
|---------|-------------|------------|--------|
| CC6.1 | Logical access controls | UAT-AUTH-*, UAT-AUTHZ-* | {PASS/FAIL} |
| CC6.2 | Authentication mechanisms | UAT-AUTH-* (MFA, session) | {PASS/FAIL} |
| CC6.3 | Authorization enforcement | UAT-AUTHZ-* (role boundaries) | {PASS/FAIL} |
| CC7.2 | Monitoring | UAT-DASH-* (audit logs) | {PASS/FAIL} |
| CC8.1 | Change management | UAT-STATE-* (state transitions) | {PASS/FAIL} |

### WCAG 2.1 AA (if applicable)
| Criterion | Requirement | Test Cases | Status |
|-----------|-------------|------------|--------|
| 1.1.1 | Non-text content (alt text) | UAT-A11Y-0001 | {PASS/FAIL} |
| 1.3.1 | Info and relationships | UAT-A11Y-0002 (semantic HTML) | {PASS/FAIL} |
| 1.4.3 | Contrast ratio (4.5:1 min) | UAT-A11Y-0003 | {PASS/FAIL} |
| 2.1.1 | Keyboard accessible | UAT-A11Y-0004 (all CTAs via Tab) | {PASS/FAIL} |
| 2.4.3 | Focus order | UAT-A11Y-0005 (logical tab order) | {PASS/FAIL} |
| 2.4.7 | Focus visible | UAT-A11Y-0006 (focus indicator) | {PASS/FAIL} |
| 3.3.1 | Error identification | UAT-A11Y-0007 (form errors) | {PASS/FAIL} |
| 4.1.2 | Name, role, value | UAT-A11Y-0008 (ARIA labels) | {PASS/FAIL} |

### PCI DSS v4.0 (if applicable)
| Requirement | Description | Test Cases | Status |
|-------------|-------------|------------|--------|
| 3.4 | PAN rendering | UAT-PAY-0001 (masked card display) | {PASS/FAIL} |
| 6.4 | Public-facing app protection | UAT-SEC-* (input validation, XSS) | {PASS/FAIL} |
| 8.3 | Strong authentication | UAT-AUTH-* (password policy, MFA) | {PASS/FAIL} |
| 10.2 | Audit trail | UAT-DASH-* (transaction logging) | {PASS/FAIL} |
```

---

## 8. UAT Execution Protocol

### 8.1 UAT Wave Integration

UAT executes as a dedicated wave between QA and Release:

```
WAVE 0:   TL Initialization
WAVE 1:   PM Planning
WAVE 1.5: Marketing + Legal (background)
WAVE 2:   Engineering (parallel)
WAVE 2.5: PM Reporting
WAVE 3:   QA — Automated Testing (unit, integration, E2E, security, perf)
WAVE 3.5: Bug Fix Loop (conditional, if QA fails)
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
WAVE 3.7: UAT — User Acceptance Testing (BLOCKING GATE)     <<<< NEW
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
WAVE 4:   Release
WAVE 5:   Final Reporting
```

### 8.2 UAT Execution Sequence

```
STEP 1: CTA Discovery (QA agent)
  - Enumerate all pages, routes, interactive elements
  - Produce UAT_COVERAGE_MATRIX.md
  - Emit event: UAT/discovery_complete

STEP 2: Test Case Authoring (QA agent)
  - Write test cases per Section 3 format
  - Organize into suites per Section 4
  - Map to compliance per Section 7
  - Emit event: UAT/authoring_complete
  - Gate check: >= 95% CTA coverage in matrix

STEP 3: Test Data Preparation (QA + BE agents)
  - Create test users (every role)
  - Seed test data (entities, files, records)
  - Configure test environment
  - Emit event: UAT/data_ready

STEP 4: Test Execution — Round 1 (QA agent)
  - Execute ALL test cases
  - Capture screenshots (before + after for every case)
  - Record actual results
  - Log defects as GitHub issues
  - Emit events: UAT/case_pass, UAT/case_fail, UAT/case_blocked per case
  - Emit event: UAT/round_1_complete

STEP 5: Defect Triage (TL + QA)
  - Classify defects: Critical / High / Medium / Low
  - Critical + High: MUST be fixed before re-test
  - Medium: Fix in this wave if time permits
  - Low: Document and defer to backlog

STEP 6: Bug Fix (Engineering agents — conditional)
  - Engineers fix Critical + High defects
  - Each fix = atomic commit with issue reference
  - Emit event: UAT/fix_complete per fix

STEP 7: Test Execution — Round 2 (QA agent — regression)
  - Re-execute failed test cases
  - Verify fixes
  - Regression-test related passing cases
  - Emit event: UAT/round_2_complete

STEP 8: Coverage Verification
  - Calculate final coverage percentage
  - Verify >= 95% coverage
  - If < 95%: write additional test cases and re-execute
  - Emit event: UAT/coverage_verified

STEP 9: Report Generation
  - Generate UAT_REPORT_FINAL.md
  - Generate UAT_REPORT_FINAL.pdf (via PDF_GENERATOR)
  - Generate UAT_REPORT_FINAL.pptx (via PPTX_GENERATOR)
  - Export results to JSON + CSV
  - Emit event: UAT/report_generated

STEP 10: Sign-Off
  - QA agent submits UAT_SIGNOFF.md
  - TL reviews and approves
  - User reviews and approves (BLOCKING)
  - Emit event: UAT/signoff_complete
```

### 8.3 UAT Blocking Gate

```
GATE: UAT_PASS
  TRIGGER: After Wave 3.7 complete
  CRITERIA:
    □ All P0 test cases PASS (zero failures)
    □ All P1 test cases PASS (zero failures)
    □ P2 test cases: <= 3 failures (documented, none Critical/High)
    □ P3 test cases: <= 5 failures (documented, none Critical)
    □ CTA coverage >= 95%
    □ Compliance mapping 100% for applicable regulations
    □ All Critical/High defects resolved
    □ UAT_REPORT_FINAL.md exists with complete data
    □ UAT_SIGNOFF.md approved by TL + user
  BLOCKING: YES — Release (Wave 4) CANNOT proceed without UAT_PASS
```

---

## 9. Evidence & Screenshot Requirements

### 9.1 Screenshot Protocol

Every UAT test case MUST capture:

| When | What | File Name Pattern |
|------|------|-------------------|
| Before action | Current state of the UI before the CTA is triggered | `{ID}_before.png` |
| After action (success) | Result state after successful CTA | `{ID}_after.png` |
| After action (failure) | Error state if CTA fails | `{ID}_error.png` |
| Validation state | Form validation errors displayed | `{ID}_validation.png` |
| Modal/Dialog | Any modal or dialog triggered by CTA | `{ID}_modal.png` |
| Tooltip/Hover | Tooltip or hover state if relevant | `{ID}_hover.png` |
| Loading state | Spinner/skeleton while CTA processes | `{ID}_loading.png` |
| Mobile view | Mobile responsive version (if RESP suite) | `{ID}_mobile.png` |
| Tablet view | Tablet responsive version (if RESP suite) | `{ID}_tablet.png` |

### 9.2 Screenshot Metadata

Every screenshot MUST be accompanied by metadata in the test case:

```json
{
  "testCaseId": "UAT-AUTH-0001",
  "screenshotType": "after",
  "timestamp": "2026-03-02T14:30:00.000Z",
  "viewport": { "width": 1920, "height": 1080 },
  "browser": "Chrome 122",
  "device": "Desktop",
  "url": "/login",
  "description": "Login form after successful email validation",
  "file": ".team/uat/evidence/screenshots/UAT-AUTH-0001_after.png",
  "fileSize": 145230,
  "dimensions": { "width": 1920, "height": 1080 }
}
```

### 9.3 Video Recording

For complex workflows (scenarios spanning 5+ test cases):

```
- Record full screen at 1080p minimum
- Include mouse cursor and click highlights
- Duration: entire workflow from start to end
- Format: MP4 (H.264)
- File: .team/uat/evidence/videos/SCENARIO_{ID}.mp4
- Maximum: 5 minutes per scenario
- If longer: split into segments
```

### 9.4 Console & Network Logs

For every FAIL result:

```
- Console log: all console.log/warn/error during test execution
- Network HAR: all HTTP requests/responses during test execution
- API response: full JSON response body for API-driven CTAs
- File locations:
  .team/uat/evidence/logs/{ID}_console.log
  .team/uat/evidence/logs/{ID}_network.har
  .team/uat/evidence/logs/{ID}_api.json
```

---

## 10. Coverage Calculation & Enforcement

### 10.1 Coverage Formula

```
UAT Coverage = (CTAs with >= 1 passing test case) / (Total discovered CTAs) × 100

Where:
  - Total discovered CTAs = output of CTA Discovery (Section 5)
  - A CTA is "covered" if at least ONE test case targeting it has status PASS
  - A CTA is "partially covered" if tests exist but all are FAIL/BLOCKED
  - A CTA is "uncovered" if no test case targets it

REQUIREMENT: UAT Coverage >= 95%
```

### 10.2 Coverage Breakdown

```
Feature Coverage    = (Features with all P0 CTAs passing) / (Total features) × 100
Role Coverage       = (Roles fully tested) / (Total roles) × 100
Page Coverage       = (Pages with all CTAs tested) / (Total pages) × 100
Compliance Coverage = (Regulations with all mapped tests passing) / (Applicable regulations) × 100
State Coverage      = (CTA states tested) / (Total CTA × average states per CTA) × 100
```

### 10.3 Enforcement Rules

| Metric | Threshold | Consequence if Below |
|--------|-----------|---------------------|
| Overall UAT Coverage | >= 95% | BLOCKING — cannot proceed to Release wave |
| P0 Feature Coverage | 100% | BLOCKING — all critical features fully tested |
| P1 Feature Coverage | >= 95% | BLOCKING — near-complete for high priority |
| Compliance Coverage | 100% | BLOCKING — regulatory non-negotiable |
| Role Coverage | 100% | BLOCKING — all roles must be tested |
| Page Coverage | >= 95% | WARNING — document exceptions |
| State Coverage | >= 80% | WARNING — document exceptions |
| Negative Test Coverage | >= 90% | WARNING — ensure key negative cases exist |

---

## 11. UAT Report Structure

### 11.1 Final Report Template

```markdown
# UAT Final Report — {PROJECT_NAME}

## Report Metadata
| Field | Value |
|-------|-------|
| Project | {name} |
| Version | {version} |
| Team | {team name} |
| Report Date | {ISO 8601} |
| Environment | {local/staging/preview} |
| Build | {hash or version} |
| Report Author | QA Agent |
| Reviewed By | Team Leader |
| Approved By | {User name} |

---

## 1. Executive Summary
- **Overall Verdict**: {PASS / FAIL / CONDITIONAL PASS}
- **UAT Coverage**: {%}% (target: >= 95%)
- **Total Test Cases**: {N}
- **Passed**: {N} ({%}%)
- **Failed**: {N} ({%}%)
- **Blocked**: {N} ({%}%)
- **Skipped**: {N} ({%}%) — with justification
- **Defects Found**: {N} total (Critical: {n}, High: {n}, Medium: {n}, Low: {n})
- **Defects Resolved**: {N}/{N}
- **Execution Duration**: {HH:MM:SS}
- **Compliance Status**: {COMPLIANT / NON-COMPLIANT — list violations}

---

## 2. Coverage Dashboard

### 2.1 Suite-by-Suite Results
| Suite | Cases | Pass | Fail | Block | Skip | Coverage | Status |
|-------|-------|------|------|-------|------|----------|--------|
| NAV | {n} | {n} | {n} | {n} | {n} | {%}% | {icon} |
| AUTH | ... | ... | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... | ... | ... |

### 2.2 Coverage by Feature (P0/P1/P2)
| Priority | Features | Fully Covered | Partially | Uncovered | Coverage % |
|----------|----------|---------------|-----------|-----------|------------|
| P0 | {n} | {n} | {n} | {n} | {%}% |
| P1 | {n} | {n} | {n} | {n} | {%}% |
| P2 | {n} | {n} | {n} | {n} | {%}% |

### 2.3 Coverage by User Role
| Role | CTAs in Scope | Tested | Passed | Coverage % |
|------|---------------|--------|--------|------------|
| Admin | {n} | {n} | {n} | {%}% |
| User | {n} | {n} | {n} | {%}% |
| Guest | {n} | {n} | {n} | {%}% |

### 2.4 Coverage by Device/Browser
| Device | Browser | P0 Flows Tested | P0 Pass | Status |
|--------|---------|-----------------|---------|--------|
| Desktop | Chrome | {n}/{n} | {n}/{n} | {icon} |
| Desktop | Firefox | {n}/{n} | {n}/{n} | {icon} |
| Desktop | Safari | {n}/{n} | {n}/{n} | {icon} |
| Tablet | Chrome | {n}/{n} | {n}/{n} | {icon} |
| Mobile | Chrome | {n}/{n} | {n}/{n} | {icon} |

---

## 3. Compliance Report

### 3.1 Regulation Status
| Regulation | Applicable | Tests Mapped | Tests Passed | Status |
|------------|-----------|-------------|-------------|--------|
| ISO 25010 | YES | {n} | {n} | {PASS/FAIL} |
| GDPR | {YES/NO} | {n} | {n} | {PASS/FAIL/N/A} |
| SOC 2 | {YES/NO} | {n} | {n} | {PASS/FAIL/N/A} |
| WCAG 2.1 | {YES/NO} | {n} | {n} | {PASS/FAIL/N/A} |
| PCI DSS | {YES/NO} | {n} | {n} | {PASS/FAIL/N/A} |
| HIPAA | {YES/NO} | {n} | {n} | {PASS/FAIL/N/A} |

### 3.2 Compliance Violations
| # | Regulation | Article/Req | Test Case | Violation | Severity | Resolution |
|---|-----------|-------------|-----------|-----------|----------|------------|
| 1 | {reg} | {article} | {ID} | {description} | {sev} | {fix or waiver} |

---

## 4. Defect Summary

### 4.1 Defect Distribution
| Severity | Count | Resolved | Open | Deferred |
|----------|-------|----------|------|----------|
| Critical | {n} | {n} | {n} | 0 (MUST be 0) |
| High | {n} | {n} | {n} | 0 (MUST be 0) |
| Medium | {n} | {n} | {n} | {n} |
| Low | {n} | {n} | {n} | {n} |

### 4.2 Defect Details
| # | ID | Title | Suite | Severity | Status | GitHub Issue | Fix Commit |
|---|-----|-------|-------|----------|--------|-------------|------------|
| 1 | DEF-001 | {title} | {suite} | {sev} | {status} | #{num} | {hash} |

---

## 5. Test Execution Timeline
| Round | Started | Ended | Cases Run | Passed | Failed | New Defects |
|-------|---------|-------|-----------|--------|--------|-------------|
| Round 1 | {time} | {time} | {n} | {n} | {n} | {n} |
| Round 2 (regression) | {time} | {time} | {n} | {n} | {n} | {n} |

---

## 6. Evidence Index
| Test Case | Screenshot(s) | Video | Console Log | API Log | Status |
|-----------|---------------|-------|-------------|---------|--------|
| UAT-AUTH-0001 | before, after | — | — | — | PASS |
| UAT-AUTH-0002 | before, error | — | yes | yes | FAIL |

---

## 7. Risk Assessment
| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| {risk} | {H/M/L} | {H/M/L} | {action} | {role} |

---

## 8. Recommendations
1. {Recommendation for future improvement}
2. {Areas needing additional testing in next release}

---

## 9. Sign-Off

| Role | Name | Verdict | Date | Signature |
|------|------|---------|------|-----------|
| QA Agent | {name} | {PASS/FAIL} | {date} | QA/{initials} |
| Team Leader | {name} | {APPROVED/REJECTED} | {date} | TL/{initials} |
| User | {name} | {ACCEPTED/REJECTED} | {date} | USR/{initials} |

### Conditions (if Conditional Pass)
- {condition 1 — e.g., "Medium defects DEF-005, DEF-008 fixed within 7 days"}
- {condition 2}

---

## 10. Appendices
- Appendix A: Full Test Case Listing (link to UAT_MASTER_INDEX.md)
- Appendix B: CTA Coverage Matrix (link to UAT_COVERAGE_MATRIX.md)
- Appendix C: Compliance Map (link to UAT_COMPLIANCE_MAP.md)
- Appendix D: Defect Log (link to UAT_DEFECT_LOG.md)
- Appendix E: Screenshot Gallery (link to evidence/screenshots/)
```

---

## 12. Mission Control Integration

### 12.1 UAT Event Categories

Mission Control ingests UAT events via the standard event API:

```typescript
// UAT Event Types
category: 'UAT'

type:
  'discovery_complete'    // CTA discovery finished
  'authoring_complete'    // Test case writing finished
  'data_ready'            // Test data prepared
  'case_pass'             // Individual test case passed
  'case_fail'             // Individual test case failed
  'case_blocked'          // Individual test case blocked
  'case_skipped'          // Individual test case skipped
  'round_complete'        // Test execution round completed
  'fix_complete'          // Bug fix applied
  'coverage_verified'     // Coverage threshold checked
  'report_generated'      // Final report created
  'signoff_complete'      // Sign-off approved
  'suite_complete'        // Entire suite finished
  'defect_found'          // New defect discovered
  'defect_resolved'       // Defect fixed and verified

// UAT Event Payload
payload: {
  testCaseId?: string          // e.g., "UAT-AUTH-0001"
  suiteId?: string             // e.g., "AUTH"
  title?: string               // Test case title
  feature?: string             // Feature name
  priority?: string            // P0/P1/P2/P3
  ctaElement?: string          // CTA being tested
  ctaSelector?: string         // CSS selector / test-id
  userRole?: string            // User role in test
  device?: string              // Device type
  browser?: string             // Browser name
  steps?: Array<{action, element, input}>
  expectedResult?: string
  actualResult?: string
  status?: string              // pass/fail/blocked/skipped
  screenshotBefore?: string    // Path to before screenshot
  screenshotAfter?: string     // Path to after screenshot
  screenshotError?: string     // Path to error screenshot
  consoleLog?: string          // Path to console log
  networkLog?: string          // Path to HAR file
  defectId?: string            // GitHub issue number
  defectSeverity?: string      // critical/high/medium/low
  compliance?: string[]        // Applicable regulations
  coverage?: number            // Current coverage percentage
  round?: number               // Execution round (1, 2, ...)
  duration_ms?: number         // Test execution time
  environment?: string         // local/staging/preview
  build?: string               // Build hash/version
}
```

### 12.2 UAT Dashboard in Mission Control

The Mission Control UAT page displays:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  UAT Dashboard — {project}                               [Download All]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌── Coverage ───┐  ┌── Results ────┐  ┌── Defects ───┐  ┌── Time ──┐ │
│  │    97.3%       │  │ 342 / 350     │  │ 8 found      │  │ 2h 34m   │ │
│  │   ████████░░   │  │ passed        │  │ 6 resolved   │  │ elapsed  │ │
│  └───────────────┘  └───────────────┘  └──────────────┘  └──────────┘ │
│                                                                         │
│  Suite Results                                          [Export CSV/JSON]│
│  ┌─────────┬───────┬──────┬──────┬───────┬──────┬──────────┬─────────┐ │
│  │ Suite   │ Total │ Pass │ Fail │ Block │ Skip │ Coverage │ Status  │ │
│  ├─────────┼───────┼──────┼──────┼───────┼──────┼──────────┼─────────┤ │
│  │ AUTH    │ 24    │ 24   │ 0    │ 0     │ 0    │ 100%     │ ✅ PASS │ │
│  │ CRUD    │ 48    │ 46   │ 2    │ 0     │ 0    │ 95.8%    │ ⚠ WARN │ │
│  │ ...     │ ...   │ ...  │ ...  │ ...   │ ...  │ ...      │ ...     │ │
│  └─────────┴───────┴──────┴──────┴───────┴──────┴──────────┴─────────┘ │
│                                                                         │
│  ▼ AUTH — Authentication (24 cases)                    [Download Suite] │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ UAT-AUTH-0001 | Login with valid credentials       | ✅ PASS | 3s │ │
│  │  └ 📷 before | 📷 after | 📋 steps | 🏷 SOC2,ISO              │ │
│  │ UAT-AUTH-0002 | Login with wrong password          | ✅ PASS | 2s │ │
│  │  └ 📷 before | 📷 error | 📋 steps | 🏷 SOC2,ISO              │ │
│  │ UAT-AUTH-0003 | Session timeout after 30min        | ❌ FAIL | 5s │ │
│  │  └ 📷 before | 📷 error | 📜 console | 🐛 #42 | [View Details] │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ▼ Test Case Detail: UAT-AUTH-0003                     [Download Case] │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ Title: Session timeout after 30 minutes of inactivity              │ │
│  │ Priority: P0 | Role: user | Device: Desktop | Browser: Chrome      │ │
│  │ CTA: Session timeout modal → "Login Again" button                  │ │
│  │ Compliance: SOC2 CC6.2, ISO 25010 Security                        │ │
│  │                                                                     │ │
│  │ Steps:                                                              │ │
│  │ 1. Login as user@test.com                                          │ │
│  │ 2. Wait 30 minutes (or mock timer)                                 │ │
│  │ 3. Attempt any navigation                                          │ │
│  │ 4. Verify session timeout modal appears                            │ │
│  │ 5. Click "Login Again" button                                      │ │
│  │                                                                     │ │
│  │ Expected: Redirected to login page, session cleared                │ │
│  │ Actual: Modal did not appear, stale session persisted              │ │
│  │                                                                     │ │
│  │ ┌─── Screenshots ──────────────────────────────────────────────┐   │ │
│  │ │ [Before]        [Expected]       [Actual/Error]              │   │ │
│  │ │ ┌──────────┐   ┌──────────┐    ┌──────────┐                │   │ │
│  │ │ │          │   │  Modal   │    │  No modal│                │   │ │
│  │ │ │ Dashboard│   │  shown   │    │  blank   │                │   │ │
│  │ │ └──────────┘   └──────────┘    └──────────┘                │   │ │
│  │ └──────────────────────────────────────────────────────────────┘   │ │
│  │                                                                     │ │
│  │ Defect: #42 — Session timeout not triggered                        │ │
│  │ Status: FAIL → Assigned to BE → Fix committed (abc1234)            │ │
│  │ Retest: Round 2 — PASS                                             │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Compliance Summary                                                     │
│  ┌──────────┬────────┬────────┬────────────────────────────────────────┐│
│  │ ISO 25010│ GDPR   │ SOC 2  │ WCAG 2.1 AA                          ││
│  │ ✅ PASS  │ ✅ PASS│ ⚠ 1 fix│ ✅ PASS                              ││
│  └──────────┴────────┴────────┴────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

### 12.3 Real-Time UAT Events

During UAT execution, Mission Control receives live events:

```javascript
// Event stream shows UAT events in real-time
// EventStreamPanel updated to show last 2000 events (was 1000)

// Example events in stream:
[14:30:01.234] [QA] [✅] UAT/case_pass — UAT-AUTH-0001: Login with valid credentials (3.2s)
[14:30:04.567] [QA] [✅] UAT/case_pass — UAT-AUTH-0002: Login with wrong password (2.1s)
[14:30:09.890] [QA] [❌] UAT/case_fail — UAT-AUTH-0003: Session timeout (5.0s) → Defect #42
[14:30:10.123] [QA] [🐛] UAT/defect_found — #42: Session timeout not triggered (Critical)
```

### 12.4 Download Functionality

Mission Control provides download endpoints:

```
GET /api/uat/export/all           → Full UAT results (JSON)
GET /api/uat/export/all?format=csv → Full UAT results (CSV)
GET /api/uat/export/suite/:code   → Single suite results (JSON)
GET /api/uat/export/suite/:code?format=csv → Single suite (CSV)
GET /api/uat/export/case/:id      → Single test case with evidence (JSON)
GET /api/uat/export/report        → Final report (Markdown)
GET /api/uat/export/report?format=pdf → Final report (PDF)
GET /api/uat/export/compliance    → Compliance matrix (JSON)
GET /api/uat/export/screenshots/:id → Screenshot ZIP for a test case
GET /api/uat/export/evidence      → All evidence artifacts (ZIP)
```

---

## 13. Sign-Off & Approval Process

### 13.1 Sign-Off Document Template

```markdown
# UAT Sign-Off — {PROJECT_NAME}

## Summary
| Field | Value |
|-------|-------|
| Project | {name} |
| Version | {version} |
| UAT Executed | {date range} |
| Total Cases | {N} |
| Pass Rate | {%}% |
| Coverage | {%}% |
| Open Defects | Critical: {n}, High: {n}, Medium: {n}, Low: {n} |

## Verdict

### QA Agent Assessment
- [ ] ALL P0 test cases PASS
- [ ] ALL P1 test cases PASS
- [ ] Coverage >= 95%
- [ ] Zero open Critical/High defects
- [ ] Compliance mapping 100% complete
- [ ] All evidence collected and verified
- [ ] Report generated and reviewed

**QA Verdict**: {PASS / CONDITIONAL PASS / FAIL}
**QA Signature**: QA/{date}

### Team Leader Review
- [ ] QA evidence reviewed and verified
- [ ] Coverage independently validated
- [ ] Defect resolutions confirmed
- [ ] Report accuracy confirmed
- [ ] Risk assessment reviewed

**TL Verdict**: {APPROVED / REJECTED}
**TL Signature**: TL/{date}
**TL Notes**: {any conditions or observations}

### User Acceptance
- [ ] Business requirements verified met
- [ ] User workflows validated
- [ ] Edge cases acceptable
- [ ] Performance acceptable
- [ ] Ready for production release

**User Verdict**: {ACCEPTED / REJECTED}
**User Signature**: USR/{date}
**User Notes**: {any conditions or requests}
```

### 13.2 Approval Flow

```
1. QA completes UAT_SIGNOFF.md with assessment
2. QA emits event: UAT/signoff_submitted
3. TL reviews report + evidence
4. TL updates UAT_SIGNOFF.md with review
5. TL creates GATE: type=uat_acceptance, blocking=true
6. TL presents to user: "UAT complete. {pass_rate}% pass rate, {coverage}% coverage."
7. User reviews and responds:
   - "approved" / "accepted" → Gate resolved (approved), Release wave unlocked
   - "rejected" / "not acceptable" → Gate resolved (rejected), back to bug fix
   - "{specific feedback}" → Gate resolved (change), targeted fixes then re-test
8. Event emitted: UAT/signoff_complete with decision
```

---

## 14. Downloadable Artifacts

### 14.1 Artifact Formats

| Artifact | Formats | Contents |
|----------|---------|----------|
| Full UAT Results | JSON, CSV | All test cases with results, evidence paths, metadata |
| Suite Results | JSON, CSV | Single suite test cases with results |
| Single Test Case | JSON | Full case detail with steps, evidence, metadata |
| UAT Report | MD, PDF, PPTX | Complete audit report (Section 11) |
| Coverage Matrix | JSON, CSV, MD | CTA → test case traceability |
| Compliance Map | JSON, CSV, MD | Regulation → test case mapping |
| Defect Log | JSON, CSV, MD | All defects with status and resolution |
| Evidence Package | ZIP | All screenshots, videos, logs for a case/suite/all |
| Executive Summary | MD, PDF | 1-page summary for stakeholders |

### 14.2 JSON Export Schema

```json
{
  "project": "string",
  "version": "string",
  "generatedAt": "ISO8601",
  "summary": {
    "totalCases": 0,
    "passed": 0,
    "failed": 0,
    "blocked": 0,
    "skipped": 0,
    "coverage": 0.0,
    "complianceStatus": "COMPLIANT",
    "verdict": "PASS"
  },
  "suites": [
    {
      "id": "AUTH",
      "name": "Authentication",
      "totalCases": 0,
      "passed": 0,
      "failed": 0,
      "blocked": 0,
      "skipped": 0,
      "coverage": 0.0,
      "status": "PASS",
      "cases": [
        {
          "id": "UAT-AUTH-0001",
          "title": "string",
          "feature": "string",
          "priority": "P0",
          "ctaElement": "string",
          "ctaSelector": "string",
          "userRole": "string",
          "device": "string",
          "browser": "string",
          "compliance": ["SOC2", "ISO"],
          "preconditions": ["string"],
          "steps": [
            {
              "number": 1,
              "action": "string",
              "element": "string",
              "inputData": "string"
            }
          ],
          "expectedResult": "string",
          "actualResult": "string",
          "status": "pass",
          "evidence": {
            "screenshotBefore": "path",
            "screenshotAfter": "path",
            "screenshotError": "path",
            "video": "path",
            "consoleLog": "path",
            "networkLog": "path",
            "apiResponse": "path"
          },
          "defect": {
            "id": "DEF-001",
            "githubIssue": 42,
            "severity": "critical",
            "status": "resolved",
            "fixCommit": "abc1234"
          },
          "execution": {
            "executedBy": "QA",
            "executedAt": "ISO8601",
            "duration_ms": 3200,
            "environment": "local",
            "build": "abc1234",
            "round": 1,
            "retryCount": 0
          }
        }
      ]
    }
  ],
  "compliance": {
    "applicable": ["ISO25010", "GDPR", "SOC2"],
    "mappings": [
      {
        "regulation": "SOC2",
        "requirement": "CC6.1",
        "testCases": ["UAT-AUTH-0001"],
        "status": "PASS"
      }
    ]
  },
  "defects": [
    {
      "id": "DEF-001",
      "title": "string",
      "suite": "AUTH",
      "testCase": "UAT-AUTH-0003",
      "severity": "critical",
      "status": "resolved",
      "githubIssue": 42,
      "fixCommit": "abc1234",
      "foundAt": "ISO8601",
      "resolvedAt": "ISO8601"
    }
  ]
}
```

### 14.3 CSV Export Schema

```csv
Test Case ID,Title,Suite,Feature,Priority,CTA Element,CTA Selector,User Role,Device,Browser,Compliance,Status,Expected Result,Actual Result,Duration (ms),Defect ID,Defect Severity,Screenshot Before,Screenshot After,Executed By,Executed At,Environment,Build,Round
UAT-AUTH-0001,Login with valid credentials,AUTH,Authentication,P0,"Sign In" button,data-testid="login-btn",guest,Desktop,Chrome,"SOC2,ISO",pass,Redirect to dashboard,Redirected to dashboard,3200,,,before.png,after.png,QA,2026-03-02T14:30:00Z,local,abc1234,1
```

---

## 15. Team-Specific UAT Requirements

### 15.1 Team Customization

Each team extends this base protocol with domain-specific UAT:

| Team Category | Additional UAT Focus |
|---------------|---------------------|
| **Full-Stack** (01) | All categories in Section 2 |
| **Mobile** (02, 11, 12, 30) | Touch gestures, orientation, app lifecycle, push notifications, deep links |
| **Enterprise** (03, 06, 27) | SSO, RBAC, audit logging, multi-tenancy, SLA compliance |
| **Systems** (04, 09) | CLI commands, signal handling, memory bounds, file system operations |
| **Data/AI** (05, 15, 16, 38-40) | Model accuracy, data pipeline integrity, training data validation |
| **Frontend** (07, 26) | Cross-browser matrix, responsive breakpoints, PWA offline, animations |
| **Backend** (08) | API contract validation, rate limiting, webhook delivery, batch processing |
| **DevOps** (13, 28, 29) | Infrastructure provisioning, scaling, failover, monitoring alerts |
| **Security** (17) | Penetration test results, vulnerability remediation, compliance audit |
| **IoT** (18) | Device provisioning, firmware OTA, sensor data, offline queue |
| **Game** (19) | Input latency, frame rate, save/load, multiplayer sync |
| **Blockchain** (20) | Transaction signing, wallet connect, gas estimation, contract interaction |
| **AI Agents** (21) | Agent behavior, tool use, hallucination rate, context window |
| **QA** (34) | Meta-testing: test the test framework itself |
| **E-commerce** (48) | Cart, checkout, payment, refund, inventory, shipping flows |
| **Real-time** (49) | WebSocket connection, message ordering, reconnection, latency |
| **Accessibility** (50) | Extended WCAG testing, assistive technology matrix |
| **Multimedia** (52-59) | Render output, codec compatibility, streaming stability |

### 15.2 Minimum UAT Test Case Counts

Based on project complexity (from strategy file):

| Project Size | Min Test Cases | Min Suites | Min Scenarios |
|-------------|---------------|------------|---------------|
| Small (1-3 features) | 50 | 5 | 3 |
| Medium (4-8 features) | 150 | 10 | 8 |
| Large (9-15 features) | 350 | 15 | 15 |
| Enterprise (16+ features) | 500+ | 20+ | 25+ |

### 15.3 UAT Evidence Storage

```
.team/uat/
├── evidence/
│   ├── screenshots/          # PNG screenshots (max 2MB each)
│   ├── videos/              # MP4 recordings (max 50MB each)
│   ├── logs/                # Console + network logs
│   │   ├── *_console.log
│   │   ├── *_network.har
│   │   └── *_api.json
│   └── metadata/            # Screenshot metadata JSON
│       └── *.meta.json
```

---

## Appendix A: Quick Reference Checklist

```
PRE-UAT CHECKLIST (before Wave 3.7):
□ All automated tests pass (Wave 3 complete)
□ Build succeeds with zero errors
□ Test environment deployed and accessible
□ Test data seeded for all roles
□ CTA discovery completed
□ Test cases written (>= 95% CTA coverage)
□ Compliance requirements identified
□ Evidence collection configured

UAT EXECUTION CHECKLIST:
□ Round 1 execution complete
□ All screenshots captured
□ All defects logged as GitHub issues
□ Defect triage completed
□ Critical/High defects fixed
□ Round 2 regression executed
□ Coverage verified >= 95%
□ Compliance matrix 100% mapped

POST-UAT CHECKLIST:
□ UAT_REPORT_FINAL.md generated
□ UAT_MASTER_INDEX.md complete
□ UAT_COVERAGE_MATRIX.md complete
□ UAT_COMPLIANCE_MAP.md complete
□ JSON + CSV exports produced
□ UAT_SIGNOFF.md completed by QA
□ TL review and approval
□ User acceptance obtained
□ All evidence archived in .team/uat/evidence/
□ Mission Control UAT dashboard updated
```

---

## Appendix B: UAT Event Emission Commands

```bash
# QA agent emits UAT events to Mission Control via API:

# Discovery complete
curl -X POST http://localhost:4201/api/events -H "Content-Type: application/json" -d '{
  "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
  "sessionId": "'"$MC_SESSION_ID"'",
  "source": {"tool": "uat-executor"},
  "category": "UAT",
  "type": "discovery_complete",
  "severity": "info",
  "agent": {"role": "QA"},
  "payload": {"totalCTAs": 185, "pages": 24}
}'

# Test case pass
curl -X POST http://localhost:4201/api/events -H "Content-Type: application/json" -d '{
  "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
  "sessionId": "'"$MC_SESSION_ID"'",
  "source": {"tool": "uat-executor"},
  "category": "UAT",
  "type": "case_pass",
  "severity": "info",
  "agent": {"role": "QA"},
  "payload": {
    "testCaseId": "UAT-AUTH-0001",
    "title": "Login with valid credentials",
    "suiteId": "AUTH",
    "status": "pass",
    "duration_ms": 3200,
    "screenshotBefore": ".team/uat/evidence/screenshots/UAT-AUTH-0001_before.png",
    "screenshotAfter": ".team/uat/evidence/screenshots/UAT-AUTH-0001_after.png"
  },
  "meta": {"duration_ms": 3200}
}'

# Test case fail
curl -X POST http://localhost:4201/api/events -H "Content-Type: application/json" -d '{
  "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
  "sessionId": "'"$MC_SESSION_ID"'",
  "source": {"tool": "uat-executor"},
  "category": "UAT",
  "type": "case_fail",
  "severity": "error",
  "agent": {"role": "QA"},
  "payload": {
    "testCaseId": "UAT-AUTH-0003",
    "title": "Session timeout after 30 minutes",
    "suiteId": "AUTH",
    "status": "fail",
    "duration_ms": 5000,
    "expectedResult": "Session timeout modal appears",
    "actualResult": "No modal, stale session persisted",
    "defectId": "DEF-001",
    "defectSeverity": "critical",
    "screenshotBefore": ".team/uat/evidence/screenshots/UAT-AUTH-0003_before.png",
    "screenshotError": ".team/uat/evidence/screenshots/UAT-AUTH-0003_error.png",
    "consoleLog": ".team/uat/evidence/logs/UAT-AUTH-0003_console.log"
  },
  "meta": {"duration_ms": 5000, "error": "Session timeout not triggered"}
}'
```

---

> **This protocol is MANDATORY for all 60 Amenthyx AI Teams.**
> Referenced by: ENHANCED_EXECUTION_PROTOCOL.md Section 12
> Integrated with: Mission Control UAT Dashboard
> Version: 1.0 | Date: 2026-03-02
