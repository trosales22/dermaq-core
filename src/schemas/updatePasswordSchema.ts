import { z } from "zod";

export const updatePasswordSchema = z.object({
  old_password: z
    .string()
    .min(8, "Old password must be at least 8 characters")
    .max(16, "Old password must be less than 16 characters"),

  new_password: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(16, "New password must be less than 16 characters"),
});

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
