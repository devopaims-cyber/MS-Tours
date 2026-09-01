// Lightweight input validators (no Joi dependency to keep install lean).
export const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const isNonEmptyString = (s) => typeof s === 'string' && s.trim().length > 0;
export const isPositiveInt = (n) => Number.isInteger(n) && n > 0;
export const isPositiveNumber = (n) => typeof n === 'number' && n > 0;

export function validateRegister({ name, email, password, phone }) {
  const errors = [];
  if (!isNonEmptyString(name) || name.length > 80) errors.push('name must be 1-80 chars');
  if (!isEmail(email)) errors.push('email is invalid');
  if (!password || password.length < 6) errors.push('password must be at least 6 chars');
  return errors;
}

export function validateLogin({ email, password }) {
  const errors = [];
  if (!isEmail(email)) errors.push('email is invalid');
  if (!password) errors.push('password is required');
  return errors;
}

export function validateReview({ rating, comment, package: pkg, hotel }) {
  const errors = [];
  if (!pkg && !hotel) errors.push('either package or hotel is required');
  const r = Number(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5) errors.push('rating must be 1-5');
  if (!isNonEmptyString(comment) || comment.length > 1000) errors.push('comment is required (1-1000 chars)');
  return errors;
}
