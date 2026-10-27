import React from 'react';
import type { RegressionSnapshot } from '../../types/ml';

interface RegressionPlotProps {
  data: RegressionSnapshot;
}

export const RegressionPlot: React.FC<RegressionPlotProps> = ({ data }) => {
  const { points, slope, intercept, mse, r2, showResiduals } = data;

  // Viewbox coordinates: 0..100 for X and Y
  const width = 500;
  const height = 320;
  const padding = 40;

  // Find min/max bounds
  const xVals = points.map(p => p.x);
  const yVals = points.map(p => p.y);
  const minX = Math.min(0, ...xVals);
  const maxX = Math.max(35, ...xVals);
  const minY = Math.min(0, ...yVals);
  const maxY = Math.max(70, ...yVals);

  const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX || 1)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - ((y - minY) / (maxY - minY || 1)) * (height - 2 * padding);

  // Line points
  const lineX1 = minX;
  const lineY1 = slope * lineX1 + intercept;
  const lineX2 = maxX;
  const lineY2 = slope * lineX2 + intercept;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative select-none">
      <div className="w-full max-w-xl bg-slate-900/90 dark:bg-surface-900 rounded-xl border border-slate-700/60 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Linear Regression Fit</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ŷ = {slope.toFixed(2)}x + {intercept.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            {mse !== undefined && (
              <span className="text-amber-400">MSE: <b>{mse.toFixed(2)}</b></span>
            )}
            {r2 !== undefined && (
              <span className="text-emerald-400">R²: <b>{(r2 * 100).toFixed(1)}%</b></span>
            )}
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - padding - pct * (height - 2 * padding);
            const val = (minY + pct * (maxY - minY)).toFixed(0);
            return (
              <g key={`grid-y-${i}`}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#334155" strokeDasharray="3 3" opacity={0.6} />
                <text x={padding - 8} y={y + 3} fill="#94a3b8" textAnchor="end">{val}</text>
              </g>
            );
          })}

          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const x = padding + pct * (width - 2 * padding);
            const val = (minX + pct * (maxX - minX)).toFixed(0);
            return (
              <g key={`grid-x-${i}`}>
                <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="#334155" strokeDasharray="3 3" opacity={0.6} />
                <text x={x} y={height - padding + 15} fill="#94a3b8" textAnchor="middle">{val}</text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />

          {/* Residual lines (error bars) */}
          {showResiduals && points.map((p, i) => {
            const predY = slope * p.x + intercept;
            return (
              <line
                key={`res-${i}`}
                x1={scaleX(p.x)}
                y1={scaleY(p.y)}
                x2={scaleX(p.x)}
                y2={scaleY(predY)}
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                opacity={0.8}
              />
            );
          })}

          {/* Regression Line */}
          <line
            x1={scaleX(lineX1)}
            y1={scaleY(lineY1)}
            x2={scaleX(lineX2)}
            y2={scaleY(lineY2)}
            stroke="#3b82f6"
            strokeWidth={2.5}
          />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={`pt-${i}`}>
              <circle
                cx={scaleX(p.x)}
                cy={scaleY(p.y)}
                r={5}
                fill="#38bdf8"
                stroke="#0284c7"
                strokeWidth={1.5}
                className="transition-transform hover:scale-125"
              />
            </g>
          ))}
        </svg>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <span>● Data Points (x, y)</span>
          <span className="text-blue-400">― Fitted OLS Regression Line</span>
          {showResiduals && <span className="text-rose-400">┆ Residuals (Error y - ŷ)</span>}
        </div>
      </div>
    </div>
  );
};
