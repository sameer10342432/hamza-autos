import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { Gauge, Zap } from 'lucide-react';

interface RPMGaugeProps {
  className?: string;
  size?: number;
}

/**
 * RPMGauge
 * Decorative automotive motorcycle tachometer inspired by Honda & Yamaha analog/digital gauges
 * Features realistic startup needle sweep, idle fluctuation, and interactive throttle revving
 */
export const RPMGauge: React.FC<RPMGaugeProps> = ({
  className = '',
  size = 220
}) => {
  const [isRevving, setIsRevving] = useState(false);
  const [rpmValue, setRpmValue] = useState(1400); // 1,400 idle RPM

  // Needle angle mapping: 0 RPM = -135deg, 12,000 RPM = +135deg (270deg sweep)
  const angleSpring = useSpring(-135, {
    stiffness: 140,
    damping: 15,
    mass: 0.8
  });

  // Startup sequence: Sweep from 0 to 11,200 RPM and back down to idle 1,400 RPM
  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      angleSpring.set(-103); // ~1,400 RPM
      return;
    }

    const t1 = setTimeout(() => {
      // Sweep to redline
      setRpmValue(11200);
      angleSpring.set(117);
    }, 600);

    const t2 = setTimeout(() => {
      // Return to idle ~1,400 RPM
      setRpmValue(1400);
      angleSpring.set(-103.5);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [angleSpring]);

  // Subtle natural idle needle pulse (ticking every 2.4s)
  useEffect(() => {
    if (isRevving) return;

    const interval = setInterval(() => {
      const flutter = Math.floor(Math.random() * 120) - 60;
      const currentIdle = 1400 + flutter;
      setRpmValue(currentIdle);
      // Map 0-12000 to -135 to +135
      const deg = -135 + (currentIdle / 12000) * 270;
      angleSpring.set(deg);
    }, 2200);

    return () => clearInterval(interval);
  }, [isRevving, angleSpring]);

  const handleRev = () => {
    setIsRevving(true);
    const targetRpm = Math.floor(Math.random() * 2500) + 7200; // 7,200 - 9,700 RPM
    setRpmValue(targetRpm);
    const deg = -135 + (targetRpm / 12000) * 270;
    angleSpring.set(deg);

    setTimeout(() => {
      setRpmValue(1400);
      angleSpring.set(-103.5);
      setIsRevving(false);
    }, 900);
  };

  // Generate tick marks (0 to 12)
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const angle = -135 + (i / 12) * 270;
    const isRedline = i >= 9;
    return { value: i, angle, isRedline };
  });

  return (
    <div 
      data-feature="rpm-gauge"
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{ width: size }}
      role="figure"
      aria-label="Decorative motorcycle tachometer gauge"
    >
      <div 
        onClick={handleRev}
        className="relative cursor-pointer group rounded-full p-2 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-700/80 shadow-2xl hover:border-red-500/50 transition-all duration-300"
        style={{ width: size, height: size }}
        title="Click to rev engine throttle"
      >
        {/* Outer Metallic Bezel Ring */}
        <div className="absolute inset-1 rounded-full border border-slate-600/40 pointer-events-none" />

        {/* Dial Face */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Carbon Fiber Dial Texture */}
          <circle cx="100" cy="100" r="92" fill="#0B1120" />
          <circle cx="100" cy="100" r="92" fill="none" stroke="#1E293B" strokeWidth="2" />

          {/* Redline Arc from 9k to 12k RPM */}
          {/* Arc between +67.5deg and +135deg */}
          <path
            d="M 165 137 A 78 78 0 0 0 178 100"
            fill="none"
            stroke="#E50914"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Normal Safe RPM Arc */}
          <path
            d="M 45 155 A 78 78 0 1 1 165 137"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
          />

          {/* Dial Tick Marks & Labels */}
          {ticks.map((t) => {
            const rad = (t.angle * Math.PI) / 180;
            // Outer tick position
            const x1 = 100 + 78 * Math.cos(rad);
            const y1 = 100 + 78 * Math.sin(rad);
            // Inner tick position
            const x2 = 100 + (t.isRedline ? 66 : 70) * Math.cos(rad);
            const y2 = 100 + (t.isRedline ? 66 : 70) * Math.sin(rad);
            // Number label position
            const lx = 100 + 56 * Math.cos(rad);
            const ly = 100 + 56 * Math.sin(rad) + 4;

            return (
              <g key={t.value}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={t.isRedline ? '#E50914' : 'rgba(255,255,255,0.8)'}
                  strokeWidth={t.isRedline ? 2.5 : 1.5}
                />
                <text
                  x={lx}
                  y={ly}
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={t.isRedline ? '#E50914' : '#94A3B8'}
                  className="font-mono"
                >
                  {t.value}
                </text>
              </g>
            );
          })}

          {/* Intermediate Sub-Ticks (Half-Thousands) */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = -135 + (i + 0.5) * (270 / 12);
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 78 * Math.cos(rad);
            const y1 = 100 + 78 * Math.sin(rad);
            const x2 = 100 + 73 * Math.cos(rad);
            const y2 = 100 + 73 * Math.sin(rad);
            const isRedline = i >= 9;
            return (
              <line
                key={`sub-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isRedline ? '#E50914' : 'rgba(255,255,255,0.35)'}
                strokeWidth="1"
              />
            );
          })}

          {/* Central Logo & Label */}
          <text x="100" y="80" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#E50914" letterSpacing="0.1em" className="font-heading">
            HAMZA AUTOS
          </text>
          <text x="100" y="90" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#64748B" letterSpacing="0.08em">
            RPM × 1000
          </text>

          {/* Digital LCD Sub-Display Window */}
          <rect x="70" y="118" width="60" height="20" rx="4" fill="#030712" stroke="#334155" strokeWidth="1" />
          <text x="100" y="132" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#38BDF8" className="font-mono">
            {rpmValue.toLocaleString()}
          </text>

          {/* Gear Neutral Indicator Light */}
          <circle cx="100" cy="150" r="5" fill="#10B981" />
          <text x="100" y="152.5" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">
            N
          </text>
        </svg>

        {/* Animated Tachometer Needle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ rotate: angleSpring }}
        >
          <div className="relative w-full h-full">
            {/* The needle pointer */}
            <div 
              className="absolute left-1/2 bottom-1/2 w-[3px] bg-gradient-to-t from-[#B91C1C] via-[#E50914] to-red-400 rounded-full shadow-glow-red -translate-x-1/2 origin-bottom"
              style={{ height: size * 0.38 }}
            />
            {/* Counterweight Pin on opposite side */}
            <div 
              className="absolute left-1/2 top-1/2 w-[4px] h-[16px] bg-slate-400 rounded-full -translate-x-1/2 origin-top"
            />
          </div>
        </motion.div>

        {/* Central Hub Cap */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-500 shadow-md flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-xs" />
        </div>
      </div>

      {/* Decorative Interactive Hint */}
      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
        <Zap className="w-3 h-3 text-[#E50914] animate-pulse" />
        <span>Tap dial to rev · Tuning Spec</span>
      </div>
    </div>
  );
};
