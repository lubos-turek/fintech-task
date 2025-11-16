#!/bin/sh
set -e

echo "Initializing database..."

# Run database migrations/push (use npx if available, otherwise use node directly)
if command -v npx >/dev/null 2>&1; then
  npx prisma db push --skip-generate || true
elif [ -f "node_modules/prisma/build/index.js" ]; then
  node node_modules/prisma/build/index.js db push --skip-generate || true
elif [ -f "node_modules/.bin/prisma" ]; then
  node node_modules/.bin/prisma db push --skip-generate || true
fi

# Initialize FTS5 (use tsx directly if available, otherwise use npm)
if command -v tsx >/dev/null 2>&1; then
  echo "Initializing FTS5..."
  tsx scripts/init-fts5.ts || true
elif command -v npm >/dev/null 2>&1; then
  echo "Initializing FTS5..."
  npm run db:init-fts5 || true
fi

# Execute the main command
exec "$@"

