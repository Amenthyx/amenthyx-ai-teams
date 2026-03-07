import React from 'react';
import { CircleDot, CheckCircle2, ArrowRightCircle } from 'lucide-react';
import { Decision, DecisionStatus } from '../../stores/decisionStore';

const STATUS_CONFIG: Record<DecisionStatus, { icon: React.ReactNode; badge: string; line: string }> = {
  proposed: {
    icon: <CircleDot size={16} className="text-yellow-400" />,
    badge: 'bg-yellow-500/20 text-yellow-400',
    line: 'border-yellow-500/30',
  },
  accepted: {
    icon: <CheckCircle2 size={16} className="text-green-400" />,
    badge: 'bg-green-500/20 text-green-400',
    line: 'border-green-500/30',
  },
  superseded: {
    icon: <ArrowRightCircle size={16} className="text-gray-400" />,
    badge: 'bg-gray-500/20 text-gray-400',
    line: 'border-gray-500/30',
  },
};

interface DecisionTimelinePanelProps {
  decisions: Decision[];
  filterStatus?: DecisionStatus | null;
}

export const DecisionTimelinePanel: React.FC<DecisionTimelinePanelProps> = ({
  decisions,
  filterStatus,
}) => {
  const filtered = filterStatus
    ? decisions.filter((d) => d.status === filterStatus)
    : decisions;

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <h3 className="text-sm font-semibold dark:text-gray-200 text-gray-800 mb-3">
        Decision Timeline
      </h3>

      {sorted.length === 0 ? (
        <p className="text-xs dark:text-gray-600 text-gray-400 text-center py-4 italic">
          No decisions recorded
        </p>
      ) : (
        <div className="relative">
          {sorted.map((decision, index) => {
            const config = STATUS_CONFIG[decision.status];
            const isLast = index === sorted.length - 1;

            return (
              <div key={decision.id} className="flex gap-3">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className="shrink-0 mt-1">{config.icon}</div>
                  {!isLast && (
                    <div className={`w-px flex-1 border-l-2 ${config.line} my-1`} />
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 pb-4">
                  <div className="rounded-lg dark:bg-gray-700/30 bg-gray-50 p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium dark:text-gray-200 text-gray-700">
                        {decision.title}
                      </h4>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${config.badge}`}
                      >
                        {decision.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <span className="text-[10px] font-semibold uppercase dark:text-gray-500 text-gray-400">
                          Context
                        </span>
                        <p className="text-xs dark:text-gray-400 text-gray-500">
                          {decision.context}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase dark:text-gray-500 text-gray-400">
                          Decision
                        </span>
                        <p className="text-xs dark:text-gray-300 text-gray-600">
                          {decision.decision}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase dark:text-gray-500 text-gray-400">
                          Rationale
                        </span>
                        <p className="text-xs dark:text-gray-400 text-gray-500">
                          {decision.rationale}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t dark:border-gray-600 border-gray-200">
                      <span className="text-[10px] dark:text-gray-500 text-gray-400">
                        by {decision.decided_by}
                      </span>
                      <span className="text-[10px] dark:text-gray-500 text-gray-400">
                        {new Date(decision.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
