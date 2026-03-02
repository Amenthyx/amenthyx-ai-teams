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
  // Start empty — populated dynamically from server snapshot/config
  waves: new Map<number, WaveInfo>(),

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
    } else {
      // Auto-create wave if it doesn't exist yet
      waves.set(number, {
        number,
        name: update.name || `Wave ${number}`,
        status: update.status || 'pending',
        gate: update.gate || 'pending',
        ...update,
      } as WaveInfo);
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
