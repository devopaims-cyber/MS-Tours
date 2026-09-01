import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function RatingStars({ value = 0, max = 5, size = 16, showValue = false, className = '' }) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    if (value >= i) stars.push(<FaStar key={i} size={size} className="text-brand-orange" />);
    else if (value >= i - 0.5)
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-brand-orange" />);
    else stars.push(<FaRegStar key={i} size={size} className="text-navy/20" />);
  }
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${value} out of ${max}`}>
      <span className="inline-flex items-center gap-0.5">{stars}</span>
      {showValue && <span className="text-sm font-semibold text-navy">{value.toFixed(1)}</span>}
    </span>
  );
}
