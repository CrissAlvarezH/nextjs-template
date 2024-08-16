"use server";
import {
  emailPasswordLoginSchema,
  EmailPasswordLoginSchemaType,
} from "@/app/(auth)/login/validations";
import {
  getUserByEmail,
  sendConfirmationEmail,
  verifyUserPassword,
} from "@/services/users";
import { lucia, setSession, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function emailPasswordLogin(data: EmailPasswordLoginSchemaType) {
  const error = emailPasswordLoginSchema.safeParse(data).error;
  if (error) return { error: error.message };

  const user = await getUserByEmail(data.email);
  if (!user) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return { error: "Credenciales incorrectas" };
  }

  if (!user.password || user.password === "")
    return { error: "Este usuario ingresó con otro metodo de autenticación" };

  const validPassword = await verifyUserPassword(user.password, data.password);
  if (!validPassword) return { error: "Credenciales incorrectas" };

  if (!user.is_email_validated) {
    // send again
    await sendConfirmationEmail(user.id);
    return {
      error: "El email aun no ha sido validado, revise su bandeja de entrada",
    };
  }

  await setSession(user.id);
  return redirect("/");
}

export async function logout() {
  const { session } = await validateRequest();
  if (!session) return { error: "No autorizado" };

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}
