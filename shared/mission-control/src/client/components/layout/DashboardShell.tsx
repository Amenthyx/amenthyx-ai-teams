import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AgentFilterBar } from '../panels/AgentFilterBar';

export const DashboardShell: React.FC = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AgentFilterBar />
        <main className="flex-1 overflow-y-auto p-4 dark:bg-gray-900 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
