import React, { useState } from 'react';
import { FileText, Download, Loader2, ExternalLink } from 'lucide-react';

const REPORT_SECTIONS = [
  { id: 'overview', label: 'Executive Summary' },
  { id: 'agents', label: 'Agents & Performance' },
  { id: 'budget', label: 'Budget & Cost' },
  { id: 'waves', label: 'Wave Progress' },
  { id: 'gates', label: 'Quality Gates' },
  { id: 'interview', label: 'Discovery Interview' },
  { id: 'decisions', label: 'Decisions Log' },
  { id: 'cicd', label: 'CI/CD Runs' },
  { id: 'tests', label: 'UAT Testing' },
  { id: 'evidence', label: 'Evidence & Proof' },
  { id: 'artifacts', label: 'Build Artifacts' },
  { id: 'messages', label: 'Agent Messages' },
  { id: 'events', label: 'Event Log & Analytics' },
  { id: 'kanban', label: 'Kanban' },
] as const;

type SectionId = (typeof REPORT_SECTIONS)[number]['id'];

export const ReportBuilderPanel: React.FC = () => {
  const [selectedSections, setSelectedSections] = useState<Set<SectionId>>(
    new Set(REPORT_SECTIONS.map((s) => s.id))
  );
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSection = (id: SectionId) => {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => setSelectedSections(new Set(REPORT_SECTIONS.map((s) => s.id)));
  const selectNone = () => setSelectedSections(new Set());

  /** Full enterprise report — opens in new tab for browser Print → PDF */
  const handleFullReport = () => {
    window.open('/api/export/pdf/preview', '_blank');
  };

  /** Custom report via POST (legacy, returns HTML) */
  const handleGenerate = async () => {
    if (selectedSections.size === 0) {
      setError('Select at least one section');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: Array.from(selectedSections),
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          format: 'pdf',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mission-control-report-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <h3 className="text-sm font-semibold dark:text-gray-200 text-gray-800 mb-3">
        Report Builder
      </h3>

      {/* Full Enterprise Report — primary CTA */}
      <button
        onClick={handleFullReport}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
      >
        <FileText size={16} />
        Full Enterprise Report (PDF)
        <ExternalLink size={12} className="opacity-60" />
      </button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t dark:border-gray-700 border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 dark:bg-gray-800/50 bg-white dark:text-gray-500 text-gray-400">
            or build custom report
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium dark:text-gray-400 text-gray-500">
            Sections
          </span>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-[10px] text-blue-400 hover:text-blue-300"
            >
              All
            </button>
            <button
              onClick={selectNone}
              className="text-[10px] text-blue-400 hover:text-blue-300"
            >
              None
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {REPORT_SECTIONS.map((section) => (
            <label
              key={section.id}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg dark:bg-gray-700/30 bg-gray-50 cursor-pointer hover:dark:bg-gray-700/50 hover:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedSections.has(section.id)}
                onChange={() => toggleSection(section.id)}
                className="rounded border-gray-500 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 h-3.5 w-3.5"
              />
              <span className="text-xs dark:text-gray-300 text-gray-600">
                {section.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div className="mb-4">
        <span className="text-xs font-medium dark:text-gray-400 text-gray-500 mb-2 block">
          Date Range
        </span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg text-xs dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-xs dark:text-gray-500 text-gray-400">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg text-xs dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={generating || selectedSections.size === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg dark:bg-gray-700 bg-gray-200 dark:hover:bg-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 text-gray-700 text-xs font-medium transition-colors"
      >
        {generating ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download size={14} />
            Download Custom Report
          </>
        )}
      </button>
    </div>
  );
};
