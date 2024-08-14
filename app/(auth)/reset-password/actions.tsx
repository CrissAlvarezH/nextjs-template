import { changePassword, confirmationEmailCodeExists } from "@/services/users";

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

  await changePassword(userId, newPassword);
}
