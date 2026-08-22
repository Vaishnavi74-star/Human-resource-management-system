import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  className,
  title = 'Something went wrong',
  message = 'We encountered an error while trying to fetch this data. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-rose-100 bg-rose-50/40',
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-100/80 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-xs">
        <AlertOctagon className="w-7 h-7" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mt-1.5 leading-relaxed">{message}</p>

      {onRetry && (
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
