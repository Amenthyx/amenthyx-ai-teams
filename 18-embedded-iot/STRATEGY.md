# Embedded & IoT Team — Tailored Strategy v3.1

> Pre-configured for **firmware development, embedded systems, and IoT devices**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team embeddedIoT --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]

**One-Line Vision**: [FILL IN]

**Problem Statement**: [FILL IN]

**Desired Outcome**: [FILL IN]

**Project Type**: [FILL IN — Greenfield / Extending existing codebase / Migration / Rewrite / Prototype / MVP / Production]

**Repository**: [FILL IN — GitHub URL or desired repo name]

---

## 2. Target Audience

**Primary Users**: [FILL IN — e.g., firmware engineers, IoT platform operators, field technicians]

**Secondary Users**: [FILL IN — e.g., end users of IoT devices, cloud backend team, product managers]

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [FILL IN] |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: C11/C17 / C++20 / Rust / MicroPython
- **Framework**: FreeRTOS / Zephyr RTOS / ESP-IDF / Arduino
- **Database**: SQLite (on-device persistent storage) / InfluxDB (cloud telemetry time-series)
- **Cache**: On-chip SRAM (ring buffers, lookup tables)
- **Message Queue**: MQTT (broker: Mosquitto/HiveMQ) / CoAP (constrained devices)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS IoT Core / GCP IoT / Azure IoT Hub / self-hosted MQTT broker
- **Deployment**: OTA firmware updates / JTAG flash / bootloader-based update mechanism
- **CDN**: N/A (firmware binary distribution via cloud storage)
- **Domain**: [FILL IN or "N/A"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| MQTT Broker | Device-to-cloud telemetry | TLS + client certificates | Per broker config |
| Cloud IoT Platform | Device management, OTA | X.509 certificates / SAS tokens | Per plan |
| InfluxDB / TimescaleDB | Time-series telemetry storage | API token | Per plan |
| Dashboard (Grafana) | Telemetry visualization | OAuth / API key | N/A |

**Existing Codebase**: [FILL IN — Path to existing firmware, or "greenfield"]

**Package Manager**: PlatformIO / idf.py (ESP-IDF) / west (Zephyr) / Arduino CLI

**Monorepo or Polyrepo**: Single repo (firmware/ + hardware/ + cloud/ + tools/ + docs/)

**Linting**:
- `clang-tidy` — C/C++ static analysis and style enforcement
- `cppcheck` — C/C++ static analysis (bug detection)
- MISRA C/C++ checkers — safety-critical coding standard compliance
- `clippy` — Rust linting (if Rust used)

---

## 5. Non-Functional Requirements

**Performance**:
- Boot time: < 500ms (cold boot to operational)
- ISR latency: < 10 microseconds (interrupt service routine response)
- RAM usage: < 64KB (bare metal) / < 256KB (RTOS)
- Power consumption: < 10mW in sleep mode, < 100mW active

**Security**:
- Authentication: Secure boot (verified firmware chain), X.509 device certificates
- Authorization: Encrypted OTA updates (signed firmware images), TLS for all communication
- Hardware security: Hardware root of trust (TPM / Secure Element / eFuse)
- Data protection: On-device encryption for stored credentials, secure key storage
- Compliance: [FILL IN — CE / FCC / UL / IEC 62443 / none]

**Scalability**:
- Expected launch devices: [FILL IN — number of devices]
- Expected 6-month fleet: [FILL IN]
- Expected 1-year fleet: [FILL IN]
- Scaling strategy: Cloud-managed device fleet, OTA updates at scale, device provisioning automation

**Availability**:
- Uptime target: 99.9% for cloud backend / device uptime governed by power budget
- Recovery time objective (RTO): < 30 seconds (watchdog-triggered device reboot)
- Recovery point objective (RPO): < 5 minutes (telemetry buffered on-device)
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- N/A (embedded device — no direct UI; accessibility applies to companion apps/dashboards)

**Observability**:
- Logging: Serial/UART debug logging (development), telemetry to cloud (production)
- Metrics: Power consumption monitoring, uptime tracking, memory/CPU utilization
- Tracing: Watchdog timer events, exception/fault handlers, stack trace on crash
- Alerting: Device offline alerts, OTA failure alerts, telemetry anomaly detection

---

## 6. Testing Requirements

**Test Coverage Target**: >= 80% for C/C++/Rust source code; 100% coverage for safety-critical paths

**Required Test Types**:
- [x] Unit tests — Unity (C test framework) / Google Test (C++) / cargo test (Rust)
- [x] Integration tests — Hardware-in-the-loop (HIL) testing on target hardware
- [x] Emulation tests — QEMU / Renode for CI-compatible testing without hardware
- [x] Power profiling — current measurement during sleep/active/transmit cycles
- [x] OTA update tests — firmware update, rollback, corruption recovery
- [x] Communication tests — MQTT/CoAP message delivery, TLS handshake, reconnection
- [x] Memory leak tests — Valgrind (emulated), heap analysis, stack overflow detection
- [x] Security scanning — static analysis (MISRA compliance), firmware binary analysis
- [ ] RF/EMC testing — [FILL IN if regulatory certification needed]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (clang-tidy, cppcheck, clang-format)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated build for all target platforms in CI
- [x] QEMU-based tests in CI (no hardware dependency)
- [x] Manual approval gate for OTA firmware deployment

**Testing Tools**: Unity (C), Google Test, QEMU, Renode, Valgrind, PlatformIO test, power analyzer, act

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN]

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M4 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Budget Constraints**:
- Hardware components: [FILL IN — $ for dev boards, sensors, test equipment]
- Cloud IoT services: [FILL IN — $/month]
- Certification costs: [FILL IN — $ for FCC/CE/UL if applicable]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, hardware purchases, cloud IoT services, certification fees, test equipment
- **Forbidden without user present**: Any payment over $50, any recurring subscription, any certification filing

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| Hardware dev boards / components | [FILL IN] | Card | No — ask first |
| Cloud IoT platform (AWS IoT/etc.) | [FILL IN] | Card / free tier | No — ask first |
| Certification (FCC/CE/UL) | [FILL IN] | Card | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Source code coverage >= 80%
- [ ] Zero CRITICAL/HIGH issues in static analysis (clang-tidy, cppcheck, MISRA)
- [ ] Firmware flashed and running on target hardware
- [ ] OTA firmware update verified (update + rollback)
- [ ] Power budget met (< 10mW sleep, < 100mW active)
- [ ] Boot time < 500ms verified
- [ ] ISR latency < 10 microseconds verified
- [ ] Secure boot chain verified
- [ ] MQTT/CoAP communication tested (including reconnection)
- [ ] QEMU/emulation tests passing in CI
- [ ] Hardware-in-the-loop tests passing
- [ ] Documentation complete (README, hardware setup guide, pinout docs, runbooks)
- [ ] CI/CD pipeline tested and working

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Design Inspiration**: [FILL IN]

