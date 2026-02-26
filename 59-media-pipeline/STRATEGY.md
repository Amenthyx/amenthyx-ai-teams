# Media Pipeline Team — Tailored Strategy v3.1

> Pre-configured for **media ingest, transcoding pipelines, asset management (MAM/DAM), CDN distribution, and render farm orchestration with Python, Go, FFmpeg, Airflow/Temporal, and S3/CloudFront**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team mediaPipeline --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Media Pipeline Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+ / Go 1.22+
- **Orchestration**: Apache Airflow / Temporal — workflow orchestration and scheduling
- **Libraries**: ffmpeg-python, boto3 (S3), Celery (distributed task queue), PyAV
- **Infrastructure**: S3 / GCS (object storage), CDN (CloudFront / Fastly), Redis (queue/cache)
- **Encoding**: FFmpeg 6+ (H.264/H.265/AV1), hardware acceleration (NVENC/QSV)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (S3, MediaConvert, CloudFront, EKS) / GCP (GCS, Transcoder API, Cloud CDN) — team's choice
- **Deployment**: Docker + Kubernetes (transcoding workers, pipeline services)
- **Storage**: S3/GCS (hot), S3 Glacier/Coldline (archive), local NAS (staging)
- **CDN**: CloudFront / Fastly / Cloudflare (video delivery with ABR)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| AWS S3 / GCS | Object storage for media assets | IAM / service account (env) | Per-bucket limits |
| CloudFront / Fastly | CDN distribution | IAM / API key (env) | Bandwidth-based |
| AWS MediaConvert | Serverless transcoding (burst) | IAM (env) | Job queue limits |
| Redis | Job queue backend, caching | AUTH token (env) | N/A |
| Airflow / Temporal | Workflow orchestration | Local / service account | Worker-based |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pip (Python), go modules (Go)

**Monorepo or Polyrepo**: Monorepo (pipeline services, transcoding workers, orchestration DAGs, IaC)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Transcoding: VMAF > 90 and SSIM > 0.95 for all renditions
- Pipeline throughput: [FILL IN — hours of media per day]
- CDN TTFB: < 200ms from edge locations
- Ingest-to-playable latency: tracked and optimized per media type
- Job completion rate: 100% (with automatic retry)

**Security**:
- Authentication: IAM roles (AWS/GCP) for service-to-service, API keys for external access
- Authorization: Bucket policies, CDN signed URLs/cookies for protected content
- Data sensitivity: [FILL IN — pre-release content, DRM-protected media]
- Compliance: [FILL IN — DRM requirements (Widevine/FairPlay/PlayReady), content integrity]
- Encryption: TLS 1.3 in transit, S3 SSE (AES-256) at rest, DRM encryption for delivery

**Scalability**:
- Expected media volume: [FILL IN — hours per day/week]
- Expected storage: [FILL IN — TB current, projected growth]
- Scaling strategy: Kubernetes HPA for transcoding workers, spot/preemptible instances for cost, S3 lifecycle policies for storage tiering

**Availability**:
- Uptime target: 99.9% (pipeline services), 99.99% (CDN delivery)
- RTO: 1 hour (pipeline), 5 minutes (CDN failover via origin groups)
- RPO: 0 (lossless source preservation, checksum verification)
- Multi-region: [FILL IN: yes / no / future — CDN is inherently multi-region]

**Accessibility**:
- N/A (backend infrastructure) — subtitle/caption tracks in packaged output
- API documentation: screen-reader friendly (OpenAPI)

**Observability**:
- Logging: Structured JSON (Python logging, Go zerolog), per-job logs in centralized system
- Metrics: Prometheus + Grafana — job completion rate, processing time per minute, VMAF scores, CDN cache hit ratio, cost per minute
- Tracing: OpenTelemetry (distributed traces across ingest -> transcode -> package -> deliver)
- Alerting: Job failure rate > 1%, VMAF below threshold, CDN cache hit ratio < 90%, cost per minute exceeding budget

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 85% (pipeline orchestration, transcoding logic), >= 80% (API services)

**Required Test Types**:
- [x] Pipeline reliability (100 test jobs submitted — 100% completion with retry, idempotency verified)
- [x] Transcoding quality (VMAF > 90 per rendition, SSIM > 0.95, bitrate within target)
- [x] Delivery performance (TTFB < 200ms from 10 global edge locations, cache hit ratio > 95% after warm-up)
- [x] Failure injection (kill workers mid-job — automatic retry and completion verified)
- [x] Poison pill test (corrupt input handled gracefully — dead-letter routing)
- [x] Cost validation (actual $/minute within 10% of budget target)
- [x] DRM integration (license acquisition latency < 500ms, content plays on Widevine/FairPlay/PlayReady)
- [x] End-to-end (ingest-to-playable latency measurement, player compatibility)
- [x] Unit tests (pytest / go test — pipeline logic, asset management, API services)
- [x] Integration tests (Testcontainers — S3, Redis, database interactions)
- [ ] Chaos engineering (optional — network partition, storage unavailability)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (Python ruff, Go golangci-lint, Terraform fmt/validate)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Infrastructure-as-code validation (Terraform plan in CI)
- [ ] Automated transcoding quality test (short test clip, VMAF scoring)
- [ ] Automated CDN performance test (TTFB measurement)

