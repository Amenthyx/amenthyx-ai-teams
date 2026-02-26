# Robotics/ROS Team — Tailored Strategy v3.1

> Pre-configured for **SLAM, path planning, manipulation, and sensor fusion with ROS2, MoveIt2, and Gazebo/Isaac Sim**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team roboticsROS --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Robotics/ROS Team)*

**Required Tech Stack**:
- **Language**: C++ 17 (performance-critical nodes), Python 3.12+ (scripting, integration, ML)
- **Framework**: ROS2 Humble/Iron (middleware, communication, lifecycle)
- **Libraries**: rclcpp / rclpy (ROS2 client libraries), nav2 (navigation stack), MoveIt2 (motion planning), tf2 (coordinate transforms), Gazebo Fortress/Garden (physics simulation), NVIDIA Isaac Sim (GPU-accelerated simulation)
- **Database**: SQLite (on-robot config/logs) / ROS bags (sensor data recording)
- **Build**: colcon (ROS2 build tool), CMake (C++ packages), setuptools (Python packages)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS RoboMaker / GCP — team's choice (simulation and CI)
- **Deployment**: Docker (ROS2 containers) / Snap packages (robot deployment)
- **Simulation**: Gazebo (physics + sensor simulation), Isaac Sim (photorealistic, GPU-accelerated)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Gazebo / Isaac Sim | Physics simulation | Local install | N/A |
| ROS2 DDS | Inter-node communication | DDS security (env) | QoS policies |
| SQLite | On-robot config and logs | Local file | N/A |
| ROS bags | Sensor data recording | File-based | Storage-limited |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: colcon (ROS2), apt (system deps), pip/poetry (Python)

**Monorepo or Polyrepo**: Monorepo (ROS2 workspace with multiple packages)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Control loop frequency: >= 100Hz for real-time control nodes
- Sensor processing latency: < 50ms (LiDAR), < 100ms (camera)
- Path planning: < 500ms for local planner, < 2s for global planner
- SLAM map update rate: >= 10Hz

**Security**:
- Authentication: DDS Security (SROS2) for inter-node communication
- Authorization: Topic-level access control via SROS2 policies
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS for remote access, DDS encryption for ROS2 topics

**Scalability**:
- Multi-robot fleet: [FILL IN: single robot / fleet of N]
- Scaling strategy: Namespace-based multi-robot support, fleet management via cloud
- Expected launch robots: [FILL IN]

**Availability**:
- Robot uptime target: 99% during operational hours
- RTO: 5 minutes (watchdog restart)
- RPO: N/A (real-time system, no persistent state loss critical)
- Multi-site: [FILL IN: yes / no / future]

**Accessibility**:
- Robot operator UI accessible via web dashboard (ROS2 web bridge)
- Diagnostic tools with clear visualization (RViz2, Foxglove Studio)
- Comprehensive ROS2 launch file documentation

**Observability**:
- Logging: ROS2 logging (rcl logging) with spdlog backend, structured output
- Metrics: /diagnostics topic (diagnostic_updater), custom Prometheus exporter
- Tracing: ROS2 tracing (ros2_tracing with LTTng) for timing analysis
- Alerting: Watchdog nodes for critical subsystem health, fleet dashboard alerts

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (C++ nodes), >= 75% (Python nodes)

**Required Test Types**:
- [x] Unit tests (gtest/gmock for C++, pytest for Python ROS2 nodes)
- [x] Integration tests (launch_testing — multi-node interaction tests)
- [x] Simulation tests (Gazebo world scenarios — navigation, manipulation, collision)
- [x] Hardware-in-the-loop tests (physical robot with test fixtures)
- [x] SLAM accuracy tests (ground truth comparison, loop closure verification)
- [x] Safety tests (e-stop response time, collision avoidance, workspace limits)
- [x] Timing tests (control loop jitter, worst-case execution time)
- [ ] Long-duration endurance tests (optional — 8h+ continuous operation)
- [ ] Multi-robot coordination tests (optional — if fleet mode)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (clang-format, clang-tidy for C++; black, ruff for Python)
- [x] Branch protection (require PR reviews, passing CI)
- [x] ROS2 CI with Docker (official ROS2 Docker images)
- [ ] Simulation-based regression tests on every PR
- [ ] Hardware test gate before release

