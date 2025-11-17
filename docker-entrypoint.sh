#!/bin/sh

echo "Starting application initialization..."

# Create data directory if it doesn't exist
if [ ! -d "/app/data" ]; then
  echo "Creating /app/data directory..."
  mkdir -p /app/data
fi

# Check if database already exists and has data
PRISMA_DB="/app/prisma/dev.db"
DB_EXISTS=false
if [ -f "$PRISMA_DB" ]; then
  DB_SIZE=$(stat -f%z "$PRISMA_DB" 2>/dev/null || stat -c%s "$PRISMA_DB" 2>/dev/null || echo "0")
  if [ "$DB_SIZE" -gt 1000000 ]; then
    echo "Database file exists at $PRISMA_DB and appears to have data (${DB_SIZE} bytes). Skipping schema push."
    DB_EXISTS=true
    DB_PUSH_SUCCESS=true
  fi
fi

echo "Initializing database..."

# Run database migrations/push only if database doesn't exist or is empty
if [ "$DB_EXISTS" = false ]; then
  DB_PUSH_SUCCESS=false
  if command -v npx >/dev/null 2>&1; then
    echo "Running prisma db push with npx..."
    if npx prisma db push --skip-generate; then
      DB_PUSH_SUCCESS=true
      echo "Database schema initialized successfully."
    else
      echo "Warning: prisma db push failed, but continuing..."
    fi
  elif [ -f "node_modules/prisma/build/index.js" ]; then
    echo "Running prisma db push with node..."
    if node node_modules/prisma/build/index.js db push --skip-generate; then
      DB_PUSH_SUCCESS=true
      echo "Database schema initialized successfully."
    else
      echo "Warning: prisma db push failed, but continuing..."
    fi
  elif [ -f "node_modules/.bin/prisma" ]; then
    echo "Running prisma db push with node_modules/.bin/prisma..."
    if node node_modules/.bin/prisma db push --skip-generate; then
      DB_PUSH_SUCCESS=true
      echo "Database schema initialized successfully."
    else
      echo "Warning: prisma db push failed, but continuing..."
    fi
  else
    echo "Warning: Could not find prisma command, skipping database initialization."
  fi
fi

# Initialize FTS5 (use tsx directly if available, otherwise use npm)
if [ "$DB_PUSH_SUCCESS" = true ]; then
  echo "Initializing FTS5..."
  if command -v tsx >/dev/null 2>&1; then
    if tsx scripts/init-fts5.ts; then
      echo "FTS5 initialized successfully."
    else
      echo "Warning: FTS5 initialization failed, but continuing..."
    fi
  elif command -v npm >/dev/null 2>&1; then
    if npm run db:init-fts5; then
      echo "FTS5 initialized successfully."
    else
      echo "Warning: FTS5 initialization failed, but continuing..."
    fi
  else
    echo "Warning: Could not find tsx or npm, skipping FTS5 initialization."
  fi
else
  echo "Skipping FTS5 initialization because database setup failed."
fi

echo "Initialization complete. Starting application..."

# Execute the main command (use set -e here to ensure the main command fails properly)
set -e
exec "$@"

