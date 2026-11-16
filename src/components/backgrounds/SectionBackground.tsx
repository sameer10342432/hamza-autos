import React from 'react';
import { AnimatedGearBackground } from './AnimatedGearBackground';
import { MechanicalGridBackground } from './MechanicalGridBackground';
import { FloatingParticles } from './FloatingParticles';
import { RedLightSweep } from './RedLightSweep';
import { RoadNetworkPattern } from './RoadNetworkPattern';

export type BackgroundVariant = 
  | 'hero' 
  | 'services' 
  | 'about' 
  | 'brands' 
  | 'areas' 
  | 'gallery' 
  | 'reviews' 
  | 'blog' 
  | 'cta' 
  | 'footer' 
  | 'dark-generic' 
  | 'light-generic';

interface SectionBackgroundProps {
  variant: BackgroundVariant;
  className?: string;
  opacity?: number;
}

/**
 * SectionBackground
 * Master animated automotive background orchestrator
 * Combines sprockets, drafting grids, light sweeps, and particle systems tailored to each section
 */
export const SectionBackground: React.FC<SectionBackgroundProps> = ({
  variant,
  className = '',
  opacity
}) => {
  switch (variant) {
    case 'hero':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Deep Navy Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0B1120] to-[#111827]" />
          
          {/* Volumetric Red Light Sweep */}
          <RedLightSweep intensity="medium" interactive={true} />

          {/* Technical Engineering Drafting Grid */}
          <MechanicalGridBackground theme="dark" opacity={opacity ?? 0.45} animated={true} />

          {/* Precision Motorcycle Sprocket Gear Assemblies */}
          <AnimatedGearBackground theme="dark" opacity={0.12} align="right" />

          {/* Floating Mechanical Sparks & Embers */}
          <FloatingParticles count={24} color="red" opacity={0.7} />

          {/* Subtle Vignette Gradient Masking */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-transparent to-[#0F172A]/70" />
        </div>
      );

    case 'services':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Light Technical Blueprint Grid */}
          <MechanicalGridBackground theme="light" opacity={opacity ?? 0.3} animated={false} />

          {/* Corner Motorcycle Sprocket Detail */}
          <AnimatedGearBackground theme="light" opacity={0.05} align="right" />

          {/* Subtle Red Ambient Edge Glow */}
          <div 
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full filter blur-[100px] pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(229, 9, 20, 0.12) 0%, transparent 70%)' }}
          />
        </div>
      );

    case 'about':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Engineering Drafting Grid */}
          <MechanicalGridBackground theme="light" opacity={opacity ?? 0.35} animated={false} />

          {/* Mechanical Timing Gear & Calipers */}
          <AnimatedGearBackground theme="light" opacity={0.06} align="left" />

          {/* Subtle Red Radial Accent */}
          <div 
            className="absolute bottom-0 left-10 w-80 h-80 rounded-full filter blur-[90px] pointer-events-none opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(229, 9, 20, 0.1) 0%, transparent 70%)' }}
          />
        </div>
      );

    case 'brands':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Technical Precision Grid */}
          <MechanicalGridBackground theme="light" opacity={opacity ?? 0.35} animated={true} />

          {/* Dual Counter-Rotating Gears */}
          <AnimatedGearBackground theme="light" opacity={0.06} align="both" />
        </div>
      );

    case 'areas':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Abstract Lahore Commuter Transit Road Network */}
          <RoadNetworkPattern theme="light" opacity={opacity ?? 0.35} />

          {/* Faint Drafting Grid */}
          <MechanicalGridBackground theme="light" opacity={0.2} showCrosshairs={false} />
        </div>
      );

    case 'gallery':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Dark Charcoal Technical Backdrop */}
          <MechanicalGridBackground theme="dark" opacity={opacity ?? 0.25} />

          {/* Subtle Ambient Red Glow */}
          <div 
            className="absolute inset-0 filter blur-[100px] pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(229, 9, 20, 0.2) 0%, transparent 70%)' }}
          />

          {/* Subtle Sprocket Silhouette */}
          <AnimatedGearBackground theme="dark" opacity={0.05} align="center" />
        </div>
      );

    case 'reviews':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Light Grid */}
          <MechanicalGridBackground theme="light" opacity={opacity ?? 0.25} showCrosshairs={false} />

          {/* Ambient Warm Atmosphere */}
          <div 
            className="absolute top-10 left-1/3 w-96 h-96 rounded-full filter blur-[110px] pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(229, 9, 20, 0.06) 50%, transparent 70%)' }}
          />
        </div>
      );

    case 'blog':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Clean Reading-Friendly Blueprint Grid */}
          <MechanicalGridBackground theme="light" opacity={opacity ?? 0.22} showCrosshairs={false} />
          
          {/* Subtle Corner Sprocket */}
          <AnimatedGearBackground theme="light" opacity={0.04} align="right" />
        </div>
      );

    case 'cta':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Deep Charcoal / Red Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#0B1120]" />

          {/* Sweeping Red Volumetric Beam */}
          <RedLightSweep intensity="strong" interactive={true} />

          {/* Technical Grid Overlay */}
          <MechanicalGridBackground theme="dark" opacity={opacity ?? 0.35} animated={true} />

          {/* Large Sprocket Silhouettes */}
          <AnimatedGearBackground theme="dark" opacity={0.14} align="both" />

          {/* Rising Sparks and Embers */}
          <FloatingParticles count={18} color="red" opacity={0.8} />
        </div>
      );

    case 'footer':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          {/* Dark Navy Blueprint Base */}
          <MechanicalGridBackground theme="dark" opacity={opacity ?? 0.4} animated={false} />

          {/* Slow Counter-Rotating Gears */}
          <AnimatedGearBackground theme="dark" opacity={0.09} align="both" />

          {/* Ambient Red Sweep */}
          <RedLightSweep intensity="subtle" interactive={false} />

          {/* Bottom Fade Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/90" />
        </div>
      );

    case 'dark-generic':
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          <MechanicalGridBackground theme="dark" opacity={opacity ?? 0.3} />
          <AnimatedGearBackground theme="dark" opacity={0.06} align="right" />
          <RedLightSweep intensity="subtle" interactive={true} />
        </div>
      );

    case 'light-generic':
    default:
      return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
          <MechanicalGridBackground theme="light" opacity={opacity ?? 0.25} />
          <AnimatedGearBackground theme="light" opacity={0.04} align="right" />
        </div>
      );
  }
};
