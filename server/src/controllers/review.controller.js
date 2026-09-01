import Review from '../models/Review.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import { AppError } from '../utils/AppError.js';
import { validateReview } from '../utils/validators.js';

// GET /api/reviews/package/:packageId
export const listForPackage = async (req, res) => {
  const reviews = await Review.find({ package: req.params.packageId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, data: reviews });
};

// GET /api/reviews/hotel/:hotelId
export const listForHotel = async (req, res) => {
  const reviews = await Review.find({ hotel: req.params.hotelId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, data: reviews });
};

// POST /api/reviews   (protect)
export const create = async (req, res) => {
  const errors = validateReview(req.body);
  if (errors.length) throw new AppError(errors.join('; '), 400);

  const { rating, comment, package: pkg, hotel } = req.body;

  // Upsert by (user, package/hotel) — use the unique compound index
  const filter = pkg
    ? { user: req.user._id, package: pkg }
    : { user: req.user._id, hotel };

  const update = {
    user: req.user._id,
    rating: Number(rating),
    comment,
    ...(pkg && { package: pkg }),
    ...(hotel && { hotel }),
  };

  const review = await Review.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  // Recompute aggregate rating on the parent
  if (pkg) {
    const stats = await Review.aggregate([
      { $match: { package: review.package } },
      { $group: { _id: '$package', avg: { $avg: '$rating' }, n: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Package.findByIdAndUpdate(pkg, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].n,
      });
    }
  } else if (hotel) {
    const stats = await Review.aggregate([
      { $match: { hotel: review.hotel } },
      { $group: { _id: '$hotel', avg: { $avg: '$rating' }, n: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Hotel.findByIdAndUpdate(hotel, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].n,
      });
    }
  }

  res.status(201).json({ success: true, data: review });
};
