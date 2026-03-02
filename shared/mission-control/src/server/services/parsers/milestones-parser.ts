import { parseMarkdownTable } from './markdown-table-parser';

/**
 * Represents a single milestone parsed from MILESTONES.md.
 */
export interface Milestone {
  number: string;
  name: string;
  wave: string;
  deliverables: string;
  gate: string;
  status: string;
}

/**
 * Parse MILESTONES.md content into an array of Milestone objects.
 *
 * Expected table format:
 * | # | Name | Wave | Deliverables | Gate | Status |
 * |---|------|------|--------------|------|--------|
 * | 1 | API Complete | 2 | REST endpoints, WebSocket | QA pass | In Progress |
 */
export function parseMilestones(markdown: string): Milestone[] {
  const table = parseMarkdownTable(markdown);

  if (table.headers.length === 0) {
    return [];
  }

  // Normalize headers for flexible matching
  const headerMap = new Map<string, string>();
  for (const header of table.headers) {
    headerMap.set(header.toLowerCase().replace(/[^a-z]/g, ''), header);
  }

  const numKey = findKey(headerMap, ['', 'num', 'number', 'id', 'ms']);
  const nameKey = findKey(headerMap, ['name', 'milestone', 'title']);
  const waveKey = findKey(headerMap, ['wave', 'phase', 'sprint']);
  const deliverablesKey = findKey(headerMap, ['deliverables', 'deliverable', 'items', 'outputs']);
  const gateKey = findKey(headerMap, ['gate', 'criteria', 'gatecriteria', 'acceptance']);
  const statusKey = findKey(headerMap, ['status', 'state', 'progress']);

  return table.rows.map((row, index) => ({
    number: numKey ? row[numKey] || String(index + 1) : String(index + 1),
    name: nameKey ? row[nameKey] || '' : '',
    wave: waveKey ? row[waveKey] || '' : '',
    deliverables: deliverablesKey ? row[deliverablesKey] || '' : '',
    gate: gateKey ? row[gateKey] || '' : '',
    status: statusKey ? row[statusKey] || 'unknown' : 'unknown',
  }));
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
  return undefined;
}
