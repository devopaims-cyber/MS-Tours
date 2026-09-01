// Centralized index registration. Called once at boot, but the model schemas
// already declare most indexes — this file is a safety net for any that
// live outside a schema definition (e.g. compound partial indexes that
// need data-dependent filters).

import mongoose from 'mongoose';
import Review from './models/Review.js';

export async function ensureIndexes() {
  // Review: one review per user per package / hotel
  // These are declared in the model with `unique: true` + partial filter,
  // but we call ensureIndexes explicitly so failures show up at boot
  // rather than mid-request.
  try {
    await Review.syncIndexes();
  } catch (err) {
    console.warn('Review.syncIndexes warning:', err.message);
  }
}

export default ensureIndexes;
