import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FixedSizeList as VirtualList } from 'react-window';
import {
  Radio,
  Search,
  Pause,
  Play,
  Download,
  AlertTriangle,
  Info,
  AlertCircle,
  Zap,
  Cpu,
  GitCommitHorizontal,
  Shield,
  BarChart3,
  Settings,
  Eye,
  FileCode,
  Wrench,
  ClipboardCheck,
} from 'lucide-react';
import { useEventStore } from '../../stores/eventStore';
import {
  MissionControlEvent,
  EventCategory,
  Severity,
  AGENT_COLORS,
} from '../../types/events';

const SEVERITY_CONFIG: Record<Severity, { icon: React.ReactNode; class: string }> = {
  info: { icon: <Info size={12} />, class: 'text-blue-400' },
  warn: { icon: <AlertTriangle size={12} />, class: 'text-yellow-400' },
  error: { icon: <AlertCircle size={12} />, class: 'text-red-400' },
  critical: { icon: <Zap size={12} />, class: 'text-red-600' },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  AGENT: <Cpu size={12} />,
  TOOL: <Wrench size={12} />,
  PLANNING: <BarChart3 size={12} />,
  CODE: <FileCode size={12} />,
  TEST: <Shield size={12} />,
  BUILD: <Settings size={12} />,
  GIT: <GitCommitHorizontal size={12} />,
  COST: <BarChart3 size={12} />,
  CI: <Settings size={12} />,
  SECRET: <Shield size={12} />,
  SYSTEM: <Settings size={12} />,
  EVIDENCE: <Eye size={12} />,
  GATE: <Shield size={12} />,
  CUSTOM: <Zap size={12} />,
  UAT: <ClipboardCheck size={12} />,
};

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    } as Intl.DateTimeFormatOptions);
  } catch {
    return ts;
  }
}

interface EventRowProps {
  event: MissionControlEvent;
  style: React.CSSProperties;
}

const EventRow: React.FC<EventRowProps> = ({ event, style }) => {
  const agentColor = event.agent?.role
    ? AGENT_COLORS[event.agent.role] || '#6B7280'
    : '#6B7280';
  const severityConfig = SEVERITY_CONFIG[event.severity] || SEVERITY_CONFIG.info;
  const categoryIcon = CATEGORY_ICONS[event.category] || <Zap size={12} />;

  return (
    <div
      style={style}
      className="flex items-center gap-2 px-3 text-xs border-b dark:border-gray-800 border-gray-100 dark:hover:bg-gray-800/50 hover:bg-gray-50 transition-colors duration-100"
    >
      {/* Timestamp */}
      <span className="font-mono dark:text-gray-500 text-gray-400 shrink-0 w-20">
        {formatTimestamp(event.timestamp)}
      </span>

      {/* Agent badge */}
      {event.agent?.role && (
        <span
          className="px-1.5 py-0 rounded text-[10px] font-bold text-white shrink-0"
          style={{ backgroundColor: agentColor }}
        >
          {event.agent.role}
        </span>
      )}

      {/* Category icon */}
      <span className="dark:text-gray-500 text-gray-400 shrink-0" title={event.category}>
        {categoryIcon}
      </span>

      {/* Event type */}
      <span className="font-medium dark:text-gray-300 text-gray-600 shrink-0 max-w-[120px] truncate">
        {event.type}
      </span>

      {/* Description / payload */}
      <span className="dark:text-gray-400 text-gray-500 truncate flex-1">
        {typeof event.payload.message === 'string'
          ? event.payload.message
          : typeof event.payload.description === 'string'
          ? event.payload.description
          : JSON.stringify(event.payload).slice(0, 120)}
      </span>

      {/* Severity indicator */}
      <span className={`shrink-0 ${severityConfig.class}`}>{severityConfig.icon}</span>
    </div>
  );
};

interface EventStreamPanelProps {
  compact?: boolean;
  maxEvents?: number;
}

