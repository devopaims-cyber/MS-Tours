import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from './asyncHandler.js';

// Protect routes — require a valid JWT in the Authorization header.
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) throw new AppError('Not authorized — no token', 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) throw new AppError('User not found', 401);

  req.user = user;
  next();
});

// Restrict by role.
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError(`Forbidden — requires role: ${roles.join(', ')}`, 403));
  }
  next();
};
