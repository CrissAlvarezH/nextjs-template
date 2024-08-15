"use server";

import { setSession, validateRequest } from "@/lib/auth";
import {
  getUserById,
  getUserOAuthProvider,
  updateUserData,
  updateUserPassword,
  verifyUserPassword,
} from "@/services/users";

export async function changeData(
  userId: number,
  fullName: string,
  phone: string,
) {
  const user = await validateRequest();
  if (!user.user) {
    return { error: "Usuario no autenticado" };
  }
  if (user.user.id !== userId) {
    return { error: "No tienes permiso para realizar esta acción" };
  }

  await updateUserData(userId, fullName, phone);
  await setSession(userId);
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
) {
  const user = await validateRequest();
  if (!user.user) {
    return { error: "Usuario no autenticado" };
  }
  if (user.user.id !== userId) {
    return { error: "No tienes permiso para realizar esta acción" };
  }

  if (await userRequireCurrentPasswordToChangeIt(userId)) {
    const userFromDB = await getUserById(user.user.id);
    const passwordIsCorrect = await verifyUserPassword(
      userFromDB?.password || "",
      currentPassword,
    );
    if (!passwordIsCorrect) return { error: "Contraseña incorrecta" };
  }

  await updateUserPassword(userId, newPassword);
}

export async function userRequireCurrentPasswordToChangeIt(userId: number) {
  // If user logged in with an oauth provider like google then he can set a password without
  // validate its current password because he doesn't have one, but after set one it will need
  // to validate his current password to be able to change it

  const oauthProvider = await getUserOAuthProvider(userId);
  if (!oauthProvider) return true;

  const user = await getUserById(userId);
  return user?.password !== "";
}
