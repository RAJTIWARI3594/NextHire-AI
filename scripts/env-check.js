const fs = require("fs");
const path = require("path");

// Auto-load .env.local / .env.development / .env if process.env isn't populated
[".env.local", ".env.development", ".env"].forEach((file) => {
  const envPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"'))
          value = value.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
});

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const optionalServerSecrets = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "GEMINI_API_KEY",
  "STRIPE_SECRET_KEY",
];

console.log("🔍 Executing NextHire AI pre-flight environment check...\n");

let hasMissingRequired = false;

requiredEnvVars.forEach((key) => {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ MISSING REQUIRED ENV VAR: ${key}`);
    hasMissingRequired = true;
  } else if (value.includes("placeholder")) {
    console.warn(`⚠️ WARNING: ${key} is using placeholder value: ${value}`);
  } else {
    console.log(`✅ ${key} is configured.`);
  }
});

console.log("\n--- Server Secret Check ---");
optionalServerSecrets.forEach((key) => {
  if (process.env[key]) {
    console.log(`🔒 Secret configured: ${key}`);
  } else {
    console.warn(
      `⚠️ Optional secret missing: ${key} (Features relying on this secret will fall back to mock/degraded mode)`
    );
  }
});

if (hasMissingRequired && process.env.NODE_ENV === "production") {
  console.error(
    "\n❌ FATAL: Missing required environment variables in production mode. Aborting."
  );
  process.exit(1);
} else {
  console.log("\n✨ Pre-flight environment check complete.");
}
