// Tiny image helpers. The seed data uses Unsplash URLs with query params
// (e.g. ?w=1200&h=800&fit=crop); we override those to deliver
// responsive srcsets for known widths.

const WIDTHS = [320, 480, 640, 800, 1200, 1600];

/**
 * Replace or add width/height/fit query params on a remote image URL.
 * Falls back to the original URL if parsing fails.
 */
export const resizeImage = (url, { w = 1200, h, fit = 'crop' } = {}) => {
  if (!url) return '';
  try {
    const u = new URL(url);
    u.searchParams.set('w', String(w));
    if (h) u.searchParams.set('h', String(h));
    u.searchParams.set('fit', fit);
    u.searchParams.set('auto', 'format');
    return u.toString();
  } catch {
    return url;
  }
};

/**
 * Build a responsive srcset for known widths.
 */
export const buildSrcSet = (url, { heights, fit = 'crop' } = {}) =>
  WIDTHS.map((w) => `${resizeImage(url, { w, h: heights?.[w], fit })} ${w}w`).join(', ');

/**
 * Tiny placeholder data-URI for skeletons before image loads.
 * Returns a low-opacity gray base64 SVG.
 */
export const placeholder = (w = 16, h = 9) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><rect width='100%' height='100%' fill='%23FFF1C7'/></svg>`
  )}`;
