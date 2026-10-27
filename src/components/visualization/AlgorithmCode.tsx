import React from 'react';
import { cn } from '../../utils/cn';
import { Terminal } from 'lucide-react';

interface AlgorithmCodeProps {
  lines: string[];
  highlightLines: number[];
  lineExplanation?: string;
}

export const AlgorithmCode: React.FC<AlgorithmCodeProps> = ({ lines, highlightLines, lineExplanation }) => {
  const highlightSet = new Set(highlightLines);

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="font-mono text-xs leading-relaxed overflow-auto flex-1 bg-slate-900 text-slate-100 dark:bg-surface-950 p-3 rounded-lg border border-slate-800">
        {lines.map((line, i) => {
          const isHighlighted = highlightSet.has(i);
          return (
            <div
              key={i}
              className={cn(
                'flex gap-3 px-2 py-0.5 rounded transition-all duration-200',
                isHighlighted
                  ? 'bg-primary-600/30 text-primary-200 border-l-2 border-primary-500 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/40'
              )}
            >
              <span className="text-slate-500 select-none w-5 text-right shrink-0">
                {i + 1}
              </span>
              <span className="whitespace-pre">
                {line || ' '}
              </span>
            </div>
          );
        })}
      </div>

      {lineExplanation && (
        <div className="p-2.5 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 text-xs text-primary-900 dark:text-primary-200 flex items-start gap-2">
          <Terminal size={14} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[10px] uppercase tracking-wider text-primary-600 dark:text-primary-400 block mb-0.5">Active Line Context</span>
            <span>{lineExplanation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
