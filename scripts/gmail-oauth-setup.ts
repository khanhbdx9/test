/**
 * Lấy GMAIL_REFRESH_TOKEN để gửi mail qua Gmail API (HTTPS) trên server.
 *
 * 1. Google Cloud Console → tạo OAuth Client (Desktop app hoặc Web)
 * 2. Enable Gmail API
 * 3. Thêm redirect URI: http://localhost:53682/oauth2callback
 * 4. Chạy:
 *    GMAIL_CLIENT_ID=... GMAIL_CLIENT_SECRET=... \
 *    npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/gmail-oauth-setup.ts
 */
import http from 'http';
import { URL } from 'url';
import { google } from 'googleapis';

const REDIRECT_URI = 'http://localhost:53682/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

async function main(): Promise<void> {
  const clientId = process.env.GMAIL_CLIENT_ID?.trim();
  const clientSecret = process.env.GMAIL_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error('Cần GMAIL_CLIENT_ID và GMAIL_CLIENT_SECRET');
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    REDIRECT_URI,
  );
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  console.log('\nMở URL này trên trình duyệt, đăng nhập Gmail gửi mail:\n');
  console.log(authUrl);
  console.log('\nĐang chờ callback tại', REDIRECT_URI, '...\n');

  const code = await waitForCode();
  const { tokens } = await oauth2Client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      'Không nhận được refresh_token. Thu hồi quyền app tại https://myaccount.google.com/permissions rồi chạy lại.',
    );
  }

  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.join(process.cwd(), '.gmail-refresh-token');
  fs.writeFileSync(outPath, tokens.refresh_token, 'utf8');

  console.log('\nThêm vào .env / server env:\n');
  console.log('MAIL_TRANSPORT=gmail-api');
  console.log('MAIL_ENABLED=true');
  console.log(`SMTP_USER=${process.env.SMTP_USER || 'your-gmail@gmail.com'}`);
  console.log(
    `SMTP_FROM="Minh Sam <${process.env.SMTP_USER || 'your-gmail@gmail.com'}>"`,
  );
  console.log(`GMAIL_CLIENT_ID=${clientId}`);
  console.log(`GMAIL_CLIENT_SECRET=${clientSecret}`);
  console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log(`\nĐã ghi token vào ${outPath}`);
  console.log('');
}

function waitForCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url || '/', REDIRECT_URI);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`OAuth error: ${error}`);
          server.close();
          reject(new Error(error));
          return;
        }
        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Missing code');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(
          '<h3>OK — đã lấy refresh token. Có thể đóng tab và xem terminal.</h3>',
        );
        server.close();
        resolve(code);
      } catch (error: unknown) {
        server.close();
        reject(error);
      }
    });
    server.listen(53682, '127.0.0.1');
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
