import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  padding = 'md',
  children,
  ...props
}) => {
  const variants = {
    default:
      'bg-white border border-slate-200/90 shadow-sm shadow-slate-200/50 text-slate-900 hover:shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300 rounded-2xl glitter-hover dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:hover:border-indigo-500/50 dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]',
    flat: 'bg-slate-50/90 border border-slate-200/80 text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 rounded-2xl dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-200',
    interactive:
      'bg-white border border-slate-200 text-slate-900 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer rounded-2xl active:scale-[0.98] glitter-hover dark:bg-slate-900 dark:border-indigo-500/30 dark:text-white dark:hover:shadow-[0_0_35px_rgba(6,182,212,0.35)]',
    glass:
      'bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-900 shadow-sm hover:shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300 rounded-2xl glitter-hover dark:bg-slate-900/80 dark:border-white/10 dark:text-white',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(variants[variant], paddings[padding], className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('text-base font-bold text-slate-900 dark:text-white tracking-tight font-[\'Plus_Jakarta_Sans\',sans-serif]', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs text-slate-500 dark:text-slate-400 mt-0.5', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => <div className={cn('', className)} {...props}>{children}</div>;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800', className)} {...props}>
    {children}
  </div>
);
