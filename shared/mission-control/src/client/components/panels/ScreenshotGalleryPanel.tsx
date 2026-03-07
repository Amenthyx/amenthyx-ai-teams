import React, { useState } from 'react';
import { Image, User, Calendar } from 'lucide-react';
import { Lightbox } from '../common/Lightbox';

export interface Screenshot {
  id: string;
  src: string;
  thumbnail: string;
  agent: string;
  timestamp: string;
  testCase: string;
}

interface ScreenshotGalleryPanelProps {
  screenshots: Screenshot[];
  filterAgent?: string;
  filterDate?: string;
}

export const ScreenshotGalleryPanel: React.FC<ScreenshotGalleryPanelProps> = ({
  screenshots,
  filterAgent,
  filterDate,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = screenshots.filter((s) => {
    if (filterAgent && s.agent !== filterAgent) return false;
    if (filterDate && !s.timestamp.startsWith(filterDate)) return false;
    return true;
  });

  const lightboxImages = filtered.map((s) => ({ src: s.src, alt: s.testCase }));

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <h3 className="text-sm font-semibold dark:text-gray-200 text-gray-800 mb-3">
        Screenshots
      </h3>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Image size={32} className="dark:text-gray-600 text-gray-300 mb-2" />
          <p className="text-xs dark:text-gray-600 text-gray-400 italic">
            No screenshots available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((screenshot, index) => (
            <button
              key={screenshot.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-lg overflow-hidden border dark:border-gray-700 border-gray-200 dark:hover:border-gray-500 hover:border-gray-400 transition-colors"
            >
              <div className="aspect-video bg-gray-900">
                <img
                  src={screenshot.thumbnail}
                  alt={screenshot.testCase}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
              </div>
              <div className="p-2 space-y-1">
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 truncate">
                  {screenshot.testCase}
                </p>
                <div className="flex items-center gap-2 text-[10px] dark:text-gray-500 text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <User size={10} />
                    {screenshot.agent}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Calendar size={10} />
                    {new Date(screenshot.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev !== null ? (prev - 1 + filtered.length) % filtered.length : 0
            )
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null ? (prev + 1) % filtered.length : 0
            )
          }
        />
      )}
    </div>
  );
};
