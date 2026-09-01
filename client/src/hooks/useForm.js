import { useState, useCallback } from 'react';

// Minimal form state hook. Pass initial values; get values/setters + helpers.
export default function useForm(initial = {}, { onSubmit } = {}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, type, value, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const setField = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  }, []);

  const reset = useCallback((next = initial) => {
    setValues(next);
    setErrors({});
  }, [initial]);

  const setAllErrors = useCallback((errs) => setErrors(errs || {}), []);

  const submit = useCallback(
    async (e) => {
      if (e?.preventDefault) e.preventDefault();
      if (!onSubmit) return;
      setSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, values]
  );

  return { values, setValues, setField, handleChange, errors, setErrors, setAllErrors, reset, submitting, submit };
}
