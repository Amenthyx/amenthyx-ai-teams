# Activation Protocol v3.0

## How `--team` and `--strategy` Work

### Syntax

```
--team <teamName> --strategy <path/to/strategy.md>
```

### Discovery Flow

When the user says `--team <name> --strategy <path>`, the following sequence executes:

#### 1. Local Cache Check

```bash
# Check if teams repo is cached locally
if [ -d "$HOME/.amenthyx-ai-teams" ]; then
    cd "$HOME/.amenthyx-ai-teams"
    git pull origin main --quiet
else
    gh repo clone Amenthyx/amenthyx-ai-teams "$HOME/.amenthyx-ai-teams"
fi
```

#### 2. Team Discovery

```bash
# List all available teams by scanning folder names
ls -d "$HOME/.amenthyx-ai-teams"/*/
# Each folder contains a TEAM.md with an activation keyword in its header
```

#### 3. Team Matching

The activation protocol reads the first line of each `TEAM.md` for the activation keyword:

```
# Format in TEAM.md header:
# Activation: `--team <keyword>`
```

Matching rules:
- **Exact match**: `--team fullStack` matches `Activation: --team fullStack`
- **Case-insensitive**: `--team FLUTTER` matches `--team flutter`
- **Partial match**: `--team react` matches `--team react` (prefix match on keyword)

#### 4. No Match Handling

If no team matches the given name, print available teams:

```
No team found matching "<name>". Available teams:

  --team fullStack          Full-Stack Team (general full-stack development)
  --team flutter            Flutter Mobile Team (Flutter/Dart mobile apps)
  --team dotnet             .NET Enterprise Team (C#, .NET enterprise)
  --team cpp                C++ Systems Team (C++ systems/performance)
  --team pythonData         Python Data Team (data science, ML pipelines)
  --team javaSpring         Java Spring Team (Java, Spring Boot backends)
  --team react              React Frontend Team (React, Next.js, TypeScript)
  --team nodejs             Node.js Backend Team (Node.js, Express, NestJS)
  --team rust               Rust Systems Team (Rust, safety-critical)
  --team goCloud            Go Cloud Team (Go microservices, cloud-native)
  --team swiftIOS           Swift iOS Team (Swift, Apple ecosystem)
  --team kotlinAndroid      Kotlin Android Team (Kotlin, Android native)
  --team devops             DevOps Team (CI/CD, automation, pipelines)
  --team infraCloud         Cloud Infrastructure Team (AWS/GCP/Azure, IaC)
  --team dataEng            Data Engineering Team (ETL, Spark, Airflow)
  --team aiML               AI/ML Team (machine learning, deep learning)
  --team security           Cybersecurity Team (pentesting, compliance)
  --team embeddedIoT        Embedded IoT Team (firmware, embedded systems)
  --team gameDev            Game Dev Team (Unity, Unreal, game engines)
  --team web3               Blockchain Web3 Team (smart contracts, DeFi)
  --team agenticAI          Agentic AI Team (agent frameworks, multi-agent)
  --team elixirPhoenix      Elixir/Phoenix Team (OTP, LiveView, real-time)
  --team scalaSpark         Scala/Spark Team (big data, stream processing)
  --team rubyRails          Ruby on Rails Team (Rails 7+, Hotwire, Turbo)
  --team phpLaravel         PHP/Laravel Team (PHP 8+, Laravel, Livewire)
  --team vueFrontend        Vue.js Frontend Team (Vue 3, Nuxt 3, Pinia)
  --team angularEnterprise  Angular Enterprise Team (Angular 17+, NgRx)
  --team sre                SRE Team (reliability, incident response)
  --team platformEng        Platform Engineering Team (developer platforms)
  --team reactNative        React Native Team (Expo, cross-platform mobile)
  --team databaseEng        Database Engineering Team (PostgreSQL, MongoDB)
  --team apiDesign          API Design Team (REST, GraphQL, gRPC)
  --team lowcodeAutomation  Low-Code Automation Team (n8n, Retool)
  --team qaAutomation       QA Automation Team (Selenium, Playwright)
  --team techWriting        Technical Writing Team (docs, API docs)
  --team uxDesign           UX/UI Design Team (Figma, design systems)
  --team perfEng            Performance Engineering Team (load testing)
  --team dataScience        Data Science Team (Jupyter, pandas, stats)
  --team computerVision     Computer Vision Team (OpenCV, YOLO)
  --team nlpLLM             NLP/LLM Team (fine-tuning, RLHF, RAG)
  --team roboticsROS        Robotics/ROS Team (ROS2, SLAM, planning)
  --team xrSpatial          XR/Spatial Computing Team (Unity XR, ARKit)
  --team edgeComputing      Edge Computing Team (TinyML, WASM, edge)
  --team quantumComputing   Quantum Computing Team (Qiskit, Cirq)
  --team fintech            FinTech Team (payments, banking, PCI-DSS)
  --team healthtech         HealthTech Team (HIPAA, FHIR, health data)
  --team edtech             EdTech Team (LMS, learning analytics)
  --team ecommerce          E-Commerce Team (Shopify, marketplaces)
  --team realtimeSystems    Real-Time Systems Team (WebSockets, MQTT)
  --team accessibility      Accessibility Team (WCAG 2.2, screen readers)
  --team openSource         Open Source Team (community, governance)

Pick a team or check your spelling.
```

