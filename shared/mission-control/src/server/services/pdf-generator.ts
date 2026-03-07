import { getAgents, getBudget, getWaves, getEvents } from '../db/database';

export function generateHTMLReport(sections: string[]): string {
  const agents = sections.includes('agents') ? getAgents() : [];
  const budget = sections.includes('budget') ? getBudget() : null;
  const waves = sections.includes('waves') ? getWaves() : [];
  const events = sections.includes('events') ? getEvents({ limit: 100 }).events : [];

  let body = '';

  body += '<h1>Mission Control Report</h1>';
  body += `<p>Generated: ${new Date().toISOString()}</p>`;

  if (agents.length > 0) {
    body += '<h2>Agents</h2><table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">';
    body += '<tr><th>Role</th><th>Name</th><th>Status</th><th>Tokens</th><th>Cost</th></tr>';
    for (const a of agents) {
      body += `<tr><td>${a.role}</td><td>${a.name}</td><td>${a.status}</td><td>${a.tokensUsed ?? 0}</td><td>$${(a.costUsd ?? 0).toFixed(2)}</td></tr>`;
    }
    body += '</table>';
  }

  if (budget) {
    body += '<h2>Budget</h2>';
    body += `<p>Total: $${budget.total} | Spent: $${budget.spent} | Remaining: $${(budget.total - budget.spent).toFixed(2)}</p>`;
  }

  if (waves.length > 0) {
    body += '<h2>Waves</h2><table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">';
    body += '<tr><th>#</th><th>Name</th><th>Status</th><th>Gate</th></tr>';
    for (const w of waves) {
      body += `<tr><td>${w.number}</td><td>${w.name}</td><td>${w.status}</td><td>${w.gate}</td></tr>`;
    }
    body += '</table>';
  }

  if (events.length > 0) {
    body += `<h2>Recent Events (${events.length})</h2><table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">`;
    body += '<tr><th>Time</th><th>Category</th><th>Type</th><th>Severity</th><th>Agent</th></tr>';
    for (const e of events.slice(0, 50)) {
      body += `<tr><td>${e.timestamp}</td><td>${e.category}</td><td>${e.type}</td><td>${e.severity}</td><td>${e.agent?.role ?? '-'}</td></tr>`;
    }
    body += '</table>';
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mission Control Report</title>
<style>body{font-family:Arial,sans-serif;max-width:1000px;margin:0 auto;padding:20px;color:#333}
h1{color:#1a1a2e}h2{color:#16213e;border-bottom:2px solid #e2e8f0;padding-bottom:8px}
table{font-size:13px}th{background:#f1f5f9;text-align:left}td,th{border-color:#e2e8f0}</style>
</head><body>${body}</body></html>`;
}
