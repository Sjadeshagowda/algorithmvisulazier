import React from 'react';
import { cn } from '../../utils/cn';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
  step?: number;
}

export const Slider: React.FC<SliderProps> = ({
  min, max, value, onChange, label, className, step = 1,
}) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{label}</span>
          <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{value}</span>
        </div>
      )}
      <div className="relative h-2 rounded-full bg-slate-200 dark:bg-surface-600">
        <div
          className="absolute h-2 rounded-full bg-primary-500 transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          aria-label={label}
        />
      </div>
    </div>
  );
};
