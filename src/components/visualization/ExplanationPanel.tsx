import React from 'react';
import { MessageSquare, ArrowRight, HelpCircle, CheckCircle2, ArrowRightCircle } from 'lucide-react';
import type { AlgorithmStep } from '../../types/algorithm';

interface ExplanationPanelProps {
  description: string;
  stepIndex: number;
  step?: AlgorithmStep | null;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ description, stepIndex, step }) => {
  return (
    <div className="space-y-4 text-xs animate-fade-in" key={stepIndex}>
      {/* Phase banner */}
      {step?.phase && (
        <div className="px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 text-primary-800 dark:text-primary-300 font-medium">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary-500 dark:text-primary-400 block mb-0.5">Phase</span>
          {step.phase}
        </div>
      )}

      {/* Main step narrative */}
      <div className="flex gap-2.5 items-start bg-slate-50 dark:bg-surface-700/60 p-3 rounded-lg border border-slate-200/80 dark:border-surface-600">
        <div className="w-6 h-6 rounded-full bg-primary-500/20 dark:bg-primary-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <MessageSquare size={13} className="text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1">
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal text-xs">
            {description}
          </p>
        </div>
      </div>

      {/* Before -> After State transition */}
      {step?.beforeState && step?.afterState && (
        <div className="bg-slate-900 text-slate-100 dark:bg-surface-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
          <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>State Transformation</span>
            <span className="text-[9px] text-slate-500">before → after</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-slate-400 shrink-0">Before:</span>
            <span className="text-amber-300 font-semibold">{step.beforeState}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <ArrowRight size={12} className="rotate-90 sm:rotate-0" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-slate-400 shrink-0">After:</span>
            <span className="text-emerald-400 font-semibold">{step.afterState}</span>
          </div>
        </div>
      )}

      {/* Structured Reason / Result / Next Step cards */}
      {(step?.reason || step?.result || step?.nextAction) && (
        <div className="space-y-2 pt-1">
          {step?.reason && (
            <div className="flex gap-2 items-start text-slate-600 dark:text-slate-300">
              <HelpCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Why: </strong>
                <span>{step.reason}</span>
              </div>
            </div>
          )}

          {step?.result && (
            <div className="flex gap-2 items-start text-slate-600 dark:text-slate-300">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Outcome: </strong>
                <span>{step.result}</span>
              </div>
            </div>
          )}

          {step?.nextAction && (
            <div className="flex gap-2 items-start text-slate-600 dark:text-slate-300">
              <ArrowRightCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Next: </strong>
                <span>{step.nextAction}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Counters if comparisons / swaps exist */}
      {(step?.comparisonCount !== undefined || step?.swapCount !== undefined) && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-surface-700">
          {step?.comparisonCount !== undefined && (
            <div className="bg-slate-50 dark:bg-surface-700/60 p-2 rounded text-center border border-slate-200/60 dark:border-surface-600">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Comparisons</div>
              <div className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                {step.comparisonCount}
              </div>
            </div>
          )}
          {step?.swapCount !== undefined && (
            <div className="bg-slate-50 dark:bg-surface-700/60 p-2 rounded text-center border border-slate-200/60 dark:border-surface-600">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Swaps / Shifts</div>
              <div className="text-sm font-bold font-mono text-orange-600 dark:text-orange-400">
                {step.swapCount}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

