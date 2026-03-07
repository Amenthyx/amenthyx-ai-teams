import React, { useMemo } from 'react';
import { FileCode } from 'lucide-react';

interface DiffViewerPanelProps {
  diff: string;
  title?: string;
  compact?: boolean;
}

interface DiffLine {
  type: 'add' | 'remove' | 'context' | 'header' | 'meta';
  content: string;
  oldLineNum: number | null;
  newLineNum: number | null;
}

/**
 * File diff viewer. Shows unified diff with line numbers,
 * green/red highlighting for additions/deletions.
 */
export const DiffViewerPanel: React.FC<DiffViewerPanelProps> = ({
  diff,
  title,
  compact = false,
}) => {
  const parsedLines = useMemo(() => parseDiff(diff), [diff]);

  if (!diff || diff.trim() === '') {
    return (
      <div>
        {title && (
          <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileCode size={14} />
            {title}
          </h2>
        )}
        <div className="card p-6 flex items-center justify-center">
          <p className="text-xs dark:text-gray-600 text-gray-400 italic">No diff to display</p>
        </div>
      </div>
    );
  }

  const maxLines = compact ? 100 : parsedLines.length;
  const displayLines = parsedLines.slice(0, maxLines);
  const truncated = parsedLines.length > maxLines;

  // Stats
  const additions = parsedLines.filter((l) => l.type === 'add').length;
  const deletions = parsedLines.filter((l) => l.type === 'remove').length;

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <FileCode size={14} />
            {title}
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-green-400 font-medium">+{additions}</span>
            <span className="text-red-400 font-medium">-{deletions}</span>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <tbody>
              {displayLines.map((line, i) => (
                <tr
                  key={i}
                  className={getLineClass(line.type)}
                >
                  {/* Old line number */}
                  <td className="select-none text-right px-2 py-0 w-10 dark:text-gray-600 text-gray-400 dark:border-r dark:border-gray-700 border-r border-gray-200">
                    {line.oldLineNum ?? ''}
                  </td>

                  {/* New line number */}
                  <td className="select-none text-right px-2 py-0 w-10 dark:text-gray-600 text-gray-400 dark:border-r dark:border-gray-700 border-r border-gray-200">
                    {line.newLineNum ?? ''}
                  </td>

                  {/* Content */}
                  <td className="px-3 py-0 whitespace-pre">
                    {line.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {truncated && (
          <div className="text-center py-2 text-xs dark:text-gray-500 text-gray-400 border-t dark:border-gray-700 border-gray-200">
            ... {parsedLines.length - maxLines} more lines
          </div>
        )}
      </div>
    </div>
  );
};

function getLineClass(type: DiffLine['type']): string {
  switch (type) {
    case 'add':
      return 'dark:bg-green-900/20 bg-green-50 dark:text-green-300 text-green-800';
    case 'remove':
      return 'dark:bg-red-900/20 bg-red-50 dark:text-red-300 text-red-800';
    case 'header':
      return 'dark:bg-blue-900/20 bg-blue-50 dark:text-blue-300 text-blue-800 font-bold';
    case 'meta':
      return 'dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-500 italic';
    case 'context':
    default:
      return 'dark:text-gray-400 text-gray-600';
  }
}

function parseDiff(diff: string): DiffLine[] {
  const lines = diff.split('\n');
  const result: DiffLine[] = [];

  let oldLine = 0;
  let newLine = 0;

  for (const raw of lines) {
    // Hunk header: @@ -oldStart,count +newStart,count @@
    const hunkMatch = raw.match(/^@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@/);
    if (hunkMatch) {
      oldLine = parseInt(hunkMatch[1], 10);
      newLine = parseInt(hunkMatch[2], 10);
      result.push({ type: 'header', content: raw, oldLineNum: null, newLineNum: null });
      continue;
    }

    // File headers (diff --git, index, ---, +++)
    if (
      raw.startsWith('diff ') ||
      raw.startsWith('index ') ||
      raw.startsWith('--- ') ||
      raw.startsWith('+++ ')
    ) {
      result.push({ type: 'meta', content: raw, oldLineNum: null, newLineNum: null });
      continue;
    }

    // Addition
    if (raw.startsWith('+')) {
      result.push({ type: 'add', content: raw, oldLineNum: null, newLineNum: newLine });
      newLine++;
      continue;
    }

    // Deletion
    if (raw.startsWith('-')) {
      result.push({ type: 'remove', content: raw, oldLineNum: oldLine, newLineNum: null });
      oldLine++;
      continue;
    }

    // Context line
    if (raw.startsWith(' ') || raw === '') {
      result.push({ type: 'context', content: raw, oldLineNum: oldLine, newLineNum: newLine });
      oldLine++;
      newLine++;
      continue;
    }

    // Other (e.g., "\ No newline at end of file")
    result.push({ type: 'meta', content: raw, oldLineNum: null, newLineNum: null });
  }

  return result;
}
