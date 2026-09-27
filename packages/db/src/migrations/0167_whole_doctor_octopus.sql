ALTER TABLE "line_item" RENAME COLUMN "base_quantity" TO "unit_label";--> statement-breakpoint
ALTER TABLE "line_item" RENAME COLUMN "unit_conversion" TO "uom";--> statement-breakpoint
ALTER TABLE "line_item" RENAME COLUMN "pricing_snapshot" TO "qty_per_unit";--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "catch_weight" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "calculated_price" text DEFAULT '0' NOT NULL;