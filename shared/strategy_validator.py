#!/usr/bin/env python3
"""
strategy_validator.py — Validates a strategy.md file against the
Amenthyx AI Teams STRATEGY_TEMPLATE.md v3.3 requirements.

Checks that all required sections exist, flags vague or template-placeholder
entries, and warns about missing constraints.  Prints a colored terminal
report and exits with an appropriate code.

Usage:
    python shared/strategy_validator.py path/to/strategy.md

Exit codes:
    0  — Grade A or B (ready to use)
    1  — Grade C (usable with warnings)
    2  — Grade D or F (not ready)

Python 3.8+, no external dependencies.
"""

import os
import re
import sys
from typing import Dict, List, Tuple

# ---------------------------------------------------------------------------
# ANSI colours (with Windows fallback)
# ---------------------------------------------------------------------------

_COLOR_SUPPORTED = True

if sys.platform == "win32":
    # Enable ANSI escape processing on Windows 10+
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32  # type: ignore[attr-defined]
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except Exception:
        _COLOR_SUPPORTED = False

if not sys.stdout.isatty():
    _COLOR_SUPPORTED = False


def _c(code: str, text: str) -> str:
    """Wrap *text* in ANSI colour *code* if the terminal supports it."""
    if _COLOR_SUPPORTED:
        return f"\033[{code}m{text}\033[0m"
    return text


def green(t: str) -> str:
    return _c("32", t)


def yellow(t: str) -> str:
    return _c("33", t)


def red(t: str) -> str:
    return _c("31", t)


def bold(t: str) -> str:
    return _c("1", t)


def cyan(t: str) -> str:
    return _c("36", t)


# ---------------------------------------------------------------------------
# Section definitions — what the validator expects
# ---------------------------------------------------------------------------

# Each entry: (header_pattern, human_label, list_of_required_subfields)
# A subfield can be:
#   str          — a keyword/label that must appear in the section body
#   ("table", N) — a markdown table with at least N data rows
#   ("checkbox",) — at least one checkbox line must exist
#   ("any_content",) — section must not be empty

