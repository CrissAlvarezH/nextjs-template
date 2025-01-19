import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "@/db/schemas/users";

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
  banner: varchar("banner"),
  author: integer("author")
    .references(() => users.id)
    .notNull(),
});

export type SelectBlogPost = typeof blogPosts.$inferSelect;

export const blogPostComment = pgTable("blog_post_comments", {
  id: serial("id").primaryKey(),
  content: varchar("content").notNull(),
  post: integer("post").references(() => blogPosts.id).notNull(),
  date: timestamp("date").notNull(),
  author: integer("author").references(() => users.id).notNull(),
})

export type SelectBlogPostCommentType = typeof blogPostComment.$inferSelect
export type InsertBlogPostCommentType = typeof blogPostComment.$inferInsert
