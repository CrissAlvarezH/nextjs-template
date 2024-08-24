"use server";
import { validateUserEmailService } from "@/services/users";
import { unauthenticatedAction } from "@/lib/server-actions";
import { z } from "zod";

export const checkUserCodeAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number(), code: z.string() }))
  .handler(async ({ input: { userId, code } }) => {
    await validateUserEmailService(userId, code);
  });
