import React, { useEffect, useState, useCallback } from 'react';
import { BarChart3 } from 'lucide-react';
import { AnalyticsChartsPanel } from '../components/panels/AnalyticsChartsPanel';
import { ExportMenu } from '../components/common/ExportMenu';

type TimeRange = '1h' | '6h' | '24h' | 'all';

interface AnalyticsSummary {
  total: number;
  range: string;
  byCategory: Array<{ category: string; count: number }>;
  bySeverity: Array<{ severity: string; count: number }>;
  byAgent: Array<{ agent_role: string; count: number }>;
  costOverTime: Array<{ time: string; cost: number }>;
}

interface TimelineData {
  range: string;
  timeline: Array<Record<string, unknown>>;
}

/**
 * Session Analytics page with multiple charts.
 * Shows: events over time (AreaChart), events by category (PieChart),
 * agent activity distribution (BarChart), cost over time (LineChart).
 * Fetches from /api/analytics/summary and /api/analytics/timeline.
 */
export const AnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<TimeRange>('24h');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, timelineRes] = await Promise.all([
        fetch(`/api/analytics/summary?range=${range}`),
        fetch(`/api/analytics/timeline?range=${range}&buckets=30`),
      ]);

      if (!summaryRes.ok) throw new Error(`Summary: HTTP ${summaryRes.status}`);
      if (!timelineRes.ok) throw new Error(`Timeline: HTTP ${timelineRes.status}`);

      const summaryData: AnalyticsSummary = await summaryRes.json();
      const timelineData: TimelineData = await timelineRes.json();

      setSummary(summaryData);
      setTimeline(timelineData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derive chart data
  const categoryData = (summary?.byCategory || []).map((c) => ({
    name: c.category,
    count: c.count,
  }));

  const agentData = (summary?.byAgent || []).map((a) => ({
    name: a.agent_role,
    events: a.count,
  }));

  const costData = (summary?.costOverTime || []).map((c) => ({
    name: formatTimeLabel(c.time),
    cost: c.cost,
  }));

  // Timeline: extract all category keys and build data
  const timelineChartData = (timeline?.timeline || []).map((entry) => {
    const point: Record<string, unknown> = { name: formatTimeLabel(entry.time as string) };
    for (const [key, value] of Object.entries(entry)) {
      if (key !== 'time') {
        point[key] = value;
      }
    }
    return point;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold dark:text-gray-100 text-gray-800 flex items-center gap-2">
          <BarChart3 size={20} />
          Session Analytics
        </h1>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center gap-1 dark:bg-gray-800 bg-gray-100 rounded-lg p-0.5">
            {(['1h', '6h', '24h', 'all'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  range === r
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 hover:text-gray-700'
                }`}
              >
                {r === 'all' ? 'All' : r}
              </button>
            ))}
          </div>

          <ExportMenu />
        </div>
      </div>

      {/* Loading state */}
      {loading && !summary && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="card p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard
            label="Total Events"
            value={summary.total.toLocaleString()}
          />
          <SummaryCard
            label="Categories"
            value={String(summary.byCategory.length)}
          />
          <SummaryCard
            label="Active Agents"
            value={String(summary.byAgent.length)}
          />
          <SummaryCard
            label="Total Cost"
            value={`$${summary.costOverTime.reduce((sum, c) => sum + c.cost, 0).toFixed(2)}`}
          />
        </div>
      )}

      {/* Charts grid */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events over time */}
          <AnalyticsChartsPanel
            title="Events Over Time"
            chartType="area"
            data={timelineChartData}
            dataKeys={['total']}
            gradientId="events-timeline"
            height={220}
          />

          {/* Events by category */}
          <AnalyticsChartsPanel
            title="Events by Category"
            chartType="pie"
            data={categoryData}
            dataKeys={['count']}
            height={220}
          />

          {/* Agent activity distribution */}
          <AnalyticsChartsPanel
            title="Agent Activity"
            chartType="bar"
            data={agentData}
            dataKeys={['events']}
            height={220}
          />

          {/* Cost over time */}
          <AnalyticsChartsPanel
            title="Cost Over Time"
            chartType="line"
            data={costData}
            dataKeys={['cost']}
            height={220}
          />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && summary && summary.total === 0 && (
        <div className="card p-8 text-center">
          <p className="dark:text-gray-500 text-gray-400 text-sm">
            No events in the selected time range
          </p>
        </div>
      )}

      {/* Footer */}
      {summary && summary.total > 0 && (
        <div className="text-xs dark:text-gray-500 text-gray-400 text-center">
          Showing {summary.total.toLocaleString()} events
          {range !== 'all' ? ` from last ${range}` : ' total'}
        </div>
      )}
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value }) => (
  <div className="card p-3">
    <span className="text-[10px] font-medium dark:text-gray-500 text-gray-400 uppercase block mb-1">
      {label}
    </span>
    <span className="text-xl font-bold dark:text-gray-100 text-gray-800">
      {value}
    </span>
  </div>
);

function formatTimeLabel(isoOrTime: string): string {
  try {
    const d = new Date(isoOrTime);
    if (isNaN(d.getTime())) return isoOrTime;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoOrTime;
  }
}
