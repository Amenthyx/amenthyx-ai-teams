import React, { useEffect } from 'react';
import { Play } from 'lucide-react';
import { useCIStore, CIRun } from '../../stores/ciStore';

function StatusDot({ status }: { status: CIRun['status'] }) {
  const classes: Record<string, string> = {
    running: 'w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse',
    pass: 'w-2.5 h-2.5 rounded-full bg-green-500',
    fail: 'w-2.5 h-2.5 rounded-full bg-red-500',
  };
  return <span className={classes[status] || classes.running} />;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

export const CICDPanel: React.FC = () => {
  const ciRuns = useCIStore((s) => s.ciRuns);
  const setRuns = useCIStore((s) => s.setRuns);

  useEffect(() => {
    fetch('/api/ci/runs')
      .then((r) => r.json())
      .then((data) => {
        if (data.runs) setRuns(data.runs);
      })
      .catch(() => {});
  }, [setRuns]);

  const latest = ciRuns.slice(0, 5);

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Play size={14} className="dark:text-gray-400 text-gray-500" />
        <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
          CI/CD Pipelines
        </h3>
      </div>

      {latest.length === 0 ? (
        <p className="text-xs dark:text-gray-600 text-gray-400 italic text-center py-4">
          No pipeline runs yet
        </p>
      ) : (
        <div className="space-y-2">
          {latest.map((run) => (
            <div
              key={run.id}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors"
            >
              <StatusDot status={run.status} />
              <span className="text-xs font-medium dark:text-gray-200 text-gray-700 flex-1 truncate">
                {run.pipeline_id}
              </span>
              <span className="text-xs dark:text-gray-500 text-gray-400">
                {formatDuration(run.duration)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
