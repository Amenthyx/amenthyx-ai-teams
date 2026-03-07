import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Analytics routes factory.
 * Provides aggregate statistics and time-bucketed event data.
 */
export function createAnalyticsRouter(): Router {
  const router = Router();

  /**
   * GET /api/analytics/summary
   * Returns aggregate event stats: counts by category, severity, agent, plus cost over time.
   * Query params: range (1h | 6h | 24h | all)
   */
  router.get('/analytics/summary', (req: Request, res: Response) => {
    try {
      const d = getDatabase();
      const range = (req.query.range as string) || 'all';
      const since = rangeToISO(range);

      const whereClause = since ? `WHERE timestamp >= '${since}'` : '';

      // Total event count
      const totalRow = d.prepare(`SELECT COUNT(*) as total FROM events ${whereClause}`).get() as { total: number };

      // By category
      const categoryRows = d
        .prepare(`SELECT category, COUNT(*) as count FROM events ${whereClause} GROUP BY category ORDER BY count DESC`)
        .all() as Array<{ category: string; count: number }>;

      // By severity
      const severityRows = d
        .prepare(`SELECT severity, COUNT(*) as count FROM events ${whereClause} GROUP BY severity ORDER BY count DESC`)
        .all() as Array<{ severity: string; count: number }>;

      // By agent
      const agentRows = d
        .prepare(
          `SELECT agent_role, COUNT(*) as count FROM events ${whereClause} ${since ? 'AND' : 'WHERE'} agent_role IS NOT NULL GROUP BY agent_role ORDER BY count DESC`
        )
        .all() as Array<{ agent_role: string; count: number }>;

      // Cost over time (bucketed by hour)
      const costRows = d
        .prepare(
          `SELECT
            strftime('%Y-%m-%dT%H:00:00', timestamp) as bucket,
            SUM(json_extract(meta, '$.cost_usd')) as cost
          FROM events
          ${whereClause} ${since ? 'AND' : 'WHERE'} json_extract(meta, '$.cost_usd') IS NOT NULL
          GROUP BY bucket
          ORDER BY bucket ASC`
        )
        .all() as Array<{ bucket: string; cost: number }>;

      res.json({
        total: totalRow.total,
        range,
        byCategory: categoryRows,
        bySeverity: severityRows,
        byAgent: agentRows,
        costOverTime: costRows.map((r) => ({
          time: r.bucket,
          cost: Math.round((r.cost ?? 0) * 100) / 100,
        })),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get analytics summary: ${message}`);
      res.status(500).json({ error: 'Failed to get analytics summary', detail: message });
    }
  });

  /**
   * GET /api/analytics/timeline
   * Returns events bucketed by time interval.
   * Query params: range (1h | 6h | 24h | all), buckets (number of buckets, default 30)
   */
  router.get('/analytics/timeline', (req: Request, res: Response) => {
    try {
      const d = getDatabase();
      const range = (req.query.range as string) || 'all';
      const bucketCount = Math.min(parseInt((req.query.buckets as string) || '30', 10), 200);
      const since = rangeToISO(range);

      // Determine time format based on range
      const timeFmt = getTimeBucketFormat(range);
      const whereClause = since ? `WHERE timestamp >= '${since}'` : '';

      const rows = d
        .prepare(
          `SELECT
            strftime('${timeFmt}', timestamp) as bucket,
            COUNT(*) as count,
            category
          FROM events
          ${whereClause}
          GROUP BY bucket, category
          ORDER BY bucket ASC`
        )
        .all() as Array<{ bucket: string; count: number; category: string }>;

      // Pivot: group by bucket, each category becomes a key
      const bucketMap = new Map<string, Record<string, number>>();
      for (const row of rows) {
        if (!bucketMap.has(row.bucket)) {
          bucketMap.set(row.bucket, { total: 0 });
        }
        const entry = bucketMap.get(row.bucket)!;
        entry[row.category] = (entry[row.category] || 0) + row.count;
        entry.total += row.count;
      }

      const timeline = Array.from(bucketMap.entries()).map(([time, data]) => ({
        time,
        ...data,
      }));

      res.json({ range, timeline });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get analytics timeline: ${message}`);
      res.status(500).json({ error: 'Failed to get analytics timeline', detail: message });
    }
  });

  return router;
}

/**
 * Convert a range string to an ISO timestamp cutoff.
 */
function rangeToISO(range: string): string | null {
  const now = Date.now();
  switch (range) {
    case '1h':
      return new Date(now - 60 * 60 * 1000).toISOString();
    case '6h':
      return new Date(now - 6 * 60 * 60 * 1000).toISOString();
    case '24h':
      return new Date(now - 24 * 60 * 60 * 1000).toISOString();
    case 'all':
    default:
      return null;
  }
}

/**
 * Return the appropriate strftime format for time bucketing.
 */
function getTimeBucketFormat(range: string): string {
  switch (range) {
    case '1h':
      return '%Y-%m-%dT%H:%M:00'; // per-minute
    case '6h':
      return '%Y-%m-%dT%H:%M:00'; // per-minute (5-min would need rounding)
    case '24h':
      return '%Y-%m-%dT%H:00:00'; // per-hour
    case 'all':
    default:
      return '%Y-%m-%dT%H:00:00'; // per-hour
  }
}
