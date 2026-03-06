import { Router, Request, Response } from 'express';
import * as crypto from 'crypto';
import { WebSocket } from 'ws';
import {
  getUATSuites, upsertUATSuite, getUATCases, upsertUATCase, getUATSummary
} from '../db/database';

export function createUATRouter(
  wsClients: Set<WebSocket>,
  broadcast: (data: Record<string, unknown>) => void
): Router {
  const router = Router();

  // GET /api/uat/summary — UAT dashboard summary
  router.get('/uat/summary', (_req: Request, res: Response) => {
    try {
      const summary = getUATSummary();
      res.json({ summary });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: msg });
    }
  });

  // GET /api/uat/suites — List all UAT suites
  router.get('/uat/suites', (_req: Request, res: Response) => {
    try {
      const suites = getUATSuites();
      res.json({ suites });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: msg });
    }
  });

  // POST /api/uat/suites — Create or update a UAT suite
  router.post('/uat/suites', (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.code || !body.name) {
        res.status(400).json({ error: 'code and name are required' });
        return;
      }
      const suite = upsertUATSuite({
        id: body.id || crypto.randomUUID(),
        code: body.code,
        name: body.name,
        totalCases: body.totalCases,
        passed: body.passed,
        failed: body.failed,
        blocked: body.blocked,
        skipped: body.skipped,
        coverage: body.coverage,
        status: body.status,
      });
      broadcast({ type: 'uat_suite', action: 'upsert', data: suite });
      res.json({ suite });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: msg });
    }
  });

  // GET /api/uat/cases — List test cases (optionally by suite)
  router.get('/uat/cases', (req: Request, res: Response) => {
    try {
      const suiteId = req.query.suiteId as string | undefined;
      const cases = getUATCases(suiteId);
      res.json({ cases, total: cases.length });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: msg });
    }
  });

  // POST /api/uat/cases — Create or update a UAT test case
  router.post('/uat/cases', (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body.suiteId || !body.title) {
        res.status(400).json({ error: 'suiteId and title are required' });
        return;
      }
      const testCase = upsertUATCase({
        id: body.id || crypto.randomUUID(),
        suiteId: body.suiteId,
        title: body.title,
        feature: body.feature,
        priority: body.priority,
        ctaElement: body.ctaElement,
        ctaSelector: body.ctaSelector,
        userRole: body.userRole,
        device: body.device,
        browser: body.browser,
        compliance: body.compliance,
        preconditions: body.preconditions,
        steps: body.steps,
        expectedResult: body.expectedResult,
        actualResult: body.actualResult,
        status: body.status,
        screenshotBefore: body.screenshotBefore,
        screenshotAfter: body.screenshotAfter,
        screenshotError: body.screenshotError,
        consoleLog: body.consoleLog,
        networkLog: body.networkLog,
        defectId: body.defectId,
        defectSeverity: body.defectSeverity,
        executedBy: body.executedBy,
        executedAt: body.executedAt,
        durationMs: body.durationMs,
        environment: body.environment,
        build: body.build,
        round: body.round,
        retryCount: body.retryCount,
      });
      broadcast({ type: 'uat_case', action: 'upsert', data: testCase });
      res.json({ testCase });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: msg });
    }
  });

  // POST /api/uat/cases/batch — Batch upsert test cases
  router.post('/uat/cases/batch', (req: Request, res: Response) => {
    try {
      const cases = req.body.cases;
      if (!Array.isArray(cases)) {
        res.status(400).json({ error: 'cases must be an array' });
        return;
      }
      const results = cases.map((c: Record<string, unknown>) =>
        upsertUATCase({
          id: (c.id as string) || crypto.randomUUID(),
          suiteId: c.suiteId as string,
          title: c.title as string,
          feature: c.feature as string | undefined,
          priority: c.priority as string | undefined,
          ctaElement: c.ctaElement as string | undefined,
          ctaSelector: c.ctaSelector as string | undefined,
          userRole: c.userRole as string | undefined,
          device: c.device as string | undefined,
          browser: c.browser as string | undefined,
          compliance: c.compliance as string[] | undefined,
          preconditions: c.preconditions as string[] | undefined,
          steps: c.steps as Array<{ number: number; action: string; element: string; inputData?: string }> | undefined,
          expectedResult: c.expectedResult as string | undefined,
          actualResult: c.actualResult as string | undefined,
          status: c.status as string | undefined,
          screenshotBefore: c.screenshotBefore as string | undefined,
          screenshotAfter: c.screenshotAfter as string | undefined,
          screenshotError: c.screenshotError as string | undefined,
          defectId: c.defectId as string | undefined,
          defectSeverity: c.defectSeverity as string | undefined,
          executedBy: c.executedBy as string | undefined,
          executedAt: c.executedAt as string | undefined,
          durationMs: c.durationMs as number | undefined,
          environment: c.environment as string | undefined,
          build: c.build as string | undefined,
          round: c.round as number | undefined,
          retryCount: c.retryCount as number | undefined,
        })
      );
      broadcast({ type: 'uat_batch', action: 'upsert', count: results.length });
      res.json({ cases: results, total: results.length });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: msg });
    }
  });

  // GET /api/uat/export/all — Export all UAT data as JSON
  router.get('/uat/export/all', (req: Request, res: Response) => {
    try {
      const format = req.query.format as string || 'json';
      const suites = getUATSuites();
      const allCases = getUATCases();
      const summary = getUATSummary();

      if (format === 'csv') {
        const header = 'Test Case ID,Title,Suite,Feature,Priority,CTA Element,User Role,Device,Browser,Compliance,Status,Expected Result,Actual Result,Duration (ms),Defect ID,Defect Severity,Screenshot Before,Screenshot After,Executed By,Executed At,Environment,Build,Round';
        const rows = allCases.map(c => {
          const suiteCode = suites.find(s => s.id === c.suiteId)?.code || c.suiteId;
          return [
            c.id, c.title, suiteCode, c.feature || '', c.priority,
            c.ctaElement || '', c.userRole || '', c.device || '', c.browser || '',
            (c.compliance || []).join(';'), c.status,
            (c.expectedResult || '').replace(/,/g, ';'), (c.actualResult || '').replace(/,/g, ';'),
            c.durationMs, c.defectId || '', c.defectSeverity || '',
            c.screenshotBefore || '', c.screenshotAfter || '',
            c.executedBy || '', c.executedAt || '', c.environment || '', c.build || '', c.round
          ].join(',');
        });
        const csv = [header, ...rows].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=uat_results_${Date.now()}.csv`);
        res.send(csv);
        return;
      }

      const exportData = {
        generatedAt: new Date().toISOString(),
        summary,
        suites: suites.map(s => ({
          ...s,
          cases: allCases.filter(c => c.suiteId === s.id),
        })),
      };
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=uat_results_${Date.now()}.json`);
      res.json(exportData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: msg });
    }
  });

  // GET /api/uat/export/suite/:code — Export single suite
  router.get('/uat/export/suite/:code', (req: Request, res: Response) => {
    try {
      const suites = getUATSuites();
      const suite = suites.find(s => s.code === req.params.code);
      if (!suite) {
        res.status(404).json({ error: `Suite ${req.params.code} not found` });
        return;
      }
      const cases = getUATCases(suite.id);
      const format = req.query.format as string || 'json';

      if (format === 'csv') {
        const header = 'Test Case ID,Title,Priority,CTA Element,User Role,Status,Expected Result,Actual Result,Duration (ms),Defect ID';
        const rows = cases.map(c => [
          c.id, c.title, c.priority, c.ctaElement || '', c.userRole || '',
          c.status, (c.expectedResult || '').replace(/,/g, ';'),
          (c.actualResult || '').replace(/,/g, ';'), c.durationMs, c.defectId || ''
        ].join(','));
        const csv = [header, ...rows].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=uat_suite_${suite.code}_${Date.now()}.csv`);
        res.send(csv);
        return;
      }

      res.setHeader('Content-Disposition', `attachment; filename=uat_suite_${suite.code}_${Date.now()}.json`);
      res.json({ suite: { ...suite, cases } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: msg });
    }
  });

  // GET /api/uat/export/case/:id — Export single test case
  router.get('/uat/export/case/:id', (req: Request, res: Response) => {
    try {
      const allCases = getUATCases();
      const testCase = allCases.find(c => c.id === req.params.id);
      if (!testCase) {
        res.status(404).json({ error: `Test case ${req.params.id} not found` });
        return;
      }
      res.setHeader('Content-Disposition', `attachment; filename=uat_case_${req.params.id}_${Date.now()}.json`);
      res.json({ testCase });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: msg });
    }
  });

  return router;
}
