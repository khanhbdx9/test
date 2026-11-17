#!/bin/sh
set -e

echo "Đang chạy prisma migrate deploy..."
npx prisma migrate deploy

exec node dist/main.js
