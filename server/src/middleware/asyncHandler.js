// Wraps async handlers so thrown errors hit the express error handler.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
