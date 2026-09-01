import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import { cacheGet, cacheSet } from '../config/redis.js';
import { AppError } from '../utils/AppError.js';

// GET /api/packages?page=&limit=&featured=
export const list = async (req, res) => {
  const { page = 1, limit = 12, featured } = req.query;
  const query = {};
  if (featured === 'true') query.featured = true;

  const cacheKey = `packages:list:p${page}:l${limit}:f${featured || 'all'}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Package.find(query)
      .populate('destination', 'name country image')
      .sort({ featured: -1, rating: -1, reviewCount: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Package.countDocuments(query),
  ]);

  const response = {
    success: true,
    count: items.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: items,
  };
  await cacheSet(cacheKey, response, 300);
  res.json(response);
};

// GET /api/packages/featured
export const featured = async (req, res) => {
  const cacheKey = 'packages:featured';
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ success: true, count: cached.length, data: cached, cached: true });

  const items = await Package.find({ featured: true })
    .populate('destination', 'name country image')
    .sort({ rating: -1 })
    .limit(8);
  await cacheSet(cacheKey, items, 300);
  res.json({ success: true, count: items.length, data: items });
};

// GET /api/packages/:id
export const getById = async (req, res) => {
  const cacheKey = `package:${req.params.id}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  const pkg = await Package.findById(req.params.id).populate('destination');
  if (!pkg) throw new AppError('Package not found', 404);
  await cacheSet(cacheKey, pkg, 300);
  res.json({ success: true, data: pkg });
};

// GET /api/packages/search
// Query: q, destination, category, difficulty, minPrice, maxPrice, minRating, duration, sort, page, limit
export const search = async (req, res) => {
  const {
    q,
    destination,
    category,
    difficulty,
    minPrice,
    maxPrice,
    minRating,
    duration, // 3-5 | 6-8 | 9+
    sort = '-rating',
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { highlights: { $regex: q, $options: 'i' } },
    ];
  }
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  // Resolve destination by name (case-insensitive) to its _id
  if (destination) {
    const dest = await Destination.findOne({
      name: { $regex: `^${destination}$`, $options: 'i' },
    });
    if (dest) query.destination = dest._id;
    else query.destination = null; // no match → empty results
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (minRating) query.rating = { $gte: Number(minRating) };
  if (duration) {
    const [min, max] = duration.split('-').map((n) => Number(n.replace('+', '')) || 999);
    query.duration = { $gte: min, $lte: duration.endsWith('+') ? 999 : max };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortObj = parseSort(sort);

  const [items, total] = await Promise.all([
    Package.find(query)
      .populate('destination', 'name country image')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit)),
    Package.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: items.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: items,
  });
};

function parseSort(s) {
  const desc = s.startsWith('-');
  const key = desc ? s.slice(1) : s;
  const allowed = ['price', 'rating', 'duration', 'reviewCount', 'createdAt'];
  if (!allowed.includes(key)) return { rating: -1 };
  return { [key]: desc ? -1 : 1 };
}
