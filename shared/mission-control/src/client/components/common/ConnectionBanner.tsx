import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionBannerProps {
  status: 'connected' | 'connecting' | 'disconnected';
  reconnectCount?: number;
  onReconnect?: () => void;
}

export const ConnectionBanner: React.FC<ConnectionBannerProps> = ({ status, reconnectCount, onReconnect }) => {
  if (status === 'connected') return null;

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-2 bg-amber-500/15 border-b border-amber-500/30 text-amber-300 shrink-0">
      <WifiOff size={14} className="text-amber-400 shrink-0" />
      <span className="text-xs font-medium text-amber-400">
        {status === 'connecting'
          ? 'Reconnecting to server...'
          : 'Connection lost. Reconnecting...'}
      </span>
      <button
        onClick={onReconnect}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors duration-200"
      >
        <RefreshCw size={12} />
        Reconnect
      </button>
    </div>
  );
};
