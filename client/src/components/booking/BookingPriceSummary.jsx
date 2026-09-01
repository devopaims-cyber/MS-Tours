import { motion } from 'framer-motion';
import { formatINR } from '@/utils/formatters';
import Badge from '../common/Badge';

export default function BookingPriceSummary({ title, items = [], total, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border-2 border-navy shadow-card-soft overflow-hidden"
    >
      <div className="px-5 py-3 bg-brand-violet text-white flex items-center justify-between">
        <span className="font-fredoka">{title}</span>
        {subtitle && <Badge tone="cream">{subtitle}</Badge>}
      </div>
      <div className="p-5 space-y-3">
        {items.map((line, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-navy/70">{line.label}</span>
            <span className="font-semibold text-navy">{formatINR(line.amount)}</span>
          </div>
        ))}
        <div className="border-t-2 border-navy/10 pt-3 flex items-center justify-between">
          <span className="font-fredoka text-navy">Total</span>
          <span className="font-fredoka text-2xl text-navy">{formatINR(total)}</span>
        </div>
      </div>
    </motion.div>
  );
}
