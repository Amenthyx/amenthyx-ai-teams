import { Router, Request, Response } from 'express';
import type { WebSocket } from 'ws';

/**
 * Health check route factory.
 * Accepts the WS clients set and a sessionId for runtime info.
 */
export function createHealthRouter(
  wsClients: Set<WebSocket>,
  sessionId: string
): Router {
  const router = Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      version: '1.0.0',
      uptime: process.uptime(),
      connectedClients: wsClients.size,
      sessionId,
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
