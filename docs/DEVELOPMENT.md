# NextHire AI - Development Guide

This guide describes development workflows, coding standards, project organization, and error handling patterns for NextHire AI.

---

## 🏗 Coding Conventions

1. **Strict TypeScript Compliance**: Avoid `any`. Define strong interfaces in `types/`.
2. **Next.js App Router**:
   - Prefer Server Components (`RSC`) by default.
   - Use `'use client'` only when statefulness, effects, or user event handlers are required.
3. **Tailwind CSS Styling**:
   - Use design system utility tokens (`bg-background`, `text-primary`, `border-border`).
   - Avoid hardcoded static styles or arbitrary inline styles.

---

## 🪵 Logging & Error Handling in Features

Always import structured logger and error classes from `lib/`:

```typescript
import { logger } from "@/lib/logger";
import { ValidationError, handleApiError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.email) {
      throw new ValidationError("Email is required");
    }

    logger.info("User action recorded", {
      category: "auth",
      email: body.email,
    });
    return Response.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
```

---

## 🧪 Pre-Commit Checks

Before creating a Pull Request, run:

```bash
npm run validate
```

This executes type checking (`tsc --noEmit`), ESLint linting, and Prettier verification.
