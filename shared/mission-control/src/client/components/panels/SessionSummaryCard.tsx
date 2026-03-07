import React from 'react';
import { Clock, Activity, Users, DollarSign, CheckCircle, Layers } from 'lucide-react';
import { useAgentStore } from '../../stores/agentStore';
import { useBudgetStore } from '../../stores/budgetStore';
import { useEventStore } from '../../stores/eventStore';
import { useWaveStore } from '../../stores/waveStore';
import { useTestStore } from '../../stores/testStore';

function formatDuration(events: { timestamp: string }[]): string {
  if (events.length < 2) return '0m';
  try {
    const sorted = events
      .map((e) => new Date(e.timestamp).getTime())
      .filter((t) => !isNaN(t))
      .sort((a, b) => a - b);
    if (sorted.length < 2) return '0m';
    const diffMs = sorted[sorted.length - 1] - sorted[0];
    const mins = Math.floor(diffMs / 60_000);
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `${hours}h ${mins % 60}m`;
    return `${mins}m`;
  } catch {
    return '0m';
  }
}

export const SessionSummaryCard: React.FC = () => {
  const agents = useAgentStore((s) => s.getAllAgents());
  const events = useEventStore((s) => s.events);
  const percentUsed = useBudgetStore((s) => s.getPercentUsed());
  const currentWave = useWaveStore((s) => s.getCurrentWave());
  const totalPassed = useTestStore((s) => s.getTotalPassed());
  const totalFailed = useTestStore((s) => s.getTotalFailed());

  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const totalTests = totalPassed + totalFailed;
  const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  const items = [
    {
      label: 'Duration',
      value: formatDuration(events),
      icon: <Clock size={14} />,
    },
    {
      label: 'Events',
      value: String(events.length),
      icon: <Activity size={14} />,
    },
    {
      label: 'Active Agents',
      value: `${activeAgents}/${agents.length}`,
      icon: <Users size={14} />,
    },
    {
      label: 'Budget Spent',
      value: `${percentUsed.toFixed(1)}%`,
      icon: <DollarSign size={14} />,
    },
    {
      label: 'Tests Pass Rate',
      value: totalTests > 0 ? `${passRate}%` : 'N/A',
      icon: <CheckCircle size={14} />,
    },
    {
      label: 'Current Wave',
      value: currentWave ? `W${currentWave.number}: ${currentWave.name}` : 'N/A',
      icon: <Layers size={14} />,
    },
  ];

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">
        Session Summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="dark:text-gray-500 text-gray-400 shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] dark:text-gray-500 text-gray-400 uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-sm font-semibold dark:text-gray-200 text-gray-800 truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
