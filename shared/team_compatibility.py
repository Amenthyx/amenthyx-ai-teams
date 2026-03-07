#!/usr/bin/env python3
"""
Amenthyx AI Teams - Team Compatibility Matrix

Helps users plan multi-team orchestration by showing which teams
work well together, their compatibility scores, and relationship types.

Usage:
    python team_compatibility.py                      # Full matrix summary
    python team_compatibility.py --team fullStack      # One team's compatibility
    python team_compatibility.py --pair react nodejs    # Check specific pair
    python team_compatibility.py --suggest fullStack    # Suggest best partners
    python team_compatibility.py --json                # JSON output
"""
import argparse, json, sys
from typing import Dict, List, Optional, Tuple

# -- Team registry (directory -> CLI alias) --------------------------------
TEAMS: Dict[str, str] = {
    "01-full-stack": "fullStack", "02-flutter-mobile": "flutter",
    "03-dotnet-enterprise": "dotnet", "04-cpp-systems": "cpp",
    "05-python-data": "python", "06-java-spring": "javaSpring",
    "07-react-frontend": "react", "08-nodejs-backend": "nodejs",
    "09-rust-systems": "rust", "10-go-cloud-native": "goCloud",
    "11-swift-ios": "swift", "12-kotlin-android": "kotlin",
    "13-devops-automation": "devops", "14-infrastructure-cloud": "infraCloud",
    "15-data-engineering": "dataEng", "16-ai-ml": "aiml",
    "17-cybersecurity": "security", "18-embedded-iot": "iot",
    "19-game-dev": "gameDev", "20-blockchain-web3": "blockchain",
    "21-agentic-ai": "agenticAI", "22-elixir-phoenix": "elixir",
    "23-scala-spark": "scalaSpark", "24-ruby-rails": "rails",
    "25-php-laravel": "laravel", "26-vue-frontend": "vue",
    "27-angular-enterprise": "angular", "28-sre": "sre",
    "29-platform-engineering": "platformEng", "30-react-native": "reactNative",
    "31-database-engineering": "databaseEng", "32-api-design": "apiDesign",
    "33-lowcode-automation": "lowcode", "34-qa-automation": "qaAutomation",
    "35-technical-writing": "techWriting", "36-ux-design": "uxDesign",
    "37-performance-engineering": "perfEng", "38-data-science": "dataScience",
    "39-computer-vision": "computerVision", "40-nlp-llm": "nlp",
    "41-robotics-ros": "robotics", "42-xr-spatial": "xrSpatial",
    "43-edge-computing": "edgeComputing", "44-quantum-computing": "quantum",
    "45-fintech": "fintech", "46-healthtech": "healthtech",
    "47-edtech": "edtech", "48-ecommerce": "ecommerce",
    "49-realtime-systems": "realtime", "50-accessibility": "a11y",
    "51-open-source": "openSource", "52-after-effects-motion": "afterEffects",
    "53-video-production": "videoProd", "54-3d-vfx": "vfx3d",
    "55-audio-engineering": "audioEng", "56-2d-animation": "animation2d",
    "57-creative-ai-media": "creativeAI", "58-streaming-broadcast": "streaming",
    "59-media-pipeline": "mediaPipeline", "60-social-media": "socialMedia",
    "61-mlops-model-deployment": "mlops", "62-developer-relations": "devRel",
    "63-compliance-governance": "compliance", "64-migration-modernization": "migration",
    "65-prompt-engineering": "promptEng",
}
ALIAS_TO_DIR = {v: k for k, v in TEAMS.items()}

# -- Relationship types ----------------------------------------------------
REL_LABELS = {10: "synergy", 8: "complementary", 6: "compatible", 4: "neutral", 2: "overlap"}

def _label(score: int) -> str:
    return REL_LABELS[min(REL_LABELS, key=lambda k: abs(k - score))]

# -- Compatibility data (50+ meaningful pairings) --------------------------
# Helper: expand one-to-many pairs at a fixed score
def _expand(team: str, partners: List[str], score: int) -> List[Tuple[str, str, int]]:
    return [(team, p, score) for p in partners]

