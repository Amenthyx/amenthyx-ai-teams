import { useEffect, useRef, useState, useCallback } from 'react';
import { MissionControlEvent, EventCategory, BudgetInfo, KanbanCard, CommitEntry } from '../types/events';
import { useAgentStore } from '../stores/agentStore';
import { useBudgetStore } from '../stores/budgetStore';
import { useWaveStore } from '../stores/waveStore';
import { useKanbanStore } from '../stores/kanbanStore';
import { useCommitStore } from '../stores/commitStore';
import { useEventStore } from '../stores/eventStore';
import { useTestStore } from '../stores/testStore';

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface UseWebSocketResult {
  status: ConnectionStatus;
  reconnectCount: number;
}

const MAX_BACKOFF = 30000;
const INITIAL_BACKOFF = 1000;

function getWsUrl(): string {
  if (typeof window === 'undefined') return 'ws://localhost:4201/ws';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}/ws`;
}

function getApiUrl(path: string): string {
  if (typeof window === 'undefined') return `http://localhost:4201${path}`;
  return `${window.location.origin}${path}`;
}

/**
 * Fetch initial state from REST API. This ensures the dashboard has data
 * even before the WebSocket connection is established or if the snapshot
 * message is missed.
 */
async function fetchInitialState(): Promise<void> {
  try {
    const res = await fetch(getApiUrl('/api/config'));
    if (!res.ok) return;
    const config = await res.json();

    if (config.agents && config.agents.length > 0) {
      useAgentStore.getState().setAgents(config.agents);
    }
    if (config.budget) {
      useBudgetStore.getState().setBudget(config.budget);
    }
    if (config.waves && config.waves.length > 0) {
      useWaveStore.getState().setWaves(config.waves);
    }
  } catch {
    // Server may not be ready yet — WebSocket snapshot will handle it
  }
}

export function useWebSocket(): UseWebSocketResult {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [reconnectCount, setReconnectCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const backoffRef = useRef(INITIAL_BACKOFF);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const dispatchEvent = useCallback((event: MissionControlEvent) => {
    // Always add to event store
    useEventStore.getState().addEvent(event);

    // Dispatch to category-specific stores
    switch (event.category) {
      case EventCategory.AGENT:
        if (event.agent?.role) {
          useAgentStore.getState().updateAgent(event.agent.role, {
            status: (event.payload.status as 'idle' | 'active' | 'blocked' | 'done') || undefined,
            currentTask: event.payload.currentTask as string | undefined,
            tokensUsed: event.meta?.tokens_input
              ? (event.meta.tokens_input + (event.meta.tokens_output || 0))
              : undefined,
            costUsd: event.meta?.cost_usd,
            lastAction: event.type,
          });
        }
        break;

      case EventCategory.COST:
        if (event.meta?.cost_usd) {
          useBudgetStore.getState().addCost(event.meta.cost_usd, event.agent?.role);
        }
        if (event.payload.budget) {
          useBudgetStore.getState().setBudget(event.payload.budget as BudgetInfo);
        }
        break;

      case EventCategory.PLANNING:
        if (event.payload.wave) {
          const waveData = event.payload.wave as { number: number; status?: string; gate?: string };
          useWaveStore.getState().updateWave(waveData.number, {
            status: waveData.status as 'pending' | 'active' | 'done',
            gate: waveData.gate as 'pending' | 'pass' | 'fail',
          });
        }
        if (event.payload.cards) {
          const cards = event.payload.cards as KanbanCard[];
          useKanbanStore.getState().setCards(cards);
        } else if (event.payload.card) {
          useKanbanStore.getState().addCard(event.payload.card as KanbanCard);
        }
        if (event.payload.milestones) {
          // Milestones parsed from MILESTONES.md — update wave store
          const milestones = event.payload.milestones as Array<{ name: string; status: string }>;
          const waves = milestones.map((m, i) => ({
            number: i,
            name: m.name,
            status: (m.status === 'done' || m.status === 'DONE') ? 'done' as const
              : (m.status === 'active' || m.status === 'IN PROGRESS') ? 'active' as const
              : 'pending' as const,
            gate: (m.status === 'done' || m.status === 'DONE') ? 'pass' as const : 'pending' as const,
          }));
          useWaveStore.getState().setWaves(waves);
        }
        break;

      case EventCategory.GIT:
        if (event.payload.commits) {
          const commits = event.payload.commits as CommitEntry[];
          useCommitStore.getState().setCommits(commits);
        } else if (event.payload.commit) {
          useCommitStore.getState().addCommit(event.payload.commit as CommitEntry);
        }
        break;

      case EventCategory.TEST:
        if (event.payload.layer) {
          useTestStore.getState().updateLayer(
            event.payload.layer as 'static' | 'unit_be' | 'unit_fe' | 'integration' | 'e2e' | 'performance' | 'security' | 'accessibility',
            (event.payload.results || {}) as Record<string, unknown>
          );
        }
        break;

      default:
        break;
    }
  }, []);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setStatus('connecting');
    const url = getWsUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setStatus('connected');
      backoffRef.current = INITIAL_BACKOFF;
      setReconnectCount(0);
    };

    ws.onmessage = (messageEvent) => {
      if (!mountedRef.current) return;
      try {
        const data = JSON.parse(messageEvent.data);

        // Handle event wrapper: { type: 'event', data: MissionControlEvent }
        if (data.type === 'event' && data.data?.id && data.data?.category) {
          dispatchEvent(data.data as MissionControlEvent);
        }
        // Handle batch messages
        else if (Array.isArray(data)) {
          for (const item of data) {
            if (item.id && item.category) {
              dispatchEvent(item as MissionControlEvent);
            }
          }
        } else if (data.id && data.category) {
          dispatchEvent(data as MissionControlEvent);
        }
        // Handle snapshot messages from server
        else if (data.type === 'snapshot') {
          if (data.agents && data.agents.length > 0) {
            useAgentStore.getState().setAgents(data.agents);
          }
          if (data.budget) {
            useBudgetStore.getState().setBudget(data.budget);
          }
          if (data.waves && data.waves.length > 0) {
            useWaveStore.getState().setWaves(data.waves);
          }
          if (data.cards) {
            useKanbanStore.getState().setCards(data.cards);
          }
          if (data.commits) {
            useCommitStore.getState().setCommits(data.commits);
          }
          if (data.tests) {
            useTestStore.getState().setResults(data.tests);
          }
          // Replay recent events into the event store
          if (data.events && Array.isArray(data.events)) {
            for (const event of data.events) {
              if (event.id && event.category) {
                useEventStore.getState().addEvent(event as MissionControlEvent);
                // Also dispatch to category stores so kanban/commits/waves populate
                dispatchEvent(event as MissionControlEvent);
              }
            }
          }
        }
      } catch {
        // Silently ignore malformed messages
      }
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setStatus('disconnected');
      wsRef.current = null;

      const delay = backoffRef.current;
      backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF);
      setReconnectCount((c) => c + 1);

      reconnectTimerRef.current = setTimeout(() => {
        connect();
      }, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [dispatchEvent]);

  useEffect(() => {
    mountedRef.current = true;
    // Fetch initial state via REST before WebSocket connects
    fetchInitialState();
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { status, reconnectCount };
}
