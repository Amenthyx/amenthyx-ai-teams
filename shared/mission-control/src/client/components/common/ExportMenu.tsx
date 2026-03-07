import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Code, FileJson } from 'lucide-react';

type ExportFormat = 'markdown' | 'html' | 'json';

interface ExportOption {
  format: ExportFormat;
  label: string;
  icon: React.ReactNode;
  filename: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    format: 'markdown',
    label: 'Markdown (.md)',
    icon: <FileText size={14} />,
    filename: 'mission-control-report.md',
  },
  {
    format: 'html',
    label: 'HTML (.html)',
    icon: <Code size={14} />,
    filename: 'mission-control-report.html',
  },
  {
    format: 'json',
    label: 'JSON (.json)',
    icon: <FileJson size={14} />,
    filename: 'mission-control-report.json',
  },
];

/**
 * Dropdown menu with export options: Markdown, HTML, JSON.
 * Each option calls /api/export/:format and triggers a file download.
 */
export const ExportMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<ExportFormat | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  const handleExport = async (option: ExportOption) => {
    setDownloading(option.format);
    try {
      const res = await fetch(`/api/export/${option.format}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = option.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setOpen(false);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
          dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300
          bg-gray-200 hover:bg-gray-300 text-gray-700"
        title="Export report"
      >
        <Download size={14} />
        <span>Export</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-1 z-50 w-48 py-1 rounded-lg shadow-xl
          dark:bg-gray-800 dark:border dark:border-gray-700
          bg-white border border-gray-200">
          {EXPORT_OPTIONS.map((option) => (
            <button
              key={option.format}
              onClick={() => handleExport(option)}
              disabled={downloading !== null}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors
                dark:text-gray-300 dark:hover:bg-gray-700
                text-gray-700 hover:bg-gray-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="dark:text-gray-400 text-gray-500">
                {downloading === option.format ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-current" />
                ) : (
                  option.icon
                )}
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
