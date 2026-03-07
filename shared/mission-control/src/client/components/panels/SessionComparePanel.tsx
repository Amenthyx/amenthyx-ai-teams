import React, { useState, useEffect, useMemo } from 'react';
import { GitCompare, Clock, DollarSign, Users, CheckCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface SessionSummary {
  id: string;
  name: string;
  created_at: string;
  status: string;
  duration_ms?: number;
  total_cost?: number;
  agent_count?: number;
  event_count?: number;
  test_pass_rate?: number;
  metadata?: Record<string, unknown>;
}

interface CompareMetric {
  label: string;
  icon: React.ReactNode;
  valueA: string;
  valueB: string;
  rawA: number;
  rawB: number;
  higherIsBetter: boolean;
}

function formatDuration(ms: number): string {
  if (ms < 60000) return `${(ms / 1000).toFixed(0)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

function DiffBadge({ rawA, rawB, higherIsBetter }: { rawA: number; rawB: number; higherIsBetter: boolean }) {
  if (rawA === 0 && rawB === 0) return null;
  const diff = rawB - rawA;
  if (Math.abs(diff) < 0.01) {
    return (
      <span className="flex items-center gap-0.5 text-[10px] dark:text-gray-500 text-gray-400">
        <Minus size={10} /> same
      </span>
    );
  }
  const improved = higherIsBetter ? diff > 0 : diff < 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-[10px] font-medium ${
        improved ? 'text-green-400' : 'text-red-400'
      }`}
    >
      {diff > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
      {improved ? 'improved' : 'regressed'}
    </span>
  );
}

