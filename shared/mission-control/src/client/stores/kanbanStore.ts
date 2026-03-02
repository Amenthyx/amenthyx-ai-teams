import { create } from 'zustand';
import { KanbanCard } from '../types/events';
import { useFilterStore } from './filterStore';

export const KANBAN_COLUMNS = [
  'Backlog',
  'Sprint Ready',
  'In Progress',
  'In Review',
  'Testing',
  'Done',
  'Blocked',
] as const;

export type KanbanColumn = (typeof KANBAN_COLUMNS)[number];

interface KanbanState {
  cards: KanbanCard[];
  setCards: (cards: KanbanCard[]) => void;
  addCard: (card: KanbanCard) => void;
  updateCard: (id: string, update: Partial<KanbanCard>) => void;
  getCardsByColumn: (status: string) => KanbanCard[];
  getFilteredCards: () => KanbanCard[];
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  cards: [],

  setCards: (cards: KanbanCard[]) => set({ cards }),

  addCard: (card: KanbanCard) => {
    set((state) => ({ cards: [...state.cards, card] }));
  },

  updateCard: (id: string, update: Partial<KanbanCard>) => {
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, ...update } : c)),
    }));
  },

  getCardsByColumn: (status: string) => {
    const filtered = get().getFilteredCards();
    return filtered.filter((c) => c.status === status);
  },

  getFilteredCards: () => {
    const { cards } = get();
    const { getFilteredItems } = useFilterStore.getState();
    return getFilteredItems(cards, (c) => c.agent);
  },
}));
