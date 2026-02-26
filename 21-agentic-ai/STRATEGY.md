# Agentic AI Team — Tailored Strategy v3.1

> Pre-configured for **AI agent frameworks, multi-agent systems, and LLM orchestration**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team agenticAI --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]

**One-Line Vision**: [FILL IN]

**Problem Statement**: [FILL IN]

**Desired Outcome**: [FILL IN]

**Project Type**: [FILL IN — Greenfield / Extending existing codebase / Migration / Rewrite / Prototype / MVP / Production]

**Repository**: [FILL IN — GitHub URL or desired repo name]

---

## 2. Target Audience

**Primary Users**: [FILL IN — e.g., developers building AI agents, product teams, operations teams]

**Secondary Users**: [FILL IN — e.g., end users interacting with agents, compliance teams, business analysts]

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [FILL IN] |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: Python 3.12+ / TypeScript
- **Framework**: LangChain / LangGraph / CrewAI / AutoGen / Claude Agent SDK
- **Database**: PostgreSQL (metadata, conversation history) / Vector DB (ChromaDB / Pinecone / Weaviate)
- **Cache**: Redis (conversation state, tool result caching, rate limiting)
- **Message Queue**: Celery / async (Python asyncio) / Bull (TypeScript)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / Azure (as needed)
- **Deployment**: Docker + Kubernetes / serverless (Lambda / Cloud Run) / dedicated GPU instances
- **CDN**: N/A (API-driven)
- **Domain**: [FILL IN or "N/A"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| LLM Provider (Anthropic / OpenAI / Google) | Core reasoning engine | API key | Per plan (TPM/RPM) |
| LangSmith / Langfuse | Agent tracing and observability | API key | Per plan |
| Vector DB (ChromaDB / Pinecone / Weaviate) | Embedding storage and RAG retrieval | API key / local | Per plan |
| External tools (APIs, databases, web) | Agent tool integrations | Various | Per service |

**Existing Codebase**: [FILL IN — Path to existing agent code, or "greenfield"]

**Package Manager**: poetry / pip (Python) / pnpm (TypeScript)

**Monorepo or Polyrepo**: Single repo (agents/ + tools/ + prompts/ + evaluations/ + configs/)

**Linting**:
- `ruff` — Python linting and formatting
- `mypy` — Python static type checking
- `ESLint` — TypeScript linting (if TypeScript used)
- `prettier` — TypeScript formatting

---

## 5. Non-Functional Requirements

**Performance**:
- Agent response time: < 5 seconds (end-to-end including LLM calls)
- Tool call latency: < 1 second per tool execution
- Token efficiency: [FILL IN — e.g., < 5000 tokens per task, cost per query target]
- Concurrent agents: [FILL IN — e.g., 50 simultaneous agent sessions]

**Security**:
- Authentication: API key management (encrypted at rest, rotated), user authentication for agent access
- Authorization: Rate limiting per user/API key, tool access control per agent role
- Prompt injection defense: Input sanitization, output validation, guardrails (content filtering)
- Output sanitization: No PII leakage, no harmful content generation
- Compliance: [FILL IN — SOC 2 / GDPR / HIPAA / AI Act / none]

**Scalability**:
- Expected launch agent sessions: [FILL IN — sessions/day]
- Expected 6-month volume: [FILL IN]
- Expected 1-year volume: [FILL IN]
- Scaling strategy: Horizontal (stateless agent workers, async task queues), LLM provider load balancing

**Availability**:
- Uptime target: 99.9% for agent API endpoints
- Recovery time objective (RTO): < 30 minutes
- Recovery point objective (RPO): < 5 minutes (conversation state persisted)
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- N/A (API-driven — accessibility applies to consuming applications)

**Observability**:
- Logging: LangSmith / Langfuse (agent trace logging), structured application logs
- Metrics: Token usage tracking (per agent, per user, per task), latency, error rate, cost per query
- Tracing: Full agent decision tree tracing (tool calls, reasoning steps, context retrieval)
- Alerting: Cost overrun alerts, agent loop detection, error rate spikes, hallucination rate monitoring

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% for Python/TypeScript source code; 100% evaluation suite coverage for deployed agents

**Required Test Types**:
- [x] Unit tests — pytest for tools, utilities, data processing
- [x] Integration tests — end-to-end agent flow tests (input -> tool calls -> output)
- [x] LLM evaluation — ragas / deepeval for retrieval quality, faithfulness, relevance
- [x] Human-in-the-loop evaluation — structured human assessment of agent outputs
- [x] Prompt injection tests — adversarial inputs, jailbreak attempts
- [x] Guardrail tests — content filtering, PII detection, harmful output prevention
- [x] Cost tracking tests — token usage within budget per task
- [x] Loop detection tests — agent does not enter infinite tool-calling loops
- [ ] Load tests — [FILL IN if concurrent agent scaling testing needed]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ruff, mypy, ESLint, prompt template validation)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated evaluation suite on every PR
- [x] Manual approval gate for production agent deployment
- [x] Prompt versioning (tracked in git, tagged releases)

