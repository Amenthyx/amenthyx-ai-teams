/**
 * Client-side mirror of server event types.
 * Keep in sync with src/server/types/events.ts
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
  lastAction?: string;
  startedAt?: string;
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
  deliverables?: string[];
  agents?: string[];
}

export interface KanbanCard {
  id: string;
  issue: string;
  agent: string;
  status: string;
  wave: number;
  labels: string[];
  title?: string;
  description?: string;
  evidence?: string;
}

export interface CommitEntry {
  number: number;
  hash: string;
  agent: string;
  type: string;
  description: string;
  issue: string;
  wave: number;
  evidence: string;
  filesChanged?: number;
  additions?: number;
  deletions?: number;
  relativeTime?: string;
  timestamp?: string;
}

export type TestLayerName =
  | 'static'
  | 'unit_be'
  | 'unit_fe'
  | 'integration'
  | 'e2e'
  | 'performance'
  | 'security'
  | 'accessibility';

export interface TestLayerResult {
  status: 'pass' | 'fail' | 'running' | 'pending';
  passCount: number;
  failCount: number;
  skipCount: number;
  coverage?: number;
  trend: number[];
  failingTests?: Array<{
    name: string;
    file: string;
    line?: number;
    error?: string;
  }>;
}

export interface SecretsHealth {
  score: number;
  secrets: Array<{
    keyName: string;
    fileLocation: string;
    type: 'env' | 'hardcoded' | 'vault';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }>;
  warnings: string[];
  recommendations: string[];
}

/** Agent role color mapping */
export const AGENT_COLORS: Record<string, string> = {
  TL: '#F59E0B',
  PM: '#64748B',
  BE: '#3B82F6',
  FE: '#22C55E',
  MOB: '#06B6D4',
  DEVOPS: '#F97316',
  INFRA: '#F59E0B',
  QA: '#A855F7',
  RM: '#14B8A6',
  MKT: '#EC4899',
  LEGAL: '#6B7280',
};

/** Agent category groupings */
export const AGENT_CATEGORIES: Record<AgentCategory, string[]> = {
  management: ['TL', 'PM', 'RM'],
  engineering: ['BE', 'FE', 'MOB', 'DEVOPS', 'INFRA'],
  quality: ['QA'],
  support: ['MKT', 'LEGAL'],
};

/** All known agent roles */
export const ALL_AGENT_ROLES = [
  'TL', 'PM', 'BE', 'FE', 'MOB', 'DEVOPS', 'INFRA', 'QA', 'RM', 'MKT', 'LEGAL',
] as const;

/** Agent display names */
export const AGENT_NAMES: Record<string, string> = {
  TL: 'Tech Lead',
  PM: 'Project Manager',
  BE: 'Backend',
  FE: 'Frontend',
  MOB: 'Mobile',
  DEVOPS: 'DevOps',
  INFRA: 'Infrastructure',
  QA: 'Quality Assurance',
  RM: 'Release Manager',
  MKT: 'Marketing',
  LEGAL: 'Legal',
};
