import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DecisionTimelinePanel } from '../components/panels/DecisionTimelinePanel';
import { useDecisionStore, DecisionStatus, Decision } from '../stores/decisionStore';

const STATUS_OPTIONS: Array<{ value: DecisionStatus | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'proposed', label: 'Proposed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'superseded', label: 'Superseded' },
];

export const DecisionsPage: React.FC = () => {
  const decisions = useDecisionStore((s) => s.decisions);
  const setDecisions = useDecisionStore((s) => s.setDecisions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<DecisionStatus | ''>('');

  useEffect(() => {
    const fetchDecisions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/decisions');
        if (!response.ok) {
          throw new Error(`Failed to fetch decisions: ${response.statusText}`);
        }
        const data: Decision[] = await response.json();
        setDecisions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load decisions');
      } finally {
        setLoading(false);
      }
    };

    fetchDecisions();
  }, [setDecisions]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
        <h3 className="text-sm font-semibold dark:text-gray-200 text-gray-800 mb-3">
          Filter Decisions
        </h3>
        <div className="flex items-center gap-2">
          <label className="text-xs dark:text-gray-400 text-gray-500">Status</label>
          <div className="flex gap-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'dark:bg-gray-700/30 bg-gray-100 dark:text-gray-400 text-gray-500 dark:hover:bg-gray-700/50 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin dark:text-gray-400 text-gray-500" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : (
        <DecisionTimelinePanel
          decisions={decisions}
          filterStatus={filterStatus || null}
        />
      )}
    </div>
  );
};
