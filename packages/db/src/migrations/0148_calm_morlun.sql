CREATE TABLE "catalog" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization_id" text NOT NULL,
	"featured_product_ids" jsonb DEFAULT '[]'::jsonb,
	"pdf_url" text DEFAULT '' NOT NULL,
	"effective_from" timestamp NOT NULL,
	"effective_to" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalog" ADD CONSTRAINT "catalog_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "catalog_organizationId_idx" ON "catalog" USING btree ("organization_id");