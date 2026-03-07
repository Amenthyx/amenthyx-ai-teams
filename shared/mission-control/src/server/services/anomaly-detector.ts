export interface CostDataPoint {
  agent: string;
  amount: number;
  timestamp: string;
}

export interface Anomaly {
  agent: string;
  amount: number;
  zScore: number;
  timestamp: string;
  severity: 'warning' | 'critical';
}

export function detectAnomalies(data: CostDataPoint[], threshold = 2.0): Anomaly[] {
  if (data.length < 3) return [];

  const amounts = data.map((d) => d.amount);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const stdDev = Math.sqrt(amounts.reduce((sum, x) => sum + (x - mean) ** 2, 0) / amounts.length);

  if (stdDev === 0) return [];

  return data
    .map((d) => {
      const zScore = Math.abs((d.amount - mean) / stdDev);
      if (zScore >= threshold) {
        return {
          agent: d.agent,
          amount: d.amount,
          zScore: Math.round(zScore * 100) / 100,
          timestamp: d.timestamp,
          severity: zScore >= 3 ? 'critical' as const : 'warning' as const,
        };
      }
      return null;
    })
    .filter((a): a is Anomaly => a !== null);
}
