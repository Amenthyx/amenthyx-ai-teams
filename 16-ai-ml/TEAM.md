# AI/ML Team
# Activation: `--team aiML`
# Focus: Machine learning, deep learning, MLOps, model deployment
# Version: v3.0 -- Enhanced Execution Protocol

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Quality Gates](#7-quality-gates)
8. [`.team/` Directory Layout](#8-team-directory-layout)
9. [Reporting System](#9-reporting-system)
10. [Error Handling & Session Management](#10-error-handling--session-management)
11. [Evidence & Proof Protocol](#11-evidence--proof-protocol)
12. [Local Install & Test Protocol](#12-local-install--test-protocol)
13. [Atomic Commit Protocol](#13-atomic-commit-protocol)
14. [Comprehensive Testing Matrix](#14-comprehensive-testing-matrix)
15. [GitHub Actions -- Local Testing](#15-github-actions----local-testing)
16. [PM Kanban -- Real-Time Tracking](#16-pm-kanban----real-time-tracking)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team aiML --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read shared/ENHANCED_EXECUTION_PROTOCOL.md for shared protocol details
3. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
4. Create `.team/` directory structure (see Section 8)
5. Spawn Team Leader agent (foreground -- this is the orchestrator)
6. Team Leader spawns PM agent (foreground -- must complete before others)
7. PM produces Project Charter + Initial Plan + creates GitHub Project
8. Team Leader reviews PM output, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, features, and success criteria.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between research exploration and production requirements, model accuracy vs. latency tradeoffs.
- **Persona**: "You are the Team Leader of a 10-person AI/ML team. You coordinate all work across ML architecture, research, engineering, data, and MLOps. You make final decisions on model selection, training strategies, and deployment approaches. You balance research velocity with production reliability. You never write model code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter, milestones, kanban. Uses `gh` CLI to create GitHub Project board, milestones, and issues. Generates PPTX + PDF reports. Tracks experiment progress alongside engineering deliverables.
- **Persona**: "You are the Project Manager for an AI/ML project. You create all planning artifacts, track both research experiments and production deliverables, manage sprint boards via GitHub Projects using `gh` CLI. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.


### Judge Agent (JUDGE)
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
### 2.3 ML Architect (MLARCH)
- **Role**: ML system design, model architecture selection, serving infrastructure.
- **Persona**: "You are the ML Architect. You design end-to-end ML systems: model architecture selection (transformers, CNNs, GNNs, classical ML), training infrastructure (distributed training, GPU/TPU allocation), feature stores, model registries, serving patterns (batch/online/streaming inference), and A/B testing frameworks. You define the boundary between research experimentation and production deployment. You write to `.team/ml-architecture/`."
- **Spawning**: Wave 2 (foreground -- others depend on architecture)

### 2.4 Research Scientist (RESEARCH)
- **Role**: Literature review, model research, experiment design, ablation studies.
- **Persona**: "You are the Research Scientist. You survey state-of-the-art approaches, design experiments with proper baselines and ablation studies, select loss functions and optimization strategies, analyze results with statistical rigor, and document findings. You use Weights & Biases for experiment tracking and produce research reports with reproducible methodology. You write to `.team/experiments/`."
- **Spawning**: Wave 2 (parallel, after ML Architect)

### 2.5 ML Engineer (MLE)
- **Role**: Model implementation, training pipelines, optimization, ONNX export.
- **Persona**: "You are the ML Engineer. You implement models in PyTorch or TensorFlow as specified, build training pipelines with proper data loading, augmentation, and distributed training. You handle hyperparameter tuning (Optuna/Ray Tune), model optimization (quantization, pruning, distillation), ONNX export, and benchmark inference performance. You write production-quality, reproducible training code."
- **Spawning**: Wave 2 (parallel, after ML Architect)

### 2.6 Data Engineer (MLDATA)
- **Role**: Training data pipelines, feature engineering, dataset versioning.
- **Persona**: "You are the Data Engineer for ML. You build data pipelines for training datasets, implement feature engineering and preprocessing, manage dataset versioning with DVC, design feature stores, handle data augmentation strategies, and ensure training/serving feature parity. You write to `.team/data-pipeline/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 MLOps Engineer (MLOPS)
- **Role**: ML infrastructure, model deployment, monitoring, CI/CD for ML.
- **Persona**: "You are the MLOps Engineer. You build ML infrastructure: MLflow/W&B for experiment tracking, model registries for versioning, Kubeflow/Vertex AI for training orchestration, model serving (TorchServe/Triton/TF Serving), CI/CD pipelines for ML (training, validation, deployment), model monitoring (data drift, prediction drift, performance decay), and automated retraining triggers. You write to `.team/mlops/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 QA Engineer -- Model Validation (QA)
- **Role**: Model evaluation, bias auditing, reproducibility testing.
- **Persona**: "You are the QA Engineer specializing in ML model validation. You evaluate models against held-out test sets with proper metrics (accuracy, F1, AUC-ROC, BLEU, etc.), run bias and fairness audits (demographic parity, equalized odds), verify reproducibility (same seed produces same results), test edge cases and adversarial inputs, validate latency/throughput under load, and produce model cards. You produce validation reports and QA sign-off."
- **Spawning**: Wave 3 (sequential gate)

### 2.9 Release Manager (RM)
- **Role**: Model release coordination, A/B testing, canary deployment.
- **Persona**: "You are the Release Manager for ML models. You coordinate model releases: model versioning (semantic + experiment hash), A/B testing configuration, canary deployments with traffic splitting, rollback procedures for model regressions, shadow mode deployment for new models, and model deprecation plans. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.10 Marketing Strategist (MKT)
- **Role**: AI product positioning, capability documentation, demo strategy.
- **Persona**: "You are the Marketing Strategist for AI/ML products. You create AI capability documentation, model performance summaries for stakeholders, demo strategies, competitive AI landscape analyses, and responsible AI messaging."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.11 Legal/Compliance Attorney (LEGAL)
- **Role**: AI ethics, bias review, regulatory compliance, model governance.
- **Persona**: "You are the Legal/Compliance Attorney for AI/ML. You review for EU AI Act compliance (risk classification), bias and discrimination regulations, explainability requirements (LIME/SHAP documentation), data usage rights for training data, model governance frameworks, and intellectual property considerations for generated outputs."
- **Spawning**: Wave 1.5 (background, parallel with Marketing)

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
     +------v------+  +-----v-----+  +-------v-----+
     |     PM      |  | Marketing |  |  Attorney   |
     | (Planning)  |  | (AI Docs) |  | (AI Ethics) |
     +------+------+  +-----------+  +-------------+
            |
   +--------+--------+--------+--------+
   |        |        |        |        |
+--v----+ +-v-----+ +v----+ +v------+ +v-----+
|MLARCH | |RESEARH| | MLE | |MLDATA | |MLOPS |
+--+----+ +-+-----+ ++----+ ++------+ ++-----+
   +--------+--------+--------+--------+
            |
      +-----v-----+
      |    QA      |
      |  (Model)   |
      +-----+------+
            |
   +--------v--------+
   | Release Manager  |
   | (Model Deploy)   |
   +------------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: AI/ML project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan -> `.team/MILESTONES.md` (research, training, deployment as milestones)
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  
  IMPORTANT -- MULTI-PLAN REQUIREMENT (Judge Protocol):
  The PM MUST produce exactly 3 alternative plans (ALL 3 ARE MANDATORY):
  - .team/plans/PLAN_A.md -- first approach
  - .team/plans/PLAN_B.md -- second approach (must differ meaningfully)
  - .team/plans/PLAN_C.md -- third approach (MANDATORY)
  Each plan must vary in at least 2 dimensions: architecture, technology,
  timeline, resource allocation, risk profile, or cost structure.
  See shared/JUDGE_PROTOCOL.md for the required plan document structure.
  
  DETAILED TO-DO LIST REQUIREMENT (MANDATORY IN EVERY PLAN):
  Each plan MUST include an exhaustive to-do list covering:
  - Every single task for every team member/component
  - Dependencies between tasks (what blocks what)
  - Execution order (what runs first, second, third...)
  - Complexity rating per task (Low/Medium/High/Critical)
  - Priority level (P0-P3)
  - Estimated effort (hours/days)
  - A dependency graph showing the critical path
  - Parallel execution opportunities
  See the "Detailed To-Do List" section in shared/JUDGE_PROTOCOL.md.
  After PM completes plans, TL spawns the Judge Agent to evaluate them.
"""
)
```


### Spawn: Judge Agent (Foreground, Sequential -- After PM)
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
  MANDATORY: full justification for WHY the winning plan was chosen
  and WHY each losing plan was NOT selected.
  missing considerations, and suggested modifications to winning plan.
  """
)
GATE: VERDICT.md must exist with a clear winner AND user must approve the plan before engineering waves proceed.
TL presents ALL 3 plans + VERDICT to the user and WAITS for user approval.
USER APPROVAL IS A BLOCKING GATE — no engineering work begins without it.
User may choose Plan A, B, or C, request a hybrid, or ask for re-planning.
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: AI product positioning", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/ (AI_CAPABILITIES.md, DEMO_STRATEGY.md, COMPETITIVE_LANDSCAPE.md)")

Task(subagent_type="general-purpose", description="LEGAL: AI ethics and compliance review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/ (AI_ACT_REVIEW.md, BIAS_AUDIT_FRAMEWORK.md, DATA_RIGHTS_REVIEW.md, MODEL_GOVERNANCE.md)")
```

### Spawn: ML Architecture (Foreground, Sequential)
```
Task(subagent_type="general-purpose", description="MLARCH: ML system architecture",
  prompt="[MLARCH PERSONA] + PROJECT STRATEGY -> write to .team/ml-architecture/ (SYSTEM_ARCHITECTURE.md, MODEL_SELECTION.md, SERVING_DESIGN.md, FEATURE_STORE_DESIGN.md, ADR_LOG.md)")
GATE: SYSTEM_ARCHITECTURE.md must exist before engineering wave
```

### Spawn: Engineering Wave (Background, Parallel -- 4 agents)
```
RESEARCH -> .team/experiments/    (LITERATURE_REVIEW.md, EXPERIMENT_PLAN.md, BASELINES.md, ABLATION_RESULTS.md)
MLE      -> .team/models/        (MODEL_IMPLEMENTATION.md, TRAINING_PIPELINE.md, OPTIMIZATION.md, BENCHMARKS.md)
MLDATA   -> .team/data-pipeline/  (DATA_PIPELINE.md, FEATURE_ENGINEERING.md, DATASET_VERSIONING.md, AUGMENTATION.md)
MLOPS    -> .team/mlops/          (INFRA_DESIGN.md, CICD_ML.md, MODEL_REGISTRY.md, MONITORING.md, RETRAINING_TRIGGERS.md)
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

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, MODEL_EVALUATION.md, BIAS_AUDIT.md, REPRODUCIBILITY_TESTS.md, LATENCY_TESTS.md, ADVERSARIAL_TESTS.md, QA_SIGNOFF.md)
QA -> .team/model-cards/ (MODEL_CARD.md -- following Google Model Card format)
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

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, AB_TEST_CONFIG.md, CANARY_PLAN.md, ROLLBACK_PROCEDURE.md, SHADOW_MODE.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | Role + priority + wave + experiment labels |
| Releases | `.team/releases/` | `gh release create` |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: AI capabilities, demo strategy, competitive landscape
+-- Attorney: AI Act, bias framework, data rights, model governance
+-- These run concurrently with Wave 2

WAVE 2: ARCHITECTURE + ENGINEERING (Sequential then Parallel)
+-- MLARCH: System architecture, model selection, serving design (foreground, first)
+-- GATE: Architecture artifacts exist
+-- RESEARCH, MLE, MLDATA, MLOPS -- all in parallel (background)
+-- SYNC: TL waits for all 4 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: model evaluation, bias audit, reproducibility, latency, adversarial, model card
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready + Model Card complete
+-- RM: checklist, changelog, A/B config, canary plan, rollback, shadow mode
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF
+-- PM: close all GitHub milestones
+-- TL: present summary to user
```

---

## 7. QUALITY GATES

| # | Gate | When | Check | Evidence Required | Action if FAIL |
|---|------|------|-------|-------------------|----------------|
| G1 | Planning Complete | After PM | All PM artifacts + GitHub Project exists | GitHub Project screenshot | Re-spawn PM |
| G2 | Data Validation | After MLDATA | Dataset integrity, no leakage between train/val/test splits | DVC status output, split distribution report | Re-spawn MLDATA |
| G3 | Model Performance | After MLE | Accuracy/F1/AUC meets defined thresholds on test set | W&B run summary, evaluation metrics JSON | Re-spawn RESEARCH + MLE |
| G4 | Bias/Fairness Audit | After QA | Demographic parity and equalized odds within tolerance | Fairlearn/AIF360 audit report | Enter Bug Fix Loop |
| G5 | Reproducibility | After QA | DVC + MLflow: same seed, same data, same results (within tolerance) | Two-run comparison log, MLflow experiment diff | Re-spawn MLE |
| G6 | Latency/Throughput | After QA | p99 latency < threshold, throughput > minimum QPS | Load test results (locust/k6), Triton metrics | Re-spawn MLOPS for serving optimization |
| G7 | Model Card | Before release | Complete model card with intended use, limitations, metrics, ethical considerations | MODEL_CARD.md existence + completeness check | Re-spawn QA |
| G8 | ONNX Export Verification | After MLE | Model exports to ONNX and produces identical outputs (within tolerance) | ONNX export log, inference comparison report | Re-spawn MLE |
| G9 | Build & Test Gate | Before release | All tests pass, no secrets in code | CI log output, `gitleaks` scan result | Block release |
| G10 | Evidence Gate | Before release | All evidence artifacts exist in `.team/evidence/` | File existence check report | Block release |
| G11 | Secrets Gate | Before release | No API keys, model weights URLs, tokens in codebase | `gitleaks detect` clean output | Block release |

---

## 8. `.team/` DIRECTORY LAYOUT

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
|   +-- wandb-run-summary.json
|   +-- model-evaluation-metrics.json
|   +-- bias-audit-report.json
|   +-- reproducibility-comparison.log
|   +-- onnx-export-verification.log
|   +-- latency-benchmark.json
|   +-- training-loss-curves.png
|   +-- confusion-matrix.png
|   +-- gitleaks-scan.txt
+-- ci/
|   +-- .github/
|   |   +-- workflows/
|   |       +-- ml-pipeline-ci.yml
|   |       +-- model-evaluation.yml
|   |       +-- training-test.yml
|   +-- act-validation-log.txt
+-- ml-architecture/
|   +-- SYSTEM_ARCHITECTURE.md
|   +-- MODEL_SELECTION.md
|   +-- SERVING_DESIGN.md
|   +-- FEATURE_STORE_DESIGN.md
+-- experiments/
|   +-- LITERATURE_REVIEW.md
|   +-- EXPERIMENT_PLAN.md
|   +-- ABLATION_RESULTS.md
+-- models/
|   +-- MODEL_IMPLEMENTATION.md
|   +-- TRAINING_PIPELINE.md
|   +-- BENCHMARKS.md
+-- data-pipeline/
|   +-- DATA_PIPELINE.md
|   +-- FEATURE_ENGINEERING.md
|   +-- DATASET_VERSIONING.md
+-- mlops/
|   +-- INFRA_DESIGN.md
|   +-- CICD_ML.md
|   +-- MODEL_REGISTRY.md
|   +-- MONITORING.md
+-- model-cards/
|   +-- MODEL_CARD.md
+-- qa/
+-- releases/
+-- marketing/
+-- legal/
```

---

## 9. REPORTING SYSTEM

### Standard Reports
- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion

### Enhanced Report Content
- Reports include: experiment metrics (loss curves, accuracy), model comparison tables, bias audit results, infrastructure costs, deployment status
- **Evidence slides**: Each PPTX includes W&B experiment screenshots, confusion matrices, and metric trend charts
- **Test coverage section**: PDF includes model evaluation metrics, bias audit pass/fail status, reproducibility results
- **Experiment tracking dashboard**: Charts showing training loss curves, validation metrics per epoch, hyperparameter sweep results
- **Cost tracking**: LLM/GPU training costs per experiment, projected monthly infrastructure costs

---

## 10. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Training failure**: Capture OOM/NaN loss errors, re-spawn MLE with reduced batch size or learning rate context
- **Experiment divergence**: Research and MLE disagree on approach -- escalate to TL for ML Architect arbitration
- **Data pipeline failure**: Capture missing data/schema errors, re-spawn MLDATA with error context
- **Model regression**: New model underperforms baseline -- re-spawn RESEARCH for analysis
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent

### Session Commands

| Command | Action |
|---------|--------|
| `--team aiML --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team learnings` | Show captured learnings from .team/learnings/ |
| `team deps` | Spawn DEPGUARD agent to audit dependencies |
| `team retro` | Spawn RETRO agent to analyze last completed wave |
| `team review` | Spawn CR agent to review current code changes |
| `team judge` | Spawn Judge to evaluate current plans in `.team/plans/` |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

## 11. EVIDENCE & PROOF PROTOCOL

Every deliverable requires verifiable evidence. No artifact is considered complete without proof.

### AI/ML Evidence Requirements

| Artifact | Required Evidence | Storage Path |
|----------|-------------------|--------------|
| Training Pipeline | W&B run link or MLflow experiment ID, loss curves, final metrics | `.team/evidence/wandb-run-summary.json` |
| Model Evaluation | Metrics JSON (accuracy, F1, AUC-ROC, etc.), confusion matrix | `.team/evidence/model-evaluation-metrics.json` |
| Bias Audit | Fairlearn or AIF360 output with demographic parity, equalized odds | `.team/evidence/bias-audit-report.json` |
| Reproducibility | Two-run comparison showing identical results (within tolerance) | `.team/evidence/reproducibility-comparison.log` |
| ONNX Export | Export success log, inference comparison (PyTorch vs ONNX output) | `.team/evidence/onnx-export-verification.log` |
| Latency Benchmark | p50/p95/p99 latency, throughput QPS under load | `.team/evidence/latency-benchmark.json` |
| Dataset Versioning | DVC status showing tracked datasets and versions | `.team/evidence/dvc-status.txt` |
| Experiment Tracking | W&B project dashboard export or MLflow comparison table | `.team/evidence/experiment-tracking.json` |

### Evidence Collection Commands

```bash
# W&B experiment tracking evidence
wandb sync --include-globs "*.json" 2>&1 | tee .team/evidence/wandb-sync.log
python -c "
import wandb
api = wandb.Api()
run = api.run('<entity>/<project>/<run_id>')
import json
with open('.team/evidence/wandb-run-summary.json', 'w') as f:
    json.dump(dict(run.summary), f, indent=2, default=str)
"

# Model evaluation metrics
python evaluate.py --model-path models/best_model.pt --test-data data/test/ \
  --output-json .team/evidence/model-evaluation-metrics.json

# Bias audit with Fairlearn
python -c "
from fairlearn.metrics import MetricFrame, selection_rate, demographic_parity_difference
import json
# ... run audit ...
results = {'demographic_parity_diff': dpd, 'equalized_odds_diff': eod}
with open('.team/evidence/bias-audit-report.json', 'w') as f:
    json.dump(results, f, indent=2)
"

# Reproducibility test (two runs with same seed)
python train.py --seed 42 --output run1_metrics.json
python train.py --seed 42 --output run2_metrics.json
diff run1_metrics.json run2_metrics.json > .team/evidence/reproducibility-comparison.log

# ONNX export and verification
python export_onnx.py --model models/best_model.pt --output models/model.onnx
python verify_onnx.py --pytorch models/best_model.pt --onnx models/model.onnx \
  --tolerance 1e-5 2>&1 | tee .team/evidence/onnx-export-verification.log

# Latency benchmark
python benchmark.py --model-path models/model.onnx --num-requests 10000 \
  --concurrency 16 --output .team/evidence/latency-benchmark.json

# DVC dataset versioning status
dvc status 2>&1 | tee .team/evidence/dvc-status.txt

# Secrets scan
gitleaks detect --source . --report-path .team/evidence/gitleaks-scan.txt
```

### Evidence Freshness Policy
- Evidence must be regenerated if model code, training data, or hyperparameters change
- W&B run links must reference the latest training run, not historical ones
- PM tracks evidence timestamps and flags stale evidence in KANBAN.md

---

## 12. LOCAL INSTALL & TEST PROTOCOL

### Prerequisites
```bash
# Python environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Core ML tools
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install transformers datasets tokenizers accelerate
pip install scikit-learn pandas numpy matplotlib seaborn
pip install wandb mlflow optuna ray[tune]
pip install onnx onnxruntime
pip install fairlearn aif360
pip install dvc[s3]
pip install pytest pytest-cov hypothesis
pip install python-pptx reportlab

# Optional: TensorFlow
pip install tensorflow

# Verify GPU availability
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}, GPUs: {torch.cuda.device_count()}')"
```

### Build Verification
```bash
# 1. Import all model modules without error
python -c "from src.models import *; print('All model imports OK')"

# 2. Run a fast training sanity check (1 epoch, tiny dataset)
python train.py --epochs 1 --batch-size 4 --data-subset 100 --fast-dev-run

# 3. Verify model can export to ONNX
python export_onnx.py --model models/checkpoint_sanity.pt --output /tmp/test_model.onnx

# 4. Verify inference works
python predict.py --model models/checkpoint_sanity.pt --input test_input.json

# 5. Run unit tests
python -m pytest tests/ -v --tb=short
```

### Run Verification
```bash
# Full training run (configurable)
python train.py --config configs/experiment.yaml --wandb-project <project-name>

# Model evaluation on test set
python evaluate.py --model-path models/best_model.pt --test-data data/test/

# Serving verification (TorchServe or Triton)
torchserve --start --model-store model_store --models model.mar
curl http://localhost:8080/predictions/model -T test_input.json

# ONNX Runtime inference verification
python inference_onnx.py --model models/model.onnx --input test_input.json
```

---

## 13. ATOMIC COMMIT PROTOCOL

### Conventional Commit Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### AI/ML Commit Types

| Type | When | Example |
|------|------|---------|
| `feat(model)` | New model architecture, new training pipeline | `feat(model): add ViT-B/16 architecture with custom head` |
| `feat(data)` | New dataset pipeline, feature engineering | `feat(data): add image augmentation pipeline with RandAugment` |
| `feat(serving)` | New serving endpoint, inference optimization | `feat(serving): add TorchServe handler with batched inference` |
| `feat(mlops)` | New monitoring, retraining trigger | `feat(mlops): add data drift detection with Evidently` |
| `fix(model)` | Fix training bug, incorrect loss, NaN gradients | `fix(model): clip gradients to prevent NaN loss in transformer` |
| `fix(data)` | Fix data leakage, incorrect preprocessing | `fix(data): remove target leakage from feature pipeline` |
| `test(model)` | Model evaluation tests, bias tests | `test(model): add bias audit for gender and age groups` |
| `test(repro)` | Reproducibility tests | `test(repro): add seed-controlled reproducibility check` |
| `refactor(training)` | Training loop refactor, code cleanup | `refactor(training): extract data loader into reusable module` |
| `chore(mlops)` | Config changes, dependency updates | `chore(mlops): update W&B SDK to 0.16.0` |
| `docs(model-card)` | Model card, experiment documentation | `docs(model-card): add model card for v2 classifier` |
| `experiment(baseline)` | Experiment tracking commits | `experiment(baseline): ResNet-50 baseline, val_acc=0.87` |

### Per-Task Commit Workflow
```bash
# 1. Stage only task-related files
git add src/models/vit_classifier.py
git add configs/vit_experiment.yaml
git add tests/test_vit_classifier.py

# 2. Commit with conventional format
git commit -m "feat(model): add ViT-B/16 architecture with custom head

- Vision Transformer with pretrained weights from torchvision
- Custom classification head for dataset-specific classes
- Configurable via YAML, supports mixed-precision training
- W&B experiment: <run_link>
"

# 3. Record commit hash for PM tracking
TASK_COMMIT=$(git rev-parse --short HEAD)
```

### PM Tracking Integration
After each commit, PM updates GitHub Issue with commit hash and experiment metrics:
```bash
gh issue comment <ISSUE_NUMBER> --body "Task completed: ${TASK_COMMIT}
- Model: ViT-B/16
- Val accuracy: 0.923
- W&B run: <link>"
```

---

## 14. COMPREHENSIVE TESTING MATRIX

### Test Layers

| Layer | Tool | Scope | Coverage Target |
|-------|------|-------|-----------------|
| Unit Tests | pytest | Individual functions, transforms, loss functions, metrics | >= 90% |
| Model Tests | pytest + PyTorch | Model forward pass, output shapes, gradient flow | All model architectures |
| Data Tests | pytest + Great Expectations | Dataset integrity, no leakage, distribution checks | All datasets |
| Training Tests | pytest (fast dev run) | Training loop completes, loss decreases, checkpoints save | All training configs |
| Evaluation Tests | Custom evaluation harness | Metrics meet thresholds on test set | All model versions |
| Bias/Fairness Tests | Fairlearn + AIF360 | Demographic parity, equalized odds, calibration per group | All deployed models |
| Reproducibility Tests | pytest + seed control | Two runs produce identical metrics (within tolerance) | All training pipelines |
| ONNX Export Tests | onnxruntime | Export succeeds, inference matches PyTorch output | All production models |
| Latency Tests | locust / custom benchmark | p99 latency < threshold, throughput > minimum QPS | All serving endpoints |
| Adversarial Tests | cleverhans / foolbox | Model robustness to adversarial perturbations | Critical models |

### Test Execution Order
```bash
# Phase 1: Static analysis
python -m py_compile src/**/*.py
flake8 src/ --max-line-length=120
mypy src/ --ignore-missing-imports

# Phase 2: Unit tests
python -m pytest tests/unit/ -v --cov=src --cov-report=html

# Phase 3: Model architecture tests
python -m pytest tests/model/ -v --tb=short

# Phase 4: Data pipeline tests
python -m pytest tests/data/ -v

# Phase 5: Fast training sanity test
python -m pytest tests/training/ -v --timeout=300

# Phase 6: Model evaluation
python evaluate.py --model models/best_model.pt --test-data data/test/ --output-json .team/evidence/model-evaluation-metrics.json

# Phase 7: Bias audit
python bias_audit.py --model models/best_model.pt --test-data data/test/ --output .team/evidence/bias-audit-report.json

# Phase 8: Reproducibility
python -m pytest tests/reproducibility/ -v

# Phase 9: ONNX verification
python -m pytest tests/onnx/ -v

# Phase 10: Latency benchmark
python benchmark.py --model models/model.onnx --output .team/evidence/latency-benchmark.json
```

### W&B Experiment Tracking Integration
```python
# Every training run must log to W&B
import wandb

wandb.init(project="<project>", config={
    "model": "ViT-B/16",
    "learning_rate": 1e-4,
    "batch_size": 32,
    "epochs": 100,
    "optimizer": "AdamW",
    "scheduler": "CosineAnnealing"
})

# Log metrics every epoch
wandb.log({"train_loss": loss, "val_accuracy": val_acc, "epoch": epoch})

# Log final evaluation
wandb.log({"test_accuracy": test_acc, "test_f1": test_f1, "test_auc": test_auc})

# Log model artifact
wandb.log_artifact(model_path, type="model")
wandb.finish()
```

### Bias Audit Template
```python
from fairlearn.metrics import MetricFrame, demographic_parity_difference, equalized_odds_difference
from sklearn.metrics import accuracy_score, precision_score, recall_score

metric_frame = MetricFrame(
    metrics={"accuracy": accuracy_score, "precision": precision_score, "recall": recall_score},
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=sensitive_features
)

# Thresholds
assert demographic_parity_difference(y_test, y_pred, sensitive_features=sensitive_features) < 0.1
assert equalized_odds_difference(y_test, y_pred, sensitive_features=sensitive_features) < 0.1
```

---

## 15. GITHUB ACTIONS -- LOCAL TESTING

### CI Pipeline Definition
```yaml
# .github/workflows/ml-pipeline-ci.yml
name: ML Pipeline CI
on: [push, pull_request]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install flake8 mypy black isort
      - name: Lint
        run: flake8 src/ --max-line-length=120
      - name: Type check
        run: mypy src/ --ignore-missing-imports
      - name: Format check
        run: black --check src/ && isort --check src/

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-test.txt
      - name: Run unit tests
        run: python -m pytest tests/unit/ -v --cov=src --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  model-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-test.txt
      - name: Run model architecture tests
        run: python -m pytest tests/model/ -v --timeout=120

  training-sanity:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-test.txt
      - name: Fast dev run
        run: python train.py --epochs 1 --batch-size 2 --data-subset 50 --fast-dev-run --no-wandb

  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}
```

### Local CI Validation with `act`
```bash
# Install act (GitHub Actions local runner)
# https://github.com/nektos/act

# Run individual jobs
act push --job lint-and-type-check
act push --job unit-tests
act push --job model-tests
act push --job training-sanity
act push --job secrets-scan

# Run all jobs
act push

# Save validation log as evidence
act push 2>&1 | tee .team/ci/act-validation-log.txt
```

### ML-Specific CI Checks
```bash
# Model export verification
python export_onnx.py --model models/latest.pt --output /tmp/ci_model.onnx
python verify_onnx.py --pytorch models/latest.pt --onnx /tmp/ci_model.onnx --tolerance 1e-5

# DVC pipeline reproduction check
dvc repro --dry

# Experiment config validation
python -c "import yaml; yaml.safe_load(open('configs/experiment.yaml'))"

# Model card completeness check
python scripts/check_model_card.py .team/model-cards/MODEL_CARD.md
```

---

## 16. PM KANBAN -- REAL-TIME TRACKING

### GitHub Projects V2 Setup
```bash
# Create project board
gh project create --title "AI/ML: <project-name>" --owner @me

# Create custom fields for ML projects
gh project field-create <PROJECT_NUMBER> --owner @me --name "Experiment Status" --data-type "SINGLE_SELECT" \
  --single-select-options "design,running,evaluating,concluded"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Model Version" --data-type "TEXT"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Evidence Status" --data-type "SINGLE_SELECT" \
  --single-select-options "pending,collected,verified,stale"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Val Metric" --data-type "NUMBER"
```

### Real-Time Issue Updates
After each task completion:
```bash
# Update issue status
gh issue edit <NUMBER> --add-label "status:done"

# Add evidence reference with experiment metrics
gh issue comment <NUMBER> --body "Evidence collected:
- W&B run: .team/evidence/wandb-run-summary.json
- Evaluation: .team/evidence/model-evaluation-metrics.json
- Bias audit: .team/evidence/bias-audit-report.json
- Val accuracy: 0.923 | F1: 0.891
- Commit: $(git rev-parse --short HEAD)"
```

### PM 6-Hour Report Cycle
```
CYCLE START:
  1. Read KANBAN.md for current state
  2. Query GitHub Issues: gh issue list --state all --json number,title,state,labels
  3. Collect experiment metrics from W&B API or .team/evidence/
  4. Generate PPTX with:
     - Experiment progress table (model, metrics, status)
     - Training loss curves (chart)
     - Model comparison matrix (table)
     - Bias audit results (pass/fail per group)
     - Evidence collection status (checklist)
     - GPU/compute cost tracking (chart)
  5. Generate PDF with detailed evaluation report
  6. Commit reports: git add .team/reports/ && git commit -m "docs(report): 6-hour status update"
CYCLE END
```

### Evidence-Linked Kanban Columns

| Column | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| Backlog | Issue created with experiment/engineering label | PM assigns to wave |
| In Progress | Agent spawned and working | Agent writes first artifact |
| In Review | Artifact exists in `.team/` | Evidence collected and verified |
| Evidence Collected | Metrics saved to `.team/evidence/`, W&B run logged | All tests pass, evidence fresh |
| Done | QA sign-off, model card complete, evidence verified | PM closes issue |
| Blocked | Training failure, data issue, or dependency missing | Blocker resolved, re-enter In Progress |

---

*AI/ML Team v3.0 -- Amenthyx AI Teams*
*10 Roles | 5 Waves | 11 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Based*
*See shared/ENHANCED_EXECUTION_PROTOCOL.md for cross-team protocol details*


---

## Section 19: UAT — User Acceptance Testing (MANDATORY)

> **Protocol Reference**: `shared/UAT_PROTOCOL.md`
> **Wave**: 3.7 (between QA automated testing and Release)
> **Coverage Mandate**: >= 95% of all user-facing CTAs tested and passing
> **Blocking Gate**: Release wave CANNOT proceed without UAT_PASS

### 19.1 UAT Wave Integration

```
Wave 3:   QA — Automated Testing (unit, integration, E2E, security, performance)
Wave 3.5: Bug Fix Loop (conditional)
Wave 3.7: UAT — User Acceptance Testing (BLOCKING GATE)
Wave 4:   Release
```

### 19.2 Domain-Specific UAT Focus Areas

| Category | What to Test |
|----------|-------------|
| Model Inference | Input validation, output format, latency, error handling |
| Prompt Engineering | Template rendering, variable injection, context limits |
| Agent Behavior | Tool selection, multi-step reasoning, hallucination detection |
| Guardrails | Content filtering, PII detection, toxicity check |
| API Integration | Model endpoint, streaming response, token counting |
| Model Registry | Version control, A/B deployment, rollback |
| Monitoring | Drift detection, performance degradation, cost tracking |
| User Feedback | Thumbs up/down, correction submission, feedback loop |

### 19.3 UAT Execution Steps

1. **CTA Discovery** — QA enumerates ALL pages, routes, interactive elements. Produces `UAT_COVERAGE_MATRIX.md`
2. **Test Case Authoring** — QA writes test cases per `shared/UAT_PROTOCOL.md` format. Minimum >= 95% CTA coverage
3. **Test Data Preparation** — QA + BE seed test users, entities, files for ALL user roles
4. **Round 1 Execution** — Execute ALL test cases. Capture before/after screenshots. Log defects as GitHub issues
5. **Defect Triage** — TL + QA classify: Critical/High MUST be fixed. Medium/Low documented
6. **Bug Fix** — Engineers fix Critical + High defects. Each fix = atomic commit with issue reference
7. **Round 2 Regression** — Re-execute failed cases. Verify fixes. Regression-test related passing cases
8. **Coverage Verification** — Confirm >= 95% CTA coverage. If below, write additional cases and re-execute
9. **Report Generation** — Produce `UAT_REPORT_FINAL.md` + PDF + PPTX + JSON/CSV exports
10. **Sign-Off** — QA submits `UAT_SIGNOFF.md`, TL reviews, user approves (BLOCKING)

### 19.4 UAT Blocking Gate

```
GATE: UAT_PASS
  TRIGGER: After Wave 3.7 complete
  CRITERIA:
    [ ] All P0 test cases PASS (zero failures)
    [ ] All P1 test cases PASS (zero failures)
    [ ] P2 test cases: <= 3 failures (none Critical/High)
    [ ] CTA coverage >= 95%
    [ ] Compliance mapping 100% for applicable regulations
    [ ] All Critical/High defects resolved
    [ ] UAT_REPORT_FINAL.md exists with complete data
    [ ] UAT_SIGNOFF.md approved by TL + user
  BLOCKING: YES — Release (Wave 4) CANNOT proceed without UAT_PASS
```

### 19.5 UAT Evidence Requirements

| Evidence Type | When | File Pattern |
|--------------|------|--------------|
| Screenshot (before) | Before CTA action | `.team/uat/evidence/screenshots/{ID}_before.png` |
| Screenshot (after) | After successful CTA | `.team/uat/evidence/screenshots/{ID}_after.png` |
| Screenshot (error) | On CTA failure | `.team/uat/evidence/screenshots/{ID}_error.png` |
| Console log | On FAIL result | `.team/uat/evidence/logs/{ID}_console.log` |
| Network HAR | On FAIL result | `.team/uat/evidence/logs/{ID}_network.har` |
| API response | For API-driven CTAs | `.team/uat/evidence/logs/{ID}_api.json` |

### 19.6 UAT Compliance Mapping

Every UAT test case MUST be linked to at least one compliance framework:
- **ISO 25010** — Software quality (always applicable)
- **GDPR** — If handling EU personal data
- **SOC 2 Type II** — If security audit required
- **WCAG 2.1 AA** — If accessibility requirements
- **PCI DSS v4.0** — If payment processing
- **HIPAA** — If health data

### 19.7 Mission Control Integration

- **Dashboard**: `http://localhost:4200/uat`
- **Event category**: `UAT`
- **Event types**: `case_pass`, `case_fail`, `case_blocked`, `defect_found`, `defect_resolved`, `round_complete`, `coverage_verified`, `signoff_complete`
- **Downloads**: Individual test case, suite, or full export (JSON/CSV)
- **Real-time**: Live event stream shows last 2000 events

### 19.8 UAT Artifacts

```
.team/uat/
├── UAT_MASTER_INDEX.md
├── UAT_COVERAGE_MATRIX.md
├── UAT_COMPLIANCE_MAP.md
├── UAT_SIGNOFF.md
├── suites/
├── scenarios/
├── evidence/
│   ├── screenshots/
│   ├── videos/
│   └── logs/
└── reports/
    ├── UAT_REPORT_FINAL.md
    ├── UAT_REPORT_FINAL.pdf
    ├── UAT_REPORT_FINAL.pptx
    └── exports/ (JSON + CSV)
```
