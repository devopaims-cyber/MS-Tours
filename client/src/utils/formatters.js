// Currency / number / date formatters used across the app.
// Defaults to INR; pass currency= to override.

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const INR_PRECISE = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

export const formatINR = (value, { precise = false } = {}) => {
  if (value == null || Number.isNaN(value)) return '—';
  return (precise ? INR_PRECISE : INR).format(value);
};

export const formatNumber = (value) => {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN').format(value);
};

const DATE_FMT = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const DATE_FMT_LONG = new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const TIME_FMT = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export const formatDate = (value) => {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return DATE_FMT.format(d);
};

export const formatDateLong = (value) => {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return DATE_FMT_LONG.format(d);
};

export const formatTime = (value) => {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return TIME_FMT.format(d);
};

// Pretty duration: "2h 15m" → "2 hr 15 min"
export const formatDuration = (str) => {
  if (!str) return '';
  return str
    .replace(/h/g, ' hr')
    .replace(/m/g, ' min')
    .replace(/\s+/g, ' ')
    .trim();
};

// "4 days" / "6N/7D" pretty-printer
export const formatDurationDays = (n) => `${n} ${n === 1 ? 'day' : 'days'}`;

// Truncate a long string with ellipsis.
export const truncate = (str, n = 100) => {
  if (!str) return '';
  return str.length > n ? `${str.slice(0, n - 1).trimEnd()}…` : str;
};

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const addDaysISO = (iso, days) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
