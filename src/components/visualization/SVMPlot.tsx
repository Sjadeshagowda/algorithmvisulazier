import React, { useState } from 'react';
import type { SVMSnapshot, SVMPointData } from '../../types/ml';

interface SVMPlotProps {
  data: SVMSnapshot;
}

export const SVMPlot: React.FC<SVMPlotProps> = ({ data }) => {
  const {
    points,
    weights,
    bias,
    c,
    epoch,
    totalEpochs,
    totalHingeLoss,
    regLoss,
    objectiveValue,
    marginWidth,
    supportVectorCount,
    decisionBoundary,
    positiveMarginBoundary,
    negativeMarginBoundary,
    queryPoint,
    converged,
  } = data;

  const [hoveredPoint, setHoveredPoint] = useState<SVMPointData | null>(null);

  const width = 560;
  const height = 340;
  const padding = 42;

  const minX = 0;
  const maxX = 100;
  const minY = 0;
  const maxY = 100;

  const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);

  // Helper to render boundary line clipped to the data area
  const renderBoundaryLine = (
    boundary: { isVertical?: boolean; slope?: number; intercept?: number; xIntercept?: number } | undefined,
    color: string,
    strokeDasharray?: string,
    strokeWidth = 2
  ) => {
    if (!boundary) return null;

    if (boundary.isVertical && boundary.xIntercept !== undefined) {
      const x = scaleX(boundary.xIntercept);
      return (
        <line
          x1={x}
          y1={padding}
          x2={x}
          y2={height - padding}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          clipPath="url(#svm-plot-clip)"
        />
      );
    }

    if (boundary.slope !== undefined && boundary.intercept !== undefined) {
      // Find intersections with x = -50 to x = 150 for clean rendering across plot
      const x1 = -50;
      const y1 = boundary.slope * x1 + boundary.intercept;
      const x2 = 150;
      const y2 = boundary.slope * x2 + boundary.intercept;

      return (
        <line
          x1={scaleX(x1)}
          y1={scaleY(y1)}
          x2={scaleX(x2)}
          y2={scaleY(y2)}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          clipPath="url(#svm-plot-clip)"
        />
      );
    }

    return null;
  };

  const norm = Math.sqrt(weights[0] * weights[0] + weights[1] * weights[1]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative select-none">
      <div className="w-full max-w-2xl bg-slate-900/95 dark:bg-surface-900 rounded-xl border border-slate-700/60 p-4 shadow-xl text-slate-200">
        {/* Header Stats Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Linear Soft-Margin SVM
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              C = {c}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Epoch {epoch}/{totalEpochs}
            </span>
            {converged && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Converged
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Margin: {marginWidth.toFixed(2)}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SVs: {supportVectorCount}
            </span>
          </div>
        </div>

        {/* Loss & Objective Sub-ribbon */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs font-mono bg-slate-800/60 rounded-lg p-2 border border-slate-700/40">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Primal Objective J</span>
            <span className="text-amber-400 font-bold">{objectiveValue.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Hinge Loss (Slack)</span>
            <span className="text-rose-400 font-semibold">{totalHingeLoss.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Regularization ½||w||²</span>
            <span className="text-cyan-400 font-semibold">{regLoss.toFixed(2)}</span>
          </div>
        </div>

        {/* 2D Feature Space Plot */}
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
            <defs>
              <clipPath id="svm-plot-clip">
                <rect x={padding} y={padding} width={width - 2 * padding} height={height - 2 * padding} />
              </clipPath>
              {/* Pattern for margin corridor */}
              <pattern id="margin-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" strokeWidth="1" opacity="0.15" />
              </pattern>
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(val => (
              <g key={`grid-${val}`}>
                <line
                  x1={padding}
                  y1={scaleY(val)}
                  x2={width - padding}
                  y2={scaleY(val)}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  opacity={0.4}
                />
                <text x={padding - 8} y={scaleY(val) + 3} fill="#94a3b8" textAnchor="end">
                  {val}
                </text>
                <line
                  x1={scaleX(val)}
                  y1={padding}
                  x2={scaleX(val)}
                  y2={height - padding}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  opacity={0.4}
                />
                <text x={scaleX(val)} y={height - padding + 15} fill="#94a3b8" textAnchor="middle">
                  {val}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />
            <text x={width - padding} y={height - padding + 28} fill="#94a3b8" textAnchor="end" className="text-[10px]">
              Feature X₁ →
            </text>
            <text x={padding} y={padding - 12} fill="#94a3b8" textAnchor="start" className="text-[10px]">
              ↑ Feature X₂
            </text>

            {/* Margin lines and Separating Hyperplane */}
            {renderBoundaryLine(positiveMarginBoundary, '#10b981', '4 3', 1.5)}
            {renderBoundaryLine(negativeMarginBoundary, '#38bdf8', '4 3', 1.5)}
            {renderBoundaryLine(decisionBoundary, '#f59e0b', undefined, 2.5)}

            {/* Data Points */}
            {points.map((p, idx) => {
              const cx = scaleX(p.x);
              const cy = scaleY(p.y);
              const isPositive = p.label === 1;

              return (
                <g
                  key={`pt-${p.id ?? idx}`}
                  className="cursor-pointer transition-transform duration-150"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Support Vector Outer Halo */}
                  {p.isSupportVector && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={10}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth={2}
                      strokeDasharray="2 2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Point Marker */}
                  {isPositive ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="#10b981"
                      stroke="#064e3b"
                      strokeWidth={1.5}
                      className="hover:r-7"
                    />
                  ) : (
                    <rect
                      x={cx - 5}
                      y={cy - 5}
                      width={10}
                      height={10}
                      fill="#38bdf8"
                      stroke="#0c4a6e"
                      strokeWidth={1.5}
                      className="hover:scale-110"
                    />
                  )}
                </g>
              );
            })}

            {/* Query Point if provided */}
            {queryPoint && (
              <g className="cursor-pointer">
                {/* Outer pulsing ring */}
                <circle
                  cx={scaleX(queryPoint.x)}
                  cy={scaleY(queryPoint.y)}
                  r={12}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth={2}
                  strokeDasharray="3 2"
                  className="animate-spin"
                  style={{ transformOrigin: `${scaleX(queryPoint.x)}px ${scaleY(queryPoint.y)}px` }}
                />
                {/* Query Star/Circle */}
                <circle
                  cx={scaleX(queryPoint.x)}
                  cy={scaleY(queryPoint.y)}
                  r={7}
                  fill="#ec4899"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                <text
                  x={scaleX(queryPoint.x)}
                  y={scaleY(queryPoint.y) - 15}
                  fill="#f472b6"
                  textAnchor="middle"
                  className="font-bold text-[10px]"
                >
                  Q ({queryPoint.predictedClass === 1 ? '+1' : '-1'})
                </text>
              </g>
            )}
          </svg>

          {/* Point Tooltip on Hover */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none bg-slate-950/95 border border-slate-700 rounded-md p-2 text-xs shadow-2xl z-20 font-mono"
              style={{
                left: `${Math.min(Math.max(scaleX(hoveredPoint.x) - 70, 10), width - 160)}px`,
                top: `${Math.max(scaleY(hoveredPoint.y) - 80, 10)}px`,
              }}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    hoveredPoint.label === 1 ? 'bg-emerald-400' : 'bg-sky-400'
                  }`}
                />
                Class: {hoveredPoint.label === 1 ? '+1 (Positive)' : '-1 (Negative)'}
                {hoveredPoint.isSupportVector && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded ml-1 border border-amber-500/40">
                    SV
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-300">
                Coords: ({hoveredPoint.x.toFixed(1)}, {hoveredPoint.y.toFixed(1)})
              </div>
              {hoveredPoint.decisionScore !== undefined && (
                <div className="text-[11px] text-amber-300">
                  Score f(x): {hoveredPoint.decisionScore.toFixed(3)}
                </div>
              )}
              {hoveredPoint.functionalMargin !== undefined && (
                <div className="text-[11px] text-slate-400">
                  y·f(x): {hoveredPoint.functionalMargin.toFixed(3)} (Hinge: {hoveredPoint.hingeLoss?.toFixed(3) ?? 0})
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hyperplane Mathematical Formula */}
        <div className="mt-3 bg-slate-950/60 rounded-lg p-2.5 border border-slate-800 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Hyperplane:</span>
            <span className="text-amber-400 font-bold">
              {weights[0] >= 0 ? '' : '-'}
              {Math.abs(weights[0]).toFixed(3)}·X₁ {weights[1] >= 0 ? '+' : '-'} {Math.abs(weights[1]).toFixed(3)}·X₂{' '}
              {bias >= 0 ? '+' : '-'} {Math.abs(bias).toFixed(3)} = 0
            </span>
          </div>
          <div className="text-slate-400 text-[11px]">
            ||w|| = <span className="text-white font-semibold">{norm.toFixed(3)}</span> | Margin ={' '}
            <span className="text-purple-300 font-semibold">{marginWidth.toFixed(2)}</span>
          </div>
        </div>

        {/* Interactive Legend & Support Vector Guidance */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Class +1
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-400 inline-block" />
              Class -1
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-amber-400 inline-block" />
              Hyperplane (w·x+b = 0)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t border-dashed border-emerald-400 inline-block" />
              Margins (±1)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-dashed border-amber-400 inline-block" />
              Support Vector
            </span>
            {queryPoint && (
              <span className="flex items-center gap-1.5 text-pink-400">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
                Query Q
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
