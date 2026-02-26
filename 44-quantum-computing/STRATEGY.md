# Quantum Computing Team — Tailored Strategy v3.1

> Pre-configured for **quantum algorithms, VQE, QAOA, quantum ML, and error mitigation with Qiskit, Cirq, and PennyLane**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team quantumComputing --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for Quantum Computing Team)*

**Required Tech Stack**:
- **Language**: Python 3.12+
- **Framework**: Qiskit (IBM Quantum), Cirq (Google Quantum), PennyLane (Xanadu — hybrid quantum-classical)
- **Libraries**: numpy, scipy (classical numerics), qiskit-aer (local simulation), qiskit-nature (chemistry), qiskit-machine-learning, Amazon Braket SDK
- **Database**: PostgreSQL 16 (experiment tracking, results storage)
- **Simulation**: Qiskit Aer (statevector, density matrix, MPS), Cirq simulators, PennyLane default.qubit

**Hosting/Infrastructure**:
- **Cloud Provider**: IBM Quantum (real hardware), Amazon Braket (multi-vendor), Google Quantum (Cirq)
- **Deployment**: Docker (experiment environments) / Jupyter Hub (interactive research)
- **Compute**: CPU for small simulations, GPU for large statevector simulation (cuQuantum)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| IBM Quantum | Real quantum hardware | IBM Quantum API token (env) | Queue-based, plan-dependent |
| Amazon Braket | Multi-vendor quantum access | AWS IAM (env) | Per-task billing |
| PostgreSQL 16 | Experiment tracking | Connection string (env) | Connection pool max 20 |
| Qiskit Aer | Local simulation | Local install | CPU/GPU limited |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: poetry

**Monorepo or Polyrepo**: Monorepo (algorithms, experiments, benchmarks, notebooks co-located)

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Simulator performance: handle circuits up to 25 qubits locally (statevector)
- Transpilation time: < 30s for production circuits
- Experiment turnaround: results available within hardware queue time + 5 minutes processing
- Classical optimization convergence: within defined iteration budget

**Security**:
- Authentication: API tokens for quantum cloud providers, OAuth2 for experiment dashboard
- Authorization: Researcher-level access control to hardware queues
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: TLS 1.3 for all API communication, encrypted credential storage

**Scalability**:
- Qubit count scaling: design circuits with scalability in mind (parameterized depth)
- Classical simulation limits: GPU simulation for > 20 qubits, hardware for > 25 qubits
- Expected experiments: [FILL IN]

**Availability**:
- Experiment dashboard uptime: 99.5%
- Quantum hardware: dependent on provider availability (no SLA control)
- RTO: 2 hours (experiment environment)
- RPO: 1 hour (all experiment data persisted)

**Accessibility**:
- Jupyter notebooks with clear documentation and markdown explanations
- Experiment results dashboard accessible via web UI
- Circuit visualizations with text descriptions

**Observability**:
- Logging: Structured JSON logs (structlog) for all experiment pipelines
- Metrics: Experiment tracking (circuit depth, gate count, error rates, fidelity, runtime)
- Tracing: Experiment provenance (input parameters → circuit → hardware/simulator → results)
- Alerting: Queue timeout alerts, hardware calibration drift warnings

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (algorithm implementations), >= 75% (experiment pipelines)

**Required Test Types**:
- [x] Unit tests (pytest — quantum circuit construction, classical preprocessing)
- [x] Simulator validation tests (known circuits with analytically computable results)
- [x] Transpilation tests (circuit equivalence before/after transpilation)
- [x] Error mitigation tests (noise model simulation, mitigated vs unmitigated comparison)
- [x] Reproducibility tests (same circuit + same simulator seed → identical results)
- [x] Notebook execution tests (papermill — all research notebooks run without error)
- [x] Numerical stability tests (VQE/QAOA convergence, optimizer stability)
- [ ] Hardware calibration tests (optional — requires real hardware access)
- [ ] Quantum advantage benchmarks (optional — classical vs quantum comparison)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (black, ruff, mypy via pre-commit)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated simulator validation on PR
- [ ] Experiment result archival on merge

