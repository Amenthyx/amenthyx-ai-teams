import React from 'react';
import { Info, AlertTriangle, AlertCircle, Zap } from 'lucide-react';
import { MissionControlEvent, Severity, AGENT_COLORS } from '../../types/events';

const SEVERITY_BADGE: Record<Severity, { label: string; className: string; icon: React.ReactNode }> = {
  info: {
    label: 'Info',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: <Info size={10} />,
  },
  warn: {
    label: 'Warn',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: <AlertTriangle size={10} />,
  },
  error: {
    label: 'Error',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: <AlertCircle size={10} />,
  },
  critical: {
    label: 'Critical',
    className: 'bg-red-600/30 text-red-300 border-red-600/40',
    icon: <Zap size={10} />,
  },
};

function formatTimestamp(ts: string): string {
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

function getPayloadSummary(payload: Record<string, unknown>): string {
  if (typeof payload.message === 'string') return payload.message;
  if (typeof payload.description === 'string') return payload.description;
  if (typeof payload.status === 'string') return payload.status;
  const keys = Object.keys(payload);
  if (keys.length === 0) return 'No details';
  return JSON.stringify(payload).slice(0, 100);
}

interface AgentEventTimelineProps {
  events: MissionControlEvent[];
  agentRole: string;
}

export const AgentEventTimeline: React.FC<AgentEventTimelineProps> = ({ events, agentRole }) => {
  const limited = events.slice(-50);
  const reversed = [...limited].reverse();
  const agentColor = AGENT_COLORS[agentRole] || '#6B7280';

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-4">
        Event Timeline
      </h3>

      {reversed.length === 0 ? (
        <p className="text-sm dark:text-gray-500 text-gray-400 text-center py-6">
          No events recorded for this agent
        </p>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-3 top-0 bottom-0 w-0.5 opacity-30"
            style={{ backgroundColor: agentColor }}
          />

          <div className="space-y-3">
            {reversed.map((event) => {
              const severity = SEVERITY_BADGE[event.severity] || SEVERITY_BADGE.info;

              return (
                <div key={event.id} className="relative pl-8">
                  {/* Dot on timeline */}
                  <div
                    className="absolute left-[7px] top-2 w-3 h-3 rounded-full border-2 dark:border-gray-800 border-white"
                    style={{ backgroundColor: agentColor }}
                  />

                  <div className="dark:bg-gray-700/30 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {/* Timestamp */}
                      <span className="font-mono text-[10px] dark:text-gray-500 text-gray-400">
                        {formatTimestamp(event.timestamp)}
                      </span>

                      {/* Event type */}
                      <span className="text-xs font-medium dark:text-gray-200 text-gray-700">
                        {event.type}
                      </span>

                      {/* Severity badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0 rounded text-[10px] font-medium border ${severity.className}`}
                      >
                        {severity.icon}
                        {severity.label}
                      </span>

                      {/* Category */}
                      <span className="text-[10px] dark:text-gray-500 text-gray-400 ml-auto">
                        {event.category}
                      </span>
                    </div>

                    {/* Payload summary */}
                    <p className="text-xs dark:text-gray-400 text-gray-500 truncate">
                      {getPayloadSummary(event.payload)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {events.length > 50 && (
        <p className="text-[10px] dark:text-gray-500 text-gray-400 mt-3 text-center">
          Showing last 50 of {events.length} events
        </p>
      )}
    </div>
  );
};
