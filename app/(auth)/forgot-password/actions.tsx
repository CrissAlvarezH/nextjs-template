"use server";
import { sendForgotPasswordEmailService } from "@/services/users";
import { forgotPasswordSchema } from "@/app/(auth)/forgot-password/validations";
import { unauthenticatedAction } from "@/lib/server-actions";

export const forgotPasswordAction = unauthenticatedAction
  .createServerAction()
  .input(forgotPasswordSchema)
  .handler(async ({ input: { email } }) => {
    await sendForgotPasswordEmailService(email);
  });
