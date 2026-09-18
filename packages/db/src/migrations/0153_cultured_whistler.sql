ALTER TABLE "product" ALTER COLUMN "stock" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "unit" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "price" text DEFAULT '0' NOT NULL;