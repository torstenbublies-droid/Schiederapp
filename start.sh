#!/bin/bash
set -e

echo "=== Railway Startup Script ==="
echo "Node version: $(node --version)"
echo "Working directory: $(pwd)"
echo "PORT: ${PORT:-not set}"
echo "NODE_ENV: ${NODE_ENV:-not set}"
echo "DATABASE_URL: ${DATABASE_URL:+set}"
echo ""
echo "Checking dist directory..."
ls -la dist/ || echo "dist/ not found!"
echo ""
echo "Checking dist/public directory..."
ls -la dist/public/ || echo "dist/public/ not found!"
echo ""
echo "Starting server..."
export NODE_ENV="production"
exec node dist/index.js

