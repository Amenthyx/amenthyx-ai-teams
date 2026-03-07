import { useState, useCallback, useMemo } from 'react';

export interface Command {
  id: string;
  label: string;
  category: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
}

export function useCommandPalette(commands: Command[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const open = useCallback(() => {
    setQuery('');
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const execute = useCallback(
    (cmd: Command) => {
      cmd.action();
      close();
    },
    [close]
  );

  return { isOpen, open, close, query, setQuery, filtered, execute };
}
