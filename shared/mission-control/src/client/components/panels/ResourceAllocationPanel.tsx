import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Cpu } from 'lucide-react';
import { useAgentStore } from '../../stores/agentStore';
import { AGENT_COLORS, AGENT_NAMES } from '../../types/events';

export const ResourceAllocationPanel: React.FC = () => {
  const agents = useAgentStore((s) => s.getAllAgents());

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === 'active').length;

  const data = agents.map((agent) => {
    const utilization = agent.status === 'active' ? 100
      : agent.status === 'blocked' ? 50
      : agent.status === 'done' ? 0
      : 0;

    return {
      agent: agent.role,
      name: AGENT_NAMES[agent.role] || agent.name || agent.role,
      utilization,
      color: AGENT_COLORS[agent.role] || agent.color || '#6B7280',
    };
  }).sort((a, b) => b.utilization - a.utilization);

  const overallUtilization = totalAgents > 0
    ? Math.round((activeAgents / totalAgents) * 100)
    : 0;

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Cpu size={14} className="dark:text-gray-400 text-gray-500" />
          <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
            Resource Allocation
          </h3>
        </div>
        <span className="text-xs font-medium dark:text-gray-400 text-gray-500">
          {activeAgents}/{totalAgents} active ({overallUtilization}%)
        </span>
      </div>

      {data.length === 0 ? (
        <p className="text-xs dark:text-gray-600 text-gray-400 italic text-center py-4">
          No agents registered
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(data.length * 28, 80)}>
          <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="agent"
              tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#E5E7EB',
              }}
              formatter={(value: number) => [`${value}%`, 'Utilization']}
            />
            <Bar dataKey="utilization" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((entry) => (
                <Cell
                  key={entry.agent}
                  fill={entry.color}
                  fillOpacity={entry.utilization > 0 ? 1 : 0.2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
