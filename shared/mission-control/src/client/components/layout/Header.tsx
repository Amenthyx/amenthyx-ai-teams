import React from 'react';
import { Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface HeaderProps {
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  reconnectCount: number;
}

export const Header: React.FC<HeaderProps> = ({ connectionStatus, reconnectCount }) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b dark:border-gray-700 border-gray-200 dark:bg-gray-900 bg-white shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <h1 className="text-lg font-bold tracking-wide dark:text-white text-gray-900">
          AMENTHYX MISSION CONTROL
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="flex items-center gap-2 text-sm">
          {connectionStatus === 'connected' ? (
            <>
              <Wifi size={16} className="text-green-500" />
              <span className="text-green-500 font-medium">Connected</span>
            </>
          ) : connectionStatus === 'connecting' ? (
            <>
              <Wifi size={16} className="text-yellow-500 animate-pulse" />
              <span className="text-yellow-500 font-medium">Connecting...</span>
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-red-500" />
              <span className="text-red-500 font-medium">
                Disconnected{reconnectCount > 0 ? ` (retry ${reconnectCount})` : ''}
              </span>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors duration-200 dark:hover:bg-gray-700 hover:bg-gray-100"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-gray-600" />
          )}
        </button>
      </div>
    </header>
  );
};
