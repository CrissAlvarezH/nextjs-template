import { z } from "zod";

export const emailPasswordLoginSchema = z.object({
  email: z.string().email("Debe ser un email valido"),
  password: z.string().min(1, "Campo requerido"),
});

export type EmailPasswordLoginSchemaType = z.infer<
  typeof emailPasswordLoginSchema
>;
