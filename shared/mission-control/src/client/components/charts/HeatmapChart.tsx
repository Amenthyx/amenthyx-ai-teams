import React, { useState } from 'react';

interface ColorStop {
  threshold: number;
  color: string;
}

interface HeatmapChartProps {
  data: number[][];
  xLabels: string[];
  yLabels: string[];
  colorScale?: ColorStop[];
}

const DEFAULT_COLOR_SCALE: ColorStop[] = [
  { threshold: 0, color: '#1e293b' },
  { threshold: 0.25, color: '#1d4ed8' },
  { threshold: 0.5, color: '#eab308' },
  { threshold: 0.75, color: '#f97316' },
  { threshold: 1.0, color: '#ef4444' },
];

function getColor(value: number, min: number, max: number, colorScale: ColorStop[]): string {
  if (colorScale.length === 0) return '#1e293b';

  // If colorScale thresholds are absolute values (not 0-1 range)
  const isAbsolute = colorScale.some((s) => s.threshold > 1);

  if (isAbsolute) {
    // Use absolute thresholds
    let color = colorScale[0].color;
    for (const stop of colorScale) {
      if (value >= stop.threshold) {
        color = stop.color;
      }
    }
    return color;
  }

  // Normalize to 0-1
  const range = max - min || 1;
  const normalized = (value - min) / range;

  let color = colorScale[0].color;
  for (const stop of colorScale) {
    if (normalized >= stop.threshold) {
      color = stop.color;
    }
  }
  return color;
}

export function HeatmapChart({
  data,
  xLabels,
  yLabels,
  colorScale = DEFAULT_COLOR_SCALE,
}: HeatmapChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number;
    row: string;
    col: string;
  } | null>(null);

  if (data.length === 0) {
    return (
      <div className="text-xs dark:text-gray-500 text-gray-400 text-center py-8">
        No data to display
      </div>
    );
  }

  const allValues = data.flat();
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  const cellWidth = 48;
  const cellHeight = 32;
  const labelWidth = 80;
  const labelHeight = 24;

  const svgWidth = labelWidth + xLabels.length * cellWidth;
  const svgHeight = labelHeight + yLabels.length * cellHeight;

  return (
    <div className="relative overflow-x-auto">
      <svg width={svgWidth} height={svgHeight} className="block">
        {/* X-axis labels */}
        {xLabels.map((label, i) => (
          <text
            key={`x-${i}`}
            x={labelWidth + i * cellWidth + cellWidth / 2}
            y={labelHeight - 4}
            textAnchor="middle"
            className="fill-gray-400 text-[10px]"
            fontSize={10}
          >
            {label}
          </text>
        ))}

        {/* Y-axis labels + cells */}
        {data.map((row, rowIdx) => (
          <g key={`row-${rowIdx}`}>
            <text
              x={labelWidth - 6}
              y={labelHeight + rowIdx * cellHeight + cellHeight / 2 + 4}
              textAnchor="end"
              className="fill-gray-400 text-[10px]"
              fontSize={10}
            >
              {yLabels[rowIdx] || ''}
            </text>
            {row.map((value, colIdx) => (
              <rect
                key={`cell-${rowIdx}-${colIdx}`}
                x={labelWidth + colIdx * cellWidth}
                y={labelHeight + rowIdx * cellHeight}
                width={cellWidth - 2}
                height={cellHeight - 2}
                rx={3}
                fill={getColor(value, min, max, colorScale)}
                className="cursor-pointer transition-opacity hover:opacity-80"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    value,
                    row: yLabels[rowIdx] || '',
                    col: xLabels[colIdx] || '',
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 rounded text-xs dark:bg-gray-900 bg-gray-800 text-white shadow-lg pointer-events-none border dark:border-gray-600 border-gray-700"
          style={{
            left: tooltip.x,
            top: tooltip.y - 36,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltip.row} / {tooltip.col}: <strong>{tooltip.value.toLocaleString()}</strong>
        </div>
      )}
    </div>
  );
}
