ALTER TABLE "blogs" RENAME TO "blog_posts";--> statement-breakpoint
ALTER TABLE "blog_posts" DROP CONSTRAINT "blogs_author_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_users_id_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
