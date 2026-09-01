// Booking reference: MST-XXXXXX (6 alphanumeric chars, uppercased)
import crypto from 'crypto';

export function generateBookingRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // skip confusing chars
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += chars[crypto.randomInt(0, chars.length)];
  }
  return `MST-${out}`;
}
