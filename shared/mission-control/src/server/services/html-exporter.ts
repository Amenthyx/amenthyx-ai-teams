import { generateMarkdownReport } from './markdown-exporter';

/**
 * Wraps the markdown session report in a styled HTML template.
 * Uses a simple markdown-to-HTML conversion (tables, headers, emphasis)
 * with inline dark-themed styles.
 */
export function generateHtmlReport(): string {
  const markdown = generateMarkdownReport();
  const htmlBody = markdownToHtml(markdown);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mission Control Session Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0F172A;
      color: #E2E8F0;
      line-height: 1.6;
      padding: 2rem;
      max-width: 960px;
      margin: 0 auto;
    }
    h1 {
      font-size: 1.75rem;
      color: #F8FAFC;
      border-bottom: 2px solid #334155;
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }
    h2 {
      font-size: 1.25rem;
      color: #94A3B8;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    h3 {
      font-size: 1rem;
      color: #CBD5E1;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
    }
    p {
      margin-bottom: 0.75rem;
    }
    em {
      color: #64748B;
      font-style: italic;
    }
    strong {
      color: #F1F5F9;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    th {
      background-color: #1E293B;
      color: #94A3B8;
      font-weight: 600;
      text-align: left;
      padding: 0.5rem 0.75rem;
      border-bottom: 2px solid #334155;
    }
    td {
      padding: 0.4rem 0.75rem;
      border-bottom: 1px solid #1E293B;
      color: #CBD5E1;
    }
    tr:hover td {
      background-color: #1E293B;
    }
    hr {
      border: none;
      border-top: 1px solid #334155;
      margin: 2rem 0;
    }
    code {
      background-color: #1E293B;
      padding: 0.1rem 0.3rem;
      border-radius: 3px;
      font-size: 0.85em;
    }
  </style>
</head>
<body>
${htmlBody}
</body>
</html>`;
}

/**
 * Minimal markdown-to-HTML converter.
 * Handles: headers, tables, bold, italic, horizontal rules, paragraphs.
 */
function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inTable = false;
  let inTHead = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      if (inTable) {
        html.push('</tbody></table>');
        inTable = false;
      }
      html.push('<hr />');
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      if (inTable) {
        html.push('</tbody></table>');
        inTable = false;
      }
      const level = headerMatch[1].length;
      html.push(`<h${level}>${inlineFormat(headerMatch[2])}</h${level}>`);
      continue;
    }

    // Table separator row (skip)
    if (/^\|[-\s|:]+\|$/.test(line.trim())) {
      continue;
    }

    // Table row
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line
        .trim()
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      if (!inTable) {
        inTable = true;
        inTHead = true;
        html.push('<table>');
        html.push('<thead><tr>');
        for (const cell of cells) {
          html.push(`<th>${inlineFormat(cell)}</th>`);
        }
        html.push('</tr></thead>');
        html.push('<tbody>');
        continue;
      }

      html.push('<tr>');
      for (const cell of cells) {
        html.push(`<td>${inlineFormat(cell)}</td>`);
      }
      html.push('</tr>');
      continue;
    }

    // End table if we hit a non-table line
    if (inTable) {
      html.push('</tbody></table>');
      inTable = false;
    }

    // Empty line
    if (line.trim() === '') {
      continue;
    }

    // Paragraph
    html.push(`<p>${inlineFormat(line)}</p>`);
  }

  if (inTable) {
    html.push('</tbody></table>');
  }

  return html.join('\n');
}

/**
 * Apply inline formatting: bold, italic, code.
 */
function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}
