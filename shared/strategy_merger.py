#!/usr/bin/env python3
"""
Amenthyx AI Strategy Merger — Uses Claude AI to intelligently merge user strategies
into Amenthyx-compliant format.

When a user provides their own strategy file (any format, any structure), this tool:
  1. Reads the Amenthyx strategy template (canonical structure)
  2. Reads the user's strategy (free-form)
  3. Sends both to Claude AI with instructions to merge them
  4. Claude rewrites the user's content into every Amenthyx section
  5. Missing sections get intelligent defaults based on what Claude inferred

The AI understands context — it can extract features from a paragraph, infer tech stack
from code references, and fill gaps with reasonable defaults.

Three usage modes (auto-detects the best available):

  MODE 1 — Claude Code CLI (no API key — uses your Claude subscription):
    python strategy_merger.py user-strategy.md --cli
    python strategy_merger.py user-strategy.md --cli --team fullStack
    Requires: npm install -g @anthropic-ai/claude-code + claude login

  MODE 2 — Claude API (programmatic, requires ANTHROPIC_API_KEY):
    python strategy_merger.py user-strategy.md
    python strategy_merger.py user-strategy.md --team fullStack
    python strategy_merger.py user-strategy.md --model claude-opus-4-6
    Requires: pip install anthropic + ANTHROPIC_API_KEY env var

  MODE 3 — Prompt file (manual paste into Claude.ai):
    python strategy_merger.py user-strategy.md --prompt
    Generates a prompt file you paste into any Claude interface.

Auto-detection priority (when no flag specified):
    1. ANTHROPIC_API_KEY set? -> API mode
    2. claude CLI found? -> CLI mode (no key needed)
    3. Neither? -> generates prompt file

Environment:
    ANTHROPIC_API_KEY=sk-ant-...   (required for API mode only)

Python 3.8+. API mode requires: pip install anthropic
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from typing import Optional

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHARED = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------------------
# ANSI colours
# ---------------------------------------------------------------------------

_COLOR = True
if sys.platform == "win32":
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except Exception:
        _COLOR = False
if not sys.stdout.isatty():
    _COLOR = False


class C:
    GREEN  = "\033[92m" if _COLOR else ""
    YELLOW = "\033[93m" if _COLOR else ""
    RED    = "\033[91m" if _COLOR else ""
    CYAN   = "\033[96m" if _COLOR else ""
    BOLD   = "\033[1m"  if _COLOR else ""
    DIM    = "\033[2m"  if _COLOR else ""
    RESET  = "\033[0m"  if _COLOR else ""


# ---------------------------------------------------------------------------
# Template loader
# ---------------------------------------------------------------------------

def load_template() -> str:
    """Load the Amenthyx strategy template."""
    paths = [
        os.path.join(BASE, "STRATEGY_TEMPLATE.md"),
        os.path.join(SHARED, "templates", "STRATEGY_TEMPLATE.md"),
    ]
    for p in paths:
        if os.path.isfile(p):
            with open(p, "r", encoding="utf-8", errors="replace") as f:
                return f.read()
    raise FileNotFoundError("STRATEGY_TEMPLATE.md not found in project root or shared/templates/")


def load_team_context(team_keyword: str) -> Optional[str]:
    """Load team-specific context from TEAM.md (first 100 lines)."""
    # Find team directory
    for entry in os.listdir(BASE):
        team_dir = os.path.join(BASE, entry)
        team_md = os.path.join(team_dir, "TEAM.md")
        if not os.path.isdir(team_dir) or not entry[:2].isdigit():
            continue
        if not os.path.isfile(team_md):
            continue
        # Check activation keyword
        with open(team_md, "r", encoding="utf-8", errors="replace") as f:
            header = ""
            for i, line in enumerate(f):
                header += line
                if i > 10:
                    break
        if f"--team {team_keyword}" in header:
            with open(team_md, "r", encoding="utf-8", errors="replace") as f:
                lines = f.readlines()[:100]
            return "".join(lines)
    return None


# ---------------------------------------------------------------------------
# AI Merger
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are the Amenthyx Strategy Merger — an AI that takes a user's project strategy
(in any format) and rewrites it into the exact Amenthyx strategy template structure.

Your job:
1. Read the user's strategy and understand their project deeply
2. Read the Amenthyx template structure (the canonical format)
3. Produce a COMPLETE merged strategy that:
   - Uses the EXACT Amenthyx section numbering and headings (## 1. Project Identity, ## 1.1 Deliverable Product Target, etc.)
   - Fills EVERY section with content derived from the user's strategy
   - Where the user didn't provide information for a section, make intelligent inferences based on what they DID provide
   - Where you truly cannot infer, use sensible defaults and mark with [INFERRED] or [DEFAULT]
   - Preserve ALL user requirements — never drop user content
   - Add Amenthyx mandatory requirements that the user didn't mention (UAT, screenshots, evidence, etc.)

Rules:
- Output ONLY the merged strategy markdown — no preamble, no explanation, no code fences
- Keep the user's specific choices (tech stack, features, constraints) exactly as they stated them
- Fill in Amenthyx-specific sections (UAT, Evidence, Screenshots, Data Preservation, Git Sync) with appropriate defaults
- The merged strategy must be immediately usable with `--team <name> --strategy merged.md`
- Use the v3.3 format with all sections numbered correctly
- Include the --- separators between sections
- Mark inferred content with [INFERRED] and default content with [DEFAULT] so users can review"""


