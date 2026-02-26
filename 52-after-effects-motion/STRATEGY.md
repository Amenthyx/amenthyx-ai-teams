# After Effects Motion Graphics Team — Tailored Strategy v3.1

> Pre-configured for **motion graphics templates (MOGRTs), expressions, Lottie export, automated rendering pipelines with ExtendScript, Bodymovin, and GSAP**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team afterEffectsMotion --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for After Effects Motion Team)*

**Required Tech Stack**:
- **Language**: ExtendScript (ES3-based `.jsx`) / JavaScript (CEP panels) / TypeScript (UXP panels)
- **Framework**: After Effects scripting API, Bodymovin/Lottie, Essential Graphics panel
- **Libraries**: AE Expressions library, GreenSock (GSAP) for web export, lottie-web
- **Tools**: After Effects 2024+, Adobe Media Encoder, Premiere Pro (interchange), aerender CLI

**Hosting/Infrastructure**:
- **Render Infrastructure**: Local aerender / render farm (Deadline or custom) — team's choice
- **Asset Storage**: Cloud storage (S3 / Google Drive / Dropbox) for project files and deliverables
- **CDN**: [FILL IN if Lottie web delivery needed — CloudFront / Vercel Edge]
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD (scripts and templates) | gh CLI | N/A |
| After Effects | Motion graphics authoring | Local license | N/A |
| aerender CLI | Command-line rendering + batch automation | Local install | CPU/GPU-bound |
| Adobe Media Encoder | Multi-format output encoding | Local license | CPU-bound |
| Bodymovin plugin | Lottie JSON export | AE plugin | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: N/A (ExtendScript), npm (web Lottie projects)

**Monorepo or Polyrepo**: Monorepo (scripts, templates, and Lottie exports in one repo)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- aerender render time: < 30 seconds per frame for standard compositions
- Lottie JSON file size: < 150KB per animation (optimized)
- Lottie web playback: 60fps on modern browsers
- Expression evaluation: no per-frame `eval()` or excessive `valueAtTime()` lookbacks

**Security**:
- Authentication: N/A (local tooling)
- Authorization: N/A
- Data sensitivity: [FILL IN — brand assets, client materials]
- Compliance: Font licensing verified for all deliverables, stock footage rights cleared
- Encryption: N/A (local workflow) — encrypted storage for client assets if applicable

**Scalability**:
- Expected deliverable count: [FILL IN]
- Render farm capacity: [FILL IN — local only / render farm nodes]
- Template reuse: Essential Graphics panel bindings for non-technical editors

**Availability**:
- Uptime target: N/A (local tooling)
- RTO: N/A
- RPO: Project file versioning (incremental saves v001/v002)
- Multi-region: N/A

**Accessibility**:
- Lottie exports: `aria-label` on container elements, `prefers-reduced-motion` support
- Web animations: reduced motion alternative provided
- Color contrast: text elements in motion graphics meet 4.5:1 contrast

**Observability**:
- Logging: aerender render logs, expression error logs
- Metrics: Render time per frame, file sizes per deliverable, Lottie schema validation results
- Tracing: N/A
- Alerting: Render failure alerts (frame errors, missing assets, expression errors)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: N/A (creative tooling — validation-focused testing)

**Required Test Types**:
- [x] Render validation (aerender — all frames render without errors, zero expression errors)
- [x] Frame rate verification (ffprobe — output matches target: 23.976/24/25/29.97/30fps)
- [x] Codec compliance (ProRes 4444 for broadcast, H.264 main profile for web, H.265 for high-efficiency)
- [x] Lottie schema validation (bodymovin JSON passes lottie-web schema, unsupported features flagged)
- [x] Lottie file size audit (< 150KB target, flagged if exceeded)
- [x] Alpha channel integrity (premultiplied vs straight alpha correct for target platform)
- [x] Audio sync verification (audio peaks align with visual beats within 1-frame tolerance)
- [x] Font licensing verification (all fonts cleared for delivery format)
- [x] AE version compatibility test (project opens cleanly in target AE version)
- [ ] Visual comparison test (optional — render vs approved storyboard frame comparison)

**CI/CD Requirements**:
- [x] GitHub Actions (script linting, Lottie schema validation, file size checks)
- [x] Pre-commit hooks (ExtendScript linting, JSON validation for Lottie files)
- [x] Branch protection (require PR reviews for script changes)
- [ ] Automated aerender batch rendering on push (if render farm available)
- [ ] Automated Lottie preview deployment

**Testing Tools**: aerender CLI, ffprobe, lottie-web (schema validation), Bodymovin, custom render validation scripts

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
- Software licenses: [FILL IN: Adobe CC subscription, plugin licenses]
- Render farm: [FILL IN: $/hour or "local only"]

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
| Adobe Creative Cloud | ~$55-80/mo | Card | No — ask first |
| Render farm (if cloud) | Variable | Card | No — ask first |
| Stock footage/music | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 compositions rendered without errors
- [ ] All deliverables meet frame rate and codec specifications
- [ ] Lottie exports pass schema validation and file size budget
- [ ] Alpha channels clean on all transparent deliverables
- [ ] Font licensing verified for all delivery formats
- [ ] Multi-format delivery complete (broadcast, web, social, Lottie as applicable)
- [ ] Project files organized with naming conventions
- [ ] Essential Graphics bindings working for template deliverables
- [ ] All scripts tested and documented
- [ ] Render logs archived

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
| Expression errors only discovered at render time | M | H | Expression validation scripts, test renders before final batch, defensive expression coding |
| Lottie unsupported features in export | H | M | Bodymovin supported features matrix, pre-export audit, alternative implementation for unsupported features |
| Render farm failures mid-batch | L | H | Checkpoint rendering, render log monitoring, automatic retry for failed frames |
| Font licensing issues discovered late | M | H | Font audit at project start, licensing database, fallback font plan |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- All compositions must render via aerender with zero errors
- Lottie exports must pass schema validation
- Frame-accurate timing — no frame rate mismatches between comp settings and output
- All scripts wrapped in `app.beginUndoGroup()` / `app.endUndoGroup()`

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 render quality issues

**Agent types the PM may add**:
- [x] Additional ExtendScript Engineer
- [x] Additional Expressions Engineer
- [x] Additional Typography/Title Engineer
- [x] Additional Compositing Engineer
- [x] Additional QA Engineer (render validation, Lottie testing)
- [x] Render Pipeline Specialist (farm setup, batch automation)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Render completion logs (aerender output — zero errors, all frames complete)
- [x] Frame rate verification (ffprobe output confirming target fps)
- [x] Codec compliance report (ffprobe — codec, profile, level match delivery spec)
- [x] Lottie schema validation report (pass/fail + unsupported features list)
- [x] Lottie file size report (each export under budget)
- [x] Alpha channel verification (sample frames with transparency checked)
- [x] Font licensing audit (all fonts documented with license type)
- [x] Composition architecture diagram (precomp hierarchy map)
- [x] Multi-format delivery manifest (all formats listed with specs)
- [x] CI/CD pipeline screenshot (all checks green)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Project files**: incremental versioning (v001, v002, ..., vFINAL) — NEVER overwrite
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Render outputs**: archived by version — NEVER delete renders without archiving

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
- [x] `.team/evidence/` proof artifacts (render logs, validation reports)
- [x] ExtendScript/Expression source code
- [x] Lottie JSON exports
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*After Effects Motion Graphics Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for ExtendScript/CEP/UXP + Bodymovin/Lottie + aerender + Essential Graphics motion graphics development*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
