import React, { useCallback } from 'react';
import { useWidgetStore, Widget } from '../stores/widgetStore';
import { BarChart3, Gauge, Users, Activity, Clock, Zap, X, GripVertical } from 'lucide-react';

interface WidgetTemplate {
  type: string;
  title: string;
  icon: React.ReactNode;
  defaultW: number;
  defaultH: number;
}

const WIDGET_PALETTE: WidgetTemplate[] = [
  { type: 'event-count', title: 'Event Count', icon: <Activity size={16} />, defaultW: 2, defaultH: 1 },
  { type: 'budget-gauge', title: 'Budget Gauge', icon: <Gauge size={16} />, defaultW: 2, defaultH: 2 },
  { type: 'agent-status', title: 'Agent Status', icon: <Users size={16} />, defaultW: 2, defaultH: 2 },
  { type: 'throughput', title: 'Throughput', icon: <BarChart3 size={16} />, defaultW: 3, defaultH: 2 },
  { type: 'latency', title: 'Latency', icon: <Clock size={16} />, defaultW: 2, defaultH: 1 },
  { type: 'token-usage', title: 'Token Usage', icon: <Zap size={16} />, defaultW: 2, defaultH: 2 },
];

function WidgetCard({ widget, onRemove }: { widget: Widget; onRemove: (id: string) => void }) {
  const template = WIDGET_PALETTE.find((t) => t.type === widget.type);

  return (
    <div
      className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4 relative group"
      style={{
        gridColumn: `span ${widget.w}`,
        gridRow: `span ${widget.h}`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="dark:text-gray-600 text-gray-400 cursor-grab" />
          <span className="text-sm font-medium dark:text-white text-gray-900">
            {widget.title}
          </span>
        </div>
        <button
          onClick={() => onRemove(widget.id)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400 transition-all"
          title="Remove widget"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex items-center justify-center h-20 dark:text-gray-500 text-gray-400 text-xs">
        {template ? (
          <div className="flex flex-col items-center gap-2">
            {template.icon}
            <span>{widget.type} widget</span>
          </div>
        ) : (
          <span>Unknown widget type</span>
        )}
      </div>
    </div>
  );
}

export function WidgetBuilderPage() {
  const widgets = useWidgetStore((s) => s.widgets);
  const addWidget = useWidgetStore((s) => s.addWidget);
  const removeWidget = useWidgetStore((s) => s.removeWidget);

  const handleAddWidget = useCallback(
    (template: WidgetTemplate) => {
      const maxY = widgets.reduce((max, w) => Math.max(max, w.y + w.h), 0);
      addWidget({
        id: `widget-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: template.type,
        title: template.title,
        x: 0,
        y: maxY,
        w: template.defaultW,
        h: template.defaultH,
        config: {},
      });
    },
    [widgets, addWidget]
  );

  return (
    <div className="p-6 flex gap-6">
      {/* Widget Palette */}
      <div className="w-56 flex-shrink-0 space-y-3">
        <h2 className="text-lg font-bold dark:text-white text-gray-900">
          Widget Palette
        </h2>
        <p className="text-xs dark:text-gray-400 text-gray-600">
          Click to add widgets to your dashboard grid.
        </p>
        <div className="space-y-2">
          {WIDGET_PALETTE.map((template) => (
            <button
              key={template.type}
              onClick={() => handleAddWidget(template)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white hover:border-blue-500 dark:text-gray-300 text-gray-700 transition text-sm text-left"
            >
              <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-400">
                {template.icon}
              </div>
              <div>
                <div className="font-medium">{template.title}</div>
                <div className="text-xs dark:text-gray-500 text-gray-400">
                  {template.defaultW}x{template.defaultH}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Widget Grid */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold dark:text-white text-gray-900">
            Widget Builder
          </h1>
          <span className="text-sm dark:text-gray-400 text-gray-500">
            {widgets.length} widget{widgets.length !== 1 ? 's' : ''} placed
          </span>
        </div>

        {widgets.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed dark:border-gray-700 border-gray-300 p-16 text-center">
            <div className="dark:text-gray-500 text-gray-400 space-y-2">
              <BarChart3 size={32} className="mx-auto opacity-50" />
              <p className="text-sm">No widgets yet</p>
              <p className="text-xs">Click items in the palette to add widgets</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4 auto-rows-[80px]">
            {widgets.map((widget) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                onRemove={removeWidget}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
