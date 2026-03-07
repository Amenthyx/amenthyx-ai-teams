import { Router, Request, Response } from 'express';
import * as crypto from 'crypto';

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  platform: 'slack' | 'discord' | 'generic';
  createdAt: string;
}

interface WebhookPayload {
  event: string;
  category: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

function signPayload(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function formatSlackPayload(payload: WebhookPayload): Record<string, unknown> {
  return {
    text: `[${payload.category}] ${payload.message}`,
    attachments: [
      {
        color: '#3B82F6',
        title: payload.event,
        text: payload.message,
        ts: Math.floor(new Date(payload.timestamp).getTime() / 1000),
        fields: payload.data
          ? Object.entries(payload.data).map(([title, value]) => ({
              title,
              value: String(value),
              short: true,
            }))
          : [],
      },
    ],
  };
}

function formatDiscordPayload(payload: WebhookPayload): Record<string, unknown> {
  return {
    embeds: [
      {
        title: payload.event,
        description: payload.message,
        color: 0x3b82f6,
        timestamp: payload.timestamp,
        footer: { text: `Category: ${payload.category}` },
        fields: payload.data
          ? Object.entries(payload.data).map(([name, value]) => ({
              name,
              value: String(value),
              inline: true,
            }))
          : [],
      },
    ],
  };
}

function formatGenericPayload(payload: WebhookPayload): Record<string, unknown> {
  return { ...payload };
}

let webhooks: WebhookConfig[] = [];

export async function forwardToWebhooks(payload: WebhookPayload): Promise<void> {
  const matching = webhooks.filter(
    (wh) => wh.active && (wh.events.length === 0 || wh.events.includes(payload.category))
  );

  const results = matching.map(async (wh) => {
    let body: Record<string, unknown>;
    switch (wh.platform) {
      case 'slack':
        body = formatSlackPayload(payload);
        break;
      case 'discord':
        body = formatDiscordPayload(payload);
        break;
      default:
        body = formatGenericPayload(payload);
    }

    const bodyStr = JSON.stringify(body);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (wh.secret) {
      headers['X-Webhook-Signature'] = signPayload(bodyStr, wh.secret);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      await fetch(wh.url, {
        method: 'POST',
        headers,
        body: bodyStr,
        signal: controller.signal,
      });
      log('info', `Webhook delivered to ${wh.id} (${wh.platform})`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('warn', `Webhook delivery failed for ${wh.id}: ${message}`);
    } finally {
      clearTimeout(timeout);
    }
  });

  await Promise.allSettled(results);
}

export function createWebhooksRouter(broadcast: Function): Router {
  const router = Router();

  // GET /webhooks - list all configured webhooks
  router.get('/webhooks', (_req: Request, res: Response) => {
    // Omit secrets from response
    const safe = webhooks.map(({ secret, ...rest }) => ({
      ...rest,
      hasSecret: !!secret,
    }));
    res.json(safe);
  });

  // POST /webhooks - register a new webhook
  router.post('/webhooks', (req: Request, res: Response) => {
    const { url, events, secret, platform } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'url is required' });
      return;
    }
    const wh: WebhookConfig = {
      id: crypto.randomUUID(),
      url,
      events: Array.isArray(events) ? events : [],
      active: true,
      secret: typeof secret === 'string' && secret.length > 0 ? secret : undefined,
      platform: ['slack', 'discord', 'generic'].includes(platform) ? platform : 'generic',
      createdAt: new Date().toISOString(),
    };
    webhooks.push(wh);
    broadcast({ type: 'webhook:created', data: { id: wh.id } });
    log('info', `Webhook registered: ${wh.id} -> ${wh.url}`);
    res.status(201).json({ id: wh.id });
  });

  // DELETE /webhooks/:id - remove a webhook
  router.delete('/webhooks/:id', (req: Request, res: Response) => {
    const idx = webhooks.findIndex((wh) => wh.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Webhook not found' });
      return;
    }
    webhooks.splice(idx, 1);
    broadcast({ type: 'webhook:deleted', data: { id: req.params.id } });
    log('info', `Webhook removed: ${req.params.id}`);
    res.json({ ok: true });
  });

  // PATCH /webhooks/:id - toggle active state or update fields
  router.patch('/webhooks/:id', (req: Request, res: Response) => {
    const wh = webhooks.find((w) => w.id === req.params.id);
    if (!wh) {
      res.status(404).json({ error: 'Webhook not found' });
      return;
    }
    if (typeof req.body.active === 'boolean') wh.active = req.body.active;
    if (typeof req.body.url === 'string') wh.url = req.body.url;
    if (Array.isArray(req.body.events)) wh.events = req.body.events;
    if (typeof req.body.platform === 'string') wh.platform = req.body.platform;
    broadcast({ type: 'webhook:updated', data: { id: wh.id } });
    res.json({ ok: true });
  });

  // POST /webhooks/:id/test - send a test payload
  router.post('/webhooks/:id/test', async (req: Request, res: Response) => {
    const wh = webhooks.find((w) => w.id === req.params.id);
    if (!wh) {
      res.status(404).json({ error: 'Webhook not found' });
      return;
    }
    const testPayload: WebhookPayload = {
      event: 'webhook.test',
      category: 'SYSTEM',
      message: 'This is a test notification from Mission Control.',
      timestamp: new Date().toISOString(),
      data: { source: 'mission-control', test: true },
    };

    // Temporarily force-match this webhook
    const originalEvents = wh.events;
    const originalActive = wh.active;
    wh.events = [];
    wh.active = true;
    await forwardToWebhooks(testPayload);
    wh.events = originalEvents;
    wh.active = originalActive;

    res.json({ ok: true, message: 'Test payload sent' });
  });

  // POST /webhooks/notify - internal: forward event to all matching webhooks
  router.post('/webhooks/notify', async (req: Request, res: Response) => {
    const { event, category, message, data } = req.body;
    if (!event || !message) {
      res.status(400).json({ error: 'event and message are required' });
      return;
    }
    const payload: WebhookPayload = {
      event,
      category: category || 'CUSTOM',
      message,
      timestamp: new Date().toISOString(),
      data,
    };
    await forwardToWebhooks(payload);
    res.json({ ok: true });
  });

  return router;
}