#### 5. Strategy File Loading

```bash
# Validate strategy file exists
if [ ! -f "$STRATEGY_PATH" ]; then
    echo "ERROR: Strategy file not found at: $STRATEGY_PATH"
    echo "Copy STRATEGY_TEMPLATE.md and fill it out first."
    exit 1
fi

# Read strategy content
STRATEGY_CONTENT=$(cat "$STRATEGY_PATH")
```

#### 6. Team Activation

Once matched, the protocol:

1. Reads the matched team's `TEAM.md` in full
2. Reads the strategy file in full
3. Reads the Enhanced Execution Protocol (`shared/ENHANCED_EXECUTION_PROTOCOL.md`)
4. Combines them into the Team Leader's activation prompt:

```
You are activating as the Team Leader for the {TEAM_NAME}.

TEAM PROTOCOL:
{contents of TEAM.md}

PROJECT STRATEGY:
{contents of strategy file}

ENHANCED EXECUTION PROTOCOL:
{contents of ENHANCED_EXECUTION_PROTOCOL.md}

SHARED RESOURCES:
- PM GitHub Integration: {contents of PM_GITHUB_INTEGRATION.md}
- PPTX Generator: shared/PPTX_GENERATOR.py
- PDF Generator: shared/PDF_GENERATOR.py

CRITICAL REQUIREMENTS:
1. Every agent MUST produce evidence (screenshots, logs, test results)
2. Every change MUST be an atomic git commit with conventional format
3. PM MUST maintain GitHub kanban board in real-time
4. All tests MUST pass locally before QA wave
5. GitHub Actions MUST be validated locally with `act` before pushing
6. PM MUST produce PPTX + PDF reports with evidence dashboards

Begin execution at Wave 0.
```

### Execution Context Injection

The strategy file AND enhanced execution protocol are injected into EVERY agent's prompt:

```
Task(
  subagent_type="general-purpose",
  prompt="""
  {AGENT_PERSONA}

  PROJECT STRATEGY:
  {strategy_file_content}

  PROJECT CHARTER:
  {read .team/PROJECT_CHARTER.md}

  ENHANCED EXECUTION PROTOCOL:
  You MUST follow the Evidence & Proof Protocol:
  - Produce evidence manifest at .team/evidence/manifests/{ROLE}_manifest.md
  - Save all build/test/runtime output to .team/evidence/
  - Every change = 1 atomic commit with conventional format
  - Reference issue number in every commit

  YOUR TASKS:
  ...
  """
)
```

### Session Commands

| Command | Action |
|---------|--------|
| `--team <name> --strategy <path>` | Activate a new team session |
| `team status` | Show current KANBAN + evidence dashboard + test status |
| `team report` | Force PM to generate PPTX + PDF now |
| `team evidence` | Show evidence collection status per agent |
| `team commits` | Show atomic commit log |
| `team tests` | Show test coverage status across all layers |
| `team ci` | Show GitHub Actions local validation status |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks (including evidence gates) |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Multiple Teams

You can run multiple teams on different projects simultaneously in different terminal sessions. Each team operates in its own project directory with its own `.team/` folder.

### Adding New Teams

1. Create a numbered folder in the repo: `52-your-team/`
2. Add a `TEAM.md` with the standard structure (including enhanced sections)
3. Include `Activation: --team yourKeyword` in the header
4. Push to `Amenthyx/amenthyx-ai-teams`
5. The team is immediately discoverable on next `git pull`

---

*Activation Protocol v3.0 — Amenthyx AI Teams*
*51 Teams | Evidence-Driven | Real-Time Kanban | Atomic Commits | CI-Validated*
