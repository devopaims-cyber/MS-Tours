import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema(
  {
    airline: { type: String, required: true, trim: true },
    flightNumber: { type: String, required: true, trim: true, index: true },
    origin: {
      city: { type: String, required: true, trim: true, index: true },
      code: { type: String, required: true, uppercase: true, trim: true, index: true },
    },
    destination: {
      city: { type: String, required: true, trim: true, index: true },
      code: { type: String, required: true, uppercase: true, trim: true, index: true },
    },
    departureTime: { type: String, required: true }, // "08:30"
    arrivalTime: { type: String, required: true },
    price: { type: Number, required: true, min: 0, index: true },
    duration: { type: String, required: true }, // "2h 35m"
    stops: { type: Number, default: 0, min: 0 },
    fareClass: {
      type: String,
      enum: ['economy', 'premium', 'business'],
      default: 'economy',
      index: true,
    },
    seatsAvailable: { type: Number, default: 100, min: 0 },
    aircraft: { type: String, trim: true },
    date: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

flightSchema.index({ 'origin.code': 1, 'destination.code': 1, date: 1 });

export default mongoose.model('Flight', flightSchema);
