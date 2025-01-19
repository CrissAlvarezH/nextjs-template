CREATE TABLE IF NOT EXISTS "blog_post_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" varchar NOT NULL,
	"post" integer NOT NULL,
	"date" timestamp NOT NULL,
	"author" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blog_post_comments" ADD CONSTRAINT "blog_post_comments_post_blog_posts_id_fk" FOREIGN KEY ("post") REFERENCES "public"."blog_posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blog_post_comments" ADD CONSTRAINT "blog_post_comments_author_users_id_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
