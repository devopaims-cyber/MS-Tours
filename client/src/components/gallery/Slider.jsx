import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Slider({ items = [], renderItem, auto = true, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const total = items.length;
  const timer = useRef(null);

  useEffect(() => {
    if (!auto || total < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % total), interval);
    return () => clearInterval(timer.current);
  }, [auto, interval, total]);

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  if (!total) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        >
          {items.map((item, i) => (
            <div key={i} className="w-full flex-shrink-0 px-2">
              {renderItem(item, i)}
            </div>
          ))}
        </motion.div>
      </div>
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-navy flex items-center justify-center"
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-navy flex items-center justify-center"
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
        </>
      )}
    </div>
  );
}
