import React, { useState, useEffect, useCallback } from 'react';
import { Paintbrush, Check, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

interface BrandingConfig {
  projectName: string;
  logoUrl: string;
  primaryColor: string;
}

const COLOR_PALETTE = [
  { name: 'Blue',    value: '#3B82F6' },
  { name: 'Green',   value: '#22C55E' },
  { name: 'Purple',  value: '#A855F7' },
  { name: 'Red',     value: '#EF4444' },
  { name: 'Orange',  value: '#F97316' },
  { name: 'Cyan',    value: '#06B6D4' },
  { name: 'Pink',    value: '#EC4899' },
  { name: 'Amber',   value: '#F59E0B' },
];

const STORAGE_KEY = 'mc-branding';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadBranding(): BrandingConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultBranding(), ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return defaultBranding();
}

function defaultBranding(): BrandingConfig {
  return {
    projectName: 'Mission Control',
    logoUrl: '',
    primaryColor: '#3B82F6',
  };
}

function saveBranding(config: BrandingConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function applyCSSProperties(config: BrandingConfig): void {
  const root = document.documentElement;
  root.style.setProperty('--mc-primary', config.primaryColor);
  root.style.setProperty('--mc-project-name', `"${config.projectName}"`);

  // Generate a lighter variant for hover states
  root.style.setProperty('--mc-primary-light', config.primaryColor + '33');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BrandingPanel() {
  const { theme, toggleTheme } = useThemeStore();

  const [config, setConfig] = useState<BrandingConfig>(loadBranding);
  const [saved, setSaved] = useState(false);

  // Apply CSS properties on mount and when config changes
  useEffect(() => {
    applyCSSProperties(config);
  }, [config]);

  const handleSave = useCallback(() => {
    saveBranding(config);
    applyCSSProperties(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [config]);

  const updateField = <K extends keyof BrandingConfig>(
    field: K,
    value: BrandingConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Paintbrush size={16} className="text-purple-400" />
        <h3 className="text-sm font-semibold dark:text-white text-gray-900">
          Dashboard Branding
        </h3>
      </div>

      {/* Project Name */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide dark:text-gray-500 text-gray-400 mb-1">
          Project Name
        </label>
        <input
          type="text"
          value={config.projectName}
          onChange={(e) => updateField('projectName', e.target.value)}
          placeholder="Mission Control"
          className="w-full px-2.5 py-1.5 rounded dark:bg-gray-800 bg-white border dark:border-gray-600 border-gray-300 text-xs dark:text-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Logo URL */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide dark:text-gray-500 text-gray-400 mb-1">
          Logo URL
        </label>
        <input
          type="url"
          value={config.logoUrl}
          onChange={(e) => updateField('logoUrl', e.target.value)}
          placeholder="https://example.com/logo.png"
          className="w-full px-2.5 py-1.5 rounded dark:bg-gray-800 bg-white border dark:border-gray-600 border-gray-300 text-xs dark:text-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Primary Color */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide dark:text-gray-500 text-gray-400 mb-1.5">
          Primary Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color.value}
              onClick={() => updateField('primaryColor', color.value)}
              className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
                config.primaryColor === color.value
                  ? 'border-white dark:border-white scale-110 shadow-lg'
                  : 'border-transparent dark:border-gray-700 hover:scale-105'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {config.primaryColor === color.value && (
                <Check size={14} className="text-white drop-shadow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide dark:text-gray-500 text-gray-400 mb-1.5">
          Theme
        </label>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-lg dark:bg-gray-900/50 bg-gray-100 border dark:border-gray-700 border-gray-200 transition-colors dark:hover:bg-gray-700 hover:bg-gray-200 w-full"
        >
          {theme === 'dark' ? (
            <>
              <Moon size={14} className="text-blue-400" />
              <span className="text-xs dark:text-gray-300 text-gray-700">Dark Mode</span>
              <span className="ml-auto text-[10px] dark:text-gray-500 text-gray-400">
                Click to switch to Light
              </span>
            </>
          ) : (
            <>
              <Sun size={14} className="text-yellow-500" />
              <span className="text-xs dark:text-gray-300 text-gray-700">Light Mode</span>
              <span className="ml-auto text-[10px] dark:text-gray-500 text-gray-400">
                Click to switch to Dark
              </span>
            </>
          )}
        </button>
      </div>

      {/* Preview */}
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-wide dark:text-gray-500 text-gray-400 mb-1.5">
          Preview
        </label>
        <div
          className="rounded-lg p-3 border dark:border-gray-700 border-gray-200"
          style={{ borderLeftColor: config.primaryColor, borderLeftWidth: '3px' }}
        >
          <div className="flex items-center gap-2">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt="Logo"
                className="w-6 h-6 rounded object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span
              className="text-sm font-bold"
              style={{ color: config.primaryColor }}
            >
              {config.projectName || 'Mission Control'}
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-medium text-white"
              style={{ backgroundColor: config.primaryColor }}
            >
              Active
            </span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-medium border"
              style={{ borderColor: config.primaryColor, color: config.primaryColor }}
            >
              Badge
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${
          saved
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-500'
        }`}
      >
        {saved ? 'Saved!' : 'Save Branding'}
      </button>
    </div>
  );
}
