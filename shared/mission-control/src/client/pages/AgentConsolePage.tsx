import React, { useState, useMemo } from 'react';
import { Terminal, Search } from 'lucide-react';
import { useEventStore } from '../stores/eventStore';
import { useAgentStore } from '../stores/agentStore';
import { AgentConsolePanel } from '../components/panels/AgentConsolePanel';
import {
  MissionControlEvent,
  EventCategory,
  AGENT_NAMES,
  AGENT_COLORS,
} from '../types/events';

const CATEGORY_OPTIONS = ['all', ...Object.values(EventCategory)] as const;

export const AgentConsolePage: React.FC = () => {
  const events = useEventStore((s) => s.events);
  const getAllAgents = useAgentStore((s) => s.getAllAgents);
  const agents = getAllAgents();

  const [maximizedAgent, setMaximizedAgent] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  // Group events by agent role
  const eventsByAgent = useMemo(() => {
    const grouped: Record<string, MissionControlEvent[]> = {};

    for (const event of events) {
      const role = event.agent?.role;
      if (!role) continue;

      // Apply category filter
      if (categoryFilter !== 'all' && event.category !== categoryFilter) continue;

      // Apply search filter
      if (searchText) {
        const search = searchText.toLowerCase();
        const matchesType = event.type.toLowerCase().includes(search);
        const matchesPayload = JSON.stringify(event.payload).toLowerCase().includes(search);
        const matchesCategory = event.category.toLowerCase().includes(search);
        if (!matchesType && !matchesPayload && !matchesCategory) continue;
      }

      if (!grouped[role]) grouped[role] = [];
      grouped[role].push(event);
    }

    return grouped;
  }, [events, categoryFilter, searchText]);

  // Build agent list: use known agents from the store, plus any seen in events
  const agentRoles = useMemo(() => {
    const roles = new Set<string>();
    for (const agent of agents) {
      roles.add(agent.role);
    }
    for (const role of Object.keys(eventsByAgent)) {
      roles.add(role);
    }
    return Array.from(roles).sort();
  }, [agents, eventsByAgent]);

  // When maximized, only show that agent
  const visibleRoles = maximizedAgent
    ? agentRoles.filter((r) => r === maximizedAgent)
    : agentRoles;

  const totalEventCount = events.length;
  const filteredEventCount = Object.values(eventsByAgent).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={20} className="dark:text-gray-400 text-gray-500" />
          <h1 className="text-lg font-semibold dark:text-gray-200 text-gray-800">
            Live Agent Console
          </h1>
          <span className="text-xs dark:text-gray-500 text-gray-400 ml-2">
            {agentRoles.length} agent{agentRoles.length !== 1 ? 's' : ''} |{' '}
            {filteredEventCount} event{filteredEventCount !== 1 ? 's' : ''}
            {categoryFilter !== 'all' || searchText
              ? ` (of ${totalEventCount})`
              : ''}
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search within logs..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md dark:bg-gray-800 bg-gray-100 dark:text-gray-200 text-gray-700 border dark:border-gray-700 border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-md dark:bg-gray-800 bg-gray-100 dark:text-gray-200 text-gray-700 border dark:border-gray-700 border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {Object.values(EventCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Maximized indicator */}
        {maximizedAgent && (
          <button
            onClick={() => setMaximizedAgent(null)}
            className="text-xs px-2.5 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Show all agents
          </button>
        )}
      </div>

      {/* Agent console grid */}
      {visibleRoles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Terminal
            size={40}
            className="dark:text-gray-700 text-gray-300 mb-3"
          />
          <p className="dark:text-gray-500 text-gray-400 text-sm">
            No agents active yet. Events will appear here as agents start
            working.
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-3 ${
            maximizedAgent
              ? 'grid-cols-1'
              : visibleRoles.length === 1
              ? 'grid-cols-1'
              : visibleRoles.length === 2
              ? 'grid-cols-1 lg:grid-cols-2'
              : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {visibleRoles.map((role) => {
            const storeAgent = agents.find((a) => a.role === role);
            const agentName =
              storeAgent?.name || AGENT_NAMES[role] || role;
            const agentColor =
              storeAgent?.color || AGENT_COLORS[role] || '#6B7280';
            const agentEvents = eventsByAgent[role] || [];

            return (
              <AgentConsolePanel
                key={role}
                agentRole={role}
                agentName={agentName}
                agentColor={agentColor}
                events={agentEvents}
                isMaximized={maximizedAgent === role}
                onMaximize={() => setMaximizedAgent(role)}
                onMinimize={() => setMaximizedAgent(null)}
              />
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-1 text-[10px] dark:text-gray-600 text-gray-400">
        <span>
          Agent Console — real-time multi-pane terminal view
        </span>
        <span>
          {maximizedAgent ? `Focused: ${maximizedAgent}` : `${visibleRoles.length} panes`}
        </span>
      </div>
    </div>
  );
};