**Testing Tools**: pytest, go test, Testcontainers, ffmpeg (VMAF/SSIM filters), ffprobe, k6 (API load testing), Terraform validate, custom pipeline validation scripts

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
- Infrastructure: [FILL IN: $/month — compute, storage, CDN]
- Transcoding: [FILL IN: $/minute target]
- Storage: [FILL IN: $/TB/month with tiering]

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
| AWS (S3, MediaConvert, CloudFront, EKS) | Variable | Card | No — ask first |
| GCP (GCS, Transcoder API, Cloud CDN) | Variable | Card | No — ask first |
| DRM provider (BuyDRM / PallyCon) | Variable | Card | No — ask first |
| Mux (if managed video API) | ~$0.007/min | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown (compute + storage + CDN + transcode)

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 pipeline features implemented and tested
- [ ] >= 85% test coverage on pipeline orchestration and transcoding logic
- [ ] 100% job completion rate (with retry) — verified over 100 test jobs
- [ ] VMAF > 90 and SSIM > 0.95 for all transcoded renditions
- [ ] CDN TTFB < 200ms from edge, cache hit ratio > 95%
- [ ] DRM integration verified (Widevine/FairPlay/PlayReady — if applicable)
- [ ] Ingest-to-playable latency measured and documented
- [ ] Cost per minute within 10% of budget target
- [ ] Lossless source preservation with checksum verification
- [ ] Storage lifecycle policies active (hot -> warm -> cold archiving)
- [ ] Infrastructure-as-code (Terraform/Pulumi) for all cloud resources
- [ ] Pipeline runbook complete (operations, failure modes, scaling, cost alerts)
- [ ] All environment variables documented in .env.example
- [ ] CI/CD pipeline tested and working

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
| Cloud cost overrun from unoptimized transcoding | H | H | Per-minute cost tracking, spot instances (60-70% savings), reserved capacity for baseline, cost alerts |
| Source media corruption or loss | L | H | Checksum verification on ingest, S3 versioning, cross-region replication, lossless source preservation |
| CDN cache invalidation delays | M | M | Cache-busting via content hash URLs, short TTL for manifests, long TTL for immutable segments |
| Transcoding quality regression after profile changes | M | H | VMAF regression tests, encoding profile versioning, rollback capability |
| Render farm spot instance preemption | M | M | Checkpoint/resume for long jobs, graceful termination handling, on-demand fallback |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Lossless source preservation — original media files NEVER modified, checksums verified
- Content integrity chain — SHA256 checksums at every pipeline stage
- Disaster recovery — media assets recoverable from archive within defined SLA
- VMAF > 90 for all transcoded renditions
- Infrastructure-as-code — all cloud resources managed via Terraform/Pulumi
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
- QA finds >= 5 pipeline quality or reliability issues

**Agent types the PM may add**:
- [x] Additional Transcoding Engineer (FFmpeg optimization, codec tuning)
- [x] Additional Cloud Render Engineer (Kubernetes, render farm, spot instances)
- [x] Additional Asset Management Engineer (DAM, metadata, proxy workflows)
- [x] Additional CDN/Delivery Engineer (cache optimization, DRM, player integration)
- [x] Additional QA Engineer (pipeline reliability, quality metrics, cost validation)
- [x] Infrastructure/DevOps Specialist (Terraform, Kubernetes, monitoring)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Pipeline reliability report (100 jobs, 100% completion, retry logs)
- [x] VMAF/SSIM quality metrics per rendition (all > 90 / > 0.95)
- [x] CDN performance report (TTFB < 200ms from 10 edge locations, cache hit ratio > 95%)
- [x] Cost report (actual $/minute vs budget, breakdown by compute/storage/CDN)
- [x] Failure injection test results (worker kill recovery, corrupt input handling)
- [x] DRM integration proof (playback on Widevine/FairPlay/PlayReady — if applicable)
- [x] Checksum verification logs (source integrity chain)
- [x] Test coverage report (pytest / go test — HTML + lcov)
- [x] Architecture diagram (pipeline flow, infrastructure topology, CDN distribution)
- [x] Infrastructure-as-code (Terraform plan output — reviewed)
- [x] CI/CD pipeline screenshot (all checks green)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Source media**: lossless preservation with checksums — NEVER modify or delete
- **Transcoded outputs**: versioned, archived before overwrite — NEVER delete without archive
- **Pipeline state**: job logs preserved — NEVER purge without archiving
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
- [x] `.team/evidence/` proof artifacts (quality reports, pipeline metrics, cost reports)
- [x] Source code (pipeline services, transcoding workers, Airflow DAGs, Terraform modules)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Media Pipeline Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python/Go + FFmpeg + Airflow/Temporal + S3/CloudFront media processing and delivery pipelines*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
