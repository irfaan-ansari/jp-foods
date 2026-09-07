ALTER TABLE "product" RENAME COLUMN "identifier" TO "item_code";--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "products_organization_id_identifier_idx";--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "products_organization_id_item_code_idx" UNIQUE("organization_id","item_code");