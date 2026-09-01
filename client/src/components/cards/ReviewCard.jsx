import RatingStars from '../common/RatingStars';
import { formatDate } from '@/utils/formatters';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-navy/10 p-5">
      <div className="flex items-center gap-3 mb-3">
        {review.user?.avatar && (
          <img
            src={review.user.avatar}
            alt={review.user.name}
            className="w-10 h-10 rounded-full border-2 border-navy object-cover"
          />
        )}
        <div className="flex-1">
          <div className="font-fredoka text-navy">{review.user?.name || 'Anonymous'}</div>
          <div className="text-xs text-navy/50">{formatDate(review.createdAt)}</div>
        </div>
        <RatingStars value={review.rating} size={14} />
      </div>
      <p className="text-navy/80 leading-relaxed">{review.comment}</p>
    </div>
  );
}
