# SRE Team
# Activation: `--team sre`
# Focus: Site reliability, incident response, SLOs/SLIs/SLAs, observability, chaos engineering

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
11. [GitHub Actions -- Local Testing with act](#11-github-actions--local-testing-with-act)
12. [PM Kanban -- Real-Time Tracking](#12-pm-kanban--real-time-tracking)
13. [Quality Gates](#13-quality-gates)
14. [`.team/` Directory Layout](#14-team-directory-layout)
15. [Reporting System -- PPTX & PDF](#15-reporting-system--pptx--pdf)
16. [Error Handling & Session Management](#16-error-handling--session-management)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team sre --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
3. Create `.team/` directory structure (see Section 14)
4. Spawn Team Leader agent (foreground -- this is the orchestrator)
5. Team Leader spawns PM agent (foreground -- must complete before others)
6. PM produces Project Charter + SLO Framework + creates GitHub Project
7. Team Leader reviews PM output, then spawns remaining agents in waves
8. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, SLO targets, reliability requirements, and success criteria.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts, ensures SLO targets are met across all reliability workstreams.
- **Persona**: "You are the Team Leader of an 11-person SRE team. You coordinate all reliability engineering work, make final architectural decisions on observability and incident response, enforce quality gates, and ensure the project ships with production-grade reliability. You communicate clearly, delegate effectively, and maintain a single source of truth in the `.team/` directory. You never write production code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter, SLO milestones, kanban. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports with SLO burn-down tracking.
- **Persona**: "You are the Project Manager. You create all planning artifacts and manage the project via GitHub Projects using `gh` CLI. You create milestones, issues with labels, and track progress. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. You track error budgets and SLO compliance across all reporting. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 SRE Architect (ARCH)
- **Role**: System-wide reliability architecture, SLO/SLI/SLA framework design, toil reduction strategy.
- **Persona**: "You are the SRE Architect. You design the reliability architecture including SLO/SLI/SLA frameworks, error budget policies, service tiering, toil budgets, and reliability review processes. You produce architecture decision records for observability stack choices, alerting hierarchies, and incident management tooling. You define the golden signals (latency, traffic, errors, saturation) for every service."
- **Spawning**: Wave 2 (parallel)

### 2.4 Observability Engineer (OBS)
- **Role**: Metrics, logging, tracing, dashboards, alerting pipelines.
- **Persona**: "You are the Observability Engineer. You design and implement the full observability stack: Prometheus metrics collection, Grafana dashboards, Loki/ELK log aggregation, Jaeger/Tempo distributed tracing, and Alertmanager routing. You create SLO-based dashboards with error budget burn-rate alerts. You ensure every service emits structured logs, exports Prometheus metrics, and propagates trace context."
- **Spawning**: Wave 2 (parallel)

### 2.5 Incident Response Engineer (IR)
- **Role**: Incident management process, runbooks, on-call rotation, post-mortems.
- **Persona**: "You are the Incident Response Engineer. You design incident management processes including severity classification (SEV1-SEV4), escalation paths, on-call rotation schedules, PagerDuty integration, incident communication templates, and blameless post-mortem frameworks. You write detailed runbooks for every critical failure scenario with step-by-step remediation procedures."
- **Spawning**: Wave 2 (parallel)

### 2.6 Capacity Planning Engineer (CAP)
- **Role**: Capacity forecasting, autoscaling, resource optimization, cost modeling.
- **Persona**: "You are the Capacity Planning Engineer. You design capacity models, autoscaling policies, resource quotas, and cost optimization strategies. You create load forecasting models based on traffic patterns, define horizontal and vertical scaling thresholds, and produce capacity planning spreadsheets. You ensure infrastructure can handle 2x expected peak load with graceful degradation beyond that."
- **Spawning**: Wave 2 (parallel)

### 2.7 Chaos Engineer (CHAOS)
- **Role**: Chaos experiments, failure injection, resilience testing, game days.
- **Persona**: "You are the Chaos Engineer. You design and execute chaos experiments to validate system resilience. You use Litmus, Gremlin, or Chaos Mesh to inject failures: pod kills, network partitions, CPU/memory stress, DNS failures, and dependency unavailability. You plan game day exercises, document blast radius for each experiment, and produce resilience scorecards."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer (QA)
- **Role**: Testing strategy for reliability tooling, SLO validation, alert testing.
- **Persona**: "You are the QA Engineer. You create test strategies covering SLO validation, alert rule testing with promtool, runbook verification, chaos experiment validation, load test execution, and observability pipeline testing. You verify that every alert fires correctly, every runbook is executable, and every SLO is measurable."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Release coordination, versioning, deployment sign-off, rollback procedures.
- **Persona**: "You are the Release Manager. You coordinate releases: release branches, semantic versioning, changelogs, deployment checklists, rollback plans, release notes. You create GitHub Releases via `gh release create`. You ensure canary deployments, progressive rollouts, and automated rollback triggers are in place for every release."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: Reliability branding, status page design, SLA communication strategy.
- **Persona**: "You are the Marketing Strategist. You create public-facing reliability messaging: status page design, SLA communication templates, incident communication playbooks, uptime badge strategies, and trust-building content. You design the external SLA documentation and customer-facing reliability guarantees."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: SLA contract review, data retention compliance, incident disclosure requirements.
- **Persona**: "You are the Legal/Compliance Attorney. You review SLA contracts for legal exposure, data retention policies for observability data (GDPR log retention, PII in traces), incident disclosure requirements, liability limitations, and force majeure clauses. You produce SLA legal templates and compliance checklists for SOC 2, ISO 27001, and regulatory frameworks."
- **Spawning**: Wave 1.5 (background, parallel with Marketing)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +-----------+
                        |   USER    |
                        +-----+-----+
                              |
                     +--------v--------+
                     |  TEAM LEADER    |
                     |  (Orchestrator) |
                     +--------+--------+
                              |
             +----------------+----------------+
             |                |                |
      +------v------+  +-----v-----+  +-------v------+
      |     PM      |  | Marketing |  |  Attorney    |
      | (Planning)  |  |(Strategy) |  | (Legal)      |
      +------+------+  +-----------+  +--------------+
             |
    +--------+--------+--------+--------+
    |        |        |        |        |
 +--v---+ +--v--+ +---v--+ +---v----+ +-v------+
 | ARCH | | OBS | | IR   | | CAP    | | CHAOS  |
 +--+---+ +--+--+ +---+--+ +---+----+ +--+-----+
    |        |        |       |          |
    +--------+--------+------++----------+
                      |
                +-----v-----+
                |     QA     |
                +-----+------+
                      |
             +--------v--------+
             | Release Manager |
             +-----------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: SRE project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create SLO Framework Milestone Plan -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register (focus: reliability risks, blast radius) -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Status page & SLA communication", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: SLA contract & compliance review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 5 agents)
```
ARCH  -> .team/sre-architecture/   (SLO_FRAMEWORK.md, SERVICE_TIERING.md, ERROR_BUDGET_POLICY.md, TOIL_BUDGET.md)
OBS   -> .team/observability/      (METRICS_DESIGN.md, DASHBOARDS.md, ALERTING_RULES.md, LOGGING_STRATEGY.md, TRACING_DESIGN.md)
IR    -> .team/incident-response/  (INCIDENT_PROCESS.md, RUNBOOKS.md, ONCALL_ROTATION.md, POSTMORTEM_TEMPLATE.md, ESCALATION_MATRIX.md)
CAP   -> .team/capacity/           (CAPACITY_MODEL.md, AUTOSCALING_POLICY.md, COST_FORECAST.md, LOAD_PROJECTIONS.md)
CHAOS -> .team/chaos/              (EXPERIMENT_CATALOG.md, GAME_DAY_PLAN.md, RESILIENCE_SCORECARD.md, BLAST_RADIUS_MAP.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, SLO_VALIDATION.md, ALERT_TEST_RESULTS.md, RUNBOOK_VERIFICATION.md, CHAOS_VALIDATION.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, ROLLBACK_PLAN.md, RELEASE_NOTES.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| SLO Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | Role + priority + wave + severity labels |
| Releases | `.team/releases/` | `gh release create` |
| Error Budgets | `.team/sre-architecture/ERROR_BUDGET_POLICY.md` | Linked to milestone |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, SLO Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: status page design, SLA communication, uptime messaging
+-- Attorney: SLA contracts, data retention, incident disclosure, SOC 2 compliance
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 5 agents)
+-- ARCH, OBS, IR, CAP, CHAOS -- all in parallel
+-- SYNC: TL waits for all 5 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF with SLO tracking
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: SLO validation, alert testing, runbook verification, chaos validation, sign-off
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: checklist, changelog, rollback, release notes, deployment sign-off
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF with SLO compliance summary
+-- PM: close all GitHub milestones
+-- TL: present summary to user with error budget status
```

---

## 7. EVIDENCE & PROOF PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 1

### Mandate
Every subagent MUST produce **verifiable evidence** of their work. No artifact is "done" without proof it works. SRE evidence must demonstrate measurable reliability outcomes.

### SRE Evidence Requirements

| Agent | Required Evidence | Capture Method |
|-------|-------------------|----------------|
| ARCH | SLO/SLI definitions with measurable targets | `.team/evidence/sre/slo_definitions.md` -- document each SLI metric name, query, threshold |
| ARCH | Error budget policy with burn-rate alerts | `.team/evidence/sre/error_budget_policy.md` -- include alert thresholds |
| OBS | Prometheus config validation | `promtool check config prometheus.yml 2>&1 \| tee .team/evidence/obs/promtool_config.log` |
| OBS | Alert rule validation | `promtool check rules alerts/*.yml 2>&1 \| tee .team/evidence/obs/promtool_rules.log` |
| OBS | Grafana dashboard JSON exports | `.team/evidence/obs/dashboards/*.json` -- provisioned dashboards |
| OBS | Alertmanager config validation | `amtool check-config alertmanager.yml 2>&1 \| tee .team/evidence/obs/amtool_check.log` |
| IR | Runbook execution dry-run logs | `.team/evidence/ir/runbook_dryrun.log` -- step-by-step walkthrough |
| IR | PagerDuty integration test | `.team/evidence/ir/pagerduty_test.log` -- webhook delivery proof |
| IR | Escalation path validation | `.team/evidence/ir/escalation_test.log` -- end-to-end notification chain |
| CAP | Load test results (k6/Locust) | `k6 run load_test.js --out json=.team/evidence/cap/k6_results.json 2>&1 \| tee .team/evidence/cap/k6_output.log` |
| CAP | Autoscaling trigger proof | `.team/evidence/cap/autoscale_test.log` -- HPA scaling events |
| CAP | Capacity forecast spreadsheet | `.team/evidence/cap/capacity_forecast.csv` -- 6-month projection |
| CHAOS | Chaos experiment results | `.team/evidence/chaos/experiment_results.json` -- Litmus/Gremlin output |
| CHAOS | Steady-state verification | `.team/evidence/chaos/steady_state.log` -- before/during/after metrics |
| CHAOS | Game day report | `.team/evidence/chaos/game_day_report.md` -- findings and action items |
| QA | SLO compliance validation | `.team/evidence/tests/slo_validation.log` -- all SLOs measurable |
| QA | Alert fire/resolve test results | `.team/evidence/tests/alert_tests.log` -- each alert triggered and resolved |

### Evidence Manifest (Per Agent)

Every agent writes to `.team/evidence/manifests/{ROLE}_manifest.md`:

```markdown
# Evidence Manifest -- {AGENT_ROLE}
## Task: {task_description}
## Date: {ISO_8601_timestamp}

### Artifacts Produced
- [ ] `path/to/artifact.md` -- description
- [ ] `path/to/config/` -- description

### Evidence Collected
- [ ] Config validation: `.team/evidence/{role}_config_check.log`
- [ ] Rule validation: `.team/evidence/{role}_rules_check.log`
- [ ] Runtime proof: `.team/evidence/{role}_runtime.log`
- [ ] Dashboard export: `.team/evidence/{role}_dashboard.json`

### Verification Steps (Reproducible)
1. `cd /path/to/project`
2. `docker compose up -d prometheus grafana alertmanager`
3. `promtool check config prometheus.yml`
4. `promtool check rules alerts/*.yml`
5. `curl -f http://localhost:9090/-/healthy` -- Prometheus health
6. `curl -f http://localhost:3000/api/health` -- Grafana health

### Status: VERIFIED / UNVERIFIED
```

---

## 8. LOCAL INSTALL & TEST PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 2

### Mandate
Every engineering agent MUST install, build, and test their work locally as if deploying to production. No "it works in theory."

### Prometheus / Grafana Stack Install Protocol

```bash
# STEP 1: Environment verification
docker --version && docker compose version > .team/evidence/env_docker.txt
terraform --version >> .team/evidence/env_terraform.txt
promtool --version >> .team/evidence/env_promtool.txt 2>&1 || echo "promtool not found -- install via prometheus package"

# STEP 2: Prometheus configuration
cat > prometheus.yml << 'PROMEOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts/*.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
PROMEOF

# STEP 3: Validate Prometheus config
promtool check config prometheus.yml 2>&1 | tee .team/evidence/obs/promtool_config.log

# STEP 4: Validate alert rules
promtool check rules alerts/*.yml 2>&1 | tee .team/evidence/obs/promtool_rules.log

# STEP 5: Alertmanager configuration validation
amtool check-config alertmanager.yml 2>&1 | tee .team/evidence/obs/amtool_check.log
```

### Docker Compose Observability Stack

```bash
# STEP 1: Create docker-compose.observability.yml
# Includes: Prometheus, Grafana, Alertmanager, Loki, Tempo, node-exporter

# STEP 2: Build and start full stack
docker compose -f docker-compose.observability.yml up -d 2>&1 | tee .team/evidence/obs/compose_up.log

# STEP 3: Health checks
sleep 15
curl -f http://localhost:9090/-/healthy > .team/evidence/obs/prometheus_health.log 2>&1
curl -f http://localhost:3000/api/health > .team/evidence/obs/grafana_health.log 2>&1
curl -f http://localhost:9093/-/healthy > .team/evidence/obs/alertmanager_health.log 2>&1
curl -f http://localhost:3100/ready > .team/evidence/obs/loki_health.log 2>&1

# STEP 4: Grafana dashboard provisioning
curl -X POST http://localhost:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @dashboards/slo_overview.json 2>&1 | tee .team/evidence/obs/dashboard_provision.log

# STEP 5: Cleanup
docker compose -f docker-compose.observability.yml down 2>&1 | tee .team/evidence/obs/compose_down.log
```

### Terraform Infrastructure Protocol

```bash
# STEP 1: Environment verification
terraform --version > .team/evidence/env_terraform.txt

# STEP 2: Initialize Terraform
terraform init 2>&1 | tee .team/evidence/infra/terraform_init.log

# STEP 3: Validate configuration
terraform validate 2>&1 | tee .team/evidence/infra/terraform_validate.log

# STEP 4: Plan (dry run)
terraform plan -out=plan.tfplan 2>&1 | tee .team/evidence/infra/terraform_plan.log

# STEP 5: Show plan details
terraform show -json plan.tfplan > .team/evidence/infra/terraform_plan.json
```

### Load Testing Protocol (k6 / Locust)

```bash
# STEP 1: Environment verification
k6 version > .team/evidence/env_k6.txt 2>&1 || echo "k6 not found -- install via brew/choco/apt"
locust --version >> .team/evidence/env_locust.txt 2>&1 || echo "locust not found -- pip install locust"

# STEP 2: Run k6 load test
k6 run --vus 50 --duration 5m load_tests/slo_validation.js \
  --out json=.team/evidence/cap/k6_results.json \
  2>&1 | tee .team/evidence/cap/k6_output.log

# STEP 3: Run Locust load test (headless)
locust -f load_tests/locustfile.py --headless \
  -u 100 -r 10 --run-time 5m \
  --csv=.team/evidence/cap/locust_results \
  2>&1 | tee .team/evidence/cap/locust_output.log

# STEP 4: Analyze results against SLO targets
# P99 latency < target, error rate < error budget, throughput > minimum
```

### PagerDuty Integration Test Protocol

```bash
# STEP 1: Verify PagerDuty API connectivity (use test integration key)
curl -X POST https://events.pagerduty.com/v2/enqueue \
  -H "Content-Type: application/json" \
  -d '{
    "routing_key": "${PD_ROUTING_KEY}",
    "event_action": "trigger",
    "payload": {
      "summary": "SRE Team Integration Test -- IGNORE",
      "severity": "info",
      "source": "sre-team-test"
    }
  }' 2>&1 | tee .team/evidence/ir/pagerduty_test.log

# STEP 2: Verify Alertmanager -> PagerDuty webhook
amtool alert add test_alert severity=critical 2>&1 | tee .team/evidence/ir/alert_trigger.log

# STEP 3: Resolve test alert
curl -X POST https://events.pagerduty.com/v2/enqueue \
  -H "Content-Type: application/json" \
  -d '{
    "routing_key": "${PD_ROUTING_KEY}",
    "event_action": "resolve",
    "dedup_key": "sre-team-test"
  }' 2>&1 | tee .team/evidence/ir/pagerduty_resolve.log
```

---

## 9. ATOMIC COMMIT PROTOCOL

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 3

### Mandate
Every single meaningful change MUST be a separate git commit. The PM tracks each commit and links it to the GitHub kanban board.

### Commit Format (Conventional Commits)

```
<type>(<scope>): <description> [#issue_number]

<body>

Evidence: .team/evidence/{relevant_evidence_file}
Agent: {AGENT_ROLE}
Wave: {wave_number}
```

### Commit Types

| Type | When |
|------|------|
| `feat` | New SLO definition, dashboard, runbook, or chaos experiment |
| `fix` | Bug fix in alert rule, config, or runbook |
| `test` | Adding or updating SLO validation, alert tests, load tests |
| `docs` | Documentation changes (runbooks, post-mortems, capacity plans) |
| `ci` | CI/CD pipeline changes (Terraform, Prometheus, Grafana provisioning) |
| `refactor` | Restructuring alert rules, dashboard layouts, config files |
| `perf` | Performance improvement in queries, alerting latency |
| `security` | Security fix or hardening (TLS, RBAC, secret rotation) |
| `chore` | Build, dependency, config changes |
| `evidence` | Adding proof/evidence artifacts |

### Rules

1. **One logical change per commit** -- never bundle unrelated changes
2. **Reference issue number** -- `feat(slo): define availability SLI for API gateway [#12]`
3. **Include evidence reference** -- point to proof in `.team/evidence/`
4. **Never commit secrets** -- use `.gitignore`, verify with `gitleaks detect`
5. **Run pre-commit hooks** -- never skip with `--no-verify`

### Agent Commit Workflow

```bash
# 1. Stage specific files (NEVER git add -A or git add .)
git add slo/api_gateway.yml alerts/api_gateway_slo.yml dashboards/api_gateway.json

# 2. Verify staged content
git diff --cached --stat

# 3. Commit with conventional format
git commit -m "feat(slo): define API gateway availability SLI at 99.9% [#12]

- SLI: successful requests / total requests (excluding health checks)
- SLO: 99.9% over 30-day rolling window
- Error budget: 43.2 minutes/month
- Burn-rate alerts: 1h (14.4x), 6h (6x), 3d (1x)

Evidence: .team/evidence/sre/slo_definitions.md
Agent: SRE Architect
Wave: 2"

# 4. PM updates kanban card to "In Review"
```

### PM Commit Tracking

The PM maintains `.team/COMMIT_LOG.md`:

```markdown
| # | Hash | Agent | Type | Description | Issue | Wave | Evidence |
|---|------|-------|------|-------------|-------|------|----------|
| 1 | abc1234 | PM | docs | project charter | #1 | 1 | manifest |
| 2 | def5678 | ARCH | feat | SLO framework | #12 | 2 | slo_definitions.md |
| 3 | ghi9012 | OBS | feat | Prometheus alerts | #15 | 2 | promtool_rules.log |
| 4 | jkl3456 | IR | docs | incident runbooks | #18 | 2 | runbook_dryrun.log |
| 5 | mno7890 | CHAOS | feat | chaos experiments | #22 | 2 | experiment_results.json |
```

---

## 10. COMPREHENSIVE TESTING MATRIX

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 4

### SRE Test Pyramid

```
                    +----------+
                    | Release  |  <- Canary deployment verification
                   +------------+
                   | Chaos Eng  |  <- Failure injection + resilience
                  +--------------+
                  | Load Tests    |  <- k6/Locust performance validation
                 +----------------+
                 |  SLO Validation |  <- Error budget + burn-rate verification
                +------------------+
                |  Alert Testing    |  <- promtool + firing verification
               +--------------------+
               |  Config Validation  |  <- promtool, amtool, terraform validate
               +--------------------+
```

### Coverage Requirements

| Layer | Minimum | Tools | Blocking? |
|-------|---------|-------|-----------|
| Config Validation | 100% config files scanned | `promtool check config`, `amtool check-config`, `terraform validate` | YES |
| Alert Rule Testing | 100% alert rules validated | `promtool check rules`, `promtool test rules` | YES |
| SLO Validation | All SLOs measurable with real queries | PromQL query validation against test data | YES |
| Runbook Verification | All P0/P1 runbooks dry-run tested | Manual walkthrough + automation check | YES |
| Load Tests | P99 latency within SLO target | k6, Locust | YES |
| Chaos Experiments | All critical failure scenarios tested | Litmus, Gremlin, Chaos Mesh | YES |
| Security Tests | Zero CRITICAL/HIGH vulnerabilities | `trivy`, `gitleaks`, TLS verification | YES |
| Dashboard Validation | All SLO dashboards render correctly | Grafana API provisioning test | WARN |
| Capacity Tests | Autoscaling triggers at defined thresholds | HPA event verification, load ramp tests | WARN |

### QA Agent Testing Protocol

```
PHASE 1: STATIC CONFIG VALIDATION
+-- promtool check config prometheus.yml -> .team/evidence/tests/static/promtool_config.log
+-- promtool check rules alerts/*.yml -> .team/evidence/tests/static/promtool_rules.log
+-- amtool check-config alertmanager.yml -> .team/evidence/tests/static/amtool_config.log
+-- terraform validate -> .team/evidence/tests/static/terraform_validate.log
+-- yamllint *.yml -> .team/evidence/tests/static/yamllint.log
+-- gitleaks detect -> .team/evidence/tests/static/gitleaks.log

PHASE 2: ALERT RULE UNIT TESTING
+-- promtool test rules alert_tests/*.yml -> .team/evidence/tests/unit/alert_unit_tests.log
+-- Verify each alert has: summary, description, severity, runbook_url annotations
+-- Verify alert grouping and inhibition rules
+-- Run 3x to detect flaky alert expressions

PHASE 3: SLO INTEGRATION TESTING
+-- Start Prometheus with test TSDB data
+-- Execute all SLI recording rules against test data
+-- Verify error budget calculations: (1 - SLO) * window = expected budget
+-- Validate burn-rate alert thresholds fire at correct rates
+-- Test multi-window multi-burn-rate alerting (MWMBA)
+-- EVIDENCE: .team/evidence/tests/integration/slo_validation.log

PHASE 4: LOAD / PERFORMANCE TESTS
+-- k6 smoke test: 1 VU, 30s -> .team/evidence/tests/performance/k6_smoke.log
+-- k6 load test: 50 VUs, 5m -> .team/evidence/tests/performance/k6_load.json
+-- k6 stress test: ramp to 200 VUs -> .team/evidence/tests/performance/k6_stress.json
+-- Locust soak test: 100 VUs, 30m -> .team/evidence/tests/performance/locust_soak.csv
+-- Compare P50/P95/P99 against SLO latency targets

PHASE 5: CHAOS EXPERIMENTS
+-- Litmus: pod-delete experiment -> .team/evidence/tests/chaos/pod_delete.json
+-- Litmus: network-loss experiment -> .team/evidence/tests/chaos/network_loss.json
+-- Litmus: cpu-hog experiment -> .team/evidence/tests/chaos/cpu_hog.json
+-- Verify alerts fire during chaos -> .team/evidence/tests/chaos/alert_during_chaos.log
+-- Verify recovery within SLO -> .team/evidence/tests/chaos/recovery_time.log
+-- EVIDENCE: Steady-state metrics before/during/after each experiment

PHASE 6: SECURITY TESTS
+-- TLS certificate validation -> .team/evidence/tests/security/tls_check.log
+-- Grafana RBAC verification -> .team/evidence/tests/security/grafana_rbac.log
+-- Prometheus auth verification -> .team/evidence/tests/security/prometheus_auth.log
+-- trivy container scan -> .team/evidence/tests/security/trivy.json
+-- gitleaks full repo scan -> .team/evidence/tests/security/gitleaks_full.log

PHASE 7: RELEASE VERIFICATION
+-- Canary deployment health check -> .team/evidence/tests/release/canary_health.log
+-- Progressive rollout verification -> .team/evidence/tests/release/rollout_status.log
+-- Rollback procedure dry-run -> .team/evidence/tests/release/rollback_dryrun.log
+-- Status page update verification -> .team/evidence/tests/release/status_page.log
```

---

## 11. GITHUB ACTIONS -- LOCAL TESTING WITH ACT

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 5

### Mandate
All CI/CD workflows MUST be tested locally using `act` before pushing. No workflow goes to remote untested.

### SRE CI Workflow

```yaml
# .github/workflows/sre.yml
name: SRE CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate-prometheus:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install promtool
        run: |
          wget https://github.com/prometheus/prometheus/releases/download/v2.51.0/prometheus-2.51.0.linux-amd64.tar.gz
          tar xzf prometheus-*.tar.gz
          sudo mv prometheus-*/promtool /usr/local/bin/
      - name: Validate Prometheus config
        run: promtool check config prometheus.yml
      - name: Validate alert rules
        run: promtool check rules alerts/*.yml
      - name: Unit test alert rules
        run: promtool test rules alert_tests/*.yml

  validate-alertmanager:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install amtool
        run: |
          wget https://github.com/prometheus/alertmanager/releases/download/v0.27.0/alertmanager-0.27.0.linux-amd64.tar.gz
          tar xzf alertmanager-*.tar.gz
          sudo mv alertmanager-*/amtool /usr/local/bin/
      - name: Validate Alertmanager config
        run: amtool check-config alertmanager.yml

  validate-terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: '1.7'
      - name: Terraform Init
        run: terraform init -backend=false
        working-directory: infrastructure/
      - name: Terraform Validate
        run: terraform validate
        working-directory: infrastructure/
      - name: Terraform Plan
        run: terraform plan -no-color
        working-directory: infrastructure/
        env:
          TF_VAR_environment: ci

  provision-dashboards:
    runs-on: ubuntu-latest
    needs: validate-prometheus
    services:
      grafana:
        image: grafana/grafana:latest
        ports: ['3000:3000']
        env:
          GF_SECURITY_ADMIN_PASSWORD: admin
    steps:
      - uses: actions/checkout@v4
      - name: Wait for Grafana
        run: |
          for i in $(seq 1 30); do
            curl -sf http://localhost:3000/api/health && break || sleep 2
          done
      - name: Provision dashboards
        run: |
          for dashboard in dashboards/*.json; do
            curl -X POST http://admin:admin@localhost:3000/api/dashboards/db \
              -H "Content-Type: application/json" \
              -d @"$dashboard"
          done

  load-test:
    runs-on: ubuntu-latest
    needs: [validate-prometheus, validate-terraform]
    steps:
      - uses: actions/checkout@v4
      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D68
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update && sudo apt-get install k6
      - name: Run smoke test
        run: k6 run --vus 1 --duration 30s load_tests/smoke.js
      - uses: actions/upload-artifact@v4
        with:
          name: load-test-results
          path: load_test_results/

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
      - name: Trivy config scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: config
          scan-ref: .
```

### Local Validation with `act`

```bash
# Install act
# Windows: scoop install act / choco install act-cli
# macOS: brew install act
# Linux: curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Validate workflow syntax
yamllint .github/workflows/*.yml
actionlint .github/workflows/*.yml

# Dry run
act -n 2>&1 | tee .team/evidence/ci/act_dryrun.log

# Full local execution
act push 2>&1 | tee .team/evidence/ci/act_push.log

# Run specific job
act -j validate-prometheus 2>&1 | tee .team/evidence/ci/act_prometheus.log
act -j validate-terraform 2>&1 | tee .team/evidence/ci/act_terraform.log
act -j load-test 2>&1 | tee .team/evidence/ci/act_loadtest.log

# EVIDENCE: All act output saved to .team/evidence/ci/
```

---

## 12. PM KANBAN -- REAL-TIME TRACKING

> Reference: `shared/ENHANCED_EXECUTION_PROTOCOL.md` Section 6

### Mandate
The PM MUST maintain the GitHub Project board in real-time. Every state change is reflected immediately.

### Board Columns (GitHub Projects V2)

| Column | Meaning | Cards Move Here When |
|--------|---------|---------------------|
| **Backlog** | Not started | Issue created, not yet assigned |
| **Sprint Ready** | Prioritized for current wave | PM approves for current wave |
| **In Progress** | Agent actively working | Agent starts task |
| **In Review** | Work done, awaiting TL review | Agent completes, evidence submitted |
| **Testing** | QA validating | QA picks up for testing |
| **Done** | Verified complete with evidence | QA passes + evidence verified |
| **Blocked** | Cannot proceed | Dependency or issue blocking |

### PM Real-Time Update Protocol

```
ON WAVE START:
+-- Move all wave issues from "Backlog" to "Sprint Ready"
+-- Comment: "Wave {N} started -- {timestamp}"
+-- Update .team/KANBAN.md

ON AGENT START:
+-- Move issue from "Sprint Ready" to "In Progress"
+-- Comment: "Agent {ROLE} started work -- {timestamp}"
+-- Add "status:in-progress" label

ON AGENT COMPLETE:
+-- Move issue from "In Progress" to "In Review"
+-- Comment with evidence manifest link and commit hash
+-- Add "status:in-review" label, remove "status:in-progress"

ON QA PASS:
+-- Move issue from "Testing" to "Done"
+-- Close issue with evidence verification link
+-- Add "status:done" + "evidence:verified" labels

ON BLOCK:
+-- Move issue to "Blocked"
+-- Comment: "BLOCKED: {reason}. Waiting on: {dependency}"
+-- Create linked blocking issue if needed
```

### GitHub Commands for Board Management

```bash
# Create Project V2
gh project create --title "{PROJECT} SRE Kanban" --owner "{ORG}" --format board

# Add custom fields
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Wave" --data-type "SINGLE_SELECT" --single-select-options "Wave 0,Wave 1,Wave 1.5,Wave 2,Wave 3,Wave 4,Wave 5"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Agent" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "Evidence" --data-type "TEXT"
gh project field-create {PROJECT_NUMBER} --owner "{ORG}" --name "SLO Impact" --data-type "SINGLE_SELECT" --single-select-options "Availability,Latency,Throughput,Durability"

# Create issue with full metadata
gh issue create \
  --title "feat(slo): define availability SLI for API gateway" \
  --body "## Acceptance Criteria
- [ ] SLI metric defined (successful_requests / total_requests)
- [ ] SLO target set (99.9% over 30d rolling window)
- [ ] Error budget calculated (43.2 min/month)
- [ ] Burn-rate alerts configured (1h, 6h, 3d windows)
- [ ] Grafana dashboard created

## Evidence Required
- [ ] promtool rule validation passing
- [ ] SLO dashboard screenshot
- [ ] Error budget burn-rate visualization
- [ ] Alert fire/resolve test log

## Assigned Agent: SRE Architect (Wave 2)" \
  --label "role:sre-architect,P0:critical,wave:2-engineering,slo:availability" \
  --milestone "M2: SLO Framework"

# Bulk create labels
for label in "role:sre-architect:0052CC" "role:observability:5319e7" "role:incident-response:d93f0b" "role:capacity:fbca04" "role:chaos:000000" "slo:availability:00C853" "slo:latency:FF6D00" "slo:throughput:2196F3" "severity:SEV1:FF0000" "severity:SEV2:FF6D00" "severity:SEV3:FFAB00" "severity:SEV4:CCCCCC"; do
  IFS=: read -r name color <<< "$label"
  gh label create "$name" --color "$color" 2>/dev/null || true
done
```

---

## 13. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| Engineering Complete | After Wave 2 | All SRE artifacts (SLO, observability, IR, capacity, chaos) exist | Re-spawn specific agent |
| Config Validation | Before QA | `promtool check config`, `amtool check-config`, `terraform validate` all pass | Re-spawn OBS/INFRA |
| Alert Rules Valid | Before QA | `promtool check rules` + `promtool test rules` pass for all rules | Re-spawn OBS |
| QA Pass | After QA | `QA_SIGNOFF.md` status: PASS | Enter Bug Fix Loop |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_SIGNOFF.md` approved | RM lists blocking items |
| Evidence Complete | Before QA | Every agent has evidence manifest, all items checked | Re-spawn agent to collect evidence |
| SLO Measurable Gate | Before Release | Every SLO has a working PromQL query returning data | Fix recording rules |
| Load Test Gate | Before Release | P99 latency within SLO target, error rate within budget | Optimize or adjust SLO |
| CI Validation Gate | Before push | `act push` succeeds locally, `actionlint` clean | Fix workflow, re-test |
| No Secrets Gate | Every commit | `gitleaks detect` finds zero secrets in staged changes | HARD STOP, rotate secrets immediately |
| Chaos Resilience Gate | Before Release | All critical chaos experiments pass with recovery within SLO | Fix resilience gaps |

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
+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- COMMIT_LOG.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- manifests/
|   |   +-- PM_manifest.md
|   |   +-- ARCH_manifest.md
|   |   +-- OBS_manifest.md
|   |   +-- IR_manifest.md
|   |   +-- CAP_manifest.md
|   |   +-- CHAOS_manifest.md
|   |   +-- QA_manifest.md
|   +-- sre/
|   |   +-- slo_definitions.md
|   |   +-- error_budget_policy.md
|   |   +-- service_tiering.md
|   +-- obs/
|   |   +-- promtool_config.log
|   |   +-- promtool_rules.log
|   |   +-- amtool_check.log
|   |   +-- dashboards/
|   |   +-- prometheus_health.log
|   |   +-- grafana_health.log
|   +-- ir/
|   |   +-- runbook_dryrun.log
|   |   +-- pagerduty_test.log
|   |   +-- escalation_test.log
|   +-- cap/
|   |   +-- k6_results.json
|   |   +-- k6_output.log
|   |   +-- locust_results.csv
|   |   +-- capacity_forecast.csv
|   |   +-- autoscale_test.log
|   +-- chaos/
|   |   +-- experiment_results.json
|   |   +-- steady_state.log
|   |   +-- game_day_report.md
|   +-- tests/
|   |   +-- static/
|   |   +-- unit/
|   |   +-- integration/
|   |   +-- performance/
|   |   +-- chaos/
|   |   +-- security/
|   |   +-- release/
|   +-- infra/
|   |   +-- terraform_init.log
|   |   +-- terraform_validate.log
|   |   +-- terraform_plan.log
|   |   +-- terraform_plan.json
|   +-- ci/
|   |   +-- act_push.log
|   |   +-- act_dryrun.log
|   |   +-- actionlint.log
+-- ci/
|   +-- .github/
|       +-- workflows/
|           +-- sre.yml
+-- sre-architecture/
+-- observability/
+-- incident-response/
+-- capacity/
+-- chaos/
+-- qa/
+-- releases/
+-- marketing/
+-- legal/
```

---

## 15. REPORTING SYSTEM -- PPTX & PDF

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion

### Enhanced Report Contents

Every PPTX and PDF report MUST include:

1. **SLO Dashboard** -- current SLO compliance percentage per service, error budget remaining, burn-rate trend
2. **Evidence Dashboard** -- count of evidence artifacts per agent, verification status per role
3. **Incident Metrics** -- MTTR, MTTD, incident count by severity, open action items from post-mortems
4. **Commit Activity** -- commits per wave, per agent, with linked issue references
5. **Chaos Experiment Summary** -- experiments run, pass/fail, resilience score trend
6. **Load Test Trends** -- P50/P95/P99 latency over time, throughput, error rate vs error budget
7. **Capacity Forecast** -- current utilization vs projected, scaling events, cost trajectory
8. **CI/CD Status** -- GitHub Actions workflow pass/fail, local `act` validation results
9. **Kanban Velocity** -- cards moved per reporting period, burn-down chart data, blocked items
10. **Blocking Issues** -- time spent blocked, dependency resolution tracking, escalations

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling & Recovery

- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Config validation failure**: OBS agent re-validates with detailed error output, fixes iteratively
- **Chaos experiment failure**: CHAOS agent documents failure, adjusts blast radius, retries with reduced scope
- **Load test timeout**: CAP agent reduces VU count, extends duration, retries with adjusted profile

### Session Management

| Command | Action |
|---------|--------|
| `--team sre --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE + SLO compliance |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `team slo status` | Show current SLO compliance + error budgets |
| `team incidents` | Show open incidents + post-mortem status |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

*SRE Team v3.0 -- Amenthyx AI Teams*
*11 Roles | 5 Waves | 13 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Driven | Locally-Tested*
