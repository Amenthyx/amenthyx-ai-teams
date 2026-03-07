import { Router, Request, Response } from 'express';
import * as crypto from 'crypto';
import { getDatabase } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

export interface EvidenceRow {
  id: string;
  type: string;
  artifact_url: string;
  linked_entity_type: string;
  linked_entity_id: string;
  verified_by: string;
  timestamp: string;
}

function ensureTable(): void {
  const d = getDatabase();
  d.exec(`
    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      artifact_url TEXT NOT NULL DEFAULT '',
      linked_entity_type TEXT NOT NULL DEFAULT '',
      linked_entity_id TEXT NOT NULL DEFAULT '',
      verified_by TEXT NOT NULL DEFAULT '',
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(type);
    CREATE INDEX IF NOT EXISTS idx_evidence_entity ON evidence(linked_entity_type, linked_entity_id);
  `);
}

function rowToEvidence(row: Record<string, unknown>): EvidenceRow {
  return {
    id: row.id as string,
    type: row.type as string,
    artifact_url: row.artifact_url as string,
    linked_entity_type: row.linked_entity_type as string,
    linked_entity_id: row.linked_entity_id as string,
    verified_by: row.verified_by as string,
    timestamp: row.timestamp as string,
  };
}

/**
 * Evidence routes factory.
 */
export function createEvidenceRouter(broadcast: Function): Router {
  const router = Router();

  let tableReady = false;
  function init(): void {
    if (!tableReady) {
      ensureTable();
      tableReady = true;
    }
  }

  /**
   * GET /api/evidence
   * List evidence items with optional filters: ?type=, ?linked_entity_type=, ?verified_by=
   */
  router.get('/evidence', (req: Request, res: Response) => {
    try {
      init();
      const d = getDatabase();
      const conditions: string[] = [];
      const params: unknown[] = [];

      if (req.query.type) {
        conditions.push('type = ?');
        params.push(req.query.type);
      }
      if (req.query.linked_entity_type) {
        conditions.push('linked_entity_type = ?');
        params.push(req.query.linked_entity_type);
      }
      if (req.query.verified_by) {
        conditions.push('verified_by = ?');
        params.push(req.query.verified_by);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = parseInt(req.query.limit as string, 10) || 200;

      const rows = d.prepare(
        `SELECT * FROM evidence ${whereClause} ORDER BY timestamp DESC LIMIT ?`
      ).all(...params, limit) as Array<Record<string, unknown>>;

      res.json({ evidence: rows.map(rowToEvidence) });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get evidence: ${message}`);
      res.status(500).json({ error: 'Failed to get evidence', detail: message });
    }
  });

  /**
   * POST /api/evidence
   * Create a new evidence item.
   */
  router.post('/evidence', (req: Request, res: Response) => {
    try {
      init();
      const d = getDatabase();
      const body = req.body as Partial<EvidenceRow>;

      const id = body.id || crypto.randomUUID();
      const now = new Date().toISOString();

      d.prepare(`
        INSERT INTO evidence (id, type, artifact_url, linked_entity_type, linked_entity_id, verified_by, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        body.type || 'log',
        body.artifact_url || '',
        body.linked_entity_type || '',
        body.linked_entity_id || '',
        body.verified_by || '',
        now
      );

      const row = d.prepare('SELECT * FROM evidence WHERE id = ?').get(id) as Record<string, unknown>;
      const evidence = rowToEvidence(row);

      broadcast({ type: 'evidence', data: evidence });
      log('info', `Created evidence ${id} of type ${evidence.type}`);
      res.status(201).json({ evidence });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to create evidence: ${message}`);
      res.status(500).json({ error: 'Failed to create evidence', detail: message });
    }
  });

  return router;
}
