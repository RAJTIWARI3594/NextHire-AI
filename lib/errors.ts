import { NextResponse } from "next/server";
import { logger } from "./logger";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "AuthenticationError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded. Please try again later.") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    service: string,
    message = "External service request failed",
    details?: unknown
  ) {
    super(`[${service}] ${message}`, 502, "EXTERNAL_SERVICE_ERROR", details);
    this.name = "ExternalServiceError";
  }
}

/**
 * Global API Error Handler Response Formatter
 */
export function handleApiError(
  error: unknown,
  requestId?: string
): NextResponse {
  if (error instanceof AppError) {
    logger.warn(`API Error [${error.code}]: ${error.message}`, {
      statusCode: error.statusCode,
      requestId,
      code: error.code,
      details: error.details,
    });

    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          requestId,
          timestamp: new Date().toISOString(),
        },
      },
      { status: error.statusCode }
    );
  }

  // Unhandled / Internal Server Error
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error("Unhandled API Exception", err, { requestId });

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An unexpected internal error occurred. Please contact support.",
        requestId,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 500 }
  );
}