REQUIRED_SECTIONS: List[Tuple[str, str, list]] = [
    (r"##\s*1\.\s*Project Identity",
     "1. Project Identity",
     ["Project Name", "One-Line Vision", "Problem Statement", "Project Type", "Repository"]),

    (r"##\s*1\.1\s*Deliverable Product Target",
     "1.1 Deliverable Product Target",
     ["Delivery Target", "Demo Requirements"]),

    (r"##\s*2\.\s*Target Audience",
     "2. Target Audience",
     ["Primary Users", ("table", 1)]),

    (r"##\s*3\.\s*Core Features",
     "3. Core Features",
     [("table", 2)]),  # P0 table with >= 2 feature rows

    (r"##\s*4\.\s*Technical Constraints",
     "4. Technical Constraints",
     ["Language", "Framework", "Database"]),

    (r"##\s*5\.\s*Non-Functional Requirements",
     "5. Non-Functional Requirements",
     ["Performance", "Security"]),

    (r"#{2,3}\s*6\.\s*Testing Requirements",
     "6. Testing Requirements",
     ["Coverage Target", ("checkbox",)]),

    (r"#{2,3}\s*6\.1\s*UAT Testing Requirements",
     "6.1 UAT Testing Requirements",
     ["UAT Coverage Target"]),

    (r"##\s*7\.\s*Timeline\s*&?\s*Milestones",
     "7. Timeline & Milestones",
     [("table", 1)]),

    (r"##\s*7\.1\s*Cost Approval",
     "7.1 Cost Approval",
     ["Token Budget Tolerance"]),

    (r"##\s*8\.\s*Success Criteria",
     "8. Success Criteria",
     [("checkbox",)]),

    (r"##\s*9\.\s*Reference\s*&?\s*Inspiration",
     "9. Reference & Inspiration",
     [("any_content",)]),

    (r"##\s*10\.\s*Out of Scope",
     "10. Out of Scope",
     [("any_content",)]),

    (r"##\s*11\.\s*Risk\s*&?\s*Constraints",
     "11. Risk & Constraints",
     [("table", 1)]),

    (r"##\s*11\.1\s*Dynamic Agent Scaling",
     "11.1 Dynamic Agent Scaling",
     [("any_content",)]),

    (r"##\s*12\.\s*Evidence\s*&?\s*Proof",
     "12. Evidence & Proof Requirements",
     [("checkbox",)]),

    (r"##\s*12\.0\.1\s*Screenshots",
     "12.0.1 Screenshots",
     []),

    (r"##\s*12\.0\.2\s*Documentation Website",
     "12.0.2 Documentation Website",
     []),

    (r"##\s*12\.0\.3\s*Mission Control PDF",
     "12.0.3 Mission Control PDF",
     []),

    (r"##\s*12\.1\s*Data Preservation",
     "12.1 Data Preservation",
     []),

    (r"##\s*13\.\s*GitHub Auto-Sync",
     "13. GitHub Auto-Sync",
     []),

    (r"##\s*14\.\s*Additional Context",
     "14. Additional Context",
     []),
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Patterns that indicate unfilled template placeholders
PLACEHOLDER_RE = re.compile(r"\[(?:Your\b|\.\.\.)\]", re.IGNORECASE)
TBD_RE = re.compile(r"\bTBD\b|\bTODO\b", re.IGNORECASE)
BUDGET_PLACEHOLDER_RE = re.compile(r"\[\$[Xx][\]\/]")
BRACKET_PLACEHOLDER_RE = re.compile(r"\[[A-Z][a-z].*?\]")  # e.g. [Feature name]


def _extract_sections(text: str) -> Dict[str, str]:
    """Split markdown *text* into {header_line: body} keyed by the raw header.

    Splits on both ``## `` and ``### `` headers so that subsections like
    ``### 6.1 UAT Testing Requirements`` are captured as independent entries.
    """
    parts: Dict[str, str] = {}
    current_header = ""
    current_body: List[str] = []

    for line in text.splitlines():
        if re.match(r"^#{2,3}\s", line):
            if current_header:
                parts[current_header] = "\n".join(current_body)
            current_header = line
            current_body = []
        else:
            current_body.append(line)

    if current_header:
        parts[current_header] = "\n".join(current_body)

    return parts


def _count_table_data_rows(body: str) -> int:
    """Count markdown table data rows (lines starting with |, excluding
    header-separator lines that contain only dashes/pipes/spaces)."""
    count = 0
    for line in body.splitlines():
        stripped = line.strip()
        if not stripped.startswith("|"):
            continue
        # Skip separator rows like |---|---|
        if re.match(r"^\|[\s\-:|]+\|$", stripped):
            continue
        # Skip header rows (first table row) — we count after separator
        count += 1
    # Subtract header row (the first | row before separator)
    return max(0, count - 1) if count > 0 else 0


def _count_checkboxes(body: str) -> Tuple[int, int]:
    """Return (checked, total) checkbox counts."""
    checked = len(re.findall(r"- \[x\]", body, re.IGNORECASE))
    unchecked = len(re.findall(r"- \[ \]", body))
    return checked, checked + unchecked


def _has_substantive_content(body: str) -> bool:
    """Return True if the body has real content beyond whitespace and
    markdown formatting."""
    cleaned = body.strip()
    # Remove blockquotes, horizontal rules, empty lines
    lines = [
        l.strip()
        for l in cleaned.splitlines()
        if l.strip() and not l.strip().startswith(">") and l.strip() != "---"
    ]
    return len(lines) > 0


def _is_single_word_answer(value: str) -> bool:
    """Check if a value after the colon is a single word (too vague)."""
    value = value.strip().strip("*").strip()
    # Ignore if it looks like a link, path, or checkbox
    if value.startswith("[") or value.startswith("http") or value.startswith("/"):
        return False
    words = value.split()
    return len(words) == 1 and len(value) > 0


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

def _score_section(header: str, body: str, subfields: list) -> Tuple[int, List[str]]:
    """Score a section 0-3 and collect warnings.

    0 = missing (caller handles this), 1 = exists but still template,
    2 = partially filled, 3 = fully filled.
    """
    warnings: List[str] = []

    if not _has_substantive_content(body):
        return 1, [f"Section '{header}' exists but is empty."]

    # Check for template placeholders
    placeholder_hits = PLACEHOLDER_RE.findall(body)
    bracket_hits = BRACKET_PLACEHOLDER_RE.findall(body)
    tbd_hits = TBD_RE.findall(body)

    has_placeholders = len(placeholder_hits) > 0 or len(tbd_hits) > 0
    # Bracket placeholders like [Feature name] but not [x] checkboxes
    meaningful_brackets = [b for b in bracket_hits if b not in ("[x]", "[ ]")]
    has_any_brackets = len(meaningful_brackets) > 0
    has_many_brackets = len(meaningful_brackets) > 3

    if has_placeholders:
        warnings.append(f"Template placeholders found: {placeholder_hits + tbd_hits}")

    if has_many_brackets:
        warnings.append(f"Many unfilled bracket placeholders ({len(meaningful_brackets)} found).")
    elif has_any_brackets:
        warnings.append(f"Unfilled bracket placeholders ({len(meaningful_brackets)} found).")

    # Check if all checkboxes are still unchecked (template state)
    checked, total_cb = _count_checkboxes(body)
    all_unchecked = total_cb > 0 and checked == 0

    # Validate subfields
    missing_subfields: List[str] = []
    for sf in subfields:
        if isinstance(sf, str):
            # Keyword must appear in body (case-insensitive)
            if sf.lower() not in body.lower():
                missing_subfields.append(sf)
        elif isinstance(sf, tuple):
            kind = sf[0]
            if kind == "table":
                min_rows = sf[1]
                rows = _count_table_data_rows(body)
                if rows < min_rows:
                    missing_subfields.append(
                        f"Table with >= {min_rows} data row(s) (found {rows})"
                    )
            elif kind == "checkbox":
                if total_cb == 0:
                    missing_subfields.append("At least one checkbox")
            elif kind == "any_content":
                if not _has_substantive_content(body):
                    missing_subfields.append("Non-empty content")

    if missing_subfields:
        warnings.append(f"Missing required elements: {', '.join(missing_subfields)}")

    if all_unchecked and total_cb > 2:
        warnings.append(f"All {total_cb} checkboxes are unchecked (still template defaults).")

    # Determine score
    # 1 = template: many placeholders + missing subfields, or all template indicators
    # 2 = partial: some placeholders or missing subfields
    # 3 = fully filled: no placeholders, no missing subfields, checkboxes engaged
    has_issues = has_placeholders or has_any_brackets or len(missing_subfields) > 0

    if (has_placeholders or has_many_brackets) and (len(missing_subfields) > 0 or all_unchecked):
        return 1, warnings  # exists but still template
    elif has_issues or all_unchecked:
        return 2, warnings  # partially filled
    else:
        return 3, warnings  # fully filled


# ---------------------------------------------------------------------------
# Vagueness checks (cross-section)
# ---------------------------------------------------------------------------

def _global_vagueness_checks(text: str) -> List[str]:
    """Run document-wide vagueness checks and return warnings."""
    warnings: List[str] = []

    # "team's choice" in too many tech stack fields
    tc_count = len(re.findall(r"team'?s?\s+choice", text, re.IGNORECASE))
    if tc_count > 3:
        warnings.append(
            f"'team's choice' appears {tc_count} times in tech stack fields. "
            "Strategy should be more specific."
        )

    # Budget placeholders
    if BUDGET_PLACEHOLDER_RE.search(text):
        warnings.append("Budget fields contain [$X] placeholders — fill in actual values.")

    # Missing dates in milestones section
    milestone_match = re.search(
        r"##\s*7\.?\s*Timeline.*?\n(.*?)(?=\n##|\Z)", text, re.DOTALL | re.IGNORECASE
    )
    if milestone_match:
        ms_body = milestone_match.group(1)
        # Check if any date-like pattern exists (YYYY-MM-DD, Month Day, etc.)
        has_dates = bool(re.search(
            r"\d{4}[-/]\d{1,2}[-/]\d{1,2}|"  # 2024-01-15
            r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}|"
            r"Q[1-4]\s+\d{4}|"  # Q1 2024
            r"Week\s+\d{1,2}",
            ms_body, re.IGNORECASE
        ))
        if not has_dates:
            warnings.append("No dates found in Timeline & Milestones section.")

    # P0 features missing acceptance criteria
    p0_match = re.search(
        r"###\s*P0.*?\n(.*?)(?=\n###|\n##|\Z)", text, re.DOTALL | re.IGNORECASE
    )
    if p0_match:
        p0_body = p0_match.group(1)
        # Count data rows vs rows with placeholder acceptance criteria
        for line in p0_body.splitlines():
            stripped = line.strip()
            if not stripped.startswith("|"):
                continue
            if re.match(r"^\|[\s\-:|]+\|$", stripped):
                continue
            # Skip header row
            if "Acceptance Criteria" in stripped:
                continue
            # Check if acceptance criteria column has a placeholder
            cells = [c.strip() for c in stripped.split("|")]
            if len(cells) >= 5:
                criteria = cells[4] if len(cells) > 4 else ""
                if BRACKET_PLACEHOLDER_RE.match(criteria) or not criteria:
                    warnings.append(
                        "P0 feature row has missing/placeholder acceptance criteria."
                    )
                    break  # one warning is enough

    # Single-word answers in key description fields
    for pattern in [r"\*\*Problem Statement\*\*:\s*(.+)",
                    r"\*\*Desired Outcome\*\*:\s*(.+)",
                    r"\*\*One-Line Vision\*\*:\s*(.+)"]:
        m = re.search(pattern, text)
        if m and _is_single_word_answer(m.group(1)):
            field_name = pattern.split("**")[1]
            warnings.append(f"'{field_name}' appears to be a single-word answer — too vague.")

    return warnings


