import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { resizeImage, buildSrcSet } from '@/utils/image';

export default function ImageGallery({ images = [], alt = '' }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) return null;

  const main = images[active];
  const next = () => setActive((i) => (i + 1) % images.length);
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);

  return (
    <div>
      <div
        className="relative aspect-[16/10] rounded-3xl overflow-hidden border-2 border-navy bg-cream-200 cursor-zoom-in"
        onClick={() => setLightbox(true)}
      >
        <img
          src={resizeImage(main, { w: 1200, h: 800 })}
          srcSet={buildSrcSet(main, { heights: { 320: 200, 480: 300, 800: 500, 1200: 750, 1600: 1000 } })}
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt={alt}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border-2 border-navy flex items-center justify-center hover:bg-white"
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border-2 border-navy flex items-center justify-center hover:bg-white"
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          </>
        )}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActive(i); }}
              className={`w-2 h-2 rounded-full transition ${
                i === active ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                i === active ? 'border-brand-violet' : 'border-navy/10 hover:border-navy/40'
              }`}
            >
              <img
                src={resizeImage(img, { w: 200, h: 200 })}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white text-navy flex items-center justify-center"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <img
              src={resizeImage(main, { w: 1600 })}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
