import { NextResponse, type NextRequest } from "next/server.js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export interface CookieSecurityOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge?: number;
}

export const DEFAULT_COOKIE_OPTIONS: CookieSecurityOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const ADMIN_SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
export const STANDARD_SESSION_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Configure secure cookie attributes for production.
 */
export function getSecureCookieOptions(
  customOptions: Partial<CookieOptions> = {}
): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...customOptions,
  };
}

/**
 * Validates and rotates authentication session tokens.
 */
export async function handleSessionRotation(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const secureOpts = getSecureCookieOptions(options);
            response.cookies.set(name, value, secureOpts);
          });
        },
      },
    }
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return { session: null, rotated: false };
  }

  // Check session expiration
  const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
  const now = Date.now();

  if (expiresAt && now >= expiresAt) {
    // Session expired -> Sign out
    await supabase.auth.signOut();
    return { session: null, rotated: true, expired: true };
  }

  return { session, rotated: false, expired: false };
}

/**
 * Checks whether an admin session has exceeded the strict inactivity timeout.
 */
export function checkAdminSessionTimeout(lastActiveTimestamp?: number): {
  isTimedOut: boolean;
  remainingMs: number;
} {
  if (!lastActiveTimestamp) {
    return { isTimedOut: false, remainingMs: ADMIN_SESSION_TIMEOUT_MS };
  }

  const elapsed = Date.now() - lastActiveTimestamp;
  const isTimedOut = elapsed > ADMIN_SESSION_TIMEOUT_MS;
  const remainingMs = Math.max(0, ADMIN_SESSION_TIMEOUT_MS - elapsed);

  return { isTimedOut, remainingMs };
}

/**
 * Helper to inspect request metadata for device session tracking.
 */
export function extractDeviceMetadata(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "Unknown Browser";
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  let browser = "Unknown";
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Edge")) browser = "Edge";

  let os = "Unknown OS";
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac OS")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
    os = "iOS";

  return {
    deviceName: `${browser} on ${os}`,
    browser,
    ipAddress,
    userAgent,
  };
}
