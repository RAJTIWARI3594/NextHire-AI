import { logger } from "./logger";

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  retryableErrors?: (error: unknown) => boolean;
}

/**
 * Execute an async operation with exponential backoff and randomized jitter.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
  contextMessage = "Async operation"
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 10000,
    backoffFactor = 2,
    retryableErrors = () => true,
  } = options;

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err: unknown) {
      attempt++;

      if (attempt >= maxRetries || !retryableErrors(err)) {
        logger.error(
          `${contextMessage} failed permanently after ${attempt} attempt(s)`,
          err
        );
        throw err;
      }

      // Add randomized jitter (±20%)
      const jitter = delay * 0.2 * (Math.random() * 2 - 1);
      const actualDelay = Math.min(Math.round(delay + jitter), maxDelayMs);

      logger.warn(
        `${contextMessage} attempt ${attempt} failed. Retrying in ${actualDelay}ms...`,
        {
          attempt,
          maxRetries,
          delayMs: actualDelay,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, actualDelay));
      delay *= backoffFactor;
    }
  }

  throw new Error(`${contextMessage} failed after maximum retries`);
}
