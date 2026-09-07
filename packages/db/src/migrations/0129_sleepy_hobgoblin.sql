ALTER TABLE "product" RENAME COLUMN "pack_size" TO "unit_size";--> statement-breakpoint
ALTER TABLE "product" RENAME COLUMN "allow_backorder " TO "allow_backorder";--> statement-breakpoint

ALTER TABLE "user" ALTER COLUMN "phone_number" SET NOT NULL;