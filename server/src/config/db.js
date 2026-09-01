import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('✗ MONGO_URI is not set in environment');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✓ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('Mongo connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('Mongo disconnected');
    });
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    console.error('  Set MONGO_URI to a valid connection string (Atlas or local).');
    process.exit(1);
  }
}
