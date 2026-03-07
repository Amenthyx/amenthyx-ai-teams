import { create } from 'zustand';

interface SettingsState {
  soundEnabled: boolean;
  compactMode: boolean;
  notificationsEnabled: boolean;
  autoReconnect: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setCompactMode: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAutoReconnect: (enabled: boolean) => void;
}

function loadSetting<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(`mc-settings-${key}`);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function saveSetting<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`mc-settings-${key}`, JSON.stringify(value));
}

export const useSettingsStore = create<SettingsState>((set) => ({
  soundEnabled: loadSetting('soundEnabled', true),
  compactMode: loadSetting('compactMode', false),
  notificationsEnabled: loadSetting('notificationsEnabled', true),
  autoReconnect: loadSetting('autoReconnect', true),

  setSoundEnabled: (enabled: boolean) => {
    saveSetting('soundEnabled', enabled);
    set({ soundEnabled: enabled });
  },

  setCompactMode: (enabled: boolean) => {
    saveSetting('compactMode', enabled);
    set({ compactMode: enabled });
  },

  setNotificationsEnabled: (enabled: boolean) => {
    saveSetting('notificationsEnabled', enabled);
    set({ notificationsEnabled: enabled });
  },

  setAutoReconnect: (enabled: boolean) => {
    saveSetting('autoReconnect', enabled);
    set({ autoReconnect: enabled });
  },
}));
