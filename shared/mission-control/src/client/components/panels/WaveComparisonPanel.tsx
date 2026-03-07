import React from 'react';
import { GitBranch } from 'lucide-react';

interface WaveTimeline {
  wave: number;
  name: string;
  planned: { start: number; end: number }; // percent 0-100
  actual: { start: number; end: number } | null; // null if not started
  status: 'pending' | 'active' | 'done';
}

interface WaveComparisonPanelProps {
  waves?: WaveTimeline[];
}

const DEFAULT_WAVES: WaveTimeline[] = [
  { wave: 1, name: 'Planning', planned: { start: 0, end: 15 }, actual: { start: 0, end: 18 }, status: 'done' },
  { wave: 2, name: 'Research', planned: { start: 15, end: 35 }, actual: { start: 18, end: 40 }, status: 'done' },
  { wave: 3, name: 'Engineering', planned: { start: 35, end: 70 }, actual: { start: 40, end: 72 }, status: 'active' },
  { wave: 4, name: 'QA', planned: { start: 70, end: 90 }, actual: null, status: 'pending' },
  { wave: 5, name: 'Release', planned: { start: 90, end: 100 }, actual: null, status: 'pending' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: '#6B7280',
  active: '#3B82F6',
  done: '#22C55E',
};

/**
 * Side-by-side comparison of planned vs actual wave timelines.
 * Each wave is a row with planned bar (outline) and actual bar (filled).
 */
export const WaveComparisonPanel: React.FC<WaveComparisonPanelProps> = ({
  waves = DEFAULT_WAVES,
}) => {
  return (
    <div>
      <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
        <GitBranch size={14} />
        Wave Comparison: Planned vs Actual
      </h2>

      <div className="card p-4 space-y-3">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2 rounded-sm border-2 border-blue-400 bg-transparent" />
            <span className="text-[10px] dark:text-gray-400 text-gray-500">Planned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2 rounded-sm bg-blue-500 opacity-70" />
            <span className="text-[10px] dark:text-gray-400 text-gray-500">Actual</span>
          </div>
        </div>

        {waves.map((wave) => (
          <div key={wave.wave} className="flex items-center gap-0">
            {/* Label */}
            <div className="shrink-0 w-24 pr-2 text-right">
              <span className="text-xs font-medium dark:text-gray-300 text-gray-600">
                W{wave.wave}
              </span>
              <span className="text-[10px] dark:text-gray-500 text-gray-400 block truncate">
                {wave.name}
              </span>
            </div>

            {/* Bars */}
            <div className="relative flex-1 h-8 dark:bg-gray-800/50 bg-gray-100 rounded overflow-hidden">
              {/* Planned bar (outline) */}
              <div
                className="absolute top-1 h-[10px] rounded-sm border-2 opacity-60"
                style={{
                  left: `${wave.planned.start}%`,
                  width: `${wave.planned.end - wave.planned.start}%`,
                  borderColor: STATUS_COLORS[wave.status],
                }}
              />

              {/* Actual bar (filled) */}
              {wave.actual && (
                <div
                  className="absolute bottom-1 h-[10px] rounded-sm opacity-70"
                  style={{
                    left: `${wave.actual.start}%`,
                    width: `${wave.actual.end - wave.actual.start}%`,
                    backgroundColor: STATUS_COLORS[wave.status],
                  }}
                />
              )}

              {/* Status badge */}
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <span
                  className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                  style={{
                    color: STATUS_COLORS[wave.status],
                    backgroundColor: `${STATUS_COLORS[wave.status]}15`,
                  }}
                >
                  {wave.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Deviation summary */}
        <div className="border-t dark:border-gray-700 border-gray-200 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] dark:text-gray-500 text-gray-400">
              Overall deviation
            </span>
            <span className="text-xs font-medium dark:text-gray-300 text-gray-600">
              {computeDeviation(waves)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function computeDeviation(waves: WaveTimeline[]): string {
  let totalDelta = 0;
  let count = 0;

  for (const w of waves) {
    if (!w.actual) continue;
    const plannedWidth = w.planned.end - w.planned.start;
    const actualWidth = w.actual.end - w.actual.start;
    if (plannedWidth > 0) {
      totalDelta += ((actualWidth - plannedWidth) / plannedWidth) * 100;
      count++;
    }
  }

  if (count === 0) return 'N/A';

  const avgDelta = totalDelta / count;
  const sign = avgDelta >= 0 ? '+' : '';
  return `${sign}${avgDelta.toFixed(1)}% avg`;
}
