#!/bin/sh
set -e

# Ensure data directory exists
mkdir -p /app/data

# Seed database on first launch if not already populated
if [ ! -f /app/data/ecommerce.db ]; then
  echo "=> First run detected: Initializing SQLite database and clothing catalog..."
  node scripts/seed.mjs
fi

echo "=> Starting ThreadCraft Ecommerce on port 3000..."
exec node server.js
