import { create } from 'zustand';

export interface UATSuite {
  id: string;
  code: string;
  name: string;
  totalCases: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  coverage: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UATCase {
  id: string;
  suiteId: string;
  title: string;
  feature?: string;
  priority: string;
  ctaElement?: string;
  ctaSelector?: string;
  userRole?: string;
  device?: string;
  browser?: string;
  compliance: string[];
  preconditions: string[];
  steps: Array<{ number: number; action: string; element: string; inputData?: string }>;
  expectedResult?: string;
  actualResult?: string;
  status: string;
  screenshotBefore?: string;
  screenshotAfter?: string;
  screenshotError?: string;
  consoleLog?: string;
  networkLog?: string;
  defectId?: string;
  defectSeverity?: string;
  executedBy?: string;
  executedAt?: string;
  durationMs: number;
  environment?: string;
  build?: string;
  round: number;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UATSummary {
  totalSuites: number;
  totalCases: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  coverage: number;
  defectsFound: number;
  defectsResolved: number;
}

interface UATState {
  suites: UATSuite[];
  cases: Map<string, UATCase[]>;
  summary: UATSummary;
  expandedSuite: string | null;
  selectedCase: string | null;
  loading: boolean;

  setSuites: (suites: UATSuite[]) => void;
  upsertSuite: (suite: UATSuite) => void;
  setCases: (suiteId: string, cases: UATCase[]) => void;
  upsertCase: (c: UATCase) => void;
  setSummary: (summary: UATSummary) => void;
  setExpandedSuite: (suiteId: string | null) => void;
  setSelectedCase: (caseId: string | null) => void;
  setLoading: (loading: boolean) => void;
  getCasesForSuite: (suiteId: string) => UATCase[];
  getAllCases: () => UATCase[];
  getPassRate: () => number;
}

const defaultSummary: UATSummary = {
  totalSuites: 0,
  totalCases: 0,
  passed: 0,
  failed: 0,
  blocked: 0,
  skipped: 0,
  coverage: 0,
  defectsFound: 0,
  defectsResolved: 0,
};

export const useUATStore = create<UATState>((set, get) => ({
  suites: [],
  cases: new Map(),
  summary: defaultSummary,
  expandedSuite: null,
  selectedCase: null,
  loading: false,

  setSuites: (suites) => set({ suites }),

  upsertSuite: (suite) => {
    set((state) => {
      const idx = state.suites.findIndex((s) => s.id === suite.id);
      if (idx >= 0) {
        const next = [...state.suites];
        next[idx] = suite;
        return { suites: next };
      }
      return { suites: [...state.suites, suite] };
    });
  },

  setCases: (suiteId, cases) => {
    set((state) => {
      const next = new Map(state.cases);
      next.set(suiteId, cases);
      return { cases: next };
    });
  },

  upsertCase: (c) => {
    set((state) => {
      const next = new Map(state.cases);
      const existing = next.get(c.suiteId) || [];
      const idx = existing.findIndex((e) => e.id === c.id);
      if (idx >= 0) {
        const updated = [...existing];
        updated[idx] = c;
        next.set(c.suiteId, updated);
      } else {
        next.set(c.suiteId, [...existing, c]);
      }
      return { cases: next };
    });
  },

  setSummary: (summary) => set({ summary }),
  setExpandedSuite: (suiteId) => set({ expandedSuite: suiteId }),
  setSelectedCase: (caseId) => set({ selectedCase: caseId }),
  setLoading: (loading) => set({ loading }),

  getCasesForSuite: (suiteId) => get().cases.get(suiteId) || [],

  getAllCases: () => {
    const allCases: UATCase[] = [];
    for (const cases of get().cases.values()) {
      allCases.push(...cases);
    }
    return allCases;
  },

  getPassRate: () => {
    const { summary } = get();
    if (summary.totalCases === 0) return 0;
    return Math.round((summary.passed / summary.totalCases) * 1000) / 10;
  },
}));
