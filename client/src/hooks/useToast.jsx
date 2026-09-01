// Lightweight toast hook + provider. Used across the app for success/error
// notifications. Implementation lives in components/common/Toast.jsx; this
// hook is a thin wrapper that dispatches to the global toast store.

import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext({ push: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (toast) => {
      const id = Date.now() + Math.random();
      const t = { id, kind: 'info', duration: 3500, ...toast };
      setToasts((prev) => [...prev, t]);
      setTimeout(() => dismiss(id), t.duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const tones = {
    success: 'bg-brand-green text-white',
    error: 'bg-rose-500 text-white',
    info: 'bg-navy text-white',
    warning: 'bg-brand-orange text-white',
  };
  return (
    <div
      role="status"
      className={`pointer-events-auto px-5 py-3 rounded-2xl shadow-card-lift font-semibold flex items-center gap-3 max-w-sm ${tones[toast.kind] || tones.info}`}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onClose}
        className="opacity-70 hover:opacity-100 transition"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export default useToast;
