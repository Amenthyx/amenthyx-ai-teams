import type { Request, Response, NextFunction } from 'express';

interface RateEntry {
  endpoint: string;
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60000; // 1 minute
const rates = new Map<string, RateEntry>();
let totalRequests = 0;
let throttledCount = 0;

export function rateTrackerMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const endpoint = `${req.method} ${req.path}`;
  const now = Date.now();
  totalRequests++;

  const existing = rates.get(endpoint);
  if (existing && now - existing.windowStart < WINDOW_MS) {
    existing.count++;
  } else {
    rates.set(endpoint, { endpoint, count: 1, windowStart: now });
  }

  next();
}

export function getRateStats(): {
  requestsPerMinute: number;
  throttledCount: number;
  topEndpoints: Array<{ endpoint: string; count: number }>;
  totalRequests: number;
} {
  const now = Date.now();
  const topEndpoints: Array<{ endpoint: string; count: number }> = [];

  for (const [, entry] of rates) {
    if (now - entry.windowStart < WINDOW_MS) {
      topEndpoints.push({ endpoint: entry.endpoint, count: entry.count });
    }
  }

  topEndpoints.sort((a, b) => b.count - a.count);

  return {
    requestsPerMinute: topEndpoints.reduce((sum, e) => sum + e.count, 0),
    throttledCount,
    topEndpoints: topEndpoints.slice(0, 10),
    totalRequests,
  };
}
