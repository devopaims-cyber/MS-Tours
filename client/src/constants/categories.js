// Package categories — mirror server Package model enum.
// Each entry has display label, brand color class, and an icon key for the UI.

export const CATEGORIES = [
  { key: 'Beach', label: 'Beach', color: 'bg-brand-sky text-white', icon: '🏖️' },
  { key: 'Adventure', label: 'Adventure', color: 'bg-brand-green text-white', icon: '🏔️' },
  { key: 'Heritage & Culture', label: 'Heritage', color: 'bg-brand-orange text-white', icon: '🏛️' },
  { key: 'Himalayan', label: 'Himalayan', color: 'bg-brand-violet text-white', icon: '🗻' },
  { key: 'Luxury', label: 'Luxury', color: 'bg-brand-rose text-white', icon: '💎' },
  { key: 'Honeymoon', label: 'Honeymoon', color: 'bg-pink-500 text-white', icon: '💕' },
  { key: 'Family', label: 'Family', color: 'bg-emerald-500 text-white', icon: '👨‍👩‍👧' },
  { key: 'Weekend Trip', label: 'Weekend', color: 'bg-amber-500 text-white', icon: '🎒' },
];

export const getCategoryMeta = (key) =>
  CATEGORIES.find((c) => c.key === key) || { key, label: key, color: 'bg-navy text-white', icon: '✈️' };
