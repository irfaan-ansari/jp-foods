ALTER TABLE "organization" ALTER COLUMN "metadata" SET DATA TYPE jsonb USING metadata::jsonb;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;