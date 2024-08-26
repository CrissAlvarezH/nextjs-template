ALTER TABLE "users" ALTER COLUMN "picture" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "picture_hash" varchar;