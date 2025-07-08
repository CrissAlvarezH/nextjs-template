"use server";
import { sendForgotPasswordEmailService } from "@/services/users";
import { forgotPasswordSchema } from "@/app/(auth)/forgot-password/validations";
import { unauthenticatedAction } from "@/lib/server-actions";

export const forgotPasswordAction = unauthenticatedAction
  .inputSchema(forgotPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    await sendForgotPasswordEmailService(email);
  });
