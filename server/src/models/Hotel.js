import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    capacity: { type: Number, default: 2, min: 1 },
    available: { type: Number, default: 10, min: 0 },
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    city: { type: String, required: true, trim: true, index: true },
    country: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true },
    starRating: { type: Number, min: 1, max: 5, default: 3, index: true },
    pricePerNight: { type: Number, required: true, min: 0, index: true },
    images: [{ type: String }],
    amenities: [{ type: String, trim: true }],
    roomTypes: [roomTypeSchema],
    rating: { type: Number, default: 4.3, min: 0, max: 5, index: true },
    reviewCount: { type: Number, default: 0, min: 0 },
    description: { type: String, required: true, maxlength: 1500 },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Hotel', hotelSchema);
