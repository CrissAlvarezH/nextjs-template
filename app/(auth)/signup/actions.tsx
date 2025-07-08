"use server";
import { signupService } from "@/services/users";
import { signupSchema } from "@/app/(auth)/signup/validations";
import { unauthenticatedAction } from "@/lib/server-actions";

export const signupAction = unauthenticatedAction
  .inputSchema(signupSchema)
  .action(async ({ parsedInput: data }) => {
    await signupService(data);
  });
