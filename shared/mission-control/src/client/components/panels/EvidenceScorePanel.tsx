import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useEvidenceStore } from '../../stores/evidenceStore';
import { useWaveStore } from '../../stores/waveStore';

function getScoreColor(score: number): string {
  if (score >= 80) return '#22C55E';
  if (score >= 50) return '#EAB308';
  return '#EF4444';
}

// Expected evidence items per wave (reasonable baseline)
const EXPECTED_PER_WAVE = 20;

export const EvidenceScorePanel: React.FC = () => {
  const evidence = useEvidenceStore((s) => s.evidence);
  const waves = useWaveStore((s) => s.getAllWaves());

  // Determine current active wave
  const activeWave = waves.find((w) => w.status === 'active');
  const waveNumber = activeWave?.number ?? 1;

  // Calculate score: evidence count vs expected for current wave
  const expected = waveNumber * EXPECTED_PER_WAVE;
  const score = expected > 0 ? Math.min(Math.round((evidence.length / expected) * 100), 100) : 0;
  const color = getScoreColor(score);

  // SVG circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Breakdown by type
  const screenshots = evidence.filter((e) => e.type === 'screenshot').length;
  const logs = evidence.filter((e) => e.type === 'log').length;
  const tests = evidence.filter((e) => e.type === 'test').length;
  const commits = evidence.filter((e) => e.type === 'commit').length;

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={14} className="dark:text-gray-400 text-gray-500" />
        <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
          Evidence Score
        </h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative shrink-0">
          <svg width="100" height="100" className="-rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              strokeWidth="8"
              className="dark:stroke-gray-700 stroke-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold" style={{ color }}>
              {score}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs dark:text-gray-400 text-gray-500">Screenshots</span>
            <span className="text-xs font-medium dark:text-gray-300 text-gray-600">{screenshots}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs dark:text-gray-400 text-gray-500">Logs</span>
            <span className="text-xs font-medium dark:text-gray-300 text-gray-600">{logs}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs dark:text-gray-400 text-gray-500">Tests</span>
            <span className="text-xs font-medium dark:text-gray-300 text-gray-600">{tests}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs dark:text-gray-400 text-gray-500">Commits</span>
            <span className="text-xs font-medium dark:text-gray-300 text-gray-600">{commits}</span>
          </div>
          <div className="pt-1 border-t dark:border-gray-700 border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs dark:text-gray-400 text-gray-500">Total</span>
              <span className="text-xs font-bold dark:text-gray-200 text-gray-700">
                {evidence.length} / {expected}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
