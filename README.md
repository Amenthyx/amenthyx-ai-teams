# Amenthyx AI Teams

**65 specialized virtual engineering teams** powered by Claude Code's subagent orchestration.

Each team is a complete, self-contained execution protocol with specialized roles, domain-specific quality gates, wave-based parallel execution, evidence-driven development, atomic commits, comprehensive testing, real-time Mission Control dashboard, and automated reporting.

[![CI](https://github.com/Amenthyx/amenthyx-ai-teams/actions/workflows/ci.yml/badge.svg)](https://github.com/Amenthyx/amenthyx-ai-teams/actions/workflows/ci.yml)
[![Release](https://github.com/Amenthyx/amenthyx-ai-teams/actions/workflows/release.yml/badge.svg)](https://github.com/Amenthyx/amenthyx-ai-teams/actions/workflows/release.yml)

## Installation

### Option A: Pre-built Binary (recommended)

Download the latest release from [Releases](https://github.com/Amenthyx/amenthyx-ai-teams/releases/latest):

| Platform | Download |
|----------|----------|
| Windows | `amenthyx-windows.exe` |
| Linux | `amenthyx-linux` |
| macOS | `amenthyx-macos` |

### Option B: Install Script

```bash
# Linux / macOS
bash install.sh

# Windows (PowerShell as admin)
powershell -ExecutionPolicy Bypass -File install.ps1
```

The installer sets up the CLI and configures environment variables (ANTHROPIC_API_KEY, MC_PORT, etc.).

### Option C: From Source

```bash
git clone https://github.com/Amenthyx/amenthyx-ai-teams.git
cd amenthyx-ai-teams
python shared/amenthyx_cli.py --help
```

Requires Python 3.8+, no external dependencies.

## Quick Start

```bash
# 1. List available teams
amenthyx list

# 2. Initialize a project (interactive wizard)
amenthyx init

# 3. Activate a team
amenthyx activate --team fullStack --strategy strategy.md

# 4. Claude executes the team protocol
claude -p "$(cat .team/activation-prompt.md)"
```

### What happens on `activate`

1. Validates the team + strategy file
2. Creates `.team/` scaffold (evidence, reports, screenshots, plans)
3. Generates `mission-control.config.json` with agents, waves, budget
4. Launches Mission Control dashboard (splash screen until ready)
5. Generates activation prompt for Claude at `.team/activation-prompt.md`
6. Prints next steps: run Claude via CLI, interactive mode, or Claude.ai

## CLI Commands

```bash
amenthyx list                                          # List all 65 teams
amenthyx info fullStack                                # Show team details
amenthyx init                                          # Interactive project setup wizard
amenthyx activate --team fullStack --strategy s.md     # Activate team + launch dashboard
amenthyx dry-run --team fullStack --strategy s.md      # Simulate activation (no changes)
amenthyx merge-strategy my-idea.md                     # AI-merge strategy into Amenthyx format
amenthyx merge-strategy my-idea.md --cli               # Merge via Claude CLI (no API key)
amenthyx merge-strategy my-idea.md --prompt            # Generate prompt for Claude.ai
amenthyx validate-strategy strategy.md                 # Validate strategy compliance
amenthyx compose --from fullStack:BE,FE --output t.md  # Build custom hybrid team
amenthyx search "kubernetes"                           # Search teams by keyword
amenthyx templates                                     # List strategy templates
amenthyx test                                          # Run team consistency tests
amenthyx health                                        # Check project health
amenthyx version                                       # Show version
```

## Strategy Merger (AI-powered)

The strategy merger takes your project idea in any format and rewrites it into a fully Amenthyx-compliant strategy. Three modes, auto-detected:

| Mode | Flag | Requires |
|------|------|----------|
| Claude Code CLI | `--cli` (auto-detected) | `npm install -g @anthropic-ai/claude-code` + `claude login` |
| Claude API | (default if key set) | `ANTHROPIC_API_KEY` + `pip install anthropic` |
| Prompt file | `--prompt` (fallback) | Nothing |

```bash
# Auto-detects best mode
amenthyx merge-strategy my-idea.md --team fullStack

# Explicit modes
amenthyx merge-strategy my-idea.md --cli               # Claude Code CLI (no API key)
amenthyx merge-strategy my-idea.md --prompt             # Generates prompt file
```

## Mission Control Dashboard

Real-time monitoring dashboard for team execution. Opens automatically on `activate`.

- Live agent activity stream
- Kanban board with drag-and-drop
- Git commit timeline
- Test results panel
- Cost/budget monitoring
- UAT test management
- CI/CD pipeline status
- Evidence audit trail
- Session analytics with charts
- Splash screen while waiting for team activation

```bash
# Manual launch
cd shared/mission-control && npm run build && node dist/server/index.js

# Environment variables
MC_PORT=4201              # Dashboard port
MC_PROJECT_DIR=/my/proj   # Project root
MC_NO_OPEN=1              # Disable auto-open browser
```

## Available Teams (65)

### Core Development (01-12)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 01 | `fullStack` | Full-Stack Team | General full-stack web/mobile development |
| 02 | `flutter` | Flutter Mobile Team | Flutter/Dart cross-platform mobile apps |
| 03 | `dotnet` | .NET Enterprise Team | C#, VB.NET, .NET enterprise systems |
| 04 | `cpp` | C++ Systems Team | C++ systems/performance/real-time |
| 05 | `pythonData` | Python Data Team | Python data science, ML pipelines |
| 06 | `javaSpring` | Java Spring Team | Java, Spring Boot, enterprise backends |
| 07 | `react` | React Frontend Team | React, Next.js, TypeScript web apps |
| 08 | `nodejs` | Node.js Backend Team | Node.js, Express, NestJS backends |
| 09 | `rust` | Rust Systems Team | Rust systems programming, safety-critical |
| 10 | `goCloud` | Go Cloud Team | Go microservices, cloud-native |
| 11 | `swiftIOS` | Swift iOS Team | Swift, iOS, Apple ecosystem |
| 12 | `kotlinAndroid` | Kotlin Android Team | Kotlin, Android native |

### Infrastructure & Operations (13-14, 28-29)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 13 | `devops` | DevOps Team | CI/CD, automation, pipelines |
| 14 | `infraCloud` | Cloud Infrastructure Team | AWS/GCP/Azure, IaC, networking |
| 28 | `sre` | SRE Team | Site reliability, incident response, SLOs |
| 29 | `platformEng` | Platform Engineering Team | Developer platforms, golden paths |

### Data & AI (15-16, 38-40)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 15 | `dataEng` | Data Engineering Team | ETL, Spark, Airflow, data pipelines |
| 16 | `aiML` | AI/ML Team | Machine learning, deep learning, MLOps |
| 38 | `dataScience` | Data Science Team | Jupyter, pandas, visualization |
| 39 | `computerVision` | Computer Vision Team | OpenCV, YOLO, image/video |
| 40 | `nlpLLM` | NLP/LLM Team | NLP, fine-tuning, RAG, prompt engineering |

### Security (17)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 17 | `security` | Cybersecurity Team | Pentesting, compliance, security auditing |

### Specialized Systems (18-21, 41-44)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 18 | `embeddedIoT` | Embedded IoT Team | Firmware, embedded systems, IoT |
| 19 | `gameDev` | Game Dev Team | Unity, Unreal, game engines |
| 20 | `web3` | Blockchain Web3 Team | Smart contracts, DeFi, Web3 |
| 21 | `agenticAI` | Agentic AI Team | LangChain, agent frameworks |
| 41 | `roboticsROS` | Robotics/ROS Team | ROS2, SLAM, motion planning |
| 42 | `xrSpatial` | XR/Spatial Computing Team | Unity XR, ARKit, Vision Pro |
| 43 | `edgeComputing` | Edge Computing Team | Edge ML, TinyML, WASM |
| 44 | `quantumComputing` | Quantum Computing Team | Qiskit, Cirq |

### Web Frameworks (22-27)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 22 | `elixirPhoenix` | Elixir/Phoenix Team | Elixir, OTP, LiveView |
| 23 | `scalaSpark` | Scala/Spark Team | Scala, Apache Spark, Akka |
| 24 | `rubyRails` | Ruby on Rails Team | Ruby, Rails 7+, Hotwire |
| 25 | `phpLaravel` | PHP/Laravel Team | PHP 8+, Laravel 11 |
| 26 | `vueFrontend` | Vue.js Frontend Team | Vue 3, Nuxt 3, Pinia |
| 27 | `angularEnterprise` | Angular Enterprise Team | Angular 17+, RxJS, NgRx |

### Mobile (30)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 30 | `reactNative` | React Native Team | React Native, Expo |

### Specialized Engineering (31-37)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 31 | `databaseEng` | Database Engineering Team | PostgreSQL, MongoDB, Redis |
| 32 | `apiDesign` | API Design Team | REST, GraphQL, gRPC, OpenAPI |
| 33 | `lowcodeAutomation` | Low-Code Automation Team | n8n, Retool, Zapier |
| 34 | `qaAutomation` | QA Automation Team | Selenium, Cypress, Playwright |
| 35 | `techWriting` | Technical Writing Team | Docs, API docs, DX |
| 36 | `uxDesign` | UX/UI Design Team | Figma, design systems |
| 37 | `perfEng` | Performance Engineering Team | Load testing, profiling |

### Industry Verticals (45-48)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 45 | `fintech` | FinTech Team | Payments, banking, PCI-DSS |
| 46 | `healthtech` | HealthTech Team | HIPAA, HL7/FHIR |
| 47 | `edtech` | EdTech Team | LMS, learning analytics |
| 48 | `ecommerce` | E-Commerce Team | Shopify, marketplaces |

### Cross-Cutting (49-51)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 49 | `realtimeSystems` | Real-Time Systems Team | WebSockets, MQTT, Kafka |
| 50 | `accessibility` | Accessibility Team | WCAG 2.2, inclusive design |
| 51 | `openSource` | Open Source Team | Community, governance |

### Multimedia & Creative (52-59)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 52 | `afterEffectsMotion` | After Effects Motion Team | ExtendScript, motion design |
| 53 | `videoProduction` | Video Production Team | FFmpeg, DaVinci Resolve |
| 54 | `3dVfx` | 3D / VFX Team | Blender, Cinema 4D, Houdini |
| 55 | `audioEngineering` | Audio Engineering Team | Sound design, spatial audio |
| 56 | `2dAnimation` | 2D Animation Team | Lottie, Rive, GSAP |
| 57 | `creativeAI` | Creative AI Team | Stable Diffusion, ComfyUI |
| 58 | `streamingBroadcast` | Streaming & Broadcast Team | OBS, NDI, RTMP |
| 59 | `mediaPipeline` | Media Pipeline Team | Render farms, CDN delivery |

### Social Media & Marketing (60)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 60 | `socialMedia` | Social Media Engineering Team | Analytics, marketing automation |

### Advanced Engineering (61-65)

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 61 | `mlops` | MLOps Team | Model serving, feature stores |
| 62 | `devRel` | Developer Relations Team | API docs, SDKs, community |
| 63 | `compliance` | Compliance & Governance Team | SOC2, GDPR, policy-as-code |
| 64 | `migration` | Migration & Modernization Team | Legacy migration, strangler fig |
| 65 | `promptEng` | Prompt Engineering Team | Prompt design, RAG, guardrails |

## How It Works

### Activation Flow

```
amenthyx activate --team fullStack --strategy strategy.md
    |
    v
1. Validate team + strategy
2. Create .team/ scaffold
3. Generate mission-control.config.json
4. Launch Mission Control (splash -> dashboard)
5. Generate .team/activation-prompt.md
    |
    v
claude -p "$(cat .team/activation-prompt.md)"
    |
    v
Team Lead boots -> reads protocol -> spawns agents in waves
```

### Wave Execution

```
Wave 0: Init          TL boots, reads strategy, creates .team/
Wave 1: Planning      PM creates project board, milestones, issues
Wave 1.5: Judge       Evaluates PM plans with 7-criterion rubric
Wave 2: Engineering   Parallel agents: implement, test, evidence
Wave 2.5: Code Review CR agent reviews for OWASP, quality, drift
Wave 2.7: Retro       Analyzes metrics, extracts learnings
Wave 3: QA            Full test pyramid, evidence verification
Wave 3.5: Bug Fix     Re-spawn failing agents if needed
Wave 3.8: Dep Audit   CVEs, license compliance, abandoned packages
Wave 4: Release       Deployment, changelog, rollback plan
Wave 5: Reporting     Final PPTX + PDF, close milestones
```

### Evidence Structure

```
.team/evidence/
  manifests/       # Per-agent evidence manifests
  builds/          # Build artifacts and logs
  tests/           # Test results (unit, integration, e2e, perf, security)
  screenshots/     # Visual proof
  runtime/         # Health checks, running app proof
  deps/            # Dependency audit reports
  ci/              # GitHub Actions local test results (act)
```

## Strategy Templates

Pre-built strategy files for common project types:

| Template | Project Type | Stack |
|----------|-------------|-------|
| `STRATEGY_SAAS_MVP.md` | SaaS web app | Next.js, PostgreSQL, Redis |
| `STRATEGY_MOBILE_APP.md` | Mobile app | Flutter, Firebase |
| `STRATEGY_API_BACKEND.md` | API backend | Go, PostgreSQL, K8s |
| `STRATEGY_DATA_PIPELINE.md` | Data pipeline | Python, Kafka, Spark |
| `STRATEGY_LANDING_PAGE.md` | Landing page | Astro, Tailwind, Sanity |

```bash
amenthyx templates                              # List all templates
cp shared/templates/STRATEGY_SAAS_MVP.md s.md   # Copy template
amenthyx activate --team fullStack --strategy s.md
```

## Releasing

Releases are triggered when a Pull Request is **merged** with a version tag in the PR title:

| PR Title Tag | Bump | Example |
|--------------|------|---------|
| `[MAJOR]` | Major (breaking changes) | `v1.0.0 -> v2.0.0` |
| `[MINOR]` | Minor (new features) | `v1.0.0 -> v1.1.0` |
| `[PATCH]` | Patch (bug fixes) | `v1.0.0 -> v1.0.1` |

### How to release

```bash
# 1. Create a branch and make changes
git checkout -b feat/new-feature
git commit -m "feat: add awesome feature"
git push origin feat/new-feature

# 2. Open a PR with version tag in the title
gh pr create --title "feat: add awesome feature [MINOR]" --body "..."

# 3. Get PR approved and merge -> release is automatic
```

The release pipeline automatically:
1. Detects `[MAJOR]`, `[MINOR]`, or `[PATCH]` in the **merged PR title**
2. Calculates the next version from the latest git tag
3. Builds encrypted binaries for Windows, Linux, and macOS
4. Creates a git tag and GitHub Release with checksums
5. All source code is encrypted inside the binary (zero readable .md or .py)

PRs without a version tag in the title are merged normally without triggering a release.

## Requirements

- **Claude Code** CLI with Task tool (subagent orchestration)
- **Python 3.8+** (no external dependencies for CLI)
- **Node.js 20+** (for Mission Control dashboard)
- **GitHub CLI** (`gh`) for PM GitHub integration
- **act** ([nektos/act](https://github.com/nektos/act)) for local CI testing (optional)

## Repository Structure

```
amenthyx-ai-teams/
  README.md
  STRATEGY_TEMPLATE.md          # Strategy template (v3.4)
  install.sh                    # Linux/macOS installer
  install.ps1                   # Windows installer
  shared/
    amenthyx_cli.py             # CLI tool
    strategy_merger.py          # AI strategy merger
    strategy_validator.py       # Strategy file validator
    team_test_suite.py          # TEAM.md consistency tests
    team_composer.py            # Custom team builder
    team_recommender.py         # AI team recommender
    strategy_diff.py            # Strategy comparison tool
    team_compatibility.py       # Team compatibility matrix
    bundler.py                  # Encrypted vault builder
    ACTIVATION_PROTOCOL.md      # How --team and --strategy work
    ENHANCED_EXECUTION_PROTOCOL.md
    JUDGE_PROTOCOL.md
    CODE_REVIEW_PROTOCOL.md
    ... (18 protocol files)
    templates/                  # 5 pre-built strategy templates
    mission-control/            # React + Express monitoring dashboard
  01-full-stack/TEAM.md
  02-flutter-mobile/TEAM.md
  ... (65 team directories)
  .github/workflows/
    ci.yml                      # CI pipeline (validate, build, lint)
    release.yml                 # Auto-release on [MAJOR]/[MINOR]/[PATCH]
```

## License

MIT License. See [LICENSE](LICENSE).
