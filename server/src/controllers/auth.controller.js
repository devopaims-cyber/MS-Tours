import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { AppError } from '../utils/AppError.js';
import { validateRegister, validateLogin } from '../utils/validators.js';

// POST /api/auth/register
export const register = async (req, res) => {
  const errors = validateRegister(req.body);
  if (errors.length) throw new AppError(errors.join('; '), 400);

  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError('Email already registered', 409);

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: userToJSON(user),
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const errors = validateLogin(req.body);
  if (errors.length) throw new AppError(errors.join('; '), 400);

  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new AppError('Invalid credentials', 401);
  const match = await user.matchPassword(password);
  if (!match) throw new AppError('Invalid credentials', 401);

  const token = generateToken(user._id);
  res.json({
    success: true,
    token,
    user: userToJSON(user),
  });
};

// GET /api/auth/me  (protect)
export const me = async (req, res) => {
  res.json({ success: true, user: userToJSON(req.user) });
};

function userToJSON(u) {
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
