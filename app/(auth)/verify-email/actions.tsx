"use server";
import { validateUserEmailService } from "@/services/users";
import { unauthenticatedAction } from "@/lib/server-actions";
import { z } from "zod";

export const checkUserCodeAction = unauthenticatedAction
  .inputSchema(z.object({ userId: z.number(), code: z.string() }))
  .action(async ({ parsedInput: { userId, code } }) => {
    await validateUserEmailService(userId, code);
  });
