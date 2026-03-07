# Agent Memory Protocol v1.0

## Amenthyx AI Teams — Institutional Learning System

---

## 1. Overview

Agents write learnings during execution. Future sessions on the same project load these learnings. This prevents repeating mistakes, preserves architectural rationale, and creates institutional knowledge that compounds across sessions.

Every team execution generates knowledge — bug fixes, performance discoveries, tool quirks, architecture decisions. Without a memory protocol, each session starts from zero. This protocol ensures that hard-won knowledge persists and is automatically surfaced to the agents who need it.

**Principles:**

- Every non-trivial discovery gets recorded, not just failures.
- Learnings are structured for machine consumption, not just human reading.
- Confidence levels prevent stale or uncertain knowledge from being treated as gospel.
- The system is append-only by default — nothing is deleted, only superseded.

---

## 2. Learning Types

| Type | Pattern | Example |
|------|---------|---------|
| **Bug Pattern** | "X caused Y, fixed with Z" | "Circular import in auth module caused silent failure at runtime, fixed by lazy-loading the dependency" |
| **Performance Insight** | "A is Nx faster than B for use case C" | "esbuild is 12x faster than webpack for this monorepo's dev builds" |
| **Architecture Decision** | "Chose X over Y because Z" | "Chose event sourcing over CRUD because audit trail is a regulatory requirement" |
| **Tool Quirk** | "Tool X fails silently when Y — always check Z" | "Prisma migrate deploy exits 0 even when migrations fail — always check stderr output" |
| **Domain Knowledge** | "In this codebase, X always means Y" | "All files prefixed with `_` are internal modules and must not be imported externally" |
| **Anti-Pattern** | "Never do X because Y" | "Never use `any` cast on the API response types — downstream validators depend on strict typing" |
| **Workaround** | "Official approach X doesn't work, use Y instead" | "The documented `--incremental` flag causes OOM on this repo — use `--parallel 4` instead" |

---

## 3. Storage Structure

All learnings are stored under `.team/learnings/` in the project root:

```
.team/learnings/
├── INDEX.md                 # Searchable index of all learnings
├── bugs/                    # Bug patterns by category
│   ├── LEARNING_001.md
│   └── LEARNING_002.md
├── architecture/            # Architecture decisions and rationale
│   ├── LEARNING_003.md
│   └── LEARNING_004.md
├── performance/             # Performance insights and benchmarks
│   ├── LEARNING_005.md
│   └── LEARNING_006.md
├── tools/                   # Tool-specific knowledge and quirks
│   ├── LEARNING_007.md
│   └── LEARNING_008.md
├── domain/                  # Project domain knowledge
│   ├── LEARNING_009.md
│   └── LEARNING_010.md
├── anti-patterns/           # Explicit warnings — things to avoid
│   └── LEARNING_011.md
└── workarounds/             # Non-obvious solutions to known issues
    └── LEARNING_012.md
```

Learning IDs are globally sequential across all categories. The category folder determines where the file lives, but the ID is unique across the entire project.

---

## 4. Learning Document Format

Every learning follows this exact template:

```markdown
# Learning #{ID}: {Title}

## Category: [bug|architecture|performance|tool|domain|anti-pattern|workaround]
## Confidence: [high|medium|low]
## Agent: {role that discovered this}
## Wave: {wave number when discovered}
## Date: {ISO 8601 timestamp}
## Status: [active|superseded]

## Context
[What was happening when this was discovered. Include the task, the goal,
and what the agent was attempting to do.]

## Discovery
[The actual finding — what was learned. Be precise and specific.
This is the core knowledge payload.]

## Evidence
[Link to commit, log output, test result, or screenshot that proves this.
At minimum, reference the file path and line number where the issue was observed.]

## Application
[How future agents should use this knowledge. Include concrete instructions:
"When doing X, always Y" or "Before running X, check Y first."]

## Tags
[Comma-separated searchable tags: e.g., react, typescript, api, database, auth, ci, docker]
```

**Field Rules:**

- `Confidence: high` — Verified by tests or production observation. Agents should treat as fact.
- `Confidence: medium` — Observed once, plausible but not yet reproduced. Agents should be aware.
- `Confidence: low` — Hypothesis or edge case. Agents should verify before relying on it.
- `Status: superseded` — Append `[SUPERSEDED by #${NEW_ID}]` to the title and update status field.

