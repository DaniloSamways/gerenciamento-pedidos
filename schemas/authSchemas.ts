import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string(),
});
