import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 250 }).notNull(),
  email: varchar("email", { length: 250 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type SelectSession = typeof sessions.$inferSelect;
