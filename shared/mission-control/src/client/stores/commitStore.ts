import { create } from 'zustand';
import { CommitEntry } from '../types/events';
import { useFilterStore } from './filterStore';

interface CommitState {
  commits: CommitEntry[];
  setCommits: (commits: CommitEntry[]) => void;
  addCommit: (commit: CommitEntry) => void;
  getGroupedByAgent: () => Record<string, CommitEntry[]>;
  getFilteredCommits: () => CommitEntry[];
  getCommitsByIssue: (issue: string) => CommitEntry[];
}

export const useCommitStore = create<CommitState>((set, get) => ({
  commits: [],

  setCommits: (commits: CommitEntry[]) => set({ commits }),

  addCommit: (commit: CommitEntry) => {
    set((state) => ({ commits: [commit, ...state.commits] }));
  },

  getGroupedByAgent: () => {
    const filtered = get().getFilteredCommits();
    const grouped: Record<string, CommitEntry[]> = {};
    for (const commit of filtered) {
      if (!grouped[commit.agent]) {
        grouped[commit.agent] = [];
      }
      grouped[commit.agent].push(commit);
    }
    return grouped;
  },

  getFilteredCommits: () => {
    const { commits } = get();
    const { getFilteredItems } = useFilterStore.getState();
    return getFilteredItems(commits, (c) => c.agent);
  },

  getCommitsByIssue: (issue: string) => {
    return get().commits.filter((c) => c.issue === issue);
  },
}));
