# Low-Code Automation Team — Tailored Strategy v3.1

> Pre-configured for **n8n, Retool, Make, and workflow automation platforms with self-hosted and cloud deployments**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team lowcodeAutomation --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]
**One-Line Vision**: [FILL IN]
**Problem Statement**: [FILL IN]
**Desired Outcome**: [FILL IN]
**Project Type**: [FILL IN: Greenfield / Extending / Migration / Rewrite / Prototype / MVP / Production]
**Repository**: [FILL IN: GitHub URL or desired repo name]

---

## 2. Target Audience

**Primary Users**: [FILL IN]
**Secondary Users**: [FILL IN]

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [Job title] | [Top 3] | [Goals] | [Low/Med/High] |
| [FILL IN] | [Job title] | [Top 3] | [Goals] | [Low/Med/High] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|--------------------|----|
| 1 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |
| 2 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |
| 3 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |

### P1 — Should-Have
| # | Feature | Description | Acceptance Criteria | Complexity |
|---|---------|-------------|--------------------|----|
| 1 | [FILL IN] | [What it does] | [Testable criteria] | [S/M/L/XL] |

### P2 — Nice-to-Have
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [What it does] |

---

## 4. Technical Constraints *(pre-configured for Low-Code Automation Team)*

**Required Tech Stack**:
- **Language**: JavaScript / TypeScript / Python (Code nodes, custom functions)
- **Framework**: n8n (primary) / Retool (internal tools) / Make (Integromat) / Zapier
- **Database**: PostgreSQL (n8n backend) / Airtable / Google Sheets (data layer for workflows)
- **Cache**: N/A (workflow-level — no shared cache)
- **Message Queue**: n8n webhook triggers / cron schedules / event-driven triggers

**Hosting/Infrastructure**:
- **Cloud Provider**: Docker self-hosted (recommended for n8n) / cloud-hosted platforms
- **Deployment**: Docker / Docker Compose (self-hosted n8n) / cloud-hosted (Make, Zapier)
- **CDN**: N/A (automation backend)
- **Domain**: [FILL IN or "TBD" — for webhook endpoints]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| n8n | Workflow automation engine | Self-hosted (Docker) | Execution limits configurable |
| PostgreSQL | n8n backend database | Connection string (.env) | N/A |
| Slack / Email | Notifications + error alerts | Webhook / SMTP / API key | Rate limited per service |
| Telegram | User interface / notifications | Bot token (.env) | 30 msg/sec |
| [FILL IN external APIs] | [Purpose] | [Auth method] | [Rate limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: npm (n8n custom nodes)

**Repo Structure**: `workflows/` (exported JSON), `custom-nodes/`, `docker/`, `docs/`, `scripts/`, `config/`

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Workflow execution time: < 30 seconds (per workflow run)
- Webhook response time: < 5 seconds (acknowledge + trigger)
- Zero dropped triggers: all webhooks/cron events must execute
- Concurrent execution capacity: configurable per instance (default 10)

**Security**:
- Credential encryption: n8n built-in credential encryption at rest
- Webhook authentication: HMAC signature / bearer token / IP allowlisting
- No credentials in workflow JSON: all secrets via n8n credential manager
- TLS: Required for all webhook endpoints
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]

**Scalability**:
- Expected launch workflows: [FILL IN]
- Expected 6-month workflows: [FILL IN]
- Expected 1-year workflows: [FILL IN]
- Scaling strategy: Queue mode (n8n with Redis + workers), separate webhook and worker instances, horizontal worker scaling

**Availability**:
- Automation uptime target: 99.5%
- RTO: 1 hour (Docker restart + DB restore)
- RPO: 5 minutes (PostgreSQL WAL archival)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- N/A (automation backend — no end-user interface)
- Documentation: workflow diagrams, trigger documentation, error handling guides

**Observability**:
- Execution logs: n8n built-in execution history (success/failure/error details)
- Error notifications: Slack / email alerts on workflow failure
- Workflow success rates: tracked per workflow (target > 99%)
- Dashboard: n8n execution statistics + external Grafana (optional)
- Monitoring: Docker container health checks, PostgreSQL health

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (custom Code nodes), 100% (workflow manual trigger verification)

