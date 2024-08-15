import {
  updateUserPassword,
  confirmationEmailCodeExists,
  validateUserEmail,
} from "@/services/users";

export async function justValidateEmailVerificationCode(
  userId: number,
  code: string,
) {
  // validate without delete it
  return await confirmationEmailCodeExists(userId, code, false);
}

export async function resetPassword(
  userId: number,
  newPassword: string,
  confirmationCode: string,
) {
  const isValid = await confirmationEmailCodeExists(
    userId,
    confirmationCode,
    true,
  );
  if (!isValid) return { error: "Enlace invalido" };

  await updateUserPassword(userId, newPassword);
  try {
    // just in case the user change his password before validate it, we mark as validated
    // because its email is validated to restore its password
    await validateUserEmail(userId);
  } catch (error) {}
}
