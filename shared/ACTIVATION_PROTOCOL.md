# Activation Protocol

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

  --team fullStack      Full-Stack Team (general full-stack development)
  --team flutter        Flutter Mobile Team (Flutter/Dart mobile apps)
  --team dotnet         .NET Enterprise Team (C#, .NET enterprise)
  ...

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
3. Combines them into the Team Leader's activation prompt:

```
You are activating as the Team Leader for the {TEAM_NAME}.

TEAM PROTOCOL:
{contents of TEAM.md}

PROJECT STRATEGY:
{contents of strategy file}

SHARED RESOURCES:
- PM GitHub Integration: {contents of PM_GITHUB_INTEGRATION.md}
- PPTX Generator: shared/PPTX_GENERATOR.py
- PDF Generator: shared/PDF_GENERATOR.py

Begin execution at Wave 0.
```

### Execution Context Injection

The strategy file content is injected into EVERY agent's prompt as `PROJECT STRATEGY:` context. This ensures all team members — from PM to QA to Release Manager — understand the project goals, constraints, and success criteria.

```
Task(
  subagent_type="general-purpose",
  prompt="""
  {AGENT_PERSONA}

  PROJECT STRATEGY:
  {strategy_file_content}

  PROJECT CHARTER:
  {read .team/PROJECT_CHARTER.md}

  YOUR TASKS:
  ...
  """
)
```

### Session Commands

| Command | Action |
|---------|--------|
| `--team <name> --strategy <path>` | Activate a new team session |
| `team status` | Show current KANBAN + TIMELINE |
| `team report` | Force PM to generate PPTX + PDF now |
| `team decide <topic>` | Trigger decision aggregation |
| `team gate check` | Run all quality gate checks |
| `pause team` | Save state and pause execution |
| `resume team` | Resume from saved `.team/` state |

### Multiple Teams

You can run multiple teams on different projects simultaneously in different terminal sessions. Each team operates in its own project directory with its own `.team/` folder.

### Adding New Teams

1. Create a numbered folder in the repo: `22-your-team/`
2. Add a `TEAM.md` with the standard structure
3. Include `Activation: --team yourKeyword` in the header
4. Push to `Amenthyx/amenthyx-ai-teams`
5. The team is immediately discoverable on next `git pull`
