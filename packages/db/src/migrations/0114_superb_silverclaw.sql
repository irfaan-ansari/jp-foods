ALTER TABLE "catalog" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "catalog_view" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "message_recipients" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "messages" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "catalog" CASCADE;--> statement-breakpoint
DROP TABLE "catalog_view" CASCADE;--> statement-breakpoint
DROP TABLE "message_recipients" CASCADE;--> statement-breakpoint
DROP TABLE "messages" CASCADE;--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "account_type" TO "role";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "is_super_admin" TO "banned";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp;--> statement-breakpoint
