import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {icon && (
        <div className="w-24 h-24 rounded-full bg-brand-violet/10 flex items-center justify-center mb-6 text-brand-violet text-4xl">
          {icon}
        </div>
      )}
      <h3 className="font-fredoka text-2xl text-navy mb-2">{title}</h3>
      {description && <p className="text-navy/60 max-w-md mb-6">{description}</p>}
      {action}
    </motion.div>
  );
}