_RAW: List[Tuple[str, str, int]] = [
    # Frontend + Backend synergy (10)
    ("react", "nodejs", 10), ("vue", "laravel", 10),
    ("angular", "javaSpring", 10), ("angular", "dotnet", 10),
    ("flutter", "nodejs", 10), ("reactNative", "nodejs", 10),
    # Frontend + Backend complementary (8)
    ("react", "rails", 8), ("react", "javaSpring", 8), ("react", "python", 8),
    ("vue", "nodejs", 8), ("vue", "python", 8), ("angular", "nodejs", 8),
    # Full-stack partners
    ("fullStack", "qaAutomation", 8), ("fullStack", "devops", 8),
    ("fullStack", "databaseEng", 8), ("fullStack", "apiDesign", 8),
    ("fullStack", "uxDesign", 8), ("fullStack", "perfEng", 8),
    ("fullStack", "security", 6), ("fullStack", "a11y", 6),
    # Mobile combos
    ("swift", "kotlin", 8), ("swift", "nodejs", 8), ("kotlin", "nodejs", 8),
    ("flutter", "javaSpring", 8), ("flutter", "python", 8),
    ("reactNative", "react", 8),
    # Mobile overlaps
    ("swift", "flutter", 2), ("kotlin", "flutter", 2), ("reactNative", "flutter", 2),
    # Frontend overlaps
    ("react", "vue", 2), ("react", "angular", 2), ("vue", "angular", 2),
    # Backend overlaps
    ("nodejs", "javaSpring", 2), ("nodejs", "rails", 2), ("nodejs", "laravel", 2),
    ("nodejs", "dotnet", 2), ("javaSpring", "dotnet", 2), ("rails", "laravel", 2),
    ("rails", "elixir", 4),
    # DevOps / SRE / Platform synergy
    ("devops", "infraCloud", 10), ("devops", "goCloud", 10),
    ("devops", "sre", 8), ("devops", "platformEng", 8),
    ("sre", "infraCloud", 8), ("sre", "platformEng", 8), ("sre", "perfEng", 8),
    ("infraCloud", "platformEng", 8), ("goCloud", "infraCloud", 10),
    ("goCloud", "platformEng", 8),
    # AI / ML ecosystem
    ("aiml", "mlops", 10), ("aiml", "dataScience", 10), ("aiml", "nlp", 10),
    ("nlp", "promptEng", 10), ("nlp", "agenticAI", 10),
    ("agenticAI", "promptEng", 10), ("dataScience", "dataEng", 10),
    ("dataEng", "databaseEng", 10), ("dataEng", "scalaSpark", 10),
    ("aiml", "python", 8), ("aiml", "dataEng", 8), ("aiml", "computerVision", 8),
    ("aiml", "promptEng", 8), ("agenticAI", "mlops", 8), ("agenticAI", "aiml", 8),
    ("dataScience", "python", 8), ("mlops", "devops", 8), ("mlops", "infraCloud", 8),
    ("computerVision", "xrSpatial", 8), ("computerVision", "vfx3d", 6),
    ("quantum", "aiml", 6), ("quantum", "dataScience", 6),
    # Security cross-cutting
    ("blockchain", "security", 10), ("fintech", "security", 10),
    ("healthtech", "security", 10), ("compliance", "security", 10),
    ("ecommerce", "security", 8), ("nodejs", "security", 8),
    ("javaSpring", "security", 8), ("dotnet", "security", 8),
    ("goCloud", "security", 8), ("react", "security", 6), ("python", "security", 6),
    # Industry + Tech
    ("fintech", "databaseEng", 10), ("fintech", "compliance", 10),
    ("fintech", "javaSpring", 8), ("fintech", "blockchain", 8),
    ("healthtech", "compliance", 10), ("healthtech", "dataScience", 8),
    ("healthtech", "python", 8),
    ("edtech", "react", 8), ("edtech", "flutter", 8), ("edtech", "uxDesign", 8),
    ("ecommerce", "react", 8), ("ecommerce", "nodejs", 8),
    ("ecommerce", "databaseEng", 8), ("ecommerce", "uxDesign", 8),
    # Multimedia ecosystem
    ("afterEffects", "videoProd", 10), ("afterEffects", "animation2d", 10),
    ("videoProd", "audioEng", 10), ("videoProd", "streaming", 10),
    ("videoProd", "mediaPipeline", 10), ("vfx3d", "xrSpatial", 10),
    ("mediaPipeline", "streaming", 10),
    ("afterEffects", "vfx3d", 8), ("vfx3d", "gameDev", 8),
    ("audioEng", "streaming", 8), ("audioEng", "gameDev", 8),
    ("animation2d", "gameDev", 8), ("animation2d", "creativeAI", 8),
    ("creativeAI", "aiml", 8), ("creativeAI", "promptEng", 8),
    ("mediaPipeline", "devops", 8), ("streaming", "realtime", 8),
    ("socialMedia", "videoProd", 8), ("socialMedia", "creativeAI", 8),
    # Systems-level
    ("cpp", "iot", 10), ("cpp", "gameDev", 10), ("cpp", "robotics", 10),
    ("robotics", "iot", 10), ("robotics", "computerVision", 10),
    ("iot", "edgeComputing", 10), ("xrSpatial", "gameDev", 10),
    ("rust", "iot", 8), ("rust", "realtime", 8), ("rust", "edgeComputing", 8),
    ("robotics", "aiml", 8), ("realtime", "iot", 8), ("realtime", "edgeComputing", 8),
    ("rust", "cpp", 6), ("xrSpatial", "animation2d", 6),
    # API / Database / Architecture
    ("apiDesign", "nodejs", 8), ("apiDesign", "javaSpring", 8),
    ("apiDesign", "goCloud", 8), ("apiDesign", "databaseEng", 8),
    ("apiDesign", "security", 8), ("databaseEng", "perfEng", 8),
    ("databaseEng", "javaSpring", 8), ("databaseEng", "nodejs", 6),
    # Low-code / Migration
    ("lowcode", "migration", 8), ("migration", "devops", 8),
    ("migration", "infraCloud", 8), ("migration", "databaseEng", 8),
    ("lowcode", "devops", 6),
    # Writing / DevRel / Open-source
    ("techWriting", "devRel", 10), ("devRel", "openSource", 10),
    ("techWriting", "apiDesign", 8), ("techWriting", "openSource", 8),
    ("devRel", "socialMedia", 8), ("openSource", "devops", 6),
    # UX + Accessibility
    ("uxDesign", "a11y", 10), ("uxDesign", "react", 8),
    ("uxDesign", "vue", 8), ("uxDesign", "flutter", 8),
    ("a11y", "react", 6), ("a11y", "vue", 6),
    # Compliance cross-cutting
    ("compliance", "devops", 6), ("compliance", "databaseEng", 6),
    # Performance cross-cutting
    ("perfEng", "react", 6), ("perfEng", "nodejs", 6),
    ("perfEng", "javaSpring", 8), ("perfEng", "goCloud", 8), ("perfEng", "rust", 8),
    # Blockchain ecosystem
    ("blockchain", "react", 8), ("blockchain", "rust", 8),
    ("blockchain", "goCloud", 6),
    # Game dev ecosystem
    ("gameDev", "uxDesign", 8), ("gameDev", "audioEng", 8),
    ("gameDev", "rust", 6), ("gameDev", "python", 6),
    # Social media cross-cutting
    ("socialMedia", "react", 8), ("socialMedia", "nodejs", 8),
    ("socialMedia", "devRel", 8), ("socialMedia", "uxDesign", 8),
    # Elixir ecosystem
    ("elixir", "realtime", 10), ("elixir", "nodejs", 8),
    # Scala ecosystem
    ("scalaSpark", "aiml", 8), ("scalaSpark", "python", 8),
    # Additional industry combos
    ("healthtech", "flutter", 8), ("healthtech", "iot", 8),
    ("fintech", "react", 8), ("fintech", "goCloud", 8),
    ("edtech", "nodejs", 8), ("edtech", "aiml", 8),
    ("ecommerce", "laravel", 8), ("ecommerce", "qaAutomation", 8),
    # Prompt engineering cross-cutting
    ("promptEng", "dataScience", 8), ("promptEng", "python", 8),
    # MLOps ecosystem
    ("mlops", "python", 8), ("mlops", "goCloud", 8),
]
# Expand Dev + QA (complementary for all major dev teams)
_RAW += _expand("qaAutomation", [
    "react", "nodejs", "javaSpring", "dotnet", "python", "flutter",
    "vue", "angular", "rails", "laravel", "goCloud",
], 8)
_RAW.append(("rust", "qaAutomation", 6))
# Expand Dev + DevOps
_RAW += _expand("devops", [
    "react", "nodejs", "javaSpring", "dotnet", "python",
    "rails", "laravel", "elixir",
], 8)
_RAW.append(("flutter", "devops", 6))
_RAW.append(("rust", "devops", 6))
# Build normalised lookup
COMPAT: Dict[Tuple[str, str], int] = {}
for a, b, s in _RAW:
    COMPAT[tuple(sorted([a, b]))] = s  # type: ignore[assignment]

