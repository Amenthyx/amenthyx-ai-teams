import React, { useEffect, useState } from 'react';
import { Database, HardDrive, Table, FileText } from 'lucide-react';

interface DbHealth {
  size: string;
  tableCount: number;
  walSize: string;
  tables: { name: string; rowCount: number }[];
  status: 'healthy' | 'warning' | 'error';
}

export function DatabaseHealthPanel() {
  const [health, setHealth] = useState<DbHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch('/api/health/db');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setHealth(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch database health');
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Database size={16} className="text-blue-400" />
        <h3 className="text-sm font-semibold dark:text-white text-gray-900">
          Database Health
        </h3>
        {health && (
          <span className={`ml-auto text-xs font-medium ${statusColor(health.status)}`}>
            {health.status?.toUpperCase()}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="text-xs text-red-400 py-4 text-center">{error}</div>
      ) : health ? (
        <div className="space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <HardDrive size={14} className="dark:text-gray-500 text-gray-400" />
              <div>
                <p className="text-xs dark:text-gray-500 text-gray-400">Size</p>
                <p className="text-sm font-mono dark:text-gray-200 text-gray-800">
                  {health.size}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Table size={14} className="dark:text-gray-500 text-gray-400" />
              <div>
                <p className="text-xs dark:text-gray-500 text-gray-400">Tables</p>
                <p className="text-sm font-mono dark:text-gray-200 text-gray-800">
                  {health.tableCount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={14} className="dark:text-gray-500 text-gray-400" />
              <div>
                <p className="text-xs dark:text-gray-500 text-gray-400">WAL</p>
                <p className="text-sm font-mono dark:text-gray-200 text-gray-800">
                  {health.walSize}
                </p>
              </div>
            </div>
          </div>

          {/* Table details */}
          {health.tables && health.tables.length > 0 && (
            <div className="border-t dark:border-gray-700 border-gray-200 pt-2">
              <p className="text-xs dark:text-gray-500 text-gray-400 mb-1">Table Rows</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {health.tables.map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="dark:text-gray-300 text-gray-700 font-mono truncate">
                      {t.name}
                    </span>
                    <span className="dark:text-gray-500 text-gray-400 font-mono">
                      {t.rowCount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
