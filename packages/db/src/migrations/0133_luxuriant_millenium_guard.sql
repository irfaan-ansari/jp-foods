ALTER TABLE "order" ADD COLUMN "cancelled_at" timestamp;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "cancelled_by" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "cancel_reason" timestamp;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_cancelled_id_user_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;