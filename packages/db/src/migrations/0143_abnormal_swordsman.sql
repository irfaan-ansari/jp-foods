ALTER TABLE "price_level_item" DROP CONSTRAINT "price_level_product_unique";--> statement-breakpoint
ALTER TABLE "price_level_item" ADD COLUMN "sell_unit_id" integer;--> statement-breakpoint
ALTER TABLE "price_level_item" ADD CONSTRAINT "price_level_item_sell_unit_id_product_sell_unit_id_fk" FOREIGN KEY ("sell_unit_id") REFERENCES "public"."product_sell_unit"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_level_item" ADD CONSTRAINT "price_level_product_unique" UNIQUE("price_level_id","product_id","sell_unit_id");