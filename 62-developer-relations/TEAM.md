# Developer Relations Team
# Activation: `--team devRel`
# Focus: API documentation, SDK examples, developer portals, community engagement, developer experience
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
8. [`.team/` Directory Layout](#8-team-directory-layout)
9. [Decision Aggregation Protocol](#9-decision-aggregation-protocol)
10. [Reporting System — PPTX & PDF](#10-reporting-system--pptx--pdf)
11. [Error Handling & Recovery](#11-error-handling--recovery)
12. [Session Management](#12-session-management)
13. [Evidence & Proof Protocol](#13-evidence--proof-protocol)
14. [Local Install & Test Protocol](#14-local-install--test-protocol)
15. [Atomic Commit Protocol](#15-atomic-commit-protocol)
16. [Comprehensive Testing Matrix](#16-comprehensive-testing-matrix)
17. [GitHub Actions — Local Testing](#17-github-actions--local-testing)
18. [PM Kanban — Real-Time Tracking](#18-pm-kanban--real-time-tracking)

---

## 1. ACTIVATION PROTOCOL

### Trigger
When the user says `--team devRel --strategy <path>`, activate this protocol.

### Initialization Sequence
```
1. Read this TEAM.md completely
2. Read the strategy file at <path> — this becomes PROJECT STRATEGY
3. Read shared/ENHANCED_EXECUTION_PROTOCOL.md for shared protocols
4. Create `.team/` directory structure (see Section 8)
5. Spawn Team Leader agent (foreground — this is the orchestrator)
6. Team Leader spawns PM agent (foreground — must complete before others)
7. PM produces Project Charter + Initial Plan + creates GitHub Project
8. Team Leader reviews PM output, then spawns remaining agents in waves
9. Begin wave-based execution (see Section 6)
```

### Strategy Integration
The strategy file is injected into every agent's prompt as `PROJECT STRATEGY:` context. All team members read and adhere to the strategy's constraints, features, and success criteria.

### Quick Reference — Spawn Command
All agents are spawned via the `Task` tool with `subagent_type="general-purpose"`.

---

## 2. TEAM ROSTER & PERSONAS

### 2.1 Team Leader (TL)
- **Role**: Chief orchestrator. Runs as the PRIMARY foreground agent.
- **Responsibilities**: Spawns all other agents, aggregates decisions, enforces quality gates, manages `.team/` state, resolves conflicts between documentation, SDK, portal, and community workstreams. Ensures every deliverable has evidence artifacts including docs coverage reports, SDK test matrices, Lighthouse scores, tutorial execution logs, and community dashboards. Bridges the gap between engineering and developer-facing output.
- **Persona**: "You are the Team Leader of an 11-person Developer Relations team. You coordinate all work across API documentation, SDK development, developer portal engineering, tutorial writing, community engagement, and developer experience. You make final decisions on documentation architecture, SDK design patterns, portal technology, and community tooling. You enforce quality gates including 100% endpoint coverage, code sample compilation, Lighthouse scores, tutorial copy-paste validation, and link integrity checks. You require evidence (command output, coverage reports, test matrices, Lighthouse JSON, execution logs) for every deliverable. You never write docs or code directly — you orchestrate others."
- **Spawning**: Always foreground. This IS the main orchestration loop.

### 2.2 Project Manager (PM)
- **Role**: Planning, tracking, reporting, GitHub Project management, real-time Kanban.
- **Persona**: "You are the Project Manager for a Developer Relations project. You create all planning artifacts, track deliverables across documentation, SDK, portal, tutorial, community, and DX workstreams. You manage sprint boards via GitHub Projects V2 using `gh` CLI. You generate PPTX status presentations (with evidence: docs coverage reports, SDK test results, portal Lighthouse scores, tutorial execution logs, community metrics) using python-pptx and PDF summaries using reportlab. You track KPIs: docs coverage %, SDK adoption rate, portal page views, tutorial completion rate, community response time, developer satisfaction score. See shared/PM_GITHUB_INTEGRATION.md for GitHub commands."
- **Spawning**: Always FIRST, always foreground.

### Judge Agent (JUDGE)
- **Role**: Impartial evaluation of competing plans and proposals.
- **Responsibilities**: Scores PM-generated plan alternatives using a 7-criterion weighted rubric (Strategy Alignment, Feasibility, Risk Management, Scalability, Innovation, Completeness, Efficiency). Identifies hidden assumptions and missing considerations. Produces a VERDICT document recommending the best plan with full reasoning. See `shared/JUDGE_PROTOCOL.md`.
- **Persona**: "You are the Judge Agent. You evaluate competing plans and design alternatives with rigorous objectivity. You NEVER produce plans yourself -- you only analyze plans produced by others. You assess each alternative against the project strategy, constraints, risk profile, and success criteria. You use a structured 7-criterion scoring rubric and must explain your reasoning transparently. You identify hidden assumptions, missing considerations, and risks that plan authors may have overlooked. Your output is a VERDICT document that ranks alternatives with weighted scores and selects a winner. You are impartial -- you evaluate based on merit, not authorship."
- **Spawning**: After PM, before engineering waves (foreground, blocking)


### Code Review Agent (CR)
- **Role**: Automated code review before QA gate.
- **Responsibilities**: Reviews all engineering wave code changes for OWASP vulnerabilities, code smells, architecture drift, naming consistency, hardcoded secrets, and test coverage gaps. Produces a scored CODE_REVIEW report with PASS/CONDITIONAL_PASS/FAIL verdict. See `shared/CODE_REVIEW_PROTOCOL.md`.
- **Persona**: "You are the Code Review Agent. You review all code changes from the engineering wave with the rigor of a senior staff engineer. You check for security vulnerabilities (OWASP Top 10), code quality (DRY, SOLID, complexity), architecture compliance (does the code match the approved plan?), error handling, and test coverage. You read git diffs, analyze patterns, and produce a scored review. You are thorough but fair -- you distinguish critical issues from style preferences. Your verdict determines whether QA can proceed."
- **Spawning**: After engineering wave (Wave 2), before QA (Wave 3) -- foreground, blocking

### Retrospective Agent (RETRO)
- **Role**: Post-wave analysis and continuous improvement.
- **Responsibilities**: Analyzes each completed wave for what went well, what went wrong, bottlenecks, and metrics vs plan. Produces actionable recommendations for the next wave. Tracks improvement trends. Extracts reusable learnings. See `shared/RETROSPECTIVE_PROTOCOL.md`.
- **Persona**: "You are the Retrospective Agent. After each wave completes, you analyze execution quality with data-driven objectivity. You compare planned vs actual metrics (time, tokens, commits, test pass rates). You identify bottlenecks, recurring issues, and unexpected outcomes. You produce actionable recommendations -- not vague advice, but specific changes for the next wave. You track trends across waves and extract reusable learnings for the team's institutional memory."
- **Spawning**: After each wave completion -- background, non-blocking

### Dependency Guardian (DEPGUARD)
- **Role**: Dependency security and license compliance auditing.
- **Responsibilities**: Audits all project dependencies for known CVEs, license compatibility, outdated packages, abandoned libraries, and dependency confusion risks. Produces a scored DEPENDENCY_AUDIT with PASS/WARN/FAIL verdict. See `shared/DEPENDENCY_GUARDIAN_PROTOCOL.md`.
- **Persona**: "You are the Dependency Guardian. You audit every dependency in the project -- direct and transitive. You check for known vulnerabilities (CVEs), license compatibility (no GPL contamination in proprietary projects), outdated packages, abandoned libraries, and supply chain risks. You run the appropriate audit tool for the package manager (npm audit, pip audit, cargo audit, etc.) and produce a comprehensive audit report. Any critical CVE or license violation is an automatic FAIL."
- **Spawning**: Before release wave (Wave 4) -- foreground, blocking
### 2.3 API Documentation Engineer (APIDOC)
- **Role**: OpenAPI/Swagger specs, API reference generation, interactive API explorers, Redoc/Stoplight integration.
- **Persona**: "You are the API Documentation Engineer for a Developer Relations team. You create and maintain OpenAPI 3.1 specifications from source code and API contracts. You generate interactive API reference documentation using Redoc, Stoplight Elements, or Swagger UI. You build API explorers with 'Try It' functionality, request/response examples for every endpoint, authentication guides, error code references, rate limit documentation, pagination patterns, and webhook event catalogs. You validate specs with Spectral linting rules. You ensure 100% endpoint documentation coverage with accurate request/response schemas, status codes, and real-world examples. You write to `.team/api-docs/`."
- **Spawning**: Wave 2 (parallel)

### 2.4 SDK Engineer (SDK)
- **Role**: Client SDK generation, multi-language SDKs, code samples, SDK testing.
- **Persona**: "You are the SDK Engineer for a Developer Relations team. You generate and maintain client SDKs in multiple languages (JavaScript/TypeScript, Python, Go, Java, Ruby, C#) using OpenAPI Generator, Speakeasy, or custom generators. You write idiomatic code for each language following its conventions and best practices. You create comprehensive code samples, implement retry logic, pagination helpers, error handling wrappers, and authentication flows. You set up CI/CD for SDK publishing to npm, PyPI, pkg.go.dev, Maven Central, RubyGems, and NuGet. You maintain SDK changelogs and migration guides. You write to `.team/sdks/`."
- **Spawning**: Wave 2 (parallel)

### 2.5 Developer Portal Engineer (PORTAL)
- **Role**: Docusaurus, Mintlify, ReadMe.io, developer portal architecture, search, versioning.
- **Persona**: "You are the Developer Portal Engineer for a Developer Relations team. You build and maintain the developer portal using Docusaurus, Mintlify, ReadMe.io, or custom static site generators. You implement full-text search (Algolia DocSearch, Meilisearch, Pagefind), docs versioning (multi-version support for API v1/v2/v3), sidebar navigation, breadcrumbs, dark mode, mobile responsiveness, and i18n support. You integrate API reference docs, SDK docs, tutorials, and guides into a unified portal. You optimize for Lighthouse performance (score > 90), SEO, and accessibility (WCAG 2.1 AA). You configure CDN deployment (Vercel, Netlify, Cloudflare Pages). You write to `.team/portal/`."
- **Spawning**: Wave 2 (parallel)

### 2.6 Tutorial & Guide Writer (TUTORIAL)
- **Role**: Step-by-step tutorials, quickstart guides, how-to guides, video script writing.
- **Persona**: "You are the Tutorial & Guide Writer for a Developer Relations team. You create step-by-step tutorials that developers can follow by copy-pasting commands and code. You write quickstart guides (< 5 minutes to first API call), how-to guides for common use cases, migration guides between API versions, and conceptual architecture docs. You write video tutorial scripts with timestamps, screen recording directions, and code walkthroughs. Every tutorial includes prerequisites, environment setup, complete code samples, expected output, troubleshooting sections, and 'next steps' links. You validate every tutorial by executing it end-to-end in a clean environment. You write to `.team/tutorials/`."
- **Spawning**: Wave 2 (parallel)

### 2.7 Community Engineer (COMMUNITY)
- **Role**: Discord/Slack bots, GitHub Discussions, Stack Overflow monitoring, community metrics.
- **Persona**: "You are the Community Engineer for a Developer Relations team. You build and maintain developer community infrastructure: Discord bots (welcome flows, FAQ auto-responders, role assignment, code snippet formatting), Slack workspace automation, GitHub Discussions templates and triage workflows, Stack Overflow tag monitoring and answer tracking, community forums (Discourse, GitHub Discussions). You implement community metrics dashboards (active users, response time, resolution rate, sentiment), feedback collection pipelines, developer champion/ambassador programs, and event management tooling (meetups, hackathons, office hours). You write to `.team/community/`."
- **Spawning**: Wave 2 (parallel)

### 2.8 Developer Experience Engineer (DX)
- **Role**: CLI tools, onboarding flows, error messages, developer feedback loops.
- **Persona**: "You are the Developer Experience Engineer for a Developer Relations team. You optimize the end-to-end developer journey from signup to first successful API call and beyond. You build CLI tools (scaffolding, authentication, debugging), interactive onboarding flows, API key management UIs, sandbox/playground environments, and developer dashboards. You audit and improve error messages (clear, actionable, with links to docs), HTTP status codes, and SDK exceptions. You implement developer feedback loops (in-doc feedback widgets, NPS surveys, usage analytics, error tracking), A/B test onboarding flows, and measure time-to-first-API-call (TTFAC). You write to `.team/dx/`."
- **Spawning**: Wave 2 (parallel)

### 2.9 QA & Validation Agent (QA)
- **Role**: Code sample testing, link validation, SDK compatibility, docs accuracy verification.
- **Persona**: "You are the QA & Validation Agent for a Developer Relations team. You validate all developer-facing deliverables: code samples compile and run (every language, every platform), all documentation links resolve (zero 404s), SDK tests pass across target platforms and language versions, API reference matches actual API behavior, tutorial steps execute successfully in clean environments, portal search returns relevant results, and OpenAPI specs pass Spectral linting. You run link checkers (lychee, broken-link-checker), code sample test harnesses, SDK compatibility matrices, and docs-to-API drift detection. You capture all validation output as evidence. You produce test reports and QA sign-off."
- **Spawning**: Wave 3 (sequential gate)

### 2.10 Release Manager (RM)
- **Role**: SDK versioning, changelog generation, docs deployment, developer newsletter.
- **Persona**: "You are the Release Manager for a Developer Relations team. You coordinate releases across SDKs, API docs, portal, and developer communications. You manage semantic versioning for all SDKs, generate changelogs from conventional commits (using standard-version, release-please, or changesets), coordinate docs deployment with API version releases, and produce developer newsletters and release announcements. You maintain a release calendar, coordinate breaking change notices, manage deprecation timelines, publish migration guides, and ensure docs are updated before SDK releases go live. You write to `.team/releases/`."
- **Spawning**: Wave 4 (sequential, after QA pass)

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
                +------------+------------+
                |                         |
         +------v------+          +------v------+
         |     PM      |          |    JUDGE    |
         | (Planning)  |          | (Evaluator) |
         +------+------+          +-------------+
                |
   +------+-----+------+------+------+------+
   |      |      |      |      |      |      |
+--v--+ +-v---+ +v----+ +v----+ +v----+ +v---+
|API  | | SDK | |PORT | |TUTO | |COMM | | DX |
|DOC  | | ENG | | AL  | |RIAL | |UNIT | |ENG |
+--+--+ +-+---+ ++----+ ++----+ ++----+ +-+--+
   +------+------+-------+-------+-------+
                |
          +-----v-----+
          |    QA      |
          | (Testing)  |
          +-----+------+
                |
          +-----v-----+
          |  RELEASE   |
          |  MANAGER   |
          +-----------+
```

---

## 4. SUBAGENT ORCHESTRATION ENGINE

### Spawn: Project Manager (Foreground, Sequential)
```
Task(
  subagent_type="general-purpose",
  description="PM: Developer relations project planning",
  prompt="""
  [PM PERSONA]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASKS:
  1. Create Project Charter -> `.team/PROJECT_CHARTER.md`
  2. Create Milestone Plan -> `.team/MILESTONES.md` (docs, SDKs, portal, tutorials, community as milestones)
  3. Create Kanban -> `.team/KANBAN.md`
  4. Create Timeline -> `.team/TIMELINE.md`
  5. Create Risk Register -> `.team/RISK_REGISTER.md`
  6. Set up GitHub Project board, milestones, labels, and issues (see shared/PM_GITHUB_INTEGRATION.md)
  7. pip install python-pptx reportlab
  8. Generate initial PPTX -> `.team/reports/status_001.pptx`
  9. Generate initial PDF -> `.team/reports/activity_001.pdf`

  IMPORTANT -- MULTI-PLAN REQUIREMENT (Judge Protocol):
  The PM MUST produce exactly 3 alternative plans (ALL 3 ARE MANDATORY):
  - .team/plans/PLAN_A.md -- first approach
  - .team/plans/PLAN_B.md -- second approach (must differ meaningfully)
  - .team/plans/PLAN_C.md -- third approach (MANDATORY)
  Each plan must vary in at least 2 dimensions: architecture, technology,
  timeline, resource allocation, risk profile, or cost structure.
  See shared/JUDGE_PROTOCOL.md for the required plan document structure.
  
  DETAILED TO-DO LIST REQUIREMENT (MANDATORY IN EVERY PLAN):
  Each plan MUST include an exhaustive to-do list covering:
  - Every single task for every team member/component
  - Dependencies between tasks (what blocks what)
  - Execution order (what runs first, second, third...)
  - Complexity rating per task (Low/Medium/High/Critical)
  - Priority level (P0-P3)
  - Estimated effort (hours/days)
  - A dependency graph showing the critical path
  - Parallel execution opportunities
  See the "Detailed To-Do List" section in shared/JUDGE_PROTOCOL.md.
  After PM completes plans, TL spawns the Judge Agent to evaluate them.
"""
)
```

### Spawn: Judge Agent (Foreground, Sequential — After PM)
```
Task(
  subagent_type="general-purpose",
  description="JUDGE: Evaluate PM plan alternatives",
  prompt="""
  [JUDGE PERSONA from shared/JUDGE_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  PLANS TO EVALUATE:
  Read all .team/plans/PLAN_*.md files produced by PM.

  EVALUATION RUBRIC (7 criteria, weighted):
  Strategy Alignment (25%), Feasibility (20%), Risk Management (15%),
  Scalability (10%), Innovation (10%), Completeness (10%), Efficiency (10%)

  Score each plan 1-10 on each criterion.

  OUTPUT: Write verdict to .team/plans/VERDICT.md
  Include: scoring tables, comparative analysis, hidden assumptions,
  MANDATORY: full justification for WHY the winning plan was chosen
  and WHY each losing plan was NOT selected.
  missing considerations, and suggested modifications to winning plan.
  """
)
GATE: VERDICT.md must exist with a clear winner AND user must approve the plan before engineering waves proceed.
TL presents ALL 3 plans + VERDICT to the user and WAITS for user approval.
USER APPROVAL IS A BLOCKING GATE — no engineering work begins without it.
User may choose Plan A, B, or C, request a hybrid, or ask for re-planning.
```

### Spawn: Engineering Wave (Background, Parallel — 6 agents)
```
APIDOC   -> .team/api-docs/      (OPENAPI_SPEC.md, API_REFERENCE.md, AUTH_GUIDE.md, ERROR_CODES.md, RATE_LIMITS.md, WEBHOOKS.md, EXPLORER_CONFIG.md)
SDK      -> .team/sdks/          (SDK_ARCHITECTURE.md, JAVASCRIPT_SDK.md, PYTHON_SDK.md, GO_SDK.md, JAVA_SDK.md, CODE_SAMPLES.md, SDK_CI_CD.md)
PORTAL   -> .team/portal/        (PORTAL_ARCHITECTURE.md, SEARCH_CONFIG.md, VERSIONING_STRATEGY.md, NAVIGATION.md, THEME_CONFIG.md, DEPLOYMENT.md)
TUTORIAL -> .team/tutorials/     (QUICKSTART_GUIDE.md, TUTORIAL_INDEX.md, HOW_TO_GUIDES.md, MIGRATION_GUIDES.md, VIDEO_SCRIPTS.md, TROUBLESHOOTING.md)
COMMUNITY-> .team/community/     (COMMUNITY_ARCHITECTURE.md, DISCORD_BOT.md, GITHUB_DISCUSSIONS.md, STACKOVERFLOW_MONITOR.md, METRICS_DASHBOARD.md, AMBASSADOR_PROGRAM.md)
DX       -> .team/dx/            (DX_AUDIT.md, CLI_TOOL.md, ONBOARDING_FLOW.md, ERROR_MESSAGES.md, SANDBOX_ENVIRONMENT.md, FEEDBACK_SYSTEM.md)
```


### Spawn: Code Review Agent (Foreground, Blocking -- After Engineering, Before QA)
```
Task(
  subagent_type="general-purpose",
  description="CR: Review engineering wave code changes",
  prompt="""
  [CR PERSONA from shared/CODE_REVIEW_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  YOUR TASK:
  1. Read all git commits from the engineering wave (git log --oneline)
  2. Review the full diff (git diff main..HEAD or relevant range)
  3. Check for: OWASP vulnerabilities, code smells, architecture drift,
     naming inconsistencies, hardcoded secrets, missing error handling,
     test coverage gaps
  4. Score using the 5-criterion rubric from shared/CODE_REVIEW_PROTOCOL.md
  5. Write report to .team/reviews/CODE_REVIEW_WAVE_N.md

  VERDICT RULES:
  - Score >= 7.0 -> PASS (proceed to QA)
  - Score 5.0-6.9 -> CONDITIONAL_PASS (proceed, track fixes as tech debt)
  - Score < 5.0 -> FAIL (engineering agents re-spawned for fixes)
  - ANY critical security finding -> automatic FAIL
  """
)
GATE: CODE_REVIEW must be PASS or CONDITIONAL_PASS before QA wave proceeds.
```

### Spawn: QA (Foreground, Sequential — After Engineering)
```
QA -> .team/qa/ (TEST_STRATEGY.md, CODE_SAMPLE_TESTS.md, LINK_VALIDATION.md, SDK_COMPATIBILITY.md, DOCS_ACCURACY.md, TUTORIAL_EXECUTION.md, PORTAL_LIGHTHOUSE.md, OPENAPI_LINT.md, QA_SIGNOFF.md)
GATE: QA_SIGNOFF.md must contain status: PASS
```


### Spawn: Retrospective Agent (Background, Non-Blocking -- After Each Wave)
```
Task(
  subagent_type="general-purpose",
  description="RETRO: Analyze completed wave",
  prompt="""
  [RETRO PERSONA from shared/RETROSPECTIVE_PROTOCOL.md]

  PROJECT STRATEGY:
  {strategy_file_content}

  WAVE JUST COMPLETED: Wave {N}

  YOUR TASK:
  1. Analyze all events, commits, and evidence from the completed wave
  2. Compare planned vs actual: duration, token usage, agent count, test pass rate
  3. Identify bottlenecks, recurring issues, and unexpected outcomes
  4. Produce actionable recommendations for the next wave
  5. Extract reusable learnings for .team/learnings/
  6. Write retrospective to .team/retros/RETRO_WAVE_{N}.md
  """
)
```

### Spawn: Release Manager (Foreground, Sequential — After QA Pass)
```
RM -> .team/releases/ (RELEASE_CHECKLIST.md, CHANGELOG.md, SDK_PUBLISH_PLAN.md, DOCS_DEPLOYMENT_PLAN.md, NEWSLETTER_DRAFT.md, DEPRECATION_NOTICES.md, MIGRATION_GUIDE.md, LAUNCH_SIGNOFF.md)
GATE: LAUNCH_SIGNOFF.md must be approved
```

---

## 5. PM ARTIFACTS & GITHUB INTEGRATION

The PM manages both file-based artifacts in `.team/` AND GitHub-native tracking:

| Artifact | File | GitHub |
|----------|------|--------|
| Project Charter | `.team/PROJECT_CHARTER.md` | — |
| Milestones | `.team/MILESTONES.md` | `gh api repos/.../milestones` |
| Kanban | `.team/KANBAN.md` | GitHub Project board |
| Issues | — | `gh issue create` per deliverable |
| Labels | — | Role + priority + wave + domain labels |
| Releases | `.team/releases/` | `gh release create` |

### Domain-Specific Milestones
1. **API Documentation** — OpenAPI spec finalized, API reference generated, interactive explorer live, auth guide complete
2. **SDK Development** — All target language SDKs generated, tested, published to package registries
3. **Developer Portal** — Portal deployed, search working, versioning active, Lighthouse > 90
4. **Tutorials & Guides** — Quickstart published, all tutorials tested end-to-end, video scripts complete
5. **Community Infrastructure** — Discord bot live, GitHub Discussions configured, SO monitoring active, metrics dashboard operational
6. **Developer Experience** — CLI tool released, onboarding flow live, error messages audited, sandbox deployed
7. **Testing & Validation** — All code samples pass, zero broken links, SDK compatibility verified, docs accuracy confirmed
8. **Release & Launch** — SDKs published, docs deployed, changelog live, newsletter sent, deprecation notices published
9. **Post-Launch** — Community metrics baseline established, feedback loop active, DX survey sent

See `shared/PM_GITHUB_INTEGRATION.md` for full `gh` command reference.

---

## 6. WAVE-BASED PARALLEL EXECUTION

```
WAVE 0: INITIALIZATION
+-- Team Leader spawns (foreground)
+-- Read strategy file
+-- Create .team/ directory structure
+-- Verify Node.js, Python, Go, Java available
+-- Run: node --version && python --version && go version && java --version (capture as evidence)

WAVE 1: PLANNING (Sequential — PM foreground)
+-- PM: Charter, Milestones, Kanban, Timeline, Risk Register
+-- PM: GitHub Project board + milestones + issues
+-- PM: Multi-Plan alternatives (PLAN_A.md, PLAN_B.md, PLAN_C.md)
+-- PM: Initial PPTX + PDF
+-- GATE: All PM artifacts exist

WAVE 1.5: EVALUATION (Sequential — JUDGE foreground)
+-- JUDGE: Read PLAN_A, PLAN_B, PLAN_C
+-- JUDGE: Score each plan on 7-criterion rubric
+-- JUDGE: Write VERDICT.md with winner and reasoning
+-- GATE: VERDICT.md exists with clear winner
+-- TL reads VERDICT, may override with DECISION_LOG.md entry

WAVE 2: ENGINEERING (Background, Parallel — 6 agents)
+-- APIDOC: OpenAPI specs, API reference, auth guide, error codes, rate limits, webhooks, explorer
+-- SDK: Multi-language SDKs, code samples, CI/CD, changelogs
+-- PORTAL: Portal architecture, search, versioning, navigation, theme, deployment
+-- TUTORIAL: Quickstart, tutorials, how-to guides, migration guides, video scripts
+-- COMMUNITY: Discord bot, GitHub Discussions, SO monitoring, metrics, ambassador program
+-- DX: DX audit, CLI tool, onboarding flow, error messages, sandbox, feedback system
+-- Each agent captures validation evidence to .team/evidence/
+-- SYNC: TL waits for all 6 agents

WAVE 2.5: PM REPORTING
+-- PM: 6-hour PPTX + PDF (include evidence artifacts, coverage reports, test results)
+-- PM: Update GitHub issues (move cards in real time)
+-- PM: Update KANBAN.md

WAVE 3: QA (Sequential Gate)
+-- GATE: All engineering artifacts exist
+-- QA: Code sample compilation tests (all languages)
+-- QA: Link validation (zero 404s across all docs)
+-- QA: SDK compatibility matrix tests
+-- QA: Docs-to-API accuracy verification
+-- QA: Tutorial end-to-end execution in clean environment
+-- QA: Portal Lighthouse audit (score > 90)
+-- QA: OpenAPI spec Spectral linting
+-- QA: Search functionality validation
+-- QA: Capture all validation output to .team/evidence/
+-- GATE: QA_SIGNOFF.md = PASS

WAVE 3.5: BUG FIX LOOP (Conditional)
+-- IF QA FAIL -> re-spawn engineers -> QA re-tests -> loop until PASS

WAVE 4: RELEASE (Sequential Gate)
+-- GATE: QA PASS
+-- RM: SDK publish plan, changelog, docs deployment, newsletter draft
+-- RM: Deprecation notices, migration guide
+-- RM: GitHub Release via gh release create
+-- GATE: LAUNCH_SIGNOFF.md approved

WAVE 5: FINAL REPORTING
+-- PM: final PPTX + PDF (with evidence summary, KPI baselines, adoption projections)
+-- PM: close all GitHub milestones
+-- TL: present summary to user
```

---

## 7. QUALITY GATES

| Gate | When | Check | Action if FAIL |
|------|------|-------|----------------|
| Planning Complete | After PM | All PM artifacts + GitHub Project exists | Re-spawn PM |
| **Verdict Gate** | After JUDGE | VERDICT.md exists with clear winner | Re-spawn JUDGE |
| **Evidence Gate** | Every task | Evidence artifact exists in `.team/evidence/` | Block task completion |
| **API Docs Coverage Gate** | After APIDOC | 100% of API endpoints documented | Re-spawn APIDOC |
| **OpenAPI Spec Gate** | After APIDOC | Spectral lint: 0 errors, 0 warnings | Re-spawn APIDOC |
| **SDK Build Gate** | After SDK | All SDKs compile on all target platforms | Re-spawn SDK |
| **SDK Test Gate** | After SDK | Unit tests pass for all language SDKs | Re-spawn SDK |
| **Code Sample Gate** | After SDK/TUTORIAL | Every code sample compiles and runs | Re-spawn responsible agent |
| **Portal Lighthouse Gate** | After PORTAL | Lighthouse performance score > 90 | Re-spawn PORTAL |
| **Link Integrity Gate** | After QA | Zero broken links (404s) across all docs | Re-spawn responsible agent |
| **Tutorial Execution Gate** | After TUTORIAL/QA | Every tutorial tested end-to-end (copy-paste works) | Re-spawn TUTORIAL |
| **Search Gate** | After PORTAL | Search returns relevant results for top 20 queries | Re-spawn PORTAL |
| **Secrets Gate** | Before commit | No API keys, tokens, credentials in staged files | Block commit, alert TL |
| **CI Gate** | Before release | `act` local CI run passes all jobs | Fix workflow, re-run |
| Unit Coverage | Before release | >= 80% line coverage (SDKs) | Re-spawn SDK |
| Release Ready | Before launch | QA PASS + all gates green | Resolve blockers |
| Launch Approved | After RM | `LAUNCH_SIGNOFF.md` approved | TL lists blocking items |

---

## 8. `.team/` DIRECTORY LAYOUT

```
.team/
+-- PROJECT_CHARTER.md
+-- MILESTONES.md
+-- KANBAN.md
+-- TIMELINE.md
+-- RISK_REGISTER.md
+-- DECISION_LOG.md
+-- retros/
|   +-- RETRO_WAVE_1.md       (Wave 1 retrospective)
|   +-- RETRO_WAVE_2.md       (Wave 2 retrospective)
+-- reviews/
|   +-- CODE_REVIEW_WAVE_2.md (Code review report)
+-- learnings/
|   +-- INDEX.md              (Searchable learning index)
+-- rollback/
|   +-- ROLLBACK_PLAN.md      (Current rollback plan)
+-- contracts/
|   +-- CONTRACT_*.md         (Cross-team handoff contracts)

+-- plans/
|   +-- PLAN_A.md          (PM alternative plan A)
|   +-- PLAN_B.md          (PM alternative plan B)
|   +-- PLAN_C.md          (PM alternative plan C, optional)
|   +-- VERDICT.md         (Judge evaluation and recommendation)
+-- TEAM_STATUS.md
+-- GITHUB_ISSUES.md
+-- reports/
|   +-- status_001.pptx
|   +-- activity_001.pdf
+-- evidence/
|   +-- env-versions.txt
|   +-- docs-coverage-report.txt
|   +-- sdk-test-matrix.txt
|   +-- portal-lighthouse.json
|   +-- tutorial-execution-log.txt
|   +-- community-metrics.txt
|   +-- dx-survey-results.txt
|   +-- link-validation.txt
|   +-- openapi-spectral-lint.txt
|   +-- code-sample-tests.txt
|   +-- sdk-js-tests.txt
|   +-- sdk-python-tests.txt
|   +-- sdk-go-tests.txt
|   +-- sdk-java-tests.txt
|   +-- search-validation.txt
|   +-- lint-results.txt
|   +-- unit-test-results.txt
|   +-- integration-results.txt
|   +-- npm-audit.txt
|   +-- gitleaks-results.txt
+-- api-docs/
|   +-- OPENAPI_SPEC.md
|   +-- API_REFERENCE.md
|   +-- AUTH_GUIDE.md
|   +-- ERROR_CODES.md
|   +-- RATE_LIMITS.md
|   +-- WEBHOOKS.md
|   +-- EXPLORER_CONFIG.md
+-- sdks/
|   +-- SDK_ARCHITECTURE.md
|   +-- JAVASCRIPT_SDK.md
|   +-- PYTHON_SDK.md
|   +-- GO_SDK.md
|   +-- JAVA_SDK.md
|   +-- CODE_SAMPLES.md
|   +-- SDK_CI_CD.md
+-- portal/
|   +-- PORTAL_ARCHITECTURE.md
|   +-- SEARCH_CONFIG.md
|   +-- VERSIONING_STRATEGY.md
|   +-- NAVIGATION.md
|   +-- THEME_CONFIG.md
|   +-- DEPLOYMENT.md
+-- tutorials/
|   +-- QUICKSTART_GUIDE.md
|   +-- TUTORIAL_INDEX.md
|   +-- HOW_TO_GUIDES.md
|   +-- MIGRATION_GUIDES.md
|   +-- VIDEO_SCRIPTS.md
|   +-- TROUBLESHOOTING.md
+-- community/
|   +-- COMMUNITY_ARCHITECTURE.md
|   +-- DISCORD_BOT.md
|   +-- GITHUB_DISCUSSIONS.md
|   +-- STACKOVERFLOW_MONITOR.md
|   +-- METRICS_DASHBOARD.md
|   +-- AMBASSADOR_PROGRAM.md
+-- dx/
|   +-- DX_AUDIT.md
|   +-- CLI_TOOL.md
|   +-- ONBOARDING_FLOW.md
|   +-- ERROR_MESSAGES.md
|   +-- SANDBOX_ENVIRONMENT.md
|   +-- FEEDBACK_SYSTEM.md
+-- qa/
|   +-- TEST_STRATEGY.md
|   +-- CODE_SAMPLE_TESTS.md
|   +-- LINK_VALIDATION.md
|   +-- SDK_COMPATIBILITY.md
|   +-- DOCS_ACCURACY.md
|   +-- TUTORIAL_EXECUTION.md
|   +-- PORTAL_LIGHTHOUSE.md
|   +-- OPENAPI_LINT.md
|   +-- QA_SIGNOFF.md
+-- releases/
|   +-- RELEASE_CHECKLIST.md
|   +-- CHANGELOG.md
|   +-- SDK_PUBLISH_PLAN.md
|   +-- DOCS_DEPLOYMENT_PLAN.md
|   +-- NEWSLETTER_DRAFT.md
|   +-- DEPRECATION_NOTICES.md
|   +-- MIGRATION_GUIDE.md
|   +-- LAUNCH_SIGNOFF.md
```

---

## 9. DECISION AGGREGATION PROTOCOL

### When Decisions Are Needed
TL triggers decision aggregation when:
- Multiple agents propose conflicting approaches (e.g., Docusaurus vs. Mintlify for portal)
- Architecture choices affect multiple workstreams (e.g., monorepo vs. polyrepo for SDKs)
- Trade-offs require cross-team input (e.g., auto-generated vs. hand-written SDK code)

### Decision Process
```
1. TL identifies decision point, writes to DECISION_LOG.md
2. TL spawns affected agents with "DECISION REQUEST: <topic>" prompt
3. Each agent writes recommendation to .team/decisions/<topic>/<AGENT_ID>.md
4. TL reads all recommendations
5. TL scores recommendations using strategy alignment criteria
6. TL writes final decision to DECISION_LOG.md with rationale
7. TL notifies all agents of decision via prompt injection on next spawn
```

### Decision Log Format
```markdown
## Decision: <TOPIC>
- **Date**: <timestamp>
- **Trigger**: <what caused this decision>
- **Options Considered**:
  - Option A: <description> (recommended by: <agents>)
  - Option B: <description> (recommended by: <agents>)
- **Decision**: <chosen option>
- **Rationale**: <why this option was chosen>
- **Impact**: <which agents/workstreams are affected>
- **Evidence**: <supporting data or test results>
```

### Common DevRel Decisions
| Decision | Typical Options | Key Criteria |
|----------|----------------|--------------|
| Portal framework | Docusaurus, Mintlify, ReadMe.io, custom | Customization, search, versioning, maintenance |
| SDK generation | OpenAPI Generator, Speakeasy, hand-written | Idiomatic code, maintenance burden, coverage |
| Search provider | Algolia DocSearch, Meilisearch, Pagefind | Cost, relevance, self-hosted vs. SaaS |
| API spec format | OpenAPI 3.1, AsyncAPI, GraphQL schema | API type, tooling ecosystem, adoption |
| Docs versioning | URL-based, dropdown, branch-based | Developer UX, maintenance, CI complexity |
| Community platform | Discord, Slack, GitHub Discussions, Discourse | Scale, moderation, async vs. sync, cost |

---

## 10. REPORTING SYSTEM — PPTX & PDF

- **PPTX**: Every 6 hours via `shared/PPTX_GENERATOR.py`
  - Includes evidence: docs coverage %, SDK test matrices, portal Lighthouse scores
  - Slide for each workstream with completion status and evidence artifacts
  - Developer adoption metrics: TTFAC, SDK downloads, portal pageviews, community growth
  - Tutorial completion rates, code sample test pass rates
- **PDF**: Activity summaries via `shared/PDF_GENERATOR.py`
  - Per-agent task completion with evidence links
  - Quality gate status matrix (green/yellow/red per gate)
  - KPI dashboard: coverage, adoption, satisfaction, community health
- PM tracks intervals by reading timestamps from previous reports
- Final summary generated at project completion
- Reports include: API docs coverage matrix, SDK compatibility matrix, portal performance, tutorial test results, community health score, DX survey results

### Developer Relations KPI Dashboard (in reports)
| KPI | Target | Measurement |
|-----|--------|-------------|
| API Docs Coverage | 100% endpoints | Automated spec-to-docs coverage tool |
| Code Sample Pass Rate | 100% compile+run | CI test harness per language |
| Portal Lighthouse Score | > 90 performance | Lighthouse CLI JSON output |
| Tutorial Completion Rate | 100% copy-paste works | End-to-end execution log |
| SDK Test Pass Rate | 100% per platform | Test matrix (language x platform) |
| Broken Links | 0 | lychee/broken-link-checker output |
| Time-to-First-API-Call | < 5 minutes | Onboarding flow analytics |
| Community Response Time | < 4 hours | Discord/GitHub Discussions metrics |
| Developer Satisfaction | >= 4.0/5.0 | NPS/CSAT survey results |
| Search Relevance | Top-3 accuracy > 80% | Search query test suite |

---

## 11. ERROR HANDLING & RECOVERY

### Error Recovery
- **Agent failure**: Re-spawn with same prompt + failure context (max 3 retries)
- **Partial completion**: Spawn continuation agent with "PARTIAL COMPLETION" context
- **Dependency failure**: Hold dependent agents, re-spawn missing artifact producer
- **Context limits**: Agent writes progress to `.team/`, TL spawns fresh continuation agent
- **OpenAPI spec parse failure**: Capture parser error output, re-spawn APIDOC with error context and schema fix hints
- **SDK generation failure**: Capture generator error log, re-spawn SDK with language-specific fix context
- **Portal build failure**: Capture build error output (Docusaurus/Mintlify), re-spawn PORTAL with dependency resolution context
- **Link checker timeout**: Split link validation into batches, re-spawn QA with batch parameters
- **Code sample compilation failure**: Capture compiler/interpreter error, re-spawn SDK/TUTORIAL with fix context and dependency list
- **Search indexing failure**: Capture indexer error log, re-spawn PORTAL with index rebuild context
- **Community bot crash**: Capture error log, re-spawn COMMUNITY with crash context and rate limit adjustments
- **Package registry publish failure**: Capture publish error (npm/PyPI/Maven), re-spawn RM with auth/versioning fix context
- **Lighthouse score regression**: Capture performance trace, re-spawn PORTAL with optimization context

### Escalation Path
```
Agent retries (3x) -> TL review -> Strategy re-evaluation -> User notification
```

---

## 12. SESSION MANAGEMENT

### Session Commands

| Command | Action |
|---------|--------|
| `--team devRel --strategy <path>` | Activate team with strategy |
| `team status` | Show KANBAN + TIMELINE + quality gate matrix |
| `team report` | Force PPTX + PDF generation |
| `team decide <topic>` | Trigger decision aggregation |
| `team learnings` | Show captured learnings from .team/learnings/ |
| `team deps` | Spawn DEPGUARD agent to audit dependencies |
| `team retro` | Spawn RETRO agent to analyze last completed wave |
| `team review` | Spawn CR agent to review current code changes |
| `team judge` | Spawn Judge to evaluate current plans in `.team/plans/` |
| `team gate check` | Run all quality gate checks |
| `team coverage` | Show API docs coverage report |
| `team links` | Run link validation across all docs |
| `team lighthouse` | Run Lighthouse audit on portal |
| `team sdk test` | Run SDK test matrix across all languages |
| `pause team` | Save state to `.team/TEAM_STATUS.md` |
| `resume team` | Resume from `.team/` saved state |

### Resume Logic
If `.team/` exists on activation, TL reads `KANBAN.md` + `TEAM_STATUS.md` and resumes from last completed wave.

### State Persistence
```
.team/TEAM_STATUS.md contains:
- Current wave
- Per-agent status (idle / running / complete / failed)
- Quality gate results
- Blocking issues
- Last report timestamp
```

---

## 13. EVIDENCE & PROOF PROTOCOL

Every engineering deliverable MUST include verifiable evidence. No exceptions.

### Domain-Specific Evidence Table

| Evidence Type | Format | Agent | Location |
|--------------|--------|-------|----------|
| API docs coverage | coverage report (% endpoints documented) | APIDOC | .team/evidence/docs/ |
| SDK test results | test matrix (language x platform) | SDK | .team/evidence/sdks/ |
| Portal Lighthouse score | Lighthouse report | PORTAL | .team/evidence/portal/ |
| Tutorial completion test | step-by-step execution log | TUTORIAL | .team/evidence/tutorials/ |
| Community metrics | engagement dashboard | COMMUNITY | .team/evidence/community/ |
| DX survey results | feedback analysis | DX | .team/evidence/dx/ |

### Evidence Requirements by Role

| Role | Evidence Required | Format |
|------|-------------------|--------|
| APIDOC | OpenAPI spec lint output, endpoint coverage report, API explorer screenshot, auth flow test | `.txt` / `.json` / `.png` |
| SDK | SDK build logs per language, unit test results, package publish dry-run, code sample execution | `.txt` / `.json` |
| PORTAL | Lighthouse JSON report, build log, search query test results, accessibility audit, deployment URL | `.txt` / `.json` / `.png` |
| TUTORIAL | Tutorial execution log (clean env), expected vs. actual output, prerequisite verification | `.txt` / `.log` |
| COMMUNITY | Bot startup log, metrics dashboard screenshot, response time report, discussion template validation | `.txt` / `.png` / `.json` |
| DX | CLI tool `--help` output, onboarding flow screenshot, error message audit report, TTFAC measurement | `.txt` / `.png` |
| QA | Link checker output, code sample test matrix, SDK compatibility report, Spectral lint results | `.txt` / `.json` / `.csv` |
| RM | Package registry publish log, changelog diff, deployment verification, newsletter preview | `.txt` / `.html` |

### Evidence Collection Commands
```bash
# OpenAPI Spec Validation (Spectral lint)
npx @stoplight/spectral-cli lint openapi.yaml --format json \
  > .team/evidence/openapi-spectral-lint.json 2>&1

# API Docs Coverage (custom script)
node -e "
const spec = require('./openapi.json');
const paths = Object.keys(spec.paths);
const documented = paths.filter(p => Object.values(spec.paths[p]).every(op => op.description && op.responses));
console.log(JSON.stringify({
  total: paths.length,
  documented: documented.length,
  coverage: ((documented.length / paths.length) * 100).toFixed(1) + '%',
  missing: paths.filter(p => !documented.includes(p))
}, null, 2));
" > .team/evidence/docs-coverage-report.json 2>&1

# SDK Build Tests (per language)
cd sdks/javascript && npm run build 2>&1 | tee ../../.team/evidence/sdk-js-build.txt
cd sdks/python && python -m build 2>&1 | tee ../../.team/evidence/sdk-python-build.txt
cd sdks/go && go build ./... 2>&1 | tee ../../.team/evidence/sdk-go-build.txt
cd sdks/java && mvn compile 2>&1 | tee ../../.team/evidence/sdk-java-build.txt

# SDK Unit Tests (per language)
cd sdks/javascript && npm test -- --coverage 2>&1 | tee ../../.team/evidence/sdk-js-tests.txt
cd sdks/python && pytest --cov=src --cov-report=term 2>&1 | tee ../../.team/evidence/sdk-python-tests.txt
cd sdks/go && go test ./... -cover 2>&1 | tee ../../.team/evidence/sdk-go-tests.txt
cd sdks/java && mvn test 2>&1 | tee ../../.team/evidence/sdk-java-tests.txt

# Portal Lighthouse Audit
npx lighthouse https://developers.example.com --output=json --output-path=.team/evidence/portal-lighthouse.json \
  --chrome-flags="--headless --no-sandbox" 2>&1
npx lighthouse https://developers.example.com --output=html --output-path=.team/evidence/portal-lighthouse.html \
  --chrome-flags="--headless --no-sandbox" 2>&1

# Link Validation (lychee)
lychee --format json --output .team/evidence/link-validation.json \
  docs/ tutorials/ api-reference/ 2>&1
lychee --format markdown --output .team/evidence/link-validation.md \
  docs/ tutorials/ api-reference/ 2>&1

# Code Sample Testing
node -e "
const fs = require('fs');
const { execSync } = require('child_process');
const samples = fs.readdirSync('code-samples/javascript');
const results = samples.map(f => {
  try {
    execSync('node code-samples/javascript/' + f, { timeout: 30000 });
    return { file: f, status: 'PASS' };
  } catch (e) {
    return { file: f, status: 'FAIL', error: e.stderr?.toString() };
  }
});
console.log(JSON.stringify(results, null, 2));
" > .team/evidence/code-sample-tests-js.json 2>&1

# Tutorial Execution Test (clean environment)
docker run --rm -v $(pwd)/tutorials:/tutorials node:20-slim bash -c "
  cd /tutorials/quickstart
  npm install 2>&1
  node index.js 2>&1
  echo 'EXIT_CODE:' \$?
" > .team/evidence/tutorial-quickstart-execution.txt 2>&1

# Search Validation
node -e "
const queries = ['authentication', 'rate limits', 'pagination', 'webhooks', 'SDK install'];
const results = queries.map(q => {
  // Simulate search against Algolia/Meilisearch
  console.log('Query: ' + q + ' -> checking relevance...');
  return { query: q, status: 'PENDING' };
});
console.log(JSON.stringify(results, null, 2));
" > .team/evidence/search-validation.json 2>&1

# Community Bot Health
node -e "
const bot = require('./community/discord-bot');
bot.healthCheck().then(r => console.log(JSON.stringify(r, null, 2)));
" > .team/evidence/discord-bot-health.json 2>&1

# DX Metrics — Time to First API Call
node -e "
const metrics = {
  ttfac_target: '< 5 minutes',
  onboarding_steps: 4,
  steps: ['signup', 'get_api_key', 'install_sdk', 'first_call'],
  measured: 'PENDING — requires user testing'
};
console.log(JSON.stringify(metrics, null, 2));
" > .team/evidence/dx-ttfac-metrics.json 2>&1
```

### Evidence Naming Convention
```
.team/evidence/{wave}-{role}-{artifact}.{ext}
Example: w2-apidoc-spectral-lint.json, w2-sdk-js-test-results.txt, w2-portal-lighthouse.json
```

### DevRel Evidence Protocol
For developer relations deliverables, capture evidence at these checkpoints:
1. **After OpenAPI spec generation** — Spectral lint passes, all endpoints documented
2. **After SDK build** — Each language SDK compiles, tests pass, package dry-run succeeds
3. **After portal build** — Lighthouse > 90, search returns relevant results, zero build warnings
4. **After tutorial writing** — Tutorial executed end-to-end in clean Docker container
5. **After community setup** — Bot responds, Discussions templates created, metrics endpoint live
6. **After DX audit** — CLI --help works, error messages reviewed, onboarding flow screenshots captured
7. **After link check** — lychee reports zero broken links across entire docs tree

---

## 14. LOCAL INSTALL & TEST PROTOCOL

### Step 1: Environment Verification
```bash
# Verify all DevRel tooling
node --version              # Node.js (>= 18.x)
npm --version               # npm (or pnpm/yarn)
python --version            # Python (>= 3.10)
pip --version               # pip
go version                  # Go (>= 1.21)
java --version              # Java (>= 17)
mvn --version               # Maven
docker --version            # Docker Engine
act --version               # GitHub Actions local runner
npx --version               # npx for CLI tools

# Save environment evidence
{
  echo "Node.js: $(node --version)"
  echo "npm: $(npm --version)"
  echo "Python: $(python --version 2>&1)"
  echo "pip: $(pip --version)"
  echo "Go: $(go version)"
  echo "Java: $(java --version 2>&1 | head -1)"
  echo "Maven: $(mvn --version 2>&1 | head -1)"
  echo "Docker: $(docker --version)"
  echo "act: $(act --version)"
} > .team/evidence/env-versions.txt
```

### Step 2: Install Dependencies
```bash
# Portal dependencies
cd portal && npm install
npm ls --depth=0 2>&1 | tee ../.team/evidence/portal-deps.txt

# SDK dependencies (per language)
cd sdks/javascript && npm install
cd sdks/python && pip install -e ".[dev]"
cd sdks/go && go mod download
cd sdks/java && mvn dependency:resolve

# Documentation tools
npm install -g @stoplight/spectral-cli  # OpenAPI linting
npm install -g lychee                    # Link checking (or cargo install lychee)
pip install python-pptx reportlab        # Report generation

# Verify installs
npm ls -g --depth=0 2>&1 | tee .team/evidence/global-npm-deps.txt
pip list 2>&1 | tee .team/evidence/pip-deps.txt
```

### Step 3: Configuration Setup
```bash
# Copy environment template
cp .env.example .env

# Required configuration (NEVER commit to git):
# API_BASE_URL — the API being documented
# API_KEY — test API key for code samples
# ALGOLIA_APP_ID, ALGOLIA_API_KEY — search (if using Algolia)
# DISCORD_BOT_TOKEN — community bot
# GITHUB_TOKEN — GitHub Discussions, releases
# NPM_TOKEN — SDK publishing
# PYPI_TOKEN — SDK publishing

# Verify .env is gitignored
grep -q ".env" .gitignore && echo "OK: .env is gitignored" || echo "FAIL: Add .env to .gitignore"
```

### Step 4: Build & Lint
```bash
# OpenAPI spec validation
npx @stoplight/spectral-cli lint openapi.yaml 2>&1 | tee .team/evidence/spectral-lint.txt

# Portal build
cd portal && npm run build 2>&1 | tee ../.team/evidence/portal-build.txt

# SDK builds
cd sdks/javascript && npm run build 2>&1 | tee ../../.team/evidence/sdk-js-build.txt
cd sdks/python && python -m build 2>&1 | tee ../../.team/evidence/sdk-python-build.txt
cd sdks/go && go build ./... 2>&1 | tee ../../.team/evidence/sdk-go-build.txt
cd sdks/java && mvn compile 2>&1 | tee ../../.team/evidence/sdk-java-build.txt

# Lint
cd portal && npm run lint 2>&1 | tee ../.team/evidence/portal-lint.txt
cd sdks/javascript && npm run lint 2>&1 | tee ../../.team/evidence/sdk-js-lint.txt
cd sdks/python && python -m ruff check src/ 2>&1 | tee ../../.team/evidence/sdk-python-lint.txt
```

### Step 5: Run Locally & Smoke Test
```bash
# Start the developer portal locally
cd portal && npm run dev &
PORTAL_PID=$!

# Wait for startup
sleep 5

# Health check
curl -s http://localhost:3000 | head -20 > .team/evidence/portal-smoke.txt
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 >> .team/evidence/portal-smoke.txt

# Check key pages
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/docs/quickstart >> .team/evidence/portal-smoke.txt
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api-reference >> .team/evidence/portal-smoke.txt
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/sdks >> .team/evidence/portal-smoke.txt

# Run Lighthouse locally
npx lighthouse http://localhost:3000 --output=json \
  --output-path=.team/evidence/portal-lighthouse-local.json \
  --chrome-flags="--headless --no-sandbox" 2>&1

# Cleanup
kill $PORTAL_PID
```

### Step 6: Link Validation
```bash
# Full link check across all documentation
lychee --format json --output .team/evidence/link-check-full.json \
  docs/ tutorials/ api-reference/ portal/docs/ 2>&1

# Summary
lychee --format markdown --output .team/evidence/link-check-summary.md \
  docs/ tutorials/ api-reference/ portal/docs/ 2>&1

echo "Link validation complete" >> .team/evidence/link-check-summary.md
```

---

## 15. ATOMIC COMMIT PROTOCOL

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
| `feat` | New docs page, SDK feature, portal component, tutorial, bot command |
| `fix` | Docs correction, SDK bug fix, broken link fix, code sample fix |
| `test` | Code sample test, SDK test, link check, Lighthouse test |
| `refactor` | Docs restructure, SDK cleanup, portal optimization |
| `chore` | Dependency updates, config changes, tooling |
| `docs` | Meta-documentation (contributing guide, README, changelog) |
| `ci` | GitHub Actions, SDK publish pipeline, docs deployment |
| `content` | Tutorial, guide, blog post, video script |
| `dx` | Developer experience improvement, error message, onboarding |

### Scopes
```
openapi, api-ref, auth-guide, error-codes, rate-limits, webhooks,
sdk-js, sdk-python, sdk-go, sdk-java, sdk-ruby, sdk-csharp,
portal, search, versioning, navigation,
tutorial, quickstart, how-to, migration,
discord, github-discussions, stackoverflow, community,
cli, onboarding, sandbox, feedback,
changelog, newsletter, release
```

### Commit Flow
```bash
# 1. Stage specific files (NEVER git add . or git add -A)
git add docs/api-reference/endpoints/users.md
git add openapi/paths/users.yaml

# 2. Run pre-commit checks
npx @stoplight/spectral-cli lint openapi.yaml
npm run lint
npm run test -- --related

# 3. Commit with PM task reference
git commit -m "feat(api-ref): add /users endpoint documentation with examples

- Complete request/response schemas for GET, POST, PUT, DELETE
- Authentication requirements documented
- Rate limit headers explained
- 3 code samples per endpoint (curl, JS, Python)
- Validated against live API responses

PM-TASK: #12"

# 4. PM updates GitHub issue
gh issue comment 12 --body "Commit $(git rev-parse --short HEAD): Users endpoint docs complete. Coverage: 100%. Evidence: .team/evidence/w2-apidoc-users-coverage.json"
```

### Pre-Commit Checks
```bash
# Automated pre-commit (TL enforces)
npx @stoplight/spectral-cli lint openapi.yaml   # OpenAPI lint
npm run lint                                      # ESLint (portal, JS SDK)
python -m ruff check sdks/python/src/             # Python SDK lint
go vet ./sdks/go/...                              # Go SDK vet

# Verify no secrets in staged files
git diff --cached --name-only | xargs grep -l \
  'API_KEY\|SECRET\|PASSWORD\|TOKEN\|ACCESS_TOKEN\|BEARER\|sk-\|pk_' \
  && echo "BLOCKED: Secrets detected" && exit 1

# Verify no broken internal links in staged markdown
git diff --cached --name-only --diff-filter=AM -- '*.md' | while read f; do
  grep -oP '\[.*?\]\((?!http)(.*?)\)' "$f" | while read link; do
    target=$(echo "$link" | grep -oP '\((.*?)\)' | tr -d '()')
    [ ! -f "$target" ] && echo "BROKEN LINK in $f: $target"
  done
done
```

---

## 16. COMPREHENSIVE TESTING MATRIX

### DevRel Test Pyramid
```
              +---------------------+
              |     E2E Tests       |  <- Full tutorial execution, portal flows
              |  (Tutorial + Portal)|
              +---------------------+
             /                       \
        +---------------------------+
        |   Integration Tests       |  <- SDK against live API, search indexing
        | (SDK, API, Search, Bots)  |
        +---------------------------+
       /                             \
  +-----------------------------------+
  |        Unit Tests                 |  <- SDK methods, helpers, formatters
  | (SDK logic, parsers, validators) |
  +-----------------------------------+
 /                                     \
+---------------------------------------+
|         Static Analysis               |  <- Lint, type-check, spec validation
| (Spectral, ESLint, Ruff, go vet)     |
+---------------------------------------+
```

### Coverage Requirements

| Layer | Minimum Coverage | Tools | Blocking? |
|-------|-----------------|-------|-----------|
| Static Analysis | 0 errors, 0 warnings | Spectral, ESLint, Ruff, go vet, mypy | YES |
| Unit Tests (SDKs) | >= 80% line coverage | Jest, Pytest, go test, JUnit | YES |
| Integration Tests | All SDK methods tested against API | Jest, Pytest, go test | YES |
| Code Sample Tests | 100% compile and run | Custom harness per language | YES |
| Link Validation | 0 broken links | lychee, broken-link-checker | YES |
| Portal Lighthouse | Performance > 90 | Lighthouse CLI | YES |
| Tutorial Execution | 100% pass in clean env | Docker-based test runner | YES |
| OpenAPI Spec | 0 Spectral errors | Spectral CLI | YES |
| Security Scan | 0 CRITICAL, 0 HIGH | npm audit, pip-audit, Gitleaks | YES |
| Search Relevance | Top-3 accuracy > 80% | Custom search test suite | NO (report only) |

### QA Agent Testing Protocol

#### Phase 1: STATIC ANALYSIS
```bash
# OpenAPI spec linting
npx @stoplight/spectral-cli lint openapi.yaml --format json \
  2>&1 | tee .team/evidence/spectral-lint-results.json

# Portal linting
cd portal && npm run lint 2>&1 | tee ../.team/evidence/portal-lint-results.txt

# SDK linting (all languages)
cd sdks/javascript && npm run lint 2>&1 | tee ../../.team/evidence/sdk-js-lint-results.txt
cd sdks/python && python -m ruff check src/ 2>&1 | tee ../../.team/evidence/sdk-python-lint-results.txt
cd sdks/go && go vet ./... 2>&1 | tee ../../.team/evidence/sdk-go-vet-results.txt
cd sdks/java && mvn checkstyle:check 2>&1 | tee ../../.team/evidence/sdk-java-checkstyle-results.txt
```

#### Phase 2: UNIT TESTS
```bash
# SDK unit tests with coverage
cd sdks/javascript && npm test -- --coverage 2>&1 | tee ../../.team/evidence/sdk-js-unit-results.txt
cd sdks/python && pytest --cov=src --cov-report=term 2>&1 | tee ../../.team/evidence/sdk-python-unit-results.txt
cd sdks/go && go test ./... -cover -v 2>&1 | tee ../../.team/evidence/sdk-go-unit-results.txt
cd sdks/java && mvn test 2>&1 | tee ../../.team/evidence/sdk-java-unit-results.txt
```

#### Phase 3: INTEGRATION TESTS
```bash
# SDK against live/sandbox API
cd sdks/javascript && npm run test:integration 2>&1 | tee ../../.team/evidence/sdk-js-integration.txt
cd sdks/python && pytest tests/integration/ 2>&1 | tee ../../.team/evidence/sdk-python-integration.txt
cd sdks/go && go test ./tests/integration/... 2>&1 | tee ../../.team/evidence/sdk-go-integration.txt
cd sdks/java && mvn verify -Pintegration 2>&1 | tee ../../.team/evidence/sdk-java-integration.txt

# Portal search integration
node -e "
const search = require('./portal/src/search');
const queries = ['auth', 'rate limit', 'pagination', 'webhook', 'SDK'];
Promise.all(queries.map(async q => {
  const results = await search.query(q);
  return { query: q, count: results.length, topResult: results[0]?.title };
})).then(r => console.log(JSON.stringify(r, null, 2)));
" > .team/evidence/search-integration-results.json 2>&1
```

#### Phase 4: CODE SAMPLE TESTS
```bash
# Test all code samples in isolated environments
# JavaScript samples
for f in code-samples/javascript/*.js; do
  echo "Testing: $f"
  timeout 30 node "$f" 2>&1
  echo "EXIT: $?"
done > .team/evidence/code-samples-js-results.txt 2>&1

# Python samples
for f in code-samples/python/*.py; do
  echo "Testing: $f"
  timeout 30 python "$f" 2>&1
  echo "EXIT: $?"
done > .team/evidence/code-samples-python-results.txt 2>&1

# Go samples
for f in code-samples/go/*.go; do
  echo "Testing: $f"
  timeout 30 go run "$f" 2>&1
  echo "EXIT: $?"
done > .team/evidence/code-samples-go-results.txt 2>&1
```

#### Phase 5: LINK VALIDATION
```bash
# Comprehensive link check
lychee --format json --output .team/evidence/link-check-results.json \
  --exclude-loopback --timeout 30 \
  docs/ tutorials/ api-reference/ portal/docs/ sdks/*/README.md 2>&1

# Count results
node -e "
const data = require('./.team/evidence/link-check-results.json');
console.log('Total links:', data.stats?.total || 'N/A');
console.log('Successful:', data.stats?.successful || 'N/A');
console.log('Failed:', data.stats?.failures || 'N/A');
console.log('Status:', (data.stats?.failures || 0) === 0 ? 'PASS' : 'FAIL');
" > .team/evidence/link-check-summary.txt 2>&1
```

#### Phase 6: PORTAL LIGHTHOUSE
```bash
# Lighthouse audit
npx lighthouse https://localhost:3000 --output=json \
  --output-path=.team/evidence/lighthouse-results.json \
  --chrome-flags="--headless --no-sandbox" 2>&1

# Extract scores
node -e "
const lhr = require('./.team/evidence/lighthouse-results.json');
const scores = {
  performance: Math.round(lhr.categories.performance.score * 100),
  accessibility: Math.round(lhr.categories.accessibility.score * 100),
  bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
  seo: Math.round(lhr.categories.seo.score * 100),
  gate: lhr.categories.performance.score >= 0.9 ? 'PASS' : 'FAIL'
};
console.log(JSON.stringify(scores, null, 2));
" > .team/evidence/lighthouse-scores.json 2>&1
```

#### Phase 7: TUTORIAL EXECUTION
```bash
# Execute tutorials in clean Docker containers
for tutorial_dir in tutorials/*/; do
  name=$(basename "$tutorial_dir")
  echo "=== Testing tutorial: $name ==="
  docker run --rm \
    -v "$(pwd)/$tutorial_dir":/tutorial \
    -w /tutorial \
    node:20-slim bash -c "
      cat README.md
      npm install 2>&1
      node index.js 2>&1
      echo 'EXIT_CODE:' \$?
    " 2>&1
done > .team/evidence/tutorial-execution-results.txt 2>&1
```

#### Phase 8: SECURITY TESTS
```bash
# Dependency audits
cd sdks/javascript && npm audit --audit-level=high 2>&1 | tee ../../.team/evidence/sdk-js-audit.txt
cd sdks/python && pip-audit 2>&1 | tee ../../.team/evidence/sdk-python-audit.txt
cd portal && npm audit --audit-level=high 2>&1 | tee ../.team/evidence/portal-audit.txt

# Secrets scan
gitleaks detect --source . 2>&1 | tee .team/evidence/gitleaks-results.txt

# Verify no API keys in code samples
grep -r "sk-\|pk_\|Bearer \|api_key=" code-samples/ docs/ tutorials/ \
  --include="*.js" --include="*.py" --include="*.go" --include="*.java" --include="*.md" \
  2>&1 | tee .team/evidence/secrets-in-docs-scan.txt
echo "Expected: 0 real keys (all should use placeholders like YOUR_API_KEY)" >> .team/evidence/secrets-in-docs-scan.txt
```

---

## 17. GITHUB ACTIONS — LOCAL TESTING

### Install `act` for Local CI
```bash
# macOS
brew install act
# Windows
scoop install act
# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Verify
act --version
```

### Developer Relations CI Workflow (`.github/workflows/devrel-ci.yml`)
```yaml
name: Developer Relations CI

on: [push, pull_request]

jobs:
  openapi-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npx @stoplight/spectral-cli lint openapi.yaml

  portal-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: cd portal && npm ci
      - run: cd portal && npm run build
      - run: cd portal && npm run lint

  portal-lighthouse:
    runs-on: ubuntu-latest
    needs: [portal-build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: cd portal && npm ci && npm run build
      - run: cd portal && npm run serve &
      - run: sleep 5
      - run: npx lighthouse http://localhost:3000 --output=json --chrome-flags="--headless --no-sandbox" | jq '.categories.performance.score'
      - name: Check Lighthouse score
        run: |
          SCORE=$(npx lighthouse http://localhost:3000 --output=json --chrome-flags="--headless --no-sandbox" | jq '.categories.performance.score')
          if (( $(echo "$SCORE < 0.9" | bc -l) )); then
            echo "Lighthouse performance score $SCORE is below 0.9 threshold"
            exit 1
          fi

  sdk-javascript:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: cd sdks/javascript && npm ci
      - run: cd sdks/javascript && npm run build
      - run: cd sdks/javascript && npm test -- --coverage --ci
      - uses: actions/upload-artifact@v4
        with:
          name: sdk-js-coverage
          path: sdks/javascript/coverage/

  sdk-python:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.10', '3.11', '3.12']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: cd sdks/python && pip install -e ".[dev]"
      - run: cd sdks/python && python -m ruff check src/
      - run: cd sdks/python && pytest --cov=src --cov-report=xml

  sdk-go:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: cd sdks/go && go build ./...
      - run: cd sdks/go && go test ./... -cover -race

  sdk-java:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: cd sdks/java && mvn compile
      - run: cd sdks/java && mvn test

  code-samples:
    runs-on: ubuntu-latest
    needs: [sdk-javascript, sdk-python, sdk-go, sdk-java]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: |
          for f in code-samples/javascript/*.js; do
            echo "Testing: $f"
            timeout 30 node "$f" || exit 1
          done
      - run: |
          for f in code-samples/python/*.py; do
            echo "Testing: $f"
            timeout 30 python "$f" || exit 1
          done

  link-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lycheeverse/lychee-action@v2
        with:
          args: --verbose docs/ tutorials/ api-reference/ portal/docs/ sdks/*/README.md
          fail: true

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd sdks/javascript && npm ci && npm audit --audit-level=high
      - run: cd portal && npm ci && npm audit --audit-level=high
      - run: pip install pip-audit && cd sdks/python && pip-audit -r requirements.txt
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Run Locally with `act`
```bash
# Run full CI
act push 2>&1 | tee .team/evidence/act-ci-output.txt

# Run specific jobs
act push -j openapi-lint 2>&1 | tee .team/evidence/act-openapi-lint.txt
act push -j portal-build 2>&1 | tee .team/evidence/act-portal-build.txt
act push -j sdk-javascript 2>&1 | tee .team/evidence/act-sdk-js.txt
act push -j sdk-python 2>&1 | tee .team/evidence/act-sdk-python.txt
act push -j sdk-go 2>&1 | tee .team/evidence/act-sdk-go.txt
act push -j sdk-java 2>&1 | tee .team/evidence/act-sdk-java.txt
act push -j code-samples 2>&1 | tee .team/evidence/act-code-samples.txt
act push -j link-check 2>&1 | tee .team/evidence/act-link-check.txt
act push -j security 2>&1 | tee .team/evidence/act-security.txt

# Verify all passed
grep -c "Job succeeded" .team/evidence/act-ci-output.txt > .team/evidence/act-summary.txt
echo "Expected: 10 jobs" >> .team/evidence/act-summary.txt
```

---

## 18. PM KANBAN — REAL-TIME TRACKING

### GitHub Projects V2 Setup
```bash
# Create project board
gh project create --title "Developer Relations - $(date +%Y-%m-%d)" --owner @me

# Add custom fields
gh project field-create <PROJECT_ID> --name "Wave" --data-type "SINGLE_SELECT" \
  --single-select-options "Wave 1,Wave 1.5,Wave 2,Wave 2.5,Wave 3,Wave 3.5,Wave 4,Wave 5"

gh project field-create <PROJECT_ID> --name "Domain" --data-type "SINGLE_SELECT" \
  --single-select-options "API Docs,SDK,Portal,Tutorials,Community,DX,QA,Release"

gh project field-create <PROJECT_ID> --name "Evidence" --data-type "TEXT"
gh project field-create <PROJECT_ID> --name "Coverage %" --data-type "NUMBER"
gh project field-create <PROJECT_ID> --name "Lighthouse Score" --data-type "NUMBER"
gh project field-create <PROJECT_ID> --name "SDK Language" --data-type "SINGLE_SELECT" \
  --single-select-options "JavaScript,Python,Go,Java,Ruby,C#,All"
```

### Real-Time Updates
PM updates issue status as work progresses:
```bash
# Move task to In Progress
gh issue edit <NUMBER> --add-label "status:in-progress" --remove-label "status:todo"

# Move task to Done with evidence
gh issue comment <NUMBER> --body "DONE. Endpoint coverage: 100%. Spectral lint: 0 errors. Evidence: .team/evidence/w2-apidoc-coverage-report.json"
gh issue edit <NUMBER> --add-label "status:done" --remove-label "status:in-progress"
```

### Label Taxonomy
```bash
# Create all labels
gh label create "domain:api-docs" --color "0E8A16" --description "API documentation"
gh label create "domain:sdk" --color "1D76DB" --description "Client SDKs"
gh label create "domain:portal" --color "5319E7" --description "Developer portal"
gh label create "domain:tutorials" --color "FBCA04" --description "Tutorials & guides"
gh label create "domain:community" --color "D93F0B" --description "Community engineering"
gh label create "domain:dx" --color "0075CA" --description "Developer experience"
gh label create "domain:qa" --color "BFD4F2" --description "QA & validation"
gh label create "domain:release" --color "B60205" --description "Release management"
gh label create "lang:javascript" --color "F1E05A" --description "JavaScript/TypeScript SDK"
gh label create "lang:python" --color "3572A5" --description "Python SDK"
gh label create "lang:go" --color "00ADD8" --description "Go SDK"
gh label create "lang:java" --color "B07219" --description "Java SDK"
gh label create "priority:p0" --color "B60205" --description "Critical"
gh label create "priority:p1" --color "D93F0B" --description "High"
gh label create "priority:p2" --color "FBCA04" --description "Medium"
gh label create "priority:p3" --color "0E8A16" --description "Low"
gh label create "wave:1" --color "C5DEF5" --description "Planning wave"
gh label create "wave:2" --color "BFD4F2" --description "Engineering wave"
gh label create "wave:3" --color "D4C5F9" --description "QA wave"
gh label create "wave:4" --color "F9D0C4" --description "Release wave"
```

### Kanban Columns
| Column | Entry Criteria | Exit Criteria |
|--------|---------------|---------------|
| Backlog | Issue created with labels | Assigned to wave |
| Todo | Assigned to agent in current wave | Agent starts work |
| In Progress | Agent actively working | Deliverable + evidence complete |
| In Review | Evidence submitted, tests pass | TL reviews and approves |
| Done | TL approved, all gates pass, evidence verified | Issue closed |

### Kanban File Format (`.team/KANBAN.md`)
```markdown
# KANBAN — Developer Relations

## Backlog
- [ ] #1 OpenAPI 3.1 spec creation (APIDOC)
- [ ] #2 JavaScript SDK (SDK)

## Todo
- [ ] #3 Portal architecture (PORTAL)

## In Progress
- [ ] #4 Quickstart guide (TUTORIAL) — 60% complete

## In Review
- [x] #5 Discord bot setup (COMMUNITY) — evidence: .team/evidence/w2-community-discord-health.json

## Done
- [x] #6 Project charter (PM) — closed
- [x] #7 Plan evaluation (JUDGE) — verdict: Plan B selected
```

---

*Developer Relations Team v3.0 — Amenthyx AI Teams*
*11 Roles | 5 Waves | 17 Gates | Evidence-Driven | Strategy-Driven | GitHub-Integrated*
*Enhanced: Evidence Protocol | Local Install | Atomic Commits | Testing Matrix | Local CI | Real-Time Kanban*
*Domains: API Documentation | SDKs | Developer Portal | Tutorials | Community | Developer Experience | Release Management*