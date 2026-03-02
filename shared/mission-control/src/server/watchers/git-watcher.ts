import * as crypto from 'crypto';
import { execSync } from 'child_process';
import {
  EventCategory,
  type MissionControlEvent,
} from '../types/events';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Callback type for emitting parsed events.
 */
export type EventEmitter = (event: MissionControlEvent) => void;

/**
 * Configuration for the GitWatcherService.
 */
export interface GitWatcherConfig {
  /** Git working directory */
  cwd: string;
  /** Branch to monitor */
  branch: string;
  /** Poll interval in milliseconds */
  pollIntervalMs?: number;
  /** Session ID for generated events */
  sessionId: string;
}

/**
 * Parsed conventional commit.
 */
export interface ParsedCommit {
  hash: string;
  type: string;
  scope: string;
  description: string;
  filesChanged?: number;
  insertions?: number;
  deletions?: number;
}

/**
 * Regex for matching conventional commit messages.
 * Format: <hash> <type>(<scope>): <description>
 * or:     <hash> <type>: <description>
 */
const CONVENTIONAL_COMMIT_RE = /^([a-f0-9]+)\s+(\w+)(?:\(([\w-]+)\))?:\s+(.+)$/;

/**
 * GitWatcherService polls git log for new commits on a specified branch
 * and emits MissionControlEvents for each new commit detected.
 */
export class GitWatcherService {
  private pollTimer: NodeJS.Timeout | null = null;
  private lastKnownHash: string | null = null;
  private readonly config: Required<GitWatcherConfig>;
  private onEvent: EventEmitter;

  constructor(config: GitWatcherConfig, onEvent: EventEmitter) {
    this.config = {
      cwd: config.cwd,
      branch: config.branch,
      pollIntervalMs: config.pollIntervalMs ?? 10000,
      sessionId: config.sessionId,
    };
    this.onEvent = onEvent;
  }

  /**
   * Start polling for new commits.
   */
  start(): void {
    // Get the current HEAD as baseline
    this.lastKnownHash = this.getCurrentHead();
    if (this.lastKnownHash) {
      log('info', `Git watcher started on branch '${this.config.branch}' at ${this.lastKnownHash}`);
    } else {
      log('warn', `Git watcher: could not read HEAD for branch '${this.config.branch}'`);
    }

    this.pollTimer = setInterval(() => {
      this.poll();
    }, this.config.pollIntervalMs);
  }

  /**
   * Stop polling.
   */
  stop(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    log('info', 'Git watcher stopped');
  }

  /**
   * Poll for new commits since the last known hash.
   */
  private poll(): void {
    try {
      const commits = this.getRecentCommits(50);

      if (commits.length === 0) {
        return;
      }

      // Find new commits (those after lastKnownHash)
      const newCommits: string[] = [];
      for (const commitLine of commits) {
        const hash = commitLine.split(' ')[0];
        if (hash === this.lastKnownHash) {
          break;
        }
        newCommits.push(commitLine);
      }

      if (newCommits.length === 0) {
        return;
      }

      // Update last known hash to the most recent
      this.lastKnownHash = newCommits[0].split(' ')[0];

      // Process new commits (in chronological order: oldest first)
      for (const commitLine of newCommits.reverse()) {
        const parsed = this.parseCommitLine(commitLine);
        if (parsed) {
          // Get diff stats for the commit
          const stats = this.getDiffStats(parsed.hash);
          if (stats) {
            parsed.filesChanged = stats.filesChanged;
            parsed.insertions = stats.insertions;
            parsed.deletions = stats.deletions;
          }

          this.emitCommitEvent(parsed);
        }
      }

      // Also check branch status
      this.emitBranchStatus();

      log('info', `Detected ${newCommits.length} new commit(s)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Git poll error: ${message}`);
    }
  }

  /**
   * Get the current HEAD hash.
   */
  private getCurrentHead(): string | null {
    try {
      const result = execSync(`git rev-parse --short HEAD`, {
        cwd: this.config.cwd,
        encoding: 'utf-8',
        timeout: 5000,
      }).trim();
      return result || null;
    } catch {
      return null;
    }
  }

