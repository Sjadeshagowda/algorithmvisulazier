import React from 'react';
import type { ArrayElement } from '../../types/algorithm';
import { cn } from '../../utils/cn';

interface ArrayBarsProps {
  elements: ArrayElement[];
  maxValue?: number;
  className?: string;
}

const stateStyles: Record<string, { bg: string; text: string; border?: string; ring?: string }> = {
  default: {
    bg: 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
  },
  comparing: {
    bg: 'bg-amber-400 dark:bg-amber-500 shadow-md shadow-amber-500/30',
    text: 'text-amber-700 dark:text-amber-300 font-bold',
    ring: 'ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-surface-800',
  },
  swapping: {
    bg: 'bg-orange-500 dark:bg-orange-500 shadow-lg shadow-orange-500/40 animate-pulse',
    text: 'text-orange-700 dark:text-orange-300 font-bold',
    ring: 'ring-2 ring-orange-500 ring-offset-1 dark:ring-offset-surface-800',
  },
  active: {
    bg: 'bg-blue-500 dark:bg-blue-500 shadow-md shadow-blue-500/30',
    text: 'text-blue-700 dark:text-blue-300 font-bold',
    ring: 'ring-2 ring-blue-400',
  },
  selected: {
    bg: 'bg-violet-500 dark:bg-violet-500 shadow-md shadow-violet-500/30',
    text: 'text-violet-700 dark:text-violet-300 font-bold',
  },
  sorted: {
    bg: 'bg-emerald-500 dark:bg-emerald-500 shadow-sm',
    text: 'text-emerald-700 dark:text-emerald-400 font-semibold',
  },
  pivot: {
    bg: 'bg-rose-500 dark:bg-rose-500 shadow-lg shadow-rose-500/40',
    text: 'text-rose-700 dark:text-rose-300 font-bold',
    ring: 'ring-2 ring-rose-500',
  },
  found: {
    bg: 'bg-green-500 dark:bg-green-400 shadow-lg shadow-green-500/50',
    text: 'text-green-700 dark:text-green-300 font-extrabold',
    ring: 'ring-4 ring-green-400/50',
  },
  visited: {
    bg: 'bg-teal-500 dark:bg-teal-500',
    text: 'text-teal-700 dark:text-teal-300',
  },
  current: {
    bg: 'bg-indigo-600 dark:bg-indigo-500',
    text: 'text-indigo-700 dark:text-indigo-300 font-bold',
  },
  excluded: {
    bg: 'bg-slate-200 dark:bg-slate-800 opacity-30',
    text: 'text-slate-400 dark:text-slate-600',
  },
  path: {
    bg: 'bg-yellow-400 dark:bg-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-300 font-bold',
  },
};

export const ArrayBars: React.FC<ArrayBarsProps> = ({ elements, maxValue, className }) => {
  if (!elements || elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500">
        <p className="text-sm">No array elements to display</p>
      </div>
    );
  }

  const values = elements.map(e => e.value);
  const minVal = Math.min(...values);
  const maxVal = maxValue ?? Math.max(...values, 1);
  const range = Math.max(maxVal - (minVal < 0 ? minVal : 0), 1);

  const count = elements.length;
  const barWidth = Math.max(8, Math.min(48, Math.floor(680 / count) - 4));
  const showValues = count <= 24;
  const showIndices = count <= 30;

  return (
    <div className={cn('w-full flex flex-col items-center justify-end select-none px-4 py-6', className)}>
      {/* Chart bars area */}
      <div className="w-full h-64 sm:h-72 flex items-end justify-center gap-1 sm:gap-1.5 border-b border-slate-200 dark:border-surface-700 pb-1">
        {elements.map((el, idx) => {
          // Normalize height between 6% and 96%
          const normalized = Math.max(0, el.value - (minVal < 0 ? minVal : 0));
          const heightPct = Math.max(8, Math.round((normalized / range) * 94));
          const style = stateStyles[el.state] ?? stateStyles.default;

          return (
            <div
              key={el.id}
              className="h-full flex flex-col justify-end items-center group relative transition-all duration-150"
              style={{ width: `${barWidth}px` }}
            >
              {/* Value on top of bar */}
              <div
                className={cn(
                  'mb-1 text-center font-mono font-bold leading-none transition-all',
                  showValues
                    ? 'text-[11px] sm:text-xs'
                    : 'text-[10px] opacity-0 group-hover:opacity-100 group-hover:scale-110',
                  style.text
                )}
              >
                {el.value}
              </div>

              {/* The visual bar */}
              <div
                className={cn(
                  'w-full rounded-t-md transition-all duration-300 ease-out',
                  style.bg,
                  style.ring
                )}
                style={{ height: `${heightPct}%` }}
                title={`Index [${idx}]: Value = ${el.value} (${el.state})`}
              />
            </div>
          );
        })}
      </div>

      {/* Index row beneath baseline */}
      {showIndices && (
        <div className="w-full flex items-center justify-center gap-1 sm:gap-1.5 pt-2">
          {elements.map((el, idx) => (
            <div
              key={el.id}
              className="text-center font-mono text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium"
              style={{ width: `${barWidth}px` }}
            >
              {idx}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
