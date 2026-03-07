import { create } from 'zustand';

export interface ServiceInfo {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  latency: number;
}

interface ServiceState {
  services: ServiceInfo[];
  setServices: (services: ServiceInfo[]) => void;
  updateService: (name: string, update: Partial<ServiceInfo>) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],

  setServices: (services: ServiceInfo[]) => {
    set({ services });
  },

  updateService: (name: string, update: Partial<ServiceInfo>) => {
    set((state) => ({
      services: state.services.map((s) =>
        s.name === name ? { ...s, ...update } : s
      ),
    }));
  },
}));
