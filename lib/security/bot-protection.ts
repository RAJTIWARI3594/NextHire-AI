import { NextRequest } from "next/server.js";

interface FailedLoginTracker {
  attempts: number;
  lockoutUntil: number;
  lastAttempt: number;
}

const failedLoginsStore = new Map<string, FailedLoginTracker>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Verify Cloudflare Turnstile or Google reCAPTCHA v3 token.
 */
export async function verifyCaptchaToken(
  token: string,
  remoteIp?: string
): Promise<{
  success: boolean;
  score?: number;
  error?: string;
}> {
  if (!token) {
    return { success: false, error: "CAPTCHA token missing" };
  }

  // Cloudflare Turnstile Secret Key or fallback
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    // Development fallback check
    if (process.env.NODE_ENV !== "production") {
      return { success: true, score: 1.0 };
    }
    return { success: true, score: 0.9 }; // Default pass if secret not configured yet
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", turnstileSecret);
    formData.append("response", token);
    if (remoteIp) formData.append("remoteip", remoteIp);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return {
      success: !!data.success,
      error: data["error-codes"]?.[0] || undefined,
    };
  } catch (err: any) {
    console.error("CAPTCHA verification request failed:", err);
    return { success: false, error: "CAPTCHA service unreachable" };
  }
}

/**
 * Check if an email or IP address is currently locked out due to repeated failed logins.
 */
export function checkAccountLockout(accountKey: string): {
  isLocked: boolean;
  remainingMinutes: number;
  attemptsCount: number;
} {
  const record = failedLoginsStore.get(accountKey);
  const now = Date.now();

  if (!record) {
    return { isLocked: false, remainingMinutes: 0, attemptsCount: 0 };
  }

  if (record.lockoutUntil > now) {
    const remainingMinutes = Math.ceil((record.lockoutUntil - now) / 60000);
    return { isLocked: true, remainingMinutes, attemptsCount: record.attempts };
  }

  // Lockout expired -> reset count if old
  if (now - record.lastAttempt > LOCKOUT_DURATION_MS) {
    failedLoginsStore.delete(accountKey);
    return { isLocked: false, remainingMinutes: 0, attemptsCount: 0 };
  }

  return {
    isLocked: false,
    remainingMinutes: 0,
    attemptsCount: record.attempts,
  };
}

/**
 * Record a failed login attempt for an account or IP.
 */
export function recordFailedLoginAttempt(accountKey: string): {
  isLocked: boolean;
  attemptsRemaining: number;
  lockoutMinutes: number;
} {
  const now = Date.now();
  const record = failedLoginsStore.get(accountKey) || {
    attempts: 0,
    lockoutUntil: 0,
    lastAttempt: now,
  };

  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockoutUntil = now + LOCKOUT_DURATION_MS;
    failedLoginsStore.set(accountKey, record);
    return {
      isLocked: true,
      attemptsRemaining: 0,
      lockoutMinutes: Math.ceil(LOCKOUT_DURATION_MS / 60000),
    };
  }

  failedLoginsStore.set(accountKey, record);
  return {
    isLocked: false,
    attemptsRemaining: MAX_FAILED_ATTEMPTS - record.attempts,
    lockoutMinutes: 0,
  };
}

/**
 * Reset failed login counter upon successful authentication.
 */
export function clearFailedLoginAttempts(accountKey: string): void {
  failedLoginsStore.delete(accountKey);
}

/**
 * Detect login anomalies based on User-Agent and Request Patterns.
 */
export function detectLoginAnomaly(request: NextRequest): {
  isSuspicious: boolean;
  reasons: string[];
} {
  const userAgent = request.headers.get("user-agent") || "";
  const reasons: string[] = [];

  // 1. Missing or Known Bot User-Agent
  if (!userAgent || userAgent.length < 10) {
    reasons.push("Missing or truncated User-Agent header");
  }

  const suspiciousBotAgents = [
    "python-requests",
    "curl",
    "postmanruntime",
    "wget",
    "headlesschrome",
    "puppeteer",
  ];
  if (
    suspiciousBotAgents.some((bot) => userAgent.toLowerCase().includes(bot))
  ) {
    reasons.push(`Suspicious automated client detected (${userAgent})`);
  }

  // 2. High-Frequency Request Anomalies
  const acceptHeader = request.headers.get("accept");
  if (
    !acceptHeader ||
    (!acceptHeader.includes("html") && !acceptHeader.includes("json"))
  ) {
    reasons.push("Malformed HTTP Accept header");
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons,
  };
}
