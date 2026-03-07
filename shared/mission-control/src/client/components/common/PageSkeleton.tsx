import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg dark:bg-gray-800 bg-gray-200" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 rounded-xl dark:bg-gray-800 bg-gray-200" />
        <div className="h-64 rounded-xl dark:bg-gray-800 bg-gray-200" />
      </div>
      <div className="h-48 rounded-xl dark:bg-gray-800 bg-gray-200" />
    </div>
  );
};
