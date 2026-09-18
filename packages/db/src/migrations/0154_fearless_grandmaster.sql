ALTER TABLE "product_sell_unit" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "price_level_item" DROP CONSTRAINT "price_level_product_unique";--> statement-breakpoint
ALTER TABLE "line_item" DROP CONSTRAINT "line_item_sell_unit_id_product_sell_unit_id_fk";
--> statement-breakpoint
ALTER TABLE "price_level_item" DROP CONSTRAINT "price_level_item_sell_unit_id_product_sell_unit_id_fk";
--> statement-breakpoint
DROP TABLE "product_sell_unit" CASCADE;--> statement-breakpoint
ALTER TABLE "line_item" DROP COLUMN "sell_unit_id";--> statement-breakpoint
ALTER TABLE "price_level_item" DROP COLUMN "sell_unit_id";--> statement-breakpoint

ALTER TABLE "price_level_item" ADD CONSTRAINT "price_level_product_unique" UNIQUE("price_level_id","product_id");
