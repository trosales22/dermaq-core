import { z } from "zod";

export const loginSchema = z.object({
  user_id: z.string().nonempty("User ID is required"),
  password: z.string().nonempty("Password is required")
});

export type LoginData = z.infer<typeof loginSchema>;
