import React from 'react';
import { Filter } from 'lucide-react';
import { useFilterStore } from '../../stores/filterStore';
import { useEventStore } from '../../stores/eventStore';
import { ALL_AGENT_ROLES, AGENT_COLORS, AGENT_NAMES, AgentCategory } from '../../types/events';

const CATEGORIES: { label: string; value: AgentCategory }[] = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Management', value: 'management' },
  { label: 'Quality', value: 'quality' },
  { label: 'Support', value: 'support' },
];

export const AgentFilterBar: React.FC = () => {
  const { selectedAgents, toggleAgent, selectAll, selectCategory } = useFilterStore();
  const eventCounts = useEventStore((s) => s.getEventCountByAgent());

  const isAllSelected = selectedAgents.length === 0;

  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 border-b dark:border-gray-700 border-gray-200 dark:bg-gray-800/95 bg-white/95 backdrop-blur-sm flex-wrap">
      <Filter size={14} className="dark:text-gray-500 text-gray-400 shrink-0" />

      {/* All button */}
      <button
        onClick={selectAll}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
          isAllSelected
            ? 'bg-blue-600 text-white shadow-sm'
            : 'dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        All
      </button>

      {/* Separator */}
      <div className="w-px h-5 dark:bg-gray-600 bg-gray-300 mx-1" />

      {/* Category quick-select */}
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => selectCategory(cat.value)}
          className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          {cat.label}
        </button>
      ))}

      {/* Separator */}
      <div className="w-px h-5 dark:bg-gray-600 bg-gray-300 mx-1" />

      {/* Individual agent chips */}
      {ALL_AGENT_ROLES.map((role) => {
        const color = AGENT_COLORS[role];
        const isSelected = isAllSelected || selectedAgents.includes(role);
        const count = eventCounts[role] || 0;

        return (
          <button
            key={role}
            onClick={() => toggleAgent(role)}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              isSelected
                ? 'shadow-sm ring-1'
                : 'opacity-40 dark:bg-gray-700 bg-gray-100'
            }`}
            style={
              isSelected
                ? {
                    backgroundColor: `${color}20`,
                    color: color,
                    borderColor: `${color}40`,
                    boxShadow: `0 0 0 1px ${color}40`,
                  }
                : undefined
            }
            title={AGENT_NAMES[role]}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span>{role}</span>
            {count > 0 && (
              <span
                className="ml-0.5 px-1.5 py-0 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: `${color}30`,
                  color: color,
                }}
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
