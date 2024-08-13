"use server";
import { getUserByEmail, insertUser } from "@/services/users";
import { redirect } from "next/navigation";
import { SignupSchemaType } from "@/app/signup/validations";
import { hash } from "@node-rs/argon2";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function signup(data: SignupSchemaType) {
  const user = await getUserByEmail(data.email);
  if (user) {
    return { error: "El email ya esta siendo usado" };
  }
  const passwordHash = await hash(data.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = await insertUser({
    name: data.full_name,
    email: data.email,
    phone: data.phone,
    password: passwordHash,
  });
  if (userId === 0)
    return { error: "Error al guardar ususario en base de datos" };

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}