# -- Helpers ---------------------------------------------------------------
def resolve_alias(name: str) -> Optional[str]:
    low = name.lower().replace("-", "").replace("_", "")
    for alias in ALIAS_TO_DIR:
        if alias.lower() == low:
            return alias
    for alias in ALIAS_TO_DIR:
        if low in alias.lower():
            return alias
    for dir_name, alias in TEAMS.items():
        stripped = dir_name.split("-", 1)[1].replace("-", "") if "-" in dir_name else dir_name
        if low in stripped:
            return alias
    return None

def get_score(a: str, b: str) -> int:
    if a == b:
        return 10
    return COMPAT.get(tuple(sorted([a, b])), 4)  # type: ignore[arg-type]

def get_all_for_team(alias: str) -> List[Tuple[str, int, str]]:
    results = []
    for other in ALIAS_TO_DIR:
        if other == alias:
            continue
        s = get_score(alias, other)
        results.append((other, s, _label(s)))
    results.sort(key=lambda x: (-x[1], x[0]))
    return results

# -- ANSI colours ----------------------------------------------------------
class _C:
    GREEN  = "\033[92m"; YELLOW = "\033[93m"; RED = "\033[91m"
    CYAN   = "\033[96m"; BOLD   = "\033[1m";  DIM = "\033[2m"
    RESET  = "\033[0m"

