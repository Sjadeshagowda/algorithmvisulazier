import React from 'react';
import type { ArrayElement } from '../../types/algorithm';
import { cn } from '../../utils/cn';

interface ArrayTableProps {
  elements: ArrayElement[];
  className?: string;
}

const stateBadge: Record<string, { label: string; badge: string }> = {
  default: { label: 'Normal', badge: 'bg-slate-100 dark:bg-surface-700 text-slate-600 dark:text-slate-300' },
  comparing: { label: 'Comparing', badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold' },
  swapping: { label: 'Swapping', badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-bold' },
  active: { label: 'Active', badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold' },
  sorted: { label: 'Sorted', badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold' },
  selected: { label: 'Selected', badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-bold' },
  pivot: { label: 'Pivot', badge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold' },
  found: { label: 'Found', badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-extrabold' },
  visited: { label: 'Visited', badge: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' },
  excluded: { label: 'Excluded', badge: 'bg-slate-100 dark:bg-surface-800 text-slate-400 opacity-50' },
};

export const ArrayTable: React.FC<ArrayTableProps> = ({ elements, className }) => {
  if (!elements || elements.length === 0) {
    return <div className="text-center text-slate-400 p-4">Empty array</div>;
  }

  return (
    <div className={cn('w-full max-w-2xl mx-auto overflow-x-auto p-3', className)}>
      <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-surface-700 rounded-lg overflow-hidden">
        <thead className="bg-slate-100 dark:bg-surface-750 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-3 py-2 border-b border-slate-200 dark:border-surface-700">Index</th>
            <th className="px-3 py-2 border-b border-slate-200 dark:border-surface-700">Value</th>
            <th className="px-3 py-2 border-b border-slate-200 dark:border-surface-700">State</th>
            <th className="px-3 py-2 border-b border-slate-200 dark:border-surface-700">Relative Magnitude</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-surface-700 bg-white dark:bg-surface-800 font-mono">
          {elements.map((el, idx) => {
            const badge = stateBadge[el.state] ?? stateBadge.default;
            const max = Math.max(...elements.map(e => e.value), 1);
            const pct = Math.round((el.value / max) * 100);

            return (
              <tr
                key={el.id}
                className={cn(
                  'transition-colors',
                  el.state === 'comparing' && 'bg-amber-50/60 dark:bg-amber-950/20',
                  el.state === 'swapping' && 'bg-orange-50/60 dark:bg-orange-950/20',
                  el.state === 'sorted' && 'bg-emerald-50/40 dark:bg-emerald-950/10'
                )}
              >
                <td className="px-3 py-2 font-medium text-slate-500 dark:text-slate-400">[{idx}]</td>
                <td className="px-3 py-2 font-bold text-slate-900 dark:text-white text-sm">{el.value}</td>
                <td className="px-3 py-2">
                  <span className={cn('px-2 py-0.5 rounded text-[10px]', badge.badge)}>
                    {badge.label}
                  </span>
                </td>
                <td className="px-3 py-2 w-48">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 dark:bg-surface-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 w-8 text-right">{pct}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
