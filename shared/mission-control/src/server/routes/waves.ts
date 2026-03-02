import { Router, Request, Response } from 'express';
import type { WebSocket } from 'ws';
import type { WaveInfo } from '../types/events';
import { getWaves, upsertWave, updateWave } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Wave routes factory.
 */
export function createWavesRouter(
  wsClients: Set<WebSocket>,
  broadcast: (data: Record<string, unknown>) => void
): Router {
  const router = Router();

  /**
   * GET /api/waves
   * Return all waves.
   */
  router.get('/waves', (_req: Request, res: Response) => {
    try {
      const waves = getWaves();
      res.json({ waves });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get waves: ${message}`);
      res.status(500).json({ error: 'Failed to get waves', detail: message });
    }
  });

  /**
   * POST /api/waves
   * Bulk upsert waves.
   */
  router.post('/waves', (req: Request, res: Response) => {
    try {
      const waves = req.body as WaveInfo[];
      if (!Array.isArray(waves)) {
        res.status(400).json({ error: 'Request body must be an array of WaveInfo objects' });
        return;
      }

      for (const wave of waves) {
        if (wave.number === undefined || !wave.name) {
          res.status(400).json({ error: 'Wave missing required fields: number and name' });
          return;
        }
        upsertWave(wave);
      }

      const updated = getWaves();
      broadcast({ type: 'waves', data: updated });

      log('info', `Upserted ${waves.length} waves`);
      res.json({ waves: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to upsert waves: ${message}`);
      res.status(500).json({ error: 'Failed to upsert waves', detail: message });
    }
  });

  /**
   * PATCH /api/waves/:number
   * Update a single wave's status and/or gate.
   */
  router.patch('/waves/:number', (req: Request, res: Response) => {
    try {
      const waveNumber = parseInt(req.params.number, 10);
      if (isNaN(waveNumber)) {
        res.status(400).json({ error: 'Invalid wave number' });
        return;
      }

      const updates = req.body as Partial<Pick<WaveInfo, 'status' | 'gate'>>;
      const updated = updateWave(waveNumber, updates);
      if (!updated) {
        res.status(404).json({ error: `Wave ${waveNumber} not found` });
        return;
      }

      broadcast({ type: 'wave_update', data: updated });

      log('info', `Updated wave ${waveNumber}: ${JSON.stringify(updates)}`);
      res.json({ wave: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to update wave: ${message}`);
      res.status(500).json({ error: 'Failed to update wave', detail: message });
    }
  });

  return router;
}
