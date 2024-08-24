import {
  updateUserPassword,
  confirmationEmailCodeExists,
  validateUserEmail,
} from "@/services/users";
import { InvalidLinkError } from "@/lib/errors";
import { unauthenticatedAction } from "@/lib/server-actions";
import { z } from "zod";

export const justValidateEmailVerificationCode = unauthenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number(), code: z.string() }))
  .handler(async ({ input: { userId, code } }) => {
    // validate without delete it
    return await confirmationEmailCodeExists(userId, code, false);
  });

export const resetPassword = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      newPassword: z.string().min(6, "Minimo 6 caracteres"),
      confirmationCode: z.string(),
    }),
  )
  .handler(async ({ input: { userId, newPassword, confirmationCode } }) => {
    const isValid = await confirmationEmailCodeExists(
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
  });
