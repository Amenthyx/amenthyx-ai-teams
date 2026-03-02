import { create } from 'zustand';
import { MissionControlEvent } from '../types/events';
import { useFilterStore } from './filterStore';

const MAX_EVENTS = 1000;

interface EventState {
  events: MissionControlEvent[];
  addEvent: (event: MissionControlEvent) => void;
  clearEvents: () => void;
  getFilteredEvents: () => MissionControlEvent[];
  getEventCountByAgent: () => Record<string, number>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],

  addEvent: (event: MissionControlEvent) => {
    set((state) => {
      const next = [...state.events, event];
      if (next.length > MAX_EVENTS) {
        return { events: next.slice(next.length - MAX_EVENTS) };
      }
      return { events: next };
    });
  },

  clearEvents: () => set({ events: [] }),

  getFilteredEvents: () => {
    const { events } = get();
    const { getFilteredItems } = useFilterStore.getState();
    return getFilteredItems(events, (e) => e.agent?.role);
  },

  getEventCountByAgent: () => {
    const { events } = get();
    const counts: Record<string, number> = {};
    for (const event of events) {
      if (event.agent?.role) {
        counts[event.agent.role] = (counts[event.agent.role] || 0) + 1;
      }
    }
    return counts;
  },
}));
