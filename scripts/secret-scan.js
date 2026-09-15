/**
 * NextHire AI - Automated Secret & Credentials Scanner
 * Inspects tracked files for hardcoded secrets, private keys, and API tokens.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SECRET_PATTERNS = [
  { name: "OpenAI API Key", regex: /sk-[a-zA-Z0-9]{32,}/g },
  { name: "Google Gemini API Key", regex: /AIzaSy[a-zA-Z0-9_-]{33}/g },
  { name: "Stripe Secret Key", regex: /sk_live_[a-zA-Z0-9]{24,}/g },
  { name: "Stripe Webhook Secret", regex: /whsec_[a-zA-Z0-9]{30,}/g },
  { name: "Razorpay Secret Key", regex: /rzp_live_[a-zA-Z0-9]{14,}/g },
  { name: "Resend Secret Key", regex: /re_[a-zA-Z0-9]{24,}/g },
  {
    name: "Generic JWT Secret",
    regex: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g,
  },
  { name: "Private Key Header", regex: /-----BEGIN PRIVATE KEY-----/g },
];

function scanDirectory(dir) {
  let leaksFound = 0;

  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);

      // Skip ignored directories
      if (
        file === "node_modules" ||
        file === ".next" ||
        file === ".git" ||
        file === "backups" ||
        file === "package-lock.json" ||
        file === ".env.development" ||
        file === ".env.local" ||
        file === ".env.production" ||
        file === ".env.staging"
      ) {
        continue;
      }

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (stat.isFile()) {
        try {
          const content = fs.readFileSync(fullPath, "utf8");
          for (const pattern of SECRET_PATTERNS) {
            const matches = content.match(pattern.regex);
            if (
              matches &&
              !fullPath.includes(".env.example") &&
              !fullPath.includes("secret-scan.js")
            ) {
              console.error(
                `🚨 POTENTIAL SECRET LEAK DETECTED in ${fullPath}: Pattern "${pattern.name}"`
              );
              leaksFound += 1;
            }
          }
        } catch (err) {
          // Ignore binary files
        }
      }
    }
  }

  walk(dir);
  return leaksFound;
}

console.log("🔍 Executing NextHire AI Automated Secret & Credentials Scan...");
const leaks = scanDirectory(path.join(__dirname, ".."));

if (leaks > 0) {
  console.error(`❌ Security Scan Failed: ${leaks} secret leak(s) detected!`);
  process.exit(1);
} else {
  console.log(
    "✅ Security Secret Scan Passed! 0 hardcoded secrets or API keys detected in tracked codebase."
  );
}
