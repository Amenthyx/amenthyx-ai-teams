import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Gauge } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ResponseTimeStats {
  avg: number;
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
}

interface TimelineEntry {
  timestamp: string;
  durationMs: number;
  path: string;
  statusCode: number;
}

interface MetricsResponse {
  totalRequests: number;
  bufferedRequests: number;
  responseTimes: ResponseTimeStats;
  timeline: TimelineEntry[];
}

const TOOLTIP_STYLE = {
  backgroundColor: '#1F2937',
  border: '1px solid #374151',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#E5E7EB',
};

interface PerformanceMetricsPanelProps {
  compact?: boolean;
  refreshInterval?: number;
}

/**
 * Shows API response time stats: avg, p50, p95, p99 as stat cards.
 * Line chart of response times over the last hour.
 * Fetches from /api/metrics.
 */
export const PerformanceMetricsPanel: React.FC<PerformanceMetricsPanelProps> = ({
  compact = false,
  refreshInterval = 15_000,
}) => {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/metrics?window=3600000');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: MetricsResponse = await res.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchMetrics, refreshInterval]);

  const stats = metrics?.responseTimes;
  const chartData = (metrics?.timeline || []).map((entry) => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: entry.durationMs,
  }));

  return (
    <div>
      <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Activity size={14} />
        Performance Metrics
      </h2>

      <div className="card p-4 space-y-4">
        {loading && !metrics && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          </div>
        )}

        {error && !metrics && (
          <div className="text-xs text-red-400 text-center py-4">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Avg" value={stats.avg} unit="ms" icon={<Gauge size={14} />} />
              <StatCard label="p50" value={stats.p50} unit="ms" />
              <StatCard label="p95" value={stats.p95} unit="ms" color={stats.p95 > 500 ? 'yellow' : undefined} />
              <StatCard label="p99" value={stats.p99} unit="ms" color={stats.p99 > 1000 ? 'red' : undefined} />
            </div>

            {/* Total requests */}
            <div className="flex items-center justify-between text-xs dark:text-gray-500 text-gray-400">
              <span>Total requests: {metrics!.totalRequests.toLocaleString()}</span>
              <span>Buffered: {metrics!.bufferedRequests}</span>
            </div>

            {/* Timeline chart */}
            {!compact && chartData.length > 1 && (
              <div>
                <span className="text-xs font-medium dark:text-gray-400 text-gray-500 mb-2 block">
                  Response Time (last hour)
                </span>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData}>
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
                      unit="ms"
                    />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      formatter={(value: number) => [`${value.toFixed(1)}ms`, 'Duration']}
                    />
                    <Line
                      type="monotone"
                      dataKey="duration"
                      stroke="#3B82F6"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && !stats && (
          <p className="text-xs dark:text-gray-600 text-gray-400 text-center py-4 italic">
            No performance data yet
          </p>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  icon?: React.ReactNode;
  color?: 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon, color }) => {
  const valueColor =
    color === 'red'
      ? 'text-red-400'
      : color === 'yellow'
        ? 'text-yellow-400'
        : 'dark:text-gray-100 text-gray-800';

  return (
    <div className="dark:bg-gray-800/50 bg-gray-50 rounded-lg p-3">
      <div className="flex items-center gap-1 mb-1">
        {icon && <span className="dark:text-gray-500 text-gray-400">{icon}</span>}
        <span className="text-[10px] font-medium dark:text-gray-500 text-gray-400 uppercase">
          {label}
        </span>
      </div>
      <span className={`text-lg font-bold ${valueColor}`}>
        {value.toFixed(1)}
      </span>
      <span className="text-[10px] dark:text-gray-500 text-gray-400 ml-0.5">
        {unit}
      </span>
    </div>
  );
};
