import React from 'react';
import type { GraphNode, GraphEdge } from '../../types/algorithm';

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const nodeStateColor: Record<string, string> = {
  default: '#475569',
  comparing: '#f59e0b',
  active: '#3b82f6',
  swapping: '#f97316',
  selected: '#8b5cf6',
  sorted: '#10b981',
  visited: '#14b8a6',
  current: '#6366f1',
  path: '#fbbf24',
  found: '#4ade80',
};

const edgeStateColor: Record<string, string> = {
  default: '#334155',
  path: '#fbbf24',
  active: '#6366f1',
  visited: '#14b8a6',
};

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ nodes, edges }) => {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 620 440"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;

        const color = edgeStateColor[edge.state] ?? edgeStateColor.default;
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;

        return (
          <g key={i}>
            <line
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={color}
              strokeWidth={edge.state !== 'default' ? 2.5 : 1.5}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            {edge.weight !== undefined && (
              <text
                x={midX} y={midY - 6}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
              >
                {edge.weight}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map(node => {
        const color = nodeStateColor[node.state] ?? nodeStateColor.default;
        const isActive = node.state !== 'default';

        return (
          <g key={node.id} className="graph-node">
            <circle
              cx={node.x} cy={node.y} r={24}
              fill={color}
              stroke={isActive ? 'white' : '#1e293b'}
              strokeWidth={isActive ? 2 : 1.5}
              className="transition-all duration-300"
              style={{ filter: isActive ? 'drop-shadow(0 0 6px rgba(99,102,241,0.5))' : 'none' }}
            />
            <text
              x={node.x} y={node.y + 5}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
