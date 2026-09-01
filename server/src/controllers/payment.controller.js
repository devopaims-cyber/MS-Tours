import Booking from '../models/Booking.js';
import { AppError } from '../utils/AppError.js';

// POST /api/payments/process   (protect)
// Mock payment — accepts { bookingId, cardToken }, returns { paid: true } after a short delay
// and flips the booking's paymentStatus to 'paid'. A real implementation would integrate
// Stripe/Razorpay here and verify a webhook before marking paid.
export const process = async (req, res) => {
  const { bookingId, cardToken } = req.body;
  if (!bookingId || !cardToken) throw new AppError('bookingId and cardToken required', 400);

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Forbidden', 403);
  }

  // Simulate processing
  await new Promise((r) => setTimeout(r, 800));

  // Accept any cardToken with length >= 4 as "valid" for the mock
  if (typeof cardToken !== 'string' || cardToken.length < 4) {
    booking.paymentStatus = 'pending';
    await booking.save();
    return res.status(402).json({ success: false, message: 'Card declined (mock)' });
  }

  booking.paymentStatus = 'paid';
  booking.status = 'confirmed';
  await booking.save();

  res.json({
    success: true,
    paid: true,
    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    booking,
  });
};
