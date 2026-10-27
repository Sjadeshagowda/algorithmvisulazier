import React from 'react';
import type { ClassificationSnapshot } from '../../types/ml';

interface ClassificationPlotProps {
  data: ClassificationSnapshot;
}

export const ClassificationPlot: React.FC<ClassificationPlotProps> = ({ data }) => {
  const { points, decisionBoundary, queryPoint, accuracy, loss } = data;

  const width = 500;
  const height = 320;
  const padding = 40;

  const minX = 0;
  const maxX = 100;
  const minY = 0;
  const maxY = 100;

  const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative select-none">
      <div className="w-full max-w-xl bg-slate-900/90 dark:bg-surface-900 rounded-xl border border-slate-700/60 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {queryPoint ? 'K-Nearest Neighbors' : 'Logistic Regression Boundary'}
            </span>
            {accuracy !== undefined && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Accuracy: {accuracy}%
              </span>
            )}
          </div>
          {loss !== undefined && (
            <span className="text-xs font-mono text-amber-400">
              Cross-Entropy Loss: <b>{loss.toFixed(3)}</b>
            </span>
          )}
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(val => (
            <g key={`grid-${val}`}>
              <line x1={padding} y1={scaleY(val)} x2={width - padding} y2={scaleY(val)} stroke="#334155" strokeDasharray="3 3" opacity={0.5} />
              <text x={padding - 8} y={scaleY(val) + 3} fill="#94a3b8" textAnchor="end">{val}</text>
              <line x1={scaleX(val)} y1={padding} x2={scaleX(val)} y2={height - padding} stroke="#334155" strokeDasharray="3 3" opacity={0.5} />
              <text x={scaleX(val)} y={height - padding + 15} fill="#94a3b8" textAnchor="middle">{val}</text>
            </g>
          ))}

          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />

          {/* Decision Boundary Line if present */}
          {decisionBoundary && (
            <line
              x1={scaleX(0)}
              y1={scaleY(decisionBoundary.intercept)}
              x2={scaleX(100)}
              y2={scaleY(decisionBoundary.slope * 100 + decisionBoundary.intercept)}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          )}

          {/* KNN Query Point & Connections */}
          {queryPoint && (
            <>
              {/* Radial lines to k-nearest */}
              {queryPoint.nearestNeighbors && queryPoint.nearestNeighbors.map(id => {
                const neighbor = points.find(p => (p.id ?? 0) === id);
                if (!neighbor) return null;
                return (
                  <line
                    key={`conn-${id}`}
                    x1={scaleX(queryPoint.x)}
                    y1={scaleY(queryPoint.y)}
                    x2={scaleX(neighbor.x)}
                    y2={scaleY(neighbor.y)}
                    stroke="#a855f7"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                  />
                );
              })}

              {/* Query Point Marker */}
              <circle
                cx={scaleX(queryPoint.x)}
                cy={scaleY(queryPoint.y)}
                r={7}
                fill={queryPoint.predictedLabel === 1 ? '#10b981' : queryPoint.predictedLabel === 0 ? '#3b82f6' : '#ec4899'}
                stroke="#ffffff"
                strokeWidth={2}
              />
              <text
                x={scaleX(queryPoint.x)}
                y={scaleY(queryPoint.y) - 10}
                fill="#ffffff"
                textAnchor="middle"
                fontWeight="bold"
                fontSize={9}
              >
                Query Point {queryPoint.predictedLabel !== undefined ? `(Class ${queryPoint.predictedLabel})` : '?'}
              </text>
            </>
          )}

          {/* Training Data Points */}
          {points.map((p, i) => {
            const isNeighbor = queryPoint?.nearestNeighbors?.includes(p.id ?? i);
            const isClass1 = Number(p.label) === 1;
            return (
              <circle
                key={`p-${i}`}
                cx={scaleX(p.x)}
                cy={scaleY(p.y)}
                r={isNeighbor ? 6.5 : 5}
                fill={isClass1 ? '#10b981' : '#3b82f6'}
                stroke={isNeighbor ? '#f59e0b' : '#ffffff'}
                strokeWidth={isNeighbor ? 2.5 : 1}
                opacity={0.9}
              />
            );
          })}
        </svg>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Class 0</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Class 1</span>
            {queryPoint && (
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" /> Query</span>
            )}
          </div>
          {decisionBoundary && <span className="text-amber-400">┄ Decision Boundary</span>}
          {queryPoint?.nearestNeighbors && <span className="text-purple-400">┄ K-Nearest Neighbor Lines</span>}
        </div>
      </div>
    </div>
  );
};
