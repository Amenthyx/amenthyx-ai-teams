# AI & Machine Learning Team — Tailored Strategy v3.1

> Pre-configured for **machine learning, deep learning, and MLOps**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team aiML --strategy path/to/this-file.md`

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

**Primary Users**: [FILL IN — e.g., data scientists, ML engineers, product teams]

**Secondary Users**: [FILL IN — e.g., business analysts, end users consuming predictions]

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
- **Language**: Python 3.12+
- **Framework**: PyTorch 2.x / TensorFlow / scikit-learn / Hugging Face Transformers
- **Database**: PostgreSQL (metadata) / Feature Store (Feast) / Vector DB (Pinecone / Weaviate / ChromaDB)
- **Cache**: Redis (inference caching, feature serving)
- **Message Queue**: Celery / Ray (distributed task execution)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (SageMaker) / GCP (Vertex AI) / Azure ML / self-hosted GPU cluster
- **Deployment**: Docker + Kubernetes / SageMaker Endpoints / Vertex AI Endpoints / BentoML / TorchServe
- **CDN**: N/A (API-based inference)
- **Domain**: [FILL IN or "N/A"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| MLflow / W&B | Experiment tracking | API token | Per plan |
| Feature Store (Feast) | Feature serving | Service account | Self-managed |
| Vector DB (Pinecone/Weaviate) | Embedding storage + retrieval | API key | Per plan |
| GPU cluster / cloud ML | Training + inference compute | IAM / service account | Per quota |

**Existing Codebase**: [FILL IN — Path to existing ML code, or "greenfield"]

**Package Manager**: poetry / conda / pip

**Monorepo or Polyrepo**: Single repo (notebooks/ + src/ + models/ + evaluations/ + configs/)

**Linting**:
- `ruff` — Python linting and formatting
- `mypy` — Static type checking
- `nbqa` — Jupyter notebook linting (runs ruff/mypy on notebook cells)

---

## 5. Non-Functional Requirements

**Performance**:
- Inference latency: P95 < 100ms (model-dependent)
- Training time: < [FILL IN] hours per full training run
- Model accuracy: [FILL IN — e.g., >= 92% F1, >= 0.85 AUC]
- Throughput: [FILL IN — e.g., 1000 predictions/second]

**Security**:
- Authentication: API key / OAuth 2.0 for inference endpoints
- Authorization: Model access control (who can invoke, who can retrain)
- Data privacy: Differential privacy / PII detection and redaction in training data
- Model security: Adversarial robustness testing, input validation
- Compliance: [FILL IN — GDPR / CCPA / HIPAA / AI Act / none]

**Scalability**:
- Expected launch inference volume: [FILL IN — requests/day]
- Expected 6-month volume: [FILL IN]
- Expected 1-year volume: [FILL IN]
- Scaling strategy: Horizontal (model replicas, auto-scaling endpoints) + GPU auto-provisioning

**Availability**:
- Uptime target: 99.9% for inference endpoints
- Recovery time objective (RTO): < 30 minutes (model rollback to previous version)
- Recovery point objective (RPO): < 1 hour (experiment tracking preserves all runs)
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- N/A (API-driven — accessibility applies to consuming applications)

**Observability**:
- Logging: MLflow / W&B experiment tracking, structured inference logs
- Metrics: Prometheus + Grafana (inference latency, throughput, error rate, GPU utilization)
- Tracing: Model monitoring — data drift detection, prediction drift, feature importance shifts
- Alerting: Model performance degradation alerts, SLA breach, GPU availability alerts

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% for Python source code; 100% evaluation suite coverage for all deployed models

**Required Test Types**:
- [x] Unit tests — pytest for data processing, feature engineering, utility functions
- [x] Integration tests — end-to-end pipeline tests (data in -> prediction out)
- [x] Model evaluation — accuracy, precision, recall, F1, AUC on held-out test sets
- [x] A/B test framework — statistical significance testing for model comparisons
- [x] Data quality tests — Great Expectations for training/evaluation datasets
- [x] Bias and fairness tests — demographic parity, equalized odds checks
- [x] Performance benchmarks — inference latency, throughput, memory usage
- [x] Security scanning — dependency audit, PII detection in datasets
- [ ] Adversarial robustness tests — [FILL IN if applicable]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ruff, mypy, nbqa)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated model evaluation on every PR (comparison vs. baseline)
- [x] Manual approval gate for model deployment to production
- [x] Model registry versioning (MLflow Model Registry)

**Testing Tools**: pytest, Great Expectations, MLflow, W&B, deepeval, ragas, Benchee, act

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
- GPU compute: [FILL IN — $/month for training + inference]
- Third-party APIs: [FILL IN — $/month for vector DBs, experiment tracking SaaS]
- Data storage: [FILL IN — $/month for datasets, model artifacts]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, GPU instance provisioning, SaaS subscriptions, API tier upgrades, cloud ML endpoint costs
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any production GPU instance, any reserved GPU commitment

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| GPU compute (training) | [FILL IN] | Card / cloud credits | No — ask first |
| ML platform (SageMaker/Vertex) | [FILL IN] | Card / existing credits | No — ask first |
| Vector DB SaaS | [FILL IN] | Card / free tier | No — ask first |
| Experiment tracking SaaS | [FILL IN] | Card / free tier | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Python code coverage >= 80%
- [ ] Model evaluation metrics meet targets on held-out test set
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Inference latency P95 < 100ms (or agreed target)
- [ ] Model card documented (architecture, training data, limitations, bias analysis)
- [ ] Inference benchmarked on production-like hardware
- [ ] Monitoring dashboards live (drift detection, performance metrics)
- [ ] Model versioned in registry (MLflow / equivalent)
- [ ] Data pipeline for retraining documented and tested
- [ ] A/B test framework ready for production rollout
- [ ] Documentation complete (README, model card, API docs, runbooks)
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

**Technical References**: [FILL IN — e.g., ML system design papers, MLOps maturity model, model cards research]

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
| Model drift (production data distribution shifts from training data) | M | H | Automated drift detection, scheduled retraining pipeline, monitoring dashboards, alerting thresholds |
| Training data bias (demographic, sampling, or label bias) | M | H | Bias and fairness testing suite, demographic parity checks, diverse evaluation datasets, model card documentation |
| GPU availability (cloud quota limits, spot instance interruptions) | M | M | Multi-cloud GPU strategy, checkpointing during training, spot instance fallback to on-demand |
| Model size/latency tradeoff (larger model = better accuracy but higher latency) | M | M | Model distillation, quantization, pruning, inference optimization (ONNX, TensorRT) |

**Hard Constraints** (non-negotiable):
- Reproducible experiments — fixed seeds, versioned datasets, MLflow tracking
- Model registry versioning — every deployed model version tracked
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
- A single model or pipeline has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking model quality issues requiring parallel investigation
- The strategy explicitly requests parallel model experiments

**Agent types the PM may add**:
- [ ] Additional ML Engineers (for model development)
- [ ] Additional Data Engineers (for data pipeline work)
- [ ] MLOps Specialist (for deployment, monitoring, infrastructure)
- [ ] Model Optimization Specialist (for quantization, distillation, latency reduction)
- [ ] Evaluation Specialist (for comprehensive testing, bias analysis)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Model evaluation metrics report (accuracy, F1, AUC, etc.)
- [x] Training logs and experiment tracking (MLflow / W&B screenshots)
- [x] Inference benchmark results (latency, throughput, memory)
- [x] Data quality reports (Great Expectations)
- [x] Bias and fairness analysis results
- [x] Model card (architecture, training data, limitations)
- [x] Drift detection dashboard screenshots
- [x] CI/CD pipeline passing (act + remote)
- [x] Security scan reports (dependency audit, PII check)
- [x] A/B test framework verification

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, model artifacts, experiment runs, datasets, log entries, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might delete training data, corrupt models, cost GPU money, affect production inference, introduce bias, be irreversible, or fall outside the stated strategy scope
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
- [x] Source code changes (models, training scripts, evaluation code)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: existing models, available training data, GPU quota, team ML expertise level, regulatory requirements, ethical considerations, etc.]

---

*AI & Machine Learning Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for machine learning, deep learning, and MLOps*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
