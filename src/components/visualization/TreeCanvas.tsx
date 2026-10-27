import React from 'react';
import type { TreeNode } from '../../types/algorithm';

interface TreeCanvasProps {
  root: TreeNode | null;
}

interface LayoutNode {
  id: number;
  value: number;
  state: string;
  x: number;
  y: number;
  left?: LayoutNode;
  right?: LayoutNode;
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
  found: '#22c55e',
  excluded: '#334155',
};

// Layout tree nodes hierarchically
function layoutTree(
  node: TreeNode | null,
  x = 300,
  y = 45,
  level = 0,
  spread = 130
): LayoutNode | null {
  if (!node) return null;

  const current: LayoutNode = {
    id: node.id,
    value: node.value,
    state: node.state,
    x,
    y,
  };

  const nextSpread = Math.max(spread / 1.7, 36);
  const nextY = y + 70;

  if (node.left) {
    current.left = layoutTree(node.left, x - spread, nextY, level + 1, nextSpread) ?? undefined;
  }
  if (node.right) {
    current.right = layoutTree(node.right, x + spread, nextY, level + 1, nextSpread) ?? undefined;
  }

  return current;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({ root }) => {
  if (!root) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Empty tree
      </div>
    );
  }

  const layout = layoutTree(root);

  // Collect edges and nodes for rendering
  const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const nodes: LayoutNode[] = [];

  function traverse(n: LayoutNode) {
    nodes.push(n);
    if (n.left) {
      edges.push({ x1: n.x, y1: n.y, x2: n.left.x, y2: n.left.y });
      traverse(n.left);
    }
    if (n.right) {
      edges.push({ x1: n.x, y1: n.y, x2: n.right.x, y2: n.right.y });
      traverse(n.right);
    }
  }

  if (layout) {
    traverse(layout);
  }

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 600 380"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Branches */}
      {edges.map((edge, i) => (
        <line
          key={`edge-${i}`}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      ))}

      {/* Nodes */}
      {nodes.map(node => {
        const color = nodeStateColor[node.state] ?? nodeStateColor.default;
        const isActive = node.state !== 'default';

        return (
          <g key={node.id} className="transition-all duration-300">
            <circle
              cx={node.x}
              cy={node.y}
              r={20}
              fill={color}
              stroke={isActive ? '#ffffff' : '#1e293b'}
              strokeWidth={isActive ? 2.5 : 1.5}
              className="transition-colors duration-300"
              style={{
                filter: isActive ? 'drop-shadow(0 0 8px rgba(99,102,241,0.6))' : 'none',
              }}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill="white"
              fontSize="13"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
            >
              {node.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
