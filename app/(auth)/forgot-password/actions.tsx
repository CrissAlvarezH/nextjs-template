import { sendForgotPasswordEmail } from "@/services/users";

export async function forgotPassword(email: string) {
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
