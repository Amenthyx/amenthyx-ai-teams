#!/usr/bin/env python3
"""
Strategy Diff Tool — Compare two strategy.md files section-by-section.

Part of Amenthyx AI Teams v3.0.
Usage: python strategy_diff.py strategy-a.md strategy-b.md [--json]

Python 3.8+ (stdlib only).
"""

import argparse
import json
import re
import sys
from collections import OrderedDict
from typing import Dict, List, Optional, Set, Tuple


# ─── ANSI Colors ────────────────────────────────────────────────────────────

class C:
    """ANSI color codes. Disabled when piped or --json is used."""
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    WHITE = "\033[37m"
    RESET = "\033[0m"
    UNDERLINE = "\033[4m"

    @classmethod
    def disable(cls):
        for attr in ("BOLD", "DIM", "RED", "GREEN", "YELLOW", "BLUE",
                      "MAGENTA", "CYAN", "WHITE", "RESET", "UNDERLINE"):
            setattr(cls, attr, "")


# ─── Parsing ────────────────────────────────────────────────────────────────

def parse_sections(text: str) -> OrderedDict:
    """Split a strategy file into sections keyed by ## heading."""
    sections: OrderedDict = OrderedDict()
    current_heading: Optional[str] = None
    current_lines: List[str] = []

    for line in text.splitlines():
        match = re.match(r"^##\s+(.+)$", line)
        if match:
            if current_heading is not None:
                sections[current_heading] = "\n".join(current_lines).strip()
            current_heading = match.group(1).strip()
            current_lines = []
        else:
            current_lines.append(line)

    if current_heading is not None:
        sections[current_heading] = "\n".join(current_lines).strip()

    # Capture any preamble before the first ##
    preamble_lines = []
    for line in text.splitlines():
        if re.match(r"^##\s+", line):
            break
        preamble_lines.append(line)
    preamble = "\n".join(preamble_lines).strip()
    if preamble:
        final: OrderedDict = OrderedDict()
        final["(Preamble)"] = preamble
        final.update(sections)
        return final

    return sections


# ─── Technology Extraction ──────────────────────────────────────────────────

# Common tech keywords to look for (case-insensitive matching happens separately)
KNOWN_TECH = {
    "react", "vue.js", "vue", "angular", "svelte", "next.js", "nuxt.js",
    "typescript", "javascript", "python", "go", "golang", "rust", "java",
    "kotlin", "swift", "flutter", "dart", "ruby", "php", "c#", ".net",
    "node.js", "express", "fastapi", "django", "flask", "spring",
    "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite",
    "cassandra", "dynamodb", "elasticsearch", "neo4j", "firebase",
    "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins",
    "github actions", "gitlab ci", "circleci", "aws", "gcp", "azure",
    "vercel", "netlify", "heroku", "digitalocean", "cloudflare",
    "graphql", "rest", "grpc", "websocket", "kafka", "rabbitmq",
    "nginx", "traefik", "caddy", "tailwind", "bootstrap", "material ui",
    "prisma", "drizzle", "sequelize", "sqlalchemy", "supabase",
    "stripe", "twilio", "sendgrid", "auth0", "keycloak", "oauth",
    "openai", "langchain", "huggingface", "pytorch", "tensorflow",
}


def extract_technologies(sections: OrderedDict) -> Set[str]:
    """Extract technology names from the full strategy text."""
    full_text = "\n".join(sections.values())
    found: Set[str] = set()

    for tech in KNOWN_TECH:
        pattern = re.compile(re.escape(tech), re.IGNORECASE)
        if pattern.search(full_text):
            # Preserve canonical casing from KNOWN_TECH
            found.add(tech)

    # Also grab items from bullet lists in tech-related sections
    tech_headings = {"technical stack", "technology stack", "tech stack",
                     "technologies", "stack", "tools", "infrastructure"}
    for heading, content in sections.items():
        if heading.lower().strip() in tech_headings or "stack" in heading.lower():
            for line in content.splitlines():
                m = re.match(r"^\s*[-*]\s+\*?\*?([^:*]+)", line)
                if m:
                    candidate = m.group(1).strip().rstrip("*")
                    if 2 <= len(candidate) <= 40:
                        found.add(candidate)

    return found


# ─── Priority Extraction ───────────────────────────────────────────────────

