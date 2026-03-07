import React from 'react';
import { Sun, Moon, Wifi, WifiOff, Bell, Minimize2, Maximize2 } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useGateStore } from '../../stores/gateStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { ConnectionBanner } from '../common/ConnectionBanner';

interface HeaderProps {
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  reconnectCount: number;
}

export const Header: React.FC<HeaderProps> = ({ connectionStatus, reconnectCount }) => {
  const { theme, toggleTheme } = useThemeStore();
  const pendingCount = useGateStore((s) => s.pendingGates.length);
  const openDialog = useGateStore((s) => s.openDialog);
  const { compactMode, setCompactMode } = useSettingsStore();

  return (
    <>
      <ConnectionBanner status={connectionStatus} reconnectCount={reconnectCount} />
      <header className="h-14 flex items-center justify-between px-4 border-b dark:border-gray-700 border-gray-200 dark:bg-gray-900 bg-white shrink-0" role="banner">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h1 className="text-lg font-bold tracking-wide dark:text-white text-gray-900 hidden sm:block">
            AMENTHYX MISSION CONTROL
          </h1>
          <h1 className="text-lg font-bold tracking-wide dark:text-white text-gray-900 sm:hidden">
            MC
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Ctrl+K hint */}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded dark:bg-gray-800 dark:text-gray-500 bg-gray-100 text-gray-400 border dark:border-gray-700 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
            Ctrl+K
          </kbd>

          {/* Connection status */}
          <div className="flex items-center gap-2 text-sm">
            {connectionStatus === 'connected' ? (
              <>
                <Wifi size={16} className="text-green-500" />
                <span className="text-green-500 font-medium hidden sm:inline">Connected</span>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <Wifi size={16} className="text-yellow-500 animate-pulse" />
                <span className="text-yellow-500 font-medium hidden sm:inline">Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-red-500" />
                <span className="text-red-500 font-medium hidden sm:inline">
                  Disconnected{reconnectCount > 0 ? ` (${reconnectCount})` : ''}
                </span>
              </>
            )}
          </div>

          {/* Gate notifications */}
          <button
            onClick={openDialog}
            className="relative p-2 rounded-lg transition-colors duration-200 dark:hover:bg-gray-700 hover:bg-gray-100"
            title={pendingCount > 0 ? `${pendingCount} pending approval${pendingCount > 1 ? 's' : ''}` : 'No pending approvals'}
            aria-label={`Approvals: ${pendingCount} pending`}
          >
            <Bell size={18} className={pendingCount > 0 ? 'text-amber-400' : 'dark:text-gray-400 text-gray-500'} />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full px-1 animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          {/* Compact mode toggle */}
          <button
            onClick={() => setCompactMode(!compactMode)}
            className="p-2 rounded-lg transition-colors duration-200 dark:hover:bg-gray-700 hover:bg-gray-100"
            title={compactMode ? 'Expand view' : 'Compact view'}
            aria-label={compactMode ? 'Switch to expanded view' : 'Switch to compact view'}
          >
            {compactMode ? (
              <Maximize2 size={18} className="dark:text-gray-400 text-gray-500" />
            ) : (
              <Minimize2 size={18} className="dark:text-gray-400 text-gray-500" />
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors duration-200 dark:hover:bg-gray-700 hover:bg-gray-100"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-600" />
            )}
          </button>
        </div>
      </header>
    </>
  );
};
