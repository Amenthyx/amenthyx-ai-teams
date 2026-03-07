import React, { useEffect } from 'react';
import { Server } from 'lucide-react';
import { useServiceStore, ServiceInfo } from '../../stores/serviceStore';

function StatusDot({ status }: { status: ServiceInfo['status'] }) {
  const classes: Record<string, string> = {
    healthy: 'w-2.5 h-2.5 rounded-full bg-green-500',
    degraded: 'w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse',
    down: 'w-2.5 h-2.5 rounded-full bg-red-500',
  };
  return <span className={classes[status] || classes.down} />;
}

function StatusLabel({ status }: { status: ServiceInfo['status'] }) {
  const map: Record<string, { text: string; cls: string }> = {
    healthy: { text: 'Healthy', cls: 'text-green-400' },
    degraded: { text: 'Degraded', cls: 'text-yellow-400' },
    down: { text: 'Down', cls: 'text-red-400' },
  };
  const info = map[status] || map.down;
  return <span className={`text-xs font-medium ${info.cls}`}>{info.text}</span>;
}

export const ServiceStatusPanel: React.FC = () => {
  const services = useServiceStore((s) => s.services);
  const setServices = useServiceStore((s) => s.setServices);

  useEffect(() => {
    fetch('/api/services/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.services) setServices(data.services);
      })
      .catch(() => {});
  }, [setServices]);

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Server size={14} className="dark:text-gray-400 text-gray-500" />
        <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 uppercase tracking-wider">
          Service Status
        </h3>
      </div>

      {services.length === 0 ? (
        <p className="text-xs dark:text-gray-600 text-gray-400 italic text-center py-4">
          Loading services...
        </p>
      ) : (
        <div className="space-y-2">
          {services.map((svc) => (
            <div
              key={svc.name}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors"
            >
              <StatusDot status={svc.status} />
              <span className="text-xs font-medium dark:text-gray-200 text-gray-700 flex-1">
                {svc.name}
              </span>
              <StatusLabel status={svc.status} />
              {svc.latency > 0 && (
                <span className="text-[10px] dark:text-gray-500 text-gray-400 ml-1">
                  {svc.latency}ms
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