PRIORITY_RE = re.compile(
    r"[-*]\s*\*?\*?(P[0-3])\*?\*?\s*[:\-—]\s*(.+?)(?:\s*\(.*?\))?\s*$",
    re.MULTILINE
)
PRIORITY_ALT_RE = re.compile(
    r"[-*]\s*(.+?)\s*[:\-—]\s*\*?\*?(P[0-3])\*?\*?",
    re.MULTILINE
)


def extract_priorities(sections: OrderedDict) -> Dict[str, str]:
    """Extract feature→priority mapping (P0/P1/P2/P3)."""
    full_text = "\n".join(sections.values())
    features: Dict[str, str] = {}

    for m in PRIORITY_RE.finditer(full_text):
        priority, feature = m.group(1), m.group(2).strip().strip("*").strip()
        if feature:
            features[feature] = priority

    for m in PRIORITY_ALT_RE.finditer(full_text):
        feature, priority = m.group(1).strip().strip("*").strip(), m.group(2)
        if feature and feature not in features:
            features[feature] = priority

    return features


# ─── Risk Extraction ────────────────────────────────────────────────────────

def extract_risks(sections: OrderedDict) -> List[str]:
    """Extract risk items from risk-related sections."""
    risks: List[str] = []
    risk_headings = {"risks", "risk assessment", "risk analysis", "risk management",
                     "risk mitigation", "risks & mitigations"}

    for heading, content in sections.items():
        if any(rh in heading.lower() for rh in risk_headings) or "risk" in heading.lower():
            for line in content.splitlines():
                m = re.match(r"^\s*[-*\d.]+\s+(.+)$", line)
                if m:
                    risk_text = m.group(1).strip()
                    if len(risk_text) > 5:
                        risks.append(risk_text)
    return risks


# ─── NFR Extraction ─────────────────────────────────────────────────────────

def extract_nfrs(sections: OrderedDict) -> List[str]:
    """Extract non-functional requirements."""
    nfrs: List[str] = []
    nfr_headings = {"non-functional requirements", "nfr", "nfrs",
                    "quality attributes", "performance requirements",
                    "scalability", "security requirements"}

    for heading, content in sections.items():
        if any(n in heading.lower() for n in nfr_headings):
            for line in content.splitlines():
                m = re.match(r"^\s*[-*\d.]+\s+(.+)$", line)
                if m:
                    nfrs.append(m.group(1).strip())
    return nfrs


# ─── Timeline / Milestone Extraction ────────────────────────────────────────

def extract_milestones(sections: OrderedDict) -> List[str]:
    """Extract timeline/milestone entries."""
    milestones: List[str] = []
    timeline_headings = {"timeline", "milestones", "roadmap", "schedule",
                         "phases", "sprints", "iterations", "delivery plan"}

    for heading, content in sections.items():
        if any(t in heading.lower() for t in timeline_headings):
            for line in content.splitlines():
                m = re.match(r"^\s*[-*\d.|]+\s+(.+)$", line)
                if m:
                    milestones.append(m.group(1).strip())
    return milestones


# ─── Team / Budget Extraction ───────────────────────────────────────────────

def extract_numeric_field(sections: OrderedDict, keywords: List[str]) -> Optional[str]:
    """Find a numeric value near given keywords."""
    full_text = "\n".join(sections.values())
    for kw in keywords:
        pattern = re.compile(
            rf"{re.escape(kw)}\s*[:\-—]\s*(.+?)(?:\n|$)", re.IGNORECASE
        )
        m = pattern.search(full_text)
        if m:
            return m.group(1).strip()
    return None


# ─── Content Diff ────────────────────────────────────────────────────────────

def content_differs(a: str, b: str) -> bool:
    """Check if two section contents differ (ignoring whitespace)."""
    def normalize(s: str) -> str:
        return re.sub(r"\s+", " ", s).strip().lower()
    return normalize(a) != normalize(b)


def mini_diff(a_lines: List[str], b_lines: List[str], max_lines: int = 8) -> List[str]:
    """Simple line-by-line diff output (no difflib dependency — stdlib has it
    but we keep it lightweight)."""
    import difflib
    diff = list(difflib.unified_diff(
        a_lines, b_lines, lineterm="", fromfile="A", tofile="B", n=1
    ))
    if len(diff) > max_lines + 4:
        return diff[:max_lines + 4] + [f"  ... ({len(diff) - max_lines - 4} more lines)"]
    return diff


# ─── Report Builder ─────────────────────────────────────────────────────────

