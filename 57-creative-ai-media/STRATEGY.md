# Creative AI / Generative Media Team — Tailored Strategy v3.1

> Pre-configured for **AI image generation, AI video generation, style transfer, inpainting, and ControlNet workflows with Python, ComfyUI, Stable Diffusion, and diffusers**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team creativeAI --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Creative AI / Generative Media Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+
- **Framework**: ComfyUI (node-based workflows), Stable Diffusion WebUI (AUTOMATIC1111/Forge)
- **Libraries**: diffusers (Hugging Face), transformers, PIL/Pillow, opencv-python, rembg (background removal)
- **Models**: Stable Diffusion XL / SD3 / Flux, ControlNet, IP-Adapter, AnimateDiff
- **Upscaling**: Real-ESRGAN, GFPGAN / CodeFormer (face restoration), Swin2SR / HAT

**Hosting/Infrastructure**:
- **GPU**: NVIDIA GPU with >= 12GB VRAM (RTX 3060+ / A4000+ recommended)
- **Cloud GPU**: RunPod / Vast.ai / Lambda — for burst capacity or training
- **Deployment**: Docker (ComfyUI + models in container) / local GPU workstation
- **Model Storage**: Hugging Face Hub / local model directory / S3 for large model files
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD (workflows, custom nodes, pipeline scripts) | gh CLI | N/A |
| ComfyUI | Node-based generation pipeline | Local / API mode | GPU-bound |
| Hugging Face Hub | Model hosting, model cards, dataset hosting | HF token (env) | API rate limits |
| CivitAI | Community model hosting (LoRA, checkpoints) | API key (optional) | Per plan |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pip / conda (for CUDA dependencies)

**Monorepo or Polyrepo**: Monorepo (ComfyUI workflows, custom nodes, training scripts, pipeline code)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Image generation: SDXL < 15 seconds per image at 1024x1024 (GPU-dependent)
- Video generation: AnimateDiff < 60 seconds per 16-frame clip
- Upscaling: Real-ESRGAN 4x < 10 seconds per image
- VRAM usage: peak < available GPU VRAM (no OOM crashes)
- Batch processing: queue-based with progress reporting

**Security**:
- Authentication: N/A (local) or API key for cloud inference endpoints
- Authorization: N/A
- Data sensitivity: [FILL IN — generated content safety, training data provenance]
- Compliance: Content safety (NSFW filtering mandatory), no deepfakes of real persons, C2PA metadata for provenance
- Encryption: HTTPS for API endpoints, model integrity via SHA256 checksums

**Scalability**:
- Expected generation volume: [FILL IN — images per day/week]
- GPU scaling: single GPU (local) / multi-GPU (cloud burst) — RunPod/Vast.ai for scaling
- Model management: versioned model weights with checksums, Hugging Face Hub for distribution

**Availability**:
- Uptime target: N/A (batch/interactive generation)
- RTO: N/A
- RPO: Workflows are code (Git), models have checksums for reproducibility
- Multi-region: N/A (unless cloud inference)

**Accessibility**:
- Generated images: alt-text metadata recommended
- Web interfaces: WCAG 2.1 AA for any UI components
- API documentation: screen-reader friendly

**Observability**:
- Logging: Generation logs (prompt, seed, model, parameters), ComfyUI execution logs
- Metrics: Inference time per generation, VRAM usage, queue depth, CLIP similarity scores
- Tracing: N/A
- Alerting: OOM detection, NSFW filter triggers, generation failure rate > 5%

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (Python pipeline scripts, custom ComfyUI nodes), N/A (model inference — validation-based)

**Required Test Types**:
- [x] Quality metrics (CLIP similarity > 0.25 for prompt adherence, FID for distribution quality)
- [x] Safety enforcement (NSFW classifier on all outputs — zero tolerance, deepfake detection)
- [x] Model integrity (SHA256 checksum verification for all model weights, safetensors format)
- [x] Pipeline reproducibility (same seed + same parameters = identical output)
- [x] ComfyUI workflow validation (workflow JSON loads, all nodes resolve, execution completes)
- [x] Upscaling quality (PSNR > 30dB vs source, no hallucinated artifacts)
- [x] VRAM monitoring (no OOM during generation, peak VRAM tracked)
- [x] Unit tests (pytest — custom nodes, pipeline utilities, prompt templates)
- [x] Watermark/provenance verification (C2PA metadata or invisible watermark present)
- [ ] A/B quality comparison (optional — human evaluation of output quality)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (Python linting with ruff, JSON validation for ComfyUI workflows)
- [x] Model checksum verification in CI (SHA256 for all referenced model files)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated quality check on sample prompts (if GPU available in CI)
- [ ] Automated safety classifier test on sample outputs

