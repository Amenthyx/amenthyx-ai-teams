import { Router } from 'express';
import * as crypto from 'crypto';
import { getArtifacts, insertArtifact } from '../db/database';

export function createArtifactsRouter(broadcast: Function): Router {
  const router = Router();

  router.get('/artifacts', (req, res) => {
    const wave = req.query.wave ? parseInt(req.query.wave as string, 10) : undefined;
    res.json({ artifacts: getArtifacts(wave) });
  });

  router.post('/artifacts', (req, res) => {
    const { name, type, size, hash, path, producer_agent, wave } = req.body;
    if (!name || !type) {
      res.status(400).json({ error: 'name and type are required' });
      return;
    }
    const artifact = insertArtifact({
      id: crypto.randomUUID(),
      name, type, size: size || 0, hash, path, producer_agent, wave,
    });
    broadcast({ type: 'artifact', action: 'created', data: artifact });
    res.status(201).json(artifact);
  });

  return router;
}
