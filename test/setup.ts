import { config } from 'dotenv';

config();

const DEFAULT_TEST_URL =
  'postgresql://postgres:postgres@localhost:5432/cake_shop_test?schema=public';

process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT ?? '3000';
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST || DEFAULT_TEST_URL;
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? 'test-access-secret-value';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '15m';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret-value';
process.env.JWT_REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
process.env.SEED_SUPER_ADMIN_EMAIL =
  process.env.SEED_SUPER_ADMIN_EMAIL ?? 'admin@minhsam.local';
process.env.SEED_SUPER_ADMIN_PASSWORD =
  process.env.SEED_SUPER_ADMIN_PASSWORD ?? 'ChangeMe123!';
process.env.SEED_SUPER_ADMIN_NAME =
  process.env.SEED_SUPER_ADMIN_NAME ?? 'Super Admin';
