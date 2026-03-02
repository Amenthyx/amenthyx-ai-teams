# Cost Estimation — Amenthyx Mission Control
## Date: 2026-03-02T12:00:00Z
## Team: Full-Stack (11 roles)
## Strategy: ./STRATEGY_DASHBOARD.md

---

### 1. Token & AI Cost Estimate

**Model**: Claude Opus 4.6 (`claude-opus-4-6`)
**Pricing**: $15/MTok input, $75/MTok output (Opus 4.6)

| Wave | Agents | Description | Est. Input Tokens | Est. Output Tokens | Est. Cost (USD) |
|------|--------|-------------|-------------------|--------------------|--------------------|
| Wave 0 | TL | Read strategy + TEAM.md + protocol, produce cost estimate | ~8K | ~5K | $0.50 |
| Wave 0.5 | TL | Dashboard scaffold setup (auto-deploy spec — no code yet) | ~2K | ~2K | $0.18 |
| Wave 1 | PM | Project Charter, Milestones, Kanban, Timeline, Risk Register, GitHub setup, task assignments for all agents | ~15K | ~25K | $2.10 |
| Wave 1.5 | MKT + LEGAL | Marketing: positioning for developer tool. Legal: open-source licensing (MIT), compliance review | ~10K | ~15K | $1.28 |
| Wave 2 | BE + FE + MOB + DEVOPS + INFRA (5 agents in parallel) | **Core engineering — the bulk of work** | | | |
| → BE | Backend Engineer | Express server, WebSocket, SQLite, event ingestion API, adapters (Claude Code, CLI wrapper, file watcher), REST routes, git watcher, `.team/` file parser | ~40K | ~60K | $5.10 |
| → FE | Frontend Engineer | React + Vite app, all 13 P0 panels (agent grid, filter bar, kanban board, commits, cost monitor, test dashboard, planning timeline, event stream, secrets panel), Zustand stores, WebSocket hooks, Recharts, Tailwind, dark/light theme | ~45K | ~70K | $5.93 |
| → MOB | Mobile Engineer | **NOT APPLICABLE** — strategy Section 10 explicitly excludes mobile. Agent will be idle or reassigned to FE support if PM decides. | ~2K | ~2K | $0.18 |
| → DEVOPS | DevOps Engineer | GitHub Actions CI/CD workflow, Docker configuration (optional), `act` local validation, pre-commit hooks, linting setup | ~15K | ~20K | $1.73 |
| → INFRA | Infrastructure Engineer | **Minimal** — local-only tool, no cloud infra. Will handle port management, process lifecycle, scaffold script (`scaffold.sh`) | ~8K | ~12K | $1.02 |
| Wave 2.5 | PM | 6-hour status reports (PPTX + PDF), GitHub board updates, KANBAN.md sync | ~8K | ~12K | $1.02 |
| Wave 3 | QA | Full test pyramid: static analysis, unit tests (BE+FE), integration tests (Supertest), E2E (Playwright), security scanning, accessibility audit | ~20K | ~30K | $2.55 |
| Wave 3.5 | Bug Fix (conditional) | Re-spawn engineers if QA fails. Estimated 1 iteration. | ~15K | ~20K | $1.73 |
| Wave 4 | RM | Release checklist, changelog, versioning (v1.0.0), GitHub Release, npm packaging for `npx mission-control` | ~8K | ~12K | $1.02 |
| Wave 5 | PM | Final PPTX + PDF with evidence dashboard, close milestones | ~8K | ~12K | $1.02 |
| **TOTAL** | **11 agents** | | **~204K** | **~297K** | **$25.36** |

**Note**: Estimates assume Claude Opus 4.6 for all agents. Actual costs may be lower if:
- Cache hits reduce input token costs (likely 30-40% reduction on repeated context)
- Some agents complete faster than estimated
- MOB agent is largely idle (no mobile work)

**Realistic estimate with caching**: ~$18-22

### 2. External Service Costs

| Service | Action | One-Time Cost | Recurring Cost | Payment Method | Requires Card? |
|---------|--------|---------------|----------------|----------------|----------------|
| npm packages | Install open-source dependencies | $0 | $0 | N/A | NO |
| GitHub (existing) | Use existing repo + Actions | $0 | $0 | Already active | NO |
| gitleaks | Open-source binary | $0 | $0 | N/A | NO |
| **TOTAL** | | **$0** | **$0/month** | | |

> **PAYMENT RULE**: This project requires ZERO external payments. All dependencies are open-source.
> No card payments, no subscriptions, no API keys needed for the dashboard itself.

### 3. Risk Factors That May Increase Cost

| Risk | Probability | Cost Impact | Mitigation |
|------|------------|-------------|------------|
| Bug Fix Loop (Wave 3.5) | Medium | +$1.73 (one iteration) | Thorough engineering + type-safe TypeScript in Wave 2 |
| Complex WebSocket edge cases | Low | +$1-2 in extra BE iterations | Use battle-tested `ws` library |
| PM spawns extra FE agent (13 panels is heavy) | Medium | +$3-5 for additional FE agent | Strategy allows scaling; pre-approved if within budget |
| Playwright E2E complexity across panels | Low | +$1-2 in QA time | Start with critical P0 paths only |

### 4. Cost Summary

| Category | Estimated Cost |
|----------|---------------|
| AI/Token costs (with caching) | $18.00 - $25.36 |
| External services (one-time) | $0.00 |
| External services (monthly) | $0.00/month |
| **Total to start** | **$18.00 - $25.36** |
| **Total (worst case, with bug fix + scaling)** | **$32.00** |

---

### APPROVAL

> **USER ACTION REQUIRED**: Review the above costs and reply with one of:
> - **"approved"** — proceed with execution as estimated
> - **"approved with cap of $X"** — proceed but hard-stop if costs exceed $X
> - **"too expensive, tailor it"** — TL will propose a reduced scope/strategy
> - **"change X"** — TL will revise specific items and re-estimate

---

### Key Notes for Your Review

1. **$0 external costs** — Everything is open-source and local. No card payments needed.
2. **Strategy budget**: You set $30 max in the strategy. Estimated total ($25.36) is within budget. Worst case ($32) slightly exceeds — I recommend a **cap of $30** with a stop-and-ask at 90%.
3. **MOB agent**: The strategy explicitly excludes mobile (Section 10). The Mobile Engineer will be mostly idle or reassigned to support FE if the PM decides (13 panels is a heavy frontend workload).
4. **Heaviest cost**: Wave 2 engineering ($15.96) — this is expected for 5 parallel agents building a full React + Express application.
5. **FE scaling**: 13 P0 panels is significant frontend work. The PM may request an extra FE agent. This would add ~$3-5 but stays within the $30 cap.
