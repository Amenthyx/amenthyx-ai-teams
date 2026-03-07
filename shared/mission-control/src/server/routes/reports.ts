import { Router } from 'express';
import { generateHTMLReport } from '../services/pdf-generator';

export function createReportsRouter(): Router {
  const router = Router();

  router.post('/reports/generate', (req, res) => {
    const sections: string[] = req.body.sections || ['agents', 'budget', 'waves', 'events'];
    const html = generateHTMLReport(sections);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment; filename="mission-control-report.html"');
    res.send(html);
  });

  router.get('/reports', (_req, res) => {
    res.json({ available: ['agents', 'budget', 'waves', 'events', 'tests', 'kanban'] });
  });

  return router;
}
