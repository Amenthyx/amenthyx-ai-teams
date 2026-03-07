import React from 'react';
import {
  Sun,
  Moon,
  Bell,
  Monitor,
  Wifi,
  WifiOff,
  Trash2,
  Download,
} from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useEventStore } from '../stores/eventStore';

function getWsUrl(): string {
  if (typeof window === 'undefined') return 'ws://localhost:4201/ws';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}/ws`;
}

interface ToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  label: string;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onToggle, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium dark:text-gray-200 text-gray-800">{label}</p>
      {description && (
        <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
    <button
      onClick={() => onToggle(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-blue-500' : 'dark:bg-gray-600 bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
  <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
    <div className="flex items-center gap-2 mb-4">
      <span className="dark:text-gray-400 text-gray-500">{icon}</span>
      <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
        {title}
      </h3>
    </div>
    <div className="divide-y dark:divide-gray-700 divide-gray-200">{children}</div>
  </div>
);

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const {
    soundEnabled,
    setSoundEnabled,
    compactMode,
    setCompactMode,
    notificationsEnabled,
    setNotificationsEnabled,
    autoReconnect,
    setAutoReconnect,
  } = useSettingsStore();
  const clearEvents = useEventStore((s) => s.clearEvents);
  const eventCount = useEventStore((s) => s.events.length);

  const handleExportData = () => {
    const data = {
      events: useEventStore.getState().events,
      exportedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mission-control-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wsUrl = getWsUrl();

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold dark:text-white text-gray-900">Settings</h2>

      {/* Theme */}
      <Section title="Theme" icon={theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium dark:text-gray-200 text-gray-800">Appearance</p>
            <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">
              Switch between dark and light mode
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg dark:bg-gray-700 bg-gray-100 p-0.5">
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-blue-500 text-white'
                  : 'dark:text-gray-400 text-gray-500 dark:hover:text-gray-200 hover:text-gray-700'
              }`}
            >
              <Moon size={12} />
              Dark
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                theme === 'light'
                  ? 'bg-blue-500 text-white'
                  : 'dark:text-gray-400 text-gray-500 dark:hover:text-gray-200 hover:text-gray-700'
              }`}
            >
              <Sun size={12} />
              Light
            </button>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={<Bell size={16} />}>
        <Toggle
          enabled={notificationsEnabled}
          onToggle={setNotificationsEnabled}
          label="Enable Notifications"
          description="Show desktop notifications for important events"
        />
        <Toggle
          enabled={soundEnabled}
          onToggle={setSoundEnabled}
          label="Sound Alerts"
          description="Play a sound when critical events occur"
        />
      </Section>

      {/* Display */}
      <Section title="Display" icon={<Monitor size={16} />}>
        <Toggle
          enabled={compactMode}
          onToggle={setCompactMode}
          label="Compact Mode"
          description="Reduce spacing and use smaller panels"
        />
      </Section>

      {/* WebSocket */}
      <Section
        title="WebSocket"
        icon={autoReconnect ? <Wifi size={16} /> : <WifiOff size={16} />}
      >
        <div className="py-3">
          <p className="text-sm font-medium dark:text-gray-200 text-gray-800">WebSocket URL</p>
          <p className="text-xs font-mono dark:text-gray-400 text-gray-500 mt-1 break-all">
            {wsUrl}
          </p>
        </div>
        <Toggle
          enabled={autoReconnect}
          onToggle={setAutoReconnect}
          label="Auto Reconnect"
          description="Automatically reconnect when the WebSocket connection drops"
        />
      </Section>

      {/* Data */}
      <Section title="Data" icon={<Trash2 size={16} />}>
        <div className="py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium dark:text-gray-200 text-gray-800">Clear Events</p>
              <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">
                Remove all {eventCount} cached events from memory
              </p>
            </div>
            <button
              onClick={clearEvents}
              disabled={eventCount === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
        </div>
        <div className="py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium dark:text-gray-200 text-gray-800">Export Data</p>
              <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">
                Download all events as a JSON file
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={eventCount === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Download size={12} />
              Export
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
};
