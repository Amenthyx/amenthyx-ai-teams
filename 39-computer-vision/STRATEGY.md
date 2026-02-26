# Computer Vision Team — Tailored Strategy v3.1

> Pre-configured for **object detection, image classification, segmentation, and video analytics with PyTorch, OpenCV, and ONNX Runtime**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team computerVision --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Computer Vision Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+ (training, inference, pipelines), C++ 17 (high-performance inference, custom operators)
- **Framework**: PyTorch 2.x (primary training), TensorFlow 2.x (if TFLite deployment needed)
- **Libraries**: OpenCV (image/video processing), torchvision (transforms, models), albumentations (augmentation), YOLO Ultralytics (detection), Detectron2 (instance segmentation)
- **Database**: PostgreSQL 16 (metadata, annotations) + S3/MinIO (object storage for images/videos)
- **Deployment**: ONNX Runtime (cross-platform inference), TensorRT (NVIDIA GPU inference), Triton Inference Server (production serving)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP — team's choice (GPU instances required)
- **Deployment**: Docker + Kubernetes (Triton serving) / Docker Compose (local dev)
- **GPU**: NVIDIA A100/A10G (training), T4/L4 (inference) — or equivalent
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| PostgreSQL 16 | Metadata + annotations | Connection string (env) | Connection pool max 20 |
| S3 / MinIO | Image/video object storage | IAM / access key (env) | N/A |
| MLflow | Model versioning + experiment tracking | API token (env) | N/A |
| Triton Inference Server | Model serving | gRPC / HTTP | Per GPU capacity |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: poetry (Python) / CMake (C++)

**Monorepo or Polyrepo**: Monorepo (training, inference, serving, data pipeline co-located)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Inference latency P95 < 50ms per image (GPU), < 200ms (CPU)
- Training throughput: maximize GPU utilization (> 85%)
- Video processing: real-time (30fps) for standard resolution
- Model loading time < 5s on cold start

**Security**:
- Authentication: API keys for inference endpoints, IAM for storage
- Authorization: Model registry access control (read/write/deploy)
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 for inference API, AES-256 for stored images/annotations

**Scalability**:
- Expected inference requests: [FILL IN]
- Scaling strategy: Triton Inference Server with horizontal GPU scaling, dynamic batching
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]

**Availability**:
- Uptime target: 99.9% (inference endpoint)
- RTO: 30 minutes
- RPO: 1 hour (model checkpoints)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- API documentation with OpenAPI specification
- Dashboard for model monitoring (Grafana)
- Annotation tool accessible via web UI

**Observability**:
- Logging: Structured JSON logs (structlog) for training and inference pipelines
- Metrics: Prometheus (inference latency, throughput, GPU utilization, model accuracy drift)
- Tracing: OpenTelemetry for inference request tracing
- Alerting: Grafana Alerting for model accuracy degradation, latency spikes, GPU failures

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (inference pipeline), >= 70% (training scripts)

**Required Test Types**:
- [x] Unit tests (pytest — data transforms, preprocessing, postprocessing)
- [x] Model evaluation tests (mAP, IoU, precision/recall on held-out test set)
- [x] Integration tests (inference pipeline end-to-end with sample images)
- [x] ONNX export validation (PyTorch → ONNX → inference output match)
- [x] Regression tests (model accuracy on golden test set must not degrade)
- [x] GPU/CPU parity tests (inference results match within tolerance across devices)
- [x] Data augmentation tests (albumentations pipeline produces valid outputs)
- [ ] Visual regression tests (optional — output visualization comparison)
- [ ] Stress tests (optional — inference under sustained high load)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (black, ruff, mypy via pre-commit)
- [x] Branch protection (require PR reviews, passing CI)
- [x] GPU-aware CI (NVIDIA Docker for GPU tests, CPU fallback for others)
- [ ] Automated model evaluation on PR (test set metrics computed)
- [ ] Model registry integration (MLflow auto-log on merge to main)

**Testing Tools**: pytest, MLflow, DVC, ONNX Runtime validation, Triton Model Analyzer, albumentations

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
- Third-party APIs: [FILL IN: $/month or "free tier only"]
- Domains/SSL: [FILL IN: $ or "already owned"]

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
| AWS/GCP GPU instances | Variable | Card | No — ask first |
| S3 / MinIO storage | Variable | Card | No — ask first |
| Weights & Biases (optional) | Free / ~$50/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% inference pipeline coverage, >= 70% training coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Model accuracy meets target metrics on test set (mAP, IoU, etc.)
- [ ] ONNX export validated, inference matches PyTorch within tolerance
- [ ] Triton serving deployed and load-tested
- [ ] Model versioned in MLflow/DVC with full training provenance
- [ ] Documentation complete (README, model card, API docs, training guide)
- [ ] CI/CD pipeline tested and working (including GPU-aware jobs)
- [ ] All environment variables documented in .env.example

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
| GPU availability/cost overrun for training | M | H | Spot instances, mixed precision training, gradient accumulation, training budget caps |
| Model accuracy degradation after ONNX/TensorRT conversion | M | H | Automated ONNX validation tests, tolerance thresholds, per-layer output comparison |
| Training data bias leading to unfair predictions | M | H | Bias audits, dataset diversity analysis, fairness metrics in evaluation suite |
| Non-reproducible training runs | M | M | Fixed seeds, deterministic mode, Docker training environments, DVC data versioning |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Model versioning: every trained model registered in MLflow/DVC with full provenance
- GPU-aware CI: training/inference tests run on GPU when available, CPU fallback validated
- Reproducible training: fixed random seeds, deterministic operations, versioned datasets
- Model cards required: every deployed model must have a model card documenting architecture, training data, metrics, limitations

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
- [x] Additional CV Engineer (model training, architecture experiments)
- [x] Additional Data Engineer (annotation pipeline, data augmentation)
- [x] Additional Inference Engineer (ONNX, TensorRT, Triton optimization)
- [x] Additional C++ Engineer (custom operators, high-performance inference)
- [x] DevOps Specialist (GPU infrastructure, CI/CD, model serving)
- [x] MLOps Specialist (MLflow, DVC, model registry, monitoring)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (pytest-cov — HTML + lcov)
- [x] Model evaluation report (mAP, IoU, precision, recall, confusion matrix)
- [x] ONNX validation report (PyTorch vs ONNX output comparison)
- [x] Inference latency benchmarks (P50, P95, P99 on target hardware)
- [x] Training logs (loss curves, learning rate schedules, GPU utilization)
- [x] Model card (architecture, data, metrics, limitations, ethical considerations)
- [x] Data augmentation samples (before/after visualization)
- [x] CI/CD pipeline screenshot (all checks green, including GPU jobs)
- [x] MLflow experiment tracking screenshot (all runs logged)
- [x] Architecture diagram (training pipeline, inference pipeline, data flow)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Model checkpoints**: ALL training checkpoints retained in model registry
- **Datasets**: ALL dataset versions tracked via DVC

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/computerVision/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (model evals, ONNX validation, benchmarks)
- [x] Source code changes (training scripts, inference pipeline, data processing)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Computer Vision Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python + C++ + PyTorch + OpenCV + ONNX Runtime + Triton computer vision*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
