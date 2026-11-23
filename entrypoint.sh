#!/bin/sh
set -e

# Ensure data directory exists
mkdir -p /app/data

# Verify data directory is writable
if [ ! -w /app/data ]; then
  echo "❌ ERROR: /app/data is not writable by user $(whoami) (UID $(id -u))."
  echo "👉 On your server host, run: sudo chown -R 1001:1001 ./data"
  exit 1
fi

# Seed database on first launch if not already populated
if [ ! -f /app/data/ecommerce.db ]; then
  echo "=> First run detected: Initializing SQLite database and clothing catalog..."
  node scripts/seed.mjs
fi

echo "=> Starting ThreadCraft Ecommerce on port 3000..."
exec node server.js
