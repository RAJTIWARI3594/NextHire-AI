import { NextResponse } from "next/server.js";

export interface CacheOptions {
  maxAgeSeconds?: number;
  staleWhileRevalidateSeconds?: number;
  isPrivate?: boolean;
}

class InMemoryCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  /**
   * Set key-value pair in in-memory LRU cache with TTL in seconds.
   */
  public set(key: string, value: any, ttlSeconds: number = 60): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get value from in-memory cache if not expired.
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Clear cached entry.
   */
  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cached keys.
   */
  public clear(): void {
    this.cache.clear();
  }
}

export const inMemoryQueryCache = new InMemoryCache();

/**
 * Configure Cache-Control headers for HTTP responses.
 */
export function buildCacheControlHeader(options: CacheOptions = {}): string {
  const {
    maxAgeSeconds = 60,
    staleWhileRevalidateSeconds = 300,
    isPrivate = false,
  } = options;

  if (maxAgeSeconds <= 0) {
    return "no-store, no-cache, must-revalidate, proxy-revalidate";
  }

  const visibility = isPrivate ? "private" : "public";
  return `${visibility}, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`;
}

/**
 * Helper to apply CDN and Edge Caching headers onto a NextResponse object.
 */
export function applyCdnCacheHeaders(
  response: NextResponse,
  options: CacheOptions = {}
): NextResponse {
  const cacheControl = buildCacheControlHeader(options);
  response.headers.set("Cache-Control", cacheControl);
  response.headers.set("CDN-Cache-Control", cacheControl);
  response.headers.set("Vercel-CDN-Cache-Control", cacheControl);
  return response;
}
