import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 250 }).notNull(),
  email: varchar("email", { length: 250 }).notNull(),
  is_email_validated: boolean("is_email_validated").default(false),
  phone: varchar("phone", { length: 15 }),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const confirmationEmailCode = pgTable("confirmation_email_codes", {
  userId: integer("user_id").references(() => users.id),
  code: varchar("code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertConfirmationEmailCode =
  typeof confirmationEmailCode.$inferInsert;
export type SelectConfirmationEmailCode =
  typeof confirmationEmailCode.$inferSelect;

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

export const accounts = pgTable(
  "accounts",
  {
    providerId: varchar("provider_id", { enum: ["google"] }),
    providerUserId: varchar("provider_user_id"),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  }),
);

export type SelectSession = typeof sessions.$inferSelect;
