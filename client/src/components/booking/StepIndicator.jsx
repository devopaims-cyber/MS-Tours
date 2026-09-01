import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

export default function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {steps.map((label, i) => {
        const idx = i + 1;
        const isDone = idx < current;
        const isActive = idx === current;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
                backgroundColor: isDone || isActive ? '#7C4DFF' : '#FFF1C7',
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                isDone || isActive ? 'border-navy text-white' : 'border-navy/30 text-navy/50'
              }`}
            >
              {isDone ? <FaCheck size={12} /> : idx}
            </motion.div>
            <div className="text-sm">
              <div className="font-fredoka text-navy hidden sm:block">{label}</div>
              <div className="text-xs text-navy/50 hidden sm:block">Step {idx}</div>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 ${isDone ? 'bg-brand-violet' : 'bg-navy/15'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
