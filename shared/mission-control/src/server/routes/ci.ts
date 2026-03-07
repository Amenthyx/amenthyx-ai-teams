import { Router, Request, Response } from 'express';
import * as crypto from 'crypto';
import { getDatabase } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

export interface CIRunRow {
  id: string;
  pipeline_id: string;
  status: string;
  steps: string;
  duration: number;
  trigger_agent: string;
  created_at: string;
}

function ensureTable(): void {
  const d = getDatabase();
  d.exec(`
    CREATE TABLE IF NOT EXISTS ci_runs (
      id TEXT PRIMARY KEY,
      pipeline_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'running',
      steps TEXT NOT NULL DEFAULT '[]',
      duration REAL NOT NULL DEFAULT 0,
      trigger_agent TEXT NOT NULL DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_ci_runs_status ON ci_runs(status);
    CREATE INDEX IF NOT EXISTS idx_ci_runs_pipeline ON ci_runs(pipeline_id);
  `);
}

function rowToCIRun(row: Record<string, unknown>): CIRunRow {
  return {
    id: row.id as string,
    pipeline_id: row.pipeline_id as string,
    status: row.status as string,
    steps: row.steps as string,
    duration: row.duration as number,
    trigger_agent: row.trigger_agent as string,
    created_at: row.created_at as string,
  };
}

/**
 * CI/CD pipeline routes factory.
 */
export function createCIRouter(broadcast: Function): Router {
  const router = Router();

  // Ensure table exists on first use
  let tableReady = false;
  function init(): void {
    if (!tableReady) {
      ensureTable();
      tableReady = true;
    }
  }

  /**
   * GET /api/ci/runs
   * List all CI runs, newest first. Optional ?status= filter.
   */
  router.get('/ci/runs', (_req: Request, res: Response) => {
    try {
      init();
      const d = getDatabase();
      const status = _req.query.status as string | undefined;

      let rows: Array<Record<string, unknown>>;
      if (status) {
        rows = d.prepare('SELECT * FROM ci_runs WHERE status = ? ORDER BY created_at DESC LIMIT 200')
          .all(status) as Array<Record<string, unknown>>;
      } else {
        rows = d.prepare('SELECT * FROM ci_runs ORDER BY created_at DESC LIMIT 200')
          .all() as Array<Record<string, unknown>>;
      }

      res.json({ runs: rows.map(rowToCIRun) });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get CI runs: ${message}`);
      res.status(500).json({ error: 'Failed to get CI runs', detail: message });
    }
  });

  /**
   * POST /api/ci/runs
   * Create a new CI run.
   */
  router.post('/ci/runs', (req: Request, res: Response) => {
    try {
      init();
      const d = getDatabase();
      const body = req.body as Partial<CIRunRow>;

      const id = body.id || crypto.randomUUID();
      const now = new Date().toISOString();

      d.prepare(`
        INSERT INTO ci_runs (id, pipeline_id, status, steps, duration, trigger_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        body.pipeline_id || 'unknown',
        body.status || 'running',
        typeof body.steps === 'string' ? body.steps : JSON.stringify(body.steps || []),
        body.duration || 0,
        body.trigger_agent || '',
        now
      );

      const row = d.prepare('SELECT * FROM ci_runs WHERE id = ?').get(id) as Record<string, unknown>;
      const run = rowToCIRun(row);

      broadcast({ type: 'ci_run', data: run });
      log('info', `Created CI run ${id} for pipeline ${run.pipeline_id}`);
      res.status(201).json({ run });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to create CI run: ${message}`);
      res.status(500).json({ error: 'Failed to create CI run', detail: message });
    }
  });

  /**
   * GET /api/ci/runs/:id
   * Get a single CI run by ID.
   */
  router.get('/ci/runs/:id', (req: Request, res: Response) => {
    try {
      init();
      const d = getDatabase();
      const row = d.prepare('SELECT * FROM ci_runs WHERE id = ?').get(req.params.id) as
        | Record<string, unknown>
        | undefined;

      if (!row) {
        res.status(404).json({ error: 'CI run not found' });
        return;
      }

      res.json({ run: rowToCIRun(row) });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get CI run: ${message}`);
      res.status(500).json({ error: 'Failed to get CI run', detail: message });
    }
  });

  return router;
}
