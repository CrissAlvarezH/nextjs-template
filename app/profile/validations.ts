import { z } from "zod";

export const userDataFormSchema = z.object({
  name: z
    .string()
    .min(2, "Minimo 2 caracteres")
    .max(200, "Maximo 200 caracteres")
    .trim()
    .includes(" ", { message: "Debe ser nombre completo" })
    .regex(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras y espacios"),
  phone: z
    .string()
    .min(10, "Minimo 10 caracteres")
    .max(15, "Maximo 14 caracteres"),
});

export const changePasswordFormSchema = z
  .object({
    current_password: z.string().min(1, "Campo requerido"),
    new_password: z.string().min(6, "Minimo 6 caracteres"),
    confirmation_password: z.string().min(1, "Campo requerido"),
  })
  .refine((data) => data.new_password === data.confirmation_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmation_password"],
  });

export const setPasswordFormSchema = z
  .object({
    new_password: z.string().min(6, "Minimo 6 caracteres"),
    confirmation_password: z.string().min(1, "Campo requerido"),
  })
  .refine((data) => data.new_password === data.confirmation_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmation_password"],
  });

export type UserDataFormSchemaType = z.infer<typeof userDataFormSchema>;
export type ChangePasswordFormSchemaType = z.infer<
  typeof changePasswordFormSchema
>;
export type SetPasswordFormSchemaType = z.infer<typeof setPasswordFormSchema>;
