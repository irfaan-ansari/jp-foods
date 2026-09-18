ALTER TABLE "price_level_item"
ADD CONSTRAINT "price_level_product_unique"
UNIQUE ("price_level_id", "product_id");