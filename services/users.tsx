"use server";

import { GoogleUser } from "@/app/api/login/google/callback/route";
import { sendEmail } from "@/lib/emails";
import { VerifyEmail } from "@/emails/verify-email";
import { ResetPassword } from "@/emails/reset-password";
import { hash, verify } from "@node-rs/argon2";
import {
  EmailNotValidatedError,
  EmailTakenError,
  IncorrectAuthMethodError,
  IncorrectCredentialsError,
  InvalidLinkError,
  UserDoesNotExistsError,
} from "@/lib/errors";
import {
  createGoogleAccount,
  deleteEmailConfirmationCode,
  getEmailConfirmationCode,
  getOrCreateConfirmationEmail,
  getUserByEmail,
  getUserById,
  getUserOAuthProvider,
  insertUser,
  updateUserData,
  updateUserPassword,
  updateUserPicture,
  validateUserEmail,
} from "@/repositories/users";
import { lucia, setSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { InsertUser } from "@/db/schemas/users";
import { userRequireCurrentPasswordToChangeItAction } from "@/app/profile/actions";
import { v4 as uuidv4 } from "uuid";
import { uploadFileToBucket } from "@/lib/files";
import { generateThumbnailHash } from "@/lib/images";
import { redirect } from "next/navigation";

export async function emailAndPasswordLoginService(
  email: string,
  password: string,
) {
  const user = await getUserByEmail(email);
  if (!user) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    throw new IncorrectCredentialsError();
  }

  if (!user.password || user.password === "")
    throw new IncorrectAuthMethodError();

  const validPassword = await verifyUserPassword(user.password, password);
  if (!validPassword) throw new IncorrectCredentialsError();

  if (!user.is_email_validated) {
    // send again
    await sendConfirmationEmailService(user.id);
    throw new EmailNotValidatedError();
  }

  await setSession(user.id);
}

export async function logoutService(userId: number) {
  await lucia.invalidateUserSessions(userId);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function hashPassword(password: string) {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function confirmationEmailCodeExistsService(
  userId: number,
  code: string,
  deleteAfter: boolean,
) {
  const confirmationCode = getEmailConfirmationCode(userId, code);
  if (deleteAfter) await deleteEmailConfirmationCode(userId, code);
  return !!confirmationCode;
}
export async function verifyUserPassword(hashed: string, password: string) {
  return await verify(hashed, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function resetUserPasswordService(
  userId: number,
  confirmationCode: string,
  newPassword: string,
) {
  const isValid = await confirmationEmailCodeExistsService(
    userId,
    confirmationCode,
    true,
  );
  if (!isValid) throw new InvalidLinkError();

  await updateUserPassword(userId, newPassword);
  try {
    // just in case the user change his password before validate it, we mark as validated
    // because its email is validated to restore its password
    await validateUserEmail(userId);
  } catch (error) {}
}

export async function signupService(data: InsertUser) {
  const user = await getUserByEmail(data.email);
  if (user) throw new EmailTakenError();

  const createdUser = await insertUser({
    ...data,
    password: await hashPassword(data.password),
  });

  await sendConfirmationEmailService(createdUser.id);
}

export async function validateUserEmailService(userId: number, code: string) {
  const user = await getUserById(userId);
  if (!user) throw new InvalidLinkError();

  if (user.is_email_validated) return;

  const isValid = await confirmationEmailCodeExistsService(userId, code, true);
  if (!isValid) throw new InvalidLinkError();

  await validateUserEmail(userId);
}

export async function changeUserDataService(
  userId: number,
  name: string,
  phone: string,
) {
  await updateUserData(userId, name, phone);
  await setSession(userId);
}

export async function changeUserPasswordService(
  userId: number,
  currentPassword: string,
  newPassword: string,
) {
  if (await userRequireCurrentPasswordToChangeItAction(userId)) {
    const userFromDB = await getUserById(userId);
    const passwordIsCorrect = await verifyUserPassword(
      userFromDB?.password || "",
      currentPassword,
    );
    if (!passwordIsCorrect) throw new IncorrectCredentialsError();
  }

  await updateUserPassword(userId, newPassword);
}

export async function isOAuthUserAndPasswordEmptyService(userId: number) {
  // If user logged in with an oauth provider like google then he can set a password without
  // validate its current password because he doesn't have one, but after set one it will need
  // to validate his current password to be able to change it
  const oauthProvider = await getUserOAuthProvider(userId);
  if (!oauthProvider) return true;

  const userFromDB = await getUserById(userId);
  return userFromDB?.password !== "";
}

export async function createGoogleUserService(googleUser: GoogleUser) {
  let user = await getUserByEmail(googleUser.email);
  if (!user) {
    user = await insertUser({
      name: googleUser.name,
      email: googleUser.email,
      is_email_validated: true,
      password: "",
    });
  }

  await createGoogleAccount({
    providerId: "google",
    providerUserId: googleUser.sub,
    userId: user.id,
  });
  return user.id;
}

export async function uploadUserPictureImageService(
  userId: number,
  file: File,
) {
  const key = `users/${userId}/profile_${uuidv4()}`;

  await uploadFileToBucket(file.stream(), key);

  const thumbHash = await generateThumbnailHash(file);
  await updateUserPicture(userId, key, thumbHash);

  redirect("/profile");
}

export async function sendConfirmationEmailService(userId: number) {
  const user = await getUserById(userId);

  if (!user) throw new UserDoesNotExistsError();
  if (user.is_email_validated) return;

  const code = await getOrCreateConfirmationEmail(user.id);

  await sendEmail(
    user.email,
    "Confirma tu email para finalizar registro",
    <VerifyEmail userId={user.id} code={code} />,
  );
}

export async function sendForgotPasswordEmailService(email: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new UserDoesNotExistsError();
  const code = await getOrCreateConfirmationEmail(user.id);

  await sendEmail(
    user.email,
    "Restablecer contraseña",
    <ResetPassword userId={user.id} code={code} />,
  );
}
