import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaPg } from '@prisma/adapter-pg';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { PrismaClient } from '../src/generated/prisma/client';
import {
  buildOrderNotificationHtml,
  buildOrderNotificationText,
} from '../src/modules/mail/order-notification.template';
import { OrderResponseDto } from '../src/modules/orders/dto/order-response.dto';

function parseEmails(raw: string | null | undefined): string[] {
  if (!raw) {
    return [];
  }
  const unique = new Set<string>();
  for (const part of raw.split(/[;,]/)) {
    const email = part.trim().toLowerCase();
    if (email.length > 0) {
      unique.add(email);
    }
  }
  return [...unique];
}

function formatDateOnly(value: Date | null): string | null {
  if (!value) {
    return null;
  }
  return value.toISOString().slice(0, 10);
}

function buildRawMime(payload: {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
}): string {
  const boundary = `minhsam_${Date.now()}`;
  const lines = [
    `From: ${payload.from}`,
    `To: ${payload.to.join(', ')}`,
    `Subject: =?UTF-8?B?${Buffer.from(payload.subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(payload.text, 'utf8').toString('base64'),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(payload.html, 'utf8').toString('base64'),
    `--${boundary}--`,
  ];
  return Buffer.from(lines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  const transport =
    process.env.MAIL_TRANSPORT?.trim().toLowerCase() === 'gmail-api'
      ? 'gmail-api'
      : 'smtp';
  const user = process.env.SMTP_USER?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!user || !from) {
    throw new Error('SMTP_USER / SMTP_FROM chưa đủ');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const cfg = await prisma.systemConfig.findUnique({
      where: { key: 'EMAIL_NOTIFICATION' },
      select: { value: true },
    });
    const recipients = parseEmails(cfg?.value);
    if (recipients.length === 0) {
      throw new Error('EMAIL_NOTIFICATION trống');
    }

    const orderId = process.argv[2];
    const order = orderId
      ? await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: { orderBy: { createdAt: 'asc' } } },
        })
      : await prisma.order.findFirst({
          include: { items: { orderBy: { createdAt: 'asc' } } },
          orderBy: { createdAt: 'desc' },
        });

    if (!order) {
      throw new Error('Không tìm thấy đơn để gửi lại mail');
    }

    const payload: OrderResponseDto = {
      id: order.id,
      email: order.email,
      phone: order.phone,
      shippingAddress: order.shippingAddress,
      fullName: order.fullName,
      note: order.note,
      paymentMethod: order.paymentMethod,
      paymentImageUrl: order.paymentImageUrl,
      fulfillmentMethod: order.fulfillmentMethod,
      status: order.status,
      deliveryDate: formatDateOnly(order.deliveryDate),
      deliveryTime: order.deliveryTime,
      totalAmount: order.totalAmount.toFixed(2),
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toFixed(2),
        lineTotal: item.unitPrice.mul(item.quantity).toFixed(2),
        productName: item.productName,
        productSku: item.productSku,
        variantSku: item.variantSku,
        size: item.size,
        style: item.style,
        imageUrl: item.imageUrl,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    const subject = `[Minh Sam] Đơn mới ${payload.phone} — ${payload.totalAmount} VND`;
    const text = buildOrderNotificationText(payload);
    const html = buildOrderNotificationHtml(payload);

    if (transport === 'gmail-api') {
      const clientId = process.env.GMAIL_CLIENT_ID?.trim();
      const clientSecret = process.env.GMAIL_CLIENT_SECRET?.trim();
      const refreshToken = process.env.GMAIL_REFRESH_TOKEN?.trim();
      if (!clientId || !clientSecret || !refreshToken) {
        throw new Error('Thiếu GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN');
      }
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: buildRawMime({ from, to: recipients, subject, text, html }),
        },
      });
    } else {
      const host = process.env.SMTP_HOST?.trim();
      const port = Number(process.env.SMTP_PORT);
      const pass = process.env.SMTP_PASS?.replace(/\s+/g, '');
      if (!host || !port || !pass) {
        throw new Error('SMTP_HOST/PORT/PASS chưa đủ');
      }
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      });
      await transporter.sendMail({
        from,
        to: recipients.join(', '),
        subject,
        text,
        html,
      });
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          transport,
          orderId: order.id,
          to: recipients,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
