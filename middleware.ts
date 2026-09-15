import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/middleware/supabase-middleware";
import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/security/rate-limiter";
import { detectLoginAnomaly } from "@/lib/security/bot-protection";

export async function middleware(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const startTime = Date.now();
  const path = request.nextUrl.pathname;
  const origin = request.headers.get("origin") || "*";

  // 0. Handle CORS Preflight Requests for API routes
  if (request.method === "OPTIONS" && path.startsWith("/api/")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With, x-request-id",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
        "x-request-id": requestId,
      },
    });
  }

  // 1. Determine rate limit tier based on request path
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

  // 2. Evaluate rate limiting
  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIp, tier);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please wait before retrying.",
        retryAfterMs: Math.max(0, rateLimitResult.resetTime - Date.now()),
      },
      {
        status: 429,
        headers: {
          "Retry-After": `${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)}`,
          "X-RateLimit-Limit": `${rateLimitResult.limit}`,
          "X-RateLimit-Remaining": `${rateLimitResult.remaining}`,
          "X-RateLimit-Reset": `${rateLimitResult.resetTime}`,
          "x-request-id": requestId,
          "Access-Control-Allow-Origin": origin,
        },
      }
    );
  }

  // 3. Bot Anomaly Detection on Auth endpoints
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

  // 4. Execute session & route security validation
  const response = await updateSession(request);

  // 5. Inject Telemetry & CORS Headers
  response.headers.set("x-request-id", requestId);
  response.headers.set("x-response-time-ms", `${Date.now() - startTime}`);
  response.headers.set("X-RateLimit-Limit", `${rateLimitResult.limit}`);
  response.headers.set("X-RateLimit-Remaining", `${rateLimitResult.remaining}`);

  if (path.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, x-request-id"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
