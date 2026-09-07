ALTER TABLE "team" RENAME COLUMN "credit_days" TO "account_manager";--> statement-breakpoint
ALTER TABLE "team" RENAME COLUMN "is_credit_enabled" TO "credit_enabled";--> statement-breakpoint
ALTER TABLE "team" ALTER COLUMN "credit_limit" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "metadata" jsonb ;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "credit_used" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "status" text ;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_account_manager_user_id_fk" FOREIGN KEY ("account_manager") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "team_userId_idx" ON "team" USING btree ("account_manager");