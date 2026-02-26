# Streaming & Broadcast Team — Tailored Strategy v3.1

> Pre-configured for **live streaming infrastructure, broadcast automation, multi-platform distribution, and low-latency delivery with OBS Studio, RTMP/SRT/WebRTC, NDI, and Node.js**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team streamingBroadcast --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Streaming & Broadcast Team)*

**Required Tech Stack**:
- **Language**: TypeScript 5.x (backend, overlays) / Python 3.12+ (automation) / C++ (low-level streaming)
- **Framework**: OBS Studio (scripting API — Lua/Python), Node.js (WebSocket servers, overlay backend)
- **Protocols**: RTMP, SRT (Secure Reliable Transport), HLS, DASH, WebRTC (WHIP/WHEP), NDI
- **Libraries**: obs-websocket v5, ffmpeg (live encoding), GStreamer, Janus WebRTC gateway

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS (MediaLive, CloudFront) / self-hosted (Nginx-RTMP, SRS) — team's choice
- **Deployment**: Docker (streaming servers, WebSocket backends, overlay servers)
- **CDN**: CloudFront / Fastly / Cloudflare (HLS/DASH distribution for large audiences)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD (scripts, overlays, configs) | gh CLI | N/A |
| OBS Studio | Live compositing, scene switching, encoding | obs-websocket v5 (WebSocket) | N/A |
| Twitch | RTMP ingest, EventSub (chat, follows, subs) | OAuth2 / API key (env) | API rate limits |
| YouTube Live | RTMP/DASH ingest, Data API v3 (chat) | OAuth2 / API key (env) | API rate limits |
| NDI | Local production network video transport | Network discovery | Bandwidth-bound |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pnpm (TypeScript), pip (Python)

**Monorepo or Polyrepo**: Monorepo (OBS scripts, overlays, WebSocket servers, configs)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Glass-to-glass latency: < 3 seconds for live delivery (SRT/RTMP to viewer)
- WebRTC latency: < 500ms for interactive streams
- Zero dropped frames over 30-minute continuous stream test
- Audio: -14 LUFS within 1 dB tolerance (streaming platforms)
- Overlay rendering: 60fps in OBS browser sources

**Security**:
- Authentication: Stream key management (encrypted storage, rotation), OAuth2 for platform APIs
- Authorization: OBS WebSocket password protection, admin-only controls
- Data sensitivity: [FILL IN — stream keys, platform credentials]
- Compliance: FCC broadcast regulations (if applicable), platform ToS compliance
- Encryption: RTMPS (encrypted RTMP), SRT (built-in encryption), TLS for all WebSocket connections

**Scalability**:
- Expected concurrent viewers: [FILL IN]
- Multi-platform simulcast: Twitch + YouTube + Kick + custom RTMP simultaneously
- CDN scaling: ABR (Adaptive Bitrate) ladder for large audiences

**Availability**:
- Uptime target: 99.99% during scheduled streams
- RTO: < 30 seconds (automatic stream reconnect with SRT)
- RPO: VOD recording captures entire stream
- Multi-region: CDN-based distribution (automatic via CloudFront/Fastly)

**Accessibility**:
- Closed captioning: real-time or post-stream captions recommended
- Overlay text: minimum readable font size, contrast compliance
- Color-blind safe overlay design

**Observability**:
- Logging: OBS logs, streaming server logs, WebSocket server logs
- Metrics: Dropped frames (target: 0), bitrate stability (within 10% of target), audio levels (LUFS), viewer counts
- Tracing: N/A
- Alerting: Dropped frames > 0 alert, bitrate drop > 20%, stream disconnection, audio level out of range

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (WebSocket server, overlay logic), N/A (OBS configuration — validation-based)

**Required Test Types**:
- [x] Stream stability test (30-minute continuous stream — zero dropped frames)
- [x] Audio quality verification (LUFS at -14 target with 1 dB tolerance, noise floor check)
- [x] Video quality verification (resolution, frame timing, encoding artifact check)
- [x] Overlay accuracy (pixel-accurate at 1080p and 4K, animation 60fps, WebSocket data binding)
- [x] Latency measurement (glass-to-glass via timecode burn-in and camera capture)
- [x] Cross-platform verification (stream receives on Twitch/YouTube/Kick simultaneously)
- [x] Failover testing (stream reconnect on network interruption, backup encoder switch)
- [x] Unit tests (Vitest — WebSocket server, overlay components, event processing)
- [x] OBS scene collection validation (all sources present, no missing assets)
- [ ] Load testing (optional — viewer concurrency simulation for custom infrastructure)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (ESLint/Prettier for TypeScript, ruff for Python, JSON validation)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated overlay rendering test (headless browser screenshot comparison)
- [ ] Automated stream connectivity test (RTMP ingest ping)

