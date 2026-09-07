ALTER TABLE "product" ALTER COLUMN "type" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "image" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "track_inventory" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "stock" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "allow_backorder " boolean DEFAULT true;