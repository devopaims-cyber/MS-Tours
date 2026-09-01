// Reusable Framer Motion variants for page transitions, stagger, etc.

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

export const stagger = (delay = 0.08) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: delay,
      delayChildren: 0.1,
    },
  },
});

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const slideInRight = {
  hidden: { x: 50, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const hoverLift = {
  rest: { y: 0, boxShadow: '0 4px 14px rgba(26,26,46,0.08)' },
  hover: { y: -6, boxShadow: '0 14px 32px rgba(26,26,46,0.18)' },
};
