import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { accounts, confirmationEmailCode, users } from "@/db/schemas";
import { InsertAccount, InsertUser } from "@/db/schemas/users";
import { DatabaseError, UserDoesNotExistsError } from "@/lib/errors";
import { hashPassword } from "@/services/users";

export async function getUserById(id: number) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({ where: eq(users.email, email) });
}

export async function getUserOAuthProvider(userId: number) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });
  if (!account) return null;
  return account.providerId;
}

export async function insertUser(user: InsertUser) {
  const res = await db.insert(users).values(user).returning();
  if (res.length === 0) throw new DatabaseError("Error in insertUser");
  return res[0];
}

export async function validateUserEmail(userId: number) {
  const user = await getUserById(userId);
  if (!user) throw new UserDoesNotExistsError();

  if (user.is_email_validated) return;
  await db
    .update(users)
    .set({ is_email_validated: true })
    .where(eq(users.id, userId));
}

export async function updateUserData(
  userId: number,
  fullName: string,
  phone: string,
) {
  await db
    .update(users)
    .set({ name: fullName, phone })
    .where(eq(users.id, userId));
}

export async function updateUserPicture(
  userId: number,
  picturePath: string,
  blurHash: string,
) {
  return db
    .update(users)
    .set({ picture: picturePath, pictureHash: blurHash })
    .where(eq(users.id, userId))
    .returning();
}

export async function updateUserPassword(userId: number, newPassword: string) {
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

export async function createGoogleAccount(values: InsertAccount) {
  await db.insert(accounts).values(values).onConflictDoNothing();
}

export async function getOrCreateConfirmationEmail(userId: number) {
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

export async function getEmailConfirmationCode(userId: number, code: string) {
  return db.query.confirmationEmailCode.findFirst({
    where: and(
      eq(confirmationEmailCode.userId, userId),
      eq(confirmationEmailCode.code, code),
    ),
  });
}

export async function deleteEmailConfirmationCode(
  userId: number,
  code: string,
) {
  await db
    .delete(confirmationEmailCode)
    .where(
      and(
        eq(confirmationEmailCode.userId, userId),
        eq(confirmationEmailCode.code, code),
      ),
    );
}
