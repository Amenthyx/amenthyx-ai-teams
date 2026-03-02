/**
 * Generic markdown table parser.
 * Parses markdown tables into arrays of key-value objects.
 *
 * Handles:
 * - Standard pipe-delimited tables
 * - Separator rows (---) are ignored
 * - Leading/trailing pipes
 * - Whitespace trimming
 */

export interface ParsedTable {
  headers: string[];
  rows: Array<Record<string, string>>;
}

/**
 * Parse a markdown table string into structured data.
 */
export function parseMarkdownTable(markdown: string): ParsedTable {
  const lines = markdown.split('\n').filter((line) => line.trim().length > 0);

  // Find table lines (lines containing pipes)
  const tableLines = lines.filter((line) => line.includes('|'));

  if (tableLines.length < 2) {
    return { headers: [], rows: [] };
  }

  // Parse header row
  const headers = parsePipeLine(tableLines[0]);

  if (headers.length === 0) {
    return { headers: [], rows: [] };
  }

  // Parse data rows (skip header and separator)
  const rows: Array<Record<string, string>> = [];

  for (let i = 1; i < tableLines.length; i++) {
    const line = tableLines[i];

    // Skip separator rows (e.g., |---|---|---|)
    if (isSeparatorRow(line)) {
      continue;
    }

    const values = parsePipeLine(line);
    if (values.length === 0) {
      continue;
    }

    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || '';
    }
    rows.push(row);
  }

  return { headers, rows };
}

/**
 * Parse all markdown tables from a string.
 * Returns an array of parsed tables.
 */
export function parseAllTables(markdown: string): ParsedTable[] {
  const tables: ParsedTable[] = [];
  const lines = markdown.split('\n');

  let tableBlock: string[] = [];
  let inTable = false;

  for (const line of lines) {
    const hasTable = line.includes('|') && line.trim().startsWith('|');

    if (hasTable) {
      inTable = true;
      tableBlock.push(line);
    } else if (inTable) {
      // End of table block
      if (tableBlock.length >= 2) {
        const table = parseMarkdownTable(tableBlock.join('\n'));
        if (table.headers.length > 0 && table.rows.length > 0) {
          tables.push(table);
        }
      }
      tableBlock = [];
      inTable = false;
    }
  }

  // Handle table at end of string
  if (tableBlock.length >= 2) {
    const table = parseMarkdownTable(tableBlock.join('\n'));
    if (table.headers.length > 0 && table.rows.length > 0) {
      tables.push(table);
    }
  }

  return tables;
}

/**
 * Parse a pipe-delimited line into trimmed values.
 */
function parsePipeLine(line: string): string[] {
  return line
    .split('|')
    .map((cell) => cell.trim())
    .filter((_, index, arr) => {
      // Remove empty first and last elements from leading/trailing pipes
      if (index === 0 && arr[0] === '') return false;
      if (index === arr.length - 1 && arr[arr.length - 1] === '') return false;
      return true;
    });
}

/**
 * Check if a line is a markdown table separator row.
 */
function isSeparatorRow(line: string): boolean {
  const cells = line.split('|').map((c) => c.trim());
  return cells.every((cell) => cell === '' || /^:?-+:?$/.test(cell));
}
