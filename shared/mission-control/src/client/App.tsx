import React, { Suspense, lazy, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useWebSocket } from './hooks/useWebSocket';
import { Header } from './components/layout/Header';
import { DashboardShell } from './components/layout/DashboardShell';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/Toast';
import { CommandPalette } from './components/common/CommandPalette';
import { ShortcutsHelpModal } from './components/common/ShortcutsHelpModal';
import { PageSkeleton } from './components/common/PageSkeleton';
import { useCommandPalette, type Command } from './hooks/useCommandPalette';
import { useKeyboardShortcuts, useShortcutsHelp } from './hooks/useKeyboardShortcuts';
import { ApprovalDialog } from './components/ApprovalDialog';

// Lazy-loaded pages
const OverviewPage = lazy(() => import('./pages/OverviewPage').then((m) => ({ default: m.OverviewPage })));
const KanbanPage = lazy(() => import('./pages/KanbanPage').then((m) => ({ default: m.KanbanPage })));
const GitPage = lazy(() => import('./pages/GitPage').then((m) => ({ default: m.GitPage })));
const TestsPage = lazy(() => import('./pages/TestsPage').then((m) => ({ default: m.TestsPage })));
const EventsPage = lazy(() => import('./pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const SecretsPage = lazy(() => import('./pages/SecretsPage').then((m) => ({ default: m.SecretsPage })));
const UATPage = lazy(() => import('./pages/UATPage').then((m) => ({ default: m.UATPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const ScreenshotsPage = lazy(() => import('./pages/ScreenshotsPage').then((m) => ({ default: m.ScreenshotsPage })));
const DecisionsPage = lazy(() => import('./pages/DecisionsPage').then((m) => ({ default: m.DecisionsPage })));
const InterviewPage = lazy(() => import('./pages/InterviewPage').then((m) => ({ default: m.InterviewPage })));
const AgentDetailPage = lazy(() => import('./pages/AgentDetailPage').then((m) => ({ default: m.AgentDetailPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const CICDPage = lazy(() => import('./pages/CICDPage').then((m) => ({ default: m.CICDPage })));
const EvidencePage = lazy(() => import('./pages/EvidencePage').then((m) => ({ default: m.EvidencePage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const DependencyGraphPage = lazy(() => import('./pages/DependencyGraphPage').then((m) => ({ default: m.DependencyGraphPage })));
const ReplayPage = lazy(() => import('./pages/ReplayPage').then((m) => ({ default: m.ReplayPage })));
const WidgetBuilderPage = lazy(() => import('./pages/WidgetBuilderPage').then((m) => ({ default: m.WidgetBuilderPage })));
const AgentConsolePage = lazy(() => import('./pages/AgentConsolePage').then((m) => ({ default: m.AgentConsolePage })));

const App: React.FC = () => {
  const { status, reconnectCount } = useWebSocket();
  const navigate = useNavigate();
  const shortcutsHelp = useShortcutsHelp();

  const commands = useMemo<Command[]>(() => [
    { id: 'nav-overview', label: 'Go to Overview', category: 'Navigation', shortcut: 'G O', action: () => navigate('/') },
    { id: 'nav-kanban', label: 'Go to Kanban', category: 'Navigation', shortcut: 'G K', action: () => navigate('/kanban') },
    { id: 'nav-git', label: 'Go to Git', category: 'Navigation', shortcut: 'G G', action: () => navigate('/git') },
    { id: 'nav-tests', label: 'Go to Tests', category: 'Navigation', shortcut: 'G T', action: () => navigate('/tests') },
    { id: 'nav-events', label: 'Go to Events', category: 'Navigation', shortcut: 'G E', action: () => navigate('/events') },
    { id: 'nav-reports', label: 'Go to Reports', category: 'Navigation', action: () => navigate('/reports') },
    { id: 'nav-screenshots', label: 'Go to Screenshots', category: 'Navigation', action: () => navigate('/screenshots') },
    { id: 'nav-decisions', label: 'Go to Decisions', category: 'Navigation', action: () => navigate('/decisions') },
    { id: 'nav-interview', label: 'Go to Interview', category: 'Navigation', action: () => navigate('/interview') },
    { id: 'nav-cicd', label: 'Go to CI/CD', category: 'Navigation', action: () => navigate('/cicd') },
    { id: 'nav-evidence', label: 'Go to Evidence', category: 'Navigation', action: () => navigate('/evidence') },
    { id: 'nav-analytics', label: 'Go to Analytics', category: 'Navigation', action: () => navigate('/analytics') },
    { id: 'nav-settings', label: 'Go to Settings', category: 'Navigation', shortcut: 'G S', action: () => navigate('/settings') },
    { id: 'nav-dependencies', label: 'Go to Dependencies', category: 'Navigation', action: () => navigate('/dependencies') },
    { id: 'nav-console', label: 'Go to Agent Console', category: 'Navigation', action: () => navigate('/console') },
    { id: 'help-shortcuts', label: 'Show Keyboard Shortcuts', category: 'Help', shortcut: '?', action: shortcutsHelp.open },
  ], [navigate, shortcutsHelp.open]);

  const palette = useCommandPalette(commands);

  useKeyboardShortcuts([
    { key: 'k', ctrl: true, description: 'Open command palette', action: palette.open },
    { key: '?', description: 'Show shortcuts help', action: shortcutsHelp.toggle },
  ]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen dark:bg-gray-900 bg-gray-50">
        <Header connectionStatus={status} reconnectCount={reconnectCount} />
        <ApprovalDialog />
        <Suspense fallback={<div className="flex-1 p-4"><PageSkeleton /></div>}>
          <Routes>
            <Route element={<DashboardShell />}>
              <Route index element={<OverviewPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/git" element={<GitPage />} />
              <Route path="/tests" element={<TestsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/secrets" element={<SecretsPage />} />
              <Route path="/uat" element={<UATPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/screenshots" element={<ScreenshotsPage />} />
              <Route path="/decisions" element={<DecisionsPage />} />
              <Route path="/interview" element={<InterviewPage />} />
              <Route path="/agents/:role" element={<AgentDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/cicd" element={<CICDPage />} />
              <Route path="/evidence" element={<EvidencePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/dependencies" element={<DependencyGraphPage />} />
              <Route path="/replay" element={<ReplayPage />} />
              <Route path="/widgets" element={<WidgetBuilderPage />} />
              <Route path="/console" element={<AgentConsolePage />} />
            </Route>
          </Routes>
        </Suspense>
        <CommandPalette
          isOpen={palette.isOpen}
          query={palette.query}
          onQueryChange={palette.setQuery}
          commands={palette.filtered}
          onExecute={palette.execute}
          onClose={palette.close}
        />
        <ShortcutsHelpModal isOpen={shortcutsHelp.isOpen} onClose={shortcutsHelp.close} />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
