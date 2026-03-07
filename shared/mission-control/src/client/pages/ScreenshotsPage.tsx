import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  ScreenshotGalleryPanel,
  Screenshot,
} from '../components/panels/ScreenshotGalleryPanel';
import { ALL_AGENT_ROLES } from '../types/events';

export const ScreenshotsPage: React.FC = () => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAgent, setFilterAgent] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchScreenshots = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/screenshots');
        if (!response.ok) {
          throw new Error(`Failed to fetch screenshots: ${response.statusText}`);
        }
        const data: Screenshot[] = await response.json();
        setScreenshots(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load screenshots');
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshots();
  }, []);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
        <h3 className="text-sm font-semibold dark:text-gray-200 text-gray-800 mb-3">
          Filters
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs dark:text-gray-400 text-gray-500">Agent</label>
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Agents</option>
              {ALL_AGENT_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs dark:text-gray-400 text-gray-500">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm dark:bg-gray-700 bg-gray-50 border dark:border-gray-600 border-gray-300 dark:text-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin dark:text-gray-400 text-gray-500" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : (
        <ScreenshotGalleryPanel
          screenshots={screenshots}
          filterAgent={filterAgent || undefined}
          filterDate={filterDate || undefined}
        />
      )}
    </div>
  );
};
