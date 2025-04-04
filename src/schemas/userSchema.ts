import { z } from "zod";

export const userSchema = z.object({
    username: z.string().nonempty("Username is required"),
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    firstname: z.string().nonempty("First name is required"),
    lastname: z.string().nonempty("Last name is required"),
    mobile: z
        .string()
        .regex(/^(639|09)\d{9}$/, "Invalid mobile number format. Use 639xxxxxxxxx or 09xxxxxxxxx")
        .transform((val) => val.replace(/^09/, "639"))
        .nullable()
        .optional(),
    photo_url: z.string().url("Invalid image URL").nullable().optional(),
    password: z.string().min(8, "Password must be at least 8 characters").max(16, "Password must be less than 16 characters").nullable().optional()
});

export type UserFormData = z.infer<typeof userSchema>;
