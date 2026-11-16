import { type Variants } from 'motion/react';

/**
 * HAMZA AUTOS – UNIFIED MOTION DESIGN SYSTEM
 * Automotive Precision Easing & Consistent Timing Tokens
 */

// 1. Easing Curves
export const EASE_AUTOMOTIVE = [0.16, 1, 0.3, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;
export const EASE_SMOOTH = [0.25, 0.1, 0.25, 1] as const;
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

// 2. Durations (seconds)
export const DURATION_MICRO = 0.18;
export const DURATION_BUTTON = 0.22;
export const DURATION_CARD = 0.38;
export const DURATION_SECTION = 0.55;
export const DURATION_PAGE = 0.28;
export const DURATION_HERO = 0.75;

// 3. Page Transition Variants
export const pageTransitionVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 10,
    filter: 'blur(2px)'
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: DURATION_PAGE, 
      ease: EASE_AUTOMOTIVE 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -8,
    filter: 'blur(1px)',
    transition: { 
      duration: 0.18, 
      ease: EASE_IN_OUT 
    } 
  }
};

// 4. Section Scroll Reveal Variants
export const sectionRevealVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 28 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: DURATION_SECTION, 
      ease: EASE_AUTOMOTIVE 
    } 
  }
};

// 5. Staggered Container & Child Variants
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_CARD,
      ease: EASE_AUTOMOTIVE
    }
  }
};

// 6. Fast Stagger for badges and chips
export const quickStaggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05
    }
  }
};

export const quickStaggerItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: EASE_AUTOMOTIVE
    }
  }
};

// 7. Interactive Card Hover Variants
export const interactiveCardHover = {
  rest: { 
    y: 0, 
    scale: 1,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    transition: { duration: DURATION_CARD, ease: EASE_AUTOMOTIVE }
  },
  hover: { 
    y: -5, 
    scale: 1.012,
    boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
    transition: { duration: DURATION_CARD, ease: EASE_AUTOMOTIVE }
  }
};

// 8. Reusable Micro-Interaction Props
export const buttonPressProps = {
  whileHover: { scale: 1.025, y: -1 },
  whileTap: { scale: 0.97 },
  transition: { duration: DURATION_BUTTON, ease: EASE_AUTOMOTIVE }
};

export const iconRotateHoverProps = {
  whileHover: { rotate: 12, scale: 1.15 },
  transition: { duration: DURATION_MICRO, ease: EASE_SPRING }
};

export const pulseAttentionVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.06, 1],
    transition: {
      duration: 2.4,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut'
    }
  }
};
