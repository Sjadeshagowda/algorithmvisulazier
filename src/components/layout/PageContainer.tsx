import React from 'react';
import { cn } from '../../utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className, fullWidth }) => {
  return (
    <main className={cn('flex-1 page-enter', fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', className)}>
      {children}
    </main>
  );
};
