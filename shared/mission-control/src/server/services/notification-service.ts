import * as crypto from 'crypto';
import { getDatabase } from '../db/database';
import type { MissionControlEvent, Severity } from '../types/events';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WebhookRow {
  id: string;
  url: string;
  events: string;       // JSON array of event categories
  severities: string;   // JSON array of severity levels
  active: number;
  secret: string | null;
  platform: 'slack' | 'discord' | 'generic';
  created_at: string;
}

interface NotificationPayload {
  event: string;
  category: string;
  severity: Severity;
  message: string;
  timestamp: string;
  sessionId?: string;
  agent?: string;
  data?: Record<string, unknown>;
}

interface DeliveryResult {
  webhookId: string;
  success: boolean;
  statusCode?: number;
  error?: string;
  attempts: number;
}

// ---------------------------------------------------------------------------
// Severity color mapping
// ---------------------------------------------------------------------------

const SEVERITY_COLORS: Record<Severity, { hex: string; slack: string; discord: number }> = {
  info:     { hex: '#3B82F6', slack: '#3B82F6', discord: 0x3b82f6 },
  warn:     { hex: '#F59E0B', slack: '#F59E0B', discord: 0xf59e0b },
  error:    { hex: '#EF4444', slack: '#EF4444', discord: 0xef4444 },
  critical: { hex: '#DC2626', slack: '#DC2626', discord: 0xdc2626 },
};

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

// ---------------------------------------------------------------------------
// Payload formatters
// ---------------------------------------------------------------------------

function formatSlackPayload(payload: NotificationPayload): Record<string, unknown> {
  const color = SEVERITY_COLORS[payload.severity]?.slack ?? '#888888';
  const fields: Array<{ type: string; text: string }> = [];

  if (payload.agent) {
    fields.push({ type: 'mrkdwn', text: `*Agent:* ${payload.agent}` });
  }
  fields.push({ type: 'mrkdwn', text: `*Severity:* ${payload.severity.toUpperCase()}` });
  fields.push({ type: 'mrkdwn', text: `*Category:* ${payload.category}` });

  if (payload.data) {
    for (const [key, value] of Object.entries(payload.data)) {
      fields.push({ type: 'mrkdwn', text: `*${key}:* ${String(value)}` });
    }
  }

  return {
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*${payload.event}*\n${payload.message}` },
      },
      {
        type: 'section',
        fields: fields.slice(0, 10), // Slack allows max 10 fields
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Mission Control | ${payload.timestamp}` },
        ],
      },
    ],
    attachments: [{ color, fallback: payload.message }],
  };
}

function formatDiscordPayload(payload: NotificationPayload): Record<string, unknown> {
  const color = SEVERITY_COLORS[payload.severity]?.discord ?? 0x888888;
  const fields: Array<{ name: string; value: string; inline: boolean }> = [];

  if (payload.agent) {
    fields.push({ name: 'Agent', value: payload.agent, inline: true });
  }
  fields.push({ name: 'Severity', value: payload.severity.toUpperCase(), inline: true });
  fields.push({ name: 'Category', value: payload.category, inline: true });

  if (payload.data) {
    for (const [key, value] of Object.entries(payload.data)) {
      fields.push({ name: key, value: String(value), inline: true });
    }
  }

  return {
    embeds: [
      {
        title: payload.event,
        description: payload.message,
        color,
        timestamp: payload.timestamp,
        footer: { text: 'Mission Control' },
        fields: fields.slice(0, 25), // Discord allows max 25 fields
      },
    ],
  };
}

function formatGenericPayload(payload: NotificationPayload): Record<string, unknown> {
  return {
    event: payload.event,
    category: payload.category,
    severity: payload.severity,
    message: payload.message,
    timestamp: payload.timestamp,
    sessionId: payload.sessionId,
    agent: payload.agent,
    data: payload.data,
  };
}

// ---------------------------------------------------------------------------
// HMAC signing
// ---------------------------------------------------------------------------

function signPayload(body: string, secret: string): string {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
}