def build_report(path_a: str, path_b: str,
                 sections_a: OrderedDict, sections_b: OrderedDict) -> dict:
    """Build the comparison report as a structured dict."""
    all_headings = list(dict.fromkeys(list(sections_a.keys()) + list(sections_b.keys())))

    section_status: List[dict] = []
    section_diffs: Dict[str, List[str]] = {}

    for h in all_headings:
        in_a = h in sections_a
        in_b = h in sections_b
        if in_a and in_b:
            differs = content_differs(sections_a[h], sections_b[h])
            status = "differs" if differs else "same"
            if differs:
                diff_lines = mini_diff(
                    sections_a[h].splitlines(), sections_b[h].splitlines()
                )
                section_diffs[h] = diff_lines
        elif in_a:
            status = "a_only"
        else:
            status = "b_only"
        section_status.append({"heading": h, "status": status})

    # Technologies
    tech_a = extract_technologies(sections_a)
    tech_b = extract_technologies(sections_b)

    # Priorities
    prio_a = extract_priorities(sections_a)
    prio_b = extract_priorities(sections_b)
    prio_changes: List[dict] = []
    all_features = set(prio_a.keys()) | set(prio_b.keys())
    for f in sorted(all_features):
        pa = prio_a.get(f)
        pb = prio_b.get(f)
        if pa and pb and pa != pb:
            prio_changes.append({"feature": f, "a": pa, "b": pb, "type": "changed"})
        elif pa and not pb:
            prio_changes.append({"feature": f, "a": pa, "b": None, "type": "removed"})
        elif pb and not pa:
            prio_changes.append({"feature": f, "a": None, "b": pb, "type": "new"})

    # Risks
    risks_a = extract_risks(sections_a)
    risks_b = extract_risks(sections_b)

    # NFRs
    nfrs_a = extract_nfrs(sections_a)
    nfrs_b = extract_nfrs(sections_b)

    # Milestones
    ms_a = extract_milestones(sections_a)
    ms_b = extract_milestones(sections_b)

    # Team / Budget
    team_a = extract_numeric_field(sections_a, ["team size", "team", "engineers", "headcount"])
    team_b = extract_numeric_field(sections_b, ["team size", "team", "engineers", "headcount"])
    budget_a = extract_numeric_field(sections_a, ["budget", "cost", "investment"])
    budget_b = extract_numeric_field(sections_b, ["budget", "cost", "investment"])

    return {
        "path_a": path_a,
        "path_b": path_b,
        "sections": section_status,
        "section_diffs": {k: v for k, v in section_diffs.items()},
        "technology": {
            "a_only": sorted(tech_a - tech_b),
            "b_only": sorted(tech_b - tech_a),
            "shared": sorted(tech_a & tech_b),
        },
        "priorities": prio_changes,
        "risks": {
            "a_count": len(risks_a),
            "b_count": len(risks_b),
            "a_items": risks_a,
            "b_items": risks_b,
        },
        "nfrs": {
            "a_items": nfrs_a,
            "b_items": nfrs_b,
        },
        "milestones": {
            "a_items": ms_a,
            "b_items": ms_b,
        },
        "team_budget": {
            "team_a": team_a,
            "team_b": team_b,
            "budget_a": budget_a,
            "budget_b": budget_b,
        },
    }


# ─── Pretty Printer ─────────────────────────────────────────────────────────

