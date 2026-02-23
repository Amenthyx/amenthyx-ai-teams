# Amenthyx AI Teams

**21 specialized virtual engineering teams** powered by Claude Code's subagent orchestration.

Each team is a complete, self-contained execution protocol — with specialized roles, domain-specific quality gates, wave-based parallel execution, and automated PM reporting (PPTX + PDF).

## Quick Start

```
--team <teamName> --strategy path/to/strategy.md
```

1. Copy `STRATEGY_TEMPLATE.md` and fill it out with your project brief
2. Activate a team with the `--team` command
3. The team self-organizes: plans, builds, tests, and ships

## Available Teams

| # | Activation | Team | Focus |
|---|-----------|------|-------|
| 01 | `--team fullStack` | Full-Stack Team | General full-stack web/mobile development |
| 02 | `--team flutter` | Flutter Mobile Team | Flutter/Dart cross-platform mobile apps |
| 03 | `--team dotnet` | .NET Enterprise Team | C#, VB.NET, .NET enterprise systems |
| 04 | `--team cpp` | C++ Systems Team | C++ systems/performance/real-time |
| 05 | `--team pythonData` | Python Data Team | Python data science, ML pipelines |
| 06 | `--team javaSpring` | Java Spring Team | Java, Spring Boot, enterprise backends |
| 07 | `--team react` | React Frontend Team | React, Next.js, TypeScript web apps |
| 08 | `--team nodejs` | Node.js Backend Team | Node.js, Express, NestJS backends |
| 09 | `--team rust` | Rust Systems Team | Rust systems programming, safety-critical |
| 10 | `--team goCloud` | Go Cloud Team | Go microservices, cloud-native |
| 11 | `--team swiftIOS` | Swift iOS Team | Swift, iOS, Apple ecosystem |
| 12 | `--team kotlinAndroid` | Kotlin Android Team | Kotlin, Android native |
| 13 | `--team devops` | DevOps Team | CI/CD, automation, pipelines |
| 14 | `--team infraCloud` | Cloud Infrastructure Team | AWS/GCP/Azure, IaC, networking |
| 15 | `--team dataEng` | Data Engineering Team | ETL, Spark, Airflow, data pipelines |
| 16 | `--team aiML` | AI/ML Team | Machine learning, deep learning, MLOps |
| 17 | `--team security` | Cybersecurity Team | Pentesting, compliance, security |
| 18 | `--team embeddedIoT` | Embedded IoT Team | Firmware, embedded systems, IoT |
| 19 | `--team gameDev` | Game Dev Team | Unity, Unreal, game engines |
| 20 | `--team web3` | Blockchain Web3 Team | Smart contracts, DeFi, Web3 |
| 21 | `--team agenticAI` | Agentic AI Team | OpenClaw, NanoClaw, LangChain, agent frameworks |

## How It Works

### Activation Protocol

When you say `--team <name> --strategy <path>`:

1. The activation protocol matches `<name>` to a team folder
2. The strategy file is loaded as project context
3. The Team Leader agent boots and reads the team's `TEAM.md`
4. Agents spawn in waves — planning first, then engineering in parallel, then QA, then release
5. PM creates a GitHub Project board, milestones, and issues via `gh` CLI
6. PPTX status reports and PDF summaries are generated every 6 hours

### Strategy File

Every team activation requires a strategy file. Copy `STRATEGY_TEMPLATE.md` and fill it out. The strategy tells the team:

- What to build (vision, objectives, features)
- Who it's for (target audience)
- How to build it (tech constraints, integrations)
- When it ships (timeline, milestones)
- What success looks like (KPIs, acceptance criteria)

### Team Structure

Every team follows the same organizational pattern:

```
         USER
           |
      TEAM LEADER (orchestrator)
           |
     +-----+-----+
     |     |     |
    PM   MKT  LEGAL
     |
  +--+--+--+--+
  |  |  |  |  |
 [5-7 domain-specific engineers]
     |
    QA
     |
  RELEASE MGR
```

### Wave Execution

```
Wave 0: Initialization (TL boots, reads strategy)
Wave 1: Planning (PM creates charter, milestones, kanban)
Wave 1.5: Research (Marketing + Legal in background)
Wave 2: Engineering (all engineers in parallel)
Wave 3: QA (sequential gate — must pass)
Wave 3.5: Bug fix loop (if QA fails)
Wave 4: Release (RM coordinates deployment)
Wave 5: Final reporting (PM generates summary)
```

### PM GitHub Integration

The PM agent uses `gh` CLI to:
- Create GitHub Project boards (kanban)
- Create milestones matching strategy phases
- Create issues for each deliverable with labels and assignees
- Update issue status as work progresses
- Create GitHub Releases when Release Manager signs off

See `shared/PM_GITHUB_INTEGRATION.md` for full details.

### Reporting

- **PPTX**: Dark-themed status presentations every 6 hours (python-pptx)
- **PDF**: Activity summaries with metrics (reportlab)
- Scripts in `shared/PPTX_GENERATOR.py` and `shared/PDF_GENERATOR.py`

## Repository Structure

```
amenthyx-ai-teams/
├── README.md                   # This file
├── STRATEGY_TEMPLATE.md        # Strategy brief template
├── shared/
│   ├── ACTIVATION_PROTOCOL.md  # How --team and --strategy work
│   ├── PM_GITHUB_INTEGRATION.md
│   ├── PPTX_GENERATOR.py
│   └── PDF_GENERATOR.py
├── 01-full-stack/TEAM.md
├── 02-flutter-mobile/TEAM.md
├── ...
└── 21-agentic-ai/TEAM.md
```

## Adding New Teams

1. Create a new numbered folder: `22-your-team/`
2. Add a `TEAM.md` following the structure of any existing team
3. Set the `Activation` keyword in the header
4. Push to this repo — the team becomes immediately available

## Requirements

- **Claude Code** CLI with Task tool (subagent orchestration)
- **GitHub CLI** (`gh`) authenticated for PM GitHub integration
- **Python 3.8+** with `python-pptx` and `reportlab` for reporting
- Install: `pip install python-pptx reportlab`

## License

Proprietary — Amenthyx. Internal use only.