  /**
   * Get recent commits as oneline strings.
   */
  private getRecentCommits(count: number): string[] {
    try {
      const result = execSync(
        `git log --oneline -${count} ${this.config.branch}`,
        {
          cwd: this.config.cwd,
          encoding: 'utf-8',
          timeout: 5000,
        }
      ).trim();
      if (!result) return [];
      return result.split('\n').filter((line) => line.trim().length > 0);
    } catch {
      return [];
    }
  }

  /**
   * Parse a git log --oneline line into a structured commit.
   */
  private parseCommitLine(line: string): ParsedCommit | null {
    const match = line.match(CONVENTIONAL_COMMIT_RE);
    if (match) {
      return {
        hash: match[1],
        type: match[2],
        scope: match[3] || '',
        description: match[4],
      };
    }

    // Fallback: non-conventional commit
    const parts = line.split(' ');
    if (parts.length >= 2) {
      return {
        hash: parts[0],
        type: 'unknown',
        scope: '',
        description: parts.slice(1).join(' '),
      };
    }

    return null;
  }

  /**
   * Get diff stats for a commit.
   */
  private getDiffStats(hash: string): { filesChanged: number; insertions: number; deletions: number } | null {
    try {
      const result = execSync(`git show --stat --format="" ${hash}`, {
        cwd: this.config.cwd,
        encoding: 'utf-8',
        timeout: 5000,
      }).trim();

      if (!result) return null;

      const lines = result.split('\n');
      const summaryLine = lines[lines.length - 1];

      // Parse summary line like: "3 files changed, 45 insertions(+), 12 deletions(-)"
      const filesMatch = summaryLine.match(/(\d+)\s+files?\s+changed/);
      const insertMatch = summaryLine.match(/(\d+)\s+insertions?/);
      const deleteMatch = summaryLine.match(/(\d+)\s+deletions?/);

      return {
        filesChanged: filesMatch ? parseInt(filesMatch[1], 10) : 0,
        insertions: insertMatch ? parseInt(insertMatch[1], 10) : 0,
        deletions: deleteMatch ? parseInt(deleteMatch[1], 10) : 0,
      };
    } catch {
      return null;
    }
  }

  /**
   * Emit branch status (commits ahead of origin/main).
   */
  private emitBranchStatus(): void {
    try {
      const result = execSync(
        `git rev-list --count HEAD --not origin/main`,
        {
          cwd: this.config.cwd,
          encoding: 'utf-8',
          timeout: 5000,
        }
      ).trim();

      const aheadCount = parseInt(result, 10);
      if (!isNaN(aheadCount)) {
        this.emitEvent(EventCategory.GIT, 'branch_status', 'info', {
          branch: this.config.branch,
          aheadOfMain: aheadCount,
        });
      }
    } catch {
      // origin/main might not exist; ignore
    }
  }

  /**
   * Emit a commit event.
   */
  private emitCommitEvent(commit: ParsedCommit): void {
    // Determine agent from commit scope
    const agent = commit.scope
      ? { role: commit.scope.toUpperCase(), name: commit.scope }
      : undefined;

    this.emitEvent(EventCategory.GIT, 'commit', 'info', {
      hash: commit.hash,
      commitType: commit.type,
      scope: commit.scope,
      description: commit.description,
      filesChanged: commit.filesChanged,
      insertions: commit.insertions,
      deletions: commit.deletions,
    }, agent ? { role: agent.role, name: agent.name } : undefined, {
      commit_hash: commit.hash,
    });
  }

  /**
   * Create and emit a MissionControlEvent.
   */
  private emitEvent(
    category: EventCategory,
    type: string,
    severity: 'info' | 'warn' | 'error' | 'critical',
    payload: Record<string, unknown>,
    agent?: { role: string; name?: string },
    meta?: Record<string, unknown>
  ): void {
    const event: MissionControlEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      sessionId: this.config.sessionId,
      source: {
        tool: 'git-watcher',
        adapter: 'git-cli',
        version: '1.0.0',
      },
      category,
      type,
      severity,
      agent,
      payload,
      meta: meta as MissionControlEvent['meta'],
    };

    this.onEvent(event);
  }
}
