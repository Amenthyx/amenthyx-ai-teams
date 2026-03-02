import { parseAllTables } from './markdown-table-parser';
import type { BudgetInfo } from '../../types/events';

/**
 * Represents per-wave cost breakdown.
 */
export interface WaveCost {
  wave: string;
  estimated: number;
  actual: number;
  status: string;
}

/**
 * Full parsed cost estimation result.
 */
export interface CostEstimation {
  budget: BudgetInfo;
  waveCosts: WaveCost[];
}

/**
 * Parse COST_ESTIMATION.md content into budget and per-wave cost data.
 *
 * Looks for:
 * 1. A budget summary section with total/spent/currency
 * 2. A per-wave cost table
 *
 * Supports various formats:
 * - Key-value lines like "Total Budget: $500.00"
 * - Table rows with wave cost breakdowns
 */
export function parseCostEstimation(markdown: string): CostEstimation {
  const budget: BudgetInfo = {
    total: 0,
    spent: 0,
    currency: 'USD',
    alertThreshold: 0.8,
  };

  const waveCosts: WaveCost[] = [];

  // Extract budget values from key-value patterns in the text
  const lines = markdown.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Match "Total Budget: $500.00" or "Total: 500"
    const totalMatch = trimmed.match(
      /(?:total\s*budget|total\s*cost|budget\s*total|total)\s*[:=]\s*\$?([\d,.]+)/i
    );
    if (totalMatch) {
      budget.total = parseNumber(totalMatch[1]);
    }

    // Match "Spent: $123.45" or "Current Spend: 123.45"
    const spentMatch = trimmed.match(
      /(?:spent|current\s*spend|actual\s*cost|used)\s*[:=]\s*\$?([\d,.]+)/i
    );
    if (spentMatch) {
      budget.spent = parseNumber(spentMatch[1]);
    }

    // Match "Currency: USD"
    const currencyMatch = trimmed.match(/(?:currency)\s*[:=]\s*([A-Z]{3})/i);
    if (currencyMatch) {
      budget.currency = currencyMatch[1].toUpperCase();
    }

    // Match "Alert Threshold: 0.8" or "Alert: 80%"
    const alertMatch = trimmed.match(
      /(?:alert\s*threshold|alert|warning)\s*[:=]\s*([\d.]+)(%)?/i
    );
    if (alertMatch) {
      let value = parseFloat(alertMatch[1]);
      if (alertMatch[2] === '%' || value > 1) {
        value = value / 100;
      }
      budget.alertThreshold = value;
    }

    // Match "Hard Cap: $600"
    const capMatch = trimmed.match(/(?:hard\s*cap|max\s*budget|cap)\s*[:=]\s*\$?([\d,.]+)/i);
    if (capMatch) {
      budget.hardCap = parseNumber(capMatch[1]);
    }
  }

  // Parse tables for per-wave costs
  const tables = parseAllTables(markdown);

  for (const table of tables) {
    // Look for tables with wave cost data
    const lowerHeaders = table.headers.map((h) => h.toLowerCase());
    const hasWaveColumn = lowerHeaders.some((h) =>
      /wave|phase|sprint/.test(h)
    );
    const hasCostColumn = lowerHeaders.some((h) =>
      /cost|estimate|budget|price|amount/.test(h)
    );

    if (hasWaveColumn && hasCostColumn) {
      for (const row of table.rows) {
        const waveCost: WaveCost = {
          wave: '',
          estimated: 0,
          actual: 0,
          status: '',
        };

        for (const [key, value] of Object.entries(row)) {
          const lowerKey = key.toLowerCase();
          if (/wave|phase|sprint/.test(lowerKey)) {
            waveCost.wave = value;
          } else if (/estimated|estimate|budget/.test(lowerKey)) {
            waveCost.estimated = parseNumber(value);
          } else if (/actual|spent|real/.test(lowerKey)) {
            waveCost.actual = parseNumber(value);
          } else if (/status|state/.test(lowerKey)) {
            waveCost.status = value;
          } else if (/cost|amount|price/.test(lowerKey)) {
            // Generic cost column - treat as estimated if no specific match
            waveCost.estimated = parseNumber(value);
          }
        }

        if (waveCost.wave) {
          waveCosts.push(waveCost);
        }
      }
    }
  }

  // If we have wave costs but no total, sum them
  if (budget.total === 0 && waveCosts.length > 0) {
    budget.total = waveCosts.reduce((sum, wc) => sum + wc.estimated, 0);
    budget.spent = waveCosts.reduce((sum, wc) => sum + wc.actual, 0);
  }

  return { budget, waveCosts };
}

/**
 * Parse a number string, handling commas and currency symbols.
 */
function parseNumber(value: string): number {
  const cleaned = value.replace(/[$,]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
