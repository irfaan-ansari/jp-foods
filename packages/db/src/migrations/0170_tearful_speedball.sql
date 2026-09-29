CREATE TABLE "invoice" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"team_id" text,
	"order_id" integer,
	"number" text NOT NULL,
	"status" text DEFAULT 'issued' NOT NULL,
	"bill_to" jsonb,
	"ship_to" jsonb,
	"po" text,
	"due_date" date,
	"payment_terms" text,
	"charges" jsonb DEFAULT '[]'::jsonb,
	"tax" jsonb DEFAULT '{}'::jsonb,
	"subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"discount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"charges_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"amount_paid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"credit_applied" numeric(12, 2) DEFAULT '0' NOT NULL,
	"notes" text,
	"paid_at" timestamp,
	"voided_at" timestamp,
	"voided_by" text,
	"void_reason" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_line_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"order_line_item_id" integer,
	"product_id" integer,
	"item_code" text,
	"title" text NOT NULL,
	"unit_name" text DEFAULT '' NOT NULL,
	"unit_quantity" integer,
	"quantity" numeric(12, 3) NOT NULL,
	"price" numeric(12, 4) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"is_taxable" boolean DEFAULT false NOT NULL,
	"tax_rate" numeric(6, 4) DEFAULT '0' NOT NULL,
	"tax_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "invoice_status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_voided_by_user_id_fk" FOREIGN KEY ("voided_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_order_line_item_id_line_item_id_fk" FOREIGN KEY ("order_line_item_id") REFERENCES "public"."line_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "invoice_org_number_uq" ON "invoice" USING btree ("organization_id","number");--> statement-breakpoint
CREATE INDEX "invoice_orderId_idx" ON "invoice" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "invoice_teamId_idx" ON "invoice" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "invoice_status_dueDate_idx" ON "invoice" USING btree ("status","due_date");--> statement-breakpoint
CREATE INDEX "invoiceLineItem_invoiceId_idx" ON "invoice_line_item" USING btree ("invoice_id");--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "payment_status";--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "search_text";