import React from 'react';
import { AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { useBudgetStore } from '../../stores/budgetStore';
import { useFilterStore } from '../../stores/filterStore';
import { AGENT_COLORS, AGENT_NAMES } from '../../types/events';

function getProgressColor(percent: number): string {
  if (percent < 60) return '#22C55E';
  if (percent < 80) return '#EAB308';
  return '#EF4444';
}

interface CostMonitorPanelProps {
  compact?: boolean;
}

export const CostMonitorPanel: React.FC<CostMonitorPanelProps> = ({ compact = false }) => {
  const budget = useBudgetStore((s) => s.budget);
  const burnRateHistory = useBudgetStore((s) => s.burnRateHistory);
  const perAgentCost = useBudgetStore((s) => s.perAgentCost);
  const percentUsed = useBudgetStore((s) => s.getPercentUsed());
  const isOverThreshold = useBudgetStore((s) => s.isOverThreshold());
  const { selectedAgents } = useFilterStore();

  const progressColor = getProgressColor(percentUsed);

  // Prepare per-agent bar data
  const agentCostData = Object.entries(perAgentCost)
    .map(([agent, cost]) => ({
      agent,
      name: AGENT_NAMES[agent] || agent,
      cost: Number(cost.toFixed(2)),
      color: AGENT_COLORS[agent] || '#6B7280',
      highlighted: selectedAgents.length === 0 || selectedAgents.includes(agent),
    }))
    .sort((a, b) => b.cost - a.cost);

  return (
    <div>
      <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">
        Cost Monitor
      </h2>

      <div className="card p-4 space-y-4">
        {/* Alert banner */}
        {isOverThreshold && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span className="text-xs text-red-400 font-medium">
              Budget usage exceeds {Math.round(budget.alertThreshold * 100)}% threshold
            </span>
          </div>
        )}

        {/* Budget progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="dark:text-gray-400 text-gray-500" />
              <span className="text-sm font-medium dark:text-gray-200 text-gray-700">
                ${budget.spent.toFixed(2)} / ${budget.total.toFixed(2)} {budget.currency}
              </span>
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: progressColor }}
            >
              {percentUsed.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full dark:bg-gray-700 bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(percentUsed, 100)}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
        </div>

        {/* Burn rate chart */}
        {!compact && burnRateHistory.length > 1 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="dark:text-gray-400 text-gray-500" />
              <span className="text-xs font-medium dark:text-gray-400 text-gray-500">
                Burn Rate
              </span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={burnRateHistory}>
                <defs>
                  <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                  width={40}
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
                  dataKey="spent"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#burnGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Per-agent cost */}
        {!compact && agentCostData.length > 0 && (
          <div>
            <span className="text-xs font-medium dark:text-gray-400 text-gray-500 mb-2 block">
              Cost by Agent
            </span>
            <ResponsiveContainer width="100%" height={Math.max(agentCostData.length * 28, 80)}>
              <BarChart data={agentCostData} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
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
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                />
                <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={16}>
                  {agentCostData.map((entry) => (
                    <Cell
                      key={entry.agent}
                      fill={entry.color}
                      fillOpacity={entry.highlighted ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Empty state */}
        {agentCostData.length === 0 && !compact && (
          <p className="text-xs dark:text-gray-600 text-gray-400 text-center py-4 italic">
            No cost data yet
          </p>
        )}
      </div>
    </div>
  );
};
