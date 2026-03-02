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
