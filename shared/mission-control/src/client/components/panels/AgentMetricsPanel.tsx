import React, { useMemo } from 'react';
import { Cpu, DollarSign, Activity, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MissionControlEvent, AGENT_COLORS } from '../../types/events';
import { AgentInfo } from '../../types/events';

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCost(n: number): string {
  return `$${n.toFixed(4)}`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const mins = Math.floor(ms / 60_000);
  const secs = Math.floor((ms % 60_000) / 1000);
  return `${mins}m ${secs}s`;
}

interface AgentMetricsPanelProps {
  agent: AgentInfo;
  events: MissionControlEvent[];
}

export const AgentMetricsPanel: React.FC<AgentMetricsPanelProps> = ({ agent, events }) => {
  const agentColor = AGENT_COLORS[agent.role] || agent.color || '#6B7280';

  const metrics = useMemo(() => {
    let totalTokens = 0;
    let totalCost = 0;
    let totalDuration = 0;
    const eventCount = events.length;

    for (const event of events) {
      if (event.meta?.tokens_input) totalTokens += event.meta.tokens_input;
      if (event.meta?.tokens_output) totalTokens += event.meta.tokens_output;
      if (event.meta?.cost_usd) totalCost += event.meta.cost_usd;
      if (event.meta?.duration_ms) totalDuration += event.meta.duration_ms;
    }

    return { totalTokens, totalCost, totalDuration, eventCount };
  }, [events]);

  const activityData = useMemo(() => {
    if (events.length === 0) return [];

    const buckets = new Map<string, number>();

    for (const event of events) {
      try {
        const d = new Date(event.timestamp);
        const key = d.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        });
        buckets.set(key, (buckets.get(key) || 0) + 1);
      } catch {
        // skip malformed timestamps
      }
    }

    return Array.from(buckets.entries())
      .map(([time, count]) => ({ time, count }))
      .slice(-30);
  }, [events]);

  const statCards = [
    {
      label: 'Tokens Used',
      value: formatTokens(agent.tokensUsed || metrics.totalTokens),
      icon: <Cpu size={16} />,
    },
    {
      label: 'Cost',
      value: formatCost(agent.costUsd || metrics.totalCost),
      icon: <DollarSign size={16} />,
    },
    {
      label: 'Events Generated',
      value: String(metrics.eventCount),
      icon: <Activity size={16} />,
    },
    {
      label: 'Active Time',
      value: formatDuration(metrics.totalDuration),
      icon: <Clock size={16} />,
    },
  ];

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-4">
        Agent Metrics
      </h3>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg dark:bg-gray-700/40 bg-gray-50 p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="dark:text-gray-400 text-gray-500">{stat.icon}</span>
              <span className="text-[10px] dark:text-gray-500 text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className="text-lg font-bold dark:text-gray-100 text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Activity over time chart */}
      <div>
        <h4 className="text-xs dark:text-gray-400 text-gray-500 mb-2">Activity Over Time</h4>
        {activityData.length === 0 ? (
          <p className="text-xs dark:text-gray-500 text-gray-400 text-center py-8">
            No activity data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id={`gradient-${agent.role}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={agentColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={agentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#E5E7EB',
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={agentColor}
                strokeWidth={2}
                fill={`url(#gradient-${agent.role})`}
                name="Events"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
