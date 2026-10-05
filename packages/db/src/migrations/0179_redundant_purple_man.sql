ALTER TABLE "line_item" RENAME COLUMN "unit_name" TO "unit";--> statement-breakpoint
ALTER TABLE "line_item" RENAME COLUMN "unit_label" TO "display_label";--> statement-breakpoint
ALTER TABLE "line_item" RENAME COLUMN "uom" TO "stock_uom";--> statement-breakpoint
ALTER TABLE "line_item" RENAME COLUMN "qty_per_unit" TO "pack_size";--> statement-breakpoint
ALTER TABLE "line_item" RENAME COLUMN "calculated_price" TO "display_price";--> statement-breakpoint

ALTER TABLE "line_item" ADD COLUMN "pricing_basis" text DEFAULT 'fixed' NOT NULL;