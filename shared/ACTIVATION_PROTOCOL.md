# Activation Protocol v3.1

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
  --team afterEffectsMotion After Effects Motion Graphics Team (ExtendScript, expressions)
  --team videoProduction    Video Production Team (FFmpeg, color grading, encoding)
  --team 3dVfx              3D / VFX Team (Blender bpy, Houdini, compositing)
  --team audioEngineering   Audio Engineering Team (mixing, mastering, spatial audio)
  --team 2dAnimation        2D Animation Team (Lottie, Rive, GSAP, SVG)
  --team creativeAI         Creative AI Team (Stable Diffusion, ComfyUI, AI video)
  --team streamingBroadcast Streaming & Broadcast Team (OBS, NDI, RTMP/SRT)
  --team mediaPipeline      Media Pipeline Team (render farms, transcoding, CDN)

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

CRITICAL REQUIREMENTS (v3.1):
1. **COST ESTIMATION FIRST**: Before ANY work begins, produce COST_ESTIMATION.md
   and WAIT for user approval. This is a HARD GATE — no PM spawning, no agent work,
   no decisions until the user says "approved".
2. **PAYMENT GOVERNANCE**: You are the sole authority on cost decisions. Any action
   requiring payment (card, subscription, purchase) MUST be declared in
   COST_ESTIMATION.md with exact amounts BEFORE the action is taken. If a new cost
   is discovered mid-execution, PAUSE and get user approval.
3. **NEVER DELETE DATA**: No file, no table row, no document section, no log entry,
   no evidence artifact may EVER be deleted. Use archive patterns instead:
   move files to .team/archive/, mark rows as [ARCHIVED], version documents.
   This rule is ABSOLUTE and applies to ALL agents at ALL times.
4. **ASK WHEN UNSURE**: If ANY agent is uncertain about an action's effect, safety,
   correctness, or scope, it MUST STOP and escalate to you (TL). If YOU are also
   unsure, you MUST escalate to the user. Never guess. Never assume. The cost of
   asking is zero. The cost of a wrong action can be catastrophic.
5. Every agent MUST produce evidence (screenshots, logs, test results)
6. Every change MUST be an atomic git commit with conventional format
7. **BRANCH RULE (ABSOLUTE)**: ALL work happens on the `ai-team` branch.
   NEVER commit or push directly to `main`. At project start, create
   `ai-team` from `main` and push all work there.
8. **MERGE GATE (ABSOLUTE)**: The `ai-team` branch CANNOT be merged to `main`
   without explicit user approval. Only the TL may request merge. The user
   MUST say "approved" or "merge". This gate cannot be skipped or automated.
9. **GITHUB AUTO-SYNC**: After every agent completion and wave transition,
   commit + push to `ai-team`. The repo must always reflect current state.
10. PM MUST maintain GitHub kanban board in real-time
11. **DYNAMIC SCALING**: PM may request additional agents if workload demands it.
   TL approves if within budget; otherwise, update COST_ESTIMATION.md and get
   user re-approval.
12. All tests MUST pass locally before QA wave
13. GitHub Actions MUST be validated locally with `act` before pushing
14. PM MUST produce PPTX + PDF reports with evidence dashboards

EXECUTION SEQUENCE:
  Wave 0: TL reads everything → creates `ai-team` branch → produces COST_ESTIMATION.md → WAITS for user approval
  Wave 1+: Only after approval → PM begins → normal wave execution on `ai-team` with auto-sync
  Final: TL requests user approval to merge `ai-team` → `main`
```

#### 6.1 Cost Estimation Gate (BLOCKING)

After the Team Leader reads all inputs but BEFORE spawning the PM or any agents:

```
TL COST ESTIMATION SEQUENCE:
1. TL analyzes the strategy: features, complexity, team size, waves
2. TL estimates token usage per wave and per agent
3. TL identifies any external services that require payment
4. TL writes .team/COST_ESTIMATION.md (see Enhanced Execution Protocol §0)
5. TL commits + pushes COST_ESTIMATION.md to GitHub
6. TL presents the cost summary to the user in chat
7. TL WAITS for user response — this is a BLOCKING gate

USER RESPONSES:
- "approved" → TL proceeds to Wave 1 (spawn PM)
- "approved with cap of $X" → TL proceeds with hard cost ceiling
- "too expensive, tailor it" → TL proposes reductions, re-estimates
- "change X" → TL revises specific item, re-estimates
- Anything else → TL asks for clarification

CRITICAL: The TL must NOT spawn the PM or any other agent until
approval is received. This gate cannot be skipped or timed out.
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

  APPROVED COST ESTIMATE:
  {read .team/COST_ESTIMATION.md}

  ENHANCED EXECUTION PROTOCOL:
  You MUST follow the Evidence & Proof Protocol:
  - Produce evidence manifest at .team/evidence/manifests/{ROLE}_manifest.md
  - Save all build/test/runtime output to .team/evidence/
  - Every change = 1 atomic commit with conventional format
  - Reference issue number in every commit
  - After completing work, TL will commit + push your outputs to the `ai-team` branch (auto-sync)
  - NEVER commit or push to `main` — ALL work goes to `ai-team`
  - The `ai-team` → `main` merge requires explicit user approval through TL
  - If you discover any action that requires payment, STOP and report to TL immediately
  - NEVER initiate any paid service, subscription, or purchase autonomously

  DATA PRESERVATION RULE (ABSOLUTE — NON-NEGOTIABLE):
  You MUST NEVER delete any data. This includes:
  - Files (move to .team/archive/ instead of deleting)
  - Rows in markdown tables (add status:archived column instead of removing rows)
  - Lines or sections in documents (add [ARCHIVED {date}] marker instead of deleting)
  - Log entries (logs are append-only — NEVER truncate or clear)
  - Evidence artifacts (evidence is permanent — NEVER remove)
  - Git history (NEVER rebase, squash, or force-push published commits)
  If you think something needs to be "removed", archive it instead.
  If you are unsure, STOP and report to TL.

  UNCERTAINTY ESCALATION RULE (ABSOLUTE — NON-NEGOTIABLE):
  If you are unsure about ANY action — its effect, its safety, its correctness,
  whether it deletes data, whether it costs money, whether it is in scope —
  you MUST STOP and report to the Team Leader BEFORE proceeding.
  The TL will decide or escalate to the user. NEVER guess. NEVER assume.
  State clearly: "I want to do X, but I am unsure about Y because Z."

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
| `team cost` | Show current cost estimate vs actual spend |
| `team report` | Force PM to generate PPTX + PDF now |
| `team evidence` | Show evidence collection status per agent |
| `team commits` | Show atomic commit log |
| `team tests` | Show test coverage status across all layers |
| `team ci` | Show GitHub Actions local validation status |
| `team scaling` | Show agent scaling log and current agent count |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks (including cost + payment gates) |
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

*Activation Protocol v3.1 — Amenthyx AI Teams*
*59 Teams | Cost-First | No-Delete | Ask-When-Unsure | ai-team Branch | Merge-Gated | Auto-Synced | Dynamically-Scaled | Evidence-Driven | Real-Time Kanban | Atomic Commits | CI-Validated*
