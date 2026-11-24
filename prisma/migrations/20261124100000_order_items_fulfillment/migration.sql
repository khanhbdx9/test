-- CreateEnum
CREATE TYPE "FulfillmentMethod" AS ENUM ('PICKUP', 'DELIVERY');

-- AlterTable: add fulfillment, allow null shipping
ALTER TABLE "orders"
  ADD COLUMN "fulfillment_method" "FulfillmentMethod";

UPDATE "orders"
  SET "fulfillment_method" = 'DELIVERY'
  WHERE "fulfillment_method" IS NULL;

ALTER TABLE "orders"
  ALTER COLUMN "fulfillment_method" SET NOT NULL;

ALTER TABLE "orders"
  ALTER COLUMN "shipping_address" DROP NOT NULL;

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_sku" TEXT NOT NULL,
    "variant_sku" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- Backfill order_items from product_ids (first variant if exists)
INSERT INTO "order_items" (
  "id",
  "order_id",
  "product_id",
  "variant_id",
  "quantity",
  "unit_price",
  "product_name",
  "product_sku",
  "variant_sku",
  "size",
  "style",
  "image_url",
  "created_at",
  "updated_at"
)
SELECT
  gen_random_uuid(),
  o."id",
  p."id",
  COALESCE(v."id", p."id"),
  1,
  COALESCE(v."sale_price", v."price", p."sale_price", p."price"),
  p."name",
  p."sku",
  COALESCE(v."sku", p."sku"),
  COALESCE(v."size", '-'),
  COALESCE(v."style", '-'),
  (
    SELECT pi."url"
    FROM "product_images" pi
    WHERE pi."product_id" = p."id" AND pi."is_cover" = true
    ORDER BY pi."sort_order" ASC
    LIMIT 1
  ),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "orders" o
CROSS JOIN LATERAL unnest(o."product_ids") AS pid(id)
INNER JOIN "products" p ON p."id" = pid.id
LEFT JOIN LATERAL (
  SELECT *
  FROM "product_variants" pv
  WHERE pv."product_id" = p."id"
  ORDER BY pv."sort_order" ASC, pv."created_at" ASC
  LIMIT 1
) v ON true
WHERE cardinality(o."product_ids") > 0;

-- Drop legacy product_ids
ALTER TABLE "orders" DROP COLUMN "product_ids";

-- CreateIndex
CREATE INDEX "orders_fulfillment_method_idx" ON "orders"("fulfillment_method");

CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

CREATE INDEX "order_items_product_id_idx" ON "order_items"("product_id");

CREATE INDEX "order_items_variant_id_idx" ON "order_items"("variant_id");

-- AddForeignKey
ALTER TABLE "order_items"
  ADD CONSTRAINT "order_items_order_id_fkey"
  FOREIGN KEY ("order_id") REFERENCES "orders"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
