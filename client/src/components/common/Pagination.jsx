import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function getPageRange(current, totalPages) {
  const max = 5;
  if (totalPages <= max) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  // Insert ellipses where there's a gap
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    out.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      out.push('…');
    }
  }
  return out;
}

export default function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  if (totalPages <= 1) return null;

  const range = getPageRange(page, totalPages);
  const go = (p) => {
    const next = Math.min(totalPages, Math.max(1, p));
    if (next !== page) onChange(next);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl border-2 border-navy/10 bg-white flex items-center justify-center disabled:opacity-40 hover:border-navy/30"
        aria-label="Previous page"
      >
        <FaChevronLeft className="text-sm" />
      </button>

      {range.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="w-9 h-9 flex items-center justify-center text-navy/40">…</span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            className={`w-9 h-9 rounded-xl border-2 text-sm font-semibold transition ${
              p === page
                ? 'bg-brand-violet text-white border-navy shadow-retro'
                : 'bg-white border-navy/10 text-navy hover:border-navy/30'
            }`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl border-2 border-navy/10 bg-white flex items-center justify-center disabled:opacity-40 hover:border-navy/30"
        aria-label="Next page"
      >
        <FaChevronRight className="text-sm" />
      </button>
    </nav>
  );
}