**Testing Tools**: pytest, CLIP (quality metrics), safety classifier, sha256sum, ComfyUI API (workflow validation), ruff, custom validation scripts

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
- GPU compute: [FILL IN: $/month or "local GPU only"]
- Cloud GPU (training): [FILL IN: $/hour on RunPod/Vast.ai]
- Model storage: [FILL IN: free tier Hugging Face or S3 cost]

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
| RunPod (cloud GPU) | ~$0.30-2.00/hr | Card/credits | No — ask first |
| Vast.ai (cloud GPU) | ~$0.20-1.50/hr | Card/credits | No — ask first |
| Hugging Face Pro | ~$9/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 generation pipelines implemented and tested
- [ ] >= 80% test coverage on Python pipeline code and custom nodes
- [ ] Content safety enforced — NSFW classifier passes on all outputs
- [ ] Model integrity verified — all model files have SHA256 checksums
- [ ] Pipeline reproducibility proven — same seed + params = identical output
- [ ] CLIP similarity > 0.25 for representative prompt set
- [ ] ComfyUI workflows load and execute without errors
- [ ] VRAM usage within GPU limits — no OOM crashes
- [ ] Provenance metadata (C2PA / watermark) embedded in all outputs
- [ ] Custom nodes documented with usage examples
- [ ] Workflow JSON files versioned and exportable

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
| Model license incompatibility (SDXL license, Flux license) | M | H | Review license terms before adoption, document in .ai/context_base.md, use permissive models where possible |
| VRAM OOM on complex pipelines (multi-ControlNet, high-res) | H | M | Attention slicing, VAE tiling, model offloading, sequential CPU offload as fallback |
| Generated content safety violation | M | H | NSFW classifier on ALL outputs (zero tolerance), content policy enforcement, human review for published content |
| Model drift / quality regression after updates | M | M | Pin model versions with SHA256, A/B testing for model updates, quality benchmark suite |
| Training data provenance concerns | M | H | Use models with documented training data, respect opt-out lists, C2PA metadata for transparency |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Content safety — NSFW classifier on all generated outputs, zero tolerance
- No deepfakes of real persons — no training LoRAs on identifiable individuals without explicit consent
- Model integrity — SHA256 checksums for all model weights, safetensors format only (no pickle)
- Provenance metadata — C2PA or invisible watermark on all published outputs
- Prompt versioning — all prompts tracked alongside seeds and parameters for reproducibility

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 quality or safety issues

**Agent types the PM may add**:
- [x] Additional Image Generation Engineer (Stable Diffusion, ControlNet)
- [x] Additional Video Generation Engineer (AnimateDiff, SVD)
- [x] Additional Model Fine-Tuning Engineer (LoRA, DreamBooth)
- [x] Additional ComfyUI Pipeline Engineer (custom nodes, workflow design)
- [x] Additional QA Engineer (quality metrics, safety enforcement)
- [x] GPU Infrastructure Specialist (VRAM optimization, cloud GPU management)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Quality metric reports (CLIP similarity, FID scores for representative prompt sets)
- [x] Safety enforcement report (NSFW classifier results — 100% pass rate)
- [x] Model integrity verification (SHA256 checksums for all model files)
- [x] Pipeline reproducibility proof (same seed/params produces identical output — side-by-side)
- [x] VRAM usage profiling (peak VRAM per pipeline, no OOM evidence)
- [x] ComfyUI workflow validation (all workflows load and execute — logs)
- [x] Sample output gallery (representative generations with prompts and parameters)
- [x] Test coverage report (pytest — HTML + lcov)
- [x] Provenance metadata verification (C2PA/watermark presence proof)
- [x] CI/CD pipeline screenshot (all checks green)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Model weights**: versioned with SHA256 — NEVER overwrite
- **Generated outputs**: archived with full metadata (prompt, seed, model, parameters) — NEVER delete
- **ComfyUI workflows**: versioned JSON — NEVER overwrite
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
**Branch**: `ai-team` (MANDATORY — all teams use this branch)
**Merge to main**: ONLY after Team Leader receives explicit user approval (hard gate)

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (quality reports, safety logs, sample galleries)
- [x] Source code (custom nodes, pipeline scripts, training configs)
- [x] ComfyUI workflow JSON files
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Creative AI / Generative Media Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python + ComfyUI + Stable Diffusion + ControlNet + AnimateDiff generative AI media pipelines*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
