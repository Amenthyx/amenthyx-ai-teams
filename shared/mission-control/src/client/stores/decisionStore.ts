import { create } from 'zustand';

export type DecisionStatus = 'proposed' | 'accepted' | 'superseded';

export interface Decision {
  id: string;
  title: string;
  context: string;
  decision: string;
  rationale: string;
  decided_by: string;
  status: DecisionStatus;
  created_at: string;
  updated_at?: string;
  superseded_by?: string;
}

interface DecisionState {
  decisions: Decision[];
  addDecision: (decision: Decision) => void;
  setDecisions: (decisions: Decision[]) => void;
  updateDecision: (id: string, update: Partial<Decision>) => void;
  getByStatus: (status: DecisionStatus) => Decision[];
}

export const useDecisionStore = create<DecisionState>((set, get) => ({
  decisions: [],

  addDecision: (decision: Decision) => {
    set((state) => ({ decisions: [...state.decisions, decision] }));
  },

  setDecisions: (decisions: Decision[]) => set({ decisions }),

  updateDecision: (id: string, update: Partial<Decision>) => {
    set((state) => ({
      decisions: state.decisions.map((d) =>
        d.id === id ? { ...d, ...update } : d
      ),
    }));
  },

  getByStatus: (status: DecisionStatus) => {
    return get().decisions.filter((d) => d.status === status);
  },
}));
