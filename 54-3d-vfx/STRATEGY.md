# 3D / VFX Team — Tailored Strategy v3.1

> Pre-configured for **3D modeling automation, procedural generation, VFX compositing, and render pipeline management with Blender (bpy), Houdini, Nuke, USD, and OpenEXR**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team 3dVfx --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for 3D / VFX Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+ (Blender bpy, Houdini HScript/VEX, Nuke Python API)
- **DCC Tools**: Blender 4.x (Cycles/EEVEE), Houdini 20.x (Karma), Nuke (compositing)
- **Libraries**: bpy, hou, OpenEXR, Alembic, USD (Universal Scene Description), OpenColorIO (OCIO)
- **Formats**: USD/USDA/USDC/USDZ, Alembic (.abc), glTF 2.0, FBX, EXR, DPX
- **Color Management**: ACES (ACEScg working space), OpenColorIO, EXR linear workflow

**Hosting/Infrastructure**:
- **Render Farm**: Flamenco (Blender) / Deadline (multi-DCC) / custom Kubernetes workers
- **Cloud Provider**: AWS (GPU instances for rendering) / local GPU farm — team's choice
- **Storage**: NAS / S3 for assets, Git LFS / Perforce for binary version control
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD (scripts, pipeline tools) | gh CLI | N/A |
| Blender 4.x | 3D modeling, rendering, compositing | Local install | GPU-bound |
| Houdini 20.x | Procedural generation, FX, simulation | License server | License-bound |
| Nuke | Compositing, deep compositing, color | License server | License-bound |
| Flamenco / Deadline | Render farm job management | Local network | Farm capacity |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: pip (Python tools), Git LFS (binary assets)

**Monorepo or Polyrepo**: Monorepo (pipeline scripts, USD schemas, render configs) + binary asset store

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Render time per frame: within project-specific budget (documented per shot)
- Polygon budget: per-asset class limits (hero assets, background, props — documented)
- Texture resolution: 4K max for hero, 2K for secondary, 1K for background (configurable)
- GPU VRAM: scene must fit within single GPU memory (track per-scene memory usage)

**Security**:
- Authentication: N/A (local tooling) or render farm auth (network-level)
- Authorization: N/A
- Data sensitivity: [FILL IN — client assets, pre-release VFX shots]
- Compliance: N/A (unless client-specific NDA requirements)
- Encryption: Encrypted storage for pre-release assets if applicable

**Scalability**:
- Expected asset count: [FILL IN]
- Expected shot count: [FILL IN]
- Render farm capacity: [FILL IN — GPU count, node count]
- Scaling strategy: Render farm auto-scaling (Kubernetes HPA for cloud, job priority queues for local)

**Availability**:
- Uptime target: N/A (batch rendering)
- RTO: N/A
- RPO: Scene files versioned (Git LFS), render outputs reproducible from scene + settings
- Multi-region: N/A

**Accessibility**:
- N/A (3D production pipeline)
- glTF exports: alt-text metadata for web viewers where applicable

**Observability**:
- Logging: Render logs per frame (Blender --debug, Houdini render log), pipeline script logs
- Metrics: Render time per frame, polygon counts per asset, texture memory usage, farm utilization
- Tracing: N/A
- Alerting: Render failure alerts (frame errors, out-of-memory, license unavailable)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% (Python pipeline scripts), N/A (DCC tool operations — validation-based)

**Required Test Types**:
- [x] Mesh validation (polygon count within budget, no non-manifold geometry, no flipped normals, no UV overlaps)
- [x] Rig validation (full range-of-motion test, no mesh penetration, IK/FK switching)
- [x] Render validation (all frames render without errors, noise below threshold, no fireflies)
- [x] Color pipeline validation (ACES/OCIO config correct, output color space matches target)
- [x] Format validation (glTF via gltf-validator, USD via usdchecker, EXR metadata correct)
- [x] Naming convention enforcement (asset_variant_LOD_version pattern)
- [x] Unit tests (pytest — Python pipeline scripts, asset processing logic)
- [x] Frame sequence completeness check (no gaps in rendered frame sequences)
- [ ] Visual comparison test (optional — render vs reference plate comparison)
- [ ] Simulation validation (optional — physics accuracy verification)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push — script linting, USD/glTF validation)
- [x] Pre-commit hooks (Python linting with ruff, JSON/USD schema validation)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated render test (short test scene renders via Blender CLI in CI)
- [ ] Automated asset validation on push (polygon count, UV check)

