# Amenthyx AI Teams

**65 specialized virtual engineering teams** powered by Claude Code's subagent orchestration.

Each team is a complete, self-contained execution protocol with specialized roles, domain-specific quality gates, wave-based parallel execution, evidence-driven development, atomic commits, comprehensive testing, and automated reporting.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Amenthyx/amenthyx-ai-teams.git
cd amenthyx-ai-teams

# Activate a team with your strategy
claude --dangerously-skip-permissions \
  "--team fullStack --strategy path/to/your-strategy.md"
```

Claude reads the team protocol, adjusts your strategy to the Amenthyx standard format, and begins wave-based execution.

## How It Works

1. You pick a **team** (e.g. `fullStack`, `flutter`, `devops`) and provide a **strategy file** describing your project
2. Claude reads the team's `TEAM.md` protocol and your strategy
3. The Team Lead agent boots, reads the protocol, and spawns specialist agents in waves
4. Each wave has quality gates — agents produce evidence, tests, and atomic commits

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

## Strategy File

Your strategy file describes what you want built. Write it in any format — Claude will auto-adjust it to the Amenthyx standard structure on activation.

The standard template is at `STRATEGY_TEMPLATE.md` for reference.

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

## Repository Structure

```
amenthyx-ai-teams/
  README.md
  STRATEGY_TEMPLATE.md              # Standard strategy template
  shared/
    ACTIVATION_PROTOCOL.md           # How --team and --strategy work
    ENHANCED_EXECUTION_PROTOCOL.md
    JUDGE_PROTOCOL.md
    CODE_REVIEW_PROTOCOL.md
    ... (protocol files)
  01-full-stack/TEAM.md
  02-flutter-mobile/TEAM.md
  ... (65 team directories)
```

## Requirements

- **Claude Code** CLI with Task tool (subagent orchestration)
- **GitHub CLI** (`gh`) for PM GitHub integration
- **act** ([nektos/act](https://github.com/nektos/act)) for local CI testing (optional)

## License

MIT License. See [LICENSE](LICENSE).
