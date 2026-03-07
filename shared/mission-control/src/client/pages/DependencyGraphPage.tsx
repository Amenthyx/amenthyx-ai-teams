import React, { useEffect, useState, useCallback } from 'react';
import { useAgentStore } from '../stores/agentStore';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

export function DependencyGraphPage() {
  const agents = useAgentStore((s) => s.agents);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const agentList = Array.isArray(agents) ? agents : [];
    const radius = 250;
    const centerX = 400;
    const centerY = 300;

    const graphNodes: GraphNode[] = agentList.map((agent: any, i: number) => {
      const angle = (2 * Math.PI * i) / Math.max(agentList.length, 1);
      return {
        id: agent.id || `agent-${i}`,
        label: agent.name || agent.id || `Agent ${i}`,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    const graphEdges: GraphEdge[] = [];
    agentList.forEach((agent: any) => {
      const deps: string[] = agent.dependencies || agent.depends_on || [];
      deps.forEach((depId: string) => {
        graphEdges.push({ from: agent.id || '', to: depId });
      });
    });

    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [agents]);

  const handleMouseDown = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(nodeId);
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
      }
    },
    [nodes]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragging
            ? { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y }
            : n
        )
      );
    },
    [dragging, offset]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const getNodeById = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold dark:text-white text-gray-900">
        Dependency Graph
      </h1>
      <p className="text-sm dark:text-gray-400 text-gray-600">
        Agent and task dependencies visualized as a node graph. Drag nodes to rearrange.
      </p>

      <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4 overflow-auto">
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-64 dark:text-gray-500 text-gray-400">
            No agents or dependencies to display
          </div>
        ) : (
          <svg
            width="800"
            height="600"
            className="w-full"
            viewBox="0 0 800 600"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  className="fill-blue-500"
                />
              </marker>
            </defs>

            {edges.map((edge, i) => {
              const fromNode = getNodeById(edge.from);
              const toNode = getNodeById(edge.to);
              if (!fromNode || !toNode) return null;
              return (
                <line
                  key={`edge-${i}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className="stroke-blue-500/50"
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <g
                  key={node.id}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  onClick={() => setSelectedNode(node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 28 : 24}
                    className={
                      isSelected
                        ? 'fill-blue-600 stroke-blue-400'
                        : 'fill-blue-500 stroke-blue-300'
                    }
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text
                    x={node.x}
                    y={node.y + 40}
                    textAnchor="middle"
                    className="fill-gray-300 text-xs"
                    fontSize={11}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {selectedNode && (
        <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
          <h3 className="text-sm font-semibold dark:text-white text-gray-900 mb-2">
            Selected: {nodes.find((n) => n.id === selectedNode)?.label}
          </h3>
          <div className="text-xs dark:text-gray-400 text-gray-600 space-y-1">
            <p>
              Depends on:{' '}
              {edges
                .filter((e) => e.from === selectedNode)
                .map((e) => getNodeById(e.to)?.label || e.to)
                .join(', ') || 'None'}
            </p>
            <p>
              Depended on by:{' '}
              {edges
                .filter((e) => e.to === selectedNode)
                .map((e) => getNodeById(e.from)?.label || e.from)
                .join(', ') || 'None'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
