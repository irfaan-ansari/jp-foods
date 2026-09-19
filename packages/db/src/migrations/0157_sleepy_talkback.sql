ALTER TABLE "line_item" RENAME COLUMN "inventory_quantity" TO "base_quantity";--> statement-breakpoint
ALTER TABLE "line_item" ALTER COLUMN "unit_name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "line_item" ALTER COLUMN "unit_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "line_item" ALTER COLUMN "price" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "line_item" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "line_item" ALTER COLUMN "quantity" SET DEFAULT '1';--> statement-breakpoint
ALTER TABLE "line_item" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "unit_conversion" text DEFAULT '1' NOT NULL;--> statement-breakpoint
CREATE INDEX "price_level_item_productId_idx" ON "price_level_item" USING btree ("product_id");--> statement-breakpoint
ALTER TABLE "price_level_item" ADD CONSTRAINT "price_level_product_unique" UNIQUE("price_level_id","product_id");