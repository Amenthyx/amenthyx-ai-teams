export interface ParsedDecision {
  title: string;
  context: string;
  decision: string;
  rationale: string;
  decidedBy: string;
  status: string;
}

export function parseDecisionsMarkdown(content: string): ParsedDecision[] {
  const decisions: ParsedDecision[] = [];
  const sections = content.split(/^## /gm).filter(Boolean);

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const title = lines[0]?.trim() || '';
    if (!title) continue;

    let context = '';
    let decision = '';
    let rationale = '';
    let decidedBy = '';
    let status = 'proposed';

    let currentField = '';
    for (const line of lines.slice(1)) {
      if (line.startsWith('**Context**:') || line.startsWith('- **Context**:')) {
        context = line.replace(/.*\*\*Context\*\*:\s*/, '').trim();
        currentField = 'context';
      } else if (line.startsWith('**Decision**:') || line.startsWith('- **Decision**:')) {
        decision = line.replace(/.*\*\*Decision\*\*:\s*/, '').trim();
        currentField = 'decision';
      } else if (line.startsWith('**Rationale**:') || line.startsWith('- **Rationale**:')) {
        rationale = line.replace(/.*\*\*Rationale\*\*:\s*/, '').trim();
        currentField = 'rationale';
      } else if (line.startsWith('**Decided by**:') || line.startsWith('- **Decided by**:')) {
        decidedBy = line.replace(/.*\*\*Decided by\*\*:\s*/, '').trim();
      } else if (line.startsWith('**Status**:') || line.startsWith('- **Status**:')) {
        status = line.replace(/.*\*\*Status\*\*:\s*/, '').trim().toLowerCase();
      } else if (line.trim() && currentField) {
        // Continuation of previous field
        if (currentField === 'context') context += ' ' + line.trim();
        else if (currentField === 'decision') decision += ' ' + line.trim();
        else if (currentField === 'rationale') rationale += ' ' + line.trim();
      }
    }

    if (title && decision) {
      decisions.push({ title, context, decision, rationale, decidedBy, status });
    }
  }

  return decisions;
}