def merge_with_ai(
    user_strategy: str,
    template: str,
    team_context: Optional[str] = None,
    model: str = "claude-sonnet-4-6",
) -> str:
    """Use Claude AI to merge user strategy into Amenthyx format."""
    try:
        import anthropic
    except ImportError:
        print(f"{C.RED}ERROR: anthropic package not installed.{C.RESET}")
        print(f"Run: pip install anthropic")
        print(f"Then set: ANTHROPIC_API_KEY=sk-ant-...")
        sys.exit(1)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print(f"{C.RED}ERROR: ANTHROPIC_API_KEY environment variable not set.{C.RESET}")
        print(f"Set it: export ANTHROPIC_API_KEY=sk-ant-...")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    # Build the user message
    user_message = f"""## USER'S STRATEGY (to be merged)

{user_strategy}

---

## AMENTHYX TEMPLATE (target structure — use this exact section numbering)

{template}"""

    if team_context:
        user_message += f"""

---

## TEAM CONTEXT (the team that will execute this strategy)

{team_context}

Use this team's domain expertise to make better inferences. For example, if this is a Flutter team,
infer Flutter-appropriate testing tools, CI/CD patterns, and evidence types."""

    user_message += """

---

Now merge the user's strategy into the Amenthyx template format. Output ONLY the complete merged
strategy markdown. Every section from the template must be present, filled with user content where
available and intelligent defaults where not."""

    print(f"  {C.DIM}Calling Claude ({model})...{C.RESET}")

    response = client.messages.create(
        model=model,
        max_tokens=16000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    # Extract text from response
    result = ""
    for block in response.content:
        if hasattr(block, "text"):
            result += block.text

    # Clean up — remove any code fences if the model wrapped it
    result = result.strip()
    if result.startswith("```markdown"):
        result = result[len("```markdown"):].strip()
    if result.startswith("```md"):
        result = result[len("```md"):].strip()
    if result.startswith("```"):
        result = result[3:].strip()
    if result.endswith("```"):
        result = result[:-3].strip()

    # Report token usage
    input_tokens = response.usage.input_tokens
    output_tokens = response.usage.output_tokens
    print(f"  {C.DIM}Tokens: {input_tokens} in, {output_tokens} out{C.RESET}")

    return result


# ---------------------------------------------------------------------------
# Compliance checker (post-merge validation)
# ---------------------------------------------------------------------------

def check_compliance(merged: str) -> dict:
    """Check how many Amenthyx sections are present in the merged output."""
    required_sections = [
        ("1", "Project Identity"),
        ("1.1", "Deliverable Product Target"),
        ("2", "Target Audience"),
        ("3", "Core Features"),
        ("4", "Technical Constraints"),
        ("5", "Non-Functional Requirements"),
        ("6", "Testing Requirements"),
        ("6.1", "UAT Testing Requirements"),
        ("7", "Timeline"),
        ("7.1", "Cost Approval"),
        ("8", "Success Criteria"),
        ("9", "Reference"),
        ("10", "Out of Scope"),
        ("11", "Risk"),
        ("11.1", "Dynamic Agent Scaling"),
        ("12", "Evidence"),
        ("12.0.1", "Screenshots"),
        ("12.0.2", "Documentation Website"),
        ("12.0.3", "Mission Control PDF"),
        ("12.1", "Data Preservation"),
        ("13", "GitHub Auto-Sync"),
        ("14", "Additional Context"),
    ]

    found = []
    missing = []
    for sec_id, name in required_sections:
        # Check for ## N. or ## N.N pattern
        pattern = rf"^##\s+{re.escape(sec_id)}[\.\s]"
        if re.search(pattern, merged, re.MULTILINE):
            found.append(f"{sec_id}. {name}")
        else:
            missing.append(f"{sec_id}. {name}")

    inferred = len(re.findall(r"\[INFERRED\]", merged))
    defaults = len(re.findall(r"\[DEFAULT\]", merged))

    pct = (len(found) / len(required_sections) * 100) if required_sections else 0

    return {
        "total_sections": len(required_sections),
        "found": len(found),
        "missing": len(missing),
        "missing_sections": missing,
        "inferred_count": inferred,
        "default_count": defaults,
        "compliance_pct": round(pct, 1),
    }


# ---------------------------------------------------------------------------
# Prompt mode — for Claude Code CLI / Claude.ai users (no API key needed)
# ---------------------------------------------------------------------------

def generate_prompt(user_strategy: str, template: str, team_context: Optional[str] = None) -> str:
    """Generate a prompt that users can paste into Claude Code or Claude.ai."""
    prompt = f"""{SYSTEM_PROMPT}

---

## USER'S STRATEGY (to be merged)

{user_strategy}

---

## AMENTHYX TEMPLATE (target structure — use this exact section numbering)

{template}"""

    if team_context:
        prompt += f"""

---

## TEAM CONTEXT (the team that will execute this strategy)

{team_context}

Use this team's domain expertise to make better inferences."""

    prompt += """

---

Now merge the user's strategy into the Amenthyx template format. Output ONLY the complete merged
strategy markdown. Every section from the template must be present, filled with user content where
available and intelligent defaults where not.

IMPORTANT: Output the merged strategy directly — no code fences, no preamble, no explanation."""

    return prompt


# ---------------------------------------------------------------------------
# Claude Code CLI — no API key needed
# ---------------------------------------------------------------------------

def find_claude_cli() -> Optional[str]:
    """Find the claude CLI executable on the system."""
    # Check common locations
    claude_path = shutil.which("claude")
    if claude_path:
        return claude_path

    # Windows: check npm global, AppData, common install paths
    if sys.platform == "win32":
        candidates = [
            os.path.expandvars(r"%APPDATA%\npm\claude.cmd"),
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\claude\claude.exe"),
            os.path.expandvars(r"%USERPROFILE%\.claude\bin\claude.exe"),
        ]
    else:
        # Linux / macOS
        candidates = [
            os.path.expanduser("~/.npm-global/bin/claude"),
            "/usr/local/bin/claude",
            os.path.expanduser("~/.local/bin/claude"),
            os.path.expanduser("~/.claude/bin/claude"),
        ]

    for p in candidates:
        if os.path.isfile(p):
            return p

    return None


def merge_with_claude_cli(
    user_strategy: str,
    template: str,
    team_context: Optional[str] = None,
) -> str:
    """Use the claude CLI (Claude Code) to merge strategies — no API key needed.

    Requires Claude Code CLI installed with an active subscription.
    Runs: claude -p "<prompt>" --output-format text
    """
    claude_bin = find_claude_cli()
    if not claude_bin:
        print(f"{C.RED}ERROR: claude CLI not found on your system.{C.RESET}")
        print()
        print(f"  Install Claude Code CLI:")
        print(f"    {C.CYAN}npm install -g @anthropic-ai/claude-code{C.RESET}")
        print()
        print(f"  Or use alternative modes:")
        print(f"    {C.DIM}--prompt    Generate prompt file (paste into Claude.ai){C.RESET}")
        print(f"    {C.DIM}(no flag)   API mode (requires ANTHROPIC_API_KEY){C.RESET}")
        sys.exit(1)

    # Build the full prompt
    prompt = generate_prompt(user_strategy, template, team_context)

    print(f"  {C.CYAN}Running claude CLI...{C.RESET}")
    print(f"  {C.DIM}Binary: {claude_bin}{C.RESET}")
    print(f"  {C.DIM}Prompt: {len(prompt)} chars{C.RESET}")
    print()

    try:
        result = subprocess.run(
            [claude_bin, "-p", prompt, "--output-format", "text"],
            capture_output=True,
            text=True,
            timeout=300,  # 5 minute timeout
            cwd=os.getcwd(),
        )

        if result.returncode != 0:
            stderr = result.stderr.strip()
            if "not logged in" in stderr.lower() or "auth" in stderr.lower():
                print(f"{C.RED}ERROR: Claude CLI not authenticated.{C.RESET}")
                print(f"  Run: {C.CYAN}claude login{C.RESET}")
            else:
                print(f"{C.RED}ERROR: claude CLI failed (exit code {result.returncode}){C.RESET}")
                if stderr:
                    print(f"  {C.DIM}{stderr[:500]}{C.RESET}")
            sys.exit(1)

        output = result.stdout.strip()
        if not output:
            print(f"{C.RED}ERROR: claude CLI returned empty output.{C.RESET}")
            sys.exit(1)

        # Strip any code fences if Claude wrapped the output
        if output.startswith("```"):
            lines = output.split("\n")
            # Remove first and last code fence lines
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            output = "\n".join(lines)

        return output

    except subprocess.TimeoutExpired:
        print(f"{C.RED}ERROR: claude CLI timed out after 5 minutes.{C.RESET}")
        print(f"  Try reducing your strategy size, or use --prompt mode.")
        sys.exit(1)
    except FileNotFoundError:
        print(f"{C.RED}ERROR: Could not execute claude at: {claude_bin}{C.RESET}")
        sys.exit(1)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Amenthyx AI Strategy Merger — intelligently merge user strategies into Amenthyx format using Claude AI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Usage Modes (auto-detects best available):\n"
            "\n"
            "  MODE 1 — Claude Code CLI (no API key needed):\n"
            "    %(prog)s my-idea.md --cli                        Merge via claude CLI\n"
            "    %(prog)s my-idea.md --cli --team fullStack        Team-specific merge\n"
            "    Requires: npm install -g @anthropic-ai/claude-code + claude login\n"
            "\n"
            "  MODE 2 — Claude API (programmatic):\n"
            "    %(prog)s my-idea.md                              Merge via API\n"
            "    %(prog)s my-idea.md --team fullStack              Team-specific merge\n"
            "    %(prog)s my-idea.md --model claude-opus-4-6       Use Opus model\n"
            "    Requires: ANTHROPIC_API_KEY env var + pip install anthropic\n"
            "\n"
            "  MODE 3 — Prompt file (manual):\n"
            "    %(prog)s my-idea.md --prompt                     Generate prompt file\n"
            "    %(prog)s my-idea.md --prompt --team fullStack     With team context\n"
            "    Paste into Claude.ai or any Claude interface.\n"
        ),
    )
    parser.add_argument("strategy", help="Path to user's strategy file (any format)")
    parser.add_argument("--output", "-o", default=None, help="Output path (default: <input>-amenthyx.md)")
    parser.add_argument("--team", "-t", default=None, help="Team keyword for team-specific context")
    parser.add_argument("--model", "-m", default="claude-sonnet-4-6",
                        help="Claude model for API mode (default: claude-sonnet-4-6)")
    parser.add_argument("--prompt", "-p", action="store_true",
                        help="Generate a prompt file instead of calling API (for Claude.ai users)")
    parser.add_argument("--cli", "-c", action="store_true",
                        help="Use Claude Code CLI directly (no API key — uses your Claude subscription)")

    args = parser.parse_args()

    if not os.path.isfile(args.strategy):
        print(f"{C.RED}File not found: {args.strategy}{C.RESET}")
        return 1

    print()
    print(f"{C.BOLD}  Amenthyx AI Strategy Merger{C.RESET}")
    print(f"{C.DIM}  {'=' * 45}{C.RESET}")
    print()

    # Load inputs
    print(f"  {C.CYAN}Loading...{C.RESET}")

    with open(args.strategy, "r", encoding="utf-8", errors="replace") as f:
        user_strategy = f.read()
    print(f"  User strategy:    {len(user_strategy)} chars")

    template = load_template()
    print(f"  Amenthyx template: {len(template)} chars")

    team_context = None
    if args.team:
        team_context = load_team_context(args.team)
        if team_context:
            print(f"  Team context:     {args.team} ({len(team_context)} chars)")
        else:
            print(f"  {C.YELLOW}Team '{args.team}' not found — proceeding without team context{C.RESET}")

    print()

    # --- Determine merge mode ---
    # Priority: --prompt > --cli > API key present > auto-detect claude CLI > fallback to prompt
    use_cli = args.cli
    use_prompt = args.prompt
    use_api = False

    if not use_cli and not use_prompt:
        # Auto-detect: API key available? Use API. Claude CLI available? Use CLI. Otherwise prompt.
        if os.environ.get("ANTHROPIC_API_KEY"):
            use_api = True
        elif find_claude_cli():
            use_cli = True
            print(f"  {C.CYAN}Auto-detected Claude Code CLI — using --cli mode (no API key needed){C.RESET}")
            print()
        else:
            use_prompt = True
            print(f"  {C.YELLOW}No ANTHROPIC_API_KEY and no Claude CLI found — generating prompt file{C.RESET}")
            print(f"  {C.DIM}Install Claude Code: npm install -g @anthropic-ai/claude-code{C.RESET}")
            print(f"  {C.DIM}Or set: export ANTHROPIC_API_KEY=sk-ant-...{C.RESET}")
            print()

    # --- PROMPT MODE ---
    if use_prompt:
        prompt = generate_prompt(user_strategy, template, team_context)
        prompt_path = args.output or args.strategy.replace(".md", "-merge-prompt.md")
        if prompt_path == args.strategy:
            prompt_path = args.strategy.replace(".md", "-prompt.md")

        with open(prompt_path, "w", encoding="utf-8") as f:
            f.write(prompt)

        print(f"  {C.GREEN}{C.BOLD}Merge prompt generated!{C.RESET}")
        print(f"  Output:  {os.path.abspath(prompt_path)}")
        print(f"  Size:    {len(prompt)} chars")
        print()
        print(f"  {C.CYAN}How to use:{C.RESET}")
        print(f"  {C.DIM}Option A — Claude Code CLI (recommended):{C.RESET}")
        print(f"    {C.CYAN}npm install -g @anthropic-ai/claude-code{C.RESET}")
        print(f"    Then re-run this command (Claude CLI will be auto-detected)")
        print()
        print(f"  {C.DIM}Option B — Claude.ai:{C.RESET}")
        print(f"    Go to claude.ai, paste the prompt file contents, copy the output")
        print(f"    Save as strategy.md")
        print()
        team_cmd = f" --team {args.team}" if args.team else " --team <teamName>"
        print(f"  {C.DIM}After getting the merged output, activate with:{C.RESET}")
        print(f"  {C.CYAN}{team_cmd} --strategy <merged-output>.md{C.RESET}")
        print()
        return 0

    # --- CLI MODE (no API key needed) ---
    if use_cli:
        merged = merge_with_claude_cli(user_strategy, template, team_context)
    else:
        # --- API MODE ---
        merged = merge_with_ai(user_strategy, template, team_context, args.model)

    # Check compliance
    report = check_compliance(merged)

    # Write output
    output_path = args.output or args.strategy.replace(".md", "-amenthyx.md")
    if output_path == args.strategy:
        output_path = args.strategy.replace(".md", "-merged.md")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(merged)

    # Print report
    pct = report["compliance_pct"]
    pct_color = C.GREEN if pct >= 90 else C.YELLOW if pct >= 70 else C.RED

    print()
    print(f"  {C.GREEN}{C.BOLD}Merged strategy created!{C.RESET}")
    print(f"  Output:           {os.path.abspath(output_path)}")
    print(f"  Sections:         {report['found']}/{report['total_sections']}")
    print(f"  Compliance:       {pct_color}{pct}%{C.RESET}")
    print(f"  AI-inferred:      {report['inferred_count']} sections")
    print(f"  Defaults applied: {report['default_count']} sections")

    if report["missing_sections"]:
        print(f"\n  {C.YELLOW}Missing sections (AI may need a retry):{C.RESET}")
        for s in report["missing_sections"]:
            print(f"    {C.YELLOW}!{C.RESET} {s}")

    print()
    print(f"  {C.DIM}Review [INFERRED] and [DEFAULT] markers, then activate:{C.RESET}")
    team_cmd = f" --team {args.team}" if args.team else " --team <teamName>"
    print(f"  {C.CYAN}{team_cmd} --strategy {output_path}{C.RESET}")
    print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
