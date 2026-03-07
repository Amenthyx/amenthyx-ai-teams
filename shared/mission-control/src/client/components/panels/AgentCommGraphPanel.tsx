import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCommStore } from '../../stores/commStore';
import { useAgentStore } from '../../stores/agentStore';
import { Network, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { AGENT_COLORS, AGENT_NAMES } from '../../types/events';

interface GraphNode {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  messageCount: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

interface Tooltip {
  x: number;
  y: number;
  node: GraphNode;
  sent: number;
  received: number;
  connections: number;
}

const REPULSION = 8000;
const ATTRACTION = 0.005;
const DAMPING = 0.85;
const CENTER_GRAVITY = 0.01;
const MAX_ITERATIONS = 60;
const MIN_NODE_RADIUS = 14;
const MAX_NODE_RADIUS = 32;
const MIN_EDGE_WIDTH = 1;
const MAX_EDGE_WIDTH = 8;

function runForceSimulation(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number,
  iterations: number
): void {
  const cx = width / 2;
  const cy = height / 2;

  for (let iter = 0; iter < iterations; iter++) {
    // Coulomb repulsion between all node pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distSq = Math.max(dx * dx + dy * dy, 100);
        const force = REPULSION / distSq;
        const dist = Math.sqrt(distSq);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx += fx;
        nodes[i].vy += fy;
        nodes[j].vx -= fx;
        nodes[j].vy -= fy;
      }
    }

    // Hooke attraction along edges
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    for (const edge of edges) {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (!src || !tgt) continue;
      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const force = ATTRACTION * dist * (1 + edge.weight * 0.1);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      src.vx += fx;
      src.vy += fy;
      tgt.vx -= fx;
      tgt.vy -= fy;
    }

    // Center gravity
    for (const node of nodes) {
      node.vx += (cx - node.x) * CENTER_GRAVITY;
      node.vy += (cy - node.y) * CENTER_GRAVITY;
    }

    // Apply velocities with damping
    for (const node of nodes) {
      if (node.fx != null) {
        node.x = node.fx;
        node.y = node.fy!;
        node.vx = 0;
        node.vy = 0;
        continue;
      }
      node.vx *= DAMPING;
      node.vy *= DAMPING;
      node.x += node.vx;
      node.y += node.vy;
      // Clamp inside bounds
      node.x = Math.max(40, Math.min(width - 40, node.x));
      node.y = Math.max(40, Math.min(height - 40, node.y));
    }
  }
}

