"use server";
import { emailPasswordLoginSchema } from "@/app/(auth)/login/validations";
import { emailAndPasswordLoginService, logoutService } from "@/services/users";
import { redirect } from "next/navigation";
import {
  authenticatedAction,
  unauthenticatedAction,
} from "@/lib/server-actions";

export const emailPasswordLoginAction = unauthenticatedAction
  .createServerAction()
  .input(emailPasswordLoginSchema)
  .handler(async ({ input: data }) => {
    await emailAndPasswordLoginService(data.email, data.password);
    redirect("/");
  });

export const logoutAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    await logoutService(user.id);
    return redirect("/");
  });
