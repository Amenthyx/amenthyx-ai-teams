import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useTestStore } from '../../stores/testStore';
import { useFilterStore } from '../../stores/filterStore';
import { TestLayerName, TestLayerResult } from '../../types/events';

const LAYER_LABELS: Record<TestLayerName, { name: string; agents: string[] }> = {
  static: { name: 'Static Analysis', agents: ['FE', 'BE'] },
  unit_be: { name: 'Unit (Backend)', agents: ['BE'] },
  unit_fe: { name: 'Unit (Frontend)', agents: ['FE'] },
  integration: { name: 'Integration', agents: ['BE', 'FE', 'QA'] },
  e2e: { name: 'End-to-End', agents: ['QA'] },
  performance: { name: 'Performance', agents: ['BE', 'FE'] },
  security: { name: 'Security', agents: ['QA', 'DEVOPS'] },
  accessibility: { name: 'Accessibility', agents: ['FE'] },
};

function StatusIcon({ status }: { status: TestLayerResult['status'] }) {
  switch (status) {
    case 'pass':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'fail':
      return <XCircle size={16} className="text-red-500" />;
    case 'running':
      return <Loader2 size={16} className="text-blue-400 animate-spin" />;
    case 'pending':
    default:
      return <Clock size={16} className="dark:text-gray-600 text-gray-400" />;
  }
}

function CountBadge({
  count,
  type,
}: {
  count: number;
  type: 'pass' | 'fail' | 'skip';
}) {
  const colors = {
    pass: 'bg-green-500/20 text-green-400',
    fail: 'bg-red-500/20 text-red-400',
    skip: 'dark:bg-gray-700 dark:text-gray-400 bg-gray-100 text-gray-500',
  };

  return (
    <span className={`badge ${colors[type]}`}>
      {count}
    </span>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const height = 24;
  const width = 60;
  const step = width / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${height - (v / max) * height}`)
    .join(' ');

  const lastVal = data[data.length - 1];
  const prevVal = data[data.length - 2];
  const color = lastVal >= prevVal ? '#22C55E' : '#EF4444';

  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoverageBar({ coverage }: { coverage?: number }) {
  if (coverage === undefined || coverage === null) {
    return <span className="text-xs dark:text-gray-600 text-gray-400">--</span>;
  }

  const color =
    coverage >= 80 ? '#22C55E' : coverage >= 60 ? '#EAB308' : '#EF4444';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full dark:bg-gray-700 bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${coverage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {coverage}%
      </span>
    </div>
  );
}

interface TestResultsPanelProps {
  compact?: boolean;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ compact = false }) => {
  const results = useTestStore((s) => s.results);
  const { selectedAgents } = useFilterStore();
  const [expandedLayer, setExpandedLayer] = useState<TestLayerName | null>(null);

  const layers = Object.entries(results) as [TestLayerName, TestLayerResult][];

  // Filter emphasis based on agent filter
  const getEmphasis = (layer: TestLayerName): boolean => {
    if (selectedAgents.length === 0) return true;
    const info = LAYER_LABELS[layer];
    return info.agents.some((a) => selectedAgents.includes(a));
  };

  return (
    <div>
      <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">
        Test Results
      </h2>

      <div className="card overflow-hidden">
        <div className="divide-y dark:divide-gray-700 divide-gray-200">
          {layers.map(([name, result]) => {
            const emphasized = getEmphasis(name);
            const isExpanded = expandedLayer === name;
            const info = LAYER_LABELS[name];

            return (
              <div
                key={name}
                className={`transition-opacity duration-200 ${
                  emphasized ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedLayer(isExpanded ? null : name)
                  }
                  className="flex items-center w-full px-4 py-3 gap-3 dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors duration-200"
                >
                  <StatusIcon status={result.status} />
                  <span className="text-sm font-medium dark:text-gray-200 text-gray-700 flex-1 text-left">
                    {info.name}
                  </span>

                  {!compact && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <CountBadge count={result.passCount} type="pass" />
                        <CountBadge count={result.failCount} type="fail" />
                        <CountBadge count={result.skipCount} type="skip" />
                      </div>

                      <CoverageBar coverage={result.coverage} />
                      <Sparkline data={result.trend} />
                    </>
                  )}

                  {compact && (
                    <div className="flex items-center gap-1.5">
                      <CountBadge count={result.passCount} type="pass" />
                      <CountBadge count={result.failCount} type="fail" />
                    </div>
                  )}

                  {result.failingTests && result.failingTests.length > 0 && (
                    isExpanded ? (
                      <ChevronDown size={14} className="dark:text-gray-500 text-gray-400" />
                    ) : (
                      <ChevronRight size={14} className="dark:text-gray-500 text-gray-400" />
                    )
                  )}
                </button>

                {/* Expanded failing tests */}
                {isExpanded && result.failingTests && result.failingTests.length > 0 && (
                  <div className="px-4 pb-3 animate-fade-in">
                    <div className="ml-8 space-y-1">
                      {result.failingTests.map((test, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs py-1 px-2 rounded dark:bg-red-500/5 bg-red-50"
                        >
                          <XCircle size={12} className="text-red-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-red-400 font-medium">{test.name}</span>
                            <span className="dark:text-gray-500 text-gray-400 ml-2">
                              {test.file}
                              {test.line ? `:${test.line}` : ''}
                            </span>
                            {test.error && (
                              <p className="dark:text-gray-500 text-gray-400 mt-0.5 font-mono text-[10px]">
                                {test.error}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded but no failing tests */}
                {isExpanded && (!result.failingTests || result.failingTests.length === 0) && (
                  <div className="px-4 pb-3 animate-fade-in">
                    <p className="ml-8 text-xs dark:text-gray-500 text-gray-400 italic">
                      {result.status === 'pending' ? 'Tests have not run yet' : 'All tests passing'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
