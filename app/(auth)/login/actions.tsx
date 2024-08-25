"use server";
import { emailPasswordLoginSchema } from "@/app/(auth)/login/validations";
import { emailAndPasswordLoginService, logoutService } from "@/services/users";
import { redirect } from "next/navigation";
import {
  authenticatedAction,
  unauthenticatedAction,
} from "@/lib/server-actions";
import { z } from "zod";

export const emailPasswordLoginAction = unauthenticatedAction
  .createServerAction()
  .input(emailPasswordLoginSchema.extend({ callbackUrl: z.string().min(0) }))
  .handler(async ({ input: data }) => {
    await emailAndPasswordLoginService(data.email, data.password);
    console.log("redirect", data.callbackUrl);
    redirect(data.callbackUrl);
  });

export const logoutAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    await logoutService(user.id);
    return redirect("/");
  });
