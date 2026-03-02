import * as crypto from 'crypto';
import {
  EventCategory,
  type MissionControlEvent,
  type Severity,
  type EventAgent,
  type EventMeta,
} from '../types/events';

/**
 * Maps Claude Code hook event types to Mission Control event categories and types.
 */
interface HookMapping {
  category: EventCategory;
  type: string;
}

const HOOK_TYPE_MAP: Record<string, HookMapping> = {
  PreToolUse: { category: EventCategory.TOOL, type: 'tool_start' },
  PostToolUse: { category: EventCategory.TOOL, type: 'tool_complete' },
  SubagentStart: { category: EventCategory.AGENT, type: 'spawn' },
  SubagentStop: { category: EventCategory.AGENT, type: 'complete' },
  UserPromptSubmit: { category: EventCategory.SYSTEM, type: 'prompt' },
  Stop: { category: EventCategory.SYSTEM, type: 'session_end' },
  SessionEnd: { category: EventCategory.SYSTEM, type: 'session_end' },
};

/**
 * Determine severity from the payload based on success/error indicators.
 */
function determineSeverity(payload: Record<string, unknown>): Severity {
  if (payload.error || payload.success === false) {
    return 'error';
  }
  if (payload.warning) {
    return 'warn';
  }
  return 'info';
}

/**
 * Extract agent info from the Claude Code hook payload.
 */
function extractAgent(payload: Record<string, unknown>): EventAgent | undefined {
  const agentName =
    (payload.agent_name as string) ||
    (payload.agentName as string) ||
    (payload.subagent_name as string) ||
    undefined;

  const agentRole =
    (payload.agent_role as string) ||
    (payload.agentRole as string) ||
    undefined;

  if (!agentRole && !agentName) {
    return undefined;
  }

  return {
    role: agentRole || 'unknown',
    name: agentName,
    wave: typeof payload.wave === 'number' ? payload.wave : undefined,
  };
}

/**
 * Extract metadata from the Claude Code hook payload.
 */
function extractMeta(payload: Record<string, unknown>): EventMeta | undefined {
  const meta: EventMeta = {};
  let hasMeta = false;

  if (typeof payload.duration_ms === 'number') {
    meta.duration_ms = payload.duration_ms;
    hasMeta = true;
  }
  if (typeof payload.tokens_input === 'number' || typeof payload.tokensInput === 'number') {
    meta.tokens_input = (payload.tokens_input as number) || (payload.tokensInput as number);
    hasMeta = true;
  }
  if (typeof payload.tokens_output === 'number' || typeof payload.tokensOutput === 'number') {
    meta.tokens_output = (payload.tokens_output as number) || (payload.tokensOutput as number);
    hasMeta = true;
  }
  if (typeof payload.cost_usd === 'number' || typeof payload.costUsd === 'number') {
    meta.cost_usd = (payload.cost_usd as number) || (payload.costUsd as number);
    hasMeta = true;
  }
  if (typeof payload.file_path === 'string') {
    meta.file_path = payload.file_path;
    hasMeta = true;
  }
  if (typeof payload.error === 'string') {
    meta.error = payload.error;
    hasMeta = true;
  }

  return hasMeta ? meta : undefined;
}

/**
 * Translate a Claude Code hook payload into a MissionControlEvent.
 *
 * @param hookPayload - The raw payload from a Claude Code hook
 * @param sessionId - The current session identifier
 * @returns A fully formed MissionControlEvent
 */
export function translateClaudeCodeEvent(
  hookPayload: unknown,
  sessionId: string
): MissionControlEvent {
  const payload = (hookPayload && typeof hookPayload === 'object'
    ? hookPayload
    : {}) as Record<string, unknown>;

  // Determine the hook event type
  const hookType =
    (payload.event_type as string) ||
    (payload.eventType as string) ||
    (payload.hook as string) ||
    (payload.type as string) ||
    'unknown';

  // Map to Mission Control category and type
  const mapping = HOOK_TYPE_MAP[hookType] || {
    category: EventCategory.SYSTEM,
    type: hookType.toLowerCase(),
  };

  // Build the event
  const event: MissionControlEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    sessionId,
    source: {
      tool: 'claude-code',
      adapter: 'claude-code-adapter',
      version: '1.0.0',
    },
    category: mapping.category,
    type: mapping.type,
    severity: determineSeverity(payload),
    agent: extractAgent(payload),
    payload: {
      tool_name: payload.tool_name || payload.toolName || undefined,
      tool_input: payload.tool_input || payload.toolInput || undefined,
      tool_output: payload.tool_output || payload.toolOutput || undefined,
      success: payload.success,
      hook_type: hookType,
      raw: payload,
    },
    meta: extractMeta(payload),
  };

  // Remove undefined values from payload
  for (const key of Object.keys(event.payload)) {
    if (event.payload[key] === undefined) {
      delete event.payload[key];
    }
  }

  return event;
}
