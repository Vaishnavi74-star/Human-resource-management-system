import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  variant?: 'full' | 'icon' | 'white';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  variant = 'full',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-2xl', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-3xl', sub: 'text-xs' },
  };

  const isWhite = variant === 'white';
  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Emblem: Interlocking Flow & Connection Node */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="dfGradient1" x1="2" y1="2" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isWhite ? "#ffffff" : "#4338ca"} />
              <stop offset="100%" stopColor={isWhite ? "#cbd5e1" : "#6366f1"} />
            </linearGradient>
            <linearGradient id="dfGradient2" x1="10" y1="36" x2="34" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isWhite ? "#e2e8f0" : "#3730a3"} />
              <stop offset="100%" stopColor={isWhite ? "#ffffff" : "#818cf8"} />
            </linearGradient>
          </defs>

          {/* Background Rounded Shield / Continuous Loop */}
          <rect width="44" height="44" rx="12" fill={isWhite ? "rgba(255,255,255,0.15)" : "#eef2ff"} />

          {/* Flowing Connected Infinity/Person Workday Wave */}
          <path
            d="M12 28C12 22 17 22 22 22C27 22 32 22 32 16C32 11.58 28.42 8 24 8C19.58 8 16 11.58 16 16"
            stroke="url(#dfGradient1)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M32 16C32 22 27 22 22 22C17 22 12 22 12 28C12 32.42 15.58 36 20 36C24.42 36 28 32.42 28 28"
            stroke="url(#dfGradient2)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Center Connection Node */}
          <circle cx="22" cy="22" r="3" fill={isWhite ? "#ffffff" : "#4f46e5"} />
        </svg>
      </div>

      {/* Wordmark */}
      {variant !== 'icon' && (
        <div className="flex flex-col">
          <div className="flex items-baseline tracking-tight">
            <span
              className={`font-black font-['Plus_Jakarta_Sans',sans-serif] ${currentSize.text} ${
                isWhite ? 'text-white' : 'text-slate-900'
              }`}
            >
              DAY
            </span>
            <span
              className={`font-extrabold font-['Plus_Jakarta_Sans',sans-serif] ${currentSize.text} ${
                isWhite ? 'text-indigo-200' : 'text-indigo-600'
              }`}
            >
              FLOW
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-1 mb-1 animate-pulse"></span>
          </div>

          {showTagline && (
            <span
              className={`font-medium tracking-wide ${currentSize.sub} ${
                isWhite ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              Every workday, perfectly aligned.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
