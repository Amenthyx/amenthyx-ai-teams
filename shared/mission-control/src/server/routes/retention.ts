import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

// ---------------------------------------------------------------------------
// Retention policy — stored in a simple key-value table
// ---------------------------------------------------------------------------

interface RetentionPolicy {
  maxDays: number;
  maxEvents: number;
}

const DEFAULT_POLICY: RetentionPolicy = {
  maxDays: 90,
  maxEvents: 100000,
};

function ensureRetentionTable(): void {
  const d = getDatabase();
  d.exec(`
    CREATE TABLE IF NOT EXISTS retention_policy (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

function getPolicy(): RetentionPolicy {
  try {
    const d = getDatabase();
    ensureRetentionTable();
    const row = d.prepare(
      "SELECT value FROM retention_policy WHERE key = 'policy'"
    ).get() as { value: string } | undefined;

    if (row) {
      return { ...DEFAULT_POLICY, ...JSON.parse(row.value) };
    }
  } catch {
    // Fall through to default
  }
  return { ...DEFAULT_POLICY };
}

function setPolicy(policy: RetentionPolicy): void {
  const d = getDatabase();
  ensureRetentionTable();
  d.prepare(`
    INSERT INTO retention_policy (key, value)
    VALUES ('policy', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(JSON.stringify(policy));
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export function createRetentionRouter(): Router {
  const router = Router();

  /**
   * GET /api/retention/stats
   * Returns database size info, event count, and oldest event timestamp.
   */
  router.get('/retention/stats', (_req: Request, res: Response) => {
    try {
      const d = getDatabase();

      const countRow = d.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
      const oldestRow = d.prepare(
        'SELECT MIN(timestamp) as oldest FROM events'
      ).get() as { oldest: string | null };
      const newestRow = d.prepare(
        'SELECT MAX(timestamp) as newest FROM events'
      ).get() as { newest: string | null };

      // Get approximate DB size via page_count * page_size
      const pageCount = d.pragma('page_count') as Array<{ page_count: number }>;
      const pageSize = d.pragma('page_size') as Array<{ page_size: number }>;
      const dbSizeBytes =
        (pageCount[0]?.page_count ?? 0) * (pageSize[0]?.page_size ?? 4096);

      const policy = getPolicy();

      res.json({
        eventCount: countRow.count,
        oldestEvent: oldestRow.oldest,
        newestEvent: newestRow.newest,
        dbSizeBytes,
        dbSizeMB: Math.round((dbSizeBytes / (1024 * 1024)) * 100) / 100,
        policy,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get retention stats: ${message}`);
      res.status(500).json({ error: 'Failed to get retention stats', detail: message });
    }
  });

  /**
   * POST /api/retention/purge
   * Delete events older than the specified number of days.
   * Body: { olderThanDays: number }
   */
  router.post('/retention/purge', (req: Request, res: Response) => {
    try {
      const { olderThanDays } = req.body;
      if (typeof olderThanDays !== 'number' || olderThanDays < 1) {
        res.status(400).json({ error: 'olderThanDays must be a positive number' });
        return;
      }

      const d = getDatabase();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      const cutoffISO = cutoffDate.toISOString();

      const result = d.prepare('DELETE FROM events WHERE timestamp < ?').run(cutoffISO);
      const deletedCount = result.changes;

      // Run VACUUM to reclaim space
      d.exec('VACUUM');

      log('info', `Purged ${deletedCount} events older than ${olderThanDays} days (cutoff: ${cutoffISO})`);

      res.json({
        purged: deletedCount,
        cutoffDate: cutoffISO,
        olderThanDays,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to purge events: ${message}`);
      res.status(500).json({ error: 'Failed to purge events', detail: message });
    }
  });

  /**
   * GET /api/retention/policy
   * Returns the current retention policy.
   */
  router.get('/retention/policy', (_req: Request, res: Response) => {
    try {
      const policy = getPolicy();
      res.json(policy);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get retention policy: ${message}`);
      res.status(500).json({ error: 'Failed to get retention policy', detail: message });
    }
  });

  /**
   * PUT /api/retention/policy
   * Update the retention policy.
   * Body: { maxDays?: number, maxEvents?: number }
   */
  router.put('/retention/policy', (req: Request, res: Response) => {
    try {
      const current = getPolicy();
      const { maxDays, maxEvents } = req.body;

      if (maxDays !== undefined) {
        if (typeof maxDays !== 'number' || maxDays < 1) {
          res.status(400).json({ error: 'maxDays must be a positive number' });
          return;
        }
        current.maxDays = maxDays;
      }

      if (maxEvents !== undefined) {
        if (typeof maxEvents !== 'number' || maxEvents < 100) {
          res.status(400).json({ error: 'maxEvents must be at least 100' });
          return;
        }
        current.maxEvents = maxEvents;
      }

      setPolicy(current);
      log('info', `Retention policy updated: maxDays=${current.maxDays}, maxEvents=${current.maxEvents}`);

      res.json(current);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to update retention policy: ${message}`);
      res.status(500).json({ error: 'Failed to update retention policy', detail: message });
    }
  });

  return router;
}
