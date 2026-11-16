import React from 'react';

interface MechanicalGridBackgroundProps {
  theme?: 'dark' | 'light';
  opacity?: number;
  animated?: boolean;
  showCrosshairs?: boolean;
  className?: string;
}

/**
 * MechanicalGridBackground
 * Automotive technical blueprint drafting grid with measurement marks
 */
export const MechanicalGridBackground: React.FC<MechanicalGridBackgroundProps> = ({
  theme = 'dark',
  opacity = 0.4,
  animated = false,
  showCrosshairs = true,
  className = ''
}) => {
  const isDark = theme === 'dark';
  const gridClass = isDark ? 'bg-engineering-grid-dark' : 'bg-engineering-grid-light';
  const crosshairColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)';
  const accentDot = isDark ? 'rgba(229, 9, 20, 0.35)' : 'rgba(229, 9, 20, 0.25)';

  return (
    <div 
      className={`absolute inset-0 pointer-events-none select-none z-0 ${gridClass} ${animated ? 'animate-grid-drift' : ''} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Precision Drafting Accent Crosshairs */}
      {showCrosshairs && (
        <svg className="w-full h-full opacity-60" fill="none">
          <defs>
            <pattern id={`crosshairs-${theme}`} width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Center Crosshair Tick */}
              <line x1="60" y1="52" x2="60" y2="68" stroke={crosshairColor} strokeWidth="1" />
              <line x1="52" y1="60" x2="68" y2="60" stroke={crosshairColor} strokeWidth="1" />
              
              {/* Corner Intersection Micro-Dot */}
              <circle cx="0" cy="0" r="1.5" fill={accentDot} />
              <circle cx="120" cy="0" r="1.5" fill={accentDot} />
              <circle cx="0" cy="120" r="1.5" fill={accentDot} />
              <circle cx="120" cy="120" r="1.5" fill={accentDot} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#crosshairs-${theme})`} />
        </svg>
      )}
    </div>
  );
};