**Required Test Types**:
- [x] Workflow test mode (n8n built-in — test each workflow with sample data)
- [x] Manual trigger testing (every workflow tested end-to-end before activation)
- [x] Integration tests (verify external API responses match expectations)
- [x] Error handling tests (simulate failures at each node, verify retry/fallback behavior)
- [x] Idempotency tests (run workflow twice with same input, verify no duplicates)
- [x] Code node unit tests (ESLint + Jest for complex Code nodes)
- [ ] Load testing (optional — concurrent webhook stress test)
- [ ] Workflow validation (optional — n8n-mcp validate_workflow)

**CI/CD Requirements**:
- [x] GitHub Actions (workflow JSON validation + code node linting)
- [x] Pre-commit hooks (ESLint for Code nodes, JSON validation for workflow exports)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated workflow deployment via n8n API on merge to main
- [ ] Staging environment for workflow testing before production

**Testing Tools**: n8n test mode, Jest (Code nodes), ESLint, n8n-mcp (workflow validation), manual trigger testing

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN: date or "flexible"]

**Milestones**:
| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |
| M2 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |
| M3 | [FILL IN] | [Date] | [What's delivered] | [How to verify] |

**Budget Constraints**:
- Infrastructure: [FILL IN: $/month or "minimize"]
- External API costs: [FILL IN: $/month or "free tier only"]
- n8n hosting: [FILL IN: self-hosted Docker / n8n cloud plan]

---

## 7.1 Cost Approval & Payment Governance *(pre-configured)*

**Token Budget Tolerance**: [FILL IN: e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 (always ask — recommended)
- **Requires explicit approval**: All card payments, subscriptions, purchases
- **Forbidden without user present**: Any recurring subscription, any payment > $50

**External Service Payments**:
| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| n8n Cloud | ~$20-50/mo | Card | No — ask first |
| Docker hosting (VPS) | ~$5-20/mo | Card | No — ask first |
| External APIs (per-workflow) | Variable | Card/credits | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 workflows implemented and tested
- [ ] >= 80% test coverage on custom Code nodes
- [ ] Every workflow tested end-to-end with manual trigger
- [ ] Zero credentials exposed in workflow JSON exports
- [ ] Error handling configured on every node (retry + fallback)
- [ ] Idempotency verified for all workflows
- [ ] Workflow success rate > 99% over 48-hour test period
- [ ] Webhook endpoints secured (auth + TLS)
- [ ] Documentation complete (workflow diagrams, trigger docs, error handling guide)
- [ ] Docker deployment tested and reproducible
- [ ] CI/CD pipeline tested and working
- [ ] All credentials documented (which services, what scopes — NOT the actual secrets)

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [Target] | [Method] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [Good aspects] | [Bad aspects] |

**Design Inspiration**: [FILL IN]

**Technical References**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building**:
1. [FILL IN]
2. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| API rate limits from integrated services (Slack, Google, etc.) | M | H | Implement rate limit awareness in workflows, add delays between API calls, use batching where available, monitor rate limit headers |
| Workflow complexity creep (spaghetti workflows) | M | M | Max 20 nodes per workflow, split complex flows into sub-workflows, naming conventions, workflow documentation required |
| Vendor lock-in (n8n/Make/Zapier specific features) | M | M | Abstract integration logic into Code nodes where possible, document platform-specific features, maintain workflow export backups |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Idempotent workflows (safe to retry without side effects)
- Error handling on every node (no silent failures)
- Credentials NEVER stored in workflow JSON (use credential manager)
- Conventional commits enforced via commitlint

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 blocking bugs

**Agent types the PM may add**:
- [x] Additional Automation Engineer (n8n / Make / Zapier workflow design)
- [x] Integration Specialist (specific API integrations — Slack, Salesforce, HubSpot, etc.)
- [x] DevOps Specialist (Docker, n8n queue mode, monitoring)
- [x] QA Engineer (workflow testing, error scenario validation)
- [x] Python/JS Specialist (complex Code node logic)
- [x] Documentation Specialist (workflow diagrams, integration guides)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Workflow test results (n8n execution logs — all workflows passing)
- [x] Error handling verification (simulated failures, retry/fallback evidence)
- [x] Idempotency test results (duplicate execution, no side effects)
- [x] Workflow diagrams (visual representation of each workflow)
- [x] Credential audit (no secrets in exported JSON — verified)
- [x] Success rate dashboard (> 99% over test period)
- [x] Integration test results (external API responses validated)
- [x] Docker deployment log (reproducible deployment evidence)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (workflow topology, trigger sources, data flow)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/lowcodeAutomation/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts
- [x] Workflow JSON exports
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Low-Code Automation Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for n8n + Retool + Make workflow automation and integration development*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
