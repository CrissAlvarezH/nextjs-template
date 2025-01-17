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
