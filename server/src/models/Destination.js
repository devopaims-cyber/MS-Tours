import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, index: true },
    image: { type: String, required: true },
    description: { type: String, required: true, maxlength: 800 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    featured: { type: Boolean, default: false, index: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

// Compound index for popular destinations
destinationSchema.index({ country: 1, featured: 1 });

export default mongoose.model('Destination', destinationSchema);
