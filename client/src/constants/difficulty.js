// Trip difficulty levels — mirror server Package model enum.

export const DIFFICULTY = {
  Easy: { label: 'Easy', color: 'bg-brand-mint text-navy', dots: 1 },
  Moderate: { label: 'Moderate', color: 'bg-brand-orange text-white', dots: 2 },
  Challenging: { label: 'Challenging', color: 'bg-brand-rose text-white', dots: 3 },
};

export const getDifficultyMeta = (key) =>
  DIFFICULTY[key] || { label: key, color: 'bg-navy text-white', dots: 1 };
