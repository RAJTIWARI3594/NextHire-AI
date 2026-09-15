import { test, expect } from "@playwright/test";

test.describe("NextHire AI Production E2E Suite", () => {
  test("Student Portal - Landing Page & Authentication Navigation", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/NextHire AI/);

    // Verify main CTA links
    const loginLink = page.locator('a[href*="/login"]').first();
    await expect(loginLink).toBeVisible();
  });

  test("Security & Monitoring API Endpoints Health Check", async ({
    request,
  }) => {
    const healthRes = await request.get("/api/metrics?format=json");
    expect(healthRes.status()).toBe(200);

    const metricsData = await healthRes.json();
    expect(metricsData).toHaveProperty("apiLatencyMs");
    expect(metricsData).toHaveProperty("memoryUsagePercent");
  });

  test("Admin Operations Consoles Telemetry Feed", async ({ request }) => {
    const statsRes = await request.get("/api/monitoring/stats");
    expect(statsRes.status()).toBe(200);

    const statsData = await statsRes.json();
    expect(statsData).toHaveProperty("status", "operational");
    expect(statsData).toHaveProperty("timeSeries");
  });

  test("System Alerts API Incident Response", async ({ request }) => {
    const alertsRes = await request.get("/api/alerts");
    expect(alertsRes.status()).toBe(200);

    const alertsData = await alertsRes.json();
    expect(alertsData.success).toBe(true);
    expect(Array.isArray(alertsData.alerts)).toBe(true);
  });

  test("Background Jobs Worker Queue Endpoint", async ({ request }) => {
    const workerRes = await request.get("/api/jobs/worker");
    expect(workerRes.status()).toBe(200);

    const workerData = await workerRes.json();
    expect(workerData.success).toBe(true);
  });
});