export function AgentCommGraphPanel() {
  const messages = useCommStore((s) => s.messages);
  const getAllAgents = useAgentStore((s) => s.getAllAgents);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  // Observe container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Build graph data from stores
  useEffect(() => {
    const agents = getAllAgents();
    const senderReceiverCounts = new Map<string, number>();
    const agentSent = new Map<string, number>();
    const agentReceived = new Map<string, number>();

    for (const msg of messages) {
      const key = [msg.sender, msg.receiver].sort().join('->');
      senderReceiverCounts.set(key, (senderReceiverCounts.get(key) || 0) + 1);
      agentSent.set(msg.sender, (agentSent.get(msg.sender) || 0) + 1);
      agentReceived.set(msg.receiver, (agentReceived.get(msg.receiver) || 0) + 1);
    }

    // Collect all unique agent IDs from messages + store
    const agentIds = new Set<string>();
    agents.forEach((a) => agentIds.add(a.role));
    messages.forEach((m) => {
      agentIds.add(m.sender);
      agentIds.add(m.receiver);
    });

    const { width, height } = dimensions;
    const newNodes: GraphNode[] = Array.from(agentIds).map((id, i) => {
      const angle = (2 * Math.PI * i) / agentIds.size;
      const r = Math.min(width, height) * 0.3;
      const total = (agentSent.get(id) || 0) + (agentReceived.get(id) || 0);
      const storeAgent = agents.find((a) => a.role === id);
      return {
        id,
        label: storeAgent?.name || AGENT_NAMES[id] || id,
        color: storeAgent?.color || AGENT_COLORS[id] || '#6B7280',
        x: width / 2 + Math.cos(angle) * r,
        y: height / 2 + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        messageCount: total,
      };
    });

    const newEdges: GraphEdge[] = [];
    for (const [key, weight] of senderReceiverCounts.entries()) {
      const [source, target] = key.split('->');
      newEdges.push({ source, target, weight });
    }

    runForceSimulation(newNodes, newEdges, width, height, MAX_ITERATIONS);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [messages, getAllAgents, dimensions]);

  const maxMessages = Math.max(1, ...nodes.map((n) => n.messageCount));
  const maxEdgeWeight = Math.max(1, ...edges.map((e) => e.weight));

  const nodeRadius = (count: number) =>
    MIN_NODE_RADIUS + ((count / maxMessages) * (MAX_NODE_RADIUS - MIN_NODE_RADIUS));

  const edgeWidth = (weight: number) =>
    MIN_EDGE_WIDTH + ((weight / maxEdgeWeight) * (MAX_EDGE_WIDTH - MIN_EDGE_WIDTH));

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const handleMouseDown = useCallback((nodeId: string) => {
    setDragNode(nodeId);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!dragNode) return;
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      setNodes((prev) =>
        prev.map((n) => (n.id === dragNode ? { ...n, x, y, fx: x, fy: y } : n))
      );
    },
    [dragNode, zoom]
  );

  const handleMouseUp = useCallback(() => {
    if (dragNode) {
      setNodes((prev) =>
        prev.map((n) => (n.id === dragNode ? { ...n, fx: null, fy: null } : n))
      );
      setDragNode(null);
    }
  }, [dragNode]);

  const handleNodeHover = useCallback(
    (nodeId: string | null, e?: React.MouseEvent) => {
      setHoveredNode(nodeId);
      if (nodeId && e) {
        const node = nodeMap.get(nodeId);
        if (!node) return;
        const sent = messages.filter((m) => m.sender === nodeId).length;
        const received = messages.filter((m) => m.receiver === nodeId).length;
        const connections = edges.filter(
          (ed) => ed.source === nodeId || ed.target === nodeId
        ).length;
        setTooltip({
          x: e.clientX,
          y: e.clientY,
          node,
          sent,
          received,
          connections,
        });
      } else {
        setTooltip(null);
      }
    },
    [messages, edges, nodeMap]
  );

  const resetZoom = () => setZoom(1);

  // Unique roles present in edges for the legend
  const legendRoles = Array.from(new Set(nodes.map((n) => n.id)));

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Network size={16} className="text-cyan-400" />
        <h3 className="text-sm font-semibold dark:text-white text-gray-900">
          Agent Communication Graph
        </h3>
        <span className="ml-auto text-xs dark:text-gray-500 text-gray-400">
          {edges.length} connections
        </span>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
            className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-200 dark:text-gray-400 text-gray-500"
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}
            className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-200 dark:text-gray-400 text-gray-500"
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={resetZoom}
            className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-200 dark:text-gray-400 text-gray-500"
            title="Reset zoom"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Graph area */}
      <div ref={containerRef} className="relative flex-1 min-h-[320px] overflow-hidden">
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs dark:text-gray-500 text-gray-400">
            No agent communications to visualize
          </div>
        ) : (
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <g transform={`scale(${zoom})`}>
              {/* Edges */}
              {edges.map((edge) => {
                const src = nodeMap.get(edge.source);
                const tgt = nodeMap.get(edge.target);
                if (!src || !tgt) return null;
                const isHighlighted =
                  hoveredNode === edge.source || hoveredNode === edge.target;
                const isDimmed = hoveredNode && !isHighlighted;
                return (
                  <g key={`${edge.source}-${edge.target}`}>
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke={isHighlighted ? '#60A5FA' : '#4B5563'}
                      strokeWidth={edgeWidth(edge.weight)}
                      strokeOpacity={isDimmed ? 0.15 : isHighlighted ? 0.9 : 0.4}
                    />
                    {/* Edge label */}
                    <text
                      x={(src.x + tgt.x) / 2}
                      y={(src.y + tgt.y) / 2 - 6}
                      textAnchor="middle"
                      className="text-[9px] fill-gray-500"
                      opacity={isDimmed ? 0.1 : 0.7}
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const r = nodeRadius(node.messageCount);
                const isHighlighted = hoveredNode === node.id;
                const isDimmed =
                  hoveredNode &&
                  hoveredNode !== node.id &&
                  !edges.some(
                    (e) =>
                      (e.source === hoveredNode && e.target === node.id) ||
                      (e.target === hoveredNode && e.source === node.id)
                  );
                return (
                  <g
                    key={node.id}
                    style={{ cursor: 'grab' }}
                    onMouseDown={() => handleMouseDown(node.id)}
                    onMouseEnter={(e) => handleNodeHover(node.id, e)}
                    onMouseLeave={() => handleNodeHover(null)}
                  >
                    {/* Glow ring on hover */}
                    {isHighlighted && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r + 4}
                        fill="none"
                        stroke={node.color}
                        strokeWidth={2}
                        strokeOpacity={0.5}
                      />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r}
                      fill={node.color}
                      fillOpacity={isDimmed ? 0.2 : 0.85}
                      stroke={isHighlighted ? '#fff' : node.color}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeOpacity={isDimmed ? 0.2 : 1}
                    />
                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[10px] font-bold fill-white pointer-events-none"
                      opacity={isDimmed ? 0.2 : 1}
                    >
                      {node.id}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + r + 12}
                      textAnchor="middle"
                      className="text-[9px] dark:fill-gray-400 fill-gray-600 pointer-events-none"
                      opacity={isDimmed ? 0.15 : 0.8}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 px-3 py-2 rounded-lg dark:bg-gray-900 bg-white border dark:border-gray-600 border-gray-300 shadow-lg pointer-events-none"
            style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
          >
            <p className="text-xs font-semibold dark:text-white text-gray-900">
              {tooltip.node.label}{' '}
              <span className="font-normal dark:text-gray-400 text-gray-500">
                ({tooltip.node.id})
              </span>
            </p>
            <div className="mt-1 space-y-0.5 text-[10px] dark:text-gray-400 text-gray-500">
              <p>Sent: {tooltip.sent}</p>
              <p>Received: {tooltip.received}</p>
              <p>Connections: {tooltip.connections}</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t dark:border-gray-700 border-gray-200">
        {legendRoles.map((role) => {
          const node = nodeMap.get(role);
          if (!node) return null;
          return (
            <div key={role} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: node.color }}
              />
              <span className="text-[10px] dark:text-gray-400 text-gray-500">
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
