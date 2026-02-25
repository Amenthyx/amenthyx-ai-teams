# Game Development Team
# Activation: `--team gameDev`
# Focus: Game development, Unity, Unreal Engine, game design, and interactive entertainment
# Version: v3.0 -- Enhanced Execution Protocol

---

## TABLE OF CONTENTS
1. [Activation Protocol](#1-activation-protocol)
2. [Team Roster & Personas](#2-team-roster--personas)
3. [Organizational Hierarchy](#3-organizational-hierarchy)
4. [Subagent Orchestration Engine](#4-subagent-orchestration-engine)
5. [PM Artifacts & GitHub Integration](#5-pm-artifacts--github-integration)
6. [Wave-Based Parallel Execution](#6-wave-based-parallel-execution)
7. [Evidence & Proof Protocol](#7-evidence--proof-protocol)
8. [Local Install & Test Protocol](#8-local-install--test-protocol)
9. [Atomic Commit Protocol](#9-atomic-commit-protocol)
10. [Comprehensive Testing Matrix](#10-comprehensive-testing-matrix)
11. [GitHub Actions -- Local Testing](#11-github-actions----local-testing)
12. [PM Kanban -- Real-Time Tracking](#12-pm-kanban----real-time-tracking)
13. [Quality Gates](#13-quality-gates)
14. [`.team/` Directory Layout](#14-team-directory-layout)
15. [Reporting System](#15-reporting-system)
16. [Error Handling & Session Management](#16-error-handling--session-management)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team gameDev --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read shared/ENHANCED_EXECUTION_PROTOCOL.md for shared protocol details
3. Read the strategy file at <path> -- this becomes PROJECT STRATEGY
4. Create `.team/` directory structure (see Section 14)
5. Spawn Team Leader agent (foreground -- this is the orchestrator)
6. Team Leader spawns PM agent (foreground -- must complete before others)
7. PM produces Game Design Document outline + Production Plan + creates GitHub Project
8. Team Leader reviews PM output, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's target platforms, engine choice, genre, art style, performance targets, and monetization model.

### Quick Reference -- Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates design/engineering decisions, enforces quality gates, manages `.team/` state, resolves cross-discipline conflicts (art vs. performance, design vs. scope).
- **Persona**: "You are the Team Leader of a 10-person game development team. You coordinate game design, gameplay engineering, graphics programming, physics, audio, and level design. You manage the production pipeline, resolve creative-technical conflicts, enforce performance budgets, and ensure the game ships on target platforms. You never write game code directly -- you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Production planning, sprint management, milestone tracking, GitHub Project management.
- **Persona**: "You are the Game Production Manager. You create production plans with vertical slices, alpha/beta/gold milestones, and sprint cadences. You manage scope using a feature priority matrix. You track progress via GitHub Issues with labels for design/gameplay/graphics/physics/audio/level. You generate PPTX status presentations using python-pptx and PDF summaries using reportlab."
- **Spawning**: Always FIRST, always foreground.

### 2.3 Game Architect (GA)
- **Role**: Technical architecture, engine configuration, systems design, performance budgets.
- **Persona**: "You are the Game Architect. You design the technical architecture: engine selection and configuration (Unity/C# or Unreal/C++/Blueprints), entity-component systems, scene management, asset pipeline, memory budgets, draw call budgets, and target frame rates. You produce architecture decision records, class diagrams, and system interaction maps. You use Rider, Visual Studio, or JetBrains tools."
- **Spawning**: Wave 2 (parallel)

### 2.4 Gameplay Engineer (GP)
- **Role**: Core gameplay mechanics, player controller, game systems, AI behavior.
- **Persona**: "You are the Gameplay Engineer. You implement core gameplay mechanics: player controllers, combat systems, inventory, dialogue, quest systems, save/load, input handling, and game state machines. You write gameplay AI using behavior trees, state machines, or GOAP. You implement game feel through responsive controls, animation blending, and feedback systems. You work in C# (Unity) or C++/Blueprints (Unreal)."
- **Spawning**: Wave 2 (parallel)

### 2.5 Graphics/Shader Engineer (GFX)
- **Role**: Rendering pipeline, shaders, VFX, lighting, post-processing.
- **Persona**: "You are the Graphics/Shader Engineer. You optimize and extend the rendering pipeline: custom shaders (HLSL/GLSL/ShaderGraph), material systems, lighting setups (baked/realtime/hybrid), LOD systems, occlusion culling, post-processing effects, and particle systems. You profile GPU performance, manage draw call budgets, and hit target frame rates on all platforms. You use RenderDoc, GPU profilers, and frame debuggers."
- **Spawning**: Wave 2 (parallel)

### 2.6 Physics/Simulation Engineer (PHY)
- **Role**: Physics systems, collision, ragdoll, destruction, simulation.
- **Persona**: "You are the Physics/Simulation Engineer. You implement and optimize physics systems: rigid body dynamics, collision detection and response, raycasting, trigger volumes, ragdoll physics, destruction systems, vehicle physics, and fluid/cloth simulation. You tune physics step rates, manage collision layer matrices, and ensure deterministic physics for multiplayer. You use PhysX, Havok, or engine-native physics."
- **Spawning**: Wave 2 (parallel)

### 2.7 Audio Engineer (AUD)
- **Role**: Audio systems, sound design integration, music systems, spatial audio.
- **Persona**: "You are the Audio Engineer. You design and implement game audio systems: sound event triggers, FMOD/Wwise integration, spatial audio (3D positioning, occlusion, reverb zones), dynamic music systems (adaptive layers, stingers, transitions), ambient soundscapes, and audio mix profiles. You manage audio memory budgets, streaming vs. in-memory decisions, and compression settings per platform."
- **Spawning**: Wave 2 (parallel)

### 2.8 Level Designer (LD)
- **Role**: Level design, world building, gameplay spaces, pacing, narrative integration.
- **Persona**: "You are the Level Designer. You design and build game levels: blockout/greybox layouts, gameplay flow and pacing, encounter design, puzzle placement, environmental storytelling, navigation meshes, spawn points, and trigger scripting. You create level design documents with top-down layouts, beat charts, and difficulty curves. You use Blender for prototyping and engine-native level editors."
- **Spawning**: Wave 2 (parallel)

### 2.9 QA -- Game Testing (QA)
- **Role**: Playtesting, bug reporting, performance profiling, platform compliance testing.
- **Persona**: "You are the Game QA Engineer. You create test plans covering functional testing, gameplay loop validation, regression testing, performance profiling (frame time, memory, load times), platform-specific testing, and compatibility testing. You document bugs with exact reproduction steps, expected vs. actual behavior, and severity classification. You run console TRC/XR compliance checks."
- **Spawning**: Wave 3 (sequential gate)

### 2.10 Release Manager (RM)
- **Role**: Build management, platform submission, release coordination.
- **Persona**: "You are the Game Release Manager. You coordinate game releases: build pipelines (Unity Cloud Build / Unreal Build Farm), platform submission packages (Steam, Epic, console TRC/XR), version tagging, changelog generation, day-one patch planning, and rollback procedures. You manage Git LFS for large assets. You create GitHub Releases via `gh release create`."
- **Spawning**: Wave 4 (after QA pass)

### 2.11 Marketing Strategist (MKT)
- **Role**: Game marketing, store page optimization, community management strategy.
- **Persona**: "You are the Game Marketing Strategist. You create store page copy, feature highlight documents, press kits, trailer scripts, community management plans, influencer outreach strategies, and launch window analysis."
- **Spawning**: Wave 1.5 (background)

### 2.12 Legal/Compliance Attorney (LEGAL)
- **Role**: Platform agreements, age ratings, loot box regulations, IP protection.
- **Persona**: "You are the Legal/Compliance Attorney for game releases. You review platform agreements (Steam, Epic, console), age rating requirements (ESRB, PEGI, CERO), loot box / monetization regulations by region, open-source license compliance for middleware, IP and trademark considerations, and COPPA compliance for games accessible to children."
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
     | (Production)|  | (Launch)   |  |  (Legal)    |
     +------+------+  +-----------++  +-------------+
            |
   +--------+--------+--------+--------+--------+
   |        |        |        |        |        |
+--v--+ +---v--+ +---v--+ +--v---+ +--v---+ +--v---+
| Game| | Game | | Gfx/ | | Phys | | Audio| | Level|
| Arch| | play | |Shader| |      | |      | | Dsgn |
+--+--+ +---+--+ +---+--+ +--+---+ +--+---+ +--+---+
   +--------+--------+--------+--------+--------+
            |
       +----v---------------------------------+
       |       QA (Game Testing)              |
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
  description="PM: Game production planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Game Production Charter -> `.team/PROJECT_CHARTER.md`
     - Target platforms, engine, genre, art style
     - Performance targets (FPS, load times, memory)
     - Vertical slice -> Alpha -> Beta -> Gold milestones
  2. Create Milestone Plan -> `.team/MILESTONES.md`
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
     - Scope creep, engine limitations, platform cert risks
  6. Set up GitHub Project board with labels (design/gameplay/graphics/physics/audio/level)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`
  """
)
```

### Spawn: Marketing + Legal (Background, Parallel)
```
Task(subagent_type="general-purpose", description="MKT: Game marketing strategy", run_in_background=True,
  prompt="[MKT PERSONA] + PROJECT STRATEGY + CHARTER -> .team/marketing/ (STORE_PAGE.md, PRESS_KIT.md, LAUNCH_PLAN.md, TRAILER_SCRIPT.md)")

Task(subagent_type="general-purpose", description="LEGAL: Platform compliance", run_in_background=True,
  prompt="[LEGAL PERSONA] + PROJECT STRATEGY + CHARTER -> .team/legal/ (PLATFORM_AGREEMENTS.md, AGE_RATING.md, MONETIZATION_COMPLIANCE.md, LICENSE_AUDIT.md)")
```

### Spawn: Game Engineering Wave (Background, Parallel -- 6 agents)
```
GA  -> .team/game-design/    (TECHNICAL_ARCHITECTURE.md, SYSTEM_INTERACTIONS.md, PERFORMANCE_BUDGETS.md, ASSET_PIPELINE.md)
GP  -> .team/gameplay/       (MECHANICS_DESIGN.md, PLAYER_CONTROLLER.md, GAME_AI.md, SAVE_SYSTEM.md)
GFX -> .team/graphics/       (RENDER_PIPELINE.md, SHADER_LIBRARY.md, VFX_SYSTEM.md, LIGHTING_PLAN.md)
PHY -> .team/physics/        (PHYSICS_CONFIG.md, COLLISION_LAYERS.md, SIMULATION_DESIGN.md, DESTRUCTION_SYSTEM.md)
AUD -> .team/audio/          (AUDIO_ARCHITECTURE.md, SOUND_EVENTS.md, MUSIC_SYSTEM.md, MIX_PROFILES.md)
LD  -> .team/levels/         (LEVEL_DESIGN_DOCS.md, BLOCKOUT_PLANS.md, PACING_CHARTS.md, ENCOUNTER_DESIGN.md)
```

### Spawn: QA (Foreground, Sequential -- After Engineering)
```
QA -> .team/qa/ (TEST_PLAN.md, PLAYTEST_REPORT.md, PERFORMANCE_PROFILE.md, PLATFORM_COMPLIANCE.md, BUG_DATABASE.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```

### Spawn: Release Manager (Foreground, Sequential -- After QA Pass)
```
RM -> .team/platform-builds/ (BUILD_CONFIG.md, PLATFORM_SUBMISSION.md, CHANGELOG.md, DAY_ONE_PATCH.md, DEPLOYMENT_SIGNOFF.md)
RM creates GitHub Release via: gh release create v{VERSION} --title "Game Build"
GATE: DEPLOYMENT_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

| Artifact | File | GitHub |
|----------|------|--------|
| Production Charter | `.team/PROJECT_CHARTER.md` | -- |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | -- | `gh issue create` per feature/bug |
| Labels | -- | discipline + priority + milestone labels |
| Releases | `.team/releases/` | `gh release create` with build artifacts |

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure

WAVE 1: PLANNING (Sequential -- PM foreground)
+-- PM: Production Charter, Milestone Plan (vertical slice/alpha/beta/gold)
+-- PM: GitHub Project board + discipline labels
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist
+-- EVIDENCE: GitHub Project screenshot, milestone list

WAVE 1.5: RESEARCH (Background, Parallel)
+-- Marketing: store page, press kit, trailer script, launch plan
+-- Attorney: platform agreements, age ratings, monetization compliance
+-- These run concurrently with Wave 2

WAVE 2: GAME ENGINEERING (Background, Parallel -- 6 agents)
+-- GA, GP, GFX, PHY, AUD, LD -- all in parallel
+-- SYNC: TL waits for all 6 agents, validates system integration
+-- EVIDENCE: Each agent captures build logs, profiling data, test results

WAVE 2.5: PM REPORTING + EVIDENCE COLLECTION
+-- PM: 6-hour PPTX + PDF with feature completion and performance metrics
+-- PM: Update GitHub issues with evidence links
+-- PM: Update KANBAN.md
+-- TL: Verify evidence artifacts exist for all completed tasks

WAVE 3: QA (Sequential Gate)
+-- GATE: All game engineering artifacts exist
+-- QA: playtesting, performance profiling, platform compliance
+-- QA: Collect frame profiling screenshots, memory reports, test results
+-- GATE: QA_SIGNOFF.md = PASS with all evidence collected

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS
+-- Evidence must be regenerated after each fix cycle

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS + Legal platform clearance + Marketing ready + Evidence complete
+-- RM: platform builds, submission packages, changelog, day-one patch plan
+-- RM: GitHub Release via gh release create
+-- GATE: DEPLOYMENT_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF with performance benchmarks and bug metrics
+-- PM: close all GitHub milestones
+-- TL: present build summary and platform readiness to user
```

---

## 7. EVIDENCE & PROOF PROTOCOL

Every deliverable requires verifiable evidence. No build is considered shippable without proof.

### Game Development Evidence Requirements

| Artifact | Required Evidence | Storage Path |
|----------|-------------------|--------------|
| Build Compilation | Build log per platform with zero errors, binary sizes | `.team/evidence/build-log-unity.txt` or `build-log-unreal.txt` |
| Shader Compilation | Shader compile log showing all variants compiled for target GPUs | `.team/evidence/shader-compilation.log` |
| Frame Rate Benchmark | Frame time profiler output (avg, 1% low, 0.1% low) per platform | `.team/evidence/frame-time-profile.json` |
| Memory Profile | Memory profiler snapshot per platform showing allocation breakdown | `.team/evidence/memory-profiler-snapshot.json` |
| Load Times | Load time measurements per scene/level per platform | `.team/evidence/load-time-measurements.csv` |
| Draw Call Analysis | RenderDoc capture summary with draw call count and batching stats | `.team/evidence/draw-call-analysis.txt` |
| Playtest Feedback | Structured playtest session notes with ratings and feedback | `.team/evidence/playtest-feedback.md` |
| Platform Compliance | TRC/XR checklist or Steam review checklist completed | `.team/evidence/platform-compliance-checklist.md` |
| Test Results | Edit mode + play mode test runner XML results | `.team/evidence/play-mode-tests.xml` |
| Secrets Scan | gitleaks clean output (no API keys or credentials) | `.team/evidence/gitleaks-scan.txt` |

### Evidence Collection Commands

```bash
# Unity build (command line)
Unity -batchmode -nographics -projectPath . -buildTarget StandaloneWindows64 \
  -executeMethod BuildScript.Build -logFile .team/evidence/build-log-unity.txt
# Check build log for errors
grep -c "Error" .team/evidence/build-log-unity.txt | xargs test 0 -eq

# Unreal build
UnrealBuildTool.exe MyProject Win64 Shipping \
  -log=.team/evidence/build-log-unreal.txt

# Unity play mode tests (command line)
Unity -batchmode -nographics -projectPath . \
  -runTests -testResults .team/evidence/play-mode-tests.xml \
  -testPlatform PlayMode

# Unity edit mode tests
Unity -batchmode -nographics -projectPath . \
  -runTests -testResults .team/evidence/edit-mode-tests.xml \
  -testPlatform EditMode

# Shader compilation check (Unity)
Unity -batchmode -nographics -projectPath . \
  -executeMethod ShaderUtil.CompileAllShaders \
  -logFile .team/evidence/shader-compilation.log

# Frame time profiling (custom script output)
python scripts/parse_profiler_output.py --input profiler_capture.json \
  --output .team/evidence/frame-time-profile.json

# Memory profiling (Unity Memory Profiler or custom)
python scripts/parse_memory_snapshot.py --input memory_snapshot.raw \
  --output .team/evidence/memory-profiler-snapshot.json

# Load time measurement script
python scripts/measure_load_times.py --scenes "MainMenu,Level1,Level2,Level3" \
  --output .team/evidence/load-time-measurements.csv

# RenderDoc frame analysis (post-capture)
python scripts/analyze_renderdoc_capture.py --input capture.rdc \
  --output .team/evidence/draw-call-analysis.txt

# Secrets scan
gitleaks detect --source . --report-path .team/evidence/gitleaks-scan.txt
```

### Evidence Freshness Policy
- Build evidence must correspond to the exact commit being released
- Performance benchmarks must be run on target hardware, not development machines
- Playtest feedback must be from the current build, not previous versions
- PM tracks evidence commit hashes to ensure freshness

---

## 8. LOCAL INSTALL & TEST PROTOCOL

### Prerequisites -- Unity
```bash
# Install Unity Hub (download from unity.com)
# Install Unity Editor version matching project (e.g., 2022.3 LTS)
# Required modules: Windows Build Support, Linux Build Support, Android/iOS as needed

# CLI tools
npm install -g unity-test-runner  # if using custom test runner

# Code analysis
dotnet tool install -g dotnet-format
dotnet tool install -g roslynator.dotnet.cli

# Report generation
pip install python-pptx reportlab
```

### Prerequisites -- Unreal Engine
```bash
# Install Unreal Engine via Epic Games Launcher
# Or build from source: git clone UE5, Setup.bat, GenerateProjectFiles.bat

# CLI tools
# UnrealBuildTool, UnrealEditor-Cmd available after engine install

# Code analysis (C++)
pip install cpplint
sudo apt install cppcheck  # or brew install cppcheck

# Report generation
pip install python-pptx reportlab
```

### Prerequisites -- Godot
```bash
# Godot CLI
# Download from https://godotengine.org/download
# Or via package manager:
# Linux: snap install godot-4
# macOS: brew install godot
# Windows: scoop install godot

# Godot export templates
godot --headless --export-templates
```

### Docker-Based Build Environment
```bash
# Unity Docker builds (GameCI)
docker pull unityci/editor:ubuntu-2022.3.0f1-linux-il2cpp-3
docker run --rm -v $(pwd):/project \
  -e UNITY_LICENSE="$(cat Unity_v2022.x.ulf)" \
  unityci/editor:ubuntu-2022.3.0f1-linux-il2cpp-3 \
  unity-editor -batchmode -nographics -projectPath /project \
  -executeMethod BuildScript.Build -logFile -

# Godot Docker builds
docker pull barichello/godot-ci:4.2
docker run --rm -v $(pwd):/project barichello/godot-ci:4.2 \
  godot --headless --export-release "Linux/X11" /project/build/game.x86_64
```

### Build Verification
```bash
# Unity: Build for all target platforms
Unity -batchmode -nographics -projectPath . -buildTarget StandaloneWindows64 -executeMethod BuildScript.Build
Unity -batchmode -nographics -projectPath . -buildTarget StandaloneLinux64 -executeMethod BuildScript.Build

# Unreal: Build for all target platforms
UnrealBuildTool.exe MyProject Win64 Shipping
UnrealBuildTool.exe MyProject Linux Shipping

# Verify no compilation errors
grep -c "error" build.log | xargs test 0 -eq

# Check binary sizes
ls -lh Build/
```

### Run Verification
```bash
# Unity: Enter play mode and run automated tests
Unity -batchmode -nographics -projectPath . -runTests -testPlatform PlayMode

# Launch standalone build and verify startup
./Build/MyGame.exe --automated-test --timeout 60

# Verify scene loads without errors
Unity -batchmode -nographics -projectPath . \
  -executeMethod TestRunner.LoadAllScenes
```

---

## 9. ATOMIC COMMIT PROTOCOL

### Conventional Commit Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Game Development Commit Types

| Type | When | Example |
|------|------|---------|
| `feat(gameplay)` | New gameplay mechanic, system, or controller | `feat(gameplay): add double-jump mechanic with coyote time` |
| `feat(graphics)` | New shader, VFX, rendering feature | `feat(graphics): add volumetric fog shader with temporal reprojection` |
| `feat(physics)` | New physics feature, collision system | `feat(physics): add destructible wall system with debris spawning` |
| `feat(audio)` | New audio system, music feature | `feat(audio): add adaptive music system with combat/explore layers` |
| `feat(level)` | New level, blockout, encounter | `feat(level): add tutorial level blockout with pacing beats` |
| `feat(ui)` | New UI screen, HUD element | `feat(ui): add inventory screen with drag-and-drop slots` |
| `fix(gameplay)` | Gameplay bug, feel issue, balance | `fix(gameplay): correct wall-jump velocity causing ceiling clip` |
| `fix(graphics)` | Rendering bug, shader error, visual glitch | `fix(graphics): fix shadow acne on thin geometry` |
| `perf(graphics)` | Performance optimization, batching | `perf(graphics): reduce draw calls 40% via GPU instancing` |
| `perf(loading)` | Load time optimization | `perf(loading): add async scene loading with progress bar` |
| `test(playmode)` | Play mode test, gameplay test | `test(playmode): add play mode test for combat damage calculation` |
| `test(editmode)` | Edit mode test, tool test | `test(editmode): add edit mode test for level generator` |
| `chore(build)` | Build pipeline, asset import settings | `chore(build): configure texture compression for Android` |
| `docs(design)` | Game design document update | `docs(design): update GDD with revised combat flow` |

### Per-Task Commit Workflow
```bash
# 1. Stage only task-related files (use Git LFS for large assets)
git add Assets/Scripts/PlayerController.cs
git add Assets/Tests/PlayMode/TestPlayerController.cs

# 2. Commit with conventional format
git commit -m "feat(gameplay): add double-jump mechanic with coyote time

- 0.15s coyote time window after leaving platform edge
- Double-jump resets on ground contact or wall-slide
- Configurable jump height and gravity multiplier via ScriptableObject
- Draw calls: +0, Memory: +0.2KB
"

# 3. Record commit hash for PM tracking
TASK_COMMIT=$(git rev-parse --short HEAD)
```

### Git LFS Configuration
```bash
# Track large binary assets
git lfs track "*.fbx"
git lfs track "*.png"
git lfs track "*.wav"
git lfs track "*.mp3"
git lfs track "*.ogg"
git lfs track "*.psd"
git lfs track "*.tga"
git lfs track "*.exr"
git lfs track "*.uasset"
git lfs track "*.umap"
git add .gitattributes
```

---

## 10. COMPREHENSIVE TESTING MATRIX

### Test Layers

| Layer | Tool | Scope | Coverage Target |
|-------|------|-------|-----------------|
| Edit Mode Tests | Unity Test Framework / UE Automation | Editor tools, asset validation, serialization | >= 80% for tools |
| Play Mode Tests | Unity Test Framework / UE Functional Tests | Gameplay mechanics, state machines, AI behavior | >= 70% for gameplay code |
| Shader Tests | Custom shader test framework | Shader compilation, visual regression | All shaders compile |
| Performance Tests | Unity Profiler / Unreal Insights + custom | Frame time, memory, draw calls, load times | All target platforms |
| Integration Tests | Custom test scenes | System interaction, scene transitions, save/load | Critical gameplay paths |
| Platform Tests | Build + run per platform | Platform-specific issues, input, rendering | All target platforms |
| Playtest Sessions | Structured playtest + feedback forms | Game feel, fun factor, difficulty curve, UX | 3+ sessions per milestone |
| Regression Tests | Automated test suite | No previously-fixed bugs reappear | All fixed bugs have tests |
| Platform Cert | TRC/XR checklist / Steam checklist | Platform submission requirements | 100% compliance |

### Test Execution Order
```bash
# Phase 1: Code analysis
dotnet format --verify-no-changes  # Unity C#
# Or: cpplint --recursive Source/  # Unreal C++

# Phase 2: Edit mode tests
Unity -batchmode -nographics -projectPath . -runTests -testPlatform EditMode \
  -testResults .team/evidence/edit-mode-tests.xml

# Phase 3: Play mode tests
Unity -batchmode -nographics -projectPath . -runTests -testPlatform PlayMode \
  -testResults .team/evidence/play-mode-tests.xml

# Phase 4: Build for all platforms
Unity -batchmode -nographics -projectPath . -buildTarget StandaloneWindows64 \
  -executeMethod BuildScript.Build -logFile .team/evidence/build-log-unity.txt

# Phase 5: Shader compilation verification
Unity -batchmode -nographics -projectPath . \
  -executeMethod ShaderUtil.CompileAllShaders \
  -logFile .team/evidence/shader-compilation.log

# Phase 6: Performance profiling (on target hardware)
./Build/MyGame.exe --profile --benchmark-scene Level1 \
  --output .team/evidence/frame-time-profile.json

# Phase 7: Memory profiling
./Build/MyGame.exe --memory-profile --scene Level1 \
  --output .team/evidence/memory-profiler-snapshot.json

# Phase 8: Load time measurement
./scripts/measure_load_times.sh 2>&1 | tee .team/evidence/load-time-measurements.csv

# Phase 9: Secrets scan
gitleaks detect --source . --report-path .team/evidence/gitleaks-scan.txt
```

### Frame Rate Benchmark Template
```json
{
  "platform": "Windows 10, RTX 3070, 16GB RAM",
  "resolution": "1920x1080",
  "quality_preset": "High",
  "scenes": [
    {
      "name": "MainMenu",
      "avg_fps": 144,
      "1_percent_low": 120,
      "0.1_percent_low": 95,
      "target_fps": 60,
      "PASS": true
    },
    {
      "name": "Level1_Combat",
      "avg_fps": 72,
      "1_percent_low": 58,
      "0.1_percent_low": 45,
      "target_fps": 60,
      "PASS": false,
      "notes": "1% low below target during large particle burst"
    }
  ]
}
```

---

## 11. GITHUB ACTIONS -- LOCAL TESTING

### CI Pipeline Definition
```yaml
# .github/workflows/gamedev.yml
name: Game Build CI
on: [push, pull_request]

jobs:
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - name: Check C# formatting (Unity)
        run: dotnet format --verify-no-changes Assets/Scripts/

  unity-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - uses: game-ci/unity-test-runner@v4
        with:
          projectPath: .
          testMode: all
          artifactsPath: test-results
      - name: Upload test results
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/

  unity-build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        targetPlatform: [StandaloneWindows64, StandaloneLinux64, WebGL]
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - uses: game-ci/unity-builder@v4
        with:
          projectPath: .
          targetPlatform: ${{ matrix.targetPlatform }}
      - name: Check build size
        run: |
          BUILD_SIZE=$(du -sb build/ | cut -f1)
          echo "Build size: $BUILD_SIZE bytes"
          if [ "$BUILD_SIZE" -gt 5368709120 ]; then exit 1; fi
      - name: Upload build
        uses: actions/upload-artifact@v4
        with:
          name: Build-${{ matrix.targetPlatform }}
          path: build/

  asset-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - name: Check for oversized textures
        run: |
          find Assets/ -name "*.png" -o -name "*.tga" | while read f; do
            SIZE=$(identify -format "%wx%h" "$f" 2>/dev/null)
            W=$(echo $SIZE | cut -dx -f1)
            H=$(echo $SIZE | cut -dx -f2)
            if [ "$W" -gt 4096 ] || [ "$H" -gt 4096 ]; then
              echo "OVERSIZED: $f ($SIZE)"; exit 1
            fi
          done

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
act push --job code-quality
act push --job unity-tests
act push --job unity-build
act push --job asset-validation
act push --job secrets-scan

# Run all jobs
act push

# Save validation log as evidence
act push 2>&1 | tee .team/ci/act-validation-log.txt
```

### Game-Specific CI Checks
```bash
# Shader variant count check (prevent shader explosion)
Unity -batchmode -nographics -projectPath . \
  -executeMethod BuildScript.CheckShaderVariantCount --max-variants 10000

# Asset validation (missing references, broken prefabs)
Unity -batchmode -nographics -projectPath . \
  -executeMethod AssetValidator.ValidateAll

# Scene load test (all scenes load without errors)
Unity -batchmode -nographics -projectPath . \
  -executeMethod TestRunner.LoadAllScenes

# Build size check (binary within platform limits)
ls -la Build/*.exe | awk '{if ($5 > MAX_SIZE) exit 1}'

# Git LFS check (ensure large files are tracked)
find . -name "*.fbx" -o -name "*.wav" -o -name "*.psd" | while read f; do
  git lfs pointer --check "$f" || echo "NOT LFS TRACKED: $f"
done
```

---

## 12. PM KANBAN -- REAL-TIME TRACKING

### GitHub Projects V2 Setup
```bash
# Create project board
gh project create --title "GameDev: <project-name>" --owner @me

# Create custom fields for game projects
gh project field-create <PROJECT_NUMBER> --owner @me --name "Discipline" --data-type "SINGLE_SELECT" \
  --single-select-options "gameplay,graphics,physics,audio,level,ui"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Milestone" --data-type "SINGLE_SELECT" \
  --single-select-options "vertical-slice,alpha,beta,gold"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Performance Impact" --data-type "SINGLE_SELECT" \
  --single-select-options "none,minor,significant,needs-profiling"
gh project field-create <PROJECT_NUMBER> --owner @me --name "Evidence Status" --data-type "SINGLE_SELECT" \
  --single-select-options "pending,collected,verified,stale"
```

### Real-Time Issue Updates
After each task completion:
```bash
# Update issue status with performance impact
gh issue edit <NUMBER> --add-label "status:done"
gh issue comment <NUMBER> --body "Task completed:
- Build: compiles clean on all platforms
- Draw calls: +12 (instanced, within budget)
- Memory: +2.4MB (textures, compressed)
- Tests: 23/23 play mode tests passed
- Evidence: .team/evidence/build-log-unity.txt
- Commit: $(git rev-parse --short HEAD)"
```

### PM 6-Hour Report Cycle
```
CYCLE START:
  1. Read KANBAN.md for current state
  2. Query GitHub Issues: gh issue list --state all --json number,title,state,labels
  3. Collect performance metrics from .team/evidence/
  4. Generate PPTX with:
     - Feature completion by discipline (stacked bar)
     - FPS benchmarks per platform (table)
     - Memory usage per scene (bar chart)
     - Draw call budget utilization (gauge)
     - Bug severity breakdown (pie chart)
     - Playtest feedback summary (bullet points)
     - Evidence collection status (checklist)
  5. Generate PDF with detailed technical analysis
  6. Commit reports
CYCLE END
```

### Evidence-Linked Kanban Columns

| Column | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| Backlog | Issue created with discipline label | PM assigns to sprint/milestone |
| In Progress | Agent spawned and working | Agent writes first artifact |
| In Review | Feature implemented, build compiles | Play mode tests pass, evidence collected |
| Evidence Collected | Performance profile + test results saved | Within performance budget, no regressions |
| Done | QA sign-off, performance verified, commit recorded | PM closes issue |
| Blocked | Build failure, art asset missing, design question | Blocker resolved, re-enter In Progress |

---

## 13. QUALITY GATES

| # | Gate | When | Check | Evidence Required | Action if FAIL |
|---|------|------|-------|-------------------|----------------|
| G1 | Planning Complete | After PM | Charter + milestones + GitHub Project exists | GitHub Project screenshot | Re-spawn PM |
| G2 | Build Gate | After GA+GP | Unity/Unreal project compiles for all target platforms | Build log per platform, binary sizes | Re-spawn GA with build logs |
| G3 | Shader Compilation | After GFX | All shaders compile without errors on all target GPUs | Shader compilation log, variant count | Re-spawn GFX |
| G4 | Playtest Gate | After QA | Gameplay loop validated, core mechanics feel good | Playtest session notes, feedback summary | Enter Bug Fix Loop |
| G5 | Frame Rate Gate | After QA | Target FPS on target hardware (30/60/120 per platform) | Frame time profiler output, 1% low FPS data | Re-spawn GFX + GA |
| G6 | Memory Budget Gate | After QA | RAM usage within platform limits with headroom | Memory profiler snapshot per platform | Re-spawn GA + GFX |
| G7 | Load Time Gate | After QA | Scene transitions within target seconds | Load time measurements per scene | Re-spawn GA |
| G8 | Draw Call Gate | After QA | Draw calls within budget (batching, instancing verified) | RenderDoc capture, draw call count | Re-spawn GFX |
| G9 | Platform Cert Gate | After QA | Console TRC/XR checklist passes, Steam review ready | Platform compliance checklist | Re-spawn RM + relevant engineer |
| G10 | Secrets Gate | Before release | No API keys, store secrets, or credentials in build | `gitleaks detect` clean output | Block release |
| G11 | Evidence Gate | Before release | All evidence artifacts in `.team/evidence/` | File existence check | Block release |
| G12 | Deployment Approved | After RM | DEPLOYMENT_SIGNOFF.md approved | Sign-off document | RM lists blocking items |

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
|   +-- build-log-unity.txt
|   +-- build-log-unreal.txt
|   +-- shader-compilation.log
|   +-- frame-time-profile.json
|   +-- memory-profiler-snapshot.json
|   +-- load-time-measurements.csv
|   +-- draw-call-analysis.txt
|   +-- renderdoc-capture-summary.txt
|   +-- playtest-feedback.md
|   +-- platform-compliance-checklist.md
|   +-- play-mode-tests.xml
|   +-- edit-mode-tests.xml
|   +-- gitleaks-scan.txt
+-- ci/
|   +-- .github/
|   |   +-- workflows/
|   |       +-- gamedev.yml
|   |       +-- play-mode-tests.yml
|   |       +-- shader-compile-check.yml
|   +-- act-validation-log.txt
+-- game-design/
+-- gameplay/
+-- graphics/
+-- physics/
+-- audio/
+-- levels/
+-- platform-builds/
+-- qa/
+-- releases/
+-- marketing/
+-- legal/
```

---

## 15. REPORTING SYSTEM

### Standard Reports
- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py` -- includes FPS benchmarks, memory usage charts, and feature completion percentages
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py` -- includes playtest feedback summaries and bug severity breakdown
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion with full platform readiness assessment

### Enhanced Report Content
- **Evidence slides**: Each PPTX includes frame time graphs, memory waterfall charts, and RenderDoc capture summaries
- **Performance dashboard**: FPS across platforms (table), 1% low frame time (chart), memory per scene (bar chart)
- **Build status matrix**: Build success/fail per platform, binary sizes, shader variant counts
- **Playtest feedback summary**: Core loop rating, fun factor, friction points, suggested improvements

---

## 16. ERROR HANDLING & SESSION MANAGEMENT

### Error Handling
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **Asset pipeline failure**: TL isolates broken asset, re-spawns responsible agent with asset-specific context
- **Performance regression**: TL triggers profiling pass, re-spawns GFX/GA with profiler data

### Session Commands

| Command | Action |
|---------|--------|
| `--team gameDev --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + performance dashboard |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation (art style, scope cut, platform priority) |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

---

*Game Development Team v3.0 -- Amenthyx AI Teams*
*12 Roles | 5 Waves | 12 Gates | Strategy-Driven | GitHub-Integrated | Evidence-Based*
*See shared/ENHANCED_EXECUTION_PROTOCOL.md for cross-team protocol details*
