#!/usr/bin/env npx tsx
/**
 * Amenthyx Mission Control -- Config Generator (TypeScript)
 *
 * Reads strategy file, TEAM.md, and COST_ESTIMATION.md to programmatically
 * generate a mission-control.config.json.
 *
 * Usage:
 *   npx tsx scaffold/generate-config.ts <project_dir> <team_name> [strategy_path] [ai_tool]
 *
 * Cross-platform: Works on Linux, macOS, and Windows.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AgentEntry {
  role: string;
  name: string;
  color: string;
  category: 'management' | 'engineering' | 'quality' | 'support';
}

interface MissionControlConfig {
  sessionId: string;
  projectName: string;
  teamName: string;
  strategyPath: string;
  projectDir: string;
  teamDir: string;
  agents: AgentEntry[];
  budget: {
    total: number;
    currency: string;
    alertThreshold: number;
  };
  ports: {
    backend: number;
    frontend: number;
  };
  source: {
    tool: string;
    adapter: string;
  };
  fileWatcher: {
    watchPaths: string[];
    debounceMs: number;
  };
}

// ---------------------------------------------------------------------------
// Default agent roster (fallback when TEAM.md parsing yields nothing)
// ---------------------------------------------------------------------------

const DEFAULT_AGENTS: AgentEntry[] = [
  { role: 'TL', name: 'Team Leader', color: '#F59E0B', category: 'management' },
  { role: 'PM', name: 'Project Manager', color: '#64748B', category: 'management' },
  { role: 'BE', name: 'Backend Engineer', color: '#3B82F6', category: 'engineering' },
  { role: 'FE', name: 'Frontend Engineer', color: '#22C55E', category: 'engineering' },
  { role: 'MOB', name: 'Mobile Engineer', color: '#06B6D4', category: 'engineering' },
  { role: 'DEVOPS', name: 'DevOps Engineer', color: '#F97316', category: 'engineering' },
  { role: 'INFRA', name: 'Infrastructure Engineer', color: '#F59E0B', category: 'engineering' },
  { role: 'QA', name: 'QA Engineer', color: '#A855F7', category: 'quality' },
  { role: 'RM', name: 'Release Manager', color: '#14B8A6', category: 'management' },
  { role: 'MKT', name: 'Marketing Strategist', color: '#EC4899', category: 'support' },
  { role: 'LEGAL', name: 'Legal/Compliance', color: '#6B7280', category: 'support' },
];

// Color palette for dynamically discovered roles
const ROLE_COLORS: Record<string, string> = {
  TL: '#F59E0B', PM: '#64748B', BE: '#3B82F6', FE: '#22C55E',
  MOB: '#06B6D4', DEVOPS: '#F97316', INFRA: '#F59E0B', QA: '#A855F7',
  RM: '#14B8A6', MKT: '#EC4899', LEGAL: '#6B7280', SEC: '#EF4444',
  DATA: '#8B5CF6', ML: '#6366F1', DBA: '#10B981', UX: '#F472B6',
  ARCH: '#0EA5E9', DOCS: '#78716C', SRE: '#DC2626', PERF: '#D97706',
};

const FALLBACK_COLORS = [
  '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6',
  '#EF4444', '#06B6D4', '#22C55E', '#F59E0B', '#3B82F6',
];

// ---------------------------------------------------------------------------
// File reading utilities
// ---------------------------------------------------------------------------

function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function findFile(dir: string, candidates: string[]): string | null {
  for (const candidate of candidates) {
    const full = path.join(dir, candidate);
    if (fs.existsSync(full)) {
      return full;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Parsing: Extract agent roster from TEAM.md
// ---------------------------------------------------------------------------

function parseAgentsFromTeamFile(content: string): AgentEntry[] {
  const agents: AgentEntry[] = [];
  const seen = new Set<string>();

  // Pattern 1: Table rows like "| BE | Backend Engineer | ..."
  const tableRowPattern = /\|\s*([A-Z]{2,6})\s*\|\s*([^|]+)\s*\|/g;
  let match: RegExpExecArray | null;

  while ((match = tableRowPattern.exec(content)) !== null) {
    const role = match[1].trim();
    const name = match[2].trim();
    if (role && name && !seen.has(role) && role !== 'ROLE' && name !== 'Name') {
      seen.add(role);
      agents.push({
        role,
        name,
        color: ROLE_COLORS[role] || FALLBACK_COLORS[agents.length % FALLBACK_COLORS.length],
        category: inferCategory(role),
      });
    }
  }

  // Pattern 2: Markdown headers like "### 1. Team Leader (TL)"
  const headerPattern = /###?\s*\d*\.?\s*(.+?)\s*\(([A-Z]{2,6})\)/g;
  while ((match = headerPattern.exec(content)) !== null) {
    const name = match[1].trim();
    const role = match[2].trim();
    if (role && name && !seen.has(role)) {
      seen.add(role);
      agents.push({
        role,
        name,
        color: ROLE_COLORS[role] || FALLBACK_COLORS[agents.length % FALLBACK_COLORS.length],
        category: inferCategory(role),
      });
    }
  }

  // Pattern 3: Lines like "- **TL (Team Leader)**"
  const bulletPattern = /[-*]\s*\*?\*?\s*([A-Z]{2,6})\s*\(?([^)*]+)\)?\s*\*?\*?/g;
  while ((match = bulletPattern.exec(content)) !== null) {
    const role = match[1].trim();
    const name = match[2].trim();
    if (role && name && !seen.has(role) && name.length > 2) {
      seen.add(role);
      agents.push({
        role,
        name,
        color: ROLE_COLORS[role] || FALLBACK_COLORS[agents.length % FALLBACK_COLORS.length],
        category: inferCategory(role),
      });
    }
  }

  return agents;
}

function inferCategory(role: string): AgentEntry['category'] {
  const managementRoles = new Set(['TL', 'PM', 'RM', 'PO']);
  const qualityRoles = new Set(['QA', 'SDET', 'PERF', 'SEC']);
  const supportRoles = new Set(['MKT', 'LEGAL', 'DOCS', 'SUPPORT', 'HR']);

  if (managementRoles.has(role)) return 'management';
  if (qualityRoles.has(role)) return 'quality';
  if (supportRoles.has(role)) return 'support';
  return 'engineering';
}

// ---------------------------------------------------------------------------
// Parsing: Extract budget from COST_ESTIMATION.md
// ---------------------------------------------------------------------------

interface BudgetParsed {
  total: number;
  currency: string;
  alertThreshold: number;
}

function parseBudgetFromCostFile(content: string): BudgetParsed {
  const defaults: BudgetParsed = { total: 30, currency: 'USD', alertThreshold: 0.8 };

  // Look for total budget patterns
  // Pattern: "Total Budget: $30" or "Total: $45.00" or "Budget: USD 30"
  const totalPatterns = [
    /total\s*(?:budget)?[:\s]*\$\s*([\d,.]+)/i,
    /total\s*(?:budget)?[:\s]*([\d,.]+)\s*USD/i,
    /budget[:\s]*\$\s*([\d,.]+)/i,
    /\|\s*total\s*\|\s*\$?([\d,.]+)\s*\|/i,
    /grand\s*total[:\s]*\$?\s*([\d,.]+)/i,
  ];

  for (const pattern of totalPatterns) {
    const match = pattern.exec(content);
    if (match) {
      const parsed = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(parsed) && parsed > 0) {
        defaults.total = parsed;
        break;
      }
    }
  }

  // Look for alert threshold
  const thresholdPattern = /alert\s*(?:threshold|at)?[:\s]*([\d.]+)%?/i;
  const thresholdMatch = thresholdPattern.exec(content);
  if (thresholdMatch) {
    let val = parseFloat(thresholdMatch[1]);
    if (val > 1) val = val / 100; // convert percentage to decimal
    if (val > 0 && val <= 1) {
      defaults.alertThreshold = val;
    }
  }

  // Check currency
  if (/EUR/i.test(content)) defaults.currency = 'EUR';
  else if (/GBP/i.test(content)) defaults.currency = 'GBP';

  return defaults;
}

// ---------------------------------------------------------------------------
// AI Tool Detection
// ---------------------------------------------------------------------------

function detectAiTool(projectDir: string): string {
  if (fs.existsSync(path.join(projectDir, '.claude')) || fs.existsSync(path.join(projectDir, 'CLAUDE.md'))) {
    return 'claude-code';
  }
  if (fs.existsSync(path.join(projectDir, '.cursor'))) {
    return 'cursor';
  }
  if (fs.existsSync(path.join(projectDir, '.windsurf'))) {
    return 'windsurf';
  }
  if (fs.existsSync(path.join(projectDir, '.aider')) || fs.existsSync(path.join(projectDir, '.aider.conf.yml'))) {
    return 'aider';
  }
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Main: Generate Config
// ---------------------------------------------------------------------------

function generateConfig(
  projectDir: string,
  teamName: string,
  strategyPath?: string,
  aiTool?: string
): MissionControlConfig {
  const resolvedProjectDir = path.resolve(projectDir);

  // --- Detect AI tool ---
  const tool = aiTool && aiTool !== 'auto' ? aiTool : detectAiTool(resolvedProjectDir);
  const adapter = tool === 'claude-code' ? 'hooks' : 'file-watcher';

  // --- Parse agents from TEAM.md ---
  let agents: AgentEntry[] = [];
  const teamFile = findFile(resolvedProjectDir, [
    '.team/TEAM.md',
    'TEAM.md',
    '.team/team.md',
    'docs/TEAM.md',
  ]);

  if (teamFile) {
    const teamContent = readFileSafe(teamFile);
    if (teamContent) {
      agents = parseAgentsFromTeamFile(teamContent);
      if (agents.length > 0) {
        log('info', `Parsed ${agents.length} agents from ${teamFile}`);
      }
    }
  }

  if (agents.length === 0) {
    agents = [...DEFAULT_AGENTS];
    log('info', 'Using default agent roster (no TEAM.md found or no agents parsed)');
  }

  // --- Parse budget from COST_ESTIMATION.md ---
  let budget: BudgetParsed = { total: 30, currency: 'USD', alertThreshold: 0.8 };
  const costFile = findFile(resolvedProjectDir, [
    '.team/COST_ESTIMATION.md',
    'COST_ESTIMATION.md',
    '.team/cost_estimation.md',
    'docs/COST_ESTIMATION.md',
  ]);

  if (costFile) {
    const costContent = readFileSafe(costFile);
    if (costContent) {
      budget = parseBudgetFromCostFile(costContent);
      log('info', `Parsed budget: $${budget.total} ${budget.currency} from ${costFile}`);
    }
  }

  // --- Resolve strategy path ---
  let resolvedStrategyPath = '';
  if (strategyPath) {
    resolvedStrategyPath = path.resolve(strategyPath);
    if (!fs.existsSync(resolvedStrategyPath)) {
      log('warn', `Strategy file not found: ${resolvedStrategyPath}`);
      resolvedStrategyPath = strategyPath; // keep original for reference
    }
  } else {
    // Try to find strategy file
    const found = findFile(resolvedProjectDir, [
      'STRATEGY.md',
      '.team/STRATEGY.md',
      'docs/STRATEGY.md',
    ]);
    if (found) {
      resolvedStrategyPath = found;
      log('info', `Auto-detected strategy: ${found}`);
    }
  }

  // --- Build config ---
  const config: MissionControlConfig = {
    sessionId: crypto.randomUUID(),
    projectName: `${teamName} project`,
    teamName,
    strategyPath: resolvedStrategyPath,
    projectDir: resolvedProjectDir,
    teamDir: path.join(resolvedProjectDir, '.team/'),
    agents,
    budget: {
      total: budget.total,
      currency: budget.currency,
      alertThreshold: budget.alertThreshold,
    },
    ports: {
      backend: 4201,
      frontend: 4200,
    },
    source: {
      tool,
      adapter,
    },
    fileWatcher: {
      watchPaths: ['.team/', '.github/workflows/', 'coverage/'],
      debounceMs: 500,
    },
  };

  return config;
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  if (level === 'warn') {
    console.warn(`[${level.toUpperCase()}] ${message}`);
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Amenthyx Mission Control -- Config Generator

Usage:
  npx tsx scaffold/generate-config.ts <project_dir> <team_name> [strategy_path] [ai_tool]

Arguments:
  project_dir    Path to the target project directory (default: ".")
  team_name      Name of the team (default: "unknown")
  strategy_path  Path to the STRATEGY.md file (optional, auto-detected)
  ai_tool        AI tool override: claude-code, cursor, windsurf, aider (default: auto)

Output:
  Writes mission-control.config.json to <project_dir>/.mission-control/

Examples:
  npx tsx scaffold/generate-config.ts ./my-project fullStack
  npx tsx scaffold/generate-config.ts . backend ./STRATEGY.md claude-code
`);
    process.exit(0);
  }

  const projectDir = args[0] || '.';
  const teamName = args[1] || 'unknown';
  const strategyPath = args[2] || undefined;
  const aiTool = args[3] || 'auto';

  // Validate project directory
  const resolvedDir = path.resolve(projectDir);
  if (!fs.existsSync(resolvedDir)) {
    console.error(`[ERROR] Project directory does not exist: ${resolvedDir}`);
    process.exit(1);
  }

  console.log('');
  console.log('========================================================');
  console.log('  AMENTHYX MISSION CONTROL -- Config Generator v1.0');
  console.log('========================================================');
  console.log('');
  console.log(`  Project:  ${resolvedDir}`);
  console.log(`  Team:     ${teamName}`);
  console.log(`  Strategy: ${strategyPath || '(auto-detect)'}`);
  console.log(`  AI Tool:  ${aiTool}`);
  console.log('');

  // Generate config
  const config = generateConfig(projectDir, teamName, strategyPath, aiTool);

  // Write to .mission-control directory
  const mcDir = path.join(resolvedDir, '.mission-control');
  if (!fs.existsSync(mcDir)) {
    fs.mkdirSync(mcDir, { recursive: true });
  }

  const configPath = path.join(mcDir, 'mission-control.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

  console.log(`[OK] Config written to ${configPath}`);
  console.log(`     Session ID: ${config.sessionId}`);
  console.log(`     Agents: ${config.agents.length}`);
  console.log(`     Budget: $${config.budget.total} ${config.budget.currency}`);
  console.log(`     AI Tool: ${config.source.tool} (${config.source.adapter})`);
  console.log('');
}

// Run if executed directly
main();

// Export for programmatic use
export { generateConfig, parseAgentsFromTeamFile, parseBudgetFromCostFile, detectAiTool };
export type { MissionControlConfig, AgentEntry, BudgetParsed };
