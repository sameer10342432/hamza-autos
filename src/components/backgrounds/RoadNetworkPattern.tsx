import React from 'react';

interface RoadNetworkPatternProps {
  theme?: 'dark' | 'light';
  opacity?: number;
  className?: string;
}

/**
 * RoadNetworkPattern
 * Abstract arterial route line network representing Lahore commuter corridors
 * Converging directly on the Badami Bagh workshop hub on Abu Bakar Road
 */
export const RoadNetworkPattern: React.FC<RoadNetworkPatternProps> = ({
  theme = 'light',
  opacity = 0.25,
  className = ''
}) => {
  const isDark = theme === 'dark';
  const roadColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)';
  const arterialColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.15)';
  const pulseColor = '#E50914';

  return (
    <div 
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1200 600" className="w-full h-full object-cover" fill="none">
        {/* Background Transit Grid Ring */}
        <circle cx="600" cy="300" r="160" stroke={roadColor} strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="600" cy="300" r="280" stroke={roadColor} strokeWidth="1" strokeDasharray="8 8" />
        <circle cx="600" cy="300" r="420" stroke={roadColor} strokeWidth="0.75" strokeDasharray="12 12" />

        {/* Central Badami Bagh Workshop Hub Target Beacon */}
        <circle cx="600" cy="300" r="28" stroke={pulseColor} strokeWidth="1.5" />
        <circle cx="600" cy="300" r="14" stroke={pulseColor} strokeWidth="2" fill="none" />
        <circle cx="600" cy="300" r="4" fill={pulseColor} />

        {/* Commuter Feeder Routes (Ravi Road, Circular Road, Shadbagh, Misri Shah) */}
        {/* Route 1: North West Corridor (Ravi Road) */}
        <path d="M 150 100 Q 380 220 600 300" stroke={arterialColor} strokeWidth="2" />
        <path d="M 150 100 Q 380 220 600 300" stroke={pulseColor} strokeWidth="2" className="animate-road-dash" />

        {/* Route 2: North East Corridor (Shadbagh / Misri Shah) */}
        <path d="M 1050 80 Q 820 180 600 300" stroke={arterialColor} strokeWidth="2" />
        <path d="M 1050 80 Q 820 180 600 300" stroke={pulseColor} strokeWidth="2" className="animate-road-dash" />

        {/* Route 3: South West Corridor (Azadi Chowk / Walled City) */}
        <path d="M 180 520 Q 400 420 600 300" stroke={arterialColor} strokeWidth="2" />
        <path d="M 180 520 Q 400 420 600 300" stroke={pulseColor} strokeWidth="2" className="animate-road-dash" />

        {/* Route 4: South East Corridor (Railway Station / Garhi Shahu) */}
        <path d="M 1020 500 Q 800 400 600 300" stroke={arterialColor} strokeWidth="2" />
        <path d="M 1020 500 Q 800 400 600 300" stroke={pulseColor} strokeWidth="2" className="animate-road-dash" />

        {/* Feeder Connecting Links */}
        <path d="M 400 80 L 400 230 L 600 300" stroke={roadColor} strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 800 500 L 800 380 L 600 300" stroke={roadColor} strokeWidth="1" strokeDasharray="4 4" />

        {/* Subtle Waypoint Markers */}
        <circle cx="150" cy="100" r="4" fill={pulseColor} opacity="0.6" />
        <circle cx="1050" cy="80" r="4" fill={pulseColor} opacity="0.6" />
        <circle cx="180" cy="520" r="4" fill={pulseColor} opacity="0.6" />
        <circle cx="1020" cy="500" r="4" fill={pulseColor} opacity="0.6" />
      </svg>
    </div>
  );
};
