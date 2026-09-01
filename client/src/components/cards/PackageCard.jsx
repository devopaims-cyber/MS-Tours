import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { formatINR, formatDurationDays } from '@/utils/formatters';
import { resizeImage } from '@/utils/image';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';

export default function PackageCard({ pkg, onFavorite, isFavorite = false }) {
  const price = pkg.discountPrice ?? pkg.price;
  const hasDiscount = pkg.discountPrice && pkg.discountPrice < pkg.price;
  const discountPct = hasDiscount ? Math.round((1 - pkg.discountPrice / pkg.price) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative bg-white rounded-3xl border-2 border-navy shadow-card-soft hover:shadow-card-lift overflow-hidden flex flex-col"
    >
      <Link to={`/packages/${pkg._id}`} className="block relative aspect-[4/3] overflow-hidden bg-cream-200">
        <img
          src={resizeImage(pkg.images?.[0], { w: 800, h: 600 })}
          alt={pkg.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {pkg.category && <Badge tone="violet">{pkg.category}</Badge>}
          {hasDiscount && <Badge tone="rose">{discountPct}% OFF</Badge>}
        </div>
        {onFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onFavorite(pkg._id); }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 border-2 border-navy flex items-center justify-center hover:bg-white"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <FaHeart className="text-rose-500" /> : <FaRegHeart className="text-navy" />}
          </button>
        )}
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-navy/60 mb-2">
          {pkg.destination?.name && (
            <span className="inline-flex items-center gap-1">
              <FaMapMarkerAlt /> {pkg.destination.name}
            </span>
          )}
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <FaClock /> {formatDurationDays(pkg.duration)}
          </span>
        </div>
        <h3 className="font-fredoka text-lg text-navy line-clamp-2 leading-snug mb-2 flex-1">
          <Link to={`/packages/${pkg._id}`} className="hover:text-brand-violet transition">
            {pkg.title}
          </Link>
        </h3>
        <div className="flex items-end justify-between mt-2">
          <div>
            <div className="flex items-center gap-1.5">
              <RatingStars value={pkg.rating || 0} size={12} showValue />
              <span className="text-xs text-navy/50">({pkg.reviewCount || 0})</span>
            </div>
            <div className="mt-1">
              {hasDiscount && (
                <span className="text-xs text-navy/40 line-through mr-1">
                  {formatINR(pkg.price)}
                </span>
              )}
              <span className="font-fredoka text-xl text-navy">{formatINR(price)}</span>
              <span className="text-xs text-navy/50"> /person</span>
            </div>
          </div>
          <Link
            to={`/packages/${pkg._id}`}
            className="px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-semibold border-2 border-navy shadow-retro hover:-translate-y-0.5 transition"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
