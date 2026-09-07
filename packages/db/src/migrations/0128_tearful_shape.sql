ALTER TABLE "order" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "price_level" ALTER COLUMN "adjustment_value" DEFAULT ''  SET NOT NULL;--> statement-breakpoint
ALTER TABLE "price_level" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "country_code" text DEFAULT '+1' NOT NULL;