def _cscore(score: int) -> str:
    if score >= 9:    c = _C.GREEN
    elif score >= 6:  c = _C.YELLOW
    elif score <= 2:  c = _C.RED
    else:             c = _C.DIM
    return f"{c}{score:>2}{_C.RESET}"

def _clabel(label: str) -> str:
    m = {"synergy": _C.GREEN, "complementary": _C.YELLOW,
         "compatible": _C.YELLOW, "neutral": _C.DIM, "overlap": _C.RED}
    return f"{m.get(label, _C.RESET)}{label}{_C.RESET}"

# -- CLI output ------------------------------------------------------------
_ADVICE = {
    "synergy": ("These teams naturally complement each other and should be\n"
                "  orchestrated together for maximum effectiveness."),
    "complementary": ("These teams work well together. Combining them covers\n"
                      "  adjacent concerns with minimal overlap."),
    "compatible": ("These teams can collaborate. Coordinate handoff points\n"
                   "  and shared interfaces carefully."),
    "overlap": ("These teams have significant role overlap. Typically you\n"
                "  should pick one, not both, unless scope is very large."),
    "neutral": ("No special relationship. They can coexist but won't\n"
                "  amplify each other's output."),
}

def print_pair(a: str, b: str) -> None:
    score = get_score(a, b)
    label = _label(score)
    print(f"\n  {_C.BOLD}{a}{_C.RESET} ({ALIAS_TO_DIR[a]})")
    print(f"  {_C.BOLD}{b}{_C.RESET} ({ALIAS_TO_DIR[b]})\n")
    print(f"  Score : {_cscore(score)} / 10")
    print(f"  Type  : {_clabel(label)}\n")
    print(f"  {_ADVICE.get(label, '')}\n")

def print_team(alias: str) -> None:
    entries = get_all_for_team(alias)
    print(f"\n  {_C.BOLD}Compatibility for {alias}{_C.RESET} ({ALIAS_TO_DIR[alias]})")
    print(f"  {'=' * 60}\n")
    print(f"  {'Partner':<22} {'Score':>5}  {'Type':<16}")
    print(f"  {'-' * 22} {'-' * 5}  {'-' * 16}")
    neutral = 0
    for partner, score, label in entries:
        if score == 4:
            neutral += 1
            continue
        print(f"  {partner:<22} {_cscore(score)}     {_clabel(label)}")
    if neutral:
        print(f"\n  {_C.DIM}({neutral} teams with neutral compatibility not shown){_C.RESET}")
    print()

