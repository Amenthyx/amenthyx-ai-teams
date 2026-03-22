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

// ---------------------------------------------------------------------------
// Enterprise PDF Generator — Mission Control
// Generates an extremely detailed, print-ready HTML document covering every
// aspect of the team execution. The browser renders and prints to PDF.
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

function section(num: number, title: string, content: string): string {
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

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateEnterprisePDF(): string {
  const now = new Date().toISOString();
  const agents = getAgents();
  const budget = getBudget();
  const waves = getWaves();
  const { events, total: totalEvents } = getEvents({ limit: 5000 });
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
  const timeline = getEventTimeline(15, 200);
  const errorAgents = getErrorEvents(50);
  const dbHealth = getDatabaseHealth();

  // Derived metrics
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const doneAgents = agents.filter(a => a.status === 'done').length;
  const blockedAgents = agents.filter(a => a.status === 'blocked').length;
  const totalTokens = agents.reduce((s, a) => s + (a.tokensUsed ?? 0), 0);
  const totalCost = agents.reduce((s, a) => s + (a.costUsd ?? 0), 0);
  const activeWaves = waves.filter(w => w.status === 'active').length;
  const doneWaves = waves.filter(w => w.status === 'done').length;
  const passedGates = gates.filter(g => g.status === 'pass' || g.status === 'approved').length;
  const failedGates = gates.filter(g => g.status === 'fail' || g.status === 'rejected').length;
  const pendingGates = gates.filter(g => g.status === 'pending').length;
  const criticalEvents = events.filter(e => e.severity === 'critical').length;
  const errorEvents = events.filter(e => e.severity === 'error').length;
  const ciPassed = ciRuns.filter(r => r.status === 'passed').length;
  const ciFailed = ciRuns.filter(r => r.status === 'failed').length;

  const sections: string[] = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: EXECUTIVE SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════
  sections.push(section(1, 'Executive Summary', `
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
    </div>
  `));

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: BUDGET & COST
  // ═══════════════════════════════════════════════════════════════════════════
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
    } else {
      content = emptyState('budget data');
    }
    sections.push(section(2, 'Budget & Cost Analysis', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: WAVE EXECUTION
  // ═══════════════════════════════════════════════════════════════════════════
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
    } else {
      content = emptyState('wave data');
    }
    sections.push(section(3, 'Wave Execution Progress', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: AGENT ROSTER & PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    let content = '';
    if (agents.length > 0) {
      // Group by category
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
    sections.push(section(4, 'Agent Roster & Performance', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: QUALITY GATES
  // ═══════════════════════════════════════════════════════════════════════════
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
          esc(g.message?.slice(0, 80)) || '—',
          fmtDate(g.created_at),
          fmtDate(g.resolved_at) || '—',
          esc(g.decision) || '—',
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('gate data');
    }
    sections.push(section(5, 'Quality Gates', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: DISCOVERY INTERVIEW
  // ═══════════════════════════════════════════════════════════════════════════
  {
    let content = '';
    if (interviews.length > 0) {
      // Group by category
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
    } else {
      content = emptyState('interview data');
    }
    sections.push(section(6, 'Discovery Interview', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7: DECISIONS LOG
  // ═══════════════════════════════════════════════════════════════════════════
  {
    let content = '';
    if (decisions.length > 0) {
      content += '<table>';
      content += tableRow(['#', 'Title', 'Decision', 'Rationale', 'Decided By', 'Status', 'Date'], true);
      for (let i = 0; i < decisions.length; i++) {
        const d = decisions[i];
        content += tableRow([
          String(i + 1),
          `<strong>${esc(d.title)}</strong>`,
          esc(d.decision_text?.slice(0, 120)) || '—',
          esc(d.rationale?.slice(0, 120)) || '—',
          esc(d.decided_by) || '—',
          statusBadge(d.status),
          fmtDate(d.created_at),
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('decisions');
    }
    sections.push(section(7, 'Decisions Log', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 8: CI/CD PIPELINE RUNS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    let content = '';
    if (ciRuns.length > 0) {
      content += '<table>';
      content += tableRow(['Pipeline', 'Status', 'Duration', 'Triggered By', 'Steps', 'Date'], true);
      for (const r of ciRuns) {
        let steps: any[] = [];
        try { steps = JSON.parse(r.steps || '[]'); } catch {}
        const stepsStr = steps.map((s: any) => `${s.name || s}: ${s.status || '?'}`).join(', ');
        content += tableRow([
          esc(r.pipeline_id),
          statusBadge(r.status),
          r.duration ? `${(r.duration / 1000).toFixed(1)}s` : '—',
          esc(r.trigger_agent) || '—',
          esc(stepsStr.slice(0, 100)) || '—',
          fmtDate(r.created_at),
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('CI/CD runs');
    }
    sections.push(section(8, 'CI/CD Pipeline Runs', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 9: UAT — USER ACCEPTANCE TESTING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    let content = '';
    if (uatSuites.length > 0 || uatCases.length > 0) {
      // Summary metrics
      content += `<div class="metric-grid" style="margin-bottom:12px">
        ${card('Suites', String(uatSuites.length), '#3B82F6')}
        ${card('Total Cases', String(uatSummary.totalCases), '#6366F1')}
        ${card('Passed', String(uatSummary.passed), '#10B981')}
        ${card('Failed', String(uatSummary.failed), '#EF4444')}
        ${card('Coverage', `${(uatSummary.coverage ?? 0).toFixed(1)}%`, '#F59E0B')}
      </div>`;

      // Suites table
      if (uatSuites.length > 0) {
        content += '<h3>Test Suites</h3><table>';
        content += tableRow(['Code', 'Name', 'Cases', 'Passed', 'Failed', 'Coverage', 'Status'], true);
        for (const s of uatSuites) {
          content += tableRow([
            esc(s.code), esc(s.name), String(s.totalCases),
            String(s.passed), String(s.failed),
            `${(s.coverage ?? 0).toFixed(1)}%`,
            statusBadge(s.status),
          ]);
        }
        content += '</table>';
      }

      // Individual cases (up to 200)
      if (uatCases.length > 0) {
        content += `<h3>Test Cases (${uatCases.length})</h3><table>`;
        content += tableRow(['Title', 'Priority', 'Feature', 'Role', 'Status', 'Duration', 'Defect'], true);
        for (const c of uatCases.slice(0, 200)) {
          content += tableRow([
            esc(c.title), esc(c.priority), esc(c.feature) || '—',
            esc(c.userRole) || '—', statusBadge(c.status),
            c.durationMs ? `${(c.durationMs / 1000).toFixed(1)}s` : '—',
            c.defectId ? `${esc(c.defectId)} (${esc(c.defectSeverity)})` : '—',
          ]);
        }
        content += '</table>';
        if (uatCases.length > 200) {
          content += `<p class="note">Showing 200 of ${uatCases.length} cases.</p>`;
        }
      }
    } else {
      content = emptyState('UAT data');
    }
    sections.push(section(9, 'UAT — User Acceptance Testing', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 10: EVIDENCE & PROOF
  // ═══════════════════════════════════════════════════════════════════════════
  {
    let content = '';
    if (evidence.length > 0) {
      // Group by type
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
      for (const e of evidence.slice(0, 200)) {
        content += tableRow([
          esc(e.type),
          esc(e.artifact_url?.slice(0, 80)) || '—',
          e.linked_entity_type ? `${esc(e.linked_entity_type)}:${esc(e.linked_entity_id)}` : '—',
          esc(e.verified_by) || '<span style="color:#EF4444">Unverified</span>',
          fmtDate(e.created_at),
        ]);
      }
      content += '</table>';
      if (evidence.length > 200) {
        content += `<p class="note">Showing 200 of ${evidence.length} evidence items.</p>`;
      }
    } else {
      content = emptyState('evidence');
    }
    sections.push(section(10, 'Evidence & Proof', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 11: BUILD ARTIFACTS
  // ═══════════════════════════════════════════════════════════════════════════
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
    sections.push(section(11, 'Build Artifacts', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 12: AGENT COMMUNICATION LOG
  // ═══════════════════════════════════════════════════════════════════════════
  {
    let content = '';
    if (agentMessages.length > 0) {
      content += `<p><strong>${agentMessages.length}</strong> messages exchanged between agents.</p>`;
      content += '<table>';
      content += tableRow(['Time', 'Sender', 'Receiver', 'Content', 'Context'], true);
      for (const m of agentMessages.slice(0, 200)) {
        content += tableRow([
          fmtDate(m.timestamp),
          `<strong>${esc(m.sender)}</strong>`,
          esc(m.receiver),
          esc(m.content?.slice(0, 120)) || '—',
          esc(m.context?.slice(0, 60)) || '—',
        ]);
      }
      content += '</table>';
      if (agentMessages.length > 200) {
        content += `<p class="note">Showing 200 of ${agentMessages.length} messages.</p>`;
      }
    } else {
      content = emptyState('agent messages');
    }
    sections.push(section(12, 'Agent Communication Log', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 13: EVENT ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════
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

    // Top error agents
    if (errorAgents.length > 0) {
      content += '<h3>Agents with Most Errors</h3><table>';
      content += tableRow(['Agent', 'Error Count'], true);
      for (const ea of errorAgents.slice(0, 20)) {
        content += tableRow([esc(ea.agent_role), String(ea.count)]);
      }
      content += '</table>';
    }

    // Timeline
    if (timeline.length > 0) {
      content += '<h3>Event Timeline (15-min buckets)</h3><table>';
      content += tableRow(['Time Bucket', 'Events'], true);
      for (const t of timeline.slice(0, 50)) {
        const bar = '█'.repeat(Math.min(Math.ceil(t.count / 2), 40));
        content += tableRow([fmtDate(t.bucket), `${t.count} <span style="color:#3B82F6;font-family:monospace">${bar}</span>`]);
      }
      content += '</table>';
    }

    sections.push(section(13, 'Event Analytics', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 14: FULL EVENT LOG
  // ═══════════════════════════════════════════════════════════════════════════
  {
    let content = '';
    if (events.length > 0) {
      content += `<p>Total events: <strong>${totalEvents}</strong>. Showing last ${Math.min(events.length, 500)}.</p>`;
      content += '<table class="compact">';
      content += tableRow(['Time', 'Category', 'Type', 'Severity', 'Agent', 'Summary'], true);
      for (const e of events.slice(0, 500)) {
        let summary = '';
        try {
          const p = typeof e.payload === 'string' ? JSON.parse(e.payload) : e.payload;
          summary = p?.message || p?.description || p?.title || JSON.stringify(p).slice(0, 80);
        } catch { summary = ''; }
        content += tableRow([
          fmtDate(e.timestamp),
          esc(e.category),
          esc(e.type),
          severityBadge(e.severity),
          esc(e.agent?.role) || '—',
          esc(summary?.slice(0, 100)),
        ]);
      }
      content += '</table>';
      if (events.length > 500) {
        content += `<p class="note">Showing 500 of ${totalEvents} events. Export JSON for full dataset.</p>`;
      }
    } else {
      content = emptyState('events');
    }
    sections.push(section(14, 'Full Event Log', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 15: SESSIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    let content = '';
    if (sessions.length > 0) {
      content += '<table>';
      content += tableRow(['Session ID', 'Name', 'Created', 'Last Active'], true);
      for (const s of sessions) {
        content += tableRow([
          esc(s.id?.slice(0, 12)), esc(s.name),
          fmtDate(s.created_at), fmtDate(s.last_active),
        ]);
      }
      content += '</table>';
    } else {
      content = emptyState('session data');
    }
    sections.push(section(15, 'Sessions', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 16: DATABASE HEALTH
  // ═══════════════════════════════════════════════════════════════════════════
  {
    const content = `<table>
      ${tableRow(['Metric', 'Value'], true)}
      ${tableRow(['Tables', String(dbHealth.tables)])}
      ${tableRow(['Total Rows', String(dbHealth.totalRows)])}
      ${tableRow(['Estimated DB Size', `${(dbHealth.dbSizeEstimate / 1024).toFixed(1)} KB`])}
      ${tableRow(['Report Generated', fmtDate(now)])}
    </table>`;
    sections.push(section(16, 'Database Health', content));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSEMBLE HTML
  // ═══════════════════════════════════════════════════════════════════════════
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mission Control — Enterprise Report</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 15mm;
    }
    @media print {
      body { background: #fff !important; color: #1a1a2e !important; }
      .section { page-break-inside: avoid; }
      .no-print { display: none !important; }
      table { font-size: 9px; }
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
      max-width: 1200px;
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
      font-size: 13px;
      padding: 3px 0;
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
      font-size: 12px;
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
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
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
      font-size: 22px;
      font-weight: 700;
      line-height: 1.2;
    }
    .metric-label {
      font-size: 11px;
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
      <h1>Mission Control — Enterprise Report</h1>
      <div class="subtitle">Complete Execution Audit — All Agents, Pods, Events, Gates, Evidence & Decisions</div>
      <div class="generated">Generated: ${fmtDate(now)} | Agents: ${agents.length} | Events: ${totalEvents} | Cost: $${totalCost.toFixed(2)}</div>
    </div>

    <div class="toc">
      <h2>Table of Contents</h2>
      <a href="#s1">1. Executive Summary</a>
      <a href="#s2">2. Budget & Cost Analysis</a>
      <a href="#s3">3. Wave Execution Progress</a>
      <a href="#s4">4. Agent Roster & Performance</a>
      <a href="#s5">5. Quality Gates</a>
      <a href="#s6">6. Discovery Interview</a>
      <a href="#s7">7. Decisions Log</a>
      <a href="#s8">8. CI/CD Pipeline Runs</a>
      <a href="#s9">9. UAT — User Acceptance Testing</a>
      <a href="#s10">10. Evidence & Proof</a>
      <a href="#s11">11. Build Artifacts</a>
      <a href="#s12">12. Agent Communication Log</a>
      <a href="#s13">13. Event Analytics</a>
      <a href="#s14">14. Full Event Log</a>
      <a href="#s15">15. Sessions</a>
      <a href="#s16">16. Database Health</a>
    </div>

    ${sections.map((s, i) => s.replace('<div class="section">', `<div class="section" id="s${i + 1}">`)).join('\n')}

    <div class="footer">
      Amenthyx AI Teams — Mission Control Enterprise Report<br/>
      81 Agents | 12 Pods | Evidence-Driven Execution<br/>
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
