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

    -- Decisions table (Enhancement #3)
    CREATE TABLE IF NOT EXISTS decisions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      context TEXT,
      decision_text TEXT NOT NULL,
      rationale TEXT,
      decided_by TEXT,
      status TEXT NOT NULL DEFAULT 'proposed',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);

    -- Interviews table (Enhancement #4)
    CREATE TABLE IF NOT EXISTS interviews (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      implications TEXT,
      category TEXT NOT NULL DEFAULT 'general',
      order_num INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_interviews_category ON interviews(category);

    -- CI/CD runs table (Enhancement #5)
    CREATE TABLE IF NOT EXISTS ci_runs (
      id TEXT PRIMARY KEY,
      pipeline_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'running',
      steps TEXT NOT NULL DEFAULT '[]',
      duration INTEGER DEFAULT 0,
      trigger_agent TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_ci_runs_status ON ci_runs(status);

    -- Evidence table (Enhancement #8)
    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      artifact_url TEXT,
      linked_entity_type TEXT,
      linked_entity_id TEXT,
      verified_by TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(type);

    -- Sessions table (Enhancement #9)
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_active TEXT DEFAULT CURRENT_TIMESTAMP,
      config TEXT NOT NULL DEFAULT '{}'
    );

    -- Agent messages table (Enhancement #42)
    CREATE TABLE IF NOT EXISTS agent_messages (
      id TEXT PRIMARY KEY,
      sender TEXT NOT NULL,
      receiver TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      context TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_agent_messages_sender ON agent_messages(sender);
    CREATE INDEX IF NOT EXISTS idx_agent_messages_receiver ON agent_messages(receiver);

    -- Build artifacts table (Enhancement #49)
    CREATE TABLE IF NOT EXISTS artifacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      size INTEGER DEFAULT 0,
      hash TEXT,
      path TEXT,
      producer_agent TEXT,
      wave INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_artifacts_wave ON artifacts(wave);
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

// ---------------------------------------------------------------------------
// Decision Operations
// ---------------------------------------------------------------------------

export interface DecisionRow {
  id: string;
  title: string;
  context?: string;
  decision_text: string;
  rationale?: string;
  decided_by?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function getDecisions(status?: string): DecisionRow[] {
  const d = getDatabase();
  if (status) {
    return d.prepare('SELECT * FROM decisions WHERE status = ? ORDER BY created_at DESC').all(status) as DecisionRow[];
  }
  return d.prepare('SELECT * FROM decisions ORDER BY created_at DESC').all() as DecisionRow[];
}

export function insertDecision(decision: Omit<DecisionRow, 'created_at' | 'updated_at'>): DecisionRow {
  const d = getDatabase();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO decisions (id, title, context, decision_text, rationale, decided_by, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(decision.id, decision.title, decision.context ?? null, decision.decision_text, decision.rationale ?? null, decision.decided_by ?? null, decision.status, now, now);
  return d.prepare('SELECT * FROM decisions WHERE id = ?').get(decision.id) as DecisionRow;
}

export function updateDecision(id: string, updates: Partial<DecisionRow>): DecisionRow | null {
  const d = getDatabase();
  const setClauses: string[] = [];
  const params: unknown[] = [];
  for (const [key, val] of Object.entries(updates)) {
    if (key !== 'id' && key !== 'created_at' && val !== undefined) {
      setClauses.push(`${key} = ?`);
      params.push(val);
    }
  }
  if (setClauses.length === 0) return d.prepare('SELECT * FROM decisions WHERE id = ?').get(id) as DecisionRow | null;
  setClauses.push('updated_at = ?');
  params.push(new Date().toISOString());
  params.push(id);
  d.prepare(`UPDATE decisions SET ${setClauses.join(', ')} WHERE id = ?`).run(...params);
  return d.prepare('SELECT * FROM decisions WHERE id = ?').get(id) as DecisionRow | null;
}

// ---------------------------------------------------------------------------
// Interview Operations
// ---------------------------------------------------------------------------

export interface InterviewRow {
  id: string;
  question: string;
  answer: string;
  implications?: string;
  category: string;
  order_num: number;
  created_at: string;
}

export function getInterviews(category?: string): InterviewRow[] {
  const d = getDatabase();
  if (category) {
    return d.prepare('SELECT * FROM interviews WHERE category = ? ORDER BY order_num').all(category) as InterviewRow[];
  }
  return d.prepare('SELECT * FROM interviews ORDER BY order_num').all() as InterviewRow[];
}

export function insertInterview(interview: Omit<InterviewRow, 'created_at'>): InterviewRow {
  const d = getDatabase();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO interviews (id, question, answer, implications, category, order_num, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(interview.id, interview.question, interview.answer, interview.implications ?? null, interview.category, interview.order_num, now);
  return d.prepare('SELECT * FROM interviews WHERE id = ?').get(interview.id) as InterviewRow;
}

// ---------------------------------------------------------------------------
// CI Run Operations
// ---------------------------------------------------------------------------

export interface CIRunRow {
  id: string;
  pipeline_id: string;
  status: string;
  steps: string;
  duration: number;
  trigger_agent?: string;
  created_at: string;
}

export function getCIRuns(status?: string): CIRunRow[] {
  const d = getDatabase();
  if (status) {
    return d.prepare('SELECT * FROM ci_runs WHERE status = ? ORDER BY created_at DESC').all(status) as CIRunRow[];
  }
  return d.prepare('SELECT * FROM ci_runs ORDER BY created_at DESC').all() as CIRunRow[];
}

export function insertCIRun(run: Omit<CIRunRow, 'created_at'>): CIRunRow {
  const d = getDatabase();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO ci_runs (id, pipeline_id, status, steps, duration, trigger_agent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(run.id, run.pipeline_id, run.status, run.steps, run.duration, run.trigger_agent ?? null, now);
  return d.prepare('SELECT * FROM ci_runs WHERE id = ?').get(run.id) as CIRunRow;
}

export function updateCIRun(id: string, updates: Partial<CIRunRow>): CIRunRow | null {
  const d = getDatabase();
  const setClauses: string[] = [];
  const params: unknown[] = [];
  for (const [key, val] of Object.entries(updates)) {
    if (key !== 'id' && key !== 'created_at' && val !== undefined) {
      setClauses.push(`${key} = ?`);
      params.push(val);
    }
  }
  if (setClauses.length === 0) return null;
  params.push(id);
  d.prepare(`UPDATE ci_runs SET ${setClauses.join(', ')} WHERE id = ?`).run(...params);
  return d.prepare('SELECT * FROM ci_runs WHERE id = ?').get(id) as CIRunRow | null;
}

// ---------------------------------------------------------------------------
// Evidence Operations
// ---------------------------------------------------------------------------

export interface EvidenceRow {
  id: string;
  type: string;
  artifact_url?: string;
  linked_entity_type?: string;
  linked_entity_id?: string;
  verified_by?: string;
  created_at: string;
}

export function getEvidence(type?: string): EvidenceRow[] {
  const d = getDatabase();
  if (type) {
    return d.prepare('SELECT * FROM evidence WHERE type = ? ORDER BY created_at DESC').all(type) as EvidenceRow[];
  }
  return d.prepare('SELECT * FROM evidence ORDER BY created_at DESC').all() as EvidenceRow[];
}

export function insertEvidence(evidence: Omit<EvidenceRow, 'created_at'>): EvidenceRow {
  const d = getDatabase();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO evidence (id, type, artifact_url, linked_entity_type, linked_entity_id, verified_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(evidence.id, evidence.type, evidence.artifact_url ?? null, evidence.linked_entity_type ?? null, evidence.linked_entity_id ?? null, evidence.verified_by ?? null, now);
  return d.prepare('SELECT * FROM evidence WHERE id = ?').get(evidence.id) as EvidenceRow;
}

// ---------------------------------------------------------------------------
// Session Operations
// ---------------------------------------------------------------------------

export interface SessionRow {
  id: string;
  name: string;
  created_at: string;
  last_active: string;
  config: string;
}

export function getSessions(): SessionRow[] {
  const d = getDatabase();
  return d.prepare('SELECT * FROM sessions ORDER BY last_active DESC').all() as SessionRow[];
}

export function insertSession(session: { id: string; name: string; config?: Record<string, unknown> }): SessionRow {
  const d = getDatabase();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO sessions (id, name, created_at, last_active, config)
    VALUES (?, ?, ?, ?, ?)
  `).run(session.id, session.name, now, now, JSON.stringify(session.config ?? {}));
  return d.prepare('SELECT * FROM sessions WHERE id = ?').get(session.id) as SessionRow;
}

export function deleteSession(id: string): boolean {
  const d = getDatabase();
  const result = d.prepare('DELETE FROM sessions WHERE id = ?').run(id);
  return result.changes > 0;
}

// ---------------------------------------------------------------------------
// Agent Message Operations
// ---------------------------------------------------------------------------

export interface AgentMessageRow {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  context?: string;
}

export function getAgentMessages(agent?: string): AgentMessageRow[] {
  const d = getDatabase();
  if (agent) {
    return d.prepare('SELECT * FROM agent_messages WHERE sender = ? OR receiver = ? ORDER BY timestamp DESC LIMIT 200').all(agent, agent) as AgentMessageRow[];
  }
  return d.prepare('SELECT * FROM agent_messages ORDER BY timestamp DESC LIMIT 200').all() as AgentMessageRow[];
}

export function insertAgentMessage(msg: AgentMessageRow): AgentMessageRow {
  const d = getDatabase();
  d.prepare(`
    INSERT INTO agent_messages (id, sender, receiver, content, timestamp, context)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(msg.id, msg.sender, msg.receiver, msg.content, msg.timestamp, msg.context ?? null);
  return msg;
}

// ---------------------------------------------------------------------------
// Artifact Operations
// ---------------------------------------------------------------------------

export interface ArtifactRow {
  id: string;
  name: string;
  type: string;
  size: number;
  hash?: string;
  path?: string;
  producer_agent?: string;
  wave?: number;
  created_at: string;
}

export function getArtifacts(wave?: number): ArtifactRow[] {
  const d = getDatabase();
  if (wave !== undefined) {
    return d.prepare('SELECT * FROM artifacts WHERE wave = ? ORDER BY created_at DESC').all(wave) as ArtifactRow[];
  }
  return d.prepare('SELECT * FROM artifacts ORDER BY created_at DESC').all() as ArtifactRow[];
}

export function insertArtifact(artifact: Omit<ArtifactRow, 'created_at'>): ArtifactRow {
  const d = getDatabase();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO artifacts (id, name, type, size, hash, path, producer_agent, wave, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(artifact.id, artifact.name, artifact.type, artifact.size, artifact.hash ?? null, artifact.path ?? null, artifact.producer_agent ?? null, artifact.wave ?? null, now);
  return d.prepare('SELECT * FROM artifacts WHERE id = ?').get(artifact.id) as ArtifactRow;
}

// ---------------------------------------------------------------------------
// Search Operations (Full-text across tables)
// ---------------------------------------------------------------------------

export function searchAll(query: string, limit = 20): Array<{ type: string; id: string; text: string; timestamp: string }> {
  const d = getDatabase();
  const results: Array<{ type: string; id: string; text: string; timestamp: string }> = [];
  const q = `%${query}%`;

  // Search events
  const events = d.prepare(`
    SELECT id, type as text, timestamp FROM events
    WHERE type LIKE ? OR payload LIKE ? ORDER BY timestamp DESC LIMIT ?
  `).all(q, q, limit) as Array<{ id: string; text: string; timestamp: string }>;
  for (const e of events) results.push({ type: 'event', ...e });

  // Search decisions
  const decisions = d.prepare(`
    SELECT id, title as text, created_at as timestamp FROM decisions
    WHERE title LIKE ? OR decision_text LIKE ? ORDER BY created_at DESC LIMIT ?
  `).all(q, q, limit) as Array<{ id: string; text: string; timestamp: string }>;
  for (const dec of decisions) results.push({ type: 'decision', ...dec });

  return results.slice(0, limit);
}

// ---------------------------------------------------------------------------
// Analytics Helpers
// ---------------------------------------------------------------------------

export function getEventCountsByCategory(): Record<string, number> {
  const d = getDatabase();
  const rows = d.prepare('SELECT category, COUNT(*) as count FROM events GROUP BY category').all() as Array<{ category: string; count: number }>;
  const result: Record<string, number> = {};
  for (const row of rows) result[row.category] = row.count;
  return result;
}

export function getEventTimeline(bucketMinutes = 5, limit = 100): Array<{ bucket: string; count: number }> {
  const d = getDatabase();
  return d.prepare(`
    SELECT
      strftime('%Y-%m-%dT%H:', timestamp) || printf('%02d', (CAST(strftime('%M', timestamp) AS INTEGER) / ?) * ?) || ':00' as bucket,
      COUNT(*) as count
    FROM events
    GROUP BY bucket
    ORDER BY bucket DESC
    LIMIT ?
  `).all(bucketMinutes, bucketMinutes, limit) as Array<{ bucket: string; count: number }>;
}

export function getErrorEvents(limit = 50): Array<{ agent_role: string; count: number }> {
  const d = getDatabase();
  return d.prepare(`
    SELECT agent_role, COUNT(*) as count FROM events
    WHERE severity IN ('error', 'critical') AND agent_role IS NOT NULL
    GROUP BY agent_role ORDER BY count DESC LIMIT ?
  `).all(limit) as Array<{ agent_role: string; count: number }>;
}

export function getDatabaseHealth(): { tables: number; totalRows: number; dbSizeEstimate: number } {
  const d = getDatabase();
  const tables = d.prepare("SELECT COUNT(*) as c FROM sqlite_master WHERE type='table'").get() as { c: number };
  const events = (d.prepare('SELECT COUNT(*) as c FROM events').get() as { c: number }).c;
  const agents = (d.prepare('SELECT COUNT(*) as c FROM agents').get() as { c: number }).c;
  return {
    tables: tables.c,
    totalRows: events + agents,
    dbSizeEstimate: (d.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get() as { size: number })?.size || 0,
  };
}
