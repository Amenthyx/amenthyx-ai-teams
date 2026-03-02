import { parseMarkdownTable } from './markdown-table-parser';

/**
 * Represents a single Kanban card parsed from KANBAN.md.
 */
export interface KanbanCard {
  id: string;
  issue: string;
  agent: string;
  status: string;
  wave: string;
  labels: string[];
}

/**
 * Parse KANBAN.md content into an array of KanbanCard objects.
 *
 * Expected table format:
 * | # | Issue | Agent | Status | Wave | Labels |
 * |---|-------|-------|--------|------|--------|
 * | 1 | #101  | BE    | In Progress | 1 | backend, api |
 */
export function parseKanban(markdown: string): KanbanCard[] {
  const table = parseMarkdownTable(markdown);

  if (table.headers.length === 0) {
    return [];
  }

  // Normalize headers to lowercase for flexible matching
  const headerMap = new Map<string, string>();
  for (const header of table.headers) {
    headerMap.set(header.toLowerCase().replace(/[^a-z]/g, ''), header);
  }

  // Find the actual header names used
  const idKey = findKey(headerMap, ['id', '', 'num', 'number']);
  const issueKey = findKey(headerMap, ['issue', 'task', 'title', 'item']);
  const agentKey = findKey(headerMap, ['agent', 'assignee', 'owner', 'role']);
  const statusKey = findKey(headerMap, ['status', 'state', 'column']);
  const waveKey = findKey(headerMap, ['wave', 'phase', 'sprint']);
  const labelsKey = findKey(headerMap, ['labels', 'tags', 'categories']);

  return table.rows.map((row, index) => {
    const labelsRaw = labelsKey ? row[labelsKey] || '' : '';
    const labels = labelsRaw
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    return {
      id: idKey ? row[idKey] || String(index + 1) : String(index + 1),
      issue: issueKey ? row[issueKey] || '' : '',
      agent: agentKey ? row[agentKey] || '' : '',
      status: statusKey ? row[statusKey] || 'unknown' : 'unknown',
      wave: waveKey ? row[waveKey] || '' : '',
      labels,
    };
  });
}

/**
 * Find the best matching header key from a list of possible names.
 */
function findKey(headerMap: Map<string, string>, candidates: string[]): string | undefined {
  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase().replace(/[^a-z]/g, '');
    if (headerMap.has(normalized)) {
      return headerMap.get(normalized);
    }
  }
  // Fallback: return the first header if it looks like an ID column
  return undefined;
}
