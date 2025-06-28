// A simple in-memory cache with Time-To-Live (TTL)
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<any>>();

// Default TTL: 1 hour in milliseconds
const DEFAULT_TTL = 1000 * 60 * 60;

/**
 * Stores a value in the cache.
 * @param key The cache key.
 * @param data The data to store.
 * @param ttl The time-to-live in milliseconds.
 */
export function set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  const expiry = Date.now() + ttl;
  cache.set(key, { data, expiry });
  console.log(`[Cache] SET key: ${key}`);
}

/**
 * Retrieves a value from the cache.
 * Returns null if the key doesn't exist or the entry has expired.
 * @param key The cache key.
 */
export function get<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  // Check if the entry has expired
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    console.log(`[Cache] EXPIRED key: ${key}`);
    return null;
  }

  return entry.data;
}

/**
 * Deletes a value from the cache.
 * @param key The cache key.
 */
export function del(key: string): void {
  console.log(`[Cache] DELETE key: ${key}`);
  cache.delete(key);
}

/**
 * A collection of functions to generate consistent cache keys.
 */
export const cacheKeys = {
  recommendations: (patientId: string) => `recs:${patientId}`,
};
