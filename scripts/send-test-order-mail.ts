import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const seedEmail = process.env.SEED_SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    if (!seedEmail) {
      throw new Error('SEED_SUPER_ADMIN_EMAIL is required for local mail test');
    }

    await prisma.systemConfig.upsert({
      where: { key: 'EMAIL_NOTIFICATION' },
      update: { value: seedEmail },
      create: {
        key: 'EMAIL_NOTIFICATION',
        value: seedEmail,
        description: 'Email nhận thông báo đơn hàng mới',
      },
    });

    const variant = await prisma.productVariant.findFirst({
      where: {
        status: 'ACTIVE',
        product: { deletedAt: null, status: 'PUBLISHED' },
      },
      select: {
        id: true,
        productId: true,
        sku: true,
        product: { select: { name: true } },
      },
    });

    if (!variant) {
      throw new Error('Không có product variant PUBLISHED để tạo đơn test');
    }

    console.log(
      JSON.stringify(
        {
          smtpHost: process.env.SMTP_HOST ?? null,
          smtpPort: process.env.SMTP_PORT ?? null,
          smtpUserSet: Boolean(process.env.SMTP_USER),
          smtpPassSet: Boolean(process.env.SMTP_PASS),
          emailNotification: seedEmail,
          productId: variant.productId,
          variantId: variant.id,
          productName: variant.product.name,
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
