import { create } from 'zustand';
import type { GateEvent, GateDecision } from '../types/events';

interface GateState {
  pendingGates: GateEvent[];
  resolvedGates: GateEvent[];
  dialogOpen: boolean;
  addGate: (gate: GateEvent) => void;
  resolveGate: (id: string, decision: GateDecision) => void;
  dismissGate: (id: string) => void;
  getActiveGate: () => GateEvent | null;
  openDialog: () => void;
  closeDialog: () => void;
  setPendingGates: (gates: GateEvent[]) => void;
}

export const useGateStore = create<GateState>((set, get) => ({
  pendingGates: [],
  resolvedGates: [],
  dialogOpen: false,

  addGate: (gate: GateEvent) => {
    const { pendingGates } = get();
    // Avoid duplicates
    if (pendingGates.some((g) => g.id === gate.id)) return;
    set({
      pendingGates: [...pendingGates, gate],
      dialogOpen: true,
    });
  },

  resolveGate: (id: string, decision: GateDecision) => {
    const { pendingGates, resolvedGates } = get();
    const gate = pendingGates.find((g) => g.id === id);
    if (!gate) return;

    const resolved: GateEvent = {
      ...gate,
      status: decision === 'rejected' || decision === 'too_expensive' ? 'rejected' : 'approved',
      decision,
      resolved_at: new Date().toISOString(),
    };

    const remaining = pendingGates.filter((g) => g.id !== id);
    set({
      pendingGates: remaining,
      resolvedGates: [resolved, ...resolvedGates].slice(0, 50),
      dialogOpen: remaining.length > 0,
    });
  },

  dismissGate: (id: string) => {
    const { pendingGates, resolvedGates } = get();
    const gate = pendingGates.find((g) => g.id === id);
    if (!gate) return;

    const dismissed: GateEvent = {
      ...gate,
      status: 'dismissed',
      decision: 'dismissed',
      resolved_at: new Date().toISOString(),
    };

    const remaining = pendingGates.filter((g) => g.id !== id);
    set({
      pendingGates: remaining,
      resolvedGates: [dismissed, ...resolvedGates].slice(0, 50),
      dialogOpen: remaining.length > 0,
    });
  },

  getActiveGate: () => {
    const { pendingGates } = get();
    return pendingGates.length > 0 ? pendingGates[0] : null;
  },

  openDialog: () => set({ dialogOpen: true }),
  closeDialog: () => set({ dialogOpen: false }),

  setPendingGates: (gates: GateEvent[]) => {
    set({
      pendingGates: gates,
      dialogOpen: gates.length > 0,
    });
  },
}));
