/**
 * Simple linear regression utility.
 * Fits a line y = slope * x + intercept to a set of (x, y) data points.
 */

export interface DataPoint {
  x: number;
  y: number;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
  predict: (x: number) => number;
}

/**
 * Compute a linear regression over the given data points.
 * Returns slope, intercept, R-squared, and a predict function.
 * If fewer than 2 points are provided, returns a flat line at y = 0.
 */
export function linearRegression(points: DataPoint[]): RegressionResult {
  const n = points.length;

  if (n < 2) {
    const yVal = n === 1 ? points[0].y : 0;
    return {
      slope: 0,
      intercept: yVal,
      r2: 0,
      predict: () => yVal,
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (const { x, y } of points) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }

  const denominator = n * sumXX - sumX * sumX;

  if (denominator === 0) {
    const meanY = sumY / n;
    return {
      slope: 0,
      intercept: meanY,
      r2: 0,
      predict: () => meanY,
    };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // R-squared
  const meanY = sumY / n;
  let ssRes = 0;
  let ssTot = 0;
  for (const { x, y } of points) {
    const predicted = slope * x + intercept;
    ssRes += (y - predicted) ** 2;
    ssTot += (y - meanY) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return {
    slope,
    intercept,
    r2,
    predict: (x: number) => slope * x + intercept,
  };
}
