import mongoose from 'mongoose';

const travelerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['adult', 'child', 'infant'], default: 'adult' },
    gender: { type: String, enum: ['male', 'female', 'other'] },
  },
  { _id: false }
);

const roomBookingSchema = new mongoose.Schema(
  {
    roomType: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['package', 'hotel', 'flight'], required: true, index: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    checkInOrStartDate: { type: Date, required: true, index: true },
    checkOutDate: { type: Date }, // for hotels
    travelers: [travelerSchema],
    rooms: [roomBookingSchema],
    seats: { type: Number, min: 1 }, // for flights
    totalPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    bookingRef: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    notes: { type: String, maxlength: 500 },

    // --- Travelport / GDS ------------------------------------------
    // 'ms-tours' bookings use the local Mongo refs above.
    // 'travelport' bookings also carry a UniversalRecordLocatorCode (pnr)
    // and the segments, since live offers are NOT stored as Flight docs.
    provider: {
      type: String,
      enum: ['ms-tours', 'travelport'],
      default: 'ms-tours',
      index: true,
    },
    pnr: { type: String, uppercase: true, trim: true, sparse: true, index: true },
    segments: [
      {
        airline: String,
        flightNumber: String,
        originCode: String,
        destinationCode: String,
        departure: Date,
        arrival: Date,
        stopCount: Number,
      },
    ],
    providerMeta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
