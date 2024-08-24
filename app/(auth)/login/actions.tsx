"use server";
import { emailPasswordLoginSchema } from "@/app/(auth)/login/validations";
import {
  getUserByEmail,
  sendConfirmationEmail,
  verifyUserPassword,
} from "@/services/users";
import { lucia, setSession, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  EmailNotValidatedError,
  IncorrectAuthMethodError,
  IncorrectCredentialsError,
} from "@/lib/errors";
import {
  authenticatedAction,
  unauthenticatedAction,
} from "@/lib/server-actions";

export const emailPasswordLogin = unauthenticatedAction
  .createServerAction()
  .input(emailPasswordLoginSchema)
  .handler(async ({ input: data }) => {
    const user = await getUserByEmail(data.email);
    if (!user) {
      // NOTE:
      // Returning immediately allows malicious actors to figure out valid usernames from response times,
      // allowing them to only focus on guessing passwords in brute-force attacks.
      // As a preventive measure, you may want to hash passwords even for invalid usernames.
      // However, valid usernames can be already be revealed with the signup page among other methods.
      // It will also be much more resource intensive.
      // Since protecting against this is non-trivial,
      // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
      // If usernames are public, you may outright tell the user that the username is invalid.
      throw new IncorrectCredentialsError();
    }

    if (!user.password || user.password === "")
      throw new IncorrectAuthMethodError();

    const validPassword = await verifyUserPassword(
      user.password,
      data.password,
    );
    if (!validPassword) throw new IncorrectCredentialsError();

    if (!user.is_email_validated) {
      // send again
      await sendConfirmationEmail(user.id);
      throw new EmailNotValidatedError();
    }

    await setSession(user.id);
    redirect("/");
  });

export const logout = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    await lucia.invalidateUserSessions(user.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  });
