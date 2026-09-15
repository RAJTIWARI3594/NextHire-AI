const fs = require("fs");
const envContent = fs.readFileSync(".env.local", "utf8");

const env = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2 && !line.startsWith("#")) {
    const key = parts[0].trim();
    const val = parts
      .slice(1)
      .join("=")
      .trim()
      .replace(/^["']|["']$/g, "");
    env[key] = val;
  }
});

function isSupabaseConfigured(envObj) {
  const url = envObj.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = envObj.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return (
    url.length > 0 &&
    !url.includes("placeholder") &&
    !url.includes("example") &&
    key.length > 0 &&
    !key.includes("placeholder") &&
    !key.includes("example")
  );
}

console.log("=== SUPABASE CREDENTIAL VERIFICATION ===");
console.log("- NEXT_PUBLIC_SUPABASE_URL:", env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "- NEXT_PUBLIC_SUPABASE_ANON_KEY configured:",
  Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
);
console.log("- isSupabaseConfigured() result:", isSupabaseConfigured(env));
