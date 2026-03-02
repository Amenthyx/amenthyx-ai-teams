import { create } from 'zustand';
import { WaveInfo } from '../types/events';

interface WaveState {
  waves: Map<number, WaveInfo>;
  setWaves: (waves: WaveInfo[]) => void;
  updateWave: (number: number, update: Partial<WaveInfo>) => void;
  getCurrentWave: () => WaveInfo | undefined;
  getAllWaves: () => WaveInfo[];
}

export const useWaveStore = create<WaveState>((set, get) => ({
  waves: new Map<number, WaveInfo>([
    [0, { number: 0, name: 'Planning', status: 'done', gate: 'pass' }],
    [1, { number: 1, name: 'Foundation', status: 'active', gate: 'pending' }],
    [2, { number: 2, name: 'Core Features', status: 'pending', gate: 'pending' }],
    [3, { number: 3, name: 'Integration', status: 'pending', gate: 'pending' }],
    [4, { number: 4, name: 'QA & Polish', status: 'pending', gate: 'pending' }],
    [5, { number: 5, name: 'Release', status: 'pending', gate: 'pending' }],
  ]),

  setWaves: (waves: WaveInfo[]) => {
    const map = new Map<number, WaveInfo>();
    for (const wave of waves) {
      map.set(wave.number, wave);
    }
    set({ waves: map });
  },

  updateWave: (number: number, update: Partial<WaveInfo>) => {
    const waves = new Map(get().waves);
    const existing = waves.get(number);
    if (existing) {
      waves.set(number, { ...existing, ...update });
    }
    set({ waves });
  },

  getCurrentWave: () => {
    const waves = get().getAllWaves();
    return waves.find((w) => w.status === 'active') || waves[0];
  },

  getAllWaves: () => {
    return Array.from(get().waves.values()).sort((a, b) => a.number - b.number);
  },
}));
