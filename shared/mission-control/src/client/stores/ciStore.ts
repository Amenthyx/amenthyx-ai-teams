import { create } from 'zustand';

export interface CIRun {
  id: string;
  pipeline_id: string;
  status: 'running' | 'pass' | 'fail';
  steps: string;
  duration: number;
  trigger_agent: string;
  created_at: string;
}

interface CIState {
  ciRuns: CIRun[];
  addRun: (run: CIRun) => void;
  setRuns: (runs: CIRun[]) => void;
  getByStatus: (status: CIRun['status']) => CIRun[];
}

export const useCIStore = create<CIState>((set, get) => ({
  ciRuns: [],

  addRun: (run: CIRun) => {
    set((state) => ({
      ciRuns: [run, ...state.ciRuns],
    }));
  },

  setRuns: (runs: CIRun[]) => {
    set({ ciRuns: runs });
  },

  getByStatus: (status: CIRun['status']) => {
    return get().ciRuns.filter((r) => r.status === status);
  },
}));
