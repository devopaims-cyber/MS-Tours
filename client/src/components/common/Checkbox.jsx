export default function Checkbox({ label, checked, onChange, className = '', ...rest }) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}>
      <span
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
          checked ? 'bg-brand-violet border-navy' : 'bg-white border-navy/40'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8.5l3.5 3.5L13 4" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={!!checked}
        onChange={onChange}
        {...rest}
      />
      {label && <span className="text-navy text-sm">{label}</span>}
    </label>
  );
}
