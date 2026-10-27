import React from 'react';
import type { DPCell } from '../../types/algorithm';
import { cn } from '../../utils/cn';

interface DPTableProps {
  table: DPCell[][];
  labels?: { rows: string[]; cols: string[] };
}

const cellStateClass: Record<string, string> = {
  default: 'bg-slate-100 dark:bg-surface-700 text-slate-700 dark:text-slate-300',
  comparing: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 ring-1 ring-amber-400',
  active: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30',
  sorted: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
  selected: 'bg-violet-500 text-white',
};

export const DPTable: React.FC<DPTableProps> = ({ table, labels }) => {
  if (!table || table.length === 0) return null;

  const maxCols = Math.max(...table.map(r => r.length));
  const cellSize = Math.min(52, Math.max(28, Math.floor(580 / (maxCols + 1))));

  return (
    <div className="overflow-auto h-full flex items-center justify-center">
      <table className="border-collapse" style={{ fontSize: `${Math.max(10, cellSize * 0.28)}px` }}>
        {labels && (
          <thead>
            <tr>
              <th className="px-1 py-1" />
              {labels.cols.map((col, j) => (
                <th
                  key={j}
                  className="px-1 py-1 font-mono font-semibold text-slate-500 dark:text-slate-400 text-center"
                  style={{ minWidth: `${cellSize}px`, height: `${cellSize * 0.7}px` }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {table.map((row, i) => (
            <tr key={i}>
              {labels && (
                <td className="px-2 py-1 font-mono font-semibold text-slate-500 dark:text-slate-400 text-right">
                  {labels.rows[i] ?? ''}
                </td>
              )}
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    'dp-cell border border-slate-200 dark:border-surface-600 text-center font-mono font-semibold rounded transition-all duration-200',
                    cellStateClass[cell.state] ?? cellStateClass.default
                  )}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    minWidth: `${cellSize}px`,
                  }}
                >
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