---

## 5. Learning Lifecycle

### 5.1 Capture

Any agent can write a learning at any time during execution. The trigger is any moment where the agent thinks: "I wish I had known this before starting."

**When to capture:**
- A bug took more than one attempt to fix.
- A tool behaved differently than documented.
- A performance optimization yielded measurable results.
- An architectural choice was made with non-obvious rationale.
- A pattern in the codebase was discovered that is not documented anywhere.

**How to capture:**
1. Create a new `LEARNING_{NEXT_ID}.md` in the appropriate category folder.
2. Fill in all template fields. Do not leave any field blank — write "N/A" if truly not applicable.
3. Notify the TL that a new learning was recorded.

### 5.2 Validate

The Tech Lead (TL) reviews learnings at wave boundaries:
- Assigns or adjusts the `Confidence` level based on evidence strength.
- Flags learnings that contradict existing ones for resolution.
- Merges duplicate learnings into the one with stronger evidence.

### 5.3 Index

The Retrospective Agent (or Learning Curator) updates `INDEX.md` after each wave:
- Adds new entries with ID, title, category, confidence, and tags.
- Marks superseded entries.
- Sorts by category, then by ID descending (newest first within category).

### 5.4 Load

On session resume or new session start, the TL scans `.team/learnings/INDEX.md` for relevant entries and injects them into agent prompts. See Section 7 (Injection Protocol) for details.

### 5.5 Retire

Learnings are never deleted. When a learning is contradicted by a newer finding:
1. Create the new learning with the corrected information.
2. Update the old learning's title: `# Learning #003: [SUPERSEDED by #017] Original Title`
3. Set `Status: superseded` in the old learning.
4. Update INDEX.md to reflect the supersession.

---

## 6. INDEX.md Template

```markdown
# Learnings Index

> Auto-updated by Learning Curator at wave boundaries.
> Last updated: {ISO 8601 timestamp}
> Total learnings: {count} | Active: {count} | Superseded: {count}

## Bugs
| ID | Title | Confidence | Tags | Status |
|----|-------|------------|------|--------|
| 001 | Circular import causes silent auth failure | high | auth, imports, python | active |
| 002 | Race condition in websocket reconnect | medium | websocket, async | active |

## Architecture
| ID | Title | Confidence | Tags | Status |
|----|-------|------------|------|--------|
| 003 | Event sourcing chosen for audit compliance | high | architecture, database | active |

## Performance
| ID | Title | Confidence | Tags | Status |
|----|-------|------------|------|--------|
| 005 | esbuild 12x faster than webpack for dev | high | build, tooling | active |

## Tools
| ID | Title | Confidence | Tags | Status |
|----|-------|------------|------|--------|
| 007 | Prisma migrate deploy exits 0 on failure | high | prisma, database, ci | active |

## Domain
| ID | Title | Confidence | Tags | Status |
|----|-------|------------|------|--------|
| 009 | Underscore-prefixed files are internal-only | high | conventions, imports | active |

## Anti-Patterns
| ID | Title | Confidence | Tags | Status |
|----|-------|------------|------|--------|
| 011 | Never use `any` cast on API response types | high | typescript, api | active |

## Workarounds
| ID | Title | Confidence | Tags | Status |
|----|-------|------------|------|--------|
| 012 | Use --parallel 4 instead of --incremental | medium | build, tooling | active |
```

---

## 7. Injection Protocol

When spawning an agent, the TL performs the following:

1. **Scan** `.team/learnings/INDEX.md` for entries matching:
   - The agent's role (e.g., backend learnings for Backend Engineer).
   - The task's tags (e.g., "database" tags for a migration task).
   - The current wave's category (e.g., architecture learnings during Planning wave).
2. **Filter** to `active` status only. Exclude `superseded` entries.
3. **Rank** by confidence (high first), then by recency (newest first).
4. **Cap** at 10 learnings per agent to avoid prompt bloat.
5. **Inject** into the agent's system prompt:

```
RELEVANT LEARNINGS FROM PREVIOUS SESSIONS:
- Learning #003: Event sourcing chosen for audit compliance (confidence: high)
- Learning #007: Prisma migrate deploy exits 0 on failure — always check stderr (confidence: high)
- Learning #012: Use --parallel 4 instead of --incremental for builds (confidence: medium)

Apply these learnings proactively. If you encounter a situation where a learning
is no longer accurate, record a new learning that supersedes it.
```

