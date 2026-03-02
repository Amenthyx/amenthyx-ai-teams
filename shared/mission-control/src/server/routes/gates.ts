import { Router, Request, Response } from 'express';
import * as crypto from 'crypto';
import { insertGate, getGates, resolveGate } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Gate routes factory.
 * Provides REST endpoints for creating, listing, and resolving approval gates.
 */
export function createGatesRouter(
  broadcast: (data: Record<string, unknown>) => void
): Router {
  const router = Router();

  /**
   * GET /api/gates
   * List gates, optionally filtered by status (?status=pending).
   */
  router.get('/gates', (req: Request, res: Response) => {
    try {
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const gates = getGates(status);
      res.json({ gates });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to list gates: ${message}`);
      res.status(500).json({ error: 'Failed to list gates', detail: message });
    }
  });

  /**
   * POST /api/gates
   * Create a new gate (from agents or TL).
   * Body: { gate_type, message, payload?, source?, blocking? }
   */
  router.post('/gates', (req: Request, res: Response) => {
    try {
      const { gate_type, message, payload, source, blocking } = req.body;

      if (!gate_type || typeof gate_type !== 'string') {
        res.status(400).json({ error: 'gate_type is required' });
        return;
      }

      const id = crypto.randomUUID();
      const gate = insertGate({
        id,
        gate_type,
        message: message || '',
        payload: payload || {},
        source,
        blocking: blocking !== false,
      });

      // Broadcast to all connected clients
      broadcast({
        type: 'gate',
        action: 'created',
        data: gate,
      });

      log('info', `Gate created: ${gate_type} [${id}]`);
      res.status(201).json(gate);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to create gate: ${message}`);
      res.status(500).json({ error: 'Failed to create gate', detail: message });
    }
  });

  /**
   * PATCH /api/gates/:id
   * Resolve a gate with user decision.
   * Body: { decision: string }
   */
  router.patch('/gates/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { decision } = req.body;

      if (!decision || typeof decision !== 'string') {
        res.status(400).json({ error: 'decision is required' });
        return;
      }

      const gate = resolveGate(id, decision);
      if (!gate) {
        res.status(404).json({ error: 'Gate not found' });
        return;
      }

      // Broadcast resolution to all connected clients
      broadcast({
        type: 'gate',
        action: 'resolved',
        data: gate,
      });

      log('info', `Gate resolved: ${gate.gate_type} [${id}] -> ${decision}`);
      res.json(gate);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to resolve gate: ${message}`);
      res.status(500).json({ error: 'Failed to resolve gate', detail: message });
    }
  });

  return router;
}
