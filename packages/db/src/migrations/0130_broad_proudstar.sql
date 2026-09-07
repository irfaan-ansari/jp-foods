ALTER TABLE "line_item" RENAME COLUMN "identifier" TO "item_code";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "tax" TO "tax_amount";--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "unit" text;--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "unit_size" text;