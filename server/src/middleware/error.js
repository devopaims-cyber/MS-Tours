import { AppError } from '../utils/AppError.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Not found — ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Server error';

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
  }

  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Server error';
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
