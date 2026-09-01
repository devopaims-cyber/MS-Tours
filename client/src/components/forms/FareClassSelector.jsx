const classes = [
  { value: 'economy', label: 'Economy', sub: 'Standard legroom + meal' },
  { value: 'premium', label: 'Premium', sub: 'Extra legroom + priority' },
  { value: 'business', label: 'Business', sub: 'Lie-flat seats + lounge' },
];

export default function FareClassSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {classes.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          className={`text-left p-4 rounded-2xl border-2 transition ${
            value === c.value
              ? 'border-brand-violet bg-brand-violet/10'
              : 'border-navy/15 hover:border-navy/40'
          }`}
        >
          <div className="font-fredoka text-navy">{c.label}</div>
          <div className="text-xs text-navy/60 mt-0.5">{c.sub}</div>
        </button>
      ))}
    </div>
  );
}
