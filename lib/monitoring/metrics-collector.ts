export interface TelemetrySnapshot {
  apiLatencyMs: number;
  dbQueryTimeMs: number;
  aiResponseTimeMs: number;
  errorRatePercent: number;
  activeUsers: number;
  queuePendingJobs: number;
  memoryUsagePercent: number;
  cpuUsagePercent: number;
  storageUsagePercent: number;
  requestsObserved: number;
  apiSamples: number;
  dbSamples: number;
  aiSamples: number;
  timestamp: string;
}

class MetricsCollector {
  private latencySamples: number[] = [];
  private dbQuerySamples: number[] = [];
  private aiResponseSamples: number[] = [];
  private totalRequests = 0;
  private totalErrors = 0;

  public recordApiLatency(durationMs: number, statusCode: number): void {
    if (!Number.isFinite(durationMs) || durationMs < 0) return;
    this.totalRequests += 1;
    if (statusCode >= 500) this.totalErrors += 1;
    this.latencySamples.push(durationMs);
    if (this.latencySamples.length > 500) this.latencySamples.shift();
  }

  public recordDbQueryTime(durationMs: number): void {
    if (!Number.isFinite(durationMs) || durationMs < 0) return;
    this.dbQuerySamples.push(durationMs);
    if (this.dbQuerySamples.length > 500) this.dbQuerySamples.shift();
  }

  public recordAiResponseTime(durationMs: number): void {
    if (!Number.isFinite(durationMs) || durationMs < 0) return;
    this.aiResponseSamples.push(durationMs);
    if (this.aiResponseSamples.length > 500) this.aiResponseSamples.shift();
  }

  private calculateAverage(samples: number[]): number {
    if (samples.length === 0) return 0;
    return Math.round(
      samples.reduce((total, sample) => total + sample, 0) / samples.length
    );
  }

  public getSnapshot(): TelemetrySnapshot {
    const memory = process.memoryUsage();
    const heapPercent =
      memory.heapTotal > 0
        ? Math.round((memory.heapUsed / memory.heapTotal) * 100)
        : 0;

    return {
      apiLatencyMs: this.calculateAverage(this.latencySamples),
      dbQueryTimeMs: this.calculateAverage(this.dbQuerySamples),
      aiResponseTimeMs: this.calculateAverage(this.aiResponseSamples),
      errorRatePercent:
        this.totalRequests > 0
          ? Number(((this.totalErrors / this.totalRequests) * 100).toFixed(2))
          : 0,
      // No active-session or queue instrumentation is configured yet.
      activeUsers: 0,
      queuePendingJobs: 0,
      memoryUsagePercent: heapPercent,
      // CPU and storage usage are not sampled by this serverless process.
      cpuUsagePercent: 0,
      storageUsagePercent: 0,
      requestsObserved: this.totalRequests,
      apiSamples: this.latencySamples.length,
      dbSamples: this.dbQuerySamples.length,
      aiSamples: this.aiResponseSamples.length,
      timestamp: new Date().toISOString(),
    };
  }
}

export const metricsCollector = new MetricsCollector();
