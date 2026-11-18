-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('AT_STORE', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING_CONFIRMATION',
  'REJECTED',
  'CONFIRMED',
  'NEED_CALLBACK',
  'COMPLETED'
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "full_name" TEXT,
    "note" TEXT,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_image_url" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    "delivery_date" DATE,
    "delivery_time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_email_idx" ON "orders"("email");

-- CreateIndex
CREATE INDEX "orders_phone_idx" ON "orders"("phone");

-- CreateIndex
CREATE INDEX "orders_payment_method_idx" ON "orders"("payment_method");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_delivery_date_idx" ON "orders"("delivery_date");

-- CreateIndex
CREATE INDEX "orders_delivery_time_idx" ON "orders"("delivery_time");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");
