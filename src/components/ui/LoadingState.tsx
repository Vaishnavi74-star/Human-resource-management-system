import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  className,
  message = 'Loading data...',
  description,
  size = 'md',
  fullHeight = false,
  ...props
}) => {
  const spinnerSizes = {
    sm: 'w-5 h-5 text-indigo-600',
    md: 'w-8 h-8 text-indigo-600',
    lg: 'w-12 h-12 text-indigo-600',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center select-none',
        fullHeight ? 'min-h-[350px] h-full' : 'py-12',
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
          <Loader2 className={cn('animate-spin', spinnerSizes[size])} />
        </div>
      </div>
      {message && <h4 className="text-sm font-semibold text-slate-800">{message}</h4>}
      {description && <p className="text-xs text-slate-500 max-w-xs mt-1">{description}</p>}
    </div>
  );
};
