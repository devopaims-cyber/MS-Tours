import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { formatINR } from '@/utils/formatters';
import { resizeImage } from '@/utils/image';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';

export default function HotelCard({ hotel }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group bg-white rounded-3xl border-2 border-navy shadow-card-soft hover:shadow-card-lift overflow-hidden flex flex-col"
    >
      <Link to={`/hotels/${hotel._id}`} className="block relative aspect-[4/3] overflow-hidden bg-cream-200">
        <img
          src={resizeImage(hotel.images?.[0], { w: 800, h: 600 })}
          alt={hotel.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        <div className="absolute top-3 left-3">
          <Badge tone="sky">
            {Array.from({ length: hotel.starRating || 0 }).map((_, i) => (
              <FaStar key={i} className="inline-block mr-0.5" />
            ))}
          </Badge>
        </div>
        {hotel.featured && (
          <div className="absolute top-3 right-3">
            <Badge tone="orange">Featured</Badge>
          </div>
        )}
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs text-navy/60 mb-1 inline-flex items-center gap-1">
          <FaMapMarkerAlt /> {hotel.city}, {hotel.country}
        </div>
        <h3 className="font-fredoka text-lg text-navy leading-snug mb-2">
          <Link to={`/hotels/${hotel._id}`} className="hover:text-brand-violet transition">
            {hotel.name}
          </Link>
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hotel.amenities?.slice(0, 4).map((a) => (
            <span key={a} className="pill bg-cream-300 text-navy/80 text-[10px]">
              {a}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <div className="flex items-center gap-1.5">
              <RatingStars value={hotel.rating || 0} size={12} showValue />
              <span className="text-xs text-navy/50">({hotel.reviewCount || 0})</span>
            </div>
            <div className="mt-1">
              <span className="font-fredoka text-xl text-navy">{formatINR(hotel.pricePerNight)}</span>
              <span className="text-xs text-navy/50"> /night</span>
            </div>
          </div>
          <Link
            to={`/hotels/${hotel._id}`}
            className="px-4 py-2 rounded-xl bg-brand-violet text-white text-sm font-semibold border-2 border-navy shadow-retro-violet hover:-translate-y-0.5 transition"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
