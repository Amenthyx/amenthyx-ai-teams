#!/usr/bin/env python3
"""
Generate draw.io diagrams for all 65 Amenthyx AI Teams.
Each diagram shows the complete team management flow:
- Wave structure with gates
- All roles and their spawning order
- Dependencies between waves
- Approval gates (cost, plan, QA, UAT, merge)
- Evidence flow
- The full lifecycle from activation to release

Usage:
  python generate_team_diagrams.py [start] [end]
  e.g. python generate_team_diagrams.py 1 22   # teams 01-22
       python generate_team_diagrams.py 23 44  # teams 23-44
       python generate_team_diagrams.py 45 65  # teams 45-65
"""

import os
import sys
import re
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape
import subprocess
import glob

# Fix Windows encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRAWIO_EXE = r"C:\Program Files\draw.io\draw.io.exe"

# ─── Team data extraction ───────────────────────────────────────────────────

def extract_team_info(team_dir):
    """Parse TEAM.md and extract roles, waves, and team metadata."""
    team_md = os.path.join(team_dir, "TEAM.md")
    if not os.path.exists(team_md):
        return None

    with open(team_md, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract team name from first heading
    name_match = re.search(r"^#\s+(.+?)(?:\s+Team)?\s*$", content, re.MULTILINE)
    team_name = name_match.group(1).strip() if name_match else os.path.basename(team_dir)

    # Extract activation keyword
    kw_match = re.search(r"Activation:\s*`--team\s+(\S+)`", content)
    keyword = kw_match.group(1) if kw_match else ""

    # Extract roles from Section 2
    roles = []
    # Shared roles (always present)
    shared_roles = [
        {"code": "TL", "name": "Team Leader", "wave": "0", "mode": "foreground", "type": "orchestrator"},
        {"code": "PM", "name": "Project Manager", "wave": "1", "mode": "foreground-sequential", "type": "planning"},
        {"code": "JUDGE", "name": "Judge Agent", "wave": "1.5", "mode": "foreground-blocking", "type": "evaluation"},
    ]

    # Extract engineering roles (Wave 2) from spawn section
    eng_roles = []
    # Look for Wave 2 engineering spawn block
    eng_match = re.search(r"(?:Engineering|Security Engineering|Design|Domain|Specialist|Core|Research|Trading|Protocol|Analytics|Content) Wave.*?\n```\n(.*?)```",
                          content, re.DOTALL | re.IGNORECASE)
    if eng_match:
        block = eng_match.group(1)
        # Parse lines like: BE -> .team/api-contracts/  (files...)
        for line in block.strip().split("\n"):
            code_match = re.match(r"\s*(\w+)\s*->", line.strip())
            if code_match:
                code = code_match.group(1)
                eng_roles.append({"code": code, "name": code, "wave": "2", "mode": "parallel", "type": "engineering"})

    # If no engineering roles found, try parsing Section 2 headers
    if not eng_roles:
        role_headers = re.findall(r"###\s+\d+\.\d+\s+(.+?)\s*\((\w+)\)", content)
        for rname, rcode in role_headers:
            if rcode not in ["TL", "PM", "QA", "RM", "MKT", "LEGAL", "JUDGE", "CR", "RETRO", "DEPGUARD"]:
                eng_roles.append({"code": rcode, "name": rname.strip(), "wave": "2", "mode": "parallel", "type": "engineering"})

    # If still no engineering roles, extract from ### 2.X sections
    if not eng_roles:
        section_roles = re.findall(r"###\s+2\.\d+\s+(.+?)(?:\s+\((\w+)\))?\s*\n-\s+\*\*Role\*\*", content)
        for rname, rcode in section_roles:
            rname = rname.strip()
            if rcode and rcode not in ["TL", "PM", "QA", "RM", "MKT", "LEGAL"]:
                eng_roles.append({"code": rcode, "name": rname, "wave": "2", "mode": "parallel", "type": "engineering"})

    # Check for Wave 1.5 domain-specific roles (beyond MKT/LEGAL)
    wave15_extra = []
    spawn15_match = re.search(r"Spawn:.*?(?:Background, Parallel).*?\n```\n(.*?)```", content, re.DOTALL)
    if spawn15_match:
        block = spawn15_match.group(1)
        for line in block.split("\n"):
            desc_match = re.search(r'description="(\w+):', line)
            if desc_match:
                code = desc_match.group(1)
                if code not in ["MKT", "LEGAL", "JUDGE"]:
                    wave15_extra.append({"code": code, "name": code, "wave": "1.5", "mode": "background", "type": "research"})

    # Standard support roles
    support_roles = [
        {"code": "MKT", "name": "Marketing Strategist", "wave": "1.5", "mode": "background", "type": "research"},
        {"code": "LEGAL", "name": "Legal/Compliance", "wave": "1.5", "mode": "background", "type": "research"},
        {"code": "CR", "name": "Code Review Agent", "wave": "2.5", "mode": "foreground-blocking", "type": "quality"},
        {"code": "RETRO", "name": "Retrospective Agent", "wave": "post", "mode": "background", "type": "quality"},
        {"code": "DEPGUARD", "name": "Dependency Guardian", "wave": "3.8", "mode": "foreground-blocking", "type": "quality"},
        {"code": "QA", "name": "QA Engineer", "wave": "3", "mode": "foreground-sequential", "type": "testing"},
        {"code": "RM", "name": "Release Manager", "wave": "4", "mode": "foreground", "type": "release"},
    ]

    all_roles = shared_roles + wave15_extra + support_roles + eng_roles

    return {
        "name": team_name,
        "keyword": keyword,
        "dir": team_dir,
        "roles": all_roles,
        "engineering_roles": eng_roles,
        "wave15_extra": wave15_extra,
    }


# ─── Draw.io XML generation ────────────────────────────────────────────────

def make_id():
    """Generate a unique ID for draw.io elements."""
    make_id.counter += 1
    return f"id{make_id.counter}"
make_id.counter = 0


def add_cell(parent, cell_id, value, x, y, w, h, style, vertex=True, parent_id="1"):
    """Add a cell (shape) to the draw.io XML."""
    cell = ET.SubElement(parent, "mxCell",
        id=cell_id,
        value=escape(value),
        style=style,
        vertex="1" if vertex else "0",
        parent=parent_id,
    )
    geo = ET.SubElement(cell, "mxGeometry",
        x=str(x), y=str(y),
        width=str(w), height=str(h),
    )
    geo.set("as", "geometry")
    return cell_id


def add_edge(parent, edge_id, source, target, label="", style=""):
    """Add an edge (arrow) between two cells."""
    default_style = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;fontSize=11;"
    cell = ET.SubElement(parent, "mxCell",
        id=edge_id,
        value=escape(label),
        style=style or default_style,
        edge="1",
        parent="1",
        source=source,
        target=target,
    )
    geo = ET.SubElement(cell, "mxGeometry", relative="1")
    geo.set("as", "geometry")
    return edge_id


def generate_diagram_xml(team_info):
    """Generate complete draw.io XML for a team."""
    make_id.counter = 100  # Reset counter

    team_name = team_info["name"]
    eng_roles = team_info["engineering_roles"]
    wave15_extra = team_info["wave15_extra"]

    # Calculate layout dimensions
    eng_count = max(len(eng_roles), 1)
    eng_width = eng_count * 170
    total_width = max(eng_width + 200, 1400)
    center_x = total_width // 2

    # Create root XML structure
    mxfile = ET.Element("mxfile", host="app.diagrams.net", type="device")
    diagram = ET.SubElement(mxfile, "diagram", name=f"{team_name} - Team Management Flow", id="team-flow")
    model = ET.SubElement(diagram, "mxGraphModel",
        dx="1600", dy="1200", grid="1", gridSize="10",
        guides="1", tooltips="1", connect="1", arrows="1",
        fold="1", page="1", pageScale="1",
        pageWidth=str(total_width + 200), pageHeight="4200",
        math="0", shadow="0"
    )
    root = ET.SubElement(model, "root")
    ET.SubElement(root, "mxCell", id="0")
    ET.SubElement(root, "mxCell", id="1", parent="0")

    # ── Color scheme ──
    C_TITLE     = "rounded=1;whiteSpace=wrap;html=1;fillColor=#1a1a2e;strokeColor=#16213e;fontColor=#ffffff;fontSize=18;fontStyle=1;arcSize=10;"
    C_USER      = "rounded=1;whiteSpace=wrap;html=1;fillColor=#e94560;strokeColor=#c81d4e;fontColor=#ffffff;fontSize=13;fontStyle=1;"
    C_GATE      = "shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fillColor=#ff6b6b;strokeColor=#ee5a5a;fontColor=#ffffff;fontSize=11;fontStyle=1;size=0.15;"
    C_ORCH      = "rounded=1;whiteSpace=wrap;html=1;fillColor=#0f3460;strokeColor=#16213e;fontColor=#ffffff;fontSize=12;fontStyle=1;"
    C_PLAN      = "rounded=1;whiteSpace=wrap;html=1;fillColor=#533483;strokeColor=#3d2468;fontColor=#ffffff;fontSize=12;fontStyle=1;"
    C_JUDGE     = "rounded=1;whiteSpace=wrap;html=1;fillColor=#e94560;strokeColor=#c81d4e;fontColor=#ffffff;fontSize=12;fontStyle=1;"
    C_ENG       = "rounded=1;whiteSpace=wrap;html=1;fillColor=#1a8f5c;strokeColor=#147a4e;fontColor=#ffffff;fontSize=11;fontStyle=1;"
    C_QA        = "rounded=1;whiteSpace=wrap;html=1;fillColor=#e67e22;strokeColor=#d35400;fontColor=#ffffff;fontSize=12;fontStyle=1;"
    C_RELEASE   = "rounded=1;whiteSpace=wrap;html=1;fillColor=#2980b9;strokeColor=#2471a3;fontColor=#ffffff;fontSize=12;fontStyle=1;"
    C_BG        = "rounded=1;whiteSpace=wrap;html=1;fillColor=#7f8c8d;strokeColor=#6c7a7a;fontColor=#ffffff;fontSize=11;fontStyle=0;dashed=1;"
    C_ARTIFACT  = "shape=document;whiteSpace=wrap;html=1;fillColor=#f39c12;strokeColor=#e67e22;fontColor=#1a1a2e;fontSize=10;fontStyle=0;size=0.15;"
    C_EVIDENCE  = "shape=cylinder3;whiteSpace=wrap;html=1;fillColor=#27ae60;strokeColor=#1e8449;fontColor=#ffffff;fontSize=10;fontStyle=0;size=10;"
    C_WAVE_BG   = "rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#555555;fontSize=14;fontStyle=1;fontColor=#aaaaaa;verticalAlign=top;dashed=1;dashPattern=5 5;arcSize=8;"
    C_NOTE      = "shape=note;whiteSpace=wrap;html=1;fillColor=#ffffcc;strokeColor=#d6d600;fontColor=#333333;fontSize=9;fontStyle=0;size=14;"
    C_ARROW_BLOCK = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;fontSize=11;strokeColor=#e94560;fontColor=#e94560;"
    C_ARROW_FLOW  = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;fontSize=10;strokeColor=#3498db;"
    C_ARROW_BG    = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=1;fontSize=10;strokeColor=#7f8c8d;dashed=1;"

    y = 20

    # ═══════════════════════════════════════════════════════════════════════
    # TITLE
    # ═══════════════════════════════════════════════════════════════════════
    title_id = add_cell(root, make_id(), f"{team_name}\nComplete Team Management Flow", center_x - 300, y, 600, 60, C_TITLE)
    y += 80

    # ═══════════════════════════════════════════════════════════════════════
    # USER (top)
    # ═══════════════════════════════════════════════════════════════════════
    user_id = add_cell(root, make_id(), "👤 USER\n(Final Authority)", center_x - 80, y, 160, 50, C_USER)
    y += 70

    # User provides strategy
    strategy_id = add_cell(root, make_id(), "📄 --team {keyword}\n--strategy strategy.md", center_x - 110, y, 220, 40,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#2c3e50;strokeColor=#1a252f;fontColor=#ecf0f1;fontSize=11;fontStyle=2;".replace("{keyword}", team_info.get("keyword", "team")))
    add_edge(root, make_id(), user_id, strategy_id, "", C_ARROW_FLOW)
    y += 60

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 0: INITIALIZATION
    # ═══════════════════════════════════════════════════════════════════════
    w0_bg = add_cell(root, make_id(), "WAVE 0 — INITIALIZATION", 40, y, total_width - 80, 200, C_WAVE_BG)
    y += 35

    tl_id = add_cell(root, make_id(), "🎯 TL — Team Leader\n(Chief Orchestrator)\nReads TEAM.md + Strategy\nCreates ai-team branch\nCreates .team/ directory", center_x - 130, y, 260, 90, C_ORCH)
    add_edge(root, make_id(), strategy_id, tl_id, "activates", C_ARROW_FLOW)
    y += 110

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 0.1: DISCOVERY INTERVIEW
    # ═══════════════════════════════════════════════════════════════════════
    disc_id = add_cell(root, make_id(), "📋 PM Discovery Interview\n20+ mandatory questions\n→ DISCOVERY_INTERVIEW.md", center_x - 120, y, 240, 60, C_PLAN)
    add_edge(root, make_id(), tl_id, disc_id, "spawns PM", C_ARROW_FLOW)
    y += 80

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 0.2: COST ESTIMATION (BLOCKING GATE)
    # ═══════════════════════════════════════════════════════════════════════
    w02_bg = add_cell(root, make_id(), "WAVE 0.2 — COST ESTIMATION", 40, y, total_width - 80, 140, C_WAVE_BG)
    y += 30

    cost_id = add_cell(root, make_id(), "💰 TL: COST_ESTIMATION.md\nToken usage per wave/agent\nExternal service costs\nTotal budget", center_x - 130, y, 260, 70, C_PLAN)
    add_edge(root, make_id(), disc_id, cost_id, "interview done", C_ARROW_FLOW)

    cost_gate_id = add_cell(root, make_id(), "🚫 BLOCKING GATE\nUser Must Approve Cost", center_x + 190, y + 5, 200, 60, C_GATE)
    add_edge(root, make_id(), cost_id, cost_gate_id, "presents to user", C_ARROW_BLOCK)

    cost_user_id = add_cell(root, make_id(), "👤 USER\napproved / too expensive\n/ change X", center_x + 440, y + 5, 180, 60, C_USER)
    add_edge(root, make_id(), cost_gate_id, cost_user_id, "", C_ARROW_BLOCK)
    y += 120

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 0.5: MISSION CONTROL
    # ═══════════════════════════════════════════════════════════════════════
    mc_id = add_cell(root, make_id(), "🖥️ Mission Control Deploy\nDashboard at localhost:4200\nFile watchers + event hooks\nAuto-opens browser", center_x - 120, y, 240, 70, C_BG)
    add_edge(root, make_id(), cost_gate_id, mc_id, "approved", C_ARROW_FLOW)
    y += 100

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 1: PM PLANNING (3 PLANS)
    # ═══════════════════════════════════════════════════════════════════════
    w1_bg = add_cell(root, make_id(), "WAVE 1 — PM PLANNING (3 Mandatory Plans)", 40, y, total_width - 80, 280, C_WAVE_BG)
    y += 35

    pm_id = add_cell(root, make_id(), "📊 PM — Project Manager\n(Foreground, Sequential)\nCreates Charter, Milestones,\nKanban, Timeline, Risk Register\nGitHub Project + Issues", center_x - 130, y, 260, 90, C_PLAN)
    add_edge(root, make_id(), mc_id, pm_id, "spawns PM", C_ARROW_FLOW)
    y += 110

    # 3 Plans
    plan_a_id = add_cell(root, make_id(), "📝 PLAN A\nApproach + Architecture\nTech + Timeline + Risks\n+ DETAILED TO-DO LIST\n(per component, deps,\ncomplexity, order)", center_x - 380, y, 200, 110, C_ARTIFACT)
    plan_b_id = add_cell(root, make_id(), "📝 PLAN B\nDifferent approach\n(varies in 2+ dimensions)\n+ DETAILED TO-DO LIST\n(per component, deps,\ncomplexity, order)", center_x - 100, y, 200, 110, C_ARTIFACT)
    plan_c_id = add_cell(root, make_id(), "📝 PLAN C\nThird approach\n(MANDATORY)\n+ DETAILED TO-DO LIST\n(per component, deps,\ncomplexity, order)", center_x + 180, y, 200, 110, C_ARTIFACT)

    add_edge(root, make_id(), pm_id, plan_a_id, "", C_ARROW_FLOW)
    add_edge(root, make_id(), pm_id, plan_b_id, "", C_ARROW_FLOW)
    add_edge(root, make_id(), pm_id, plan_c_id, "", C_ARROW_FLOW)

    # To-do detail note
    todo_note = add_cell(root, make_id(), "Each plan includes:\n• Task table per role\n• Dependencies map\n• Execution order\n• Complexity (Low→Critical)\n• Priority (P0-P3)\n• Effort estimate\n• Critical path\n• Parallel opportunities", center_x + 430, y, 180, 110, C_NOTE)
    y += 140

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 1.5: JUDGE EVALUATION
    # ═══════════════════════════════════════════════════════════════════════
    w15_bg = add_cell(root, make_id(), "WAVE 1.5 — JUDGE EVALUATION + RESEARCH", 40, y, total_width - 80, 230, C_WAVE_BG)
    y += 35

    judge_id = add_cell(root, make_id(), "⚖️ JUDGE — Decision Analyst\n(Foreground, BLOCKING)\n7-Criterion Scoring Rubric\nStrategy 25% | Feasibility 20%\nRisk 15% | Scale 10% | Innovation 10%\nComplete 10% | Efficiency 10%", center_x - 160, y, 320, 100, C_JUDGE)
    add_edge(root, make_id(), plan_a_id, judge_id, "", C_ARROW_FLOW)
    add_edge(root, make_id(), plan_b_id, judge_id, "", C_ARROW_FLOW)
    add_edge(root, make_id(), plan_c_id, judge_id, "", C_ARROW_FLOW)

    # Background research roles
    mkt_id = add_cell(root, make_id(), "📢 MKT\n(Background)", center_x + 250, y, 100, 40, C_BG)
    legal_id = add_cell(root, make_id(), "⚖️ LEGAL\n(Background)", center_x + 370, y, 100, 40, C_BG)

    # Wave 1.5 extra domain roles
    extra_x = center_x + 250
    for i, extra in enumerate(wave15_extra[:3]):
        ex_id = add_cell(root, make_id(), f"{extra['code']}\n(Background)", extra_x + i * 120, y + 50, 100, 40, C_BG)

    y += 120

    # VERDICT
    verdict_id = add_cell(root, make_id(), "📜 VERDICT.md\nScored ranking of all 3 plans\n✅ WHY winner was chosen\n❌ WHY each loser was NOT chosen\nHidden assumptions + missing gaps\nSuggested modifications", center_x - 150, y, 300, 90, C_JUDGE)
    add_edge(root, make_id(), judge_id, verdict_id, "produces", C_ARROW_FLOW)
    y += 110

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 1.6: USER PLAN APPROVAL (BLOCKING GATE)
    # ═══════════════════════════════════════════════════════════════════════
    w16_bg = add_cell(root, make_id(), "WAVE 1.6 — USER PLAN APPROVAL (BLOCKING GATE)", 40, y, total_width - 80, 160, C_WAVE_BG)
    y += 30

    present_id = add_cell(root, make_id(), "📋 TL Presents to User:\n• All 3 Plans (summary)\n• Judge Scores & Justification\n• Recommended plan\n\"Which plan do you approve?\"", center_x - 180, y, 260, 90, C_ORCH)
    add_edge(root, make_id(), verdict_id, present_id, "TL reads", C_ARROW_FLOW)

    plan_gate_id = add_cell(root, make_id(), "🚫 BLOCKING GATE\nUser Must Select Plan", center_x + 130, y + 10, 200, 60, C_GATE)
    add_edge(root, make_id(), present_id, plan_gate_id, "", C_ARROW_BLOCK)

    plan_user_id = add_cell(root, make_id(), "👤 USER DECIDES\nPlan A / B / C\nHybrid / Re-plan", center_x + 400, y + 10, 170, 60, C_USER)
    add_edge(root, make_id(), plan_gate_id, plan_user_id, "", C_ARROW_BLOCK)
    y += 140

    # ═══════════════════════════════════════════════════════════════════════
    # OPTIONAL: WAVE 1.7 A/B SPIKE
    # ═══════════════════════════════════════════════════════════════════════
    spike_id = add_cell(root, make_id(), "🔬 Wave 1.7 (Optional)\nA/B Spike Validation\nTime-boxed PoC of runner-up\nif margin < 1.0 points", center_x - 120, y, 240, 60, C_BG)
    add_edge(root, make_id(), plan_gate_id, spike_id, "if requested", C_ARROW_BG)
    y += 90

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 2: ENGINEERING (Domain-specific parallel agents)
    # ═══════════════════════════════════════════════════════════════════════
    eng_box_h = 160
    w2_bg = add_cell(root, make_id(), f"WAVE 2 — ENGINEERING (Parallel — {eng_count} agents)", 40, y, total_width - 80, eng_box_h + 60, C_WAVE_BG)
    y += 35

    eng_ids = []
    start_x = center_x - (eng_count * 160) // 2
    for i, role in enumerate(eng_roles[:10]):  # Cap at 10 for layout
        role_label = f"🔧 {role['code']}\n{role.get('name', role['code'])}\n(Parallel, Background)\nAtomic commits\nEvidence required"
        eid = add_cell(root, make_id(), role_label, start_x + i * 160, y, 145, 100, C_ENG)
        eng_ids.append(eid)
        if i == 0:
            add_edge(root, make_id(), plan_gate_id, eid, "approved plan", C_ARROW_FLOW)

    if len(eng_ids) > 1:
        for eid in eng_ids[1:]:
            add_edge(root, make_id(), plan_gate_id, eid, "", C_ARROW_FLOW)

    # PM 6-hour reports note
    pm_report_id = add_cell(root, make_id(), "📊 PM: 6-hour\nPPTX + PDF\nupdates", start_x + eng_count * 160 + 20, y + 20, 100, 60, C_BG)

    y += eng_box_h

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 2.5: CODE REVIEW (BLOCKING)
    # ═══════════════════════════════════════════════════════════════════════
    w25_bg = add_cell(root, make_id(), "WAVE 2.5 — CODE REVIEW (Blocking Gate)", 40, y, total_width - 80, 120, C_WAVE_BG)
    y += 30

    cr_id = add_cell(root, make_id(), "🔍 CR — Code Review Agent\n(Foreground, BLOCKING)\nOWASP | Code Quality | Architecture\nHardcoded secrets | Test coverage\nScore ≥ 7.0 = PASS", center_x - 150, y, 300, 70, C_QA)
    if eng_ids:
        add_edge(root, make_id(), eng_ids[0], cr_id, "all eng done", C_ARROW_FLOW)

    # RETRO runs in background
    retro_id = add_cell(root, make_id(), "📝 RETRO\n(Background)\nWave analysis", center_x + 220, y + 5, 110, 50, C_BG)
    y += 100

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 3: QA (SEQUENTIAL GATE)
    # ═══════════════════════════════════════════════════════════════════════
    w3_bg = add_cell(root, make_id(), "WAVE 3 — QA + TESTING (Sequential Gate)", 40, y, total_width - 80, 120, C_WAVE_BG)
    y += 30

    qa_id = add_cell(root, make_id(), "🧪 QA — QA Engineer\n(Foreground, Sequential)\nUnit | Integration | E2E\nPerformance | Security\n→ QA_SIGNOFF.md (PASS required)", center_x - 150, y, 300, 70, C_QA)
    add_edge(root, make_id(), cr_id, qa_id, "CR PASS", C_ARROW_FLOW)
    y += 90

    # Bug fix loop
    bugfix_id = add_cell(root, make_id(), "🐛 Wave 3.5\nBug Fix Loop\n(if QA FAIL)", center_x + 220, y - 60, 130, 50, C_QA)
    add_edge(root, make_id(), qa_id, bugfix_id, "FAIL", C_ARROW_BLOCK)
    add_edge(root, make_id(), bugfix_id, qa_id, "re-test",
        "edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=1;strokeColor=#e67e22;dashed=1;")

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 3.7: UAT (BLOCKING)
    # ═══════════════════════════════════════════════════════════════════════
    uat_id = add_cell(root, make_id(), "✅ Wave 3.7 — UAT\nUser Acceptance Testing\n(BLOCKING GATE)\n≥95% CTA Coverage\nQA → TL → User sign-off", center_x - 130, y, 260, 80, C_GATE)
    add_edge(root, make_id(), qa_id, uat_id, "QA PASS", C_ARROW_FLOW)
    y += 100

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 3.8: DEPENDENCY AUDIT
    # ═══════════════════════════════════════════════════════════════════════
    dep_id = add_cell(root, make_id(), "🛡️ Wave 3.8 — DEPGUARD\nDependency Audit\n(Foreground, BLOCKING)\nCVEs | Licenses | Supply chain\nPASS required for release", center_x - 130, y, 260, 80, C_QA)
    add_edge(root, make_id(), uat_id, dep_id, "UAT PASS", C_ARROW_FLOW)
    y += 110

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 4: RELEASE
    # ═══════════════════════════════════════════════════════════════════════
    w4_bg = add_cell(root, make_id(), "WAVE 4 — RELEASE", 40, y, total_width - 80, 120, C_WAVE_BG)
    y += 30

    rm_id = add_cell(root, make_id(), "🚀 RM — Release Manager\n(Foreground)\nSemantic versioning | Changelog\nDeployment checklist | Rollback plan\nGitHub Release via gh", center_x - 150, y, 300, 70, C_RELEASE)
    add_edge(root, make_id(), dep_id, rm_id, "DEP PASS", C_ARROW_FLOW)
    y += 100

    # ═══════════════════════════════════════════════════════════════════════
    # WAVE 5: FINAL REPORTING
    # ═══════════════════════════════════════════════════════════════════════
    w5_bg = add_cell(root, make_id(), "WAVE 5 — FINAL REPORTING", 40, y, total_width - 80, 100, C_WAVE_BG)
    y += 30

    final_id = add_cell(root, make_id(), "📊 PM: Final PPTX + PDF\n📝 RETRO: Final retrospective\n📋 Mission Control: Final PDF report", center_x - 150, y, 300, 50, C_PLAN)
    add_edge(root, make_id(), rm_id, final_id, "", C_ARROW_FLOW)
    y += 80

    # ═══════════════════════════════════════════════════════════════════════
    # MERGE GATE (FINAL USER APPROVAL)
    # ═══════════════════════════════════════════════════════════════════════
    merge_gate_id = add_cell(root, make_id(), "🚫 FINAL BLOCKING GATE\nai-team → main merge\nRequires explicit user approval\n\"approved\" or \"merge\"", center_x - 130, y, 260, 70, C_GATE)
    add_edge(root, make_id(), final_id, merge_gate_id, "", C_ARROW_FLOW)

    merge_user_id = add_cell(root, make_id(), "👤 USER\nApproves merge\nto main", center_x + 200, y + 5, 150, 55, C_USER)
    add_edge(root, make_id(), merge_gate_id, merge_user_id, "", C_ARROW_BLOCK)
    y += 100

    # ═══════════════════════════════════════════════════════════════════════
    # EVIDENCE & ARTIFACTS SIDEBAR
    # ═══════════════════════════════════════════════════════════════════════
    sidebar_x = 40
    sidebar_y = y + 20

    ev_title = add_cell(root, make_id(), "📦 .team/ Directory Structure", sidebar_x, sidebar_y, total_width - 80, 30,
        "rounded=0;whiteSpace=wrap;html=1;fillColor=#2c3e50;strokeColor=#1a252f;fontColor=#ecf0f1;fontSize=13;fontStyle=1;")
    sidebar_y += 40

    artifacts = [
        "PROJECT_CHARTER.md | MILESTONES.md | KANBAN.md | TIMELINE.md | RISK_REGISTER.md",
        "plans/ → PLAN_A.md, PLAN_B.md, PLAN_C.md, VERDICT.md",
        "evidence/ → manifests/, spikes/, screenshots/",
        "reports/ → status_NNN.pptx, activity_NNN.pdf",
        "learnings/ → agent memory & reusable knowledge",
        "COST_ESTIMATION.md | DECISION_LOG.md | DISCOVERY_INTERVIEW.md",
    ]
    for art in artifacts:
        add_cell(root, make_id(), art, sidebar_x + 20, sidebar_y, total_width - 120, 22,
            "rounded=0;whiteSpace=wrap;html=1;fillColor=#34495e;strokeColor=#2c3e50;fontColor=#bdc3c7;fontSize=10;fontStyle=0;align=left;spacingLeft=8;")
        sidebar_y += 26

    sidebar_y += 15

    # Key / Legend
    legend_y = sidebar_y
    add_cell(root, make_id(), "LEGEND", sidebar_x, legend_y, total_width - 80, 25,
        "rounded=0;whiteSpace=wrap;html=1;fillColor=#2c3e50;strokeColor=#1a252f;fontColor=#ecf0f1;fontSize=12;fontStyle=1;")
    legend_y += 30

    legend_items = [
        ("🔴 Red hexagon", "BLOCKING GATE — requires approval to proceed", C_GATE.replace("shape=hexagon;perimeter=hexagonPerimeter2;", "rounded=1;")),
        ("🟣 Purple", "Planning & PM artifacts", C_PLAN),
        ("🔴 Dark Red", "Judge & evaluation", C_JUDGE),
        ("🟢 Green", "Engineering agents (parallel)", C_ENG),
        ("🟠 Orange", "QA, Code Review, testing", C_QA),
        ("🔵 Blue", "Release & deployment", C_RELEASE),
        ("⬜ Gray dashed", "Background / non-blocking", C_BG),
        ("🟡 Yellow doc", "Artifacts & documents", C_ARTIFACT.replace("shape=document;", "rounded=1;").replace("size=0.15;", "")),
        ("👤 Red rounded", "User decision points", C_USER),
    ]
    for label, desc, style in legend_items:
        add_cell(root, make_id(), f"{label}: {desc}", sidebar_x + 20, legend_y, total_width - 120, 22,
            "rounded=1;whiteSpace=wrap;html=1;fillColor=#34495e;strokeColor=#2c3e50;fontColor=#bdc3c7;fontSize=9;fontStyle=0;align=left;spacingLeft=8;")
        legend_y += 26

    # ── Serialize ──
    return ET.tostring(mxfile, encoding="unicode", xml_declaration=True)


# ─── Main ───────────────────────────────────────────────────────────────────

def main():
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    end = int(sys.argv[2]) if len(sys.argv) > 2 else 65

    # Find all team directories
    team_dirs = sorted(glob.glob(os.path.join(REPO_ROOT, "*-*")))
    team_dirs = [d for d in team_dirs if os.path.isdir(d) and os.path.exists(os.path.join(d, "TEAM.md"))]

    # Filter by range
    filtered = []
    for d in team_dirs:
        basename = os.path.basename(d)
        num_match = re.match(r"(\d+)-", basename)
        if num_match:
            num = int(num_match.group(1))
            if start <= num <= end:
                filtered.append(d)

    print(f"Processing {len(filtered)} teams (range {start}-{end})...")

    results = {"ok": [], "fail": []}

    for team_dir in filtered:
        basename = os.path.basename(team_dir)
        print(f"\n{'='*60}")
        print(f"Processing: {basename}")
        print(f"{'='*60}")

        # Extract team info
        info = extract_team_info(team_dir)
        if not info:
            print(f"  SKIP: Could not parse TEAM.md")
            results["fail"].append(basename)
            continue

        print(f"  Team: {info['name']}")
        print(f"  Engineering roles: {[r['code'] for r in info['engineering_roles']]}")

        # Generate draw.io XML
        xml_content = generate_diagram_xml(info)
        drawio_path = os.path.join(team_dir, f"{basename}-team-diagram.drawio")
        with open(drawio_path, "w", encoding="utf-8") as f:
            f.write(xml_content)
        print(f"  ✓ Created: {drawio_path}")

        # Export PNG using draw.io CLI
        png_path = os.path.join(team_dir, f"{basename}-team-diagram.png")
        try:
            cmd = [
                DRAWIO_EXE,
                "--export",
                "--format", "png",
                "--scale", "2",
                "--border", "20",
                "--output", png_path,
                drawio_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if os.path.exists(png_path) and os.path.getsize(png_path) > 0:
                size_kb = os.path.getsize(png_path) / 1024
                print(f"  ✓ Exported PNG: {png_path} ({size_kb:.0f} KB)")
                results["ok"].append(basename)
            else:
                print(f"  ✗ PNG export failed: {result.stderr}")
                results["fail"].append(basename)
        except subprocess.TimeoutExpired:
            print(f"  ✗ PNG export timed out")
            results["fail"].append(basename)
        except Exception as e:
            print(f"  ✗ PNG export error: {e}")
            results["fail"].append(basename)

    print(f"\n{'='*60}")
    print(f"DONE: {len(results['ok'])} OK, {len(results['fail'])} failed")
    if results["fail"]:
        print(f"Failed: {results['fail']}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
