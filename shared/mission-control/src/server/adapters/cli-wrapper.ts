import * as crypto from 'crypto';
import { spawn } from 'child_process';
import * as http from 'http';
import {
  EventCategory,
  type MissionControlEvent,
  type Severity,
} from '../types/events';

const MC_URL = process.env.MC_URL || 'http://localhost:4201';

/**
 * Classification rules for CLI output lines.
 */
interface ClassificationRule {
  pattern: RegExp;
  category: EventCategory;
  severity: Severity;
}

const CLASSIFICATION_RULES: ClassificationRule[] = [
  { pattern: /error|Error|ERROR|FATAL|fatal/, category: EventCategory.SYSTEM, severity: 'error' },
  { pattern: /warn|Warning|WARN/, category: EventCategory.SYSTEM, severity: 'warn' },
  { pattern: /test|Test|PASS|FAIL|spec|describe|it\(/, category: EventCategory.TEST, severity: 'info' },
  { pattern: /commit|push|merge|pull|rebase|cherry-pick/, category: EventCategory.GIT, severity: 'info' },
  { pattern: /build|compile|bundle|webpack|vite|tsc/, category: EventCategory.BUILD, severity: 'info' },
  { pattern: /deploy|release|publish/, category: EventCategory.CI, severity: 'info' },
];

/**
 * Classify a line of CLI output.
 */
function classifyLine(line: string): { category: EventCategory; severity: Severity } {
  for (const rule of CLASSIFICATION_RULES) {
    if (rule.pattern.test(line)) {
      return { category: rule.category, severity: rule.severity };
    }
  }
  return { category: EventCategory.SYSTEM, severity: 'info' };
}

/**
 * Translate a CLI event payload into a MissionControlEvent.
 * Used by the POST /api/events/cli endpoint.
 */
export function translateCliEvent(
  payload: unknown,
  sessionId: string
): MissionControlEvent {
  const data = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;

  const line = (data.line as string) || (data.message as string) || '';
  const stream = (data.stream as string) || 'stdout';
  const command = (data.command as string) || 'unknown';
  const exitCode = data.exitCode as number | undefined;

  const classification = classifyLine(line);

  // Override severity for stderr lines
  if (stream === 'stderr' && classification.severity === 'info') {
    classification.severity = 'warn';
  }

  // If exit code provided and non-zero, mark as error
  if (exitCode !== undefined && exitCode !== 0) {
    classification.severity = 'error';
  }

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    sessionId,
    source: {
      tool: 'cli',
      adapter: 'cli-wrapper',
      version: '1.0.0',
    },
    category: classification.category,
    type: exitCode !== undefined ? 'process_exit' : 'output',
    severity: classification.severity,
    payload: {
      line,
      stream,
      command,
      exitCode,
    },
  };
}

/**
 * POST a MissionControlEvent to the Mission Control server.
 */
function postEvent(event: Record<string, unknown>): void {
  const url = new URL('/api/events/cli', MC_URL);
  const body = JSON.stringify(event);

  const options: http.RequestOptions = {
    hostname: url.hostname,
    port: url.port || 4201,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const req = http.request(options);
  req.on('error', () => {
    // Silently ignore connection errors — MC server might not be running
  });
  req.write(body);
  req.end();
}

/**
 * Run the CLI wrapper as a standalone script.
 * Usage: node cli-wrapper.js "command to wrap"
 */
function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    process.stderr.write('Usage: node cli-wrapper.js "command to wrap"\n');
    process.exit(1);
  }

  const command = args.join(' ');
  const sessionId = crypto.randomUUID();

  // Determine shell based on platform
  const isWindows = process.platform === 'win32';
  const shell = isWindows ? 'cmd' : '/bin/sh';
  const shellFlag = isWindows ? '/c' : '-c';

  const child = spawn(shell, [shellFlag, command], {
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env },
  });

  // Process stdout line by line
  let stdoutBuffer = '';
  child.stdout.on('data', (data: Buffer) => {
    const text = data.toString();
    process.stdout.write(text); // Pass through

    stdoutBuffer += text;
    const lines = stdoutBuffer.split('\n');
    stdoutBuffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim().length > 0) {
        const classification = classifyLine(line);
        postEvent({
          line: line.trim(),
          stream: 'stdout',
          command,
          ...classification,
          sessionId,
        });
      }
    }
  });

  // Process stderr line by line
  let stderrBuffer = '';
  child.stderr.on('data', (data: Buffer) => {
    const text = data.toString();
    process.stderr.write(text); // Pass through

    stderrBuffer += text;
    const lines = stderrBuffer.split('\n');
    stderrBuffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim().length > 0) {
        const classification = classifyLine(line);
        if (classification.severity === 'info') {
          classification.severity = 'warn';
        }
        postEvent({
          line: line.trim(),
          stream: 'stderr',
          command,
          ...classification,
          sessionId,
        });
      }
    }
  });

  // Handle process exit
  child.on('close', (code: number | null) => {
    // Flush remaining buffers
    if (stdoutBuffer.trim().length > 0) {
      postEvent({
        line: stdoutBuffer.trim(),
        stream: 'stdout',
        command,
        ...classifyLine(stdoutBuffer),
        sessionId,
      });
    }
    if (stderrBuffer.trim().length > 0) {
      postEvent({
        line: stderrBuffer.trim(),
        stream: 'stderr',
        command,
        ...classifyLine(stderrBuffer),
        sessionId,
      });
    }

    // Emit session end event
    postEvent({
      line: `Process exited with code ${code}`,
      stream: 'stdout',
      command,
      exitCode: code ?? 1,
      category: EventCategory.SYSTEM,
      severity: code === 0 ? 'info' : 'error',
      sessionId,
    });

    process.exit(code ?? 1);
  });

  child.on('error', (err: Error) => {
    process.stderr.write(`Failed to start process: ${err.message}\n`);
    postEvent({
      line: `Failed to start: ${err.message}`,
      stream: 'stderr',
      command,
      category: EventCategory.SYSTEM,
      severity: 'critical',
      sessionId,
    });
    process.exit(1);
  });
}

// Run as standalone script if invoked directly
if (require.main === module) {
  main();
}
