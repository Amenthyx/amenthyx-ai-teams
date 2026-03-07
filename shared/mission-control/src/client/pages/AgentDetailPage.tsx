import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCommitHorizontal } from 'lucide-react';
import { useAgentStore } from '../stores/agentStore';
import { useEventStore } from '../stores/eventStore';
import { useCommitStore } from '../stores/commitStore';
import { AgentEventTimeline } from '../components/panels/AgentEventTimeline';
import { AgentMetricsPanel } from '../components/panels/AgentMetricsPanel';
import { AGENT_COLORS, AGENT_NAMES } from '../types/events';
import type { AgentInfo, AgentStatus } from '../types/events';

const STATUS_BADGE: Record<AgentStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  idle: { label: 'Idle', className: 'dark:bg-gray-600/20 bg-gray-200 dark:text-gray-400 text-gray-500 dark:border-gray-500/30 border-gray-300' },
  blocked: { label: 'Blocked', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  done: { label: 'Done', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
};

export const AgentDetailPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const agent = useAgentStore((s) => s.getAgent(role || ''));
  const allEvents = useEventStore((s) => s.events);
  const allCommits = useCommitStore((s) => s.commits);

  const agentEvents = useMemo(
    () => allEvents.filter((e) => e.agent?.role === role),
    [allEvents, role],
  );

  const agentCommits = useMemo(
    () => allCommits.filter((c) => c.agent === role),
    [allCommits, role],
  );

  if (!role) {
    return (
      <div className="p-8 text-center">
        <p className="dark:text-gray-400 text-gray-500">No agent role specified.</p>
      </div>
    );
  }

  const displayAgent: AgentInfo = agent || {
    role,
    name: AGENT_NAMES[role] || role,
    color: AGENT_COLORS[role] || '#6B7280',
    category: 'support',
    status: 'idle',
  };

  const agentColor = AGENT_COLORS[role] || displayAgent.color;
  const statusBadge = STATUS_BADGE[displayAgent.status] || STATUS_BADGE.idle;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm dark:text-gray-400 text-gray-500 hover:dark:text-gray-200 hover:text-gray-700 transition-colors duration-200"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Agent info header */}
      <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Color dot */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: agentColor }}
            >
              {role}
            </div>

            <div>
              <h1 className="text-xl font-bold dark:text-white text-gray-900">
                {displayAgent.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: agentColor }}
                >
                  {role}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${statusBadge.className}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      displayAgent.status === 'active'
                        ? 'bg-green-500 animate-pulse'
                        : displayAgent.status === 'blocked'
                        ? 'bg-red-500 animate-pulse'
                        : displayAgent.status === 'done'
                        ? 'bg-blue-500'
                        : 'dark:bg-gray-500 bg-gray-400'
                    }`}
                  />
                  {statusBadge.label}
                </span>
                <span className="text-xs dark:text-gray-500 text-gray-400 capitalize">
                  {displayAgent.category}
                </span>
              </div>
            </div>
          </div>

          {/* Current task */}
          {displayAgent.currentTask && (
            <div className="dark:bg-gray-700/40 bg-gray-50 rounded-lg px-4 py-2 max-w-md">
              <p className="text-[10px] dark:text-gray-500 text-gray-400 uppercase tracking-wider mb-0.5">
                Current Task
              </p>
              <p className="text-sm dark:text-gray-200 text-gray-700">
                {displayAgent.currentTask}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content: 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Timeline */}
        <AgentEventTimeline events={agentEvents} agentRole={role} />

        {/* Right: Metrics */}
        <AgentMetricsPanel agent={displayAgent} events={agentEvents} />
      </div>

      {/* Recent commits */}
      <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
        <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">
          Recent Commits
        </h3>

        {agentCommits.length === 0 ? (
          <p className="text-sm dark:text-gray-500 text-gray-400 text-center py-6">
            No commits found for this agent
          </p>
        ) : (
          <div className="space-y-2">
            {agentCommits.slice(0, 20).map((commit) => (
              <div
                key={commit.hash}
                className="flex items-start gap-3 px-3 py-2 rounded-lg dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors duration-100"
              >
                <GitCommitHorizontal
                  size={14}
                  className="dark:text-gray-500 text-gray-400 mt-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs dark:text-blue-400 text-blue-600">
                      {commit.hash.slice(0, 7)}
                    </span>
                    <span className="text-[10px] px-1.5 py-0 rounded dark:bg-gray-700 bg-gray-100 dark:text-gray-400 text-gray-500 font-medium">
                      {commit.type}
                    </span>
                    {commit.issue && (
                      <span className="text-[10px] dark:text-gray-500 text-gray-400">
                        {commit.issue}
                      </span>
                    )}
                    {commit.relativeTime && (
                      <span className="text-[10px] dark:text-gray-600 text-gray-400 ml-auto">
                        {commit.relativeTime}
                      </span>
                    )}
                  </div>
                  <p className="text-xs dark:text-gray-300 text-gray-600 mt-0.5 truncate">
                    {commit.description}
                  </p>
                  {(commit.filesChanged !== undefined) && (
                    <div className="flex items-center gap-3 mt-1 text-[10px]">
                      <span className="dark:text-gray-500 text-gray-400">
                        {commit.filesChanged} file{commit.filesChanged !== 1 ? 's' : ''}
                      </span>
                      {commit.additions !== undefined && (
                        <span className="text-green-500">+{commit.additions}</span>
                      )}
                      {commit.deletions !== undefined && (
                        <span className="text-red-400">-{commit.deletions}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {agentCommits.length > 20 && (
          <p className="text-[10px] dark:text-gray-500 text-gray-400 mt-2 text-center">
            Showing 20 of {agentCommits.length} commits
          </p>
        )}
      </div>
    </div>
  );
};