export const EventStreamPanel: React.FC<EventStreamPanelProps> = ({
  compact = false,
  maxEvents,
}) => {
  const allEvents = useEventStore((s) => s.getFilteredEvents());
  const [searchText, setSearchText] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [paused, setPaused] = useState(false);
  const [pausedCount, setPausedCount] = useState(0);
  const listRef = useRef<VirtualList>(null);
  const prevLengthRef = useRef(0);

  // Apply local filters
  let events = allEvents;
  if (maxEvents) {
    events = events.slice(-maxEvents);
  }

  const filteredEvents = events.filter((e) => {
    if (severityFilter !== 'all' && e.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (searchText) {
      const search = searchText.toLowerCase();
      const matchesType = e.type.toLowerCase().includes(search);
      const matchesAgent = e.agent?.role?.toLowerCase().includes(search);
      const matchesPayload = JSON.stringify(e.payload).toLowerCase().includes(search);
      if (!matchesType && !matchesAgent && !matchesPayload) return false;
    }
    return true;
  });

  // Track paused new events
  useEffect(() => {
    if (paused) {
      const newCount = filteredEvents.length - prevLengthRef.current;
      if (newCount > 0) {
        setPausedCount((c) => c + newCount);
      }
    } else {
      setPausedCount(0);
      prevLengthRef.current = filteredEvents.length;
    }
  }, [filteredEvents.length, paused]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && !paused && listRef.current && filteredEvents.length > 0) {
      listRef.current.scrollToItem(filteredEvents.length - 1, 'end');
    }
  }, [filteredEvents.length, autoScroll, paused]);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(filteredEvents, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mission-control-events-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredEvents]);

  const handleResume = () => {
    setPaused(false);
    setPausedCount(0);
    setAutoScroll(true);
    prevLengthRef.current = filteredEvents.length;
  };

  const ROW_HEIGHT = 32;
  const listHeight = compact ? 300 : 500;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
          Event Stream
        </h2>
        {compact && (
          <span className="text-[10px] dark:text-gray-500 text-gray-400">
            Last {maxEvents || 20} events
          </span>
        )}
      </div>

      <div className="card overflow-hidden">
        {/* Local filter bar */}
        {!compact && (
          <div className="flex items-center gap-2 px-3 py-2 border-b dark:border-gray-700 border-gray-200 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[150px]">
              <Search
                size={14}
                className="absolute left-2 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search events..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-xs rounded-md dark:bg-gray-700 bg-gray-100 dark:text-gray-200 text-gray-700 border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Severity filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as Severity | 'all')}
              className="text-xs px-2 py-1 rounded-md dark:bg-gray-700 bg-gray-100 dark:text-gray-200 text-gray-700 border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as EventCategory | 'all')}
              className="text-xs px-2 py-1 rounded-md dark:bg-gray-700 bg-gray-100 dark:text-gray-200 text-gray-700 border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {Object.values(EventCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Controls */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => (paused ? handleResume() : setPaused(true))}
                className="p-1.5 rounded dark:hover:bg-gray-600 hover:bg-gray-200 transition-colors duration-200 relative"
                title={paused ? 'Resume' : 'Pause'}
              >
                {paused ? (
                  <Play size={14} className="text-green-400" />
                ) : (
                  <Pause size={14} className="dark:text-gray-400 text-gray-500" />
                )}
                {pausedCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1 py-0 rounded-full text-[9px] font-bold bg-blue-500 text-white">
                    {pausedCount > 99 ? '99+' : pausedCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`p-1.5 rounded transition-colors duration-200 ${
                  autoScroll
                    ? 'dark:bg-blue-600/20 bg-blue-50'
                    : 'dark:hover:bg-gray-600 hover:bg-gray-200'
                }`}
                title={autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
              >
                <Radio
                  size={14}
                  className={autoScroll ? 'text-blue-400' : 'dark:text-gray-400 text-gray-500'}
                />
              </button>
              <button
                onClick={handleExport}
                className="p-1.5 rounded dark:hover:bg-gray-600 hover:bg-gray-200 transition-colors duration-200"
                title="Export JSON"
              >
                <Download size={14} className="dark:text-gray-400 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* Event list */}
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center">
            <Radio size={24} className="dark:text-gray-600 text-gray-300 mx-auto mb-2" />
            <p className="dark:text-gray-500 text-gray-400 text-sm">No events yet</p>
          </div>
        ) : (
          <VirtualList
            ref={listRef}
            height={listHeight}
            itemCount={filteredEvents.length}
            itemSize={ROW_HEIGHT}
            width="100%"
          >
            {({ index, style }) => (
              <EventRow event={filteredEvents[index]} style={style} />
            )}
          </VirtualList>
        )}

        {/* Footer stats */}
        {!compact && filteredEvents.length > 0 && (
          <div className="flex items-center justify-between px-3 py-1.5 border-t dark:border-gray-700 border-gray-200 text-[10px] dark:text-gray-500 text-gray-400">
            <span>
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              {searchText || severityFilter !== 'all' || categoryFilter !== 'all'
                ? ` (filtered from ${allEvents.length})`
                : ''}
            </span>
            <span>
              {paused ? 'PAUSED' : autoScroll ? 'LIVE' : 'SCROLLED'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
