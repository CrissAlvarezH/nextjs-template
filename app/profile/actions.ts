"use server";

import { setSession, validateRequest } from "@/lib/auth";
import {
  getUserById,
  getUserOAuthProvider,
  updateUserData,
  updateUserPassword,
  verifyUserPassword,
} from "@/services/users";
import { userDataFormSchema } from "@/app/profile/validations";
import { passwordSchema } from "@/app/(auth)/reset-password/validations";
import { IncorrectCredentialsError, UnauthorizedError } from "@/lib/errors";
import { authenticatedAction } from "@/lib/server-actions";
import { z } from "zod";

export const changeData = authenticatedAction
  .createServerAction()
  .input(userDataFormSchema.extend({ userId: z.number() }))
  .handler(async ({ input: { userId, full_name, phone }, ctx: { user } }) => {
    if (user.id !== userId) throw new UnauthorizedError();

    await updateUserData(userId, full_name, phone);
    await setSession(userId);
  });

export const changePassword = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      currentPassword: z.string(),
      newPassword: passwordSchema,
    }),
  )
  .handler(
    async ({
      input: { userId, currentPassword, newPassword },
      ctx: { user },
    }) => {
      if (user.id !== userId) throw new UnauthorizedError();

      if (await userRequireCurrentPasswordToChangeIt(userId)) {
        const userFromDB = await getUserById(user.id);
        const passwordIsCorrect = await verifyUserPassword(
          userFromDB?.password || "",
          currentPassword,
        );
        if (!passwordIsCorrect) throw new IncorrectCredentialsError();
      }

      await updateUserPassword(userId, newPassword);
    },
  );

export const userRequireCurrentPasswordToChangeIt = authenticatedAction
  .createServerAction()
  .input(z.number())
  .handler(async ({ input: userId, ctx: { user } }) => {
    // If user logged in with an oauth provider like google then he can set a password without
    // validate its current password because he doesn't have one, but after set one it will need
    // to validate his current password to be able to change it
    if (userId !== user.id) throw new UnauthorizedError();

    const oauthProvider = await getUserOAuthProvider(userId);
    if (!oauthProvider) return true;

    const userFromDB = await getUserById(userId);
    return userFromDB?.password !== "";
  });
