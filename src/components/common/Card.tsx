import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, padding = 'md' }) => {
  const paddingClass = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' }[padding];
  return (
    <div className={cn(hover ? 'card-hover' : 'card', paddingClass, className)}>
      {children}
    </div>
  );
};
