import { create } from 'zustand';
import { AGENT_CATEGORIES, AgentCategory } from '../types/events';

interface FilterState {
  selectedAgents: string[];
  toggleAgent: (role: string) => void;
  selectAll: () => void;
  selectCategory: (category: AgentCategory) => void;
  isAgentSelected: (role: string) => boolean;
  getFilteredItems: <T>(items: T[], getRole: (item: T) => string | undefined) => T[];
}

function readFromURL(): string[] {
  if (typeof window === 'undefined') return [];
  const params = new URLSearchParams(window.location.search);
  const agents = params.get('agents');
  if (!agents) return [];
  return agents.split(',').filter(Boolean);
}

function syncToURL(agents: string[]) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (agents.length === 0) {
    params.delete('agents');
  } else {
    params.set('agents', agents.join(','));
  }
  const search = params.toString();
  const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export const useFilterStore = create<FilterState>((set, get) => ({
  selectedAgents: readFromURL(),

  toggleAgent: (role: string) => {
    const current = get().selectedAgents;
    let next: string[];
    if (current.includes(role)) {
      next = current.filter((r) => r !== role);
    } else {
      next = [...current, role];
    }
    syncToURL(next);
    set({ selectedAgents: next });
  },

  selectAll: () => {
    syncToURL([]);
    set({ selectedAgents: [] });
  },

  selectCategory: (category: AgentCategory) => {
    const roles = AGENT_CATEGORIES[category] || [];
    syncToURL(roles);
    set({ selectedAgents: roles });
  },

  isAgentSelected: (role: string): boolean => {
    const { selectedAgents } = get();
    if (selectedAgents.length === 0) return true;
    return selectedAgents.includes(role);
  },

  getFilteredItems: <T>(items: T[], getRole: (item: T) => string | undefined): T[] => {
    const { selectedAgents } = get();
    if (selectedAgents.length === 0) return items;
    return items.filter((item) => {
      const role = getRole(item);
      if (!role) return true;
      return selectedAgents.includes(role);
    });
  },
}));
