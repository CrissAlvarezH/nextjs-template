CREATE TABLE IF NOT EXISTS "confirmation_email_codes" (
	"user_id" integer,
	"code" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_email_validated" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "confirmation_email_codes" ADD CONSTRAINT "confirmation_email_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
