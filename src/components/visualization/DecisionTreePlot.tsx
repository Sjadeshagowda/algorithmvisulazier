import React, { useState } from 'react';
import type { DecisionTreeSnapshot } from '../../types/ml';

interface DecisionTreePlotProps {
  data: DecisionTreeSnapshot;
}

export const DecisionTreePlot: React.FC<DecisionTreePlotProps> = ({ data }) => {
  const {
    nodes,
    rootId,
    criterion,
    maxDepth,
    points,
    activeNodeId,
    candidates,
    queryPoint,
    decisionBoundaries,
  } = data;

  const [activeTab, setActiveTab] = useState<'tree' | 'scatter'>('tree');

  // SVG dimensions for tree view
  const treeWidth = 600;
  const treeHeight = 270;

  // Scatter plot dimensions
  const scatterWidth = 320;
  const scatterHeight = 250;
  const scatterPadding = 30;

  const scaleX = (x: number) => scatterPadding + (x / 100) * (scatterWidth - 2 * scatterPadding);
  const scaleY = (y: number) => scatterHeight - scatterPadding - (y / 100) * (scatterHeight - 2 * scatterPadding);

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const leafCount = nodes.filter(n => n.isLeaf).length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative select-none">
      <div className="w-full max-w-2xl bg-slate-900/90 dark:bg-surface-900 rounded-xl border border-slate-700/60 p-4 shadow-xl">
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Classification Decision Tree</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              {criterion}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Depth {maxDepth}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('tree')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  activeTab === 'tree' ? 'bg-primary-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tree View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scatter')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  activeTab === 'scatter' ? 'bg-primary-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                2D Partition Space
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Hierarchical Decision Tree SVG */}
        {activeTab === 'tree' && (
          <div className="w-full bg-slate-950/70 rounded-lg p-2 border border-slate-800 overflow-x-auto">
            <svg viewBox={`0 0 ${treeWidth} ${treeHeight}`} className="w-full h-auto min-w-[500px] overflow-visible font-mono text-[9px]">
              {/* Connector Lines between parent and children */}
              {nodes.map(node => {
                const childLines = [];
                if (node.leftId !== undefined) {
                  const leftChild = nodeMap.get(node.leftId);
                  if (leftChild && node.x !== undefined && node.y !== undefined && leftChild.x !== undefined && leftChild.y !== undefined) {
                    const isTraversed = node.isTraversed && leftChild.isTraversed;
                    childLines.push(
                      <g key={`edge-left-${node.id}-${leftChild.id}`}>
                        <path
                          d={`M ${node.x} ${node.y + 15} C ${node.x} ${(node.y + leftChild.y) / 2}, ${leftChild.x} ${(node.y + leftChild.y) / 2}, ${leftChild.x} ${leftChild.y - 15}`}
                          fill="none"
                          stroke={isTraversed ? '#38bdf8' : '#475569'}
                          strokeWidth={isTraversed ? 2.5 : 1.5}
                          strokeDasharray={isTraversed ? 'none' : '2 2'}
                        />
                        <text
                          x={(node.x + leftChild.x) / 2 - 8}
                          y={(node.y + leftChild.y) / 2}
                          fill="#38bdf8"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="end"
                        >
                          True (≤)
                        </text>
                      </g>
                    );
                  }
                }
                if (node.rightId !== undefined) {
                  const rightChild = nodeMap.get(node.rightId);
                  if (rightChild && node.x !== undefined && node.y !== undefined && rightChild.x !== undefined && rightChild.y !== undefined) {
                    const isTraversed = node.isTraversed && rightChild.isTraversed;
                    childLines.push(
                      <g key={`edge-right-${node.id}-${rightChild.id}`}>
                        <path
                          d={`M ${node.x} ${node.y + 15} C ${node.x} ${(node.y + rightChild.y) / 2}, ${rightChild.x} ${(node.y + rightChild.y) / 2}, ${rightChild.x} ${rightChild.y - 15}`}
                          fill="none"
                          stroke={isTraversed ? '#f43f5e' : '#475569'}
                          strokeWidth={isTraversed ? 2.5 : 1.5}
                          strokeDasharray={isTraversed ? 'none' : '2 2'}
                        />
                        <text
                          x={(node.x + rightChild.x) / 2 + 8}
                          y={(node.y + rightChild.y) / 2}
                          fill="#f43f5e"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="start"
                        >
                          False (&gt;)
                        </text>
                      </g>
                    );
                  }
                }
                return childLines;
              })}

              {/* Tree Nodes */}
              {nodes.map(node => {
                const nx = node.x ?? 50;
                const ny = node.y ?? 35;
                const isActive = activeNodeId === node.id;
                const isTraversed = node.isTraversed;
                const w = node.isLeaf ? 84 : 96;
                const h = node.isLeaf ? 34 : 38;

                return (
                  <g key={`node-${node.id}`} className="transition-all duration-300">
                    {/* Active Glow Ring */}
                    {(isActive || isTraversed) && (
                      <rect
                        x={nx - w / 2 - 3}
                        y={ny - h / 2 - 3}
                        width={w + 6}
                        height={h + 6}
                        rx={8}
                        fill="none"
                        stroke={isTraversed ? '#38bdf8' : '#f59e0b'}
                        strokeWidth={2}
                        opacity={0.8}
                      />
                    )}

                    {/* Node Background */}
                    <rect
                      x={nx - w / 2}
                      y={ny - h / 2}
                      width={w}
                      height={h}
                      rx={6}
                      fill={
                        node.isLeaf
                          ? node.predictedClass === 1
                            ? '#064e3b'
                            : '#1e3a8a'
                          : '#1e293b'
                      }
                      stroke={
                        node.isLeaf
                          ? node.predictedClass === 1
                            ? '#10b981'
                            : '#3b82f6'
                          : '#64748b'
                      }
                      strokeWidth={1.5}
                      className="filter drop-shadow"
                    />

                    {/* Node Content */}
                    {node.isLeaf ? (
                      <>
                        <text x={nx} y={ny - 3} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                          Leaf: Class {node.predictedClass}
                        </text>
                        <text x={nx} y={ny + 9} fill="#cbd5e1" fontSize="8" textAnchor="middle">
                          {node.samples} pts • {criterion[0].toUpperCase()}: {node.impurity.toFixed(2)}
                        </text>
                      </>
                    ) : (
                      <>
                        <text x={nx} y={ny - 5} fill="#f8fafc" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          {node.featureName ? `${node.featureName} ≤ ${node.threshold}` : `Node #${node.id}`}
                        </text>
                        <text x={nx} y={ny + 7} fill="#94a3b8" fontSize="7.5" textAnchor="middle">
                          {criterion[0].toUpperCase()}:{node.impurity.toFixed(2)} | n={node.samples}
                        </text>
                        <text x={nx} y={ny + 16} fill="#64748b" fontSize="7" textAnchor="middle">
                          [{node.distribution[0]}c₀, {node.distribution[1]}c₁]
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* View Mode 2: 2D Feature Partition Space & Decision Boundaries */}
        {activeTab === 'scatter' && (
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/70 rounded-lg p-3 border border-slate-800">
            {/* Scatter SVG with orthogonal decision boundaries */}
            <div className="flex flex-col items-center">
              <svg viewBox={`0 0 ${scatterWidth} ${scatterHeight}`} className="w-full max-w-[280px] h-auto font-mono text-[9px]">
                {/* Axes */}
                <line x1={scatterPadding} y1={scatterHeight - scatterPadding} x2={scatterWidth - scatterPadding} y2={scatterHeight - scatterPadding} stroke="#475569" strokeWidth={1.5} />
                <line x1={scatterPadding} y1={scatterPadding} x2={scatterPadding} y2={scatterHeight - scatterPadding} stroke="#475569" strokeWidth={1.5} />

                {/* Axis Labels */}
                <text x={scatterWidth / 2} y={scatterHeight - 5} fill="#94a3b8" textAnchor="middle">Feature X</text>
                <text x={10} y={scatterHeight / 2} fill="#94a3b8" textAnchor="middle" transform={`rotate(-90 10 ${scatterHeight / 2})`}>Feature Y</text>

                {/* Decision Boundary Lines */}
                {decisionBoundaries?.map((b, idx) => {
                  if (b.featureIndex === 0) {
                    // Vertical split X <= threshold
                    const xCoord = scaleX(b.threshold);
                    const y1 = scaleY(b.range[0]);
                    const y2 = scaleY(b.range[1]);
                    return (
                      <line
                        key={`b-vert-${idx}`}
                        x1={xCoord}
                        y1={y1}
                        x2={xCoord}
                        y2={y2}
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="3 2"
                      />
                    );
                  }
                  // Horizontal split Y <= threshold
                  const yCoord = scaleY(b.threshold);
                  const x1 = scaleX(b.range[0]);
                  const x2 = scaleX(b.range[1]);
                  return (
                    <line
                      key={`b-horiz-${idx}`}
                      x1={x1}
                      y1={yCoord}
                      x2={x2}
                      y2={yCoord}
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="3 2"
                    />
                  );
                })}

                {/* Data Points */}
                {points.map((p, idx) => {
                  const isClass1 = Number(p.label ?? 0) === 1;
                  return (
                    <circle
                      key={`p-${idx}`}
                      cx={scaleX(p.x)}
                      cy={scaleY(p.y)}
                      r={4.5}
                      fill={isClass1 ? '#10b981' : '#3b82f6'}
                      stroke="#ffffff"
                      strokeWidth={1}
                      className="transition-all"
                    >
                      <title>{`(${p.x}, ${p.y}) - Class ${p.label}`}</title>
                    </circle>
                  );
                })}

                {/* Query Point if present */}
                {queryPoint && (
                  <g className="animate-pulse">
                    <rect
                      x={scaleX(queryPoint.x) - 5}
                      y={scaleY(queryPoint.y) - 5}
                      width={10}
                      height={10}
                      fill="#ec4899"
                      stroke="#ffffff"
                      strokeWidth={2}
                      transform={`rotate(45 ${scaleX(queryPoint.x)} ${scaleY(queryPoint.y)})`}
                    />
                    <text
                      x={scaleX(queryPoint.x)}
                      y={scaleY(queryPoint.y) - 10}
                      fill="#ec4899"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Q ({queryPoint.x}, {queryPoint.y})
                    </text>
                  </g>
                )}
              </svg>

              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Class 0
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Class 1
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> Split Line
                </span>
              </div>
            </div>

            {/* Split Candidate Table */}
            <div className="flex-1 w-full max-w-[280px]">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Top Candidate Splits</span>
                <span className="text-[9px] text-slate-500">Node #{activeNodeId ?? rootId}</span>
              </div>
              {candidates && candidates.length > 0 ? (
                <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                  {candidates.map((cand, idx) => (
                    <div
                      key={`cand-${idx}`}
                      className={`p-2 rounded text-[10px] font-mono border flex items-center justify-between ${
                        cand.isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold">
                          {cand.featureName} ≤ {cand.threshold}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          L: {cand.leftSamples} pts | R: {cand.rightSamples} pts
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-bold">ΔI: {cand.gain.toFixed(4)}</div>
                        {cand.isSelected && (
                          <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500 text-xs rounded border border-slate-800">
                  No active candidate evaluation for this step.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Status Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Nodes: <b className="text-white">{nodes.length}</b></span>
            <span>•</span>
            <span>Leaves: <b className="text-emerald-400">{leafCount}</b></span>
          </div>

          {queryPoint && queryPoint.predictedClass !== undefined && (
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-pink-400 font-bold">Query Prediction:</span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                queryPoint.predictedClass === 1
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                Class {queryPoint.predictedClass}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
