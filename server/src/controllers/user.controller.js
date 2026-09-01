import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

// GET /api/users/profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.json({ success: true, data: userToJSON(user) });
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  const allowed = ['name', 'phone', 'avatar'];
  const update = {};
  for (const k of allowed) {
    if (req.body[k] !== undefined) update[k] = req.body[k];
  }
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
  res.json({ success: true, data: userToJSON(user) });
};

// GET /api/users/favorites
export const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favorites',
    populate: { path: 'destination', select: 'name country image' },
  });
  res.json({ success: true, data: user?.favorites || [] });
};

// POST /api/users/favorites  { packageId }
export const addFavorite = async (req, res) => {
  const { packageId } = req.body;
  if (!packageId) throw new AppError('packageId required', 400);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favorites: packageId } },
    { new: true }
  ).populate('favorites');
  res.json({ success: true, data: user.favorites });
};

// DELETE /api/users/favorites/:packageId
export const removeFavorite = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favorites: req.params.packageId } },
    { new: true }
  ).populate('favorites');
  res.json({ success: true, data: user.favorites });
};

function userToJSON(u) {
  if (!u) return null;
  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    avatar: u.avatar,
    role: u.role,
    favorites: u.favorites,
    createdAt: u.createdAt,
  };
}
