import React from 'react';
import type { OptimizationSnapshot } from '../../types/ml';

interface OptimizationPlotProps {
  data: OptimizationSnapshot;
}

export const OptimizationPlot: React.FC<OptimizationPlotProps> = ({ data }) => {
  const { currentPoint, path, gradient, learningRate, iteration, lossHistory, converged, targetMinimum } = data;

  const width = 280;
  const height = 260;
  const padding = 35;

  // Domain for contour map: -5 to +5 on both X and Y
  const domainMin = -5;
  const domainMax = 5;

  const scaleX = (x: number) => padding + ((x - domainMin) / (domainMax - domainMin)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - ((y - domainMin) / (domainMax - domainMin)) * (height - 2 * padding);

  // Gradient magnitude
  const gradNorm = Math.sqrt(gradient.dx * gradient.dx + gradient.dy * gradient.dy);

  // Contour levels for f(x, y) = x^2 + 2y^2
  // x^2/c + y^2/(c/2) = 1 (ellipses with rx = sqrt(c), ry = sqrt(c/2))
  const contourLevels = [1, 4, 9, 16, 25, 36, 49];

  // Loss chart dimensions
  const chartWidth = 240;
  const chartHeight = 120;
  const chartPadding = 25;
  const maxLoss = Math.max(...lossHistory, 1);
  const maxIters = Math.max(lossHistory.length - 1, 10);

  const chartScaleX = (iter: number) => chartPadding + (iter / maxIters) * (chartWidth - 2 * chartPadding);
  const chartScaleY = (loss: number) => chartHeight - chartPadding - (loss / maxLoss) * (chartHeight - 2 * chartPadding);

  // SVG path string for loss curve
  const lossPathString = lossHistory
    .map((l, idx) => `${idx === 0 ? 'M' : 'L'} ${chartScaleX(idx).toFixed(1)} ${chartScaleY(l).toFixed(1)}`)
    .join(' ');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative select-none">
      <div className="w-full max-w-2xl bg-slate-900/90 dark:bg-surface-900 rounded-xl border border-slate-700/60 p-4 shadow-xl">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Gradient Descent Optimization</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Iter {iteration} (η={learningRate})
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-amber-400">
              Loss: <b>{currentPoint.loss.toFixed(4)}</b>
            </span>
            <span className="text-cyan-400">
              |∇f|: <b>{gradNorm.toFixed(3)}</b>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                converged
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}
            >
              {converged ? 'Converged' : 'Stepping'}
            </span>
          </div>
        </div>

        {/* Dual Panels: Contour Surface + Loss Curve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Panel 1: Loss Contour Map & Trajectory */}
          <div className="flex flex-col items-center bg-slate-950/60 rounded-lg p-2 border border-slate-800">
            <div className="text-[11px] font-medium text-slate-300 mb-1 flex items-center justify-between w-full px-2">
              <span>Loss Surface Contours: f(x, y) = x² + 2y²</span>
              <span className="text-[10px] text-slate-500 font-mono">Min at (0, 0)</span>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[9px]">
              {/* Axes lines */}
              <line x1={padding} y1={scaleY(0)} x2={width - padding} y2={scaleY(0)} stroke="#475569" strokeWidth={1} strokeDasharray="2 2" />
              <line x1={scaleX(0)} y1={padding} x2={scaleX(0)} y2={height - padding} stroke="#475569" strokeWidth={1} strokeDasharray="2 2" />

              {/* Contour Ellipses */}
              {contourLevels.map((c, i) => {
                const rx = (Math.sqrt(c) / (domainMax - domainMin)) * (width - 2 * padding);
                const ry = (Math.sqrt(c / 2) / (domainMax - domainMin)) * (height - 2 * padding);
                return (
                  <ellipse
                    key={`contour-${i}`}
                    cx={scaleX(0)}
                    cy={scaleY(0)}
                    rx={rx}
                    ry={ry}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={1}
                    opacity={0.25 + (i * 0.05)}
                  />
                );
              })}

              {/* Optimum marker */}
              <circle cx={scaleX(targetMinimum.x)} cy={scaleY(targetMinimum.y)} r={5} fill="#10b981" />
              <text x={scaleX(targetMinimum.x) + 8} y={scaleY(targetMinimum.y) + 3} fill="#10b981" fontSize="9" fontWeight="bold">
                (0,0)
              </text>

              {/* Trajectory path */}
              {path.length > 1 && (
                <polyline
                  points={path.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(' ')}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Path step markers */}
              {path.map((p, i) => (
                <circle
                  key={`step-${i}`}
                  cx={scaleX(p.x)}
                  cy={scaleY(p.y)}
                  r={2.5}
                  fill={i === path.length - 1 ? '#f43f5e' : '#ec4899'}
                  opacity={0.7}
                />
              ))}

              {/* Gradient Descent Step Vector (Negative Gradient Direction) */}
              {gradNorm > 0.01 && (
                <line
                  x1={scaleX(currentPoint.x)}
                  y1={scaleY(currentPoint.y)}
                  x2={scaleX(currentPoint.x - gradient.dx * learningRate * 2.5)}
                  y2={scaleY(currentPoint.y - gradient.dy * learningRate * 2.5)}
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              )}

              {/* Current parameter position */}
              <circle
                cx={scaleX(currentPoint.x)}
                cy={scaleY(currentPoint.y)}
                r={6}
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth={2}
                className="animate-pulse"
              />
            </svg>

            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              θ = ({currentPoint.x.toFixed(2)}, {currentPoint.y.toFixed(2)})
            </div>
          </div>

          {/* Panel 2: Loss Convergence Curve */}
          <div className="flex flex-col items-center bg-slate-950/60 rounded-lg p-2 border border-slate-800">
            <div className="text-[11px] font-medium text-slate-300 mb-1 flex items-center justify-between w-full px-2">
              <span>Objective Loss J(θ)</span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {lossHistory[lossHistory.length - 1]?.toFixed(4)}
              </span>
            </div>

            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible font-mono text-[8px]">
              {/* Axes */}
              <line x1={chartPadding} y1={chartHeight - chartPadding} x2={chartWidth - chartPadding} y2={chartHeight - chartPadding} stroke="#475569" strokeWidth={1} />
              <line x1={chartPadding} y1={chartPadding} x2={chartPadding} y2={chartHeight - chartPadding} stroke="#475569" strokeWidth={1} />

              {/* Axis labels */}
              <text x={chartWidth / 2} y={chartHeight - 4} fill="#64748b" textAnchor="middle">Iteration</text>
              <text x={chartPadding - 5} y={chartPadding} fill="#64748b" textAnchor="end">{maxLoss.toFixed(1)}</text>
              <text x={chartPadding - 5} y={chartHeight - chartPadding} fill="#64748b" textAnchor="end">0</text>

              {/* Loss Curve */}
              {lossHistory.length > 1 && (
                <path
                  d={lossPathString}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              )}

              {/* Latest Point */}
              {lossHistory.length > 0 && (
                <circle
                  cx={chartScaleX(lossHistory.length - 1)}
                  cy={chartScaleY(lossHistory[lossHistory.length - 1])}
                  r={4}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              )}
            </svg>

            <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-pink-500 inline-block" /> Path
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> -∇f step
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" /> Loss
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
