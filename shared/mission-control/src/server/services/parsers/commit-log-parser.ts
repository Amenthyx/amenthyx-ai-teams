import { parseMarkdownTable } from './markdown-table-parser';

/**
 * Represents a single commit entry parsed from COMMIT_LOG.md.
 */
export interface CommitEntry {
  number: string;
  hash: string;
  agent: string;
  type: string;
  description: string;
  issue: string;
  wave: string;
  evidence: string;
}

/**
 * Parse COMMIT_LOG.md content into an array of CommitEntry objects.
 *
 * Expected table format:
 * | # | Hash | Agent | Type | Description | Issue | Wave | Evidence |
 * |---|------|-------|------|-------------|-------|------|----------|
 * | 1 | abc1234 | BE | feat | Add event schema | #101 | 1 | test_pass |
 */
export function parseCommitLog(markdown: string): CommitEntry[] {
  const table = parseMarkdownTable(markdown);

  if (table.headers.length === 0) {
    return [];
  }

  // Normalize headers for flexible matching
  const headerMap = new Map<string, string>();
  for (const header of table.headers) {
    headerMap.set(header.toLowerCase().replace(/[^a-z]/g, ''), header);
  }

  const numKey = findKey(headerMap, ['', 'num', 'number', 'id']);
  const hashKey = findKey(headerMap, ['hash', 'commit', 'sha']);
  const agentKey = findKey(headerMap, ['agent', 'author', 'role']);
  const typeKey = findKey(headerMap, ['type', 'kind', 'category']);
  const descKey = findKey(headerMap, ['description', 'desc', 'message', 'summary']);
  const issueKey = findKey(headerMap, ['issue', 'ticket', 'ref']);
  const waveKey = findKey(headerMap, ['wave', 'phase', 'sprint']);
  const evidenceKey = findKey(headerMap, ['evidence', 'proof', 'verification']);

  return table.rows.map((row, index) => ({
    number: numKey ? row[numKey] || String(index + 1) : String(index + 1),
    hash: hashKey ? row[hashKey] || '' : '',
    agent: agentKey ? row[agentKey] || '' : '',
    type: typeKey ? row[typeKey] || '' : '',
    description: descKey ? row[descKey] || '' : '',
    issue: issueKey ? row[issueKey] || '' : '',
    wave: waveKey ? row[waveKey] || '' : '',
    evidence: evidenceKey ? row[evidenceKey] || '' : '',
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
