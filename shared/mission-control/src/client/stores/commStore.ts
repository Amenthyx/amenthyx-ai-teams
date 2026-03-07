import { create } from 'zustand';

export interface CommMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  context: string;
}

interface CommState {
  messages: CommMessage[];
  addMessage: (message: CommMessage) => void;
  setMessages: (messages: CommMessage[]) => void;
  getByAgent: (agentId: string) => CommMessage[];
  getConversation: (agentA: string, agentB: string) => CommMessage[];
}

export const useCommStore = create<CommState>((set, get) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setMessages: (messages) => set({ messages }),

  getByAgent: (agentId) =>
    get().messages.filter(
      (m) => m.sender === agentId || m.receiver === agentId
    ),

  getConversation: (agentA, agentB) =>
    get().messages.filter(
      (m) =>
        (m.sender === agentA && m.receiver === agentB) ||
        (m.sender === agentB && m.receiver === agentA)
    ),
}));
