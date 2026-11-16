import React from 'react';

interface AnimatedGearBackgroundProps {
  theme?: 'dark' | 'light';
  opacity?: number;
  align?: 'right' | 'left' | 'both' | 'center';
  showChain?: boolean;
  className?: string;
}

/**
 * AnimatedGearBackground
 * High-precision authentic motorcycle sprocket & mechanical gear system
 * Features counter-rotating SVG layers with lightening pockets and timing marks
 */
export const AnimatedGearBackground: React.FC<AnimatedGearBackgroundProps> = ({
  theme = 'dark',
  opacity = 0.08,
  align = 'right',
  showChain = false,
  className = ''
}) => {
  const strokeColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const accentStroke = '#E50914';

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* RIGHT SIDE SPROCKET ASSEMBLY */}
      {(align === 'right' || align === 'both') && (
        <div className="absolute -right-24 sm:-right-16 -top-24 sm:-top-16 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px]">
          {/* Outer Rear Driven Sprocket (52-Teeth Outline) - Rotating Clockwise */}
          <div className="absolute inset-0 animate-gear-cw-slow">
            <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
              {/* Outer Pitch Circle & Teeth Ring */}
              <circle cx="200" cy="200" r="185" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="6 3" />
              <circle cx="200" cy="200" r="172" stroke={strokeColor} strokeWidth="2.5" />
              <circle cx="200" cy="200" r="160" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Sprocket Teeth simulation (radial ticks) */}
              <circle cx="200" cy="200" r="190" stroke={strokeColor} strokeWidth="4" strokeDasharray="8 8" />

              {/* 6 Weight-Reduction Cutout Holes */}
              <circle cx="200" cy="110" r="28" stroke={strokeColor} strokeWidth="2" fill="none" />
              <circle cx="278" cy="155" r="28" stroke={strokeColor} strokeWidth="2" fill="none" />
              <circle cx="278" cy="245" r="28" stroke={strokeColor} strokeWidth="2" fill="none" />
              <circle cx="200" cy="290" r="28" stroke={strokeColor} strokeWidth="2" fill="none" />
              <circle cx="122" cy="245" r="28" stroke={strokeColor} strokeWidth="2" fill="none" />
              <circle cx="122" cy="155" r="28" stroke={strokeColor} strokeWidth="2" fill="none" />

              {/* Central Hub & Bolt Pattern */}
              <circle cx="200" cy="200" r="65" stroke={strokeColor} strokeWidth="2" />
              <circle cx="200" cy="200" r="45" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="200" cy="200" r="25" stroke={accentStroke} strokeWidth="2.5" />

              {/* 4 Mounting Bolt Circles */}
              <circle cx="200" cy="155" r="7" stroke={strokeColor} strokeWidth="2" />
              <circle cx="245" cy="200" r="7" stroke={strokeColor} strokeWidth="2" />
              <circle cx="200" cy="245" r="7" stroke={strokeColor} strokeWidth="2" />
              <circle cx="155" cy="200" r="7" stroke={strokeColor} strokeWidth="2" />

              {/* Mechanical Datum Crosshairs */}
              <line x1="200" y1="5" x2="200" y2="395" stroke={accentStroke} strokeWidth="0.75" strokeDasharray="16 8" />
              <line x1="5" y1="200" x2="395" y2="200" stroke={accentStroke} strokeWidth="0.75" strokeDasharray="16 8" />
            </svg>
          </div>

          {/* Inner Counter-Rotating Engine Drive Gear - Rotating Counter-Clockwise */}
          <div className="absolute inset-[24%] animate-gear-ccw-slow">
            <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
              <circle cx="100" cy="100" r="90" stroke={accentStroke} strokeWidth="1.5" strokeDasharray="6 4" />
              <circle cx="100" cy="100" r="82" stroke={strokeColor} strokeWidth="2" />
              <circle cx="100" cy="100" r="70" stroke={strokeColor} strokeWidth="1" />
              
              {/* Internal Gear Teeth Profile */}
              <circle cx="100" cy="100" r="95" stroke={strokeColor} strokeWidth="3" strokeDasharray="6 6" />

              {/* 3 Radiused Internal Cutouts */}
              <circle cx="100" cy="65" r="14" stroke={strokeColor} strokeWidth="1.5" />
              <circle cx="130" cy="120" r="14" stroke={strokeColor} strokeWidth="1.5" />
              <circle cx="70" cy="120" r="14" stroke={strokeColor} strokeWidth="1.5" />

              {/* Splined Axle Hole */}
              <circle cx="100" cy="100" r="22" stroke={strokeColor} strokeWidth="2" />
              <circle cx="100" cy="100" r="12" stroke={accentStroke} strokeWidth="2" strokeDasharray="4 2" />
            </svg>
          </div>
        </div>
      )}

      {/* LEFT SIDE SECONDARY TIMING GEAR */}
      {(align === 'left' || align === 'both') && (
        <div className="absolute -left-28 sm:-left-20 -bottom-24 sm:-bottom-16 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
          <div className="absolute inset-0 animate-gear-cw-medium">
            <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
              {/* Camshaft Timing Gear */}
              <circle cx="150" cy="150" r="140" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="8 4" />
              <circle cx="150" cy="150" r="130" stroke={strokeColor} strokeWidth="2" />
              <circle cx="150" cy="150" r="118" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 2" />
              
              {/* Timing Teeth */}
              <circle cx="150" cy="150" r="144" stroke={strokeColor} strokeWidth="3" strokeDasharray="6 6" />

              {/* 4 Spoke Radial Bars */}
              <line x1="150" y1="40" x2="150" y2="260" stroke={strokeColor} strokeWidth="2.5" />
              <line x1="40" y1="150" x2="260" y2="150" stroke={strokeColor} strokeWidth="2.5" />

              {/* Timing Indicator Mark "T" & "O" */}
              <circle cx="150" cy="20" r="4" stroke={accentStroke} strokeWidth="2" fill="none" />
              <circle cx="150" cy="150" r="40" stroke={strokeColor} strokeWidth="2" />
              <circle cx="150" cy="150" r="20" stroke={accentStroke} strokeWidth="2" />
            </svg>
          </div>
        </div>
      )}

      {/* CENTER CALIPER MEASUREMENT ARC */}
      {align === 'center' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[650px] lg:h-[650px]">
          <div className="absolute inset-0 animate-gear-cw-slow">
            <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
              <circle cx="200" cy="200" r="190" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="200" cy="200" r="175" stroke={accentStroke} strokeWidth="1.5" strokeDasharray="12 12" />
              <circle cx="200" cy="200" r="160" stroke={strokeColor} strokeWidth="2" />
              <circle cx="200" cy="200" r="120" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Quadrant Caliper Markers */}
              <circle cx="200" cy="10" r="3" fill={accentStroke} />
              <circle cx="390" cy="200" r="3" fill={accentStroke} />
              <circle cx="200" cy="390" r="3" fill={accentStroke} />
              <circle cx="10" cy="200" r="3" fill={accentStroke} />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
