# Edge Computing Team — Tailored Strategy v3.1

> Pre-configured for **edge inference, WASM modules, constrained devices, and OTA updates with Rust, TinyML, WASM, and Embassy**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team edgeComputing --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Edge Computing Team)*

**Required Tech Stack**:
- **Language**: Rust 1.75+ (WASM modules, edge services, Embassy firmware), C 17 (bare-metal MCU), Python 3.12+ (TinyML training, scripting)
- **Framework**: TensorFlow Lite Micro (MCU inference), WASM runtimes (wasmtime / wasmer / WasmEdge), Embassy (async Rust embedded)
- **Libraries**: edge-impulse (TinyML pipeline), Apache TVM (model compiler), ONNX Runtime (edge inference)
- **Database**: SQLite (on-device) / LevelDB (key-value edge store)
- **Deployment**: Docker (edge servers) / K3s (lightweight Kubernetes) / Balena (fleet management)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS IoT / Azure IoT / GCP IoT — team's choice
- **Deployment**: K3s (edge clusters), Balena (device fleet), OCI registries (WASM distribution)
- **Edge Hardware**: ARM Cortex-M (MCU), ARM Cortex-A (SBC), x86_64 (edge servers)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| SQLite / LevelDB | On-device storage | Local file | N/A |
| MQTT Broker (Mosquitto) | Device communication | Username/password or mTLS | N/A |
| K3s / Balena | Edge orchestration / fleet | kubeconfig / API key (env) | N/A |
| AWS IoT / Azure IoT | Cloud connectivity | X.509 certs / connection string | Per plan |
| OCI Registry | WASM module distribution | Token (env) | Per plan |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: Cargo (Rust) / pip + poetry (Python) / apt (system deps)

**Monorepo or Polyrepo**: Monorepo (firmware, WASM modules, edge services, TinyML pipeline co-located)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- MCU inference latency: < 10ms per inference on target hardware
- WASM cold start: < 5ms module instantiation
- WASM inference: < 2ms per sample
- End-to-end pipeline (sensor-to-action): < 50ms
- Gateway round-trip to cloud: < 100ms

**Security**:
- Authentication: mTLS for device-to-gateway, X.509 certificates for cloud
- Authorization: Device identity attestation, secure boot chain
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 for network, AES-256 for stored data, firmware signing for OTA
- WASM sandboxing: strict memory limits, CPU time caps, filesystem restrictions

**Scalability**:
- Fleet size: [FILL IN: number of edge devices]
- Scaling strategy: K3s for edge clusters, Balena for device fleet, canary rollouts
- Expected launch devices: [FILL IN]
- Expected 6-month devices: [FILL IN]
- Expected 1-year devices: [FILL IN]

**Availability**:
- Device uptime: 99.9% during operational hours
- Offline operation: 24h+ full functionality without connectivity
- RTO: 5 minutes (watchdog restart)
- RPO: N/A (offline-first, store-and-forward)
- Multi-site: [FILL IN: yes / no / future]

**Accessibility**:
- Fleet management dashboard accessible via web UI
- Device diagnostics via serial/SSH
- OTA update status visible in fleet dashboard

**Observability**:
- Logging: Structured logs (tracing crate for Rust, structlog for Python), local log rotation on device
- Metrics: Prometheus (edge server), custom lightweight metrics (MCU — UART/serial)
- Tracing: OpenTelemetry for edge-to-cloud request tracing
- Alerting: Fleet health monitoring (device heartbeat, resource usage, OTA status)

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (Rust/C edge code), >= 75% (Python TinyML scripts)

