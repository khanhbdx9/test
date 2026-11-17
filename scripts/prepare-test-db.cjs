const { execSync } = require('node:child_process');
const { Client } = require('pg');

// Script chỉ dùng local/CI — không chạy trên production.
require('dotenv').config();

const DEFAULT_TEST_URL =
  'postgresql://postgres:postgres@localhost:5432/cake_shop_test?schema=public';

function requireTestDatabaseUrl() {
  const url = process.env.DATABASE_URL_TEST?.trim() || DEFAULT_TEST_URL;
  if (!url.includes('_test') && !url.includes('test')) {
    throw new Error(
      'DATABASE_URL_TEST phải trỏ tới database test, không dùng database production',
    );
  }
  return url;
}

async function ensureDatabaseExists(databaseUrl) {
  const target = new URL(databaseUrl);
  const databaseName = target.pathname.replace(/^\//, '').split('?')[0];
  if (!databaseName) {
    throw new Error('DATABASE_URL_TEST thiếu tên database');
  }

  const admin = new URL(databaseUrl);
  admin.pathname = '/postgres';

  const client = new Client({ connectionString: admin.toString() });
  await client.connect();
  try {
    const existing = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName],
    );
    if (existing.rowCount === 0) {
      await client.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`Đã tạo database ${databaseName}`);
    }
  } finally {
    await client.end();
  }
}

function runPrisma(command, databaseUrl) {
  execSync(`npx prisma ${command}`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      NODE_ENV: 'test',
    },
  });
}

async function main() {
  const databaseUrl = requireTestDatabaseUrl();
  await ensureDatabaseExists(databaseUrl);
  runPrisma('migrate deploy', databaseUrl);
  runPrisma('db seed', databaseUrl);
  console.log('Database test sẵn sàng');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
