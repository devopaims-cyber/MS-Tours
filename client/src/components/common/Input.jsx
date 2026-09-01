import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, hint, error, leftIcon, rightIcon, className = '', id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-navy mb-1.5 font-fredoka"
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 bg-white border-2 rounded-2xl px-4 py-2.5 transition focus-within:border-brand-violet ${
          error ? 'border-rose-500' : 'border-navy/20'
        }`}
      >
        {leftIcon && <span className="text-navy/50">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className="flex-1 bg-transparent outline-none text-navy placeholder:text-navy/40"
          {...rest}
        />
        {rightIcon && <span className="text-navy/50">{rightIcon}</span>}
      </div>
      {hint && !error && <p className="text-xs text-navy/60 mt-1">{hint}</p>}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
});

export default Input;
