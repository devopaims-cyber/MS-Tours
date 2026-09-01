import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000, trim: true },
  },
  { timestamps: true }
);

// One review per user per package/hotel
reviewSchema.index({ user: 1, package: 1 }, { unique: true, partialFilterExpression: { package: { $exists: true } } });
reviewSchema.index({ user: 1, hotel: 1 }, { unique: true, partialFilterExpression: { hotel: { $exists: true } } });
reviewSchema.index({ package: 1, createdAt: -1 });
reviewSchema.index({ hotel: 1, createdAt: -1 });

export default mongoose.model('Review', reviewSchema);
