"use server";

import {
  changeUserDataService,
  changeUserPasswordService,
  isOAuthUserAndPasswordEmptyService,
  uploadUserPictureImageService,
} from "@/services/users";
import { userDataFormSchema } from "@/app/profile/validations";
import { passwordSchema } from "@/app/(auth)/reset-password/validations";
import { UnauthorizedError } from "@/lib/errors";
import { authenticatedAction } from "@/lib/server-actions";
import { z } from "zod";

export const changeDataAction = authenticatedAction
  .createServerAction()
  .input(userDataFormSchema.extend({ userId: z.number() }))
  .handler(async ({ input: { userId, name, phone }, ctx: { user } }) => {
    if (user.id !== userId) throw new UnauthorizedError();
    await changeUserDataService(userId, name, phone);
  });

export const changePasswordAction = authenticatedAction
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
      await changeUserPasswordService(userId, currentPassword, newPassword);
    },
  );

export const uploadProfileImageAction = authenticatedAction
  .createServerAction()
  .input(z.object({ fileWrapper: z.instanceof(FormData) }))
  .handler(async ({ input, ctx: { user } }) => {
    const file = input.fileWrapper.get("image") as File;
    await uploadUserPictureImageService(user.id, file);
  });

export const userRequireCurrentPasswordToChangeItAction = authenticatedAction
  .createServerAction()
  .input(z.number())
  .handler(async ({ input: userId, ctx: { user } }) => {
    if (userId !== user.id) throw new UnauthorizedError();
    return await isOAuthUserAndPasswordEmptyService(userId);
  });
