import { create } from 'zustand';
import { BudgetInfo } from '../types/events';

interface BurnRatePoint {
  time: string;
  spent: number;
  rate: number;
}

interface BudgetState {
  budget: BudgetInfo;
  burnRateHistory: BurnRatePoint[];
  perAgentCost: Record<string, number>;
  setBudget: (budget: BudgetInfo) => void;
  addCost: (amount: number, agent?: string) => void;
  getBurnRate: () => number;
  getPercentUsed: () => number;
  isOverThreshold: () => boolean;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budget: {
    total: 50,
    spent: 0,
    currency: 'USD',
    alertThreshold: 0.8,
  },

  burnRateHistory: [],
  perAgentCost: {},

  setBudget: (budget: BudgetInfo) => set({ budget }),

  addCost: (amount: number, agent?: string) => {
    set((state) => {
      const newSpent = state.budget.spent + amount;
      const now = new Date().toLocaleTimeString('en-US', { hour12: false });
      const newHistory = [
        ...state.burnRateHistory,
        { time: now, spent: newSpent, rate: amount },
      ].slice(-20);

      const newPerAgent = { ...state.perAgentCost };
      if (agent) {
        newPerAgent[agent] = (newPerAgent[agent] || 0) + amount;
      }

      return {
        budget: { ...state.budget, spent: newSpent },
        burnRateHistory: newHistory,
        perAgentCost: newPerAgent,
      };
    });
  },

  getBurnRate: () => {
    const { burnRateHistory } = get();
    if (burnRateHistory.length < 2) return 0;
    const recent = burnRateHistory.slice(-5);
    const totalRate = recent.reduce((sum, p) => sum + p.rate, 0);
    return totalRate / recent.length;
  },

  getPercentUsed: () => {
    const { budget } = get();
    if (budget.total === 0) return 0;
    return (budget.spent / budget.total) * 100;
  },

  isOverThreshold: () => {
    const { budget } = get();
    if (budget.total === 0) return false;
    return budget.spent / budget.total > budget.alertThreshold;
  },
}));
