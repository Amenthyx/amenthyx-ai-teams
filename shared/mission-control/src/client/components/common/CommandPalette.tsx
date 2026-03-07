import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { Command } from '../../hooks/useCommandPalette';

interface CommandPaletteProps {
  isOpen: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  commands: Command[];
  onExecute: (cmd: Command) => void;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  query,
  onQueryChange,
  commands,
  onExecute,
  onClose,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, commands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (commands[selectedIndex]) onExecute(commands[selectedIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const grouped = commands.reduce<Record<string, Command[]>>((acc, cmd) => {
    (acc[cmd.category] = acc[cmd.category] || []).push(cmd);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Command Palette"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-gray-700 border-gray-200">
          <Search size={18} className="dark:text-gray-400 text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm dark:text-white text-gray-900 placeholder:dark:text-gray-500 placeholder:text-gray-400 outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded dark:bg-gray-700 dark:text-gray-400 bg-gray-100 text-gray-500 border dark:border-gray-600 border-gray-300">
            ESC
          </kbd>
        </div>

        <div className="max-h-[40vh] overflow-y-auto py-2">
          {commands.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm dark:text-gray-500 text-gray-400">
              No matching commands
            </div>
          ) : (
            Object.entries(grouped).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider dark:text-gray-500 text-gray-400">
                  {category}
                </div>
                {cmds.map((cmd) => {
                  flatIndex++;
                  const idx = flatIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => onExecute(cmd)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                        idx === selectedIndex
                          ? 'dark:bg-blue-600/20 dark:text-blue-300 bg-blue-50 text-blue-700'
                          : 'dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cmd.label}</span>
                      {cmd.shortcut && (
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded dark:bg-gray-700 dark:text-gray-400 bg-gray-100 text-gray-500">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
