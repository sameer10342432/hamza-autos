import React, { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: 'red' | 'warm' | 'white';
  opacity?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  hue: string;
}

/**
 * FloatingParticles
 * High-performance, GPU-friendly HTML5 Canvas particle system
 * Pauses automatically via IntersectionObserver when off-screen
 */
export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 24,
  color = 'red',
  opacity = 0.65,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return; // Do not animate for reduced motion users
    }

    // Set canvas dimensions
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Responsive particle count (fewer on mobile for speed)
    const effectiveCount = width < 768 ? Math.min(count, 12) : count;

    // Color palettes
    const getParticleColor = () => {
      if (color === 'red') {
        return Math.random() > 0.3 ? 'rgba(229, 9, 20,' : 'rgba(255, 255, 255,';
      }
      if (color === 'warm') {
        return Math.random() > 0.5 ? 'rgba(245, 158, 11,' : 'rgba(229, 9, 20,';
      }
      return 'rgba(255, 255, 255,';
    };

    // Initialize particles
    const particles: Particle[] = Array.from({ length: effectiveCount }, () => {
      const baseAlpha = Math.random() * 0.45 + 0.15;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.45 + 0.15), // Upward floating ember
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        hue: getParticleColor()
      };
    });

    let tick = 0;

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);
      tick += 0.015;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle sinusoidal horizontal sway
        p.x += p.vx + Math.sin(tick + i) * 0.15;
        p.y += p.vy;

        // Subtle alpha breathing
        p.alpha = p.baseAlpha + Math.sin(tick * 2 + i) * 0.12;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 5;
        if (p.x > width + 10) p.x = -5;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.hue} ${Math.max(0, p.alpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#E50914';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(render);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none select-none z-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};
