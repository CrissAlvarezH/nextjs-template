import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const creditPackages = pgTable("credit_packages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  credits: integer("credits").notNull(),
  priceCents: integer("price_cents").notNull(),
  stripePriceId: varchar("stripe_price_id", { length: 200 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertCreditPackage = typeof creditPackages.$inferInsert;
export type SelectCreditPackage = typeof creditPackages.$inferSelect;

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  amount: integer("amount").notNull(),
  type: varchar("type", { enum: ["purchase", "usage", "refund"] }).notNull(),
  description: text("description").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 200 }),
  packageId: integer("package_id").references(() => creditPackages.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;
export type SelectCreditTransaction = typeof creditTransactions.$inferSelect;