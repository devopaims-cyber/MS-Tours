import { forwardRef, useId } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, hint, error, className = '', id, rows = 4, ...rest },
  ref
) {
  const generatedId = useId();
  const tid = id || generatedId;
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={tid} className="block text-sm font-semibold text-navy mb-1.5 font-fredoka">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={tid}
        rows={rows}
        className={`w-full bg-white border-2 rounded-2xl px-4 py-2.5 outline-none text-navy placeholder:text-navy/40 transition focus:border-brand-violet ${
          error ? 'border-rose-500' : 'border-navy/20'
        }`}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-navy/60 mt-1">{hint}</p>}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
});

export default Textarea;
