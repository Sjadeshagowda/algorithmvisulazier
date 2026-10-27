import React from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PointerProps {
  label: string;
  color?: string;
  className?: string;
}

export const Pointer: React.FC<PointerProps> = ({
  label,
  color = 'text-primary-500',
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center select-none pointer-events-none animate-bounce', className)}>
      <span className={cn('text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-800 text-white shadow-sm', color)}>
        {label}
      </span>
      <ArrowDown size={14} className={color} />
    </div>
  );
};
