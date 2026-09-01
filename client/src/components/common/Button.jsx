import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-brand-orange text-white border-2 border-navy shadow-retro hover:shadow-retro-orange hover:-translate-y-0.5',
  secondary:
    'bg-white text-navy border-2 border-navy shadow-retro hover:shadow-retro-green hover:-translate-y-0.5',
  green:
    'bg-brand-green text-white border-2 border-navy shadow-retro hover:shadow-retro-green hover:-translate-y-0.5',
  violet:
    'bg-brand-violet text-white border-2 border-navy shadow-retro hover:shadow-retro-violet hover:-translate-y-0.5',
  ghost: 'bg-transparent text-navy hover:bg-navy/5',
  danger: 'bg-rose-500 text-white border-2 border-navy',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    className = '',
    loading = false,
    disabled = false,
    icon,
    iconRight,
    fullWidth = false,
    ...rest
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold font-fredoka disabled:opacity-50 disabled:cursor-not-allowed transition-shadow ${variants[variant] || variants.primary} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="inline-flex">{icon}</span>
      ) : null}
      {children}
      {iconRight && <span className="inline-flex">{iconRight}</span>}
    </motion.button>
  );
});

export default Button;
