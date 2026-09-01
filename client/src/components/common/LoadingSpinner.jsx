export default function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <span
      className={`inline-block border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
