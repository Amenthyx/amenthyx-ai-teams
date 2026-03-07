import { Router, Request, Response } from 'express';
import { generateMarkdownReport } from '../services/markdown-exporter';
import { generateHtmlReport } from '../services/html-exporter';
import { getEvents, getAgents, getBudget, getWaves } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Export routes factory.
 * Generates downloadable session reports in multiple formats.
 */
export function createExportRouter(): Router {
  const router = Router();

  /**
   * GET /api/export/markdown
   * Returns the session report as a Markdown file.
   */
  router.get('/export/markdown', (_req: Request, res: Response) => {
    try {
      const report = generateMarkdownReport();

      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="mission-control-report.md"');
      res.send(report);

      log('info', 'Exported session report as Markdown');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to export Markdown report: ${message}`);
      res.status(500).json({ error: 'Failed to export Markdown report', detail: message });
    }
  });

  /**
   * GET /api/export/html
   * Returns the session report as a styled HTML file.
   */
  router.get('/export/html', (_req: Request, res: Response) => {
    try {
      const report = generateHtmlReport();

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="mission-control-report.html"');
      res.send(report);

      log('info', 'Exported session report as HTML');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to export HTML report: ${message}`);
      res.status(500).json({ error: 'Failed to export HTML report', detail: message });
    }
  });

  /**
   * GET /api/export/json
   * Returns a full JSON dump of the session state.
   */
  router.get('/export/json', (_req: Request, res: Response) => {
    try {
      const { events, total } = getEvents({ limit: 1000 });
      const agents = getAgents();
      const budget = getBudget();
      const waves = getWaves();

      const report = {
        generatedAt: new Date().toISOString(),
        budget,
        waves,
        agents,
        events: {
          total,
          items: events,
        },
      };

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="mission-control-report.json"');
      res.json(report);

      log('info', 'Exported session report as JSON');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to export JSON report: ${message}`);
      res.status(500).json({ error: 'Failed to export JSON report', detail: message });
    }
  });

  return router;
}
