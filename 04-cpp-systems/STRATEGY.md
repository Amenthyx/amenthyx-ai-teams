# C++ Systems Team — Tailored Strategy v3.1

> Pre-configured for **C++20/23 systems programming with CMake, Conan/vcpkg, and performance-critical applications**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team cpp --strategy path/to/this-file.md`

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

## 4. Technical Constraints *(pre-configured for C++ Systems Team)*

**Required Tech Stack**:
- **Language**: C++20 (minimum) / C++23 (preferred where compiler support allows)
- **Framework**: CMake 3.28+ (build system) / Conan 2 or vcpkg (package management)
- **Database**: SQLite (embedded) / LevelDB (key-value) / domain-specific storage
- **Cache**: Custom in-memory (LRU, hash maps, arena allocators)
- **Message Queue**: ZeroMQ / nanomsg (inter-process) / custom lock-free queues (intra-process)

**Hosting/Infrastructure**:
- **Cloud Provider**: AWS / GCP / bare metal — domain-dependent
- **Deployment**: Native binaries / Docker (distroless or scratch base) / system packages (.deb, .rpm)
- **CDN**: N/A (systems-level, not web-facing)
- **Domain**: [FILL IN or "N/A"]

**Integrations**:
| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| GitHub | VCS + CI/CD | gh CLI | N/A |
| Conan Center / vcpkg | Package registry | Public / authenticated | N/A |
| [FILL IN if needed] | [Purpose] | [Auth] | [Limits] |

**Existing Codebase**: [FILL IN: path or "greenfield"]

**Package Manager**: Conan 2 / vcpkg

**Monorepo or Polyrepo**: Single repo with CMake presets

---

## 5. Non-Functional Requirements *(pre-configured)*

**Performance**:
- Latency P99 < 1ms (hot-path operations)
- Zero memory leaks (verified by AddressSanitizer + Valgrind)
- CPU utilization < 80% at peak load
- Binary size optimized (LTO, dead code stripping)

**Security**:
- Authentication: Minimal attack surface (no network-facing by default — domain-specific)
- Authorization: OS-level permissions / domain-specific access control
- Data sensitivity: [FILL IN]
- Compliance: [FILL IN]
- Encryption: Domain-specific (OpenSSL / libsodium if needed)
- Memory safety: Smart pointers enforced, ASLR + DEP enabled, stack canaries
- Static analysis: PVS-Studio / Coverity / clang-tidy security checks

**Scalability**:
- Expected launch users: [FILL IN]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: Multi-threaded (std::jthread, thread pools), SIMD where applicable, zero-copy I/O

**Availability**:
- Uptime target: 99.99% (for services) / N/A (for libraries/tools)
- RTO: 5 minutes (process restart)
- RPO: 0 (stateless) or domain-specific
- Multi-region: [FILL IN: yes / no / future / N/A]

**Accessibility**:
- N/A for most systems-level code
- CLI tools: clear --help output, sensible defaults, shell completion
- Libraries: well-documented API, examples, Doxygen

**Observability**:
- Logging: spdlog (structured, async) / custom lightweight logger
- Metrics: Custom metrics exported to Prometheus (via prometheus-cpp) or StatsD
- Tracing: Core dumps + flamegraphs (perf, Instruments) / OpenTelemetry C++ SDK (if service)
- Alerting: Process health checks, watchdog timers, signal handlers

---

## 6. Testing Requirements *(pre-configured)*

**Test Coverage Target**: >= 80% line coverage (core logic), >= 90% (safety-critical paths)

**Required Test Types**:
- [x] Unit tests (Google Test / Catch2 — functions, classes, algorithms)
- [x] Integration tests (Google Test — module interactions, I/O)
- [x] Benchmark tests (Google Benchmark / Catch2 Benchmark — performance regression)
- [x] Sanitizer runs (AddressSanitizer, UndefinedBehaviorSanitizer, ThreadSanitizer)
- [x] Memory checks (Valgrind memcheck — leak detection, invalid access)
- [x] Static analysis (clang-tidy, cppcheck, PVS-Studio — zero warnings)
- [x] Fuzz testing (libFuzzer / AFL++ — input parsing, serialization)
- [ ] Platform portability tests (optional — Linux, macOS, Windows matrix)

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (clang-format, clang-tidy via pre-commit framework)
- [x] Branch protection (require PR reviews, passing CI)
- [ ] Automated build + test on multiple compilers (GCC, Clang, MSVC)
- [ ] Manual approval gate for release tags

**Testing Tools**: Google Test, Google Benchmark, Catch2, Valgrind, AddressSanitizer, UndefinedBehaviorSanitizer, ThreadSanitizer, libFuzzer, gcov/llvm-cov

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
- Domains/SSL: [FILL IN: $ or "N/A"]

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
| PVS-Studio License | Variable | Card | No — ask first |
| Conan Center (private) | Variable | Card | No — ask first |
| [FILL IN if needed] | [$X] | [Card / credits] | [No — ask first] |

**Cost Estimation Detail Level**: Detailed per-wave breakdown

**If costs exceed estimate**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true):
- [ ] All P0 features implemented and tested
- [ ] >= 80% test coverage on core logic, >= 90% on safety-critical paths
- [ ] Zero CRITICAL/HIGH security vulnerabilities
- [ ] Zero memory leaks (Valgrind + ASan clean)
- [ ] Zero undefined behavior (UBSan clean)
- [ ] Zero data races (TSan clean)
- [ ] Performance targets met (P99 < 1ms, CPU < 80%)
- [ ] Documentation complete (README, API docs via Doxygen, build guide)
- [ ] CI/CD pipeline tested and working
- [ ] Binary builds successfully on all target platforms
- [ ] Compiles with -Wall -Werror -Wextra on GCC and Clang

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
| Memory safety bugs (use-after-free, buffer overflows) | M | H | Smart pointers enforced, ASan + Valgrind in CI, code review focus on ownership |
| Platform portability issues | M | M | CMake presets per platform, CI matrix (Linux/macOS/Windows), abstraction layers for OS-specific code |
| Build time growth | M | L | Precompiled headers, ccache/sccache, modular build targets, forward declarations |
| [FILL IN] | [H/M/L] | [H/M/L] | [Plan] |

**Hard Constraints** (non-negotiable):
- C++20 minimum standard (`-std=c++20`)
- No raw `new`/`delete` — use `std::unique_ptr`, `std::shared_ptr`, `std::make_unique`
- Zero warnings: `-Wall -Werror -Wextra` on GCC and Clang
- Conventional commits enforced

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
- [x] Additional Systems Engineer (C++20, concurrency, I/O)
- [x] Additional QA Engineer (sanitizers, fuzz testing, benchmarks)
- [x] Optimization Specialist (profiling, SIMD, cache optimization, lock-free data structures)
- [x] Build Systems Specialist (CMake, Conan/vcpkg, cross-compilation)
- [x] Security Specialist (static analysis, unsafe code audit, hardening)

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (re-approve if > 20% over)
- PM documents in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements *(pre-configured)*

**Required evidence**:
- [x] Test coverage report (gcov/llvm-cov — HTML + lcov)
- [x] Google Benchmark results (performance regression comparison)
- [x] Valgrind memcheck report (zero leaks, zero errors)
- [x] AddressSanitizer clean run (zero issues)
- [x] UndefinedBehaviorSanitizer clean run (zero issues)
- [x] ThreadSanitizer clean run (zero data races)
- [x] clang-tidy analysis (zero warnings)
- [x] CI/CD pipeline screenshot (all checks green, multi-compiler matrix)
- [x] Binary size report (optimized, stripped)
- [x] Architecture diagram (module dependencies, data flow, memory ownership)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX + PDF (both)

---

## 12.1 Data Preservation & Uncertainty Policy *(pre-configured)*

**Data Preservation (No-Delete Rule)**:
- **Files**: archive to `.team/archive/` — NEVER delete
- **Table rows**: add `status: archived` — NEVER remove
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
**Branch**: `team/cpp/execution`
**Merge to main**: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — anything else the team should know]

---

*C++ Systems Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for C++20/23 + CMake + Conan/vcpkg systems programming*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
