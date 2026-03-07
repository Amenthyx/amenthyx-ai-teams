# Post-Mortem Template v1.0

## Amenthyx AI Teams — Shared Template

**Purpose**: Structured template for conducting project post-mortems after team execution completes. Builds on RETRO agent output to produce a comprehensive, evidence-backed review.

**Usage**: Copy this template, fill in all sections, and store in the project's `.ai/` folder alongside the evidence manifest.

---

## 1. Header

```markdown
# Post-Mortem: [Project Name]

| Field | Value |
|-------|-------|
| **Project Name** | [name] |
| **Team** | [team name from 59 teams] |
| **Sprint/Phase** | [sprint number or phase name] |
| **Start Date** | [YYYY-MM-DD] |
| **End Date** | [YYYY-MM-DD] |
| **Duration (Planned)** | [X days/weeks] |
| **Duration (Actual)** | [X days/weeks] |
| **Post-Mortem Date** | [YYYY-MM-DD] |
| **Facilitator** | [PM or TL name] |
| **Participants** | [list of roles/agents involved] |
| **RETRO Report Link** | [path or URL to RETRO agent output] |
```

---

## 2. Executive Summary

*Write 3-5 sentences summarizing the project outcome, major wins, major issues, and overall assessment.*

```markdown
[Project Name] was executed by the [team] team from [start] to [end]. The primary
objective was [objective]. The project was delivered [on time / X days late / X days early]
with [quality assessment]. Key highlights include [major win]. The most significant
challenge was [major issue].
```

---

## 3. Goals vs Outcomes

| # | Goal | Target | Actual Outcome | Status |
|---|------|--------|---------------|--------|
| 1 | [Goal description] | [Measurable target] | [What was achieved] | ACHIEVED / PARTIAL / MISSED |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

**Overall Goal Completion Rate**: [X/Y goals achieved] ([Z%])

---

## 4. Timeline of Key Events

| Date | Event | Impact | Notes |
|------|-------|--------|-------|
| [YYYY-MM-DD] | Project kickoff | — | Strategy file loaded, team activated |
| [YYYY-MM-DD] | [Milestone 1] | [positive/negative/neutral] | [details] |
| [YYYY-MM-DD] | [Blocker discovered] | [negative] | [how it was resolved] |
| [YYYY-MM-DD] | [Key decision made] | [impact] | [rationale] |
| [YYYY-MM-DD] | QA sign-off | [positive] | All gates passed |
| [YYYY-MM-DD] | Project delivered | — | Handoff to ops/maintenance |

---

## 5. What Went Well

*List items with supporting evidence. Reference specific artifacts, metrics, or agent outputs.*

| # | Item | Evidence |
|---|------|----------|
| 1 | [Description of what went well] | [Link to artifact, metric, or RETRO finding] |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |

---

## 6. What Didn't Go Well

*List items with supporting evidence. Be specific and blameless — focus on process and systems, not individuals.*

| # | Item | Evidence | Impact |
|---|------|----------|--------|
| 1 | [Description of what didn't go well] | [Link to artifact, metric, or RETRO finding] | [Time lost, quality impact, etc.] |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

---

## 7. Root Cause Analysis (5 Whys)

*For each major issue from Section 6, apply the 5 Whys technique.*

### Issue: [Issue title from Section 6]

```
Why 1: [Why did this happen?]
   -> [Answer]

Why 2: [Why did that happen?]
   -> [Answer]

Why 3: [Why did that happen?]
   -> [Answer]

Why 4: [Why did that happen?]
   -> [Answer]

Why 5: [Why did that happen?]
   -> [Root cause identified]
```

**Root Cause**: [One-line summary]
**Category**: [Process / Technical / Communication / Tooling / External]

*(Repeat for each major issue)*

---

## 8. Metrics Comparison

| Metric | Planned | Actual | Delta | Assessment |
|--------|---------|--------|-------|------------|
| **Timeline** (days) | [X] | [Y] | [+/-Z] | ON TRACK / OVER / UNDER |
| **Budget** (hours/cost) | [X] | [Y] | [+/-Z] | ON TRACK / OVER / UNDER |
| **Test Coverage** (%) | [X%] | [Y%] | [+/-Z%] | MET / BELOW / EXCEEDED |
| **Quality Score** (1-10) | [X] | [Y] | [+/-Z] | MET / BELOW / EXCEEDED |
| **Defects Found** | [X] | [Y] | [+/-Z] | — |
| **Defects Resolved** | [X] | [Y] | [+/-Z] | — |
| **Security Issues** | 0 | [Y] | [+Y] | — |
| **CI/CD Pass Rate** (%) | 100% | [Y%] | [-Z%] | — |
| **Deployment Count** | [X] | [Y] | [+/-Z] | — |
| **Rollback Count** | 0 | [Y] | [+Y] | — |

---

## 9. Lessons Learned

### Process

| # | Lesson | Recommendation |
|---|--------|---------------|
| 1 | [What we learned about our process] | [What to do differently] |
| 2 | | |

### Technical

| # | Lesson | Recommendation |
|---|--------|---------------|
| 1 | [What we learned technically] | [What to do differently] |
| 2 | | |

### Communication

| # | Lesson | Recommendation |
|---|--------|---------------|
| 1 | [What we learned about communication] | [What to do differently] |
| 2 | | |

---

## 10. Action Items

| # | Action | Owner | Priority | Deadline | Status |
|---|--------|-------|----------|----------|--------|
| 1 | [Specific action to take] | [Role/Agent] | Critical / High / Medium / Low | [YYYY-MM-DD] | TODO / IN PROGRESS / DONE |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

**Follow-up review date**: [YYYY-MM-DD] (to verify action items are completed)

---

## 11. Appendix

### Referenced Artifacts

| Artifact | Location |
|----------|----------|
| RETRO Agent Report | [path or URL] |
| Evidence Manifest | [path or URL] |
| PPTX Report | [path or URL] |
| PDF Report | [path or URL] |
| Test Results | [path or URL] |
| CI/CD Logs | [path or URL] |
| Security Audit (DEPGUARD) | [path or URL] |
| Kanban Board Snapshot | [path or URL] |

### Sign-Off

| Role | Name/Agent | Date | Signature |
|------|-----------|------|-----------|
| Team Lead (TL) | | | APPROVED / PENDING |
| Project Manager (PM) | | | APPROVED / PENDING |
| QA Lead | | | APPROVED / PENDING |
| RETRO Agent | | | APPROVED / PENDING |

---

*Template version: 1.0 | Last updated: 2026-03-07*
