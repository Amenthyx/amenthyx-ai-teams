import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useCIStore, CIRun } from '../stores/ciStore';

function StatusBadge({ status }: { status: CIRun['status'] }) {
  const styles: Record<string, string> = {
    running: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    pass: 'bg-green-500/20 text-green-400 border border-green-500/30',
    fail: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.running}`}>
      {status === 'running' && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mr-1.5" />
      )}
      {status}
    </span>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

function formatTimestamp(ts: string): string {
  try {
    const date = new Date(ts);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return ts;
  }
}

export const CICDPage: React.FC = () => {
  const ciRuns = useCIStore((s) => s.ciRuns);
  const setRuns = useCIStore((s) => s.setRuns);
  const [loading, setLoading] = useState(false);

  const fetchRuns = useCallback(() => {
    setLoading(true);
    fetch('/api/ci/runs')
      .then((r) => r.json())
      .then((data) => {
        if (data.runs) setRuns(data.runs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setRuns]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
          CI/CD Pipeline Monitor
        </h2>
        <button
          onClick={fetchRuns}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600 dark:hover:bg-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="dark:bg-gray-800 bg-gray-50 border-b dark:border-gray-700 border-gray-200">
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Pipeline ID
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Trigger Agent
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700 divide-gray-200">
            {ciRuns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <p className="text-xs dark:text-gray-600 text-gray-400 italic">
                    No pipeline runs recorded
                  </p>
                </td>
              </tr>
            ) : (
              ciRuns.map((run) => (
                <tr
                  key={run.id}
                  className="dark:hover:bg-gray-800/50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2.5 text-xs font-medium dark:text-gray-200 text-gray-700 font-mono">
                    {run.pipeline_id}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className="px-4 py-2.5 text-xs dark:text-gray-300 text-gray-600">
                    {run.trigger_agent || '--'}
                  </td>
                  <td className="px-4 py-2.5 text-xs dark:text-gray-400 text-gray-500 font-mono">
                    {formatDuration(run.duration)}
                  </td>
                  <td className="px-4 py-2.5 text-xs dark:text-gray-500 text-gray-400">
                    {formatTimestamp(run.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
