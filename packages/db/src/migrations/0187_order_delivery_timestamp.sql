ALTER TABLE "order" ALTER COLUMN "delivery_date" SET DATA TYPE timestamp;
--> statement-breakpoint
UPDATE "order"
SET "delivery_date" = "created_at"
WHERE "created_at" IS NOT NULL;
