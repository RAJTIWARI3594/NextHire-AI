/**
 * NextHire AI - Unit Test Suite for Security & Protection Utilities
 */
import test from "node:test";
import assert from "node:assert";
import {
  sanitizeString,
  sanitizePayload,
} from "../../lib/security/api-security.ts";
import { checkRateLimit } from "../../lib/security/rate-limiter.ts";
import {
  sanitizeFilename,
  verifyMagicBytes,
} from "../../lib/security/file-security.ts";

test("Security Unit Tests - XSS Sanitization", async (t) => {
  await t.test("escapes HTML control characters in raw strings", () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeString(maliciousInput);
    assert.strictEqual(
      sanitized,
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;"
    );
  });

  await t.test("recursively sanitizes complex object payloads", () => {
    const payload = {
      username: "<b>John</b>",
      details: {
        bio: "<img src=x onerror=alert('xss')>",
      },
    };
    const sanitized = sanitizePayload(payload);
    assert.strictEqual(sanitized.username, "&lt;b&gt;John&lt;&#x2F;b&gt;");
    assert.strictEqual(
      sanitized.details.bio,
      "&lt;img src=x onerror=alert(&#x27;xss&#x27;)&gt;"
    );
  });
});

test("Security Unit Tests - Rate Limiter", async (t) => {
  await t.test(
    "allows requests within threshold and blocks excess requests",
    () => {
      const testIp = `test_ip_${Date.now()}`;

      // First 5 requests should pass for auth_login tier (limit: 5)
      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit(testIp, "auth_login");
        assert.strictEqual(res.allowed, true);
      }

      // 6th request should be throttled
      const blockedRes = checkRateLimit(testIp, "auth_login");
      assert.strictEqual(blockedRes.allowed, false);
      assert.strictEqual(blockedRes.remaining, 0);
    }
  );
});

test("Security Unit Tests - File Security & Magic Bytes", async (t) => {
  await t.test("sanitizes dangerous filename path traversals", () => {
    const dangerousName = "../../etc/passwd.pdf";
    const cleanName = sanitizeFilename(dangerousName);
    assert.strictEqual(cleanName, "passwd.pdf");
  });

  await t.test("verifies PDF magic bytes header (%PDF)", () => {
    const pdfBuffer = Buffer.from("%PDF-1.5 test content");
    const isValid = verifyMagicBytes(pdfBuffer, "application/pdf");
    assert.strictEqual(isValid, true);
  });

  await t.test("detects mismatched file magic bytes", () => {
    const fakePdfBuffer = Buffer.from("NOT A PDF FILE");
    const isValid = verifyMagicBytes(fakePdfBuffer, "application/pdf");
    assert.strictEqual(isValid, false);
  });
});
