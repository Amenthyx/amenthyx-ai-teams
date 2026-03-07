import React from 'react';
import { useSessionStore, Session } from '../../stores/sessionStore';
import { Monitor } from 'lucide-react';

export function SessionSelector() {
  const sessions = useSessionStore((s) => s.sessions);
  const activeSessionId = useSessionStore((s) => s.activeSessionId);
  const setActive = useSessionStore((s) => s.setActive);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <Monitor size={16} className="dark:text-gray-400 text-gray-500" />
      <select
        value={activeSessionId || ''}
        onChange={(e) => setActive(e.target.value || null)}
        className="appearance-none bg-transparent dark:text-gray-200 text-gray-800 text-sm font-medium border dark:border-gray-700 border-gray-300 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="">Select session...</option>
        {sessions.map((session: Session) => (
          <option key={session.id} value={session.id}>
            {session.name} ({formatDate(session.created_at)})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="dark:text-gray-400 text-gray-500"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
