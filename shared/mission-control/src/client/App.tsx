import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useWebSocket } from './hooks/useWebSocket';
import { Header } from './components/layout/Header';
import { DashboardShell } from './components/layout/DashboardShell';
import { OverviewPage } from './pages/OverviewPage';
import { KanbanPage } from './pages/KanbanPage';
import { GitPage } from './pages/GitPage';
import { TestsPage } from './pages/TestsPage';
import { EventsPage } from './pages/EventsPage';
import { SecretsPage } from './pages/SecretsPage';
import { UATPage } from './pages/UATPage';
import { ApprovalDialog } from './components/ApprovalDialog';

const App: React.FC = () => {
  const { status, reconnectCount } = useWebSocket();

  return (
    <div className="flex flex-col h-screen dark:bg-gray-900 bg-gray-50">
      <Header connectionStatus={status} reconnectCount={reconnectCount} />
      <ApprovalDialog />
      <Routes>
        <Route element={<DashboardShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/git" element={<GitPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/secrets" element={<SecretsPage />} />
          <Route path="/uat" element={<UATPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
