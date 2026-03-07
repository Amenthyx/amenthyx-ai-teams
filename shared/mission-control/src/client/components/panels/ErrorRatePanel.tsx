import React, { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { useEventStore } from '../../stores/eventStore';
import { AGENT_COLORS, AGENT_NAMES } from '../../types/events';

export const ErrorRatePanel: React.FC = () => {
  const events = useEventStore((s) => s.events);

  const errorEvents = useMemo(
    () => events.filter((e) => e.severity === 'error' || e.severity === 'critical'),
    [events]
  );

  const errorsByAgent = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of errorEvents) {
      const agent = event.agent?.role || 'unknown';
      counts[agent] = (counts[agent] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([agent, count]) => ({
        agent,
        name: AGENT_NAMES[agent] || agent,
        count,
        color: AGENT_COLORS[agent] || '#6B7280',
      }))
      .sort((a, b) => b.count - a.count);
  }, [errorEvents]);

  const errorsOverTime = useMemo(() => {
    if (errorEvents.length === 0) return [];
    const buckets: Record<string, number> = {};
    for (const event of errorEvents) {
      const date = event.timestamp.slice(0, 16); // YYYY-MM-DDTHH:MM
      buckets[date] = (buckets[date] || 0) + 1;
    }
    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, count]) => ({
        time: time.slice(11), // HH:MM
        errors: count,
      }));
  }, [errorEvents]);

  const totalErrors = errorEvents.length;
  const totalEvents = events.length;
  const errorRate = totalEvents > 0 ? ((totalErrors / totalEvents) * 100).toFixed(1) : '0.0';

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <h3 className="text-sm font-semibold dark:text-gray-200 text-gray-800 mb-3">
        Error Rate Monitor
      </h3>

      {/* Big number */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <div>
          <div className="text-3xl font-bold dark:text-gray-100 text-gray-900">
            {errorRate}%
          </div>
          <div className="text-xs dark:text-gray-500 text-gray-400">
            {totalErrors} errors / {totalEvents} events
          </div>
        </div>
      </div>

      {/* Errors by agent bar chart */}
      {errorsByAgent.length > 0 && (
        <div className="mb-4">
          <span className="text-xs font-medium dark:text-gray-400 text-gray-500 mb-2 block">
            Errors by Agent
          </span>
          <ResponsiveContainer width="100%" height={Math.max(errorsByAgent.length * 28, 80)}>
            <BarChart data={errorsByAgent} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
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
                formatter={(value: number) => [value, 'Errors']}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {errorsByAgent.map((entry) => (
                  <Cell key={entry.agent} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Error rate over time line chart */}
      {errorsOverTime.length > 1 && (
        <div>
          <span className="text-xs font-medium dark:text-gray-400 text-gray-500 mb-2 block">
            Errors Over Time
          </span>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={errorsOverTime}>
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
                width={30}
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
              <Line
                type="monotone"
                dataKey="errors"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty state */}
      {totalErrors === 0 && (
        <p className="text-xs dark:text-gray-600 text-gray-400 text-center py-4 italic">
          No errors recorded
        </p>
      )}
    </div>
  );
};
