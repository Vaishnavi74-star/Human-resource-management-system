import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none rounded-xl cursor-pointer glitter-hover';

    const variants = {
      primary:
        'btn-futuristic-primary text-white focus:ring-indigo-500',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 focus:ring-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700',
      outline:
        'bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 focus:ring-indigo-500 dark:bg-slate-900/60 dark:hover:bg-indigo-950/60 dark:text-slate-200 dark:border-indigo-500/40',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-indigo-600 hover:scale-105 active:scale-95 focus:ring-slate-400 dark:hover:bg-white/10 dark:text-slate-300 dark:hover:text-cyan-400',
      danger:
        'btn-futuristic-danger text-white focus:ring-rose-500',
      success:
        'btn-futuristic-success text-white focus:ring-emerald-500',
      white:
        'bg-white hover:bg-slate-50 text-indigo-700 font-extrabold shadow-md hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 focus:ring-white border border-slate-200/80',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1.5 gap-1.5',
      sm: 'text-xs px-3.5 py-2 gap-2',
      md: 'text-sm px-4 py-2.5 gap-2.5',
      lg: 'text-base px-6 py-3.5 gap-3',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        
        {children && <span>{children}</span>}

        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
