import React, { useState } from 'react';
import type { PCASnapshot, PCAPointData } from '../../types/ml';

interface PCAPlotProps {
  data: PCASnapshot;
}

type PCAViewTab = 'original' | 'centered' | 'covariance' | 'components' | 'projection' | 'variance' | 'reconstruction';

export const PCAPlot: React.FC<PCAPlotProps> = ({ data }) => {
  const {
    stage,
    points,
    featureNames,
    means,
    covarianceMatrix,
    eigenvalues,
    eigenvectors,
    explainedVarianceRatios,
    cumulativeVarianceRatios,
    k,
    reconstructionError,
    standardized,
  } = data;

  const [userSelectedTab, setUserSelectedTab] = useState<PCAViewTab | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<PCAPointData | null>(null);

  const defaultTab: PCAViewTab =
    stage === 'input'
      ? 'original'
      : stage === 'centering'
      ? 'centered'
      : stage === 'covariance'
      ? 'covariance'
      : stage === 'eigensolver' || stage === 'components'
      ? 'components'
      : stage === 'projection'
      ? 'projection'
      : stage === 'reconstruction'
      ? 'reconstruction'
      : 'original';

  const activeTab = userSelectedTab ?? defaultTab;

  const width = 560;
  const height = 330;
  const padding = 45;

  // Scale calculations for 2D original/centered space
  const allX = points.flatMap(p => [p.original[0] ?? 0, p.centered[0] ?? 0, p.reconstructed?.[0] ?? 0]);
  const allY = points.flatMap(p => [p.original[1] ?? 0, p.centered[1] ?? 0, p.reconstructed?.[1] ?? 0]);

  const rawMinX = allX.length > 0 ? Math.min(...allX) : 0;
  const rawMaxX = allX.length > 0 ? Math.max(...allX) : 100;
  const rawMinY = allY.length > 0 ? Math.min(...allY) : 0;
  const rawMaxY = allY.length > 0 ? Math.max(...allY) : 100;

  // Add margin padding to plot scales
  const spanX = Math.max(rawMaxX - rawMinX, 10);
  const spanY = Math.max(rawMaxY - rawMinY, 10);
  const minX = Math.floor(rawMinX - spanX * 0.15);
  const maxX = Math.ceil(rawMaxX + spanX * 0.15);
  const minY = Math.floor(rawMinY - spanY * 0.15);
  const maxY = Math.ceil(rawMaxY + spanY * 0.15);

  const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX || 1)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - ((y - minY) / (maxY - minY || 1)) * (height - 2 * padding);

  // Scale calculations for centered view
  const centMin = Math.min(-spanX * 0.7, -spanY * 0.7);
  const centMax = Math.max(spanX * 0.7, spanY * 0.7);
  const scaleCentX = (x: number) => padding + ((x - centMin) / (centMax - centMin || 1)) * (width - 2 * padding);
  const scaleCentY = (y: number) => height - padding - ((y - centMin) / (centMax - centMin || 1)) * (height - 2 * padding);

  // Scale for projection view (1D or 2D)
  const projValuesX = points.map(p => p.projected?.[0] ?? 0);
  const projValuesY = points.map(p => p.projected?.[1] ?? 0);
  const projSpanX = Math.max(Math.max(...projValuesX) - Math.min(...projValuesX), 10);
  const projMinX = Math.min(...projValuesX) - projSpanX * 0.2;
  const projMaxX = Math.max(...projValuesX) + projSpanX * 0.2;
  const projSpanY = Math.max(Math.max(...projValuesY) - Math.min(...projValuesY), 10);
  const projMinY = Math.min(...projValuesY) - projSpanY * 0.2;
  const projMaxY = Math.max(...projValuesY) + projSpanY * 0.2;

  const scaleProjX = (t: number) => padding + ((t - projMinX) / (projMaxX - projMinX || 1)) * (width - 2 * padding);
  const scaleProjY = (t: number) => height - padding - ((t - projMinY) / (projMaxY - projMinY || 1)) * (height - 2 * padding);

  const meanX = means[0] ?? 50;
  const meanY = means[1] ?? 50;

  // Principal component vectors (scaled by sqrt(eigenvalue) for geometric representation)
  const pc1 = eigenvectors.length >= 2 ? [eigenvectors[0][0] ?? 0, eigenvectors[1][0] ?? 0] : [1, 0];
  const pc2 = eigenvectors.length >= 2 && eigenvectors[0].length >= 2 ? [eigenvectors[0][1] ?? 0, eigenvectors[1][1] ?? 0] : [0, 1];
  const lambda1 = eigenvalues[0] ?? 0;
  const lambda2 = eigenvalues[1] ?? 0;
  const scaleLen1 = Math.sqrt(Math.max(lambda1, 1)) * 1.5;
  const scaleLen2 = Math.sqrt(Math.max(lambda2, 1)) * 1.5;

  const d = means.length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative select-none">
      <div className="w-full max-w-2xl bg-slate-900/95 dark:bg-surface-900 rounded-xl border border-slate-700/60 p-4 shadow-xl text-slate-200">
        {/* Header Stats Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Principal Component Analysis
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              k = {k} / {d}
            </span>
            {standardized && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Standardized (Z-Score)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {cumulativeVarianceRatios.length >= k && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Retained Var: {(cumulativeVarianceRatios[k - 1] * 100).toFixed(1)}%
              </span>
            )}
            {reconstructionError !== undefined && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MSE: {reconstructionError.toFixed(4)}
              </span>
            )}
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-3 bg-slate-950/70 p-1 rounded-lg border border-slate-800 text-[11px]">
          {[
            { id: 'original', label: '1. Original Data' },
            { id: 'centered', label: '2. Centered Data' },
            { id: 'covariance', label: '3. Covariance Matrix' },
            { id: 'components', label: '4. PC Directions' },
            { id: 'projection', label: `5. Projection (${k}D)` },
            { id: 'variance', label: '6. Explained Var' },
            { id: 'reconstruction', label: '7. Reconstruction' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setUserSelectedTab(tab.id as PCAViewTab)}
              className={`px-2 py-1 rounded font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Visualization Canvas based on active tab */}
        <div className="relative">
          {/* VIEW A: ORIGINAL DATA */}
          {activeTab === 'original' && (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
              {/* Axes & Grid */}
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />
              <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />
              <text x={width - padding} y={height - padding + 25} fill="#94a3b8" textAnchor="end">
                {featureNames[0] ?? 'Feature X₁'} →
              </text>
              <text x={padding} y={padding - 12} fill="#94a3b8" textAnchor="start">
                ↑ {featureNames[1] ?? 'Feature X₂'}
              </text>

              {/* Data Points */}
              {points.map((p, idx) => (
                <circle
                  key={`pt-${p.id ?? idx}`}
                  cx={scaleX(p.original[0] ?? 0)}
                  cy={scaleY(p.original[1] ?? 0)}
                  r={5}
                  fill="#38bdf8"
                  stroke="#0284c7"
                  strokeWidth={1.5}
                  className="cursor-pointer hover:r-7 transition-all"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* Feature Means Centroid Marker */}
              {means.length >= 2 && (
                <g>
                  <circle cx={scaleX(meanX)} cy={scaleY(meanY)} r={7} fill="#f59e0b" stroke="#ffffff" strokeWidth={2} />
                  <text x={scaleX(meanX) + 12} y={scaleY(meanY) + 4} fill="#fbbf24" className="font-bold text-[10px]">
                    Mean μ ({meanX.toFixed(1)}, {meanY.toFixed(1)})
                  </text>
                </g>
              )}
            </svg>
          )}

          {/* VIEW B: CENTERED DATA */}
          {activeTab === 'centered' && (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
              {/* Origin Crosshairs */}
              <line x1={padding} y1={scaleCentY(0)} x2={width - padding} y2={scaleCentY(0)} stroke="#475569" strokeDasharray="3 3" />
              <line x1={scaleCentX(0)} y1={padding} x2={scaleCentX(0)} y2={height - padding} stroke="#475569" strokeDasharray="3 3" />
              <text x={scaleCentX(0) + 6} y={scaleCentY(0) - 6} fill="#fbbf24" className="text-[10px]">
                Origin (0, 0)
              </text>

              {/* Centered Points */}
              {points.map((p, idx) => (
                <circle
                  key={`cent-${p.id ?? idx}`}
                  cx={scaleCentX(p.centered[0] ?? 0)}
                  cy={scaleCentY(p.centered[1] ?? 0)}
                  r={5}
                  fill="#818cf8"
                  stroke="#4f46e5"
                  strokeWidth={1.5}
                  className="cursor-pointer hover:r-7 transition-all"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              <text x={width - padding} y={height - padding + 25} fill="#94a3b8" textAnchor="end">
                Centered Z₁ = X₁ - μ₁ →
              </text>
              <text x={padding} y={padding - 12} fill="#94a3b8" textAnchor="start">
                ↑ Centered Z₂ = X₂ - μ₂
              </text>
            </svg>
          )}

          {/* VIEW C: COVARIANCE MATRIX HEATMAP */}
          {activeTab === 'covariance' && (
            <div className="w-full h-[270px] flex flex-col items-center justify-center p-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 tracking-wider">
                Sample Covariance Matrix Σ = (1 / (n - 1)) · ZᵀZ
              </h4>
              {covarianceMatrix && covarianceMatrix.length > 0 ? (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 shadow-inner">
                  <table className="border-collapse font-mono text-xs">
                    <thead>
                      <tr>
                        <th className="p-2 text-slate-500"></th>
                        {featureNames.map((fn, j) => (
                          <th key={`head-${j}`} className="p-2 text-cyan-400 font-semibold border-b border-slate-800">
                            {fn}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {covarianceMatrix.map((row, r) => (
                        <tr key={`row-${r}`}>
                          <th className="p-2 text-cyan-400 font-semibold border-r border-slate-800 text-left">
                            {featureNames[r]}
                          </th>
                          {row.map((val, c) => {
                            const isDiag = r === c;
                            return (
                              <td
                                key={`cell-${r}-${c}`}
                                className={`p-3 text-center border border-slate-800/80 font-mono transition-colors ${
                                  isDiag
                                    ? 'bg-amber-500/10 text-amber-300 font-bold'
                                    : 'bg-slate-900/60 text-slate-300'
                                }`}
                              >
                                <div>{val.toFixed(2)}</div>
                                <div className="text-[9px] text-slate-500 mt-0.5">
                                  {isDiag ? 'Var(X)' : `Cov(${r + 1},${c + 1})`}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 text-xs">Covariance matrix not yet computed.</p>
              )}
            </div>
          )}

          {/* VIEW D: PRINCIPAL COMPONENT DIRECTIONS */}
          {activeTab === 'components' && (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
              {/* Axes & Points */}
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />
              <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />

              {points.map((p, idx) => (
                <circle
                  key={`pt-${p.id ?? idx}`}
                  cx={scaleX(p.original[0] ?? 0)}
                  cy={scaleY(p.original[1] ?? 0)}
                  r={4}
                  fill="#64748b"
                  opacity={0.6}
                />
              ))}

              {/* Centroid Mean */}
              <circle cx={scaleX(meanX)} cy={scaleY(meanY)} r={6} fill="#fbbf24" stroke="#ffffff" strokeWidth={1.5} />

              {/* PC1 Direction Vector Arrow (Amber) */}
              <line
                x1={scaleX(meanX - pc1[0] * scaleLen1)}
                y1={scaleY(meanY - pc1[1] * scaleLen1)}
                x2={scaleX(meanX + pc1[0] * scaleLen1)}
                y2={scaleY(meanY + pc1[1] * scaleLen1)}
                stroke="#f59e0b"
                strokeWidth={3}
              />
              <text
                x={scaleX(meanX + pc1[0] * scaleLen1) + 10}
                y={scaleY(meanY + pc1[1] * scaleLen1)}
                fill="#fbbf24"
                className="font-bold text-[11px]"
              >
                PC1 (λ₁ = {lambda1.toFixed(1)})
              </text>

              {/* PC2 Direction Vector Arrow (Emerald) */}
              {d >= 2 && (
                <>
                  <line
                    x1={scaleX(meanX - pc2[0] * scaleLen2)}
                    y1={scaleY(meanY - pc2[1] * scaleLen2)}
                    x2={scaleX(meanX + pc2[0] * scaleLen2)}
                    y2={scaleY(meanY + pc2[1] * scaleLen2)}
                    stroke="#10b981"
                    strokeWidth={2.5}
                    strokeDasharray="4 2"
                  />
                  <text
                    x={scaleX(meanX + pc2[0] * scaleLen2) + 10}
                    y={scaleY(meanY + pc2[1] * scaleLen2)}
                    fill="#34d399"
                    className="font-bold text-[11px]"
                  >
                    PC2 (λ₂ = {lambda2.toFixed(1)})
                  </text>
                </>
              )}
            </svg>
          )}

          {/* VIEW E: PROJECTION */}
          {activeTab === 'projection' && (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
              {k === 1 ? (
                // 1D Projection Line View
                <g>
                  <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f59e0b" strokeWidth={2.5} />
                  <text x={width - padding} y={height / 2 + 25} fill="#fbbf24" textAnchor="end">
                    PC1 Coordinate (T₁) →
                  </text>
                  {points.map((p, idx) => {
                    const t1 = p.projected?.[0] ?? 0;
                    return (
                      <g key={`proj1d-${p.id ?? idx}`}>
                        <line x1={scaleProjX(t1)} y1={height / 2 - 12} x2={scaleProjX(t1)} y2={height / 2 + 12} stroke="#38bdf8" strokeWidth={2} />
                        <circle cx={scaleProjX(t1)} cy={height / 2} r={5} fill="#38bdf8" stroke="#ffffff" strokeWidth={1.5} />
                        <text x={scaleProjX(t1)} y={height / 2 - 18} fill="#94a3b8" textAnchor="middle" className="text-[9px]">
                          {t1.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}
                </g>
              ) : (
                // 2D Projection Space View
                <g>
                  <line x1={padding} y1={scaleProjY(0)} x2={width - padding} y2={scaleProjY(0)} stroke="#475569" strokeDasharray="3 3" />
                  <line x1={scaleProjX(0)} y1={padding} x2={scaleProjX(0)} y2={height - padding} stroke="#475569" strokeDasharray="3 3" />
                  <text x={width - padding} y={scaleProjY(0) + 20} fill="#fbbf24" textAnchor="end">
                    Principal Component 1 (T₁) →
                  </text>
                  <text x={scaleProjX(0) + 8} y={padding + 10} fill="#34d399">
                    ↑ Principal Component 2 (T₂)
                  </text>

                  {points.map((p, idx) => {
                    const t1 = p.projected?.[0] ?? 0;
                    const t2 = p.projected?.[1] ?? 0;
                    return (
                      <circle
                        key={`proj2d-${p.id ?? idx}`}
                        cx={scaleProjX(t1)}
                        cy={scaleProjY(t2)}
                        r={5}
                        fill="#06b6d4"
                        stroke="#0891b2"
                        strokeWidth={1.5}
                        className="cursor-pointer hover:r-7 transition-all"
                        onMouseEnter={() => setHoveredPoint(p)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}
                </g>
              )}
            </svg>
          )}

          {/* VIEW F: EXPLAINED VARIANCE RATIOS */}
          {activeTab === 'variance' && (
            <div className="w-full h-[270px] flex flex-col justify-center px-6">
              <h4 className="text-xs font-bold text-slate-300 uppercase mb-4 tracking-wider">
                Eigenvalue Variance Ratios (λⱼ / Σ λ)
              </h4>
              <div className="space-y-4">
                {explainedVarianceRatios.map((ratio, i) => {
                  const pct = (ratio * 100).toFixed(1);
                  const isRetained = i < k;
                  const cumPct = (cumulativeVarianceRatios[i] * 100).toFixed(1);

                  return (
                    <div key={`var-bar-${i}`} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className={`font-semibold ${isRetained ? 'text-cyan-300' : 'text-slate-400'}`}>
                          PC{i + 1} (λ{i + 1} = {eigenvalues[i]?.toFixed(2) ?? 0}) {isRetained && '★ Retained'}
                        </span>
                        <span className="text-slate-300">
                          {pct}% <span className="text-slate-500 text-[10px]">(Cum: {cumPct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isRetained ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' : 'bg-slate-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW G: RECONSTRUCTION */}
          {activeTab === 'reconstruction' && (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />
              <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />

              {/* Connect original to reconstructed with error residual line */}
              {points.map((p, idx) => {
                const ox = scaleX(p.original[0] ?? 0);
                const oy = scaleY(p.original[1] ?? 0);
                const rx = scaleX(p.reconstructed?.[0] ?? p.original[0]);
                const ry = scaleY(p.reconstructed?.[1] ?? p.original[1]);

                return (
                  <g key={`recon-${p.id ?? idx}`}>
                    {/* Error line */}
                    <line x1={ox} y1={oy} x2={rx} y2={ry} stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="2 2" />
                    {/* Original observation (Sky Circle) */}
                    <circle cx={ox} cy={oy} r={4.5} fill="#38bdf8" />
                    {/* Reconstructed observation (Emerald Square) */}
                    <rect x={rx - 4} y={ry - 4} width={8} height={8} fill="#10b981" stroke="#047857" strokeWidth={1} />
                  </g>
                );
              })}

              <text x={width - padding} y={height - padding + 25} fill="#94a3b8" textAnchor="end">
                Feature X₁ →
              </text>
              <text x={padding} y={padding - 12} fill="#94a3b8" textAnchor="start">
                ↑ Feature X₂
              </text>
            </svg>
          )}

          {/* Point Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none bg-slate-950/95 border border-slate-700 rounded-md p-2 text-xs shadow-2xl z-20 font-mono"
              style={{
                left: `${Math.min(Math.max(scaleX(hoveredPoint.original[0] ?? 0) - 70, 10), width - 160)}px`,
                top: `${Math.max(scaleY(hoveredPoint.original[1] ?? 0) - 80, 10)}px`,
              }}
            >
              <div className="font-bold text-cyan-300 mb-1">Observation #{hoveredPoint.id + 1}</div>
              <div className="text-[11px] text-slate-300">
                Original: ({hoveredPoint.original.map(v => v.toFixed(1)).join(', ')})
              </div>
              <div className="text-[11px] text-slate-400">
                Centered: ({hoveredPoint.centered.map(v => v.toFixed(1)).join(', ')})
              </div>
              {hoveredPoint.projected && (
                <div className="text-[11px] text-amber-300">
                  Projected: ({hoveredPoint.projected.map(v => v.toFixed(1)).join(', ')})
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              Original Sample X
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
              Centered Sample Z
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-amber-400 inline-block" />
              PC1 Axis (Max Variance)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t border-dashed border-emerald-400 inline-block" />
              PC2 Axis (Orthogonal)
            </span>
            {activeTab === 'reconstruction' && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 inline-block" />
                  Reconstructed X̂
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-3 h-0.5 border-t border-dashed border-rose-400 inline-block" />
                  Residual Error
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
