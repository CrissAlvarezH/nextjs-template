"use server";

import { db } from "@/db";
import { InsertUser, users } from "@/db/schemas/users";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({ where: eq(users.email, email) });
}

export async function insertUser(user: InsertUser) {
  const res = await db.insert(users).values(user).returning({ id: users.id });
  if (res.length > 0) return res[0].id;
  return 0;
}

export async function selectUsers() {
  return db.select().from(users);
}
