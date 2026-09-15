# Contributing to NextHire AI

Thank you for your interest in contributing to NextHire AI! We welcome contributions from developers of all skill levels.

---

## 🛠️ Development Setup

1. **Fork & Clone**:

   ```bash
   git clone https://github.com/nexthire-ai/nexthire-ai.git
   cd nexthire-ai
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:

   ```bash
   cp .env.example .env.local
   npm run env:check
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 🌿 Branching Strategy & PR Workflow

- **Branch Naming**:
  - `feat/feature-name` (New features)
  - `fix/bug-name` (Bug fixes)
  - `docs/doc-update` (Documentation updates)
  - `chore/dep-update` (Dependencies / maintenance)

- **Commit Message Style (Conventional Commits)**:
  - `feat(auth): implement session token rotation`
  - `fix(security): sanitize user payload against XSS`
  - `docs(api): update metrics endpoint reference`

- **Pre-PR Checklist**:
  - Run type checking: `npm run type-check`
  - Run linter and formatting: `npm run validate`
  - Run test suite: `npm test`
