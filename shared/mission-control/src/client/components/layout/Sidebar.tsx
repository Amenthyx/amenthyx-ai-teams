import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  GitCommitHorizontal,
  TestTube,
  Radio,
  Shield,
  FileText,
  Image,
  GitBranch,
  MessageSquare,
  ClipboardCheck,
  Activity,
  BarChart3,
  Settings,
  Workflow,
  Award,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Blocks,
  Menu,
  X,
  TerminalSquare,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Overview', icon: <LayoutDashboard size={20} />, section: 'Core' },
  { path: '/kanban', label: 'Kanban', icon: <Kanban size={20} />, section: 'Core' },
  { path: '/git', label: 'Git', icon: <GitCommitHorizontal size={20} />, section: 'Core' },
  { path: '/tests', label: 'Tests', icon: <TestTube size={20} />, section: 'Core' },
  { path: '/events', label: 'Events', icon: <Radio size={20} />, section: 'Core' },
  { path: '/secrets', label: 'Secrets', icon: <Shield size={20} />, section: 'Core' },
  { path: '/uat', label: 'UAT', icon: <ClipboardCheck size={20} />, section: 'Core' },
  { path: '/reports', label: 'Reports', icon: <FileText size={20} />, section: 'Insights' },
  { path: '/screenshots', label: 'Screenshots', icon: <Image size={20} />, section: 'Insights' },
  { path: '/decisions', label: 'Decisions', icon: <MessageSquare size={20} />, section: 'Insights' },
  { path: '/interview', label: 'Interview', icon: <ClipboardCheck size={20} />, section: 'Insights' },
  { path: '/cicd', label: 'CI/CD', icon: <Workflow size={20} />, section: 'Infrastructure' },
  { path: '/evidence', label: 'Evidence', icon: <Award size={20} />, section: 'Infrastructure' },
  { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} />, section: 'Analytics' },
  { path: '/dependencies', label: 'Dependencies', icon: <GitBranch size={20} />, section: 'Analytics' },
  { path: '/replay', label: 'Replay', icon: <PlayCircle size={20} />, section: 'Analytics' },
  { path: '/widgets', label: 'Widgets', icon: <Blocks size={20} />, section: 'Analytics' },
  { path: '/console', label: 'Console', icon: <TerminalSquare size={20} />, section: 'System' },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} />, section: 'System' },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = [...new Set(navItems.map((i) => i.section))];

  const navContent = (
    <>
      <nav className="flex-1 py-2 overflow-y-auto">
        {sections.map((section) => (
          <div key={section} className="mb-1">
            {!collapsed && (
              <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider dark:text-gray-500 text-gray-400">
                {section}
              </div>
            )}
            {navItems
              .filter((i) => i.section === section)
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'dark:bg-blue-600/20 dark:text-blue-400 bg-blue-50 text-blue-600'
                        : 'dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center justify-center p-3 border-t dark:border-gray-700 border-gray-200 dark:text-gray-500 dark:hover:text-gray-300 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-40 p-2 rounded-lg dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200 shadow-lg"
        aria-label="Open navigation"
      >
        <Menu size={20} className="dark:text-gray-300 text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 flex flex-col dark:bg-gray-900 bg-white shadow-xl z-10">
            <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 border-gray-200">
              <span className="text-sm font-semibold dark:text-white text-gray-900">Navigation</span>
              <button onClick={() => setMobileOpen(false)} className="p-1">
                <X size={18} className="dark:text-gray-400 text-gray-500" />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r dark:border-gray-700 border-gray-200 dark:bg-gray-900 bg-white transition-all duration-200 shrink-0 ${
          collapsed ? 'w-16' : 'w-52'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {navContent}
      </aside>
    </>
  );
};
