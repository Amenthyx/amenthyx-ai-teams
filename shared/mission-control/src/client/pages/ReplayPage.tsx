import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, FastForward } from 'lucide-react';

interface ReplayEvent {
  id: string;
  type: string;
  agent?: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

const SPEED_OPTIONS = [0.5, 1, 2, 4, 8];

export function ReplayPage() {
  const [events, setEvents] = useState<ReplayEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : data.events || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (isPlaying && events.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, events.length]);

  useEffect(() => {
    if (eventListRef.current) {
      const activeEl = eventListRef.current.querySelector('[data-active="true"]');
      activeEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentIndex]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const skipBack = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const skipForward = useCallback(() => {
    setCurrentIndex(Math.max(events.length - 1, 0));
    setIsPlaying(false);
  }, [events.length]);

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => {
      const idx = SPEED_OPTIONS.indexOf(prev);
      return SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
    });
  }, []);

  const progress = events.length > 0 ? (currentIndex / (events.length - 1)) * 100 : 0;

  const getEventColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          Error loading events: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold dark:text-white text-gray-900">
        Session Replay
      </h1>
      <p className="text-sm dark:text-gray-400 text-gray-600">
        Replay historical session events in chronological order.
      </p>

      {/* Timeline scrubber */}
      <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between text-xs dark:text-gray-400 text-gray-500">
          <span>
            Event {currentIndex + 1} of {events.length}
          </span>
          <span>
            {events[currentIndex]?.timestamp
              ? new Date(events[currentIndex].timestamp).toLocaleTimeString()
              : '--:--:--'}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="relative w-full h-2 rounded-full bg-gray-700 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setCurrentIndex(Math.round(pct * (events.length - 1)));
          }}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-blue-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-400 border-2 border-blue-600 shadow transition-all duration-150"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={skipBack}
            className="p-2 rounded-lg hover:bg-gray-700 dark:text-gray-300 text-gray-600 transition"
            title="Skip to start"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={skipForward}
            className="p-2 rounded-lg hover:bg-gray-700 dark:text-gray-300 text-gray-600 transition"
            title="Skip to end"
          >
            <SkipForward size={18} />
          </button>
          <button
            onClick={cycleSpeed}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-700 dark:text-gray-300 text-gray-600 text-sm font-mono transition"
            title="Change speed"
          >
            <FastForward size={14} />
            {speed}x
          </button>
        </div>
      </div>

      {/* Event list */}
      <div
        ref={eventListRef}
        className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4 max-h-96 overflow-y-auto space-y-2"
      >
        {events.length === 0 ? (
          <div className="text-center dark:text-gray-500 text-gray-400 py-8">
            No events recorded
          </div>
        ) : (
          events.map((event, i) => {
            const isActive = i === currentIndex;
            const isPast = i < currentIndex;
            return (
              <div
                key={event.id || i}
                data-active={isActive}
                onClick={() => setCurrentIndex(i)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isActive
                    ? getEventColor(event.type)
                    : isPast
                    ? 'border-transparent opacity-50 hover:opacity-75'
                    : 'border-transparent opacity-30 hover:opacity-50'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    isActive ? 'bg-blue-400 animate-pulse' : isPast ? 'bg-gray-500' : 'bg-gray-700'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono dark:text-gray-400 text-gray-500">
                      {event.timestamp
                        ? new Date(event.timestamp).toLocaleTimeString()
                        : ''}
                    </span>
                    {event.agent && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 dark:text-gray-300 text-gray-600">
                        {event.agent}
                      </span>
                    )}
                    <span className="text-xs uppercase font-semibold dark:text-gray-500 text-gray-400">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm dark:text-gray-200 text-gray-800 mt-0.5 truncate">
                    {event.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
