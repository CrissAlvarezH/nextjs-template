import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Debe ser un email valido"),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
