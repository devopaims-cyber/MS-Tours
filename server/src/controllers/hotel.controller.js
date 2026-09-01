import Hotel from '../models/Hotel.js';
import { cacheGet, cacheSet } from '../config/redis.js';
import { AppError } from '../utils/AppError.js';

// GET /api/hotels?featured=&page=&limit=
export const list = async (req, res) => {
  const { page = 1, limit = 12, featured } = req.query;
  const query = {};
  if (featured === 'true') query.featured = true;

  const cacheKey = `hotels:list:p${page}:l${limit}:f${featured || 'all'}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Hotel.find(query)
      .sort({ featured: -1, rating: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Hotel.countDocuments(query),
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

// GET /api/hotels/search?city=&country=&checkIn=&checkOut=&guests=&starRating=&minPrice=&maxPrice=&sort=
export const search = async (req, res) => {
  const {
    city,
    country,
    starRating,
    minPrice,
    maxPrice,
    sort = '-rating',
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};
  if (city) query.city = { $regex: city, $options: 'i' };
  if (country) query.country = { $regex: country, $options: 'i' };
  if (starRating) query.starRating = { $gte: Number(starRating) };
  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortObj = parseSort(sort);

  const [items, total] = await Promise.all([
    Hotel.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
    Hotel.countDocuments(query),
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

// GET /api/hotels/:id
export const getById = async (req, res) => {
  const cacheKey = `hotel:${req.params.id}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) throw new AppError('Hotel not found', 404);
  await cacheSet(cacheKey, hotel, 300);
  res.json({ success: true, data: hotel });
};

function parseSort(s) {
  const desc = s.startsWith('-');
  const key = desc ? s.slice(1) : s;
  const allowed = ['pricePerNight', 'rating', 'starRating', 'reviewCount'];
  if (!allowed.includes(key)) return { rating: -1 };
  return { [key]: desc ? -1 : 1 };
}
