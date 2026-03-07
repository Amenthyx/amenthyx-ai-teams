import React, { useEffect } from 'react';
import { FileCheck, Camera, Terminal, FlaskConical, GitCommitHorizontal } from 'lucide-react';
import { useEvidenceStore, Evidence } from '../../stores/evidenceStore';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  screenshot: <Camera size={14} className="text-blue-400" />,
  log: <Terminal size={14} className="text-yellow-400" />,
  test: <FlaskConical size={14} className="text-purple-400" />,
  commit: <GitCommitHorizontal size={14} className="text-green-400" />,
};

function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return timestamp;
  }
}

export const EvidenceAuditPanel: React.FC = () => {
  const evidence = useEvidenceStore((s) => s.evidence);
  const setEvidence = useEvidenceStore((s) => s.setEvidence);

  useEffect(() => {
    fetch('/api/evidence?limit=10')
      .then((r) => r.json())
      .then((data) => {
        if (data.evidence) setEvidence(data.evidence);
      })
      .catch(() => {});
  }, [setEvidence]);

  const recent = evidence.slice(0, 8);

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileCheck size={14} className="dark:text-gray-400 text-gray-500" />
        <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
          Evidence Audit Trail
        </h3>
      </div>

      {recent.length === 0 ? (
        <p className="text-xs dark:text-gray-600 text-gray-400 italic text-center py-4">
          No evidence collected yet
        </p>
      ) : (
        <div className="space-y-1.5">
          {recent.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors"
            >
              {TYPE_ICONS[item.type] || <FileCheck size={14} className="dark:text-gray-500 text-gray-400" />}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium dark:text-gray-200 text-gray-700 capitalize">
                  {item.type}
                </span>
                {item.linked_entity_type && (
                  <span className="text-[10px] dark:text-gray-500 text-gray-400 ml-1.5">
                    {item.linked_entity_type}#{item.linked_entity_id}
                  </span>
                )}
              </div>
              {item.verified_by && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full dark:bg-gray-700 bg-gray-100 dark:text-gray-400 text-gray-500 font-medium">
                  {item.verified_by}
                </span>
              )}
              <span className="text-[10px] dark:text-gray-600 text-gray-400 shrink-0">
                {formatTime(item.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
