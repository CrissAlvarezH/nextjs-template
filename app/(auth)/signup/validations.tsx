import { z } from "zod";

export const signupSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Minimo 2 caracteres")
      .max(200, "Maximo 200 caracteres")
      .trim()
      .includes(" ", { message: "Debe ser nombre completo" })
      .regex(
        /^[a-zA-Z\s]+$/,
        "El nombre solo puede contener letras y espacios",
      ),
    email: z.string().email("No es un email valido"),
    phone: z
      .string()
      .min(10, "Minimo 10 caracteres")
      .max(15, "Maximo 14 caracteres"),
    password: z
      .string()
      .min(6, "Minimo 6 caracteres")
      .max(200, "Maximo 200 caracteres"),
    confirmation_password: z
      .string()
      .min(6, "Minimo 6 caracteres")
      .max(200, "Maximo 200 caracteres"),
  })
  .refine((data) => data.password === data.confirmation_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmation_password"],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;
