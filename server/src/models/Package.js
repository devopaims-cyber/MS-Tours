import mongoose from 'mongoose';

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    activities: [{ type: String, trim: true }],
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true, index: true },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0, index: true },
    discountPrice: { type: Number, min: 0 },
    duration: { type: Number, required: true, min: 1, index: true }, // days
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging'],
      default: 'Easy',
      index: true,
    },
    category: {
      type: String,
      enum: [
        'Beach',
        'Adventure',
        'Heritage & Culture',
        'Himalayan',
        'Luxury',
        'Honeymoon',
        'Family',
        'Weekend Trip',
      ],
      default: 'Family',
      index: true,
    },
    images: [{ type: String }],
    highlights: [{ type: String, trim: true }],
    itinerary: [itineraryDaySchema],
    inclusions: [{ type: String, trim: true }],
    exclusions: [{ type: String, trim: true }],
    rating: { type: Number, default: 4.5, min: 0, max: 5, index: true },
    reviewCount: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Package', packageSchema);
