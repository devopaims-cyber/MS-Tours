import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resizeImage } from '@/utils/image';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';

export default function DestinationCard({ destination }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative rounded-3xl border-2 border-navy shadow-card-soft hover:shadow-card-lift overflow-hidden aspect-[4/5]"
    >
      <Link to={`/packages?destination=${destination._id}`} className="block w-full h-full">
        <img
          src={resizeImage(destination.image, { w: 600, h: 750 })}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {destination.tags?.slice(0, 2).map((t) => (
            <Badge key={t} tone="violet">{t}</Badge>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="text-xs opacity-80 mb-1">{destination.country}</div>
          <h3 className="font-fredoka text-2xl leading-tight">{destination.name}</h3>
          <div className="mt-2 inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            <RatingStars value={destination.rating || 0} size={10} />
            <span>{destination.rating?.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
