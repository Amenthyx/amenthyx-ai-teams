import { Router } from 'express';
import * as crypto from 'crypto';
import { getDecisions, insertDecision, updateDecision } from '../db/database';

export function createDecisionsRouter(broadcast: Function): Router {
  const router = Router();

  router.get('/decisions', (_req, res) => {
    const status = typeof _req.query.status === 'string' ? _req.query.status : undefined;
    const decisions = getDecisions(status);
    res.json({ decisions });
  });

  router.post('/decisions', (req, res) => {
    const { title, context, decision_text, rationale, decided_by, status } = req.body;
    if (!title || !decision_text) {
      res.status(400).json({ error: 'title and decision_text are required' });
      return;
    }
    const decision = insertDecision({
      id: crypto.randomUUID(),
      title,
      context,
      decision_text,
      rationale,
      decided_by,
      status: status || 'proposed',
    });
    broadcast({ type: 'decision', action: 'created', data: decision });
    res.status(201).json(decision);
  });

  router.patch('/decisions/:id', (req, res) => {
    const updated = updateDecision(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Decision not found' });
      return;
    }
    broadcast({ type: 'decision', action: 'updated', data: updated });
    res.json(updated);
  });

  return router;
}
