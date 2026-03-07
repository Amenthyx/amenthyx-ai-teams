import React, { useEffect, useState } from 'react';
import { HeatmapChart } from '../charts/HeatmapChart';

interface TokenBucket {
  agent: string;
  buckets: number[];
}

export function TokenHeatmapPanel() {
  const [data, setData] = useState<number[][]>([]);
  const [agents, setAgents] = useState<string[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokenData() {
      try {
        const res = await fetch('/api/metrics/tokens');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const buckets: TokenBucket[] = json.buckets || [];
        const agentNames = buckets.map((b) => b.agent);
        const matrix = buckets.map((b) => b.buckets);
        const labels = json.timeLabels || matrix[0]?.map((_: unknown, i: number) => `T${i}`) || [];

        setAgents(agentNames);
        setData(matrix);
        setTimeLabels(labels);
      } catch {
        // Use placeholder data if API unavailable
        const placeholderAgents = ['Architect', 'Frontend', 'Backend', 'QA', 'DevOps'];
        const placeholderTime = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        const placeholderData = placeholderAgents.map(() =>
          placeholderTime.map(() => Math.floor(Math.random() * 10000))
        );
        setAgents(placeholderAgents);
        setTimeLabels(placeholderTime);
        setData(placeholderData);
      } finally {
        setLoading(false);
      }
    }
    fetchTokenData();
  }, []);

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <h3 className="text-sm font-semibold dark:text-white text-gray-900 mb-3">
        Token Usage Heatmap
      </h3>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-xs dark:text-gray-500 text-gray-400 text-center py-8">
          No token data available
        </div>
      ) : (
        <HeatmapChart
          data={data}
          xLabels={timeLabels}
          yLabels={agents}
          colorScale={[
            { threshold: 0, color: '#1e293b' },
            { threshold: 1000, color: '#1e3a5f' },
            { threshold: 3000, color: '#2563eb' },
            { threshold: 6000, color: '#f59e0b' },
            { threshold: 9000, color: '#ef4444' },
          ]}
        />
      )}
    </div>
  );
}