**Testing Tools**: pytest, qiskit-aer, papermill, hypothesis (property-based), custom fidelity validators

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
| IBM Quantum Premium | Variable | Card | No — ask first |
| Amazon Braket | Per-task billing | Card | No — ask first |
| GPU compute (cuQuantum simulation) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% algorithm test coverage, >= 75% pipeline coverage
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] All quantum circuits validated on simulator with known results
- [ ] Transpilation correctness verified (circuit equivalence)
- [ ] Error mitigation strategies implemented and benchmarked
- [ ] All experiments reproducible (fixed seeds, documented parameters)
- [ ] Documentation complete (README, experiment guides, circuit documentation)
- [ ] CI/CD pipeline tested and working
- [ ] Experiment tracking database populated with all results

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
| Quantum hardware queue delays blocking experiment timeline | H | M | Develop on simulators first, batch hardware jobs, use multiple providers |
| Noise and decoherence degrading algorithm performance | H | H | Error mitigation techniques (ZNE, PEC, M3), noise-aware circuit design |
| Classical simulation hitting qubit limit (> 25 qubits) | M | H | GPU-accelerated simulation (cuQuantum), tensor network methods (MPS), hardware access |
| Quantum SDK breaking changes across versions | M | M | Pin SDK versions, compatibility tests, abstraction layers |
| Overstating quantum advantage claims | M | H | Rigorous classical baselines, statistical significance tests, peer review |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- Simulators for development: all algorithm development and testing on simulators first
- Real hardware access requires approval: no unbudgeted hardware runs
- Reproducible quantum experiments: fixed seeds, documented parameters, versioned circuits
- Classical baselines required: every quantum algorithm must be compared against best-known classical alternative

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
- [x] Additional Quantum Algorithm Engineer (circuit design, VQE/QAOA)
- [x] Additional Quantum ML Engineer (variational circuits, quantum kernels)
- [x] Additional Error Mitigation Specialist (ZNE, PEC, M3, noise modeling)
- [x] Additional Classical Optimization Engineer (parameter optimization, baselines)
- [x] DevOps Specialist (experiment infrastructure, Jupyter Hub, CI/CD)
- [x] Quantum Chemistry Specialist (qiskit-nature, molecular simulation)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (pytest-cov — HTML + lcov)
- [x] Simulator validation results (known circuits, expected vs actual output)
- [x] Transpilation equivalence proofs (before/after circuit comparison)
- [x] Error mitigation benchmarks (mitigated vs unmitigated fidelity)
- [x] Experiment tracking records (all parameters, circuits, results in database)
- [x] Classical baseline comparisons (quantum vs classical performance)
- [x] Circuit visualizations (Qiskit/Cirq circuit diagrams)
- [x] Convergence plots (VQE/QAOA energy vs iteration)
- [x] CI/CD pipeline screenshot (all checks green)
- [x] Architecture diagram (experiment pipeline, simulator/hardware flow, data management)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
- **Documents**: add `[ARCHIVED]` marker — NEVER erase
- **Git history**: NEVER rebase/squash published commits
- **Experiment results**: ALL hardware/simulator results retained permanently
- **Circuit definitions**: ALL circuit versions retained in version control

**Uncertainty Escalation**:
- **Threshold**: < 90% confidence → escalate to TL → user
- **Response time**: [FILL IN: minutes / hours / "whenever available"]
- **Format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy *(pre-configured)*

**Auto-sync frequency**: Every agent completion
**Auto-push enabled?**: Yes
**Branch**: `team/quantumComputing/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts (simulator results, benchmarks, circuit diagrams)
- [x] Source code changes (algorithms, circuits, experiment pipelines)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*Quantum Computing Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for Python + Qiskit + Cirq + PennyLane + Amazon Braket quantum computing*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
