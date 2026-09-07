ALTER TABLE "line_item" ADD COLUMN "sell_unit_id" integer;--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "inventory_quantity" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "line_item" ADD CONSTRAINT "line_item_sell_unit_id_product_sell_unit_id_fk" FOREIGN KEY ("sell_unit_id") REFERENCES "public"."product_sell_unit"("id") ON DELETE set null ON UPDATE no action;