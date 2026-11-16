import React from 'react';

interface MechanicalScannerProps {
  className?: string;
  active?: boolean;
  speed?: 'normal' | 'slow';
  label?: string;
}

/**
 * MechanicalScanner
 * Decorative automotive laser telemetry sweep line with coordinates overlay
 */
export const MechanicalScanner: React.FC<MechanicalScannerProps> = ({
  className = '',
  active = true,
  speed = 'normal',
  label = 'SYS-DIAG-ACTIVE'
}) => {
  if (!active) return null;

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden rounded-2xl select-none z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Laser Scanning Beam */}
      <div 
        className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_12px_#E50914] ${
          speed === 'slow' ? 'animate-[scannerSlow_6s_ease-in-out_infinite]' : 'animate-[scannerFast_3.5s_ease-in-out_infinite]'
        }`}
      />

      {/* Telemetry Corner Indicators */}
      <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[9px] text-red-500/70 font-bold tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
        <span>{label}</span>
      </div>

      <div className="absolute top-2 right-2 font-mono text-[9px] text-slate-500/80 tracking-tighter">
        4T-CYL · 0.6mm
      </div>
    </div>
  );
};
