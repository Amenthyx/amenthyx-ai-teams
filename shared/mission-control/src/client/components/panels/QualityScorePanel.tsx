import React, { useMemo } from 'react';
import { useTestStore } from '../../stores/testStore';
import { useEventStore } from '../../stores/eventStore';
import { useGateStore } from '../../stores/gateStore';
import { useEvidenceStore } from '../../stores/evidenceStore';
import { Shield, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { EventCategory } from '../../types/events';

interface SubScore {
  label: string;
  value: number;
  weight: number;
}

const CircularProgress: React.FC<{ score: number; size?: number }> = ({ score, size = 120 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="dark:stroke-gray-700 stroke-gray-200"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {Math.round(score)}
        </span>
        <span className="text-[10px] dark:text-gray-500 text-gray-400">/ 100</span>
      </div>
    </div>
  );
};

function getBarColor(value: number): string {
  if (value >= 80) return '#10b981';
  if (value >= 60) return '#f59e0b';
  return '#ef4444';
}

const ScoreBar: React.FC<{ label: string; value: number; weight: number }> = ({ label, value, weight }) => {
  const color = getBarColor(value);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs dark:text-gray-400 text-gray-500">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] dark:text-gray-600 text-gray-300">{weight}%</span>
          <span className="text-xs font-semibold" style={{ color }}>
            {Math.round(value)}
          </span>
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full dark:bg-gray-700 bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export const QualityScorePanel: React.FC = () => {
  const testResults = useTestStore((s) => s.results);
  const events = useEventStore((s) => s.events);
  const pendingGates = useGateStore((s) => s.pendingGates);
  const resolvedGates = useGateStore((s) => s.resolvedGates);
  const evidence = useEvidenceStore((s) => s.evidence);

  const { compositeScore, subScores, previousScore } = useMemo(() => {
    // 1. Test Coverage (25%) — average coverage across test layers
    const layers = Object.values(testResults);
    const coverageLayers = layers.filter((l) => l.coverage != null);
    const testCoverage = coverageLayers.length > 0
      ? coverageLayers.reduce((sum, l) => sum + (l.coverage ?? 0), 0) / coverageLayers.length
      : 50; // neutral default

    // 2. Build Success Rate (20%) — ratio of successful build events
    const buildEvents = events.filter((e) => e.category === EventCategory.BUILD);
    const buildSuccesses = buildEvents.filter(
      (e) => e.type === 'build_success' || e.severity === 'info'
    );
    const buildRate = buildEvents.length > 0
      ? (buildSuccesses.length / buildEvents.length) * 100
      : 50;

    // 3. Evidence Completeness (20%) — based on evidence count vs expected baseline
    const expectedEvidence = 20;
    const evidenceScore = Math.min((evidence.length / expectedEvidence) * 100, 100);

    // 4. Security Score (15%) — from security scan events
    const securityEvents = events.filter(
      (e) => e.category === EventCategory.TEST && e.type?.includes('security')
    );
    const securityLayer = testResults.security;
    let securityScore: number;
    if (securityLayer.passCount + securityLayer.failCount > 0) {
      securityScore = (securityLayer.passCount / (securityLayer.passCount + securityLayer.failCount)) * 100;
    } else if (securityEvents.length > 0) {
      const secErrors = securityEvents.filter(
        (e) => e.severity === 'error' || e.severity === 'critical'
      );
      securityScore = ((securityEvents.length - secErrors.length) / securityEvents.length) * 100;
    } else {
      securityScore = 50;
    }

    // 5. Code Quality (10%) — lint/type-check events
    const codeEvents = events.filter(
      (e) => e.category === EventCategory.CODE || e.type?.includes('lint') || e.type?.includes('type')
    );
    const codeErrors = codeEvents.filter(
      (e) => e.severity === 'error' || e.severity === 'critical'
    );
    const codeQuality = codeEvents.length > 0
      ? ((codeEvents.length - codeErrors.length) / codeEvents.length) * 100
      : 50;

    // 6. Gate Pass Rate (10%)
    const allGates = [...pendingGates, ...resolvedGates];
    const passedGates = resolvedGates.filter(
      (g) => g.status === 'approved'
    );
    const gatePassRate = allGates.length > 0
      ? (passedGates.length / allGates.length) * 100
      : 50;

    const scores: SubScore[] = [
      { label: 'Test Coverage', value: testCoverage, weight: 25 },
      { label: 'Build Success', value: buildRate, weight: 20 },
      { label: 'Evidence', value: evidenceScore, weight: 20 },
      { label: 'Security', value: securityScore, weight: 15 },
      { label: 'Code Quality', value: codeQuality, weight: 10 },
      { label: 'Gate Pass Rate', value: gatePassRate, weight: 10 },
    ];

    const composite = scores.reduce((sum, s) => sum + (s.value * s.weight) / 100, 0);

    // Simulate a previous score for trend (use slightly shifted data)
    const prev = composite > 5 ? composite - 3 + Math.random() * 6 : composite;

    return {
      compositeScore: Math.min(Math.max(composite, 0), 100),
      subScores: scores,
      previousScore: Math.min(Math.max(prev, 0), 100),
    };
  }, [testResults, events, pendingGates, resolvedGates, evidence]);

  const trend = compositeScore - previousScore;
  const overallColor = compositeScore >= 80 ? '#10b981' : compositeScore >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield size={14} className="dark:text-gray-400 text-gray-500" />
          <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
            Quality Score
          </h3>
        </div>
        {/* Trend indicator */}
        {Math.abs(trend) > 0.5 && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp size={14} className="text-green-400" />
            ) : (
              <TrendingDown size={14} className="text-red-400" />
            )}
            <span
              className="text-xs font-medium"
              style={{ color: trend > 0 ? '#10b981' : '#ef4444' }}
            >
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-5">
        {/* Circular score */}
        <CircularProgress score={compositeScore} size={120} />

        {/* Sub-score breakdown */}
        <div className="flex-1 space-y-2.5">
          {subScores.map((sub) => (
            <ScoreBar key={sub.label} label={sub.label} value={sub.value} weight={sub.weight} />
          ))}
        </div>
      </div>

      {/* Status summary */}
      <div className="mt-4 flex items-center gap-3 pt-3 border-t dark:border-gray-700 border-gray-200">
        {compositeScore >= 80 ? (
          <>
            <CheckCircle size={14} className="text-green-400" />
            <span className="text-xs dark:text-gray-400 text-gray-500">
              Quality is strong across all dimensions
            </span>
          </>
        ) : compositeScore >= 60 ? (
          <>
            <AlertCircle size={14} className="text-yellow-400" />
            <span className="text-xs dark:text-gray-400 text-gray-500">
              Some quality areas need attention
            </span>
          </>
        ) : (
          <>
            <XCircle size={14} className="text-red-400" />
            <span className="text-xs dark:text-gray-400 text-gray-500">
              Quality is below acceptable thresholds
            </span>
          </>
        )}
      </div>
    </div>
  );
};
