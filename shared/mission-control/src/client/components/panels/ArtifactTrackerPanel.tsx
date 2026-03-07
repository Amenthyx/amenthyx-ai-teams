import React from 'react';
import { useArtifactStore, Artifact } from '../../stores/artifactStore';
import { Package, FileCode, FileArchive } from 'lucide-react';

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'binary':
    case 'executable':
      return <Package size={14} className="text-blue-400" />;
    case 'archive':
    case 'zip':
      return <FileArchive size={14} className="text-yellow-400" />;
    default:
      return <FileCode size={14} className="text-green-400" />;
  }
}

export function ArtifactTrackerPanel() {
  const artifacts = useArtifactStore((s) => s.artifacts);

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Package size={16} className="text-green-400" />
        <h3 className="text-sm font-semibold dark:text-white text-gray-900">
          Build Artifacts
        </h3>
        <span className="ml-auto text-xs dark:text-gray-500 text-gray-400">
          {artifacts.length} artifact{artifacts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {artifacts.length === 0 ? (
        <div className="text-xs dark:text-gray-500 text-gray-400 text-center py-8">
          No artifacts tracked yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700 border-gray-200">
                <th className="text-left py-2 px-2 dark:text-gray-400 text-gray-500 font-medium">
                  Name
                </th>
                <th className="text-left py-2 px-2 dark:text-gray-400 text-gray-500 font-medium">
                  Type
                </th>
                <th className="text-right py-2 px-2 dark:text-gray-400 text-gray-500 font-medium">
                  Size
                </th>
                <th className="text-left py-2 px-2 dark:text-gray-400 text-gray-500 font-medium">
                  Producer
                </th>
                <th className="text-center py-2 px-2 dark:text-gray-400 text-gray-500 font-medium">
                  Wave
                </th>
              </tr>
            </thead>
            <tbody>
              {artifacts.map((artifact: Artifact) => (
                <tr
                  key={artifact.id}
                  className="border-b dark:border-gray-700/50 border-gray-100 hover:dark:bg-gray-700/30 hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(artifact.type)}
                      <span
                        className="dark:text-gray-200 text-gray-800 font-mono truncate max-w-[180px]"
                        title={artifact.name}
                      >
                        {artifact.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <span className="px-1.5 py-0.5 rounded dark:bg-gray-700 bg-gray-200 dark:text-gray-300 text-gray-600">
                      {artifact.type}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right dark:text-gray-300 text-gray-700 font-mono">
                    {formatSize(artifact.size)}
                  </td>
                  <td className="py-2 px-2 dark:text-gray-300 text-gray-700 truncate max-w-[120px]">
                    {artifact.producer_agent}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full dark:bg-blue-500/20 bg-blue-100 text-blue-400 font-bold">
                      {artifact.wave}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
