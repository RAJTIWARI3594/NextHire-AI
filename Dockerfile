# ==============================================================================
# Multi-stage Production Dockerfile for NextHire AI (Next.js 15 Standalone)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base Alpine Image
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-libc-dev --no-cache libc6-compat

# ------------------------------------------------------------------------------
# Stage 2: Development Stage
# ------------------------------------------------------------------------------
FROM base AS development
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ------------------------------------------------------------------------------
# Stage 3: Install Production Dependencies
# ------------------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# ------------------------------------------------------------------------------
# Stage 4: Build Next.js Application
# ------------------------------------------------------------------------------
FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Set environment variables for build time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_SUPABASE_URL=https://placeholder-build.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-build-key

RUN npm run build

# ------------------------------------------------------------------------------
# Stage 5: Minimal Standalone Production Runner
# ------------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root system user for security compliance
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public static assets and standalone build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
