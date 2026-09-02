// Travelport controller — exposes the public-facing endpoints of the
// integration layer. All create/retrieve/cancel flows gate on the
// `protect` middleware (mounted in the route file).

import Booking from '../models/Booking.js';
import { AppError } from '../utils/AppError.js';
import { generateBookingRef } from '../utils/generateBookingRef.js';

import {
  searchFlights,
  getOffer,
  createPnr,
  retrievePnr,
  cancelPnr,
  getStatus,
} from '../integrations/travelport/index.js';

// GET /api/travelport/status
export const status = async (req, res) => {
  res.json({ success: true, data: getStatus() });
};

// POST /api/travelport/search
//   body: { origin, destination, date, adults?, children?, fareClass?, currency? }
export const search = async (req, res) => {
  const payload = await searchFlights(req.body || {});
  res.json(payload);
};

// POST /api/travelport/pnr   (protect)
//   body: { offerId, search (same params as /search), travelers[], payment? }
//
// Side effect: creates a Booking in our DB so the user's dashboard
// still shows the trip.
export const create = async (req, res) => {
  const { offerId, search, travelers = [], totalPrice: clientTotal } = req.body || {};
  if (!offerId) throw new AppError('offerId required', 400);
  if (!Array.isArray(travelers) || travelers.length === 0) {
    throw new AppError('at least one traveler required', 400);
  }

  // Re-derive the offer from the search params + selected id. In live
  // mode this hits the same upstream search; in stub mode it returns
  // the same fixture.
  const offer = await getOffer(offerId, search || {});
  if (!offer) throw new AppError('Offer not found — search again', 404);

  // Server-side price recompute. Never trust the client.
  const totalPrice = Number(offer.price);
  if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
    throw new AppError('Invalid offer price', 400);
  }

  // 1. Create the PNR at Travelport (real or stubbed).
  const { locator, status, raw, stub } = await createPnr({ offer, travelers });

  // 2. Create our local Booking record so the dashboard can list it.
  const bookingRef = await uniqueBookingRef();
  const firstSeg = (raw?.segments && raw.segments[0]) || {};
  const lastSeg = (raw?.segments && raw.segments[raw.segments.length - 1]) || firstSeg;

  const booking = await Booking.create({
    user: req.user._id,
    type: 'flight',
    provider: 'travelport',
    pnr: locator,
    bookingRef,
    checkInOrStartDate:
      firstSeg.departure ? new Date(firstSeg.departure) : new Date(),
    travelers: travelers.map((t) => ({
      name: t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Traveler',
      age: Number(t.age) || 30,
      type: t.type || 'adult',
      gender: t.gender,
    })),
    seats: travelers.length,
    totalPrice,
    currency: offer.currency || 'INR',
    status: 'confirmed',
    paymentStatus: 'paid', // mock — real PNR creation implies payment has been taken
    segments: (raw?.segments || []).map((s) => ({
      airline: s.carrier,
      flightNumber: s.flightNumber,
      originCode: s.origin,
      destinationCode: s.destination,
      departure: s.departure ? new Date(s.departure) : undefined,
      arrival: s.arrival ? new Date(s.arrival) : undefined,
      stopCount: 0,
    })),
    providerMeta: { stub, raw, lastSeg },
  });

  res.status(201).json({
    success: true,
    stub,
    locator,
    status,
    booking,
  });
};

// GET /api/travelport/pnr/:locator   (protect, owner or admin)
export const retrieve = async (req, res) => {
  const { locator } = req.params;
  const booking = await Booking.findOne({ pnr: locator.toUpperCase() });
  if (!booking) {
    // Not one of ours — try pulling directly from Travelport.
    const { itinerary, stub } = await retrievePnr({
      locator,
      lastName: (req.query.lastName || '').toString(),
    });
    if (!itinerary) throw new AppError('PNR not found', 404);
    return res.json({ success: true, stub, locator, itinerary });
  }
  if (
    booking.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Forbidden', 403);
  }
  // Optionally refresh from Travelport.
  const { itinerary, stub } = await retrievePnr({
    locator,
    lastName: (req.query.lastName || '').toString(),
  }).catch(() => ({ itinerary: null, stub: false }));

  res.json({ success: true, stub, locator, booking, itinerary });
};

// DELETE /api/travelport/pnr/:locator   (protect, owner or admin)
export const cancel = async (req, res) => {
  const { locator } = req.params;
  const booking = await Booking.findOne({ pnr: locator.toUpperCase() });
  if (!booking) throw new AppError('PNR not found', 404);
  if (
    booking.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Forbidden', 403);
  }

  // Talk to Travelport (stub-safe).
  await cancelPnr({ locator }).catch(() => ({ stub: true }));

  booking.status = 'cancelled';
  if (booking.paymentStatus === 'paid') booking.paymentStatus = 'refunded';
  await booking.save();

  res.json({ success: true, data: booking });
};

// --- helpers ---------------------------------------------------------

async function uniqueBookingRef() {
  for (let i = 0; i < 5; i++) {
    const ref = generateBookingRef();
    const exists = await Booking.findOne({ bookingRef: ref });
    if (!exists) return ref;
  }
  throw new AppError('Could not generate unique booking ref, try again', 500);
}
