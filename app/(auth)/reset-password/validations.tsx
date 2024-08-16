import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Minimo 6 caracteres"),
    confirmation_password: z.string().min(1, "Campo requerido"),
  })
  .refine((data) => data.password === data.confirmation_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmation_password"],
  });

export const passwordSchema = z.string().min(6, "Minimo 6 caracteres");

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
