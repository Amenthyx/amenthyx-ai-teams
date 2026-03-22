import {
  getEvents,
  getAgents,
  getBudget,
  getWaves,
  getGates,
  getUATSuites,
  getUATCases,
  getUATSummary,
  getDecisions,
  getInterviews,
  getCIRuns,
  getEvidence,
  getSessions,
  getAgentMessages,
  getArtifacts,
  getEventCountsByCategory,
  getEventTimeline,
  getErrorEvents,
  getDatabaseHealth,
} from '../db/database';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Enterprise PDF Generator — Mission Control
// Generates an exhaustive, print-ready HTML document covering EVERY aspect
// of the team execution: Claude logs, strategy, plans, pod communications,
// decisions, files, git history, and much more.
// ---------------------------------------------------------------------------

function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

function fmtTokens(n?: number | null): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function severityBadge(s: string): string {
  const colors: Record<string, string> = {
    critical: '#DC2626', error: '#EF4444', warn: '#F59E0B', info: '#3B82F6',
  };
  const bg = colors[s] || '#6B7280';
  return `<span style="background:${bg};color:#fff;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:600">${esc(s).toUpperCase()}</span>`;
}

function statusBadge(s: string): string {
  const colors: Record<string, string> = {
    done: '#10B981', active: '#3B82F6', pass: '#10B981', fail: '#EF4444',
    pending: '#6B7280', idle: '#6B7280', blocked: '#EF4444', running: '#3B82F6',
    approved: '#10B981', rejected: '#EF4444', proposed: '#F59E0B',
    passed: '#10B981', failed: '#EF4444', complete: '#10B981',
    in_progress: '#3B82F6',
  };
  const bg = colors[s] || '#6B7280';
  return `<span style="background:${bg};color:#fff;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:600">${esc(s).toUpperCase()}</span>`;
}

function pct(a: number, b: number): string {
  if (b === 0) return '0%';
  return `${((a / b) * 100).toFixed(1)}%`;
}

function tableRow(cells: string[], isHeader = false): string {
  const tag = isHeader ? 'th' : 'td';
  return '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
}

function sec(num: number, title: string, content: string): string {
  return `
    <div class="section">
      <h2><span class="section-num">${num}</span> ${esc(title)}</h2>
      ${content}
    </div>`;
}

function card(label: string, value: string, color = '#3B82F6'): string {
  return `<div class="metric-card">
    <div class="metric-value" style="color:${color}">${value}</div>
    <div class="metric-label">${esc(label)}</div>
  </div>`;
}

function emptyState(msg: string): string {
  return `<p class="empty">No ${msg} recorded.</p>`;
}

function codeBlock(content: string): string {
  return `<pre class="code-block">${esc(content)}</pre>`;
}

function collapsible(title: string, content: string, open = false): string {
  return `<details${open ? ' open' : ''}><summary class="collapsible-title">${title}</summary><div class="collapsible-body">${content}</div></details>`;
}

/** Try to read a file from .team/ directory, return null if not found */
function readTeamFile(filePath: string): string | null {
  const projectDir = process.env.MC_PROJECT_DIR || process.cwd();
  const fullPath = path.join(projectDir, '.team', filePath);
  try {
    return fs.readFileSync(fullPath, 'utf-8');
  } catch {
    return null;
  }
}

/** Try to read strategy file */
function readStrategyFile(): string | null {
  const projectDir = process.env.MC_PROJECT_DIR || process.cwd();
  // Try common locations
  const candidates = [
    'strategy.md', 'STRATEGY.md', 'strategy/strategy.md',
    '.team/STRATEGY.md', 'docs/strategy.md',
  ];
  for (const candidate of candidates) {
    try {
      return fs.readFileSync(path.join(projectDir, candidate), 'utf-8');
    } catch { /* continue */ }
  }
  return null;
}

