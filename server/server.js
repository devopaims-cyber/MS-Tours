import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env from the repo root, regardless of where `node` was invoked from.
// (npm workspaces run scripts with the workspace as cwd, so a bare
// `dotenv/config` import wouldn't find the root .env.)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './src/config/db.js';
import { connectRedis } from './src/config/redis.js';
import { notFound, errorHandler } from './src/middleware/error.js';

import authRoutes from './src/routes/auth.routes.js';
import destinationRoutes from './src/routes/destination.routes.js';
import packageRoutes from './src/routes/package.routes.js';
import hotelRoutes from './src/routes/hotel.routes.js';
import flightRoutes from './src/routes/flight.routes.js';
import bookingRoutes from './src/routes/booking.routes.js';
import reviewRoutes from './src/routes/review.routes.js';
import userRoutes from './src/routes/user.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import travelportRoutes from './src/routes/travelport.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV !== 'test') {
  app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Rate limiting (only on auth routes to prevent abuse)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    env: NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/travelport', travelportRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

// Boot
async function start() {
  try {
    await connectDB();
    await connectRedis(); // soft-fail

    app.listen(PORT, () => {
      console.log(`🚀 MS Tours API ready on http://localhost:${PORT} (${NODE_ENV})`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  process.exit(0);
});

export default app;
