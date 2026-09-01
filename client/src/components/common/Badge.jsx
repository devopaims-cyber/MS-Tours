const tones = {
  green: 'bg-brand-green/20 text-brand-green border-brand-green/30',
  orange: 'bg-brand-orange/20 text-brand-orange border-brand-orange/30',
  sky: 'bg-brand-sky/20 text-brand-sky border-brand-sky/30',
  violet: 'bg-brand-violet/20 text-brand-violet border-brand-violet/30',
  rose: 'bg-brand-rose/20 text-brand-rose border-brand-rose/30',
  navy: 'bg-navy/10 text-navy border-navy/20',
  cream: 'bg-cream-300 text-navy border-navy/10',
};

export default function Badge({ children, tone = 'navy', className = '' }) {
  return (
    <span
      className={`pill border ${tones[tone] || tones.navy} ${className}`}
    >
      {children}
    </span>
  );
}
