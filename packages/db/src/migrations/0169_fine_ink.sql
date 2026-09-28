ALTER TABLE "order"
  ALTER COLUMN "delivery_date" SET DATA TYPE date
  USING "delivery_date"::date;