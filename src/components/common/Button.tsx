import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className, children, ...props }, ref) => {
    const base = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      icon: 'btn-icon',
    }[variant];

    const sizeClass = {
      sm: 'text-xs px-3 py-1.5',
      md: '',
      lg: 'text-base px-5 py-2.5',
    }[size];

    return (
      <button ref={ref} className={cn(base, sizeClass, className)} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
