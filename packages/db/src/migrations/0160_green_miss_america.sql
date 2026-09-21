CREATE TABLE "message_campaign" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"channel" text DEFAULT 'sms' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"template_key" text,
	"message" text NOT NULL,
	"variables" jsonb DEFAULT '[]'::jsonb,
	"recipient_source" text DEFAULT 'mixed' NOT NULL,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"sent_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"skipped_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_by" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_recipient" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"organization_id" text NOT NULL,
	"source" text NOT NULL,
	"name" text,
	"phone_number" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"provider" text DEFAULT 'twilio' NOT NULL,
	"provider_message_id" text,
	"error_code" text,
	"error_message" text,
	"variables" jsonb DEFAULT '{}'::jsonb,
	"sent_at" timestamp,
	"failed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "message_campaign" ADD CONSTRAINT "message_campaign_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_campaign" ADD CONSTRAINT "message_campaign_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_recipient" ADD CONSTRAINT "message_recipient_campaign_id_message_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."message_campaign"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_recipient" ADD CONSTRAINT "message_recipient_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "message_campaign_organization_id_idx" ON "message_campaign" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "message_campaign_status_idx" ON "message_campaign" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_campaign_created_by_idx" ON "message_campaign" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "message_recipient_campaign_id_idx" ON "message_recipient" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "message_recipient_organization_id_idx" ON "message_recipient" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "message_recipient_status_idx" ON "message_recipient" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_recipient_phone_number_idx" ON "message_recipient" USING btree ("phone_number");