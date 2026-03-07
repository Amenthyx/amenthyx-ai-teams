import React, { useEffect, useState } from 'react';
import { Shield, TrendingDown } from 'lucide-react';

interface RateLimitStats {
  requestsPerMinute: number;
  throttledCount: number;
  topEndpoints: { endpoint: string; count: number; throttled: number }[];
}

export function RateLimitPanel() {
  const [stats, setStats] = useState<RateLimitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/metrics/rate-limits');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} className="text-orange-400" />
        <h3 className="text-sm font-semibold dark:text-white text-gray-900">
          Rate Limiting
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
        </div>
      ) : !stats ? (
        <div className="text-xs dark:text-gray-500 text-gray-400 text-center py-6">
          Rate limit data unavailable
        </div>
      ) : (
        <div className="space-y-3">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-lg dark:bg-gray-900/50 bg-gray-50">
              <p className="text-xs dark:text-gray-500 text-gray-400">Req/min</p>
              <p className="text-lg font-bold font-mono dark:text-white text-gray-900">
                {stats.requestsPerMinute}
              </p>
            </div>
            <div className="p-2 rounded-lg dark:bg-gray-900/50 bg-gray-50">
              <p className="text-xs dark:text-gray-500 text-gray-400">Throttled</p>
              <p
                className={`text-lg font-bold font-mono ${
                  stats.throttledCount > 0
                    ? 'text-red-400'
                    : 'dark:text-white text-gray-900'
                }`}
              >
                {stats.throttledCount}
              </p>
            </div>
          </div>

          {/* Top endpoints */}
          {stats.topEndpoints && stats.topEndpoints.length > 0 && (
            <div className="border-t dark:border-gray-700 border-gray-200 pt-2">
              <p className="text-xs dark:text-gray-500 text-gray-400 mb-2 flex items-center gap-1">
                <TrendingDown size={12} />
                Top Endpoints
              </p>
              <div className="space-y-1.5">
                {stats.topEndpoints.map((ep, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="dark:text-gray-300 text-gray-700 font-mono truncate flex-1 mr-2">
                      {ep.endpoint}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="dark:text-gray-400 text-gray-500">{ep.count}</span>
                      {ep.throttled > 0 && (
                        <span className="text-red-400 font-medium">
                          ({ep.throttled} blocked)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
