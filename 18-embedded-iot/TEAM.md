# Embedded IoT Team
# Activation: `--team embeddedIoT`
# Focus: Embedded systems, firmware development, IoT devices, and real-time operating systems
# Version: v3.0 -- Enhanced Execution Protocol

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Quality Gates](#7-quality-gates)
8. [`.team/` Directory Layout](#8-team-directory-layout)
9. [Reporting System](#9-reporting-system)
10. [Error Handling & Session Management](#10-error-handling--session-management)
11. [Evidence & Proof Protocol](#11-evidence--proof-protocol)
12. [Local Install & Test Protocol](#12-local-install--test-protocol)
13. [Atomic Commit Protocol](#13-atomic-commit-protocol)
14. [Comprehensive Testing Matrix](#14-comprehensive-testing-matrix)
15. [GitHub Actions -- Local Testing](#15-github-actions----local-testing)
16. [PM Kanban -- Real-Time Tracking](#16-pm-kanban----real-time-tracking)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team embeddedIoT --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read shared/ENHANCED_EXECUTION_PROTOCOL.md for shared protocol details
3. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
4. Create `.team/` directory structure (see Section 8)
5. Spawn Team Leader agent (foreground -- this is the orchestrator)
6. Team Leader spawns PM agent (foreground -- must complete before others)
7. PM produces Hardware/Firmware Project Charter + System Requirements + creates GitHub Project
8. Team Leader reviews PM output, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's target hardware, communication protocols, power budget, memory constraints, and real-time requirements.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates hardware/software integration decisions, enforces quality gates, manages `.team/` state, resolves hardware-software interface conflicts.
- **Persona**: "You are the Team Leader of a 10-person embedded IoT team. You coordinate firmware development, hardware abstraction, RTOS configuration, IoT cloud integration, and communication protocol stacks. You resolve resource constraints (RAM, flash, CPU cycles), manage power budgets, and ensure real-time deadlines are met. You never write firmware directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Embedded project planning, tracking, reporting, GitHub Project management.
- **Responsibilities**: Creates project charter with hardware BOM, firmware milestones, testing schedules. Uses `gh` CLI for issue tracking. Generates PPTX + PDF reports.
- **Persona**: "You are the Embedded PM. You plan and track firmware development cycles: requirements traceability, hardware-software integration milestones, testing windows, certification timelines. You manage tasks via GitHub Issues with labels for hardware/firmware/rtos/cloud/comms/testing. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Embedded Architect (EA)
- **Role**: System architecture, hardware-software partitioning, memory maps, peripheral allocation.
- **Persona**: "You are the Embedded Architect. You design system architectures for resource-constrained devices: memory maps, peripheral allocation, DMA channels, interrupt priorities, boot sequences, and power state machines. You define hardware abstraction layer (HAL) interfaces, select MCU/MPU families (STM32, ESP32, nRF, ARM Cortex-M/A), and produce architecture decision records. You use PlatformIO project structures and CMake build systems."
- **Spawning**: Wave 2 (parallel)

### 2.4 Firmware Engineer (FW)
- **Role**: Application firmware, drivers, bootloader, OTA update mechanisms.
- **Persona**: "You are the Firmware Engineer. You write production firmware in C/C++ and embedded Rust. You implement device drivers, peripheral interfaces (SPI, I2C, UART, ADC), bootloaders with secure boot, and OTA update mechanisms. You follow MISRA C guidelines, use static analysis (PC-lint, cppcheck), and write firmware that fits within strict flash/RAM budgets. You use ESP-IDF, STM32 HAL, or Zephyr driver models."
- **Spawning**: Wave 2 (parallel)

### 2.5 RTOS Engineer (RTOS)
- **Role**: Real-time operating system configuration, task scheduling, timing analysis.
- **Persona**: "You are the RTOS Engineer. You configure and optimize real-time operating systems: FreeRTOS, Zephyr RTOS, or bare-metal schedulers. You design task architectures with priority assignments, worst-case execution time (WCET) analysis, stack size calculations, inter-task communication (queues, semaphores, mutexes), and deadline monotonic scheduling. You prevent priority inversion and ensure deterministic timing."
- **Spawning**: Wave 2 (parallel)

### 2.6 Hardware Abstraction Engineer (HAL)
- **Role**: HAL design, BSP development, peripheral abstraction, portability layers.
- **Persona**: "You are the Hardware Abstraction Engineer. You design clean HAL interfaces that decouple application firmware from specific MCU peripherals. You create board support packages (BSPs), GPIO abstractions, timer abstractions, and communication bus wrappers. You ensure firmware portability across MCU families and enable hardware-in-the-loop testing by providing mock implementations."
- **Spawning**: Wave 2 (parallel)

### 2.7 IoT Cloud Engineer (CLOUD)
- **Role**: Cloud connectivity, device management, data pipelines, OTA infrastructure.
- **Persona**: "You are the IoT Cloud Engineer. You design cloud-side infrastructure for IoT device fleets: device provisioning (AWS IoT Core, Azure IoT Hub), telemetry ingestion, command/control channels, OTA update distribution, device shadow/twin management, and fleet monitoring dashboards. You implement secure device-to-cloud communication with TLS mutual authentication and certificate rotation."
- **Spawning**: Wave 2 (parallel)

### 2.8 Communications Engineer (COMMS)
- **Role**: Wireless and wired protocol stacks, RF design considerations, mesh networking.
- **Persona**: "You are the Communications Engineer. You implement and optimize communication protocol stacks: MQTT, CoAP, HTTP/2, BLE (Bluetooth Low Energy), LoRaWAN, Zigbee, Thread, Wi-Fi, and cellular (LTE-M, NB-IoT). You handle protocol state machines, packet framing, retransmission logic, connection management, and power-efficient polling strategies. You analyze RF link budgets and antenna considerations."
- **Spawning**: Wave 2 (parallel)

### 2.9 QA -- Hardware-in-Loop Testing (QA)
- **Role**: Test strategy, HIL testing, integration testing, regression testing.
- **Persona**: "You are the Embedded QA Engineer. You create test strategies covering unit tests (Unity/CeedlingTest frameworks), integration tests, hardware-in-the-loop (HIL) test plans, power consumption test procedures, and OTA update verification. You define test fixtures, mock hardware interfaces, and automated regression suites. You validate timing constraints and memory usage against budgets."
- **Spawning**: Wave 3 (sequential gate)

### 2.10 Release Manager (RM)
- **Role**: Firmware release coordination, versioning, OTA deployment sign-off.
- **Persona**: "You are the Embedded Release Manager. You coordinate firmware releases: semantic versioning with build metadata, binary signing, OTA package creation, staged rollout plans, rollback procedures, and hardware compatibility matrices. You create GitHub Releases with firmware binaries via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.11 Marketing Strategist (MKT)
- **Role**: Product positioning, technical datasheets, developer documentation.
- **Persona**: "You are the IoT Marketing Strategist. You create product datasheets, developer quick-start guides, technical specifications for partners, and competitive positioning documents for the IoT device/platform."
- **Spawning**: Wave 1.5 (background)

### 2.12 Legal/Compliance Attorney (LEGAL)
- **Role**: Regulatory compliance, FCC/CE certification, wireless regulations.
- **Persona**: "You are the Legal/Compliance Attorney for embedded products. You review FCC/CE/IC wireless certification requirements, EMC compliance, product safety standards (UL, IEC 62368), environmental regulations (RoHS, REACH), export controls, and open-source license compliance for firmware dependencies."
- **Spawning**: Wave 1.5 (background)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +----------+
                        |   USER   |
                        +----+-----+
                             |
                    +--------v--------+
                    |  TEAM LEADER    |
                    |  (Orchestrator) |
                    +--------+--------+
                             |
            +----------------+----------------+
            |                |                |
     +------v------+  +-----v------+  +------v------+
     |     PM      |  | Marketing  |  |  Attorney   |
     | (Planning)  |  | (Product)  |  |  (Legal)    |
     +------+------+  +-----------++  +-------------+
            |
   +--------+--------+--------+--------+--------+
   |        |        |        |        |        |
+--v--+ +---v--+ +---v--+ +--v---+ +--v----+ +-v-----+
| Emb | | Firm | | RTOS | | HAL  | |  IoT  | | Comms |
| Arch| | ware | |      | |      | | Cloud | |       |
+--+--+ +---+--+ +---+--+ +--+---+ +--+----+ +--+----+
   +--------+--------+--------+--------+--------+
            |
       +----v---------------------------------+
       |     QA (Hardware-in-Loop Testing)    |
       +------------------+-------------------+
                          |
                 +--------v--------+
                 | Release Manager |
                 +-----------------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Embedded project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
     - Target hardware platforms, MCU selection rationale
     - Memory budget (flash/RAM), power budget (mA/uA targets)
     - Communication protocols, cloud platform
  2. Create Milestone Plan -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
     - Hardware availability risks, silicon errata, certification timeline risks
  6. Set up GitHub Project board with labels (hardware/firmware/rtos/cloud/comms/testing)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Legal (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Product positioning", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + CHARTER -> .team/marketing/ (DATASHEET.md, QUICKSTART.md, COMPETITIVE_ANALYSIS.md)")

Task(subagent_type="general-purpose", description="LEGAL: Regulatory compliance", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + CHARTER -> .team/legal/ (CERTIFICATION_CHECKLIST.md, LICENSE_AUDIT.md, REGULATORY_MATRIX.md)")
```

### Spawn: Engineering Wave (Background, Parallel -- 6 agents)
```
EA    -> .team/hardware-abstraction/  (SYSTEM_ARCHITECTURE.md, MEMORY_MAP.md, PERIPHERAL_ALLOCATION.md, POWER_STATES.md)
FW    -> .team/firmware/              (DRIVER_DESIGN.md, BOOTLOADER_SPEC.md, OTA_MECHANISM.md, APPLICATION_LOGIC.md)
RTOS  -> .team/rtos-config/          (TASK_ARCHITECTURE.md, TIMING_ANALYSIS.md, STACK_CALCULATIONS.md, IPC_DESIGN.md)
HAL   -> .team/hardware-abstraction/ (HAL_INTERFACES.md, BSP_DESIGN.md, MOCK_IMPLEMENTATIONS.md, PORTABILITY_GUIDE.md)
CLOUD -> .team/iot-cloud/            (PROVISIONING_FLOW.md, TELEMETRY_PIPELINE.md, OTA_INFRASTRUCTURE.md, DEVICE_MANAGEMENT.md)
COMMS -> .team/communications/       (PROTOCOL_SELECTION.md, STATE_MACHINES.md, POWER_OPTIMIZATION.md, LINK_BUDGET.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, UNIT_TESTS.md, HIL_TEST_PLAN.md, POWER_TEST_RESULTS.md, MEMORY_ANALYSIS.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (FIRMWARE_RELEASE.md, BINARY_MANIFEST.md, OTA_ROLLOUT_PLAN.md, HW_COMPAT_MATRIX.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} --title "Firmware Release"
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | hardware/firmware/rtos/cloud/comms + priority labels |
| Releases | `.team/releases/` | `gh release create` with firmware binaries |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter (hardware targets, memory/power budgets), Milestones, Timeline
+-- PM: GitHub Project board + hardware/firmware labels
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: datasheets, quick-start guides, competitive analysis
+-- Attorney: FCC/CE certification, license audit, regulatory matrix
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 6 agents)
+-- EA, FW, RTOS, HAL, CLOUD, COMMS -- all in parallel
+-- SYNC: TL waits for all 6 agents, validates interface contracts

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF with resource utilization dashboard
+-- PM: Update GitHub issues
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: unit tests, HIL tests, power measurements, memory analysis
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal certification clear + Marketing ready
+-- RM: firmware release package, OTA rollout plan, HW compatibility matrix
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF with resource utilization and test coverage metrics
+-- PM: close all GitHub milestones
+-- TL: present firmware release summary to user
```

---

## 7. QUALITY GATES

| # | Gate | When | Check | Evidence Required | Action if FAIL |
|---|------|------|-------|-------------------|----------------|
| G1 | Planning Complete | After PM | Charter + budgets + GitHub Project exists | GitHub Project screenshot | Re-spawn PM |
| G2 | Cross-Compilation | After FW | Cross-compile succeeds for all target platforms | Build log with binary sizes | Re-spawn FW with error logs |
| G3 | Static Analysis | After FW | cppcheck + MISRA compliance: zero critical warnings | cppcheck XML report, MISRA summary | Re-spawn FW |
| G4 | Unit Test Gate | After QA | Unity/Ceedling test pass rate >= 95% | Test runner output with pass/fail counts | Enter Bug Fix Loop |
| G5 | QEMU Emulation | After QA | Firmware runs in QEMU without crashes, passes smoke tests | QEMU console log, test output | Re-spawn FW + RTOS |
| G6 | HIL Test Gate | After QA | Hardware-in-loop tests pass on target hardware | HIL test log, peripheral I/O traces | Re-spawn FW + HAL |
| G7 | Power Consumption | After QA | Measured power within budget (active/sleep/deep-sleep) | Power profile measurements | Re-spawn RTOS + COMMS |
| G8 | Flash Size Gate | After FW | Flash usage within budget with >= 10% headroom | `size` command output, section map | Re-spawn FW + EA |
| G9 | RAM Usage Gate | After FW | RAM (static + stack + heap) within budget with >= 15% headroom | Memory map analysis, stack watermark | Re-spawn FW + RTOS |
| G10 | OTA Update Verification | After QA | OTA update + rollback verified end-to-end | OTA test log, version verification | Re-spawn FW + CLOUD |
| G11 | EMC Pre-compliance | After LEGAL | Pre-compliance scan within regulatory limits | EMC test report | Re-spawn COMMS + EA |
| G12 | Secrets Gate | Before release | No hardcoded keys, certificates, or tokens | `gitleaks detect` clean output | Block release |
| G13 | Evidence Gate | Before release | All evidence artifacts in `.team/evidence/` | File existence check | Block release |
| G14 | Deployment Approved | After RM | DEPLOYMENT_SIGNOFF.md approved | Sign-off document | RM lists blocking items |

---

## 8. `.team/` DIRECTORY LAYOUT

```
.team/
+-- PROJECT_CHARTER.md
+-- MILESTONES.md
+-- KANBAN.md
+-- TIMELINE.md
+-- RISK_REGISTER.md
+-- DECISION_LOG.md
+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- cross-compile-build.log
|   +-- cppcheck-report.xml
|   +-- unity-test-results.txt
|   +-- qemu-emulation.log
|   +-- hil-test-results.log
|   +-- power-profile.csv
|   +-- flash-size-report.txt
|   +-- ram-usage-analysis.txt
|   +-- ota-update-test.log
|   +-- gitleaks-scan.txt
+-- ci/
|   +-- .github/
|   |   +-- workflows/
|   |       +-- firmware-ci.yml
|   |       +-- static-analysis.yml
|   |       +-- qemu-test.yml
|   +-- act-validation-log.txt
+-- hardware-abstraction/
+-- firmware/
+-- rtos-config/
+-- iot-cloud/
+-- communications/
+-- power-analysis/
+-- qa/
+-- releases/
+-- marketing/
+-- legal/
```

---

## 9. REPORTING SYSTEM

### Standard Reports
- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py` -- includes memory/power budget utilization charts and test coverage
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py` -- includes detailed resource analysis and HIL test results
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion with full resource utilization report

### Enhanced Report Content
- **Evidence slides**: Each PPTX includes flash/RAM usage bar charts, power profile graphs, and test result tables
- **Resource budget dashboard**: Flash used/available, RAM static/stack/heap breakdown, power active/sleep/deep-sleep
- **Cross-compilation matrix**: Build status per target platform (STM32, ESP32, nRF, etc.)
- **HIL test summary**: Pass/fail per test case, timing constraint adherence

---

## 10. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Hardware constraint violation**: TL escalates to user with resource budget analysis and trade-off options

### Session Commands

| Command | Action |
|---------|--------|
| `--team embeddedIoT --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + resource budget dashboard |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation (MCU selection, protocol choice) |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

## 11. EVIDENCE & PROOF PROTOCOL

Every deliverable requires verifiable evidence. No firmware artifact is considered complete without proof.

### Embedded IoT Evidence Requirements

| Artifact | Required Evidence | Storage Path |
|----------|-------------------|--------------|
| Cross-Compilation | Build log with binary sizes per target, zero errors/warnings | `.team/evidence/cross-compile-build.log` |
| Static Analysis (cppcheck) | XML report with zero critical/high severity findings | `.team/evidence/cppcheck-report.xml` |
| Unit Tests (Unity/Ceedling) | Test runner output with pass/fail counts, >= 95% pass rate | `.team/evidence/unity-test-results.txt` |
| QEMU Emulation | QEMU console log showing firmware boot and smoke test completion | `.team/evidence/qemu-emulation.log` |
| HIL Test Results | Hardware test log with I/O traces and timing measurements | `.team/evidence/hil-test-results.log` |
| Power Profile | CSV with current measurements for active, sleep, deep-sleep modes | `.team/evidence/power-profile.csv` |
| Flash Size | `arm-none-eabi-size` output or equivalent showing section sizes | `.team/evidence/flash-size-report.txt` |
| RAM Usage | Memory map analysis with static, stack watermark, and heap peak | `.team/evidence/ram-usage-analysis.txt` |
| OTA Update Test | End-to-end OTA test log with version before/after verification | `.team/evidence/ota-update-test.log` |
| Secrets Scan | gitleaks clean output (no hardcoded keys or certificates) | `.team/evidence/gitleaks-scan.txt` |

### Evidence Collection Commands

```bash
# Cross-compilation for target platform
arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -specs=nosys.specs \
  -o build/firmware.elf src/*.c 2>&1 | tee .team/evidence/cross-compile-build.log
arm-none-eabi-size build/firmware.elf | tee -a .team/evidence/cross-compile-build.log

# Alternative: PlatformIO build
pio run --environment esp32dev 2>&1 | tee .team/evidence/cross-compile-build.log

# Alternative: CMake/Zephyr build
west build -b nrf52840dk_nrf52840 app/ 2>&1 | tee .team/evidence/cross-compile-build.log

# Static analysis with cppcheck
cppcheck --enable=all --xml --xml-version=2 src/ 2> .team/evidence/cppcheck-report.xml
cppcheck --enable=all --addon=misra.json src/ 2>&1 | tee .team/evidence/misra-check.txt

# Unit tests with Unity/Ceedling
ceedling test:all 2>&1 | tee .team/evidence/unity-test-results.txt
# Or with PlatformIO
pio test --environment native 2>&1 | tee .team/evidence/unity-test-results.txt

# QEMU emulation test
qemu-system-arm -machine lm3s6965evb -nographic -kernel build/firmware.elf \
  -serial mon:stdio 2>&1 | timeout 30 tee .team/evidence/qemu-emulation.log

# Flash size verification
arm-none-eabi-size -A build/firmware.elf > .team/evidence/flash-size-report.txt
arm-none-eabi-objdump -h build/firmware.elf >> .team/evidence/flash-size-report.txt

# RAM usage analysis (linker map file)
grep -E "^\.bss|^\.data|^\.heap|^\.stack" build/firmware.map > .team/evidence/ram-usage-analysis.txt
echo "--- Stack Watermark ---" >> .team/evidence/ram-usage-analysis.txt
# Stack watermark from runtime if available

# OTA update test
python scripts/ota_test.py --firmware build/firmware_v2.bin --device /dev/ttyUSB0 \
  2>&1 | tee .team/evidence/ota-update-test.log

# Secrets scan
gitleaks detect --source . --report-path .team/evidence/gitleaks-scan.txt
```

### Evidence Freshness Policy
- Evidence must be regenerated after any source code change affecting firmware binary
- Flash/RAM measurements must correspond to the exact binary being released
- PM tracks evidence timestamps against latest build commit hash

---

## 12. LOCAL INSTALL & TEST PROTOCOL

### Prerequisites
```bash
# Toolchain installation (ARM Cortex-M)
# Ubuntu/Debian:
sudo apt install gcc-arm-none-eabi gdb-multiarch openocd qemu-system-arm
# macOS:
brew install arm-none-eabi-gcc qemu openocd

# PlatformIO (recommended for multi-platform)
pip install platformio
pio platform install espressif32
pio platform install ststm32
pio platform install nordicnrf52

# Zephyr RTOS SDK (if using Zephyr)
pip install west
west init ~/zephyrproject
cd ~/zephyrproject && west update

# Static analysis
sudo apt install cppcheck  # or brew install cppcheck
pip install cpplint

# Unit test framework
pip install ceedling  # Ruby-based Unity test runner
# Or install Unity framework headers directly

# Report generation
pip install python-pptx reportlab
```

### Docker-Based Build Environment
```bash
# Dockerfile.embedded for reproducible builds
docker build -t embedded-toolchain -f Dockerfile.embedded .
docker run --rm -v $(pwd):/project embedded-toolchain make all

# Docker Compose for HIL simulation
docker compose -f docker-compose.hil.yml up -d
# Services: QEMU instances, mock cloud endpoint, MQTT broker
```

### Build Verification
```bash
# 1. Cross-compile for all target platforms
pio run --environment esp32dev
pio run --environment stm32f4
pio run --environment nrf52840

# 2. Static analysis (zero critical warnings)
cppcheck --enable=all --error-exitcode=1 src/

# 3. Run unit tests (native environment)
pio test --environment native

# 4. QEMU emulation smoke test
qemu-system-arm -machine lm3s6965evb -nographic -kernel build/firmware.elf \
  -serial mon:stdio & sleep 5 && kill %1

# 5. Flash size check (within budget)
arm-none-eabi-size build/firmware.elf
```

### Run Verification
```bash
# Flash to target hardware
pio run --target upload --environment esp32dev
# Or with OpenOCD
openocd -f interface/stlink.cfg -f target/stm32f4x.cfg \
  -c "program build/firmware.elf verify reset exit"

# Monitor serial output
pio device monitor --baud 115200

# Run HIL test suite (if hardware available)
python scripts/hil_test_runner.py --port /dev/ttyUSB0 --baud 115200

# QEMU-based integration test
./scripts/qemu_integration_test.sh
```

---

## 13. ATOMIC COMMIT PROTOCOL

### Conventional Commit Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Embedded IoT Commit Types

| Type | When | Example |
|------|------|---------|
| `feat(driver)` | New peripheral driver, hardware interface | `feat(driver): add SPI flash driver for W25Q128` |
| `feat(rtos)` | New RTOS task, IPC mechanism | `feat(rtos): add sensor polling task with 100ms period` |
| `feat(comms)` | New protocol stack, connectivity feature | `feat(comms): add BLE GATT service for device config` |
| `feat(cloud)` | Cloud connectivity, OTA, device management | `feat(cloud): add MQTT telemetry publisher with QoS 1` |
| `feat(hal)` | New HAL interface, BSP addition | `feat(hal): add GPIO abstraction for LED control` |
| `fix(firmware)` | Bug fix in application firmware | `fix(firmware): correct I2C read timeout causing watchdog reset` |
| `fix(rtos)` | RTOS configuration fix, priority issue | `fix(rtos): resolve priority inversion on SPI mutex` |
| `test(hil)` | Hardware-in-loop test, power test | `test(hil): add power consumption test for deep-sleep mode` |
| `test(unit)` | Unit test for firmware module | `test(unit): add Unity tests for CRC32 calculation` |
| `refactor(hal)` | HAL cleanup, portability improvement | `refactor(hal): extract timer abstraction for multi-MCU support` |
| `chore(build)` | Build system, toolchain, linker script | `chore(build): update linker script for 512KB flash layout` |
| `docs(hw)` | Hardware documentation, pinout, schematic notes | `docs(hw): document SPI flash pinout and timing requirements` |

### Per-Task Commit Workflow
```bash
# 1. Stage only task-related files
git add src/drivers/spi_flash.c
git add src/drivers/spi_flash.h
git add tests/test_spi_flash.c

# 2. Commit with conventional format
git commit -m "feat(driver): add SPI flash driver for W25Q128

- Read/write/erase operations with DMA support
- Sector erase (4KB), block erase (64KB), chip erase
- JEDEC ID verification on initialization
- Flash size: +2.1KB text, +128B data
"

# 3. Record commit hash for PM tracking
TASK_COMMIT=$(git rev-parse --short HEAD)
```

---

## 14. COMPREHENSIVE TESTING MATRIX

### Test Layers

| Layer | Tool | Scope | Coverage Target |
|-------|------|-------|-----------------|
| Static Analysis | cppcheck + cpplint + MISRA | Code quality, undefined behavior, MISRA compliance | All source files |
| Unit Tests | Unity + Ceedling / PlatformIO test | Individual modules, math functions, state machines | >= 90% for critical modules |
| QEMU Emulation | QEMU system emulator | Firmware boot, task scheduling, basic I/O | Smoke test pass |
| Integration Tests | Custom test harness | Multi-module interaction, ISR handling, DMA transfers | Critical data paths |
| HIL Tests | Physical target + test jig | Real peripheral I/O, timing accuracy, analog readings | All hardware interfaces |
| Power Tests | Current meter + profiler | Active/sleep/deep-sleep current draw vs. budget | All power states |
| Flash Size Tests | `arm-none-eabi-size` | Binary fits within flash budget with headroom | Every build |
| RAM Tests | Linker map + stack watermark | Static + stack + heap within RAM budget | Every build |
| OTA Tests | Custom OTA test harness | Update, verify, rollback cycle | Full OTA flow |
| Communication Tests | Protocol analyzer + mock server | MQTT/BLE/LoRa message exchange, retry logic | All protocols |

### Test Execution Order
```bash
# Phase 1: Static analysis
cppcheck --enable=all --error-exitcode=1 src/
cpplint --recursive src/

# Phase 2: Unit tests (native)
pio test --environment native -v 2>&1 | tee .team/evidence/unity-test-results.txt

# Phase 3: Cross-compilation (all targets)
pio run --environment esp32dev 2>&1 | tee .team/evidence/cross-compile-build.log
pio run --environment stm32f4 2>&1 | tee -a .team/evidence/cross-compile-build.log

# Phase 4: Flash/RAM size verification
arm-none-eabi-size build/firmware.elf > .team/evidence/flash-size-report.txt

# Phase 5: QEMU emulation test
./scripts/qemu_smoke_test.sh 2>&1 | tee .team/evidence/qemu-emulation.log

# Phase 6: HIL tests (requires hardware)
python scripts/hil_test_runner.py --port /dev/ttyUSB0 2>&1 | tee .team/evidence/hil-test-results.log

# Phase 7: Power profiling (requires current meter)
python scripts/power_profiler.py --port /dev/ttyACM0 2>&1 | tee .team/evidence/power-profile.csv

# Phase 8: OTA update test
python scripts/ota_test.py --firmware build/firmware_v2.bin 2>&1 | tee .team/evidence/ota-update-test.log
```

### QEMU Emulation Setup
```bash
# ARM Cortex-M emulation for unit testing without hardware
qemu-system-arm \
  -machine lm3s6965evb \
  -cpu cortex-m3 \
  -nographic \
  -semihosting-config enable=on,target=native \
  -kernel build/test_firmware.elf

# ESP32 emulation (limited, via QEMU fork)
# https://github.com/espressif/qemu
qemu-system-xtensa \
  -machine esp32 \
  -nographic \
  -drive file=build/flash_image.bin,if=mtd,format=raw
```

### Flash Size Budget Template
```
+------------------+----------+--------+----------+
| Section          | Size (B) | % Used | Budget   |
+------------------+----------+--------+----------+
| .text (code)     | 98,304   | 48.0%  | 204,800  |
| .rodata (const)  | 12,288   | 6.0%   | included |
| .data (init)     | 4,096    | 2.0%   | included |
| TOTAL FLASH      | 114,688  | 56.0%  | 204,800  |
| HEADROOM         | 90,112   | 44.0%  | >= 10%   |
+------------------+----------+--------+----------+
| .bss (zero-init) | 8,192    | 12.5%  | 65,536   |
| .stack           | 4,096    | 6.3%   | included |
| .heap            | 16,384   | 25.0%  | included |
| TOTAL RAM        | 28,672   | 43.8%  | 65,536   |
| HEADROOM         | 36,864   | 56.3%  | >= 15%   |
+------------------+----------+--------+----------+
```

---

## 15. GITHUB ACTIONS -- LOCAL TESTING

### CI Pipeline Definition
```yaml
# .github/workflows/firmware-ci.yml
name: Firmware CI
on: [push, pull_request]

jobs:
  static-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install cppcheck
        run: sudo apt-get install -y cppcheck
      - name: Run cppcheck
        run: cppcheck --enable=all --error-exitcode=1 --xml --xml-version=2 src/ 2> cppcheck-report.xml
      - name: Upload cppcheck report
        uses: actions/upload-artifact@v3
        with:
          name: cppcheck-report
          path: cppcheck-report.xml

  build-all-targets:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [esp32dev, stm32f4, nrf52840]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install PlatformIO
        run: pip install platformio
      - name: Build firmware
        run: pio run --environment ${{ matrix.environment }}
      - name: Check flash size
        run: |
          pio run --environment ${{ matrix.environment }} --target size
          # Parse size output and check against budget

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install PlatformIO
        run: pip install platformio
      - name: Run native tests
        run: pio test --environment native -v

  qemu-smoke-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install QEMU
        run: sudo apt-get install -y qemu-system-arm gcc-arm-none-eabi
      - name: Build test firmware
        run: make -f Makefile.qemu
      - name: Run QEMU smoke test
        run: |
          timeout 30 qemu-system-arm -machine lm3s6965evb -nographic \
            -kernel build/qemu_test.elf 2>&1 | tee qemu-output.log
          grep "ALL TESTS PASSED" qemu-output.log

  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}
```

### Local CI Validation with `act`
```bash
# Run individual CI jobs
act push --job static-analysis
act push --job build-all-targets
act push --job unit-tests
act push --job qemu-smoke-test
act push --job secrets-scan

# Run all jobs
act push

# Save validation log as evidence
act push 2>&1 | tee .team/ci/act-validation-log.txt
```

### Embedded-Specific CI Checks
```bash
# MISRA compliance check
cppcheck --addon=misra.json src/ 2>&1 | grep "misra" | tee .team/evidence/misra-check.txt

# Flash size regression check
arm-none-eabi-size build/firmware.elf | awk 'NR==2{if($1+$2 > MAX_FLASH) exit 1}'

# Stack analysis (if supported by toolchain)
arm-none-eabi-gcc -fstack-usage src/*.c

# Linker map analysis for symbol sizes
python scripts/analyze_map_file.py build/firmware.map --budget flash=204800 ram=65536
```

---

## 16. PM KANBAN -- REAL-TIME TRACKING

### GitHub Projects V2 Setup
```bash
# Create project board
gh project create --title "Embedded: <project-name>" --owner @me

# Create custom fields for embedded projects
gh project field-create <PROJECT_NUMBER> --owner @me --name "Subsystem" --data-type "SINGLE_SELECT" \
  --single-select-options "firmware,rtos,hal,cloud,comms,driver"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Target MCU" --data-type "SINGLE_SELECT" \
  --single-select-options "esp32,stm32f4,nrf52840,rp2040"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Flash Delta" --data-type "NUMBER"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Evidence Status" --data-type "SINGLE_SELECT" \
  --single-select-options "pending,collected,verified,stale"
```

### Real-Time Issue Updates
After each task completion:
```bash
# Update issue status with resource impact
gh issue edit <NUMBER> --add-label "status:done"
gh issue comment <NUMBER> --body "Task completed:
- Flash delta: +2,148 bytes (.text), +128 bytes (.data)
- Total flash usage: 56.0% (was 54.9%)
- Unit tests: 47/47 passed
- Evidence: .team/evidence/cross-compile-build.log
- Commit: $(git rev-parse --short HEAD)"
```

### PM 6-Hour Report Cycle
```
CYCLE START:
  1. Read KANBAN.md for current state
  2. Query GitHub Issues: gh issue list --state all --json number,title,state,labels
  3. Collect resource measurements from .team/evidence/
  4. Generate PPTX with:
     - Flash usage bar chart (per section, vs budget)
     - RAM usage breakdown (static, stack, heap)
     - Power profile chart (active, sleep, deep-sleep)
     - Build status matrix (per target MCU)
     - Test pass/fail summary
     - Evidence collection status
  5. Generate PDF with detailed resource analysis
  6. Commit reports
CYCLE END
```

### Evidence-Linked Kanban Columns

| Column | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| Backlog | Issue created with subsystem label | PM assigns to wave |
| In Progress | Agent spawned and working | Agent writes first artifact |
| In Review | Artifact exists in `.team/` | Build compiles, evidence collected |
| Evidence Collected | Build log + test results + size report saved | All tests pass, within resource budget |
| Done | QA sign-off, evidence verified, commit recorded | PM closes issue |
| Blocked | Build failure, hardware unavailable, resource budget exceeded | Blocker resolved |

---

*Embedded IoT Team v3.0 -- Amenthyx AI Teams*
*12 Roles | 5 Waves | 14 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Based*
*See shared/ENHANCED_EXECUTION_PROTOCOL.md for cross-team protocol details*
