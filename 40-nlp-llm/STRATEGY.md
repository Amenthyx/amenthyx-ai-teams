# NLP/LLM Team — Tailored Strategy v3.1

> Pre-configured for **fine-tuning, RLHF, RAG, prompt engineering, and LLM evaluation with Hugging Face, LangChain, and vLLM**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team nlpLLM --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for NLP/LLM Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+
- **Framework**: Hugging Face Transformers (model hub, training), LangChain (orchestration, chains, agents), LlamaIndex (RAG, data connectors)
- **Libraries**: tokenizers (fast tokenization), datasets (data loading), PEFT (LoRA, QLoRA, adapters), bitsandbytes (quantization), vLLM (high-throughput serving)
- **Database**: PostgreSQL 16 (metadata, user data) + Vector DB (Qdrant / Pinecone / Weaviate for embeddings)
- **Deployment**: vLLM (serving), TGI (Hugging Face Text Generation Inference), Triton Inference Server

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP — team's choice (GPU instances required for training/serving)
- **Deployment**: Docker + Kubernetes (model serving) / Docker Compose (local dev)
- **GPU**: NVIDIA A100 80GB (fine-tuning), A10G/L4 (inference) — or equivalent
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Hugging Face Hub | Model/dataset hosting | HF token (env) | Per plan |
| PostgreSQL 16 | Metadata store | Connection string (env) | Connection pool max 20 |
| Qdrant / Pinecone / Weaviate | Vector DB for RAG | API key (env) | Per plan |
| vLLM / TGI | LLM serving | Internal API | Per GPU capacity |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: poetry

**Monorepo or Polyrepo**: Monorepo (training, evaluation, serving, RAG pipeline co-located)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Inference latency: time-to-first-token < 500ms, token throughput > 30 tokens/s per request
- RAG retrieval latency P95 < 200ms (vector search + context assembly)
- Fine-tuning throughput: maximize GPU utilization (> 80%)
- Embedding generation: > 1000 documents/minute batch processing

**Security**:
- Authentication: API keys for inference endpoints, OAuth2 for admin
- Authorization: Model access control (deploy/test/evaluate permissions)
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 for API endpoints, AES-256 for stored training data and embeddings
- PII handling: data anonymization pipeline, no PII in training data without explicit consent

**Scalability**:
- Expected inference requests: [FILL IN]
- Scaling strategy: vLLM with continuous batching, horizontal GPU scaling, vector DB sharding
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]

**Availability**:
- Uptime target: 99.9% (inference endpoint)
- RTO: 30 minutes
- RPO: 1 hour (model weights backed up)
- Multi-region: [FILL IN: yes / no / future]

**Accessibility**:
- API documentation with OpenAPI specification
- Playground/demo UI for prompt testing
- Evaluation dashboard accessible via web

**Observability**:
- Logging: Structured JSON logs (structlog) for all pipeline stages
- Metrics: Prometheus (inference latency, throughput, GPU utilization, token counts, cache hit rates)
- Tracing: OpenTelemetry for RAG pipeline tracing (query → retrieval → generation)
- Alerting: Grafana Alerting for model quality drift, latency degradation, GPU errors

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (RAG pipeline, API layer), >= 70% (training scripts)

**Required Test Types**:
- [x] Unit tests (pytest — data processing, prompt templates, chain logic)
- [x] Evaluation benchmarks (MMLU, HellaSwag, HumanEval, or domain-specific benchmarks)
- [x] RAG quality tests (retrieval recall@k, answer relevance, faithfulness)
- [x] Prompt regression tests (golden set of prompts with expected output patterns)
- [x] Integration tests (end-to-end RAG pipeline, API endpoint tests)
- [x] Model card validation (all required fields populated)
- [x] Data provenance tests (training data sources documented and versioned)
- [ ] Red teaming tests (optional — adversarial prompt injection, jailbreak resistance)
- [ ] Bias/fairness evaluation (optional but recommended)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (black, ruff, mypy via pre-commit)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated evaluation benchmark on PR (subset of eval suite)
- [ ] Model registry integration (HF Hub or MLflow on merge)

**Testing Tools**: pytest, lm-eval-harness, ragas (RAG evaluation), deepeval, promptfoo, MLflow

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
| AWS/GCP GPU instances | Variable (high) | Card | No — ask first |
| Hugging Face Pro | ~$9/mo | Card | No — ask first |
| Pinecone / Qdrant Cloud | Variable | Card | No — ask first |
| OpenAI API (evaluation baseline) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% pipeline test coverage, >= 70% training coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Evaluation benchmarks meet target scores
- [ ] RAG quality metrics meet thresholds (relevance, faithfulness, recall)
- [ ] Model card complete with architecture, data, metrics, limitations, ethical considerations
- [ ] vLLM/TGI serving deployed and load-tested
- [ ] Documentation complete (README, API docs, evaluation report, prompt guide)
- [ ] CI/CD pipeline tested and working (including GPU jobs)
- [ ] Data provenance fully tracked for all training data

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
| GPU cost overrun during fine-tuning | H | H | QLoRA/LoRA instead of full fine-tuning, spot instances, training budget caps, early stopping |
| Model hallucination in production | H | H | RAG with source attribution, guardrails, output validation, human-in-the-loop for critical outputs |
| Training data contamination / licensing issues | M | H | Data provenance tracking, license auditing, decontamination pipelines |
| Prompt injection attacks | M | H | Input sanitization, system prompt protection, output filtering, red team testing |
| Vector DB scaling costs for large corpora | M | M | Embedding dimensionality reduction, tiered storage, quantized vectors |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Model cards required: every deployed model must document architecture, training data, metrics, limitations
- Evaluation benchmarks mandatory: no model ships without quantified performance on standard benchmarks
- Data provenance tracked: every training dataset must have documented source, license, version, preprocessing
- No PII in training data without explicit consent and documented data handling procedures

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
- [x] Additional NLP Engineer (fine-tuning, RLHF, model architecture)
- [x] Additional RAG Engineer (retrieval pipeline, embedding optimization)
- [x] Additional Prompt Engineer (prompt design, chain-of-thought, few-shot)
- [x] Additional Evaluation Specialist (benchmarks, red teaming, bias analysis)
- [x] DevOps Specialist (GPU infrastructure, vLLM deployment, CI/CD)
- [x] Data Engineer (dataset curation, preprocessing, vector DB management)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (pytest-cov — HTML + lcov)
- [x] Evaluation benchmark results (lm-eval-harness output, domain-specific metrics)
- [x] RAG quality report (ragas scores: faithfulness, relevance, recall)
- [x] Inference latency benchmarks (TTFT, throughput, P50/P95/P99)
- [x] Training logs (loss curves, learning rate, GPU utilization, eval metrics per epoch)
- [x] Model card (complete, peer-reviewed)
- [x] Data provenance documentation (all training data sources, licenses, preprocessing)
- [x] Prompt regression test results (golden set pass rate)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (training pipeline, RAG pipeline, serving infrastructure)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Model weights**: ALL checkpoints retained in model registry
- **Evaluation results**: ALL benchmark runs retained for trend analysis

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/nlpLLM/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (eval results, benchmarks, model cards)
- [x] Source code changes (training, RAG pipeline, serving, evaluation)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*NLP/LLM Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python + Hugging Face + LangChain + LlamaIndex + vLLM + Vector DB NLP/LLM development*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
