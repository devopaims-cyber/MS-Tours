import { motion } from 'framer-motion';
import { FaPlane, FaClock } from 'react-icons/fa';
import { formatINR, formatDate } from '@/utils/formatters';
import Badge from '../common/Badge';

export default function FlightCard({ flight, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-3xl border-2 border-navy shadow-card-soft hover:shadow-card-lift p-5 sm:p-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-sky/15 flex items-center justify-center text-brand-sky text-xl">
            <FaPlane />
          </div>
          <div>
            <div className="font-fredoka text-navy text-lg">{flight.airline}</div>
            <div className="text-xs text-navy/60">{flight.flightNumber} • {formatDate(flight.date)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="sky">{flight.fareClass}</Badge>
          {flight.stops === 0 && <Badge tone="green">Non-stop</Badge>}
          {flight.stops > 0 && <Badge tone="orange">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</Badge>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 items-center">
        <div>
          <div className="font-fredoka text-2xl text-navy">{flight.departureTime}</div>
          <div className="text-sm text-navy/60">{flight.origin.city} ({flight.origin.code})</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-navy/50 inline-flex items-center gap-1">
            <FaClock /> {flight.duration}
          </div>
          <div className="w-full h-px bg-navy/20 my-2 relative">
            <FaPlane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-violet bg-white px-1" />
          </div>
          <div className="text-xs text-navy/50">{flight.aircraft}</div>
        </div>
        <div className="sm:text-right">
          <div className="font-fredoka text-2xl text-navy">{flight.arrivalTime}</div>
          <div className="text-sm text-navy/60">{flight.destination.city} ({flight.destination.code})</div>
        </div>
      </div>
      <div className="mt-5 pt-5 border-t-2 border-navy/10 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs text-navy/50">Starting from</div>
          <div className="font-fredoka text-2xl text-navy">{formatINR(flight.price)}</div>
          <div className="text-xs text-navy/50">{flight.seatsAvailable} seats left</div>
        </div>
        {onSelect && (
          <button
            onClick={() => onSelect(flight)}
            className="px-5 py-2.5 rounded-2xl bg-brand-orange text-white font-semibold border-2 border-navy shadow-retro hover:-translate-y-0.5 transition"
          >
            Book Now
          </button>
        )}
      </div>
    </motion.div>
  );
}
