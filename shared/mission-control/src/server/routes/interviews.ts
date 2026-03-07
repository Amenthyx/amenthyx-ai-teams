import { Router } from 'express';
import * as crypto from 'crypto';
import { getInterviews, insertInterview } from '../db/database';

export function createInterviewsRouter(broadcast: Function): Router {
  const router = Router();

  router.get('/interviews', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const interviews = getInterviews(category);
    res.json({ interviews });
  });

  router.post('/interviews', (req, res) => {
    const { question, answer, implications, category, order_num } = req.body;
    if (!question || !answer) {
      res.status(400).json({ error: 'question and answer are required' });
      return;
    }
    const interview = insertInterview({
      id: crypto.randomUUID(),
      question,
      answer,
      implications,
      category: category || 'general',
      order_num: order_num ?? 0,
    });
    broadcast({ type: 'interview', action: 'created', data: interview });
    res.status(201).json(interview);
  });

  return router;
}
