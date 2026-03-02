import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useWaveStore } from '../../stores/waveStore';
import { WaveInfo, GateStatus, WaveStatus } from '../../types/events';

function WaveCircle({ wave }: { wave: WaveInfo }) {
  const base = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300';

  switch (wave.status) {
    case 'done':
      return (
        <div className={`${base} bg-green-500 text-white shadow-lg shadow-green-500/30`}>
          <Check size={18} />
        </div>
      );
    case 'active':
      return (
        <div className={`${base} bg-blue-500 text-white shadow-lg shadow-blue-500/30 animate-pulse-slow ring-4 ring-blue-500/20`}>
          {wave.number}
        </div>
      );
    case 'pending':
    default:
      return (
        <div className={`${base} border-2 dark:border-gray-600 border-gray-300 dark:text-gray-500 text-gray-400`}>
          {wave.number}
        </div>
      );
  }
}

function GateDiamond({ status }: { status: GateStatus }) {
  const base = 'w-5 h-5 rotate-45 flex items-center justify-center shrink-0';

  switch (status) {
    case 'pass':
      return (
        <div className={`${base} bg-green-500`}>
          <Check size={10} className="-rotate-45 text-white" />
        </div>
      );
    case 'fail':
      return (
        <div className={`${base} bg-red-500`}>
          <X size={10} className="-rotate-45 text-white" />
        </div>
      );
    case 'pending':
    default:
      return (
        <div className={`${base} border-2 dark:border-gray-600 border-gray-300`} />
      );
  }
}

function ConnectingLine({ passed }: { passed: boolean }) {
  return (
    <div
      className={`flex-1 h-0.5 min-w-[20px] mx-1 transition-colors duration-300 ${
        passed ? 'bg-green-500' : 'dark:bg-gray-700 bg-gray-300'
      }`}
    />
  );
}

function isWavePassed(status: WaveStatus): boolean {
  return status === 'done';
}

interface PlanningPanelProps {
  compact?: boolean;
}

export const PlanningPanel: React.FC<PlanningPanelProps> = ({ compact = false }) => {
  const waves = useWaveStore((s) => s.getAllWaves());
  const [expandedWave, setExpandedWave] = useState<number | null>(null);

  if (waves.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="dark:text-gray-500 text-gray-400 text-sm">No wave data available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">
        Planning & Milestones
      </h2>

      <div className="card p-4">
        {/* Timeline */}
        <div className="flex items-center overflow-x-auto pb-4">
          {waves.map((wave, index) => (
            <React.Fragment key={wave.number}>
              {/* Wave node */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <WaveCircle wave={wave} />
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    wave.status === 'active'
                      ? 'text-blue-400'
                      : wave.status === 'done'
                      ? 'text-green-400'
                      : 'dark:text-gray-500 text-gray-400'
                  }`}
                >
                  {wave.name}
                </span>
              </div>

              {/* Connecting line + gate */}
              {index < waves.length - 1 && (
                <>
                  <ConnectingLine passed={isWavePassed(wave.status)} />
                  <GateDiamond status={wave.gate} />
                  <ConnectingLine passed={isWavePassed(wave.status) && wave.gate === 'pass'} />
                </>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Expandable wave details */}
        {!compact && (
          <div className="mt-4 space-y-2 border-t dark:border-gray-700 border-gray-200 pt-4">
            {waves.map((wave) => (
              <div key={wave.number}>
                <button
                  onClick={() => setExpandedWave(expandedWave === wave.number ? null : wave.number)}
                  className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg dark:hover:bg-gray-700/50 hover:bg-gray-50 transition-colors duration-200"
                >
                  {expandedWave === wave.number ? (
                    <ChevronDown size={14} className="dark:text-gray-400 text-gray-500" />
                  ) : (
                    <ChevronRight size={14} className="dark:text-gray-400 text-gray-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      wave.status === 'done'
                        ? 'text-green-400'
                        : wave.status === 'active'
                        ? 'text-blue-400'
                        : 'dark:text-gray-500 text-gray-400'
                    }`}
                  >
                    Wave {wave.number}: {wave.name}
                  </span>
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      wave.status === 'done'
                        ? 'bg-green-500/20 text-green-400'
                        : wave.status === 'active'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'dark:bg-gray-700 dark:text-gray-500 bg-gray-100 text-gray-400'
                    }`}
                  >
                    {wave.status}
                  </span>
                </button>
                {expandedWave === wave.number && (
                  <div className="pl-8 pr-2 py-2 animate-fade-in">
                    {wave.deliverables && wave.deliverables.length > 0 ? (
                      <ul className="space-y-1">
                        {wave.deliverables.map((d, i) => (
                          <li key={i} className="text-xs dark:text-gray-400 text-gray-500 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full dark:bg-gray-600 bg-gray-300" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs dark:text-gray-600 text-gray-400 italic">
                        No deliverables listed
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
