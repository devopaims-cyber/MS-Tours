import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import RatingStars from '../common/RatingStars';

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6 relative"
    >
      <FaQuoteLeft className="absolute -top-3 left-6 text-3xl text-brand-orange" />
      <p className="text-navy/80 italic leading-relaxed mt-3">"{testimonial.quote}"</p>
      <div className="flex items-center gap-3 mt-5 pt-5 border-t-2 border-navy/10">
        {testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full border-2 border-navy object-cover"
          />
        )}
        <div className="flex-1">
          <div className="font-fredoka text-navy">{testimonial.name}</div>
          <div className="text-xs text-navy/60">{testimonial.role || 'Traveller'}</div>
        </div>
        {testimonial.rating && <RatingStars value={testimonial.rating} size={12} />}
      </div>
    </motion.div>
  );
}
