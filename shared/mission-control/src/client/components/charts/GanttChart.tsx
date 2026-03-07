import React, { useMemo } from 'react';

export interface GanttSegment {
  start: number; // Unix ms
  end: number;   // Unix ms
  color: string;
  tooltip?: string;
}

export interface GanttRow {
  label: string;
  segments: GanttSegment[];
}

export interface GanttTimeRange {
  start: number; // Unix ms
  end: number;   // Unix ms
}

interface GanttChartProps {
  rows: GanttRow[];
  timeRange: GanttTimeRange;
  rowHeight?: number;
  showTimeAxis?: boolean;
}

/**
 * Pure React Gantt chart component using CSS grid.
 * Each row is a labeled lane with colored segments positioned by time.
 */
export const GanttChart: React.FC<GanttChartProps> = ({
  rows,
  timeRange,
  rowHeight = 32,
  showTimeAxis = true,
}) => {
  const totalDuration = timeRange.end - timeRange.start;

  const timeMarkers = useMemo(() => {
    if (!showTimeAxis || totalDuration <= 0) return [];

    const markerCount = 8;
    const step = totalDuration / markerCount;
    const markers: Array<{ label: string; percent: number }> = [];

    for (let i = 0; i <= markerCount; i++) {
      const ts = timeRange.start + step * i;
      const date = new Date(ts);
      const label = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      markers.push({
        label,
        percent: (step * i) / totalDuration * 100,
      });
    }

    return markers;
  }, [timeRange, totalDuration, showTimeAxis]);

  if (rows.length === 0 || totalDuration <= 0) {
    return (
      <div className="card p-6 flex items-center justify-center">
        <p className="text-xs dark:text-gray-600 text-gray-400 italic">No timeline data</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Time axis */}
      {showTimeAxis && (
        <div className="relative h-6 mb-1" style={{ marginLeft: 100 }}>
          {timeMarkers.map((marker, i) => (
            <span
              key={i}
              className="absolute text-[10px] dark:text-gray-500 text-gray-400 -translate-x-1/2 select-none"
              style={{ left: `${marker.percent}%` }}
            >
              {marker.label}
            </span>
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-1">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-0"
            style={{ height: rowHeight }}
          >
            {/* Label */}
            <div
              className="shrink-0 text-xs font-medium dark:text-gray-300 text-gray-600 truncate pr-2 text-right"
              style={{ width: 100 }}
              title={row.label}
            >
              {row.label}
            </div>

            {/* Bar area */}
            <div
              className="relative flex-1 dark:bg-gray-800/50 bg-gray-100 rounded"
              style={{ height: rowHeight - 4 }}
            >
              {row.segments.map((seg, segIndex) => {
                const leftPercent = clamp(
                  ((seg.start - timeRange.start) / totalDuration) * 100,
                  0,
                  100
                );
                const widthPercent = clamp(
                  ((seg.end - seg.start) / totalDuration) * 100,
                  0.5,
                  100 - leftPercent
                );

                return (
                  <div
                    key={segIndex}
                    className="absolute top-1 bottom-1 rounded-sm transition-opacity hover:opacity-80 cursor-default"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      backgroundColor: seg.color,
                      minWidth: 2,
                    }}
                    title={seg.tooltip || `${formatTime(seg.start)} - ${formatTime(seg.end)}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}
