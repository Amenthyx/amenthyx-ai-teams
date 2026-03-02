import React from 'react';
import { Shield, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { SecretsHealth } from '../../types/events';

const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

function HealthGauge({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const color =
    score > 80 ? '#22C55E' : score > 50 ? '#EAB308' : '#EF4444';

  return (
    <div className="flex flex-col items-center">
      <svg width={140} height={140} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          strokeWidth={8}
          className="dark:stroke-gray-700 stroke-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ marginTop: '35px' }}>
        <span className="text-3xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-xs dark:text-gray-500 text-gray-400">Health</span>
      </div>
    </div>
  );
}

// Default secrets health when no data from server
const DEFAULT_HEALTH: SecretsHealth = {
  score: 85,
  secrets: [],
  warnings: [],
  recommendations: [
    'Run a secrets scan on the repository',
    'Ensure all API keys are stored in environment variables',
    'Set up secret rotation policies',
  ],
};

interface SecretsPanelProps {
  health?: SecretsHealth;
}

export const SecretsPanel: React.FC<SecretsPanelProps> = ({ health }) => {
  const data = health || DEFAULT_HEALTH;

  return (
    <div>
      <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">
        Secrets Health
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Health gauge */}
        <div className="card p-6 flex items-center justify-center relative">
          <HealthGauge score={data.score} />
        </div>

        {/* Secrets inventory */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="px-4 py-3 border-b dark:border-gray-700 border-gray-200">
            <div className="flex items-center gap-2">
              <Shield size={14} className="dark:text-gray-400 text-gray-500" />
              <span className="text-xs font-semibold dark:text-gray-300 text-gray-600 uppercase tracking-wider">
                Secret Inventory
              </span>
              <span className="text-[10px] dark:text-gray-500 text-gray-400 ml-auto">
                Values never displayed
              </span>
            </div>
          </div>

          {data.secrets.length === 0 ? (
            <div className="p-6 text-center">
              <CheckCircle size={20} className="text-green-500 mx-auto mb-2" />
              <p className="text-xs dark:text-gray-500 text-gray-400">
                No secrets detected in scan
              </p>
            </div>
          ) : (
            <div className="divide-y dark:divide-gray-700 divide-gray-200">
              {/* Table header */}
              <div className="flex items-center gap-3 px-4 py-2 text-[10px] font-semibold dark:text-gray-500 text-gray-400 uppercase tracking-wider">
                <span className="flex-1">Key Name</span>
                <span className="w-32">File Location</span>
                <span className="w-20">Type</span>
                <span className="w-16 text-right">Risk</span>
              </div>

              {data.secrets.map((secret, i) => {
                const risk = RISK_COLORS[secret.riskLevel] || RISK_COLORS.medium;

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="flex-1 text-xs font-mono dark:text-gray-300 text-gray-600 truncate">
                      {secret.keyName}
                    </span>
                    <span className="w-32 text-[10px] dark:text-gray-500 text-gray-400 truncate">
                      {secret.fileLocation}
                    </span>
                    <span className="w-20 text-[10px] dark:text-gray-400 text-gray-500">
                      {secret.type}
                    </span>
                    <span className="w-16 text-right">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${risk.bg} ${risk.text} ${risk.border}`}
                      >
                        {secret.riskLevel}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Warnings */}
        {data.warnings.length > 0 && (
          <div className="card p-4 lg:col-span-3">
            <h3 className="text-xs font-semibold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-orange-400" />
              Warnings
            </h3>
            <div className="space-y-2">
              {data.warnings.map((warning, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 px-3 py-2 rounded-lg bg-orange-500/5 border border-orange-500/20"
                >
                  <AlertTriangle size={12} className="text-orange-400 mt-0.5 shrink-0" />
                  <span className="text-xs dark:text-orange-300 text-orange-600">
                    {warning}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div className="card p-4 lg:col-span-3">
            <h3 className="text-xs font-semibold dark:text-gray-300 text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Info size={14} className="text-blue-400" />
              Recommendations
            </h3>
            <ol className="space-y-1.5 list-decimal list-inside">
              {data.recommendations.map((rec, i) => (
                <li key={i} className="text-xs dark:text-gray-400 text-gray-500">
                  {rec}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
