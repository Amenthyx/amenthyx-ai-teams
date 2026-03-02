import { Router, Request, Response } from 'express';
import * as crypto from 'crypto';
import type { WebSocket } from 'ws';
import {
  validateEvent,
  EventCategory,
  type MissionControlEvent,
  type Severity,
} from '../types/events';
import { insertEvent, getEvents, type EventFilters } from '../db/database';
import { translateClaudeCodeEvent } from '../adapters/claude-code-adapter';
import { translateCliEvent } from '../adapters/cli-wrapper';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Event routes factory.
 * Provides REST endpoints for ingesting and querying events.
 */
export function createEventsRouter(
  wsClients: Set<WebSocket>,
  broadcast: (data: Record<string, unknown>) => void,
  sessionId: string
): Router {
  const router = Router();

  /**
   * POST /api/events
   * Ingest a raw MissionControlEvent.
   */
  router.post('/events', (req: Request, res: Response) => {
    try {
      const event = validateEvent(req.body);
      if (!event) {
        res.status(400).json({ error: 'Invalid event schema' });
        return;
      }

      // Ensure ID
      if (!event.id) {
        event.id = crypto.randomUUID();
      }

      insertEvent(event);
      broadcast({ type: 'event', data: event });

      log('info', `Event ingested: ${event.category}/${event.type} [${event.severity}]`);
      res.status(201).json({ id: event.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to ingest event: ${message}`);
      res.status(500).json({ error: 'Failed to store event', detail: message });
    }
  });

  /**
   * POST /api/events/claude-code
   * Claude Code adapter endpoint. Translates hook payloads to MissionControlEvent.
   */
  router.post('/events/claude-code', (req: Request, res: Response) => {
    try {
      const event = translateClaudeCodeEvent(req.body, sessionId);
      insertEvent(event);
      broadcast({ type: 'event', data: event });

      log('info', `Claude Code event: ${event.category}/${event.type} [${event.severity}]`);
      res.status(201).json({ id: event.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to process Claude Code event: ${message}`);
      res.status(500).json({ error: 'Failed to process Claude Code event', detail: message });
    }
  });

  /**
   * POST /api/events/cli
   * CLI adapter endpoint. Translates wrapped CLI output to MissionControlEvent.
   */
  router.post('/events/cli', (req: Request, res: Response) => {
    try {
      const event = translateCliEvent(req.body, sessionId);
      insertEvent(event);
      broadcast({ type: 'event', data: event });

      log('info', `CLI event: ${event.category}/${event.type} [${event.severity}]`);
      res.status(201).json({ id: event.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to process CLI event: ${message}`);
      res.status(500).json({ error: 'Failed to process CLI event', detail: message });
    }
  });

  /**
   * GET /api/events
   * Query events with optional filters.
   * Query params: agent, category, severity, limit, offset, since
   */
  router.get('/events', (req: Request, res: Response) => {
    try {
      const filters: EventFilters = {};

      if (typeof req.query.agent === 'string') {
        filters.agent_role = req.query.agent;
      }
      if (typeof req.query.category === 'string') {
        const cat = req.query.category.toUpperCase();
        if (Object.values(EventCategory).includes(cat as EventCategory)) {
          filters.category = cat as EventCategory;
        }
      }
      if (typeof req.query.severity === 'string') {
        const validSeverities: Severity[] = ['info', 'warn', 'error', 'critical'];
        if (validSeverities.includes(req.query.severity as Severity)) {
          filters.severity = req.query.severity as Severity;
        }
      }
      if (typeof req.query.limit === 'string') {
        const limit = parseInt(req.query.limit, 10);
        if (!isNaN(limit) && limit > 0) {
          filters.limit = Math.min(limit, 1000);
        }
      }
      if (typeof req.query.offset === 'string') {
        const offset = parseInt(req.query.offset, 10);
        if (!isNaN(offset) && offset >= 0) {
          filters.offset = offset;
        }
      }
      if (typeof req.query.since === 'string') {
        filters.since = req.query.since;
      }

      const result = getEvents(filters);
      res.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to query events: ${message}`);
      res.status(500).json({ error: 'Failed to query events', detail: message });
    }
  });

  return router;
}
