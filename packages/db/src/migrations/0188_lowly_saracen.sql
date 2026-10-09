UPDATE "team"
SET
  "metadata" = "team"."metadata" || jsonb_build_object(
    'migration_0188_invalid_refs',
    coalesce("team"."metadata"->'migration_0188_invalid_refs', '{}'::jsonb) ||
      jsonb_build_object(
        'tax_rule_id',
        "team"."tax_rule_id",
        'captured_at',
        now()
      )
  ),
  "tax_rule_id" = null
WHERE "team"."tax_rule_id" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "tax_rule"
    WHERE "tax_rule"."id" = "team"."tax_rule_id"
  );--> statement-breakpoint
UPDATE "team"
SET
  "metadata" = "team"."metadata" || jsonb_build_object(
    'migration_0188_invalid_refs',
    coalesce("team"."metadata"->'migration_0188_invalid_refs', '{}'::jsonb) ||
      jsonb_build_object(
        'price_level_id',
        "team"."price_level_id",
        'captured_at',
        now()
      )
  ),
  "price_level_id" = null
WHERE "team"."price_level_id" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "price_level"
    WHERE "price_level"."id" = "team"."price_level_id"
  );--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_tax_rule_id_tax_rule_id_fk" FOREIGN KEY ("tax_rule_id") REFERENCES "public"."tax_rule"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_price_level_id_price_level_id_fk" FOREIGN KEY ("price_level_id") REFERENCES "public"."price_level"("id") ON DELETE set null ON UPDATE no action;
