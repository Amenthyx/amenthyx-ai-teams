export interface ParsedInterview {
  question: string;
  answer: string;
  implications: string;
  category: string;
}

export function parseInterviewMarkdown(content: string): ParsedInterview[] {
  const interviews: ParsedInterview[] = [];
  const sections = content.split(/^### /gm).filter(Boolean);
  let currentCategory = 'general';

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const header = lines[0]?.trim() || '';

    // Check if this is a category header
    if (['business', 'technical', 'constraints', 'stakeholders'].includes(header.toLowerCase())) {
      currentCategory = header.toLowerCase();
      continue;
    }

    let question = header;
    let answer = '';
    let implications = '';

    for (const line of lines.slice(1)) {
      if (line.startsWith('**A:**') || line.startsWith('**Answer:**')) {
        answer = line.replace(/\*\*(A|Answer)\*\*:\s*/, '').trim();
      } else if (line.startsWith('**Implications:**')) {
        implications = line.replace('**Implications:**', '').trim();
      } else if (answer && !implications && line.trim()) {
        answer += ' ' + line.trim();
      }
    }

    if (question && answer) {
      // Remove Q: prefix if present
      question = question.replace(/^Q:\s*/i, '');
      interviews.push({ question, answer, implications, category: currentCategory });
    }
  }

  return interviews;
}