**Testing Tools**: gtest, gmock, pytest, launch_testing, Gazebo test worlds, ros2_tracing, ament_lint

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
| AWS RoboMaker | Variable | Card | No — ask first |
| NVIDIA Isaac Sim license | Variable | Card | No — ask first |
| Hardware components | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% C++ test coverage, >= 75% Python test coverage
- [ ] Zero CRITICAL/HIGH safety vulnerabilities
- [ ] All simulation tests pass (navigation, manipulation, collision avoidance)
- [ ] Control loop timing verified (>= 100Hz, jitter < 1ms)
- [ ] SLAM accuracy validated against ground truth
- [ ] Safety systems verified (e-stop < 100ms, workspace limits enforced)
- [ ] Documentation complete (README, launch files documented, message/service API docs)
- [ ] CI/CD pipeline tested and working (including simulation jobs)
- [ ] Hardware abstraction layers tested on target platform

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
| Simulation-to-reality transfer gap | H | H | Domain randomization, sim-to-real testing protocol, hardware-in-the-loop validation |
| Real-time deadline violations causing unsafe behavior | M | H | WCET analysis, RT_PREEMPT kernel, priority-based scheduling, watchdog nodes |
| Sensor hardware failure or calibration drift | M | H | Sensor fusion with redundancy, online calibration, health monitoring diagnostics |
| ROS2 DDS communication latency under load | M | M | QoS tuning, DDS vendor selection (FastDDS, CycloneDDS), topic filtering |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Real-time safety constraints: control loops must meet timing deadlines, safety-critical nodes must have WCET bounds
- Simulation-first development: all features validated in Gazebo/Isaac Sim before hardware testing
- Hardware abstraction layers: all hardware access through HAL interfaces for portability
- E-stop response: emergency stop must activate within 100ms from any state

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
- [x] Additional C++ ROS2 Engineer (perception, control, navigation nodes)
- [x] Additional Python ROS2 Engineer (integration, ML inference, scripting)
- [x] Additional Simulation Engineer (Gazebo worlds, Isaac Sim scenes)
- [x] Additional Controls Engineer (PID tuning, motion planning, kinematics)
- [x] DevOps Specialist (ROS2 CI/CD, Docker, fleet deployment)
- [x] Safety Engineer (FMEA, safety monitoring, e-stop verification)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (gcov + lcov for C++, pytest-cov for Python)
- [x] Simulation test results (Gazebo world test logs, pass/fail per scenario)
- [x] SLAM accuracy report (trajectory error, loop closure metrics, ground truth comparison)
- [x] Timing analysis (control loop frequency histograms, WCET measurements)
- [x] Safety test results (e-stop response time, collision avoidance verification)
- [x] ROS bag recordings (key test scenarios recorded for replay)
- [x] Sensor calibration reports (intrinsics, extrinsics, accuracy validation)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] RViz2 visualization captures (navigation, SLAM, manipulation demos)
- [x] Architecture diagram (ROS2 node graph, topic connections, TF tree)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **ROS bags**: ALL test recording bags retained for regression analysis
- **Simulation configs**: ALL Gazebo/Isaac world files versioned

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
- [x] `.team/evidence/` proof artifacts (simulation results, timing analysis, safety tests)
- [x] Source code changes (ROS2 packages, launch files, configs)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Robotics/ROS Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for C++ + Python + ROS2 + MoveIt2 + nav2 + Gazebo/Isaac Sim robotics development*
*Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically Scaled | Evidence-Driven*
