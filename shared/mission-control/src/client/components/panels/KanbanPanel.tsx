import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useKanbanStore, KANBAN_COLUMNS } from '../../stores/kanbanStore';
import { useCommitStore } from '../../stores/commitStore';
import { AGENT_COLORS, AGENT_NAMES, KanbanCard } from '../../types/events';

interface CardModalProps {
  card: KanbanCard;
  onClose: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  const linkedCommits = useCommitStore((s) => s.getCommitsByIssue(card.issue));
  const color = AGENT_COLORS[card.agent] || '#6B7280';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-6 dark:bg-gray-800 bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg dark:hover:bg-gray-700 hover:bg-gray-100"
        >
          <X size={18} className="dark:text-gray-400 text-gray-500" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {card.agent}
          </span>
          <span className="text-xs dark:text-gray-400 text-gray-500">
            {card.issue}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 bg-gray-100 text-gray-600">
            Wave {card.wave}
          </span>
        </div>

        <h3 className="text-lg font-semibold dark:text-gray-100 text-gray-900 mb-2">
          {card.title || card.issue}
        </h3>

        {card.description && (
          <p className="text-sm dark:text-gray-400 text-gray-600 mb-4">
            {card.description}
          </p>
        )}

        {/* Labels */}
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {card.labels.map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium dark:bg-gray-700 dark:text-gray-300 bg-gray-100 text-gray-600"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs dark:text-gray-500 text-gray-400">Status:</span>
          <span className="text-xs font-medium dark:text-gray-200 text-gray-700">
            {card.status}
          </span>
        </div>

        {/* Evidence */}
        {card.evidence && (
          <div className="mb-4">
            <span className="text-xs dark:text-gray-500 text-gray-400 block mb-1">
              Evidence:
            </span>
            <span className="text-xs dark:text-gray-300 text-gray-600">
              {card.evidence}
            </span>
          </div>
        )}

        {/* Assigned agent */}
        <div className="mb-4">
          <span className="text-xs dark:text-gray-500 text-gray-400 block mb-1">
            Assigned Agent:
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm dark:text-gray-200 text-gray-700">
              {AGENT_NAMES[card.agent] || card.agent} ({card.agent})
            </span>
          </div>
        </div>

        {/* Linked commits */}
        {linkedCommits.length > 0 && (
          <div>
            <span className="text-xs dark:text-gray-500 text-gray-400 block mb-2">
              Linked Commits ({linkedCommits.length}):
            </span>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {linkedCommits.map((commit) => (
                <div
                  key={commit.hash}
                  className="flex items-center gap-2 text-xs p-1.5 rounded dark:bg-gray-700/50 bg-gray-50"
                >
                  <code className="font-mono text-blue-400">
                    {commit.hash.slice(0, 7)}
                  </code>
                  <span
                    className={`px-1.5 py-0 rounded text-[10px] font-medium ${
                      commit.type === 'feat'
                        ? 'bg-green-500/20 text-green-400'
                        : commit.type === 'fix'
                        ? 'bg-red-500/20 text-red-400'
                        : commit.type === 'test'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'dark:bg-gray-600 dark:text-gray-300 bg-gray-200 text-gray-600'
                    }`}
                  >
                    {commit.type}
                  </span>
                  <span className="dark:text-gray-400 text-gray-500 truncate flex-1">
                    {commit.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {linkedCommits.length === 0 && (
          <p className="text-xs dark:text-gray-600 text-gray-400 italic">
            No linked commits found
          </p>
        )}
      </div>
    </div>
  );
};

interface KanbanCardItemProps {
  card: KanbanCard;
  onClick: () => void;
}

const KanbanCardItem: React.FC<KanbanCardItemProps> = ({ card, onClick }) => {
  const color = AGENT_COLORS[card.agent] || '#6B7280';

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
      style={{ borderLeftWidth: '3px', borderLeftColor: color }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span
          className="px-1.5 py-0 rounded text-[10px] font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {card.agent}
        </span>
        <span className="text-[10px] dark:text-gray-500 text-gray-400">
          W{card.wave}
        </span>
      </div>
      <p className="text-xs font-medium dark:text-gray-200 text-gray-700 line-clamp-2 mb-1.5">
        {card.title || card.issue}
      </p>
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {card.labels.slice(0, 3).map((label) => (
            <span
              key={label}
              className="px-1.5 py-0 rounded text-[9px] dark:bg-gray-700 dark:text-gray-400 bg-gray-100 text-gray-500"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </button>
  );
};

export const KanbanPanel: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const getCardsByColumn = useKanbanStore((s) => s.getCardsByColumn);
  const filteredCards = useKanbanStore((s) => s.getFilteredCards());

  // Check if we have any cards at all
  const hasCards = filteredCards.length > 0;

  return (
    <div>
      <h2 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">
        Kanban Board
      </h2>

      {!hasCards ? (
        <div className="card p-8 text-center">
          <p className="dark:text-gray-500 text-gray-400 text-sm">No kanban cards yet</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((column) => {
            const cards = getCardsByColumn(column);
            const isBlocked = column === 'Blocked';

            return (
              <div
                key={column}
                className={`flex flex-col min-w-[220px] max-w-[280px] flex-1 rounded-lg ${
                  isBlocked
                    ? 'dark:bg-red-500/5 bg-red-50 border border-red-500/20'
                    : 'dark:bg-gray-800/50 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-700 border-gray-200">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isBlocked ? 'text-red-400' : 'dark:text-gray-400 text-gray-500'
                    }`}
                  >
                    {column}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isBlocked
                        ? 'bg-red-500/20 text-red-400'
                        : 'dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-gray-500'
                    }`}
                  >
                    {cards.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-2 flex-1 min-h-[100px]">
                  {cards.map((card) => (
                    <KanbanCardItem
                      key={card.id}
                      card={card}
                      onClick={() => setSelectedCard(card)}
                    />
                  ))}
                  {cards.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-[10px] dark:text-gray-600 text-gray-400 italic">
                        Empty
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Card detail modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};
