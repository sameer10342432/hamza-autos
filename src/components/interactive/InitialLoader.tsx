import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from '../BrandLogo';

interface InitialLoaderProps {
  onComplete?: () => void;
}

/**
 * InitialLoader
 * Branded automotive initial loading splash screen
 * Features the official Hamza Autos logo with rotating precision mechanical gear outline
 * Fades out smoothly once DOM and initial assets are ready
 */
export const InitialLoader: React.FC<InitialLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if session has already displayed initial load to avoid repeated delays
    const hasLoadedBefore = sessionStorage.getItem('hamza_initial_load');
    if (hasLoadedBefore) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Short graceful startup sequence (480ms)
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('hamza_initial_load', 'true');
      if (onComplete) onComplete();
    }, 550);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 bg-[#0B1120] text-white flex flex-col items-center justify-center pointer-events-none select-none"
          aria-live="polite"
          aria-busy={isVisible}
        >
          {/* Subtle Ambient Red Glow */}
          <div 
            className="absolute w-96 h-96 rounded-full filter blur-[100px] pointer-events-none opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(229, 9, 20, 0.35) 0%, transparent 70%)' }}
          />

          {/* Central Logo & Gear Assembly */}
          <div className="relative flex flex-col items-center space-y-6">
            <div className="relative p-8">
              {/* Rotating Mechanical Sprocket Outline Ring */}
              <div className="absolute inset-0 animate-gear-cw-medium pointer-events-none opacity-30">
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                  <circle cx="100" cy="100" r="92" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 4" />
                  <circle cx="100" cy="100" r="82" stroke="#E50914" strokeWidth="2" strokeDasharray="12 6" />
                  <circle cx="100" cy="100" r="70" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="100" cy="100" r="95" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6 8" />
                </svg>
              </div>

              {/* Official Brand Logo */}
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <BrandLogo variant="white" />
              </motion.div>
            </div>

            {/* Precision Loading Line */}
            <div className="w-48 h-[2px] bg-slate-800 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#E50914] to-transparent"
              />
            </div>

            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
              Initializing Precision Workshop Portal
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
