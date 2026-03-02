import React from 'react';
import { Clock, DollarSign, Cpu } from 'lucide-react';
import { useAgentStore } from '../../stores/agentStore';
import { useFilterStore } from '../../stores/filterStore';
import { AgentInfo, AGENT_COLORS } from '../../types/events';

interface AgentCardProps {
  agent: AgentInfo;
  onClick: () => void;
}

function StatusDot({ status }: { status: AgentInfo['status'] }) {
  const classes: Record<string, string> = {
    active: 'w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse',
    idle: 'w-2.5 h-2.5 rounded-full bg-gray-500',
    blocked: 'w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse',
    done: 'w-2.5 h-2.5 rounded-full bg-blue-500',
  };

  return <span className={classes[status] || classes.idle} />;
}

function StatusLabel({ status }: { status: AgentInfo['status'] }) {
  const labels: Record<string, { text: string; class: string }> = {
    active: { text: 'Active', class: 'text-green-400' },
    idle: { text: 'Idle', class: 'dark:text-gray-500 text-gray-400' },
    blocked: { text: 'Blocked', class: 'text-red-400' },
    done: { text: 'Done', class: 'text-blue-400' },
  };
  const info = labels[status] || labels.idle;
  return <span className={`text-xs font-medium ${info.class}`}>{info.text}</span>;
}

function formatTokens(n?: number): string {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function formatCost(n?: number): string {
  if (!n) return '$0.00';
  return `$${n.toFixed(2)}`;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  const color = AGENT_COLORS[agent.role] || agent.color;

  return (
    <button
      onClick={onClick}
      className="card p-4 text-left w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {agent.role}
          </span>
          <span className="text-sm font-medium dark:text-gray-200 text-gray-800 truncate">
            {agent.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status={agent.status} />
          <StatusLabel status={agent.status} />
        </div>
      </div>

      {/* Current task */}
      <div className="mb-3 min-h-[2.5rem]">
        {agent.currentTask ? (
          <p
            className="text-xs dark:text-gray-400 text-gray-500 line-clamp-2"
            title={agent.currentTask}
          >
            {agent.currentTask}
          </p>
        ) : (
          <p className="text-xs dark:text-gray-600 text-gray-300 italic">No active task</p>
        )}
      </div>

      {/* Footer metrics */}
      <div className="flex items-center gap-4 text-xs dark:text-gray-500 text-gray-400">
        <div className="flex items-center gap-1" title="Tokens used">
          <Cpu size={12} />
          <span>{formatTokens(agent.tokensUsed)}</span>
        </div>
        <div className="flex items-center gap-1" title="Cost">
          <DollarSign size={12} />
          <span>{formatCost(agent.costUsd)}</span>
        </div>
        {agent.lastAction && (
          <div className="flex items-center gap-1 ml-auto" title="Last action">
            <Clock size={12} />
            <span className="truncate max-w-[80px]">{agent.lastAction}</span>
          </div>
        )}
      </div>
    </button>
  );
};

interface AgentActivityPanelProps {
  compact?: boolean;
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({ compact = false }) => {
  const agents = useAgentStore((s) => s.getAllAgents());
  const { toggleAgent, getFilteredItems } = useFilterStore();

  const filteredAgents = getFilteredItems(agents, (a) => a.role);

  if (filteredAgents.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="dark:text-gray-500 text-gray-400 text-sm">No agents match the current filter</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">
        Agent Activity
      </h2>
      <div
        className={`grid gap-3 ${
          compact
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}
      >
        {filteredAgents.map((agent) => (
          <AgentCard
            key={agent.role}
            agent={agent}
            onClick={() => toggleAgent(agent.role)}
          />
        ))}
      </div>
    </div>
  );
};
