import React from 'react';
import type { ComplexityInfo } from '../../types/algorithm';
import { Clock, Database, CheckCircle, XCircle } from 'lucide-react';

interface ComplexityCardProps {
  complexity: ComplexityInfo;
  stable?: boolean;
  inPlace?: boolean;
}

export const ComplexityCard: React.FC<ComplexityCardProps> = ({ complexity, stable, inPlace }) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Clock size={13} className="text-primary-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time Complexity</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Best', value: complexity.best, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Avg', value: complexity.average, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Worst', value: complexity.worst, color: 'text-red-600 dark:text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-50 dark:bg-surface-700 rounded-lg p-2 text-center">
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5">{label}</div>
              <div className={`text-xs font-mono font-bold ${color}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Database size={13} className="text-violet-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Space</span>
        </div>
        <div className="bg-slate-50 dark:bg-surface-700 rounded-lg p-2 text-center">
          <div className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400">{complexity.space}</div>
        </div>
      </div>

      {(stable !== undefined || inPlace !== undefined) && (
        <div className="pt-2 border-t border-slate-200 dark:border-surface-700 grid grid-cols-2 gap-2">
          {stable !== undefined && (
            <div className="bg-slate-50 dark:bg-surface-700 rounded-lg p-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Stable</span>
              <div className="flex items-center gap-1 text-xs font-semibold">
                {stable ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={12} /> Yes
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <XCircle size={12} /> No
                  </span>
                )}
              </div>
            </div>
          )}
          {inPlace !== undefined && (
            <div className="bg-slate-50 dark:bg-surface-700 rounded-lg p-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">In-Place</span>
              <div className="flex items-center gap-1 text-xs font-semibold">
                {inPlace ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={12} /> Yes
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <XCircle size={12} /> No
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
