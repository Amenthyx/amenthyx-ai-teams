import React from 'react';
import { X } from 'lucide-react';

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'K'], description: 'Open command palette' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['G', 'O'], description: 'Go to Overview' },
  { keys: ['G', 'K'], description: 'Go to Kanban' },
  { keys: ['G', 'G'], description: 'Go to Git' },
  { keys: ['G', 'T'], description: 'Go to Tests' },
  { keys: ['G', 'E'], description: 'Go to Events' },
  { keys: ['G', 'S'], description: 'Go to Settings' },
  { keys: ['Esc'], description: 'Close modal / palette' },
];

export const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Keyboard Shortcuts"
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 border-gray-200">
          <h2 className="text-lg font-semibold dark:text-white text-gray-900">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="p-1 rounded-lg dark:hover:bg-gray-700 hover:bg-gray-100">
            <X size={18} className="dark:text-gray-400 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((s) => (
            <div key={s.description} className="flex items-center justify-between py-1.5">
              <span className="text-sm dark:text-gray-300 text-gray-700">{s.description}</span>
              <div className="flex gap-1">
                {s.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-0.5 text-xs font-mono rounded dark:bg-gray-700 dark:text-gray-300 bg-gray-100 text-gray-700 border dark:border-gray-600 border-gray-300"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
