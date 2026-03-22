import { Router } from 'express';
import { generateHTMLReport } from '../services/pdf-generator';
import { generateEnterprisePDF } from '../services/enterprise-pdf-generator';

export function createReportsRouter(): Router {
  const router = Router();

  /**
   * POST /api/reports/generate
   * Custom report with selected sections.
   */
  router.post('/reports/generate', (req, res) => {
    const sections: string[] = req.body.sections || ['agents', 'budget', 'waves', 'events'];
    const html = generateHTMLReport(sections);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment; filename="mission-control-report.html"');
    res.send(html);
  });

  /**
   * GET /api/reports
   * Lists available report sections.
   */
  router.get('/reports', (_req, res) => {
    res.json({
      available: [
        'overview', 'agents', 'budget', 'waves', 'gates',
        'interview', 'decisions', 'cicd', 'tests', 'evidence',
        'artifacts', 'messages', 'events', 'kanban',
      ],
      formats: ['html', 'pdf'],
      enterprisePdf: '/api/export/pdf/preview',
    });
  });

  return router;
}