**Technical References**: [FILL IN — e.g., FreeRTOS docs, ESP-IDF programming guide, Zephyr docs, MISRA C guidelines]

**Internal Documentation**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. [FILL IN]
2. [FILL IN]
3. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]
2. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Hardware availability (component shortages, long lead times) | M | H | Multiple supplier options, early procurement, alternate component evaluation, development on emulators |
| Power budget overrun (firmware exceeds power targets) | M | H | Continuous power profiling, sleep mode optimization, peripheral duty cycling, power-aware code reviews |
| RF interference / EMC compliance failure | M | M | Shield design, proper PCB layout, pre-compliance testing, antenna tuning |
| Certification delays (FCC/CE/UL timeline slippage) | M | H | Early pre-compliance testing, engage test lab early, parallel certification submissions |

**Hard Constraints** (non-negotiable):
- MISRA C/C++ subset where applicable (safety-critical code paths)
- No dynamic memory allocation on bare metal targets
- Conventional commits enforced on all repositories
- All changes via Pull Request with CI checks passing
- Watchdog timer required on all production firmware

**Soft Constraints** (preferred but negotiable):
- [FILL IN]
- [FILL IN]

---

## 11.1 Dynamic Agent Scaling

> The PM may spawn additional agents beyond the default roster if the workload requires it.

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 15

**Scaling triggers** (PM spawns extra agents when):
- A single firmware module has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking hardware/firmware issues requiring parallel fix agents
- The strategy explicitly requests parallel streams (e.g., multi-platform firmware)

**Agent types the PM may add**:
- [ ] Additional Firmware Engineers (for complex peripheral drivers)
- [ ] Hardware Interface Specialist (for PCB-level debugging, signal integrity)
- [ ] QA Engineer — Hardware Testing (for hardware-in-the-loop, power profiling)
- [ ] Communication Specialist (for MQTT/BLE/WiFi protocol work)
- [ ] Security Specialist (for secure boot, encryption, certificate management)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Build output showing successful compilation for target platform
- [x] Unit test results (Unity / Google Test output)
- [x] QEMU emulation test results
- [x] Static analysis reports (clang-tidy, cppcheck — zero CRITICAL/HIGH)
- [x] Power consumption measurements (sleep and active modes)
- [x] Boot time measurement logs
- [x] OTA update test results (update, rollback, corruption recovery)
- [x] MQTT/CoAP communication test logs
- [x] Hardware-in-the-loop test results (if hardware available)
- [x] Memory usage report (RAM, flash, stack usage)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, firmware binaries, test logs, measurement data, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might brick hardware, corrupt firmware, damage peripherals, cost money, affect production devices, be irreversible, or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.

**Auto-sync frequency**: Every agent completion

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `ai-team` (MANDATORY — all teams use this branch)
- Merge to main: ONLY after Team Leader receives explicit user approval (hard gate)

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (firmware, drivers, cloud connectors)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: target hardware specs, development board model, existing firmware, sensor specifications, communication protocols, power source, enclosure constraints, deployment environment, etc.]

---

*Embedded & IoT Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for firmware development, embedded systems, and IoT devices*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
