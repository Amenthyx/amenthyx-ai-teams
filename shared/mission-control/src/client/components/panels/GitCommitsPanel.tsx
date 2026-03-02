import React, { useState } from 'react';
import { GitCommitHorizontal, ChevronDown, ChevronRight, List, Users } from 'lucide-react';
import { useCommitStore } from '../../stores/commitStore';
import { AGENT_COLORS, AGENT_NAMES, CommitEntry } from '../../types/events';

type ViewMode = 'grouped' | 'chronological';

const COMMIT_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  feat: { bg: 'bg-green-500/20', text: 'text-green-400' },
  fix: { bg: 'bg-red-500/20', text: 'text-red-400' },
  test: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  refactor: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  chore: { bg: 'dark:bg-gray-600 bg-gray-200', text: 'dark:text-gray-300 text-gray-600' },
  docs: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  style: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  ci: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
};

function CommitTypeBadge({ type }: { type: string }) {
  const colors = COMMIT_TYPE_COLORS[type] || COMMIT_TYPE_COLORS.chore;
  return (
    <span className={`px-1.5 py-0 rounded text-[10px] font-medium ${colors.bg} ${colors.text}`}>
      {type}
    </span>
  );
}

function DiffStats({
  additions,
  deletions,
}: {
  additions?: number;
  deletions?: number;
}) {
  if (!additions && !deletions) return null;

  return (
    <span className="text-[10px] font-mono dark:text-gray-500 text-gray-400">
      {additions !== undefined && (
        <span className="text-green-400">+{additions}</span>
      )}
      {additions !== undefined && deletions !== undefined && <span className="mx-0.5">/</span>}
      {deletions !== undefined && (
        <span className="text-red-400">-{deletions}</span>
      )}
    </span>
  );
}

function CommitRow({ commit, showAgentBadge }: { commit: CommitEntry; showAgentBadge: boolean }) {
  const agentColor = AGENT_COLORS[commit.agent] || '#6B7280';

  return (
    <div className="flex items-center gap-2 px-3 py-2 dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors duration-200">
      {/* Hash */}
      <code className="font-mono text-xs text-blue-400 shrink-0 w-16">
        {commit.hash.slice(0, 7)}
      </code>

      {/* Agent badge (in chronological view) */}
      {showAgentBadge && (
        <span
          className="px-1.5 py-0 rounded text-[10px] font-bold text-white shrink-0"
          style={{ backgroundColor: agentColor }}
        >
          {commit.agent}
        </span>
      )}

      {/* Type badge */}
      <CommitTypeBadge type={commit.type} />

      {/* Description */}
      <span className="text-xs dark:text-gray-300 text-gray-600 truncate flex-1">
        {commit.description}
      </span>

      {/* Issue link */}
      {commit.issue && (
        <span className="text-[10px] dark:text-gray-500 text-gray-400 shrink-0">
          {commit.issue}
        </span>
      )}

      {/* Diff stats */}
      <DiffStats additions={commit.additions} deletions={commit.deletions} />

      {/* Relative time */}
      {commit.relativeTime && (
        <span className="text-[10px] dark:text-gray-600 text-gray-400 shrink-0 w-16 text-right">
          {commit.relativeTime}
        </span>
      )}
    </div>
  );
}

export const GitCommitsPanel: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');
  const [collapsedAgents, setCollapsedAgents] = useState<Set<string>>(new Set());
  const filteredCommits = useCommitStore((s) => s.getFilteredCommits());
  const groupedByAgent = useCommitStore((s) => s.getGroupedByAgent());

  const toggleCollapse = (agent: string) => {
    setCollapsedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agent)) {
        next.delete(agent);
      } else {
        next.add(agent);
      }
      return next;
    });
  };

  const hasCommits = filteredCommits.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
          Git Commits
        </h2>

        <div className="flex items-center dark:bg-gray-800 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grouped')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
              viewMode === 'grouped'
                ? 'dark:bg-gray-700 bg-white dark:text-gray-200 text-gray-700 shadow-sm'
                : 'dark:text-gray-500 text-gray-400'
            }`}
          >
            <Users size={12} />
            Grouped
          </button>
          <button
            onClick={() => setViewMode('chronological')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
              viewMode === 'chronological'
                ? 'dark:bg-gray-700 bg-white dark:text-gray-200 text-gray-700 shadow-sm'
                : 'dark:text-gray-500 text-gray-400'
            }`}
          >
            <List size={12} />
            Timeline
          </button>
        </div>
      </div>

      {!hasCommits ? (
        <div className="card p-8 text-center">
          <GitCommitHorizontal size={24} className="dark:text-gray-600 text-gray-300 mx-auto mb-2" />
          <p className="dark:text-gray-500 text-gray-400 text-sm">No commits yet</p>
        </div>
      ) : viewMode === 'grouped' ? (
        <div className="space-y-2">
          {Object.entries(groupedByAgent).map(([agent, commits]) => {
            const color = AGENT_COLORS[agent] || '#6B7280';
            const isCollapsed = collapsedAgents.has(agent);

            return (
              <div key={agent} className="card overflow-hidden">
                <button
                  onClick={() => toggleCollapse(agent)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-left"
                  style={{ borderLeftWidth: '3px', borderLeftColor: color }}
                >
                  {isCollapsed ? (
                    <ChevronRight size={14} className="dark:text-gray-500 text-gray-400" />
                  ) : (
                    <ChevronDown size={14} className="dark:text-gray-500 text-gray-400" />
                  )}
                  <span
                    className="px-1.5 py-0 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {agent}
                  </span>
                  <span className="text-sm font-medium dark:text-gray-200 text-gray-700">
                    {AGENT_NAMES[agent] || agent}
                  </span>
                  <span className="text-xs dark:text-gray-500 text-gray-400 ml-auto">
                    {commits.length} commit{commits.length !== 1 ? 's' : ''}
                  </span>
                </button>
                {!isCollapsed && (
                  <div className="divide-y dark:divide-gray-700/50 divide-gray-100">
                    {commits.map((commit) => (
                      <CommitRow
                        key={commit.hash}
                        commit={commit}
                        showAgentBadge={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden divide-y dark:divide-gray-700/50 divide-gray-100">
          {filteredCommits.map((commit) => (
            <CommitRow
              key={commit.hash}
              commit={commit}
              showAgentBadge={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
