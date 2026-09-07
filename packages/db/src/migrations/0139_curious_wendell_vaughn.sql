CREATE TABLE "product_sell_unit" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"unit" text DEFAULT '' NOT NULL,
	"inventory_per_unit" text DEFAULT '1' NOT NULL,
	"price" text DEFAULT '' NOT NULL,
	"min_quantity" text DEFAULT '1' NOT NULL,
	"order_increment" text DEFAULT '1' NOT NULL,
	"is_base_unit" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_sell_option_unique" UNIQUE("unit","product_id")
);
--> statement-breakpoint
ALTER TABLE "product_sell_unit" ADD CONSTRAINT "product_sell_unit_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_sell_option_productId_idx" ON "product_sell_unit" USING btree ("product_id");--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "inventory_unit";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "sell_units";