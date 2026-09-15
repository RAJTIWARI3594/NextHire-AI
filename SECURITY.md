# Security Policy

NextHire AI takes security seriously. We enforce enterprise SAIF & SOC2 compliance principles across all platform layers.

---

## Supported Versions

| Version         | Supported              |
| :-------------- | :--------------------- |
| 1.0.x (Current) | :white_check_mark: Yes |
| < 1.0.0         | :x: No                 |

---

## Reporting a Vulnerability

If you discover a security vulnerability within NextHire AI:

1. **Do NOT open a public GitHub Issue.**
2. Send an encrypted email describing the vulnerability to `security@nexthire.ai`.
3. Include detailed steps to reproduce, sample HTTP headers, or proof of concept.

Our security team will acknowledge receipt within **24 hours** and provide periodic status updates until resolution.

---

## Production Security Measures Enforced

- **Content Security Policy (CSP)** & HSTS (`max-age=63072000`).
- Multi-tier sliding window IP & User Rate Limiter.
- Cloudflare Turnstile Bot Defense Shield.
- SHA-256 duplicate file hashing & Magic Byte MIME verification.
- `HttpOnly`, `SameSite=Lax`, `Secure` cookies with 15-minute Admin session inactivity timeout.