**Testing Tools**: pytest, Blender CLI (--background --python), gltf-validator, usdchecker, OpenEXR tools, custom mesh validation scripts

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
- Infrastructure: [FILL IN: $/month or "local render farm"]
- Cloud GPU (if applicable): [FILL IN: $/hour]
- Software licenses: [FILL IN: Houdini Indie $269/yr, Nuke Non-commercial free, etc.]

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
| Houdini Indie | $269/yr | Card | No — ask first |
| AWS GPU instances (p3/g4) | Variable | Card | No — ask first |
| Substance Painter/Designer | ~$20/mo | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 assets modeled, rigged, textured, lit, and rendered
- [ ] >= 80% test coverage on Python pipeline scripts
- [ ] All meshes pass polygon budget and topology validation
- [ ] All renders complete without errors (zero failed frames)
- [ ] Color pipeline verified (ACES/OCIO — output matches target color space)
- [ ] All format exports validated (glTF via gltf-validator, USD via usdchecker)
- [ ] Naming conventions enforced across all assets
- [ ] Render farm pipeline tested and documented
- [ ] Multi-format delivery complete (glTF for web, USD for pipeline, Alembic for animation, EXR for compositing)
- [ ] Pipeline documentation complete (setup guide, asset submission guide, render submission guide)

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
| Render farm capacity exceeded during deadline crunch | M | H | Cloud burst capacity (AWS spot instances), job priority queue, render time budgets |
| USD/Alembic interop issues between DCC tools | M | M | Standardize USD schema, test roundtrip early, use OpenUSD reference implementation |
| Out-of-memory on complex scenes | M | H | Per-scene memory budgets, LOD strategy, render layer splitting, instancing |
| License server unavailability (Houdini/Nuke) | L | H | Backup license allocation, Blender as fallback for non-specialized tasks |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- OpenEXR for all HDR renders and compositing intermediates
- Alembic or USD for scene interchange between DCC tools
- ACES color management pipeline (ACEScg working space)
- Render farm compatible — all renders must work via CLI (no GUI dependencies)
- Git LFS for binary asset version control

**Soft Constraints** (preferred but negotiable):
- [FILL IN if any]

---

## 11.1 Dynamic Agent Scaling *(pre-configured)*

**Allow PM to spawn extra agents?**: Yes, with TL approval
**Max concurrent agents**: 15

**Scaling triggers**:
- Feature complexity XL and splittable
- Wave falling behind timeline
- QA finds >= 5 asset quality issues

**Agent types the PM may add**:
- [x] Additional Modeling Engineer (hard surface, organic, procedural)
- [x] Additional Rigging/Animation Engineer
- [x] Additional Lighting/Render Engineer
- [x] Additional Compositing/VFX Engineer (Nuke, Blender Compositor)
- [x] Additional QA Engineer (mesh validation, render quality)
- [x] Render Farm Specialist (Flamenco/Deadline, GPU scaling)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Mesh validation reports (polygon counts, topology checks, UV coverage)
- [x] Rig validation reports (range-of-motion test results)
- [x] Render completion logs (all frames, zero errors)
- [x] Color pipeline verification (ACES/OCIO config, output color space proof)
- [x] Format validation reports (gltf-validator, usdchecker output)
- [x] Render time and memory usage reports per shot/asset
- [x] Test coverage report (pytest — HTML + lcov)
- [x] Asset inventory with polygon counts, texture sizes, render times
- [x] Architecture diagram (pipeline flow, DCC tool chain, render farm topology)
- [x] CI/CD pipeline screenshot (all checks green)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Scene files**: versioned (v001, v002, ..., vFINAL) — NEVER overwrite
- **Render outputs**: archived by version — NEVER delete renders
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
- [x] `.team/evidence/` proof artifacts (validation reports, render logs)
- [x] Source code (Python pipeline scripts, USD schemas, render configs)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*3D / VFX Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python + Blender (bpy) + Houdini + Nuke + USD + ACES 3D production pipeline*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
