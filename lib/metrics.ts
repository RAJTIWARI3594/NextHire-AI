/**
 * In-memory metrics tracking registry for operational monitoring & Prometheus export.
 */
class MetricsRegistry {
  private counters: Record<string, number> = {};
  private histograms: Record<string, number[]> = {};

  public increment(
    metricName: string,
    value = 1,
    labels: Record<string, string> = {}
  ): void {
    const key = this.formatKey(metricName, labels);
    this.counters[key] = (this.counters[key] || 0) + value;
  }

  public recordLatency(
    metricName: string,
    durationMs: number,
    labels: Record<string, string> = {}
  ): void {
    const key = this.formatKey(metricName, labels);
    if (!this.histograms[key]) {
      this.histograms[key] = [];
    }
    this.histograms[key].push(durationMs);

    // Keep histogram window bounded (last 1000 data points)
    if (this.histograms[key].length > 1000) {
      this.histograms[key].shift();
    }
  }

  private formatKey(name: string, labels: Record<string, string>): string {
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(",");
    return labelStr ? `${name}{${labelStr}}` : name;
  }

  public getPrometheusFormat(): string {
    const lines: string[] = [];

    // System Metrics
    lines.push("# HELP node_memory_heap_bytes Memory heap usage");
    lines.push("# TYPE node_memory_heap_bytes gauge");
    lines.push(`node_memory_heap_bytes ${process.memoryUsage().heapUsed}`);

    // Counters
    lines.push("# HELP nexthire_requests_total Total HTTP requests");
    lines.push("# TYPE nexthire_requests_total counter");
    for (const [key, val] of Object.entries(this.counters)) {
      lines.push(`${key} ${val}`);
    }

    // Latency averages
    lines.push(
      "# HELP nexthire_request_duration_ms_avg Average request latency in ms"
    );
    lines.push("# TYPE nexthire_request_duration_ms_avg gauge");
    for (const [key, values] of Object.entries(this.histograms)) {
      const avg =
        values.length > 0
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0;
      lines.push(`${key}_avg ${avg.toFixed(2)}`);
    }

    return lines.join("\n");
  }
}

export const metrics = new MetricsRegistry();
