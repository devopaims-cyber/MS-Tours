// Seeder for MS Tours & Travels.
// Drops and re-seeds in foreign-key order so references always resolve.
//   users → destinations → packages → hotels → flights → reviews → bookings
//
// Usage:
//   npm run seed              # idempotent: drops then reinserts
//   npm run seed -- --clear   # alias for the above (default behavior)
//
// After the run, prints a per-collection count summary.

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Flight from '../models/Flight.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

import { users as USERS } from '../data/users.js';
import { destinations as DESTINATIONS } from '../data/destinations.js';
import { packages as PACKAGES } from '../data/packages.js';
import { hotels as HOTELS } from '../data/hotels.js';
import { flights as FLIGHTS } from '../data/flights.js';
import { reviews as REVIEWS } from '../data/reviews.js';
import { bookings as BOOKINGS } from '../data/bookings.js';

import { ensureIndexes } from '../indexes.js';

const log = (...args) => console.log('🌱', ...args);

async function dropAll() {
  await Promise.all([
    User.deleteMany({}),
    Destination.deleteMany({}),
    Package.deleteMany({}),
    Hotel.deleteMany({}),
    Flight.deleteMany({}),
    Review.deleteMany({}),
    Booking.deleteMany({}),
  ]);
}

async function insertUsers() {
  const docs = await Promise.all(
    USERS.map(async (u) => {
      const { _seedId, password, favorites, ...rest } = u;
      const hash = await bcrypt.hash(password, 10);
      return { ...rest, password: hash, favorites: [] };
    })
  );
  const inserted = await User.insertMany(docs);
  const map = new Map();
  inserted.forEach((u, i) => map.set(USERS[i]._seedId, u._id));
  return map;
}

async function insertDestinations() {
  const docs = DESTINATIONS.map(({ _seedId, ...rest }) => rest);
  await Destination.insertMany(docs);
  const all = await Destination.find();
  const map = new Map();
  DESTINATIONS.forEach((d) => {
    const found = all.find((x) => x.name === d.name);
    if (found) map.set(d._seedId, found._id);
  });
  return map;
}

async function insertPackages(destinationMap) {
  const docs = PACKAGES.map(({ _seedId, destinationId, ...rest }) => ({
    ...rest,
    destination: destinationMap.get(destinationId),
  }));
  await Package.insertMany(docs);
  const all = await Package.find().select('_id title');
  const map = new Map();
  PACKAGES.forEach((p) => {
    const found = all.find((x) => x.title === p.title);
    if (found) map.set(p._seedId, found._id);
  });
  return map;
}

async function insertHotels() {
  const docs = HOTELS.map(({ _seedId, ...rest }) => rest);
  await Hotel.insertMany(docs);
  const all = await Hotel.find().select('_id name');
  const map = new Map();
  HOTELS.forEach((h) => {
    const found = all.find((x) => x.name === h.name);
    if (found) map.set(h._seedId, found._id);
  });
  return map;
}

async function insertFlights() {
  const docs = FLIGHTS.map(({ _seedId, ...rest }) => rest);
  await Flight.insertMany(docs);
  const all = await Flight.find().select('_id flightNumber');
  const map = new Map();
  FLIGHTS.forEach((f) => {
    const found = all.find((x) => x.flightNumber === f.flightNumber);
    if (found) map.set(f._seedId, found._id);
  });
  return map;
}

async function insertReviews(userMap, packageMap, hotelMap) {
  const docs = REVIEWS.map(({ _seedId, userId, packageId, hotelId, ...rest }) => ({
    ...rest,
    user: userMap.get(userId),
    ...(packageId ? { package: packageMap.get(packageId) } : {}),
    ...(hotelId ? { hotel: hotelMap.get(hotelId) } : {}),
  }));
  await Review.insertMany(docs);

  // Recompute aggregate ratings on each package / hotel
  for (const [, pkgId] of packageMap) {
    if (!pkgId) continue;
    const stats = await Review.aggregate([
      { $match: { package: pkgId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Package.findByIdAndUpdate(pkgId, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }
  }
  for (const [, hotelId] of hotelMap) {
    if (!hotelId) continue;
    const stats = await Review.aggregate([
      { $match: { hotel: hotelId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length) {
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }
  }
}

async function insertBookings(userMap, packageMap, hotelMap, flightMap) {
  const docs = BOOKINGS.map(
    ({ _seedId, userId, packageId, hotelId, flightId, ...rest }) => ({
      ...rest,
      user: userMap.get(userId),
      ...(packageId ? { package: packageMap.get(packageId) } : {}),
      ...(hotelId ? { hotel: hotelMap.get(hotelId) } : {}),
      ...(flightId ? { flight: flightMap.get(flightId) } : {}),
    })
  );
  await Booking.insertMany(docs);
}

async function run() {
  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear') || args.length === 0;

  log('Connecting to MongoDB...');
  await connectDB();

  if (shouldClear) {
    log('Dropping existing collections...');
    await dropAll();
  }

  log('Ensuring indexes...');
  await ensureIndexes();

  log('Seeding users...');
  const userMap = await insertUsers();

  log('Seeding destinations...');
  const destinationMap = await insertDestinations();

  log('Seeding packages...');
  const packageMap = await insertPackages(destinationMap);

  log('Seeding hotels...');
  const hotelMap = await insertHotels();

  log('Seeding flights...');
  const flightMap = await insertFlights();

  log('Seeding reviews + recomputing ratings...');
  await insertReviews(userMap, packageMap, hotelMap);

  log('Seeding bookings...');
  await insertBookings(userMap, packageMap, hotelMap, flightMap);

  const counts = {
    users: await User.countDocuments(),
    destinations: await Destination.countDocuments(),
    packages: await Package.countDocuments(),
    hotels: await Hotel.countDocuments(),
    flights: await Flight.countDocuments(),
    reviews: await Review.countDocuments(),
    bookings: await Booking.countDocuments(),
  };

  log('Done!');
  console.table(counts);

  await mongoose.connection.close();
  process.exit(0);
}

run().catch(async (err) => {
  console.error('❌ Seed failed:', err);
  try {
    await mongoose.connection.close();
  } catch {}
  process.exit(1);
});