// ---------------------------------------------------------------------------
// Retry helper
// ---------------------------------------------------------------------------

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxAttempts: number = 3,
): Promise<{ ok: boolean; status: number; attempts: number }> {
  let lastStatus = 0;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      lastStatus = res.status;

      if (res.ok || res.status < 500) {
        return { ok: res.ok, status: res.status, attempts: attempt };
      }
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === maxAttempts) {
        throw err;
      }
    }

    // Exponential backoff: 500ms, 1500ms, 3500ms
    if (attempt < maxAttempts) {
      const delay = Math.min(500 * Math.pow(2, attempt - 1) + Math.random() * 500, 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { ok: false, status: lastStatus, attempts: maxAttempts };
}

// ---------------------------------------------------------------------------
// NotificationService class
// ---------------------------------------------------------------------------

export class NotificationService {
  /**
   * Ensure the webhooks table exists in the database.
   * Called once during service initialization.
   */
  ensureTable(): void {
    try {
      const d = getDatabase();
      d.exec(`
        CREATE TABLE IF NOT EXISTS notification_webhooks (
          id TEXT PRIMARY KEY,
          url TEXT NOT NULL,
          events TEXT NOT NULL DEFAULT '[]',
          severities TEXT NOT NULL DEFAULT '[]',
          active INTEGER NOT NULL DEFAULT 1,
          secret TEXT,
          platform TEXT NOT NULL DEFAULT 'generic',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      log('warn', `Failed to ensure notification_webhooks table: ${msg}`);
    }
  }

  /**
   * Get all active webhooks that match the given event category and severity.
   */
  private getMatchingWebhooks(category: string, severity: Severity): WebhookRow[] {
    try {
      const d = getDatabase();
      const rows = d.prepare(
        'SELECT * FROM notification_webhooks WHERE active = 1'
      ).all() as WebhookRow[];

      return rows.filter((row) => {
        // Check event category filter
        const events: string[] = JSON.parse(row.events || '[]');
        if (events.length > 0 && !events.includes(category)) {
          return false;
        }

        // Check severity filter
        const severities: string[] = JSON.parse(row.severities || '[]');
        if (severities.length > 0 && !severities.includes(severity)) {
          return false;
        }

        return true;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to query notification webhooks: ${msg}`);
      return [];
    }
  }

  /**
   * Deliver a notification for a MissionControlEvent to all matching webhooks.
   */
  async notify(event: MissionControlEvent): Promise<DeliveryResult[]> {
    const matching = this.getMatchingWebhooks(event.category, event.severity);
    if (matching.length === 0) return [];

    const payload: NotificationPayload = {
      event: event.type,
      category: event.category,
      severity: event.severity,
      message: (event.payload?.message as string) || `${event.category}/${event.type}`,
      timestamp: event.timestamp,
      sessionId: event.sessionId,
      agent: event.agent?.role,
      data: event.payload,
    };

    const results = await Promise.allSettled(
      matching.map((wh) => this.deliverToWebhook(wh, payload))
    );

    return results.map((r, idx) => {
      if (r.status === 'fulfilled') return r.value;
      return {
        webhookId: matching[idx].id,
        success: false,
        error: r.reason instanceof Error ? r.reason.message : String(r.reason),
        attempts: 3,
      };
    });
  }

  /**
   * Deliver a payload to a single webhook endpoint.
   */
  private async deliverToWebhook(
    wh: WebhookRow,
    payload: NotificationPayload
  ): Promise<DeliveryResult> {
    const platform = wh.platform as 'slack' | 'discord' | 'generic';

    let body: Record<string, unknown>;
    switch (platform) {
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

    // Add HMAC signature for generic webhooks with a secret
    if (wh.secret) {
      headers['X-Webhook-Signature'] = signPayload(bodyStr, wh.secret);
      headers['X-Webhook-Timestamp'] = new Date().toISOString();
    }

    try {
      const result = await fetchWithRetry(wh.url, {
        method: 'POST',
        headers,
        body: bodyStr,
      });

      if (result.ok) {
        log('info', `Notification delivered to ${wh.id} (${platform}) after ${result.attempts} attempt(s)`);
      } else {
        log('warn', `Notification delivery failed for ${wh.id} (${platform}): HTTP ${result.status}`);
      }

      return {
        webhookId: wh.id,
        success: result.ok,
        statusCode: result.status,
        attempts: result.attempts,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      log('warn', `Notification delivery error for ${wh.id}: ${msg}`);
      return {
        webhookId: wh.id,
        success: false,
        error: msg,
        attempts: 3,
      };
    }
  }
}
