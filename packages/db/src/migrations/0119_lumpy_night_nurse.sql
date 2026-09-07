ALTER TABLE "team" ADD CONSTRAINT "team_sales_rep_id_user_id_fk" FOREIGN KEY ("sales_rep_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "team_sales_rep_idx" ON "team" USING btree ("sales_rep_id");--> statement-breakpoint
