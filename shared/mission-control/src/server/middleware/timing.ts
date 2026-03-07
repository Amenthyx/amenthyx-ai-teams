import { Request, Response, NextFunction } from 'express';

/**
 * Circular buffer entry for a single request timing record.
 */
interface TimingEntry {
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  timestamp: string;
}

const BUFFER_SIZE = 1000;
const buffer: TimingEntry[] = [];
let writeIndex = 0;
let totalRequests = 0;

/**
 * Express middleware that records request timing into a circular buffer.
 */
export function timingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    const entry: TimingEntry = {
      method: req.method,
      path: req.originalUrl || req.path,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      timestamp: new Date().toISOString(),
    };

    if (buffer.length < BUFFER_SIZE) {
      buffer.push(entry);
    } else {
      buffer[writeIndex] = entry;
    }
    writeIndex = (writeIndex + 1) % BUFFER_SIZE;
    totalRequests++;
  });

  next();
}

/**
 * Compute a specific percentile from a sorted array of numbers.
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Metrics summary from recorded timings.
 */
export interface MetricsSummary {
  totalRequests: number;
  bufferedRequests: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
  timeline: Array<{
    timestamp: string;
    durationMs: number;
    path: string;
    statusCode: number;
  }>;
}

/**
 * Returns aggregated metrics from the circular buffer.
 * Optionally filter to entries within the last `windowMs` milliseconds.
 */
export function getMetrics(windowMs?: number): MetricsSummary {
  const now = Date.now();
  const cutoff = windowMs ? now - windowMs : 0;

  const entries = buffer.filter((e) => {
    if (!e) return false;
    if (!windowMs) return true;
    return new Date(e.timestamp).getTime() >= cutoff;
  });

  if (entries.length === 0) {
    return {
      totalRequests,
      bufferedRequests: 0,
      avg: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      min: 0,
      max: 0,
      timeline: [],
    };
  }

  const durations = entries.map((e) => e.durationMs).sort((a, b) => a - b);
  const sum = durations.reduce((acc, d) => acc + d, 0);

  return {
    totalRequests,
    bufferedRequests: entries.length,
    avg: Math.round((sum / durations.length) * 100) / 100,
    p50: percentile(durations, 50),
    p95: percentile(durations, 95),
    p99: percentile(durations, 99),
    min: durations[0],
    max: durations[durations.length - 1],
    timeline: entries
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      .map((e) => ({
        timestamp: e.timestamp,
        durationMs: e.durationMs,
        path: e.path,
        statusCode: e.statusCode,
      })),
  };
}
