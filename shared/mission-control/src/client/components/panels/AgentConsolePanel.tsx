import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { MissionControlEvent, EventCategory } from '../../types/events';

const CATEGORY_COLORS: Record<string, string> = {
  BUILD: 'text-emerald-400',
  TEST: 'text-blue-400',
  CODE: 'text-blue-400',
  GIT: 'text-orange-400',
  PLANNING: 'text-purple-400',
  AGENT: 'text-gray-400',
  TOOL: 'text-gray-400',
  COST: 'text-yellow-400',
  CI: 'text-emerald-400',
  SECRET: 'text-red-400',
  SYSTEM: 'text-gray-400',
  EVIDENCE: 'text-cyan-400',
  GATE: 'text-yellow-400',
  CUSTOM: 'text-gray-400',
  UAT: 'text-blue-400',
  ERROR: 'text-red-400',
};

function formatTime(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return ts;
  }
}

function getLogColor(event: MissionControlEvent): string {
  if (event.severity === 'error' || event.severity === 'critical') {
    return 'text-red-400';
  }
  return CATEGORY_COLORS[event.category] || 'text-gray-400';
}

function getLogMessage(event: MissionControlEvent): string {
  if (typeof event.payload.message === 'string') return event.payload.message;
  if (typeof event.payload.description === 'string') return event.payload.description;
  return JSON.stringify(event.payload).slice(0, 200);
}

interface AgentConsolePanelProps {
  agentRole: string;
  agentName: string;
  agentColor: string;
  events: MissionControlEvent[];
  isMaximized: boolean;
  onMaximize: () => void;
  onMinimize: () => void;
}

export const AgentConsolePanel: React.FC<AgentConsolePanelProps> = ({
  agentRole,
  agentName,
  agentColor,
  events,
  isMaximized,
  onMaximize,
  onMinimize,
}) => {
  const [follow, setFollow] = useState(true);
  const [cleared, setCleared] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const visibleEvents = events.slice(cleared);

  useEffect(() => {
    if (follow && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleEvents.length, follow]);

  return (
    <div
      className={`flex flex-col rounded-lg border dark:border-gray-700 border-gray-200 dark:bg-gray-900 bg-white overflow-hidden ${
        isMaximized ? 'col-span-full' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 dark:bg-gray-800 bg-gray-100 border-b dark:border-gray-700 border-gray-200">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: agentColor }}
          />
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded text-white"
            style={{ backgroundColor: agentColor }}
          >
            {agentRole}
          </span>
          <span className="text-xs font-medium dark:text-gray-300 text-gray-600">
            {agentName}
          </span>
          <span className="text-[10px] dark:text-gray-500 text-gray-400 ml-1">
            {visibleEvents.length}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setFollow(!follow)}
            className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            title={follow ? 'Pause follow' : 'Resume follow'}
          >
            {follow ? (
              <Pause size={12} className="dark:text-gray-400 text-gray-500" />
            ) : (
              <Play size={12} className="text-green-400" />
            )}
          </button>
          <button
            onClick={() => setCleared(events.length)}
            className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            title="Clear display"
          >
            <Trash2 size={12} className="dark:text-gray-400 text-gray-500" />
          </button>
          <button
            onClick={isMaximized ? onMinimize : onMaximize}
            className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? (
              <Minimize2 size={12} className="dark:text-gray-400 text-gray-500" />
            ) : (
              <Maximize2 size={12} className="dark:text-gray-400 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Log output */}
      <div
        className={`overflow-y-auto font-mono text-xs p-2 dark:bg-gray-950 bg-gray-50 ${
          isMaximized ? 'h-[500px]' : 'h-[240px]'
        }`}
      >
        {visibleEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="dark:text-gray-600 text-gray-400 text-[11px]">
              No events
            </span>
          </div>
        ) : (
          visibleEvents.map((event) => (
            <div key={event.id} className="leading-5 hover:dark:bg-gray-900 hover:bg-gray-100">
              <span className="dark:text-gray-600 text-gray-400">
                [{formatTime(event.timestamp)}]
              </span>{' '}
              <span className={getLogColor(event)}>
                [{event.category}]
              </span>{' '}
              <span className="dark:text-gray-300 text-gray-700">
                {getLogMessage(event)}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
