import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  latency: number;
}

/**
 * Service status routes factory.
 */
export function createServicesRouter(broadcast: Function): Router {
  const router = Router();

  /**
   * GET /api/services/status
   * Return health of internal services.
   */
  router.get('/services/status', (_req: Request, res: Response) => {
    const now = new Date().toISOString();
    const services: ServiceStatus[] = [];

    // Check Database
    const dbStart = Date.now();
    try {
      const d = getDatabase();
      d.prepare('SELECT 1').get();
      services.push({
        name: 'Database',
        status: 'healthy',
        lastCheck: now,
        latency: Date.now() - dbStart,
      });
    } catch {
      services.push({
        name: 'Database',
        status: 'down',
        lastCheck: now,
        latency: Date.now() - dbStart,
      });
    }

    // Check WebSocket (if broadcast function exists, WS server is up)
    services.push({
      name: 'WebSocket',
      status: typeof broadcast === 'function' ? 'healthy' : 'down',
      lastCheck: now,
      latency: 0,
    });

    // Check File Watcher — inferred from environment
    const fileWatcherStatus: ServiceStatus = {
      name: 'File Watcher',
      status: process.env.MC_WATCH_DIR || process.env.MC_PROJECT_DIR ? 'healthy' : 'degraded',
      lastCheck: now,
      latency: 0,
    };
    services.push(fileWatcherStatus);

    // Check Git Watcher — inferred from environment
    const gitWatcherStatus: ServiceStatus = {
      name: 'Git Watcher',
      status: process.env.MC_GIT_CWD || process.env.MC_PROJECT_DIR ? 'healthy' : 'degraded',
      lastCheck: now,
      latency: 0,
    };
    services.push(gitWatcherStatus);

    res.json({ services });
  });

  return router;
}
