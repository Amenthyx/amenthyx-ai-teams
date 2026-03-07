import React, { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';

const REPORT_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'agents', label: 'Agents' },
  { id: 'budget', label: 'Budget' },
  { id: 'tests', label: 'Tests' },
  { id: 'git', label: 'Git' },
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
      a.download = `mission-control-report-${new Date().toISOString().slice(0, 10)}.pdf`;
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

      {/* Sections */}
      <div className="mb-4">
        <span className="text-xs font-medium dark:text-gray-400 text-gray-500 mb-2 block">
          Sections
        </span>
        <div className="grid grid-cols-2 gap-2">
          {REPORT_SECTIONS.map((section) => (
            <label
              key={section.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg dark:bg-gray-700/30 bg-gray-50 cursor-pointer hover:dark:bg-gray-700/50 hover:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedSections.has(section.id)}
                onChange={() => toggleSection(section.id)}
                className="rounded border-gray-500 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="text-sm dark:text-gray-300 text-gray-600">
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
            className="flex-1 px-3 py-1.5 rounded-lg text-sm dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-xs dark:text-gray-500 text-gray-400">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg text-sm dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Format */}
      <div className="mb-4">
        <span className="text-xs font-medium dark:text-gray-400 text-gray-500 mb-2 block">
          Format
        </span>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg dark:bg-gray-700/30 bg-gray-50">
          <FileText size={14} className="dark:text-gray-400 text-gray-500" />
          <span className="text-sm dark:text-gray-300 text-gray-600">PDF</span>
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
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-sm font-medium transition-colors"
      >
        {generating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download size={16} />
            Generate Report
          </>
        )}
      </button>
    </div>
  );
};
