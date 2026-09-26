ALTER TABLE "product" ADD COLUMN "selling_units" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
UPDATE "product" p
SET "selling_units" =
  CASE WHEN NULLIF(p."sell_unit", '') IS NOT NULL THEN
    jsonb_build_array(jsonb_build_object(
      'name', p."sell_unit", 'displayLabel', COALESCE(p."label", ''),
      'price', p."price", 'qtyPerUnit', COALESCE(p."unit_size", ''), 'isDefault', true
    )) ELSE '[]'::jsonb END
  || COALESCE((
    SELECT jsonb_agg(jsonb_build_object(
      'name', unit->>'name', 'displayLabel', COALESCE(unit->>'label', ''),
      'price', CASE WHEN p."average_weight" THEN unit->>'price'
        ELSE round((unit->>'price')::numeric / NULLIF((unit->>'unitConversion')::numeric, 0), 2)::text END,
      'qtyPerUnit', (NULLIF(p."unit_size", '')::numeric / NULLIF((unit->>'unitConversion')::numeric, 0))::text,
      'isDefault', (NULLIF(p."sell_unit", '') IS NULL AND ordinal = 1)
    ) ORDER BY ordinal)
    FROM jsonb_array_elements(COALESCE(p."sell_units", '[]'::jsonb)) WITH ORDINALITY AS splits(unit, ordinal)
  ), '[]'::jsonb);--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "sell_unit";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "unit_size";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "label";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "sell_units";