import { create } from 'zustand';

export interface Artifact {
  id: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  path: string;
  producer_agent: string;
  wave: number;
  created_at: string;
}

interface ArtifactState {
  artifacts: Artifact[];
  addArtifact: (artifact: Artifact) => void;
  setArtifacts: (artifacts: Artifact[]) => void;
  getByWave: (wave: number) => Artifact[];
}

export const useArtifactStore = create<ArtifactState>((set, get) => ({
  artifacts: [],

  addArtifact: (artifact) =>
    set((state) => ({ artifacts: [...state.artifacts, artifact] })),

  setArtifacts: (artifacts) => set({ artifacts }),

  getByWave: (wave) => get().artifacts.filter((a) => a.wave === wave),
}));
