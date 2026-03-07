import { create } from 'zustand';
import { MissionControlEvent } from '../types/events';
import { useFilterStore } from './filterStore';

const MAX_EVENTS = 2000;

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

  getErrorRate: () => {
    const { events } = get();
    if (events.length === 0) return 0;
    const errors = events.filter((e) => e.severity === 'error' || e.severity === 'critical');
    return errors.length / events.length;
  },

  getErrorsByAgent: () => {
    const { events } = get();
    const errors: Record<string, number> = {};
    for (const event of events) {
      if ((event.severity === 'error' || event.severity === 'critical') && event.agent?.role) {
        errors[event.agent.role] = (errors[event.agent.role] || 0) + 1;
      }
    }
    return errors;
  },

  getEventTimeBuckets: (bucketMinutes = 5) => {
    const { events } = get();
    const buckets: Record<string, number> = {};
    for (const event of events) {
      const d = new Date(event.timestamp);
      const mins = Math.floor(d.getMinutes() / bucketMinutes) * bucketMinutes;
      const key = `${d.getHours().toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      buckets[key] = (buckets[key] || 0) + 1;
    }
    return buckets;
  },
}));
