import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/middleware/supabase-middleware";
import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/security/rate-limiter";
import { detectLoginAnomaly } from "@/lib/security/bot-protection";

function getAllowedOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const allowed = new Set<string>([request.nextUrl.origin]);
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSiteUrl) {
    try {
      allowed.add(new URL(configuredSiteUrl).origin);
    } catch {
      // Ignore malformed optional configuration.
    }
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) allowed.add(`https://${vercelUrl}`);

  // The verified production hostname; exact-origin matching only.
  allowed.add("https://nexthire-ai-six.vercel.app");

  return allowed.has(origin) ? origin : null;
}

export async function middleware(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const startTime = Date.now();
  const path = request.nextUrl.pathname;
  const allowedOrigin = getAllowedOrigin(request);
  const isApiRoute = path.startsWith("/api/");

  // Reject cross-origin preflight requests unless their origin is explicitly trusted.
  if (request.method === "OPTIONS" && isApiRoute) {
    if (request.headers.has("origin") && !allowedOrigin) {
      return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
    }

    const headers = new Headers({
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, x-request-id",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
      "x-request-id": requestId,
    });
    if (allowedOrigin) {
      headers.set("Access-Control-Allow-Origin", allowedOrigin);
      headers.set("Access-Control-Allow-Credentials", "true");
    }
    return new NextResponse(null, { status: 204, headers });
  }

  let tier:
    | "auth_login"
    | "auth_signup"
    | "auth_password_reset"
    | "ai_api"
    | "payment_api"
    | "file_upload"
    | "default_api" = "default_api";

  if (path.startsWith("/api/auth/login") || path.startsWith("/login"))
    tier = "auth_login";
  else if (path.startsWith("/api/auth/signup") || path.startsWith("/signup"))
    tier = "auth_signup";
  else if (path.includes("reset-password") || path.includes("forgot-password"))
    tier = "auth_password_reset";
  else if (
    path.startsWith("/api/ai") ||
    path.startsWith("/api/chat") ||
    path.startsWith("/api/interview")
  )
    tier = "ai_api";
  else if (
    path.startsWith("/api/payments") ||
    path.startsWith("/api/subscriptions")
  )
    tier = "payment_api";
  else if (
    path.startsWith("/api/upload") ||
    path.startsWith("/api/resume/upload")
  )
    tier = "file_upload";

  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIp, tier);

  if (!rateLimitResult.allowed) {
    const headers = new Headers({
      "Retry-After": `${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)}`,
      "X-RateLimit-Limit": `${rateLimitResult.limit}`,
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": `${rateLimitResult.resetTime}`,
      "x-request-id": requestId,
      "Vary": "Origin",
    });
    if (allowedOrigin) {
      headers.set("Access-Control-Allow-Origin", allowedOrigin);
      headers.set("Access-Control-Allow-Credentials", "true");
    }
    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please wait before retrying.",
        retryAfterMs: Math.max(0, rateLimitResult.resetTime - Date.now()),
      },
      { status: 429, headers }
    );
  }

  if (
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/api/auth")
  ) {
    const anomaly = detectLoginAnomaly(request);
    if (anomaly.isSuspicious) {
      console.warn(
        `[Suspicious Request ${requestId}] Path: ${path}, Reasons: ${anomaly.reasons.join(", ")}`
      );
    }
  }

  const response = await updateSession(request);
  response.headers.set("x-request-id", requestId);
  response.headers.set("x-response-time-ms", `${Date.now() - startTime}`);
  response.headers.set("X-RateLimit-Limit", `${rateLimitResult.limit}`);
  response.headers.set("X-RateLimit-Remaining", `${rateLimitResult.remaining}`);

  if (isApiRoute) {
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, x-request-id"
    );
    response.headers.set("Vary", "Origin");
    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    } else {
      response.headers.delete("Access-Control-Allow-Origin");
      response.headers.delete("Access-Control-Allow-Credentials");
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