**Testing Tools**: Vitest, ffprobe (stream analysis), OBS logs, custom stream health monitoring scripts, Playwright (overlay rendering)

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
- Infrastructure: [FILL IN: $/month or "local OBS only"]
- Streaming services: [FILL IN: Twitch/YouTube free, Restream ~$16-49/mo]
- Hardware: [FILL IN: capture cards, StreamDeck, etc.]

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
| Restream (simulcast) | ~$16-49/mo | Card | No — ask first |
| AWS MediaLive (if used) | Variable | Card | No — ask first |
| StreamElements/StreamLabs | Free / premium variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 streaming features implemented and tested
- [ ] >= 80% test coverage on WebSocket server and overlay logic
- [ ] Zero dropped frames over 30-minute continuous stream test
- [ ] Audio at -14 LUFS within 1 dB tolerance
- [ ] Glass-to-glass latency < 3 seconds verified
- [ ] Overlays pixel-accurate at 1080p and 4K
- [ ] Multi-platform delivery verified (Twitch + YouTube minimum)
- [ ] Failover tested — automatic reconnect within 30 seconds
- [ ] OBS scene collection packaged and documented
- [ ] Production runbook complete (pre-show checklist, go-live sequence, emergency procedures)
- [ ] Stream keys securely stored (not in plaintext, not in Git)

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
| Network instability causing dropped frames | M | H | SRT with FEC/ARQ, automatic bitrate adaptation, backup ISP/cellular failover |
| Platform ingest server issues (Twitch/YouTube downtime) | L | H | Multi-platform delivery, backup ingest endpoints, automatic failover |
| OBS crash during live stream | L | H | OBS auto-restart script, backup encoder (hardware or secondary PC), recording as backup |
| Stream key leak | L | H | Encrypted key storage, no keys in Git/logs, key rotation schedule, platform 2FA |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Zero dropped frames tolerance during live production (30-minute stability test minimum)
- Glass-to-glass latency < 3 seconds for live delivery
- Audio -14 LUFS within 1 dB tolerance for streaming platforms
- Stream keys NEVER in plaintext, NEVER in Git, NEVER in logs
- 99.99% uptime target during scheduled stream windows

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 stream quality issues

**Agent types the PM may add**:
- [x] Additional OBS/Streaming Engineer (automation, scene management)
- [x] Additional Graphics Overlay Engineer (HTML/CSS/JS browser sources)
- [x] Additional Real-Time Data Engineer (WebSocket, chat integration)
- [x] Additional Multi-Platform Engineer (simulcast, platform APIs)
- [x] Additional QA Engineer (stream stability, latency, cross-platform)
- [x] Network/Protocol Specialist (SRT tuning, NDI optimization)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Stream stability report (30-minute test — zero dropped frames, bitrate graph)
- [x] Audio level report (LUFS measurement — -14 LUFS target within 1 dB)
- [x] Latency measurement (glass-to-glass timecode evidence)
- [x] Overlay rendering screenshots (1080p and 4K — pixel-accurate positioning)
- [x] Cross-platform delivery proof (stream active on Twitch + YouTube simultaneously)
- [x] Failover test results (network interruption recovery within 30 seconds)
- [x] OBS scene collection documentation (all scenes, sources, settings)
- [x] Test coverage report (Vitest — HTML + lcov)
- [x] Production runbook (pre-show, live, post-show procedures)
- [x] CI/CD pipeline screenshot (all checks green)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **OBS scene collections**: versioned exports — NEVER overwrite
- **Stream recordings**: VOD archived — NEVER delete without archiving
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
- [x] `.team/evidence/` proof artifacts (stream health reports, latency measurements)
- [x] Source code (OBS scripts, overlay HTML/CSS/JS, WebSocket servers)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Streaming & Broadcast Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for OBS Studio + RTMP/SRT/WebRTC + NDI + Node.js live streaming and broadcast automation*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
