import { sendForgotPasswordEmail } from "@/services/users";
import { forgotPasswordSchema } from "@/app/(auth)/forgot-password/validations";
import { unauthenticatedAction } from "@/lib/server-actions";

export const forgotPassword = unauthenticatedAction
  .createServerAction()
  .input(forgotPasswordSchema)
  .handler(async ({ input: { email } }) => {
    await sendForgotPasswordEmail(email);
  });
