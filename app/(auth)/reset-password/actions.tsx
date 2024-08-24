"use server";
import {
  confirmationEmailCodeExistsService,
  resetUserPasswordService,
} from "@/services/users";
import { unauthenticatedAction } from "@/lib/server-actions";
import { z } from "zod";

export const validateEmailVerificationCodeAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number(), code: z.string() }))
  .handler(async ({ input: { userId, code } }) => {
    // validate without delete it
    return await confirmationEmailCodeExistsService(userId, code, false);
  });

export const resetPasswordAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      newPassword: z.string().min(6, "Minimo 6 caracteres"),
      confirmationCode: z.string(),
    }),
  )
  .handler(async ({ input: { userId, newPassword, confirmationCode } }) => {
    await resetUserPasswordService(userId, confirmationCode, newPassword);
  });
