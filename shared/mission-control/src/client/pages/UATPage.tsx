import React, { useEffect, useCallback } from 'react';
import {
  ClipboardCheck,
  Download,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Camera,
  FileText,
  Bug,
  Shield,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { useUATStore, UATSuite, UATCase } from '../stores/uatStore';

function getStatusIcon(status: string) {
  switch (status) {
    case 'pass': return <CheckCircle2 size={14} className="text-green-400" />;
    case 'fail': return <XCircle size={14} className="text-red-400" />;
    case 'blocked': return <AlertTriangle size={14} className="text-yellow-400" />;
    case 'skipped': return <Clock size={14} className="text-gray-400" />;
    case 'running': return <RefreshCw size={14} className="text-blue-400 animate-spin" />;
    default: return <Clock size={14} className="text-gray-500" />;
  }
}

function getSuiteStatus(suite: UATSuite): string {
  if (suite.failed > 0) return 'fail';
  if (suite.blocked > 0) return 'blocked';
  if (suite.passed === suite.totalCases && suite.totalCases > 0) return 'pass';
  if (suite.passed > 0 || suite.skipped > 0) return 'partial';
  return 'pending';
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

const CoverageBar: React.FC<{ coverage: number }> = ({ coverage }) => {
  const color = coverage >= 95 ? 'bg-green-500' : coverage >= 80 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 rounded-full dark:bg-gray-700 bg-gray-200 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(coverage, 100)}%` }} />
      </div>
      <span className="text-xs font-mono dark:text-gray-400 text-gray-500">{coverage.toFixed(1)}%</span>
    </div>
  );
};

const CaseDetail: React.FC<{ testCase: UATCase }> = ({ testCase }) => (
  <div className="p-4 dark:bg-gray-800/50 bg-gray-50 rounded-lg border dark:border-gray-700 border-gray-200">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="text-sm font-semibold dark:text-gray-200 text-gray-800">{testCase.title}</h4>
        <div className="flex items-center gap-2 mt-1 text-xs dark:text-gray-400 text-gray-500">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            testCase.priority === 'P0' ? 'bg-red-500/20 text-red-400' :
            testCase.priority === 'P1' ? 'bg-orange-500/20 text-orange-400' :
            testCase.priority === 'P2' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>{testCase.priority}</span>
          {testCase.userRole && <span>Role: {testCase.userRole}</span>}
          {testCase.device && <span>Device: {testCase.device}</span>}
          {testCase.browser && <span>Browser: {testCase.browser}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {getStatusIcon(testCase.status)}
        <span className={`text-xs font-bold uppercase ${
          testCase.status === 'pass' ? 'text-green-400' :
          testCase.status === 'fail' ? 'text-red-400' :
          'dark:text-gray-400 text-gray-500'
        }`}>{testCase.status}</span>
      </div>
    </div>

    {testCase.ctaElement && (
      <div className="mb-2 text-xs">
        <span className="dark:text-gray-500 text-gray-400">CTA: </span>
        <span className="dark:text-gray-300 text-gray-600 font-mono">{testCase.ctaElement}</span>
        {testCase.ctaSelector && (
          <span className="ml-2 dark:text-gray-500 text-gray-400 font-mono text-[10px]">{testCase.ctaSelector}</span>
        )}
      </div>
    )}

    {testCase.compliance.length > 0 && (
      <div className="flex items-center gap-1 mb-2">
        <Shield size={12} className="dark:text-gray-500 text-gray-400" />
        {testCase.compliance.map((c) => (
          <span key={c} className="px-1 py-0 rounded text-[10px] dark:bg-blue-500/20 bg-blue-50 dark:text-blue-300 text-blue-600">{c}</span>
        ))}
      </div>
    )}

    {testCase.steps.length > 0 && (
      <div className="mb-3">
        <p className="text-[10px] uppercase dark:text-gray-500 text-gray-400 mb-1 font-semibold">Steps</p>
        <div className="space-y-0.5">
          {testCase.steps.map((step) => (
            <div key={step.number} className="flex gap-2 text-xs dark:text-gray-300 text-gray-600">
              <span className="dark:text-gray-500 text-gray-400 shrink-0">{step.number}.</span>
              <span>{step.action} <span className="font-mono dark:text-gray-400 text-gray-500">{step.element}</span></span>
              {step.inputData && <span className="dark:text-gray-500 text-gray-400 italic">({step.inputData})</span>}
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="grid grid-cols-2 gap-3 mb-3">
      {testCase.expectedResult && (
        <div>
          <p className="text-[10px] uppercase dark:text-gray-500 text-gray-400 mb-0.5 font-semibold">Expected</p>
          <p className="text-xs dark:text-gray-300 text-gray-600">{testCase.expectedResult}</p>
        </div>
      )}
      {testCase.actualResult && (
        <div>
          <p className="text-[10px] uppercase dark:text-gray-500 text-gray-400 mb-0.5 font-semibold">Actual</p>
          <p className={`text-xs ${testCase.status === 'fail' ? 'text-red-400' : 'dark:text-gray-300 text-gray-600'}`}>
            {testCase.actualResult}
          </p>
        </div>
      )}
    </div>

    <div className="flex items-center gap-3 flex-wrap">
      {testCase.screenshotBefore && (
        <span className="flex items-center gap-1 text-[10px] dark:text-gray-400 text-gray-500">
          <Camera size={10} /> Before
        </span>
      )}
      {testCase.screenshotAfter && (
        <span className="flex items-center gap-1 text-[10px] dark:text-gray-400 text-gray-500">
          <Camera size={10} /> After
        </span>
      )}
      {testCase.screenshotError && (
        <span className="flex items-center gap-1 text-[10px] text-red-400">
          <Camera size={10} /> Error
        </span>
      )}
      {testCase.consoleLog && (
        <span className="flex items-center gap-1 text-[10px] dark:text-gray-400 text-gray-500">
          <FileText size={10} /> Console
        </span>
      )}
      {testCase.defectId && (
        <span className="flex items-center gap-1 text-[10px] text-red-400">
          <Bug size={10} /> {testCase.defectId}
          {testCase.defectSeverity && ` (${testCase.defectSeverity})`}
        </span>
      )}
      {testCase.durationMs > 0 && (
        <span className="text-[10px] dark:text-gray-500 text-gray-400">{formatDuration(testCase.durationMs)}</span>
      )}
    </div>
  </div>
);

const SuiteRow: React.FC<{ suite: UATSuite }> = ({ suite }) => {
  const { expandedSuite, setExpandedSuite, getCasesForSuite, setLoading } = useUATStore();
  const isExpanded = expandedSuite === suite.id;
  const cases = getCasesForSuite(suite.id);

  const handleToggle = useCallback(async () => {
    if (isExpanded) {
      setExpandedSuite(null);
      return;
    }
    setExpandedSuite(suite.id);
    if (cases.length === 0) {
      setLoading(true);
      try {
        const res = await fetch(`/api/uat/cases?suiteId=${suite.id}`);
        if (res.ok) {
          const data = await res.json();
          useUATStore.getState().setCases(suite.id, data.cases);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
  }, [isExpanded, suite.id, cases.length, setExpandedSuite, setLoading]);

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch(`/api/uat/export/suite/${suite.code}`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uat_suite_${suite.code}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [suite.code]);

  const status = getSuiteStatus(suite);

  return (
    <div className="border dark:border-gray-700 border-gray-200 rounded-lg overflow-hidden mb-2">
      <div
        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer dark:hover:bg-gray-800/50 hover:bg-gray-50 transition-colors"
        onClick={handleToggle}
      >
        {isExpanded ? <ChevronDown size={14} className="dark:text-gray-400 text-gray-500" /> : <ChevronRight size={14} className="dark:text-gray-400 text-gray-500" />}
        {getStatusIcon(status)}
        <span className="text-xs font-mono font-bold dark:text-gray-300 text-gray-600 w-16">{suite.code}</span>
        <span className="text-sm dark:text-gray-200 text-gray-700 flex-1">{suite.name}</span>
        <span className="text-xs dark:text-gray-400 text-gray-500">{suite.totalCases} cases</span>
        <span className="text-xs text-green-400">{suite.passed} pass</span>
        {suite.failed > 0 && <span className="text-xs text-red-400">{suite.failed} fail</span>}
        {suite.blocked > 0 && <span className="text-xs text-yellow-400">{suite.blocked} block</span>}
        <CoverageBar coverage={suite.coverage} />
        <button onClick={handleDownload} className="p-1 rounded dark:hover:bg-gray-600 hover:bg-gray-200" title="Download suite">
          <Download size={12} className="dark:text-gray-400 text-gray-500" />
        </button>
      </div>
      {isExpanded && (
        <div className="px-4 py-3 space-y-2 border-t dark:border-gray-700 border-gray-200 dark:bg-gray-900/50 bg-gray-25">
          {cases.length === 0 ? (
            <p className="text-xs dark:text-gray-500 text-gray-400 text-center py-4">No test cases loaded</p>
          ) : (
            cases.map((c) => <CaseDetail key={c.id} testCase={c} />)
          )}
        </div>
      )}
    </div>
  );
};

export const UATPage: React.FC = () => {
  const { suites, summary, loading, setSuites, setSummary, setLoading } = useUATStore();

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const [suitesRes, summaryRes] = await Promise.all([
          fetch('/api/uat/suites'),
          fetch('/api/uat/summary'),
        ]);
        if (mounted && suitesRes.ok) {
          const data = await suitesRes.json();
          setSuites(data.suites);
        }
        if (mounted && summaryRes.ok) {
          const data = await summaryRes.json();
          setSummary(data.summary);
        }
      } catch { /* ignore */ }
      if (mounted) setLoading(false);
    }
    fetchData();
    return () => { mounted = false; };
  }, [setSuites, setSummary, setLoading]);

  const handleDownloadAll = useCallback(async () => {
    const res = await fetch('/api/uat/export/all');
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uat_results_all_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleDownloadCSV = useCallback(async () => {
    const res = await fetch('/api/uat/export/all?format=csv');
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uat_results_all_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  const coverageColor = summary.coverage >= 95 ? 'text-green-400' : summary.coverage >= 80 ? 'text-yellow-400' : 'text-red-400';
  const passRate = summary.totalCases > 0 ? ((summary.passed / summary.totalCases) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={20} className="text-purple-400" />
          <h1 className="text-lg font-bold dark:text-gray-100 text-gray-900">UAT Dashboard</h1>
          {loading && <RefreshCw size={14} className="text-blue-400 animate-spin" />}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600 dark:hover:bg-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Download size={12} /> Export CSV
          </button>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-purple-600 text-white hover:bg-purple-500 transition-colors"
          >
            <Download size={12} /> Download All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-[10px] uppercase dark:text-gray-500 text-gray-400 mb-1">Coverage</p>
          <p className={`text-2xl font-bold ${coverageColor}`}>{summary.coverage.toFixed(1)}%</p>
          <p className="text-[10px] dark:text-gray-500 text-gray-400">target: {'>'}= 95%</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] uppercase dark:text-gray-500 text-gray-400 mb-1">Pass Rate</p>
          <p className="text-2xl font-bold text-green-400">{passRate}%</p>
          <p className="text-[10px] dark:text-gray-500 text-gray-400">{summary.passed} / {summary.totalCases} passed</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] uppercase dark:text-gray-500 text-gray-400 mb-1">Defects</p>
          <p className="text-2xl font-bold text-red-400">{summary.defectsFound}</p>
          <p className="text-[10px] dark:text-gray-500 text-gray-400">{summary.defectsResolved} resolved</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] uppercase dark:text-gray-500 text-gray-400 mb-1">Suites</p>
          <p className="text-2xl font-bold dark:text-gray-200 text-gray-700">{summary.totalSuites}</p>
          <p className="text-[10px] dark:text-gray-500 text-gray-400">{summary.totalCases} total cases</p>
        </div>
      </div>

      {/* Results Breakdown */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={14} /> Results Breakdown
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs dark:text-gray-300 text-gray-600">Passed: {summary.passed}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs dark:text-gray-300 text-gray-600">Failed: {summary.failed}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs dark:text-gray-300 text-gray-600">Blocked: {summary.blocked}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-xs dark:text-gray-300 text-gray-600">Skipped: {summary.skipped}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full dark:bg-gray-700 bg-gray-300" />
            <span className="text-xs dark:text-gray-300 text-gray-600">Pending: {summary.totalCases - summary.passed - summary.failed - summary.blocked - summary.skipped}</span>
          </div>
        </div>
        {summary.totalCases > 0 && (
          <div className="mt-3 h-4 rounded-full overflow-hidden dark:bg-gray-700 bg-gray-200 flex">
            {summary.passed > 0 && <div className="bg-green-500 h-full" style={{ width: `${(summary.passed / summary.totalCases) * 100}%` }} />}
            {summary.failed > 0 && <div className="bg-red-500 h-full" style={{ width: `${(summary.failed / summary.totalCases) * 100}%` }} />}
            {summary.blocked > 0 && <div className="bg-yellow-500 h-full" style={{ width: `${(summary.blocked / summary.totalCases) * 100}%` }} />}
            {summary.skipped > 0 && <div className="bg-gray-500 h-full" style={{ width: `${(summary.skipped / summary.totalCases) * 100}%` }} />}
          </div>
        )}
      </div>

      {/* Suite List */}
      <div>
        <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">
          Test Suites ({suites.length})
        </h2>
        {suites.length === 0 ? (
          <div className="card p-12 text-center">
            <ClipboardCheck size={32} className="dark:text-gray-600 text-gray-300 mx-auto mb-3" />
            <p className="dark:text-gray-500 text-gray-400 text-sm mb-1">No UAT suites yet</p>
            <p className="dark:text-gray-600 text-gray-400 text-xs">UAT data will appear here during Wave 3.7 execution</p>
          </div>
        ) : (
          suites.map((suite) => <SuiteRow key={suite.id} suite={suite} />)
        )}
      </div>
    </div>
  );
};
