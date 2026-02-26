# Audio Engineering Team — Tailored Strategy v3.1

> Pre-configured for **audio processing pipelines, mixing/mastering automation, spatial audio (Dolby Atmos, Ambisonics), loudness normalization, and podcast production with Python, JUCE, REAPER, and FFmpeg**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team audioEngineering --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Audio Engineering Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+ / C++ 17
- **Framework**: JUCE (C++ audio framework), REAPER (ReaScript — Lua/Python/EEL2), Audacity scripting
- **Libraries**: librosa (audio analysis), soundfile (I/O), pedalboard (Spotify — effects), pydub (manipulation), pyloudnorm (EBU R128)
- **Standards**: EBU R128 (loudness -23 LUFS), ITU-R BS.1770 (measurement), ATSC A/85 (US broadcast), AES standards
- **Codecs**: AAC (libfdk_aac), Opus, FLAC, MP3 (LAME), WAV/AIFF (PCM), ALAC

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP (if cloud processing) / local workstation — team's choice
- **Deployment**: Docker (FFmpeg + Python audio stack) / local DAW workstation
- **Storage**: NAS / S3 for audio assets, lossless originals preserved
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD (scripts, presets, templates) | gh CLI | N/A |
| FFmpeg | Audio encoding, format conversion, loudness normalization | Local install | CPU-bound |
| REAPER | DAW automation, ReaScript, batch rendering | Local license | N/A |
| librosa | Audio feature extraction, spectral analysis | pip package | N/A |
| pyloudnorm | EBU R128 loudness measurement | pip package | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pip (Python), vcpkg / CMake (C++ JUCE projects)

**Monorepo or Polyrepo**: Monorepo (processing scripts, DAW templates, encoding presets)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Audio processing: sample-accurate (no sample drift between channels)
- Batch encoding: >= 10x realtime for standard format conversion
- Loudness normalization: EBU R128 compliance within 0.5 LU tolerance
- Spatial audio rendering: binaural decode in realtime for monitoring

**Security**:
- Authentication: N/A (local tooling) or cloud IAM for remote processing
- Authorization: N/A
- Data sensitivity: [FILL IN — unreleased music, client audio, podcast pre-release]
- Compliance: EBU R128 (EU broadcast), ATSC A/85 (US broadcast), platform-specific loudness (Spotify -14 LUFS, Apple -16 LUFS)
- Encryption: Encrypted storage for pre-release audio if applicable

**Scalability**:
- Expected audio volume: [FILL IN — hours per week/month]
- Batch processing: parallel job execution with Celery / GNU parallel
- DAW sessions: template-based for consistent output

**Availability**:
- Uptime target: N/A (batch processing)
- RTO: N/A
- RPO: Lossless source audio preserved — all outputs reproducible from source + settings
- Multi-region: N/A

**Accessibility**:
- Podcast deliverables: transcript generation recommended
- Audio descriptions for video content where required
- Closed caption sync when audio paired with video

**Observability**:
- Logging: FFmpeg encoding logs, REAPER render logs, Python processing logs
- Metrics: LUFS measurements per deliverable, true peak levels, sample rate verification, encoding time
- Tracing: N/A
- Alerting: Loudness non-compliance, clipping detection (0 dBFS), codec encoding failures

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (Python processing scripts), >= 70% (C++ JUCE components)

**Required Test Types**:
- [x] Loudness compliance (integrated LUFS within target per platform, true peak below -1 dBTP)
- [x] Clipping detection (zero samples at 0 dBFS, inter-sample peak detection)
- [x] Sample rate validation (correct rate per delivery spec, SRC quality — no aliasing)
- [x] Codec quality validation (ABX-ready comparisons for lossy codecs, metadata preservation)
- [x] Spatial audio validation (binaural rendering accuracy, Atmos object positions, AmbiX channel order)
- [x] Format compliance (WAV/AIFF header, ID3v2 tags, MP4 metadata, FLAC tags)
- [x] Silence/noise analysis (no unintended gaps, noise floor < -60 dBFS, no DC offset)
- [x] Unit tests (pytest for Python, Catch2/GoogleTest for C++ JUCE)
- [x] Dithering verification (proper noise shaping applied for bit depth reduction)
- [ ] A/B listening test (optional — perceptual quality verification)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (Python linting with ruff, C++ linting with clang-tidy, audio file validation)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated loudness measurement in CI (short test clip)
- [ ] Automated codec quality test in CI

