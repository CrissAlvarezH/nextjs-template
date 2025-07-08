"use server";
import { emailPasswordLoginSchema } from "@/app/(auth)/login/validations";
import { emailAndPasswordLoginService, logoutService } from "@/services/users";
import { redirect } from "next/navigation";
import {
  authenticatedAction,
  unauthenticatedAction,
} from "@/lib/server-actions";
import { z } from "zod";
import { validateRequest } from "@/lib/auth";

export const emailPasswordLoginAction = unauthenticatedAction
  .inputSchema(emailPasswordLoginSchema.extend({ callbackUrl: z.string().min(0) }))
  .action(async ({ parsedInput: data }) => {
    await emailAndPasswordLoginService(data.email, data.password);
    redirect(data.callbackUrl);
  });

export const logoutAction = authenticatedAction
  .action(async ({ ctx: { user } }) => {
    await logoutService(user.id);
    return redirect("/");
  });

export const isUserAlreadyLoggedInAction = unauthenticatedAction
  .action(async () => {
    const user = await validateRequest();
    return !!user.user;
  });
