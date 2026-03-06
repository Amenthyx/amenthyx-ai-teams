import Database from 'better-sqlite3';
import type {
  MissionControlEvent,
  AgentInfo,
  BudgetInfo,
  WaveInfo,
  EventCategory,
  Severity,
} from '../types/events';

let db: Database.Database | null = null;

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Initialize the SQLite database with WAL mode and required tables.
 */
export function initDatabase(dbPath: string): Database.Database {
  db = new Database(dbPath);

  // Enable WAL mode for better concurrent read/write performance
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      session_id TEXT NOT NULL,
      category TEXT NOT NULL,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      agent_role TEXT,
      agent_name TEXT,
      payload TEXT NOT NULL DEFAULT '{}',
      meta TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agents (
      role TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#888888',
      category TEXT NOT NULL DEFAULT 'engineering',
      status TEXT NOT NULL DEFAULT 'idle',
      current_task TEXT,
      wave INTEGER,
      tokens_used INTEGER DEFAULT 0,
      cost_usd REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS budget (
      id INTEGER PRIMARY KEY DEFAULT 1,
      total REAL NOT NULL DEFAULT 0,
      spent REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      alert_threshold REAL NOT NULL DEFAULT 0.8,
      hard_cap REAL
    );

    CREATE TABLE IF NOT EXISTS waves (
      number INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      gate TEXT NOT NULL DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS gates (
      id TEXT PRIMARY KEY,
      gate_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      message TEXT NOT NULL DEFAULT '',
      payload TEXT NOT NULL DEFAULT '{}',
      source TEXT,
      blocking INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      resolved_at TEXT,
      decision TEXT
    );

    CREATE TABLE IF NOT EXISTS uat_suites (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      total_cases INTEGER DEFAULT 0,
      passed INTEGER DEFAULT 0,
      failed INTEGER DEFAULT 0,
      blocked INTEGER DEFAULT 0,
      skipped INTEGER DEFAULT 0,
      coverage REAL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS uat_cases (
      id TEXT PRIMARY KEY,
      suite_id TEXT NOT NULL,
      title TEXT NOT NULL,
      feature TEXT,
      priority TEXT NOT NULL DEFAULT 'P2',
      cta_element TEXT,
      cta_selector TEXT,
      user_role TEXT,
      device TEXT,
      browser TEXT,
      compliance TEXT DEFAULT '[]',
      preconditions TEXT DEFAULT '[]',
      steps TEXT DEFAULT '[]',
      expected_result TEXT,
      actual_result TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      screenshot_before TEXT,
      screenshot_after TEXT,
      screenshot_error TEXT,
      console_log TEXT,
      network_log TEXT,
      defect_id TEXT,
      defect_severity TEXT,
      executed_by TEXT,
      executed_at TEXT,
      duration_ms INTEGER DEFAULT 0,
      environment TEXT,
      build TEXT,
      round INTEGER DEFAULT 0,
      retry_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (suite_id) REFERENCES uat_suites(id)
    );

    CREATE INDEX IF NOT EXISTS idx_uat_cases_suite ON uat_cases(suite_id);
    CREATE INDEX IF NOT EXISTS idx_uat_cases_status ON uat_cases(status);
    CREATE INDEX IF NOT EXISTS idx_uat_cases_priority ON uat_cases(priority);

    CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
    CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
    CREATE INDEX IF NOT EXISTS idx_events_severity ON events(severity);
    CREATE INDEX IF NOT EXISTS idx_events_agent_role ON events(agent_role);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
    CREATE INDEX IF NOT EXISTS idx_gates_status ON gates(status);
  `);

  log('info', `Database initialized at ${dbPath}`);
  return db;
}

/**
 * Get the current database instance.
 */
export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close the database connection gracefully.
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    log('info', 'Database connection closed');
  }
}

// ---------------------------------------------------------------------------
// Event Operations
// ---------------------------------------------------------------------------

/**
 * Insert a MissionControlEvent into the database.
 */
export function insertEvent(event: MissionControlEvent): void {
  const d = getDatabase();
  const stmt = d.prepare(`
    INSERT INTO events (id, timestamp, session_id, category, type, severity, agent_role, agent_name, payload, meta)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    event.id,
    event.timestamp,
    event.sessionId,
    event.category,
    event.type,
    event.severity,
    event.agent?.role ?? null,
    event.agent?.name ?? null,
    JSON.stringify(event.payload),
    event.meta ? JSON.stringify(event.meta) : null
  );
}

export interface EventFilters {
  agent_role?: string;
  category?: EventCategory;
  severity?: Severity;
  limit?: number;
  offset?: number;
  since?: string;
}

export interface EventQueryResult {
  events: MissionControlEvent[];
  total: number;
  hasMore: boolean;
}

/**
 * Query events with optional filters.
 */
export function getEvents(filters?: EventFilters): EventQueryResult {
  const d = getDatabase();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters?.agent_role) {
    conditions.push('agent_role = ?');
    params.push(filters.agent_role);
  }
  if (filters?.category) {
    conditions.push('category = ?');
    params.push(filters.category);
  }
  if (filters?.severity) {
    conditions.push('severity = ?');
    params.push(filters.severity);
  }
  if (filters?.since) {
    conditions.push('timestamp >= ?');
    params.push(filters.since);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Get total count
  const countStmt = d.prepare(`SELECT COUNT(*) as total FROM events ${whereClause}`);
  const countResult = countStmt.get(...params) as { total: number };
  const total = countResult.total;

  // Get paginated results
  const limit = filters?.limit ?? 100;
  const offset = filters?.offset ?? 0;
  const dataStmt = d.prepare(
    `SELECT * FROM events ${whereClause} ORDER BY timestamp DESC LIMIT ? OFFSET ?`
  );
  const rows = dataStmt.all(...params, limit, offset) as Array<Record<string, unknown>>;

  const events: MissionControlEvent[] = rows.map(rowToEvent);

  return {
    events,
    total,
    hasMore: offset + events.length < total,
  };
}

/**
 * Convert a database row to a MissionControlEvent.
 */
function rowToEvent(row: Record<string, unknown>): MissionControlEvent {
  return {
    id: row.id as string,
    timestamp: row.timestamp as string,
    sessionId: row.session_id as string,
    source: { tool: 'database' },
    category: row.category as EventCategory,
    type: row.type as string,
    severity: row.severity as Severity,
    agent: row.agent_role
      ? { role: row.agent_role as string, name: (row.agent_name as string) || undefined }
      : undefined,
    payload: JSON.parse((row.payload as string) || '{}'),
    meta: row.meta ? JSON.parse(row.meta as string) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Agent Operations
// ---------------------------------------------------------------------------

/**
 * Get all agents from the database.
 */
export function getAgents(): AgentInfo[] {
  const d = getDatabase();
  const rows = d.prepare('SELECT * FROM agents ORDER BY role').all() as Array<
    Record<string, unknown>
  >;
  return rows.map(rowToAgent);
}

/**
 * Upsert a single agent.
 */
export function upsertAgent(agent: AgentInfo): void {
  const d = getDatabase();
  const stmt = d.prepare(`
    INSERT INTO agents (role, name, color, category, status, current_task, wave, tokens_used, cost_usd)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(role) DO UPDATE SET
      name = excluded.name,
      color = excluded.color,
      category = excluded.category,
      status = excluded.status,
      current_task = excluded.current_task,
      wave = excluded.wave,
      tokens_used = excluded.tokens_used,
      cost_usd = excluded.cost_usd
  `);
  stmt.run(
    agent.role,
    agent.name,
    agent.color,
    agent.category,
    agent.status,
    agent.currentTask ?? null,
    agent.wave ?? null,
    agent.tokensUsed ?? 0,
    agent.costUsd ?? 0
  );
}

/**
 * Update specific fields of an agent.
 */
export function updateAgent(
  role: string,
  updates: Partial<Pick<AgentInfo, 'status' | 'currentTask' | 'tokensUsed' | 'costUsd' | 'wave'>>
): AgentInfo | null {
  const d = getDatabase();
  const setClauses: string[] = [];
  const params: unknown[] = [];

  if (updates.status !== undefined) {
    setClauses.push('status = ?');
    params.push(updates.status);
  }
  if (updates.currentTask !== undefined) {
    setClauses.push('current_task = ?');
    params.push(updates.currentTask);
  }
  if (updates.tokensUsed !== undefined) {
    setClauses.push('tokens_used = ?');
    params.push(updates.tokensUsed);
  }
  if (updates.costUsd !== undefined) {
    setClauses.push('cost_usd = ?');
    params.push(updates.costUsd);
  }
  if (updates.wave !== undefined) {
    setClauses.push('wave = ?');
    params.push(updates.wave);
  }

  if (setClauses.length === 0) {
    const existing = d.prepare('SELECT * FROM agents WHERE role = ?').get(role) as
      | Record<string, unknown>
      | undefined;
    return existing ? rowToAgent(existing) : null;
  }

  params.push(role);
  d.prepare(`UPDATE agents SET ${setClauses.join(', ')} WHERE role = ?`).run(...params);

  const row = d.prepare('SELECT * FROM agents WHERE role = ?').get(role) as
    | Record<string, unknown>
    | undefined;
  return row ? rowToAgent(row) : null;
}

function rowToAgent(row: Record<string, unknown>): AgentInfo {
  return {
    role: row.role as string,
    name: row.name as string,
    color: row.color as string,
    category: row.category as AgentInfo['category'],
    status: row.status as AgentInfo['status'],
    currentTask: (row.current_task as string) || undefined,
    wave: row.wave as number | undefined,
    tokensUsed: row.tokens_used as number | undefined,
    costUsd: row.cost_usd as number | undefined,
  };
}

// ---------------------------------------------------------------------------
// Budget Operations
// ---------------------------------------------------------------------------

/**
 * Get the current budget state.
 */
export function getBudget(): BudgetInfo | null {
  const d = getDatabase();
  const row = d.prepare('SELECT * FROM budget WHERE id = 1').get() as
    | Record<string, unknown>
    | undefined;
  if (!row) return null;
  return {
    total: row.total as number,
    spent: row.spent as number,
    currency: row.currency as string,
    alertThreshold: row.alert_threshold as number,
    hardCap: (row.hard_cap as number) || undefined,
  };
}

/**
 * Set or update the budget.
 */
export function updateBudget(budget: Partial<BudgetInfo>): BudgetInfo {
  const d = getDatabase();
  const existing = getBudget();

  if (!existing) {
    d.prepare(`
      INSERT INTO budget (id, total, spent, currency, alert_threshold, hard_cap)
      VALUES (1, ?, ?, ?, ?, ?)
    `).run(
      budget.total ?? 0,
      budget.spent ?? 0,
      budget.currency ?? 'USD',
      budget.alertThreshold ?? 0.8,
      budget.hardCap ?? null
    );
  } else {
    const setClauses: string[] = [];
    const params: unknown[] = [];

    if (budget.total !== undefined) {
      setClauses.push('total = ?');
      params.push(budget.total);
    }
    if (budget.spent !== undefined) {
      setClauses.push('spent = ?');
      params.push(budget.spent);
    }
    if (budget.currency !== undefined) {
      setClauses.push('currency = ?');
      params.push(budget.currency);
    }
    if (budget.alertThreshold !== undefined) {
      setClauses.push('alert_threshold = ?');
      params.push(budget.alertThreshold);
    }
    if (budget.hardCap !== undefined) {
      setClauses.push('hard_cap = ?');
      params.push(budget.hardCap);
    }

    if (setClauses.length > 0) {
      d.prepare(`UPDATE budget SET ${setClauses.join(', ')} WHERE id = 1`).run(...params);
    }
  }

  return getBudget()!;
}

// ---------------------------------------------------------------------------
// Wave Operations
// ---------------------------------------------------------------------------

/**
 * Get all waves.
 */
export function getWaves(): WaveInfo[] {
  const d = getDatabase();
  const rows = d.prepare('SELECT * FROM waves ORDER BY number').all() as Array<
    Record<string, unknown>
  >;
  return rows.map(rowToWave);
}

/**
 * Upsert a single wave.
 */
export function upsertWave(wave: WaveInfo): void {
  const d = getDatabase();
  d.prepare(`
    INSERT INTO waves (number, name, status, gate)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(number) DO UPDATE SET
      name = excluded.name,
      status = excluded.status,
      gate = excluded.gate
  `).run(wave.number, wave.name, wave.status, wave.gate);
}

/**
 * Update specific fields of a wave.
 */
export function updateWave(
  waveNumber: number,
  updates: Partial<Pick<WaveInfo, 'status' | 'gate'>>
): WaveInfo | null {
  const d = getDatabase();
  const setClauses: string[] = [];
  const params: unknown[] = [];

  if (updates.status !== undefined) {
    setClauses.push('status = ?');
    params.push(updates.status);
  }
  if (updates.gate !== undefined) {
    setClauses.push('gate = ?');
    params.push(updates.gate);
  }

  if (setClauses.length === 0) {
    const existing = d.prepare('SELECT * FROM waves WHERE number = ?').get(waveNumber) as
      | Record<string, unknown>
      | undefined;
    return existing ? rowToWave(existing) : null;
  }

  params.push(waveNumber);
  d.prepare(`UPDATE waves SET ${setClauses.join(', ')} WHERE number = ?`).run(...params);

  const row = d.prepare('SELECT * FROM waves WHERE number = ?').get(waveNumber) as
    | Record<string, unknown>
    | undefined;
  return row ? rowToWave(row) : null;
}

function rowToWave(row: Record<string, unknown>): WaveInfo {
  return {
    number: row.number as number,
    name: row.name as string,
    status: row.status as WaveInfo['status'],
    gate: row.gate as WaveInfo['gate'],
  };
}

// ---------------------------------------------------------------------------
// Gate Operations
// ---------------------------------------------------------------------------

export interface GateRow {
  id: string;
  gate_type: string;
  status: string;
  message: string;
  payload: Record<string, unknown>;
  source?: string;
  blocking: boolean;
  created_at: string;
  resolved_at?: string;
  decision?: string;
}

function rowToGate(row: Record<string, unknown>): GateRow {
  return {
    id: row.id as string,
    gate_type: row.gate_type as string,
    status: row.status as string,
    message: row.message as string,
    payload: JSON.parse((row.payload as string) || '{}'),
    source: (row.source as string) || undefined,
    blocking: (row.blocking as number) === 1,
    created_at: row.created_at as string,
    resolved_at: (row.resolved_at as string) || undefined,
    decision: (row.decision as string) || undefined,
  };
}

/**
 * Insert a new gate into the database.
 */
export function insertGate(gate: {
  id: string;
  gate_type: string;
  message: string;
  payload?: Record<string, unknown>;
  source?: string;
  blocking?: boolean;
}): GateRow {
  const d = getDatabase();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO gates (id, gate_type, status, message, payload, source, blocking, created_at)
    VALUES (?, ?, 'pending', ?, ?, ?, ?, ?)
  `).run(
    gate.id,
    gate.gate_type,
    gate.message,
    JSON.stringify(gate.payload || {}),
    gate.source ?? null,
    gate.blocking !== false ? 1 : 0,
    now
  );

  return rowToGate(
    d.prepare('SELECT * FROM gates WHERE id = ?').get(gate.id) as Record<string, unknown>
  );
}

/**
 * Get gates filtered by status.
 */
export function getGates(status?: string): GateRow[] {
  const d = getDatabase();
  if (status) {
    const rows = d.prepare('SELECT * FROM gates WHERE status = ? ORDER BY created_at DESC').all(status) as Array<Record<string, unknown>>;
    return rows.map(rowToGate);
  }
  const rows = d.prepare('SELECT * FROM gates ORDER BY created_at DESC').all() as Array<Record<string, unknown>>;
  return rows.map(rowToGate);
}

/**
 * Resolve a gate with a user decision.
 */
export function resolveGate(id: string, decision: string): GateRow | null {
  const d = getDatabase();
  const now = new Date().toISOString();
  const status = (decision === 'rejected' || decision === 'too_expensive') ? 'rejected' : 'approved';
  d.prepare('UPDATE gates SET status = ?, decision = ?, resolved_at = ? WHERE id = ?')
    .run(status, decision, now, id);

  const row = d.prepare('SELECT * FROM gates WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToGate(row) : null;
}

// ---------------------------------------------------------------------------
// UAT Suite Operations
// ---------------------------------------------------------------------------

export interface UATSuite {
  id: string;
  code: string;
  name: string;
  totalCases: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  coverage: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UATCase {
  id: string;
  suiteId: string;
  title: string;
  feature?: string;
  priority: string;
  ctaElement?: string;
  ctaSelector?: string;
  userRole?: string;
  device?: string;
  browser?: string;
  compliance: string[];
  preconditions: string[];
  steps: Array<{ number: number; action: string; element: string; inputData?: string }>;
  expectedResult?: string;
  actualResult?: string;
  status: string;
  screenshotBefore?: string;
  screenshotAfter?: string;
  screenshotError?: string;
  consoleLog?: string;
  networkLog?: string;
  defectId?: string;
  defectSeverity?: string;
  executedBy?: string;
  executedAt?: string;
  durationMs: number;
  environment?: string;
  build?: string;
  round: number;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

function rowToUATSuite(row: Record<string, unknown>): UATSuite {
  return {
    id: row.id as string,
    code: row.code as string,
    name: row.name as string,
    totalCases: row.total_cases as number,
    passed: row.passed as number,
    failed: row.failed as number,
    blocked: row.blocked as number,
    skipped: row.skipped as number,
    coverage: row.coverage as number,
    status: row.status as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToUATCase(row: Record<string, unknown>): UATCase {
  return {
    id: row.id as string,
    suiteId: row.suite_id as string,
    title: row.title as string,
    feature: (row.feature as string) || undefined,
    priority: row.priority as string,
    ctaElement: (row.cta_element as string) || undefined,
    ctaSelector: (row.cta_selector as string) || undefined,
    userRole: (row.user_role as string) || undefined,
    device: (row.device as string) || undefined,
    browser: (row.browser as string) || undefined,
    compliance: JSON.parse((row.compliance as string) || '[]'),
    preconditions: JSON.parse((row.preconditions as string) || '[]'),
    steps: JSON.parse((row.steps as string) || '[]'),
    expectedResult: (row.expected_result as string) || undefined,
    actualResult: (row.actual_result as string) || undefined,
    status: row.status as string,
    screenshotBefore: (row.screenshot_before as string) || undefined,
    screenshotAfter: (row.screenshot_after as string) || undefined,
    screenshotError: (row.screenshot_error as string) || undefined,
    consoleLog: (row.console_log as string) || undefined,
    networkLog: (row.network_log as string) || undefined,
    defectId: (row.defect_id as string) || undefined,
    defectSeverity: (row.defect_severity as string) || undefined,
    executedBy: (row.executed_by as string) || undefined,
    executedAt: (row.executed_at as string) || undefined,
    durationMs: row.duration_ms as number,
    environment: (row.environment as string) || undefined,
    build: (row.build as string) || undefined,
    round: row.round as number,
    retryCount: row.retry_count as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function getUATSuites(): UATSuite[] {
  const d = getDatabase();
  const rows = d.prepare('SELECT * FROM uat_suites ORDER BY code').all() as Array<Record<string, unknown>>;
  return rows.map(rowToUATSuite);
}

export function upsertUATSuite(suite: Partial<UATSuite> & { id: string; code: string; name: string }): UATSuite {
  const d = getDatabase();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO uat_suites (id, code, name, total_cases, passed, failed, blocked, skipped, coverage, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      code = excluded.code,
      name = excluded.name,
      total_cases = excluded.total_cases,
      passed = excluded.passed,
      failed = excluded.failed,
      blocked = excluded.blocked,
      skipped = excluded.skipped,
      coverage = excluded.coverage,
      status = excluded.status,
      updated_at = excluded.updated_at
  `).run(
    suite.id, suite.code, suite.name,
    suite.totalCases ?? 0, suite.passed ?? 0, suite.failed ?? 0,
    suite.blocked ?? 0, suite.skipped ?? 0, suite.coverage ?? 0,
    suite.status ?? 'pending', now, now
  );
  const row = d.prepare('SELECT * FROM uat_suites WHERE id = ?').get(suite.id) as Record<string, unknown>;
  return rowToUATSuite(row);
}

export function getUATCases(suiteId?: string): UATCase[] {
  const d = getDatabase();
  if (suiteId) {
    const rows = d.prepare('SELECT * FROM uat_cases WHERE suite_id = ? ORDER BY id').all(suiteId) as Array<Record<string, unknown>>;
    return rows.map(rowToUATCase);
  }
  const rows = d.prepare('SELECT * FROM uat_cases ORDER BY suite_id, id').all() as Array<Record<string, unknown>>;
  return rows.map(rowToUATCase);
}

export function upsertUATCase(c: Partial<UATCase> & { id: string; suiteId: string; title: string }): UATCase {
  const d = getDatabase();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO uat_cases (id, suite_id, title, feature, priority, cta_element, cta_selector, user_role, device, browser, compliance, preconditions, steps, expected_result, actual_result, status, screenshot_before, screenshot_after, screenshot_error, console_log, network_log, defect_id, defect_severity, executed_by, executed_at, duration_ms, environment, build, round, retry_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      feature = excluded.feature,
      priority = excluded.priority,
      cta_element = excluded.cta_element,
      cta_selector = excluded.cta_selector,
      user_role = excluded.user_role,
      device = excluded.device,
      browser = excluded.browser,
      compliance = excluded.compliance,
      preconditions = excluded.preconditions,
      steps = excluded.steps,
      expected_result = excluded.expected_result,
      actual_result = excluded.actual_result,
      status = excluded.status,
      screenshot_before = excluded.screenshot_before,
      screenshot_after = excluded.screenshot_after,
      screenshot_error = excluded.screenshot_error,
      console_log = excluded.console_log,
      network_log = excluded.network_log,
      defect_id = excluded.defect_id,
      defect_severity = excluded.defect_severity,
      executed_by = excluded.executed_by,
      executed_at = excluded.executed_at,
      duration_ms = excluded.duration_ms,
      environment = excluded.environment,
      build = excluded.build,
      round = excluded.round,
      retry_count = excluded.retry_count,
      updated_at = excluded.updated_at
  `).run(
    c.id, c.suiteId, c.title, c.feature ?? null, c.priority ?? 'P2',
    c.ctaElement ?? null, c.ctaSelector ?? null, c.userRole ?? null,
    c.device ?? null, c.browser ?? null,
    JSON.stringify(c.compliance ?? []), JSON.stringify(c.preconditions ?? []),
    JSON.stringify(c.steps ?? []), c.expectedResult ?? null, c.actualResult ?? null,
    c.status ?? 'pending', c.screenshotBefore ?? null, c.screenshotAfter ?? null,
    c.screenshotError ?? null, c.consoleLog ?? null, c.networkLog ?? null,
    c.defectId ?? null, c.defectSeverity ?? null, c.executedBy ?? null,
    c.executedAt ?? null, c.durationMs ?? 0, c.environment ?? null,
    c.build ?? null, c.round ?? 0, c.retryCount ?? 0, now, now
  );
  const row = d.prepare('SELECT * FROM uat_cases WHERE id = ?').get(c.id) as Record<string, unknown>;
  return rowToUATCase(row);
}

export function getUATSummary(): {
  totalSuites: number;
  totalCases: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  coverage: number;
  defectsFound: number;
  defectsResolved: number;
} {
  const d = getDatabase();
  const suiteCount = (d.prepare('SELECT COUNT(*) as c FROM uat_suites').get() as { c: number }).c;
  const stats = d.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pass' THEN 1 ELSE 0 END) as passed,
      SUM(CASE WHEN status = 'fail' THEN 1 ELSE 0 END) as failed,
      SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as blocked,
      SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped,
      SUM(CASE WHEN defect_id IS NOT NULL THEN 1 ELSE 0 END) as defects_found,
      SUM(CASE WHEN defect_id IS NOT NULL AND status = 'pass' THEN 1 ELSE 0 END) as defects_resolved
    FROM uat_cases
  `).get() as Record<string, number>;

  const total = stats.total || 0;
  const passed = stats.passed || 0;

  return {
    totalSuites: suiteCount,
    totalCases: total,
    passed,
    failed: stats.failed || 0,
    blocked: stats.blocked || 0,
    skipped: stats.skipped || 0,
    coverage: total > 0 ? Math.round((passed / total) * 1000) / 10 : 0,
    defectsFound: stats.defects_found || 0,
    defectsResolved: stats.defects_resolved || 0,
  };
}
