import type { Request, Response, NextFunction } from 'express';

interface TimingEntry {
  path: string;
  method: string;
  status: number;
  duration: number;
  timestamp: string;
}

const MAX_ENTRIES = 1000;
const timings: TimingEntry[] = [];

export function responseTimerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const entry: TimingEntry = {
      path: req.path,
      method: req.method,
      status: res.statusCode,
      duration: Date.now() - start,
      timestamp: new Date().toISOString(),
    };
    timings.push(entry);
    if (timings.length > MAX_ENTRIES) timings.shift();
  });

  next();
}

export function getTimingMetrics(): {
  avg: number;
  p50: number;
  p95: number;
  p99: number;
  count: number;
  recent: TimingEntry[];
} {
  if (timings.length === 0) {
    return { avg: 0, p50: 0, p95: 0, p99: 0, count: 0, recent: [] };
  }

  const durations = timings.map((t) => t.duration).sort((a, b) => a - b);
  const sum = durations.reduce((a, b) => a + b, 0);

  return {
    avg: Math.round(sum / durations.length),
    p50: durations[Math.floor(durations.length * 0.5)],
    p95: durations[Math.floor(durations.length * 0.95)],
    p99: durations[Math.floor(durations.length * 0.99)],
    count: durations.length,
    recent: timings.slice(-20),
  };
}
