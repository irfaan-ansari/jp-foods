UPDATE "job_applications"
SET "status" = 'under_verification'
WHERE "status" = 'verification_in_progress';--> statement-breakpoint
UPDATE "order"
SET "status" = 'placed'
WHERE "status" = 'in_progress';--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'placed';