def print_report(report: dict) -> None:
    """Print the comparison report with ANSI colors."""
    pa = report["path_a"]
    pb = report["path_b"]

    print()
    print(f"{C.BOLD}{C.CYAN}Strategy Comparison{C.RESET}")
    print(f"{C.CYAN}{'=' * 60}{C.RESET}")
    print(f"  {C.BOLD}A:{C.RESET} {pa}")
    print(f"  {C.BOLD}B:{C.RESET} {pb}")
    print()

    # ── Sections ──
    print(f"{C.BOLD}{C.WHITE}Sections:{C.RESET}")
    status_map = {
        "same":    (f"{C.DIM}[=]{C.RESET}", f"{C.DIM}(both, identical){C.RESET}"),
        "differs": (f"{C.YELLOW}[~]{C.RESET}", f"{C.YELLOW}(differs){C.RESET}"),
        "a_only":  (f"{C.RED}[-]{C.RESET}", f"{C.RED}(A only){C.RESET}"),
        "b_only":  (f"{C.GREEN}[+]{C.RESET}", f"{C.GREEN}(B only){C.RESET}"),
    }
    max_heading_len = max((len(s["heading"]) for s in report["sections"]), default=20)
    for s in report["sections"]:
        icon, label = status_map[s["status"]]
        heading_padded = s["heading"].ljust(max_heading_len + 2)
        print(f"  {icon} {heading_padded} {label}")
    print()

    # ── Section Diffs ──
    if report["section_diffs"]:
        print(f"{C.BOLD}{C.WHITE}Section Content Differences:{C.RESET}")
        for heading, diff_lines in report["section_diffs"].items():
            print(f"\n  {C.BOLD}{C.YELLOW}## {heading}{C.RESET}")
            for line in diff_lines:
                if line.startswith("+++") or line.startswith("---"):
                    print(f"    {C.DIM}{line}{C.RESET}")
                elif line.startswith("+"):
                    print(f"    {C.GREEN}{line}{C.RESET}")
                elif line.startswith("-"):
                    print(f"    {C.RED}{line}{C.RESET}")
                elif line.startswith("@@"):
                    print(f"    {C.CYAN}{line}{C.RESET}")
                else:
                    print(f"    {C.DIM}{line}{C.RESET}")
        print()

    # ── Technologies ──
    tech = report["technology"]
    if tech["a_only"] or tech["b_only"] or tech["shared"]:
        print(f"{C.BOLD}{C.WHITE}Technology Differences:{C.RESET}")
        if tech["a_only"]:
            print(f"  {C.RED}A only:{C.RESET} {', '.join(tech['a_only'])}")
        if tech["b_only"]:
            print(f"  {C.GREEN}B only:{C.RESET} {', '.join(tech['b_only'])}")
        if tech["shared"]:
            print(f"  {C.DIM}Shared:{C.RESET} {', '.join(tech['shared'])}")
        print()

    # ── Priorities ──
    prios = report["priorities"]
    if prios:
        print(f"{C.BOLD}{C.WHITE}Feature Priority Changes:{C.RESET}")
        max_feat_len = max(len(p["feature"]) for p in prios)
        for p in prios:
            feat = f'"{p["feature"]}"'.ljust(max_feat_len + 4)
            if p["type"] == "changed":
                print(f"  {C.YELLOW}{feat} {p['a']} -> {p['b']}{C.RESET}")
            elif p["type"] == "new":
                print(f"  {C.GREEN}{feat} (new in B, {p['b']}){C.RESET}")
            elif p["type"] == "removed":
                print(f"  {C.RED}{feat} (removed from B, was {p['a']}){C.RESET}")
        print()

    # ── Risks ──
    ra = report["risks"]
    if ra["a_count"] or ra["b_count"]:
        print(f"{C.BOLD}{C.WHITE}Risk Assessment:{C.RESET}")
        print(f"  A: {ra['a_count']} risks identified")
        diff = ra["b_count"] - ra["a_count"]
        diff_str = ""
        if diff > 0:
            diff_str = f" {C.GREEN}(+{diff} new){C.RESET}"
        elif diff < 0:
            diff_str = f" {C.RED}({diff}){C.RESET}"
        print(f"  B: {ra['b_count']} risks identified{diff_str}")
        # Show new risks in B
        a_set = set(r.lower().strip() for r in ra["a_items"])
        new_risks = [r for r in ra["b_items"] if r.lower().strip() not in a_set]
        if new_risks:
            print(f"  {C.GREEN}New in B:{C.RESET}")
            for r in new_risks[:5]:
                print(f"    {C.GREEN}+ {r}{C.RESET}")
        removed_b_set = set(r.lower().strip() for r in ra["b_items"])
        removed = [r for r in ra["a_items"] if r.lower().strip() not in removed_b_set]
        if removed:
            print(f"  {C.RED}Removed from B:{C.RESET}")
            for r in removed[:5]:
                print(f"    {C.RED}- {r}{C.RESET}")
        print()

    # ── NFRs ──
    nfrs = report["nfrs"]
    if nfrs["a_items"] or nfrs["b_items"]:
        print(f"{C.BOLD}{C.WHITE}Non-Functional Requirements:{C.RESET}")
        a_set = set(n.lower().strip() for n in nfrs["a_items"])
        b_set = set(n.lower().strip() for n in nfrs["b_items"])
        a_only_nfr = [n for n in nfrs["a_items"] if n.lower().strip() not in b_set]
        b_only_nfr = [n for n in nfrs["b_items"] if n.lower().strip() not in a_set]
        shared_count = len(a_set & b_set)
        if shared_count:
            print(f"  {C.DIM}Shared: {shared_count} requirements{C.RESET}")
        if a_only_nfr:
            print(f"  {C.RED}A only:{C.RESET}")
            for n in a_only_nfr[:5]:
                print(f"    {C.RED}- {n}{C.RESET}")
        if b_only_nfr:
            print(f"  {C.GREEN}B only:{C.RESET}")
            for n in b_only_nfr[:5]:
                print(f"    {C.GREEN}+ {n}{C.RESET}")
        print()

    # ── Milestones ──
    ms = report["milestones"]
    if ms["a_items"] or ms["b_items"]:
        print(f"{C.BOLD}{C.WHITE}Timeline / Milestones:{C.RESET}")
        print(f"  A: {len(ms['a_items'])} milestones")
        print(f"  B: {len(ms['b_items'])} milestones")
        a_set = set(m.lower().strip() for m in ms["a_items"])
        b_set = set(m.lower().strip() for m in ms["b_items"])
        new_ms = [m for m in ms["b_items"] if m.lower().strip() not in a_set]
        removed_ms = [m for m in ms["a_items"] if m.lower().strip() not in b_set]
        if new_ms:
            print(f"  {C.GREEN}New in B:{C.RESET}")
            for m in new_ms[:5]:
                print(f"    {C.GREEN}+ {m}{C.RESET}")
        if removed_ms:
            print(f"  {C.RED}Removed from B:{C.RESET}")
            for m in removed_ms[:5]:
                print(f"    {C.RED}- {m}{C.RESET}")
        print()

    # ── Team & Budget ──
    tb = report["team_budget"]
    has_tb = any(v is not None for v in tb.values())
    if has_tb:
        print(f"{C.BOLD}{C.WHITE}Team & Budget:{C.RESET}")
        if tb["team_a"] or tb["team_b"]:
            ta = tb["team_a"] or "(not specified)"
            tbb = tb["team_b"] or "(not specified)"
            color = C.YELLOW if ta != tbb else C.DIM
            print(f"  Team size: {color}A: {ta}  |  B: {tbb}{C.RESET}")
        if tb["budget_a"] or tb["budget_b"]:
            ba = tb["budget_a"] or "(not specified)"
            bb = tb["budget_b"] or "(not specified)"
            color = C.YELLOW if ba != bb else C.DIM
            print(f"  Budget:    {color}A: {ba}  |  B: {bb}{C.RESET}")
        print()

    # ── Summary ──
    total = len(report["sections"])
    same = sum(1 for s in report["sections"] if s["status"] == "same")
    differs = sum(1 for s in report["sections"] if s["status"] == "differs")
    a_only = sum(1 for s in report["sections"] if s["status"] == "a_only")
    b_only = sum(1 for s in report["sections"] if s["status"] == "b_only")

    print(f"{C.BOLD}{C.CYAN}Summary:{C.RESET}")
    print(f"  {total} total sections  |  "
          f"{C.DIM}{same} identical{C.RESET}  |  "
          f"{C.YELLOW}{differs} differ{C.RESET}  |  "
          f"{C.RED}{a_only} A-only{C.RESET}  |  "
          f"{C.GREEN}{b_only} B-only{C.RESET}")
    print()


# ─── Main ────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Compare two strategy.md files section-by-section.",
        epilog="Part of Amenthyx AI Teams v3.0",
    )
    parser.add_argument("file_a", help="Path to strategy A")
    parser.add_argument("file_b", help="Path to strategy B")
    parser.add_argument("--json", action="store_true",
                        help="Output comparison as JSON")
    args = parser.parse_args()

    # Read files
    try:
        with open(args.file_a, "r", encoding="utf-8") as f:
            text_a = f.read()
    except FileNotFoundError:
        print(f"Error: File not found: {args.file_a}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading {args.file_a}: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        with open(args.file_b, "r", encoding="utf-8") as f:
            text_b = f.read()
    except FileNotFoundError:
        print(f"Error: File not found: {args.file_b}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading {args.file_b}: {e}", file=sys.stderr)
        sys.exit(1)

    # Parse
    sections_a = parse_sections(text_a)
    sections_b = parse_sections(text_b)

    # Build report
    report = build_report(args.file_a, args.file_b, sections_a, sections_b)

    # Output
    if args.json:
        C.disable()
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        if not sys.stdout.isatty():
            C.disable()
        print_report(report)


if __name__ == "__main__":
    main()
