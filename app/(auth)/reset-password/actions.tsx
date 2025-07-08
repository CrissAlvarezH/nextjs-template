"use server";
import {
  confirmationEmailCodeExistsService,
  resetUserPasswordService,
} from "@/services/users";
import { unauthenticatedAction } from "@/lib/server-actions";
import { z } from "zod";

export const validateEmailVerificationCodeAction = unauthenticatedAction
  .inputSchema(z.object({ userId: z.number(), code: z.string() }))
  .action(async ({ parsedInput: { userId, code } }) => {
    // validate without delete it
    return await confirmationEmailCodeExistsService(userId, code, false);
  });

export const resetPasswordAction = unauthenticatedAction
  .inputSchema(
    z.object({
      userId: z.number(),
      newPassword: z.string().min(6, "Minimo 6 caracteres"),
      confirmationCode: z.string(),
    }),
  )
  .action(async ({ parsedInput: { userId, newPassword, confirmationCode } }) => {
    await resetUserPasswordService(userId, confirmationCode, newPassword);
  });
