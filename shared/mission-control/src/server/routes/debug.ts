import { Router } from 'express';
import { getProfile } from '../services/profiler';
import { getDatabaseHealth } from '../db/database';

export function createDebugRouter(): Router {
  const router = Router();

  router.get('/debug/profile', (_req, res) => {
    res.json({ profile: getProfile(), database: getDatabaseHealth() });
  });

  return router;
}
