import React, { useState, useCallback, useRef } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomableChartProps {
  data: any[];
  xKey: string;
  children: React.ReactNode;
  height?: number;
}

export function ZoomableChart({
  data,
  xKey,
  children,
  height = 300,
}: ZoomableChartProps) {
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [domain, setDomain] = useState<[string | number, string | number]>([
    'dataMin',
    'dataMax',
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: any) => {
    if (e?.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setIsDragging(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: any) => {
      if (isDragging && e?.activeLabel) {
        setRefAreaRight(e.activeLabel);
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    if (!refAreaLeft || !refAreaRight) {
      setIsDragging(false);
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    const indexLeft = data.findIndex((d) => String(d[xKey]) === refAreaLeft);
    const indexRight = data.findIndex((d) => String(d[xKey]) === refAreaRight);

    if (indexLeft === indexRight) {
      setIsDragging(false);
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    const [left, right] =
      indexLeft < indexRight
        ? [refAreaLeft, refAreaRight]
        : [refAreaRight, refAreaLeft];

    setDomain([left!, right!]);
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIsDragging(false);
  }, [refAreaLeft, refAreaRight, data, xKey]);

  const handleReset = useCallback(() => {
    setDomain(['dataMin', 'dataMax']);
    setRefAreaLeft(null);
    setRefAreaRight(null);
  }, []);

  const isZoomed = domain[0] !== 'dataMin' || domain[1] !== 'dataMax';

  return (
    <div ref={chartRef} className="relative">
      {/* Zoom controls */}
      <div className="absolute top-0 right-0 z-10 flex items-center gap-1">
        {isZoomed && (
          <button
            onClick={handleReset}
            className="p-1 rounded dark:bg-gray-700 bg-gray-200 dark:text-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white transition"
            title="Reset zoom"
          >
            <Maximize2 size={12} />
          </button>
        )}
        <div className="flex items-center gap-0.5 text-xs dark:text-gray-500 text-gray-400">
          {isZoomed ? (
            <span className="flex items-center gap-1">
              <ZoomIn size={12} />
              Zoomed
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <ZoomOut size={12} />
              Drag to zoom
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
          <XAxis
            dataKey={xKey}
            domain={domain}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            stroke="#4b5563"
          />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#4b5563" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#e5e7eb',
            }}
          />
          {children}
          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="#3b82f6"
              fillOpacity={0.2}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
