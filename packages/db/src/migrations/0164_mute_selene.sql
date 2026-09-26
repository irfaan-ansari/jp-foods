ALTER TABLE "product" ALTER COLUMN "uom" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "uom" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "pricing_snapshot" jsonb;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "label" text;