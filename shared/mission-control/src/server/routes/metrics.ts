import { Router, Request, Response } from 'express';
import { getMetrics } from '../middleware/timing';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Metrics routes factory.
 * Exposes response-time statistics from the in-memory timing middleware.
 */
export function createMetricsRouter(): Router {
  const router = Router();

  /**
   * GET /api/metrics
   * Returns response time statistics.
   * Query params: window (ms, default 3600000 = 1 hour)
   */
  router.get('/metrics', (req: Request, res: Response) => {
    try {
      const windowParam = req.query.window as string | undefined;
      const windowMs = windowParam ? parseInt(windowParam, 10) : 3_600_000; // default 1h

      const metrics = getMetrics(isNaN(windowMs) ? 3_600_000 : windowMs);

      res.json({
        totalRequests: metrics.totalRequests,
        bufferedRequests: metrics.bufferedRequests,
        responseTimes: {
          avg: metrics.avg,
          p50: metrics.p50,
          p95: metrics.p95,
          p99: metrics.p99,
          min: metrics.min,
          max: metrics.max,
        },
        timeline: metrics.timeline,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get metrics: ${message}`);
      res.status(500).json({ error: 'Failed to get metrics', detail: message });
    }
  });

  return router;
}
