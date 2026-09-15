import { NextResponse, type NextRequest } from "next/server.js";
import { z } from "zod";

/**
 * XSS Sanitization: Escapes HTML control characters in raw string inputs.
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Deep recursive object sanitization for request payloads.
 */
export function sanitizePayload<T>(payload: T): T {
  if (typeof payload === "string") {
    return sanitizeString(payload) as unknown as T;
  }
  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePayload(item)) as unknown as T;
  }
  if (payload !== null && typeof payload === "object") {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
      sanitizedObj[sanitizeString(key)] = sanitizePayload(value);
    }
    return sanitizedObj as T;
  }
  return payload;
}

/**
 * Validate request body against a Zod schema with sanitized outputs.
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T | null; errorResponse: NextResponse | null }> {
  try {
    const body = await request.json();
    const sanitized = sanitizePayload(body);
    const parsed = schema.safeParse(sanitized);

    if (!parsed.success) {
      return {
        data: null,
        errorResponse: NextResponse.json(
          {
            error: "Validation Error",
            details: parsed.error.format(),
            requestId: request.headers.get("x-request-id"),
          },
          { status: 400 }
        ),
      };
    }

    return { data: parsed.data, errorResponse: null };
  } catch (err) {
    return {
      data: null,
      errorResponse: NextResponse.json(
        {
          error: "Invalid Request Payload",
          message: "Request body must be valid JSON.",
        },
        { status: 400 }
      ),
    };
  }
}

/**
 * CSRF Validation check for state-modifying HTTP methods (POST, PUT, DELETE, PATCH).
 */
export function validateCsrfOrigin(request: NextRequest): boolean {
  const method = request.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return true;

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return false;
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch (err) {
    return false;
  }
}

/**
 * Enterprise Production Error Response Formatter (Prevents stack trace leaks).
 */
export function createSecureErrorResponse(
  error: unknown,
  customMessage: string = "An internal server error occurred.",
  statusCode: number = 500
): NextResponse {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (process.env.NODE_ENV === "development") {
    console.error(`[Security Error ${errorId}]`, error);
  } else {
    console.error(
      `[Production Error ${errorId}]`,
      error instanceof Error ? error.message : String(error)
    );
  }

  return NextResponse.json(
    {
      success: false,
      errorId,
      message: customMessage,
      ...(process.env.NODE_ENV === "development" && error instanceof Error
        ? { devDetails: error.message, stack: error.stack }
        : {}),
    },
    { status: statusCode }
  );
}
