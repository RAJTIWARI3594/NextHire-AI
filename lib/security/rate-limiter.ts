import { NextRequest } from "next/server.js";

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Allowed requests per window
}

export const RATE_LIMIT_TIERS: Record<string, RateLimitConfig> = {
  auth_login: { windowMs: 60 * 1000, maxRequests: 5 },
  auth_signup: { windowMs: 60 * 1000, maxRequests: 5 },
  auth_password_reset: { windowMs: 60 * 1000, maxRequests: 3 },
  ai_api: { windowMs: 60 * 1000, maxRequests: 20 },
  payment_api: { windowMs: 60 * 1000, maxRequests: 10 },
  file_upload: { windowMs: 60 * 1000, maxRequests: 10 },
  default_api: { windowMs: 60 * 1000, maxRequests: 100 },
};

interface RateLimitStoreEntry {
  count: number;
  resetTime: number;
}

// In-memory sliding window store for high-throughput edge evaluation
const memoryStore = new Map<string, RateLimitStoreEntry>();

/**
 * Clean up expired memory entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore.entries()) {
    if (now > entry.resetTime) {
      memoryStore.delete(key);
    }
  }
}, 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  key: string;
}

/**
 * Evaluate rate limiting for an IP address or User ID under a specific limit tier.
 */
export function checkRateLimit(
  identifier: string,
  tierKey: keyof typeof RATE_LIMIT_TIERS = "default_api"
): RateLimitResult {
  const config = RATE_LIMIT_TIERS[tierKey] || RATE_LIMIT_TIERS.default_api;
  const storeKey = `${tierKey}:${identifier}`;
  const now = Date.now();

  const entry = memoryStore.get(storeKey);

  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitStoreEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    memoryStore.set(storeKey, newEntry);
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
      key: storeKey,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
      key: storeKey,
    };
  }

  entry.count += 1;
  memoryStore.set(storeKey, entry);

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
    key: storeKey,
  };
}

/**
 * Helper to extract client identifier (IP or User ID) from NextRequest.
 */
export function getClientIdentifier(
  request: NextRequest,
  userId?: string
): string {
  if (userId) return `user:${userId}`;

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return `ip:${forwardedFor.split(",")[0].trim()}`;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return `ip:${realIp.trim()}`;
  }

  return "ip:127.0.0.1";
}
