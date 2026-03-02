import { Router, Request, Response } from 'express';
import type { WebSocket } from 'ws';
import type { AgentInfo } from '../types/events';
import { getAgents, upsertAgent, updateAgent } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Agent routes factory.
 */
export function createAgentsRouter(
  wsClients: Set<WebSocket>,
  broadcast: (data: Record<string, unknown>) => void
): Router {
  const router = Router();

  /**
   * GET /api/agents
   * Return all agents from the database.
   */
  router.get('/agents', (_req: Request, res: Response) => {
    try {
      const agents = getAgents();
      res.json({ agents });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to get agents: ${message}`);
      res.status(500).json({ error: 'Failed to get agents', detail: message });
    }
  });

  /**
   * POST /api/agents
   * Bulk upsert agent roster.
   */
  router.post('/agents', (req: Request, res: Response) => {
    try {
      const agents = req.body as AgentInfo[];
      if (!Array.isArray(agents)) {
        res.status(400).json({ error: 'Request body must be an array of AgentInfo objects' });
        return;
      }

      for (const agent of agents) {
        if (!agent.role || !agent.name) {
          res.status(400).json({ error: `Agent missing required fields: role and name` });
          return;
        }
        upsertAgent(agent);
      }

      const updated = getAgents();
      broadcast({ type: 'agents', data: updated });

      log('info', `Upserted ${agents.length} agents`);
      res.json({ agents: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to upsert agents: ${message}`);
      res.status(500).json({ error: 'Failed to upsert agents', detail: message });
    }
  });

  /**
   * PATCH /api/agents/:role
   * Update a single agent's mutable fields.
   */
  router.patch('/agents/:role', (req: Request, res: Response) => {
    try {
      const { role } = req.params;
      const updates = req.body as Partial<
        Pick<AgentInfo, 'status' | 'currentTask' | 'tokensUsed' | 'costUsd' | 'wave'>
      >;

      const updated = updateAgent(role, updates);
      if (!updated) {
        res.status(404).json({ error: `Agent with role '${role}' not found` });
        return;
      }

      broadcast({ type: 'agent_update', data: updated });

      log('info', `Updated agent ${role}: ${JSON.stringify(updates)}`);
      res.json({ agent: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to update agent: ${message}`);
      res.status(500).json({ error: 'Failed to update agent', detail: message });
    }
  });

  return router;
}
