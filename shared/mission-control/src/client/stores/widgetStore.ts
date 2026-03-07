import { create } from 'zustand';

export interface Widget {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config: Record<string, unknown>;
}

interface WidgetState {
  widgets: Widget[];
  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  reorderWidgets: (orderedIds: string[]) => void;
}

export const useWidgetStore = create<WidgetState>((set) => ({
  widgets: [],

  addWidget: (widget) =>
    set((state) => ({ widgets: [...state.widgets, widget] })),

  removeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
    })),

  updateWidget: (id, updates) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),

  reorderWidgets: (orderedIds) =>
    set((state) => {
      const widgetMap = new Map(state.widgets.map((w) => [w.id, w]));
      const reordered: Widget[] = [];
      for (const id of orderedIds) {
        const w = widgetMap.get(id);
        if (w) reordered.push(w);
      }
      // Append any widgets not in orderedIds
      for (const w of state.widgets) {
        if (!orderedIds.includes(w.id)) reordered.push(w);
      }
      return { widgets: reordered };
    }),
}));
