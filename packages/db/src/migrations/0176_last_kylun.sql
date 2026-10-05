-- ALTER TABLE "product" ALTER COLUMN "pack_size" SET DEFAULT '1';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "stock_uom" text DEFAULT 'lb';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "sell_uom" text DEFAULT 'lb';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "display_label" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "pricing_basis" text DEFAULT 'sell-uom';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "price" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "split_units" jsonb DEFAULT '[]'::jsonb;