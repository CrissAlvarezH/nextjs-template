"use server";

import { db } from "@/db";
import {
  accounts,
  confirmationEmailCode,
  InsertUser,
  SelectConfirmationEmailCode,
  users,
} from "@/db/schemas/users";
import { and, eq } from "drizzle-orm";
import { GoogleUser } from "@/app/api/login/google/callback/route";
import { sendEmail } from "@/lib/emails";
import { VerifyEmail } from "@/emails/verify-email";

export async function getUserById(id: number) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({ where: eq(users.email, email) });
}

export async function insertUser(user: InsertUser) {
  const res = await db.insert(users).values(user).returning({ id: users.id });
  if (res.length > 0) return res[0].id;
  return 0;
}

export async function getAccountByGoogleId(googleUserId: string) {
  return db.query.accounts.findFirst({
    where: and(
      eq(accounts.providerId, "google"),
      eq(accounts.providerUserId, googleUserId),
    ),
  });
}

export async function createGoogleUser(googleUser: GoogleUser) {
  let user = await getUserByEmail(googleUser.email);
  if (!user) {
    // create user
    [user] = await db
      .insert(users)
      .values({ name: googleUser.name, email: googleUser.email })
      .returning();
  }

  // create google account
  await db
    .insert(accounts)
    .values({
      providerId: "google",
      providerUserId: googleUser.sub,
      userId: user.id,
    })
    .onConflictDoNothing();

  return user.id;
}

export async function sendConfirmationEmail(userId: number) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error(`User with id ${userId} does not exists`);
  }
  if (user.is_email_validated) return;

  let confirmationCode = await db.query.confirmationEmailCode.findFirst({
    where: eq(confirmationEmailCode.userId, userId),
  });

  if (!confirmationCode) {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    [confirmationCode] = await db
      .insert(confirmationEmailCode)
      .values({ userId, code })
      .returning();
  }

  await sendEmail(
    user.email,
    "Confirma tu email para finalizar registro",
    <VerifyEmail userId={user.id} code={confirmationCode.code} />,
  );
}

export async function validateUserEmail(userId: number, code: string) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("invalid-code");
  }

  if (user.is_email_validated) return;

  const confirmationCode = await db.query.confirmationEmailCode.findFirst({
    where: and(
      eq(confirmationEmailCode.userId, userId),
      eq(confirmationEmailCode.code, code),
    ),
  });

  if (!confirmationCode) {
    throw new Error("invalid-code");
  }

  await db
    .update(users)
    .set({ is_email_validated: true })
    .where(eq(users.id, userId));

  await db
    .delete(confirmationEmailCode)
    .where(
      and(
        eq(confirmationEmailCode.userId, userId),
        eq(confirmationEmailCode.code, code),
      ),
    );
}
