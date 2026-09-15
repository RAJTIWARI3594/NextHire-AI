#!/bin/sh
set -e

echo "🚀 Starting NextHire AI Production Container Container Entrypoint..."

# Run environment check
node scripts/env-check.js || echo "⚠️ Environment check completed with warnings."

echo "Starting server via node server.js..."
exec "$@"
