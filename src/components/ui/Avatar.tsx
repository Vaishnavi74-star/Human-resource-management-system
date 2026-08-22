import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'away' | 'offline' | 'on-leave';
  ring?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  name = '',
  size = 'md',
  status,
  ring = false,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-4 h-4 ring-2',
  };

  const statusColors = {
    active: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
    'on-leave': 'bg-rose-500',
  };

  // Deterministic pastel color for initials background
  const getInitialsBg = (str: string) => {
    const colors = [
      'bg-indigo-600 text-white',
      'bg-blue-600 text-white',
      'bg-violet-600 text-white',
      'bg-emerald-600 text-white',
      'bg-teal-600 text-white',
      'bg-rose-600 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold select-none shadow-xs',
          sizes[size],
          ring && 'ring-2 ring-white ring-offset-2 ring-offset-slate-100',
          !src || hasError ? getInitialsBg(name) : 'bg-slate-100',
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white',
            statusSizes[size],
            statusColors[status]
          )}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
