import React from 'react';
import { useNotificationStore, Notification } from '../../stores/notificationStore';
import { X, Bell, Check, Trash2, AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function getIcon(type: Notification['type']) {
  switch (type) {
    case 'error':
      return <AlertCircle size={16} className="text-red-400" />;
    case 'warning':
      return <AlertTriangle size={16} className="text-yellow-400" />;
    case 'success':
      return <CheckCircle size={16} className="text-green-400" />;
    default:
      return <Info size={16} className="text-blue-400" />;
  }
}

function getBorderColor(type: Notification['type']) {
  switch (type) {
    case 'error':
      return 'border-l-red-500';
    case 'warning':
      return 'border-l-yellow-500';
    case 'success':
      return 'border-l-green-500';
    default:
      return 'border-l-blue-500';
  }
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const clearAll = useNotificationStore((s) => s.clearAll);
  const unreadCount = useNotificationStore((s) => s.getUnread().length);

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return date.toLocaleDateString();
    } catch {
      return timestamp;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 dark:bg-gray-900 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 border-gray-200">
          <div className="flex items-center gap-2">
            <Bell size={18} className="dark:text-gray-300 text-gray-700" />
            <h2 className="text-lg font-semibold dark:text-white text-gray-900">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-600 text-white font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                title="Clear all"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-700 dark:text-gray-400 text-gray-500 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto h-[calc(100%-64px)] p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 dark:text-gray-500 text-gray-400">
              <Bell size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-lg border-l-4 ${getBorderColor(n.type)} ${
                  n.read
                    ? 'dark:bg-gray-800/30 bg-gray-50 opacity-60'
                    : 'dark:bg-gray-800/70 bg-gray-50'
                } transition`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="mt-0.5">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium dark:text-white text-gray-900 truncate">
                        {n.title}
                      </p>
                      <p className="text-xs dark:text-gray-400 text-gray-600 mt-0.5">
                        {n.message}
                      </p>
                      <p className="text-xs dark:text-gray-600 text-gray-400 mt-1">
                        {formatTime(n.timestamp)}
                      </p>
                    </div>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="p-1 rounded hover:bg-gray-700 dark:text-gray-400 text-gray-500 transition flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
