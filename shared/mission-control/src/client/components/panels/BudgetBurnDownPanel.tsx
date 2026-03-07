import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import { useBudgetStore } from '../../stores/budgetStore';
import { useEventStore } from '../../stores/eventStore';
import { TrendingDown, AlertTriangle } from 'lucide-react';
import { EventCategory } from '../../types/events';

interface BurnDownPoint {
  time: string;
  actual: number;
  planned: number;
}

export const BudgetBurnDownPanel: React.FC = () => {
  const budget = useBudgetStore((s) => s.budget);
  const burnRateHistory = useBudgetStore((s) => s.burnRateHistory);
  const events = useEventStore((s) => s.events);

  const { chartData, burnRatePerHour, plannedRatePerHour, projectedOvershoot } = useMemo(() => {
    // Derive spend timeline from cost events
    const costEvents = events
      .filter((e) => e.category === EventCategory.COST && e.meta?.cost_usd != null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Build cumulative spend over time
    let cumulative = 0;
    const spendPoints: { time: Date; spent: number }[] = [];

    for (const evt of costEvents) {
      cumulative += evt.meta!.cost_usd!;
      spendPoints.push({ time: new Date(evt.timestamp), spent: cumulative });
    }

    // If no cost events, fall back to burnRateHistory from the store
    if (spendPoints.length === 0 && burnRateHistory.length > 0) {
      for (const pt of burnRateHistory) {
        spendPoints.push({ time: new Date(), spent: pt.spent });
      }
    }

    // Calculate session duration for planned line
    const sessionStart = spendPoints.length > 0
      ? spendPoints[0].time
      : new Date();
    const sessionNow = spendPoints.length > 0
      ? spendPoints[spendPoints.length - 1].time
      : new Date();
    const elapsedMs = Math.max(sessionNow.getTime() - sessionStart.getTime(), 1);
    const elapsedHours = elapsedMs / (1000 * 60 * 60);

    // Build chart data with planned burn (linear from total to 0)
    const total = budget.total || 1;
    const points: BurnDownPoint[] = spendPoints.map((pt) => {
      const progressMs = pt.time.getTime() - sessionStart.getTime();
      const progressRatio = elapsedMs > 0 ? progressMs / elapsedMs : 0;
      const plannedRemaining = total * (1 - progressRatio);
      const timeLabel = pt.time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      return {
        time: timeLabel,
        actual: Number((total - pt.spent).toFixed(2)),
        planned: Number(plannedRemaining.toFixed(2)),
      };
    });

    // If no data yet, show a single start point
    if (points.length === 0) {
      points.push({
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        actual: total,
        planned: total,
      });
    }

    // Burn rate calculations
    const currentSpent = budget.spent;
    const currentBurnRate = elapsedHours > 0 ? currentSpent / elapsedHours : 0;
    // Assume session should use budget evenly over ~8h (or scale to current elapsed)
    const plannedRate = elapsedHours > 0 ? (total * (elapsedHours / Math.max(elapsedHours, 1))) / elapsedHours : 0;

    // Projected overshoot: will we exceed total at current rate?
    const projectedTotal = elapsedHours > 0 ? currentBurnRate * Math.max(elapsedHours * 2, 1) : 0;
    const willOvershoot = currentSpent > 0 && budget.total > 0 && (currentSpent / budget.total) > 0.9;

    return {
      chartData: points,
      burnRatePerHour: currentBurnRate,
      plannedRatePerHour: plannedRate,
      projectedOvershoot: willOvershoot,
    };
  }, [events, burnRateHistory, budget]);

  const percentUsed = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingDown size={14} className="dark:text-gray-400 text-gray-500" />
          <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
            Budget Burn-Down
          </h3>
        </div>
        {projectedOvershoot && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/30">
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-[10px] font-medium text-red-400">Overshoot Risk</span>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className="text-[10px] dark:text-gray-500 text-gray-400 uppercase">Spent</p>
          <p className="text-sm font-bold dark:text-gray-200 text-gray-700">
            ${budget.spent.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] dark:text-gray-500 text-gray-400 uppercase">Budget</p>
          <p className="text-sm font-bold dark:text-gray-200 text-gray-700">
            ${budget.total.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] dark:text-gray-500 text-gray-400 uppercase">Burn Rate</p>
          <p className="text-sm font-bold dark:text-gray-200 text-gray-700">
            ${burnRatePerHour.toFixed(2)}/hr
          </p>
        </div>
      </div>

      {/* Burn-down chart */}
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="burnDownGradient" x1="0" y1="0" x2="0" y2="1">
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
            width={50}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#E5E7EB',
            }}
            formatter={(value: number, name: string) => [
              `$${value.toFixed(2)}`,
              name === 'actual' ? 'Remaining' : 'Planned',
            ]}
          />
          {/* Red zone reference line at 0 */}
          <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" strokeOpacity={0.5} />
          {/* Planned burn line (dashed) */}
          <Line
            type="monotone"
            dataKey="planned"
            stroke="#6B7280"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
          />
          {/* Actual remaining (filled area) */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#burnDownGradient)"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] dark:text-gray-500 text-gray-400">Budget consumed</span>
          <span
            className="text-xs font-bold"
            style={{ color: percentUsed >= 80 ? '#EF4444' : percentUsed >= 60 ? '#EAB308' : '#22C55E' }}
          >
            {percentUsed.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full dark:bg-gray-700 bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(percentUsed, 100)}%`,
              backgroundColor: percentUsed >= 80 ? '#EF4444' : percentUsed >= 60 ? '#EAB308' : '#22C55E',
            }}
          />
        </div>
      </div>
    </div>
  );
};
