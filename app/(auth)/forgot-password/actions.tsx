import { sendForgotPasswordEmail } from "@/services/users";
import { forgotPasswordSchema } from "@/app/(auth)/forgot-password/validations";

export async function forgotPassword(email: string) {
  const error = forgotPasswordSchema.safeParse({ email }).error;
  if (error) {
    return { error: error.message };
  }

  try {
    await sendForgotPasswordEmail(email);
  } catch (error) {
    if (error instanceof Error && error.message === "user-does-not-exists") {
      return { error: "Usuario no existe" };
    }
    console.log("Error enviando correo de forgot password", error);
    return { error: "Ocurrió un inconveniente, intente de nuevo" };
  }
}
