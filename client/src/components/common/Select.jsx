import { forwardRef, useId } from 'react';

const Select = forwardRef(function Select(
  { label, hint, error, options = [], className = '', id, placeholder, ...rest },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-navy mb-1.5 font-fredoka"
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center bg-white border-2 rounded-2xl px-4 transition focus-within:border-brand-violet ${
          error ? 'border-rose-500' : 'border-navy/20'
        }`}
      >
        <select
          ref={ref}
          id={selectId}
          className="flex-1 bg-transparent outline-none py-2.5 text-navy"
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            if (typeof opt === 'string') {
              return <option key={opt} value={opt}>{opt}</option>;
            }
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
      </div>
      {hint && !error && <p className="text-xs text-navy/60 mt-1">{hint}</p>}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
});

export default Select;