**Testing Tools**: pytest, pyloudnorm, ffmpeg (ebur128 filter), ffprobe, librosa, SoX (statistics), Catch2 (C++), custom audio validation scripts

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
- Software licenses: [FILL IN: REAPER $60, plugins, etc.]
- Cloud processing: [FILL IN: $/hour or "local only"]

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
| REAPER license | $60 one-time | Card | No — ask first |
| iZotope / FabFilter plugins | Variable | Card | No — ask first |
| DistroKid (distribution) | ~$20/yr | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 audio processing pipelines implemented and tested
- [ ] >= 80% test coverage on Python processing scripts
- [ ] Loudness compliance verified per platform (EBU R128 / ATSC A/85 / Spotify / Apple)
- [ ] Zero clipping in any deliverable (true peak < -1 dBTP)
- [ ] Sample rate correct for all deliverables (48kHz video, 44.1kHz music, per spec)
- [ ] Spatial audio validated (binaural rendering, Atmos objects, AmbiX channel order)
- [ ] All codecs verified (AAC, Opus, FLAC, MP3 — per delivery spec)
- [ ] Lossless audio chain preserved (WAV/FLAC intermediates, no unnecessary lossy encoding)
- [ ] DAW templates documented and tested
- [ ] Processing pipeline scripts documented and versioned
- [ ] All source audio preserved losslessly

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
| Loudness target varies across platforms | H | M | Platform-specific encoding presets, automated LUFS measurement per deliverable |
| Sample rate conversion artifacts | M | H | Use high-quality SRC (SoX best quality / librosa), A/B comparison before delivery |
| Spatial audio playback inconsistencies across devices | M | M | Test on multiple devices (headphones, speakers, soundbar), binaural fallback |
| Plugin/DAW version incompatibilities | M | M | Pin DAW/plugin versions, session recall sheets, compatibility matrix |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Sample-accurate processing — no sample drift in any operation
- EBU R128 loudness compliance for all broadcast deliverables
- Lossless audio chain — WAV/FLAC for all intermediates, no unnecessary lossy conversion
- True peak < -1 dBTP for streaming, < -2 dBTP for broadcast
- Source audio preserved losslessly — never modify original source files

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 loudness or quality issues

**Agent types the PM may add**:
- [x] Additional Sound Design Engineer
- [x] Additional Mixing/Mastering Engineer
- [x] Additional Spatial Audio Engineer (Dolby Atmos, Ambisonics)
- [x] Additional Music Production Engineer (MIDI, virtual instruments)
- [x] Additional QA Engineer (loudness compliance, codec quality)
- [x] C++ Audio Developer (JUCE plugin development)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Loudness measurement reports (integrated LUFS, true peak, LRA per deliverable)
- [x] Clipping detection report (zero samples at 0 dBFS across all deliverables)
- [x] Sample rate verification logs (correct rate per delivery spec)
- [x] Codec quality reports (encoder parameters, metadata verification)
- [x] Spatial audio validation report (Atmos object positions, binaural rendering, AmbiX order)
- [x] Format compliance report (header verification, tag completeness)
- [x] Test coverage report (pytest — HTML + lcov)
- [x] Signal flow diagram (recording -> editing -> mixing -> mastering -> encoding -> delivery)
- [x] Platform delivery matrix (format + LUFS target + codec per platform)
- [x] CI/CD pipeline screenshot (all checks green)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Source audio**: lossless preservation — NEVER modify originals
- **Session files**: versioned (v001, v002, ..., vFINAL) with recall sheets — NEVER overwrite
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
- [x] `.team/evidence/` proof artifacts (loudness reports, quality logs)
- [x] Source code (Python scripts, JUCE projects, DAW templates, encoding presets)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Audio Engineering Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python + JUCE + REAPER + FFmpeg audio processing, EBU R128 compliance, and spatial audio production*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