def print_suggest(alias: str, top_n: int = 10) -> None:
    entries = get_all_for_team(alias)
    best = [e for e in entries if e[1] >= 6][:top_n]
    print(f"\n  {_C.BOLD}Best partners for {alias}{_C.RESET} ({ALIAS_TO_DIR[alias]})")
    print(f"  {'=' * 60}\n")
    if not best:
        print("  No strong partnerships found. This team operates independently.\n")
        return
    print(f"  {'#':<4} {'Partner':<22} {'Score':>5}  {'Type':<16}")
    print(f"  {'-' * 4} {'-' * 22} {'-' * 5}  {'-' * 16}")
    for i, (partner, score, label) in enumerate(best, 1):
        print(f"  {i:<4} {partner:<22} {_cscore(score)}     {_clabel(label)}")
    print()
    synergies = [e[0] for e in best if e[1] >= 10]
    complements = [e[0] for e in best if e[1] == 8]
    if synergies:
        print(f"  {_C.CYAN}Recommended core group:{_C.RESET} {alias} + {', '.join(synergies[:3])}")
    if complements:
        print(f"  {_C.CYAN}Strong additions:{_C.RESET}      {', '.join(complements[:3])}")
    print()

def print_summary() -> None:
    print(f"\n  {_C.BOLD}Amenthyx AI Teams - Compatibility Matrix Summary{_C.RESET}")
    print(f"  {'=' * 60}\n")
    print(f"  Total teams     : {len(TEAMS)}")
    print(f"  Defined pairings: {len(COMPAT)}\n")
    counts: Dict[str, int] = {}
    for s in COMPAT.values():
        counts[_label(s)] = counts.get(_label(s), 0) + 1
    print(f"  {'Relationship':<16} {'Count':>6}  {'Score':>6}")
    print(f"  {'-' * 16} {'-' * 6}  {'-' * 6}")
    for lbl in ["synergy", "complementary", "compatible", "neutral", "overlap"]:
        if lbl in counts:
            sc = [k for k, v in REL_LABELS.items() if v == lbl][0]
            print(f"  {_clabel(lbl):<30} {counts[lbl]:>6}  {_cscore(sc)}")
    print()
    top = sorted(COMPAT.items(), key=lambda x: -x[1])[:15]
    print(f"  {_C.BOLD}Top 15 Synergies{_C.RESET}")
    print(f"  {'-' * 50}")
    for (a, b), score in top:
        print(f"  {a:<22} + {b:<22} {_cscore(score)}")
    print()
    overlaps = [(k, v) for k, v in COMPAT.items() if v <= 2]
    if overlaps:
        print(f"  {_C.BOLD}Overlap Warnings (pick one, not both){_C.RESET}")
        print(f"  {'-' * 50}")
        for (a, b), sc in sorted(overlaps, key=lambda x: x[0]):
            print(f"  {_C.RED}{a:<22} vs {b:<22} {sc}/10{_C.RESET}")
        print()

    # Wave orchestration examples
    print(f"  {_C.BOLD}Example Multi-Team Orchestrations{_C.RESET}")
    print(f"  {'-' * 60}")
    _examples = [
        ("Web SaaS Product", [
            ("Wave 1 - Planning", ["uxDesign", "apiDesign"]),
            ("Wave 2 - Build",    ["react", "nodejs", "databaseEng"]),
            ("Wave 3 - Quality",  ["qaAutomation", "security", "perfEng"]),
            ("Wave 4 - Ship",     ["devops", "sre"]),
        ]),
        ("AI/ML Platform", [
            ("Wave 1 - Data",     ["dataEng", "databaseEng"]),
            ("Wave 2 - Models",   ["aiml", "nlp", "promptEng"]),
            ("Wave 3 - Deploy",   ["mlops", "infraCloud"]),
            ("Wave 4 - Quality",  ["qaAutomation", "security"]),
        ]),
        ("Mobile Fintech App", [
            ("Wave 1 - Design",   ["uxDesign", "apiDesign"]),
            ("Wave 2 - Build",    ["flutter", "nodejs", "databaseEng"]),
            ("Wave 3 - Comply",   ["security", "compliance"]),
            ("Wave 4 - Ship",     ["devops", "qaAutomation"]),
        ]),
        ("Media Production Pipeline", [
            ("Wave 1 - Content",  ["videoProd", "audioEng", "afterEffects"]),
            ("Wave 2 - AI",       ["creativeAI", "promptEng"]),
            ("Wave 3 - Infra",    ["mediaPipeline", "streaming"]),
            ("Wave 4 - Deliver",  ["devops", "socialMedia"]),
        ]),
    ]
    for name, waves in _examples:
        print(f"\n  {_C.CYAN}{name}{_C.RESET}")
        for wave_name, teams in waves:
            team_str = ", ".join(teams)
            print(f"    {wave_name:<22} {team_str}")
    print()
    print(f"  Use {_C.BOLD}--suggest <team>{_C.RESET} to find optimal partners for any team.")
    print(f"  Use {_C.BOLD}--list{_C.RESET} to see all available team aliases.")
    print()

