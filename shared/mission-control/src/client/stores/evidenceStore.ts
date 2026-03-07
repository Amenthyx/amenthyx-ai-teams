import { create } from 'zustand';

export interface Evidence {
  id: string;
  type: 'screenshot' | 'log' | 'test' | 'commit';
  artifact_url: string;
  linked_entity_type: string;
  linked_entity_id: string;
  verified_by: string;
  timestamp: string;
}

interface EvidenceState {
  evidence: Evidence[];
  addEvidence: (item: Evidence) => void;
  setEvidence: (items: Evidence[]) => void;
  getByType: (type: Evidence['type']) => Evidence[];
}

export const useEvidenceStore = create<EvidenceState>((set, get) => ({
  evidence: [],

  addEvidence: (item: Evidence) => {
    set((state) => ({
      evidence: [item, ...state.evidence],
    }));
  },

  setEvidence: (items: Evidence[]) => {
    set({ evidence: items });
  },

  getByType: (type: Evidence['type']) => {
    return get().evidence.filter((e) => e.type === type);
  },
}));
