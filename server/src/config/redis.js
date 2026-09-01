// Redis cache layer — soft-fails if Redis is unavailable so the API still runs.
import { createClient } from 'redis';

let client = null;
let connected = false;

export async function connectRedis() {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.warn('⚠ REDIS_URL not set — running without cache');
    return;
  }
  try {
    client = createClient({ url, socket: { connectTimeout: 5000 } });
    client.on('error', (err) => {
      // log once, do not crash
      if (connected) console.warn('Redis error:', err.message);
      connected = false;
    });
    await client.connect();
    connected = true;
    console.log('✓ Redis connected');
  } catch (err) {
    console.warn('⚠ Redis not available, continuing without cache:', err.message);
    connected = false;
    client = null;
  }
}

export async function cacheGet(key) {
  if (!connected || !client) return null;
  try {
    const val = await client.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds = 300) {
  if (!connected || !client) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch {
    // ignore
  }
}

export async function cacheDel(pattern) {
  if (!connected || !client) return;
  try {
    if (pattern.includes('*')) {
      for await (const k of client.scanIterator({ MATCH: pattern, COUNT: 100 })) {
        await client.del(k);
      }
    } else {
      await client.del(pattern);
    }
  } catch {
    // ignore
  }
}
