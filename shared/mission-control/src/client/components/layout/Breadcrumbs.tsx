import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '': 'Overview',
  kanban: 'Kanban',
  git: 'Git',
  tests: 'Tests',
  events: 'Events',
  secrets: 'Secrets',
  uat: 'UAT',
  reports: 'Reports',
  screenshots: 'Screenshots',
  decisions: 'Decisions',
  interview: 'Interview',
  agents: 'Agents',
  settings: 'Settings',
  cicd: 'CI/CD',
  evidence: 'Evidence',
  analytics: 'Analytics',
  dependencies: 'Dependencies',
  replay: 'Replay',
  widgets: 'Widget Builder',
  sessions: 'Sessions',
  artifacts: 'Artifacts',
  search: 'Search',
  budget: 'Budget',
  commits: 'Commits',
  dashboard: 'Dashboard',
  debug: 'Debug',
  interviews: 'Interviews',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 mb-4 text-xs" aria-label="Breadcrumb">
      <Link to="/" className="dark:text-gray-400 text-gray-500 hover:text-blue-500 transition-colors">
        <Home size={14} />
      </Link>
      {segments.map((segment, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const label = routeLabels[segment] || segment;
        const isLast = i === segments.length - 1;
        return (
          <React.Fragment key={path}>
            <ChevronRight size={12} className="dark:text-gray-600 text-gray-400" />
            {isLast ? (
              <span className="dark:text-gray-200 text-gray-800 font-medium">{label}</span>
            ) : (
              <Link to={path} className="dark:text-gray-400 text-gray-500 hover:text-blue-500 transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