/** List all files in .team/ recursively */
function listTeamFiles(): Array<{ path: string; size: number; modified: string }> {
  const projectDir = process.env.MC_PROJECT_DIR || process.cwd();
  const teamDir = path.join(projectDir, '.team');
  const results: Array<{ path: string; size: number; modified: string }> = [];

  function walk(dir: string, prefix: string) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          walk(fullPath, relPath);
        } else {
          try {
            const stat = fs.statSync(fullPath);
            results.push({
              path: relPath,
              size: stat.size,
              modified: stat.mtime.toISOString(),
            });
          } catch { /* skip */ }
        }
      }
    } catch { /* dir doesn't exist */ }
  }

  walk(teamDir, '');
  return results.sort((a, b) => a.path.localeCompare(b.path));
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateEnterprisePDF(): string {
  const now = new Date().toISOString();
  const agents = getAgents();
  const budget = getBudget();
  const waves = getWaves();
  const { events, total: totalEvents } = getEvents({ limit: 10000 });
  const gates = getGates();
  const uatSuites = getUATSuites();
  const uatCases = getUATCases();
  const uatSummary = getUATSummary();
  const decisions = getDecisions();
  const interviews = getInterviews();
  const ciRuns = getCIRuns();
  const evidence = getEvidence();
  const sessions = getSessions();
  const agentMessages = getAgentMessages();
  const artifacts = getArtifacts();
  const categoryCounts = getEventCountsByCategory();
  const timeline = getEventTimeline(15, 500);
  const errorAgents = getErrorEvents(100);
  const dbHealth = getDatabaseHealth();

  // Read .team/ files
  const strategyContent = readStrategyFile();
  const discoveryInterview = readTeamFile('DISCOVERY_INTERVIEW.md');
  const projectCharter = readTeamFile('PROJECT_CHARTER.md');
  const milestones = readTeamFile('MILESTONES.md');
  const kanban = readTeamFile('KANBAN.md');
  const costEstimation = readTeamFile('COST_ESTIMATION.md');
  const riskRegister = readTeamFile('RISK_REGISTER.md');
  const podContracts = readTeamFile('POD_CONTRACTS.md');
  const timelineFile = readTeamFile('TIMELINE.md');
  const decisionLog = readTeamFile('DECISION_LOG.md');
  const xpodEvents = readTeamFile('XPOD_EVENTS.md');
  const xpodDashboard = readTeamFile('XPOD_DASHBOARD.md');
  const xpodEscalations = readTeamFile('XPOD_ESCALATIONS.md');
  const planA = readTeamFile('plans/PLAN_A.md');
  const planB = readTeamFile('plans/PLAN_B.md');
  const planC = readTeamFile('plans/PLAN_C.md');
  const verdict = readTeamFile('plans/VERDICT.md');
  const teamFiles = listTeamFiles();

  // Read retrospectives
  const retroFiles: Array<{ name: string; content: string }> = [];
  try {
    const projectDir = process.env.MC_PROJECT_DIR || process.cwd();
    const retroDir = path.join(projectDir, '.team', 'retros');
    const entries = fs.readdirSync(retroDir);
    for (const entry of entries.filter(e => e.endsWith('.md'))) {
      const content = fs.readFileSync(path.join(retroDir, entry), 'utf-8');
      retroFiles.push({ name: entry, content });
    }
  } catch { /* no retros */ }

  // Read code review files
  const reviewFiles: Array<{ name: string; content: string }> = [];
  try {
    const projectDir = process.env.MC_PROJECT_DIR || process.cwd();
    const reviewDir = path.join(projectDir, '.team', 'reviews');
    const entries = fs.readdirSync(reviewDir);
    for (const entry of entries.filter(e => e.endsWith('.md'))) {
      const content = fs.readFileSync(path.join(reviewDir, entry), 'utf-8');
      reviewFiles.push({ name: entry, content });
    }
  } catch { /* no reviews */ }

  // Derived metrics
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const doneAgents = agents.filter(a => a.status === 'done').length;
  const blockedAgents = agents.filter(a => a.status === 'blocked').length;
  const totalTokens = agents.reduce((s, a) => s + (a.tokensUsed ?? 0), 0);
  const totalCost = agents.reduce((s, a) => s + (a.costUsd ?? 0), 0);
  const doneWaves = waves.filter(w => w.status === 'done').length;
  const passedGates = gates.filter(g => g.status === 'pass' || g.status === 'approved').length;
  const failedGates = gates.filter(g => g.status === 'fail' || g.status === 'rejected').length;
  const pendingGates = gates.filter(g => g.status === 'pending').length;
  const criticalEvents = events.filter(e => e.severity === 'critical').length;
  const errorEvents = events.filter(e => e.severity === 'error').length;
  const ciPassed = ciRuns.filter(r => r.status === 'passed').length;
  const ciFailed = ciRuns.filter(r => r.status === 'failed').length;

  // Claude Code specific events
  const claudeToolEvents = events.filter(e => {
    try {
      const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
      return p?.hook_type === 'PostToolUse' || p?.hook_type === 'PreToolUse';
    } catch { return false; }
  });
  const claudeAgentEvents = events.filter(e => {
    try {
      const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
      return p?.hook_type === 'SubagentStart' || p?.hook_type === 'SubagentStop';
    } catch { return false; }
  });
  const claudePromptEvents = events.filter(e => {
    try {
      const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
      return p?.hook_type === 'UserPromptSubmit';
    } catch { return false; }
  });

  // XPOD-related events
  const xpodDbEvents = events.filter(e => {
    try {
      const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
      return (p?.message || '').toLowerCase().includes('xpod') ||
             (e.type || '').includes('xpod') ||
             (e.category || '').includes('XPOD');
    } catch { return false; }
  });

  const sections: string[] = [];
  let sectionNum = 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: EXECUTIVE SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  sections.push(sec(sectionNum, 'Executive Summary', `
    <div class="metric-grid">
      ${card('Total Agents', String(agents.length), '#3B82F6')}
      ${card('Active', String(activeAgents), '#10B981')}
      ${card('Done', String(doneAgents), '#8B5CF6')}
      ${card('Blocked', String(blockedAgents), blockedAgents > 0 ? '#EF4444' : '#6B7280')}
      ${card('Waves', `${doneWaves}/${waves.length}`, '#F59E0B')}
      ${card('Gates Passed', `${passedGates}/${gates.length}`, '#10B981')}
      ${card('Total Events', String(totalEvents), '#6366F1')}
      ${card('Critical/Error', `${criticalEvents}/${errorEvents}`, criticalEvents > 0 ? '#EF4444' : '#6B7280')}
      ${card('Total Tokens', fmtTokens(totalTokens), '#EC4899')}
      ${card('Total Cost', `$${totalCost.toFixed(2)}`, '#F97316')}
      ${card('Evidence', String(evidence.length), '#14B8A6')}
      ${card('CI Runs', `${ciPassed}P/${ciFailed}F`, ciFailed > 0 ? '#EF4444' : '#10B981')}
      ${card('Decisions', String(decisions.length), '#8B5CF6')}
      ${card('Messages', String(agentMessages.length), '#06B6D4')}
      ${card('Claude Tool Calls', String(claudeToolEvents.length), '#A855F7')}
      ${card('Files in .team/', String(teamFiles.length), '#F97316')}
    </div>
    <h3>Session Info</h3>
    <table>
      ${tableRow(['Metric', 'Value'], true)}
      ${tableRow(['Report Generated', fmtDate(now)])}
      ${tableRow(['Sessions', String(sessions.length)])}
      ${sessions.length > 0 ? tableRow(['First Session', fmtDate(sessions[0]?.created_at)]) : ''}
      ${sessions.length > 0 ? tableRow(['Last Active', fmtDate(sessions[sessions.length - 1]?.last_active)]) : ''}
      ${tableRow(['Artifacts Produced', String(artifacts.length)])}
      ${tableRow(['UAT Suites', String(uatSuites.length)])}
      ${tableRow(['UAT Cases', String(uatCases.length)])}
      ${tableRow(['Interviews', String(interviews.length)])}
    </table>
  `));

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: PROJECT STRATEGY (Full Content)
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (strategyContent) {
      content += `<p class="note">Strategy file loaded from project directory.</p>`;
      content += `<div class="markdown-content">${codeBlock(strategyContent)}</div>`;
    } else {
      content = `<p class="empty">Strategy file not found. Looked in: strategy.md, STRATEGY.md, .team/STRATEGY.md</p>`;
    }
    sections.push(sec(sectionNum, 'Project Strategy (Full Document)', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: DISCOVERY INTERVIEW (Full Q&A)
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';

    // First show from database (structured)
    if (interviews.length > 0) {
      content += '<h3>Structured Interview Data (Database)</h3>';
      const byCategory: Record<string, typeof interviews> = {};
      for (const i of interviews) {
        const cat = i.category || 'general';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(i);
      }
      for (const [cat, items] of Object.entries(byCategory).sort()) {
        content += `<h3>${esc(cat.charAt(0).toUpperCase() + cat.slice(1))}</h3>`;
        for (const i of items.sort((a, b) => (a.order_num ?? 0) - (b.order_num ?? 0))) {
          content += `<div class="qa-block">
            <div class="question">Q${i.order_num ?? ''}: ${esc(i.question)}</div>
            <div class="answer">${esc(i.answer)}</div>
            ${i.implications ? `<div class="implications"><em>Implications:</em> ${esc(i.implications)}</div>` : ''}
          </div>`;
        }
      }
    }

    // Then show from file (full document)
    if (discoveryInterview) {
      content += '<h3>Full Interview Document (.team/DISCOVERY_INTERVIEW.md)</h3>';
      content += codeBlock(discoveryInterview);
    }

    if (!interviews.length && !discoveryInterview) {
      content = emptyState('interview data');
    }
    sections.push(sec(sectionNum, 'Discovery Interview (Complete)', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: PROJECT CHARTER
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (projectCharter) {
      content = codeBlock(projectCharter);
    } else {
      content = emptyState('project charter');
    }
    sections.push(sec(sectionNum, 'Project Charter', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: PLANS (A, B, C) + JUDGE VERDICT
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    const plans = [
      { name: 'Plan A', data: planA },
      { name: 'Plan B', data: planB },
      { name: 'Plan C', data: planC },
    ];
    let hasPlan = false;
    for (const p of plans) {
      if (p.data) {
        hasPlan = true;
        content += collapsible(`${p.name} (Full Document)`, codeBlock(p.data));
      }
    }
    if (verdict) {
      hasPlan = true;
      content += `<h3>Judge Verdict</h3>`;
      content += codeBlock(verdict);
    }
    if (!hasPlan) {
      content = emptyState('plans or verdict');
    }
    sections.push(sec(sectionNum, 'Alternative Plans & Judge Verdict', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: BUDGET & COST ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (budget) {
      const remaining = budget.total - budget.spent;
      const usage = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;
      const barColor = usage > 90 ? '#EF4444' : usage > 70 ? '#F59E0B' : '#10B981';
      content += `
        <div class="budget-bar-container">
          <div class="budget-bar" style="width:${Math.min(usage, 100)}%;background:${barColor}"></div>
        </div>
        <table>
          ${tableRow(['Metric', 'Value'], true)}
          ${tableRow(['Total Budget', `$${budget.total.toFixed(2)} ${budget.currency}`])}
          ${tableRow(['Spent', `$${budget.spent.toFixed(2)} ${budget.currency}`])}
          ${tableRow(['Remaining', `$${remaining.toFixed(2)} ${budget.currency}`])}
          ${tableRow(['Usage', `${usage.toFixed(1)}%`])}
          ${tableRow(['Alert Threshold', `${(budget.alertThreshold * 100).toFixed(0)}%`])}
          ${budget.hardCap ? tableRow(['Hard Cap', `$${budget.hardCap.toFixed(2)}`]) : ''}
        </table>`;

      // Cost per agent
      const costAgents = agents.filter(a => (a.costUsd ?? 0) > 0).sort((a, b) => (b.costUsd ?? 0) - (a.costUsd ?? 0));
      if (costAgents.length > 0) {
        content += '<h3>Cost Breakdown by Agent</h3><table>';
        content += tableRow(['Agent', 'Role', 'Tokens', 'Cost', '% of Total'], true);
        for (const a of costAgents) {
          content += tableRow([
            esc(a.name), esc(a.role), fmtTokens(a.tokensUsed),
            `$${(a.costUsd ?? 0).toFixed(4)}`,
            totalCost > 0 ? pct(a.costUsd ?? 0, totalCost) : '—',
          ]);
        }
        content += '</table>';
      }
    }

    // Cost estimation file
    if (costEstimation) {
      content += '<h3>Cost Estimation Document</h3>';
      content += codeBlock(costEstimation);
    }

    if (!budget && !costEstimation) {
      content = emptyState('budget data');
    }
    sections.push(sec(sectionNum, 'Budget & Cost Analysis', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7: WAVE EXECUTION PROGRESS
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (waves.length > 0) {
      content += '<table>';
      content += tableRow(['Wave #', 'Name', 'Status', 'Gate'], true);
      for (const w of waves) {
        content += tableRow([
          String(w.number), esc(w.name), statusBadge(w.status), statusBadge(w.gate),
        ]);
      }
      content += '</table>';
    }

    // Milestones file
    if (milestones) {
      content += '<h3>Milestones Document</h3>';
      content += codeBlock(milestones);
    }

    // Timeline file
    if (timelineFile) {
      content += '<h3>Timeline Document</h3>';
      content += codeBlock(timelineFile);
    }

    if (waves.length === 0 && !milestones && !timelineFile) {
      content = emptyState('wave data');
    }
    sections.push(sec(sectionNum, 'Wave Execution & Milestones', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 8: AGENT ROSTER & PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (agents.length > 0) {
      const byCategory: Record<string, typeof agents> = {};
      for (const a of agents) {
        const cat = a.category || 'other';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(a);
      }

      for (const [cat, catAgents] of Object.entries(byCategory).sort()) {
        content += `<h3>${esc(cat.charAt(0).toUpperCase() + cat.slice(1))} (${catAgents.length})</h3>`;
        content += '<table>';
        content += tableRow(['Role', 'Name', 'Status', 'Wave', 'Tokens', 'Cost', 'Current Task'], true);
        for (const a of catAgents.sort((x, y) => (y.costUsd ?? 0) - (x.costUsd ?? 0))) {
          content += tableRow([
            `<strong>${esc(a.role)}</strong>`,
            esc(a.name),
            statusBadge(a.status),
            a.wave != null ? String(a.wave) : '—',
            fmtTokens(a.tokensUsed),
            `$${(a.costUsd ?? 0).toFixed(4)}`,
            esc(a.currentTask) || '—',
          ]);
        }
        content += '</table>';
      }
    } else {
      content = emptyState('agent data');
    }
    sections.push(sec(sectionNum, 'Agent Roster & Performance', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 9: QUALITY GATES
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (gates.length > 0) {
      content += `<div class="metric-grid" style="margin-bottom:12px">
        ${card('Passed', String(passedGates), '#10B981')}
        ${card('Failed', String(failedGates), '#EF4444')}
        ${card('Pending', String(pendingGates), '#F59E0B')}
      </div>`;
      content += '<table>';
      content += tableRow(['Gate ID', 'Type', 'Status', 'Source', 'Message', 'Created', 'Resolved', 'Decision'], true);
      for (const g of gates) {
        content += tableRow([
          esc(g.id?.slice(0, 8)),
          esc(g.gate_type),
          statusBadge(g.status),
          esc(g.source) || '—',
          esc(g.message?.slice(0, 120)) || '—',
          fmtDate(g.created_at),
          fmtDate(g.resolved_at) || '—',
          esc(g.decision) || '—',
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('gate data');
    }
    sections.push(sec(sectionNum, 'Quality Gates', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 10: DECISIONS LOG (Full)
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (decisions.length > 0) {
      content += '<table>';
      content += tableRow(['#', 'Title', 'Context', 'Decision', 'Rationale', 'Decided By', 'Status', 'Date'], true);
      for (let i = 0; i < decisions.length; i++) {
        const d = decisions[i];
        content += tableRow([
          String(i + 1),
          `<strong>${esc(d.title)}</strong>`,
          esc(d.context?.slice(0, 150)) || '—',
          esc(d.decision_text?.slice(0, 150)) || '—',
          esc(d.rationale?.slice(0, 150)) || '—',
          esc(d.decided_by) || '—',
          statusBadge(d.status),
          fmtDate(d.created_at),
        ]);
      }
      content += '</table>';
    }

    // Full decision log file
    if (decisionLog) {
      content += '<h3>Full Decision Log (.team/DECISION_LOG.md)</h3>';
      content += codeBlock(decisionLog);
    }

    if (decisions.length === 0 && !decisionLog) {
      content = emptyState('decisions');
    }
    sections.push(sec(sectionNum, 'Decisions Log (Complete)', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 11: POD CONTRACTS & COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (podContracts) {
      content += '<h3>Pod Contracts (.team/POD_CONTRACTS.md)</h3>';
      content += codeBlock(podContracts);
    }

    // XPOD events
    if (xpodEvents) {
      content += '<h3>XPOD Event Log (.team/XPOD_EVENTS.md)</h3>';
      content += codeBlock(xpodEvents);
    }
    if (xpodDashboard) {
      content += '<h3>XPOD Dashboard (.team/XPOD_DASHBOARD.md)</h3>';
      content += codeBlock(xpodDashboard);
    }
    if (xpodEscalations) {
      content += '<h3>XPOD Escalations (.team/XPOD_ESCALATIONS.md)</h3>';
      content += codeBlock(xpodEscalations);
    }

    // XPOD events from database
    if (xpodDbEvents.length > 0) {
      content += `<h3>XPOD Events from Database (${xpodDbEvents.length})</h3>`;
      content += '<table class="compact">';
      content += tableRow(['Time', 'Type', 'Agent', 'Summary'], true);
      for (const e of xpodDbEvents.slice(0, 200)) {
        let summary = '';
        try {
          const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
          summary = p?.message || p?.description || '';
        } catch { /* */ }
        content += tableRow([
          fmtDate(e.timestamp), esc(e.type),
          esc(e.agent?.role) || '—', esc(summary.slice(0, 120)),
        ]);
      }
      content += '</table>';
    }

    if (!podContracts && !xpodEvents && !xpodDashboard && xpodDbEvents.length === 0) {
      content = emptyState('pod contracts or XPOD data');
    }
    sections.push(sec(sectionNum, 'Pod Contracts & Cross-Pod Communication', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 12: RISK REGISTER
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (riskRegister) {
      content = codeBlock(riskRegister);
    } else {
      content = emptyState('risk register');
    }
    sections.push(sec(sectionNum, 'Risk Register', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 13: KANBAN BOARD STATE
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (kanban) {
      content = codeBlock(kanban);
    } else {
      content = emptyState('kanban board data');
    }
    sections.push(sec(sectionNum, 'Kanban Board', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 14: CLAUDE CODE LOGS (Tool Calls)
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';

    content += `<div class="metric-grid" style="margin-bottom:12px">
      ${card('Tool Calls', String(claudeToolEvents.length), '#A855F7')}
      ${card('Agent Spawns', String(claudeAgentEvents.length), '#3B82F6')}
      ${card('User Prompts', String(claudePromptEvents.length), '#10B981')}
    </div>`;

    // User prompts
    if (claudePromptEvents.length > 0) {
      content += '<h3>User Prompts (Conversation Log)</h3>';
      content += '<table>';
      content += tableRow(['Time', 'Prompt / Content'], true);
      for (const e of claudePromptEvents.slice(0, 200)) {
        let promptText = '';
        try {
          const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
          promptText = p?.raw?.prompt || p?.raw?.content || p?.message || JSON.stringify(p?.raw || p).slice(0, 300);
        } catch { promptText = '—'; }
        content += tableRow([fmtDate(e.timestamp), `<code>${esc(promptText.slice(0, 300))}</code>`]);
      }
      content += '</table>';
    }

    // Agent spawns
    if (claudeAgentEvents.length > 0) {
      content += '<h3>Agent Spawn / Stop Events</h3>';
      content += '<table>';
      content += tableRow(['Time', 'Event', 'Agent', 'Description'], true);
      for (const e of claudeAgentEvents.slice(0, 200)) {
        let desc = '';
        try {
          const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
          desc = p?.raw?.description || p?.message || '';
        } catch { /* */ }
        content += tableRow([
          fmtDate(e.timestamp),
          esc(e.type),
          esc(e.agent?.role || e.agent?.name) || '—',
          esc(desc.slice(0, 150)),
        ]);
      }
      content += '</table>';
    }

    // Tool calls (full detail)
    if (claudeToolEvents.length > 0) {
      content += `<h3>Tool Calls (${claudeToolEvents.length} total — showing last 500)</h3>`;
      content += '<table class="compact">';
      content += tableRow(['Time', 'Tool', 'Agent', 'Input (summary)', 'Success'], true);
      for (const e of claudeToolEvents.slice(0, 500)) {
        let toolName = '', inputSummary = '', success = '—';
        try {
          const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
          toolName = (p?.tool_name as string) || '';
          const input = p?.tool_input;
          if (typeof input === 'string') {
            inputSummary = input.slice(0, 120);
          } else if (input) {
            inputSummary = JSON.stringify(input).slice(0, 120);
          }
          success = p?.success === true ? '✓' : p?.success === false ? '✗' : '—';
        } catch { /* */ }
        content += tableRow([
          fmtDate(e.timestamp),
          `<code>${esc(toolName)}</code>`,
          esc(e.agent?.role) || '—',
          `<code>${esc(inputSummary)}</code>`,
          success,
        ]);
      }
      content += '</table>';
      if (claudeToolEvents.length > 500) {
        content += `<p class="note">Showing 500 of ${claudeToolEvents.length} tool calls.</p>`;
      }
    }

    if (claudeToolEvents.length === 0 && claudeAgentEvents.length === 0 && claudePromptEvents.length === 0) {
      content += emptyState('Claude Code events — ensure hooks are configured');
    }

    sections.push(sec(sectionNum, 'Claude Code Logs (Full)', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 15: AGENT COMMUNICATION LOG
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (agentMessages.length > 0) {
      content += `<p><strong>${agentMessages.length}</strong> messages exchanged between agents.</p>`;

      // Communication matrix
      const matrix: Record<string, Record<string, number>> = {};
      for (const m of agentMessages) {
        if (!matrix[m.sender]) matrix[m.sender] = {};
        matrix[m.sender][m.receiver] = (matrix[m.sender][m.receiver] || 0) + 1;
      }
      const allParticipants = [...new Set([...Object.keys(matrix), ...agentMessages.map(m => m.receiver)])].sort();
      if (allParticipants.length > 0 && allParticipants.length <= 30) {
        content += '<h3>Communication Matrix (Sender → Receiver count)</h3>';
        content += '<table class="compact">';
        content += tableRow(['Sender \\ Receiver', ...allParticipants], true);
        for (const sender of allParticipants) {
          content += tableRow([
            `<strong>${esc(sender)}</strong>`,
            ...allParticipants.map(recv => {
              const count = matrix[sender]?.[recv] || 0;
              return count > 0 ? `<strong>${count}</strong>` : '·';
            }),
          ]);
        }
        content += '</table>';
      }

      // Full message log
      content += '<h3>Full Message Log</h3>';
      content += '<table>';
      content += tableRow(['Time', 'Sender', 'Receiver', 'Content', 'Context'], true);
      for (const m of agentMessages.slice(0, 500)) {
        content += tableRow([
          fmtDate(m.timestamp),
          `<strong>${esc(m.sender)}</strong>`,
          esc(m.receiver),
          esc(m.content?.slice(0, 200)) || '—',
          esc(m.context?.slice(0, 100)) || '—',
        ]);
      }
      content += '</table>';
      if (agentMessages.length > 500) {
        content += `<p class="note">Showing 500 of ${agentMessages.length} messages.</p>`;
      }
    } else {
      content = emptyState('agent messages');
    }
    sections.push(sec(sectionNum, 'Agent Communication Log', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 16: CI/CD PIPELINE RUNS
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (ciRuns.length > 0) {
      content += `<div class="metric-grid" style="margin-bottom:12px">
        ${card('Total Runs', String(ciRuns.length), '#3B82F6')}
        ${card('Passed', String(ciPassed), '#10B981')}
        ${card('Failed', String(ciFailed), '#EF4444')}
        ${card('Pass Rate', ciRuns.length > 0 ? pct(ciPassed, ciRuns.length) : '—', '#F59E0B')}
      </div>`;
      content += '<table>';
      content += tableRow(['Pipeline', 'Status', 'Duration', 'Triggered By', 'Steps', 'Date'], true);
      for (const r of ciRuns) {
        let steps: any[] = [];
        try { steps = JSON.parse(r.steps || '[]'); } catch { /* */ }
        const stepsStr = steps.map((s: any) => `${s.name || s}: ${s.status || '?'}`).join(', ');
        content += tableRow([
          esc(r.pipeline_id),
          statusBadge(r.status),
          r.duration ? `${(r.duration / 1000).toFixed(1)}s` : '—',
          esc(r.trigger_agent) || '—',
          esc(stepsStr.slice(0, 150)) || '—',
          fmtDate(r.created_at),
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('CI/CD runs');
    }
    sections.push(sec(sectionNum, 'CI/CD Pipeline Runs', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 17: UAT — USER ACCEPTANCE TESTING
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (uatSuites.length > 0 || uatCases.length > 0) {
      content += `<div class="metric-grid" style="margin-bottom:12px">
        ${card('Suites', String(uatSuites.length), '#3B82F6')}
        ${card('Total Cases', String(uatSummary.totalCases), '#6366F1')}
        ${card('Passed', String(uatSummary.passed), '#10B981')}
        ${card('Failed', String(uatSummary.failed), '#EF4444')}
        ${card('Blocked', String(uatSummary.blocked), '#F59E0B')}
        ${card('Coverage', `${(uatSummary.coverage ?? 0).toFixed(1)}%`, '#14B8A6')}
      </div>`;

      if (uatSuites.length > 0) {
        content += '<h3>Test Suites</h3><table>';
        content += tableRow(['Code', 'Name', 'Cases', 'Passed', 'Failed', 'Blocked', 'Coverage', 'Status'], true);
        for (const s of uatSuites) {
          content += tableRow([
            esc(s.code), esc(s.name), String(s.totalCases),
            String(s.passed), String(s.failed), String(s.blocked),
            `${(s.coverage ?? 0).toFixed(1)}%`,
            statusBadge(s.status),
          ]);
        }
        content += '</table>';
      }

      if (uatCases.length > 0) {
        content += `<h3>Test Cases (${uatCases.length})</h3><table>`;
        content += tableRow(['Title', 'Priority', 'Feature', 'Role', 'Device', 'Status', 'Duration', 'Defect', 'Round'], true);
        for (const c of uatCases.slice(0, 300)) {
          content += tableRow([
            esc(c.title), esc(c.priority), esc(c.feature) || '—',
            esc(c.userRole) || '—', esc(c.device) || '—',
            statusBadge(c.status),
            c.durationMs ? `${(c.durationMs / 1000).toFixed(1)}s` : '—',
            c.defectId ? `${esc(c.defectId)} (${esc(c.defectSeverity)})` : '—',
            c.round != null ? String(c.round) : '—',
          ]);
        }
        content += '</table>';
        if (uatCases.length > 300) {
          content += `<p class="note">Showing 300 of ${uatCases.length} cases.</p>`;
        }
      }
    } else {
      content = emptyState('UAT data');
    }
    sections.push(sec(sectionNum, 'UAT — User Acceptance Testing', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 18: CODE REVIEWS
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (reviewFiles.length > 0) {
      for (const r of reviewFiles) {
        content += collapsible(r.name, codeBlock(r.content));
      }
    } else {
      content = emptyState('code review reports');
    }
    sections.push(sec(sectionNum, 'Code Reviews', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 19: EVIDENCE & PROOF
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (evidence.length > 0) {
      const byType: Record<string, typeof evidence> = {};
      for (const e of evidence) {
        const t = e.type || 'other';
        if (!byType[t]) byType[t] = [];
        byType[t].push(e);
      }
      content += '<div class="metric-grid" style="margin-bottom:12px">';
      for (const [t, items] of Object.entries(byType).sort()) {
        content += card(t, String(items.length), '#14B8A6');
      }
      content += '</div>';

      content += '<table>';
      content += tableRow(['Type', 'Artifact', 'Linked Entity', 'Verified By', 'Date'], true);
      for (const e of evidence.slice(0, 300)) {
        content += tableRow([
          esc(e.type),
          esc(e.artifact_url?.slice(0, 100)) || '—',
          e.linked_entity_type ? `${esc(e.linked_entity_type)}:${esc(e.linked_entity_id)}` : '—',
          esc(e.verified_by) || '<span style="color:#EF4444">Unverified</span>',
          fmtDate(e.created_at),
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('evidence');
    }
    sections.push(sec(sectionNum, 'Evidence & Proof', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 20: BUILD ARTIFACTS
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (artifacts.length > 0) {
      content += '<table>';
      content += tableRow(['Name', 'Type', 'Size', 'Hash', 'Producer', 'Wave', 'Date'], true);
      for (const a of artifacts) {
        const size = a.size ? (a.size > 1024 * 1024 ? `${(a.size / 1024 / 1024).toFixed(1)} MB` : `${(a.size / 1024).toFixed(1)} KB`) : '—';
        content += tableRow([
          esc(a.name), esc(a.type), size,
          esc(a.hash?.slice(0, 12)) || '—',
          esc(a.producer_agent) || '—',
          a.wave != null ? String(a.wave) : '—',
          fmtDate(a.created_at),
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('artifacts');
    }
    sections.push(sec(sectionNum, 'Build Artifacts', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 21: RETROSPECTIVES
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (retroFiles.length > 0) {
      for (const r of retroFiles) {
        content += collapsible(r.name, codeBlock(r.content));
      }
    } else {
      content = emptyState('retrospective reports');
    }
    sections.push(sec(sectionNum, 'Retrospectives', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 22: FILE TREE (.team/ directory)
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (teamFiles.length > 0) {
      content += `<p><strong>${teamFiles.length}</strong> files in <code>.team/</code> directory.</p>`;
      content += '<table>';
      content += tableRow(['Path', 'Size', 'Last Modified'], true);
      for (const f of teamFiles) {
        const size = f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` :
                     f.size > 1024 ? `${(f.size / 1024).toFixed(1)} KB` : `${f.size} B`;
        content += tableRow([
          `<code>${esc(f.path)}</code>`,
          size,
          fmtDate(f.modified),
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('.team/ files');
    }
    sections.push(sec(sectionNum, 'File Tree (.team/ Directory)', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 23: EVENT ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';

    // By category
    content += '<h3>Events by Category</h3><table>';
    content += tableRow(['Category', 'Count', 'Percentage'], true);
    const sortedCats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    for (const [cat, count] of sortedCats) {
      content += tableRow([esc(cat), String(count), pct(count, totalEvents)]);
    }
    content += '</table>';

    // By severity
    const severityCounts: Record<string, number> = {};
    for (const e of events) {
      severityCounts[e.severity] = (severityCounts[e.severity] || 0) + 1;
    }
    content += '<h3>Events by Severity</h3><table>';
    content += tableRow(['Severity', 'Count', 'Percentage'], true);
    for (const [sev, count] of Object.entries(severityCounts).sort((a, b) => b[1] - a[1])) {
      content += tableRow([severityBadge(sev), String(count), pct(count, totalEvents)]);
    }
    content += '</table>';

    // By agent
    const agentCounts: Record<string, number> = {};
    for (const e of events) {
      const agent = e.agent?.role || 'system';
      agentCounts[agent] = (agentCounts[agent] || 0) + 1;
    }
    content += '<h3>Events by Agent</h3><table>';
    content += tableRow(['Agent', 'Events', 'Percentage'], true);
    for (const [agent, count] of Object.entries(agentCounts).sort((a, b) => b[1] - a[1]).slice(0, 50)) {
      content += tableRow([esc(agent), String(count), pct(count, totalEvents)]);
    }
    content += '</table>';

    // Top error agents
    if (errorAgents.length > 0) {
      content += '<h3>Agents with Most Errors</h3><table>';
      content += tableRow(['Agent', 'Error Count'], true);
      for (const ea of errorAgents.slice(0, 30)) {
        content += tableRow([esc(ea.agent_role), String(ea.count)]);
      }
      content += '</table>';
    }

    // Timeline
    if (timeline.length > 0) {
      content += '<h3>Event Timeline (15-min buckets)</h3><table>';
      content += tableRow(['Time Bucket', 'Events', 'Graph'], true);
      const maxCount = Math.max(...timeline.map(t => t.count));
      for (const t of timeline.slice(0, 100)) {
        const barWidth = maxCount > 0 ? Math.ceil((t.count / maxCount) * 40) : 0;
        const bar = '█'.repeat(barWidth);
        content += tableRow([
          fmtDate(t.bucket),
          String(t.count),
          `<span style="color:#3B82F6;font-family:monospace">${bar}</span>`,
        ]);
      }
      content += '</table>';
    }

    sections.push(sec(sectionNum, 'Event Analytics', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 24: FULL EVENT LOG
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (events.length > 0) {
      content += `<p>Total events: <strong>${totalEvents}</strong>. Showing last ${Math.min(events.length, 1000)}.</p>`;
      content += '<table class="compact">';
      content += tableRow(['Time', 'Category', 'Type', 'Severity', 'Agent', 'Summary'], true);
      for (const e of events.slice(0, 1000)) {
        let summary = '';
        try {
          const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
          summary = p?.message || p?.description || p?.title || p?.tool_name || JSON.stringify(p).slice(0, 100);
        } catch { summary = ''; }
        content += tableRow([
          fmtDate(e.timestamp),
          esc(e.category),
          esc(e.type),
          severityBadge(e.severity),
          esc(e.agent?.role) || '—',
          esc(summary?.slice(0, 120)),
        ]);
      }
      content += '</table>';
      if (totalEvents > 1000) {
        content += `<p class="note">Showing 1000 of ${totalEvents} events. Export JSON for full dataset.</p>`;
      }
    } else {
      content = emptyState('events');
    }
    sections.push(sec(sectionNum, 'Full Event Log', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 25: SESSIONS
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    let content = '';
    if (sessions.length > 0) {
      content += '<table>';
      content += tableRow(['Session ID', 'Name', 'Created', 'Last Active', 'Config'], true);
      for (const s of sessions) {
        let configSummary = '—';
        try {
          const config = typeof s.config === 'string' ? JSON.parse(s.config) : s.config;
          if (config) {
            configSummary = `team: ${config.teamName || '?'}, agents: ${config.teamSize || '?'}`;
          }
        } catch { /* */ }
        content += tableRow([
          esc(s.id?.slice(0, 12)), esc(s.name),
          fmtDate(s.created_at), fmtDate(s.last_active),
          esc(configSummary),
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('session data');
    }
    sections.push(sec(sectionNum, 'Sessions', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 26: DATABASE HEALTH
  // ═══════════════════════════════════════════════════════════════════════════
  sectionNum++;
  {
    const content = `<table>
      ${tableRow(['Metric', 'Value'], true)}
      ${tableRow(['Tables', String(dbHealth.tables)])}
      ${tableRow(['Total Rows', String(dbHealth.totalRows)])}
      ${tableRow(['Estimated DB Size', `${(dbHealth.dbSizeEstimate / 1024).toFixed(1)} KB`])}
      ${tableRow(['Report Generated', fmtDate(now)])}
      ${tableRow(['Events Captured', String(totalEvents)])}
      ${tableRow(['Agents Registered', String(agents.length)])}
      ${tableRow(['Files in .team/', String(teamFiles.length)])}
    </table>`;
    sections.push(sec(sectionNum, 'Database Health', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Build Table of Contents dynamically
  // ═══════════════════════════════════════════════════════════════════════════
  const tocEntries = [
    'Executive Summary',
    'Project Strategy (Full Document)',
    'Discovery Interview (Complete)',
    'Project Charter',
    'Alternative Plans & Judge Verdict',
    'Budget & Cost Analysis',
    'Wave Execution & Milestones',
    'Agent Roster & Performance',
    'Quality Gates',
    'Decisions Log (Complete)',
    'Pod Contracts & Cross-Pod Communication',
    'Risk Register',
    'Kanban Board',
    'Claude Code Logs (Full)',
    'Agent Communication Log',
    'CI/CD Pipeline Runs',
    'UAT — User Acceptance Testing',
    'Code Reviews',
    'Evidence & Proof',
    'Build Artifacts',
    'Retrospectives',
    'File Tree (.team/ Directory)',
    'Event Analytics',
    'Full Event Log',
    'Sessions',
    'Database Health',
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSEMBLE HTML
  // ═══════════════════════════════════════════════════════════════════════════
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mission Control — Full Enterprise Report</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 12mm;
    }
    @media print {
      body { background: #fff !important; color: #1a1a2e !important; }
      .section { page-break-inside: avoid; }
      .no-print { display: none !important; }
      table { font-size: 8px; }
      .code-block { font-size: 8px; max-height: none; }
      details { open: true; }
      details[open] summary { display: none; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #0B0F1A;
      color: #E2E8F0;
      line-height: 1.5;
      padding: 0;
    }
    .report-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px;
    }
    .report-header {
      background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
      text-align: center;
    }
    .report-header h1 {
      font-size: 28px;
      color: #F8FAFC;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .report-header .subtitle {
      color: #94A3B8;
      font-size: 14px;
    }
    .report-header .generated {
      color: #64748B;
      font-size: 12px;
      margin-top: 8px;
    }
    .toc {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 20px 28px;
      margin-bottom: 24px;
      columns: 2;
      column-gap: 32px;
    }
    .toc h2 {
      color: #94A3B8;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
      column-span: all;
    }
    .toc a {
      display: block;
      color: #93C5FD;
      text-decoration: none;
      font-size: 12px;
      padding: 2px 0;
      break-inside: avoid;
    }
    .toc a:hover { color: #BFDBFE; text-decoration: underline; }
    .section {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 16px;
    }
    h2 {
      font-size: 18px;
      color: #F1F5F9;
      border-bottom: 2px solid #334155;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .section-num {
      display: inline-block;
      background: #3B82F6;
      color: #fff;
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      margin-right: 8px;
    }
    h3 {
      font-size: 14px;
      color: #94A3B8;
      margin: 16px 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 11px;
    }
    table.compact { font-size: 10px; }
    th {
      background: #0F172A;
      color: #94A3B8;
      font-weight: 600;
      text-align: left;
      padding: 6px 8px;
      border-bottom: 2px solid #334155;
      white-space: nowrap;
    }
    td {
      padding: 5px 8px;
      border-bottom: 1px solid #1E293B;
      color: #CBD5E1;
      vertical-align: top;
    }
    tr:nth-child(even) td { background: rgba(15, 23, 42, 0.3); }
    tr:hover td { background: rgba(59, 130, 246, 0.08); }
    p { margin-bottom: 8px; font-size: 13px; }
    .empty { color: #64748B; font-style: italic; }
    .note { color: #64748B; font-size: 11px; font-style: italic; }
    strong { color: #F1F5F9; }
    code {
      background: #0F172A;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 11px;
      color: #93C5FD;
      word-break: break-all;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 10px;
      margin-bottom: 16px;
    }
    .metric-card {
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .metric-value {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
    }
    .metric-label {
      font-size: 10px;
      color: #64748B;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .budget-bar-container {
      background: #0F172A;
      border-radius: 4px;
      height: 16px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .budget-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s;
    }
    .qa-block {
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 8px;
    }
    .question { color: #93C5FD; font-weight: 600; font-size: 13px; margin-bottom: 4px; }
    .answer { color: #CBD5E1; font-size: 13px; }
    .implications { color: #64748B; font-size: 11px; margin-top: 4px; }
    .code-block {
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 16px;
      font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #CBD5E1;
      overflow-x: auto;
      max-height: 600px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    .collapsible-title {
      cursor: pointer;
      color: #93C5FD;
      font-weight: 600;
      font-size: 13px;
      padding: 8px 12px;
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 6px;
      margin-bottom: 4px;
      user-select: none;
    }
    .collapsible-title:hover { background: #1E293B; }
    .collapsible-body { margin-bottom: 12px; }
    details { margin-bottom: 8px; }
    .markdown-content { margin-bottom: 12px; }
    .print-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #3B82F6;
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(59,130,246,0.4);
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .print-btn:hover { background: #2563EB; }
    .footer {
      text-align: center;
      color: #475569;
      font-size: 11px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #334155;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1>Mission Control — Full Enterprise Report</h1>
      <div class="subtitle">Complete Execution Audit — Strategy, Plans, Claude Logs, Decisions, Pod Communications, Files, Evidence & Everything</div>
      <div class="generated">Generated: ${fmtDate(now)} | Agents: ${agents.length} | Events: ${totalEvents} | Cost: $${totalCost.toFixed(2)} | Files: ${teamFiles.length} | Decisions: ${decisions.length}</div>
    </div>

    <div class="toc">
      <h2>Table of Contents (${tocEntries.length} Sections)</h2>
      ${tocEntries.map((title, i) => `<a href="#s${i + 1}">${i + 1}. ${title}</a>`).join('\n      ')}
    </div>

    ${sections.map((s, i) => s.replace('<div class="section">', `<div class="section" id="s${i + 1}">`)).join('\n')}

    <div class="footer">
      Amenthyx AI Teams — Mission Control Full Enterprise Report<br/>
      81 Agents | 12 Pods | ${tocEntries.length} Sections | Evidence-Driven Execution<br/>
      Strategy + Plans + Claude Logs + Decisions + Pod Comms + Files + Everything<br/>
      ${fmtDate(now)}
    </div>
  </div>

  <button class="print-btn no-print" onclick="window.print()">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    Save as PDF
  </button>
</body>
</html>`;
}
