import { config } from 'dotenv';

// Chỉ dùng một file .env (cùng app).
config({ path: '.env' });

process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT ?? '3000';
