/**
 * NextHire AI Health Probe CLI Utility
 */
const http = require("http");

const options = {
  hostname: process.env.HOST || "localhost",
  port: process.env.PORT || 3000,
  path: "/api/health",
  method: "GET",
  timeout: 4000,
};

const req = http.request(options, (res) => {
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => {
    if (res.statusCode === 200) {
      console.log(`✅ Health check OK (Status: ${res.statusCode}): ${body}`);
      process.exit(0);
    } else {
      console.error(
        `❌ Health check FAILED (Status: ${res.statusCode}): ${body}`
      );
      process.exit(1);
    }
  });
});

req.on("error", (err) => {
  console.error(`❌ Health check request ERROR: ${err.message}`);
  process.exit(1);
});

req.on("timeout", () => {
  console.error("❌ Health check request TIMED OUT");
  req.destroy();
  process.exit(1);
});

req.end();
