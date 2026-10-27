import React from 'react';
import type { ClusteringSnapshot } from '../../types/ml';

interface ClusterPlotProps {
  data: ClusteringSnapshot;
}

const CLUSTER_COLORS = [
  { fill: '#3b82f6', stroke: '#1d4ed8', bg: 'rgba(59, 130, 246, 0.2)' }, // Blue
  { fill: '#10b981', stroke: '#047857', bg: 'rgba(16, 185, 129, 0.2)' }, // Emerald
  { fill: '#f59e0b', stroke: '#b45309', bg: 'rgba(245, 158, 11, 0.2)' }, // Amber
  { fill: '#a855f7', stroke: '#7e22ce', bg: 'rgba(168, 85, 247, 0.2)' }, // Purple
  { fill: '#ec4899', stroke: '#be185d', bg: 'rgba(236, 72, 153, 0.2)' }, // Pink
];

export const ClusterPlot: React.FC<ClusterPlotProps> = ({ data }) => {
  const { points, centroids, iteration, inertia, converged, k } = data;

  const width = 500;
  const height = 320;
  const padding = 40;

  // Compute bounding box encompassing points and centroids
  const allX = [...points.map(p => p.x), ...centroids.map(c => c.x)];
  const allY = [...points.map(p => p.y), ...centroids.map(c => c.y)];

  const minX = Math.min(0, ...allX);
  const maxX = Math.max(100, ...allX);
  const minY = Math.min(0, ...allY);
  const maxY = Math.max(100, ...allY);

  const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX || 1)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - ((y - minY) / (maxY - minY || 1)) * (height - 2 * padding);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative select-none">
      <div className="w-full max-w-xl bg-slate-900/90 dark:bg-surface-900 rounded-xl border border-slate-700/60 p-4 shadow-xl">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">K-Means Clustering</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Iter {iteration} (K={k})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-amber-400">
              Inertia (WCSS): <b>{inertia.toFixed(1)}</b>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                converged
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {converged ? 'Converged' : 'Optimizing'}
            </span>
          </div>
        </div>

        {/* SVG Plot */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - padding - pct * (height - 2 * padding);
            const val = (minY + pct * (maxY - minY)).toFixed(0);
            return (
              <g key={`grid-y-${i}`}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#334155" strokeDasharray="3 3" opacity={0.5} />
                <text x={padding - 8} y={y + 3} fill="#94a3b8" textAnchor="end">{val}</text>
              </g>
            );
          })}

          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const x = padding + pct * (width - 2 * padding);
            const val = (minX + pct * (maxX - minX)).toFixed(0);
            return (
              <g key={`grid-x-${i}`}>
                <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="#334155" strokeDasharray="3 3" opacity={0.5} />
                <text x={x} y={height - padding + 15} fill="#94a3b8" textAnchor="middle">{val}</text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" strokeWidth={1.5} />

          {/* Association lines from points to assigned centroids */}
          {points.map((p) => {
            if (p.cluster < 0) return null;
            const centroid = centroids.find(c => c.cluster === p.cluster);
            if (!centroid) return null;
            const color = CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length];
            return (
              <line
                key={`assoc-${p.id}`}
                x1={scaleX(p.x)}
                y1={scaleY(p.y)}
                x2={scaleX(centroid.x)}
                y2={scaleY(centroid.y)}
                stroke={color.fill}
                strokeWidth={1}
                strokeDasharray="2 3"
                opacity={0.35}
              />
            );
          })}

          {/* Data Points */}
          {points.map((p) => {
            const color = p.cluster >= 0 ? CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length] : { fill: '#94a3b8', stroke: '#475569' };
            return (
              <circle
                key={`point-${p.id}`}
                cx={scaleX(p.x)}
                cy={scaleY(p.y)}
                r={4.5}
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth={1.5}
                className="transition-all duration-300"
              >
                <title>{`(${p.x.toFixed(1)}, ${p.y.toFixed(1)}) - Cluster ${p.cluster}`}</title>
              </circle>
            );
          })}

          {/* Centroids */}
          {centroids.map((c) => {
            const color = CLUSTER_COLORS[c.cluster % CLUSTER_COLORS.length];
            const cx = scaleX(c.x);
            const cy = scaleY(c.y);
            return (
              <g key={`centroid-${c.id}`} className="transition-all duration-500">
                {/* Glow ring */}
                <circle cx={cx} cy={cy} r={14} fill={color.fill} opacity={0.2} />
                {/* Diamond/Star centroid marker */}
                <rect
                  x={cx - 7}
                  y={cy - 7}
                  width={14}
                  height={14}
                  fill={color.fill}
                  stroke="#ffffff"
                  strokeWidth={2}
                  transform={`rotate(45 ${cx} ${cy})`}
                />
                {/* Cross marker */}
                <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#ffffff" strokeWidth={1.5} />
                <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#ffffff" strokeWidth={1.5} />
                {/* Centroid label */}
                <text
                  x={cx}
                  y={cy - 12}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="filter drop-shadow"
                >
                  C{c.cluster + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
          {centroids.map((c) => {
            const color = CLUSTER_COLORS[c.cluster % CLUSTER_COLORS.length];
            const count = points.filter(p => p.cluster === c.cluster).length;
            return (
              <div key={`legend-${c.id}`} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm rotate-45 inline-block" style={{ backgroundColor: color.fill }} />
                <span>Cluster {c.cluster + 1}: <b className="text-white">{count} pts</b></span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
