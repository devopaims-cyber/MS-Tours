// URL search-param helpers — used by the search results page to keep
// filters in sync with the browser address bar (shareable links).

export const paramsToObject = (searchParams) => {
  const out = {};
  for (const [k, v] of searchParams.entries()) {
    if (v === '' || v == null) continue;
    out[k] = v;
  }
  return out;
};

export const objectToParams = (obj) => {
  const usp = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v == null || v === '') return;
    if (Array.isArray(v)) v.forEach((item) => usp.append(k, String(item)));
    else usp.set(k, String(v));
  });
  return usp;
};

export const toggleArrayValue = (arr, value) => {
  const idx = arr.indexOf(value);
  if (idx === -1) return [...arr, value];
  const next = arr.slice();
  next.splice(idx, 1);
  return next;
};
