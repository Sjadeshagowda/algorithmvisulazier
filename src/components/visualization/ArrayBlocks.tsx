import React from 'react';
import type { ArrayElement } from '../../types/algorithm';
import { cn } from '../../utils/cn';

interface ArrayBlocksProps {
  elements: ArrayElement[];
  className?: string;
}

const stateStyles: Record<string, string> = {
  default: 'bg-white dark:bg-surface-800 border-slate-300 dark:border-surface-600 text-slate-800 dark:text-slate-100',
  comparing: 'bg-amber-100 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-400/40 scale-105',
  active: 'bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105',
  swapping: 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-500/30 scale-110',
  selected: 'bg-violet-500 border-violet-600 text-white shadow-lg shadow-violet-500/30 scale-105',
  sorted: 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/20',
  found: 'bg-green-500 border-green-600 text-white ring-4 ring-green-400/50 scale-110',
  excluded: 'bg-slate-100 dark:bg-surface-800 border-dashed border-slate-300 dark:border-surface-700 text-slate-400 opacity-40',
};

export const ArrayBlocks: React.FC<ArrayBlocksProps> = ({ elements, className }) => {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-2 p-4 max-w-full overflow-x-auto', className)}>
      {elements.map((el, idx) => {
        const style = stateStyles[el.state] ?? stateStyles.default;
        return (
          <div key={el.id} className="flex flex-col items-center gap-1.5 transition-transform duration-200">
            <div
              className={cn(
                'w-12 h-14 rounded-xl border flex items-center justify-center font-mono font-bold text-base transition-all duration-300',
                style
              )}
            >
              {el.value}
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              [{idx}]
            </span>
          </div>
        );
      })}
    </div>
  );
};
