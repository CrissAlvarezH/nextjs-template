"use server";
import {
  getUserByEmail,
  hashPassword,
  insertUser,
  sendConfirmationEmail,
} from "@/services/users";
import { redirect } from "next/navigation";
import {
  signupSchema,
  SignupSchemaType,
} from "@/app/(auth)/signup/validations";
import { hash } from "@node-rs/argon2";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function signup(data: SignupSchemaType) {
  const error = signupSchema.safeParse(data).error;
  if (error) {
    return { error: error.message };
  }
  const user = await getUserByEmail(data.email);
  if (user) {
    return { error: "El email ya esta siendo usado" };
  }

  const userId = await insertUser({
    name: data.full_name,
    email: data.email,
    phone: data.phone,
    password: await hashPassword(data.password),
  });
  if (userId === 0)
    return { error: "Error al guardar ususario en base de datos" };

  try {
    await sendConfirmationEmail(userId);
  } catch (error) {
    console.log("Error on send confirmation email", error);
    return {
      error: "Ocurrió un inconveniente enviando el email, intente mas tarde",
    };
  }
}