**Testing Tools**: pytest, ragas, deepeval, LangSmith, Langfuse, custom evaluation harness, act

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN]

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M4 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Budget Constraints**:
- LLM API costs: [FILL IN — $/month for Anthropic/OpenAI/Google API usage]
- Vector DB: [FILL IN — $/month for Pinecone/Weaviate SaaS]
- Infrastructure: [FILL IN — $/month for compute, Redis, PostgreSQL]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, LLM API tier upgrades, vector DB provisioning, cloud compute scaling
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any production LLM API commitment

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| LLM API (Anthropic/OpenAI/Google) | [FILL IN] | Card / existing credits | No — ask first |
| Vector DB SaaS (Pinecone/Weaviate) | [FILL IN] | Card / free tier | No — ask first |
| Tracing SaaS (LangSmith/Langfuse) | [FILL IN] | Card / free tier | No — ask first |
| Cloud compute | [FILL IN] | Card / existing credits | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown + token cost projection

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Source code coverage >= 80%
- [ ] Evaluation suite passing (ragas/deepeval metrics meet targets)
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Prompt injection defense tested and verified
- [ ] Guardrails tested (content filtering, PII, harmful output)
- [ ] Agent response time < 5 seconds
- [ ] Cost per query estimated and within budget
- [ ] No agent loops detected in stress testing
- [ ] Tracing and observability dashboards live (LangSmith/Langfuse)
- [ ] Token usage monitoring active
- [ ] Prompt versions tagged and documented
- [ ] Documentation complete (README, agent architecture, API docs, prompt library)
- [ ] CI/CD pipeline tested and working
- [ ] Production deployment succeeds

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Design Inspiration**: [FILL IN]

**Technical References**: [FILL IN — e.g., LangChain docs, Claude Agent SDK docs, agent design patterns, evaluation frameworks]

**Internal Documentation**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. [FILL IN]
2. [FILL IN]
3. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]
2. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Prompt injection (malicious user inputs manipulating agent behavior) | M | H | Input sanitization, output validation, guardrails, adversarial testing suite, content filtering |
| Hallucination (agent generates incorrect or fabricated information) | H | H | RAG with verified sources, confidence scoring, human-in-the-loop for high-stakes tasks, evaluation suite |
| API cost overrun (LLM token usage exceeds budget) | M | H | Token tracking per request, cost alerts, budget caps, caching for repeated queries, prompt optimization |
| Agent loops (infinite tool-calling cycles) | M | M | Max iteration limits, loop detection logic, timeout per agent session, monitoring alerts |

**Hard Constraints** (non-negotiable):
- Structured outputs required for all agent tool calls
- Evaluation suite must pass before any agent deployment
- Prompt versioning in git (tagged releases for production prompts)
- Conventional commits enforced on all repositories
- All changes via Pull Request with CI checks passing

**Soft Constraints** (preferred but negotiable):
- [FILL IN]
- [FILL IN]

---

## 11.1 Dynamic Agent Scaling

> The PM may spawn additional agents beyond the default roster if the workload requires it.

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 15

**Scaling triggers** (PM spawns extra agents when):
- A single agent system or tool has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking evaluation failures requiring parallel fix agents
- The strategy explicitly requests parallel agent development streams

**Agent types the PM may add**:
- [ ] Additional AI Engineers (for agent logic and tool development)
- [ ] Prompt Engineering Specialist (for prompt optimization and evaluation)
- [ ] Evaluation Specialist (for comprehensive testing and benchmark creation)
- [ ] Security Specialist (for prompt injection defense, guardrails)
- [ ] RAG/Retrieval Specialist (for vector DB and retrieval optimization)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Evaluation suite results (ragas/deepeval — faithfulness, relevance, accuracy)
- [x] Agent trace logs (LangSmith/Langfuse screenshots showing decision flow)
- [x] Token usage and cost per query report
- [x] Prompt injection test results (adversarial inputs handled correctly)
- [x] Guardrail test results (PII, content filtering)
- [x] Loop detection test results (no infinite cycles)
- [x] Agent response time benchmarks (P50, P95, P99)
- [x] Human evaluation results (structured assessment)
- [x] CI/CD pipeline passing (act + remote)
- [x] Security scan reports (dependency audit, secret detection)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, prompts, evaluation results, agent traces, conversation logs, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might leak user data, generate harmful content, cost API money, deploy untested agents, affect production users, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.

**Auto-sync frequency**: Every agent completion

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `ai-team` (MANDATORY — all teams use this branch)
- Merge to main: ONLY after Team Leader receives explicit user approval (hard gate)

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (agents, tools, prompts, evaluations)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: target LLM provider and model, existing prompts, use case details, user interaction patterns, compliance requirements, ethical guidelines, budget constraints for API usage, etc.]

---

*Agentic AI Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for AI agent frameworks, multi-agent systems, and LLM orchestration*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
