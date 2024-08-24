"use server";
import {
  confirmationEmailCodeExists,
  getUserById,
  validateUserEmail,
} from "@/services/users";
import { InvalidLinkError } from "@/lib/errors";
import { unauthenticatedAction } from "@/lib/server-actions";
import { z } from "zod";

export const checkUserCodeAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number(), code: z.string() }))
  .handler(async ({ input: { userId, code } }) => {
    const user = await getUserById(userId);
    if (!user) throw new InvalidLinkError();

    if (user.is_email_validated) return;

    const isValid = await confirmationEmailCodeExists(userId, code, true);
    if (!isValid) throw new InvalidLinkError();

    await validateUserEmail(userId);
  });
