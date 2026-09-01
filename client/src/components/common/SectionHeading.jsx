import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', className = '' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-2xl ${alignClass} ${className}`}
    >
      {eyebrow && (
        <span className="pill bg-brand-violet/15 text-brand-violet border border-brand-violet/30 mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-fredoka text-navy leading-tight">
        {title}
      </h2>
      {subtitle && <p className="text-navy/70 mt-2 text-lg">{subtitle}</p>}
    </motion.div>
  );
}
