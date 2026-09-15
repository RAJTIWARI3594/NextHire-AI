# NextHire AI - Git Branching Strategy & Branch Protection Rules

NextHire AI uses a Trunk/GitFlow hybrid branching model engineered for high reliability, continuous testing, and safe production releases.

---

## 🌿 Branch Taxonomy

```
main (Production deployment)
 ├── release/v1.1.0 (Release preparation & QA)
 ├── develop (Staging & Integration target)
 │    ├── feature/ai-proctoring-engine
 │    └── feature/candidate-analytics
 └── hotfix/stripe-webhook-fix (Emergency fix target -> main & develop)
```

### 1. `main` (Production Branch)

- Contains production-ready code.
- Direct pushes strictly prohibited (`protected branch`).
- Every merge triggers production deployment (`.github/workflows/cd-production.yml`).

### 2. `develop` (Integration / Staging Branch)

- Active integration branch for complete features.
- Every push deploys to Staging (`https://staging.nexthire.ai`).

### 3. `feature/*` (Feature Branches)

- Cut from `develop`, merged back to `develop` via Pull Request.
- Naming format: `feature/<short-description>` (e.g. `feature/ai-proctoring`).

### 4. `hotfix/*` (Emergency Patch Branches)

- Cut from `main` to address critical production issues.
- Merged to both `main` and `develop`.

---

## 🛡️ Pull Request Rules & Branch Protection

1. Minimum 1 Code Owner review approval (`.github/CODEOWNERS`).
2. Automated CI checks must pass (`npm run validate`).
3. Zero unresolved code comments.
