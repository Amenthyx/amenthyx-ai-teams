import { Router, Request, Response } from 'express';
import type { WebSocket } from 'ws';
import type { BudgetInfo } from '../types/events';
import { getBudget, updateBudget } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Budget routes factory.
 */
export function createBudgetRouter(
  wsClients: Set<WebSocket>,
  broadcast: (data: Record<string, unknown>) => void
): Router {
  const router = Router();

  /**
   * GET /api/budget
   * Return the current budget state.
   */
  router.get('/budget', (_req: Request, res: Response) => {
    try {
      const budget = getBudget();
      if (!budget) {
        res.json({
          budget: {
            total: 0,
            spent: 0,
            currency: 'USD',
            alertThreshold: 0.8,
          },
        });
        return;
      }
      res.json({ budget });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get budget: ${message}`);
      res.status(500).json({ error: 'Failed to get budget', detail: message });
    }
  });

  /**
   * POST /api/budget
   * Set or update the budget.
   */
  router.post('/budget', (req: Request, res: Response) => {
    try {
      const budgetData = req.body as Partial<BudgetInfo>;
      const updated = updateBudget(budgetData);
      broadcast({ type: 'budget', data: updated });

      log('info', `Budget updated: $${updated.spent}/$${updated.total} ${updated.currency}`);
      res.json({ budget: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to update budget: ${message}`);
      res.status(500).json({ error: 'Failed to update budget', detail: message });
    }
  });

  return router;
}
