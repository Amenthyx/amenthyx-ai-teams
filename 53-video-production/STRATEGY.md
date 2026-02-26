# Video Production Team — Tailored Strategy v3.1

> Pre-configured for **video encoding, transcoding, color grading automation, subtitle management, and batch processing pipelines with FFmpeg, DaVinci Resolve, and Python**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team videoProduction --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Video Production Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+ / Bash
- **Tools**: FFmpeg 6+ (encoding/transcoding/packaging), DaVinci Resolve (scripting API via fusionscript), HandBrake CLI, MediaInfo
- **Libraries**: ffmpeg-python, PyAV, OpenCV (video processing), colour-science (color space math)
- **Codecs**: H.264 (x264), H.265 (x265), AV1 (SVT-AV1/libaom), VP9 (libvpx-vp9), ProRes, DNxHR
- **Standards**: BT.709 (SDR), BT.2020 (HDR/WCG), ACES, EBU R128 (loudness), SMPTE ST.2084 (PQ)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (MediaConvert) / GCP (Transcoder API) / local — team's choice
- **Deployment**: Docker (FFmpeg + Python in container) / local workstation
- **Storage**: S3 / GCS / local NAS for media assets
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD (scripts, encoding profiles) | gh CLI | N/A |
| FFmpeg 6+ | Encoding / transcoding / filter chains | Local install | CPU/GPU-bound |
| DaVinci Resolve | Color grading automation | fusionscript API | Local license |
| MediaInfo | Metadata extraction and compliance checking | CLI tool | N/A |
| ffprobe | Stream analysis and validation | Part of FFmpeg | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pip (Python) / apt (system tools)

**Monorepo or Polyrepo**: Monorepo (encoding profiles, scripts, pipeline definitions)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Encoding speed: >= 1x realtime for H.264 (faster with hardware acceleration)
- VMAF target: >= 93 for broadcast, >= 85 for streaming delivery
- Batch processing: pipeline processes queued jobs without manual intervention
- Encoding time tracked per minute of source media

**Security**:
- Authentication: N/A (local tooling) or cloud IAM for remote workflows
- Authorization: N/A
- Data sensitivity: [FILL IN — client media assets, pre-release content]
- Compliance: Broadcast standards (EBU R128 loudness, BT.709/BT.2020 color), FCC for US broadcast
- Encryption: Encrypted storage for pre-release content if applicable

**Scalability**:
- Expected media volume: [FILL IN — hours per week/month]
- Parallel encoding: Multi-job queuing with GNU parallel / Celery
- Hardware acceleration: NVENC (NVIDIA) / QSV (Intel) / VideoToolbox (macOS) supported

**Availability**:
- Uptime target: N/A (batch processing)
- RTO: N/A
- RPO: Source media preserved losslessly — intermediate and output files are reproducible
- Multi-region: N/A (unless cloud transcoding)

**Accessibility**:
- Subtitle workflows: SRT, WebVTT, ASS/SSA, CEA-608/708 closed captioning
- Audio description tracks where required
- WCAG 2.1 AA for any web-delivered video (captions required)

**Observability**:
- Logging: FFmpeg encoding logs (per-job), DaVinci Resolve render logs
- Metrics: VMAF/SSIM/PSNR per deliverable, encoding time per minute, file sizes, loudness measurements
- Tracing: N/A
- Alerting: Encoding failure alerts, VMAF below threshold, loudness non-compliance

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (Python encoding scripts), N/A (FFmpeg commands — validation-based)

**Required Test Types**:
- [x] A/V sync verification (ffprobe pts_time comparison — max drift 1 frame)
- [x] Codec compliance (ffprobe verification — codec, profile, level, pixel format, color primaries)
- [x] Quality metrics (VMAF >= 93 broadcast / >= 85 streaming, SSIM >= 0.97)
- [x] Loudness measurement (EBU R128 via `ebur128` filter — integrated -23 LUFS / ATSC -24 LKFS)
- [x] Subtitle validation (timing accuracy, character count, reading speed, format schema)
- [x] HDR metadata verification (MaxCLL, MaxFALL, mastering display for HDR10 deliverables)
- [x] Container validation (moov atom placement for web, chapter markers, stream ordering)
- [x] Color space verification (color_primaries, transfer_characteristics, matrix_coefficients via ffprobe)
- [x] Unit tests (pytest — Python encoding scripts, pipeline logic)
- [ ] Perceptual comparison (optional — A/B frame visual comparison with reference)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (Python linting with ruff, FFmpeg command validation, file size checks)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated test encoding on push (short test clip, quality verification)
- [ ] Automated VMAF scoring in CI

