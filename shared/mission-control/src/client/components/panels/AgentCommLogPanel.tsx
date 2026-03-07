import React from 'react';
import { useCommStore, CommMessage } from '../../stores/commStore';
import { MessageSquare } from 'lucide-react';

export function AgentCommLogPanel() {
  const messages = useCommStore((s) => s.messages);

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  const getAgentColor = (agent: string) => {
    const colors = [
      'text-blue-400',
      'text-green-400',
      'text-purple-400',
      'text-orange-400',
      'text-pink-400',
      'text-cyan-400',
      'text-yellow-400',
    ];
    let hash = 0;
    for (let i = 0; i < agent.length; i++) {
      hash = agent.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-purple-400" />
        <h3 className="text-sm font-semibold dark:text-white text-gray-900">
          Agent Communications
        </h3>
        <span className="ml-auto text-xs dark:text-gray-500 text-gray-400">
          {messages.length} messages
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-xs dark:text-gray-500 text-gray-400 text-center py-8">
            No inter-agent messages yet
          </div>
        ) : (
          messages.map((msg: CommMessage) => (
            <div key={msg.id} className="flex gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full dark:bg-gray-700 bg-gray-200 flex items-center justify-center">
                <span className={`text-xs font-bold ${getAgentColor(msg.sender)}`}>
                  {msg.sender.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Message bubble */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className={`text-xs font-semibold ${getAgentColor(msg.sender)}`}>
                    {msg.sender}
                  </span>
                  <span className="text-xs dark:text-gray-600 text-gray-400">
                    &rarr;
                  </span>
                  <span className={`text-xs font-semibold ${getAgentColor(msg.receiver)}`}>
                    {msg.receiver}
                  </span>
                  <span className="text-xs dark:text-gray-600 text-gray-400 ml-auto flex-shrink-0">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className="p-2 rounded-lg dark:bg-gray-900/50 bg-gray-50 border dark:border-gray-700/50 border-gray-200">
                  <p className="text-xs dark:text-gray-300 text-gray-700 whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                  {msg.context && (
                    <p className="text-xs dark:text-gray-600 text-gray-400 mt-1 font-mono">
                      ctx: {msg.context}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
