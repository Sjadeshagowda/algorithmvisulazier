import React from 'react';
import { cn } from '../../utils/cn';
import type { Difficulty } from '../../types/algorithm';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'difficulty' | Difficulty | 'category';
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'default', color }) => {
  const variantClass: Record<string, string> = {
    default: 'badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced: 'badge-advanced',
    category: `badge ${color ?? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'}`,
  };

  return (
    <span className={cn(variantClass[variant] ?? variantClass.default, className)}>
      {children}
    </span>
  );
};
