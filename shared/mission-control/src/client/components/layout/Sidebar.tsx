import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  GitCommitHorizontal,
  TestTube,
  Radio,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { path: '/kanban', label: 'Kanban', icon: <Kanban size={20} /> },
  { path: '/git', label: 'Git', icon: <GitCommitHorizontal size={20} /> },
  { path: '/tests', label: 'Tests', icon: <TestTube size={20} /> },
  { path: '/events', label: 'Events', icon: <Radio size={20} /> },
  { path: '/secrets', label: 'Secrets', icon: <Shield size={20} /> },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r dark:border-gray-700 border-gray-200 dark:bg-gray-900 bg-white transition-all duration-200 shrink-0 ${
        collapsed ? 'w-16' : 'w-52'
      }`}
    >
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'dark:bg-blue-600/20 dark:text-blue-400 bg-blue-50 text-blue-600'
                  : 'dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 border-t dark:border-gray-700 border-gray-200 dark:text-gray-500 dark:hover:text-gray-300 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};
