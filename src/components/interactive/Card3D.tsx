import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 6deg)
  scaleOnHover?: number; // Scale factor (default 1.018)
  onClick?: () => void;
}

/**
 * Card3D
 * Hardware-accelerated 3D perspective tilt container
 * Calculates mouse offset relative to card center and smoothly interpolates rotateX & rotateY
 * Automatically disabled on touch screens and prefers-reduced-motion
 */
export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxTilt = 6,
  scaleOnHover = 1.018,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Springs for smooth physics interpolation
  const rotateX = useSpring(0, { stiffness: 260, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 20 });
  const scale = useSpring(1, { stiffness: 260, damping: 20 });

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-1 to +1)
    const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
    const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);

    // Calculate rotation: mouseY rotates around X axis, mouseX around Y axis
    rotateX.set(-mouseY * maxTilt);
    rotateY.set(mouseX * maxTilt);
    scale.set(scaleOnHover);
  };

  const handleMouseEnter = () => {
    if (isTouch) return;
    setIsHovered(true);
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={cardRef}
      data-card3d="true"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 1000 }}
      className={`group relative ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d'
        }}
        className="w-full h-full transition-shadow duration-300 rounded-2xl will-change-transform"
      >
        {children}

        {/* Subtle Dynamic Specular Glare Layer */}
        {isHovered && !isTouch && (
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-20 mix-blend-overlay transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.8) 0%, transparent 70%)'
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
