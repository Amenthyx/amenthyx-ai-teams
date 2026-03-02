import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import chokidar from 'chokidar';
import {
  EventCategory,
  type MissionControlEvent,
} from '../types/events';
import { parseKanban } from '../services/parsers/kanban-parser';
import { parseCommitLog } from '../services/parsers/commit-log-parser';
import { parseMilestones } from '../services/parsers/milestones-parser';
import { parseCostEstimation } from '../services/parsers/cost-parser';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Callback type for emitting parsed events.
 */
export type EventEmitter = (event: MissionControlEvent) => void;

/**
 * Configuration for the FileWatcherService.
 */
export interface FileWatcherConfig {
  /** Directory to watch (typically .team/) */
  watchDir: string;
  /** Session ID for generated events */
  sessionId: string;
  /** Debounce interval in milliseconds */
  debounceMs?: number;
}

/**
 * FileWatcherService watches the .team/ directory for changes to team artifacts
 * and emits structured MissionControlEvents when files are created or modified.
 */
export class FileWatcherService {
  private watcher: chokidar.FSWatcher | null = null;
  private pendingChanges: Map<string, NodeJS.Timeout> = new Map();
  private readonly config: Required<FileWatcherConfig>;
  private onEvent: EventEmitter;

  constructor(config: FileWatcherConfig, onEvent: EventEmitter) {
    this.config = {
      watchDir: config.watchDir,
      sessionId: config.sessionId,
      debounceMs: config.debounceMs ?? 500,
    };
    this.onEvent = onEvent;
  }

  /**
   * Start watching the configured directory.
   */
  start(): void {
    const watchPath = this.config.watchDir;

    if (!fs.existsSync(watchPath)) {
      log('warn', `Watch directory does not exist: ${watchPath}. Creating it.`);
      fs.mkdirSync(watchPath, { recursive: true });
    }

    this.watcher = chokidar.watch(watchPath, {
      persistent: true,
      ignoreInitial: true,
      followSymlinks: false,
      depth: 5,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    this.watcher.on('add', (filePath) => this.handleChange(filePath, 'add'));
    this.watcher.on('change', (filePath) => this.handleChange(filePath, 'change'));

    this.watcher.on('error', (error) => {
      log('error', `File watcher error: ${error.message}`);
    });

    log('info', `File watcher started on ${watchPath}`);
  }

  /**
   * Stop watching and clean up.
   */
  stop(): void {
    // Clear all pending debounce timers
    for (const timer of this.pendingChanges.values()) {
      clearTimeout(timer);
    }
    this.pendingChanges.clear();

    if (this.watcher) {
      this.watcher.close().catch((err) => {
        log('error', `Error closing file watcher: ${err.message}`);
      });
      this.watcher = null;
    }

    log('info', 'File watcher stopped');
  }

  /**
   * Handle a file change with debouncing.
   */
  private handleChange(filePath: string, changeType: 'add' | 'change'): void {
    // Clear existing debounce timer for this file
    const existingTimer = this.pendingChanges.get(filePath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new debounced handler
    const timer = setTimeout(() => {
      this.pendingChanges.delete(filePath);
      this.processFile(filePath, changeType);
    }, this.config.debounceMs);

    this.pendingChanges.set(filePath, timer);
  }

  /**
   * Process a file change: read, parse, and emit events.
   */
  private processFile(filePath: string, changeType: 'add' | 'change'): void {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileName = path.basename(filePath).toUpperCase();
      const relativePath = path.relative(this.config.watchDir, filePath);

      // Route to appropriate parser
      if (fileName === 'KANBAN.MD') {
        this.handleKanban(content, relativePath);
      } else if (fileName === 'COMMIT_LOG.MD') {
        this.handleCommitLog(content, relativePath);
      } else if (fileName === 'MILESTONES.MD') {
        this.handleMilestones(content, relativePath);
      } else if (fileName === 'COST_ESTIMATION.MD') {
        this.handleCostEstimation(content, relativePath);
      } else if (relativePath.toLowerCase().includes('evidence')) {
        this.handleEvidence(filePath, relativePath, changeType);
      } else {
        // Generic file change event
        this.emitEvent(EventCategory.SYSTEM, 'file_change', 'info', {
          file: relativePath,
          action: changeType,
          size: content.length,
        });
      }

      log('info', `Processed file: ${relativePath} (${changeType})`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to process file ${filePath}: ${message}`);
    }
  }

  /**
   * Handle KANBAN.md changes.
   */
  private handleKanban(content: string, relativePath: string): void {
    const cards = parseKanban(content);
    this.emitEvent(EventCategory.PLANNING, 'kanban_update', 'info', {
      file: relativePath,
      cards,
      totalCards: cards.length,
      byStatus: groupBy(cards, 'status'),
      byAgent: groupBy(cards, 'agent'),
    });
  }

  /**
   * Handle COMMIT_LOG.md changes.
   */
  private handleCommitLog(content: string, relativePath: string): void {
    const commits = parseCommitLog(content);
    this.emitEvent(EventCategory.GIT, 'commit_log_update', 'info', {
      file: relativePath,
      commits,
      totalCommits: commits.length,
      byAgent: groupBy(commits, 'agent'),
      byType: groupBy(commits, 'type'),
    });
  }

  /**
   * Handle MILESTONES.md changes.
   */
  private handleMilestones(content: string, relativePath: string): void {
    const milestones = parseMilestones(content);
    this.emitEvent(EventCategory.PLANNING, 'milestones_update', 'info', {
      file: relativePath,
      milestones,
      totalMilestones: milestones.length,
      byStatus: groupBy(milestones, 'status'),
    });
  }

  /**
   * Handle COST_ESTIMATION.md changes.
   */
  private handleCostEstimation(content: string, relativePath: string): void {
    const estimation = parseCostEstimation(content);
    this.emitEvent(EventCategory.COST, 'cost_update', 'info', {
      file: relativePath,
      budget: estimation.budget,
      waveCosts: estimation.waveCosts,
    });
  }

  /**
   * Handle evidence file changes.
   */
  private handleEvidence(
    filePath: string,
    relativePath: string,
    changeType: 'add' | 'change'
  ): void {
    const stat = fs.statSync(filePath);
    this.emitEvent(EventCategory.EVIDENCE, 'evidence_' + changeType, 'info', {
      file: relativePath,
      size: stat.size,
      extension: path.extname(filePath).toLowerCase(),
    });
  }

  /**
   * Create and emit a MissionControlEvent.
   */
  private emitEvent(
    category: EventCategory,
    type: string,
    severity: 'info' | 'warn' | 'error' | 'critical',
    payload: Record<string, unknown>
  ): void {
    const event: MissionControlEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      sessionId: this.config.sessionId,
      source: {
        tool: 'file-watcher',
        adapter: 'chokidar',
        version: '1.0.0',
      },
      category,
      type,
      severity,
      payload,
    };

    this.onEvent(event);
  }
}

/**
 * Group an array of objects by a string key.
 */
function groupBy<T extends Record<string, unknown>>(
  items: T[],
  key: string
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of items) {
    const value = String(item[key] || 'unknown');
    result[value] = (result[value] || 0) + 1;
  }
  return result;
}
