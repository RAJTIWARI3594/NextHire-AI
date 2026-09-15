export type LogLevel = "debug" | "info" | "warn" | "error" | "audit";

export interface LogContext {
  requestId?: string;
  userId?: string;
  ipAddress?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  category?:
    "api" | "auth" | "ai" | "payment" | "database" | "system" | "security";
  [key: string]: unknown;
}

interface LogPayload {
  timestamp: string;
  level: LogLevel;
  message: string;
  environment: string;
  context?: LogContext;
}

class Logger {
  private levelWeights: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    audit: 4,
  };

  private currentLevel: LogLevel =
    (process.env.LOG_LEVEL as LogLevel) || "info";

  private maskPii(obj: any): any {
    if (!obj || typeof obj !== "object") return obj;

    const masked = Array.isArray(obj) ? [...obj] : { ...obj };
    const sensitiveKeys = [
      "password",
      "token",
      "secret",
      "apiKey",
      "creditCard",
      "authorization",
      "ssn",
    ];

    for (const key of Object.keys(masked)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        masked[key] = "***MASKED***";
      } else if (typeof masked[key] === "object") {
        masked[key] = this.maskPii(masked[key]);
      }
    }
    return masked;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelWeights[level] >= this.levelWeights[this.currentLevel];
  }

  private formatLog(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): LogPayload {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment:
        process.env.NEXT_PUBLIC_APP_ENV ||
        process.env.NODE_ENV ||
        "development",
      context: context ? (this.maskPii(context) as LogContext) : undefined,
    };
  }

  public debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.debug(JSON.stringify(this.formatLog("debug", message, context)));
    }
  }

  public info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.info(JSON.stringify(this.formatLog("info", message, context)));
    }
  }

  public warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(JSON.stringify(this.formatLog("warn", message, context)));
    }
  }

  public error(
    message: string,
    error?: Error | unknown,
    context?: LogContext
  ): void {
    if (this.shouldLog("error")) {
      const errDetails =
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : { rawError: String(error) };

      console.error(
        JSON.stringify(
          this.formatLog("error", message, {
            ...context,
            error: errDetails,
          })
        )
      );
    }
  }

  public audit(message: string, context?: LogContext): void {
    console.info(
      JSON.stringify(
        this.formatLog("audit", `[SECURITY AUDIT] ${message}`, context)
      )
    );
  }
}

export const logger = new Logger();
