import { create } from 'zustand';
import { AgentInfo, AGENT_COLORS, AGENT_NAMES } from '../types/events';

interface AgentState {
  agents: Map<string, AgentInfo>;
  setAgents: (agents: AgentInfo[]) => void;
  updateAgent: (role: string, update: Partial<AgentInfo>) => void;
  getAgent: (role: string) => AgentInfo | undefined;
  getAllAgents: () => AgentInfo[];
}

function getCategory(role: string): AgentInfo['category'] {
  if (['TL', 'PM', 'RM'].includes(role)) return 'management';
  if (['BE', 'FE', 'MOB', 'DEVOPS', 'INFRA'].includes(role)) return 'engineering';
  if (['QA'].includes(role)) return 'quality';
  return 'support';
}

export const useAgentStore = create<AgentState>((set, get) => ({
  // Start empty — populated dynamically from server config/snapshot
  agents: new Map<string, AgentInfo>(),

  setAgents: (agents: AgentInfo[]) => {
    const map = new Map<string, AgentInfo>();
    for (const agent of agents) {
      map.set(agent.role, agent);
    }
    set({ agents: map });
  },

  updateAgent: (role: string, update: Partial<AgentInfo>) => {
    const agents = new Map(get().agents);
    const existing = agents.get(role);
    if (existing) {
      agents.set(role, { ...existing, ...update });
    } else {
      // Auto-create agent if we see it for the first time
      agents.set(role, {
        role,
        name: update.name || AGENT_NAMES[role] || role,
        color: update.color || AGENT_COLORS[role] || '#6B7280',
        category: update.category || getCategory(role),
        status: update.status || 'idle',
        ...update,
      });
    }
    set({ agents });
  },

  getAgent: (role: string) => get().agents.get(role),

  getAllAgents: () => Array.from(get().agents.values()),
}));
