export default function Skeleton({ className = '', rounded = 'rounded-2xl' }) {
  return (
    <div
      className={`bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:1000px_100%] animate-shimmer ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
}
