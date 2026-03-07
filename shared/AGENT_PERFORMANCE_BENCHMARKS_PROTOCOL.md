# Agent Performance Benchmarks Protocol — Amenthyx AI Teams v3.0

## Purpose

This protocol defines how agent performance is tracked, stored, aggregated, and analyzed across sessions. It builds institutional metrics that enable trend analysis, anomaly detection, and continuous improvement of team execution quality.

---

## What Is Tracked Per Agent Per Session

Every agent that participates in a session has the following metrics recorded:

| Metric | Type | Description |
|--------|------|-------------|
| Task completion time | Planned vs actual minutes | Measures estimation accuracy and execution speed |
| Token usage | Input + output token counts | Tracks resource consumption per agent role |
| Error/rework count | Integer | Number of times a task was sent back for revision |
| Evidence quality score | Float (0-10) | Completeness and accuracy of evidence artifacts |
| Code review score | Float (0-10) | Score assigned by the CR Agent (null if no review ran) |
| Test pass rate | Float (0.0-1.0) | Percentage of tests passing for code produced by this agent |
| Commit count | Integer | Number of atomic commits attributed to this agent |
| Lines of code produced | Integer | Net lines added (insertions minus deletions) |

### Scoring Criteria

**Evidence Quality Score (0-10):**
- 0-3: Missing or incomplete evidence. No screenshots, no logs.
- 4-6: Partial evidence. Some artifacts present but gaps exist.
- 7-8: Solid evidence. All required artifacts present, clearly labeled.
- 9-10: Exceptional. Evidence is thorough, reproducible, and well-documented.

**Code Review Score (0-10):**
- 0-3: Major issues found. Security flaws, broken logic, no error handling.
- 4-6: Moderate issues. Code works but has style, performance, or maintainability concerns.
- 7-8: Clean code. Minor suggestions only.
- 9-10: Exemplary. No issues found, follows all conventions, well-structured.

---

## Storage

Benchmarks are stored as JSON files in the project's `.team/benchmarks/` directory:

```
.team/benchmarks/AGENT_BENCHMARK_{SESSION_ID}.json
```

Each session produces exactly one benchmark file. Session IDs are UUIDs generated at session start by Mission Control.

---

## JSON Schema

```json
{
  "sessionId": "uuid",
  "projectName": "string",
  "teamName": "string",
  "date": "ISO-8601",
  "durationMinutes": 120,
  "agents": [
    {
      "role": "BE",
      "taskCount": 5,
      "completedCount": 5,
      "reworkCount": 1,
      "plannedDurationMinutes": 30,
      "actualDurationMinutes": 45,
      "tokenUsage": {
        "input": 50000,
        "output": 30000
      },
      "evidenceScore": 8.5,
      "codeReviewScore": 7.2,
      "testPassRate": 0.95,
      "commitCount": 12,
      "linesOfCode": 450
    }
  ],
  "summary": {
    "totalTasks": 25,
    "totalCompleted": 24,
    "totalReworks": 3,
    "overallTestPassRate": 0.93,
    "averageEvidenceScore": 8.1,
    "averageCodeReviewScore": 7.8
  }
}
```

### Field Notes

- `role` uses the standard Amenthyx agent abbreviations: `PM`, `SA`, `BE`, `FE`, `DB`, `QA`, `SEC`, `DEVOPS`, `CR`, `RETRO`, `PERF`, etc.
- `codeReviewScore` is `null` for agents whose output was not reviewed (e.g., PM, RETRO).
- `testPassRate` is `null` for non-coding agents.
- `summary` is computed by the PM Agent at session end.

---

## Collection Process

1. **Session start**: Mission Control generates a `sessionId` and initializes the benchmark file with metadata.
2. **During execution**: each agent logs its own start time, end time, and rework events to a local buffer.
3. **Post-execution**: the QA Agent records test pass rates. The CR Agent records review scores.
4. **Session end**: the PM Agent collects all agent buffers, computes the summary, and writes the final benchmark JSON.
5. **Retro Agent**: reads the benchmark file as input for the retrospective report.

---

## Aggregation

The concept of a benchmark aggregator is defined here for implementation as `shared/benchmark_aggregator.py`.

### Aggregator Responsibilities

- **Load**: read all `AGENT_BENCHMARK_*.json` files from `.team/benchmarks/`.
- **Merge**: combine agent records across sessions, keyed by `role`.
- **Compute**: calculate per-role averages, medians, and standard deviations for all numeric metrics.
- **Output**: produce `AGGREGATE_BENCHMARKS.json` with historical statistics.

### Aggregation Dimensions

| Dimension | Description |
|-----------|-------------|
| Per-role across sessions | How does the BE Agent perform on average? |
| Per-session across roles | Which session had the best overall quality? |
| Per-team across projects | How does the fullStack team compare to the backend team? |
| Time series | How do metrics trend over the last N sessions? |

