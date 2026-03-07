import { Router } from 'express';
import { getUATCases } from '../db/database';

export function createScreenshotsRouter(): Router {
  const router = Router();

  router.get('/screenshots', (req, res) => {
    const suiteId = typeof req.query.suiteId === 'string' ? req.query.suiteId : undefined;
    const cases = getUATCases(suiteId);

    const screenshots = cases
      .filter((c) => c.screenshotBefore || c.screenshotAfter || c.screenshotError)
      .map((c) => ({
        caseId: c.id,
        suiteId: c.suiteId,
        title: c.title,
        executedBy: c.executedBy,
        executedAt: c.executedAt,
        before: c.screenshotBefore || null,
        after: c.screenshotAfter || null,
        error: c.screenshotError || null,
      }));

    res.json({ screenshots });
  });

  return router;
}