**Required Test Types**:
- [x] Unit tests (cargo test for Rust, pytest for Python, Unity/CTest for C)
- [x] Model accuracy tests (quantized vs full-precision, accuracy delta < 2%)
- [x] Latency benchmark tests (inference time on target hardware)
- [x] Power consumption tests (current draw during inference, idle, duty cycle)
- [x] Memory footprint tests (flash usage, peak RAM, heap fragmentation)
- [x] Offline capability tests (24h+ operation without connectivity)
- [x] Connectivity resilience tests (intermittent network, bandwidth throttling)
- [x] WASM sandboxing tests (resource limit enforcement, no sandbox escapes)
- [ ] Federated learning convergence tests (optional — if applicable)
- [ ] Long-duration endurance tests (optional — 7d+ continuous operation)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (clippy + rustfmt for Rust, black + ruff for Python, clang-format for C)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Cross-compilation CI (ARM targets, WASM targets)
- [ ] Hardware-in-the-loop tests on PR (when hardware available)
- [ ] Automated resource budget validation on PR

**Testing Tools**: cargo test, pytest, CTest, wasmtime test harness, INA219 power analyzer, custom memory profiler

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
| AWS IoT / Azure IoT | Variable | Card | No — ask first |
| Balena Fleet | Free / ~$99/mo | Card | No — ask first |
| Hardware (dev boards) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% Rust/C test coverage, >= 75% Python coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] All models/modules within flash, RAM, and power budgets on target hardware
- [ ] Quantized model accuracy within delta threshold (< 2%)
- [ ] Inference latency within target on all hardware (< 10ms MCU, < 2ms WASM)
- [ ] Offline operation verified for 24h+
- [ ] OTA update path tested and rollback verified
- [ ] Documentation complete (README, hardware setup guide, fleet management guide)
- [ ] CI/CD pipeline tested and working (including cross-compilation)
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
| Model accuracy loss exceeding threshold after quantization | M | H | Mixed precision quantization, quantization-aware training, multiple calibration datasets |
| OTA update failure bricking devices | M | H | A/B partition scheme, automatic rollback on boot failure, staged canary rollouts |
| Power budget exceeded shortening battery life | M | H | Duty cycling, wake-on-event, power profiling per firmware change |
| Hardware supply chain delays for target MCU/SBC | M | M | Multiple hardware targets, abstraction layers, development on simulators/emulators |
| Memory fragmentation causing crashes in long-running firmware | L | H | Static allocation where possible, heap monitoring, fragmentation-resistant allocators |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Memory budgets (KB-level): every firmware build must fit within flash and RAM budget
- Power consumption limits: 24h average power must stay within battery budget
- Offline-first operation: all core functionality must work without network for 24h+
- Firmware signing: all OTA updates must be cryptographically signed

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
- [x] Additional TinyML Engineer (model quantization, MCU inference)
- [x] Additional Rust/WASM Engineer (edge modules, WASI interfaces)
- [x] Additional Firmware Engineer (Embassy, bare-metal C, device drivers)
- [x] Additional Gateway Engineer (MQTT, K3s, fleet management)
- [x] DevOps Specialist (cross-compilation CI, OTA infrastructure)
- [x] Hardware Specialist (power profiling, PCB design, sensor integration)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (cargo tarpaulin for Rust, pytest-cov for Python, gcov for C)
- [x] Model accuracy report (quantized vs FP32 comparison, accuracy delta)
- [x] Inference latency benchmarks (per-model, per-hardware timing)
- [x] Power consumption measurements (inference draw, idle draw, 24h duty cycle)
- [x] Memory footprint report (flash layout, peak RAM, heap fragmentation analysis)
- [x] Offline operation test logs (24h+ disconnected operation verified)
- [x] OTA update test results (successful update + rollback verification)
- [x] WASM binary size report (per-module size, optimization applied)
- [x] CI/CD pipeline screenshot (all checks green, cross-compilation targets)
- [x] Architecture diagram (device topology, data flow, connectivity, fleet management)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Firmware binaries**: ALL release binaries archived with build metadata
- **Power measurements**: ALL power profiling data retained for trend analysis

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/edgeComputing/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (model accuracy, latency, power, memory)
- [x] Source code changes (Rust modules, C firmware, Python TinyML scripts)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Edge Computing Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Rust + C + Python + TinyML + WASM + Embassy + K3s edge computing*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
