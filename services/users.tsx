"use server";

import { db } from "@/db";
import {
  accounts,
  confirmationEmailCode,
  InsertUser,
  users,
} from "@/db/schemas/users";
import { and, eq } from "drizzle-orm";
import { GoogleUser } from "@/app/api/login/google/callback/route";
import { sendEmail } from "@/lib/emails";
import { VerifyEmail } from "@/emails/verify-email";
import { ResetPassword } from "@/emails/reset-password";
import { hash } from "@node-rs/argon2";

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

export async function hashPassword(password: string) {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function changePassword(userId: number, newPassword: string) {
  const hashed = await hashPassword(newPassword);
  await db.update(users).set({ password: hashed }).where(eq(users.id, userId));
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

async function getOrCreateConfirmationEmail(userId: number) {
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
  return confirmationCode.code;
}

export async function sendForgotPasswordEmail(email: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("user-does-not-exists");
  }
  const code = await getOrCreateConfirmationEmail(user.id);

  await sendEmail(
    user.email,
    "Restablecer contraseña",
    <ResetPassword userId={user.id} code={code} />,
  );
}

export async function sendConfirmationEmail(userId: number) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error(`User with id ${userId} does not exists`);
  }
  if (user.is_email_validated) return;

  const code = await getOrCreateConfirmationEmail(user.id);

  await sendEmail(
    user.email,
    "Confirma tu email para finalizar registro",
    <VerifyEmail userId={user.id} code={code} />,
  );
}

export async function validateEmailWithConfirmationCode(
  userId: number,
  code: string,
  deleteAfter: boolean,
) {
  const confirmationCode = await db.query.confirmationEmailCode.findFirst({
    where: and(
      eq(confirmationEmailCode.userId, userId),
      eq(confirmationEmailCode.code, code),
    ),
  });
  if (deleteAfter) {
    await db
      .delete(confirmationEmailCode)
      .where(
        and(
          eq(confirmationEmailCode.userId, userId),
          eq(confirmationEmailCode.code, code),
        ),
      );
  }

  return !!confirmationCode;
}

export async function validateUserEmail(userId: number, code: string) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("invalid-code");
  }

  if (user.is_email_validated) return;

  const isValid = await validateEmailWithConfirmationCode(userId, code, true);
  if (!isValid) {
    throw new Error("invalid-code");
  }

  await db
    .update(users)
    .set({ is_email_validated: true })
    .where(eq(users.id, userId));
}
