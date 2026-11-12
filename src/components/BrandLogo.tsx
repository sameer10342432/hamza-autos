import React from 'react';

interface BrandLogoProps {
  variant?: 'horizontal' | 'icon' | 'white' | 'dark' | 'compact' | 'footer';
  className?: string;
  iconOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  variant = 'horizontal', 
  className = '',
  iconOnly = false 
}) => {
  const isWhite = variant === 'white' || variant === 'footer';
  const isCompact = variant === 'compact';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Precision Sprocket & Dynamic H Monogram Icon */}
      <div 
        className={`relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
          isCompact ? 'w-9 h-9' : 'w-10 h-10 sm:w-11 sm:h-11'
        }`}
      >
        <svg 
          viewBox="0 0 120 120" 
          className="w-full h-full drop-shadow-md group-hover:drop-shadow-red-500/30 transition-all duration-300"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bl-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2E36" />
              <stop offset="50%" stopColor="#E50914" />
              <stop offset="100%" stopColor="#A8070F" />
            </linearGradient>
            <linearGradient id="bl-dark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <filter id="bl-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 12-Tooth Sprocket Gear Ring - subtly rotates on hover */}
          <g className="origin-center transition-transform duration-700 ease-out group-hover:rotate-45">
            <path 
              d="
                M 56 6 L 64 6 L 65 14 L 55 14 Z
                M 80 12 L 87 18 L 82 25 L 75 20 Z
                M 98 32 L 102 40 L 93 44 L 90 36 Z
                M 106 56 L 106 64 L 98 65 L 98 55 Z
                M 102 80 L 98 88 L 90 82 L 93 75 Z
                M 87 102 L 80 108 L 75 100 L 82 95 Z
                M 64 114 L 56 114 L 55 106 L 65 106 Z
                M 40 108 L 33 102 L 38 95 L 45 100 Z
                M 22 88 L 18 80 L 27 75 L 30 82 Z
                M 14 64 L 14 56 L 22 55 L 22 65 Z
                M 18 40 L 22 32 L 30 36 L 27 44 Z
                M 33 18 L 40 12 L 45 20 L 38 25 Z
              " 
              fill="url(#bl-red-grad)" 
            />
            <circle cx="60" cy="60" r="48" fill="url(#bl-dark-grad)" stroke="url(#bl-red-grad)" strokeWidth="3" />
            <circle cx="60" cy="60" r="43" fill="#0B1120" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />
            
            {/* Sprocket weight reduction bores */}
            <circle cx="60" cy="24" r="3.2" fill="#E50914" opacity="0.85" />
            <circle cx="60" cy="96" r="3.2" fill="#E50914" opacity="0.85" />
            <circle cx="24" cy="60" r="3.2" fill="#E50914" opacity="0.85" />
            <circle cx="96" cy="60" r="3.2" fill="#E50914" opacity="0.85" />
          </g>

          {/* Dynamic Geometric H Monogram */}
          <g>
            {/* Left Pillar: Engineered Silver-White */}
            <path d="M 37 32 L 47 32 L 47 88 L 37 88 Z" fill="#FFFFFF" />
            <path d="M 37 32 L 41 32 L 41 88 L 37 84 Z" fill="#E2E8F0" opacity="0.5" />
            
            {/* Right Pillar: Racing Red Power Column */}
            <path d="M 73 32 L 83 32 L 83 88 L 73 88 Z" fill="url(#bl-red-grad)" />
            <path d="M 73 32 L 77 32 L 77 88 L 73 88 Z" fill="#7F1D1D" opacity="0.4" />

            {/* Interlocking Crossbar */}
            <path d="M 47 54 L 73 54 L 73 66 L 47 66 Z" fill="url(#bl-red-grad)" />
            <path d="M 47 54 L 60 54 L 60 66 L 47 66 Z" fill="#FFFFFF" />
            
            {/* Center Torque Drive Bolt */}
            <circle cx="60" cy="60" r="5.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.8" />
            <circle cx="60" cy="60" r="2.2" fill="#E50914" />
          </g>
        </svg>

        {/* Live Workshop Indicator Pulse */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
        </span>
      </div>

      {/* Real, Editable Automotive Typography */}
      {(!iconOnly && variant !== 'icon') && (
        <div className="flex flex-col justify-center leading-none text-left min-w-0">
          <div className="flex items-center gap-1">
            <span 
              className={`font-black tracking-tight font-heading whitespace-nowrap transition-colors duration-200 ${
                isCompact 
                  ? 'text-base sm:text-lg' 
                  : 'text-base sm:text-lg lg:text-xl'
              } ${
                isWhite 
                  ? 'text-white' 
                  : 'text-slate-950 group-hover:text-black'
              }`}
            >
              HAMZA <span className="text-[#E50914] group-hover:text-[#FF1E28] transition-colors">AUTOS</span>
            </span>
          </div>
          
          <span 
            className={`font-extrabold uppercase tracking-wider whitespace-nowrap mt-0.5 transition-colors duration-200 ${
              isCompact 
                ? 'text-[8.5px] sm:text-[9.5px]' 
                : 'text-[9px] sm:text-[10px] lg:text-[10.5px]'
            } ${
              isWhite 
                ? 'text-slate-400' 
                : 'text-slate-500 group-hover:text-red-600'
            }`}
          >
            Motorcycle Repair <span className="text-[#E50914] hidden min-[380px]:inline">· Badami Bagh</span>
          </span>
        </div>
      )}
    </div>
  );
};

