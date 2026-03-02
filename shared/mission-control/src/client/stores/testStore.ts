import { create } from 'zustand';
import { TestLayerName, TestLayerResult } from '../types/events';

type TestResults = Record<TestLayerName, TestLayerResult>;

interface TestState {
  results: TestResults;
  setResults: (results: Partial<TestResults>) => void;
  updateLayer: (layer: TestLayerName, update: Partial<TestLayerResult>) => void;
  getTotalPassed: () => number;
  getTotalFailed: () => number;
  getOverallStatus: () => 'pass' | 'fail' | 'running' | 'pending';
}

const defaultLayer: TestLayerResult = {
  status: 'pending',
  passCount: 0,
  failCount: 0,
  skipCount: 0,
  trend: [],
};

const defaultResults: TestResults = {
  static: { ...defaultLayer },
  unit_be: { ...defaultLayer },
  unit_fe: { ...defaultLayer },
  integration: { ...defaultLayer },
  e2e: { ...defaultLayer },
  performance: { ...defaultLayer },
  security: { ...defaultLayer },
  accessibility: { ...defaultLayer },
};

export const useTestStore = create<TestState>((set, get) => ({
  results: defaultResults,

  setResults: (results: Partial<TestResults>) => {
    set((state) => ({
      results: { ...state.results, ...results },
    }));
  },

  updateLayer: (layer: TestLayerName, update: Partial<TestLayerResult>) => {
    set((state) => ({
      results: {
        ...state.results,
        [layer]: { ...state.results[layer], ...update },
      },
    }));
  },

  getTotalPassed: () => {
    const { results } = get();
    return Object.values(results).reduce((sum, r) => sum + r.passCount, 0);
  },

  getTotalFailed: () => {
    const { results } = get();
    return Object.values(results).reduce((sum, r) => sum + r.failCount, 0);
  },

  getOverallStatus: () => {
    const { results } = get();
    const layers = Object.values(results);
    if (layers.some((l) => l.status === 'fail')) return 'fail';
    if (layers.some((l) => l.status === 'running')) return 'running';
    if (layers.every((l) => l.status === 'pass')) return 'pass';
    return 'pending';
  },
}));
