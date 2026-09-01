import Destination from '../models/Destination.js';
import { cacheGet, cacheSet } from '../config/redis.js';

// GET /api/destinations
export const list = async (req, res) => {
  const cacheKey = 'destinations:all';
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ success: true, count: cached.length, data: cached, cached: true });

  const destinations = await Destination.find().sort({ featured: -1, rating: -1 });
  await cacheSet(cacheKey, destinations, 600); // 10 min
  res.json({ success: true, count: destinations.length, data: destinations });
};

// GET /api/destinations/:id
export const getById = async (req, res) => {
  const cacheKey = `destination:${req.params.id}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  const dest = await Destination.findById(req.params.id);
  if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' });
  await cacheSet(cacheKey, dest, 600);
  res.json({ success: true, data: dest });
};
