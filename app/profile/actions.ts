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
  .inputSchema(userDataFormSchema.extend({ userId: z.number() }))
  .action(async ({ parsedInput: { userId, name, phone }, ctx: { user } }) => {
    if (user.id !== userId) throw new UnauthorizedError();
    await changeUserDataService(userId, name, phone);
  });

export const changePasswordAction = authenticatedAction
  .inputSchema(
    z.object({
      userId: z.number(),
      currentPassword: z.string(),
      newPassword: passwordSchema,
    }),
  )
  .action(
    async ({
      parsedInput: { userId, currentPassword, newPassword },
      ctx: { user },
    }) => {
      if (user.id !== userId) throw new UnauthorizedError();
      await changeUserPasswordService(userId, currentPassword, newPassword);
    },
  );

export const uploadProfileImageAction = authenticatedAction
  .inputSchema(z.object({ fileWrapper: z.instanceof(FormData), hash: z.string() }))
  .action(async ({ parsedInput: { fileWrapper, hash }, ctx: { user } }) => {
    const file = fileWrapper.get("image") as File;
    await uploadUserPictureImageService(user.id, file, hash);
  });

export const userRequireCurrentPasswordToChangeItAction = authenticatedAction
  .inputSchema(z.number())
  .action(async ({ parsedInput: userId, ctx: { user } }) => {
    if (userId !== user.id) throw new UnauthorizedError();
    return await isOAuthUserAndPasswordEmptyService(userId);
  });
