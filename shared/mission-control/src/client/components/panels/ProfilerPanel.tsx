import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Clock, Activity } from 'lucide-react';

interface ProfileData {
  cpu: { user: number; system: number; percent: number };
  memory: { rss: number; heapUsed: number; heapTotal: number; external: number };
  uptime: number;
  latencyHistogram: { bucket: string; count: number }[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function ProfilerPanel() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/debug/profile');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
    const interval = setInterval(fetchProfile, 5000);
    return () => clearInterval(interval);
  }, []);

  const maxHistCount =
    profile?.latencyHistogram?.reduce((max, b) => Math.max(max, b.count), 0) || 1;

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={16} className="text-cyan-400" />
        <h3 className="text-sm font-semibold dark:text-white text-gray-900">
          Server Profiler
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
        </div>
      ) : !profile ? (
        <div className="text-xs dark:text-gray-500 text-gray-400 text-center py-6">
          Profiler data unavailable
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-lg dark:bg-gray-900/50 bg-gray-50">
              <div className="flex items-center gap-1.5 mb-1">
                <Cpu size={12} className="text-cyan-400" />
                <span className="text-xs dark:text-gray-500 text-gray-400">CPU</span>
              </div>
              <p className="text-lg font-bold font-mono dark:text-white text-gray-900">
                {profile.cpu.percent.toFixed(1)}%
              </p>
              <p className="text-xs dark:text-gray-500 text-gray-400">
                usr {profile.cpu.user.toFixed(0)}ms / sys {profile.cpu.system.toFixed(0)}ms
              </p>
            </div>

            <div className="p-2 rounded-lg dark:bg-gray-900/50 bg-gray-50">
              <div className="flex items-center gap-1.5 mb-1">
                <HardDrive size={12} className="text-green-400" />
                <span className="text-xs dark:text-gray-500 text-gray-400">Memory</span>
              </div>
              <p className="text-lg font-bold font-mono dark:text-white text-gray-900">
                {formatBytes(profile.memory.heapUsed)}
              </p>
              <p className="text-xs dark:text-gray-500 text-gray-400">
                of {formatBytes(profile.memory.heapTotal)} heap
              </p>
            </div>

            <div className="p-2 rounded-lg dark:bg-gray-900/50 bg-gray-50">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={12} className="text-yellow-400" />
                <span className="text-xs dark:text-gray-500 text-gray-400">Uptime</span>
              </div>
              <p className="text-lg font-bold font-mono dark:text-white text-gray-900">
                {formatUptime(profile.uptime)}
              </p>
            </div>

            <div className="p-2 rounded-lg dark:bg-gray-900/50 bg-gray-50">
              <div className="flex items-center gap-1.5 mb-1">
                <HardDrive size={12} className="text-purple-400" />
                <span className="text-xs dark:text-gray-500 text-gray-400">RSS</span>
              </div>
              <p className="text-lg font-bold font-mono dark:text-white text-gray-900">
                {formatBytes(profile.memory.rss)}
              </p>
            </div>
          </div>

          {/* Latency histogram */}
          {profile.latencyHistogram && profile.latencyHistogram.length > 0 && (
            <div className="border-t dark:border-gray-700 border-gray-200 pt-3">
              <p className="text-xs dark:text-gray-500 text-gray-400 mb-2">
                Request Latency Distribution
              </p>
              <div className="space-y-1">
                {profile.latencyHistogram.map((bucket) => (
                  <div key={bucket.bucket} className="flex items-center gap-2 text-xs">
                    <span className="w-16 text-right dark:text-gray-400 text-gray-500 font-mono flex-shrink-0">
                      {bucket.bucket}
                    </span>
                    <div className="flex-1 h-4 dark:bg-gray-900/50 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-cyan-500/60 rounded transition-all"
                        style={{
                          width: `${(bucket.count / maxHistCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right dark:text-gray-500 text-gray-400 font-mono flex-shrink-0">
                      {bucket.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
