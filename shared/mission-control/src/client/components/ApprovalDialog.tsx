import React, { useCallback, useState } from 'react';
import { AlertTriangle, GitMerge, CreditCard, Users, HelpCircle, Shield, X } from 'lucide-react';
import { useGateStore } from '../stores/gateStore';
import type { GateEvent, GateType, GateDecision } from '../types/events';

interface ActionButton {
  label: string;
  decision: GateDecision;
  variant: 'primary' | 'secondary' | 'danger';
}

function getGateConfig(gate: GateEvent): {
  title: string;
  icon: React.ReactNode;
  borderColor: string;
  actions: ActionButton[];
} {
  const type = gate.gate_type as GateType;

  switch (type) {
    case 'cost_estimation':
      return {
        title: 'Cost Estimation Approval',
        icon: <CreditCard size={20} className="text-amber-400" />,
        borderColor: 'border-amber-500/60',
        actions: [
          { label: 'Approve', decision: 'approved', variant: 'primary' },
          { label: 'Approve with Cap', decision: 'approved_with_cap', variant: 'secondary' },
          { label: 'Too Expensive', decision: 'too_expensive', variant: 'danger' },
          { label: 'Change', decision: 'change', variant: 'secondary' },
        ],
      };
    case 'merge':
      return {
        title: 'Merge Request Approval',
        icon: <GitMerge size={20} className="text-blue-400" />,
        borderColor: 'border-blue-500/60',
        actions: [
          { label: 'Approve', decision: 'approved', variant: 'primary' },
          { label: 'Not Yet', decision: 'not_yet', variant: 'secondary' },
          { label: 'Reject', decision: 'rejected', variant: 'danger' },
        ],
      };
    case 'payment':
      return {
        title: 'Payment Required',
        icon: <CreditCard size={20} className="text-red-400" />,
        borderColor: 'border-red-500/60',
        actions: [
          { label: 'Approve', decision: 'approved', variant: 'primary' },
          { label: 'Reject', decision: 'rejected', variant: 'danger' },
        ],
      };
    case 'scaling':
      return {
        title: 'Scaling Approval',
        icon: <Users size={20} className="text-purple-400" />,
        borderColor: 'border-purple-500/60',
        actions: [
          { label: 'Approve', decision: 'approved', variant: 'primary' },
          { label: 'Reject', decision: 'rejected', variant: 'danger' },
        ],
      };
    case 'uncertainty':
      return {
        title: 'Agent Needs Guidance',
        icon: <HelpCircle size={20} className="text-cyan-400" />,
        borderColor: 'border-cyan-500/60',
        actions: [
          { label: 'Yes', decision: 'yes', variant: 'primary' },
          { label: 'No', decision: 'no', variant: 'danger' },
          { label: 'Alternative', decision: 'alternative', variant: 'secondary' },
        ],
      };
    default:
      return {
        title: 'Gate Approval',
        icon: <Shield size={20} className="text-gray-400" />,
        borderColor: 'border-gray-500/60',
        actions: [
          { label: 'Acknowledge', decision: 'acknowledged', variant: 'primary' },
        ],
      };
  }
}

function getButtonClasses(variant: ActionButton['variant']): string {
  switch (variant) {
    case 'primary':
      return 'bg-green-600 hover:bg-green-700 text-white';
    case 'secondary':
      return 'bg-gray-600 hover:bg-gray-700 text-white';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white';
  }
}

