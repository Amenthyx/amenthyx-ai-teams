import { create } from 'zustand';

export type InterviewCategory = 'business' | 'technical' | 'constraints' | 'stakeholders';

export interface Interview {
  id: string;
  category: InterviewCategory;
  question: string;
  answer: string;
  asked_by?: string;
  answered_by?: string;
  created_at: string;
  tags?: string[];
}

interface InterviewState {
  interviews: Interview[];
  addInterview: (interview: Interview) => void;
  setInterviews: (interviews: Interview[]) => void;
  getByCategory: (category: InterviewCategory) => Interview[];
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  interviews: [],

  addInterview: (interview: Interview) => {
    set((state) => ({ interviews: [...state.interviews, interview] }));
  },

  setInterviews: (interviews: Interview[]) => set({ interviews }),

  getByCategory: (category: InterviewCategory) => {
    return get().interviews.filter((i) => i.category === category);
  },
}));