---

## Leaderboard

The aggregator produces a leaderboard ranking agents by a composite score:

```
compositeScore = (0.25 * normalizedCompletionRate)
               + (0.20 * normalizedEvidenceScore)
               + (0.20 * normalizedCodeReviewScore)
               + (0.15 * normalizedTestPassRate)
               + (0.10 * normalizedEstimationAccuracy)
               + (0.10 * normalizedEfficiency)
```

Where:
- `normalizedCompletionRate` = completedCount / taskCount
- `normalizedEstimationAccuracy` = 1 - abs(planned - actual) / planned, clamped to [0, 1]
- `normalizedEfficiency` = linesOfCode / actualDurationMinutes (normalized against team average)

Leaderboard output is a ranked list written to `.team/benchmarks/LEADERBOARD.md`:

```markdown
# Agent Leaderboard (Last 10 Sessions)

| Rank | Role | Composite | Completion | Evidence | CR Score | Tests | Sessions |
|------|------|-----------|------------|----------|----------|-------|----------|
| 1 | FE | 8.7 | 100% | 9.2 | 8.5 | 0.98 | 10 |
| 2 | BE | 8.4 | 96% | 8.8 | 7.9 | 0.95 | 10 |
| 3 | DB | 8.1 | 100% | 8.5 | 8.0 | 0.91 | 8 |
```

---

## Trend Analysis

The aggregator tracks metric movement over time to answer: are agents improving?

- **Rolling average**: computed over the last 5, 10, and 20 sessions.
- **Direction indicator**: each metric is tagged as `improving`, `stable`, or `declining` based on comparison of the last 5 sessions vs the prior 5.
- **Threshold**: a change of more than 10% triggers a direction change flag.

Trends are included in the aggregate output and surfaced by the Retro Agent during retrospectives.

---

## Anomaly Detection

The aggregator flags anomalies when an agent's metrics deviate significantly from their own historical baseline:

| Anomaly Type | Trigger Condition |
|--------------|-------------------|
| Performance drop | Any metric falls more than 2 standard deviations below the agent's rolling average |
| Rework spike | Rework count exceeds 3x the agent's average for that role |
| Estimation miss | Actual duration exceeds planned duration by more than 100% |
| Test regression | Test pass rate drops below 0.80 when the agent's average is above 0.90 |
| Token spike | Token usage exceeds 3x the agent's average (possible infinite loop or excessive retries) |

Anomalies are logged to `.team/benchmarks/ANOMALIES.md` with the session ID, agent role, anomaly type, and the triggering values.

The PM Agent is notified of anomalies so corrective action can be taken in subsequent sessions (e.g., reassigning tasks, adjusting estimates, investigating root causes).

---

## Integration with Other Protocols

### Retro Agent

The Retro Agent reads all benchmark files from the current session and the last 5 sessions. It includes:
- Performance comparison against historical averages
- Identification of improving and declining agents
- Specific recommendations based on anomaly data

### Mission Control

Mission Control displays a summary dashboard at session start showing:
- Last session's composite scores per agent
- Any active anomalies from previous sessions
- Trend indicators (up/down/stable) for each role

### PPTX/PDF Reports

The report generators can include a benchmarks appendix showing key metrics, trends, and the current leaderboard when the `--include-benchmarks` flag is passed.

---

## Privacy and Data Boundaries

- Benchmark data is **per-project, per-user**. It lives inside the project's `.team/` directory.
- Benchmarks are **never shared** across different users' projects.
- Benchmarks are **never uploaded** to any external service unless the user explicitly configures it.
- When a project is deleted, its benchmarks are deleted with it.
- Aggregation only operates within a single project's benchmark history.
- In offline mode, benchmarks are stored locally and follow the same sync protocol as other `.team/` artifacts.

---

## File Listing

| File | Location | Purpose |
|------|----------|---------|
| Per-session benchmark | `.team/benchmarks/AGENT_BENCHMARK_{SESSION_ID}.json` | Raw metrics for one session |
| Aggregate benchmarks | `.team/benchmarks/AGGREGATE_BENCHMARKS.json` | Computed statistics across sessions |
| Leaderboard | `.team/benchmarks/LEADERBOARD.md` | Ranked agent performance table |
| Anomalies log | `.team/benchmarks/ANOMALIES.md` | Flagged performance deviations |
| Aggregator script | `shared/benchmark_aggregator.py` | Aggregation logic (concept, not yet implemented) |

---

## Summary

This protocol turns agent execution into measurable, trackable data. Over time, it reveals which roles consistently deliver, which need support, and whether the team as a whole is improving. The Retro Agent and Mission Control consume this data to close the feedback loop, making each session incrementally better than the last.
