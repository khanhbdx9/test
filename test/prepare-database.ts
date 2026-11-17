import { execSync } from 'node:child_process';

export function prepareTestDatabase(): void {
  execSync('npm run prisma:test:prepare', {
    stdio: 'inherit',
    env: process.env,
  });
}
