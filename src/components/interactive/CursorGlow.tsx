import React, { useEffect, useRef, useState } from 'react';

interface CursorGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
  className?: string;
}

/**
 * CursorGlow
 * Subtle red radial illumination tracking pointer position on desktop
 * Disabled automatically on touch screens and prefers-reduced-motion
 */
export const CursorGlow: React.FC<CursorGlowProps> = ({
  color = 'rgba(229, 9, 20, 0.18)',
  size = 350,
  opacity = 0.85,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const parent = containerRef.current?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      // Check if cursor is within parent bounds
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      // Smooth interpolation (damping factor 0.15)
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      setPos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!pos || !isVisible) {
    return <div ref={containerRef} data-cursor-glow="true" className="absolute inset-0 pointer-events-none" />;
  }

  return (
    <div
      ref={containerRef}
      data-cursor-glow="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-10 ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full pointer-events-none filter blur-[70px] transition-opacity duration-300"
        style={{
          width: size,
          height: size,
          left: pos.x - size / 2,
          top: pos.y - size / 2,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity
        }}
      />
    </div>
  );
};
