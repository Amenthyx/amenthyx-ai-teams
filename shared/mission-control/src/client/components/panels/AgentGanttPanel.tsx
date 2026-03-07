import React, { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { GanttChart, type GanttRow, type GanttTimeRange } from '../charts/GanttChart';
import { useAgentStore } from '../../stores/agentStore';
import { useEventStore } from '../../stores/eventStore';
import { AGENT_COLORS, AGENT_NAMES } from '../../types/events';

interface AgentGanttPanelProps {
  compact?: boolean;
  defaultHours?: number;
}

/**
 * Gantt-like timeline showing agent activity over time.
 * Each agent is a row, colored bars show active periods.
 * Derives activity windows from event timestamps per agent.
 */
export const AgentGanttPanel: React.FC<AgentGanttPanelProps> = ({
  compact = false,
  defaultHours = 2,
}) => {
  const [hours, setHours] = useState(defaultHours);
  const agents = useAgentStore((s) => s.getAllAgents());
  const events = useEventStore((s) => s.events);

  const timeRange: GanttTimeRange = useMemo(() => {
    const now = Date.now();
    return {
      start: now - hours * 60 * 60 * 1000,
      end: now,
    };
  }, [hours]);

  const rows: GanttRow[] = useMemo(() => {
    // Group events by agent_role and build activity segments
    const agentEvents = new Map<string, number[]>();

    for (const event of events) {
      const role = event.agent?.role;
      if (!role) continue;

      const ts = new Date(event.timestamp).getTime();
      if (ts < timeRange.start || ts > timeRange.end) continue;

      if (!agentEvents.has(role)) {
        agentEvents.set(role, []);
      }
      agentEvents.get(role)!.push(ts);
    }

    // For each agent, merge timestamps into segments
    // Adjacent events within 5 minutes are grouped into one bar
    const GAP_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    const MIN_SEGMENT_WIDTH = 2 * 60 * 1000; // 2 minutes minimum display width

    const result: GanttRow[] = [];

    for (const agent of agents) {
      const timestamps = agentEvents.get(agent.role) || [];
      if (timestamps.length === 0 && compact) continue;

      timestamps.sort((a, b) => a - b);

      const segments: GanttRow['segments'] = [];
      let segStart = 0;
      let segEnd = 0;

      for (let i = 0; i < timestamps.length; i++) {
        const ts = timestamps[i];

        if (i === 0) {
          segStart = ts;
          segEnd = ts;
          continue;
        }

        if (ts - segEnd <= GAP_THRESHOLD) {
          segEnd = ts;
        } else {
          // Close current segment
          segments.push({
            start: segStart,
            end: Math.max(segEnd, segStart + MIN_SEGMENT_WIDTH),
            color: AGENT_COLORS[agent.role] || agent.color,
            tooltip: `${AGENT_NAMES[agent.role] || agent.role}: ${formatDuration(segEnd - segStart)}`,
          });
          segStart = ts;
          segEnd = ts;
        }
      }

      // Close final segment
      if (timestamps.length > 0) {
        segments.push({
          start: segStart,
          end: Math.max(segEnd, segStart + MIN_SEGMENT_WIDTH),
          color: AGENT_COLORS[agent.role] || agent.color,
          tooltip: `${AGENT_NAMES[agent.role] || agent.role}: ${formatDuration(segEnd - segStart)}`,
        });
      }

      result.push({
        label: agent.role,
        segments,
      });
    }

    return result;
  }, [agents, events, timeRange, compact]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Clock size={14} />
          Agent Timeline
        </h2>
        <div className="flex items-center gap-1">
          {[1, 2, 4, 8].map((h) => (
            <button
              key={h}
              onClick={() => setHours(h)}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                hours === h
                  ? 'bg-blue-500/20 text-blue-400 font-medium'
                  : 'dark:text-gray-500 text-gray-400 dark:hover:text-gray-300 hover:text-gray-600'
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <GanttChart
          rows={rows}
          timeRange={timeRange}
          rowHeight={compact ? 24 : 32}
          showTimeAxis
        />
        {rows.length === 0 && (
          <p className="text-xs dark:text-gray-600 text-gray-400 text-center py-4 italic">
            No agent activity in the last {hours} hour{hours > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  return `${(ms / 3_600_000).toFixed(1)}h`;
}
