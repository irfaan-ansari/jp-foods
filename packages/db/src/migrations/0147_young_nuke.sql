ALTER TABLE "line_item" RENAME COLUMN "unit" TO "unit_name";--> statement-breakpoint
ALTER TABLE "line_item" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "line_item" DROP COLUMN "pack";--> statement-breakpoint
ALTER TABLE "line_item" DROP COLUMN "unit_size";