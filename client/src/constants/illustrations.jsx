// Inline SVG illustrations for hero/sections. Kept small to avoid bundling images.
export const ILLUST_PLANE = (
  <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#FF6D00" />
    <path d="M30 60 L88 40 L78 70 L60 60 L42 75 Z" fill="#FFF8E1" stroke="#1A1A2E" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="60" cy="60" r="50" stroke="#1A1A2E" strokeWidth="3" />
  </svg>
);

export const ILLUST_SUITCASE = (
  <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="38" width="76" height="64" rx="6" fill="#00C853" stroke="#1A1A2E" strokeWidth="3" />
    <rect x="50" y="22" width="20" height="18" rx="3" fill="#FF6D00" stroke="#1A1A2E" strokeWidth="3" />
    <line x1="22" y1="58" x2="98" y2="58" stroke="#1A1A2E" strokeWidth="3" />
    <circle cx="60" cy="78" r="6" fill="#FF4081" stroke="#1A1A2E" strokeWidth="3" />
  </svg>
);

export const ILLUST_PALM = (
  <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="120" height="120" rx="12" fill="#00B0FF" />
    <circle cx="92" cy="28" r="14" fill="#FFE066" />
    <path d="M60 100 L60 60" stroke="#1A1A2E" strokeWidth="4" strokeLinecap="round" />
    <path d="M60 60 Q30 40 22 50 Q40 50 60 60" fill="#00C853" stroke="#1A1A2E" strokeWidth="3" />
    <path d="M60 60 Q90 38 100 50 Q82 52 60 60" fill="#00C853" stroke="#1A1A2E" strokeWidth="3" />
    <path d="M60 60 Q40 22 50 18 Q60 36 60 60" fill="#00C853" stroke="#1A1A2E" strokeWidth="3" />
    <path d="M60 60 Q80 22 70 18 Q60 36 60 60" fill="#00C853" stroke="#1A1A2E" strokeWidth="3" />
  </svg>
);

export const ILLUST_MOUNTAIN = (
  <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="120" height="120" rx="12" fill="#FFF8E1" />
    <polygon points="10,100 50,40 70,70 90,30 110,100" fill="#7C4DFF" stroke="#1A1A2E" strokeWidth="3" />
    <polygon points="50,40 60,55 70,70 60,70 40,70" fill="#FFF8E1" />
    <polygon points="90,30 100,50 110,100 80,100 85,60" fill="#00C853" stroke="#1A1A2E" strokeWidth="3" />
    <circle cx="100" cy="22" r="8" fill="#FF6D00" />
  </svg>
);