def output_json(alias: Optional[str] = None) -> None:
    if alias:
        entries = get_all_for_team(alias)
        data = {"team": alias, "directory": ALIAS_TO_DIR[alias],
                "compatibility": [{"partner": p, "score": s, "type": l}
                                  for p, s, l in entries]}
    else:
        data = {"total_teams": len(TEAMS), "total_pairings": len(COMPAT),
                "teams": {a: d for d, a in TEAMS.items()},
                "pairings": [{"team_a": a, "team_b": b, "score": s, "type": _label(s)}
                             for (a, b), s in sorted(COMPAT.items())]}
    print(json.dumps(data, indent=2))

# -- Entry point -----------------------------------------------------------
def main() -> None:
    ap = argparse.ArgumentParser(
        description="Amenthyx AI Teams - Compatibility Matrix",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=("Examples:\n"
                "  %(prog)s                        Show full matrix summary\n"
                "  %(prog)s --list                  List all team aliases\n"
                "  %(prog)s --team react            Show one team\n"
                "  %(prog)s --pair react nodejs      Check a pair\n"
                "  %(prog)s --suggest flutter        Suggest best partners\n"
                "  %(prog)s --suggest flutter --json JSON output\n"))
    ap.add_argument("--team", help="Show compatibility for a specific team")
    ap.add_argument("--pair", nargs=2, metavar=("A", "B"), help="Check pair")
    ap.add_argument("--suggest", help="Suggest best partners for a team")
    ap.add_argument("--list", action="store_true", help="List all team aliases")
    ap.add_argument("--json", action="store_true", help="JSON output")
    ap.add_argument("--top", type=int, default=10, help="Suggestions count")
    args = ap.parse_args()

    if args.list:
        if args.json:
            print(json.dumps({a: d for d, a in TEAMS.items()}, indent=2))
        else:
            print(f"\n  {_C.BOLD}All Teams ({len(TEAMS)}){_C.RESET}")
            print(f"  {'=' * 60}\n")
            print(f"  {'Alias':<22} {'Directory'}")
            print(f"  {'-' * 22} {'-' * 35}")
            for dir_name, alias in sorted(TEAMS.items()):
                print(f"  {alias:<22} {dir_name}")
            print()
        return

    if args.pair:
        a, b = (resolve_alias(x) for x in args.pair)
        if not a: print(f"Error: Unknown team '{args.pair[0]}'", file=sys.stderr); sys.exit(1)
        if not b: print(f"Error: Unknown team '{args.pair[1]}'", file=sys.stderr); sys.exit(1)
        if args.json:
            s = get_score(a, b)
            print(json.dumps({"team_a": a, "team_b": b, "score": s, "type": _label(s)}, indent=2))
        else:
            print_pair(a, b)
    elif args.suggest:
        alias = resolve_alias(args.suggest)
        if not alias: print(f"Error: Unknown team '{args.suggest}'", file=sys.stderr); sys.exit(1)
        if args.json:
            entries = get_all_for_team(alias)
            d = {"team": alias, "suggestions": [{"partner": p, "score": s, "type": l}
                                                 for p, s, l in entries if s >= 6][:args.top]}
            print(json.dumps(d, indent=2))
        else:
            print_suggest(alias, args.top)
    elif args.team:
        alias = resolve_alias(args.team)
        if not alias: print(f"Error: Unknown team '{args.team}'", file=sys.stderr); sys.exit(1)
        if args.json: output_json(alias)
        else: print_team(alias)
    else:
        if args.json: output_json()
        else: print_summary()

if __name__ == "__main__":
    main()
