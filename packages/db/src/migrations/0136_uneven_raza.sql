ALTER TABLE "product" ADD COLUMN "inventory_unit" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "sell_unit" jsonb DEFAULT '[]'::jsonb;