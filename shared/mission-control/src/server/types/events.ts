import * as crypto from 'crypto';

/**
 * Universal Event Schema for Mission Control
 * All events flowing through the system conform to this schema.
 */

export enum EventCategory {
  AGENT = 'AGENT',
  TOOL = 'TOOL',
  PLANNING = 'PLANNING',
  CODE = 'CODE',
  TEST = 'TEST',
  BUILD = 'BUILD',
  GIT = 'GIT',
  COST = 'COST',
  CI = 'CI',
  SECRET = 'SECRET',
  SYSTEM = 'SYSTEM',
  EVIDENCE = 'EVIDENCE',
  GATE = 'GATE',
  CUSTOM = 'CUSTOM',
  UAT = 'UAT',
}

export type AgentRole =
  | 'TL'
  | 'PM'
  | 'BE'
  | 'FE'
  | 'MOB'
  | 'DEVOPS'
  | 'INFRA'
  | 'QA'
  | 'RM'
  | 'MKT'
  | 'LEGAL'
  | string;

export type Severity = 'info' | 'warn' | 'error' | 'critical';

export type AgentStatus = 'idle' | 'active' | 'blocked' | 'done';

export type AgentCategory = 'management' | 'engineering' | 'quality' | 'support';

export type WaveStatus = 'pending' | 'active' | 'done';

export type GateStatus = 'pending' | 'pass' | 'fail';

export interface EventMeta {
  duration_ms?: number;
  tokens_input?: number;
  tokens_output?: number;
  cost_usd?: number;
  file_path?: string;
  commit_hash?: string;
  issue_number?: number;
  error?: string;
}

export interface EventAgent {
  role: AgentRole;
  name?: string;
  wave?: number;
}

export interface EventSource {
  tool: string;
  adapter?: string;
  version?: string;
}

export interface MissionControlEvent {
  id: string;
  timestamp: string;
  sessionId: string;
  source: EventSource;
  category: EventCategory;
  type: string;
  severity: Severity;
  agent?: EventAgent;
  payload: Record<string, unknown>;
  meta?: EventMeta;
}

export interface AgentInfo {
  role: AgentRole;
  name: string;
  color: string;
  category: AgentCategory;
  status: AgentStatus;
  currentTask?: string;
  wave?: number;
  tokensUsed?: number;
  costUsd?: number;
}

export interface BudgetInfo {
  total: number;
  spent: number;
  currency: string;
  alertThreshold: number;
  hardCap?: number;
}

export interface WaveInfo {
  number: number;
  name: string;
  status: WaveStatus;
  gate: GateStatus;
}

/**
 * Validates that an unknown object conforms to the MissionControlEvent shape.
 * Returns the validated event or null if invalid.
 */
export function validateEvent(event: unknown): MissionControlEvent | null {
  if (!event || typeof event !== 'object') {
    return null;
  }

  const e = event as Record<string, unknown>;

  // Required string fields
  const requiredStrings: Array<keyof MissionControlEvent> = [
    'timestamp',
    'sessionId',
    'category',
    'type',
    'severity',
  ];

  for (const field of requiredStrings) {
    if (typeof e[field] !== 'string' || (e[field] as string).length === 0) {
      return null;
    }
  }

  // Validate category is a known EventCategory
  if (!Object.values(EventCategory).includes(e.category as EventCategory)) {
    return null;
  }

  // Validate severity
  const validSeverities: Severity[] = ['info', 'warn', 'error', 'critical'];
  if (!validSeverities.includes(e.severity as Severity)) {
    return null;
  }

  // Source must be an object with at least a 'tool' string
  if (
    !e.source ||
    typeof e.source !== 'object' ||
    typeof (e.source as Record<string, unknown>).tool !== 'string'
  ) {
    return null;
  }

  // Payload must be an object
  if (!e.payload || typeof e.payload !== 'object' || Array.isArray(e.payload)) {
    return null;
  }

  // Agent validation (optional)
  if (e.agent !== undefined && e.agent !== null) {
    if (
      typeof e.agent !== 'object' ||
      typeof (e.agent as Record<string, unknown>).role !== 'string'
    ) {
      return null;
    }
  }

  // Generate id if missing
  const id = typeof e.id === 'string' && e.id.length > 0 ? e.id : crypto.randomUUID();

  return {
    id,
    timestamp: e.timestamp as string,
    sessionId: e.sessionId as string,
    source: e.source as EventSource,
    category: e.category as EventCategory,
    type: e.type as string,
    severity: e.severity as Severity,
    agent: e.agent as EventAgent | undefined,
    payload: e.payload as Record<string, unknown>,
    meta: (e.meta as EventMeta) || undefined,
  };
}
