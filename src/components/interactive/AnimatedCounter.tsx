import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // duration in ms (default 1400)
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * AnimatedCounter
 * Smoothly animates verified numerical statistics from 0 to value when entering viewport
 * Respects prefers-reduced-motion and preserves accessibility for screen readers
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 1400,
  label,
  sublabel,
  icon,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const startTime = performance.now();
            const step = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Automotive deceleration curve: 1 - Math.pow(1 - progress, 3)
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(easeProgress * value);

              setDisplayValue(current);

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                setDisplayValue(value);
              }
            };

            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [value, duration, hasAnimated]);

  return (
    <div
      ref={elementRef}
      className={`bg-white rounded-2xl p-6 border border-slate-200/90 shadow-automotive hover:shadow-automotive-hover hover:border-red-200 transition-all flex flex-col justify-between ${className}`}
      aria-label={`${prefix}${value}${suffix} ${label}`}
    >
      <div className="flex items-center justify-between mb-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center font-bold">
            {icon}
          </div>
        )}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
          VERIFIED DATA
        </span>
      </div>

      <div className="space-y-1">
        <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-mono">
          <span className="text-[#E50914]">{prefix}</span>
          <span>{displayValue.toLocaleString()}</span>
          <span className="text-[#E50914]">{suffix}</span>
        </div>
        <h4 className="text-sm font-bold text-slate-900 font-heading">{label}</h4>
        {sublabel && (
          <p className="text-xs text-slate-500 leading-snug">{sublabel}</p>
        )}
      </div>
    </div>
  );
};

export interface CounterItem {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  description?: string;
}

export interface CounterGroupProps {
  title?: string;
  subtitle?: string;
  counters: CounterItem[];
}

export const CounterGroup: React.FC<CounterGroupProps> = ({
  title,
  subtitle,
  counters
}) => {
  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block">
            Verified Credentials
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {counters.map((c, i) => (
          <AnimatedCounter
            key={i}
            value={c.value}
            suffix={c.suffix}
            prefix={c.prefix}
            label={c.label}
            sublabel={c.description}
          />
        ))}
      </div>
    </div>
  );
};
