import { create } from 'zustand';

export interface Session {
  id: string;
  name: string;
  created_at: string;
  status: string;
  metadata?: Record<string, unknown>;
}

interface SessionState {
  sessions: Session[];
  activeSessionId: string | null;
  setActive: (id: string | null) => void;
  addSession: (session: Session) => void;
  removeSession: (id: string) => void;
  setSessions: (sessions: Session[]) => void;
  getSessions: () => Session[];
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  activeSessionId: null,

  setActive: (id) => set({ activeSessionId: id }),

  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),

  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
    })),

  setSessions: (sessions) => set({ sessions }),

  getSessions: () => get().sessions,
}));
