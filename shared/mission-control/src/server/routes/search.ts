import { Router } from 'express';
import { searchAll } from '../db/database';

export function createSearchRouter(): Router {
  const router = Router();

  router.get('/search', (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    if (!q || q.length < 2) {
      res.json({ results: [] });
      return;
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const results = searchAll(q, limit);
    res.json({ results, query: q });
  });

  return router;
}