**Testing Tools**: ffprobe, ffmpeg (VMAF/SSIM/PSNR filters), MediaInfo, pytest, pylint/ruff, custom validation scripts

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
- Infrastructure: [FILL IN: $/month or "local only"]
- Cloud transcoding: [FILL IN: $/minute or "local FFmpeg only"]
- Storage: [FILL IN: $/GB or "local NAS"]

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
| AWS MediaConvert | ~$0.024/min | Card | No — ask first |
| DaVinci Resolve Studio | $295 one-time | Card | No — ask first |
| Cloud storage (S3/GCS) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 encoding pipelines implemented and tested
- [ ] >= 80% test coverage on Python encoding scripts
- [ ] VMAF scores meet targets (>= 93 broadcast, >= 85 streaming) for all deliverables
- [ ] Loudness compliance verified (EBU R128 / ATSC A/85 per delivery target)
- [ ] A/V sync verified — max drift 1 frame across all deliverables
- [ ] Color space correct for all deliverables (BT.709 SDR, BT.2020 HDR)
- [ ] Subtitles validated (timing, format, accessibility compliance)
- [ ] Multi-format delivery complete (broadcast master, streaming ABR, social, archive)
- [ ] Encoding profiles documented and versioned
- [ ] Pipeline scripts tested with representative test clips
- [ ] All source media preserved losslessly

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
| Codec/encoder version incompatibilities | M | H | Pin FFmpeg version in Docker, test across target decoders, fallback encoding profiles |
| Color space conversion errors (SDR<->HDR) | M | H | ACES pipeline for intermediate, zscale for high-quality conversion, visual spot-check |
| Encoding time exceeds deadline for large batches | M | M | Hardware acceleration, parallel encoding, priority queue, cloud burst capacity |
| Source media corrupt or non-standard | L | M | Input validation (ffprobe checks), error handling with dead-letter queue, graceful failure reporting |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Lossless intermediate workflow — source media never transcoded with lossy codec for intermediate steps
- EBU R128 / ATSC A/85 loudness compliance for all broadcast deliverables
- BT.709 (SDR) / BT.2020 (HDR) color space compliance verified via ffprobe
- A/V sync within 1 frame tolerance for all deliverables
- VMAF >= 85 for all streaming deliverables

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 quality issues

**Agent types the PM may add**:
- [x] Additional FFmpeg Engineer (encoding optimization, filter graph design)
- [x] Additional Color Grading Engineer (DaVinci Resolve, LUT management)
- [x] Additional Encoding Engineer (codec tuning, VMAF optimization)
- [x] Additional Subtitles/Captioning Engineer
- [x] Additional QA Engineer (A/V sync, quality metrics, loudness)
- [x] Pipeline Automation Specialist (batch processing, workflow orchestration)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] VMAF/SSIM/PSNR quality metric reports per deliverable
- [x] Loudness measurement reports (EBU R128 — integrated LUFS, true peak, LRA)
- [x] A/V sync verification logs (ffprobe pts_time comparison)
- [x] Codec compliance reports (ffprobe stream metadata per deliverable)
- [x] Color space verification (color_primaries, transfer, matrix per ffprobe)
- [x] HDR metadata report (MaxCLL, MaxFALL, mastering display — if applicable)
- [x] Subtitle validation report (timing, format compliance, character counts)
- [x] Test coverage report (pytest — HTML + lcov)
- [x] Encoding profile documentation (all profiles versioned with parameters)
- [x] CI/CD pipeline screenshot (all checks green)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Source media**: lossless preservation — NEVER re-encode source
- **Encoding versions**: version-tagged outputs (v001, v002, vFINAL) — NEVER overwrite
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
**Branch**: `team/videoProduction/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (quality reports, loudness logs)
- [x] Source code (Python scripts, encoding profiles, FFmpeg templates)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Video Production Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python + FFmpeg + DaVinci Resolve video encoding, color grading, and multi-format delivery pipelines*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
