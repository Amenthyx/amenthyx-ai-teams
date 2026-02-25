# Rust Systems Team
# Activation: `--team rust`
# Focus: Rust systems programming, safety-critical and high-performance software
# Version: 3.0 — Enhanced Execution Protocol

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Quality Gates](#7-quality-gates)
8. [Evidence & Proof Protocol](#8-evidence--proof-protocol)
9. [Local Install & Test Protocol](#9-local-install--test-protocol)
10. [Atomic Commit Protocol](#10-atomic-commit-protocol)
11. [Comprehensive Testing Matrix](#11-comprehensive-testing-matrix)
12. [GitHub Actions — Local Testing](#12-github-actions--local-testing)
13. [PM Kanban — Real-Time Tracking](#13-pm-kanban--real-time-tracking)
14. [`.team/` Directory Layout](#14-team-directory-layout)
15. [Reporting System](#15-reporting-system)
16. [Error Handling & Session Management](#16-error-handling--session-management)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team rust --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> — this becomes PROJECT STRATEGY
3. Read shared/ENHANCED_EXECUTION_PROTOCOL.md for shared protocols
4. Create `.team/` directory structure (see Section 14)
5. Spawn Team Leader agent (foreground — this is the orchestrator)
6. Team Leader spawns PM agent (foreground — must complete before others)
7. PM produces Project Charter + Initial Plan + creates GitHub Project
8. Team Leader reviews PM output, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, performance targets, safety requirements, and success criteria.

### Quick Reference — Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between safety guarantees and performance targets. Ensures every deliverable has evidence artifacts.
- **Persona**: "You are the Team Leader of a 9-person Rust systems team. You coordinate all work, make final architectural decisions on crate boundaries, trait designs, and unsafe usage policies. You enforce quality gates including Miri safety checks, clippy cleanliness, and benchmark regressions. You require evidence (cargo test output, clippy logs, Miri results) for every deliverable. You never write production code directly — you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management, real-time Kanban.
- **Persona**: "You are the Project Manager. You create all planning artifacts and manage the project via GitHub Projects V2 using `gh` CLI. You create milestones, issues with labels, and track progress in real time. You generate PPTX status presentations (with evidence: compilation stats, test counts, benchmark data) using python-pptx and PDF summaries using reportlab. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Systems Architect (SYSARC)
- **Role**: Crate architecture, trait hierarchies, module boundaries, unsafe policy.
- **Persona**: "You are the Systems Architect. You design the crate graph, define public API surfaces with trait-based abstractions, establish module boundaries, create error type hierarchies, and define the unsafe usage policy. You determine which crates use `#![forbid(unsafe_code)]` and which require controlled unsafe blocks with SAFETY comments. You produce architecture documents in `.team/architecture/`."
- **Spawning**: Wave 2 (parallel)

### 2.4 Core Engineer (CORE)
- **Role**: Core library implementation, data structures, algorithms, type system design.
- **Persona**: "You are the Core Engineer. You implement core data structures, algorithms, and business logic in safe Rust. You leverage the type system for correctness (newtype patterns, typestate, phantom types). You write comprehensive unit tests and doc-tests. You use Serde for serialization, thiserror/anyhow for errors, and follow zero-copy patterns where performance matters."
- **Spawning**: Wave 2 (parallel)

### 2.5 Async/Concurrency Engineer (ASYNC)
- **Role**: Async runtime, concurrency primitives, parallelism, performance.
- **Persona**: "You are the Async/Concurrency Engineer. You design and implement async architectures using Tokio. You handle task spawning, channels (mpsc, oneshot, broadcast), mutexes, concurrent data structures, cancellation safety, and backpressure. You build async APIs with Axum or Actix-web when needed. You produce async architecture documents in `.team/async-runtime/`."
- **Spawning**: Wave 2 (parallel)

### 2.6 FFI/Integration Engineer (FFI)
- **Role**: Foreign function interfaces, C interop, WASM targets, platform integration.
- **Persona**: "You are the FFI/Integration Engineer. You design and implement C FFI boundaries using `extern \"C\"`, cbindgen, and bindgen. You handle WASM compilation targets via wasm-bindgen/wasm-pack. You manage platform-specific code with cfg attributes, build scripts (build.rs), and conditional compilation. You ensure all unsafe FFI code has thorough SAFETY comments. You produce integration documents in `.team/ffi/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 QA Engineer — Rust Testing (QA)
- **Role**: Testing strategy, property-based testing, fuzzing, benchmark validation.
- **Persona**: "You are the QA Engineer specializing in Rust testing. You create test strategies covering `cargo test` unit/integration tests, proptest for property-based testing, cargo-fuzz for fuzz testing, Miri for undefined behavior detection, and criterion for benchmark validation. You enforce zero warnings, zero clippy lints, and produce QA sign-off documents with evidence artifacts in `.team/qa/`."
- **Spawning**: Wave 3 (sequential gate)

### 2.8 Release Manager (RM)
- **Role**: Release coordination, crate publishing, versioning, deployment sign-off.
- **Persona**: "You are the Release Manager. You coordinate releases: release branches, semantic versioning following Rust API guidelines, changelogs, crate publishing strategy (crates.io or private registry), MSRV policy, binary distribution plans, and release notes. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.9 Marketing Strategist (MKT)
- **Role**: Crate positioning, documentation strategy, community engagement.
- **Persona**: "You are the Marketing Strategist. You create crate documentation strategies, README content, crates.io descriptions, community engagement plans, blog post drafts, and comparison guides against competing crates."
- **Spawning**: Wave 1.5 (background, parallel with Legal)

### 2.10 Legal/Compliance Attorney (LEGAL)
- **Role**: License compliance, dependency audit, export controls.
- **Persona**: "You are the Legal/Compliance Attorney. You review dependency license compatibility (MIT, Apache-2.0, GPL implications), audit supply chain security via cargo-audit and cargo-deny, review export control considerations for cryptographic code, and ensure license headers are correct. You produce compliance checklists in `.team/legal/`."
- **Spawning**: Wave 1.5 (background, parallel with Marketing)

---

## 3. ORGANIZATIONAL HIERARCHY

```
                        +-----------+
                        |   USER    |
                        +-----+-----+
                              |
                     +--------v--------+
                     |  TEAM LEADER    |
                     |  (Orchestrator) |
                     +--------+--------+
                              |
            +-----------------+------------------+
            |                 |                  |
     +------v------+  +------v------+  +--------v--------+
     |     PM      |  | Marketing   |  |   Attorney      |
     | (Planning)  |  | (Crate Docs)|  |   (Licensing)   |
     +------+------+  +-------------+  +-----------------+
            |
   +--------+--------+-----------+
   |        |        |           |
+--v----+ +-v---+ +--v----+ +---v--+
| SYSARC| | CORE| | ASYNC | | FFI  |
+--+----+ +-+---+ +--+----+ +---+--+
   |        |        |           |
   +--------+--------+-----------+
                  |
           +------v------+
           |     QA      |
           +------+------+
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
  description="PM: Project planning for Rust systems project",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan -> `.team/MILESTONES.md` (architecture, core crate, async layer, FFI, testing, release)
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Attorney (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Crate documentation strategy", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/marketing/")

Task(subagent_type="general-purpose", description="LEGAL: License compliance review", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + PROJECT CHARTER -> write to .team/legal/")
```

### Spawn: Engineering Wave (Background, Parallel -- 4 agents)
```
SYSARC -> .team/architecture/    (CRATE_GRAPH.md, TRAIT_HIERARCHY.md, MODULE_BOUNDARIES.md, UNSAFE_POLICY.md)
CORE   -> .team/core-engine/     (DATA_STRUCTURES.md, ERROR_TYPES.md, TYPE_PATTERNS.md, API_SURFACE.md)
ASYNC  -> .team/async-runtime/   (RUNTIME_DESIGN.md, CHANNEL_PATTERNS.md, CANCELLATION.md, BACKPRESSURE.md)
FFI    -> .team/ffi/             (FFI_BOUNDARY.md, C_API.md, WASM_TARGETS.md, BUILD_SCRIPTS.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, TEST_CASES.md, MIRI_RESULTS.md, FUZZ_RESULTS.md, BENCHMARK_REPORT.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, MSRV_POLICY.md, CRATE_PUBLISH_PLAN.md, RELEASE_NOTES.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} ...
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per deliverable |
| Labels | -- | Role + priority + wave labels |
| Releases | `.team/releases/` | `gh release create` |

### Domain-Specific Milestones
1. **Architecture & Design** -- crate graph, trait hierarchy, unsafe policy defined
2. **Core Crate** -- data structures, type system, error handling implemented
3. **Async Layer** -- Tokio runtime, channels, task management operational
4. **FFI/Integration** -- C API, WASM targets, platform bindings complete
5. **Safety Validation** -- Miri clean, fuzz tests passing, clippy zero warnings
6. **Benchmarks & Optimization** -- criterion baselines established, no regressions
7. **Release** -- crate published, binaries distributed, documentation complete

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure
+-- Verify rustup, cargo, stable + nightly toolchains
+-- Run: rustc --version && cargo --version (capture as evidence)

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: crate documentation, README, community engagement
+-- Attorney: dependency license audit, cargo-deny config, export controls
+-- These run concurrently with Wave 2

WAVE 2: ENGINEERING (Background, Parallel -- 4 agents)
+-- SYSARC, CORE, ASYNC, FFI -- all in parallel
+-- Each agent captures build/test evidence to .team/evidence/
+-- SYNC: TL waits for all 4 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF (include evidence artifacts)
+-- PM: Update GitHub issues (move cards in real time)
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: cargo test (unit + integration), Miri, cargo-fuzz, criterion benchmarks
+-- QA: clippy (zero warnings), cargo-audit (zero advisories)
+-- QA: Capture all test output to .team/evidence/
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal compliance + Marketing ready
+-- RM: checklist, changelog, MSRV policy, crate publish plan, release notes
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF (with evidence summary)
+-- PM: close all GitHub milestones
+-- TL: present summary to user
```

---

## 7. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| **Evidence Gate** | Every task | Evidence artifact exists in `.team/evidence/` | Block task completion |
| **Install Gate** | After setup | `cargo build` succeeds, dependencies resolve | Fix Cargo.toml / Cargo.lock |
| Compilation Gate | After Engineering | `cargo build` zero warnings, `cargo clippy -- -D warnings` clean | Re-spawn CORE/ASYNC |
| Test Gate | After Engineering | `cargo test --all` passes, all doc-tests pass | Re-spawn CORE |
| Miri Safety Check | After QA | `cargo +nightly miri test` zero UB detected | Re-spawn CORE/FFI |
| Benchmark Gate | After QA | criterion: no regressions > 5% from baseline | Re-spawn CORE/ASYNC for optimization |
| Dependency Audit | After LEGAL | `cargo audit` zero known vulnerabilities | Re-spawn CORE to update deps |
| Fuzz Test Gate | After QA | cargo-fuzz: 10M+ iterations with zero crashes | Re-spawn CORE/FFI |
| **Secrets Gate** | Before commit | No API keys, tokens, credentials in staged files | Block commit, alert TL |
| **CI Gate** | Before release | `act` local CI run passes all workflow jobs | Fix workflow, re-run |
| Release Ready | Before RM | QA PASS + Legal clear + Marketing ready | Resolve blockers |
| Deployment Approved | After RM | `DEPLOYMENT_SIGNOFF.md` approved | RM lists blocking items |

---

## 8. EVIDENCE & PROOF PROTOCOL

Every engineering deliverable MUST include verifiable evidence. No exceptions.

### Evidence Requirements by Role

| Role | Evidence Required | Format |
|------|-------------------|--------|
| SYSARC | Crate dependency graph output, module structure | `.txt` / `.dot` |
| CORE | `cargo test` output, `cargo clippy` output, doc-test results | `.txt` logs |
| ASYNC | Tokio runtime tests, channel throughput benchmarks | `.txt` / `.json` |
| FFI | `cbindgen` output, WASM build output, FFI test results | `.txt` / `.h` |
| QA | Miri results, fuzz corpus stats, criterion benchmark JSON | `.txt` / `.json` |
| RM | `cargo build --release` output, binary size, crate package verify | `.txt` logs |

### Evidence Collection Commands
```bash
# Cargo build (release)
cargo build --release 2>&1 | tee .team/evidence/cargo-build-release.txt

# Cargo test with output
cargo test --all --verbose 2>&1 | tee .team/evidence/cargo-test-output.txt

# Clippy (deny all warnings)
cargo clippy --all-targets --all-features -- -D warnings 2>&1 | tee .team/evidence/clippy-output.txt

# Cargo audit
cargo audit 2>&1 | tee .team/evidence/cargo-audit.txt

# Miri (nightly required)
cargo +nightly miri test 2>&1 | tee .team/evidence/miri-results.txt

# Criterion benchmarks
cargo bench --bench '*' 2>&1 | tee .team/evidence/criterion-output.txt

# Cargo fuzz (run for minimum iterations)
cargo fuzz run fuzz_target -- -max_total_time=60 2>&1 | tee .team/evidence/fuzz-results.txt

# Binary size
ls -lh target/release/$(cargo metadata --no-deps --format-version 1 | jq -r '.packages[0].name') > .team/evidence/binary-size.txt

# Doc generation
cargo doc --no-deps 2>&1 | tee .team/evidence/cargo-doc.txt
```

### Evidence Naming Convention
```
.team/evidence/{wave}-{role}-{artifact}.{ext}
Example: w2-core-cargo-test.txt, w3-qa-miri-results.txt
```

---

## 9. LOCAL INSTALL & TEST PROTOCOL

### Step 1: Environment Verification
```bash
# Verify Rust toolchain
rustc --version        # Stable toolchain
rustup show            # All installed toolchains
cargo --version        # Cargo version

# Verify nightly for Miri
rustup toolchain list | grep nightly

# Save environment evidence
echo "rustc: $(rustc --version)" > .team/evidence/env-versions.txt
echo "cargo: $(cargo --version)" >> .team/evidence/env-versions.txt
echo "nightly: $(rustc +nightly --version 2>/dev/null || echo 'not installed')" >> .team/evidence/env-versions.txt
```

### Step 2: Install Required Components
```bash
# Install nightly toolchain (for Miri)
rustup toolchain install nightly

# Install Miri
rustup +nightly component add miri

# Install cargo-audit
cargo install cargo-audit

# Install cargo-fuzz
cargo install cargo-fuzz

# Install cargo-deny (license/advisory checking)
cargo install cargo-deny

# Install criterion (benchmark harness -- added via Cargo.toml)
# No separate install needed, it's a dev-dependency
```

### Step 3: Build Verification
```bash
# Debug build (fast compilation, debug assertions)
cargo build 2>&1 | tee .team/evidence/cargo-build-debug.txt

# Release build (optimized)
cargo build --release 2>&1 | tee .team/evidence/cargo-build-release.txt

# Check for warnings
cargo build 2>&1 | grep -c "warning" > .team/evidence/warning-count.txt
```

### Step 4: Full Test Run
```bash
# All tests (unit + integration + doc-tests)
cargo test --all --verbose 2>&1 | tee .team/evidence/cargo-test-full.txt

# Count passing tests
grep -c "test .* ok" .team/evidence/cargo-test-full.txt > .team/evidence/test-count.txt
```

### Step 5: Safety Verification
```bash
# Clippy lint check (strict)
cargo clippy --all-targets --all-features -- -D warnings 2>&1 | tee .team/evidence/clippy-check.txt

# Miri undefined behavior check
cargo +nightly miri test 2>&1 | tee .team/evidence/miri-check.txt

# Verify both passed
grep -q "error" .team/evidence/clippy-check.txt && echo "CLIPPY: FAIL" || echo "CLIPPY: PASS"
grep -q "undefined behavior" .team/evidence/miri-check.txt && echo "MIRI: FAIL" || echo "MIRI: PASS"
```

---

## 10. ATOMIC COMMIT PROTOCOL

### Commit Convention
All commits follow Conventional Commits with scope tracking:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
PM-TASK: <github-issue-number>
```

### Types
| Type | Usage |
|------|-------|
| `feat` | New public API, data structure, module |
| `fix` | Bug fix, UB fix, soundness fix |
| `test` | Test-only changes (new tests, property tests) |
| `refactor` | Code cleanup, trait simplification |
| `chore` | Config, tooling, Cargo.toml changes |
| `docs` | Documentation, doc-comments, examples |
| `perf` | Performance improvement with benchmark proof |
| `safety` | Unsafe code review, SAFETY comment addition, Miri fix |

### Scopes
```
core, async, ffi, arch, bench, ci, docs, cargo
```

### Commit Flow
```bash
# 1. Stage specific files (NEVER git add . or git add -A)
git add src/core/data_structures.rs
git add src/core/tests/data_structures_test.rs

# 2. Run pre-commit checks
cargo clippy --all-targets -- -D warnings
cargo test --all

# 3. Commit with PM task reference
git commit -m "feat(core): implement B-tree with custom comparator

- Generic B-tree supporting custom Ord implementations
- Zero-copy iteration via lending iterators
- Doc-tests for all public methods
- Property tests via proptest for insert/delete invariants

PM-TASK: #15"

# 4. PM updates GitHub issue
gh issue comment 15 --body "Commit $(git rev-parse --short HEAD): B-tree implemented. Evidence: .team/evidence/w2-core-cargo-test.txt"
```

### Pre-Commit Checks
```bash
# Automated pre-commit (TL enforces)
cargo fmt -- --check           # Formatting
cargo clippy -- -D warnings    # Lints
cargo test --all               # All tests pass
cargo audit                    # No advisories
# Verify no secrets in staged files
git diff --cached --name-only | xargs grep -l 'API_KEY\|SECRET\|PASSWORD\|TOKEN' && echo "BLOCKED: Secrets detected" && exit 1
```

---

## 11. COMPREHENSIVE TESTING MATRIX

### Unit Tests (cargo test)
```bash
# Run all unit tests
cargo test --all --verbose

# Run specific crate tests
cargo test -p my-core-crate

# Run with output capture disabled (see println! output)
cargo test --all -- --nocapture
```

| Layer | What to Test | Tools |
|-------|-------------|-------|
| Data structures | Insert, delete, lookup, iteration, edge cases | `#[test]`, proptest |
| Error types | Error conversion, Display impl, source chaining | `#[test]` |
| Serialization | Serde round-trip, backward compatibility | `#[test]`, serde_test |
| Async tasks | Spawn, join, cancellation, timeout | `#[tokio::test]` |
| FFI boundaries | Null pointers, invalid arguments, memory safety | `#[test]`, Miri |
| Public API | Doc-tests for every public function | `cargo test --doc` |

### Property-Based Tests (proptest)
```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn insert_then_contains(key in any::<u64>(), value in any::<String>()) {
        let mut map = MyMap::new();
        map.insert(key, value.clone());
        prop_assert!(map.contains_key(&key));
        prop_assert_eq!(map.get(&key), Some(&value));
    }
}
```

### Fuzz Testing (cargo-fuzz)
```bash
# Initialize fuzz targets
cargo fuzz init

# Run fuzz target
cargo fuzz run fuzz_target -- -max_total_time=300

# Evidence: fuzz corpus size and crash count
ls fuzz/corpus/fuzz_target/ | wc -l > .team/evidence/fuzz-corpus-size.txt
ls fuzz/artifacts/fuzz_target/ 2>/dev/null | wc -l > .team/evidence/fuzz-crashes.txt
```

### Miri (Undefined Behavior Detection)
```bash
# Run all tests under Miri
cargo +nightly miri test 2>&1 | tee .team/evidence/miri-results.txt

# Miri flags for thorough checking
MIRIFLAGS="-Zmiri-disable-isolation -Zmiri-symbolic-alignment-check" cargo +nightly miri test
```

### Criterion Benchmarks
```bash
# Run all benchmarks
cargo bench --bench '*' 2>&1 | tee .team/evidence/benchmark-output.txt

# Compare with baseline
cargo bench --bench '*' -- --save-baseline current
cargo bench --bench '*' -- --baseline current

# Threshold: no regression > 5%
```

### Cargo Audit & Deny
```bash
# Security advisory check
cargo audit 2>&1 | tee .team/evidence/cargo-audit.txt

# License + advisory + source check
cargo deny check 2>&1 | tee .team/evidence/cargo-deny.txt
```

---

## 12. GITHUB ACTIONS -- LOCAL TESTING

### Install `act` for Local CI
```bash
# Install act (GitHub Actions local runner)
# macOS
brew install act

# Windows (scoop)
scoop install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### Rust CI Workflow (`.github/workflows/ci.yml`)
```yaml
name: Rust CI
on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: clippy, rustfmt
      - uses: Swatinem/rust-cache@v2
      - run: cargo fmt -- --check
      - run: cargo clippy --all-targets --all-features -- -D warnings
      - run: cargo build --release
      - run: cargo test --all --verbose

  miri:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@nightly
        with:
          components: miri
      - run: cargo +nightly miri test

  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: rustsec/audit-check@v1

  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: Swatinem/rust-cache@v2
      - run: cargo bench --bench '*' -- --output-format bencher | tee bench-output.txt
```

### Run Locally with `act`
```bash
# Run full CI
act push 2>&1 | tee .team/evidence/act-ci-output.txt

# Run specific job
act push -j check 2>&1 | tee .team/evidence/act-check-output.txt
act push -j miri 2>&1 | tee .team/evidence/act-miri-output.txt

# Verify result
grep -q "Job succeeded" .team/evidence/act-ci-output.txt && echo "CI: PASS" || echo "CI: FAIL"
```

---

## 13. PM KANBAN -- REAL-TIME TRACKING

### GitHub Projects V2 Setup
```bash
# Create project board
gh project create --title "Rust Systems - $(date +%Y-%m-%d)" --owner @me

# Add custom fields
gh project field-create <PROJECT_ID> --name "Wave" --data-type "SINGLE_SELECT" \
  --single-select-options "Wave 1,Wave 1.5,Wave 2,Wave 2.5,Wave 3,Wave 4,Wave 5"

gh project field-create <PROJECT_ID> --name "Evidence" --data-type "TEXT"
gh project field-create <PROJECT_ID> --name "Unsafe Blocks" --data-type "NUMBER"
gh project field-create <PROJECT_ID> --name "Test Count" --data-type "NUMBER"
```

### Real-Time Updates
PM updates issue status as work progresses:
```bash
# Move task to In Progress
gh issue edit <NUMBER> --add-label "status:in-progress" --remove-label "status:todo"

# Move task to Done with evidence
gh issue comment <NUMBER> --body "DONE. Evidence: cargo test passed $(grep -c 'test .* ok' .team/evidence/w2-core-cargo-test.txt) tests."
gh issue edit <NUMBER> --add-label "status:done" --remove-label "status:in-progress"

# Track unsafe block count
gh project item-edit --project-id <PROJECT_ID> --id <ITEM_ID> --field-id <UNSAFE_FIELD_ID> --number 3
```

### Kanban Columns
| Column | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| Backlog | Issue created with labels | Assigned to wave |
| Todo | Assigned to agent in current wave | Agent starts work |
| In Progress | Agent actively working | Deliverable + evidence complete |
| In Review | Evidence submitted, clippy clean | TL reviews and approves evidence |
| Done | TL approved, Miri clean, evidence verified | Issue closed |

---

## 14. `.team/` DIRECTORY LAYOUT

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
|   +-- env-versions.txt
|   +-- cargo-build-release.txt
|   +-- cargo-test-output.txt
|   +-- clippy-output.txt
|   +-- miri-results.txt
|   +-- cargo-audit.txt
|   +-- criterion-output.txt
|   +-- fuzz-results.txt
|   +-- act-ci-output.txt
+-- ci/
|   +-- .github/workflows/ci.yml
|   +-- act-results/
|   +-- CI_VALIDATION.md
+-- architecture/
|   +-- CRATE_GRAPH.md
|   +-- TRAIT_HIERARCHY.md
|   +-- MODULE_BOUNDARIES.md
|   +-- UNSAFE_POLICY.md
+-- core-engine/
|   +-- DATA_STRUCTURES.md
|   +-- ERROR_TYPES.md
|   +-- TYPE_PATTERNS.md
|   +-- API_SURFACE.md
+-- async-runtime/
|   +-- RUNTIME_DESIGN.md
|   +-- CHANNEL_PATTERNS.md
|   +-- CANCELLATION.md
|   +-- BACKPRESSURE.md
+-- ffi/
|   +-- FFI_BOUNDARY.md
|   +-- C_API.md
|   +-- WASM_TARGETS.md
|   +-- BUILD_SCRIPTS.md
+-- benchmarks/
|   +-- BASELINE.md
|   +-- CRITERION_CONFIG.md
|   +-- REGRESSION_TRACKING.md
+-- qa/
|   +-- TEST_STRATEGY.md
|   +-- TEST_CASES.md
|   +-- MIRI_RESULTS.md
|   +-- FUZZ_RESULTS.md
|   +-- BENCHMARK_REPORT.md
|   +-- QA_SIGNOFF.md
+-- releases/
+-- marketing/
+-- legal/
```

---

## 15. REPORTING SYSTEM

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
  - Includes evidence: compilation times, test counts, Miri status, unsafe block inventory
  - Slide for each completed task with commit hash and evidence reference
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
  - Test count trends, benchmark regression tracking, clippy warning counts
  - Per-agent task completion with evidence links
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion
- Reports include compilation times, test counts, Miri status, benchmark baselines, unsafe block inventory, and crate dependency graph

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Recovery
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Compilation failure**: Capture full compiler error output, inject into CORE/ASYNC re-spawn prompt
- **Miri UB detection**: Escalate to SYSARC and FFI immediately, block release until resolved
- **Cargo.lock conflict**: Run `cargo update`, verify build, commit updated lockfile
- **Fuzz crash**: Capture crash artifact, create regression test, re-spawn CORE/FFI

### Session Commands

| Command | Action |
|---------|--------|
| `--team rust --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

*Rust Systems Team v3.0 -- Amenthyx AI Teams*
*9 Roles | 5 Waves | 13 Gates | Evidence-Driven | Strategy-Driven | GitHub-Integrated*
*Enhanced: Evidence Protocol | Local Install | Atomic Commits | Testing Matrix | Local CI | Real-Time Kanban*
