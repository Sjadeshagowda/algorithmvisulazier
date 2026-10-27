import React from 'react';
import type { ElementState } from '../../types/algorithm';
import { cn } from '../../utils/cn';

interface GridCanvasProps {
  cells: ElementState[][];
}

const cellClass: Record<string, string> = {
  default: 'bg-slate-100 dark:bg-surface-700',
  selected: 'bg-violet-500 shadow-lg shadow-violet-500/30',
  active: 'bg-blue-500',
  comparing: 'bg-amber-400',
  excluded: 'bg-red-200 dark:bg-red-900/30',
  found: 'bg-emerald-500',
  visited: 'bg-teal-500',
};

export const GridCanvas: React.FC<GridCanvasProps> = ({ cells }) => {
  const n = cells.length;
  if (n === 0) return null;

  const cellSize = Math.min(56, Math.max(24, Math.floor(480 / n)));

  return (
    <div className="flex items-center justify-center h-full">
      <div
        className="grid border border-slate-300 dark:border-surface-600 rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${n}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${n}, ${cellSize}px)`,
        }}
      >
        {cells.map((row, r) =>
          row.map((state, c) => {
            const isLight = (r + c) % 2 === 0;
            return (
              <div
                key={`${r}-${c}`}
                className={cn(
                  'grid-cell flex items-center justify-center border border-slate-200/50 dark:border-surface-600/50 relative',
                  state === 'default'
                    ? isLight
                      ? 'bg-white dark:bg-surface-800'
                      : 'bg-slate-50 dark:bg-surface-700'
                    : cellClass[state] ?? cellClass.default
                )}
                style={{ width: cellSize, height: cellSize }}
              >
                {state === 'selected' && (
                  <span className="text-white font-bold select-none" style={{ fontSize: cellSize * 0.5 }}>
                    ♛
                  </span>
                )}
                {state === 'comparing' && (
                  <span className="text-white/80 font-bold select-none" style={{ fontSize: cellSize * 0.4 }}>
                    ♛
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
