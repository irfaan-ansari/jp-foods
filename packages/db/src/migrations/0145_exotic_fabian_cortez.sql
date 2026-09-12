ALTER TABLE "product_sell_unit" RENAME COLUMN "unit" TO "name";--> statement-breakpoint
ALTER TABLE "product_sell_unit" DROP CONSTRAINT "product_sell_option_unique";--> statement-breakpoint
ALTER TABLE "product_sell_unit" ADD CONSTRAINT "product_sell_option_unique" UNIQUE("name","product_id");