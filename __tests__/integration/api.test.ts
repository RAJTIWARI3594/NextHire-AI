/**
 * NextHire AI - Integration Test Suite for Telemetry, Alerts, & Worker API Endpoints
 */
import test from "node:test";
import assert from "node:assert";
import { metricsCollector } from "../../lib/monitoring/metrics-collector.ts";
import { alertEngine } from "../../lib/monitoring/alerting.ts";

test("API Integration Tests - Metrics Collector & Alerting Engine", async (t) => {
  await t.test("records API latency and calculates telemetry snapshot", () => {
    metricsCollector.recordApiLatency(45, 200);
    metricsCollector.recordDbQueryTime(12);
    metricsCollector.recordAiResponseTime(380);

    const snapshot = metricsCollector.getSnapshot();
    assert.strictEqual(typeof snapshot.apiLatencyMs, "number");
    assert.strictEqual(typeof snapshot.dbQueryTimeMs, "number");
    assert.strictEqual(typeof snapshot.aiResponseTimeMs, "number");
    assert.strictEqual(typeof snapshot.memoryUsagePercent, "number");
  });

  await t.test("triggers and resolves system alerts", async () => {
    const alert = await alertEngine.triggerAlert(
      "Test High Load Alert",
      "server",
      "warning",
      "Integration test alert message"
    );

    assert.strictEqual(alert.alertName, "Test High Load Alert");
    assert.strictEqual(alert.status, "active");

    const resolved = alertEngine.updateAlertStatus(alert.id!, "resolved");
    assert.strictEqual(resolved?.status, "resolved");
    assert.strictEqual(typeof resolved?.resolvedAt, "string");
  });
});
