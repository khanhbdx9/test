-- AlterTable
ALTER TABLE "posts" ADD COLUMN "show_on_landing" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "posts_show_on_landing_idx" ON "posts"("show_on_landing");
