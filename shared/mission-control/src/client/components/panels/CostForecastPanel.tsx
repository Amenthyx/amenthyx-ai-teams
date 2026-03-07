import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { linearRegression, type DataPoint } from '../../utils/linearRegression';
import { useBudgetStore } from '../../stores/budgetStore';

const TOOLTIP_STYLE = {
  backgroundColor: '#1F2937',
  border: '1px solid #374151',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#E5E7EB',
};

interface CostForecastPanelProps {
  compact?: boolean;
}

/**
 * Shows current spend, projected final cost (linear regression), and burn rate.
 * Uses a line chart with actual line and dashed projected line.
 */
export const CostForecastPanel: React.FC<CostForecastPanelProps> = ({ compact = false }) => {
  const budget = useBudgetStore((s) => s.budget);
  const burnRateHistory = useBudgetStore((s) => s.burnRateHistory);

  const forecast = useMemo(() => {
    if (burnRateHistory.length < 2) {
      return { projectedCost: budget.spent, burnRate: 0, r2: 0, chartData: [] };
    }

    // Build regression data points: x = index, y = spent
    const dataPoints: DataPoint[] = burnRateHistory.map((entry, i) => ({
      x: i,
      y: entry.spent,
    }));

    const regression = linearRegression(dataPoints);

    // Burn rate: slope (cost increase per data point interval)
    const burnRate = regression.slope;

    // Project forward: assume we want to double the current data length
    const totalPoints = burnRateHistory.length;
    const projectionPoints = Math.max(totalPoints, 10);

    // Build chart data: actual + projected
    const chartData: Array<{
      index: number;
      time: string;
      actual: number | null;
      projected: number | null;
    }> = [];

    for (let i = 0; i < totalPoints; i++) {
      chartData.push({
        index: i,
        time: burnRateHistory[i].time,
        actual: burnRateHistory[i].spent,
        projected: null,
      });
    }

    // Add projected points (starting from last actual)
    const lastActual = burnRateHistory[totalPoints - 1];
    const projSteps = Math.ceil(projectionPoints * 0.5);

    for (let i = 0; i <= projSteps; i++) {
      const xi = totalPoints - 1 + i;
      const predicted = Math.max(0, regression.predict(xi));

      if (i === 0) {
        // Overlap point: connect actual and projected
        chartData[chartData.length - 1].projected = lastActual.spent;
      } else {
        chartData.push({
          index: xi,
          time: `+${i}`,
          actual: null,
          projected: Math.round(predicted * 100) / 100,
        });
      }
    }

    // Projected final cost: predict at last projection index
    const projectedCost = Math.max(0, regression.predict(totalPoints - 1 + projSteps));

    return {
      projectedCost: Math.round(projectedCost * 100) / 100,
      burnRate: Math.round(burnRate * 100) / 100,
      r2: regression.r2,
      chartData,
    };
  }, [burnRateHistory, budget.spent]);

  const overBudget = forecast.projectedCost > budget.total && budget.total > 0;
  const percentProjected = budget.total > 0 ? (forecast.projectedCost / budget.total) * 100 : 0;

  return (
    <div>
      <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
        <TrendingUp size={14} />
        Cost Forecast
      </h2>

      <div className="card p-4 space-y-4">
        {/* Over-budget warning */}
        {overBudget && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertTriangle size={14} className="text-red-400 shrink-0" />
            <span className="text-xs text-red-400 font-medium">
              Projected cost exceeds budget by ${(forecast.projectedCost - budget.total).toFixed(2)}
            </span>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="dark:bg-gray-800/50 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign size={12} className="dark:text-gray-500 text-gray-400" />
              <span className="text-[10px] font-medium dark:text-gray-500 text-gray-400 uppercase">
                Current Spend
              </span>
            </div>
            <span className="text-lg font-bold dark:text-gray-100 text-gray-800">
              ${budget.spent.toFixed(2)}
            </span>
          </div>

          <div className="dark:bg-gray-800/50 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp size={12} className="dark:text-gray-500 text-gray-400" />
              <span className="text-[10px] font-medium dark:text-gray-500 text-gray-400 uppercase">
                Projected Final
              </span>
            </div>
            <span className={`text-lg font-bold ${overBudget ? 'text-red-400' : 'dark:text-gray-100 text-gray-800'}`}>
              ${forecast.projectedCost.toFixed(2)}
            </span>
            {budget.total > 0 && (
              <span className="text-[10px] dark:text-gray-500 text-gray-400 block">
                {percentProjected.toFixed(0)}% of budget
              </span>
            )}
          </div>

          <div className="dark:bg-gray-800/50 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[10px] font-medium dark:text-gray-500 text-gray-400 uppercase">
                Burn Rate
              </span>
            </div>
            <span className="text-lg font-bold dark:text-gray-100 text-gray-800">
              ${Math.abs(forecast.burnRate).toFixed(2)}
            </span>
            <span className="text-[10px] dark:text-gray-500 text-gray-400 block">
              per interval
            </span>
          </div>
        </div>

        {/* Chart */}
        {!compact && forecast.chartData.length > 1 && (
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-blue-500 rounded" />
                <span className="text-[10px] dark:text-gray-400 text-gray-500">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 border-t-2 border-dashed border-yellow-500" />
                <span className="text-[10px] dark:text-gray-400 text-gray-500">Projected</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={forecast.chartData}>
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
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number, name: string) => [
                    `$${value.toFixed(2)}`,
                    name === 'actual' ? 'Actual' : 'Projected',
                  ]}
                />
                {budget.total > 0 && (
                  <ReferenceLine
                    y={budget.total}
                    stroke="#EF4444"
                    strokeDasharray="8 4"
                    label={{ value: 'Budget', fill: '#EF4444', fontSize: 10 }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#EAB308"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* R-squared note */}
        {!compact && forecast.r2 > 0 && (
          <div className="text-[10px] dark:text-gray-600 text-gray-400 text-right">
            Regression fit: R2 = {forecast.r2.toFixed(3)}
          </div>
        )}

        {/* Empty state */}
        {burnRateHistory.length < 2 && (
          <p className="text-xs dark:text-gray-600 text-gray-400 text-center py-4 italic">
            Need more data points for forecast
          </p>
        )}
      </div>
    </div>
  );
};
