import React, { useEffect, useRef } from 'react';

interface CursorGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
  className?: string;
}

/**
 * CursorGlow
 * High-performance, GPU-accelerated red radial illumination tracking pointer position
 * Direct DOM transform translation with zero React state re-renders on RAF
 * Automatically disabled on touch screens and prefers-reduced-motion
 */
export const CursorGlow: React.FC<CursorGlowProps> = ({
  color = 'rgba(229, 9, 20, 0.18)',
  size = 350,
  opacity = 0.85,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isVisible = false;
    let rafId: number | null = null;
    let isRunning = false;

    const updatePosition = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      currentX += dx * 0.15;
      currentY += dy * 0.15;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX - size / 2}px, ${currentY - size / 2}px, 0)`;
        glowRef.current.style.opacity = isVisible ? opacity.toString() : '0';
      }

      // Only continue RAF if movement is significant or visibility is transitioning
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        rafId = requestAnimationFrame(updatePosition);
      } else {
        isRunning = false;
        rafId = null;
      }
    };

    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const parent = containerRef.current?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        isVisible = true;
      } else {
        isVisible = false;
      }

      startAnimation();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      startAnimation();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [opacity, size]);

  return (
    <div
      ref={containerRef}
      data-cursor-glow="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-10 ${className}`}
      aria-hidden="true"
    >
      <div
        ref={glowRef}
        className="absolute top-0 left-0 rounded-full pointer-events-none filter blur-[70px] will-change-transform transition-opacity duration-300"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: 0,
          transform: 'translate3d(-9999px, -9999px, 0)'
        }}
      />
    </div>
  );
};
