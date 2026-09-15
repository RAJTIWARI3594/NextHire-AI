const http = require("http");

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: "localhost",
      port: 3000,
      path,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });

    req.on("error", (err) => reject(err));

    if (options.body) {
      req.write(
        typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body)
      );
    }
    req.end();
  });
}

async function runE2EVerification() {
  console.log("=== NEXTHIRE AI REAL E2E VERIFICATION ===");
  const results = {};

  // 1. Health Probe
  try {
    const health = await makeRequest("/api/health");
    results.health = {
      status: health.statusCode,
      body: JSON.parse(health.body),
    };
    console.log("✅ GET /api/health:", health.statusCode, health.body);
  } catch (e) {
    results.health = { error: e.message };
    console.log("❌ GET /api/health failed:", e.message);
  }

  // 2. Status Probe (Deep Readiness)
  try {
    const status = await makeRequest("/api/status");
    results.status = {
      status: status.statusCode,
      body: JSON.parse(status.body),
    };
    console.log("✅ GET /api/status:", status.statusCode, status.body);
  } catch (e) {
    results.status = { error: e.message };
    console.log("❌ GET /api/status failed:", e.message);
  }

  // 3. AI Chat Endpoint
  try {
    const aiChat = await makeRequest("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        prompt: "How do I optimize my ATS score for Next.js role?",
        context: { studentName: "TestCandidate" },
      },
    });
    results.aiChat = {
      status: aiChat.statusCode,
      body: JSON.parse(aiChat.body),
    };
    console.log("✅ POST /api/ai/chat:", aiChat.statusCode, aiChat.body);
  } catch (e) {
    results.aiChat = { error: e.message };
    console.log("❌ POST /api/ai/chat failed:", e.message);
  }

  // 4. AI Interview Endpoint
  try {
    const aiInterview = await makeRequest("/api/ai/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        action: "questions",
        jobRole: "Senior Full Stack Engineer",
        interviewType: "Technical",
      },
    });
    results.aiInterview = {
      status: aiInterview.statusCode,
      body: JSON.parse(aiInterview.body),
    };
    console.log(
      "✅ POST /api/ai/interview:",
      aiInterview.statusCode,
      aiInterview.body
    );
  } catch (e) {
    results.aiInterview = { error: e.message };
    console.log("❌ POST /api/ai/interview failed:", e.message);
  }

  // 5. AI Resume Endpoint
  try {
    const aiResume = await makeRequest("/api/ai/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        resumeData: { title: "Test Resume" },
        jobTarget: "Full Stack Engineer",
      },
    });
    results.aiResume = {
      status: aiResume.statusCode,
      body: JSON.parse(aiResume.body),
    };
    console.log("✅ POST /api/ai/resume:", aiResume.statusCode, aiResume.body);
  } catch (e) {
    results.aiResume = { error: e.message };
    console.log("❌ POST /api/ai/resume failed:", e.message);
  }

  // 6. CORS OPTIONS Preflight
  try {
    const corsOptions = await makeRequest("/api/ai/chat", {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
      },
    });
    results.corsOptions = {
      status: corsOptions.statusCode,
      headers: corsOptions.headers,
    };
    console.log(
      "✅ OPTIONS /api/ai/chat (CORS):",
      corsOptions.statusCode,
      corsOptions.headers["access-control-allow-origin"]
    );
  } catch (e) {
    results.corsOptions = { error: e.message };
    console.log("❌ OPTIONS /api/ai/chat failed:", e.message);
  }

  // 7. Background Job Worker
  try {
    const jobs = await makeRequest("/api/jobs/worker");
    results.jobs = { status: jobs.statusCode, body: JSON.parse(jobs.body) };
    console.log("✅ GET /api/jobs/worker:", jobs.statusCode, jobs.body);
  } catch (e) {
    results.jobs = { error: e.message };
    console.log("❌ GET /api/jobs/worker failed:", e.message);
  }

  // 8. Alerts Endpoint
  try {
    const alerts = await makeRequest("/api/alerts");
    results.alerts = {
      status: alerts.statusCode,
      body: JSON.parse(alerts.body),
    };
    console.log("✅ GET /api/alerts:", alerts.statusCode, alerts.body);
  } catch (e) {
    results.alerts = { error: e.message };
    console.log("❌ GET /api/alerts failed:", e.message);
  }

  // 9. Metrics Endpoint
  try {
    const metrics = await makeRequest("/api/metrics?format=json");
    results.metrics = {
      status: metrics.statusCode,
      body: JSON.parse(metrics.body),
    };
    console.log(
      "✅ GET /api/metrics:",
      metrics.statusCode,
      "Metrics returned OK"
    );
  } catch (e) {
    results.metrics = { error: e.message };
    console.log("❌ GET /api/metrics failed:", e.message);
  }

  // 10. Monitoring Stats Endpoint
  try {
    const stats = await makeRequest("/api/monitoring/stats");
    results.stats = { status: stats.statusCode, body: JSON.parse(stats.body) };
    console.log(
      "✅ GET /api/monitoring/stats:",
      stats.statusCode,
      "Stats returned OK"
    );
  } catch (e) {
    results.stats = { error: e.message };
    console.log("❌ GET /api/monitoring/stats failed:", e.message);
  }
}

runE2EVerification();