# ---------------------------------------------------------------------------
# Main validation
# ---------------------------------------------------------------------------

def validate(filepath: str) -> int:
    """Validate the strategy file and print results. Returns exit code."""

    if not os.path.isfile(filepath):
        print(red(f"ERROR: File not found: {filepath}"))
        return 2

    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    if not text.strip():
        print(red("ERROR: Strategy file is empty."))
        return 2

    sections = _extract_sections(text)

    print()
    print(bold("=" * 60))
    print(bold("  Amenthyx AI Teams — Strategy Validator"))
    print(bold("=" * 60))
    print(f"  File: {os.path.abspath(filepath)}")
    print(bold("-" * 60))
    print()

    # ----- Per-section validation -----
    total_score = 0
    max_score = len(REQUIRED_SECTIONS) * 3
    all_warnings: List[str] = []
    section_results: List[Tuple[str, int, List[str]]] = []

    for pattern, label, subfields in REQUIRED_SECTIONS:
        # Find matching section
        matched_header = None
        matched_body = None
        for hdr, body in sections.items():
            if re.search(pattern, hdr, re.IGNORECASE):
                matched_header = hdr
                matched_body = body
                break

        if matched_header is None:
            # Section missing entirely
            score = 0
            warns = [f"Section '{label}' is MISSING."]
        else:
            score, warns = _score_section(label, matched_body, subfields)

        total_score += score
        all_warnings.extend(warns)
        section_results.append((label, score, warns))

    # ----- Global vagueness checks -----
    global_warns = _global_vagueness_checks(text)
    all_warnings.extend(global_warns)

    # ----- Print section-by-section breakdown -----
    score_icons = {
        0: red("MISSING"),
        1: red("TEMPLATE"),
        2: yellow("PARTIAL"),
        3: green("OK     "),
    }

    for label, score, warns in section_results:
        icon = score_icons[score]
        line = f"  [{icon}] {label}  ({score}/3)"
        print(line)
        for w in warns:
            print(f"           {yellow('!')} {w}")

    # ----- Global warnings -----
    if global_warns:
        print()
        print(bold("  Global Warnings:"))
        for w in global_warns:
            print(f"    {yellow('!')} {w}")

    # ----- Scoring summary -----
    pct = (total_score / max_score) * 100 if max_score > 0 else 0

    if pct > 90:
        grade, grade_color = "A", green
    elif pct > 75:
        grade, grade_color = "B", green
    elif pct > 60:
        grade, grade_color = "C", yellow
    elif pct > 40:
        grade, grade_color = "D", red
    else:
        grade, grade_color = "F", red

    print()
    print(bold("-" * 60))
    print(f"  Score:  {total_score} / {max_score}  ({pct:.0f}%)")
    print(f"  Grade:  {grade_color(bold(grade))}")
    print()

    # Count severity
    missing_count = sum(1 for _, s, _ in section_results if s == 0)
    template_count = sum(1 for _, s, _ in section_results if s == 1)
    partial_count = sum(1 for _, s, _ in section_results if s == 2)
    ok_count = sum(1 for _, s, _ in section_results if s == 3)
    warn_count = len(all_warnings)

    print(f"  Sections:  {green(str(ok_count))} OK  |  "
          f"{yellow(str(partial_count))} partial  |  "
          f"{red(str(template_count))} template  |  "
          f"{red(str(missing_count))} missing")
    print(f"  Warnings:  {warn_count}")
    print()

    # ----- Recommendation -----
    if grade in ("A", "B"):
        print(green("  READY — This strategy is complete enough to activate a team."))
        if warn_count > 0:
            print(yellow(f"  Consider addressing the {warn_count} warning(s) above "
                         "for best results."))
        exit_code = 0
    elif grade == "C":
        print(yellow("  USABLE WITH WARNINGS — The strategy has gaps that may cause "
                      "the team to make assumptions."))
        print(yellow("  Fill in the flagged sections before activating for best results."))
        exit_code = 1
    else:
        print(red("  NOT READY — Too many sections are missing or still contain "
                   "template placeholders."))
        print(red("  Fill in the strategy using STRATEGY_TEMPLATE.md before activating "
                   "a team."))
        exit_code = 2

    print()
    print(bold("=" * 60))
    print()

    return exit_code


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} <path/to/strategy.md>")
        print()
        print("Validates a strategy file against the Amenthyx AI Teams")
        print("STRATEGY_TEMPLATE.md v3.3 requirements.")
        sys.exit(2)

    filepath = sys.argv[1]
    exit_code = validate(filepath)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
