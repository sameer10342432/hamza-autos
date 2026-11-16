import React, { useState, useEffect } from 'react';

interface RedLightSweepProps {
  intensity?: 'subtle' | 'medium' | 'strong';
  interactive?: boolean;
  className?: string;
}

/**
 * RedLightSweep
 * Cinematic red volumetric ambient light beam for dark automotive sections
 */
export const RedLightSweep: React.FC<RedLightSweepProps> = ({
  intensity = 'medium',
  interactive = true,
  className = ''
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!interactive) return;

    // Check touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position relative to window
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  const opacityMap = {
    subtle: 'opacity-20',
    medium: 'opacity-35',
    strong: 'opacity-55'
  };

  return (
    <div 
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Primary Sweeping Volumetric Beam */}
      <div 
        className={`absolute -inset-[50%] animate-red-sweep mix-blend-screen filter blur-[80px] sm:blur-[120px] ${opacityMap[intensity]}`}
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(229, 9, 20, 0.45) 0%, rgba(153, 27, 27, 0.25) 45%, transparent 70%)'
        }}
      />

      {/* 2. Secondary Interactive Radial Spotlight (Desktop cursor hover) */}
      {interactive && mousePos && (
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none mix-blend-screen filter blur-[90px]"
          style={{
            background: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, rgba(229, 9, 20, 0.22) 0%, transparent 70%)`
          }}
        />
      )}

      {/* 3. Deep Vignette Bordering */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />
    </div>
  );
};