---

## 8. Search and Filter Protocol

Agents and the TL can query the learnings index using these filter dimensions:

| Filter | Syntax | Example |
|--------|--------|---------|
| By category | `category:bugs` | All bug pattern learnings |
| By tag | `tag:typescript` | All learnings tagged with typescript |
| By confidence | `confidence:high` | Only high-confidence learnings |
| By status | `status:active` | Only non-superseded learnings |
| By wave | `wave:2` | Learnings discovered during wave 2 |
| By agent | `agent:backend-engineer` | Learnings from a specific role |
| Combined | `category:bugs tag:api confidence:high` | High-confidence API bug patterns |

Filters are applied against INDEX.md. When a filter matches, the full learning document is loaded from the appropriate category folder for detailed review.

---

## 9. Learning Curator Sub-Role

```
ROLE: Learning Curator
REPORTS TO: Tech Lead
ACTIVATED: End of each wave, or on-demand during Retrospective

RESPONSIBILITIES:
1. Collect all learnings written during the wave by any agent.
2. Validate format compliance — ensure all template fields are filled.
3. De-duplicate — merge learnings that describe the same finding.
4. Cross-reference — link related learnings (e.g., a bug and its workaround).
5. Update INDEX.md with all new and modified entries.
6. Flag contradictions for TL resolution.
7. Compute learning velocity metrics (learnings per wave, by category).

TRIGGER: The TL invokes the Learning Curator at wave boundaries with:
  "Curate learnings for Wave {N}. Scan .team/learnings/ for new entries,
   validate format, de-duplicate, update INDEX.md."

OUTPUT: Updated INDEX.md + summary report:
  - New learnings added: {count}
  - Duplicates merged: {count}
  - Contradictions flagged: {count}
  - Superseded: {count}
```

---

## 10. Retrospective Agent Integration

The Retrospective Agent (activated at the end of each execution cycle) is the primary source of new learnings. Its integration with the memory protocol:

1. **Post-Execution Scan**: The Retro Agent reviews all commits, test results, CI logs, and agent conversations from the completed cycle.
2. **Learning Extraction**: For each non-trivial finding, the Retro Agent creates a learning document following the template in Section 4.
3. **Categorization**: The Retro Agent assigns the correct category folder and tags based on the content.
4. **Handoff**: The Retro Agent notifies the Learning Curator that new learnings are ready for indexing.
5. **Cross-Session Linking**: If the Retro Agent identifies a pattern across multiple sessions (e.g., the same bug recurring), it escalates to `confidence: high` and adds a note in the Application section.

**Retro Agent Learning Extraction Prompt:**

```
Review the execution log for this wave. For each of the following, create a
learning document if one does not already exist:

- Bugs that took more than one attempt to resolve.
- Tools or libraries that behaved unexpectedly.
- Performance improvements with measurable deltas.
- Architecture decisions that were debated or revised.
- Patterns in the codebase that were not immediately obvious.
- Approaches that were attempted and abandoned (anti-patterns).
- Workarounds for known issues in dependencies or tooling.

For each learning, provide full evidence (commit hash, file path, log excerpt).
Do not create learnings for trivial or obvious findings.
```

---

## 11. Metrics and Health

Track the following to measure the memory system's effectiveness:

| Metric | Target | Description |
|--------|--------|-------------|
| Learnings per wave | 3-8 | Too few means agents are not capturing. Too many means low signal-to-noise. |
| Supersession rate | < 20% | High rate means initial learnings are unreliable. |
| Injection hit rate | > 50% | Percentage of injected learnings that agents actually reference during execution. |
| Repeat bug rate | 0% for high-confidence | If a high-confidence bug learning exists and the same bug recurs, the injection protocol failed. |
| Index freshness | Updated every wave | INDEX.md should never be more than one wave behind. |

---

## 12. Bootstrap Protocol

For new projects with no existing learnings:

1. Create the `.team/learnings/` directory structure (all folders from Section 3).
2. Create an empty `INDEX.md` using the template from Section 6 (with no entries).
3. During Wave 1 (Planning), the TL records any known constraints or domain knowledge as initial learnings with `confidence: medium`.
4. After Wave 1 completes, the Learning Curator performs the first indexing pass.
5. From Wave 2 onward, the injection protocol is active.

---
