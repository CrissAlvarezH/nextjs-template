"use server";
import { validateUserEmail } from "@/services/users";

export async function checkEmailConfirmationCode(userId: number, code: string) {
  try {
    await validateUserEmail(userId, code);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "invalid-code")
      return { error: "El link de confirmación es invalido" };
    else {
      console.log("Error on validate user email", error);
      return {
        error:
          "Ocurrió un inconveniente activando tu cuenta, intenta de nuevo mas tarde",
      };
    }
  }
}
