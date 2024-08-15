"use server";
import {
  confirmationEmailCodeExists,
  getUserById,
  validateUserEmail,
} from "@/services/users";

export async function checkUserCode(userId: number, code: string) {
  const user = await getUserById(userId);
  if (!user) return { error: "Link invalido" };
  if (user.is_email_validated) return;

  const isValid = await confirmationEmailCodeExists(userId, code, true);
  if (!isValid) return { error: "Link invalido" };

  try {
    await validateUserEmail(userId);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "user-does-not-exists")
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
