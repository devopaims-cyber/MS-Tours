import { useEffect, useRef, useState } from 'react';

// Returns a ref + boolean. Becomes true once the element enters the viewport.
// Use with Framer Motion's `whileInView` to skip animating offscreen elements.
export default function useScrollReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current || seen) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            if (once) obs.disconnect();
          }
        });
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, once, seen]);

  return [ref, seen];
}
