import React, { useState, useEffect, useCallback } from 'react';
import { Webhook, Plus, Trash2, Play, ToggleLeft, ToggleRight, Shield } from 'lucide-react';
import { EventCategory } from '../../types/events';

interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  hasSecret: boolean;
  platform: 'slack' | 'discord' | 'generic';
  createdAt: string;
}

type Platform = 'slack' | 'discord' | 'generic';

const EVENT_CATEGORIES = Object.values(EventCategory);

const PLATFORM_LABELS: Record<Platform, string> = {
  slack: 'Slack',
  discord: 'Discord',
  generic: 'Generic JSON',
};

const PLATFORM_COLORS: Record<Platform, string> = {
  slack: 'text-green-400',
  discord: 'text-indigo-400',
  generic: 'text-gray-400',
};

export function WebhookConfigPanel() {
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  // Form state
  const [formUrl, setFormUrl] = useState('');
  const [formPlatform, setFormPlatform] = useState<Platform>('generic');
  const [formSecret, setFormSecret] = useState('');
  const [formEvents, setFormEvents] = useState<Set<string>>(new Set());

  const fetchWebhooks = useCallback(async () => {
    try {
      const res = await fetch('/api/webhooks');
      if (res.ok) {
        setWebhooks(await res.json());
      }
    } catch {
      // Silently fail — panel will show empty state
    }
  }, []);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  const handleAdd = async () => {
    if (!formUrl.trim()) return;
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formUrl.trim(),
          platform: formPlatform,
          secret: formSecret || undefined,
          events: Array.from(formEvents),
        }),
      });
      if (res.ok) {
        setFormUrl('');
        setFormPlatform('generic');
        setFormSecret('');
        setFormEvents(new Set());
        setShowForm(false);
        await fetchWebhooks();
      }
    } catch {
      // Error handling deferred to toast system
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
      setConfirmDelete(null);
      await fetchWebhooks();
    } catch {
      // noop
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      });
      await fetchWebhooks();
    } catch {
      // noop
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      await fetch(`/api/webhooks/${id}/test`, { method: 'POST' });
    } catch {
      // noop
    } finally {
      setTimeout(() => setTestingId(null), 1500);
    }
  };

  const toggleEvent = (cat: string) => {
    setFormEvents((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Webhook size={16} className="text-orange-400" />
        <h3 className="text-sm font-semibold dark:text-white text-gray-900">
          Webhook Configuration
        </h3>
        <span className="ml-auto text-xs dark:text-gray-500 text-gray-400">
          {webhooks.length} configured
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-2 p-1.5 rounded-lg dark:bg-gray-700 bg-gray-200 dark:hover:bg-gray-600 hover:bg-gray-300 dark:text-gray-300 text-gray-600 transition-colors"
          title="Add webhook"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-lg dark:bg-gray-900/50 bg-gray-50 border dark:border-gray-700 border-gray-200 space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wide dark:text-gray-500 text-gray-400 mb-1">
              Webhook URL
            </label>
            <input
              type="url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full px-2.5 py-1.5 rounded dark:bg-gray-800 bg-white border dark:border-gray-600 border-gray-300 text-xs dark:text-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wide dark:text-gray-500 text-gray-400 mb-1">
                Platform
              </label>
              <select
                value={formPlatform}
                onChange={(e) => setFormPlatform(e.target.value as Platform)}
                className="w-full px-2.5 py-1.5 rounded dark:bg-gray-800 bg-white border dark:border-gray-600 border-gray-300 text-xs dark:text-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => (
                  <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wide dark:text-gray-500 text-gray-400 mb-1">
                Secret (HMAC)
              </label>
              <input
                type="password"
                value={formSecret}
                onChange={(e) => setFormSecret(e.target.value)}
                placeholder="Optional signing secret"
                className="w-full px-2.5 py-1.5 rounded dark:bg-gray-800 bg-white border dark:border-gray-600 border-gray-300 text-xs dark:text-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wide dark:text-gray-500 text-gray-400 mb-1.5">
              Event Filters (empty = all events)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleEvent(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                    formEvents.has(cat)
                      ? 'dark:bg-blue-600/30 bg-blue-100 dark:border-blue-500 border-blue-300 dark:text-blue-300 text-blue-700'
                      : 'dark:bg-gray-800 bg-gray-100 dark:border-gray-600 border-gray-300 dark:text-gray-500 text-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded text-xs dark:text-gray-400 text-gray-500 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!formUrl.trim()}
              className="px-3 py-1.5 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add Webhook
            </button>
          </div>
        </div>
      )}

      {/* Webhook list */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {webhooks.length === 0 && !showForm ? (
          <div className="text-xs dark:text-gray-500 text-gray-400 text-center py-8">
            No webhooks configured. Click + to add one.
          </div>
        ) : (
          webhooks.map((wh) => (
            <div
              key={wh.id}
              className={`p-3 rounded-lg border transition-colors ${
                wh.active
                  ? 'dark:bg-gray-900/40 bg-gray-50 dark:border-gray-700 border-gray-200'
                  : 'dark:bg-gray-900/20 bg-gray-100/50 dark:border-gray-800 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold uppercase ${PLATFORM_COLORS[wh.platform]}`}>
                  {wh.platform}
                </span>
                {wh.hasSecret && (
                  <Shield size={10} className="text-yellow-500" title="HMAC signed" />
                )}
                <span className="flex-1 text-xs dark:text-gray-300 text-gray-700 truncate font-mono">
                  {wh.url}
                </span>

                {/* Actions */}
                <button
                  onClick={() => handleToggle(wh.id, wh.active)}
                  className="p-1 dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 transition-colors"
                  title={wh.active ? 'Deactivate' : 'Activate'}
                >
                  {wh.active ? <ToggleRight size={16} className="text-green-400" /> : <ToggleLeft size={16} />}
                </button>
                <button
                  onClick={() => handleTest(wh.id)}
                  disabled={testingId === wh.id}
                  className="p-1 dark:text-gray-400 text-gray-500 dark:hover:text-blue-400 hover:text-blue-600 transition-colors disabled:opacity-40"
                  title="Send test"
                >
                  <Play size={14} className={testingId === wh.id ? 'animate-pulse' : ''} />
                </button>
                {confirmDelete === wh.id ? (
                  <button
                    onClick={() => handleDelete(wh.id)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600/40 transition-colors"
                  >
                    Confirm
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(wh.id)}
                    className="p-1 dark:text-gray-400 text-gray-500 dark:hover:text-red-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Event tags */}
              {wh.events.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {wh.events.map((ev) => (
                    <span
                      key={ev}
                      className="px-1.5 py-0.5 rounded text-[9px] dark:bg-gray-800 bg-gray-200 dark:text-gray-500 text-gray-500"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
