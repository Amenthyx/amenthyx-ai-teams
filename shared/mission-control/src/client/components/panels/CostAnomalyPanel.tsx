import React, { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface CostAnomaly {
  id: string;
  agent: string;
  amount: number;
  z_score: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export function CostAnomalyPanel() {
  const [anomalies, setAnomalies] = useState<CostAnomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnomalies() {
      try {
        const res = await fetch('/api/metrics/cost-anomalies');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAnomalies(Array.isArray(data) ? data : data.anomalies || []);
      } catch {
        setAnomalies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAnomalies();
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-red-400" />
        <h3 className="text-sm font-semibold dark:text-white text-gray-900">
          Cost Anomalies
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
        </div>
      ) : anomalies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 dark:text-gray-500 text-gray-400">
          <AlertTriangle size={24} className="mb-2 opacity-30" />
          <p className="text-xs">No anomalies detected</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {anomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className="flex items-center justify-between p-2 rounded-lg dark:bg-gray-900/50 bg-gray-50 border dark:border-gray-700/50 border-gray-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <AlertTriangle
                  size={14}
                  className={
                    anomaly.severity === 'high'
                      ? 'text-red-400'
                      : anomaly.severity === 'medium'
                      ? 'text-yellow-400'
                      : 'text-blue-400'
                  }
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium dark:text-gray-200 text-gray-800 truncate">
                    {anomaly.agent}
                  </p>
                  <p className="text-xs dark:text-gray-500 text-gray-400">
                    {new Date(anomaly.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-mono dark:text-gray-200 text-gray-800">
                  ${anomaly.amount.toFixed(2)}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded border ${getSeverityBadge(
                    anomaly.severity
                  )}`}
                >
                  z={anomaly.z_score.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
