"use server";
import {
  getUserByEmail,
  hashPassword,
  insertUser,
  sendConfirmationEmail,
} from "@/services/users";
import { signupSchema } from "@/app/(auth)/signup/validations";
import { EmailTakenError } from "@/lib/errors";
import { unauthenticatedAction } from "@/lib/server-actions";

export const signupAction = unauthenticatedAction
  .createServerAction()
  .input(signupSchema)
  .handler(async ({ input: data }) => {
    const user = await getUserByEmail(data.email);
    if (user) throw new EmailTakenError();

    const userId = await insertUser({
      name: data.full_name,
      email: data.email,
      phone: data.phone,
      password: await hashPassword(data.password),
    });

    await sendConfirmationEmail(userId);
  });
