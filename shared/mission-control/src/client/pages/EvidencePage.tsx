import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Camera, Terminal, FlaskConical, GitCommitHorizontal, FileCheck } from 'lucide-react';
import { useEvidenceStore, Evidence } from '../stores/evidenceStore';

const TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All Types' },
  { value: 'screenshot', label: 'Screenshot' },
  { value: 'log', label: 'Log' },
  { value: 'test', label: 'Test' },
  { value: 'commit', label: 'Commit' },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  screenshot: <Camera size={14} className="text-blue-400" />,
  log: <Terminal size={14} className="text-yellow-400" />,
  test: <FlaskConical size={14} className="text-purple-400" />,
  commit: <GitCommitHorizontal size={14} className="text-green-400" />,
};

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    screenshot: 'bg-blue-500/20 text-blue-400',
    log: 'bg-yellow-500/20 text-yellow-400',
    test: 'bg-purple-500/20 text-purple-400',
    commit: 'bg-green-500/20 text-green-400',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[type] || 'dark:bg-gray-700 dark:text-gray-400 bg-gray-100 text-gray-500'}`}>
      {TYPE_ICONS[type] || <FileCheck size={12} />}
      {type}
    </span>
  );
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

export const EvidencePage: React.FC = () => {
  const evidence = useEvidenceStore((s) => s.evidence);
  const setEvidence = useEvidenceStore((s) => s.setEvidence);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchEvidence = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter) params.set('type', typeFilter);

    fetch(`/api/evidence?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.evidence) setEvidence(data.evidence);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setEvidence, typeFilter]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
          Evidence Audit Trail
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-xs dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600 border dark:border-gray-600 border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchEvidence}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600 dark:hover:bg-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="dark:bg-gray-800 bg-gray-50 border-b dark:border-gray-700 border-gray-200">
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Artifact URL
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Linked Entity
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Verified By
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700 divide-gray-200">
            {evidence.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <p className="text-xs dark:text-gray-600 text-gray-400 italic">
                    No evidence items found
                  </p>
                </td>
              </tr>
            ) : (
              evidence.map((item) => (
                <tr
                  key={item.id}
                  className="dark:hover:bg-gray-800/50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <TypeBadge type={item.type} />
                  </td>
                  <td className="px-4 py-2.5 text-xs dark:text-gray-300 text-gray-600 max-w-[200px] truncate font-mono">
                    {item.artifact_url ? (
                      <a
                        href={item.artifact_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {item.artifact_url}
                      </a>
                    ) : (
                      <span className="dark:text-gray-600 text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs dark:text-gray-300 text-gray-600">
                    {item.linked_entity_type ? (
                      <span>
                        {item.linked_entity_type}
                        <span className="dark:text-gray-500 text-gray-400">#{item.linked_entity_id}</span>
                      </span>
                    ) : (
                      <span className="dark:text-gray-600 text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs dark:text-gray-300 text-gray-600">
                    {item.verified_by || (
                      <span className="dark:text-gray-600 text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs dark:text-gray-500 text-gray-400">
                    {formatTimestamp(item.timestamp)}
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