function CostEstimationPayload({ payload }: { payload: Record<string, unknown> }) {
  const entries = Object.entries(payload).filter(([k]) => k !== 'total' && k !== 'external');
  const total = payload.total as number | undefined;
  const external = payload.external as number | undefined;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm space-y-1">
      {entries.map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="text-gray-400">{key}:</span>
          <span className="text-gray-200">${typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
        </div>
      ))}
      {(entries.length > 0 && total !== undefined) && (
        <div className="border-t border-gray-600 my-2" />
      )}
      {total !== undefined && (
        <div className="flex justify-between font-bold">
          <span className="text-gray-300">Total Estimated:</span>
          <span className="text-white">${total.toFixed(2)}</span>
        </div>
      )}
      {external !== undefined && (
        <div className="flex justify-between">
          <span className="text-gray-400">External Costs:</span>
          <span className="text-gray-200">${external.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

function MergePayload({ payload }: { payload: Record<string, unknown> }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 text-sm space-y-2">
      {payload.branch ? (
        <div><span className="text-gray-400">Branch:</span> <span className="text-blue-300 font-mono">{String(payload.branch)}</span></div>
      ) : null}
      {payload.target ? (
        <div><span className="text-gray-400">Target:</span> <span className="text-green-300 font-mono">{String(payload.target)}</span></div>
      ) : null}
      {payload.summary ? (
        <div className="text-gray-300 mt-2">{String(payload.summary)}</div>
      ) : null}
      {payload.files_changed !== undefined && (
        <div><span className="text-gray-400">Files changed:</span> <span className="text-gray-200">{String(payload.files_changed)}</span></div>
      )}
    </div>
  );
}

function GenericPayload({ payload }: { payload: Record<string, unknown> }) {
  const entries = Object.entries(payload);
  if (entries.length === 0) return null;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 text-sm space-y-1">
      {entries.map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="text-gray-400">{key}:</span>
          <span className="text-gray-200">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
        </div>
      ))}
    </div>
  );
}

function PayloadDisplay({ gate }: { gate: GateEvent }) {
  switch (gate.gate_type) {
    case 'cost_estimation':
      return <CostEstimationPayload payload={gate.payload} />;
    case 'merge':
      return <MergePayload payload={gate.payload} />;
    default:
      return <GenericPayload payload={gate.payload} />;
  }
}

export const ApprovalDialog: React.FC = () => {
  const { pendingGates, dialogOpen, closeDialog } = useGateStore();
  const resolveGate = useGateStore((s) => s.resolveGate);
  const dismissGate = useGateStore((s) => s.dismissGate);
  const [loading, setLoading] = useState(false);

  const activeGate = pendingGates.length > 0 ? pendingGates[0] : null;

  const handleAction = useCallback(async (gate: GateEvent, decision: GateDecision) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gates/${gate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });

      if (res.ok) {
        resolveGate(gate.id, decision);
      }
    } catch {
      // Still resolve locally if server request fails
      resolveGate(gate.id, decision);
    } finally {
      setLoading(false);
    }
  }, [resolveGate]);

  const handleDismiss = useCallback((gate: GateEvent) => {
    if (gate.blocking !== false) return; // Cannot dismiss blocking gates
    dismissGate(gate.id);
  }, [dismissGate]);

  if (!dialogOpen || !activeGate) return null;

  const config = getGateConfig(activeGate);
  const isBlocking = activeGate.blocking !== false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => { if (!isBlocking) closeDialog(); }}
    >
      <div
        className={`relative w-full max-w-lg mx-4 rounded-xl border-2 ${config.borderColor} bg-gray-900 shadow-2xl animate-gate-pulse`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">APPROVAL REQUIRED</h2>
          </div>
          {pendingGates.length > 1 && (
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
              {pendingGates.length} pending
            </span>
          )}
          {!isBlocking && (
            <button
              onClick={() => handleDismiss(activeGate)}
              className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* Gate type and source */}
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <div className="text-white font-semibold">{config.title}</div>
              {activeGate.source && (
                <div className="text-xs text-gray-400">From: {activeGate.source}</div>
              )}
            </div>
          </div>

          {/* Message */}
          {activeGate.message && (
            <p className="text-gray-300 text-sm leading-relaxed">{activeGate.message}</p>
          )}

          {/* Payload details */}
          <PayloadDisplay gate={activeGate} />

          {/* Action prompt */}
          <p className="text-gray-400 text-sm">What would you like to do?</p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {config.actions.map((action) => (
              <button
                key={action.decision}
                onClick={() => handleAction(activeGate, action.decision)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonClasses(action.variant)}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer — timestamp */}
        <div className="px-6 py-3 border-t border-gray-700 text-xs text-gray-500">
          Gate opened {new Date(activeGate.created_at).toLocaleString()}
        </div>
      </div>

      {/* CSS animation for pulsing border */}
      <style>{`
        @keyframes gate-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.3); }
          50% { box-shadow: 0 0 20px 4px rgba(245, 158, 11, 0.15); }
        }
        .animate-gate-pulse {
          animation: gate-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
