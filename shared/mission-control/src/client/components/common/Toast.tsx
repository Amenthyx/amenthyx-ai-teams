import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useToastStore, type ToastType } from '../../stores/toastStore';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-green-400" />,
  error: <AlertCircle size={16} className="text-red-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  info: <Info size={16} className="text-blue-400" />,
};

const borderMap: Record<ToastType, string> = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
};

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm" role="alert" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${borderMap[toast.type]} dark:bg-gray-800 bg-white shadow-lg border dark:border-gray-700 border-gray-200 animate-slide-in`}
        >
          <span className="mt-0.5 shrink-0">{iconMap[toast.type]}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium dark:text-white text-gray-900">{toast.title}</div>
            {toast.message && (
              <div className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">{toast.message}</div>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-0.5 rounded dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={14} className="dark:text-gray-400 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
};
