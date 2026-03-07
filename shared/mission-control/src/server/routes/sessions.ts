import { Router } from 'express';
import * as crypto from 'crypto';
import { getSessions, insertSession, deleteSession } from '../db/database';

export function createSessionsRouter(broadcast: Function): Router {
  const router = Router();

  // GET /sessions - list all sessions
  router.get('/sessions', (_req, res) => {
    try {
      const sessions = getSessions();
      res.json({ sessions });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch sessions' });
    }
  });

  // POST /sessions - create a new session
  router.post('/sessions', (req, res) => {
    try {
      const { name, config } = req.body;
      if (!name) {
        res.status(400).json({ error: 'name is required' });
        return;
      }
      const session = insertSession({
        id: crypto.randomUUID(),
        name,
        config,
      });
      broadcast({ type: 'session', action: 'created', data: session });
      res.status(201).json(session);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create session' });
    }
  });

  // GET /sessions/:id - get a single session
  router.get('/sessions/:id', (req, res) => {
    try {
      const sessions = getSessions();
      const session = sessions.find((s) => s.id === req.params.id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      res.json(session);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch session' });
    }
  });

  // DELETE /sessions/:id - delete a session
  router.delete('/sessions/:id', (req, res) => {
    try {
      const deleted = deleteSession(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      broadcast({ type: 'session', action: 'deleted', data: { id: req.params.id } });
      res.json({ success: true, id: req.params.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete session' });
    }
  });

  return router;
}