export const SessionComparePanel: React.FC = () => {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [sessionAId, setSessionAId] = useState<string>('');
  const [sessionBId, setSessionBId] = useState<string>('');
  const [sessionA, setSessionA] = useState<SessionSummary | null>(null);
  const [sessionB, setSessionB] = useState<SessionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch session list
  useEffect(() => {
    fetch('/api/sessions')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch sessions');
        return res.json() as Promise<SessionSummary[]>;
      })
      .then((data) => {
        setSessions(data);
        if (data.length >= 2) {
          setSessionAId(data[data.length - 2].id);
          setSessionBId(data[data.length - 1].id);
        } else if (data.length === 1) {
          setSessionAId(data[0].id);
        }
      })
      .catch(() => setError('Could not load session list'));
  }, []);

  // Fetch selected sessions
  useEffect(() => {
    if (!sessionAId && !sessionBId) return;
    setLoading(true);
    setError(null);

    const fetchSession = async (id: string): Promise<SessionSummary | null> => {
      if (!id) return null;
      try {
        const res = await fetch(`/api/sessions/${id}`);
        if (!res.ok) return null;
        return (await res.json()) as SessionSummary;
      } catch {
        return null;
      }
    };

    Promise.all([fetchSession(sessionAId), fetchSession(sessionBId)]).then(
      ([a, b]) => {
        setSessionA(a);
        setSessionB(b);
        setLoading(false);
      }
    );
  }, [sessionAId, sessionBId]);

  const metrics: CompareMetric[] = useMemo(() => {
    if (!sessionA || !sessionB) return [];
    return [
      {
        label: 'Duration',
        icon: <Clock size={12} className="dark:text-gray-400 text-gray-500" />,
        valueA: sessionA.duration_ms ? formatDuration(sessionA.duration_ms) : '--',
        valueB: sessionB.duration_ms ? formatDuration(sessionB.duration_ms) : '--',
        rawA: sessionA.duration_ms ?? 0,
        rawB: sessionB.duration_ms ?? 0,
        higherIsBetter: false,
      },
      {
        label: 'Cost',
        icon: <DollarSign size={12} className="dark:text-gray-400 text-gray-500" />,
        valueA: sessionA.total_cost != null ? `$${sessionA.total_cost.toFixed(2)}` : '--',
        valueB: sessionB.total_cost != null ? `$${sessionB.total_cost.toFixed(2)}` : '--',
        rawA: sessionA.total_cost ?? 0,
        rawB: sessionB.total_cost ?? 0,
        higherIsBetter: false,
      },
      {
        label: 'Agents',
        icon: <Users size={12} className="dark:text-gray-400 text-gray-500" />,
        valueA: String(sessionA.agent_count ?? '--'),
        valueB: String(sessionB.agent_count ?? '--'),
        rawA: sessionA.agent_count ?? 0,
        rawB: sessionB.agent_count ?? 0,
        higherIsBetter: true,
      },
      {
        label: 'Events',
        icon: <GitCompare size={12} className="dark:text-gray-400 text-gray-500" />,
        valueA: String(sessionA.event_count ?? '--'),
        valueB: String(sessionB.event_count ?? '--'),
        rawA: sessionA.event_count ?? 0,
        rawB: sessionB.event_count ?? 0,
        higherIsBetter: true,
      },
      {
        label: 'Test Pass Rate',
        icon: <CheckCircle size={12} className="dark:text-gray-400 text-gray-500" />,
        valueA: sessionA.test_pass_rate != null ? `${sessionA.test_pass_rate.toFixed(1)}%` : '--',
        valueB: sessionB.test_pass_rate != null ? `${sessionB.test_pass_rate.toFixed(1)}%` : '--',
        rawA: sessionA.test_pass_rate ?? 0,
        rawB: sessionB.test_pass_rate ?? 0,
        higherIsBetter: true,
      },
    ];
  }, [sessionA, sessionB]);

  const selectClasses =
    'w-full text-xs rounded-lg px-2 py-1.5 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-4">
        <GitCompare size={14} className="dark:text-gray-400 text-gray-500" />
        <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
          Session Compare
        </h3>
      </div>

      {/* Session selectors */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-[10px] dark:text-gray-500 text-gray-400 uppercase mb-1 block">Session A</label>
          <select
            className={selectClasses}
            value={sessionAId}
            onChange={(e) => setSessionAId((e.target as unknown as { value: string }).value)}
          >
            <option value="">Select...</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || s.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] dark:text-gray-500 text-gray-400 uppercase mb-1 block">Session B</label>
          <select
            className={selectClasses}
            value={sessionBId}
            onChange={(e) => setSessionBId((e.target as unknown as { value: string }).value)}
          >
            <option value="">Select...</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || s.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error / loading states */}
      {error && (
        <p className="text-xs text-red-400 text-center py-4">{error}</p>
      )}

      {loading && (
        <p className="text-xs dark:text-gray-500 text-gray-400 text-center py-4 italic">
          Loading session data...
        </p>
      )}

      {/* Comparison table */}
      {!loading && sessionA && sessionB && (
        <div className="divide-y dark:divide-gray-700 divide-gray-200">
          {/* Header row */}
          <div className="grid grid-cols-4 gap-2 pb-2">
            <span className="text-[10px] dark:text-gray-500 text-gray-400 uppercase">Metric</span>
            <span className="text-[10px] dark:text-gray-500 text-gray-400 uppercase text-center">
              {sessionA.name || sessionA.id.slice(0, 8)}
            </span>
            <span className="text-[10px] dark:text-gray-500 text-gray-400 uppercase text-center">
              {sessionB.name || sessionB.id.slice(0, 8)}
            </span>
            <span className="text-[10px] dark:text-gray-500 text-gray-400 uppercase text-right">Delta</span>
          </div>

          {metrics.map((m) => (
            <div key={m.label} className="grid grid-cols-4 gap-2 py-2 items-center">
              <div className="flex items-center gap-1.5">
                {m.icon}
                <span className="text-xs dark:text-gray-300 text-gray-600">{m.label}</span>
              </div>
              <span className="text-xs font-medium dark:text-gray-200 text-gray-700 text-center">
                {m.valueA}
              </span>
              <span className="text-xs font-medium dark:text-gray-200 text-gray-700 text-center">
                {m.valueB}
              </span>
              <div className="flex justify-end">
                <DiffBadge rawA={m.rawA} rawB={m.rawB} higherIsBetter={m.higherIsBetter} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && (!sessionA || !sessionB) && sessions.length > 0 && (
        <p className="text-xs dark:text-gray-600 text-gray-400 text-center py-4 italic">
          Select two sessions to compare
        </p>
      )}

      {!loading && !error && sessions.length === 0 && (
        <p className="text-xs dark:text-gray-600 text-gray-400 text-center py-4 italic">
          No sessions available
        </p>
      )}
    </div>
  );
};
