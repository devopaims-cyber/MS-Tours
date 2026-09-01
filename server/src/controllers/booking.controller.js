import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Flight from '../models/Flight.js';
import { AppError } from '../utils/AppError.js';
import { generateBookingRef } from '../utils/generateBookingRef.js';

// POST /api/bookings   (protect)
export const create = async (req, res) => {
  const { type } = req.body;
  if (!['package', 'hotel', 'flight'].includes(type)) {
    throw new AppError('Invalid booking type', 400);
  }

  let totalPrice = 0;
  let payload = { user: req.user._id, type };

  if (type === 'package') {
    const { package: pkgId, startDate, travelers = [] } = req.body;
    if (!pkgId || !startDate) throw new AppError('package and startDate required', 400);
    if (travelers.length === 0) throw new AppError('at least one traveler required', 400);

    const pkg = await Package.findById(pkgId);
    if (!pkg) throw new AppError('Package not found', 404);

    const unitPrice = pkg.discountPrice ?? pkg.price;
    totalPrice = unitPrice * travelers.length;

    payload = {
      ...payload,
      package: pkg._id,
      checkInOrStartDate: startDate,
      travelers,
      totalPrice,
    };
  } else if (type === 'hotel') {
    const { hotel: hotelId, checkIn, checkOut, rooms = [{ roomType: 'Standard', quantity: 1 }] } = req.body;
    if (!hotelId || !checkIn || !checkOut) throw new AppError('hotel, checkIn, checkOut required', 400);

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) throw new AppError('Hotel not found', 404);

    const nights = Math.max(
      1,
      Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    );

    totalPrice = rooms.reduce((acc, r) => {
      const rt = hotel.roomTypes.find((t) => t.name === r.roomType);
      const price = rt ? rt.pricePerNight : hotel.pricePerNight;
      return acc + price * r.quantity * nights;
    }, 0);

    payload = {
      ...payload,
      hotel: hotel._id,
      checkInOrStartDate: checkIn,
      checkOutDate: checkOut,
      rooms,
      travelers: req.body.travelers || [],
      totalPrice,
    };
  } else if (type === 'flight') {
    const { flight: flightId, date, seats = 1, travelers = [] } = req.body;
    if (!flightId || !date) throw new AppError('flight and date required', 400);

    const flight = await Flight.findById(flightId);
    if (!flight) throw new AppError('Flight not found', 404);
    if (flight.seatsAvailable < seats) throw new AppError('Not enough seats available', 409);

    totalPrice = flight.price * seats;
    payload = {
      ...payload,
      flight: flight._id,
      checkInOrStartDate: date,
      seats,
      travelers,
      totalPrice,
    };
  }

  // Generate a unique booking ref (retry on collision)
  let bookingRef;
  for (let i = 0; i < 5; i++) {
    const ref = generateBookingRef();
    const exists = await Booking.findOne({ bookingRef: ref });
    if (!exists) {
      bookingRef = ref;
      break;
    }
  }
  if (!bookingRef) throw new AppError('Could not generate unique booking ref, try again', 500);

  const booking = await Booking.create({ ...payload, bookingRef });
  res.status(201).json({ success: true, data: booking });
};

// GET /api/bookings   (protect — current user's)
export const list = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('package', 'title images duration price discountPrice')
    .populate('hotel', 'name city images starRating pricePerNight')
    .populate('flight', 'airline flightNumber origin destination departureTime arrivalTime price')
    .sort({ checkInOrStartDate: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
};

// GET /api/bookings/:id   (protect — owner only)
export const getById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('package')
    .populate('hotel')
    .populate('flight')
    .populate('user', 'name email');

  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Forbidden', 403);
  }
  res.json({ success: true, data: booking });
};

// PATCH /api/bookings/:id/cancel   (protect — owner)
export const cancel = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Forbidden', 403);
  }
  booking.status = 'cancelled';
  if (booking.paymentStatus === 'paid') booking.paymentStatus = 'refunded';
  await booking.save();
  res.json({ success: true, data: booking });
};
